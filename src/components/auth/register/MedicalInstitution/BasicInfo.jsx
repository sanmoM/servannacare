"use client";

import Input from "@/components/shared/Input";
import React, { useEffect, useState } from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const BasicInfo = ({ defaultValues = {}, onNext }) => {
  const [data, setData] = useState({
    companyName: defaultValues.companyName || "",
    kraPin: defaultValues.kraPin || "",
    companyRegistrationNumber: defaultValues.companyRegistrationNumber || "",
    businessLocation: defaultValues.businessLocation || "",
    phone: defaultValues.phone || "",
    registrationDocument: defaultValues.registrationDocument || null,
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // phone handler (digits only + max 10)
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 10);
    setData((prev) => ({ ...prev, phone: value }));
  };

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setData((prev) => ({ ...prev, ...defaultValues }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [defaultValues]);

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
      "phone", 
      "registrationDocument",
    ];

    for (let field of requiredFields) {
      if (!data[field]) {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        toast.error(`${formattedField} is required!`);
        return;
      }
    }

    // ✅ phone validation
    if (data.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    console.log(data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="formHeading">Institution Details</h2>

        {/*  GRID: company name + KRA */}
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

        {/*  GRID: registration number + phone */}
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

        {/*  Business location full width */}
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

      {/* Submit */}
      <div className="flex justify-end mt-6">
        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default BasicInfo;
