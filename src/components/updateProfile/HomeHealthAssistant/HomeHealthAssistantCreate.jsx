"use client";

import React, { useState } from "react";
import FileUpload from "@/components/auth/register/FileUpload";
import FilePreview from "@/components/auth/register/FilePreview";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { postApi } from "@/lib/apiHandler";
import { useAuth } from "@/hooks/useAuth";
import { languages } from "@/utilities/data";
import { Camera, FileCheckCorner, FileText, IdCard, IdCardLanyard } from "lucide-react";
import toast from "react-hot-toast";

const HomeHealthAssistantCreate = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    basicInfo: {
      name: "",
      phone: "",
      age: "",
      location: "",
      gender: "",
      languages: [],
      canDrive: false,
      bio: "",
    },
    experience: {
      experience: "",
      homeBasedCare: null,
      homeBasedReferenceContact: "",
      hospitalBasedCare: null,
      hospitalBasedReferenceContact: "",
      preferred: [],
      caregivingTraining: null,
      firstAidTrained: null,
    },
    skillsServices: {
      skills: [],
      serviceFeeDay: "",
      serviceFeeMonth: "",
    },
    documents: {
      idCopy: null,
      profilePhoto: null,
      goodConductCertificate: null,
      educationCertificate: null,
      firstAidCertificate: null,
      referenceLetter: null,
    },
  });

  const preferredInterventions = [
    "Childcare / Nanny Care",
    "Companionship",
    "Disability Support",
    "Elderly Care (e.g., Dementia Care)",
    "Special Needs Care",
  ];

  const careSkillsList = [
    "Feeding Assistance",
    "Mobility Support",
    "Hygiene Care (Bathing, Dressing)",
    "Medication Reminders (Non-Clinical)",
    "Emotional Support / Companionship",
  ];

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [name]: value },
    }));
  };

  const handleExpChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      experience: { ...prev.experience, [name]: value },
    }));
  };

  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      skillsServices: { ...prev.skillsServices, [name]: value },
    }));
  };

  const handleRadio = (section, field, val) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: val === "Yes" },
    }));
  };

  const toggleLanguage = (value) => {
    setFormData((prev) => {
      const current = prev.basicInfo.languages;
      const updated = current.includes(value)
        ? current.filter((l) => l !== value)
        : [...current, value];
      return {
        ...prev,
        basicInfo: { ...prev.basicInfo, languages: updated },
      };
    });
  };

  const togglePreferred = (value) => {
    setFormData((prev) => {
      const current = prev.experience.preferred;
      const updated = current.includes(value)
        ? current.filter((p) => p !== value)
        : [...current, value];
      return {
        ...prev,
        experience: { ...prev.experience, preferred: updated },
      };
    });
  };

  const toggleSkill = (value) => {
    setFormData((prev) => {
      const current = prev.skillsServices.skills;
      const updated = current.includes(value)
        ? current.filter((s) => s !== value)
        : [...current, value];
      return {
        ...prev,
        skillsServices: { ...prev.skillsServices, skills: updated },
      };
    });
  };

  const handleFileSelect = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [field]: file },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { basicInfo, experience, skillsServices, documents } = formData;

    if (!basicInfo.name.trim()) return toast.error("Full Name is required");
    if (!basicInfo.phone.trim()) return toast.error("Phone number is required");
    if (!basicInfo.age.trim()) return toast.error("Age is required");
    if (!basicInfo.location.trim()) return toast.error("Location is required");
    if (!basicInfo.gender) return toast.error("Please select gender");
    if (basicInfo.languages.length === 0) return toast.error("Select at least one language");
    
    if (!experience.experience.trim()) return toast.error("Years of caregiving experience is required");
    if (experience.homeBasedCare === null) return toast.error("Please answer the Home-Based Care question");
    if (experience.homeBasedCare && !experience.homeBasedReferenceContact.trim()) return toast.error("Home Care Reference Details are required");
    if (experience.hospitalBasedCare === null) return toast.error("Please answer the Hospital Exposure question");
    if (experience.hospitalBasedCare && !experience.hospitalBasedReferenceContact.trim()) return toast.error("Hospital Reference Details are required");
    if (experience.caregivingTraining === null) return toast.error("Please answer the Caregiving Training question");
    if (experience.firstAidTrained === null) return toast.error("Please answer the First Aid question");
    if (experience.preferred.length === 0) return toast.error("Select at least one preferred area of intervention");

    if (skillsServices.skills.length === 0) return toast.error("Please select at least one Care Skill");
    if (!skillsServices.serviceFeeDay.trim()) return toast.error("Daily Rate is required");
    if (!skillsServices.serviceFeeMonth.trim()) return toast.error("Monthly Rate is required");

    if (!documents.idCopy) return toast.error("National ID copy is required");
    if (!documents.profilePhoto) return toast.error("Passport photo is required");
    if (!documents.goodConductCertificate) return toast.error("Good conduct certificate is required");
    if (!documents.educationCertificate) return toast.error("Educational Certificate is required");
    if (!documents.referenceLetter) return toast.error("References file is required");

    const fd = new FormData();
    fd.append("name", basicInfo.name);
    fd.append("location", basicInfo.location);
    fd.append("age", basicInfo.age);
    fd.append("gender", basicInfo.gender);
    fd.append("bio", basicInfo.bio);
    fd.append("number_two", basicInfo.phone);
    fd.append("canDrive", basicInfo.canDrive ? 1 : 0);
    basicInfo.languages.forEach((lang) => fd.append("languages[]", lang));

    fd.append("experience", experience.experience);
    fd.append("homeBasedCare", experience.homeBasedCare ? 1 : 0);
    fd.append("homeBasedReferenceContact", experience.homeBasedReferenceContact);
    fd.append("hospitalBasedCare", experience.hospitalBasedCare ? 1 : 0);
    fd.append("hospitalBasedReferenceContact", experience.hospitalBasedReferenceContact);
    fd.append("caregivingTraining", experience.caregivingTraining ? 1 : 0);
    fd.append("firstAidTrained", experience.firstAidTrained ? 1 : 0);
    experience.preferred.forEach((pref) => fd.append("preferred[]", pref));

    skillsServices.skills.forEach((skill) => fd.append("skills[]", skill));
    fd.append("serviceFeeDay", skillsServices.serviceFeeDay);
    fd.append("serviceFeeMonth", skillsServices.serviceFeeMonth);

    fd.append("idCopy", documents.idCopy);
    fd.append("profilePhoto", documents.profilePhoto);
    fd.append("goodConductCertificate", documents.goodConductCertificate);
    fd.append("educationCertificate", documents.educationCertificate);
    if (documents.firstAidCertificate) fd.append("firstAidCertificate", documents.firstAidCertificate);
    fd.append("referenceLetter", documents.referenceLetter);

    setIsActionLoading(true);
    try {
      const res = await postApi("/create-profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.status === 200) {
        toast.success("Profile completed successfully!");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.is_profile_completed = true;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
        await refreshUser();
        router.push("/dashboard/specialist-profile");
      } else {
        toast.error(res?.data?.message || "Failed to complete profile.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during submission.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-2xl border">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">Complete Profile - Home Health Assistant</h2>

      {/* Personal Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
        <Input label="Full Name" name="name" value={formData.basicInfo.name} onChange={handleBasicChange} />
        
        <div className="flex gap-4">
          <div className="flex-1">
            <Input label="Phone Number" name="phone" placeholder="+254..." value={formData.basicInfo.phone} onChange={handleBasicChange} />
          </div>
          <div className="w-1/3">
            <Input type="number" label="Age" name="age" value={formData.basicInfo.age} onChange={handleBasicChange} />
          </div>
        </div>

        <Input label="Preferred Location" name="location" placeholder="e.g. Nairobi" value={formData.basicInfo.location} onChange={handleBasicChange} />

        <div>
          <Label className="mb-2 block">Gender</Label>
          <RadioGroup value={formData.basicInfo.gender} onValueChange={(val) => setFormData(p => ({ ...p, basicInfo: { ...p.basicInfo, gender: val } }))} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Male" id="g_male" />
              <Label htmlFor="g_male" className="cursor-pointer">Male</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Female" id="g_female" />
              <Label htmlFor="g_female" className="cursor-pointer">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block font-medium">Languages</Label>
          <div className="flex flex-wrap gap-4">
            {languages.map((lan) => (
              <div key={lan.id} className="flex items-center gap-2">
                <Checkbox id={`lang-${lan.value}`} checked={formData.basicInfo.languages.includes(lan.value)} onCheckedChange={() => toggleLanguage(lan.value)} />
                <Label htmlFor={`lang-${lan.value}`} className="cursor-pointer">{lan.text}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Can you drive?</Label>
          <RadioGroup value={formData.basicInfo.canDrive ? "Yes" : "No"} onValueChange={(val) => setFormData(p => ({ ...p, basicInfo: { ...p.basicInfo, canDrive: val === "Yes" } }))} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="d_y" />
              <Label htmlFor="d_y" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="d_n" />
              <Label htmlFor="d_n" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block">Summary Bio</Label>
          <Textarea name="bio" placeholder="Tell us about yourself..." value={formData.basicInfo.bio} onChange={handleBasicChange} />
        </div>
      </div>

      {/* Experience & Training */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-primary">Experience & Training</h3>
        <Input type="number" label="Years of Caregiving Experience" name="experience" value={formData.experience.experience} onChange={handleExpChange} />

        <div>
          <Label className="mb-2 block">Home-Based Care Experience?</Label>
          <RadioGroup value={formData.experience.homeBasedCare == null ? "" : formData.experience.homeBasedCare ? "Yes" : "No"} onValueChange={(val) => handleRadio("experience", "homeBasedCare", val)} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="hb_y" />
              <Label htmlFor="hb_y" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="hb_n" />
              <Label htmlFor="hb_n" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.experience.homeBasedCare && (
          <div className="animate-in fade-in duration-300">
            <Label className="mb-2 block font-medium">Home Care Reference Details</Label>
            <Textarea name="homeBasedReferenceContact" placeholder="Provide name, contact, and description..." value={formData.experience.homeBasedReferenceContact} onChange={handleExpChange} />
          </div>
        )}

        <div>
          <Label className="mb-2 block">Hospital Exposure / Experience?</Label>
          <RadioGroup value={formData.experience.hospitalBasedCare == null ? "" : formData.experience.hospitalBasedCare ? "Yes" : "No"} onValueChange={(val) => handleRadio("experience", "hospitalBasedCare", val)} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="hp_y" />
              <Label htmlFor="hp_y" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="hp_n" />
              <Label htmlFor="hp_n" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.experience.hospitalBasedCare && (
          <div className="animate-in fade-in duration-300">
            <Label className="mb-2 block font-medium">Hospital Care Reference Details</Label>
            <Textarea name="hospitalBasedReferenceContact" placeholder="Provide details..." value={formData.experience.hospitalBasedReferenceContact} onChange={handleExpChange} />
          </div>
        )}

        <div>
          <Label className="mb-2 block">Have you undergone Caregiving Training?</Label>
          <RadioGroup value={formData.experience.caregivingTraining == null ? "" : formData.experience.caregivingTraining ? "Yes" : "No"} onValueChange={(val) => handleRadio("experience", "caregivingTraining", val)} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="tr_y" />
              <Label htmlFor="tr_y" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="tr_n" />
              <Label htmlFor="tr_n" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block">Are you First Aid Trained?</Label>
          <RadioGroup value={formData.experience.firstAidTrained == null ? "" : formData.experience.firstAidTrained ? "Yes" : "No"} onValueChange={(val) => handleRadio("experience", "firstAidTrained", val)} className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Yes" id="ft_y" />
              <Label htmlFor="ft_y" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="No" id="ft_n" />
              <Label htmlFor="ft_n" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="font-semibold block mb-3">Preferred Areas of Intervention</Label>
          <div className="space-y-2">
            {preferredInterventions.map((pref, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox id={`pref-${idx}`} checked={formData.experience.preferred.includes(pref)} onCheckedChange={() => togglePreferred(pref)} />
                <Label htmlFor={`pref-${idx}`} className="cursor-pointer font-normal">{pref}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills & Rates */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-primary">Care Skills & Salary Rates</h3>
        <div>
          <Label className="font-semibold block mb-3">Care Skills</Label>
          <div className="space-y-2">
            {careSkillsList.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox id={`skill-${idx}`} checked={formData.skillsServices.skills.includes(skill)} onCheckedChange={() => toggleSkill(skill)} />
                <Label htmlFor={`skill-${idx}`} className="cursor-pointer font-normal">{skill}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Input type="number" label="Daily Rate (KSh)" name="serviceFeeDay" placeholder="KSh" value={formData.skillsServices.serviceFeeDay} onChange={handleSkillChange} />
          </div>
          <div className="flex-1">
            <Input type="number" label="Monthly Rate (KSh)" name="serviceFeeMonth" placeholder="KSh" value={formData.skillsServices.serviceFeeMonth} onChange={handleSkillChange} />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-primary">Upload Documents</h3>

        <FileUpload title="National ID Copy" accept="application/pdf,image/*" icon={<IdCardLanyard size={32} />} file={formData.documents.idCopy} onFileSelect={(file) => handleFileSelect("idCopy", file)} />
        
        <FileUpload title="Passport / Profile Photo" accept="image/*" icon={<Camera size={32} />} file={formData.documents.profilePhoto} onFileSelect={(file) => handleFileSelect("profilePhoto", file)} />

        <FileUpload title="Certificate of Good Conduct" accept="application/pdf,image/*" icon={<FileText size={32} />} file={formData.documents.goodConductCertificate} onFileSelect={(file) => handleFileSelect("goodConductCertificate", file)} />

        <FileUpload title="Educational Certificates" accept="application/pdf,image/*" icon={<IdCard size={32} />} file={formData.documents.educationCertificate} onFileSelect={(file) => handleFileSelect("educationCertificate", file)} />

        <FileUpload title="First Aid Certificate (Optional)" accept="application/pdf,image/*" icon={<FileCheckCorner size={32} />} file={formData.documents.firstAidCertificate} onFileSelect={(file) => handleFileSelect("firstAidCertificate", file)} optional="Optional" />

        <FileUpload title="References (Letter / Contacts)" accept="application/pdf,image/*" icon={<FileCheckCorner size={32} />} file={formData.documents.referenceLetter} onFileSelect={(file) => handleFileSelect("referenceLetter", file)} />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" isActionLoading={isActionLoading}>
          Confirm & submit
        </Button>
      </div>
    </form>
  );
};

export default HomeHealthAssistantCreate;
