import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AdditionalDetails = ({ defaultValues, onNext, onBack }) => {
  const [data, setData] = useState({
    isMother: defaultValues.isMother || null,
    ageOfKids: defaultValues.ageOfKids || [],
    isHandelingPet: defaultValues.isHandelingPet || null,
    preferredRole: defaultValues.preferredRole || "",
  });

  const toggleageOfKids = (kid) => {
    setData((prev) => {
      const alreadySelected = prev.ageOfKids.includes(kid);
      return {
        ...prev,
        ageOfKids: alreadySelected
          ? prev.ageOfKids.filter((l) => l !== kid)
          : [...prev.ageOfKids, kid],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.isMother === null) {
      toast.error("Please select if you are a mother or not!");
      return;
    }

    if (data.ageOfKids.length === 0) {
      toast.error("Please select age group of kids you prefer!");
      return;
    }

    if (!data.isHandelingPet === null) {
      toast.error("Please select your preference for handling pets!");
      return;
    }

    onNext(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h4 className="formHeading">Additional Details</h4>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mother Question */}
        <div className="w-full flex-1 flex flex-col">
          <Label>Are you a mother?</Label>
          <RadioGroup
            className="flex gap-4 mt-3"
            value={String(data.isMother)}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, isMother: value === "true" }))
            }
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="true" id="r1" />
              <Label
                htmlFor="r1"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-3">
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

        {/* Age Preference */}
        <div className="flex-1">
          <Label>What age of kids do you prefer working with?</Label>
          <div className="flex flex-wrap mt-3 gap-4">
            {["0-3", "4-10", "11+"].map((age) => (
              <div key={age} className="flex  gap-2">
                <Checkbox
                  id={`age-${age}`}
                  checked={data.ageOfKids.includes(age)}
                  onCheckedChange={() => toggleageOfKids(age)}
                />
                <Label
                  htmlFor={`age-${age}`}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  {`${age} years`}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pets */}
      <div className="flex md:flex-row flex-col gap-6">
        <div className="flex-1">
          <Label>Are you okay handling pets?</Label>
          <RadioGroup
            className="flex gap-4 mt-3"
            value={String(data.isHandelingPet)}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, isHandelingPet: value === "true" }))
            }
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="true" id="p1" />
              <Label
                htmlFor="p1"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="false" id="p2" />
              <Label
                htmlFor="p2"
                className="text-gray-700 font-normal cursor-pointer"
              >
                No
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex-1">
          <Label>Preferred Role </Label>
          <RadioGroup
            className="flex gap-4 mt-3"
            value={data.preferredRole}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, preferredRole: value }))
            }
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="Nanny" id="h1" />
              <Label
                htmlFor="h1"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Nanny
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="Housekeeper" id="h2" />
              <Label
                htmlFor="h2"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Housekeeper
              </Label>
            </div>
          </RadioGroup>
        </div>
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

export default AdditionalDetails;
