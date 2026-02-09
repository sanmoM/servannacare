"use client";

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
  Camera,
  ClipboardPlus,
  Cross,
  FileText,
  IdCard,
  IdCardLanyard,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import FileUpload from "../../FileUpload";


const UpdateEmployeeDetails = ({
  employeeNumber = 1,
  onDataChange,
  defaultValues = {},
}) => {
  // document types
  const documents = [
    {
      id: "aidCertificate",
      title: "First Aid Certificate",
      accept: "application/pdf,image/*",
      icon: <Cross size={32} />,
    },
    {
      id: "goodConductCertificate",
      title: "Good Conduct Certificate / Letter from Chief",
      accept: "application/pdf,image/*",
      icon: <FileText size={32} />,
    },
    {
      id: "idCopy",
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
    },
    {
      id: "profilePhoto",
      title: "Profile Photo",
      accept: "image/*",
      icon: <Camera size={32} />,
    },
    {
      id: "drivingLicense",
      title: "Driving License (Optional)",
      accept: "application/pdf,image/*",
      icon: <IdCard size={32} />,
      optional: true,
    },
  ];

  // local employee data
  const [data, setData] = useState({
    name: "",
    educationLevel: "",
    location: "",
    experience: "",
    salaryRange: "",
    isMother: null,
    kidAges: [],
    handlePets: null,
    preferredRole: "",
    languages: [],
    cooking:"",
    housekeeping:"",
    childcare:"",
    serviceOffered: "",
    bio:"",
    aidCertificate:null,
    goodConductCertificate:null,
    idCopy:null,
    profilePhoto:null,
    drivingLicense:null,
    ...defaultValues,
  });

  useEffect(() => {
    setData((prev) => ({ ...prev, ...defaultValues }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // send up on change
  useEffect(() => {
    onDataChange && onDataChange(data);
  }, [data]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  // generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // select change
  const handleSelect = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // radio change
  const handleRadio = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // checkbox toggle for arrays
  const toggleArray = (name, value) => {
    setData((prev) => {
      const exists = prev[name].includes(value);
      return {
        ...prev,
        [name]: exists
          ? prev[name].filter((v) => v !== value)
          : [...prev[name], value],
      };
    });
  };

  // file upload
  const handleFileSelect = (id, file) => {
    setData((prev) => ({
      ...prev,[id]:file
    }));
  };


  return (
    <div>
      <h2 className="formHeading mb-4">Employee Details</h2>

      <h2 className="text-base font-semibold text-gray-700 border-primary border-b mb-6">
        Employee #{employeeNumber}
      </h2>

      {/* Name & Education */}
      <div className="flex sm:gap-4 gap-6 flex-col sm:flex-row">
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
          <Label className="block mb-2 text-sm font-medium text-gray-700">
            Education Level
          </Label>
          <Select
            value={data.educationLevel || ""}
            onValueChange={(v) => handleSelect("educationLevel", v)}
          >
            <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
              <SelectValue placeholder="Select education" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Primary">Primary</SelectItem>
                <SelectItem value="Secondary">Secondary</SelectItem>
                <SelectItem value="Diploma">Diploma</SelectItem>
                <SelectItem value="Bachelor">Bachelor</SelectItem>
                <SelectItem value="Bachelor">Bachelor</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location, Experience, Salary */}
      <div className="flex gap-4 pt-6 flex-col sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Type your location."
            label="Location"
            name="location"
            value={data.location}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1 flex gap-2">
          <div className="w-1/2">
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Experience (Years)
            </Label>

            <Select
              value={data.experience || ""}
              onValueChange={(v) => handleSelect("experience", v)}
            >
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1 year">1 year</SelectItem>
                  <SelectItem value="2 years">2 years</SelectItem>
                  <SelectItem value="3 years">3 years</SelectItem>
                  <SelectItem value="4 years">4 years</SelectItem>
                  <SelectItem value="5 years">5 years</SelectItem>
                  <SelectItem value="More than 5+ years">More than 5 years</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Salary Range (KSh)
            </Label>

            <Select
              value={data.salaryRange || ""}
              onValueChange={(v) => handleSelect("salaryRange", v)}
            >
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select salary range" />
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
        </div>
      </div>

      {/* Radio & Checkboxes */}
      <div className="flex flex-col py-8 sm:flex-row sm:gap-4 gap-8">
        <div className="flex-1">
          <Label className="mb-3">Are you a mother?</Label>
          <RadioGroup
            value={data.isMother || ""}
            onValueChange={(v) => handleRadio("isMother", v)}
          >
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="Yes"
                  id={`motherYes_${employeeNumber}`}
                />
                <Label htmlFor={`motherYes_${employeeNumber}`}>Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="No" id={`motherNo_${employeeNumber}`} />
                <Label htmlFor={`motherNo_${employeeNumber}`}>No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="flex-1">
          <Label className="mb-3">What age of kinds do you prefer working with?</Label>
          <div className="flex flex-wrap gap-y-2 gap-x-4">
            {["0-3", "4-10", "11+"].map((age) => (
              <div key={age} className="flex items-center gap-2">
                <Checkbox
                  id={`${age}_${employeeNumber}`}
                  checked={data.kidAges.includes(age)}
                  onCheckedChange={() => toggleArray("kidAges", age)}
                />
                <Label htmlFor={`${age}_${employeeNumber}`}>{age} years</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pets & Role */}
      <div className="flex flex-col sm:flex-row sm:gap-4 gap-8">
        <div className="flex-1">
          <Label className="mb-3">Are you okay handling pets?</Label>

          <RadioGroup
            value={data.handlePets || ""}
            onValueChange={(v) => handleRadio("handlePets", v)}
          >
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Yes" id={`petsYes_${employeeNumber}`} />
                <Label htmlFor={`petsYes_${employeeNumber}`}>Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="No" id={`petsNo_${employeeNumber}`} />
                <Label htmlFor={`petsNo_${employeeNumber}`}>No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="flex-1">
          <Label className="mb-3">Preferred Role</Label>
          <RadioGroup
            value={data.preferredRole || ""}
            onValueChange={(v) => handleRadio("preferredRole", v)}
          >
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="Nanny"
                  id={`roleNanny_${employeeNumber}`}
                />
                <Label htmlFor={`roleNanny_${employeeNumber}`}>Nanny</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="Housekeeper"
                  id={`roleHousekeeper_${employeeNumber}`}
                />
                <Label htmlFor={`roleHousekeeper_${employeeNumber}`}>
                  Housekeeper
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Languages */}
      <div className="pt-8">
        <Label className="mb-3">Languages Spoken</Label>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {languages.map((lan, i) => (
            <div key={i} className="flex items-center gap-2">
              <Checkbox
                id={`${lan.value}_${employeeNumber}`}
                checked={data.languages.includes(lan.value)}
                onCheckedChange={() => toggleArray("languages", lan.value)}
              />
              <Label htmlFor={`${lan.value}_${employeeNumber}`}>
                {lan.text}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="pt-6">
        <Label className="mb-3">Skill Proficiency</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["cooking", "housekeeping", "childcare"].map((skill) => (
            <div key={skill}>
              <Label className="block mb-2 capitalize">{skill}</Label>
              <Select
                value={data[skill] || ""}
              onValueChange={(v) => handleSelect(skill, v)}
              >
                <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Strong">Strong</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Weak">Weak</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      {/* Live Type */}
      <div className="py-6">
        <Label className="mb-3">Service Offered</Label>

        <RadioGroup
          value={data.serviceOffered || ""}
          onValueChange={(v) => handleRadio("serviceOffered", v)}
        >
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Live In" id={`liveIn_${employeeNumber}`} />
              <Label htmlFor={`liveIn_${employeeNumber}`}>Live In</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="Dayburg"
                id={`dayburg_${employeeNumber}`}
              />
              <Label htmlFor={`dayburg_${employeeNumber}`}>Dayburg</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* bio  */}
      <div className="mb-6">
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

      {/* Documents */}
      <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center">
        <ClipboardPlus />
        <span className="text-sm text-gray-700">
          Please upload the following documents
        </span>
      </div>

      <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <FileUpload
            key={doc.id}
            title={doc.title}
            accept={doc.accept}
            icon={doc.icon}
            optional={doc.optional}
            file={data[doc.id]|| null}
            onFileSelect={(file) => handleFileSelect(doc.id, file)}
          />
        ))}
      </div>
    </div>
  );
};

export default UpdateEmployeeDetails;
