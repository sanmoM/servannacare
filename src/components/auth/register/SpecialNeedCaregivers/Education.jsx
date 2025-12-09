"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Input from "@/components/shared/Input";

const Education = ({ defaultValues, onNext, onBack }) => {
  const [data, setData] = useState({
    educationLevel: defaultValues.educationLevel || "",
    isRegisterPCK: defaultValues.isRegisterPCK || "",
    registrationNumber: defaultValues.registrationNumber || "",
    practiceLicense: defaultValues.practiceLicense || null,
    educationCertificate: defaultValues.educationCertificate || null,
  });

  const handleFileSelect = (field, file) => {
    setData((prev) => ({ ...prev, [field]: file }));
  };

  // Handle PCK Yes/No
  const handlePCKChange = (value) => {
    if (value === "No") {
      setData((prev) => ({
        ...prev,
        isRegisterPCK: value,
        registrationNumber: undefined,
        practiceLicense: undefined,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        isRegisterPCK: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   if(!data.educationLevel)
    return toast.error("Select Education Level!");
   
   
   if(!data.educationCertificate)
    return toast.error("Select file")
    
    if (!data.isRegisterPCK)
      return toast.error("Answer the PCK registration question!");

    //  Validate only if Yes
    if (data.isRegisterPCK === "Yes") {
      if (!data.registrationNumber)
        return toast.error("Registration number required!");
      if (!data.practiceLicense)
        return toast.error("Practicing license is required!");
    }

    // Filter out unwanted fields if PCK = No
    const finalData = { ...data };
    if (data.isRegisterPCK === "No") {
      delete finalData.registrationNumber;
      delete finalData.practiceLicense;
    }

    console.log("Education data:", data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Title */}
      <h4 className="formHeading">Education & Registration</h4>

      {/* degree */}
      <div>
        <Label className="mb-3 block">Education Level</Label>
        <RadioGroup
          className="flex flex-col flex-wrap gap-2 mt-2"
          value={data.educationLevel}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, educationLevel: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value=" Degree In Special Needs Education (SNE)" id="edu1" />
            <Label htmlFor="edu1" className="text-gray-700 cursor-pointer">
              Degree In Special Needs Education (SNE)
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem
              value=" Degree In Early Childhood Development (ECD) with SNE units"
              id="edu2"
            />
            <Label htmlFor="edu2" className="text-gray-700 cursor-pointer">
              Degree In Early Childhood Development (ECD) with SNE units
            </Label>
          </div>

          <div className="flex items-center  gap-2">
            <RadioGroupItem value="Diploma In Special Needs Education (SNE)" id="edu3" />
            <Label htmlFor="edu3" className="text-gray-700 cursor-pointer">
             Diploma In Special Needs Education (SNE)
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="Diploma In Early Childhood Development (ECD) with SNE units"
              id="edu4"
            />
            <Label htmlFor="edu4" className="text-gray-700 cursor-pointer">
              Diploma In Early Childhood Development (ECD) with SNE units
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* diploma  */}
      {/* <div>
        <Label className="mb-3 block">Diploma In</Label>
        <RadioGroup
          className="flex flex-col flex-wrap gap-2 mt-2"
          value={data.diplomaIn}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, diplomaIn: value }))
          }
        >
          <div className="flex items-center  gap-2">
            <RadioGroupItem value="Special Needs Education (SNE)" id="edu3" />
            <Label htmlFor="edu3" className="text-gray-700 cursor-pointer">
              Special Needs Education (SNE)
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="Early Childhood Development (ECD) with SNE units"
              id="edu4"
            />
            <Label htmlFor="edu4" className="text-gray-700 cursor-pointer">
              Early Childhood Development (ECD) with SNE units
            </Label>
          </div>
        </RadioGroup>
      </div> */}

      {/* File Upload */}
      <div>
        <FileUpload
          title="Education Certificate (Compulsory)"
          accept="application/pdf,image/*"
          icon={<FileText size={32} />}
          optional=""
          file={data.educationCertificate}
          onFileSelect={(file) =>
            handleFileSelect("educationCertificate", file)
          }
        />
      </div>

      {/* PCK Registration */}
      <div className="py-6">
        <Label className="mb-3 block">
          Are you registered with Physiotherapy Council of Kenya (PCK)?
        </Label>

        <RadioGroup
          className="flex gap-4"
          value={data.isRegisterPCK}
          onValueChange={handlePCKChange}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="pckYes" />
            <Label htmlFor="pckYes">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="pckNo" />
            <Label htmlFor="pckNo">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Show only when PCK = Yes */}
      {data.isRegisterPCK === "Yes" && (
        <div>
          <Input
            label={"Registration Number"}
            placeholder="Registration Number"
            type="number"
            value={data.registrationNumber || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                registrationNumber: e.target.value,
              }))
            }
          />

          <div className="mt-6">
            <FileUpload
              title="Practising License"
              accept="application/pdf,image/*"
              icon={<FileText size={32} />}
              file={data.practiceLicense}
              onFileSelect={(file) =>
                setData((prev) => ({
                  ...prev,
                  practiceLicense: file,
                }))
              }
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" size="lg" variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default Education;
