import FilePreview from "@/components/auth/register/FilePreview";
import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useLocalUser from "@/hooks/useLocalUser";
import { postApi } from "@/lib/apiHandler";
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

const NurseCreate = ({ data = {} }) => {
  const router = useRouter();
  const { user, loaded } = useLocalUser();
  const [formData, setFormData] = useState({
    basicInfo: {
      name: data?.name || "",
      location: data?.location || "",
      age: data?.age || "",
      gender: data?.gender || "",
      languages: data?.languages || [],
      canDrive: data?.canDrive === undefined ? null : Boolean(data.canDrive),
    },
    education: {
      education: data.education || "",

      isNursingInKenya:
        data?.nurse?.isNursingInKenya === undefined
          ? null
          : Boolean(data?.nurse?.isNursingInKenya),
    },

    experience: {
      hospitalBasedCare:
        data?.hospitalBasedCare === undefined
          ? null
          : Boolean(data.hospitalBasedCare),
      hospitalBasedYearsOfExperience:
        data?.hospitalBasedYearsOfExperience || "",
      hospitalBasedReferenceContact: data?.hospitalBasedReferenceContact || "",
      homeBasedCare:
        data?.homeBasedCare === undefined ? null : Boolean(data.homeBasedCare),
      homeBasedYearsOfExperience: data?.homeBasedYearsOfExperience || "",
      homeBasedReferenceContact: data?.homeBasedReferenceContact || "",
      preferred: data?.preferred || [],
      registrationNumber: data?.nurse?.registrationNumber || "",
      practiceLicense: data?.nurse?.practiceLicense || null,
      educationCertificate: data?.nurse?.educationCertificate || null,
    },

    skillsServices: {
      skills: data?.nurse?.skills || [],

      mobilityYears: data?.nurse?.mobilityYears || "",
      bathingYears: data?.nurse?.bathingYears || "",
      feedingYears: data?.nurse?.feedingYears || "",
      serviceFeeDay: data?.nurse?.serviceFeeDay || "",
      serviceFeeMonth: data?.nurse?.serviceFeeMonth || "",
    },
    documents: {
      idCopy: data.idCopy || null,
      profilePhoto: data.profilePhoto || null,
      goodConductCertificate: data.goodConductCertificate || null,
      drivingLicense: data.drivingLicense || null,
      referenceLetter: data.referenceLetter || null,
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

  const preferred = [
    {
      title: "Pre and post pregnancy care",
    },
    {
      title: "Post surgery cage",
    },
    {
      title: "Palliative care",
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

  const handleChange = (section, field, value) => {
    setFormData((p) => ({
      ...p,
      [section]: { ...p[section], [field]: value },
    }));
  };

  const toggleLanguage = (lan) => {
    setFormData((prev) => {
      const alreadySelected = prev.basicInfo.languages.includes(lan);

      return {
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          languages: alreadySelected
            ? prev.basicInfo.languages.filter((l) => l !== lan)
            : [...prev.basicInfo.languages, lan],
        },
      };
    });
  };

  const togglePreferred = (pref) => {
    setFormData((prev) => {
      const alreadySelected = prev.experience.preferred.includes(pref);

      return {
        ...prev,
        experience: {
          ...prev.experience,
          preferred: alreadySelected
            ? prev.experience.preferred.filter((p) => p !== pref)
            : [...prev.experience.preferred, pref],
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

  const togglepreferred = (pref) => {
    setFormData((prev) => {
      const alreadySelected = prev.preferred.includes(pref);
      return {
        ...prev,
        preferred: alreadySelected
          ? prev.preferred.filter((l) => l !== pref)
          : [...prev.preferred, pref],
      };
    });
  };

  const toggleArrayItem = (section, field, value) => {
    setFormData((prev) => {
      const arr = prev[section][field] || [];
      const exists = arr.includes(value);

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: exists ? arr.filter((v) => v !== value) : [...arr, value],
        },
      };
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (formData.experience.preferred.length === 0) {
      toast.error("Please select at least one preferred area");
      return;
    }

    if (formData?.basicInfo?.languages?.length === 0) {
      toast.error("Please select at least one language!");
      return;
    }
    // localStorage.setItem("specialist", JSON.stringify(formData));
    // localStorage.setItem(
    //   "user",
    //   JSON.stringify({
    //     ...user,
    //     name: formData.basicInfo.name,
    //     location: formData.basicInfo.location,
    //   }),
    // );
    // toast.success("Profile Updated!");
    //   console.log("create data", formData);

    const fd = new FormData();
    const BASICINFO = formData.basicInfo;
    const EDUCATION = formData.education;
    const EXPERIENCE = formData.experience;
    const SKILLSERVICES = formData.skillsServices;
    const DOCUMENTS = formData.documents;

    fd.append("name", BASICINFO.name);
    fd.append("location", BASICINFO.location);
    fd.append("age", BASICINFO.age);
    fd.append("experience", BASICINFO.experience);
    fd.append("gender", BASICINFO.gender);
    BASICINFO.languages.forEach((lang) => fd.append("languages[]", lang));
    fd.append("canDrive", BASICINFO.canDrive ? 1 : 0);

    fd.append("education", EDUCATION.education);
    fd.append("isNursingInKenya", EDUCATION.isNursingInKenya ? 1 : 0);
    fd.append("registrationNumber", EDUCATION.registrationNumber);

    fd.append("hospitalBasedCare", EXPERIENCE.hospitalBasedCare ? 1 : 0);
    fd.append(
      "hospitalBasedYearsOfExperience",
      EXPERIENCE.hospitalBasedYearsOfExperience,
    );
    fd.append(
      "hospitalBasedReferenceContact",
      EXPERIENCE.hospitalBasedReferenceContact,
    );
    fd.append("homeBasedCare", EXPERIENCE.homeBasedCare ? 1 : 0);
    fd.append(
      "homeBasedYearsOfExperience",
      EXPERIENCE.homeBasedYearsOfExperience,
    );
    fd.append(
      "homeBasedReferenceContact",
      EXPERIENCE.homeBasedReferenceContact,
    );
    EXPERIENCE.preferred.forEach((prep) => fd.append("preferred[]", prep));

    SKILLSERVICES.skills.forEach((skill) => fd.append("skills[]", skill));
    fd.append("mobilityYears", SKILLSERVICES.mobilityYears);
    fd.append("bathingYears", SKILLSERVICES.bathingYears);
    fd.append("feedingYears", SKILLSERVICES.feedingYears);
    fd.append("serviceFeeDay", SKILLSERVICES.serviceFeeDay);
    fd.append("serviceFeeMonth", SKILLSERVICES.serviceFeeMonth);

    if (DOCUMENTS?.idCopy) {
      fd.append("idCopy", DOCUMENTS.idCopy);
    }
    if (DOCUMENTS?.profilePhoto) {
      fd.append("profilePhoto", DOCUMENTS.profilePhoto);
    }
    if (DOCUMENTS?.goodConductCertificate) {
      fd.append("goodConductCertificate", DOCUMENTS.goodConductCertificate);
    }
    if (DOCUMENTS?.drivingLicense) {
      fd.append("drivingLicense", DOCUMENTS.drivingLicense);
    }
    if (DOCUMENTS?.referenceLetter) {
      fd.append("referenceLetter", DOCUMENTS.referenceLetter);
    }
    if (EDUCATION?.educationCertificate) {
      fd.append("educationCertificate", EDUCATION.educationCertificate);
    }
    if (EDUCATION?.practiceLicense) {
      fd.append("practiceLicense", EDUCATION.practiceLicense);
    }
    console.log("form data", formData);
    try {
      const res = await postApi("/create-profile", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("res", res);
      if (res?.status === 200) {
        toast.success("Registered Successfully!");
        router.push("/dashboard");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            is_profile_completed: Boolean(res?.data?.is_profile_completed),
            is_profile_verified: Boolean(res?.data?.is_profile_verified),
          }),
        );
      } else {
        toast.error(
          res?.data?.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message || `Error: ${error.response.status}`,
        );
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <h2>Create Profile Data</h2>
      <form onSubmit={handleCreate} className="space-y-6 relative">
        {/* basic info  */}

        <h4 className="formHeading">Basic Information</h4>

        {/* Name + Location */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
          <div className="flex-1">
            <Input
              label="Full Name (as per ID)"
              name="name"
              placeholder="Enter your name"
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
              onChange={(e) =>
                handleChange("basicInfo", "location", e.target.value)
              }
            />
          </div>
        </div>

        {/* Age */}
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-6 ">
          <div className="flex-1">
            <Input
              type="number"
              label="Age"
              name="age"
              placeholder="Your age"
              maxLength={2}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange("basicInfo", "age", val);
              }}
            />
          </div>

          <div className="flex-1 mt-2">
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
                  checked={formData?.basicInfo?.languages?.includes(lan.value)}
                  onCheckedChange={() => toggleLanguage(lan.value)}
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
              formData.basicInfo.canDrive === true
                ? "true"
                : formData.basicInfo.canDrive === false
                  ? "false"
                  : ""
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
            file={formData.education?.educationCertificate}
            onFileSelect={(file) =>
              handleFileSelect("education", "educationCertificate", file)
            }
          />
        </div>

        {/* Nursing Council */}
        <div className="">
          <Label className="mb-3 block">
            Are you registered with Nursing Council of Kenya (NCK)?
          </Label>

          <RadioGroup
            className="flex gap-4"
            value={
              formData.education.isNursingInKenya === null ||
              formData.education.isNursingInKenya === undefined
                ? ""
                : formData.education.isNursingInKenya
                  ? "true"
                  : "false"
            }
            onValueChange={(value) =>
              handleChange("education", "isNursingInKenya", value === "true")
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="true" id="pckYes" />
              <Label htmlFor="pckYes">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="false" id="pckNo" />
              <Label htmlFor="pckNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Show Registration Number & License only if PCK = Yes */}
        {formData.education.isNursingInKenya && (
          <div className="mt-6">
            <Input
              label="Registration Number"
              placeholder="Registration Number"
              type="text"
              value={formData.education?.registrationNumber || ""}
              onChange={(e) =>
                handleChange("education", "registrationNumber", e.target.value)
              }
            />

            <div className="mt-6">
              <FileUpload
                title="Practising License"
                accept="application/pdf,image/*"
                icon={<FileText size={32} />}
                file={formData.education.practiceLicense}
                onFileSelect={(file) =>
                  handleFileSelect("education", "practiceLicense", file)
                }
              />
            </div>
          </div>
        )}

        {/* experience */}

        <h2 className="formHeading">Experience</h2>
        <div className="py-2">
          <Label className="mb-3 block">Hospital Based Care</Label>

          <RadioGroup
            className="flex gap-x-4 flex-wrap"
            value={
              formData.experience?.hospitalBasedCare == null
                ? ""
                : formData.experience.hospitalBasedCare
                  ? "true"
                  : "false"
            }
            onValueChange={(value) =>
              handleChange("experience", "hospitalBasedCare", value === "true")
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="true" id="hos1" />
              <Label
                htmlFor="hos1"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="false" id="hos2" />
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
        <div className="py-6">
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

        {/* Skills Section */}
        <div>
          <h2 className="formHeading mb-4">Skills & Services</h2>
          {/* preferred */}

          <div>
            <Label className={"mb-3 mt-6"}>
              What are your preferred areas of intervention
            </Label>
            <div className="flex flex-wrap flex-col gap-2 ">
              {preferred.map((lan, indx) => (
                <div key={indx} className="flex items-center gap-2">
                  <Checkbox
                    id={lan.title}
                    checked={formData.experience.preferred.includes(lan.title)}
                    onCheckedChange={() => togglePreferred(lan.title)}
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
            value={formData?.skillsServices.serviceFeeDay}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 5);
              handleChange("skillsServices", "serviceFeeDay", val);
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
              handleChange("skillsServices", "serviceFeeMonth", val);
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

              <FilePreview
                file={formData.documents[item.id]}
                alt={item.title}
              />
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

export default NurseCreate;
