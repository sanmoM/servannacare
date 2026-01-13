"use client";

import FileUpload from "@/components/auth/register/FileUpload";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Calendar, Camera, Mail, MapPin, Phone, User, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Static user (no localStorage)
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "0712345678",
    location: "Nairobi, Kenya",
    joinedSince: "Jan 2025",
    profilePic: "/user.png",
  });

  // modal form state
  const [form, setForm] = useState({
    name: userInfo.name,
    phone: userInfo.phone,
    location: userInfo.location,
  });

  const infoItems = [
    {
      icon: <User className="w-5 h-5 text-primary" />,
      label: "Name",
      value: userInfo.name,
    },
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      label: "Email Address",
      value: userInfo.email,
    },
    {
      icon: <Phone className="w-5 h-5 text-primary" />,
      label: "Phone Number",
      value: userInfo.phone,
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      label: "Location",
      value: userInfo.location,
    },
  ];

  // open modal
  const openModal = () => {
    setForm({
      name: userInfo.name,
      phone: userInfo.phone,
      location: userInfo.location,
    });
    setIsModalOpen(true);
  };

  //  close modal
  const closeModal = () => setIsModalOpen(false);

  // phone handler (digits only max 10)
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 10);
    setForm((prev) => ({ ...prev, phone: value }));
  };

  //  save changes (state only)
  const handleSave = () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.location.trim()) return toast.error("Location is required");
    if (!form.phone || form.phone.length !== 10)
      return toast.error("Phone number must be 10 digits");

    setUserInfo((prev) => ({
      ...prev,
      name: form.name,
      phone: form.phone,
      location: form.location,
    }));

    toast.success("Profile updated!");
    closeModal();
  };

  //  update profile photo (state only)
  const handleProfilePic = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setUserInfo((prev) => ({ ...prev, profilePic: imageUrl }));

    toast.success("Profile photo updated!");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="sectionHeading mb-4">My Profile</h1>
        <div className="text-xs text-gray-700 font-semibold gap-2 flex items-center">
          <Calendar size={16} />
          <span>Joined {userInfo.joinedSince}</span>
        </div>
      </div>

      <div className="border flex items-center md:items-start flex-col gap-8 md:flex-row lg:p-8 p-4 rounded-2xl">
        {/* Profile Picture */}
        <div className="flex flex-col justify-center items-center">
          <div className="relative h-36 w-36 lg:w-48 lg:h-48 rounded-full border-4 border-primary overflow-hidden shadow-lg">
            <img
              className="object-cover w-full h-full"
              src={userInfo.profilePic}
              alt="profile"
            />
          </div>

          <h1 className="text-center text-xl text-gray-600 font-semibold mt-4 break-words max-w-[180px]">
            {userInfo.name}
          </h1>
        </div>

        {/* Info Fields */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoItems.map((item, index) => (
              <div
                key={index}
                className="flex space-x-3 bg-white p-3 lg:p-4 rounded-lg"
              >
                {item.icon}
                <div className="w-full">
                  <p className="text-sm mb-1 text-gray-500">{item.label}</p>
                  <p className="text-sm text-gray-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Update Button */}
          <div className="mt-8 flex justify-end gap-3">
            <Button onClick={openModal}>Update Profile</Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Update Profile
            </h2>

            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <Input
                label="Phone Number"
                placeholder="07xxxxxxxx"
                value={form.phone}
                maxLength={10}
                onChange={handlePhoneChange}
              />

              <Input
                label="Location"
                placeholder="Enter location"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
