import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Experience = ({ defaultValues, onNext, onBack }) => {
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

    onNext(data);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="formHeading">Experience</h2>
      <div className="py-6">
        <Label className="mb-3 block">Hospital Based Care</Label>
        <RadioGroup
          className="flex gap-x-4 flex-wrap "
          value={data.hospitalBasedCare}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, hospitalBasedCare: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="d1" />
            <Label
              htmlFor="d1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="d2" />
            <Label
              htmlFor="d2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex gap-6 sm:flex-row flex-col sm:gap-4">
        <Input
          type="number"
          name="hospitalBasedYearsOfExperience"
          placeholder="Years of experience"
          label="Years of Experience"
          value={data.hospitalBasedYearsOfExperience}
          onChange={handleChange}
        />
        <Input
          name="hospitalBasedReferenceContact"
          placeholder="Reference contact"
          label="Reference Contact"
          value={data.hospitalBasedReferenceContact}
          onChange={handleChange}
        />
      </div>

      <div className="mt-10">
        <Label className="mb-3 block">Home Based Care</Label>
        <RadioGroup
          className="flex gap-x-4 flex-wrap "
          value={data.homeBasedCare}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, homeBasedCare: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="d3" />
            <Label
              htmlFor="d3"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="d4" />
            <Label
              htmlFor="d4"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex gap-6 sm:flex-row flex-col mt-6 sm:gap-4">
        <Input
          type="number"
          name="homeBasedYearsOfExperience"
          placeholder="Years of experience"
          label="Years of Experience"
          value={data.homeBasedYearsOfExperience}
          onChange={handleChange}
        />
        <Input
          name="homeBasedReferenceContact"
          placeholder="Reference contact"
          label="Reference Contact"
          value={data.homeBasedReferenceContact}
          onChange={handleChange}
        />
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

export default Experience;
