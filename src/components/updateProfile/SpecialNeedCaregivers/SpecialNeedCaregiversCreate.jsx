import FilePreview from "@/components/auth/register/FilePreview";
import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { educationLevels, languages } from "@/utilities/data";
import { Camera, FileCheckCorner, FileText, IdCard, IdCardLanyard } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { postApi } from "@/lib/apiHandler";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const SpecialNeedCaregiversCreate = ({
  data = {}
}) => {
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
      experience: data?.experience || "",
      bio: data?.bio || "",
      phone: data?.phone || "",
      languages: data?.languages || [],
      canDrive: data?.canDrive || ""
    },
    education: {
      education: data?.education || "",
      educationCertificate: data?.special_need?.educationCertificate || null
    },
    experience: {
      hospitalBasedCare: data?.hospitalBasedCare ?? null,
      hospitalBasedYearsOfExperience: data?.hospitalBasedYearsOfExperience || "",
      hospitalBasedReferenceContact: data?.hospitalBasedReferenceContact || "",
      homeBasedCare: data?.homeBasedCare ?? null,
      homeBasedYearsOfExperience: data?.homeBasedYearsOfExperience || "",
      homeBasedReferenceContact: data?.homeBasedReferenceContact || "",
      preferred: data?.preferred || [],
      serviceFeeDay: data?.special_need?.serviceFeeDay || "",
      serviceFeeMonth: data?.special_need?.serviceFeeMonth || ""
    },
    documents: {
      idCopy: data?.idCopy || null,
      profilePhoto: data?.profilePhoto || null,
      goodConductCertificate: data?.goodConductCertificate || null,
      drivingLicense: data?.drivingLicense || null,
      referenceLetter: data?.referenceLetter || null
    }
  });
  const documents = [{
    id: "idCopy",
    title: "ID Copy",
    accept: "application/pdf,image/*",
    icon: <IdCardLanyard size={32} />,
    required: true
  }, {
    id: "profilePhoto",
    title: "Profile Photo",
    accept: "image/*",
    icon: <Camera size={32} />,
    required: true
  }, {
    id: "goodConductCertificate",
    title: "Good Conduct Certificate (Optional)",
    accept: "application/pdf,image/*",
    icon: <FileText size={32} />,
    required: false,
    optional: true
  }, {
    id: "drivingLicense",
    title: "Driving License (Optional)",
    accept: "application/pdf,image/*",
    icon: <IdCard size={32} />,
    required: false,
    optional: true
  }, {
    id: "referenceLetter",
    title: "Reference Letter (Optional)",
    accept: "application/pdf,image/*",
    icon: <FileCheckCorner size={32} />,
    required: false,
    optional: true
  }];
  const preferred = [{
    title: "Autism Spectrum Disorder (ASD)"
  }, {
    title: "Speech therapy"
  }, {
    title: "ADHD (Attention Deficit Hyperactivity Disorder)"
  }, {
    title: "Cerebral palsy"
  }, {
    title: "Down syndrome"
  }, {
    title: "Blindness"
  }, {
    title: "Dementia & Alzheimer"
  }];
  const handleChange = (section, field, value) => {
    setFormData(p => ({
      ...p,
      [section]: {
        ...p[section],
        [field]: value
      }
    }));
  };
  const toggleArrayItem = (section, field, item) => {
    setFormData(prev => {
      const arr = prev[section][field];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
        }
      };
    });
  };
  const handleFileSelect = (section, field, file) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: file
      }
    }));
  };
  const handleUpdate = async e => {
    e.preventDefault();
    const {
      basicInfo,
      education,
      experience,
      documents
    } = formData;
    if (!basicInfo.name.trim()) return toast.error("Name is required");
    if (!basicInfo.location.trim()) return toast.error("Location is required");
    if (!basicInfo.phone) {
      toast.error("Phone number is required!");
      return;
    }
    if (!isValidPhoneNumber(basicInfo.phone)) {
      toast.error("Phone number is invalid or incomplete!");
      return;
    }
    if (!basicInfo.age) return toast.error("Age is required");
    const ageNumber = Number(basicInfo.age);
    if (ageNumber < 25) return toast.error("You must be at least 25 years old");
    if (!basicInfo.gender) return toast.error("Gender is required");
    if (!basicInfo.experience) return toast.error("Experience is required");
    if (!basicInfo.bio) return toast.error("Bio is required");
    if (!basicInfo.languages.length) return toast.error("Please select at least one language");
    if (basicInfo.canDrive === "" || basicInfo.canDrive === null) return toast.error("Please select driving option");
    if (!education.education) return toast.error("Education level is required");
    if (!education.educationCertificate) return toast.error("Education certificate is required");
    if (experience?.hospitalBasedCare === "") return toast.error("Please select hospital based care option");
    if (experience.hospitalBasedCare) {
      if (!experience.hospitalBasedYearsOfExperience) return toast.error("Hospital experience years required");
      if (!experience.hospitalBasedReferenceContact.trim()) return toast.error("Hospital reference contact required");
    }
    if (experience.homeBasedCare === "") return toast.error("Please select home based care option");
    if (experience.homeBasedCare) {
      if (!experience.homeBasedYearsOfExperience) return toast.error("Home experience years required");
      if (!experience.homeBasedReferenceContact.trim()) return toast.error("Home reference contact required");
    }
    if (!experience.preferred.length) return toast.error("Please select preferred intervention area");
    if (!experience.serviceFeeDay) return toast.error("Service fee per day is required");
    if (!experience.serviceFeeMonth) return toast.error("Service fee per month is required");
    if (!documents.idCopy) return toast.error("ID Copy is required");
    if (!documents.profilePhoto) return toast.error("Profile photo is required");
    setIsActionLoading(true);
    try {
      const fd = new FormData();
      const BASIC = formData.basicInfo;
      const EDU = formData.education;
      const EXP = formData.experience;
      const DOC = formData.documents;
      fd.append("name", BASIC.name || "");
      fd.append("location", BASIC.location || "");
      fd.append("age", BASIC.age || "");
      fd.append("gender", BASIC.gender || "");
      if (Array.isArray(BASIC.languages)) {
        BASIC.languages.forEach(lang => fd.append("languages[]", lang));
      }
      fd.append("number_two", BASIC.phone || "");
      fd.append("canDrive", BASIC.canDrive ? 1 : 0);
      fd.append("education", EDU.education || "");
      fd.append("experience", BASIC.experience || "");
      fd.append("bio", BASIC.bio || "");
      if (EDU.educationCertificate) {
        fd.append("educationCertificate", EDU.educationCertificate);
      }
      fd.append("hospitalBasedCare", EXP.hospitalBasedCare ? 1 : 0);
      fd.append("hospitalBasedYearsOfExperience", EXP.hospitalBasedYearsOfExperience || "");
      fd.append("hospitalBasedReferenceContact", EXP.hospitalBasedReferenceContact || "");
      fd.append("homeBasedCare", EXP.homeBasedCare ? 1 : 0);
      fd.append("homeBasedYearsOfExperience", EXP.homeBasedYearsOfExperience || "");
      fd.append("homeBasedReferenceContact", EXP.homeBasedReferenceContact || "");
      if (Array.isArray(EXP.preferred)) {
        EXP.preferred.forEach(pref => fd.append("preferred[]", pref));
      }
      fd.append("serviceFeeDay", EXP.serviceFeeDay || "");
      fd.append("serviceFeeMonth", EXP.serviceFeeMonth || "");
      if (DOC.idCopy) fd.append("idCopy", DOC.idCopy);
      if (DOC.profilePhoto) fd.append("profilePhoto", DOC.profilePhoto);
      if (DOC.goodConductCertificate) fd.append("goodConductCertificate", DOC.goodConductCertificate);
      if (DOC.drivingLicense) fd.append("drivingLicense", DOC.drivingLicense);
      if (DOC.referenceLetter) fd.append("referenceLetter", DOC.referenceLetter);
      const res = await postApi("/create-profile", fd);
      if (res?.status === 200) {
        toast.success("Profile Created Successfully!");
        router.push("/dashboard");
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Error ", error);
      if (error.response) {
        toast.error(error.response.data?.message || `Error: ${error.response.status}`);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsActionLoading(false);
    }
  };
  return <div>
      <form onSubmit={handleUpdate} className="space-y-6 relative">
        <h2 className="formHeading">Basic Information</h2>
        <div className="flex flex-col  md:flex-row md:gap-4 gap-6">
          <div className="flex-1">
            <Input placeholder="Name" name="name" label="Full Name (as per ID)" value={formData.basicInfo.name} onChange={e => handleChange("basicInfo", "name", e.target.value)} />
          </div>

          <div className="flex-1">
            <Input type="number" placeholder="Your age" name="age" label="Age" maxLength={2} value={formData.basicInfo.age} onChange={e => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            handleChange("basicInfo", "age", val);
          }} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* LOCATION */}
          <div>
            <Input label="Location" placeholder="Location" name="location" value={formData.basicInfo.location} onChange={e => handleChange("basicInfo", "location", e.target.value)} />
          </div>

          {/* PHONE */}
          <div>
            <Label>Phone Number</Label>
            <div className="w-full mt-2">
              <PhoneInputWithCountrySelect className="w-full border rounded-md px-3 py-2" international defaultCountry={country} value={formData.basicInfo.phone} onChange={value => handleChange("basicInfo", "phone", value || "")} />
            </div>

            {formData.basicInfo.phone && !isValidPhoneNumber(formData.basicInfo.phone) && <p className="text-red-500 text-sm mt-1">
                  Invalid phone number for selected country
                </p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 mt-4">
          <div className="flex-1">
            <Label className={"mb-2"}>Gender?</Label>
            <RadioGroup className={"flex gap-4"} value={formData.basicInfo.gender} onValueChange={value => handleChange("basicInfo", "gender", value)}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Male" id="r1" />
                <Label className="text-gray-700 font-normal cursor-pointer" htmlFor="r1">
                  Male
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Female" id="r2" />
                <Label className="text-gray-700 font-normal cursor-pointer" htmlFor="r2">
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex-1">
            <Label className="mb-3 block">Can you drive?</Label>
            <RadioGroup className="flex gap-4 cursor-pointer" value={formData.basicInfo?.canDrive === null || formData.basicInfo?.canDrive === undefined ? "" : String(formData.basicInfo.canDrive)} onValueChange={value => handleChange("basicInfo", "canDrive", value === "true")}>
              <div className="flex items-center gap-2">
                <RadioGroupItem className="cursor-pointer" value="true" id="d1" />
                <Label className="cursor-pointer" htmlFor="d1">
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem className="cursor-pointer" value="false" id="d2" />
                <Label className="cursor-pointer" htmlFor="d2">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 mt-4">
          <div className="flex-1">
            <Label className={"mb-3"}>Languages</Label>
            <div className="flex flex-wrap gap-4 ">
              {languages.map((lan, indx) => <div key={indx} className="flex items-center gap-2">
                  <Checkbox id={lan.value} checked={formData.basicInfo.languages.includes(lan.value)} onCheckedChange={() => toggleArrayItem("basicInfo", "languages", lan.value)} />
                  <Label htmlFor={lan.value} className="text-gray-700 font-normal cursor-pointer">
                    {lan.text}
                  </Label>
                </div>)}
            </div>
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Experience (Years)
            </label>
            <Select value={formData.basicInfo.experience} onValueChange={value => handleChange("basicInfo", "experience", value)}>
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
        {/* education  */}

        <div className="py-2">
          <Label className="mb-3 block">Education Level</Label>

          <RadioGroup className="flex flex-col flex-wrap gap-2 mt-2" value={formData.education.education} onValueChange={value => handleChange("education", "education", value)}>
            {educationLevels.map(edu => <div key={edu.id} className="flex items-center gap-2">
                <RadioGroupItem value={edu.value} id={edu.id} />
                <Label htmlFor={edu.id} className="text-gray-700 cursor-pointer">
                  {edu.label}
                </Label>
              </div>)}
          </RadioGroup>
        </div>

        {/* File Upload */}
        <div>
          <FileUpload title="Education Certificate (Compulsory)" accept="application/pdf,image/*" icon={<FileText size={32} />} optional="" file={formData?.education?.educationCertificate} onFileSelect={file => handleFileSelect("education", "educationCertificate", file)} />
        </div>

        {/* PCK Registration */}
        {/* <div className="py-6">
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
         </div> */}

        {/* Show only when PCK = Yes */}
        {/* {data.isRegisterPCK === "Yes" && (
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
                  handleFileSelect("education", "practiceLicense", file)
                }
              />
            </div>
          </div>
         )} */}

        {/* Exprience */}

        <h4 className="formHeading">Experience</h4>
        <div className="py-2">
          <Label className="mb-3 block">Hospital Based Care</Label>

          <RadioGroup className="flex gap-x-4 flex-wrap" value={formData.experience?.hospitalBasedCare === null ? "" : formData.experience.hospitalBasedCare ? "Yes" : "No"} onValueChange={value => handleChange("experience", "hospitalBasedCare", value === "Yes")}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="hos1" />
              <Label htmlFor="hos1" className="text-gray-700 font-normal cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="hos2" />
              <Label htmlFor="hos2" className="text-gray-700 font-normal cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {formData.experience?.hospitalBasedCare && <div className="flex gap-6 sm:flex-row flex-col sm:gap-4 mt-4">
            <Input type="number" label="Years of experience" name="hospitalBasedYearsOfExperience" placeholder="Experience" maxLength={2} value={formData.experience.hospitalBasedYearsOfExperience || ""} onChange={e => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 2);
          handleChange("experience", "hospitalBasedYearsOfExperience", val);
        }} />

            <Input label="Reference contact" name="hospitalBasedReferenceContact" placeholder="Reference" value={formData.experience.hospitalBasedReferenceContact || ""} onChange={e => handleChange("experience", "hospitalBasedReferenceContact", e.target.value)} />
          </div>}

        <div className="py-2">
          <Label className="mb-3 block">Home Based Care</Label>

          <RadioGroup className="flex gap-x-4 flex-wrap" value={formData.experience?.homeBasedCare === null ? "" : formData.experience.homeBasedCare ? "Yes" : "No"} onValueChange={value => handleChange("experience", "homeBasedCare", value === "Yes")}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="d3" />
              <Label htmlFor="d3" className="text-gray-700 font-normal cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="d4" />
              <Label htmlFor="d4" className="text-gray-700 font-normal cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Show inputs only if homeBasedCare = true */}
        {formData.experience?.homeBasedCare && <div className="flex gap-6 sm:flex-row flex-col sm:gap-4 mt-4">
            <Input type="number" label="Years of experience" name="homeBasedYearsOfExperience" placeholder="Experience" maxLength={2} value={formData.experience?.homeBasedYearsOfExperience || ""} onChange={e => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 2);
          handleChange("experience", "homeBasedYearsOfExperience", val);
        }} />

            <Input label="Reference contact" name="homeBasedReferenceContact" placeholder="Reference" value={formData.experience?.homeBasedReferenceContact || ""} onChange={e => handleChange("experience", "homeBasedReferenceContact", e.target.value)} />
          </div>}

        <div className="">
          <Label className={"mb-3"}>
            What are your preferred areas of intervention
          </Label>
          <div className="flex flex-wrap flex-col gap-2 ">
            {preferred.map((lan, indx) => <div key={indx} className="flex items-center gap-2">
                <Checkbox id={lan.title} checked={formData.experience.preferred.includes(lan.title)} onCheckedChange={() => toggleArrayItem("experience", "preferred", lan.title)} />
                <Label htmlFor={lan.title} className="text-gray-700 font-normal cursor-pointer">
                  {lan.title}
                </Label>
              </div>)}
          </div>
        </div>

        {/* Service Fee */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Service Fee (Per Day - KSh)" type="number" name="serviceFeeDay" maxLength={5} placeholder="e.g., 1500" value={formData?.experience?.serviceFeeDay} onChange={e => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 5);
          handleChange("experience", "serviceFeeDay", val);
        }} />
          <Input label="Service Fee (Per Month - KSh)" type="number" name="serviceFeeMonth" maxLength={6} placeholder="e.g., 35000" value={formData?.experience?.serviceFeeMonth} onChange={e => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 5);
          handleChange("experience", "serviceFeeMonth", val);
        }} />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea value={formData.basicInfo.bio} name="bio" placeholder="Write a brief bio about yourself and the services you offer.." className="border text-sm mt-2 p-3 w-full rounded-md outline-primary" rows={6} onChange={e => handleChange("basicInfo", "bio", e.target.value)} />
        </div>

        <h2 className="formHeading">Document Uploads</h2>
        <div className="p-3 bg-primary/20 my-6 rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>
        <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-4">
          {documents?.map((item, indx) => {
          const file = formData.documents[item.id];
          return <div key={indx} className="border rounded-xl p-4">
                <FileUpload title={item.title} accept={item.accept} icon={item.icon} optional={item.optional || false} file={file} onFileSelect={file => handleFileSelect("documents", item.id, file)} />

                {file && !file?.type?.startsWith("image/") && <FilePreview file={file} alt={item?.title} />}
              </div>;
        })}
        </div>
        {/* submit button  */}
        <div className="flex justify-end mt-4 b-0">
          {!user?.is_profile_completed && <Button className={"cursor-pointer"} size={"lg"} type="submit" isActionLoading={isActionLoading}>
              Submit
            </Button>}
        </div>
      </form>
    </div>;
};
export default SpecialNeedCaregiversCreate;