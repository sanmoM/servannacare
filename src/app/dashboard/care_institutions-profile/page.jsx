"use client";

import UpdateBasicInfo from "@/components/auth/register/MedicalInstitution/Update/UpdateBasicInfo";
import UpdateNurseDetails from "@/components/auth/register/MedicalInstitution/Update/UpdateNurseDetails";
import UpdateReview from "@/components/auth/register/MedicalInstitution/Update/UpdateReview";
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
import MedicalInstitution from "@/components/updateProfile/MedicalInstitution/MedicalInstitution";
import { useFetch } from "@/hooks/useFetch";
import useLocalUser from "@/hooks/useLocalUser";
import {
  Calendar,
  Camera,
  FileText,
  ImageIcon,
  Info,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function MedicalInstitutionProfile() {
  const [userInfo, setUserInfo] = useState({});
  const { user, loaded } = useLocalUser();

  const [instituteData, setInstituteData] = useState(null);


  const { data, isLoading, error } = useFetch("/profile");
  useEffect(() => {
    if (data) {
      setInstituteData(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

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
      {/* <div className="flex justify-between">
        <h1 className="sectionHeading mb-4">My Profile</h1>
        <div className="text-xs text-gray-700 font-semibold gap-2 flex items-center">
          <Calendar size={16} />
          <span>Joined {userInfo.joinedSince}</span>
        </div>
      </div> */}

      {!user?.is_profile_verified && (
        <p className="p-4 mb-4 text-sm flex gap-2 text-base items-center font-medium rounded-xl text-white bg-red-400">
          <Info /> Your account is Under review .
        </p>
      )}

      {user?.is_profile_completed ? (
        <UpdateBasicInfo instituteData={instituteData?.data?.careInstitution}/>
      ) : (
        <>
          <UpdateBasicInfo />
          <UpdateNurseDetails />
          {/* <UpdateReview/> */}
        </>
      )}

      <div>
        {userInfo.institution &&
          typeof userInfo.institution === "object" &&
          Object.entries(userInfo).map(([sectionKey, sectionValue]) =>
            renderSection(sectionKey, sectionValue),
          )}
      </div>

      <div className=" flex justify-end mt-6">
        <Dialog>
          {/* <DialogTrigger asChild>
            {user?.is_profile_completed ? (
              <>
                {" "}
                <Button className={"w-full sm:w-auto"} size={"lg"}>
                  Update
                </Button>
              </>
            ) : (
              <>
                {" "}
                <Button className={"w-full sm:w-auto"} size={"lg"}>
                  Create
                </Button>
              </>
            )}
          </DialogTrigger> */}
          <DialogContent className="sm:max-w-5xl  lg:px-12 max-h-[80vh] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle className={"text-center"}>
                Update your Medical Institution details
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              {/* <AgencyUpdate/> */}
              <MedicalInstitution></MedicalInstitution>
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button
                  className={""}
                  size={"lg"}
                  type="button"
                  variant="secondary"
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
