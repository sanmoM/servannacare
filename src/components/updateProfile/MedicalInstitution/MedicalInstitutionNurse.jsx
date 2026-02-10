"use client";
import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { postApi } from "@/lib/apiHandler";
import { languages } from "@/utilities/data";
import { Camera, FileText, IdCardLanyard } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const MedicalInstitutionNurse = ({
  initialData = null,
  isUpdate = false,
  onSuccess,
}) => {
  console.log("ionit", initialData);
  const documents = [
    {
      id: "idCopy",
      title: "ID Copy",
      accept: "application/pdf,image/*",
      icon: <IdCardLanyard size={32} />,
    },
    {
      id: "profilePhoto",
      title: "Profile Photo",
      accept: "image/*",
      icon: <Camera size={32} />,
    },
  ];

  const skillsList = [
    "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
    "Vital Signs Monitoring (checking blood pressure, blood sugar, pulse, temperature, etc.)",
    "Medical Assistance: Assisting nurses with wound care and administering medication (in some cases)",
    "Compassion & Communication Skills",
    "Special needs children caregiving",
    "Elderly caregiving",
    "Handling Medical Equipment (e.g., feeding tubes, catheter, oxygen tanks)",
  ];

  const [data, setData] = useState({
    name: "",
    age: "",
    location: "",
    gender: "",
    canDrive: "",
    role: "",
    education: "",
    languages: [],
    educationCertificate: null,
    isNursingInKenya: null,
    registrationNumber: "",
    practiceLicense: null,
    hospitalBasedCare: null,
    hospitalBasedYearsOfExperience: "",
    hospitalBasedReferenceContact: "",
    homeBasedCare: null,
    homeBasedYearsOfExperience: "",
    homeBasedReferenceContact: "",
    skills: [],
    mobilityYears: "",
    bathingYears: "",
    feedingYears: "",
    serviceFeeDay: "",
    serviceFeeMonth: "",
    documents: { idCopy: null, profilePhoto: null, practiceLicense: null },
  });

  const [ready, setReady] = useState(!isUpdate);

  useEffect(() => {
    if (initialData && isUpdate) {
      setData({
        name: initialData.fullName || "",
        age: initialData.age || "",
        location: initialData.location || "",
        gender: initialData.gender || "",
        canDrive: initialData.canDrive ? "Yes" : "No",
        role: initialData.preferredRole || "",
        education: initialData.education || "",
        languages: initialData.languages || [],
        educationCertificate:
          initialData.educationCertificate !== "null"
            ? initialData.educationCertificate
            : null,
        isNursingInKenya: initialData.isNursingInKenya,
        registrationNumber: initialData.registrationNumber,
        hospitalBasedCare: initialData.hospitalBasedCare,
        hospitalBasedYearsOfExperience:
          initialData.hospitalBasedYearsOfExperience || "",
        hospitalBasedReferenceContact:
          initialData.hospitalBasedReferenceContact || "",
        homeBasedCare: initialData.homeBasedCare,
        homeBasedYearsOfExperience:
          initialData.homeBasedYearsOfExperience || "",
        homeBasedReferenceContact: initialData.homeBasedReferenceContact || "",
        skills: initialData.services || [],
        mobilityYears: initialData.mobilityYears || "",
        bathingYears: initialData.bathingYears || "",
        feedingYears: initialData.feedingYears || "",
        serviceFeeDay: initialData.serviceFeeDay || "",
        serviceFeeMonth: initialData.serviceFeeMonth || "",
        documents: {
          idCopy: initialData.idCopy !== "null" ? initialData.idCopy : null,
          practiceLicense:
            initialData.practiceLicense !== "null"
              ? initialData.practiceLicense
              : null,
          profilePhoto:
            initialData.profilePhoto !== "null"
              ? initialData.profilePhoto
              : null,
        },
      });
      setReady(true);
    }
  }, [initialData, isUpdate]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleArray = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleFileSelect = (section, field, file) => {
    if (section === "documents") {
      setData((prev) => ({
        ...prev,
        documents: { ...prev.documents, [field]: file },
      }));
    } else {
      setData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const buildPayload = () => {
    const payload = new FormData();

    payload.append(
      "care_institution_id",
      initialData?.care_institution_id || "",
    );

    Object.entries(data).forEach(([key, value]) => {
      if (key === "documents") return;

      if (
        [
          "canDrive",
          "isNursingInKenya",
          "hospitalBasedCare",
          "homeBasedCare",
        ].includes(key)
      ) {
        payload.append(key, value === "Yes");
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((v) => payload.append(`${key}[]`, v));
        return;
      }

      if (key === "educationCertificate" && value instanceof File) {
        payload.append("educationCertificate", value);
        return;
      }
      if (key === "serviceFeeDay" || key === "serviceFeeMonth") {
        payload.append(key, value);
        return;
      }

      payload.append(key, value);
    });

    Object.entries(data.documents).forEach(([key, file]) => {
      if (file instanceof File) payload.append(key, file);
    });

    return payload;
  };

  const numericInputFilter = (value, maxLength = 4) => {
    const filtered = value.replace(/\D/g, "");
    return filtered.slice(0, maxLength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data?.isNursingInKenya) {
      if (!data.registrationNumber) {
        toast.error("Registration Number is Required");
        return;
      }

      const hasExistingLicense =
        isUpdate &&
        initialData?.practiceLicense &&
        initialData.practiceLicense !== "null";

      if (!data.practiceLicense && !hasExistingLicense) {
        toast.error("Practising Licence is Required");
        return;
      }
    }

    const loadingToast = toast.loading(
      isUpdate ? "Updating Nurse..." : "Adding Nurse...",
    );
    try {
      const payload = buildPayload();
      if (isUpdate) {
        await postApi(`/institution-nurse/${initialData.id}`, payload);
        toast.success("Nurse updated successfully!", { id: loadingToast });
      } else {
        await postApi("/institution-nurse", payload);
        toast.success("Nurse added successfully!", { id: loadingToast });
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit nurse data", {
        id: loadingToast,
      });
    }
  };

  if (!ready) return null;

  return (
    <div>
      <form className="relative pb-16" onSubmit={handleSubmit}>
        {/* Name + Age */}
        <div className="flex flex-col pb-6 md:flex-row md:gap-4 gap-6">
          <Input
            placeholder="Name"
            name="name"
            label="Full Name (as per ID)"
            value={data.name}
            onChange={handleChange}
          />

          <Input
            type="number"
            placeholder="Your age"
            name="age"
            label="Age"
            value={data.age}
            // onKeyDown={blockInvalidKeys}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "age",
                  value: numericInputFilter(e.target.value, 4),
                },
              });
            }}
          />
        </div>

        {/* Location + Gender */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
          <Input
            label="Location"
            placeholder="Location"
            name="location"
            value={data.location}
            onChange={handleChange}
          />

          <div className="flex-1 mt-3">
            <Label className={"mb-2"}>Gender?</Label>
            <RadioGroup
              value={data.gender}
              onValueChange={(val) => setData((p) => ({ ...p, gender: val }))}
              className="flex gap-4"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Male" id="g1" />
                <Label htmlFor="g1">Male</Label>
              </div>

              <div className="flex items-center gap-3">
                <RadioGroupItem value="Female" id="g2" />
                <Label htmlFor="g2">Female</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Driving */}
        <div className="flex flex-col mt-8 sm:flex-row gap-6 sm:gap-4">
          <div className="flex-1">
            <Label className={"mb-2"}>Can you drive?</Label>
            <RadioGroup
              value={data.canDrive}
              onValueChange={(val) => setData((p) => ({ ...p, canDrive: val }))}
              className="flex gap-4"
            >
              <RadioGroupItem value="Yes" id="d1" />
              <Label htmlFor="d1">Yes</Label>

              <RadioGroupItem value="No" id="d2" />
              <Label htmlFor="d2">No</Label>
            </RadioGroup>
          </div>

          {/* Role */}
          <div className="flex-1">
            <Label className={"mb-2"}>Your Role?</Label>
            <RadioGroup
              value={data.role}
              onValueChange={(val) => setData((p) => ({ ...p, role: val }))}
              className="flex gap-4"
            >
              <RadioGroupItem value="Medical Nurse" id="r3" />
              <Label htmlFor="r3">Medical Nurse</Label>

              <RadioGroupItem value="Nurse Aide" id="r4" />
              <Label htmlFor="r4">Nurse Aide</Label>
            </RadioGroup>
          </div>
        </div>

        {/* Education Level */}
        <div className="my-6">
          <Label className="mb-3">Level of Education</Label>
          <RadioGroup
            value={data.education}
            onValueChange={(val) => setData((p) => ({ ...p, education: val }))}
            className="flex flex-wrap gap-4"
          >
            <RadioGroupItem value="Diploma In Nursing" id="edu1" />
            <Label htmlFor="edu1">Diploma In Nursing</Label>

            <RadioGroupItem value="Degree In Nursing" id="edu2" />
            <Label htmlFor="edu2">Degree In Nursing</Label>
          </RadioGroup>
        </div>

        {/* Languages */}
        <div className="pb-8">
          <Label className={"mb-3"}>Languages</Label>
          <div className="flex flex-wrap gap-4">
            {languages.map((lan, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox
                  checked={data.languages.includes(lan.value)}
                  onCheckedChange={() => toggleArray("languages", lan.value)}
                />
                <Label>{lan.text}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Education Certificate Upload */}
        <FileUpload
          title="Education Certificate (Compulsory)"
          accept="application/pdf,image/*"
          icon={<FileText size={32} />}
          file={data.educationCertificate}
          onFileSelect={(file) =>
            setData((p) => ({ ...p, educationCertificate: file }))
          }
        />

        {/* Nursing Council */}
        <div className="py-4">
          <Label className="mb-3 block">
            Are you registered with the Nursing Council of Kenya?
          </Label>
          <RadioGroup
            className="flex gap-4 mt-2"
            value={
              data.isNursingInKenya === null
                ? ""
                : String(data.isNursingInKenya)
            }
            onValueChange={(val) => {
              const isRegistered = val === "true";
              setData((prev) => ({
                ...prev,
                isNursingInKenya: isRegistered,
                registrationNumber: isRegistered ? prev.registrationNumber : "",
                practiceLicense: isRegistered ? prev.practiceLicense : null,
              }));
            }}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="true" id="kenya1" />
              <Label htmlFor="kenya1">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="false" id="kenya2" />
              <Label htmlFor="kenya2">No</Label>
            </div>
          </RadioGroup>

          {data.isNursingInKenya && (
            <div className="mt-4">
              <Input
                label={"Registration Number"}
                placeholder="Registration Number"
                type="number"
                value={data.registrationNumber || ""}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    registrationNumber: e.target.value,
                  }))
                }
              />

              <div className="mt-6">
                <FileUpload
                  title="Practising License"
                  accept="application/pdf,image/*"
                  icon={<FileText size={32} />}
                  file={data?.documents?.practiceLicense}
                  onFileSelect={(file) =>
                    setData((prev) => ({
                      ...prev,
                      practiceLicense: file,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="py-3">
          <Label className="mb-2">Hospital Based Care</Label>
          <RadioGroup
            value={
              data.hospitalBasedCare === null
                ? ""
                : String(data.hospitalBasedCare)
            }
            onValueChange={(val) =>
              setData((prev) => ({
                ...prev,
                hospitalBasedCare: val === "true",
              }))
            }
            className="flex gap-4"
          >
            <RadioGroupItem value="true" id="hb1" />
            <Label htmlFor="hb1">Yes</Label>

            <RadioGroupItem value="false" id="hb2" />
            <Label htmlFor="hb2">No</Label>
          </RadioGroup>

          {data.hospitalBasedCare && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Input
                type="number"
                label="Years of experience"
                value={data.hospitalBasedYearsOfExperience}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    hospitalBasedYearsOfExperience: e.target.value,
                  }))
                }
              />
              <Input
                label="Reference contact"
                value={data.hospitalBasedReferenceContact}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    hospitalBasedReferenceContact: e.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>

        <div className="py-3">
          <Label className="mb-2">Home Based Care</Label>
          <RadioGroup
            value={
              data.homeBasedCare === null ? "" : String(data.homeBasedCare)
            }
            onValueChange={(val) =>
              setData((prev) => ({ ...prev, homeBasedCare: val === "true" }))
            }
            className="flex gap-4"
          >
            <RadioGroupItem value="true" id="hb3" />
            <Label htmlFor="hb3">Yes</Label>

            <RadioGroupItem value="false" id="hb4" />
            <Label htmlFor="hb4">No</Label>
          </RadioGroup>

          {data.homeBasedCare && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Input
                type="number"
                label="Years of experience"
                value={data.homeBasedYearsOfExperience}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    homeBasedYearsOfExperience: e.target.value,
                  }))
                }
              />
              <Input
                label="Reference contact"
                value={data.homeBasedReferenceContact}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    homeBasedReferenceContact: e.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>

        {/* Skills */}
        <div>
          <Label className="mb-2 mt-4 block">Do you have experience in:</Label>
          <div className="flex flex-col gap-3">
            {skillsList.map((skill, idx) => (
              <div key={idx} className="flex gap-2">
                <Checkbox
                  checked={data.skills.includes(skill)}
                  onCheckedChange={() => toggleArray("skills", skill)}
                />
                <Label>{skill}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Years of Experience */}
        <div>
          <h2 className="formHeading mt-6">Years Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 pb-6">
            <Input
              label="Mobility Assistance (Years)"
              type="number"
              name="mobilityYears"
              value={data.mobilityYears}
              //   onKeyDown={blockInvalidKeys}
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "mobilityYears",
                    value: numericInputFilter(e.target.value, 4),
                  },
                });
              }}
            />

            <Input
              label="Bathing Assistance (Years)"
              type="number"
              name="bathingYears"
              value={data.bathingYears}
              //   onKeyDown={blockInvalidKeys}
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "bathingYears",
                    value: numericInputFilter(e.target.value, 4),
                  },
                });
              }}
            />

            <Input
              label="Feeding Assistance (Years)"
              type="number"
              name="feedingYears"
              value={data.feedingYears}
              //   onKeyDown={blockInvalidKeys}
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "feedingYears",
                    value: numericInputFilter(e.target.value, 4),
                  },
                });
              }}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Input
            label="Daily Rate (KSh)"
            placeholder="Daily Service Fee"
            name="serviceFeeDay"
            value={data.serviceFeeDay}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "serviceFeeDay",
                  value: numericInputFilter(e.target.value, 4),
                },
              });
            }}
          />
          <Input
            label="Monthly Rate (KSh)"
            placeholder="Monthly Service Fee"
            name="serviceFeeMonth"
            value={data.serviceFeeMonth}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "serviceFeeMonth",
                  value: numericInputFilter(e.target.value, 4),
                },
              });
            }}
          />
        </div>

        {/* Document Uploads */}
        <div>
          <h2 className="formHeading mt-6">Document Uploads</h2>
          <div className="p-3 bg-primary/20 my-6 rounded-xl flex gap-2 items-center">
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
                  file={data.documents[item.id]}
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
        </div>
        <div className="pt-4">
          <Button
            className={"w-full sm:absolute sm:b-0 sm:mt-4 sm:w-auto"}
            size={"lg"}
            type="submit"
          >
            {isUpdate ? "Save Changes" : "Add Nurse"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MedicalInstitutionNurse;
