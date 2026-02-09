"use client";

import AgencyBasicInfo from "@/components/auth/register/Agency/AgencyBasicInfo";
import CreateBasicInfo from "@/components/auth/register/Agency/Create/CreateBasicInfo";
import UpdateBasicInfo from "@/components/auth/register/Agency/Update/UpdateBasicInfo";
import UpdateEmployeeDetails from "@/components/auth/register/Agency/Update/UpdateEmployee";
import Input from "@/components/shared/Input";
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
import AgencyUpdate from "@/components/updateProfile/Agency/AgencyUpdate";
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
import toast from "react-hot-toast";

export default function AgencyProfile() {
  const { user, loaded } = useLocalUser();

  const [agencyData, setAgencyData] = useState(null);

  const { data, isLoading, error } = useFetch("/profile");
  useEffect(() => {
    if (data) {
      setAgencyData(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="sectionHeading mb-4">Agency Profile</h1>
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
      {user?.is_profile_completed ? (
        <UpdateBasicInfo agencyData={agencyData?.agency} />
      ) : (
        <>
          <CreateBasicInfo />
        </>
      )}

      {/* <div className=" flex justify-end mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className={"w-full sm:w-auto"} size={"lg"}>
              Update
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-5xl  lg:px-12 max-h-[80vh] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle className={"text-center"}>
                Update your Agency details
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <AgencyUpdate />
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
      </div> */}
    </div>
  );
}
