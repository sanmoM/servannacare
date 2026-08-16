import FilePreview from "@/components/auth/register/FilePreview";
import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { postApi } from "@/lib/apiHandler";
import { languages } from "@/utilities/data";
import { Camera, FileCheckCorner, FileText, IdCard, IdCardLanyard } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const NurseCreate = ({
  data = {}
}) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [country, setCountry] = useState("KE");
  const router = useRouter();
  const {
    user
  } = useAuth();
  const [formData, setFormData] = useState({
    basicInfo: {
      name: data?.name || "",
      location: data?.location || "",
      age: data?.age || "",
      gender: data?.gender || "",
      phone: data?.phone || "",
      experience: data?.experience || "",
      preferredRole: data?.preferredRole || "",
      bio: data?.bio || "",
      languages: data?.languages || [],
      canDrive: data?.canDrive === undefined ? null : Boolean(data.canDrive)
    },
    education: {
      education: data.education || "",
      isNursingInKenya: data?.isNursingInKenya === undefined ? null : Boolean(data?.isNursingInKenya),
      registrationNumber: data?.nurse?.registrationNumber || "",
      practiceLicense: data?.nurse?.practiceLicense || null,
      educationCertificate: data?.nurse?.educationCertificate || null
    },
    experience: {
      hospitalBasedCare: data?.hospitalBasedCare === undefined ? null : Boolean(data.hospitalBasedCare),
      hospitalBasedYearsOfExperience: data?.hospitalBasedYearsOfExperience || "",
      hospitalBasedReferenceContact: data?.hospitalBasedReferenceContact || "",
      homeBasedCare: data?.homeBasedCare === undefined ? null : Boolean(data.homeBasedCare),
      homeBasedYearsOfExperience: data?.homeBasedYearsOfExperience || "",
      homeBasedReferenceContact: data?.homeBasedReferenceContact || "",
      preferred: data?.preferred || [],
      registrationNumber: data?.nurse?.registrationNumber || "",
      practiceLicense: data?.nurse?.practiceLicense || null,
      educationCertificate: data?.nurse?.educationCertificate || null
    },
    skillsServices: {
      skills: data?.nurse?.skills || [],
      mobilityYears: data?.nurse?.mobilityYears || "",
      bathingYears: data?.nurse?.bathingYears || "",
      feedingYears: data?.nurse?.feedingYears || "",
      serviceFeeDay: data?.nurse?.serviceFeeDay || "",
      serviceFeeMonth: data?.nurse?.serviceFeeMonth || ""
    },
    documents: {
      idCopy: data.idCopy || null,
      profilePhoto: data.profilePhoto || null,
      goodConductCertificate: data.goodConductCertificate || null,
      drivingLicense: data.drivingLicense || null,
      referenceLetter: data.referenceLetter || null
    }
  });
  const skills = ["Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)", "Vital Signs Monitoring(checking blood pressure, blood sugar, pulse, temperature, etc.", "Medical Assistance: Aassisting nurses with wound care, administering medication (in some cases)", "Compassion & Communication Skills", "Special needs children caregiving", "Elderly caregiving", "Handiling Medical Quipment (e. g. fedding tubes, catheter, oxygen tanks)"];
  const preferred = [{
    title: "Pre and post pregnancy care"
  }, {
    title: "Post surgery cage"
  }, {
    title: "Palliative care"
  }, {
    title: "Elderly care"
  }];
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
    title: "Good Conduct Certificate",
    accept: "application/pdf,image/*",
    icon: <FileText size={32} />,
    required: true
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
  const handleChange = (section, field, value) => {
    setFormData(p => ({
      ...p,
      [section]: {
        ...p[section],
        [field]: value
      }
    }));
  };
  const toggleLanguage = lan => {
    setFormData(prev => {
      const alreadySelected = prev.basicInfo.languages.includes(lan);
      return {
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          languages: alreadySelected ? prev.basicInfo.languages.filter(l => l !== lan) : [...prev.basicInfo.languages, lan]
        }
      };
    });
  };
  const togglePreferred = pref => {
    setFormData(prev => {
      const alreadySelected = prev.experience.preferred.includes(pref);
      return {
        ...prev,
        experience: {
          ...prev.experience,
          preferred: alreadySelected ? prev.experience.preferred.filter(p => p !== pref) : [...prev.experience.preferred, pref]
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
  const toggleArrayItem = (section, field, value) => {
    setFormData(prev => {
      const arr = prev[section][field] || [];
      const exists = arr.includes(value);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: exists ? arr.filter(v => v !== value) : [...arr, value]
        }
      };
    });
  };
  const handleCreate = async e => {
    e.preventDefault();
    const {
      basicInfo,
      education,
      experience,
      skillsServices,
      documents
    } = formData;
    if (!basicInfo?.phone) {
      toast.error("Phone number is required!");
      return;
    }
    if (!isValidPhoneNumber(basicInfo?.phone)) {
      toast.error("Phone number is invalid or incomplete!");
      return;
    }
    if (!basicInfo.name?.trim()) return toast.error("Full name is required");
    if (!basicInfo.location?.trim()) return toast.error("Location is required");
    if (!basicInfo.age) return toast.error("Age is required");
    const ageNumber = Number(basicInfo.age);
    if (ageNumber < 25) return toast.error("You must be at least 25 years old");
    if (!basicInfo.gender) return toast.error("Gender is required");
    if (!basicInfo.languages?.length) return toast.error("Please select at least one language");
    if (basicInfo.canDrive === null) return toast.error("Please select driving option");

    // ================= EDUCATION =================
    if (!education.education) return toast.error("Education level is required");
    if (!education.educationCertificate) return toast.error("Education certificate is required");
    if (education.isNursingInKenya === null) return toast.error("Please select NCK registration option");
    if (education.isNursingInKenya) {
      if (!education.registrationNumber?.trim()) return toast.error("Registration number is required");
      if (!education.practiceLicense) return toast.error("Practising license is required");
    }

    // ================= EXPERIENCE =================
    if (experience.hospitalBasedCare === null) return toast.error("Please select hospital based care option");
    if (experience.hospitalBasedCare) {
      if (!experience.hospitalBasedYearsOfExperience) return toast.error("Hospital experience years required");
      if (!experience.hospitalBasedReferenceContact?.trim()) return toast.error("Hospital reference contact required");
    }
    if (experience.homeBasedCare === null) return toast.error("Please select home based care option");
    if (experience.homeBasedCare) {
      if (!experience.homeBasedYearsOfExperience) return toast.error("Home experience years required");
      if (!experience.homeBasedReferenceContact?.trim()) return toast.error("Home reference contact required");
    }
    if (!experience.preferred?.length) return toast.error("Please select at least one preferred area");

    // ================= SKILLS =================
    if (!skillsServices.skills?.length) return toast.error("Please select at least one skill");
    if (!skillsServices.mobilityYears) return toast.error("Mobility assistance experience required");
    if (!skillsServices.bathingYears) return toast.error("Bathing assistance experience required");
    if (!skillsServices.feedingYears) return toast.error("Feeding assistance experience required");
    if (!skillsServices.serviceFeeDay) return toast.error("Service fee per day is required");
    if (!skillsServices.serviceFeeMonth) return toast.error("Service fee per month is required");

    // ================= DOCUMENTS =================
    if (!documents.idCopy) return toast.error("ID copy is required");
    if (!documents.profilePhoto) return toast.error("Profile photo is required");
    if (!documents.goodConductCertificate) return toast.error("Good conduct certificate is required");
    if (formData.experience.preferred.length === 0) {
      toast.error("Please select at least one preferred area");
      return;
    }
    if (formData?.basicInfo?.languages?.length === 0) {
      toast.error("Please select at least one language!");
      return;
    }
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
    fd.append("preferredRole", BASICINFO.preferredRole);
    fd.append("bio", BASICINFO.bio);
    fd.append("gender", BASICINFO.gender);
    fd.append("number_two", BASICINFO.phone);
    BASICINFO.languages.forEach(lang => fd.append("languages[]", lang));
    fd.append("canDrive", BASICINFO.canDrive ? 1 : 0);
    fd.append("education", EDUCATION.education);
    fd.append("isNursingInKenya", EDUCATION.isNursingInKenya ? 1 : 0);
    fd.append("registrationNumber", EDUCATION.registrationNumber);
    fd.append("hospitalBasedCare", EXPERIENCE.hospitalBasedCare ? 1 : 0);
    fd.append("hospitalBasedYearsOfExperience", EXPERIENCE.hospitalBasedYearsOfExperience);
    fd.append("hospitalBasedReferenceContact", EXPERIENCE.hospitalBasedReferenceContact);
    fd.append("homeBasedCare", EXPERIENCE.homeBasedCare ? 1 : 0);
    fd.append("homeBasedYearsOfExperience", EXPERIENCE.homeBasedYearsOfExperience);
    fd.append("homeBasedReferenceContact", EXPERIENCE.homeBasedReferenceContact);
    EXPERIENCE.preferred.forEach(prep => fd.append("preferred[]", prep));
    SKILLSERVICES.skills.forEach(skill => fd.append("skills[]", skill));
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

    // for (let pair of fd.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
    setIsActionLoading(true);
    try {
      const res = await postApi("/create-profile", fd, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (res?.status === 200) {
        toast.success("Registered Successfully!");
        // Refresh auth user data and navigate without full page reload
        await refreshUser(true);
        router.replace("/dashboard");
      } else {
        toast.error(res?.data?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Error creating profile", error);
      if (error.response) {
        toast.error(error.response.data?.message || `Error: ${error.response.status}`);
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsActionLoading(false);
    }
  };
  return <div>
      <form onSubmit={handleCreate} className="space-y-6 relative">
        <h4 className="formHeading">Basic Information</h4>

        {/* Name + phone */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
          <div className="flex-1">
            <Input label="Full Name (as per ID)" name="name" placeholder="Enter your name" onChange={e => handleChange("basicInfo", "name", e.target.value)} />
          </div>

          <div className="flex-1">
            <Label>Phone Number</Label>

            <div className="w-full mt-2">
              <PhoneInputWithCountrySelect className="w-full border rounded-md px-3 py-2" international defaultCountry={country} value={formData.basicInfo.phone} onChange={value => handleChange("basicInfo", "phone", value || "")} onCountryChange={countryCode => {
              setCountry(countryCode);
            }} />
            </div>

            {formData.basicInfo.phone && !isValidPhoneNumber(formData.basicInfo.phone) && <p className="text-red-500 text-sm mt-1">
                  Invalid phone number for selected country
                </p>}
          </div>
        </div>

        {/* Age + experience*/}
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-4 gap-6 ">
          <div className="flex-1">
            <Input type="number" label="Age" name="age" placeholder="Your age" maxLength={2} onChange={e => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            handleChange("basicInfo", "age", val);
          }} />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Experience (Years)
            </label>
            <Select value={formData?.basicInfo?.experience} onValueChange={value => handleChange("basicInfo", "experience", value)}>
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

        <div className="">
          <Input label="Your Location" name="location" placeholder="Type your location.." onChange={e => handleChange("basicInfo", "location", e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label className="mb-3 block">Gender</Label>
            <RadioGroup className="flex gap-4 mt-2" value={formData?.basicInfo?.gender} onValueChange={value => handleChange("basicInfo", "gender", value)}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Male" id="r1" />
                <Label htmlFor="r1" className="text-gray-700 font-normal cursor-pointer">
                  Male
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Female" id="r2" />
                <Label htmlFor="r2" className="text-gray-700 font-normal cursor-pointer">
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-3 block">Can you drive?</Label>
            <RadioGroup className="flex gap-4 cursor-pointer" value={formData.basicInfo.canDrive === true ? "true" : formData.basicInfo.canDrive === false ? "false" : ""} onValueChange={value => handleChange("basicInfo", "canDrive", value === "true")}>
              <div className="flex items-center gap-2">
                <RadioGroupItem className="cursor-pointer" value="true" id="d1" />
                <Label className="cursor-pointer text-gray-700" htmlFor="d1">
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem className="cursor-pointer" value="false" id="d2" />
                <Label className="cursor-pointer text-gray-700" htmlFor="d2">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* preferredRole */}
        <div className="flex-1 ">
          <Label className={"mb-2"}>Preferred Role?</Label>
          <RadioGroup value={formData?.basicInfo?.preferredRole} onValueChange={value => handleChange("basicInfo", "preferredRole", value)} className="flex gap-4">
            <RadioGroupItem value="Medical Nurse" id={`r3`} />
            <Label htmlFor={`r3`}>Medical Nurse</Label>

            <RadioGroupItem value="Nurse Aide" id={`r4`} />
            <Label htmlFor={`r4`}>Nurse Aide</Label>
          </RadioGroup>
        </div>
        {/* Languages */}
        <div>
          <Label className="font-medium mb-3">Languages</Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {languages.map(lan => <div key={lan.id} className="flex items-center gap-2">
                <Checkbox id={lan.value} checked={formData?.basicInfo?.languages?.includes(lan.value)} onCheckedChange={() => toggleLanguage(lan.value)} className="cursor-pointer" />
                <Label htmlFor={lan.value} className="text-gray-700 font-normal cursor-pointer">
                  {lan.text}
                </Label>
              </div>)}
          </div>
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea value={formData?.basicInfo?.bio} name="bio" placeholder="Write a brief bio about yourself and the services you offer.." className="border text-sm mt-2 p-3 w-full rounded-md outline-primary" rows={6} onChange={e => handleChange("basicInfo", "bio", e.target.value)} />
        </div>

        {/* education  */}

        <h4 className="formHeading">Education & Registration</h4>

        {/* Education Level */}
        <div>
          <Label className="mb-3 block">Level of Education</Label>
          <RadioGroup className="flex flex-wrap gap-4 mt-2" value={formData.education.education} onValueChange={value => handleChange("education", "education", value)}>
            <div className="flex items-center gap-2">
              <RadioGroupItem className="cursor-pointer" value="Diploma In Nursing" id="edu1" />
              <Label htmlFor="edu1" className="text-gray-700 cursor-pointer">
                Diploma In Nursing
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem className="cursor-pointer" value="Degree In Nursing" id="edu2" />
              <Label htmlFor="edu2" className="text-gray-700 cursor-pointer">
                Degree In Nursing
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* File Upload */}
        <div>
          <FileUpload title="Education Certificate (Compulsory)" accept="application/pdf,image/*" icon={<FileText size={32} />} optional="" file={formData.education?.educationCertificate} onFileSelect={file => handleFileSelect("education", "educationCertificate", file)} />
        </div>

        {/* Nursing Council */}
        <div className="">
          <Label className="mb-3 block">
            Are you registered with Nursing Council of Kenya (NCK)?
          </Label>

          <RadioGroup className="flex gap-4" value={formData.education.isNursingInKenya === null || formData.education.isNursingInKenya === undefined ? "" : formData.education.isNursingInKenya ? "true" : "false"} onValueChange={value => handleChange("education", "isNursingInKenya", value === "true")}>
            <div className="flex items-center gap-2">
              <RadioGroupItem className="cursor-pointer" value="true" id="pckYes" />
              <Label className="cursor-pointer text-gray-700" htmlFor="pckYes">
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem className="cursor-pointer" value="false" id="pckNo" />
              <Label className="cursor-pointer text-gray-700" htmlFor="pckNo">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {formData.education.isNursingInKenya && <div className="mt-6">
            <Input label="Registration Number" placeholder="Registration Number" type="text" value={formData.education?.registrationNumber || ""} onChange={e => handleChange("education", "registrationNumber", e.target.value)} />

            <div className="mt-6">
              <FileUpload title="Practising License" accept="application/pdf,image/*" icon={<FileText size={32} />} file={formData.education.practiceLicense} onFileSelect={file => handleFileSelect("education", "practiceLicense", file)} />
            </div>
          </div>}

        {/* experience */}

        <h2 className="formHeading">Experience</h2>
        <div className="">
          <Label className="mb-3 block">Hospital Based Care</Label>

          <RadioGroup className="flex flex-wrap" value={formData.experience?.hospitalBasedCare == null ? "" : formData.experience.hospitalBasedCare ? "true" : "false"} onValueChange={value => handleChange("experience", "hospitalBasedCare", value === "true")}>
            <div className="flex items-center gap-2">
              <RadioGroupItem className="cursor-pointer" value="true" id="hos1" />
              <Label htmlFor="hos1" className="text-gray-700 font-normal cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem className="cursor-pointer" value="false" id="hos2" />
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

        {/* Home Based Care */}
        <div className="">
          <Label className="mb-3 block">Home Based Care</Label>

          <RadioGroup className="flex gap-x-4 flex-wrap" value={formData.experience?.homeBasedCare == null ? "" : formData.experience.homeBasedCare ? "true" : "false"} onValueChange={value => handleChange("experience", "homeBasedCare", value === "true")}>
            <div className="flex items-center gap-2">
              <RadioGroupItem className="cursor-pointer" value="true" id="d3" />
              <Label className="text-gray-700 font-normal cursor-pointer" htmlFor="d3">
                Yes
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="false" id="d4" />
              <Label className="text-gray-700 font-normal cursor-pointer" htmlFor="d4">
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

        {/* Skills Section */}
        <div>
          <h2 className="formHeading mb-4">Skills & Services</h2>
          {/* preferred */}

          <div>
            <Label className={"mb-3 mt-6"}>
              What are your preferred areas of intervention
            </Label>
            <div className="flex flex-wrap flex-col gap-2 ">
              {preferred.map((lan, indx) => <div key={indx} className="flex items-center gap-2">
                  <Checkbox id={lan.title} checked={formData.experience.preferred.includes(lan.title)} onCheckedChange={() => togglePreferred(lan.title)} className="cursor-pointer" />

                  <Label htmlFor={lan.title} className="text-gray-700 font-normal cursor-pointer">
                    {lan.title}
                  </Label>
                </div>)}
            </div>
          </div>
          <div>
            <Label className="mb-2 mt-4 block">
              Do you have experience in :
            </Label>
            <div className="flex flex-col gap-3">
              {skills.map((area, idx) => <div key={idx} className="flex gap-2">
                  <Checkbox id={area} checked={formData.skillsServices.skills.includes(area)} onCheckedChange={() => toggleArrayItem("skillsServices", "skills", area)} className="cursor-pointer" />

                  <Label htmlFor={area} className="text-gray-700 font-normal cursor-pointer">
                    {area}
                  </Label>
                </div>)}
            </div>
          </div>
        </div>

        {/* Additional Experience */}
        <div>
          <h2 className="formHeading mb-4 mt-6">Years Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Mobility Assistance (Years)" type="number" name="mobilityYears" maxLength={2} placeholder="00" value={formData.skillsServices.mobilityYears} onChange={e => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            handleChange("skillsServices", "mobilityYears", val);
          }} />
            <Input label="Bathing Assistance (Years)" type="number" name="bathingYears" maxLength={2} placeholder="00" value={formData.skillsServices.bathingYears} onChange={e => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            handleChange("skillsServices", "bathingYears", val);
          }} />
            <Input label="Feeding Assistance (Years)" type="number" name="feedingYears" maxLength={2} placeholder="00" value={formData.skillsServices.feedingYears} onChange={e => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            handleChange("skillsServices", "feedingYears", val);
          }} />
          </div>
        </div>

        {/* Service Fee */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Service Fee (Per Day - KSh)" type="number" name="serviceFeeDay" maxLength={5} placeholder="e.g., 1500" value={formData?.skillsServices.serviceFeeDay} onChange={e => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 5);
          handleChange("skillsServices", "serviceFeeDay", val);
        }} />
          <Input label="Service Fee (Per Month - KSh)" type="number" name="serviceFeeMonth" maxLength={6} placeholder="e.g., 35000" value={formData?.skillsServices?.serviceFeeMonth} onChange={e => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 5);
          handleChange("skillsServices", "serviceFeeMonth", val);
        }} />
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
          return <div key={indx} className="border rounded-xl p-4">
                <FileUpload title={item.title} accept={item.accept} icon={item.icon} optional={item.optional || false} file={file} onFileSelect={file => handleFileSelect("documents", item.id, file)} />

                {file && !file?.type?.startsWith("image/") && <FilePreview file={file} alt={item.title} />}
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
export default NurseCreate;