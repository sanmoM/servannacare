"use client";

import Input from "@/components/shared/Input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import FileUpload from "../../FileUpload";
import useLocalUser from "@/hooks/useLocalUser";
import { postApi } from "@/lib/apiHandler";
import { useRouter } from "next/navigation";

const CreateBasicInfo = ({ agencyData }) => {
  const router = useRouter();
  const { user, loaded } = useLocalUser();
  const [data, setData] = useState({
    companyName: agencyData?.companyName || "",
    kraPin: agencyData?.kraPin || "",
    companyRegistrationNumber: agencyData?.companyRegistrationNumber || "",
    number: agencyData?.number || "",
    businessLocation: agencyData?.businessLocation || "",
    agency_services: agencyData?.agency_services || [],
    registrationDocument: agencyData?.registrationDocument || null,
    placementFee: agencyData?.placementFee || "",
    replacementWindow: agencyData?.replacementWindow || "",
    numberOfReplacement: agencyData?.numberOfReplacement || "",
  });
  console.log("areas", data?.number);

  const train = [
    "Cooking",
    "House Keeping",
    "First Aid",
    "Childcare",
    "Communication",
    "None",
  ];

  useEffect(() => {
    if (agencyData && Object.keys(agencyData).length > 0) {
      setData((prev) => ({ ...prev, ...agencyData }));
    }
  }, [agencyData]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    if (!value.startsWith("+254")) {
      value = "+254";
    }

    let digits = value.slice(4).replace(/\D/g, "");

    if (digits.length > 9) digits = digits.slice(0, 9);

    setData((prev) => ({
      ...prev,
      number: "+254" + digits,
    }));
  };

  // Handle Checkbox Toggle
  const toggleTraining = (item) => {
    setData((prev) => {
      const alreadySelected = prev.agency_services.includes(item);
      return {
        ...prev,
        agency_services: alreadySelected
          ? prev.agency_services.filter((t) => t !== item)
          : [...prev.agency_services, item],
      };
    });
  };

  // Handle File Upload
  const handleFileSelect = (file) => {
    setData((prev) => ({ ...prev, registrationDocument: file }));
  };

  // Validation + Submit
  const handleCreate = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "companyName",
      "kraPin",
      "companyRegistrationNumber",
      "number",
      "businessLocation",
      "registrationDocument",
      "agency_services",
      "placementFee",
      "replacementWindow",
      "numberOfReplacement",
    ];

    for (let field of requiredFields) {
      if (
        !data[field] ||
        (Array.isArray(data[field]) && data[field].length === 0)
      ) {
        const formattedField = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        toast.error(`${formattedField} is required!`);
        return;
      }
    }

    if (data.number.length !== 11) {
      toast.error("Mobile number must be exactly 11 digits.");
      return;
    }

    console.log("Agency Data:", data);

    const fd = new FormData();

    fd.append("companyName", data.companyName);
    fd.append("kraPin", data.kraPin);
    fd.append("companyRegistrationNumber", data.companyRegistrationNumber);
    fd.append("number", data.number);
    fd.append("businessLocation", data.businessLocation);

    data.agency_services.forEach((service) => {
      fd.append("agency_services[]", service);
    });

    fd.append("placementFee", data.placementFee);
    fd.append("replacementWindow", data.replacementWindow);
    fd.append("numberOfReplacement", data.numberOfReplacement);

    if (data.registrationDocument instanceof File) {
      fd.append("registrationDocument", data.registrationDocument);
    }
    try {
      const res = await postApi("/create-profile", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.status === 200) {
        toast.success("Agency Registered Successfully!");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            is_profile_completed: Boolean(res?.data?.is_profile_completed),
            is_profile_verified: Boolean(res?.data?.is_profile_verified),
          }),
        );
        router.push(`/dashboard/${user?.role}-employee`);
        //todo this localStorage
      } else {
        toast.error(
          res?.data?.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message || `Error: ${error.response.status}`,
        );
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleCreate}>
      {/* Agency Details */}
      <div>
        <h2 className="formHeading">Agency Details Create</h2>

        <div className="flex pt-6 flex-col sm:flex-row gap-6 sm:gap-4">
          <Input
            type="text"
            label="Company/Business Name"
            name="companyName"
            placeholder="Company name"
            value={data.companyName}
            onChange={handleChange}
          />
          <Input
            label="KRA PIN Number"
            name="kraPin"
            placeholder="PIN number"
            value={data.kraPin}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col py-6 sm:flex-row gap-6 sm:gap-4">
          <Input
            label="Company Registration Number"
            name="companyRegistrationNumber"
            placeholder="Company registration number"
            value={data.companyRegistrationNumber}
            onChange={handleChange}
          />

          <Input
            label="Mobile Number"
            name="number"
            type="tel"
            placeholder="+254xxxxxxx"
            value={data.number || "+254"}
            maxLength={11}
            onFocus={() => {
              if (!data.number) {
                setData((prev) => ({
                  ...prev,
                  number: "+254",
                }));
              }
            }}
            onChange={handlePhoneChange}
          />
        </div>

        <Input
          label="Business Location"
          name="businessLocation"
          placeholder="Business location"
          value={data.businessLocation}
          onChange={handleChange}
        />

        <div className="mt-6">
          <FileUpload
            title="Company Registration Document"
            accept="application/pdf,image/*"
            icon={<FileText size={32} />}
            file={data.registrationDocument}
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>

      {/* Agency Services */}
      <div>
        <h2 className="formHeading">Agency Services</h2>

        <div className="py-6">
          <Label className="mb-3">What areas do you train on?</Label>
          <div className="flex gap-x-4 gap-y-2 flex-wrap items-center">
            {train.map((item, indx) => (
              <div key={indx} className="flex items-center gap-2">
                <Checkbox
                  id={`train-${indx}`}
                  checked={data.agency_services.includes(item)}
                  onCheckedChange={() => toggleTraining(item)}
                />
                <Label
                  htmlFor={`train-${indx}`}
                  className="text-gray-600 font-normal cursor-pointer"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex gap-6 sm:gap-4 mb-6 sm:flex-row flex-col">
            <Input
              type="number"
              placeholder="Placement fee"
              name="placementFee"
              label="Placement Fee (KSh)"
              value={data.placementFee}
              onChange={handleChange}
            />
            <Input
              type="number"
              placeholder="Replacement window"
              name="replacementWindow"
              label="Replacement Window (months)"
              value={data.replacementWindow}
              onChange={handleChange}
            />
          </div>

          <Input
            type="number"
            placeholder="Number of replacements offered"
            name="numberOfReplacement"
            label="Number of replacements"
            className="sm:w-1/2"
            value={data.numberOfReplacement}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        {!user?.is_profile_completed && (
          <Button className="w-full sm:w-auto" size="lg" type="submit">
            Create
          </Button>
        )}
      </div>
    </form>
  );
};

export default CreateBasicInfo;
