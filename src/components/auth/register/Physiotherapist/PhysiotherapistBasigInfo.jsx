import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/utilities/data";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PhysiotherapistBasigInfo = ({ defaultValues, onNext }) => {
  const [data, setData] = useState({
    name: defaultValues.name || "",
    phone: defaultValues.phone || "",
    location: defaultValues.location || "",
    age: defaultValues.age || "",
    experience: defaultValues.experience || "",
    gender: defaultValues.gender || "",
    languages: defaultValues.languages || [],
    canDrive: defaultValues.canDrive || "",
    bio: defaultValues.bio || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  //  phone handler (digits only + max 10)
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 10);
    setData((prev) => ({ ...prev, phone: value }));
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
      "phone",
      "experience",
      "location",
      "gender",
      "canDrive",
      "bio",
    ];

    for (let field of requiredFields) {
      if (!data[field]) {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());

        toast.error(`${formattedField} is required!`);
        return;
      }
    }

    //  validate phone length (10 digits only)
    if (data.phone.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }

    if (Number(data.age) < 25) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="formHeading">Basic Information</h2>

      {/* GRID: Name + Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          placeholder="Name"
          name="name"
          label="Full Name (as per ID)"
          value={data.name}
          onChange={handleChange}
        />

        <Input
          type="number"
          placeholder="Your age"
          name="age"
          label="Age"
          value={data.age}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            setData((prev) => ({ ...prev, age: val }));
          }}
        />
      </div>

      {/*  GRID: Phone + Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Mobile Number"
          name="phone"
          type="tel"
          placeholder="07xxxxxxxx"
          value={data.phone}
          maxLength={10}
          onChange={handlePhoneChange}
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Experience (Years)
          </label>
          <Select
            value={data.experience}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, experience: value }))
            }
          >
            <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
              <SelectValue placeholder="Select years of experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">1 year</SelectItem>
                <SelectItem value="2">2 years</SelectItem>
                <SelectItem value="3">3 years</SelectItem>
                <SelectItem value="4">4 years</SelectItem>
                <SelectItem value="5">5 years</SelectItem>
                <SelectItem value="more">More than 5 years</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/*  Location FULL width */}
      <Input
        label="Location"
        placeholder="Location"
        name="location"
        value={data.location}
        onChange={handleChange}
      />

      {/*  GRID: Gender + Can Drive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="mb-2 block">Gender?</Label>
          <RadioGroup
            className="flex gap-4"
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

        <div>
          <Label className="mb-3 block">Can you drive?</Label>
          <RadioGroup
            className="flex gap-4"
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
      </div>

      {/* Languages */}
      <div>
        <Label className="mb-3 block">Languages</Label>
        <div className="flex flex-wrap gap-4">
          {languages.map((lan) => (
            <div key={lan.id} className="flex items-center gap-2">
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

      {/* Bio */}
      <div>
        <label htmlFor="bio">Bio</label>
        <textarea
          value={data.bio}
          name="bio"
          placeholder="Write a brief bio about yourself and the services you offer.."
          className="border text-sm mt-2 p-3 w-full rounded-md outline-primary"
          rows={6}
          onChange={handleChange}
        />
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
