import Input from "@/components/shared/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

const SkillServices = () => {
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

  const interested = [
    "1. ELDERLY CARE",
    " 2. DISABILITY SUPPORT",
    "3. PRE AND POST PREGNANCY SUPPORT",
    "4. POST SURGERY CARE",
  ];
  return (
    <div>
      <h2 className="formHeading">Skills & Services</h2>
      <div className="py-6">
        <Label className="mb-2  block">Do you have experience in : </Label>
        <div className="flex  flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`px-5 cursor-pointer py-2 rounded-full text-xs ${
                index === 0
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-900"
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div>
        <Label className="mb-3  block">
          I am interested in working in the following intervention areas – tick
          the areas interested in{" "}
        </Label>
        <div className="flex flex-col gap-3">
          {interested.map((i, indx) => (
            <div key={indx} className="flex items-center gap-2">
              <Checkbox id={i} />
              <Label
                htmlFor={i}
                className="text-gray-700 font-normal cursor-pointer"
              >
                {i}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="formHeading ">Additional Experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:flex-row gap-6 py-6 sm:gap-4">
          <Input
            label="Mobility Assistance (Years)"
            type="number"
            name="mobile"
          />
          <Input
            label="Bathing Assistance (Years)"
            type="number"
            name="bathing"
          />
          <Input
            label="Feeding Assistance (Years)"
            type="number"
            name="feeding"
          />
        </div>
      </div>
      <div>
        <Input
          label="Service Fee (KSh per day/month)"
          type="text"
          name="service"
          placeholder="e.g., 1500 per day or 35000 per month"
        />
      </div>
    </div>
  );
};

export default SkillServices;
