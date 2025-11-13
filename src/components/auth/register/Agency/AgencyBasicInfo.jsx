"use client";

import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const AgencyBasicInfo = ({ defaultValues = {}, onNext }) => {
  const [data, setData] = useState({
    companyName: defaultValues.companyName || "",
    kraPin: defaultValues.kraPin || "",
    bankName: defaultValues.bankName || "",
    bankAccountName: defaultValues.bankAccountName || "",
    bankAccountNumber: defaultValues.bankAccountNumber || "",
    emergencyContactName: defaultValues.emergencyContactName || "",
    emergencyContactPhoneNumber:
      defaultValues.emergencyContactPhoneNumber || "",
    emergencyContactEmail: defaultValues.emergencyContactEmail || "",
    companyRegistrationNumber: defaultValues.companyRegistrationNumber || "",
    businessLocation: defaultValues.businessLocation || "",
    numberOfReplacement: defaultValues.numberOfReplacement || "",
    replacementWindow: defaultValues.replacementWindow || "",
    placementFee: defaultValues.placementFee || "",
    trainingAreas: defaultValues.trainingAreas || [],
    registrationDocument: defaultValues.registrationDocument || null,
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
      "bankName",
      "bankAccountName",
      "bankAccountNumber",
      "emergencyContactName",
      "emergencyContactPhoneNumber",
      "emergencyContactEmail",
      "companyRegistrationNumber",
      "businessLocation",
      "registrationDocument",
      "trainingAreas",
      "placementFee",
      "replacementWindow",
      "numberOfReplacement",
    ];

    for (let field of requiredFields) {
      if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        toast.error(`${formattedField} is required!`);
        return;
      }
    }

    console.log("Agency Data:", data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Agency Details */}
      <div>
        <h2 className="formHeading">Agency Details</h2>

        <div className="flex py-6 flex-col sm:flex-row gap-6 sm:gap-4">
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

        <div className="flex flex-col gap-6 sm:gap-4 sm:flex-row">
          <div className="flex-1 space-y-4">
            <div>
              <Label className="mb-2">Bank Details</Label>
              <Input
                name="bankName"
                placeholder="Your bank name"
                value={data.bankName}
                onChange={handleChange}
              />
            </div>
            <Input
              name="bankAccountName"
              placeholder="Your account name"
              value={data.bankAccountName}
              onChange={handleChange}
            />
            <Input
              name="bankAccountNumber"
              placeholder="Your account number"
              value={data.bankAccountNumber}
              onChange={handleChange}
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <Label className="mb-2">Emergency Contact Details</Label>
              <Input
                name="emergencyContactName"
                placeholder="Emergency contact name"
                value={data.emergencyContactName}
                onChange={handleChange}
              />
            </div>
            <Input
              name="emergencyContactPhoneNumber"
              placeholder="Emergency contact phone number"
              value={data.emergencyContactPhoneNumber}
              onChange={handleChange}
            />
            <Input
              type="email"
              name="emergencyContactEmail"
              placeholder="Emergency contact email"
              value={data.emergencyContactEmail}
              onChange={handleChange}
            />
          </div>
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

      {/* Submit */}
      <div className="flex justify-end mt-6">
        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default AgencyBasicInfo;
