import FilePreview from "@/components/auth/register/FilePreview";
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
import { postApi } from "@/lib/apiHandler";

const NurseAideCreate = ({ data = {} }) => {
  console.log("datas", data);
  const router = useRouter();
  const { user } = useLocalUser();
  const [formData, setFormData] = useState({
    basicInfo: {
      name: data?.name || "",
      location: data?.location || "",
      age: data?.age || "",
      gender: data?.gender || "",
      languages: data?.languages || [],
      canDrive:
        data?.canDrive === undefined || data?.canDrive === null
          ? null
          : Boolean(data?.canDrive),
    },
    education: {
      education: data.education || "",
      //   isNursingInKenya: data.education.isNursingInKenya || "",
      educationCertificate: data?.nurse_assistant?.educationCertificate || null,
    },
    experience: {
      hospitalBasedCare: data.hospitalBasedCare || "",
      hospitalBasedYearsOfExperience: data.hospitalBasedYearsOfExperience || "",
      hospitalBasedReferenceContact: data.hospitalBasedReferenceContact || "",
      homeBasedCare: data.homeBasedCare || "",
      homeBasedYearsOfExperience: data.homeBasedYearsOfExperience || "",
      homeBasedReferenceContact: data.homeBasedReferenceContact || "",
      preferred: data.preferred || [],
    },
    skillsServices: {
      skills: data?.nurse_assistant?.skills || [],
      // interested: data.skillsServices.interested || [],
      mobilityYears: data.nurse_assistant?.mobilityYears || "",
      bathingYears: data.nurse_assistant?.bathingYears || "",
      feedingYears: data.nurse_assistant?.feedingYears || "",
      serviceFeeDay: data.nurse_assistant?.serviceFeeDay || "",
      serviceFeeMonth: data.nurse_assistant?.serviceFeeMonth || "",
    },
    documents: {
      idCopy: data.idCopy || null,
      profilePhoto: data.profilePhoto || null,
      goodConductCertificate: data.goodConductCertificate || null,
      drivingLicense: data.drivingLicense || null,
      referenceLetter: data.referenceLetter || null,
    },
  });
  console.log(formData?.basicInfo?.languages);

  const preferred = [
    {
      title: "Pre and post pregnancy care",
    },
    {
      title: "Post surgery cage",
    },
    {
      title: "Elderly care",
    },
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
  const skills = [
    "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
    "Vital Signs Monitoring (checking blood pressure, blood sugar, pulse, temperature, etc.)",
    "Compassion & Strong Communication Skills",
    "Special needs caregiver (e.g., autistic, deaf, blind)",
    "Elderly caregiving",
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      const BASIC = formData.basicInfo;
      const EDU = formData.education;
      const EXP = formData.experience;
      const SKILL = formData.skillsServices;
      const DOC = formData.documents;

      // ================= BASIC INFO =================
      fd.append("name", BASIC.name || "");
      fd.append("location", BASIC.location || "");
      fd.append("age", BASIC.age || "");
      fd.append("gender", BASIC.gender || "");

      if (Array.isArray(BASIC.languages)) {
        BASIC.languages.forEach((lang) => fd.append("languages[]", lang));
      }

      fd.append("canDrive", BASIC.canDrive ? 1 : 0);

      // ================= EDUCATION =================
      fd.append("education", EDU.education || "");

      if (EDU.educationCertificate) {
        fd.append("educationCertificate", EDU.educationCertificate);
      }

      // ================= EXPERIENCE =================
      fd.append("hospitalBasedCare", EXP.hospitalBasedCare ? 1 : 0);
      fd.append(
        "hospitalBasedYearsOfExperience",
        EXP.hospitalBasedYearsOfExperience || "",
      );
      fd.append(
        "hospitalBasedReferenceContact",
        EXP.hospitalBasedReferenceContact || "",
      );

      fd.append("homeBasedCare", EXP.homeBasedCare ? 1 : 0);
      fd.append(
        "homeBasedYearsOfExperience",
        EXP.homeBasedYearsOfExperience || "",
      );
      fd.append(
        "homeBasedReferenceContact",
        EXP.homeBasedReferenceContact || "",
      );

      if (Array.isArray(EXP.preferred)) {
        EXP.preferred.forEach((pref) => fd.append("preferred[]", pref));
      }

      // ================= SKILLS & SERVICES =================
      if (Array.isArray(SKILL.skills)) {
        SKILL.skills.forEach((skill) => fd.append("skills[]", skill));
      }

      fd.append("mobilityYears", SKILL.mobilityYears || "");
      fd.append("bathingYears", SKILL.bathingYears || "");
      fd.append("feedingYears", SKILL.feedingYears || "");
      fd.append("serviceFeeDay", SKILL.serviceFeeDay || "");
      fd.append("serviceFeeMonth", SKILL.serviceFeeMonth || "");

      // ================= DOCUMENTS =================
      if (DOC.idCopy) fd.append("idCopy", DOC.idCopy);
      if (DOC.profilePhoto) fd.append("profilePhoto", DOC.profilePhoto);
      if (DOC.goodConductCertificate)
        fd.append("goodConductCertificate", DOC.goodConductCertificate);
      if (DOC.drivingLicense) fd.append("drivingLicense", DOC.drivingLicense);
      if (DOC.referenceLetter)
        fd.append("referenceLetter", DOC.referenceLetter);

      // ================= API CALL =================
      const res = await postApi("/create-profile", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.status === 200) {
        toast.success("Profile Created Successfully!");

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name: BASIC.name,
            location: BASIC.location,
            is_profile_completed: Boolean(res?.data?.is_profile_completed),
            is_profile_verified: Boolean(res?.data?.is_profile_verified),
          }),
        );

        router.push("/dashboard");
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message || `Error: ${error.response.status}`,
        );
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
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
            className="flex gap-4"
            value={
              formData.basicInfo.canDrive === null
                ? ""
                : formData.basicInfo.canDrive
                  ? "true"
                  : "false"
            }
            onValueChange={(value) =>
              handleChange("basicInfo", "canDrive", value === "true")
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="true" id="d1" />
              <Label htmlFor="d1">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="false" id="d2" />
              <Label htmlFor="d2">No</Label>
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
            file={formData?.education?.educationCertificate}
            onFileSelect={(file) =>
              handleFileSelect("education", "educationCertificate", file)
            }
          />
        </div>

        {/* Nursing Council */}
        {/* <div>
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
        </div> */}

        {/* experience */}

        <h4 className="formHeading">Experience</h4>

        {/* Hospital Based Care */}
        <div className="py-2">
          <Label className="mb-3 block">Hospital Based Care</Label>

          <RadioGroup
            className="flex gap-x-4 flex-wrap"
            value={
              formData.experience?.hospitalBasedCare == null
                ? ""
                : formData.experience.hospitalBasedCare
                  ? "Yes"
                  : "No"
            }
            onValueChange={(value) =>
              handleChange("experience", "hospitalBasedCare", value === "Yes")
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

        {/* Show these inputs only if hospitalBasedCare = true */}
        {formData.experience?.hospitalBasedCare && (
          <div className="flex gap-6 sm:flex-row flex-col sm:gap-4 mt-4">
            <Input
              type="number"
              label="Years of experience"
              name="hospitalBasedYearsOfExperience"
              placeholder="Experience"
              maxLength={2}
              value={formData.experience.hospitalBasedYearsOfExperience || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange(
                  "experience",
                  "hospitalBasedYearsOfExperience",
                  val,
                );
              }}
            />

            <Input
              label="Reference contact"
              name="hospitalBasedReferenceContact"
              placeholder="Reference"
              value={formData.experience.hospitalBasedReferenceContact || ""}
              onChange={(e) =>
                handleChange(
                  "experience",
                  "hospitalBasedReferenceContact",
                  e.target.value,
                )
              }
            />
          </div>
        )}

        {/* Home Based Care */}
        <div className="py-2">
          <Label className="mb-3 block">Home Based Care</Label>

          <RadioGroup
            className="flex gap-x-4 flex-wrap"
            value={
              formData.experience?.homeBasedCare == null
                ? ""
                : formData.experience.homeBasedCare
                  ? "Yes"
                  : "No"
            }
            onValueChange={(value) =>
              handleChange("experience", "homeBasedCare", value === "Yes")
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

        {/* Show inputs only if homeBasedCare = true */}
        {formData.experience?.homeBasedCare && (
          <div className="flex gap-6 sm:flex-row flex-col sm:gap-4 mt-4">
            <Input
              type="number"
              label="Years of experience"
              name="homeBasedYearsOfExperience"
              placeholder="Experience"
              maxLength={2}
              value={formData.experience?.homeBasedYearsOfExperience || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange("experience", "homeBasedYearsOfExperience", val);
              }}
            />

            <Input
              label="Reference contact"
              name="homeBasedReferenceContact"
              placeholder="Reference"
              value={formData.experience?.homeBasedReferenceContact || ""}
              onChange={(e) =>
                handleChange(
                  "experience",
                  "homeBasedReferenceContact",
                  e.target.value,
                )
              }
            />
          </div>
        )}

        <div>
          <Label className={"mb-3"}>
            What are your preferred areas of intervention
          </Label>
          <div className="flex flex-wrap flex-col gap-2 ">
            {preferred.map((lan, indx) => (
              <div key={indx} className="flex items-center gap-2">
                <Checkbox
                  id={lan.title}
                  checked={formData.experience.preferred.includes(lan.title)}
                  onCheckedChange={() =>
                    toggleArrayItem("experience", "preferred", lan.title)
                  }
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

        {/* skill and services  */}

        {/* Skills Section */}
        <div>
          <h2 className="formHeading mb-4">Skills & Services</h2>
          <div>
            <Label className="mb-2 mt-4 block">
              Do you have experience in :
            </Label>
            <div className="flex flex-col gap-3">
              {skills?.map((area, idx) => (
                <div key={idx} className="flex gap-2">
                  <Checkbox
                    id={area}
                    checked={formData?.skillsServices?.skills.includes(area)}
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
                handleChange("skillsServices", "mobilityYears", val);
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
                handleChange("skillsServices", "bathingYears", val);
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
                handleChange("skillsServices", "feedingYears", val);
              }}
            />
          </div>
        </div>

        {/* Service Fee */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Service Fee (Per Day - KSh)"
            type="number"
            name="serviceFeeDay"
            maxLength={5}
            placeholder="e.g., 1500"
            value={formData?.skillsServices?.serviceFeeDay}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 5);
              handleChange("experience", "serviceFeeDay", val);
            }}
          />
          <Input
            label="Service Fee (Per Month - KSh)"
            type="number"
            name="serviceFeeMonth"
            maxLength={6}
            placeholder="e.g., 35000"
            value={formData?.skillsServices?.serviceFeeMonth}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 5);
              handleChange("experience", "serviceFeeMonth", val);
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

        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-4">
          {documents.map((item, indx) => (
            <div key={indx} className="border rounded-xl p-4">
              <FileUpload
                title={item.title}
                accept={item.accept}
                icon={item.icon}
                optional={item.optional || false}
                file={formData.documents[item.id]}
                onFileSelect={(file) =>
                  handleFileSelect("documents", item.id, file)
                }
              />

              {/* <FilePreview
                file={formData.documents[item.id]}
                alt={item.title}
              /> */}
            </div>
          ))}
        </div>

        {/* submit button  */}

        <div className="flex justify-end mt-4 b-0">
          {!user?.is_profile_completed && (
            <Button size={"lg"} type="submit">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NurseAideCreate;
