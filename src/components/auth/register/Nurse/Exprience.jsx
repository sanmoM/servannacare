import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import FileUpload from "../FileUpload";
import { FileText } from "lucide-react";

const Exprience = () => {
  return (
    <div className="space-y-6">
      {/* Section Title */}
      <h4  className="formHeading">Experience</h4>

      
      <div>
        <Label className="mb-2 block">Hospital Based Care</Label>
        <RadioGroup className="flex gap-4 mt-2" defaultValue="comfortable">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="r1" />
            <Label
              htmlFor="r1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="r2" />
            <Label
              htmlFor="r2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col mb-8 sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="number"
            label="Years of experience"
            name="years"
            placeholder="Exprience"
          />
        </div>
        <div className="flex-1">
          <Input
            label="Reference contact"
            name="ref1"
            placeholder="Referance"
          />
        </div>
      </div>



      <div>
        <Label className="mb-2 block">Home Based Care</Label>
        <RadioGroup className="flex gap-4 mt-2" defaultValue="comfortable">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes2" id="r3" />
            <Label
              htmlFor="r3"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no2" id="r4" />
            <Label
              htmlFor="r4"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="number"
            label="Years of experience"
            name="years2"
            placeholder="Exprience"
          />
        </div>
        <div className="flex-1">
          <Input
            label="Reference contact"
            name="ref2"
            placeholder="Referance"
          />
        </div>
      </div>

    </div>
  );
};

export default Exprience;
