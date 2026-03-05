"use client";

import Input from "@/components/shared/Input";
import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";
import FileUpload from "../../FileUpload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { postApi } from "@/lib/apiHandler";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";

const CreateBasicInfo = ({ instituteData }) => {
  const [country, setCountry] = useState("KE");
  const router = useRouter();
  const { user } = useAuth();

  const [data, setData] = useState({
    companyName: "",
    kraPin: "",
    companyRegistrationNumber: "",
    businessLocation: "",
    phone: "",
    registrationDocument: null,
  });

  useEffect(() => {
    if (instituteData) {
      setData({
        companyName: instituteData.companyName || "",
        kraPin: instituteData.kraPin || "",
        companyRegistrationNumber:
          instituteData.companyRegistrationNumber || "",
        businessLocation: instituteData.businessLocation || "",
        phone: instituteData.number || "",
        registrationDocument: null,
      });
    }
  }, [instituteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    if (!value.startsWith("+254")) {
      value = "+254";
    }

    let digits = value.slice(4).replace(/\D/g, "");

    if (digits.length > 9) digits = digits.slice(0, 9);

    setData((prev) => ({
      ...prev,
      phone: "+254" + digits,
    }));
  };

  const handleFileSelect = (file) => {
    setData((prev) => ({ ...prev, registrationDocument: file }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "companyName",
      "kraPin",
      "companyRegistrationNumber",
      "businessLocation",
      "phone",
      "registrationDocument",
    ];

    for (let field of requiredFields) {
      if (!data[field]) {
        toast.error(`${field.replace(/([A-Z])/g, " $1")} is required!`);
        return;
      }
    }

    if (!data?.phone) {
      toast.error("Phone number is required!");
      return;
    }

    if (!isValidPhoneNumber(data?.phone)) {
      toast.error("Phone number is invalid or incomplete!");
      return;
    }

    const fd = new FormData();

    fd.append("companyName", data.companyName);
    fd.append("kraPin", data.kraPin);
    fd.append("companyRegistrationNumber", data.companyRegistrationNumber);
    fd.append("businessLocation", data.businessLocation);
    fd.append("number", data.phone);

    if (data.registrationDocument instanceof File) {
      fd.append("registrationDocument", data.registrationDocument);
    }

    try {
      const res = await postApi("/create-profile", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.status === 200) {
        toast.success("Institutions Registered Successfully!");
        router.push(`/dashboard/${user?.role}-profile`);
        //todo this localStorage

        // localStorage.setItem(
        //   "user",
        //   JSON.stringify({
        //     ...user,
        //     is_profile_completed: Boolean(res?.data?.is_profile_completed),
        //     is_profile_verified: Boolean(res?.data?.is_profile_verified),
        //   }),
        // );
      } else {
        toast.error(
          res?.data?.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      toast.error("Error creating profile", error);

      if (error.response) {
        toast.error(
          error.response.data?.message || `Error: ${error.response.status}`,
        );
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-6">
      <h2 className="formHeading">Institution Details Create</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
        <Input
          type="text"
          label="Company/Business Name"
          name="companyName"
          placeholder="Company name"
          value={data.companyName}
          onChange={handleChange}
        />

        <Input
          label="KRA PIN Number"
          name="kraPin"
          placeholder="PIN number"
          value={data.kraPin}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
        <div>
          <Input
            label="Company Registration Number"
            name="companyRegistrationNumber"
            placeholder="Company registration number"
            value={data.companyRegistrationNumber}
            onChange={handleChange}
          />
        </div>

        <div className="flex-1">
          <Label>Phone Number</Label>

          <div className="w-full mt-2">
            <PhoneInputWithCountrySelect
              className="w-full border rounded-md px-3 py-2"
              international
              defaultCountry={country}
              value={data?.phone}
              onChange={(value) => {
                setData((prev) => ({ ...prev, phone: value || "" }));
              }}
              onCountryChange={(countryCode) => {
                setCountry(countryCode);
                const exampleNumber = countryCode
                  ? getExampleNumber(countryCode)
                  : null;
                if (exampleNumber) {
                  setData((prev) => ({
                    ...prev,
                    phone: `+${exampleNumber.countryCallingCode}`,
                  }));
                } else {
                  setData((prev) => ({ ...prev, phone: "" }));
                }
              }}
            />
          </div>

          {data?.phone && !isValidPhoneNumber(data?.phone) && (
            <p className="text-red-500 text-sm mt-1">
              Invalid phone number for selected country
            </p>
          )}
        </div>
      </div>

      <Input
        label="Business Location"
        name="businessLocation"
        placeholder="Business location"
        value={data.businessLocation}
        onChange={handleChange}
      />

      {/* File Upload */}
      <div className="mt-6">
        <FileUpload
          title="Company Registration Document"
          accept="application/pdf,image/*"
          icon={<FileText size={32} />}
          file={data.registrationDocument}
          onFileSelect={handleFileSelect}
        />

        {/* File Preview */}
        {(data.registrationDocument || instituteData?.registrationDocument) && (
          <div className="mt-3">
            {data.registrationDocument ? (
              // User selected a new file
              data.registrationDocument.type.startsWith("image/") ? (
                <Image
                  src={URL.createObjectURL(data.registrationDocument)}
                  alt={data.companyName}
                  height={100}
                  width={100}
                  className="object-cover"
                />
              ) : (
                <span className="text-gray-700 mt-2 block">
                  Selected file: {data.registrationDocument.name}
                </span>
              )
            ) : typeof instituteData.registrationDocument === "string" ? (
              // Existing file from server
              instituteData.registrationDocument.match(
                /\.(jpeg|jpg|gif|png|webp)$/i,
              ) ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${instituteData.registrationDocument}`}
                  alt={data.companyName}
                  height={100}
                  width={100}
                  className="object-cover"
                />
              ) : (
                <a
                  href={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${instituteData.registrationDocument}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Current Document
                </a>
              )
            ) : null}
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        {!user?.is_profile_completed && (
          <Button
            className="w-full sm:w-auto cursor-pointer"
            size="lg"
            type="submit"
          >
            Create
          </Button>
        )}
      </div>
    </form>
  );
};

export default CreateBasicInfo;
