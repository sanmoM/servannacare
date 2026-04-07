"use client";

import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";

export default function page() {
  const { data, isLoading, error, refetch } = useFetch("/profile");
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    profilePhoto: null,
    gender: "",
    location: "",
    age: "",
  });

  const [country, setCountry] = useState("KE");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (data?.data?.data) {
      const userInfo = data.data.data;
      setForm({
        name: userInfo.name || "",
        email: userInfo.email || "",
        number: userInfo.number || "",
        profilePhoto: userInfo.profilePhoto || null,
        gender: userInfo.gender || "",
        location: userInfo.location || "",
        age: userInfo.age || "",
      });

      if (userInfo.profilePhoto) {
        setImagePreview(userInfo.profilePhoto);
      }
    }
  }, [data]);

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith("+254"))
      val = "+254" + val.replace(/\D/g, "").slice(0, 7);
    else val = "+254" + val.slice(4).replace(/\D/g, "").slice(0, 7);
    setForm((prev) => ({ ...prev, number: val }));
  };

  const handleProfilePic = (file) => {
    if (file) {
      setForm((prev) => ({
        ...prev,
        profilePhoto: file,
      }));

      setImagePreview(file);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview instanceof File) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleUpdate = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.number || form.number.length !== 13)
      return toast.error("Phone number must be 9 digits after +254");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("number", form.number);
    formData.append("gender", form.gender);
    formData.append("location", form.location);
    formData.append("age", form.age);

    if (form.profilePhoto) {
      formData.append("profilePhoto", form.profilePhoto);
    }

    try {
      const response = await postApi("/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        await refetch();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (isLoading || !data?.data?.data) return <LoadingSpinner />;

  if (error) return <div>Error loading profile data</div>;

  return (
    <div className="lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="sectionHeading">My Profile</h1>
      </div>

      <div className="border rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex flex-col items-center">
          <div className="relative h-36 w-36 lg:h-48 lg:w-48 rounded-full overflow-hidden border-4 border-primary shadow-lg group">
            {imagePreview ? (
              <img
                src={
                  imagePreview instanceof File
                    ? URL.createObjectURL(imagePreview)
                    : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${imagePreview}`
                }
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Camera size={40} />
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Camera size={28} className="text-white" />
            </div>

            <div className="absolute inset-0 opacity-0 cursor-pointer">
              <FileUpload
                title="Profile Photo"
                accept="image/*"
                icon={<Camera size={32} />}
                file={form.profilePhoto}
                onFileSelect={handleProfilePic}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-4 text-center break-words">
            {form.name}
          </h2>
        </div>

        {/* Form Fields */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="flex-1">
            <Label>Phone Number</Label>

            <div className="w-full mt-2">
              <PhoneInputWithCountrySelect
                className="w-full border rounded-md px-3 py-2"
                international
                defaultCountry={country}
                value={form?.number}
                onChange={(value) => {
                  setForm((prev) => ({
                    ...prev,
                    number: value || "",
                  }));
                }}
                onCountryChange={(countryCode) => {
                  setCountry(countryCode);
                  const exampleNumber = countryCode
                    ? getExampleNumber(countryCode)
                    : null;
                  if (exampleNumber) {
                    setForm((prev) => ({
                      ...prev,
                      number: `+${exampleNumber.countryCallingCode}`,
                    }));
                  } else {
                    setForm((prev) => ({
                      ...prev,
                      number: "",
                    }));
                  }
                }}
              />
            </div>

            {form?.number && !isValidPhoneNumber(form?.number) && (
              <p className="text-red-500 text-sm mt-1">
                Invalid phone number for selected country
              </p>
            )}
          </div>
          <div className="flex flex-col mt-2">
            <p className="text-sm mb-1 text-black">Gender</p>
            <div className="flex gap-4">
              {["male", "female", "Other"].map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, gender: e.target.value }))
                    }
                    className="accent-primary cursor-pointer"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Enter your location"
          />
          <Input
            label="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            placeholder="Enter your age"
          />
        </div>
      </div>

      {/* Update Button */}
      <div className="mt-6 flex justify-end cursor-pointer">
        <Button className="cursor-pointer" onClick={handleUpdate}>
          Update Profile
        </Button>
      </div>
    </div>
  );
}
