import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import toast from "react-hot-toast";

const SkillServices = ({ defaultValues = {}, onNext, onBack }) => {
  const [data, setData] = useState({
    skills: defaultValues.skills || [],
    // interested: defaultValues.interested || [],
    mobilityYears: defaultValues.mobilityYears || "",
    bathingYears: defaultValues.bathingYears || "",
    feedingYears: defaultValues.feedingYears || "",
    serviceFee: defaultValues.serviceFee || "",
  });

  const skills = [
    "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
    "Vital Signs Monitoring(checking blood pressure, blood sugar, pulse, temperature, etc.",
    "Compassion &  strong communication Skills",
    "Special needs caregiver (name which special need you have worked with e. g. autistic, deaf, blind ",
    "Elderly caregiving",
  ];

  // const interested = [
  //   "ELDERLY CARE",
  //   "DISABILITY SUPPORT",
  //   "PRE AND POST PREGNANCY SUPPORT",
  //   "POST SURGERY CARE",
  // ];

  // Toggle skill selection
  const toggleSkill = (skill) => {
    setData((prev) => {
      const alreadySelected = prev.skills.includes(skill);
      return {
        ...prev,
        skills: alreadySelected
          ? prev.skills.filter((s) => s !== skill)
          : [...prev.skills, skill],
      };
    });
  };

  // Toggle interested area checkbox
  // const toggleInterested = (area) => {
  //   setData((prev) => {
  //     const alreadySelected = prev.interested.includes(area);
  //     return {
  //       ...prev,
  //       interested: alreadySelected
  //         ? prev.interested.filter((a) => a !== area)
  //         : [...prev.interested, area],
  //     };
  //   });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dynamic validation
    const requiredFields = [
      "skills",
      // "interested",
      "mobilityYears",
      "bathingYears",
      "feedingYears",
      "serviceFee",
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
    <form onSubmit={handleSubmit}>
      <h2 className="formHeading">Skills & Services</h2>
      <div className="py-6">
        <Label className="mb-2  block">Do you have experience in : </Label>
        <div className="flex  flex-col gap-3">
          {skills.map((area, idx) => (
            <div key={idx} className="flex gap-2">
              <Checkbox
                id={area}
                checked={data.skills.includes(area)}
                onCheckedChange={() => toggleSkill(area)}
              />
              <Label
                htmlFor={area}
                className="text-gray-700 font-normal cursor-pointer"
              >
                {area}
              </Label>
            </div>
          ))}
        </div>
      </div>
      {/* <div>
        <Label className="mb-3  block">
          I am interested in working in the following intervention areas – tick
          the areas interested in :
        </Label>
        <div className="flex flex-col gap-3">
          {interested.map((i, indx) => (
            <div key={indx} className="flex items-center gap-2">
              <Checkbox
                id={i}
                checked={data.interested.includes(i)}
                onCheckedChange={() => toggleInterested(i)}
              />
              <Label
                htmlFor={i}
                className="text-gray-700 font-normal cursor-pointer"
              >
                {i}
              </Label>
            </div>
          ))}
        </div>
      </div> */}
      <div>
        <h2 className="formHeading mb-4 mt-6">Years Experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 space-y-6 sm:flex-row gap-6  sm:gap-4">
          <Input
            label="Mobility Assistance (Years)"
            type="number"
            name="mobilityYears"
            maxLength={2}
            placeholder="00"
            value={data.mobilityYears}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 2);
              handleChange({ target: { name: "mobilityYears", value: val } });
            }}
          />
          <Input
            label="Bathing Assistance (Years)"
            type="number"
            name="bathingYears"
             maxLength={2}
            placeholder="00"
            value={data.bathingYears}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 2);
              handleChange({ target: { name: "bathingYears", value: val } });
            }}
          />
          <Input
            label="Feeding Assistance (Years)"
            type="number"
            name="feedingYears"
                maxLength={2}
            placeholder="00"
            value={data.feedingYears}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 2);
              handleChange({ target: { name: "feedingYears", value: val } });
            }}
          />
        </div>
      </div>
      <div>
        <Input
          label="Service Fee (KSh per day/month)"
          type="text"
          name="serviceFee"
          placeholder="e.g., 1500 per day or 35000 per month"
          value={data.serviceFee}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 5);
            handleChange({ target: { name: "serviceFee", value: val } });
          }}
        />
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

export default SkillServices;
