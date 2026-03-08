"use client";
import FileUpload from "@/components/auth/register/FileUpload";
import SelectableCalendar from "@/components/SelectableCalendar";
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
import { Camera, FileText, IdCardLanyard } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";

const MedicalInstitutionNurse = ({
  initialData = null,
  isUpdate = false,
  onSuccess,
}) => {
  const [country, setCountry] = useState("KE");
  const router = useRouter();
  const [existingFiles, setExistingFiles] = useState({
    educationCertificate: null,
    practiceLicense: null,
  });

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

  const servicesList = [
    "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
    "Vital Signs Monitoring (checking blood pressure, blood sugar, pulse, temperature, etc.)",
    "Medical Assistance: Assisting nurses with wound care and administering medication (in some cases)",
    "Compassion & Communication services",
    "Special needs children caregiving",
    "Elderly caregiving",
    "Handling Medical Equipment (e.g., feeding tubes, catheter, oxygen tanks)",
  ];

  const [data, setData] = useState({
    fullName: "",
    age: "",
    location: "",
    experience: "",
    gender: "",
    number_two: "",
    canDrive: null,
    preferredRole: "",
    education: "",
    languages: [],
    educationCertificate: null,
    isNursingInKenya: null,
    registrationNumber: "",
    practiceLicense: null,
    hospitalBasedCare: null,
    date: [],
    hospitalBasedYearsOfExperience: "",
    hospitalBasedReferenceContact: "",
    homeBasedCare: null,
    homeBasedYearsOfExperience: "",
    homeBasedReferenceContact: "",
    services: [],
    mobilityYears: "",
    bathingYears: "",
    feedingYears: "",
    serviceFeeDay: "",
    serviceFeeMonth: "",
    documents: { idCopy: null, profilePhoto: null },
  });

  const [ready, setReady] = useState(!isUpdate);

  useEffect(() => {
    if (initialData && isUpdate) {
      setData({
        fullName: initialData.fullName || "",
        age: initialData.age || "",
        location: initialData.location || "",
        experience: initialData?.experience || "",
        number_two: initialData?.number_two || "",
        gender: initialData.gender || "",
        canDrive: initialData.canDrive === 1,
        preferredRole: initialData.preferredRole || "",
        education: initialData.education || "",
        languages: initialData.languages || [],
        educationCertificate: null,
        practiceLicense: null,
        isNursingInKenya: initialData.isNursingInKenya === 1,
        registrationNumber: initialData.registrationNumber,

        hospitalBasedCare: initialData.hospitalBasedCare === 1,

        date: initialData.schedule?.length ? initialData.schedule[0].date : [],

        hospitalBasedYearsOfExperience:
          initialData.hospitalBasedYearsOfExperience || "",
        hospitalBasedReferenceContact:
          initialData.hospitalBasedReferenceContact || "",
        homeBasedCare: initialData.homeBasedCare === 1,
        homeBasedYearsOfExperience:
          initialData.homeBasedYearsOfExperience || "",
        homeBasedReferenceContact: initialData.homeBasedReferenceContact || "",
        services: initialData.services || [],
        mobilityYears: initialData.mobilityYears || "",
        bathingYears: initialData.bathingYears || "",
        feedingYears: initialData.feedingYears || "",
        serviceFeeDay: initialData.serviceFeeDay || "",
        serviceFeeMonth: initialData.serviceFeeMonth || "",
        documents: {
          idCopy: initialData.idCopy !== "null" ? initialData.idCopy : null,
          profilePhoto:
            initialData.profilePhoto !== "null"
              ? initialData.profilePhoto
              : null,
        },
      });

      setExistingFiles({
        educationCertificate:
          initialData.educationCertificate !== "null"
            ? initialData.educationCertificate
            : null,
        practiceLicense:
          initialData.practiceLicense !== "null"
            ? initialData.practiceLicense
            : null,
      });

      setReady(true);
    }
  }, [initialData, isUpdate]);

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

    const booleanToNumber = (value) => {
      if (typeof value === "boolean") return value ? 1 : 0;
      return value;
    };

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
        payload.append(key, booleanToNumber(value));
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

      if (key === "practiceLicense" && value instanceof File) {
        payload.append("practiceLicense", value);
        return;
      }

      if (value !== null && value !== undefined && !(value instanceof File)) {
        payload.append(key, value);
      }
    });

    Object.entries(data.documents).forEach(([key, file]) => {
      if (file instanceof File) {
        payload.append(key, file);
      }
    });

    return payload;
  };

  const numericInputFilter = (value, maxLength = 4) => {
    const filtered = value.replace(/\D/g, "");
    return filtered.slice(0, maxLength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.fullName) return toast.error("Full Name is required");
    if (!data.age) return toast.error("Age is required");
    if (Number(data.age) < 25)
      return toast.error("Must be at least 25 years old");
    if (!data.number_two) return toast.error("Phone Number is required");
    if (!data.location) return toast.error("Location is required");
    if (!data.gender) return toast.error("Gender is required");
    if (!data.preferredRole) return toast.error("preferredRole is required");
    if (data.languages.length === 0)
      return toast.error("Select at least one language");
    if (data.canDrive === null)
      return toast.error("Please indicate if you can drive");
    if (!data.education) return toast.error("Education level is required");

    if (!data.educationCertificate && !existingFiles.educationCertificate) {
      return toast.error("Education certificate is required");
    }

    if (data.hospitalBasedCare) {
      if (!data.hospitalBasedYearsOfExperience)
        return toast.error("Hospital experience years required");
      if (!data.hospitalBasedReferenceContact)
        return toast.error("Hospital reference contact required");
    }

    if (data.homeBasedCare) {
      if (!data.homeBasedYearsOfExperience)
        return toast.error("Home experience years required");
      if (!data.homeBasedReferenceContact)
        return toast.error("Home reference contact required");
    }

    if (data.services.length === 0)
      return toast.error("Select at least one service/skill");

    if (!data.mobilityYears)
      return toast.error("Mobility assistance experience required");
    if (!data.bathingYears)
      return toast.error("Bathing assistance experience required");
    if (!data.feedingYears)
      return toast.error("Feeding assistance experience required");
    if (!data.serviceFeeDay)
      return toast.error("Service fee per day is required");
    if (!data.serviceFeeMonth)
      return toast.error("Service fee per month is required");

    if (!isUpdate) {
      if (!data.documents.idCopy) return toast.error("ID copy is required");
      if (!data.documents.profilePhoto)
        return toast.error("Profile photo is required");
    }

    if (data?.isNursingInKenya) {
      if (!data.registrationNumber) {
        toast.error("Registration Number is Required");
        return;
      }

      const hasExistingLicense =
        isUpdate &&
        (existingFiles.practiceLicense || initialData?.practiceLicense);

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
      payload.append("type", "institution-nurse");
      if (isUpdate) {
        await postApi(`/institution-nurse/${initialData.id}`, payload);
        toast.success("Nurse updated successfully!", { id: loadingToast });
      } else {
        await postApi("/institution-nurse", payload);

        toast.success("Nurse added successfully!", { id: loadingToast });
      }

      onSuccess?.(isUpdate);
    } catch (error) {
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
            name="fullName"
            label="Full Name (as per ID)"
            value={data.fullName}
            onChange={handleChange}
          />

          <Input
            type="number"
            placeholder="Your age"
            name="age"
            label="Age"
            value={data.age}
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

        {/* Location + experience */}

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
          <div className="flex-1">
            <Input
              label="Location"
              placeholder="Location"
              name="location"
              value={data.location}
              onChange={handleChange}
            />
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Experience (Years)
            </label>
            <Select
              value={data.experience}
              onValueChange={(value) =>
                setData((prev) => ({ ...prev, experience: value }))
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
                  <SelectItem value="5+">More than 5 years</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5">
          <Label>Phone Number</Label>

          <div className="w-full mt-2">
            <PhoneInputWithCountrySelect
              className="w-full border rounded-md px-3 py-2"
              international
              defaultCountry={country}
              value={data?.number_two}
              onChange={(value) => {
                setData((prev) => ({ ...prev, number_two: value || "" }));
              }}
              onCountryChange={(countryCode) => {
                setCountry(countryCode);
                const exampleNumber = countryCode
                  ? getExampleNumber(countryCode)
                  : null;
                if (exampleNumber) {
                  setData((prev) => ({
                    ...prev,
                    number_two: `+${exampleNumber.countryCallingCode}`,
                  }));
                } else {
                  setData((prev) => ({ ...prev, number_two: "" }));
                }
              }}
            />
          </div>

          {data?.number_two && !isValidPhoneNumber(data?.number_two) && (
            <p className="text-red-500 text-sm mt-1">
              Invalid phone number for selected country
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 mt-4">
          <div className="flex-1">
            <Label className={"mb-2"}>Gender?</Label>
            <RadioGroup
              value={data.gender}
              onValueChange={(val) => setData((p) => ({ ...p, gender: val }))}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  className="cursor-pointer"
                  value="Male"
                  id="g1"
                />
                <Label className="cursor-pointer" htmlFor="g1">
                  Male
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
                  className="cursor-pointer"
                  value="Female"
                  id="g2"
                />
                <Label className="cursor-pointer" htmlFor="g2">
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex-1">
            <Label className={"mb-2"}>Can you drive?</Label>
            <RadioGroup
              value={data.canDrive === null ? "" : String(data.canDrive)}
              onValueChange={(val) =>
                setData((p) => ({ ...p, canDrive: val === "true" }))
              }
              className="flex gap-3"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  className="cursor-pointer"
                  value="true"
                  id="d1"
                />
                <Label className="cursor-pointer" htmlFor="d1">
                  Yes
                </Label>
              </div>

              <div className="flex item-center gap-2">
                <RadioGroupItem
                  className="cursor-pointer"
                  value="false"
                  id="d2"
                />
                <Label className="cursor-pointer" htmlFor="d2">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex flex-col mt-8 sm:flex-row gap-6 sm:gap-4 my-6">
          <div className="flex-1">
            <Label className="mb-3">Level of Education</Label>
            <RadioGroup
              value={data.education}
              onValueChange={(val) =>
                setData((p) => ({ ...p, education: val }))
              }
              className="flex flex-wrap gap-3"
            >
              <div className="flex item-center gap-2">
                <RadioGroupItem
                  className="cursor-pointer"
                  value="Diploma In Nursing"
                  id="edu1"
                />
                <Label className="cursor-pointer" htmlFor="edu1">
                  Diploma In Nursing
                </Label>
              </div>
              <div className="flex item-center gap-2">
                <RadioGroupItem
                  className="cursor-pointer"
                  value="Degree In Nursing"
                  id="edu2"
                />
                <Label className="cursor-pointer" htmlFor="edu2">
                  Degree In Nursing
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex-1">
            <Label className={"mb-2"}>Preferred Role</Label>
            <RadioGroup
              value={data.preferredRole}
              onValueChange={(val) =>
                setData((p) => ({ ...p, preferredRole: val }))
              }
              className="flex gap-3"
            >
              <div className="flex item-center gap-2">
                <RadioGroupItem
                  className="cursor-pointer"
                  value="Medical Nurse"
                  id="r3"
                />
                <Label className="cursor-pointer" htmlFor="r3">
                  Medical Nurse
                </Label>
              </div>

              <div className="flex item-center gap-2">
                <RadioGroupItem
                  className="cursor-pointer"
                  value="Nurse Aide"
                  id="r4"
                />
                <Label className="cursor-pointer" htmlFor="r4">
                  Nurse Aide
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Education Level */}

        {/* Languages */}
        <div className="pb-8">
          <Label className={"mb-3"}>Languages</Label>

          <div className="flex flex-wrap gap-4">
            {languages.map((lan, idx) => {
              const id = `language-${idx}`;

              return (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    className="cursor-pointer"
                    checked={data.languages.includes(lan.value)}
                    onCheckedChange={() => toggleArray("languages", lan.value)}
                  />

                  <Label htmlFor={id} className="cursor-pointer">
                    {lan.text}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        <FileUpload
          title="Education Certificate (Compulsory)"
          accept="application/pdf,image/*"
          icon={<FileText size={32} />}
          file={data.educationCertificate || existingFiles.educationCertificate}
          existingFile={existingFiles?.educationCertificate}
          onFileSelect={(file) =>
            setData((p) => ({ ...p, educationCertificate: file }))
          }
        />

        <div className="py-4">
          <Label className="mb-3 block">
            Are you registered with the Nursing Council of Kenya?
          </Label>
          <RadioGroup
            className="flex gap-3 mt-2"
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
              <RadioGroupItem
                className="cursor-pointer"
                value="true"
                id="kenya1"
              />
              <Label className="cursor-pointer" htmlFor="kenya1">
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                className="cursor-pointer"
                value="false"
                id="kenya2"
              />
              <Label className="cursor-pointer" htmlFor="kenya2">
                No
              </Label>
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
                  file={data?.practiceLicense || existingFiles?.practiceLicense}
                  existingFile={existingFiles.practiceLicense}
                  onFileSelect={(file) =>
                    setData((p) => ({ ...p, practiceLicense: file }))
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
            className="flex gap-3"
          >
            <div className="flex item-center gap-2">
              <RadioGroupItem
                className="cursor-pointer"
                value="true"
                id="hb1"
              />
              <Label className="cursor-pointer" htmlFor="hb1">
                Yes
              </Label>
            </div>

            <div className="flex item-center gap-2">
              <RadioGroupItem
                className="cursor-pointer"
                value="false"
                id="hb2"
              />
              <Label className="cursor-pointer" htmlFor="hb2">
                No
              </Label>
            </div>
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
            className="flex gap-3"
          >
            <div className="flex item-center gap-2">
              <RadioGroupItem
                className="cursor-pointer"
                value="true"
                id="hb3"
              />
              <Label className="cursor-pointer" htmlFor="hb3">
                Yes
              </Label>
            </div>

            <div className="flex item-center gap-2">
              <RadioGroupItem
                className="cursor-pointer"
                value="false"
                id="hb4"
              />
              <Label className="cursor-pointer" htmlFor="hb4">
                No
              </Label>
            </div>
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

        {/* services */}
        <div>
          <Label className="mb-2 mt-4 block">Do you have experience in:</Label>
          <div className="flex flex-col gap-3">
            {servicesList.map((skill, idx) => {
              const id = `service-${idx}`;
              return (
                <div key={idx} className="flex gap-2">
                  <Checkbox
                    className="cursor-pointer"
                    id={id}
                    checked={data.services.includes(skill)}
                    onCheckedChange={() => toggleArray("services", skill)}
                  />
                  <Label className="cursor-pointer" htmlFor={id}>
                    {skill}
                  </Label>
                </div>
              );
            })}
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

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
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

        {initialData && (
          <>
            <Label className="my-4">Schedule</Label>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <SelectableCalendar
                selectedDates={data.date || []}
                onChange={(dates) =>
                  setData((prev) => ({ ...prev, date: dates }))
                }
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const d = new Date(date);
                  d.setHours(0, 0, 0, 0);
                  return d < today;
                }}
              />
            </div>
          </>
        )}

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
        <div className="pt-6">
          <Button
            className="w-full sm:w-auto cursor-pointer"
            size="lg"
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
