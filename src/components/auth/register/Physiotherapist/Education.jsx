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
    education: defaultValues.education || "",
    isRegisterPCK: defaultValues.isRegisterPCK || null,
    registrationNumber: defaultValues.registrationNumber || "",
    practiceLicense: defaultValues.practiceLicense || null,
    eduCertificate: defaultValues.eduCertificate || null,
  });

  const handleFileSelect = (field, file) => {
    setData((prev) => ({ ...prev, [field]: file }));
  };

  // Handle PCK Yes/No
  const handlePCKChange = (value) => {
    if (value === "false") {
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

    if (!data.education) return toast.error("Education level is required!");
    if (!data.eduCertificate)
      return toast.error("Education certificate is required!");
    if (!data.isRegisterPCK)
      return toast.error("Answer the PCK registration question!");

    //  Validate only if Yes
    if (data.isRegisterPCK === "true") {
      if (!data.registrationNumber)
        return toast.error("Registration number required!");
      if (!data.practiceLicense)
        return toast.error("Practicing license is required!");
    }

    // Filter out unwanted fields if PCK = No
    const finalData = { ...data };
    if (data.isRegisterPCK === "false") {
      delete finalData.registrationNumber;
      delete finalData.practiceLicense;
    }

    console.log("Education data:", finalData);
    onNext(finalData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="formHeading">Education & Registration</h2>

      {/* Education Level */}
      <div className="py-6">
        <Label className="mb-3 block">Level of Education</Label>
        <RadioGroup
          className="flex gap-x-4 flex-wrap"
          value={data.education}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, education: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Diploma In Physiotherapy" id="d1" />
            <Label htmlFor="d1">Diploma In Physiotherapy</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Degree In Physiotherapy" id="d2" />
            <Label htmlFor="d2">Degree In Physiotherapy</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Education Certificate */}
      <FileUpload
        title="Education Certificate (Compulsory)"
        accept="application/pdf,image/*"
        icon={<FileText size={32} />}
        file={data.eduCertificate}
        onFileSelect={(file) => handleFileSelect("eduCertificate", file)}
      />

      {/* PCK Registration */}
      <div className="py-6">
        <Label className="mb-3 block">
          Are you registered with Physiotherapy Council of Kenya (PCK)?
        </Label>

        <RadioGroup
          className="flex gap-4"
          value={String(data.isRegisterPCK)}
          onValueChange={handlePCKChange}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="true" id="pckYes" />
            <Label htmlFor="pckYes">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="false" id="pckNo" />
            <Label htmlFor="pckNo">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Show only when PCK = Yes */}
      {data.isRegisterPCK === "true" && (
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

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
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
