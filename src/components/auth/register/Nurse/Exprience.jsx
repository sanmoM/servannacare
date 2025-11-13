import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Exprience = ({ defaultValues = {}, onNext, onBack }) => {
  const [data, setData] = useState({
    hospitalBasedCare: defaultValues.hospitalBasedCare || "",
    hospitalBasedYearsOfExperience:
      defaultValues.hospitalBasedYearsOfExperience || "",
    hospitalBasedReferenceContact:
      defaultValues.hospitalBasedReferenceContact || "",
    homeBasedCare: defaultValues.homeBasedCare || "",
    homeBasedYearsOfExperience: defaultValues.homeBasedYearsOfExperience || "",
    homeBasedReferenceContact: defaultValues.homeBasedReferenceContact || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dynamic validation
    const requiredFields = [
      "hospitalBasedCare",
      "hospitalBasedYearsOfExperience",
      "hospitalBasedReferenceContact",
      "homeBasedCare",
      "homeBasedYearsOfExperience",
      "homeBasedReferenceContact",
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

    console.log(data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="formHeading">Experience</h4>

      {/* Hospital Based Care */}
      <div>
        <Label className="mb-2 block">Hospital Based Care</Label>
        <RadioGroup
          className="flex gap-4 mt-2"
          value={data.hospitalBasedCare}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, hospitalBasedCare: value }))
          }
        >
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
            type={"number"}
            label="Years of experience"
            name="hospitalBasedYearsOfExperience"
            placeholder="Experience"
            value={data.hospitalBasedYearsOfExperience}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Reference contact"
            name="hospitalBasedReferenceContact"
            placeholder="Reference"
            value={data.hospitalBasedReferenceContact}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Home Based Care */}
      <div>
        <Label className="mb-2 block">Home Based Care</Label>
        <RadioGroup
          className="flex gap-4 mt-2"
          value={data.homeBasedCare}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, homeBasedCare: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="r3" />
            <Label
              htmlFor="r3"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="r4" />
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
            type={"number"}
            label="Years of experience"
            name="homeBasedYearsOfExperience"
            placeholder="Experience"
            value={data.homeBasedYearsOfExperience}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Reference contact"
            name="homeBasedReferenceContact"
            placeholder="Reference"
            value={data.homeBasedReferenceContact}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Navigation */}
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

export default Exprience;
