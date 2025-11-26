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
    // isNursingInKenya: defaultValues.isNursingInKenya || "",
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
    // if (!data.isNursingInKenya) {
    //   toast.error(" Answer the nursing council question!");
    //   return;
    // }
    onNext(data);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="formHeading">Education & Registration</h2>
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
            <RadioGroupItem value="Diploma In Nursing" id="d1" />
            <Label
              htmlFor="d1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Diploma In Nursing
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Degree In Nursing" id="d2" />
            <Label
              htmlFor="d2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Degree In Nursing
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="other" id="d3" />
            <Label
              htmlFor="d4"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Other
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* file upload  */}
      <div className="">
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

      {/* nursing council  */}
      {/* <div className="pt-6">
        <Label className="mb-3 block">
          Are you registered with the Nursing Council of Kenya?
        </Label>
        <RadioGroup
          className="flex gap-4 "
          value={data.isNursingInKenya}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, isNursingInKenya: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="d4" />
            <Label
              htmlFor="d4"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="d5" />
            <Label
              htmlFor="d5"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div> */}
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
