"use client";

import CreateBasicInfo from "@/components/auth/register/MedicalInstitution/Create/CreateBasicInfo";
import UpdateBasicInfo from "@/components/auth/register/MedicalInstitution/Update/UpdateBasicInfo";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Dialog } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
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
  const { user } = useAuth();

  const [instituteData, setInstituteData] = useState(null);

  const { data, isLoading, error } = useFetch("/profile");

  useEffect(() => {
    if (data) {
      setInstituteData(data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    if (error?.response?.status === 401) return <LoadingSpinner />;
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center my-6">
        <p className="text-red-600 font-medium">Failed to load institution profile.</p>
        <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="sectionHeading mb-4">Institute Profile</h1>
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

      {user?.is_profile_completed && user?.is_profile_verified && (
        <div className="p-4 mb-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <div className="text-green-700 font-medium">
            Your profile is verified as{" "}
            <span className="capitalize font-semibold">
              {user?.role?.replace(/-/g, " ")}
            </span>
          </div>
        </div>
      )}
      {user?.is_profile_completed ? (
        <UpdateBasicInfo instituteData={instituteData?.careInstitution} />
      ) : (
        <>
          <CreateBasicInfo />
        </>
      )}

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
          {/* <DialogContent className="sm:max-w-5xl  lg:px-12 max-h-[80vh] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle className={"text-center"}>
                Update your Medical Institution details
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
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
          </DialogContent> */}
        </Dialog>
      </div>
    </div>
  );
}
