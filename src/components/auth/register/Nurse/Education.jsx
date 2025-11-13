"use client";

import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Education = ({ defaultValues, onNext, onBack }) => {
  const [data, setData] = useState({
    education: defaultValues.education || "",
    isNursingInKenya: defaultValues.isNursingInKenya || "",
    educationCertificate: defaultValues.educationCertificate || null,
  });


  const handleFileSelect = (field, file) => {
    setData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.education) {
      toast.error("Education level is require!");
      return;
    }
    if (!data.educationCertificate) {
      toast.error("Education certificate is require!");
      return;
    }
    if (!data.isNursingInKenya) {
      toast.error(" Answer the nursing council question!");
      return;
    }

    console.log("Education data:", data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Title */}
      <h4 className="formHeading">Education & Registration</h4>

      {/* Education Level */}
      <div>
        <Label className="mb-3 block">Level of Education</Label>
        <RadioGroup
          className="flex flex-wrap gap-4 mt-2"
          value={data.education}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, education: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="diploma in nursing" id="edu1" />
            <Label htmlFor="edu1" className="text-gray-700 cursor-pointer">
              Diploma in Nursing
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem value="degree in nursing" id="edu2" />
            <Label htmlFor="edu2" className="text-gray-700 cursor-pointer">
              Degree in Nursing
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem value="other" id="edu3" />
            <Label htmlFor="edu3" className="text-gray-700 cursor-pointer">
              Other
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* File Upload */}
      <div>
        <FileUpload
          title="Education Certificate (Compulsory)"
          accept="application/pdf,image/*"
          icon={<FileText size={32} />}
          optional=""
          file={data.educationCertificate}
          onFileSelect={(file) => handleFileSelect("educationCertificate", file)}
        />
      </div>

      {/* Nursing Council */}
      <div>
        <Label className="mb-3 block">
          Are you registered with the Nursing Council of Kenya?
        </Label>
        <RadioGroup
          className="flex gap-4 mt-2"
          value={data.isNursingInKenya}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, isNursingInKenya: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="kenya1" />
            <Label htmlFor="kenya1" className="text-gray-700 cursor-pointer">
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="kenya2" />
            <Label htmlFor="kenya2" className="text-gray-700 cursor-pointer">
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

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
