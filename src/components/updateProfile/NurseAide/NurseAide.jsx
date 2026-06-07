import FilePreview from "@/components/auth/register/FilePreview";
import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
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
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { useAuth } from "@/hooks/useAuth";
const NurseAideUpdate = ({ data = {} }) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [country, setCountry] = useState("KE");
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    basicInfo: {
      name: data?.name || "",
      location: data?.location || "",
      age: data?.age || "",
      gender: data?.gender || "",
      experience: data?.nurse_assistant?.experience || "",
      languages: data?.languages || [],
      canDrive:
        String(data?.canDrive) === "1" || String(data?.canDrive) === "true",
      number: data?.number || "",
      phone: data?.number_two || "",
      email: data?.email || "",
      bio: data?.bio || "",
    },
    education: {
      education: data.education || "",
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
      mobilityYears: data?.nurse_assistant?.mobilityYears || "",
      bathingYears: data?.nurse_assistant?.bathingYears || "",
      feedingYears: data?.nurse_assistant?.feedingYears || "",
      serviceFeeDay: data?.nurse_assistant?.serviceFeeDay || "",
      serviceFeeMonth: data?.nurse_assistant?.serviceFeeMonth || "",
    },
    documents: {
      idCopy: data?.idCopy || null,
      profilePhoto: data?.profilePhoto || null,
      goodConductCertificate: data?.goodConductCertificate || null,
      drivingLicense: data?.drivingLicense || null,
      referenceLetter: data?.referenceLetter || null,
      educationCertificate: data?.nurse_assistant?.educationCertificate || null,
    },
  });
  useEffect(() => {
    if (data?.number_two) {
      setFormData((prev) => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          phone: data.number_two,
        },
      }));
    }
  }, [data]);
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
  const isImageUrl = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  };
  const isImageFile = (file) => {
    if (!file) return false;
    if (typeof file === "string") {
      return /\.(jpg|jpeg|png|webp|gif)$/i.test(file);
    }
    if (file instanceof File) {
      return file.type.startsWith("image/");
    }
    return false;
  };
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
      [section]: {
        ...p[section],
        [field]: value,
      },
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
      [section]: {
        ...prev[section],
        [field]: file,
      },
    }));
  };
  const handlePhoneChange = async (e) => {
    let value = e.target.value;
    if (!value.startsWith("+254")) {
      value = "+254";
    }
    let digits = value.slice(4).replace(/\D/g, "");
    if (digits.length > 9) digits = digits.slice(0, 9);
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        phone: "+254" + digits,
      },
    }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
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
    fd.append("bio", BASICINFO.bio);
    fd.append("number_two", BASICINFO.phone);
    fd.append("education", EDUCATION.education);
    if (EDUCATION?.educationCertificate) {
      fd.append("educationCertificate", EDUCATION.educationCertificate);
    }
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
    EXPERIENCE.preferred.forEach((pref) => fd.append("preferred[]", pref));
    SKILLSERVICES.skills.forEach((skill) => fd.append("skills[]", skill));
    fd.append("mobilityYears", SKILLSERVICES.mobilityYears);
    fd.append("bathingYears", SKILLSERVICES.bathingYears);
    fd.append("feedingYears", SKILLSERVICES.feedingYears);
    fd.append("serviceFeeDay", SKILLSERVICES.serviceFeeDay);
    fd.append("serviceFeeMonth", SKILLSERVICES.serviceFeeMonth);
    const documentKeys = [
      "idCopy",
      "profilePhoto",
      "goodConductCertificate",
      "drivingLicense",
      "referenceLetter",
      "educationCertificate",
    ];
    documentKeys.forEach((key) => {
      const value = formData.documents[key];
      if (value instanceof File) {
        fd.append(key, value);
      } else if (typeof value === "string" && value !== "") {
        fd.append(key, value);
      }
    });
    setIsActionLoading(true);
    try {
      const res = await postApi("/update-profile", fd);
      if (res?.status === 200) {
        await refreshUser();
        toast.success("Profile Updated Successfully!");
        router.push("/dashboard");
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Upload failed.", error);
    } finally {
      setIsActionLoading(false);
    }
  };
  const eduFile = formData.documents.educationCertificate;
  const eduIsImage = isImageFile(eduFile);
  return (
    <div>
      <form onSubmit={handleUpdate} className="space-y-6 relative">
        <h4 className="formHeading">Basic Information</h4>

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

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <Label>Primary Number: (you can't change it)</Label>

            <div className="w-full mt-2">
              <PhoneInputWithCountrySelect
                className="w-full border rounded-md px-3 py-2"
                international
                defaultCountry={country}
                value={formData.basicInfo.number || "+254"}
                inputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </div>
          </div>
          <div className="flex-1">
            <Label>Phone Number</Label>

            <div className="w-full mt-2">
              <PhoneInputWithCountrySelect
                className="w-full border rounded-md px-3 py-2"
                international
                defaultCountry={country}
                value={formData?.basicInfo?.phone}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      phone: value || "",
                    },
                  }));
                }}
                onCountryChange={(countryCode) => {
                  setCountry(countryCode);
                  const exampleNumber = countryCode
                    ? getExampleNumber(countryCode)
                    : null;
                  if (exampleNumber) {
                    setFormData((prev) => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        phone: `+${exampleNumber.countryCallingCode}`,
                      },
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        phone: "",
                      },
                    }));
                  }
                }}
              />
            </div>

            {formData?.basicInfo?.phone &&
              !isValidPhoneNumber(formData?.basicInfo?.phone) && (
                <p className="text-red-500 text-sm mt-1">
                  Invalid phone number for selected country
                </p>
              )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-6 sm:gap-4">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Primary Email: (You can't change it.)
            </label>
            <Input
              name="email"
              type="email"
              placeholder="housemanager@gmail.com"
              value={formData.basicInfo.email}

              // onFocus={() => {
              //   if (!formData.basicInfo.phone) {
              //     setFormData((prev) => ({
              //       ...prev,
              //       basicInfo: { ...prev.basicInfo, phone: "+254" },
              //     }));
              //   }
              // }}
              // onChange={handlePhoneChange}
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Experience (Years)
            </label>
            <Select
              value={formData.basicInfo.experience}
              onValueChange={(value) =>
                handleChange("basicInfo", "experience", value)
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
                  <SelectItem value="more">More than 5 years</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
              formData.basicInfo?.canDrive === null ||
              formData.basicInfo?.canDrive === undefined
                ? ""
                : String(formData.basicInfo.canDrive)
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
            file={eduIsImage ? eduFile : null}
            onFileSelect={(file) =>
              handleFileSelect("documents", "educationCertificate", file)
            }
          />

          {eduFile && !eduIsImage && (
            <FilePreview file={eduFile} alt="Education Certificate" />
          )}
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
        <div>
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

        <div className="">
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

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bio">Bio</label>
            <textarea
              value={formData?.basicInfo?.bio}
              name="bio"
              placeholder="Write a brief bio about yourself and the services you offer.."
              className="border text-sm mt-2 p-3 w-full rounded-md outline-primary"
              rows={6}
              onChange={(e) => handleChange("basicInfo", "bio", e.target.value)}
            />
          </div>
        </div>

        <h2 className="formHeading mb-4">Document Uploads</h2>

        <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center mb-4">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>

        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-4">
          {documents?.map((item, indx) => {
            const file = formData.documents[item.id];
            const isImage = typeof file === "string" && isImageUrl(file);
            return (
              <div key={indx} className="border rounded-xl p-4">
                <FileUpload
                  title={item.title}
                  accept={item.accept}
                  icon={item.icon}
                  optional={item.optional || false}
                  file={isImage ? file : null}
                  onFileSelect={(file) =>
                    handleFileSelect("documents", item.id, file)
                  }
                />

                {file && !isImage && (
                  <FilePreview file={file} alt={item?.title} />
                )}
              </div>
            );
          })}
        </div>

        {/* submit button  */}
        <div className="flex justify-end mt-4 b-0">
          {user?.is_profile_completed && (
            <Button
              className={"cursor-pointer"}
              size={"lg"}
              type="submit"
              isActionLoading={isActionLoading}
            >
              Update
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
export default NurseAideUpdate;
