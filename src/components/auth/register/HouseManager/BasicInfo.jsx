import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

const BasicInfo = ({ defaultValues, onNext }) => {
  const [data, setData] = useState({
    name: defaultValues.name || "",
    education: defaultValues.education || "",
    experience: defaultValues.experience || "",
    salaryRange: defaultValues.salaryRange || "",
    location: defaultValues.location || "",
    bankName: defaultValues.bankName || "",
    bankAccountName: defaultValues.bankAccountName || "",
    bankAccountNumber: defaultValues.bankAccountNumber || "",
    languages: defaultValues.languages || [],
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

    // Dynamic validation
    const requiredFields = [
      "name",
      "education",
      "experience",
      "salaryRange",
      "location",
      "bankName",
      "bankAccountName",
      "bankAccountNumber",
    ];
    for (let field of requiredFields) {
      if (
        !data[field] ||
        (Array.isArray(data[field]) && data[field].length === 0)
      ) {
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required!`
        );
        return; 
      }
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            label="Full Name (AS per ID)"
            name="name"
            placeholder="Enter your name"
            value={data.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Education Level
          </label>
          <Select
            value={data.education}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, education: value }))
            }
          >
            <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="university">University</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Experience + Salary */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
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

        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Salary Range (USD)
          </label>
          <Select
            value={data.salaryRange}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, salaryRange: value }))
            }
          >
            <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
              <SelectValue placeholder="Select expected salary" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="200-400">$200 - $400</SelectItem>
                <SelectItem value="400-600">$400 - $600</SelectItem>
                <SelectItem value="600-800">$600 - $800</SelectItem>
                <SelectItem value="800-1000">$800 - $1000</SelectItem>
                <SelectItem value="1000+">More than $1000</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <Input
        label="Your Location"
        name="location"
        placeholder="Type your location.."
        value={data.location}
        onChange={handleChange}
      />

      {/* Languages */}
      <div>
        <Label className="font-medium text-gray-700">Languages</Label>
        <div className="flex flex-wrap gap-4 mt-3">
          {languages.map((lan) => (
            <div key={lan.id} className="flex items-center gap-2">
              <Checkbox
                id={lan.value}
                checked={data.languages.includes(lan.value)}
                onCheckedChange={() => toggleLanguage(lan.value)}
              />
              <Label
                className="text-gray-700 font-normal cursor-pointer"
                htmlFor={lan.value}
              >
                {lan.text}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Details */}
      <h4 className="formHeading">Bank Details</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      

      <div className="flex justify-end mt-6">
        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default BasicInfo;
