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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NurseDetails = ({
  nurseNumber = 1,
  onDataChange,
  defaultValues = {},
  skills,
}) => {
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

  // const skills = [
  //   "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
  //   "Vital Signs Monitoring(checking blood pressure, blood sugar, pulse, temperature, etc.",
  //   "Medical Assistance: Aassisting nurses with wound care, administering medication (in some cases)",
  //   "Compassion & Communication Skills",
  //   "Special needs children caregiving",
  //   "Elderly caregiving",
  //   "Handiling Medical Quipment (e. g. fedding tubes, catheter, oxygen tanks)",
  // ];

  const [data, setData] = useState({
    name: "",
    age: "",
    experience: "",
    gender: "",
    location: "",
    education: "",
    languages: [],
    canDrive: null,
    preferredRole: "",
    educationCertificate: null,
    isNursingInKenya: null,
    hospitalBasedCare: null,
    hospitalBasedYearsOfExperience: "",
    hospitalBasedReferenceContact: "",
    homeBasedCare: null,
    homeBasedYearsOfExperience: "",
    homeBasedReferenceContact: "",
    skills: [],
    mobilityYears: "",
    bathingYears: "",
    feedingYears: "",

    serviceFeeDay: Number(defaultValues.serviceFeeDay) || 0,
    serviceFeeMonth: Number(defaultValues.serviceFeeMonth) || 0,
    bio: "",
    idCopy: null,
    profilePhoto: null,
    ...defaultValues,
  });

  const onDataChangeRef = React.useRef(onDataChange);
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  useEffect(() => {
    onDataChangeRef.current?.(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleFileSelect = (id, file) => {
    setData((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  return (
    <div>
      <h2 className="formHeading mb-4">Nurse Details</h2>
      <h2 className="text-base font-semibold text-gray-700 border-primary border-b mb-6">
        Nurse #{nurseNumber}
      </h2>

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
            <div className="flex items-center gap-2">
              <RadioGroupItem
                className={"cursor-pointer"}
                value="Male"
                id={`g1-${nurseNumber}`}
              />
              <Label className={"cursor-pointer"} htmlFor={`g1-${nurseNumber}`}>
                Male
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem
                className={"cursor-pointer"}
                value="Female"
                id={`g2-${nurseNumber}`}
              />
              <Label className={"cursor-pointer"} htmlFor={`g2-${nurseNumber}`}>
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>

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
                className={"cursor-pointer"}
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
                className={"cursor-pointer"}
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

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
        <div className="flex-1">
          <Label className={"mb-2"}>Can you drive?</Label>
          <RadioGroup
            value={String(data.canDrive)}
            onValueChange={(val) =>
              setData((p) => ({ ...p, canDrive: val === "true" }))
            }
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                className={"cursor-pointer"}
                value="true"
                id={`d1-${nurseNumber}`}
              />
              <Label className={"cursor-pointer"} htmlFor={`d1-${nurseNumber}`}>
                Yes
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem
                className={"cursor-pointer"}
                value="false"
                id={`d2-${nurseNumber}`}
              />
              <Label className={"cursor-pointer"} htmlFor={`d2-${nurseNumber}`}>
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex-1 ">
          <Label className={"mb-2"}>Preferred Role?</Label>
          <RadioGroup
            value={data.preferredRole}
            onValueChange={(val) =>
              setData((p) => ({ ...p, preferredRole: val }))
            }
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                className={"cursor-pointer"}
                value="Medical Nurse"
                id={`r3-${nurseNumber}`}
              />
              <Label className={"cursor-pointer"} htmlFor={`r3-${nurseNumber}`}>
                Medical Nurse
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem
                className={"cursor-pointer"}
                value="Nurse Aide"
                id={`r4-${nurseNumber}`}
              />
              <Label className={"cursor-pointer"} htmlFor={`r4-${nurseNumber}`}>
                Nurse Aide
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="py-6">
        <Label className={"mb-3"}>Languages</Label>
        <div className="flex flex-wrap gap-4">
          {languages.map((lan, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Checkbox
                className={"cursor-pointer"}
                id={lan.value}
                checked={data.languages.includes(lan.value)}
                onCheckedChange={() => toggleArray("languages", lan.value)}
              />
              <Label htmlFor={lan.value} className={"cursor-pointer"}>
                {lan.text}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <FileUpload
        title="Education Certificate (Compulsory)"
        accept="application/pdf,image/*"
        icon={<FileText size={32} />}
        file={data.educationCertificate}
        onFileSelect={(file) =>
          setData((p) => ({ ...p, educationCertificate: file }))
        }
      />

      <div className="my-6">
        <Label className={"mb-2"}>
          Are you registered with the Nursing Council of Kenya?
        </Label>
        <RadioGroup
          value={String(data.isNursingInKenya)}
          onValueChange={(val) =>
            setData((p) => ({ ...p, isNursingInKenya: val === "true" }))
          }
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem
              className="cursor-pointer"
              value="true"
              id={`n1-${nurseNumber}`}
            />
            <Label className="cursor-pointer" htmlFor={`n1-${nurseNumber}`}>
              Yes
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem
              className="cursor-pointer"
              value="false"
              id={`n2-${nurseNumber}`}
            />
            <Label className="cursor-pointer" htmlFor={`n2-${nurseNumber}`}>
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {data.isNursingInKenya && (
        <div>
          <Input
            label={"Registration Number"}
            placeholder="Registration Number"
            type="number"
            value={data.registrationNumber || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                registrationNumber: e.target.value,
              }))
            }
          />

          <div className="mt-6">
            <FileUpload
              title="Practising License"
              accept="application/pdf,image/*"
              icon={<FileText size={32} />}
              file={data.practiceLicense}
              onFileSelect={(file) =>
                setData((prev) => ({
                  ...prev,
                  practiceLicense: file,
                }))
              }
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <Label className={"mb-2"}>Hospital Based Care</Label>
        <RadioGroup
          value={String(data.hospitalBasedCare)}
          onValueChange={(val) =>
            setData((p) => ({ ...p, hospitalBasedCare: val === "true" }))
          }
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem
              className="cursor-pointer"
              value="true"
              id={`hb1-${nurseNumber}`}
            />
            <Label className="cursor-pointer" htmlFor={`hb1-${nurseNumber}`}>
              Yes
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem
              className="cursor-pointer"
              value="false"
              id={`hb2-${nurseNumber}`}
            />
            <Label className="cursor-pointer" htmlFor={`hb2-${nurseNumber}`}>
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {data.hospitalBasedCare === true && (
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

      <div>
        <Label className={"mb-2"}>Home Based Care</Label>
        <RadioGroup
          value={String(data.homeBasedCare)}
          onValueChange={(val) =>
            setData((p) => ({ ...p, homeBasedCare: val === "true" }))
          }
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem
              className="cursor-pointer"
              value="true"
              id={`hb3-${nurseNumber}`}
            />
            <Label className="cursor-pointer" htmlFor={`hb3-${nurseNumber}`}>
              Yes
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem
              className="cursor-pointer"
              value="false"
              id={`hb4-${nurseNumber}`}
            />
            <Label className="cursor-pointer" htmlFor={`hb4-${nurseNumber}`}>
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {data?.homeBasedCare === true && (
        <div className="flex flex-col mt-6 sm:flex-row gap-4">
          <Input
            type="number"
            label="Years of experience"
            name="homeBasedYearsOfExperience"
            placeholder="Home based experience"
            value={data?.homeBasedYearsOfExperience}
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

      <div>
        <Label className="mb-2 mt-4 block">Do you have experience in : </Label>
        <div className="flex flex-col gap-3">
          {skills.map((skill, idx) => {
            const id = `service-${idx}`;
            return (
              <div key={idx} className="flex gap-2">
                <Checkbox
                  id={id}
                  className="cursor-pointer"
                  checked={data.skills.includes(skill.name)}
                  onCheckedChange={() => toggleArray("skills", skill.name)}
                />
                <Label htmlFor={id} className="cursor-pointer">
                  {skill?.name}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

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

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Service Fee (Per Day - KSh)"
          type="number"
          name="serviceFeeDay"
          maxLength={5}
          placeholder="e.g., 1500"
          onKeyDown={blockInvalidKeys} 
          value={data.serviceFeeDay}
          onChange={(e) => {
            const value = e.target.value;
            setData((prev) => ({
              ...prev,
              serviceFeeDay: value === "" ? "" : Math.max(0, Number(value)), 
            }));
          }}
        />

        <Input
          label="Service Fee (Per Month - KSh)"
          type="number"
          name="serviceFeeMonth"
          maxLength={6}
          placeholder="e.g., 35000"
          onKeyDown={blockInvalidKeys} 
          value={data.serviceFeeMonth}
          onChange={(e) => {
            const value = e.target.value;
            setData((prev) => ({
              ...prev,
              serviceFeeMonth: value === "" ? "" : Math.max(0, Number(value)), 
            }));
          }}
        />
      </div>

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

export default NurseDetails;
