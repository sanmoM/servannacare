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
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setData((prev) => ({ ...prev, phone: value }));
  };

  const handleFileSelect = (file) => {
    setData((prev) => ({ ...prev, registrationDocument: file }));
  };

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

    const payload = {
      ...data,
      registrationDocument:
        data.registrationDocument || instituteData.registrationDocument,
    };

    console.log("Updated institute data:", payload);
    toast.success("Institution details updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="formHeading">Institution Details Update</h2>

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
        <Input
          label="Company Registration Number"
          name="companyRegistrationNumber"
          placeholder="Company registration number"
          value={data.companyRegistrationNumber}
          onChange={handleChange}
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="07xxxxxxxx"
          value={data.phone}
          maxLength={10}
          onChange={handlePhoneChange}
        />
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
        {user?.is_profile_completed && (
          <Button className="w-full sm:w-auto" size="lg" type="submit">
            Update
          </Button>
        )}
      </div>
    </form>
  );
};

export default UpdateBasicInfo;
