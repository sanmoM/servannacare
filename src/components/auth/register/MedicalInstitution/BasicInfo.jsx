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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const BasicInfo = ({ defaultValues = {}, onNext }) => {
  const [country, setCountry] = useState("KE");

  const normalizeHireEquipment = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const s = String(val).toLowerCase();
    return s === "yes" || s === "true" || s === "1"
      ? "1"
      : s === "no" || s === "false" || s === "0"
      ? "0"
      : "";
  };

  const [data, setData] = useState({
    companyName: defaultValues.companyName || "",
    kraPin: defaultValues.kraPin || "",
    companyRegistrationNumber: defaultValues.companyRegistrationNumber || "",
    businessLocation: defaultValues.businessLocation || "",
    phone: defaultValues.phone || "",
    registrationDocument: defaultValues.registrationDocument || null,
    do_you_hire_medical_equipment: normalizeHireEquipment(
      defaultValues.do_you_hire_medical_equipment ??
      defaultValues.hire_equipment
    ),
  });

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
      setData((prev) => ({
        ...prev,
        ...defaultValues,
        do_you_hire_medical_equipment: normalizeHireEquipment(
          defaultValues.do_you_hire_medical_equipment ??
          defaultValues.hire_equipment
        ),
      }));
    }
  }, [defaultValues]);

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

    if (
      data.do_you_hire_medical_equipment === "" ||
      data.do_you_hire_medical_equipment === null ||
      data.do_you_hire_medical_equipment === undefined
    ) {
      toast.error("Please specify if you hire medical equipment!");
      return;
    }

    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="formHeading">Institution Details</h2>

   
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

  
        <Input
          label="Business Location"
          name="businessLocation"
          placeholder="Business location"
          value={data.businessLocation}
          onChange={handleChange}
        />

        <div className="pt-4">
          <Label className="mb-3 block font-medium text-gray-700">
            Do you hire medical equipment?
          </Label>
          <RadioGroup
            className="flex gap-6 mt-1"
            value={data.do_you_hire_medical_equipment || ""}
            onValueChange={(value) =>
              setData((prev) => ({
                ...prev,
                do_you_hire_medical_equipment: value,
              }))
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="1" id="hire_eq_yes" />
              <Label
                htmlFor="hire_eq_yes"
                className="text-gray-700 font-normal cursor-pointer"
              >
                YES
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="0" id="hire_eq_no" />
              <Label
                htmlFor="hire_eq_no"
                className="text-gray-700 font-normal cursor-pointer"
              >
                NO
              </Label>
            </div>
          </RadioGroup>
        </div>

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


      <div className="flex justify-end mt-6">
        <Button className="cursor-pointer" type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default BasicInfo;
