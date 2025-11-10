import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";

const Education = () => {
  return (
    <div>
      <h2 className="formHeading">Education & Registration</h2>
      <div className="py-6">
        <Label className="mb-3 block">Level of Education</Label>
        <RadioGroup className="flex gap-x-4 flex-wrap " defaultValue="comfortable">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="diploma" id="d1" />
            <Label
              htmlFor="d1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Diploma in Nursing
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="degree" id="d2" />
            <Label
              htmlFor="d2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Degree in Nursing
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
      <div className="">
        <FileUpload
          title="Education Certificate (Compulsory)"
          accept="application/pdf,image/*"
          icon={<FileText size={32} />}
          optional=""
        />
      </div>

      <div className="pt-6">
        <Label className="mb-3 block">Are you registered with the Nursing Council of Kenya?</Label>
        <RadioGroup className="flex gap-4 " defaultValue="comfortable">
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
      </div>
    </div>
  );
};

export default Education;
