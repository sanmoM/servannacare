"use client";

import Input from "@/components/shared/Input";
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
  Camera,
  Cross,
  FileText,
  IdCard,
  IdCardLanyard,
  Image as ImageIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import FileUpload from "../FileUpload";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";

const EmployeDetails = ({
  employeeNumber = 1,
  onDataChange,
  defaultValues = {},
}) => {
  const [country, setCountry] = useState("KE");

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
      title: "Good Conduct Certificate (Optional)",
      accept: "application/pdf,image/*",
      icon: <FileText size={32} />,
      required: false,
      optional: true,
    },
    {
      id: "firstAidCertificate",
      title: "First Aid Certificate",
      accept: "application/pdf,image/*",
      icon: <Cross size={32} />,
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

  const preferredOptions = [
    { title: "Live In" },
    { title: "DayBurg" },
  ];

  const [data, setData] = useState(() => ({
    name: defaultValues?.name || "",
    age: defaultValues?.age || "",
    education: defaultValues?.education || defaultValues?.educationLevel || "",
    experience: defaultValues?.experience || "",
    salaryRange: defaultValues?.salaryRange || "",
    phone: defaultValues?.phone || defaultValues?.number_two || "",
    preferred: Array.isArray(defaultValues?.preferred)
      ? defaultValues.preferred
      : defaultValues?.preferred
        ? [defaultValues.preferred]
        : [],
    location: defaultValues?.location || "",
    languages: defaultValues?.languages || [],
    isMother: defaultValues?.isMother ?? null,
    ageOfKids: defaultValues?.ageOfKids || defaultValues?.kidAges || [],
    isHandelingPet: defaultValues?.isHandelingPet ?? defaultValues?.handlePets ?? null,
    preferredRole: defaultValues?.preferredRole || "",
    cooking: defaultValues?.cooking || "",
    housekeeping: defaultValues?.housekeeping || "",
    childcare: defaultValues?.childcare || "",
    serviceFeeDay: defaultValues?.serviceFeeDay || "",
    serviceFeeMonth: defaultValues?.serviceFeeMonth || "",
    bio: defaultValues?.bio || "",
    idCopy: defaultValues?.idCopy || defaultValues?.iDCopy || null,
    profilePhoto: defaultValues?.profilePhoto || null,
    goodConductCertificate: defaultValues?.goodConductCertificate || null,
    firstAidCertificate: defaultValues?.firstAidCertificate || defaultValues?.aidCertificate || null,
    drivingLicense: defaultValues?.drivingLicense || null,
  }));

  const onDataChangeRef = React.useRef(onDataChange);
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  useEffect(() => {
    onDataChangeRef.current?.(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadio = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = (lan) => {
    setData((prev) => {
      const alreadySelected = prev.languages.includes(lan);
      return {
        ...prev,
        languages: alreadySelected
          ? prev.languages.filter((l) => l !== lan)
          : [...prev.languages, lan],
      };
    });
  };

  const togglePreferred = (pref) => {
    setData((prev) => ({
      ...prev,
      preferred: prev.preferred.includes(pref) ? [] : [pref],
    }));
  };

  const toggleAgeOfKids = (kid) => {
    setData((prev) => {
      const alreadySelected = prev.ageOfKids.includes(kid);
      return {
        ...prev,
        ageOfKids: alreadySelected
          ? prev.ageOfKids.filter((l) => l !== kid)
          : [...prev.ageOfKids, kid],
      };
    });
  };

  const handleFileSelect = (id, file) => {
    setData((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="formHeading mb-4">Employee Details</h2>

      <h3 className="text-base font-semibold text-primary border-b pb-2 mb-6">
        Employee #{employeeNumber}
      </h3>

      {/* Basic Information Section */}
      <h4 className="text-md font-semibold text-gray-800">Basic Information</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Full Name (As per ID)"
          name="name"
          placeholder="Enter employee name"
          value={data.name}
          onChange={handleChange}
        />
        <Input
          type="number"
          placeholder="Employee age"
          name="age"
          label="Age"
          value={data.age}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 2);
            setData((prev) => ({ ...prev, age: val }));
          }}
        />

        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">
            Education Level
          </Label>
          <Select
            value={data.education}
            onValueChange={(value) => handleSelect("education", value)}
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
            value={data.experience}
            onValueChange={(value) => handleSelect("experience", value)}
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
            value={data.salaryRange}
            onValueChange={(value) => handleSelect("salaryRange", value)}
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
              value={data?.phone}
              onChange={(value) => {
                setData((prev) => ({ ...prev, phone: value || "" }));
              }}
              onCountryChange={(countryCode) => {
                setCountry(countryCode);
                const exampleNumber = countryCode
                  ? getExampleNumber(countryCode)
                  : null;
                if (exampleNumber) {
                  setData((prev) => ({
                    ...prev,
                    phone: `+${exampleNumber.countryCallingCode}`,
                  }));
                } else {
                  setData((prev) => ({ ...prev, phone: "" }));
                }
              }}
            />
          </div>
          {data?.phone && !isValidPhoneNumber(data?.phone) && (
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
                  id={`pref-${item.title}-${employeeNumber}`}
                  checked={data.preferred.includes(item.title)}
                  onCheckedChange={() => togglePreferred(item.title)}
                />
                <Label
                  htmlFor={`pref-${item.title}-${employeeNumber}`}
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
        label="Location"
        name="location"
        placeholder="Type location.."
        value={data.location}
        onChange={handleChange}
      />

      <div>
        <Label className="font-medium text-gray-700">Languages</Label>
        <div className="flex flex-wrap gap-4 mt-3">
          {languages.map((lan) => (
            <div key={lan.id} className="flex items-center gap-2">
              <Checkbox
                id={`lang-${lan.value}-${employeeNumber}`}
                checked={data.languages.includes(lan.value)}
                onCheckedChange={() => toggleLanguage(lan.value)}
              />
              <Label
                className="text-gray-700 font-normal cursor-pointer"
                htmlFor={`lang-${lan.value}-${employeeNumber}`}
              >
                {lan.text}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="pt-4 border-t space-y-6">
        <h4 className="text-md font-semibold text-gray-800">Additional Details</h4>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mother Question */}
          <div className="w-full flex-1 flex flex-col">
            <Label>Are you a mother?</Label>
            <RadioGroup
              className="flex gap-4 mt-3"
              value={data.isMother !== null ? String(data.isMother) : ""}
              onValueChange={(value) =>
                setData((prev) => ({ ...prev, isMother: value === "true" }))
              }
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="true" id={`r1-${employeeNumber}`} />
                <Label
                  htmlFor={`r1-${employeeNumber}`}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="false" id={`r2-${employeeNumber}`} />
                <Label
                  htmlFor={`r2-${employeeNumber}`}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Age Preference */}
          <div className="flex-1">
            <Label>What age of kids do you prefer working with?</Label>
            <div className="flex flex-wrap mt-3 gap-4">
              {["0-3", "4-10", "11+"].map((age) => (
                <div key={age} className="flex gap-2">
                  <Checkbox
                    id={`age-${age}-${employeeNumber}`}
                    checked={data.ageOfKids.includes(age)}
                    onCheckedChange={() => toggleAgeOfKids(age)}
                  />
                  <Label
                    htmlFor={`age-${age}-${employeeNumber}`}
                    className="text-gray-700 font-normal cursor-pointer"
                  >
                    {`${age} years`}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pets & Preferred Role */}
        <div className="flex md:flex-row flex-col gap-6">
          <div className="flex-1">
            <Label>Are you okay handling pets?</Label>
            <RadioGroup
              className="flex gap-4 mt-3"
              value={data.isHandelingPet !== null ? String(data.isHandelingPet) : ""}
              onValueChange={(value) =>
                setData((prev) => ({ ...prev, isHandelingPet: value === "true" }))
              }
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="true" id={`p1-${employeeNumber}`} />
                <Label
                  htmlFor={`p1-${employeeNumber}`}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="false" id={`p2-${employeeNumber}`} />
                <Label
                  htmlFor={`p2-${employeeNumber}`}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex-1">
            <Label>Preferred Role</Label>
            <RadioGroup
              className="flex gap-4 mt-3"
              value={data.preferredRole}
              onValueChange={(value) =>
                setData((prev) => ({ ...prev, preferredRole: value }))
              }
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Nanny" id={`h1-${employeeNumber}`} />
                <Label
                  htmlFor={`h1-${employeeNumber}`}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Nanny
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Housekeeper" id={`h2-${employeeNumber}`} />
                <Label
                  htmlFor={`h2-${employeeNumber}`}
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Housekeeper
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Skill Proficiency */}
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
                  value={data[key]}
                  onValueChange={(val) =>
                    setData((prev) => ({ ...prev, [key]: val }))
                  }
                >
                  <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Strong">Strong</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Weak">Weak</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Service Fee (KSh) */}
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
              value={data.serviceFeeDay}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                handleChange({ target: { name: "serviceFeeDay", value: val } });
              }}
            />

            <Input
              label="Per Month"
              type="number"
              name="serviceFeeMonth"
              placeholder="e.g., 35000"
              value={data.serviceFeeMonth}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                handleChange({ target: { name: "serviceFeeMonth", value: val } });
              }}
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`bio-${employeeNumber}`}>Bio</Label>
          <Textarea
            id={`bio-${employeeNumber}`}
            value={data.bio}
            name="bio"
            placeholder="Write a brief bio about the employee and the services they offer.."
            className="border text-sm mt-2 p-3 w-full rounded-md outline-primary"
            rows={6}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Document Uploads Section */}
      <div className="pt-4 border-t space-y-4">
        <h4 className="text-md font-semibold text-gray-800">Document Uploads</h4>

        <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <FileUpload
              key={doc.id}
              title={doc.title}
              accept={doc.accept}
              icon={doc.icon}
              optional={doc.optional}
              file={data[doc.id]}
              onFileSelect={(file) => handleFileSelect(doc.id, file)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeDetails;
