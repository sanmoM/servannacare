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

import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";

const BasicInfo = ({ defaultValues, onNext }) => {
  const [country, setCountry] = useState("KE");

  const [data, setData] = useState({
    name: defaultValues.name || "",
    education: defaultValues.education || "",
    experience: defaultValues.experience || "",
    salaryRange: defaultValues.salaryRange || "",
    preferred: defaultValues.preferred || [],
    location: defaultValues.location || "",
    languages: defaultValues.languages || [],
    phone: defaultValues.phone || "",
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

  const preferred = [
    {
      title: "Live In",
    },
    {
      title: "DayBurg",
    },
  ];

  const togglepreferred = (pref) => {
    setData((prev) => ({
      ...prev,
      preferred: prev.preferred.includes(pref) ? [] : [pref],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "education",
      "experience",
      "salaryRange",
      "location",
    ];

    for (let field of requiredFields) {
      if (!data[field]) {
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required!`,
        );
        return;
      }
    }

    if (data.languages.length === 0) {
      toast.error("Please select at least one language!");
      return;
    }

    if (!data?.phone) {
      toast.error("Phone number is required!");
      return;
    }

    if (!isValidPhoneNumber(data?.phone)) {
      toast.error("Phone number is invalid or incomplete!");
      return;
    }

    if (data?.preferred?.length === 0) {
      toast.error("Please select at least one service preference!");
      return;
    }
    console.log("basicinfo", data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="formHeading">Basic Information</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Full Name (As per ID)"
          name="name"
          placeholder="Enter your name"
          value={data.name}
          onChange={handleChange}
        />

        <div>
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
              <SelectValue placeholder="Select education" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Primary">Primary</SelectItem>
                <SelectItem value="Secondary">Secondary</SelectItem>
                <SelectItem value="College">College</SelectItem>
                <SelectItem value="University">University</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

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

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Salary Range (KSh)
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
                <SelectItem value="200-400">200 - 400</SelectItem>
                <SelectItem value="400-600">400 - 600</SelectItem>
                <SelectItem value="600-800">600 - 800</SelectItem>
                <SelectItem value="800-1000">800 - 1000</SelectItem>
                <SelectItem value="1000+">More than 1000</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* <Input
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="07xxxxxxxx"
          value={data.phone}
          maxLength={10}
          onChange={handlePhoneChange}
        /> */}

        <div>
          <Label>Phone Number</Label>

          <div className="w-full mt-2">
            <PhoneInputWithCountrySelect
              className="w-full border rounded-md px-3 py-2"
              international
              defaultCountry={country}
              value={data?.phone}
              onChange={(value) => {
                setData((prev) => ({ ...prev, phone: value || "" }));
              }}
              onCountryChange={(countryCode) => {
                setCountry(countryCode);
                const exampleNumber = countryCode
                  ? getExampleNumber(countryCode)
                  : null;
                if (exampleNumber) {
                  setData((prev) => ({
                    ...prev,
                    phone: `+${exampleNumber.countryCallingCode}`,
                  }));
                } else {
                  setData((prev) => ({ ...prev, phone: "" }));
                }
              }}
            />
          </div>

          {data?.phone && !isValidPhoneNumber(data?.phone) && (
            <p className="text-red-500 text-sm mt-1">
              Invalid phone number for selected country
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Service Offered
          </label>
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
      </div>

      <Input
        label="Your Location"
        name="location"
        placeholder="Type your location.."
        value={data.location}
        onChange={handleChange}
      />

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

      <div className="flex justify-end mt-6">
        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default BasicInfo;
