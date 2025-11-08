import Input from "@/components/shared/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";

const AdditionalDetails = () => {
  return (
    <>
      {/* Section Title */}
      <h4 className="formHeading">Additional Details</h4>
      <div className="w-full flex flex-col">
        <Label>Are you a mother?</Label>
        <RadioGroup className={"flex gap-4 mt-3"} defaultValue="comfortable">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="default" id="r1" />
            <Label
              className="text-gray-700 font-normal cursor-pointer"
              htmlFor="r1"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label
              className="text-gray-700 font-normal cursor-pointer"
              htmlFor="r2"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label>What age of kids do you prefer working with?</Label>
        <div className="flex mt-3 gap-4">
          <div className="flex gap-2">
            <Checkbox id={0 - 3} />
            <Label
              className="text-gray-700 font-normal cursor-pointer"
              htmlFor={0 - 3}
            >
              0-3 years
            </Label>
          </div>
          <div className="flex gap-2">
            <Checkbox id={4 - 10} />
            <Label
              className="text-gray-700 font-normal cursor-pointer"
              htmlFor={4 - 10}
            >
              4-10 years
            </Label>
          </div>
          <div className="flex gap-2">
            <Checkbox id={11} />
            <Label
              className="text-gray-700 font-normal cursor-pointer"
              htmlFor={11}
            >
              11 years
            </Label>
          </div>
        </div>
      </div>
      <div>
        <Label>Are you okay handling pets?</Label>
        <RadioGroup className={"flex gap-4 mt-3"} defaultValue="comfortable">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="default" id="p1" />
            <Label
              className="text-gray-700 font-normal cursor-pointer"
              htmlFor="p1"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="comfortable" id="p2" />
            <Label
              className="text-gray-700 font-normal cursor-pointer"
              htmlFor="p2"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
};

export default AdditionalDetails;
