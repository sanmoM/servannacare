import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useLocalUser from "@/hooks/useLocalUser";
import { languages } from "@/utilities/data";
import {
  Camera,
  FileCheckCorner,
  FileText,
  IdCard,
  IdCardLanyard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const NurseUpdate = ({ data = {} }) => {
  const router = useRouter();
  const { user } = useLocalUser();
  const [formData, setFormData] = useState({
    basicInfo: {
      name: data.basicInfo.name || "",
      location: data.basicInfo.location || "",
      age: data.basicInfo.age || "",
      gender: data.basicInfo.gender || "",
      languages: data.basicInfo.languages || [],
      canDrive: data.basicInfo.canDrive || "",
    },
    education: {
      education: data.education.education || "",
      isNursingInKenya: data.education.isNursingInKenya || "",
      educationCertificate: data.education.educationCertificate || null,
    },
    experience: {
      hospitalBasedCare: data.experience.hospitalBasedCare || "",
      hospitalBasedYearsOfExperience:
        data.experience.hospitalBasedYearsOfExperience || "",
      hospitalBasedReferenceContact:
        data.experience.hospitalBasedReferenceContact || "",
      homeBasedCare: data.experience.homeBasedCare || "",
      homeBasedYearsOfExperience:
        data.experience.homeBasedYearsOfExperience || "",
      homeBasedReferenceContact:
        data.experience.homeBasedReferenceContact || "",
    },
    skillsServices: {
      skills: data.skillsServices.skills || [],
      // interested: data.skillsServices.interested || [],
      mobilityYears: data.skillsServices.mobilityYears || "",
      bathingYears: data.skillsServices.bathingYears || "",
      feedingYears: data.skillsServices.feedingYears || "",
      serviceFee: data.skillsServices.serviceFee || "",
    },
    documents: {
      idCopy: data.documents.idCopy || null,
      profilePhoto: data.documents.profilePhoto || null,
      goodConductCertificate: data.documents.goodConductCertificate || null,
      drivingLicense: data.documents.drivingLicense || null,
      referenceLetter: data.documents.referenceLetter || null,
    },
  });

  const skills = [
    "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
    "Vital Signs Monitoring(checking blood pressure, blood sugar, pulse, temperature, etc.",
    "Medical Assistance: Aassisting nurses with wound care, administering medication (in some cases)",
    "Compassion & Communication Skills",
    "Special needs children caregiving",
    "Elderly caregiving",
    "Handiling Medical Quipment (e. g. fedding tubes, catheter, oxygen tanks)",
  ];

  const documents = [
    {
      id: "idCopy",
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
      required: true,
    },
    {
      id: "profilePhoto",
      title: "Profile Photo",
      accept: "image/*",
      icon: <Camera size={32} />,
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
      id: "drivingLicense",
      title: "Driving License (Optional)",
      accept: "application/pdf,image/*",
      icon: <IdCard size={32} />,
      required: false,
      optional: true,
    },
    {
      id: "referenceLetter",
      title: "Reference Letter (Optional)",
      accept: "application/pdf,image/*",
      icon: <FileCheckCorner size={32} />,
      required: false,
      optional: true,
    },
  ];

  const handleChange = (section, field, value) => {
    setFormData((p) => ({
      ...p,
      [section]: { ...p[section], [field]: value },
    }));
  };

  const toggleArrayItem = (section, field, item) => {
    setFormData((prev) => {
      const arr = prev[section][field];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: arr.includes(item)
            ? arr.filter((i) => i !== item)
            : [...arr, item],
        },
      };
    });
  };

  const handleFileSelect = (section, field, file) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: file },
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem("specialist", JSON.stringify(formData));
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        name: formData.basicInfo.name,
        location: formData.basicInfo.location,
      })
    );
    toast.success("Profile Updated!");
    router.push("/dashboard");
  };

  return (
    <div>
      <form onSubmit={handleUpdate} className="space-y-6 relative">
        {/* basic info  */}

        <h4 className="formHeading">Basic Information</h4>

        {/* Name + Location */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
          <div className="flex-1">
            <Input
              label="Full Name (as per ID)"
              name="name"
              placeholder="Enter your name"
              value={formData.basicInfo?.name}
              onChange={(e) =>
                handleChange("basicInfo", "name", e.target.value)
              }
            />
          </div>
          <div className="flex-1">
            <Input
              label="Your Location"
              name="location"
              placeholder="Type your location.."
              value={formData.basicInfo?.location}
              onChange={(e) =>
                handleChange("basicInfo", "location", e.target.value)
              }
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
              maxLength={2}
              value={formData.basicInfo?.age}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange("basicInfo", "age", val);
              }}
            />
          </div>

          <div className="flex-1">
            <Label className="mb-3 block">Gender</Label>
            <RadioGroup
              className="flex gap-4 mt-2"
              value={formData.basicInfo?.gender}
              onValueChange={(value) =>
                handleChange("basicInfo", "gender", value)
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
        </div>

        {/* Languages */}
        <div>
          <Label className="font-medium mb-3 text-gray-700">Languages</Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {languages.map((lan) => (
              <div key={lan.id} className="flex items-center gap-2">
                <Checkbox
                  id={lan.value}
                  checked={formData.basicInfo?.languages.includes(lan.value)}
                  onCheckedChange={() =>
                    toggleArrayItem("basicInfo", "languages", lan.value)
                  }
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
            value={formData.basicInfo?.canDrive}
            onValueChange={(value) =>
              handleChange("basicInfo", "canDrive", value)
            }
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

        {/* education  */}

        <h4 className="formHeading">Education & Registration</h4>

        {/* Education Level */}
        <div>
          <Label className="mb-3 block">Level of Education</Label>
          <RadioGroup
            className="flex flex-wrap gap-4 mt-2"
            value={formData.education.education}
            onValueChange={(value) =>
              handleChange("education", "education", value)
            }
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
            // file={formData.education?.educationCertificate && formData.education?.educationCertificate }
            onFileSelect={(file) =>
              handleFileSelect("education", "educationCertificate", file)
            }
          />
        </div>

        {/* Nursing Council */}
        <div>
          <Label className="mb-3 block">
            Are you registered with the Nursing Council of Kenya?
          </Label>
          <RadioGroup
            className="flex gap-4 mt-2"
            value={formData.education.isNursingInKenya}
            onValueChange={(value) =>
              handleChange("education", "isNursingInKenya", value)
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

        {/* experience */}

        <h4 className="formHeading">Experience</h4>

        {/* Hospital Based Care */}
        <div>
          <Label className="mb-2 block">Hospital Based Care</Label>
          <RadioGroup
            className="flex gap-4 mt-2"
            value={formData.experience.hospitalBasedCare}
            onValueChange={(value) =>
              handleChange("experience", "hospitalBasedCare", value)
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="hos1" />
              <Label
                htmlFor="hos1"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="hos2" />
              <Label
                htmlFor="hos2"
                className="text-gray-700 font-normal cursor-pointer"
              >
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col mb-8 sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="number"
              label="Years of experience"
              name="hospitalBasedYearsOfExperience"
              placeholder="Experience"
              maxLength={2}
              value={formData.experience.hospitalBasedYearsOfExperience}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange(
                  "experience",
                  "hospitalBasedYearsOfExperience",
                  val
                );
              }}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Reference contact"
              name="hospitalBasedReferenceContact"
              placeholder="Reference"
              value={formData.experience.hospitalBasedReferenceContact}
              onChange={(e) =>
                handleChange(
                  "experience",
                  "hospitalBasedReferenceContact",
                  e.target.value
                )
              }
            />
          </div>
        </div>

        {/* Home Based Care */}
        <div>
          <Label className="mb-2 block">Home Based Care</Label>
          <RadioGroup
            className="flex gap-4 mt-2"
            value={formData.experience.homeBasedCare}
            onValueChange={(value) =>
              handleChange("experience", "homeBasedCare", value)
            }
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

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type={"number"}
              label="Years of experience"
              name="homeBasedYearsOfExperience"
              placeholder="Experience"
              maxLength={2}
              value={formData.experience.homeBasedYearsOfExperience}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange("experience", "homeBasedYearsOfExperience", val);
              }}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Reference contact"
              name="homeBasedReferenceContact"
              placeholder="Reference"
              value={formData.experience.homeBasedReferenceContact}
              onChange={(e) =>
                handleChange(
                  "experience",
                  "homeBasedReferenceContact",
                  e.target.value
                )
              }
            />
          </div>
        </div>

        {/* skill and services  */}

        {/* Skills Section */}
        <div>
          <h2 className="formHeading mb-4">Skills & Services</h2>
          <div>
            <Label className="mb-2 mt-4 block">
              Do you have experience in :
            </Label>
            <div className="flex flex-col gap-3">
              {skills.map((area, idx) => (
                <div key={idx} className="flex gap-2">
                  <Checkbox
                    id={area}
                    checked={formData.skillsServices.skills.includes(area)}
                    onCheckedChange={() =>
                      toggleArrayItem("skillsServices", "skills", area)
                    }
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

        {/* Additional Experience */}
        <div>
          <h2 className="formHeading mb-4 mt-6">Years Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Mobility Assistance (Years)"
              type="number"
              name="mobilityYears"
              maxLength={2}
              placeholder="00"
              value={formData.skillsServices.mobilityYears}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                  handleChange("skillsServices","mobilityYears",val);
                }}
            />
            <Input
              label="Bathing Assistance (Years)"
              type="number"
              name="bathingYears"
              maxLength={2}
              placeholder="00"
              value={formData.skillsServices.bathingYears}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                   handleChange("skillsServices","bathingYears",val);
                }}
            />
            <Input
              label="Feeding Assistance (Years)"
              type="number"
              name="feedingYears"
              maxLength={2}
              placeholder="00"
              value={formData.skillsServices.feedingYears}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                  handleChange("skillsServices","feedingYears",val);
                }}
            />
          </div>
        </div>

        {/* Service Fee */}
        <div className="mt-4">
          <Input
            label="Service Fee (KSh per day/month)"
            type="number"
            name="serviceFee"
            maxLength={5}
            placeholder="e.g., 1500 per day or 35000 per month"
            value={formData.skillsServices.serviceFee}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 5);
               handleChange("skillsServices","serviceFee",val);
            }}
          />
        </div>

        <h2 className="formHeading mb-4">Document Uploads</h2>

        <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center mb-4">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <FileUpload
              key={doc.id}
              title={doc.title}
              accept={doc.accept}
              icon={doc.icon}
              optional={doc.optional || false}
              //   file={files[doc.id]}
              onFileSelect={(file) =>
                handleFileSelect("documents", doc.id, file)
              }
            />
          ))}
        </div>

        {/* submit button  */}
        <div className="absolute b-0 mt-4">
          <Button size={"lg"} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NurseUpdate;
