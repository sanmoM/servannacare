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
import { Camera, FileText, IdCardLanyard, IdCard, FileCheckCorner } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const MedicalInstitutionNurseAide = ({
    initialData = null,
    isUpdate = false,
    onSuccess,
}) => {
    const router = useRouter();
    const [existingFiles, setExistingFiles] = useState({
        educationCertificate: null,
        goodConductCertificate: null,
        drivingLicense: null,
        referenceLetter: null
    });

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

    const servicesList = [
        "Basic Patient Care (bathing, dressing, feeding, and assisting with mobility)",
        "Vital Signs Monitoring (checking blood pressure, blood sugar, pulse, temperature, etc.)",
        "Compassion & Strong Communication Skills",
        "Special needs caregiver (e.g., autistic, deaf, blind)",
        "Elderly caregiving",
    ];

    const preferredInterventions = [
        "Pre and post pregnancy care",
        "Post surgery cage",
        "Elderly care",
    ];

    const [data, setData] = useState({
        fullName: "",
        age: "",
        location: "",
        experience: "",
        gender: "",
        canDrive: null,
        preferredRole: "Nurse Aide",
        education: "",
        languages: [],
        educationCertificate: null,

        hospitalBasedCare: null,
        date: [],
        hospitalBasedYearsOfExperience: "",
        hospitalBasedReferenceContact: "",

        homeBasedCare: null,
        homeBasedYearsOfExperience: "",
        homeBasedReferenceContact: "",

        services: [], // corresponds to skills in non-institution flow
        preferred: [], // preferred areas of intervention

        mobilityYears: "",
        bathingYears: "",
        feedingYears: "",
        serviceFeeDay: "",
        serviceFeeMonth: "",

        documents: {
            idCopy: null,
            profilePhoto: null,
            goodConductCertificate: null,
            drivingLicense: null,
            referenceLetter: null
        },
    });

    const [ready, setReady] = useState(!isUpdate);

    useEffect(() => {
        if (initialData && isUpdate) {
            setData({
                fullName: initialData.fullName || "",
                age: initialData.age || "",
                location: initialData.location || "",
                experience: initialData?.experience || "",
                gender: initialData.gender || "",
                canDrive: initialData.canDrive === 1,
                preferredRole: initialData.preferredRole || "Nurse Aide",
                education: initialData.education || "",
                languages: initialData.languages || [],
                educationCertificate: null,

                hospitalBasedCare: initialData.hospitalBasedCare === 1,
                date: initialData.schedule?.length ? initialData.schedule[0].date : [],
                hospitalBasedYearsOfExperience: initialData.hospitalBasedYearsOfExperience || "",
                hospitalBasedReferenceContact: initialData.hospitalBasedReferenceContact || "",

                homeBasedCare: initialData.homeBasedCare === 1,
                homeBasedYearsOfExperience: initialData.homeBasedYearsOfExperience || "",
                homeBasedReferenceContact: initialData.homeBasedReferenceContact || "",

                services: initialData.services || [],
                preferred: initialData.preferred || [],

                mobilityYears: initialData.mobilityYears || "",
                bathingYears: initialData.bathingYears || "",
                feedingYears: initialData.feedingYears || "",
                serviceFeeDay: initialData.serviceFeeDay || "",
                serviceFeeMonth: initialData.serviceFeeMonth || "",

                documents: {
                    idCopy: initialData.idCopy !== "null" ? initialData.idCopy : null,
                    profilePhoto: initialData.profilePhoto !== "null" ? initialData.profilePhoto : null,
                    goodConductCertificate: initialData.goodConductCertificate !== "null" ? initialData.goodConductCertificate : null,
                    drivingLicense: initialData.drivingLicense !== "null" ? initialData.drivingLicense : null,
                    referenceLetter: initialData.referenceLetter !== "null" ? initialData.referenceLetter : null,
                },
            });

            setExistingFiles({
                educationCertificate: initialData.educationCertificate !== "null" ? initialData.educationCertificate : null,
                goodConductCertificate: initialData.goodConductCertificate !== "null" ? initialData.goodConductCertificate : null,
                drivingLicense: initialData.drivingLicense !== "null" ? initialData.drivingLicense : null,
                referenceLetter: initialData.referenceLetter !== "null" ? initialData.referenceLetter : null,
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

        const booleanToNumber = (value) => {
            if (typeof value === "boolean") return value ? 1 : 0;
            return value;
        };

        Object.entries(data).forEach(([key, value]) => {
            if (key === "documents") return;

            if (["canDrive", "hospitalBasedCare", "homeBasedCare"].includes(key)) {
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

        // Basic Validation
        if (!data.fullName) return toast.error("Full Name is required");
        if (!data.age) return toast.error("Age is required");
        if (Number(data.age) < 25) return toast.error("Must be at least 25 years old");
        if (!data.location) return toast.error("Location is required");
        if (!data.gender) return toast.error("Gender is required");
        if (data.languages.length === 0) return toast.error("Select at least one language");
        if (data.canDrive === null) return toast.error("Please indicate if you can drive");
        if (!data.education) return toast.error("Education level is required");

        if (!data.educationCertificate && !existingFiles.educationCertificate) {
            return toast.error("Education certificate is required");
        }

        if (data.hospitalBasedCare) {
            if (!data.hospitalBasedYearsOfExperience) return toast.error("Hospital experience years required");
            if (!data.hospitalBasedReferenceContact) return toast.error("Hospital reference contact required");
        }

        if (data.homeBasedCare) {
            if (!data.homeBasedYearsOfExperience) return toast.error("Home experience years required");
            if (!data.homeBasedReferenceContact) return toast.error("Home reference contact required");
        }

        if (data.services.length === 0) return toast.error("Select at least one service/skill");
        if (data.preferred.length === 0) return toast.error("Select at least one preferred area of intervention");

        if (!data.mobilityYears) return toast.error("Mobility assistance experience required");
        if (!data.bathingYears) return toast.error("Bathing assistance experience required");
        if (!data.feedingYears) return toast.error("Feeding assistance experience required");
        if (!data.serviceFeeDay) return toast.error("Service fee per day is required");
        if (!data.serviceFeeMonth) return toast.error("Service fee per month is required");

        if (!isUpdate) {
            if (!data.documents.idCopy) return toast.error("ID copy is required");
            if (!data.documents.profilePhoto) return toast.error("Profile photo is required");
            if (!data.documents.goodConductCertificate) return toast.error("Good conduct certificate is required");
        }

        const loadingToast = toast.loading(
            isUpdate ? "Updating Nurse Aide..." : "Adding Nurse Aide..."
        );
        try {
            const payload = buildPayload();

            // We are appending specialistType to help backend differentiate if needed
            payload.append("specialistType", "Nurse Aide");

            if (isUpdate) {
                await postApi(`/institution-nurse/${initialData.id}`, payload);
                toast.success("Nurse Aide updated successfully!", { id: loadingToast });
            } else {
                await postApi("/institution-nurse", payload);
                toast.success("Nurse Aide added successfully!", { id: loadingToast });
            }

            onSuccess?.();
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Failed to submit data", {
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

                <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
                    <div className="flex-1 mt-4">
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
                            value={data.canDrive === null ? "" : String(data.canDrive)}
                            onValueChange={(val) =>
                                setData((p) => ({ ...p, canDrive: val === "true" }))
                            }
                            className="flex gap-4"
                        >
                            <RadioGroupItem value="true" id="d1" />
                            <Label htmlFor="d1">Yes</Label>

                            <RadioGroupItem value="false" id="d2" />
                            <Label htmlFor="d2">No</Label>
                        </RadioGroup>
                    </div>

                    {/* Role (Fixed for Nurse Aide) */}
                    <div className="flex-1">
                        <Label className={"mb-2"}>Your Role?</Label>
                        <div className="text-gray-700 font-medium py-2">Nurse Aide / Assistant</div>
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
                    existingFile={existingFiles.educationCertificate}
                    onFileSelect={(file) =>
                        setData((p) => ({ ...p, educationCertificate: file }))
                    }
                />

                {/* Hospital Based Care */}
                <div className="py-3 mt-6">
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

                {/* Home Based Care */}
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

                {/* Preferred Areas of Intervention */}
                <div className="mt-4">
                    <Label className={"mb-3"}>
                        What are your preferred areas of intervention
                    </Label>
                    <div className="flex flex-wrap flex-col gap-2 mt-2">
                        {preferredInterventions.map((pref, indx) => (
                            <div key={indx} className="flex items-center gap-2">
                                <Checkbox
                                    id={pref}
                                    checked={data.preferred.includes(pref)}
                                    onCheckedChange={() =>
                                        toggleArray("preferred", pref)
                                    }
                                />
                                <Label htmlFor={pref}>{pref}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* services/skills */}
                <div className="mt-6">
                    <Label className="mb-2 block">Do you have experience in:</Label>
                    <div className="flex flex-col gap-3">
                        {servicesList.map((skill, idx) => (
                            <div key={idx} className="flex gap-2">
                                <Checkbox
                                    checked={data.services.includes(skill)}
                                    onCheckedChange={() => toggleArray("services", skill)}
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

                {/* Schedule */}
                {initialData && (
                    <div className="mt-6">
                        <Label className="mb-2">Schedule</Label>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <SelectableCalendar
                                selectedDates={data.date || []}
                                onChange={(dates) =>
                                    setData((prev) => ({
                                        ...prev,
                                        date: dates,
                                    }))
                                }
                                disabled={(date) => {
                                    if (!data.date?.length) return false;
                                    const firstSelected = new Date(data.date[0]);
                                    firstSelected.setHours(0, 0, 0, 0);
                                    date.setHours(0, 0, 0, 0);
                                    return date < firstSelected;
                                }}
                            />
                        </div>
                    </div>
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
                                    existingFile={existingFiles[item.id]}
                                    onFileSelect={(file) =>
                                        handleFileSelect("documents", item.id, file)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8">
                    <Button
                        className={"w-full sm:w-auto"}
                        size={"lg"}
                        type="submit"
                    >
                        {isUpdate ? "Save Changes" : "Add Nurse Aide"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MedicalInstitutionNurseAide;
