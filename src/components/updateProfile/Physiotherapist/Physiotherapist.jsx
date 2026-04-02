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
import { useAuth } from "@/hooks/useAuth";
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

import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Physiotherapist = ({ data = {} }) => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    basicInfo: {
      name: data.name || "",
      location: data.location || "",
      age: data.age || "",
      experience: data?.physiotherapist?.experience || "",
      gender: data.gender || "",
      languages: data.languages || [],
      canDrive: data.canDrive || "",
      number: data?.number || "",
      phone: data?.number_two || "",
      email: data?.email || "",
      bio: data?.bio || "",
    },
    education: {
      education: data.education || "",
      isRegisterPCK: data?.physiotherapist?.isRegisterPCK || "",
      registrationNumber: data?.physiotherapist?.registrationNumber || "",
    },
    experience: {
      hospitalBasedCare: data.hospitalBasedCare || "",
      hospitalBasedYearsOfExperience: data.hospitalBasedYearsOfExperience || "",
      hospitalBasedReferenceContact: data.hospitalBasedReferenceContact || "",
      homeBasedCare: data.homeBasedCare || "",
      homeBasedYearsOfExperience: data.homeBasedYearsOfExperience || "",
      homeBasedReferenceContact: data.homeBasedReferenceContact || "",
      preferred: data.preferred || [],

      serviceFeeDay: data?.physiotherapist?.serviceFeeDay || "",
      serviceFeeMonth: data?.physiotherapist?.serviceFeeMonth || "",
    },
    documents: {
      idCopy: data.idCopy || null,
      profilePhoto: data.profilePhoto || null,
      goodConductCertificate: data.goodConductCertificate || null,
      drivingLicense: data.drivingLicense || null,
      referenceLetter: data.referenceLetter || null,
      eduCertificate: data?.physiotherapist?.eduCertificate || null,
      practiceLicense: data?.physiotherapist?.practiceLicense || null,
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
      title: "Pediatric",
    },
    {
      title: "Orthopedic",
    },
    {
      title: "Rehab",
    },
    {
      title: "Sports",
    },
    {
      title: "Stroke",
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

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    if (!value.startsWith("+254")) {
      value = "+254";
    }

    let digits = value.slice(4).replace(/\D/g, "");

    if (digits.length > 9) digits = digits.slice(0, 9);

    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, phone: "+254" + digits },
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.basicInfo.number) {
      toast.error("Primary number missing!");
      return;
    }

    if (
      formData.basicInfo.phone &&
      !isValidPhoneNumber(formData.basicInfo.phone)
    ) {
      toast.error("Alternative number is invalid!");
      return;
    }
    const fd = new FormData();

    const BASICINFO = formData.basicInfo;
    const EDUCATION = formData.education;
    const EXPERIENCE = formData.experience;
    // const DOCUMENTS = formData.documents;

    fd.append("name", BASICINFO.name);
    fd.append("location", BASICINFO.location);
    fd.append("age", BASICINFO.age);
    fd.append("experience", BASICINFO.experience);
    fd.append("gender", BASICINFO.gender);
    BASICINFO.languages.forEach((lang) => fd.append("languages[]", lang));
    fd.append("canDrive", BASICINFO.canDrive ? 1 : 0);
    fd.append("bio", BASICINFO.bio);
    fd.append("number", BASICINFO.number);
    fd.append("number_two", BASICINFO.phone);

    fd.append("education", EDUCATION.education);
    fd.append("isRegisterPCK", EDUCATION.isRegisterPCK ? 1 : 0);
    fd.append("registrationNumber", EDUCATION.registrationNumber);

    fd.append("serviceFeeDay", EXPERIENCE.serviceFeeDay);
    fd.append("serviceFeeMonth", EXPERIENCE.serviceFeeMonth);
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

    Object.entries(formData.documents).forEach(([key, value]) => {
      if (value instanceof File) {
        fd.append(key, value);
      }
    });

    // for (let pair of fd.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    try {
      const res = await postApi("/update-profile", fd);

      if (res?.status === 200) {
        await refreshUser();
        toast.success("Profile Updated Successfully!");
        router.push("/dashboard");

        // localStorage.setItem(
        //   "user",
        //   JSON.stringify({
        //     ...user,
        //     is_profile_completed: Boolean(res?.data?.is_profile_completed),
        //     is_profile_verified: Boolean(res?.data?.is_profile_verified),
        //   }),
        // );
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Upload failed.", error);
    }
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
              value={formData.basicInfo?.name}
              onChange={(e) =>
                handleChange("basicInfo", "name", e.target.value)
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
              value={formData.basicInfo?.age}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange("basicInfo", "age", val);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-6 sm:gap-4 ">
          <div className="flex-1">
            <Input
              label="Location"
              placeholder="Location"
              name="location"
              value={formData.basicInfo?.location}
              onChange={(e) =>
                handleChange("basicInfo", "location", e.target.value)
              }
            />
          </div>
          <div className="flex-1 mt-3">
            <Label className={"mb-2"}>Gender?</Label>
            <RadioGroup
              className={"flex gap-4"}
              value={formData.basicInfo?.gender}
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

        <div className="flex flex-col sm:flex-row sm:gap-6 sm:gap-4">
          {/* PRIMARY NUMBER */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Primary Number: (You can't change it.)
            </label>

            <PhoneInputWithCountrySelect
              international
              disabled
              defaultCountry="KE"
              value={formData.basicInfo.number}
              className="w-full border rounded-md px-3 py-2 bg-gray-100"
            />
          </div>

          {/* ALTERNATIVE NUMBER */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Alternative Number
            </label>

            <PhoneInputWithCountrySelect
              international
              defaultCountry="KE"
              value={formData.basicInfo.phone}
              onChange={(value) =>
                handleChange("basicInfo", "phone", value || "")
              }
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-6 sm:gap-4">
          <div className="w-1/2">
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

        <div className="">
          <Label className={"mb-3"}>Languages</Label>
          <div className="flex flex-wrap gap-4 ">
            {languages.map((lan, indx) => (
              <div key={indx} className="flex items-center gap-2">
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

        <h2 className="formHeading">Education & Registration</h2>

        {/* Education Level */}
        <div className="">
          <Label className="mb-3 block">Level of Education</Label>
          <RadioGroup
            className="flex gap-x-4 flex-wrap"
            value={formData.education.education}
            onValueChange={(value) =>
              handleChange("education", "education", value)
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Diploma In Physiotherapy" id="y1" />
              <Label htmlFor="y1">Diploma In Physiotherapy</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Degree In Physiotherapy" id="y2" />
              <Label htmlFor="y2">Degree In Physiotherapy</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Education Certificate */}
        <FileUpload
          title="Education Certificate (Compulsory)"
          accept="application/pdf,image/*"
          icon={<FileText size={32} />}
          file={formData.documents.eduCertificate}
          // onFileSelect={(file) => handleFileSelect("eduCertificate", file)}
          onFileSelect={(file) =>
            handleFileSelect("documents", "eduCertificate", file)
          }
        />

        {/* PCK Registration */}
        <div className="">
          <Label className="mb-3 block">
            Are you registered with Physiotherapy Council of Kenya (PCK)?
          </Label>

          <RadioGroup
            className="flex gap-4"
            value={
              formData.education.isRegisterPCK === null ||
              formData.education.isRegisterPCK === undefined
                ? ""
                : formData.education.isRegisterPCK
                  ? "Yes"
                  : "No"
            }
            onValueChange={(value) =>
              handleChange("education", "isRegisterPCK", value === "Yes")
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

        {/* Show Registration Number & License only if PCK = Yes */}
        {formData.education.isRegisterPCK && (
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
                file={formData.documents.practiceLicense}
                onFileSelect={(file) =>
                  handleFileSelect("documents", "practiceLicense", file)
                }
              />
            </div>
          </div>
        )}

        <h2 className="formHeading">Experience</h2>
        <div className="py-6">
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

        <div>
          <Label className={"mb-3"}>
            What are your preferred areas of intervention
          </Label>
          <div className="flex flex-wrap flex-col gap-2 ">
            {preferred.map((lan, indx) => (
              <div key={indx} className="flex items-center gap-2">
                <Checkbox
                  id={lan.title}
                  checked={formData.experience?.preferred.includes(lan.title)}
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

        {/* Service Fee */}
        {/* <div className="">
          <Input
            label="Service Fee (KSh per day/month)"
            type="number"
            name="serviceFee"
            maxLength={5}
            placeholder="e.g., 1500 per day or 35000 per month"
            value={formData.experience?.serviceFee}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 5);
              handleChange("experience", "serviceFee", val);
            }}
          />
        </div> */}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Service Fee (Per Day - KSh)"
            type="number"
            name="serviceFeeDay"
            maxLength={5}
            placeholder="e.g., 1500"
            value={formData?.experience.serviceFeeDay}
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
            value={formData?.experience?.serviceFeeMonth}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 5);
              handleChange("experience", "serviceFeeMonth", val);
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
              onChange={handleChange}
            />
          </div>
        </div>

        <h2 className="formHeading">Document Uploads</h2>
        <div className="p-3 bg-primary/20  rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>
        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-4">
          {documents?.map((item, indx) => {
            const file = formData.documents[item.id];

            return (
              <div key={indx} className="border rounded-xl p-4">
                <FileUpload
                  title={item.title}
                  accept={item.accept}
                  icon={item.icon}
                  optional={item.optional || false}
                  file={file}
                  onFileSelect={(file) =>
                    handleFileSelect("documents", item.id, file)
                  }
                />

                {file && !file?.type?.startsWith("image/") && (
                  <FilePreview file={file} alt={item?.title} />
                )}
              </div>
            );
          })}
        </div>

        {/* submit button  */}
        <div className="flex justify-end mt-4 b-0">
          {user?.is_profile_completed && (
            <Button className={"cursor-pointer"} size={"lg"} type="submit">
              Update
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Physiotherapist;
