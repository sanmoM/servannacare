"use client";

import Input from "@/components/shared/Input";
import React, { useState } from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const BasicInfo = ({defaultValues,onNext}) => {
    const [data, setData] = useState({
    companyName: defaultValues.companyName || "",
    kraPin: defaultValues.kraPin || "",
    companyRegistrationNumber: defaultValues.companyRegistrationNumber || "",
    businessLocation: defaultValues.businessLocation || "",
    registrationDocument: defaultValues.registrationDocument || null,
  });


  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };



  // Handle File Upload
  const handleFileSelect = (file) => {
    setData((prev) => ({ ...prev, registrationDocument: file }));
  };

  // Validation + Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "companyName",
      "kraPin",
      "companyRegistrationNumber",
      "businessLocation",
      "registrationDocument",
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

    console.log( data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Agency Details */}
      <div>
        <h2 className="formHeading">Institution Details</h2>

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
          <Input
            label="Company Registration Number"
            name="companyRegistrationNumber"
            placeholder="Company registration number"
            value={data.companyRegistrationNumber}
            onChange={handleChange}
          />
          <Input
            label="Business Location"
            name="businessLocation"
            placeholder="Business location"
            value={data.businessLocation}
            onChange={handleChange}
          />
        </div>

        <div>
          <FileUpload
            title="Company Registration Document"
            accept="application/pdf,image/*"
            icon={<FileText size={32} />}
            file={data.registrationDocument}
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>


      {/* Submit */}
      <div className="flex justify-end mt-6">
        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
}

export default BasicInfo
