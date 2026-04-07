"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Camera, Eye, EyeOff, Lock, UserCog } from "lucide-react";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";

import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
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

  const [securityForm, setSecurityForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [country, setCountry] = useState("KE");
  const [imagePreview, setImagePreview] = useState(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

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

  const handleProfilePic = (file) => {
    if (file) {
      setForm((prev) => ({ ...prev, profilePhoto: file }));
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
        headers: { "Content-Type": "multipart/form-data" },
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

  const handlePasswordUpdate = async () => {
    const { current_password, password, password_confirmation } = securityForm;

    if (!current_password || !password || !password_confirmation) {
      return toast.error("Please fill all password fields");
    }

    if (password !== password_confirmation) {
      return toast.error("New passwords do not match");
    }

    setIsUpdatingPassword(true);
    try {
      const response = await postApi("/change-password", securityForm);
      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setSecurityForm({
          current_password: "",
          password: "",
          password_confirmation: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading || !data?.data?.data) return <LoadingSpinner />;
  if (error) return <div>Error loading profile data</div>;

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-gray-500">
          Manage your profile and security preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger
            value="profile"
            className="flex cursor-pointer items-center gap-2"
          >
            <UserCog size={16} /> Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex cursor-pointer items-center gap-2"
          >
            <Lock size={16} /> Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <div className="border rounded-lg p-6 flex flex-col md:flex-row gap-8 items-center md:items-start bg-white shadow-sm">
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
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, number: value || "" }))
                    }
                    onCountryChange={(countryCode) => {
                      setCountry(countryCode);
                      const exampleNumber = countryCode
                        ? getExampleNumber(countryCode)
                        : null;
                      setForm((prev) => ({
                        ...prev,
                        number: exampleNumber
                          ? `+${exampleNumber.countryCallingCode}`
                          : "",
                      }));
                    }}
                  />
                </div>
                {form?.number && !isValidPhoneNumber(form?.number) && (
                  <p className="text-red-500 text-sm mt-1">
                    Invalid phone number
                  </p>
                )}
              </div>
              <div className="flex flex-col mt-2">
                <p className="text-sm mb-1 text-black font-medium">Gender</p>
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
                          setForm((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
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

          <div className="flex justify-end">
            <Button className="cursor-pointer" onClick={handleUpdate}>
              Update Profile
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          {/* <div className="border rounded-lg p-6 bg-white shadow-sm max-w-2xl"> */}
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <p className="text-sm text-gray-500">
                Ensure your account is using a strong password to stay secure.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={securityForm.current_password}
                onChange={(e) =>
                  setSecurityForm({
                    ...securityForm,
                    current_password: e.target.value,
                  })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword.new ? "text" : "password"}
                    placeholder="New password"
                    value={securityForm.password}
                    onChange={(e) =>
                      setSecurityForm({
                        ...securityForm,
                        password: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                    }
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showPassword.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showPassword.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={securityForm.password_confirmation}
                    onChange={(e) =>
                      setSecurityForm({
                        ...securityForm,
                        password_confirmation: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showPassword.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handlePasswordUpdate}
              disabled={isUpdatingPassword}
              className="w-full sm:w-auto cursor-pointer"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
