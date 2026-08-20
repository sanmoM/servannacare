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
import { Textarea } from "@/components/ui/textarea";
import { languages } from "@/utilities/data";
import {
  Cross,
  FileText,
  IdCard,
  IdCardLanyard,
  Image as ImageIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { postApi } from "@/lib/apiHandler";
import SelectableCalendar from "@/components/SelectableCalendar";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import FilePreview from "@/components/auth/register/FilePreview";

const AgencyEmployee = ({ initialData, isUpdate, onSuccess }) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [ready, setReady] = useState(!isUpdate);
  const [country, setCountry] = useState("KE");

  const preferredOptions = [
    { title: "Live In" },
    { title: "DayBurg" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "",
    experience: "",
    salaryRange: "",
    phone: "",
    preferred: [],
    location: "",
    languages: [],
    isMother: null,
    ageOfKids: [],
    isHandelingPet: null,
    preferredRole: "",
    cooking: "",
    housekeeping: "",
    childcare: "",
    serviceFeeDay: "",
    serviceFeeMonth: "",
    bio: "",
    date: [],
    documents: {
      idCopy: null,
      profilePhoto: null,
      goodConductCertificate: null,
      firstAidCertificate: null,
      drivingLicense: null,
    },
  });

  useEffect(() => {
    if (initialData && isUpdate) {
      let pref = [];
      if (Array.isArray(initialData.preferred)) {
        pref = initialData.preferred;
      } else if (initialData.preferred) {
        pref = [initialData.preferred];
      }

      setFormData({
        name: initialData.name || "",
        age: initialData.age || "",
        education: initialData.education || initialData.educationLevel || "",
        location: initialData.location || "",
        experience: initialData.experience || "",
        salaryRange: initialData.salaryRange || "",
        phone: initialData.phone || initialData.number_two || initialData.number || "",
        preferred: pref,
        preferredRole: initialData.preferredRole || "",
        cooking: initialData.cooking || "",
        housekeeping: initialData.housekeeping || "",
        childcare: initialData.childcare || "",
        serviceFeeDay: initialData.serviceFeeDay || "",
        serviceFeeMonth: initialData.serviceFeeMonth || "",
        bio: initialData.bio || "",
        date: initialData.schedule?.length ? initialData.schedule[0].date : [],
        isMother: initialData.isMother === 1 || initialData.isMother === true,
        isHandelingPet:
          initialData.isHandelingPet === 1 ||
          initialData.isHandelingPet === true ||
          initialData.handlePets === 1 ||
          initialData.handlePets === true,
        ageOfKids: initialData.ageOfKids || initialData.kidAges || [],
        languages: initialData.languages || [],
        documents: {
          idCopy: initialData.idCopy && initialData.idCopy !== "null" ? initialData.idCopy : null,
          profilePhoto: initialData.profilePhoto && initialData.profilePhoto !== "null" ? initialData.profilePhoto : null,
          goodConductCertificate:
            initialData.goodConductCertificate && initialData.goodConductCertificate !== "null"
              ? initialData.goodConductCertificate
              : null,
          firstAidCertificate:
            (initialData.firstAidCertificate || initialData.aidCertificate) &&
            initialData.firstAidCertificate !== "null" &&
            initialData.aidCertificate !== "null"
              ? initialData.firstAidCertificate || initialData.aidCertificate
              : null,
          drivingLicense:
            initialData.drivingLicense && initialData.drivingLicense !== "null"
              ? initialData.drivingLicense
              : null,
        },
      });
      setReady(true);
    }
  }, [initialData, isUpdate]);

  const validateForm = (data) => {
    const requiredFields = [
      "name",
      "age",
      "education",
      "experience",
      "salaryRange",
      "phone",
      "location",
      "preferredRole",
      "cooking",
      "housekeeping",
      "childcare",
      "serviceFeeDay",
      "serviceFeeMonth",
    ];

    for (let field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        throw new Error(`${formattedField} is required`);
      }
    }

    if (Number(data.age) < 25) throw new Error("Age must be 25 or above");
    if (!data.phone || !isValidPhoneNumber(data.phone)) {
      throw new Error("Invalid phone number");
    }
    if (!data.preferred || data.preferred.length === 0) {
      throw new Error("Please select at least one service preference");
    }
    if (!data.languages || data.languages.length === 0) {
      throw new Error("Please select at least one language");
    }
    if (data.isMother === null || data.isMother === undefined) {
      throw new Error("Please select if mother or not");
    }
    if (!data.ageOfKids || data.ageOfKids.length === 0) {
      throw new Error("Please select at least one kid age group");
    }
    if (data.isHandelingPet === null || data.isHandelingPet === undefined) {
      throw new Error("Please select preference for handling pets");
    }

    if (!isUpdate) {
      const requiredDocs = ["idCopy", "profilePhoto", "goodConductCertificate"];
      for (let doc of requiredDocs) {
        if (!data.documents[doc]) {
          throw new Error(`Missing required document: ${doc}`);
        }
      }
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = (lan) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(lan);
      return {
        ...prev,
        languages: exists
          ? prev.languages.filter((l) => l !== lan)
          : [...prev.languages, lan],
      };
    });
  };

  const togglePreferred = (pref) => {
    setFormData((prev) => ({
      ...prev,
      preferred: prev.preferred.includes(pref) ? [] : [pref],
    }));
  };

  const toggleAgeOfKids = (age) => {
    setFormData((prev) => {
      const exists = prev.ageOfKids.includes(age);
      return {
        ...prev,
        ageOfKids: exists
          ? prev.ageOfKids.filter((a) => a !== age)
          : [...prev.ageOfKids, age],
      };
    });
  };

  const handleFileSelect = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }));
  };

  const buildPayload = (data) => {
    const payload = new FormData();
    payload.append("name", data.name);
    payload.append("age", data.age);
    payload.append("education", data.education);
    payload.append("educationLevel", data.education);
    payload.append("experience", data.experience);
    payload.append("salaryRange", data.salaryRange);
    payload.append("phone", data.phone);
    payload.append("number_two", data.phone);
    payload.append("location", data.location);
    payload.append("preferredRole", data.preferredRole);
    payload.append("cooking", data.cooking);
    payload.append("housekeeping", data.housekeeping);
    payload.append("childcare", data.childcare);
    payload.append("serviceFeeDay", data.serviceFeeDay);
    payload.append("serviceFeeMonth", data.serviceFeeMonth);
    payload.append("bio", data.bio || "");
    payload.append("isMother", data.isMother ? 1 : 0);
    payload.append("isHandelingPet", data.isHandelingPet ? 1 : 0);
    payload.append("handlePets", data.isHandelingPet ? 1 : 0);

    data.preferred.forEach((p) => payload.append("preferred[]", p));
    data.languages.forEach((l) => payload.append("languages[]", l));
    data.ageOfKids.forEach((a) => {
      payload.append("ageOfKids[]", a);
      payload.append("kidAges[]", a);
    });

    if (data.date && Array.isArray(data.date)) {
      data.date.forEach((d) => payload.append("date[]", d));
    }

    Object.entries(data.documents).forEach(([key, value]) => {
      if (value instanceof File) {
        payload.append(key, value);
        if (key === "firstAidCertificate") {
          payload.append("aidCertificate", value);
        }
      }
    });

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(isUpdate ? "Updating..." : "Adding...");
    setIsActionLoading(true);
    try {
      validateForm(formData);
      const payload = buildPayload(formData);
      if (isUpdate) {
        await postApi(`/agency-employee/${initialData.id}`, payload);
        toast.success("Employee updated successfully!", { id: loadingToast });
      } else {
        await postApi("/agency-employee", payload);
        toast.success("Employee added successfully!", { id: loadingToast });
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Operation failed", { id: loadingToast });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!ready) return null;

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
      icon: <ImageIcon size={32} />,
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
      id: "firstAidCertificate",
      title: "First Aid Certificate",
      accept: "application/pdf,image/*",
      icon: <Cross size={32} className="text-primary" />,
      required: false,
      optional: true,
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
      <form className="relative pb-16 space-y-6" onSubmit={handleSubmit}>
        <h4 className="formHeading">Basic Information</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            placeholder="Enter full name"
            name="name"
            label="Full Name (as per ID)"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            placeholder="Employee age"
            name="age"
            label="Age"
            value={formData.age}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 2);
              setFormData((prev) => ({ ...prev, age: val }));
            }}
            required
          />

          <div>
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Education Level
            </Label>
            <Select
              value={formData.education}
              onValueChange={(v) => handleSelectChange("education", v)}
            >
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                  <SelectItem value="College">College</SelectItem>
                  <SelectItem value="University">University</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Experience (Years)
            </Label>
            <Select
              value={formData.experience}
              onValueChange={(v) => handleSelectChange("experience", v)}
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

          <div>
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Salary Range (KSh)
            </Label>
            <Select
              value={formData.salaryRange}
              onValueChange={(v) => handleSelectChange("salaryRange", v)}
            >
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select expected salary" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1000-20000">1000 - 20000</SelectItem>
                  <SelectItem value="21000-40000">21000 - 40000</SelectItem>
                  <SelectItem value="41000-60000">41000 - 60000</SelectItem>
                  <SelectItem value="61000-80000">61000 - 80000</SelectItem>
                  <SelectItem value="81000-90000">81000 - 90000</SelectItem>
                  <SelectItem value="100000+">More than 100000</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Phone Number</Label>
            <div className="w-full mt-2">
              <PhoneInputWithCountrySelect
                className="w-full border rounded-md px-3 py-2"
                international
                defaultCountry={country}
                value={formData?.phone}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, phone: value || "" }));
                }}
                onCountryChange={(countryCode) => {
                  setCountry(countryCode);
                  const exampleNumber = countryCode
                    ? getExampleNumber(countryCode)
                    : null;
                  if (exampleNumber) {
                    setFormData((prev) => ({
                      ...prev,
                      phone: `+${exampleNumber.countryCallingCode}`,
                    }));
                  } else {
                    setFormData((prev) => ({ ...prev, phone: "" }));
                  }
                }}
              />
            </div>
            {formData?.phone && !isValidPhoneNumber(formData?.phone) && (
              <p className="text-red-500 text-sm mt-1">
                Invalid phone number for selected country
              </p>
            )}
          </div>

          <div>
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Service Offered
            </Label>
            <div className="flex flex-wrap flex-col gap-2">
              {preferredOptions.map((item, indx) => (
                <div key={indx} className="flex items-center gap-2">
                  <Checkbox
                    id={`pref-update-${item.title}`}
                    checked={formData.preferred.includes(item.title)}
                    onCheckedChange={() => togglePreferred(item.title)}
                  />
                  <Label
                    htmlFor={`pref-update-${item.title}`}
                    className="text-gray-700 font-normal cursor-pointer"
                  >
                    {item.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Input
          placeholder="Type location.."
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <div>
          <Label className="font-medium text-gray-700">Languages</Label>
          <div className="flex flex-wrap gap-4 mt-3">
            {languages.map((lan) => (
              <div key={lan.value} className="flex items-center gap-2">
                <Checkbox
                  className="cursor-pointer"
                  id={`lang-update-${lan.value}`}
                  checked={formData.languages.includes(lan.value)}
                  onCheckedChange={() => toggleLanguage(lan.value)}
                />
                <Label
                  className="cursor-pointer text-gray-700 font-normal"
                  htmlFor={`lang-update-${lan.value}`}
                >
                  {lan.text}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="pt-4 border-t space-y-6">
          <h4 className="formHeading">Additional Details</h4>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full flex-1 flex flex-col">
              <Label>Are you a mother?</Label>
              <RadioGroup
                className="flex gap-4 mt-3"
                value={
                  formData.isMother !== null ? String(formData.isMother) : ""
                }
                onValueChange={(v) =>
                  handleSelectChange("isMother", v === "true")
                }
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem className="cursor-pointer" value="true" id="mYes" />
                  <Label className="cursor-pointer text-gray-700 font-normal" htmlFor="mYes">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem className="cursor-pointer" value="false" id="mNo" />
                  <Label className="cursor-pointer text-gray-700 font-normal" htmlFor="mNo">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex-1">
              <Label>What age of kids do you prefer working with?</Label>
              <div className="flex flex-wrap mt-3 gap-4">
                {["0-3", "4-10", "11+"].map((age) => (
                  <div key={age} className="flex gap-2">
                    <Checkbox
                      className="cursor-pointer"
                      id={`age-update-${age}`}
                      checked={formData.ageOfKids.includes(age)}
                      onCheckedChange={() => toggleAgeOfKids(age)}
                    />
                    <Label
                      className="cursor-pointer text-gray-700 font-normal"
                      htmlFor={`age-update-${age}`}
                    >
                      {age} years
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Label>Are you okay handling pets?</Label>
              <RadioGroup
                className="flex gap-4 mt-3"
                value={
                  formData.isHandelingPet !== null
                    ? String(formData.isHandelingPet)
                    : ""
                }
                onValueChange={(v) =>
                  handleSelectChange("isHandelingPet", v === "true")
                }
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem className="cursor-pointer" value="true" id="pYes" />
                  <Label className="cursor-pointer text-gray-700 font-normal" htmlFor="pYes">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem className="cursor-pointer" value="false" id="pNo" />
                  <Label className="cursor-pointer text-gray-700 font-normal" htmlFor="pNo">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex-1">
              <Label>Preferred Role</Label>
              <RadioGroup
                className="flex gap-4 mt-3"
                value={formData.preferredRole}
                onValueChange={(v) => handleSelectChange("preferredRole", v)}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem className="cursor-pointer" value="Nanny" id="rNanny" />
                  <Label className="cursor-pointer text-gray-700 font-normal" htmlFor="rNanny">
                    Nanny
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem className="cursor-pointer" value="Housekeeper" id="rHK" />
                  <Label className="cursor-pointer text-gray-700 font-normal" htmlFor="rHK">
                    Housekeeper
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3">
              Skill Proficiency
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: "cooking", label: "Cooking" },
                { key: "housekeeping", label: "Housekeeping" },
                { key: "childcare", label: "Childcare" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="block mb-2 text-sm font-medium text-gray-700">
                    {label}
                  </Label>
                  <Select
                    value={formData[key]}
                    onValueChange={(v) => handleSelectChange(key, v)}
                  >
                    <SelectTrigger className="py-5.5 shadow-none cursor-pointer w-full">
                      <SelectValue placeholder="Proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="Strong">
                        Strong
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Average">
                        Average
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Weak">
                        Weak
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3">
              Service Fee (KSh)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Per Day"
                type="number"
                name="serviceFeeDay"
                placeholder="e.g., 1500"
                value={formData.serviceFeeDay}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                  handleSelectChange("serviceFeeDay", val);
                }}
              />
              <Input
                label="Per Month"
                type="number"
                name="serviceFeeMonth"
                placeholder="e.g., 35000"
                value={formData.serviceFeeMonth}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  handleSelectChange("serviceFeeMonth", val);
                }}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio-agency-emp">Bio</Label>
            <Textarea
              id="bio-agency-emp"
              value={formData.bio}
              name="bio"
              placeholder="Write a brief bio about yourself and the services you offer.."
              className="border text-sm mt-2 p-3 w-full rounded-md outline-primary"
              rows={6}
              onChange={handleChange}
            />
          </div>
        </div>

        {isUpdate && (
          <div className="pt-4 border-t">
            <Label htmlFor="Schedule" className="block mb-2 text-sm font-medium text-gray-700">
              Schedule Availability
            </Label>
            <SelectableCalendar
              selectedDates={formData.date || []}
              onChange={(dates) =>
                setFormData((prev) => ({
                  ...prev,
                  date: dates,
                }))
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
        )}

        {/* Documents Section */}
        <div className="pt-4 border-t space-y-4">
          <h4 className="formHeading">Document Uploads</h4>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex gap-2 items-center">
            <FileText className="text-primary" />
            <span className="text-sm font-medium text-primary">
              Upload or update documents (PDF or images, max 2MB)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((item) => {
              const file = formData.documents[item.id];
              return (
                <div key={item.id} className="border rounded-xl p-4">
                  <FileUpload
                    title={item.title}
                    accept={item.accept}
                    icon={item.icon}
                    optional={item.optional || false}
                    file={file}
                    onFileSelect={(f) => handleFileSelect(item.id, f)}
                  />
                  {file && typeof file === "string" && (
                    <div className="mt-2">
                      <FilePreview file={file} alt={item.title} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <Button
            className="w-full cursor-pointer sm:w-48 bg-primary hover:bg-primary/90"
            size="lg"
            type="submit"
            isActionLoading={isActionLoading}
          >
            {isUpdate ? "Save Changes" : "Register Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgencyEmployee;