"use client";

import Input from "@/components/shared/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { languages } from "@/utilities/data";
import { Camera, FileText, IdCardLanyard } from "lucide-react";
import React, { useEffect, useState } from "react";
import FileUpload from "../FileUpload";
import {
  blockInvalidKeys,
  numericInputFilter,
} from "@/utilities/helperFunction";

const NurseDetails = ({
  nurseNumber = 1,
  onDataChange,
  defaultValues = {},
}) => {
  // Document Types
  const documents = [
    {
      id: 1,
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
    },
    {
      id: 2,
      title: "Profile Photo",
      accept: "image/*",
      icon: <Camera size={32} />,
    },
  ];

  const skillsList = [
    "Basic Patient Care",
    "Vital Signs Monitoring",
    "Medical Assistance",
    "Compassion & Communication Skills",
    "Special Needs Care",
    "Elderly Caregiving",
    "Handling Medical Equipment",
  ];

  // Local state
  const [data, setData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    education: "",
    languages: [],
    canDrive: "",
    role: "",
    educationCertificate: null,
    isNursingInKenya: "",
    hospitalBasedCare: "",
    hospitalBasedYearsOfExperience: "",
    hospitalBasedReferenceContact: "",
    homeBasedCare: "",
    homeBasedYearsOfExperience: "",
    homeBasedReferenceContact: "",
    skills: [],
    mobilityYears: "",
    bathingYears: "",
    feedingYears: "",
    serviceFee: "",
    documents: {},
    ...defaultValues,
  });

  // Load initial data on mount
  useEffect(() => {
    setData((prev) => ({ ...prev, ...defaultValues }));
  }, []);

  // Send up to change
  useEffect(() => {
    onDataChange && onDataChange(data);
  }, [data]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  // Generic handler for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle array fields (skills, languages)
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

  // Handle file uploads
  const handleFileSelect = (id, file) => {
    setData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [id]: file,
      },
    }));
  };

  return (
    <div>
      <h2 className="formHeading mb-4">Nurse Details</h2>
      <h2 className="text-base font-semibold text-gray-700 border-primary border-b mb-6">
        Nurse #{nurseNumber}
      </h2>

      {/* Name + Age */}
      <div className="flex flex-col pb-6 md:flex-row md:gap-4 gap-6">
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
          onKeyDown={blockInvalidKeys}
          onChange={(e) => {
            handleChange({
              target: {
                name: "age",
                value: numericInputFilter(e.target.value, 2),
              },
            });
          }}
        />
      </div>

      {/* Location + Gender */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
        <Input
          label="Location"
          placeholder="Location"
          name="location"
          value={data.location}
          onChange={handleChange}
        />

        <div className="flex-1">
          <Label className={"mb-2"}>Gender?</Label>
          <RadioGroup
            value={data.gender}
            onValueChange={(val) => setData((p) => ({ ...p, gender: val }))}
            className="flex gap-4"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="Male" id="g1" />
              <Label htmlFor="g1">Male</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="Female" id="g2" />
              <Label htmlFor="g2">Female</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Languages */}
      <div className="py-8">
        <Label className={"mb-3"}>Languages</Label>
        <div className="flex flex-wrap gap-4">
          {languages.map((lan, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Checkbox
                checked={data.languages.includes(lan.value)}
                onCheckedChange={() => toggleArray("languages", lan.value)}
              />
              <Label>{lan.text}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Driving */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
        <div className="flex-1">
          <Label className={"mb-2"}>Can you drive?</Label>
          <RadioGroup
            value={data.canDrive}
            onValueChange={(val) => setData((p) => ({ ...p, canDrive: val }))}
            className="flex gap-4"
          >
            <RadioGroupItem value="Yes" id="d1" />
            <Label htmlFor="d1">Yes</Label>

            <RadioGroupItem value="No" id="d2" />
            <Label htmlFor="d2">No</Label>
          </RadioGroup>
        </div>

        {/* Role */}
        <div className="flex-1">
          <Label className={"mb-2"}>Your Role?</Label>
          <RadioGroup
            value={data.role}
            onValueChange={(val) => setData((p) => ({ ...p, role: val }))}
            className="flex gap-4"
          >
            <RadioGroupItem value="Medical Nurse" id="r3" />
            <Label htmlFor="r3">Medical Nurse</Label>

            <RadioGroupItem value="Nurse Aide" id="r4" />
            <Label htmlFor="r4">Nurse Aide</Label>
          </RadioGroup>
        </div>
      </div>

      {/* Education Level */}
      <div className="my-6">
        <Label className="mb-3">Level of Education</Label>
        <RadioGroup
          value={data.education}
          onValueChange={(val) => setData((p) => ({ ...p, education: val }))}
          className="flex flex-wrap gap-4"
        >
          <RadioGroupItem value="Diploma In Nursing" id="edu1" />
          <Label htmlFor="edu1">Diploma In Nursing</Label>

          <RadioGroupItem value="Degree In Nursing" id="edu2" />
          <Label htmlFor="edu2">Degree In Nursing</Label>
        </RadioGroup>
      </div>

      {/* Education Certificate Upload */}
      <FileUpload
        title="Education Certificate (Compulsory)"
        accept="application/pdf,image/*"
        icon={<FileText size={32} />}
        file={data.educationCertificate}
        onFileSelect={(file) =>
          setData((p) => ({ ...p, educationCertificate: file }))
        }
      />

      {/* Nursing Council */}
      <div className="my-6">
        <Label className={"mb-2"}>
          Are you registered with the Nursing Council of Kenya?
        </Label>
        <RadioGroup
          value={data.isNursingInKenya}
          onValueChange={(val) =>
            setData((p) => ({ ...p, isNursingInKenya: val }))
          }
          className="flex gap-4"
        >
          <RadioGroupItem value="Yes" id="n1" />
          <Label htmlFor="n1">Yes</Label>

          <RadioGroupItem value="No" id="n2" />
          <Label htmlFor="n2">No</Label>
        </RadioGroup>
      </div>

      {/* Hospital Based Care */}
      <div>
        <Label className={"mb-2"}>Hospital Based Care</Label>
        <RadioGroup
          value={data.hospitalBasedCare}
          onValueChange={(val) =>
            setData((p) => ({ ...p, hospitalBasedCare: val }))
          }
          className="flex gap-4"
        >
          <RadioGroupItem value="Yes" id="hb1" />
          <Label htmlFor="hb1">Yes</Label>

          <RadioGroupItem value="No" id="hb2" />
          <Label htmlFor="hb2">No</Label>
        </RadioGroup>
      </div>

      {/* Hospital experience fields */}
      <div className="flex flex-col mb-8 mt-6 sm:flex-row gap-4">
        <Input
          type="number"
          label="Years of experience"
          name="hospitalBasedYearsOfExperience"
          placeholder="Hospital based experience"
          value={data.hospitalBasedYearsOfExperience}
          onKeyDown={blockInvalidKeys}
          onChange={(e) => {
            handleChange({
              target: {
                name: "hospitalBasedYearsOfExperience",
                value: numericInputFilter(e.target.value, 2),
              },
            });
          }}
        />
        <Input
          label="Reference contact"
          name="hospitalBasedReferenceContact"
          placeholder="Hospital based ref"
          value={data.hospitalBasedReferenceContact}
          onChange={handleChange}
        />
      </div>

      {/* Home Based Care */}
      <div>
        <Label className={"mb-2"}>Home Based Care</Label>
        <RadioGroup
          value={data.homeBasedCare}
          onValueChange={(val) =>
            setData((p) => ({ ...p, homeBasedCare: val }))
          }
          className="flex gap-4"
        >
          <RadioGroupItem value="Yes" id="hb3" />
          <Label htmlFor="hb3">Yes</Label>

          <RadioGroupItem value="No" id="hb4" />
          <Label htmlFor="hb4">No</Label>
        </RadioGroup>
      </div>

      <div className="flex flex-col mt-6 sm:flex-row gap-4">
        <Input
          type="number"
          label="Years of experience"
          name="homeBasedYearsOfExperience"
          placeholder="Home based experience"
          value={data.homeBasedYearsOfExperience}
          onKeyDown={blockInvalidKeys}
          onChange={(e) => {
            handleChange({
              target: {
                name: "homeBasedYearsOfExperience",
                value: numericInputFilter(e.target.value, 2),
              },
            });
          }}
        />
        <Input
          label="Reference contact"
          name="homeBasedReferenceContact"
          placeholder="Home based ref"
          value={data.homeBasedReferenceContact}
          onChange={handleChange}
        />
      </div>

      {/* Skills */}
      <div>
        <Label className="mb-2 mt-4 block">Do you have experience in:</Label>
        <div className="flex flex-col gap-3">
          {skillsList.map((skill, idx) => (
            <div key={idx} className="flex gap-2">
              <Checkbox
                checked={data.skills.includes(skill)}
                onCheckedChange={() => toggleArray("skills", skill)}
              />
              <Label>{skill}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Years of Experience */}
      <div>
        <h2 className="formHeading mt-6">Years Experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 pb-6">
          <Input
            label="Mobility Assistance (Years)"
            type="number"
            name="mobilityYears"
            value={data.mobilityYears}
            onKeyDown={blockInvalidKeys}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "mobilityYears",
                  value: numericInputFilter(e.target.value, 2),
                },
              });
            }}
          />

          <Input
            label="Bathing Assistance (Years)"
            type="number"
            name="bathingYears"
            value={data.bathingYears}
            onKeyDown={blockInvalidKeys}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "bathingYears",
                  value: numericInputFilter(e.target.value, 2),
                },
              });
            }}
          />

          <Input
            label="Feeding Assistance (Years)"
            type="number"
            name="feedingYears"
            value={data.feedingYears}
            onKeyDown={blockInvalidKeys}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "feedingYears",
                  value: numericInputFilter(e.target.value, 2),
                },
              });
            }}
          />
        </div>
      </div>

      {/* Salary Range */}
      <Input
        label="Salary Range (KSh per day/month)"
        type="text"
        name="serviceFee"
        placeholder="1500 per day or 35000 per month"
        value={data.serviceFee}
         onKeyDown = {blockInvalidKeys}
          onChange={(e) => {
            handleChange({
              target:{
                name:"serviceFee",
                value:numericInputFilter(e.target.value,5)
              }
            })
          }}
      />

      {/* Document Uploads */}
      <div>
        <h2 className="formHeading mt-6">Document Uploads</h2>
        <div className="p-3 bg-primary/20 my-6 rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>

        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-4">
          {documents.map((item) => (
            <FileUpload
              key={item.id}
              title={item.title}
              accept={item.accept}
              icon={item.icon}
              file={data.documents[item.id]}
              onFileSelect={(file) => handleFileSelect(item.id, file)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NurseDetails;
