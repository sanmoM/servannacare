"use client";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import MedicalInstitutionNurse from "@/components/updateProfile/MedicalInstitution/MedicalInstitutionNurse";
import MedicalInstitutionNurseAide from "@/components/updateProfile/MedicalInstitution/MedicalInstitutionNurseAide";
import MedicalInstitutionPhysiotherapist from "@/components/updateProfile/MedicalInstitution/MedicalInstitutionPhysiotherapist";
import MedicalInstitutionSpecialNeedCaregiver from "@/components/updateProfile/MedicalInstitution/MedicalInstitutionSpecialNeedCaregiver";
import { useFetch } from "@/hooks/useFetch";
import {
  Eye,
  Edit,
  Trash,
  Plus,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  Languages,
  Heart,
  ShieldCheck,
  Baby,
  User,
  Stethoscope,
  Car,
  Flag,
  Hospital,
  Home,
  Move,
  Bath,
  Utensils,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { deleteApi } from "@/lib/apiHandler";
import SelectableCalendar from "@/components/SelectableCalendar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const InstitutionNursePage = () => {
  const { user } = useAuth();
  const [nurses, setNurses] = useState([]);
  const [physiotherapist, setPhysiotherapist] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [institute, setInstitute] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(null);
  const router = useRouter();
  const [scheduleViewId, setScheduleViewId] = useState(null);
  const [selectedSpecialistType, setSelectedSpecialistType] = useState(null);

  const { data, isLoading, refetch } = useFetch("/profile");
  useEffect(() => {
    if (data) {
      setPhysiotherapist(
        data?.data?.institutionPhysiotherapists ||
          data?.institutionPhysiotherapists ||
          [],
      );
      setNurses(data?.data?.institutionNurses || data?.institutionNurses || []);
      setInstitute(data?.data?.careInstitution || data?.careInstitution || []);
    }
  }, [data]);

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting nurse...");
    try {
      await deleteApi(`/institution-nurse/${id}`);
      toast.success("Nurse removed successfully", { id: loadingToast });
      refetch();
    } catch (err) {
      toast.error("Failed to delete nurse.", { id: loadingToast });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const buildFileUrl = (path) => {
    if (!path) return null;

    if (path.startsWith("http")) return path;

    return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${path}`;
  };

  const openFile = (path) => {
    const url = buildFileUrl(path);
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAddSpecialists = () => {
    if (!institute || Object.keys(institute).length === 0) {
      toast.error("Please complete your Institute profile first.");
      router.push("/dashboard/care_institutions-profile");
      return;
    }

    if (!user?.is_profile_verified) {
      toast.error("Your profile must be verified before adding employees.");
      router.push("/dashboard/care_institutions-profile");
      return;
    }
    setSelectedSpecialistType(null);
    setIsAddOpen(true);
  };

  const renderSpecialistForm = () => {
    const handleSuccess = () => {
      refetch();
      setIsAddOpen(false);
      setSelectedSpecialistType(null);
    };

    switch (selectedSpecialistType) {
      case "Nurse":
        return <MedicalInstitutionNurse onSuccess={handleSuccess} />;
      case "Nurse Aide or Assistant":
      case "Nurse Aide":
        return <MedicalInstitutionNurseAide onSuccess={handleSuccess} />;
      case "Physiotherapist":
        return <MedicalInstitutionPhysiotherapist onSuccess={handleSuccess} />;
      case "Special Need Caregiver":
        return (
          <MedicalInstitutionSpecialNeedCaregiver onSuccess={handleSuccess} />
        );
      default:
        return null;
    }
  };

  const renderEditForm = (nurse) => {
    const handleSuccess = () => {
      refetch();
      setIsEditOpen(null);
    };

    const role = nurse?.preferredRole || "Nurse";

    switch (role) {
      case "Nurse Aide or Assistant":
      case "Nurse Aide":
        return (
          <MedicalInstitutionNurseAide
            initialData={nurse}
            isUpdate
            onSuccess={handleSuccess}
          />
        );
      case "Physiotherapist":
        return (
          <MedicalInstitutionPhysiotherapist
            initialData={nurse}
            isUpdate
            onSuccess={handleSuccess}
          />
        );
      case "Special Need Caregiver":
        return (
          <MedicalInstitutionSpecialNeedCaregiver
            initialData={nurse}
            isUpdate
            onSuccess={handleSuccess}
          />
        );
      case "Nurse":
      default:
        return (
          <MedicalInstitutionNurse
            initialData={nurse}
            isUpdate
            onSuccess={handleSuccess}
          />
        );
    }
  };

  return (
    <div className="lg:p-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Institution Specialists Management
          </h1>
          <p className="text-sm text-gray-500">
            View, update, and manage your specialists.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddSpecialists}
              className="bg-primary shadow-sm w-full sm:w-auto cursor-pointer"
            >
              <Plus className="mr-2" size={18} /> Add New Specialist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {!selectedSpecialistType && "Select Specialist Type"}
                {selectedSpecialistType &&
                  `Register New ${selectedSpecialistType}`}
              </DialogTitle>
            </DialogHeader>

            {!selectedSpecialistType ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
                {[
                  "Nurse",
                  "Nurse Aide or Assistant",
                  "Physiotherapist",
                  "Special Need Caregiver",
                ].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-24 text-lg font-medium border-2 hover:border-primary hover:bg-primary/10 transition-all cursor-pointer"
                    onClick={() => setSelectedSpecialistType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSpecialistType(null)}
                  className="mb-2 cursor-pointer"
                >
                  ← Back to Selection
                </Button>
                {renderSpecialistForm()}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">specialists Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {nurses.length > 0 ? (
                nurses.map((nurse) => (
                  <tr
                    key={nurse.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Nurse Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 border overflow-hidden">
                          <img
                            src={
                              nurse?.profilePhoto
                                ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${nurse.profilePhoto}`
                                : `https://ui-avatars.com/api/?name=${nurse.name}`
                            }
                            alt={nurse.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-none">
                            {nurse.fullName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin size={12} /> {nurse.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Briefcase size={14} className="text-purple-500" />
                        {nurse.preferredRole}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        {nurse.status || "Available"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 mt-9">
                        {/* View */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Eye size={18} />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <span className="text-primary">
                                  specialists Profile:
                                </span>
                                {nurse.fullName}
                              </DialogTitle>
                            </DialogHeader>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                              <InfoTile
                                icon={<User size={16} />}
                                label="Gender"
                                value={nurse.gender}
                              />
                              <InfoTile
                                icon={<Calendar size={16} />}
                                label="Age"
                                value={`${nurse.age} years`}
                              />
                              <InfoTile
                                icon={<MapPin size={16} />}
                                label="Location"
                                value={nurse.location}
                              />
                              <InfoTile
                                icon={<Stethoscope size={16} />}
                                label="Role"
                                value={nurse.preferredRole}
                              />
                              <InfoTile
                                icon={<Briefcase size={16} />}
                                label="Experience"
                                value={`${nurse.experience} years`}
                              />
                              <InfoTile
                                icon={<Car size={16} />}
                                label="Can Drive"
                                value={nurse.canDrive ? "Yes" : "No"}
                              />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                              <InfoTile
                                icon={<GraduationCap size={16} />}
                                label="Education"
                                value={nurse.education}
                              />
                              <InfoTile
                                icon={<Languages size={16} />}
                                label="Languages"
                                value={nurse.languages?.join(", ")}
                              />
                              <InfoTile
                                icon={<Flag size={16} />}
                                label="Nursing in Kenya"
                                value={nurse.isNursingInKenya ? "Yes" : "No"}
                              />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                              <InfoTile
                                icon={<Hospital size={16} />}
                                label="Hospital Based Care"
                                value={nurse.hospitalBasedCare ? "Yes" : "No"}
                              />
                              <InfoTile
                                icon={<Home size={16} />}
                                label="Home Based Care"
                                value={nurse.homeBasedCare ? "Yes" : "No"}
                              />
                              {nurse.hospitalBasedYearsOfExperience && (
                                <InfoTile
                                  icon={<Briefcase size={16} />}
                                  label="Hospital Experience"
                                  value={`${nurse.hospitalBasedYearsOfExperience} years`}
                                />
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                              <InfoTile
                                icon={<Move size={16} />}
                                label="Mobility Care"
                                value={`${nurse.mobilityYears} years`}
                              />
                              <InfoTile
                                icon={<Bath size={16} />}
                                label="Bathing Care"
                                value={`${nurse.bathingYears} years`}
                              />
                              <InfoTile
                                icon={<Utensils size={16} />}
                                label="Feeding Care"
                                value={`${nurse.feedingYears} years`}
                              />
                            </div>

                            {/* SERVICES */}
                            {nurse.services?.length > 0 && (
                              <div className="mt-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                  Services Provided
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {nurse.services.map((service, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 text-xs rounded-full bg-purple-100 text-primary"
                                    >
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* SCHEDULE SECTION */}
                            {nurse.schedule?.length > 0 &&
                              nurse.schedule[0]?.date?.length > 0 && (
                                <div className="mt-6">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                      <Calendar
                                        size={16}
                                        className="text-primary"
                                      />
                                      Schedule
                                    </h4>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setScheduleViewId(nurse.id)
                                      }
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>
                              )}

                            {/* DOCUMENTS */}
                            <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t">
                              {nurse.idCopy && (
                                <Button
                                  variant="outline"
                                  className="text-xs h-8"
                                  onClick={() => openFile(nurse.idCopy)}
                                >
                                  View ID Copy
                                </Button>
                              )}

                              {nurse.educationCertificate && (
                                <Button
                                  variant="outline"
                                  className="text-xs h-8"
                                  onClick={() =>
                                    openFile(nurse.educationCertificate)
                                  }
                                >
                                  Education Certificate
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* SCHEDULE CALENDAR MODAL */}
                        <Dialog
                          open={scheduleViewId === nurse.id}
                          onOpenChange={(open) =>
                            !open && setScheduleViewId(null)
                          }
                        >
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Selected Schedule</DialogTitle>
                            </DialogHeader>

                            <SelectableCalendar
                              mode="multiple"
                              selectedDates={nurse.schedule?.[0]?.date || []}
                            />
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={isEditOpen === nurse.id}
                          onOpenChange={(open) =>
                            setIsEditOpen(open ? nurse.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-emerald-600 hover:bg-emerald-50"
                            >
                              <Edit size={18} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Update Specialist</DialogTitle>
                            </DialogHeader>

                            {renderEditForm(nurse)}
                          </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:bg-red-50"
                            >
                              <Trash size={18} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-red-600">
                                Permanently Delete?
                              </DialogTitle>
                            </DialogHeader>

                            <p className="text-sm text-gray-600 py-4">
                              Remove <strong>{nurse.name}</strong> permanently?
                            </p>

                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(nurse.id)}
                              >
                                Confirm Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No specialists found. Add your first specialist.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const InfoTile = ({ label, value, icon }) => (
  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
    <div className="flex items-center gap-2 text-primary mb-1">
      {icon}
      <span className="text-[10px] uppercase font-bold text-gray-400">
        {label}
      </span>
    </div>
    <p className="text-sm font-semibold text-gray-800 break-words">
      {value || "Not Specified"}
    </p>
  </div>
);

export default InstitutionNursePage;
