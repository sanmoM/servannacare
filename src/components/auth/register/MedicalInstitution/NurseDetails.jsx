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
import FileUpload from "../FileUpload";
import { Button } from "@/components/ui/button";

const NurseDetails = ({
  nurseNumber = 1,
  onDataChange,
  defaultValues = {},
}) => {
  //   document types
  const documents = [
    {
      id: 1,
      title: "First Aid Certificate",
      accept: "application/pdf,image/*",
      icon: <Cross size={32} />,
    },
    {
      id: 2,
      title: "Good Conduct Certificate / Letter from Chief",
      accept: "application/pdf,image/*",
      icon: <FileText size={32} />,
    },
    {
      id: 3,
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
    },
    {
      id: 4,
      title: "Profile Photo",
      accept: "image/*",
      icon: <Camera size={32} />,
    },
    {
      id: 5,
      title: "Driving License (Optional)",
      accept: "application/pdf,image/*",
      icon: <IdCard size={32} />,
      optional: true,
    },
  ];

  const skills = [
    "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
    "Vital Signs Monitoring(checking blood pressure, blood sugar, pulse, temperature, etc.",
    "Medical Assistance: (assisting nurses with wound care, administering medication (in some cases)",
    "Compassion & Communication Skills",
    "Special needs children caregiving",
    "Elderly caregiving",
    "Handiling Medical Quipment (e. g. fedding tubes, catheter, oxygen tanks)",
  ];

  //   // local nurse data
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
    skills: { cooking: "", housekeeping: "", childcare: "" },
    liveType: "",
    documents: {},
    ...defaultValues,
  });

  useEffect(() => {
    setData((prev) => ({ ...prev, ...defaultValues }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   // send up on change
  //   useEffect(() => {
  //     onDataChange && onDataChange(data);
  //   }, [data]);

  //   useEffect(() => {
  //     if (onDataChange) {
  //       onDataChange(data);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [JSON.stringify(data)]);

  //   // generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  //   // select change
  //   const handleSelect = (name, value) => {
  //     setData((prev) => ({ ...prev, [name]: value }));
  //   };

  //   // radio change
  //   const handleRadio = (name, value) => {
  //     setData((prev) => ({ ...prev, [name]: value }));
  //   };

  //   // checkbox toggle for arrays
  //   const toggleArray = (name, value) => {
  //     setData((prev) => {
  //       const exists = prev[name].includes(value);
  //       return {
  //         ...prev,
  //         [name]: exists
  //           ? prev[name].filter((v) => v !== value)
  //           : [...prev[name], value],
  //       };
  //     });
  //   };

  //   // file upload
  //   const handleFileSelect = (id, file) => {
  //     setData((prev) => ({
  //       ...prev,
  //       documents: {
  //         ...prev.documents,
  //         [id]: file,
  //       },
  //     }));
  //   };

  //   // skill change
  //   const handleSkillChange = (skill, value) => {
  //     setData((prev) => ({
  //       ...prev,
  //       skills: { ...prev.skills, [skill]: value },
  //     }));
  //   };

  return (
    <div>
      <h2 className="formHeading mb-4">Nurse Details</h2>

      <h2 className="text-base font-semibold text-gray-700 border-primary border-b mb-6">
        Nurse #{nurseNumber}
      </h2>

      <div className="flex flex-col pb-6  md:flex-row md:gap-4 gap-6">
        <div className="flex-1">
          <Input
            placeholder="Name"
            name="name"
            label="Full Name (as per ID)"
            // value={data.name}
            // onChange={handleChange}
          />
        </div>

        <div className="flex-1">
          <Input
            type="number"
            placeholder="Your age"
            name="age"
            label="Age"
            maxLength={2}
            // value={data.age}
            // onChange={(e) => {
            //   const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            //   handleChange({ target: { name: "age", value: val } });
            // }}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 ">
        <div className="flex-1">
          <Input
            label="Location"
            placeholder="Location"
            name="location"
            // value={data.location}
            // onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Label className={"mb-2"}>Gender?</Label>
          <RadioGroup
            className={"flex gap-4"}
            // value={data.gender}
            // onValueChange={(value) =>
            //   setData((prev) => ({ ...prev, gender: value }))
            // }
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
      </div>

      <div className="py-8">
        <Label className={"mb-3"}>Languages</Label>
        <div className="flex flex-wrap gap-4 ">
          {languages.map((lan, indx) => (
            <div key={indx} className="flex items-center gap-2">
              <Checkbox
                id={lan.value}
                // checked={data.languages.includes(lan.value)}
                // onCheckedChange={() => toggleLanguage(lan.value)}
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

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
        <div className="flex-1">
          <Label className="mb-3 block">Can you drive?</Label>
          <RadioGroup
            className="flex gap-4 "
            //   value={data.canDrive}
            //   onValueChange={(value) =>
            //     setData((prev) => ({ ...prev, canDrive: value }))
            //   }
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

        <div className="flex-1">
          <Label className="mb-3 block">Your Role?</Label>
          <RadioGroup
            className="flex gap-4 "
            //   value={data.canDrive}
            //   onValueChange={(value) =>
            //     setData((prev) => ({ ...prev, canDrive: value }))
            //   }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Medical Nurse" id="d3" />
              <Label
                htmlFor="d3"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Medical Nurse
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Nurse Aide " id="d4" />
              <Label
                htmlFor="d4"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Nurse AIde
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Education Level */}
      <div className="my-6">
        <Label className="mb-3 block">Level of Education</Label>
        <RadioGroup
          className="flex flex-wrap gap-4 mt-2"
          //   value={data.education}
          //   onValueChange={(value) =>
          //     setData((prev) => ({ ...prev, education: value }))
          //   }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Diploma In Nursing" id="edu1" />
            <Label htmlFor="edu1" className="text-gray-700 cursor-pointer">
              Diploma In Nursing
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem value="Degree In Nursing" id="edu2" />
            <Label htmlFor="edu2" className="text-gray-700 cursor-pointer">
              Degree In Nursing
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* File Upload */}
      <div>
        <FileUpload
          title="Education Certificate (Compulsory)"
          accept="application/pdf,image/*"
          icon={<FileText size={32} />}
          optional=""
          file={data.educationCertificate}
          onFileSelect={(file) =>
            handleFileSelect("educationCertificate", file)
          }
        />
      </div>

      {/* Nursing Council */}
      <div className="my-6">
        <Label className="mb-3 block">
          Are you registered with the Nursing Council of Kenya?
        </Label>
        <RadioGroup
          className="flex gap-4 mt-2"
          value={data.isNursingInKenya}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, isNursingInKenya: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="kenya1" />
            <Label htmlFor="kenya1" className="text-gray-700 cursor-pointer">
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="kenya2" />
            <Label htmlFor="kenya2" className="text-gray-700 cursor-pointer">
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Hospital Based Care */}
      <div>
        <Label className="mb-2 block">Hospital Based Care</Label>
        <RadioGroup
          className="flex gap-4 mt-2"
          value={data.hospitalBasedCare}
          onValueChange={(value) =>
            setData((prev) => ({ ...prev, hospitalBasedCare: value }))
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="r1" />
            <Label
              htmlFor="r1"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yo" id="r2" />
            <Label
              htmlFor="r2"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col mb-8 mt-6 sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="number"
            label="Years of experience"
            name="hospitalBasedYearsOfExperience"
            placeholder="Experience"
            maxLength={2}
            // value={data.hospitalBasedYearsOfExperience}
            // onChange={(e) => {
            //   const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            //   handleChange({
            //     target: { name: "hospitalBasedYearsOfExperience", value: val },
            //   });
            // }}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Reference contact"
            name="hospitalBasedReferenceContact"
            placeholder="Reference"
            maxLength={2}
            // value={data.hospitalBasedReferenceContact}
            // onChange={handleChange}
          />
        </div>
      </div>

      {/* Home Based Care */}
      <div>
        <Label className="mb-2 block">Home Based Care</Label>
        <RadioGroup
          className="flex gap-4 mt-2"
          //   value={data.homeBasedCare}
          //   onValueChange={(value) =>
          //     setData((prev) => ({ ...prev, homeBasedCare: value }))
          //   }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="r3" />
            <Label
              htmlFor="r3"
              className="text-gray-700 font-normal cursor-pointer"
            >
              Yes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="r4" />
            <Label
              htmlFor="r4"
              className="text-gray-700 font-normal cursor-pointer"
            >
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col mt-6 sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type={"number"}
            label="Years of experience"
            name="homeBasedYearsOfExperience"
            placeholder="Experience"
            maxLength={2}
            // value={data.homeBasedYearsOfExperience}
            // onChange={(e) => {
            //   const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            //   handleChange({
            //     target: { name: "homeBasedYearsOfExperience", value: val },
            //   });
            // }}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Reference contact"
            name="homeBasedReferenceContact"
            placeholder="Reference"
            // value={data.homeBasedReferenceContact}
            // onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 mt-4 block">Do you have experience in :</Label>
        <div className="flex flex-col gap-3">
          {skills.map((area, idx) => (
            <div key={idx} className="flex gap-2">
              <Checkbox
                id={area}
                // checked={data.skills.includes(area)}
                // onCheckedChange={() => toggleSkill(area)}
              />
              <Label
                htmlFor={area}
                className="text-gray-700 font-normal cursor-pointer"
              >
                {area}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NurseDetails;
