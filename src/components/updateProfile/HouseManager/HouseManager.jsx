import FilePreview from "@/components/auth/register/FilePreview";
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
import useLocalUser from "@/hooks/useLocalUser";
import { postApi } from "@/lib/apiHandler";
import { languages } from "@/utilities/data";
import {
  Cross,
  FileText,
  IdCard,
  IdCardLanyard,
  ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const HouseManager = ({ data = {} }) => {
  console.log("datas", data);
  const router = useRouter();
  const { user } = useLocalUser();

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
    },

    additionalDetails: {
      isMother: data?.house_manager?.isMother ?? null,
      ageOfKids: data.house_manager?.ageOfKids || [],
      isHandelingPet: data.house_manager?.isHandelingPet ?? null,
      preferredRole: data?.preferredRole || "",
    },

    documents: {
      firstAidCertificate: data?.house_manager?.firstAidCertificate || "",
      goodConductCertificate: data?.goodConductCertificate || "",
      iDCopy: data?.idCopy || "",
      profilePhoto: data?.profilePhoto || "",
      drivingLicense: data?.drivingLicense || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      basicInfo: { ...p.basicInfo, [name]: value },
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
      basicInfo: { ...prev.basicInfo, phone: "+254" + digits },
    }));
  };

  const handleSelect = (field, value) => {
    setFormData((p) => ({
      ...p,
      basicInfo: { ...p.basicInfo, [field]: value },
    }));
  };

  const handleAdditionalSelect = (field, value) => {
    setFormData((p) => ({
      ...p,
      additionalDetails: { ...p.additionalDetails, [field]: value },
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

  // const handleFileSelect = (id, file) => {
  //   setFormData((p) => ({
  //     ...p,
  //     documents: { ...p.documents, [id]: file },
  //   }));
  // };
  const handleFileSelect = (id, file) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [id]: file,
      },
    }));
  };

  const documentConfig = [
    {
      id: "firstAidCertificate",
      title: "First Aid Certificate",
      required: true,
    },
    {
      id: "goodConductCertificate",
      title: "Good Conduct Certificate",
      required: true,
    },
    { id: "iDCopy", title: "ID Copy", required: true },
    { id: "profilePhoto", title: "Profile Photo", required: true },
    { id: "drivingLicense", title: "Driving License", required: false },
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

    formData.additionalDetails.ageOfKids.forEach((age) =>
      fd.append("ageOfKids[]", age),
    );

    Object.entries(formData.documents).forEach(([key, value]) => {
      if (value instanceof File) {
        const backendKey = key === "iDCopy" ? "idCopy" : key;
        fd.append(backendKey, value);
      }
    });

    // console.log("FORMDATA PAYLOAD");
    // for (let pair of fd.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    try {
      const res = await postApi("/update-profile", fd);

      if (res?.status === 200) {
        toast.success("Profile Updated Successfully!");
        router.push("/dashboard");

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            is_profile_completed: Boolean(res?.data?.is_profile_completed),
            is_profile_verified: Boolean(res?.data?.is_profile_verified),
          }),
        );
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Upload failed. Check console.");
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
              type="number"
              placeholder="Your age"
              name="age"
              label="Age"
              maxLength={2}
              value={formData.basicInfo?.age}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                handleChange("basicInfo", "age", val);
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
          <div>
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

          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Primary Number:
            </label>
            <Input
              name="phone"
              type="tel"
              placeholder="+254xxxxxxx"
              value={formData.basicInfo.number || "+254"}
              maxLength={11}
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
          <div className="flex-1">
            <Input
              label="Alternative Number:"
              name="phone"
              type="tel"
              placeholder="+254xxxxxxx"
              value={formData.basicInfo.phone || "+254"}
              maxLength={11}
              onFocus={() => {
                if (!formData.basicInfo.phone) {
                  setFormData((prev) => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, phone: "+254" },
                  }));
                }
              }}
              onChange={handlePhoneChange}
            />
          </div>
        </div>

        {/* Languages */}
        <div>
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

        <h4 className="formHeading">Document Uploads</h4>

        <div className="p-3 bg-primary/20 rounded-xl flex gap-2 items-center">
          <FileText />
          <span className="text-sm text-gray-700">
            Upload PDF or images (max size: 2MB each)
          </span>
        </div>

        <div className="mt-6">
          {/* File Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {documentConfig.map((doc) => (
              <div key={doc.id} className="border rounded-xl p-4">
                <FileUpload
                  title={doc.title}
                  accept="application/pdf,image/*"
                  file={formData.documents[doc.id]}
                  onFileSelect={(file) => handleFileSelect(doc.id, file)}
                />

                {/* <FilePreview
                  file={formData.documents[doc.id]}
                  alt={doc.title}
                /> */}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4 b-0">
          {user?.is_profile_completed && (
            <Button size={"lg"} type="submit">
              Update
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HouseManager;
