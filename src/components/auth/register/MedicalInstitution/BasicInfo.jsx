"use client";

import Input from "@/components/shared/Input";
import React, { useEffect, useState } from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";

const BasicInfo = ({ defaultValues = {}, onNext }) => {
  const [country, setCountry] = useState("KE");

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
    if (!data?.phone) {
      toast.error("Phone number is required!");
      return;
    }

    if (!isValidPhoneNumber(data?.phone)) {
      toast.error("Phone number is invalid or incomplete!");
      return;
    }


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

          <div>
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
