import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Experience = ({ defaultValues = {}, onNext, onBack }) => {
  const [data, setData] = useState({
    hospitalBasedCare: defaultValues.hospitalBasedCare ?? null,
    homeBasedCare: defaultValues.homeBasedCare ?? null,

    hospitalBasedYearsOfExperience:
      defaultValues.hospitalBasedYearsOfExperience ?? "",
    hospitalBasedReferenceContact:
      defaultValues.hospitalBasedReferenceContact ?? "",

    homeBasedYearsOfExperience: defaultValues.homeBasedYearsOfExperience ?? "",
    homeBasedReferenceContact: defaultValues.homeBasedReferenceContact ?? "",

    preferred: defaultValues.preferred ?? [],
    serviceFeeDay:
      defaultValues.serviceFeeDay !== undefined &&
      defaultValues.serviceFeeDay !== ""
        ? Number(defaultValues.serviceFeeDay)
        : "",
    serviceFeeMonth:
      defaultValues.serviceFeeMonth !== undefined &&
      defaultValues.serviceFeeMonth !== ""
        ? Number(defaultValues.serviceFeeMonth)
        : "",
  });

  const preferred = [
    {
      title: "Pediatric",
    },
    {
      title: "Orthopedic",
    },
    {
      title: "Rehab",
    },
    {
      title: "Sports",
    },
    {
      title: "Stroke",
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

    // Required field validation
    const requiredFields = [
      "hospitalBasedCare",
      "homeBasedCare",
      "serviceFeeDay",
      "serviceFeeMonth",
    ];

    for (const field of requiredFields) {
      if (
        data[field] === null ||
        (typeof data[field] === "string" && data[field].trim() === "")
      ) {
        const label = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase());

        toast.error(`${label} is required!`);
        return;
      }
    }

    if (!Number.isFinite(data.serviceFeeDay) || data.serviceFeeMonth <= 0) {
      toast.error("Service fee must be a valid number greater than 0");
      return;
    }

    // Hospital-based conditional validation
    if (
      data.hospitalBasedCare &&
      (!data.hospitalBasedYearsOfExperience ||
        !data.hospitalBasedReferenceContact)
    ) {
      toast.error("Please fill all Hospital Based Care fields!");
      return;
    }

    // Home-based conditional validation
    if (
      data.homeBasedCare &&
      (!data.homeBasedYearsOfExperience || !data.homeBasedReferenceContact)
    ) {
      toast.error("Please fill all Home Based Care fields!");
      return;
    }

    // Preferred areas validation
    if (data.preferred.length === 0) {
      toast.error("Please select at least one preferred area");
      return;
    }
  
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="formHeading">Experience</h2>

      {/* Hospital Based Care */}
      <div className="mt-6">
        <Label className="mb-3 block">Hospital Based Care</Label>
        <RadioGroup
          className="flex gap-4"
          value={
            data.hospitalBasedCare === null
              ? ""
              : String(data.hospitalBasedCare)
          }
          onValueChange={(value) =>
            setData((prev) => ({
              ...prev,
              hospitalBasedCare: value === "true",
              hospitalBasedYearsOfExperience:
                value === "true" ? prev.hospitalBasedYearsOfExperience : "",
              hospitalBasedReferenceContact:
                value === "true" ? prev.hospitalBasedReferenceContact : "",
            }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="true" id="hospital-yes" />
            <Label htmlFor="hospital-yes">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="false" id="hospital-no" />
            <Label htmlFor="hospital-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {data.hospitalBasedCare && (
        <div className="flex gap-6 my-6 flex-col sm:flex-row">
          <Input
            type="number"
            label="Years of experience"
            name="hospitalBasedYearsOfExperience"
            maxLength={2}
            value={data.hospitalBasedYearsOfExperience}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "hospitalBasedYearsOfExperience",
                  value: e.target.value.replace(/\D/g, "").slice(0, 2),
                },
              })
            }
          />
          <Input
            label="Reference contact"
            name="hospitalBasedReferenceContact"
            value={data.hospitalBasedReferenceContact}
            onChange={handleChange}
          />
        </div>
      )}

      {/* Home Based Care */}
      <div className="my-6">
        <Label className="mb-3 block">Home Based Care</Label>
        <RadioGroup
          className="flex gap-4"
          value={data.homeBasedCare === null ? "" : String(data.homeBasedCare)}
          onValueChange={(value) =>
            setData((prev) => ({
              ...prev,
              homeBasedCare: value === "true",
              homeBasedYearsOfExperience:
                value === "true" ? prev.homeBasedYearsOfExperience : "",
              homeBasedReferenceContact:
                value === "true" ? prev.homeBasedReferenceContact : "",
            }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="true" id="home-yes" />
            <Label htmlFor="home-yes">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="false" id="home-no" />
            <Label htmlFor="home-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {data.homeBasedCare && (
        <div className="flex gap-6 my-6 flex-col sm:flex-row">
          <Input
            type="number"
            label="Years of experience"
            name="homeBasedYearsOfExperience"
            maxLength={2}
            value={data.homeBasedYearsOfExperience}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "homeBasedYearsOfExperience",
                  value: e.target.value.replace(/\D/g, "").slice(0, 2),
                },
              })
            }
          />
          <Input
            label="Reference contact"
            name="homeBasedReferenceContact"
            value={data.homeBasedReferenceContact}
            onChange={handleChange}
          />
        </div>
      )}

      <div>
        <Label className={"mb-3"}>
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

      {/* Service Fee */}
      <div className="mt-4">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Service Fee (Per Day - KSh)"
            type="number"
            name="serviceFeeDay"
            maxLength={5}
            placeholder="e.g., 1500"
            value={data.serviceFeeDay}
            onChange={(e) => {
              const value = e.target.value;
              setData((prev) => ({
                ...prev,
                serviceFeeDay: value === "" ? "" : Number(value),
              }));
            }}
          />
          <Input
            label="Service Fee (Per Month - KSh)"
            type="number"
            name="serviceFeeMonth"
            maxLength={6}
            placeholder="e.g., 35000"
            value={data.serviceFeeMonth}
            onChange={(e) => {
              const value = e.target.value;
              setData((prev) => ({
                ...prev,
                serviceFeeMonth: value === "" ? "" : Number(value),
              }));
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default Experience;
