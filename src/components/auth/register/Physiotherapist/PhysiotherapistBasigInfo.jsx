import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { languages } from "@/utilities/data";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PhysiotherapistBasigInfo = ({ defaultValues, onNext }) => {
  const [data, setData] = useState({
    name: defaultValues.name || "",
    location: defaultValues.location || "",
    age: defaultValues.age || "",
    gender: defaultValues.gender || "",
    languages: defaultValues.languages || [],
    canDrive: defaultValues.canDrive || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = (lan) => {
    setData((prev) => {
      const alreadySelected = prev.languages.includes(lan);
      return {
        ...prev,
        languages: alreadySelected
          ? prev.languages.filter((l) => l !== lan)
          : [...prev.languages, lan],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "name",
      "age",
      "gender",
      // "bankName",
      // "bankAccountName",
      // "bankAccountNumber",
      "location",
      "canDrive",
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

    if (data.age < 25) {
      toast.error("Age must be 25 or above");
      return;
    }

    if (data.languages.length === 0) {
      toast.error("Please select at least one language!");
      return;
    }

    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="formHeading">Basic Information</h2>
      <div className="flex flex-col  py-6 md:flex-row md:gap-4 gap-6">
        <div className="flex-1">
          <Input
            placeholder="Name"
            name="name"
            label="Full Name (as per ID)"
            value={data.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex-1">
          <Input
            type="number"
            placeholder="Your age"
            name="age"
            label="Age"
            maxLength={2}
            value={data.age}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 2);
              handleChange({ target: { name: "age", value: val } });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 ">
        {/* <div className="space-y-4 flex-1">
              <Label className={"mb-2 sm:mb-3"}>Bank Details</Label>
              <Input
                name="bankName"
                placeholder="Your bank name"
                value={data.bankName}
                onChange={handleChange}
              />
    
              <Input
                name="bankAccountName"
                placeholder="Your account name"
                value={data.bankAccountName}
                onChange={handleChange}
              />
              <Input
                name="bankAccountNumber"
                placeholder="Your account number"
                value={data.bankAccountNumber}
                onChange={handleChange}
              />
            </div> */}
        <div className="flex-1">
          <Input
            label="Location"
            placeholder="Location"
            name="location"
            value={data.location}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Label className={"mb-2"}>Gender?</Label>
          <RadioGroup
            className={"flex gap-4"}
            value={data.gender}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, gender: value }))
            }
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="Male" id="r1" />
              <Label
                className="text-gray-700 font-normal cursor-pointer"
                htmlFor="r1"
              >
                Male
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="Female" id="r2" />
              <Label
                className="text-gray-700 font-normal cursor-pointer"
                htmlFor="r2"
              >
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="py-8">
        <Label className={"mb-3"}>Languages</Label>
        <div className="flex flex-wrap gap-4 ">
          {languages.map((lan, indx) => (
            <div key={indx} className="flex items-center gap-2">
              <Checkbox
                id={lan.value}
                checked={data.languages.includes(lan.value)}
                onCheckedChange={() => toggleLanguage(lan.value)}
              />
              <Label
                htmlFor={lan.value}
                className="text-gray-700 font-normal cursor-pointer"
              >
                {lan.text}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Can you drive?</Label>
        <RadioGroup
          className="flex gap-4 "
          value={data.canDrive}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, canDrive: value }))
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

      <div className="flex justify-end mt-6">
        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default PhysiotherapistBasigInfo;
