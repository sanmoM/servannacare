"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import toast from "react-hot-toast";

const SkillServices = ({ defaultValues = {}, onNext, onBack, skills }) => {
  console.log("skil service",skills)
  const [data, setData] = useState({
    skills: defaultValues.skills || [],
    mobilityYears: defaultValues.mobilityYears || "",
    bathingYears: defaultValues.bathingYears || "",
    feedingYears: defaultValues.feedingYears || "",
    serviceFee: defaultValues.serviceFee || "",
  });

  // const skills = [
  //   "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
  //   "Vital Signs Monitoring(checking blood pressure, blood sugar, pulse, temperature, etc.",
  //   "Medical Assistance: Aassisting nurses with wound care, administering medication (in some cases)",
  //   "Compassion & Communication Skills",
  //   "Special needs children caregiving",
  //   "Elderly caregiving",
  //   "Handiling Medical Quipment (e. g. fedding tubes, catheter, oxygen tanks)",
  // ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dynamic validation
    const requiredFields = [
      "skills",
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
      {/* Skills Section */}
      <div>
        <h2 className="formHeading mb-4">Skills & Services</h2>
        <div>
          <Label className="mb-2 mt-4 block">Do you have experience in :</Label>
          <div className="flex flex-col gap-3">
            {skills.map((area, idx) => (
              <div key={idx} className="flex gap-2">
                <Checkbox
                  id={area.id}
                  checked={data.skills.includes(area.name)}
                  onCheckedChange={() => toggleSkill(area.name)}
                />
                <Label
                  htmlFor={area.name}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  {area.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Experience */}
      <div>
        <h2 className="formHeading mb-4 mt-6">Years Experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Service Fee */}
      <div className="mt-4">
        <Input
          label="Service Fee (KSh per day/month)"
          type="number"
          name="serviceFee"
          maxLength={5}
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
