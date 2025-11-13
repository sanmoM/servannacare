"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { languages } from "@/utilities/data";
import React, { useState } from "react";
import toast from "react-hot-toast";

const NurseBasicInfo = ({ defaultValues, onNext }) => {
  const [data, setData] = useState({
    name: defaultValues.name || "",
    location: defaultValues.location || "",
    age: defaultValues.age || "",
    gender: defaultValues.gender || "",
    languages: defaultValues.languages || [],
    canDrive: defaultValues.canDrive || "",
    bankName: defaultValues.bankName || "",
    bankAccountName: defaultValues.bankAccountName || "",
    bankAccountNumber: defaultValues.bankAccountNumber || "",
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
      "location",
      "age",
      "gender",
      "canDrive",
      "bankName",
      "bankAccountName",
      "bankAccountNumber",
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

    if(data.languages.length === 0){
      toast.error("Please select at least one language!")
      return
    };

    console.log(data)

    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Title */}
      <h4 className="formHeading">Basic Information</h4>

      {/* Name + Location */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
        <div className="flex-1">
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your name"
            value={data.name}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Your Location"
            name="location"
            placeholder="Type your location.."
            value={data.location}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Age + Gender */}
      <div className="flex flex-col sm:flex-row sm:gap-4 gap-6 ">
        <div className="flex-1">
          <Input
            type="number"
            label="Age"
            name="age"
            placeholder="Your age"
            value={data.age}
            onChange={handleChange}
          />
        </div>

        <div className="flex-1">
          <Label className="mb-3 block">Gender</Label>
          <RadioGroup
            className="flex gap-4 mt-2"
            value={data.gender}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, gender: value }))
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="male" id="r1" />
              <Label
                htmlFor="r1"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Male
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="female" id="r2" />
              <Label
                htmlFor="r2"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Languages */}
      <div>
        <Label className="font-medium mb-3 text-gray-700">Languages</Label>
        <div className="flex flex-wrap gap-4 mt-2">
          {languages.map((lan) => (
            <div key={lan.id} className="flex items-center gap-2">
              <Checkbox id={lan.value} 
              checked = {data.languages.includes(lan.value)}
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
            <RadioGroupItem value="yes" id="d1" />
            <Label
              htmlFor="d1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="d2" />
            <Label
              htmlFor="d2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Bank Details */}
      <div className="">
        <h4 className="formHeading mb-3 mt-6">Bank Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-4">
          <Input
            label="Bank Name"
            name="bankName"
            placeholder="Your bank name"
            value={data.bankName}
            onChange={handleChange}
          />
          <Input
            label="Account Name"
            name="bankAccountName"
            placeholder="Your account name"
            value={data.bankAccountName}
            onChange={handleChange}
          />
          <Input
            label="Account Number"
            name="bankAccountNumber"
            placeholder="Your account number"
            value={data.bankAccountNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Remember Me */}
      {/* <div className="flex items-center gap-2 text-gray-700 text-sm mt-4">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="text-gray-700 cursor-pointer">
          Remember me
        </Label>
      </div> */}

      <div className="flex justify-end mt-6">
        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default NurseBasicInfo;
