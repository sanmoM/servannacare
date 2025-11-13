"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import toast from "react-hot-toast";

const SkillServices = ({ defaultValues = {}, onNext, onBack }) => {
  const [data, setData] = useState({
    skills: defaultValues.skills || [],
    interested: defaultValues.interested || [],
    mobilityYears: defaultValues.mobilityYears || "",
    bathingYears: defaultValues.bathingYears || "",
    feedingYears: defaultValues.feedingYears || "",
    serviceFee: defaultValues.serviceFee || "",
  });

  const skills = [
    "Basic Patient Care (Bathing, dressing, feeding, mobility)",
    "Vital Signs Monitoring",
    "Medical Assistance",
    "Communication Skills",
    "Special Needs Children Caregiving",
    "Elderly Caregiving",
    "Infection Control & Hygiene Maintenance",
    "Handling Medical Equipment",
  ];

  const interestedAreas = [
    "ELDERLY CARE",
    "DISABILITY SUPPORT",
    "PRE AND POST PREGNANCY SUPPORT",
    "POST SURGERY CARE",
  ];

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
  const toggleInterested = (area) => {
    setData((prev) => {
      const alreadySelected = prev.interested.includes(area);
      return {
        ...prev,
        interested: alreadySelected
          ? prev.interested.filter((a) => a !== area)
          : [...prev.interested, area],
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
      "interested",
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
          <Label className="mb-2 block">Do you have experience in:</Label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => {
              const selected = data.skills.includes(skill);
              return (
                <span
                  key={index}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 text-xs rounded-full cursor-pointer transition-all ${
                    selected
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                  }`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Interested Areas */}
        <div>
          <Label className="mb-2 mt-4 block">
            I am interested in working in the following intervention areas –
            tick the areas you are interested in:
          </Label>
          <div className="flex flex-col gap-3">
            {interestedAreas.map((area, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox
                  id={area}
                  checked={data.interested.includes(area)}
                  onCheckedChange={() => toggleInterested(area)}
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
      </div>

      {/* Additional Experience */}
      <div>
        <h2 className="formHeading mb-4 mt-6">Additional Experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Mobility Assistance (Years)"
            type="number"
            name="mobilityYears"
            value={data.mobilityYears}
            onChange={handleChange}
          />
          <Input
            label="Bathing Assistance (Years)"
            type="number"
            name="bathingYears"
            value={data.bathingYears}
            onChange={handleChange}
          />
          <Input
            label="Feeding Assistance (Years)"
            type="number"
            name="feedingYears"
            value={data.feedingYears}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Service Fee */}
      <div className="mt-4">
        <Input
          label="Service Fee (KSh per day/month)"
          type="text"
          name="serviceFee"
          placeholder="e.g., 1500 per day or 35000 per month"
          value={data.serviceFee}
          onChange={handleChange}
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
