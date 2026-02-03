"use client";

import BasicInfo from "@/components/auth/register/HouseManager/BasicInfo";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import HouseManager from "@/components/updateProfile/HouseManager/HouseManager";
import HouseManagerCreate from "@/components/updateProfile/HouseManager/HouseManagerCreate";
import MedicalInstitution from "@/components/updateProfile/MedicalInstitution/MedicalInstitution";
import NurseCreate from "@/components/updateProfile/Nurse/NurseCreate";
import NurseUpdate from "@/components/updateProfile/Nurse/NurseUpdate";
import NurseAideUpdate from "@/components/updateProfile/NurseAide/NurseAide";
import Physiotherapist from "@/components/updateProfile/Physiotherapist/Physiotherapist";
import SpecialNeedCaregiversUpdate from "@/components/updateProfile/SpecialNeedCaregivers/SpecialNeedCaregiversUpdate";
import { useFetch } from "@/hooks/useFetch";
import useLocalUser from "@/hooks/useLocalUser";
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
  const [specialistDatas, setSpecialistDatas] = useState(null);
  console.log(specialistDatas);

  const { user, loaded } = useLocalUser();

  const { data, isLoading, error } = useFetch("/profile");
  useEffect(() => {
    if (data) {
      setSpecialistDatas(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

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
      </div>
      {!user?.is_profile_completed && (
        <p className="p-4 mb-4 flex gap-2 text-base items-center font-medium rounded-xl text-white bg-red-400">
          <Info /> Your account is not complete.
        </p>
      )}

      {user?.is_profile_completed && !user?.is_profile_verified && (
        <p className="p-4 mb-4 flex gap-2 text-base items-center font-medium rounded-xl text-white bg-red-400">
          <Info /> Your account is Under review.
        </p>
      )}

      <div className="border flex  items-center md:items-start flex-col gap-8 md:flex-row lg:p-8 p-4 rounded-2xl">
        {/* Info Fields */}
        <div className="w-full">
          {specialistDatas?.data?.houseManager?.subRole === "house-manager" &&
            (specialistDatas?.data?.houseManager?.is_profile_completed ? (
              <HouseManager data={specialistDatas?.data?.houseManager} />
            ) : (
              // todo
              <HouseManagerCreate />
            ))}

          {specialistDatas?.data?.nurse?.subRole === "nurse" &&
            (specialistDatas?.data?.nurse?.is_profile_completed ? (
              <NurseUpdate data={specialistDatas?.data?.nurse} />
            ) : (
              // todo
              <NurseCreate />
            ))}

          {specialistDatas?.data?.physiotherapist?.subRole ===
            "physiotherapist" &&
            (specialistDatas?.data?.physiotherapist?.is_profile_completed ? (
              <Physiotherapist data={specialistDatas?.data?.physiotherapist} />
            ) : (
              // todo
              <Physiotherapist />
            ))}

          {specialistDatas?.data?.nurseAssistant?.subRole ===
            "nurse-aide-or-assistant" &&
            (specialistDatas?.data?.nurseAssistant?.is_profile_completed ? (
              <NurseAideUpdate data={specialistDatas?.data?.nurseAssistant} />
            ) : (
              // todo
              <NurseAideUpdate />
            ))}

          {specialistDatas?.data?.specialNeed?.subRole ===
            "special-need-caregivers" &&
            (specialistDatas?.data?.specialNeed?.is_profile_completed ? (
              <SpecialNeedCaregiversUpdate
                data={specialistDatas?.data?.specialNeed}
              />
            ) : (
              // todo
              <SpecialNeedCaregiversUpdate />
            ))}
        </div>
      </div>

      {/* <div>
     
        {userDetails &&
          typeof userDetails === "object" &&
          Object.entries(userDetails).map(([sectionKey, sectionValue]) =>
            renderSection(sectionKey, sectionValue),
          )}
      </div> */}
    </div>
  );
}
