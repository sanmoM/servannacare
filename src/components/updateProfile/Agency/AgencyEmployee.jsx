"use client";
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
import { languages } from "@/utilities/data";
import {
  Camera,
  ClipboardPlus,
  Cross,
  FileText,
  IdCard,
  IdCardLanyard,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { postApi } from "@/lib/apiHandler";
import { useRouter } from "next/navigation";

const AgencyEmployee = ({ initialData, isUpdate, onSuccess }) => {
  const router = useRouter();
  const [ready, setReady] = useState(!isUpdate);

  const [formData, setFormData] = useState({
    name: "",
    educationLevel: "",
    location: "",
    experience: "",
    salaryRange: "",
    isMother: null,
    kidAges: [],
    handlePets: null,
    preferredRole: "",
    languages: [],
    cooking: "",
    housekeeping: "",
    childcare: "",
    liveType: "",
    documents: {
      aidCertificate: null,
      goodConductCertificate: null,
      idCopy: null,
      profilePhoto: null,
      drivingLicense: null,
    },
  });

  // console.log("dfdfdfdf",typeof(formData.isMother))

  useEffect(() => {
    if (initialData && isUpdate) {
      setFormData({
        name: initialData.name || "",
        educationLevel: initialData.educationLevel || "",
        location: initialData.location || "",
        experience: initialData.experience || "",
        salaryRange: initialData.salaryRange || "",
        preferredRole: initialData.preferredRole || "",
        liveType: initialData.liveType || "",
        cooking: initialData.cooking || "",
        housekeeping: initialData.housekeeping || "",
        childcare: initialData.childcare || "",

        isMother: initialData.isMother === 1,
        handlePets: initialData.handlePets === 1,

        kidAges: initialData.kidAges || [],
        languages: initialData.languages || [],

        documents: {
          aidCertificate:
            initialData.aidCertificate !== "null"
              ? initialData.aidCertificate
              : null,
          goodConductCertificate:
            initialData.goodConductCertificate !== "null"
              ? initialData.goodConductCertificate
              : null,
          idCopy: initialData.idCopy !== "null" ? initialData.idCopy : null,
          profilePhoto:
            initialData.profilePhoto !== "null"
              ? initialData.profilePhoto
              : null,
          drivingLicense:
            initialData.drivingLicense !== "null"
              ? initialData.drivingLicense
              : null,
        },
      });

      setReady(true);
    }
  }, [initialData, isUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleArray = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  // const normalizeValue = (key, value) => {
  //   if (key === "isMother" || key === "handlePets") {
  //     return value === "Yes";
  //   }
  //   return value;
  // };

  const handleFileSelect = (section, field, file) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: file },
    }));
  };

  const buildCreatePayload = (data) => {
    const payload = new FormData();

    const booleanToNumber = (value) => {
      if (typeof value === "boolean") return value ? 1 : 0;
      return value;
    };

    Object.entries(data).forEach(([key, value]) => {
      if (key === "documents") return;

      const finalValue = booleanToNumber(value);

      if (Array.isArray(finalValue)) {
        finalValue.forEach((v) => payload.append(`${key}[]`, v));
      } else if (finalValue !== null && finalValue !== undefined) {
        payload.append(key, finalValue);
      }
    });

    const requiredDocs = [
      "aidCertificate",
      "goodConductCertificate",
      "idCopy",
      "profilePhoto",
    ];
    const optionalDocs = ["drivingLicense"];

    requiredDocs.forEach((doc) => {
      if (!data.documents[doc]) {
        throw new Error(`Missing required document: ${doc}`);
      }
      if (data.documents[doc] instanceof File)
        payload.append(doc, data.documents[doc]);
    });

    optionalDocs.forEach((doc) => {
      if (data.documents[doc] instanceof File)
        payload.append(doc, data.documents[doc]);
    });

    return payload;
  };

  const buildUpdatePayload = (data) => {
    const payload = new FormData();

    const booleanToNumber = (value) => {
      if (typeof value === "boolean") return value ? 1 : 0;
      return value;
    };

    Object.entries(data).forEach(([key, value]) => {
      if (key === "documents") return;

      const finalValue = booleanToNumber(value);

      if (Array.isArray(finalValue)) {
        finalValue.forEach((v) => payload.append(`${key}[]`, v));
      } else if (finalValue !== null && finalValue !== undefined) {
        payload.append(key, finalValue);
      }
    });

    Object.entries(data.documents).forEach(([key, value]) => {
      if (value instanceof File) payload.append(key, value);
    });

    return payload;
  };

  // console.log("form data", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(isUpdate ? "Updating..." : "Adding...");

    try {
      const payload = isUpdate
        ? buildUpdatePayload(formData)
        : buildCreatePayload(formData);

      if (isUpdate) {
        await postApi(`/agency-employee/${initialData.id}`, payload);
        toast.success("Employee updated!", { id: loadingToast });
      } else {
        await postApi("/agency-employee", payload);
        router.push("/dashboard/agency-employee");
        toast.success("Employee added!", { id: loadingToast });
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Operation failed", { id: loadingToast });
    }
  };

  if (!ready) return null;

  const documents = [
    {
      id: "aidCertificate",
      title: "First Aid Certificate",
      accept: "application/pdf,image/*",
      icon: <Cross size={32} className="text-primary" />,
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
      id: "drivingLicense",
      title: "Driving License (Optional)",
      accept: "application/pdf,image/*",
      icon: <IdCard size={32} />,
      required: false,
      optional: true,
    },
  ];

  return (
    <div>
      <form className="relative pb-16" onSubmit={handleSubmit}>
        <div className="flex sm:gap-4 gap-6 flex-col sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Name"
              name="name"
              label="Full Name (as per ID)"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-1">
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Education Level
            </Label>
            <Select
              value={formData.educationLevel}
              onValueChange={(v) => handleSelectChange("educationLevel", v)}
            >
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {["Primary", "Secondary", "Diploma", "Bachelor", "Other"].map(
                    (edu) => (
                      <SelectItem key={edu} value={edu}>
                        {edu}
                      </SelectItem>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location, Experience, Salary */}
        <div className="flex gap-4 pt-6 flex-col sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Type your location."
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 flex gap-2">
            <div className="w-1/2">
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Experience
              </Label>
              <Select
                value={formData.experience}
                onValueChange={(v) => handleSelectChange("experience", v)}
              >
                <SelectTrigger className="py-5.5 shadow-none">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "1 year",
                    "2 years",
                    "3 years",
                    "4 years",
                    "5 years",
                    "More than 5+ years",
                  ].map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Salary (KSh)
              </Label>
              <Select
                value={formData.salaryRange}
                onValueChange={(v) => handleSelectChange("salaryRange", v)}
              >
                <SelectTrigger className="py-5.5 shadow-none">
                  <SelectValue placeholder="Salary range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="200-400">200 - 400</SelectItem>
                    <SelectItem value="400-600">400 - 600</SelectItem>
                    <SelectItem value="600-800">600 - 800</SelectItem>
                    <SelectItem value="800-1000">800 - 1000</SelectItem>
                    <SelectItem value="1000+">More than 1000</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Motherhood & Kid Ages */}
        <div className="flex flex-col py-8 sm:flex-row sm:gap-4 gap-8">
          <div className="flex-1">
            <Label className="mb-3 block text-sm font-medium">
              Are you a mother?
            </Label>
            <RadioGroup
              value={
                formData.isMother === null
                  ? undefined
                  : formData.isMother.toString()
              }
              onValueChange={(v) =>
                handleSelectChange("isMother", v === "true")
              }
            >
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="true" id="mYes" />
                  <Label htmlFor="mYes">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="mNo" />
                  <Label htmlFor="mNo">No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex-1">
            <Label className="mb-3 block text-sm font-medium">
              Preferred kid ages
            </Label>
            <div className="flex flex-wrap gap-y-2 gap-x-4">
              {["0-3", "4-10", "11+"].map((age) => (
                <div key={age} className="flex items-center gap-2">
                  <Checkbox
                    id={age}
                    checked={formData.kidAges.includes(age)}
                    onCheckedChange={() => toggleArray("kidAges", age)}
                  />
                  <Label htmlFor={age}>{age} years</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pets & Role */}
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-8">
          <div className="flex-1">
            <Label className="mb-3 block text-sm font-medium">
              Handle pets?
            </Label>
            <RadioGroup
              value={
                formData.handlePets === null
                  ? undefined
                  : formData.handlePets.toString()
              }
              onValueChange={(v) =>
                handleSelectChange("handlePets", v === "true")
              }
            >
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="true" id="pYes" />
                  <Label htmlFor="pYes">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="pNo" />
                  <Label htmlFor="pNo">No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div className="flex-1">
            <Label className="mb-3 block text-sm font-medium">
              Preferred Role
            </Label>
            <RadioGroup
              value={formData.preferredRole}
              onValueChange={(v) => handleSelectChange("preferredRole", v)}
            >
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Nanny" id="rNanny" />
                  <Label htmlFor="rNanny">Nanny</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Housekeeper" id="rHK" />
                  <Label htmlFor="rHK">Housekeeper</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Languages Checkboxes */}
        <div className="pt-8">
          <Label className="mb-3 block text-sm font-medium">
            Languages Spoken
          </Label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {languages.map((lan) => (
              <div key={lan.value} className="flex items-center gap-2">
                <Checkbox
                  id={lan.value}
                  checked={formData.languages.includes(lan.value)}
                  onCheckedChange={() => toggleArray("languages", lan.value)}
                />
                <Label htmlFor={lan.value}>{lan.text}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Proficiency Selects */}
        <div className="pt-6">
          <Label className="mb-3 block text-sm font-medium text-primary">
            Skill Proficiency
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["cooking", "housekeeping", "childcare"].map((skill) => (
              <div key={skill}>
                <Label className="block mb-2 capitalize text-xs font-semibold">
                  {skill}
                </Label>
                <Select
                  value={formData[skill]}
                  onValueChange={(v) => handleSelectChange(skill, v)}
                >
                  <SelectTrigger className="py-5.5 shadow-none">
                    <SelectValue placeholder="Proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strong">Strong</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Weak">Weak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Live Type */}
        <div className="py-6">
          <Label className="mb-3 block text-sm font-medium">
            Live Preference
          </Label>
          <RadioGroup
            value={formData.liveType}
            onValueChange={(v) => handleSelectChange("liveType", v)}
          >
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Live-In" id="lIn" />
                <Label htmlFor="lIn">Live In</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Dayburg" id="lDay" />
                <Label htmlFor="lDay">Dayburg</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Documents Section */}
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex gap-2 items-center mb-4">
          <ClipboardPlus className="text-primary" />
          <span className="text-sm font-medium text-primary">
            Update or upload documents
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

        <div className="pt-8">
          <Button
            className="w-full sm:w-48 bg-primary hover:bg-primary/90"
            size="lg"
            type="submit"
          >
            {isUpdate ? "Save Changes" : "Register Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgencyEmployee;
