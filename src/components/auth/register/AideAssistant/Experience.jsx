import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
    preferred: defaultValues.preferred || [],
  });

  const preferred = [
    {
      title: "Pre and post pregnancy care",
    },
    {
      title: "Post surgery cage",
    },
    {
      title: "Elderly care",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const togglepreferred = (pref) => {
    setData((prev) => {
      const alreadySelected = prev.preferred.includes(pref);
      return {
        ...prev,
        preferred: alreadySelected
          ? prev.preferred.filter((l) => l !== pref)
          : [...prev.preferred, pref],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dynamic validation
    const requiredFields = [
      "hospitalBasedCare",
      // "hospitalBasedYearsOfExperience",
      // "hospitalBasedReferenceContact",
      "homeBasedCare",
      // "homeBasedYearsOfExperience",
      // "homeBasedReferenceContact",
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

    if (
      data.hospitalBasedCare === "Yes" &&
      (!data.hospitalBasedYearsOfExperience ||
        !data.hospitalBasedReferenceContact)
    ) {
      toast.error("Please fill all Hospital Based Care fields!");
      return;
    }

    if (
      data.homeBasedCare === "Yes" &&
      (!data.homeBasedYearsOfExperience || !data.homeBasedReferenceContact)
    ) {
      toast.error("Please fill all Home Based Care fields!");
      return;
    }

    if (data.preferred.length === 0) {
      toast.error("Please select what you preferred");
      return;
    }

    console.log(data);

    onNext(data);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="formHeading">Experience</h2>
      <div className="pt-6">
        <Label className="mb-3 block">Hospital Based Care</Label>
        <RadioGroup
          className="flex gap-x-4 flex-wrap "
          value={data.hospitalBasedCare}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, hospitalBasedCare: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="d1" />
            <Label
              htmlFor="d1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="d2" />
            <Label
              htmlFor="d2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
      {data.hospitalBasedCare === "Yes" && (
        <div className="flex gap-6 sm:flex-row my-6 flex-col sm:gap-4">
          <Input
            type="number"
            name="hospitalBasedYearsOfExperience"
            placeholder="Years of experience"
            label="Years of Experience"
            maxLength={2}
            value={data.hospitalBasedYearsOfExperience}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 2);
              handleChange({
                target: { name: "hospitalBasedYearsOfExperience", value: val },
              });
            }}
          />
          <Input
            name="hospitalBasedReferenceContact"
            placeholder="Reference contact"
            label="Reference Contact"
            value={data.hospitalBasedReferenceContact}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="">
        <Label className="mb-3 mt-6 block">Home Based Care</Label>
        <RadioGroup
          className="flex gap-x-4 flex-wrap "
          value={data.homeBasedCare}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, homeBasedCare: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="d3" />
            <Label
              htmlFor="d3"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="d4" />
            <Label
              htmlFor="d4"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
      {data.homeBasedCare === "Yes" && (
        <div className="flex gap-6 sm:flex-row flex-col my-6  sm:gap-4">
          <Input
            type="number"
            name="homeBasedYearsOfExperience"
            placeholder="Years of experience"
            label="Years of Experience"
            maxLength={2}
            value={data.homeBasedYearsOfExperience}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 2);
              handleChange({
                target: { name: "homeBasedYearsOfExperience", value: val },
              });
            }}
          />
          <Input
            name="homeBasedReferenceContact"
            placeholder="Reference contact"
            label="Reference Contact"
            value={data.homeBasedReferenceContact}
            onChange={handleChange}
          />
        </div>
      )}

      <div>
        <Label className={"mb-3 mt-6"}>
          What are your preferred areas of intervention
        </Label>
        <div className="flex flex-wrap flex-col gap-2 ">
          {preferred.map((lan, indx) => (
            <div key={indx} className="flex items-center gap-2">
              <Checkbox
                id={lan.title}
                checked={data.preferred.includes(lan.title)}
                onCheckedChange={() => togglepreferred(lan.title)}
              />
              <Label
                htmlFor={lan.title}
                className="text-gray-700 font-normal cursor-pointer"
              >
                {lan.title}
              </Label>
            </div>
          ))}
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

export default Experience;
