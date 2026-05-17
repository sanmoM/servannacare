"use client";

import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";

const AgencyBasicInfo = ({ defaultValues = {}, onNext }) => {
  const [country, setCountry] = useState("KE");

  const [data, setData] = useState({
    companyName: defaultValues.companyName || "",
    kraPin: defaultValues.kraPin || "",
    companyRegistrationNumber: defaultValues.companyRegistrationNumber || "",
    phone: defaultValues.phone || "",
    businessLocation: defaultValues.businessLocation || "",
    trainingAreas: defaultValues.trainingAreas || [],
    registrationDocument: defaultValues.registrationDocument || null,
    placementFee: defaultValues.placementFee || "",
    replacementWindow: defaultValues.replacementWindow || "",
    numberOfReplacement: defaultValues.numberOfReplacement || "",
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
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setData((prev) => ({ ...prev, ...defaultValues }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [defaultValues]);

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

  // Handle Checkbox Toggle
  const toggleTraining = (item) => {
    setData((prev) => {
      const alreadySelected = prev.trainingAreas.includes(item);
      return {
        ...prev,
        trainingAreas: alreadySelected
          ? prev.trainingAreas.filter((t) => t !== item)
          : [...prev.trainingAreas, item],
      };
    });
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
      "phone",
      "businessLocation",
      "registrationDocument",
      "trainingAreas",
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
    <form onSubmit={handleSubmit}>
      {/* Agency Details */}
      <div>
        <h2 className="formHeading">Agency Details</h2>

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

      
      <div>
        <h2 className="formHeading">Agency Services</h2>

        <div className="py-6">
          <Label className="mb-3">What areas do you train on?</Label>
          <div className="flex gap-x-4 gap-y-2 flex-wrap items-center">
            {train.map((item, indx) => (
              <div key={indx} className="flex items-center gap-2">
                <Checkbox
                className="cursor-pointer"
                  id={`train-${indx}`}
                  checked={data.trainingAreas.includes(item)}
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

    
      <div className=" flex justify-end mt-6">
        <Button className="cursor-pointer" type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default AgencyBasicInfo;
