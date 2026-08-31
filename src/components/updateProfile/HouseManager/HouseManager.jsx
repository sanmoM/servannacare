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
import { postApi } from "@/lib/apiHandler";
import { languages } from "@/utilities/data";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { useAuth } from "@/hooks/useAuth";
import FilePreview from "@/components/auth/register/FilePreview";
import { Textarea } from "@/components/ui/textarea";
const HouseManager = ({ data = {} }) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [country, setCountry] = useState("KE");
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  // console.log(data);
  const [formData, setFormData] = useState({
    basicInfo: {
      name: data?.name || "",
      age: data?.age || "",
      education: data?.education || "",
      experience: data?.house_manager?.experience || "",
      salaryRange: data?.house_manager?.salaryRange || "",
      location: data?.location || "",
      preferred: Array.isArray(data?.preferred) ? data?.preferred : [],
      languages: data?.languages || [],
      number: data?.number || "",
      phone: data?.number_two || "",
      email: data?.email || "",
      bio: data?.bio || "",
    },
    additionalDetails: {
      isMother: data?.house_manager?.isMother ?? null,
      ageOfKids: data.house_manager?.ageOfKids || [],
      isHandelingPet: data.house_manager?.isHandelingPet ?? null,
      preferredRole: data?.preferredRole || "",
      cooking: data?.house_manager?.cooking || data?.cooking || "",
      housekeeping: data?.house_manager?.housekeeping || data?.housekeeping || "",
      childcare: data?.house_manager?.childcare || data?.childcare || "",
      serviceFeeMonth: data?.house_manager?.serviceFeeMonth || "",
      serviceFeeDay: data?.house_manager?.serviceFeeDay || "",
      bio: data?.bio || "",
    },
    documents: {
      firstAidCertificate: data?.house_manager?.firstAidCertificate || "",
      goodConductCertificate: data?.goodConductCertificate || "",
      iDCopy: data?.idCopy || "",
      profilePhoto: data?.profilePhoto || "",
      drivingLicense: data?.drivingLicense || "",
    },
  });
  useEffect(() => {
    if (data?.number_two) {
      setFormData((prev) => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          phone: data?.number_two,
        },
      }));
    }
  }, [data]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      basicInfo: {
        ...p.basicInfo,
        [name]: value,
      },
    }));
  };
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("+254")) {
      value = "+254";
    }
    let digits = value.slice(4).replace(/\D/g, "");
    if (digits.length > 9) digits = digits.slice(0, 9);
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        phone: "+254" + digits,
      },
    }));
  };
  const handleSelect = (field, value) => {
    setFormData((p) => ({
      ...p,
      basicInfo: {
        ...p.basicInfo,
        [field]: value,
      },
    }));
  };
  const handleAdditionalSelect = (field, value) => {
    setFormData((p) => ({
      ...p,
      additionalDetails: {
        ...p.additionalDetails,
        [field]: value,
      },
    }));
  };
  const toggleLanguage = (lan) => {
    setFormData((p) => {
      const exists = p.basicInfo.languages.includes(lan);
      return {
        ...p,
        basicInfo: {
          ...p.basicInfo,
          languages: exists
            ? p.basicInfo.languages.filter((l) => l !== lan)
            : [...p.basicInfo.languages, lan],
        },
      };
    });
  };
  const toggleageOfKids = (age) => {
    setFormData((p) => {
      const exists = p.additionalDetails.ageOfKids.includes(age);
      return {
        ...p,
        additionalDetails: {
          ...p.additionalDetails,
          ageOfKids: exists
            ? p.additionalDetails.ageOfKids.filter((a) => a !== age)
            : [...p.additionalDetails.ageOfKids, age],
        },
      };
    });
  };
  const handleFileSelect = (id, file) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [id]: file,
      },
    }));
  };
  const isImageUrl = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  };
  const documentConfig = [
    {
      id: "firstAidCertificate",
      title: "First Aid Certificate",
      required: true,
    },
    {
      id: "goodConductCertificate",
      title: "Good Conduct Certificate (Optional)",
      required: false,
    },
    {
      id: "iDCopy",
      title: "ID Copy",
      required: true,
    },
    {
      id: "profilePhoto",
      title: "Profile Photo",
      required: true,
    },
    {
      id: "drivingLicense",
      title: "Driving License",
      required: false,
    },
  ];
  const preferred = [
    {
      title: "Live In",
    },
    {
      title: "DayBurg",
    },
  ];
  const togglepreferred = (pref) => {
    setFormData((prev) => {
      const exists = prev.basicInfo.preferred.includes(pref);
      return {
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          preferred: exists ? [] : [pref],
        },
      };
    });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", formData.basicInfo.name);
    fd.append("age", formData.basicInfo.age);
    fd.append("bio", formData.basicInfo.bio);
    fd.append("education", formData.basicInfo.education);
    fd.append("experience", formData.basicInfo.experience);
    fd.append("salaryRange", formData.basicInfo.salaryRange);
    fd.append("number", formData.basicInfo.number);
    fd.append("number_two", formData.basicInfo.phone);
    fd.append("location", formData.basicInfo.location);
    fd.append("email", formData.basicInfo.email);
    formData.basicInfo.preferred.forEach((p) => fd.append("preferred[]", p));
    formData.basicInfo.languages.forEach((l) => fd.append("languages[]", l));
    fd.append(
      "isMother",
      formData.additionalDetails.isMother === "true" ? 1 : 0,
    );
    fd.append(
      "isHandelingPet",
      formData.additionalDetails.isHandelingPet === "true" ? 1 : 0,
    );
    fd.append("preferredRole", formData.additionalDetails.preferredRole);
    fd.append("cooking", formData.additionalDetails.cooking || "");
    fd.append("housekeeping", formData.additionalDetails.housekeeping || "");
    fd.append("childcare", formData.additionalDetails.childcare || "");
    fd.append("serviceFeeDay", formData.additionalDetails.serviceFeeDay);
    fd.append("serviceFeeMonth", formData.additionalDetails.serviceFeeMonth);
    formData.additionalDetails.ageOfKids.forEach((age) =>
      fd.append("ageOfKids[]", age),
    );
    Object.entries(formData.documents).forEach(([key, value]) => {
      if (value instanceof File) {
        const backendKey = key === "iDCopy" ? "idCopy" : key;
        fd.append(backendKey, value);
      }
    });

    // for (let pair of fd.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
    setIsActionLoading(true);
    try {
      const res = await postApi("/update-profile", fd);
      if (res?.status === 200) {
        await refreshUser();
        toast.success("Profile Updated Successfully!");
        router.push("/dashboard");
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Upload failed", error);
    } finally {
      setIsActionLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleUpdate} className="space-y-6 relative">
        <h4 className="formHeading">Basic Information</h4>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <Input
              label="Full Name (AS per ID)"
              name="name"
              placeholder="Enter your name"
              defaultValue={formData?.basicInfo?.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Your age"
              name="age"
              label="Age"
              value={formData.basicInfo?.age}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 3);
                setFormData((prev) => ({
                  ...prev,
                  basicInfo: {
                    ...prev.basicInfo,
                    age: val,
                  },
                }));
              }}
            />
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Education Level
            </label>
            <Select
              value={formData.basicInfo?.education}
              onValueChange={(v) => handleSelect("education", v)}
            >
              <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                <SelectValue placeholder="Select a category" />
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
        </div>

        {/* Experience + Salary */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Experience (Years)
            </label>
            <Select
              value={formData.basicInfo.experience}
              onValueChange={(v) => handleSelect("experience", v)}
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

          {/* comment git */}

          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Salary Range (KSh)
            </label>
            <Select
              value={formData.basicInfo.salaryRange}
              onValueChange={(v) => handleSelect("salaryRange", v)}
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
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            {/* Location */}
            <Input
              label="Your Location"
              name="location"
              placeholder="Type your location.."
              value={formData.basicInfo.location}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Primary Email: (You can't change it.)
            </label>
            <Input
              name="email"
              type="email"
              placeholder="housemanager@gmail.com"
              value={formData.basicInfo.email}

              // onFocus={() => {
              //   if (!formData.basicInfo.phone) {
              //     setFormData((prev) => ({
              //       ...prev,
              //       basicInfo: { ...prev.basicInfo, phone: "+254" },
              //     }));
              //   }
              // }}
              // onChange={handlePhoneChange}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <Label>Primary Number: (you can't change it)</Label>

            <div className="w-full mt-2">
              <PhoneInputWithCountrySelect
                className="w-full border rounded-md px-3 py-2"
                international
                defaultCountry={country}
                value={formData.basicInfo.number || "+254"}
                inputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </div>
          </div>
          <div className="flex-1">
            <Label>Phone Number</Label>

            <div className="w-full mt-2">
              <PhoneInputWithCountrySelect
                className="w-full border rounded-md px-3 py-2"
                international
                defaultCountry={country}
                value={formData?.basicInfo?.phone}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    basicInfo: {
                      ...prev.basicInfo,
                      phone: value || "",
                    },
                  }));
                }}
                onCountryChange={(countryCode) => {
                  setCountry(countryCode);
                  const exampleNumber = countryCode
                    ? getExampleNumber(countryCode)
                    : null;
                  if (exampleNumber) {
                    setFormData((prev) => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        phone: `+${exampleNumber.countryCallingCode}`,
                      },
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      basicInfo: {
                        ...prev.basicInfo,
                        phone: "",
                      },
                    }));
                  }
                }}
              />
            </div>

            {formData?.basicInfo?.phone &&
              !isValidPhoneNumber(formData?.basicInfo?.phone) && (
                <p className="text-red-500 text-sm mt-1">
                  Invalid phone number for selected country
                </p>
              )}
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <Label className="font-medium text-gray-700">Languages</Label>
            <div className="flex flex-wrap gap-4 mt-3">
              {languages.map((lan) => (
                <div key={lan.id} className="flex items-center gap-2">
                  <Checkbox
                    id={lan.value}
                    checked={formData.basicInfo.languages.includes(lan.value)}
                    onCheckedChange={() => toggleLanguage(lan.value)}
                  />
                  <Label
                    className="text-gray-700 font-normal cursor-pointer"
                    htmlFor={lan.value}
                  >
                    {lan.text}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Service Offered
            </label>
            <div className="flex flex-wrap flex-col gap-2 ">
              {preferred.map((lan, indx) => (
                <div key={indx} className="flex items-center gap-2">
                  <Checkbox
                    id={lan.title}
                    checked={formData.basicInfo.preferred.includes(lan.title)}
                    onCheckedChange={() => togglepreferred(lan.title)}
                  />

                  <Label
                    htmlFor={lan.title}
                    className="text-gray-700 font-normal cursor-pointer"
                  >
                    {lan.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h4 className="formHeading">Additional Details</h4>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mother Question */}
          {/* yousuf doing this */}
          {/* <div className="w-full flex-1 flex flex-col">
            <Label>Are you a mother?</Label>
            <RadioGroup
              className="flex gap-4 mt-3"
              value={formData.additionalDetails.isMother}
              onValueChange={(v) => handleAdditionalSelect("isMother", v)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="yes" id="r1" />
                <Label
                  htmlFor="r1"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="no" id="r2" />
                <Label
                  htmlFor="r2"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
           </div> */}

          <div className="w-full flex-1 flex flex-col">
            <Label>Are you a mother?</Label>
            <RadioGroup
              className="flex gap-4 mt-3"
              value={String(formData.additionalDetails.isMother)}
              onValueChange={(v) => handleAdditionalSelect("isMother", v)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="true" id="r1" />
                <Label
                  htmlFor="r1"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="false" id="r2" />
                <Label
                  htmlFor="r2"
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
                <div key={age} className="flex  gap-2">
                  <Checkbox
                    id={`age-${age}`}
                    checked={formData.additionalDetails.ageOfKids.includes(age)}
                    onCheckedChange={() => toggleageOfKids(age)}
                  />
                  <Label
                    htmlFor={`age-${age}`}
                    className="text-gray-700 font-normal cursor-pointer"
                  >
                    {age === "11+" ? "years" : `${age} years`}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pets */}
        <div className="flex md:flex-row flex-col gap-6">
          {/* <div className="flex-1">
            <Label>Are you okay handling pets?</Label>
            <RadioGroup
              className="flex gap-4 mt-3"
              value={formData.additionalDetails.isHandelingPet}
              onValueChange={(v) => handleAdditionalSelect("isHandelingPet", v)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="yes" id="p1" />
                <Label
                  htmlFor="p1"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="no" id="p2" />
                <Label
                  htmlFor="p2"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
           </div> */}

          <div className="flex-1">
            <Label>Are you okay handling pets?</Label>
            <RadioGroup
              className="flex gap-4 mt-3"
              // value={formData?.additionalDetails?.isHandelingPet}
              value={String(formData?.additionalDetails?.isHandelingPet)}
              onValueChange={(v) => handleAdditionalSelect("isHandelingPet", v)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="true" id="p1" />
                <Label
                  htmlFor="p1"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="false" id="p2" />
                <Label
                  htmlFor="p2"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex-1">
            <Label>Preferred Role </Label>
            <RadioGroup
              className="flex gap-4 mt-3"
              value={formData.additionalDetails.preferredRole}
              onValueChange={(v) => handleAdditionalSelect("preferredRole", v)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Nanny" id="h1" />
                <Label
                  htmlFor="h1"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Nanny
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="Housekeeper" id="h2" />
                <Label
                  htmlFor="h2"
                  className="text-gray-700 font-normal cursor-pointer"
                >
                  Housekeeper
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Skill Proficiency */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
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
                  value={formData.additionalDetails[key]}
                  onValueChange={(val) => handleAdditionalSelect(key, val)}
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

        <div className="mt-6">
          {/* Section Label */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Service Fee (KSh)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Per Day"
              type="number"
              name="serviceFeeDay"
              placeholder="e.g., 1500"
              value={formData.additionalDetails.serviceFeeDay}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                setFormData((prev) => ({
                  ...prev,
                  additionalDetails: {
                    ...prev.additionalDetails,
                    serviceFeeDay: val,
                  },
                }));
              }}
            />

            <Input
              label="Per Month"
              type="number"
              name="serviceFeeMonth"
              placeholder="e.g., 35000"
              value={formData.additionalDetails.serviceFeeMonth}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                setFormData((prev) => ({
                  ...prev,
                  additionalDetails: {
                    ...prev.additionalDetails,
                    serviceFeeMonth: val,
                  },
                }));
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <Textarea
            value={formData.basicInfo.bio}
            name="bio"
            placeholder="Write a brief bio about yourself and the services you offer.."
            className="border text-sm mt-2 p-3 w-full rounded-md outline-primary"
            rows={6}
            onChange={handleChange}
          />
        </div>

        <h4 className="formHeading">Document Uploads</h4>

        <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {documentConfig?.map((doc) => {
              const file = formData?.documents[doc.id];
              const isImage = typeof file === "string" && isImageUrl(file);
              return (
                <div key={doc.id} className="border rounded-xl p-4">
                  <FileUpload
                    title={doc.title}
                    accept="application/pdf,image/*"
                    file={isImage ? file : null}
                    onFileSelect={(file) => handleFileSelect(doc.id, file)}
                  />

                  {file && !isImage && (
                    <FilePreview file={file} alt={doc?.title} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end mt-4 b-0">
          {user?.is_profile_completed && (
            <Button
              className={"cursor-pointer"}
              size={"lg"}
              type="submit"
              isActionLoading={isActionLoading}
            >
              Update
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
export default HouseManager;
