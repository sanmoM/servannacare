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

const SpecialNeedCaregiversUpdate = ({ data = {} }) => {
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
      degreeIn: data.education.degreeIn || "",
      diplomaIn: data.education.diplomaIn || "",
      isRegisterPCK: data.education.isRegisterPCK || "",
      registrationNumber: data.education.registrationNumber || "",
      practiceLicense: data.education.practiceLicense || null,
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
      preferred: data.experience.preferred || [],

      serviceFee: data.experience.serviceFee || "",
    },
    documents: {
      idCopy: data.documents.idCopy || null,
      profilePhoto: data.documents.profilePhoto || null,
      goodConductCertificate: data.documents.goodConductCertificate || null,
      drivingLicense: data.documents.drivingLicense || null,
      referenceLetter: data.documents.referenceLetter || null,
    },
  });

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

  const preferred = [
    {
      title: "Autism Spectrum Disorder (ASD)",
    },
    {
      title: "Speech therapy",
    },
    {
      title: "ADHD (Attention Deficit Hyperactivity Disorder)",
    },
    {
      title: "Cerebral palsy",
    },
    {
      title: "Down syndrome",
    },
    ,
    {
      title: "Blindness",
    },
    ,
    {
      title: "Dementia & Alzheimer",
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
        <h2 className="formHeading">Basic Information</h2>
        <div className="flex flex-col  md:flex-row md:gap-4 gap-6">
          <div className="flex-1">
            <Input
              placeholder="Name"
              name="name"
              label="Full Name (as per ID)"
                value={formData.basicInfo.name}
                onChange={(e) => 
                    handleChange("basicInfo","name",e.target.value)
                }
            />
          </div>

          <div className="flex-1">
            <Input
              type="number"
              placeholder="Your age"
              name="age"
              label="Age"
              maxLength={2}
                value={formData.basicInfo.age}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                  handleChange("basicInfo","age",val);
                }}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 ">
          <div className="flex-1">
            <Input
              label="Location"
              placeholder="Location"
              name="location"
                value={formData.basicInfo.location}
                onChange={(e) => handleChange("basicInfo","location",e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label className={"mb-2"}>Gender?</Label>
            <RadioGroup
              className={"flex gap-4"}
                value={formData.basicInfo.gender}
                onValueChange={(value) =>
                  handleChange("basicInfo", "gender", value)
                }
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

        <div className="">
          <Label className={"mb-3"}>Languages</Label>
          <div className="flex flex-wrap gap-4 ">
            {languages.map((lan, indx) => (
              <div key={indx} className="flex items-center gap-2">
                <Checkbox
                  id={lan.value}
                    checked={formData.basicInfo.languages.includes(lan.value)}
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
            value={formData.basicInfo.canDrive}
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

        {/* degree */}
        <div>
          <Label className="mb-3 block">Degree In</Label>
          <RadioGroup
            className="flex flex-col flex-wrap gap-2 mt-2"
            value={formData.education.degreeIn}
            onValueChange={(value) =>
              handleChange("education", "degreeIn", value)
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Special Needs Education (SNE)" id="edu1" />
              <Label htmlFor="edu1" className="text-gray-700 cursor-pointer">
                Special Needs Education (SNE)
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="Early Childhood Development (ECD) with SNE units"
                id="edu2"
              />
              <Label htmlFor="edu2" className="text-gray-700 cursor-pointer">
                Early Childhood Development (ECD) with SNE units
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* diploma  */}
        <div>
          <Label className="mb-3 block">Diploma In</Label>
          <RadioGroup
            className="flex flex-col flex-wrap gap-2 mt-2"
            value={formData.education.diplomaIn}
            onValueChange={(value) =>
              handleChange("education","diplomaIn",value)
            }
          >
            <div className="flex items-center  gap-2">
              <RadioGroupItem value="Special Needs Education (SNE)" id="edu3" />
              <Label htmlFor="edu3" className="text-gray-700 cursor-pointer">
                Special Needs Education (SNE)
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="Early Childhood Development (ECD) with SNE units"
                id="edu4"
              />
              <Label htmlFor="edu4" className="text-gray-700 cursor-pointer">
                Early Childhood Development (ECD) with SNE units
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
            // file={data.educationCertificate}
            onFileSelect={(file) =>
              handleFileSelect("education","educationCertificate", file)
            }
          />
        </div>

        {/* PCK Registration */}
        <div className="py-6">
          <Label className="mb-3 block">
            Are you registered with Physiotherapy Council of Kenya (PCK)?
          </Label>

          <RadioGroup
            className="flex gap-4"
            value={formData.education.isRegisterPCK}
            onValueChange={(value) => 
                handleChange("education","isRegisterPCK",value)
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="pckYes" />
              <Label htmlFor="pckYes">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="pckNo" />
              <Label htmlFor="pckNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Show only when PCK = Yes */}
        {data.isRegisterPCK === "Yes" && (
          <div>
            <Input
              label={"Registration Number"}
              placeholder="Registration Number"
              type="number"
                value={formData.education.registrationNumber || ""}
                onChange={(e) =>
                  handleChange("education", "registrationNumber", e.target.value)
                }
            />

            <div className="">
              <FileUpload
                title="Practising License"
                accept="application/pdf,image/*"
                icon={<FileText size={32} />}
                // file={formData.education.practiceLicense}
                onFileSelect={(file) =>
                  handleFileSelect("education","practiceLicense",file)
                }
              />
            </div>
          </div>
        )}

        {/* Exprience */}

        <h2 className="formHeading">Experience</h2>
        <div className="">
          <Label className="mb-3 block">Hospital Based Care</Label>
          <RadioGroup
            className="flex gap-x-4 flex-wrap "
            value={formData.experience.hospitalBasedCare}
            onValueChange={(value) =>
              handleChange("experience", "hospitalBasedCare", value)
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
        <div className="flex gap-6 sm:flex-row flex-col sm:gap-4">
          <Input
            type={"number"}
            label="Years of experience"
            name="hospitalBasedYearsOfExperience"
            placeholder="Experience"
            maxLength={2}
            value={formData.experience.hospitalBasedYearsOfExperience}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 2);
              handleChange("experience","hospitalBasedYearsOfExperience",val);
            }}
          />
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

        <div className="">
          <Label className="mb-3 block">Home Based Care</Label>
          <RadioGroup
            className="flex gap-x-4 flex-wrap "
            value={formData.experience.homeBasedCare}
            onValueChange={(value) =>
              handleChange("experience", "homeBasedCare", value)
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="d3" />
              <Label
                htmlFor="d3"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="d4" />
              <Label
                htmlFor="d4"
                className="text-gray-700 font-normal cursor-pointer"
              >
                No
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex gap-6 sm:flex-row flex-col sm:gap-4">
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

        <div className="">
          <Label className={"mb-3"}>
            What are your preferred areas of intervention
          </Label>
          <div className="flex flex-wrap flex-col gap-2 ">
            {preferred.map((lan, indx) => (
              <div key={indx} className="flex items-center gap-2">
                <Checkbox
                  id={lan.title}
                    checked={formData.experience.preferred.includes(lan.title)}
                    onCheckedChange={() => toggleArrayItem("experience","preferred",lan.title)}
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

        {/* Service Fee */}
        <div className="mt-6">
          <Input
            label="Service Fee (KSh per day/month)"
            type="number"
            name="serviceFee"
            maxLength={5}
            placeholder="e.g., 1500 per day or 35000 per month"
            value={formData.experience.serviceFee}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 5);
              handleChange("experience","serviceFee",val);
            }}
          />
        </div>
        <h2 className="formHeading">Document Uploads</h2>
        <div className="p-3 bg-primary/20 my-6 rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>
        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2  gap-4">
          {documents.map((item, indx) => {
            return (
              <FileUpload
                key={indx}
                title={item.title}
                accept={item.accept}
                icon={item.icon}
                optional={item.optional || false}
                // file={files[item.id]}
                onFileSelect={(file) => handleFileSelect("documents",item.id,file)}
              />
            );
          })}
        </div>
        {/* submit button  */}
        <div className="">
          <Button
            className={"w-full sm:absolute sm:b-0 sm:mt-4 sm:w-auto"}
            size={"lg"}
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SpecialNeedCaregiversUpdate;
