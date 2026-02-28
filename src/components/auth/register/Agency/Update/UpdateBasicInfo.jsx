"use client";

import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import FileUpload from "../../FileUpload";
import useLocalUser from "@/hooks/useLocalUser";
import { postApi } from "@/lib/apiHandler";
import { useRouter } from "next/navigation";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { useAuth } from "@/hooks/useAuth";

const UpdateBasicInfo = ({ agencyData }) => {
  const [country, setCountry] = useState("KE");
  const router = useRouter();
  const { user} = useAuth();
  const [data, setData] = useState({
    companyName: agencyData?.companyName || "",
    kraPin: agencyData?.kraPin || "",
    companyRegistrationNumber: agencyData?.companyRegistrationNumber || "",
    number: agencyData?.number || "",
    businessLocation: agencyData?.businessLocation || "",
    agency_services: agencyData?.agency_services || [],
    registrationDocument: agencyData?.registrationDocument || null,
    placementFee: agencyData?.placementFee || "",
    replacementWindow: agencyData?.replacementWindow || "",
    numberOfReplacement: agencyData?.numberOfReplacement || "",
  });

  const train = [
    "Cooking",
    "House Keeping",
    "First Aid",
    "Childcare",
    "Communication",
    "None",
  ];

  useEffect(() => {
    if (agencyData && Object.keys(agencyData).length > 0) {
      setData((prev) => ({ ...prev, ...agencyData }));
    }
  }, [agencyData]);

  // Handle Input Changes
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
      number: "+254" + digits,
    }));
  };

  // Handle Checkbox Toggle
  const toggleTraining = (item) => {
    setData((prev) => {
      const alreadySelected = prev.agency_services.includes(item);
      return {
        ...prev,
        agency_services: alreadySelected
          ? prev.agency_services.filter((t) => t !== item)
          : [...prev.agency_services, item],
      };
    });
  };

  // Handle File Upload
  const handleFileSelect = (file) => {
    setData((prev) => ({ ...prev, registrationDocument: file }));
  };

  // Validation + Submit
  const handleUpdate = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "companyName",
      "kraPin",
      "companyRegistrationNumber",
      "number",
      "businessLocation",
      "registrationDocument",
      "agency_services",
      "placementFee",
      "replacementWindow",
      "numberOfReplacement",
    ];

    for (let field of requiredFields) {
      if (
        !data[field] ||
        (Array.isArray(data[field]) && data[field].length === 0)
      ) {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        toast.error(`${formattedField} is required!`);
        return;
      }
    }

    if (!data?.number) {
      toast.error("Phone number is required!");
      return;
    }

    if (!isValidPhoneNumber(data?.number)) {
      toast.error("Phone number is invalid or incomplete!");
      return;
    }

    const fd = new FormData();

    fd.append("companyName", data?.companyName);
    fd.append("kraPin", data?.kraPin);
    fd.append("companyRegistrationNumber", data?.companyRegistrationNumber);
    fd.append("number", data?.number);
    fd.append("businessLocation", data?.businessLocation);
    data?.agency_services.forEach((ser) => fd.append("agency_services[]", ser));
    fd.append("placementFee", data?.placementFee);
    fd.append("replacementWindow", data?.replacementWindow);
    fd.append("numberOfReplacement", data?.numberOfReplacement);

    const documentKeys = ["registrationDocument"];

    documentKeys.forEach((key) => {
      const value = data[key];

      if (value instanceof File) {
        fd.append(key, value);
      } else if (typeof value === "string" && value !== "") {
        fd.append(key, value);
      }
    });

    try {
      const res = await postApi("/update-profile", fd);

      if (res?.status === 200) {
        toast.success("agency data Updated Successfully!");
        router.push("/dashboard");
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Upload failed. Check console.");
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      {/* Agency Details */}
      <div>
        <h2 className="formHeading">Agency Details update</h2>

        <div className="flex pt-6 flex-col sm:flex-row gap-6 sm:gap-4">
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

        <div className="flex flex-col py-6 sm:flex-row gap-6 sm:gap-4">
          <div className="flex-1">
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
                value={data?.number}
                onChange={(value) => {
                  setData((prev) => ({ ...prev, number: value || "" }));
                }}
                onCountryChange={(countryCode) => {
                  setCountry(countryCode);
                  const exampleNumber = countryCode
                    ? getExampleNumber(countryCode)
                    : null;
                  if (exampleNumber) {
                    setData((prev) => ({
                      ...prev,
                      number: `+${exampleNumber.countryCallingCode}`,
                    }));
                  } else {
                    setData((prev) => ({ ...prev, number: "" }));
                  }
                }}
              />
            </div>

            {data?.number && !isValidPhoneNumber(data?.number) && (
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

        <div className="mt-6">
          <FileUpload
            title="Company Registration Document"
            accept="application/pdf,image/*"
            icon={<FileText size={32} />}
            file={data.registrationDocument}
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>

      {/* Agency Services */}
      <div>
        <h2 className="formHeading">Agency Services</h2>

        <div className="py-6">
          <Label className="mb-3">What areas do you train on?</Label>
          <div className="flex gap-x-4 gap-y-2 flex-wrap items-center">
            {train.map((item, indx) => (
              <div key={indx} className="flex items-center gap-2">
                <Checkbox
                  id={`train-${indx}`}
                  checked={data.agency_services.includes(item)}
                  onCheckedChange={() => toggleTraining(item)}
                />
                <Label
                  htmlFor={`train-${indx}`}
                  className="text-gray-600 font-normal cursor-pointer"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex gap-6 sm:gap-4 mb-6 sm:flex-row flex-col">
            <Input
              type="number"
              placeholder="Placement fee"
              name="placementFee"
              label="Placement Fee (KSh)"
              value={data.placementFee}
              onChange={handleChange}
            />
            <Input
              type="number"
              placeholder="Replacement window"
              name="replacementWindow"
              label="Replacement Window (months)"
              value={data.replacementWindow}
              onChange={handleChange}
            />
          </div>

          <Input
            type="number"
            placeholder="Number of replacements offered"
            name="numberOfReplacement"
            label="Number of replacements"
            className="sm:w-1/2"
            value={data.numberOfReplacement}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        {user?.is_profile_completed && (
          <Button className="w-full sm:w-auto cursor-pointer" size="lg" type="submit">
            Update
          </Button>
        )}
      </div>
    </form>
  );
};

export default UpdateBasicInfo;
