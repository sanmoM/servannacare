"use client";

import React, { useEffect, useState } from "react";
import Progress from "../Progress";
import toast from "react-hot-toast";
import SignUpStart from "../SignUpStart";
import FileUpload from "../FileUpload";
import FilePreview from "../FilePreview";
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

const HomeHealthAssistant = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const totalSteps = 5;
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (user && !user?.is_profile_completed) {
      setStarted(true);
      setStep(1);
    }
  }, [user]);

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
      experience: "", // Years of Caregiving Experience
      homeBasedCare: null,
      homeBasedReferenceContact: "",
      hospitalBasedCare: null, // Hospital Exposure
      hospitalBasedReferenceContact: "",
      preferred: [], // Preferred Areas of Intervention
      caregivingTraining: null,
      firstAidTrained: null,
    },
    skillsServices: {
      skills: [], // Care Skills
      serviceFeeDay: "",
      serviceFeeMonth: "",
    },
    documents: {
      idCopy: null,
      profilePhoto: null,
      goodConductCertificate: null,
      educationCertificate: null,
      firstAidCertificate: null,
      referenceLetter: null, // References file
    },
  });

  const handleSignupSuccess = () => {
    setStarted(true);
  };

  const handleNext = (dataForStep) => {
    if (step === 1) setFormData((prev) => ({ ...prev, basicInfo: dataForStep }));
    if (step === 2) setFormData((prev) => ({ ...prev, experience: dataForStep }));
    if (step === 3) setFormData((prev) => ({ ...prev, skillsServices: dataForStep }));
    if (step === 4) setFormData((prev) => ({ ...prev, documents: dataForStep }));

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      submitProfile();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    router.push(`/dashboard/${user?.role}-profile`);
  };

  const submitProfile = async () => {
    const fd = new FormData();
    const { basicInfo, experience, skillsServices, documents } = formData;

    // Basic Info
    fd.append("name", basicInfo.name);
    fd.append("location", basicInfo.location);
    fd.append("age", basicInfo.age);
    fd.append("gender", basicInfo.gender);
    fd.append("bio", basicInfo.bio);
    fd.append("number_two", basicInfo.phone);
    fd.append("canDrive", basicInfo.canDrive ? 1 : 0);
    basicInfo.languages.forEach((lang) => fd.append("languages[]", lang));

    // Experience & Preferred
    fd.append("experience", experience.experience);
    fd.append("homeBasedCare", experience.homeBasedCare ? 1 : 0);
    fd.append("homeBasedReferenceContact", experience.homeBasedReferenceContact);
    fd.append("hospitalBasedCare", experience.hospitalBasedCare ? 1 : 0);
    fd.append("hospitalBasedReferenceContact", experience.hospitalBasedReferenceContact);
    fd.append("caregivingTraining", experience.caregivingTraining ? 1 : 0);
    fd.append("firstAidTrained", experience.firstAidTrained ? 1 : 0);
    experience.preferred.forEach((pref) => fd.append("preferred[]", pref));

    // Skills & Rates
    skillsServices.skills.forEach((skill) => fd.append("skills[]", skill));
    fd.append("serviceFeeDay", skillsServices.serviceFeeDay);
    fd.append("serviceFeeMonth", skillsServices.serviceFeeMonth);

    // Documents
    if (documents.idCopy) fd.append("idCopy", documents.idCopy);
    if (documents.profilePhoto) fd.append("profilePhoto", documents.profilePhoto);
    if (documents.goodConductCertificate) fd.append("goodConductCertificate", documents.goodConductCertificate);
    if (documents.educationCertificate) fd.append("educationCertificate", documents.educationCertificate);
    if (documents.firstAidCertificate) fd.append("firstAidCertificate", documents.firstAidCertificate);
    if (documents.referenceLetter) fd.append("referenceLetter", documents.referenceLetter);

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
        toast.error(res?.data?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during submission.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-2">
      <div className={`w-full ${!started ? "my-0" : "my-12"} max-w-[700px] bg-white`}>
        {!started ? (
          <SignUpStart onSuccess={handleSignupSuccess} />
        ) : (
          <>
            <div className="mb-6 w-full rounded-lg bg-red-100 px-4 py-3 text-red-900 border border-red-300">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xl font-medium">You can skip this and complete your profile later.</p>
                <Button onClick={handleSkip} className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-base font-medium cursor-pointer" isActionLoading={isActionLoading}>
                  Skip
                </Button>
              </div>
            </div>

            <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900">
              Home Health Assistant Registration
            </h2>

            <Progress currentStep={step} totalSteps={totalSteps} />

            <div className="space-y-8 mt-6">
              {step === 1 && <Step1BasicInfo defaultValues={formData.basicInfo} onNext={handleNext} />}
              {step === 2 && <Step2Experience defaultValues={formData.experience} onNext={handleNext} onBack={handleBack} />}
              {step === 3 && <Step3SkillsRates defaultValues={formData.skillsServices} onNext={handleNext} onBack={handleBack} />}
              {step === 4 && <Step4Documents defaultValues={formData.documents} onNext={handleNext} onBack={handleBack} />}
              {step === 5 && <Step5Review data={formData} onBack={handleBack} onConfirm={submitProfile} isActionLoading={isActionLoading} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Step 1: Basic Info ---
const Step1BasicInfo = ({ defaultValues, onNext }) => {
  const [data, setData] = useState({ ...defaultValues });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = (value) => {
    setData((prev) => {
      const alreadySelected = prev.languages.includes(value);
      return {
        ...prev,
        languages: alreadySelected
          ? prev.languages.filter((l) => l !== value)
          : [...prev.languages, value],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.name.trim()) return toast.error("Full Name is required");
    if (!data.phone.trim()) return toast.error("Phone number is required");
    if (!data.age.trim()) return toast.error("Age is required");
    if (!data.location.trim()) return toast.error("Location is required");
    if (!data.gender) return toast.error("Please select your gender");
    if (data.languages.length === 0) return toast.error("Select at least one language");
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="formHeading">Personal Information</h3>
      
      <Input label="Full Name" name="name" placeholder="Enter Full Name" value={data.name} onChange={handleChange} />
      
      <div className="flex gap-4">
        <div className="flex-1">
          <Input label="Phone Number" name="phone" placeholder="e.g. +254712345678" value={data.phone} onChange={handleChange} />
        </div>
        <div className="w-1/3">
          <Input type="number" label="Age" name="age" placeholder="Age" value={data.age} onChange={handleChange} />
        </div>
      </div>

      <Input label="Preferred Location" name="location" placeholder="e.g. Nairobi" value={data.location} onChange={handleChange} />

      <div>
        <Label className="mb-2 block">Gender</Label>
        <RadioGroup value={data.gender} onValueChange={(val) => setData((p) => ({ ...p, gender: val }))} className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Male" id="g1" />
            <Label htmlFor="g1" className="cursor-pointer">Male</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Female" id="g2" />
            <Label htmlFor="g2" className="cursor-pointer">Female</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="font-medium mb-3 block">Languages</Label>
        <div className="flex flex-wrap gap-4">
          {languages.map((lan) => (
            <div key={lan.id} className="flex items-center gap-2">
              <Checkbox id={`lang-${lan.value}`} checked={data.languages.includes(lan.value)} onCheckedChange={() => toggleLanguage(lan.value)} />
              <Label htmlFor={`lang-${lan.value}`} className="cursor-pointer">{lan.text}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Can you drive?</Label>
        <RadioGroup value={data.canDrive ? "Yes" : "No"} onValueChange={(val) => setData((p) => ({ ...p, canDrive: val === "Yes" }))} className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="d_yes" />
            <Label htmlFor="d_yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="d_no" />
            <Label htmlFor="d_no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="mb-2 block">Short Bio / Summary</Label>
        <Textarea name="bio" placeholder="Describe yourself..." value={data.bio} onChange={handleChange} className="min-h-[100px]" />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg">Next</Button>
      </div>
    </form>
  );
};

// --- Step 2: Experience & Training ---
const Step2Experience = ({ defaultValues, onNext, onBack }) => {
  const [data, setData] = useState({ ...defaultValues });

  const preferredInterventions = [
    "Childcare / Nanny Care",
    "Companionship",
    "Disability Support",
    "Elderly Care (e.g., Dementia Care)",
    "Special Needs Care",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadio = (field, val) => {
    setData((p) => ({ ...p, [field]: val === "Yes" }));
  };

  const togglePreferred = (item) => {
    setData((prev) => {
      const alreadySelected = prev.preferred.includes(item);
      return {
        ...prev,
        preferred: alreadySelected
          ? prev.preferred.filter((p) => p !== item)
          : [...prev.preferred, item],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.experience.trim()) return toast.error("Years of experience is required");
    if (data.homeBasedCare === null) return toast.error("Please answer the Home-Based Care question");
    if (data.homeBasedCare && !data.homeBasedReferenceContact.trim()) return toast.error("Home Care Reference Details are required");
    if (data.hospitalBasedCare === null) return toast.error("Please answer the Hospital Exposure question");
    if (data.hospitalBasedCare && !data.hospitalBasedReferenceContact.trim()) return toast.error("Hospital Reference Details are required");
    if (data.preferred.length === 0) return toast.error("Select at least one preferred area of intervention");
    if (data.caregivingTraining === null) return toast.error("Please answer the Caregiving Training question");
    if (data.firstAidTrained === null) return toast.error("Please answer the First Aid question");
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="formHeading">Experience & Training</h3>

      <Input type="number" label="Years of Caregiving Experience" name="experience" placeholder="Years" value={data.experience} onChange={handleChange} />

      <div>
        <Label className="mb-2 block">Home-Based Care Experience?</Label>
        <RadioGroup value={data.homeBasedCare == null ? "" : data.homeBasedCare ? "Yes" : "No"} onValueChange={(val) => handleRadio("homeBasedCare", val)} className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="home_yes" />
            <Label htmlFor="home_yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="home_no" />
            <Label htmlFor="home_no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      {data.homeBasedCare && (
        <div className="animate-in fade-in duration-300">
          <Label className="mb-2 block font-medium">Home Care Reference Details</Label>
          <Textarea name="homeBasedReferenceContact" placeholder="Provide name, contact number, and relationship..." value={data.homeBasedReferenceContact} onChange={handleChange} />
        </div>
      )}

      <div>
        <Label className="mb-2 block">Hospital Exposure / Experience?</Label>
        <RadioGroup value={data.hospitalBasedCare == null ? "" : data.hospitalBasedCare ? "Yes" : "No"} onValueChange={(val) => handleRadio("hospitalBasedCare", val)} className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="hosp_yes" />
            <Label htmlFor="hosp_yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="hosp_no" />
            <Label htmlFor="hosp_no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      {data.hospitalBasedCare && (
        <div className="animate-in fade-in duration-300">
          <Label className="mb-2 block font-medium">Hospital Care Reference Details</Label>
          <Textarea name="hospitalBasedReferenceContact" placeholder="Provide hospital name, contact, and duration..." value={data.hospitalBasedReferenceContact} onChange={handleChange} />
        </div>
      )}

      <div>
        <Label className="mb-2 block">Have you undergone Caregiving Training?</Label>
        <RadioGroup value={data.caregivingTraining == null ? "" : data.caregivingTraining ? "Yes" : "No"} onValueChange={(val) => handleRadio("caregivingTraining", val)} className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="train_yes" />
            <Label htmlFor="train_yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="train_no" />
            <Label htmlFor="train_no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="mb-2 block">Are you First Aid Trained?</Label>
        <RadioGroup value={data.firstAidTrained == null ? "" : data.firstAidTrained ? "Yes" : "No"} onValueChange={(val) => handleRadio("firstAidTrained", val)} className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Yes" id="fa_yes" />
            <Label htmlFor="fa_yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="No" id="fa_no" />
            <Label htmlFor="fa_no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="font-semibold block mb-3">Preferred Areas of Intervention</Label>
        <div className="space-y-2">
          {preferredInterventions.map((pref, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Checkbox id={`pref-${idx}`} checked={data.preferred.includes(pref)} onCheckedChange={() => togglePreferred(pref)} />
              <Label htmlFor={`pref-${idx}`} className="cursor-pointer font-normal">{pref}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

// --- Step 3: Care Skills & Rates ---
const Step3SkillsRates = ({ defaultValues, onNext, onBack }) => {
  const [data, setData] = useState({ ...defaultValues });

  const careSkillsList = [
    "Feeding Assistance",
    "Mobility Support",
    "Hygiene Care (Bathing, Dressing)",
    "Medication Reminders (Non-Clinical)",
    "Emotional Support / Companionship",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill) => {
    setData((prev) => {
      const alreadySelected = prev.skills.includes(skill);
      return {
        ...prev,
        skills: alreadySelected
          ? prev.skills.filter((s) => s !== skill)
          : [...prev.skills, skill],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.skills.length === 0) return toast.error("Please select at least one Care Skill");
    if (!data.serviceFeeDay.trim()) return toast.error("Daily Rate is required");
    if (!data.serviceFeeMonth.trim()) return toast.error("Monthly Rate is required");
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="formHeading">Care Skills & Rates</h3>

      <div>
        <Label className="font-semibold block mb-3">Care Skills</Label>
        <div className="space-y-2">
          {careSkillsList.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Checkbox id={`skill-${idx}`} checked={data.skills.includes(skill)} onCheckedChange={() => toggleSkill(skill)} />
              <Label htmlFor={`skill-${idx}`} className="cursor-pointer font-normal">{skill}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input type="number" label="Daily Rate (KSh)" name="serviceFeeDay" placeholder="KSh" value={data.serviceFeeDay} onChange={handleChange} />
        </div>
        <div className="flex-1">
          <Input type="number" label="Monthly Rate (KSh)" name="serviceFeeMonth" placeholder="KSh" value={data.serviceFeeMonth} onChange={handleChange} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

// --- Step 4: Documents ---
const Step4Documents = ({ defaultValues, onNext, onBack }) => {
  const [data, setData] = useState({ ...defaultValues });

  const handleFileSelect = (field, file) => {
    setData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.idCopy) return toast.error("National ID is required");
    if (!data.profilePhoto) return toast.error("Passport Photo is required");
    if (!data.goodConductCertificate) return toast.error("Certificate of Good Conduct is required");
    if (!data.educationCertificate) return toast.error("Educational Certificate is required");
    if (!data.referenceLetter) return toast.error("References file is required");
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="formHeading">Upload Documents</h3>

      <FileUpload title="National ID Copy" accept="application/pdf,image/*" icon={<IdCardLanyard size={32} />} file={data.idCopy} onFileSelect={(file) => handleFileSelect("idCopy", file)} />
      
      <FileUpload title="Passport / Profile Photo" accept="image/*" icon={<Camera size={32} />} file={data.profilePhoto} onFileSelect={(file) => handleFileSelect("profilePhoto", file)} />

      <FileUpload title="Certificate of Good Conduct" accept="application/pdf,image/*" icon={<FileText size={32} />} file={data.goodConductCertificate} onFileSelect={(file) => handleFileSelect("goodConductCertificate", file)} />

      <FileUpload title="Educational Certificates" accept="application/pdf,image/*" icon={<IdCard size={32} />} file={data.educationCertificate} onFileSelect={(file) => handleFileSelect("educationCertificate", file)} />

      <FileUpload title="First Aid Certificate (Optional)" accept="application/pdf,image/*" icon={<FileCheckCorner size={32} />} file={data.firstAidCertificate} onFileSelect={(file) => handleFileSelect("firstAidCertificate", file)} optional="Optional" />

      <FileUpload title="References (Letter / Contacts)" accept="application/pdf,image/*" icon={<FileCheckCorner size={32} />} file={data.referenceLetter} onFileSelect={(file) => handleFileSelect("referenceLetter", file)} />

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

// --- Step 5: Review & Submit ---
const Step5Review = ({ data, onBack, onConfirm, isActionLoading }) => {
  const { basicInfo, experience, skillsServices, documents } = data;

  return (
    <div className="space-y-6">
      <h3 className="formHeading">Review Information</h3>

      <div className="border rounded-lg p-5 space-y-4 bg-slate-50/50">
        <div>
          <h4 className="font-bold text-gray-800 border-b pb-1 mb-2">Personal Information</h4>
          <p className="text-sm"><b>Name:</b> {basicInfo.name}</p>
          <p className="text-sm"><b>Phone:</b> {basicInfo.phone}</p>
          <p className="text-sm"><b>Age:</b> {basicInfo.age}</p>
          <p className="text-sm"><b>Location:</b> {basicInfo.location}</p>
          <p className="text-sm"><b>Gender:</b> {basicInfo.gender}</p>
          <p className="text-sm"><b>Languages:</b> {basicInfo.languages.join(", ")}</p>
          <p className="text-sm"><b>Can Drive:</b> {basicInfo.canDrive ? "Yes" : "No"}</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 border-b pb-1 mb-2">Experience & Training</h4>
          <p className="text-sm"><b>Years of Caregiving Experience:</b> {experience.experience}</p>
          <p className="text-sm"><b>Home-Based Care Experience:</b> {experience.homeBasedCare ? "Yes" : "No"}</p>
          {experience.homeBasedCare && <p className="text-sm text-gray-600 pl-4 italic">Reference: {experience.homeBasedReferenceContact}</p>}
          <p className="text-sm"><b>Hospital Experience:</b> {experience.hospitalBasedCare ? "Yes" : "No"}</p>
          {experience.hospitalBasedCare && <p className="text-sm text-gray-600 pl-4 italic">Reference: {experience.hospitalBasedReferenceContact}</p>}
          <p className="text-sm"><b>Undergone Caregiving Training:</b> {experience.caregivingTraining ? "Yes" : "No"}</p>
          <p className="text-sm"><b>First Aid Trained:</b> {experience.firstAidTrained ? "Yes" : "No"}</p>
          <p className="text-sm"><b>Preferred Areas of Intervention:</b> {experience.preferred.join(", ")}</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 border-b pb-1 mb-2">Skills & Rates</h4>
          <p className="text-sm"><b>Care Skills:</b> {skillsServices.skills.join(", ")}</p>
          <p className="text-sm"><b>Daily Rate:</b> KSh {skillsServices.serviceFeeDay}</p>
          <p className="text-sm"><b>Monthly Rate:</b> KSh {skillsServices.serviceFeeMonth}</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 border-b pb-1 mb-2">Documents Uploaded</h4>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <FilePreview file={documents.idCopy} title="National ID Copy" />
            <FilePreview file={documents.profilePhoto} title="Passport Photo" />
            <FilePreview file={documents.goodConductCertificate} title="Good Conduct Certificate" />
            <FilePreview file={documents.educationCertificate} title="Educational Certificate" />
            {documents.firstAidCertificate && <FilePreview file={documents.firstAidCertificate} title="First Aid Certificate" />}
            <FilePreview file={documents.referenceLetter} title="References Document" />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isActionLoading}>Back</Button>
        <Button onClick={onConfirm} isActionLoading={isActionLoading}>Confirm & submit</Button>
      </div>
    </div>
  );
};

export default HomeHealthAssistant;
