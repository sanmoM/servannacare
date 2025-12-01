"use client";

import BasicInfo from "@/components/auth/register/HouseManager/BasicInfo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import HouseManager from "@/components/updateProfile/HouseManager/HouseManager";
import {
  Calendar,
  FileText,
  ImageIcon,
  Info,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({});
  const [userDetails, setUserDetails] = useState([]);



  // Load saved data
  useEffect(() => {
    // Delay to avoid cascading renders during hydration
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

  useEffect(() => {
    // Delay to avoid cascading renders during hydration
    const timer = setTimeout(() => {
      try {
        const saveDetails = localStorage.getItem("specialist");
        if (saveDetails) {
          setUserDetails(JSON.parse(saveDetails));
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

  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  // Helper: format file size in KB/MB
  const formatFileSize = (size) => {
    if (!size) return "0 KB";
    const kb = size / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
  };

  const renderSection = (sectionKey, sectionData) => {
    if (typeof sectionData !== "object" || sectionData === null) return null;

    return (
      <div key={sectionKey} className="p-4 bg-white my-4 border rounded-xl">
        <h2 className="font-semibold pb-4 text-gray-600">
          {formatLabel(sectionKey)}
        </h2>

        <div className="space-y-2 grid gap-4 md:grid-cols-2">
          {Object.entries(sectionData).map(([key, value]) => {
            //  If array → render each item
            if (Array.isArray(value)) {
              return (
                <div key={key} className="flex flex-wrap gap-2 items-center">
                  <Label>{formatLabel(key)} : </Label>
                  {value.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {value.map((item, i) => (
                        <span key={i} className="text-sm text-gray-600">
                          {String(item)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </div>
              );
            }

            //  If file → show icon/image preview
            else if (value instanceof File) {
              const isImage = value.type.startsWith("image/");
              return (
                <div key={key} className="">
                  <Label className={"mb-2"}>{formatLabel(key)} :</Label>
                  <div className="flex rounded-md border p-2 bg-gray-100  gap-2">
                    {isImage ? (
                      <ImageIcon className="text-gray-600 w-6 h-6" />
                    ) : (
                      <FileText className="text-gray-600 w-6 h-6" />
                    )}
                    <div className="flex flex-col text-sm text-gray-700">
                      <span className="font-medium text-xs">{value.name}</span>
                      <span className="text-gray-500 text-xs">
                        {formatFileSize(value.size)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            //  If nested object → recurse
            else if (typeof value === "object" && value !== null) {
              return renderSection(key, value);
            }

            //  Default simple text field
            else {
              return (
                <div key={key} className="flex items-center gap-2 flex-wrap">
                  <Label>{formatLabel(key)} : </Label>
                  <span className="text-sm text-gray-600">
                    {value ? String(value) : "N/A"}
                  </span>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
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
      <p className="p-4 mb-4 text-sm flex gap-2 text-base items-center font-medium rounded-xl text-white bg-red-400">
        <Info /> Your account is Under review .
      </p>
      <div className="border flex  items-center md:items-start flex-col gap-8 md:flex-row lg:p-8 p-4 rounded-2xl">
        {/* Profile Picture */}
        <div className="flex flex-col justify-center  items-center">
          <div className="relative h-36 w-36 lg:w-48 lg:h-48 rounded-full border-4 border-primary overflow-hidden shadow-lg">
            <img
              className="object-cover w-full h-full"
              src={userInfo.profilePic || "/user.png"}
              alt="profile"
            />
          </div>
          <h1 className="text-center text-xl text-gray-600 font-semibold mt-4 break-words max-w-[180px]">
            {userInfo.name || "N/A"}
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
                  <p className="text-sm text-gray-700">
                    {userInfo[item.key] || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex mt-6 justify-end">
            <Dialog >
              <DialogTrigger asChild>
                <Button className={"w-full sm:w-auto"} size={"lg"}>
              Update Profile?
            </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-5xl  lg:px-12 max-h-[80vh] overflow-y-scroll">
                <DialogHeader>
                  <DialogTitle className={"text-center"}>Update your profile</DialogTitle>
                  <DialogDescription>
                    
                  </DialogDescription>
                </DialogHeader>
                <div className="">
                  <HouseManager data={userDetails}/>
                </div>
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="button" >
                      Submit
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
          </div>
        </div>
      </div>

      <div>
        {/*  Render all form sections */}
        {userDetails &&
          typeof userDetails === "object" &&
          Object.entries(userDetails).map(([sectionKey, sectionValue]) =>
            renderSection(sectionKey, sectionValue)
          )}
      </div>
    </div>
  );
}
