import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Exprience = ({ defaultValues = {}, onNext, onBack }) => {
  const [data, setData] = useState({
    hospitalBasedCare: defaultValues.hospitalBasedCare || null,
    hospitalBasedYearsOfExperience:
      defaultValues.hospitalBasedYearsOfExperience || "",
    hospitalBasedReferenceContact:
      defaultValues.hospitalBasedReferenceContact || "",
    homeBasedCare: defaultValues.homeBasedCare || null,
    homeBasedYearsOfExperience: defaultValues.homeBasedYearsOfExperience || "",
    homeBasedReferenceContact: defaultValues.homeBasedReferenceContact || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["hospitalBasedCare", "homeBasedCare"];

    for (let field of requiredFields) {
      if (!data[field] === null) {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());

        toast.error(`${formattedField} is required!`);
        return;
      }
    }

    if (
      data.hospitalBasedCare === "true" &&
      (!data.hospitalBasedYearsOfExperience ||
        !data.hospitalBasedReferenceContact)
    ) {
      toast.error("Please fill all Hospital Based Care fields!");
      return;
    }
    if (
      data.homeBasedCare === "true" &&
      (!data.homeBasedYearsOfExperience || !data.homeBasedReferenceContact)
    ) {
      toast.error("Please fill all Hospital Based Care fields!");
      return;
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
          value={String(data.hospitalBasedCare)}
          onValueChange={(value) =>
            setData((prev) => ({
              ...prev,
              hospitalBasedCare: value === "true",
            }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="true" id="r1" />
            <Label
              htmlFor="r1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="false" id="r2" />
            <Label
              htmlFor="r2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {data.hospitalBasedCare && (
        <div className="flex flex-col mb-8 sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="number"
              label="Years of experience"
              name="hospitalBasedYearsOfExperience"
              placeholder="Hospital based experience"
              maxLength={2}
              value={data.hospitalBasedYearsOfExperience}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange({
                  target: {
                    name: "hospitalBasedYearsOfExperience",
                    value: val,
                  },
                });
              }}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Reference contact"
              name="hospitalBasedReferenceContact"
              placeholder="Hospital based ref"
              value={data.hospitalBasedReferenceContact}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {/* Home Based Care */}
      <div>
        <Label className="mb-2 block">Home Based Care</Label>
        <RadioGroup
          className="flex gap-4 mt-2"
          value={String(data.homeBasedCare)}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, homeBasedCare: value === "true" }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="true" id="r3" />
            <Label
              htmlFor="r3"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="false" id="r4" />
            <Label
              htmlFor="r4"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {data.homeBasedCare && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type={"number"}
              label="Years of experience"
              name="homeBasedYearsOfExperience"
              placeholder="Home based experience"
              maxLength={2}
              value={data.homeBasedYearsOfExperience}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange({
                  target: { name: "homeBasedYearsOfExperience", value: val },
                });
              }}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Reference contact"
              name="homeBasedReferenceContact"
              placeholder="Home based ref"
              value={data.homeBasedReferenceContact}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

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
