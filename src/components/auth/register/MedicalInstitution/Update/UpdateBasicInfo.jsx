"use client";

import Input from "@/components/shared/Input";
import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";
import FileUpload from "../../FileUpload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useLocalUser from "@/hooks/useLocalUser";

const UpdateBasicInfo = ({ instituteData }) => {
  const { user, loaded } = useLocalUser();
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
        phone: instituteData.phone || "",
        registrationDocument: instituteData.registrationDocument || null,
      });
    }
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Phone handler (digits only, max 10)
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setData((prev) => ({ ...prev, phone: value }));
  };

  // File upload
  const handleFileSelect = (file) => {
    setData((prev) => ({ ...prev, registrationDocument: file }));
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "companyName",
      "kraPin",
      "companyRegistrationNumber",
      "businessLocation",
      "phone",
    ];

    for (let field of requiredFields) {
      if (!data[field]) {
        toast.error(`${field.replace(/([A-Z])/g, " $1")} is required!`);
        return;
      }
    }

    if (data.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    console.log("Updated institute data:", data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="formHeading">Institution Details Update</h2>

        {/*  GRID: company name + KRA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <Input
            type="text"
            label="Company/Business Name"
            name="companyName"
            placeholder="Company name"
            // value={data?.companyName}
            defaultValue={instituteData?.companyName}
            onChange={handleChange}
          />

          <Input
            label="KRA PIN Number"
            name="kraPin"
            placeholder="PIN number"
            defaultValue={instituteData?.kraPin}
            onChange={handleChange}
          />
        </div>

        {/*  GRID: registration number + phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
          <Input
            label="Company Registration Number"
            name="companyRegistrationNumber"
            placeholder="Company registration number"
            defaultValue={instituteData?.companyRegistrationNumber}
            onChange={handleChange}
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="07xxxxxxxx"
            defaultValue={instituteData?.number}
            maxLength={10}
            onChange={handlePhoneChange}
          />
        </div>

        {/*  Business location full width */}
        <Input
          label="Business Location"
          name="businessLocation"
          placeholder="Business location"
          defaultValue={instituteData?.businessLocation}
          onChange={handleChange}
        />

        <div className="mt-6">
          <FileUpload
            title="Company Registration Document"
            accept="application/pdf,image/*"
            icon={<FileText size={32} />}
            file={data.registrationDocument}
            onFileSelect={handleFileSelect}
          />

          {(data.registrationDocument ||
            instituteData?.registrationDocument) && (
            <div className="mt-3">
              {data.registrationDocument ? (
                // User has selected a new file
                data.registrationDocument.type.startsWith("image/") ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${instituteData?.registrationDocument}`}
                    alt={instituteData?.companyName}
                    height={30}
                    width={30}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-gray-700 mt-2 block">
                    Selected file: {data.registrationDocument.name}
                  </span>
                )
              ) : typeof instituteData.registrationDocument === "string" ? (
                // File from server
                instituteData.registrationDocument.match(
                  /\.(jpeg|jpg|gif|png|webp)$/i,
                ) ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${instituteData.registrationDocument}`}
                    alt="Current Registration Document"
                    className="w-48 h-auto border rounded-md mt-2"
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
      </div>
      <div className="flex justify-end">
        {user?.is_profile_completed && (
          <>
            <Button className={"w-full sm:w-auto"} size={"lg"}>
              Update
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default UpdateBasicInfo;
