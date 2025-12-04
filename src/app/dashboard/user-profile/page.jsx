"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Calendar, Camera, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [update, setUpdate] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  // Load saved data
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUserInfo(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const infoItems = [
    {
      key: "name",
      icon: <User className="w-5 h-5 text-primary" />,
      label: "Name",
    },
    {
      key: "email",
      icon: <Mail className="w-5 h-5 text-primary" />,
      label: "Email Address",
    },
    {
      key: "phone",
      icon: <Phone className="w-5 h-5 text-primary" />,
      label: "Phone Number",
    },
    {
      key: "location",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      label: "Location",
    },
  ];

  const handleChange = (key, value) => {
    setUserInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    toast.success("Profile updated!");
    setUpdate(false);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="sectionHeading mb-4">My Profile</h1>
        <div className="text-xs text-gray-700 font-semibold gap-2 flex items-center">
          <Calendar size={16} />
          <span>Joined {userInfo.joinedSince}</span>
        </div>
      </div>
      <div className="border flex  items-center md:items-start flex-col gap-8 md:flex-row lg:p-8 p-4 rounded-2xl">
        {/* Profile Picture */}
        <div className="flex flex-col justify-center  items-center">
          <div className="relative h-36 w-36 lg:w-48 lg:h-48 rounded-full border-4 border-primary overflow-hidden shadow-lg">
            <img
              className="object-cover w-full h-full"
              src={userInfo.profilePic || "/user.png"}
              alt="profile"
            />

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              id="profilePicInput"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                console.log(file);

                const imageUrl = URL.createObjectURL(file);
                setUserInfo((prev) => ({ ...prev, profilePic: imageUrl }));
              }}
              className="hidden"
            />

            {/* Edit button */}
            {update && (
              <div
                className="absolute bottom-0 py-2 bg-gray-800/50 w-full flex justify-center cursor-pointer"
                onClick={() =>
                  document.getElementById("profilePicInput").click()
                }
              >
                <Camera className="text-white" />
              </div>
            )}
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

                  {!update ? (
                    // Show plain text when update=false
                    <p className="text-sm text-gray-700">
                      {userInfo[item.key] || "N/A"}
                    </p>
                  ) : (
                    // Show Input when update=true
                    <Input
                      className="w-full"
                      value={userInfo[item.key] ?? ""}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            {!update && (
              <Button onClick={() => setUpdate(true)}>Update Profile</Button>
            )}

            {update && <Button onClick={handleSubmit}>Save Changes</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
