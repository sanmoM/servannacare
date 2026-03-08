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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const [allSpecialists, setAllSpecialists] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [institute, setInstitute] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(null);
  const router = useRouter();
  const [scheduleViewId, setScheduleViewId] = useState(null);
  const [selectedSpecialistType, setSelectedSpecialistType] = useState(null);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;



  const { data, isLoading, refetch } = useFetch("/profile");
  useEffect(() => {
    if (data) {
      const resp = data?.data || data;
      const physiotherapists = resp?.institutionPhysiotherapists || [];
      const specialNeeds = resp?.institutionSpecialNeeds || [];
      const nurseAssistants = resp?.institutionNurseAssistants || [];
      const institutionNurses = resp?.institutionNurses || [];

      const combined = [
        ...institutionNurses.map((n) => ({ ...n, type: "institution-nurse" })),
        ...physiotherapists.map((p) => ({
          ...p,
          type: "institution-physiotherapist",
        })),
        ...specialNeeds.map((s) => ({
          ...s,
          type: "institution-special-need",
        })),
        ...nurseAssistants.map((na) => ({
          ...na,
          type: "institution-nurse-assistant",
        })),
      ];

      // Remove duplicates by ID and filter out any invalid entries
      const uniqueSpecialists = combined.reduce((acc, curr) => {
        if (curr && curr.id && !acc.find((item) => item.id === curr.id)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      setAllSpecialists(uniqueSpecialists);
      setInstitute(resp?.careInstitution || []);
    }
  }, [data]);

  const handleDelete = async (id, type) => {
    const loadingToast = toast.loading("Deleting specialist...");
    let endpoint = "/institution-nurse";
    if (type === "institution-nurse-assistant") endpoint = "/institution-nurse-assistant";
    if (type === "institution-physiotherapist") endpoint = "/institution-physiotherapist";
    if (type === "institution-special-need") endpoint = "/institution-special-need";

    try {
      await deleteApi(`${endpoint}/${id}`);
      toast.success("Specialist removed successfully", { id: loadingToast });
      refetch();
    } catch (err) {
      toast.error("Failed to delete specialist.", { id: loadingToast });
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
    const handleSuccess = (isUpdate = false) => {
      refetch();
      setIsAddOpen(false);
      setSelectedSpecialistType(null);
      if (!isUpdate) {
        setShowPromoPopup(true);
      }
    };

    switch (selectedSpecialistType) {
      case "institution-nurse":
        return (
          <MedicalInstitutionNurse onSuccess={() => handleSuccess(false)} />
        );
      case "institution-nurse-assistant":
        return (
          <MedicalInstitutionNurseAide onSuccess={() => handleSuccess(false)} />
        );
      case "institution-physiotherapist":
        return (
          <MedicalInstitutionPhysiotherapist
            onSuccess={() => handleSuccess(false)}
          />
        );
      case "institution-special-need":
        return (
          <MedicalInstitutionSpecialNeedCaregiver
            onSuccess={() => handleSuccess(false)}
          />
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

    const type = nurse?.type || "institution-nurse";

    switch (type) {
      case "institution-nurse-assistant":
        return (
          <MedicalInstitutionNurseAide
            initialData={nurse}
            isUpdate
            onSuccess={handleSuccess}
          />
        );
      case "institution-physiotherapist":
        return (
          <MedicalInstitutionPhysiotherapist
            initialData={nurse}
            isUpdate
            onSuccess={handleSuccess}
          />
        );
      case "institution-special-need":
        return (
          <MedicalInstitutionSpecialNeedCaregiver
            initialData={nurse}
            isUpdate
            onSuccess={handleSuccess}
          />
        );
      case "institution-nurse":
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
                  { label: "Nurse", value: "institution-nurse" },
                  { label: "Nurse Aide or Assistant", value: "institution-nurse-assistant" },
                  { label: "Physiotherapist", value: "institution-physiotherapist" },
                  { label: "Special Need Caregiver", value: "institution-special-need" },
                ].map((item) => (
                  <Button
                    key={item.value}
                    onClick={() => setSelectedSpecialistType(item.value)}
                    variant="outline"
                    className="h-24 text-lg font-medium border-2 hover:border-primary hover:bg-primary/10 transition-all cursor-pointer flex flex-col gap-2"
                  >
                    {item.label}
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

        <Dialog open={showPromoPopup} onOpenChange={setShowPromoPopup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" />
                Specialist Added Successfully!
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                You can now update the specialist's schedule anytime from the
                <strong> Edit</strong> page. Keeping the schedule updated helps
                in better management and visibility.
              </p>
            </div>
            <DialogFooter>
              <Button className="cursor-pointer" onClick={() => setShowPromoPopup(false)}>Got it!</Button>
            </DialogFooter>
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
              {allSpecialists.length > 0 ? (
                allSpecialists
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage,
                  )
                  .map((nurse) => (
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
                              {nurse.fullName || nurse.name}
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
                          <Briefcase size={14} className="text-primary" />
                          {nurse.subRole}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          {nurse.status || "Available"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right align-middle">
                        <div className="flex justify-end items-center gap-1">
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
                                    Specialists Profile:
                                  </span>
                                  {nurse.fullName || nurse.name}
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
                                Remove <strong>{nurse.fullName || nurse.name}</strong> permanently?
                              </p>

                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(nurse.id, nurse.type)}
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

      {allSpecialists.length > itemsPerPage && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                />
              </PaginationItem>
              {Array.from({
                length: Math.ceil(allSpecialists.length / itemsPerPage),
              }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    className="cursor-pointer"
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className={
                    currentPage ===
                      Math.ceil(allSpecialists.length / itemsPerPage)
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(allSpecialists.length / itemsPerPage),
                      ),
                    )
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
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
