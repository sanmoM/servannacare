"use client";

import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import { Calendar, Camera, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function page() {
  const { data, isLoading, error } = useFetch("/profile");
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    profilePhoto: null,
    gender: "",
    location: "",
  });
  
  

  // Create a URL for the profile photo if available
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
        profilePhoto: file, // Store the actual file object
      }));

      // Generate a URL for image preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.number || form.number.length !== 11)
      return toast.error("Phone number must be 11 digits after +254");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("number", form.number);
    formData.append("gender", form.gender);
    formData.append("location", form.location);

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
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading profile data</div>;

  return (
    <div className="p-4 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="sectionHeading">My Profile</h1>
        <div className="flex items-center text-xs text-gray-700 gap-2">
          <Calendar size={16} />
        </div>
      </div>

      <div className="border rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative h-36 w-36 lg:h-48 lg:w-48 rounded-full border-4 border-primary overflow-hidden shadow-lg">
            {/* Display Profile Image */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-full"
              />
            )}

            {/* FileUpload Component */}
            <FileUpload
              title="Profile Photo"
              accept="image/*"
              icon={<Camera size={32} />}
              file={form.profilePhoto}
              onFileSelect={handleProfilePic}
            />
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
          <Input
            label="Phone Number"
            value={form.number}
            onChange={handlePhoneChange}
          />
          <div className="flex flex-col mt-2">
            <p className="text-sm mb-1 text-black">Gender</p>
            <div className="flex gap-4">
              {["Male", "Female", "Other"].map((g) => (
                <label key={g} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, gender: e.target.value }))
                    }
                    className="accent-primary"
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
        </div>
      </div>

      {/* Update Button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleUpdate}>Update Profile</Button>
      </div>
    </div>
  );
}
