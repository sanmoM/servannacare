"use client";

import Input from "@/components/shared/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { languages } from "@/utilities/data";
import { Camera, FileText, IdCardLanyard } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  blockInvalidKeys,
  numericInputFilter,
} from "@/utilities/helperFunction";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from "../../FileUpload";

const UpdateNurseDetails = ({
  nurseNumber = 1,
  onDataChange,
  defaultValues = {},
}) => {
  // Document Types
  const documents = [
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
  ];

  const skills = [
    "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
    "Vital Signs Monitoring(checking blood pressure, blood sugar, pulse, temperature, etc.",
    "Medical Assistance: Aassisting nurses with wound care, administering medication (in some cases)",
    "Compassion & Communication Skills",
    "Special needs children caregiving",
    "Elderly caregiving",
    "Handiling Medical Quipment (e. g. fedding tubes, catheter, oxygen tanks)",
  ];

  // Local state
  const [data, setData] = useState({
    name: "",
    age: "",
    experience: "",
    gender: "",
    location: "",
    education: "",
    languages: [],
    canDrive: "",
    preferredRole: "",
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
    bio: "",
    idCopy: null,
    profilePhoto: null,
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
      [id]: file,
    }));
  };

  return (
    <div>
      <h2 className="formHeading mb-4">Nurse Details Update</h2>
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

      <div className="flex flex-col my-6 sm:flex-row gap-6 sm:gap-4">
        <div className="flex-1">
          <Label className={"mb-2"}>Gender</Label>
          <RadioGroup
            value={data.gender}
            onValueChange={(val) => setData((p) => ({ ...p, gender: val }))}
            className="flex gap-4"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="Male" id={`g1-${nurseNumber}`} />
              <Label htmlFor={`g1-${nurseNumber}`}>Male</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="Female" id={`g2-${nurseNumber}`} />
              <Label htmlFor={`g2-${nurseNumber}`}>Female</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Education Level */}
        <div className="flex-1">
          <Label className="mb-3 block">Level of Education</Label>

          <RadioGroup
            className="flex flex-wrap gap-4 mt-2"
            value={data.education}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, education: value }))
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="Diploma In Nursing"
                id={`edu1-${nurseNumber}`}
              />
              <Label
                htmlFor={`edu1-${nurseNumber}`}
                className="text-gray-700 cursor-pointer"
              >
                Diploma In Nursing
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="Degree In Nursing"
                id={`edu2-${nurseNumber}`}
              />
              <Label
                htmlFor={`edu2-${nurseNumber}`}
                className="text-gray-700 cursor-pointer"
              >
                Degree In Nursing
              </Label>
            </div>
          </RadioGroup>
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
            <RadioGroupItem value="Yes" id={`d1-${nurseNumber}`} />
            <Label htmlFor={`d1-${nurseNumber}`}>Yes</Label>

            <RadioGroupItem value="No" id={`d2-${nurseNumber}`} />
            <Label htmlFor={`d2-${nurseNumber}`}>No</Label>
          </RadioGroup>
        </div>

        {/* preferredRole */}
        <div className="flex-1 ">
          <Label className={"mb-2"}>Preferred Role?</Label>
          <RadioGroup
            value={data.preferredRole}
            onValueChange={(val) =>
              setData((p) => ({ ...p, preferredRole: val }))
            }
            className="flex gap-4"
          >
            <RadioGroupItem value="Medical Nurse" id={`r3-${nurseNumber}`} />
            <Label htmlFor={`r3-${nurseNumber}`}>Medical Nurse</Label>

            <RadioGroupItem value="Nurse Aide" id={`r4-${nurseNumber}`} />
            <Label htmlFor={`r4-${nurseNumber}`}>Nurse Aide</Label>
          </RadioGroup>
        </div>
      </div>

      {/* Languages */}
      <div className="py-6">
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
          <RadioGroupItem value="Yes" id={`n1-${nurseNumber}`} />
          <Label htmlFor={`n1-${nurseNumber}`}>Yes</Label>

          <RadioGroupItem value="No" id={`n2-${nurseNumber}`} />
          <Label htmlFor={`n2-${nurseNumber}`}>No</Label>
        </RadioGroup>
      </div>

      {/* Hospital Based Care */}
      <div className="mb-6">
        <Label className={"mb-2"}>Hospital Based Care</Label>
        <RadioGroup
          value={data.hospitalBasedCare}
          onValueChange={(val) =>
            setData((p) => ({ ...p, hospitalBasedCare: val }))
          }
          className="flex gap-4"
        >
          <RadioGroupItem value="Yes" id={`hb1-${nurseNumber}`} />
          <Label htmlFor={`hb1-${nurseNumber}`}>Yes</Label>

          <RadioGroupItem value="No" id={`hb2-${nurseNumber}`} />
          <Label htmlFor={`hb2-${nurseNumber}`}>No</Label>
        </RadioGroup>
      </div>

      {data.hospitalBasedCare === "Yes" && (
        <div className="flex flex-col mb-8 mt-6 sm:flex-row gap-4">
          <Input
            type="number"
            label="Years of experience"
            name="hospitalBasedYearsOfExperience"
            placeholder="Hospital based experience"
            value={data.hospitalBasedYearsOfExperience}
            maxLength={2}
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
      )}

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
          <RadioGroupItem value="Yes" id={`hb3-${nurseNumber}`} />
          <Label htmlFor={`hb3-${nurseNumber}`}>Yes</Label>

          <RadioGroupItem value="No" id={`hb4-${nurseNumber}`} />
          <Label htmlFor={`hb4-${nurseNumber}`}>No</Label>
        </RadioGroup>
      </div>

      {data.homeBasedCare === "Yes" && (
        <div className="flex flex-col mt-6 sm:flex-row gap-4">
          <Input
            type="number"
            label="Years of experience"
            name="homeBasedYearsOfExperience"
            placeholder="Home based experience"
            value={data.homeBasedYearsOfExperience}
            onKeyDown={blockInvalidKeys}
            maxLength={2}
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
      )}

      {/* Skills */}
      <div>
        <Label className="mb-2 mt-4 block">Do you have experience in : </Label>
        <div className="flex flex-col gap-3">
          {skills.map((skill, idx) => (
            // <div key={idx} className="flex gap-2">
            //   <Checkbox
            //     checked={data.skills.includes(skill.name)}
            //     onCheckedChange={() => toggleArray("skills", skill.name)}
            //   />
            //   <Label>{skill.name}</Label>
            // </div>
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
            placeholder="00"
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
            placeholder="00"
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
            placeholder="00"
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
        label="Service Fee (KSh per day/month)"
        type="text"
        name="serviceFee"
        placeholder="e.g., 1500 per day or 35000 per month"
        value={data.serviceFee}
        onKeyDown={blockInvalidKeys}
        onChange={(e) => {
          handleChange({
            target: {
              name: "serviceFee",
              value: numericInputFilter(e.target.value, 5),
            },
          });
        }}
      />

      <div className="mt-6">
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
              file={data[item.id]}
              onFileSelect={(file) => handleFileSelect(item.id, file)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateNurseDetails;
