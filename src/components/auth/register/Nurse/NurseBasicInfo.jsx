"use client";

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

const NurseBasicInfo = ({ defaultValues, onNext }) => {
  const [data, setData] = useState({
    name: defaultValues.name || "",
    phone: defaultValues.phone || "", 
    location: defaultValues.location || "",
    age: defaultValues.age || "",
    experience: defaultValues.experience || "",
    gender: defaultValues.gender || "",
    preferredRole: defaultValues.preferredRole || "",
    languages: defaultValues.languages || [],
    canDrive: defaultValues.canDrive || null,
    bio: defaultValues.bio || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
  let value = e.target.value;
  if (!value.startsWith("+254")) {
    value = "+254";
  }
  value = "+254" + value.slice(4).replace(/\D/g, "");
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
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
      "phone",
      "age",
      "experience",
      "location",
      "gender",
      "canDrive",
      "preferredRole",
      "bio",
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

    if (Number(data.age) < 25) {
      toast.error("Age must be 25 or above");
      return;
    }

    if (data.phone.length !== 11) {
      toast.error("Phone number must be exactly 11 digits.");
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
      <h4 className="formHeading">Basic Information</h4>

      {/*GRID: Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Full Name (as per ID)"
          name="name"
          placeholder="Enter your name"
          value={data.name}
          onChange={handleChange}
        />

    
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+254xxxxxxx"
                  value={data?.phone}
                  maxLength={11}
                  onFocus={() => {
                    if (!data?.phone) setData((prev)=>({...prev,phone:"+254"}))
                  }}
                  onChange={handlePhoneChange}
                />
      </div>

      {/* GRID: Age + Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          type="number"
          label="Age"
          name="age"
          placeholder="Your age"
          value={data.age}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            setData((prev) => ({ ...prev, age: val }));
          }}
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
                <SelectItem value="5+">More than 5 years</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/*Location FULL width */}
      <Input
        label="Your Location"
        name="location"
        placeholder="Type your location.."
        value={data.location}
        onChange={handleChange}
      />

      {/* GRID: Gender + Can Drive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="mb-3 block">Gender</Label>
          <RadioGroup
            className="flex gap-4 mt-2"
            value={data.gender}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, gender: value }))
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Male" id="r1" />
              <Label
                htmlFor="r1"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Male
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Female" id="r2" />
              <Label
                htmlFor="r2"
                className="text-gray-700 font-normal cursor-pointer"
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
            value={String(data.canDrive)}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, canDrive: value==="true" }))
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="True" id="d1" />
              <Label
                htmlFor="d1"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="false" id="d2" />
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

      {/* preferredRole */}
        <div className="flex-1 ">
          <Label className={"mb-2"}>Preferred Role?</Label>
          <RadioGroup
            value={data.preferredRole}
             onValueChange={(value) =>
              setData((prev) => ({ ...prev, preferredRole: value }))
            }
            className="flex gap-4"
          >
            <RadioGroupItem value="Medical Nurse" id={`r3`} />
            <Label htmlFor={`r3`}>Medical Nurse</Label>

            <RadioGroupItem value="Nurse Aide" id={`r4`} />
            <Label htmlFor={`r4`}>Nurse Aide</Label>
          </RadioGroup>
        </div>

      {/* Languages */}
      <div>
        <Label className="font-medium mb-3 text-gray-700">Languages</Label>
        <div className="flex flex-wrap gap-4 mt-2">
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

export default NurseBasicInfo;
