import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
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
import {
  Cross,
  FileText,
  IdCard,
  IdCardLanyard,
  ImageIcon,
} from "lucide-react";
import React, { useState } from "react";

const HouseManager = ({ data = {} }) => {
  const {basicInfo, documents, additionalDetails} = data;
  console.log(basicInfo);

  const docs = [
    {
      id: "firstAidCertificate",
      title: "First Aid Certificate",
      accept: "application/pdf,image/*",
      icon: <Cross size={32} />,
      required: true,
    },
    {
      id: "goodConductCertificate",
      title: "Good Conduct Certificate",
      accept: "application/pdf,image/*",
      icon: <FileText size={32} />,
      required: true,
    },
    {
      id: "iDCopy",
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
      required: true,
    },
    {
      id: "profilePhoto",
      title: "Profile Photo",
      accept: "image/*",
      icon: <ImageIcon size={32} />,
      required: true,
    },
    {
      id: "drivingLicense",
      title: "Driving License (Optional)",
      accept: "application/pdf,image/*",
      icon: <IdCard size={32} />,
      required: false,
      optional: true,
    },
  ];
  return (
    <div>
      <form className="space-y-6">
        <h4 className="formHeading">Basic Information</h4>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <Input
              label="Full Name (AS per ID)"
              name="name"
              placeholder="Enter your name"
                value={basicInfo?.name}
              //   onChange={handleChange}
            />
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Education Level
            </label>
            <Select
              value={basicInfo?.education}
            //   onValueChange={(value) =>
            //     setData((prev) => ({ ...prev, education: value }))
            //   }
            >
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select a category" />
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
        </div>

        {/* Experience + Salary */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Experience (Years)
            </label>
            <Select
              value={basicInfo.experience}
            //   onValueChange={(value) =>
            //     setData((prev) => ({ ...prev, experience: value }))
            //   }
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
              value={basicInfo.salaryRange}
            //   onValueChange={(value) =>
            //     setData((prev) => ({ ...prev, salaryRange: value }))
            //   }
            >
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select expected salary" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="$200-$400">$200 - $400</SelectItem>
                  <SelectItem value="$400-$600">$400 - $600</SelectItem>
                  <SelectItem value="$600-$800">$600 - $800</SelectItem>
                  <SelectItem value="$800-$1000">$800 - $1000</SelectItem>
                  <SelectItem value="$1000+">More than $1000</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            {/* Location */}
            <Input
              label="Your Location"
              name="location"
              placeholder="Type your location.."
                value={basicInfo.location}
              //   onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            {/* service offered */}
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Service Offered
            </label>
            <Select
              value={basicInfo?.serviceOffered}
            //   onValueChange={(value) =>
            //     setData((prev) => ({ ...prev, serviceOffered: value }))
            //   }
            >
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select service offered" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Live In (month rate pay)">
                    Live In (month rate pay)
                  </SelectItem>
                  <SelectItem value="Dayburg (daily rate pay)">
                    Dayburg (daily rate pay)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Languages */}
        <div>
          <Label className="font-medium text-gray-700">Languages</Label>
          <div className="flex flex-wrap gap-4 mt-3">
            {languages.map((lan) => (
              <div key={lan.id} className="flex items-center gap-2">
                <Checkbox
                  id={lan.value}
                    checked={basicInfo?.languages.includes(lan.value)}
                  //   onCheckedChange={() => toggleLanguage(lan.value)}
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

        <h4 className="formHeading">Additional Details</h4>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mother Question */}
          <div className="w-full flex-1 flex flex-col">
            <Label>Are you a mother?</Label>
            <RadioGroup
              className="flex gap-4 mt-3"
                value={additionalDetails?.isMother}
              //   onValueChange={(value) => setData((prev) => ({ ...prev, isMother: value }))}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="yes" id="r1" />
                <Label
                  htmlFor="r1"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="no" id="r2" />
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
                    checked={additionalDetails?.ageOfKids.includes(age)}
                    // onCheckedChange={() => toggleageOfKids(age)}
                  />
                  <Label
                    htmlFor={`age-${age}`}
                    className="text-gray-700 font-normal cursor-pointer"
                  >
                    {age === "11+" ? "11 years and above" : `${age} years`}
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
                value={additionalDetails?.isHandelingPet}
              //   onValueChange={(value) => setData((prev) => ({ ...prev, isHandelingPet: value }))}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="yes" id="p1" />
                <Label
                  htmlFor="p1"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="no" id="p2" />
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
            <Label>Prefer being a </Label>
            <RadioGroup
              className="flex gap-4 mt-3"
                value={additionalDetails?.preferBeingA}
              //   onValueChange={(value) => setData((prev) => ({ ...prev, preferBeingA: value }))}
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
                <RadioGroupItem value="House Keeper" id="h2" />
                <Label
                  htmlFor="h2"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  House Keeper
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <h4 className="formHeading">Document Uploads</h4>

        <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <FileUpload
              key={doc.id}
              title={doc.title}
              accept={doc.accept}
              icon={doc.icon}
              optional={doc.optional}
                // file={documents[doc.id]}
              //   onFileSelect={(file) => handleFileSelect(doc.id, file)}
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default HouseManager;
