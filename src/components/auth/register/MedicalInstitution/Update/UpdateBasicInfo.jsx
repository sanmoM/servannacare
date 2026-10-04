"use client";

import Input from "@/components/shared/Input";
import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";
import FileUpload from "../../FileUpload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { postApi } from "@/lib/apiHandler";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const UpdateBasicInfo = ({
  instituteData = {}
}) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [country, setCountry] = useState("KE");
  const router = useRouter();
  const {
    user,
    refreshUser
  } = useAuth();
  const normalizeHireEquipment = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const s = String(val).toLowerCase();
    return s === "yes" || s === "true" || s === "1"
      ? "1"
      : s === "no" || s === "false" || s === "0"
      ? "0"
      : "";
  };

  const [data, setData] = useState({
    companyName: instituteData?.companyName || "",
    kraPin: instituteData?.kraPin || "",
    companyRegistrationNumber: instituteData?.companyRegistrationNumber || "",
    businessLocation: instituteData?.businessLocation || "",
    phone: instituteData?.number || "",
    do_you_hire_medical_equipment: normalizeHireEquipment(
      instituteData?.do_you_hire_medical_equipment ?? instituteData?.hire_equipment
    ),
    registrationDocument: null
  });
  useEffect(() => {
    if (!instituteData) return;
    setData(prev => ({
      ...prev,
      companyName: instituteData?.companyName || "",
      kraPin: instituteData?.kraPin || "",
      companyRegistrationNumber: instituteData?.companyRegistrationNumber || "",
      businessLocation: instituteData?.businessLocation || "",
      phone: instituteData?.number || "",
      do_you_hire_medical_equipment: normalizeHireEquipment(
        instituteData?.do_you_hire_medical_equipment ?? instituteData?.hire_equipment
      )
    }));
  }, [instituteData]);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handlePhoneChange = e => {
    let value = e.target.value;
    if (!value.startsWith("+254")) {
      value = "+254";
    }
    let digits = value.slice(4).replace(/\D/g, "");
    if (digits.length > 9) digits = digits.slice(0, 9);
    setData(prev => ({
      ...prev,
      phone: "+254" + digits
    }));
  };
  const handleFileSelect = file => {
    setData(prev => ({
      ...prev,
      registrationDocument: file
    }));
  };
  const handleUpdate = async e => {
    e.preventDefault();
    const requiredFields = ["companyName", "kraPin", "companyRegistrationNumber", "businessLocation", "phone"];
    for (let field of requiredFields) {
      if (!data[field]) {
        toast.error(`${field.replace(/([A-Z])/g, " $1")} is required!`);
        return;
      }
    }
    if (!data?.phone) {
      toast.error("Phone number is required!");
      return;
    }
    if (!isValidPhoneNumber(data?.phone)) {
      toast.error("Phone number is invalid or incomplete!");
      return;
    }
    if (
      data.do_you_hire_medical_equipment === "" ||
      data.do_you_hire_medical_equipment === null ||
      data.do_you_hire_medical_equipment === undefined
    ) {
      toast.error("Please specify if you hire medical equipment!");
      return;
    }
    const fd = new FormData();
    fd.append("companyName", data?.companyName);
    fd.append("kraPin", data?.kraPin);
    fd.append("companyRegistrationNumber", data?.companyRegistrationNumber);
    fd.append("number", data?.phone);
    fd.append("businessLocation", data?.businessLocation);
    const hireEquipValue =
      data?.do_you_hire_medical_equipment === "1" ||
      data?.do_you_hire_medical_equipment === 1 ||
      String(data?.do_you_hire_medical_equipment).toLowerCase() === "yes"
        ? 1
        : 0;
    fd.append("do_you_hire_medical_equipment", hireEquipValue);
    fd.append("hire_equipment", hireEquipValue);
    const documentKeys = ["registrationDocument"];
    documentKeys.forEach(key => {
      const value = data[key];
      if (value instanceof File) {
        fd.append(key, value);
      } else if (typeof value === "string" && value !== "") {
        fd.append(key, value);
      }
    });
    setIsActionLoading(true);
    try {
      const res = await postApi("/update-profile", fd);
      if (res?.status === 200) {
        await refreshUser();
        toast.success("Institute Data Updated Successfully!");
        router.push("/dashboard");
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Error updating profile", error);
    } finally {
      setIsActionLoading(false);
    }
  };
  return <form onSubmit={handleUpdate} className="space-y-6">
      <h2 className="formHeading">Institution Details Update</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
        <Input type="text" label="Company/Business Name" name="companyName" placeholder="Company name" value={data.companyName} onChange={handleChange} />

        <Input label="KRA PIN Number" name="kraPin" placeholder="PIN number" value={data.kraPin} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
        <div>
          <Input label="Company Registration Number" name="companyRegistrationNumber" placeholder="Company registration number" value={data.companyRegistrationNumber} onChange={handleChange} />
        </div>

        <div className="flex-1">
          <Label>Phone Number</Label>

          <div className="w-full mt-2">
            <PhoneInputWithCountrySelect className="w-full border rounded-md px-3 py-2" international defaultCountry={country} value={data?.phone} onChange={value => {
            setData(prev => ({
              ...prev,
              phone: value || ""
            }));
          }} onCountryChange={countryCode => {
            setCountry(countryCode);
            setData(prev => {
              if (prev.phone) return prev;
              const exampleNumber = getExampleNumber(countryCode);
              return {
                ...prev,
                phone: exampleNumber ? `+${exampleNumber.countryCallingCode}` : ""
              };
            });
          }} />
          </div>

          {data?.phone && !isValidPhoneNumber(data?.phone) && <p className="text-red-500 text-sm mt-1">
              Invalid phone number for selected country
            </p>}
        </div>
      </div>

      <Input label="Business Location" name="businessLocation" placeholder="Business location" value={data.businessLocation} onChange={handleChange} />

      <div className="pt-2">
        <Label className="mb-3 block font-medium text-gray-700">
          Do you hire medical equipment?
        </Label>
        <RadioGroup
          className="flex gap-6 mt-1"
          value={data.do_you_hire_medical_equipment || ""}
          onValueChange={value => setData(prev => ({ ...prev, do_you_hire_medical_equipment: value }))}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="1" id="update_hire_eq_yes" />
            <Label htmlFor="update_hire_eq_yes" className="text-gray-700 font-normal cursor-pointer">
              YES
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="0" id="update_hire_eq_no" />
            <Label htmlFor="update_hire_eq_no" className="text-gray-700 font-normal cursor-pointer">
              NO
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* File Upload */}
      <div className="mt-6">
        <FileUpload title="Company Registration Document" accept="application/pdf,image/*" icon={<FileText size={32} />} file={data.registrationDocument} onFileSelect={handleFileSelect} />

        {/* File Preview */}
        {(data.registrationDocument || instituteData?.registrationDocument) && <div className="mt-3">
            {data.registrationDocument ?
        // User selected a new file
        data.registrationDocument.type.startsWith("image/") ? <Image src={URL.createObjectURL(data.registrationDocument)} alt={data.companyName} height={100} width={100} className="object-cover" /> : <span className="text-gray-700 mt-2 block">
                  Selected file: {data.registrationDocument.name}
                </span> : typeof instituteData.registrationDocument === "string" ?
        // Existing file from server
        instituteData.registrationDocument.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? <Image src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${instituteData.registrationDocument}`} alt={data.companyName} height={100} width={100} className="object-cover" /> : <a href={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${instituteData.registrationDocument}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View Current Document
                </a> : null}
          </div>}
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        {user?.is_profile_completed && <Button className="w-full sm:w-auto cursor-pointer" size="lg" type="submit" isActionLoading={isActionLoading}>
            Update
          </Button>}
      </div>
    </form>;
};
export default UpdateBasicInfo;