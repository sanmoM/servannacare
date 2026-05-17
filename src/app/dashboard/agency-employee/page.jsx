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
import AgencyEmployee from "@/components/updateProfile/Agency/AgencyEmployee";
import DashboardAddEmployees from "@/components/updateProfile/Agency/DashboardAddEmployees";
import PaymentModal from "@/components/updateProfile/Agency/PaymentModal";
import { useFetch } from "@/hooks/useFetch";
import {
  Eye,
  Edit,
  Trash,
  Plus,
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  Baby,
  Heart,
  ShieldCheck,
  Banknote,
  Calendar,
  Star,
} from "lucide-react";

import toast from "react-hot-toast";
import { deleteApi } from "@/lib/apiHandler";
import SelectableCalendar from "@/components/SelectableCalendar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const EmployeePage = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [agencyExist, setAgencyExist] = useState([]);
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentEmployeeIds, setPaymentEmployeeIds] = useState([]);

  const [editModalId, setEditModalId] = useState(null);

  const { data, isLoading, refetch } = useFetch("/profile");

  const [scheduleViewId, setScheduleViewId] = useState(null);

  useEffect(() => {
    if (data) {
      setEmployees(data?.data?.agencyEmployees || data?.agencyEmployees || []);
      setAgencyExist(data?.data?.agency || data?.agency || []);
    }
  }, [data]);

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting employee...");
    try {
      await deleteApi(`/agency-employee/${id}`);
      toast.success("Employee removed successfully", { id: loadingToast });
      refetch();
    } catch (err) {
      toast.error("Failed to delete. Please try again.", { id: loadingToast });

      setEmployees((prev) => prev.filter((e) => e.id !== id));
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

  const handleAddEmployeeClick = () => {
    if (!agencyExist || Object.keys(agencyExist).length === 0) {
      toast.error("Please complete your agency profile first.");
      router.push("/dashboard/agency-profile");
      return;
    }

    if (!user?.is_profile_completed) {
      toast.error("Your profile must be complete before adding employees.");
      router.push("/dashboard/agency-profile");
      return;
    }

    setShowAddModal(true);
  };

  return (
    <div className=" mx-auto bg-gray-50 min-h-screen">
  
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Agency Staff Management
          </h1>
          <p className="text-sm text-gray-500">
            View, update, and manage your agency's workforce.
          </p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <Button
            onClick={handleAddEmployeeClick}
            className="bg-primary shadow-sm w-full sm:w-auto cursor-pointer"
          >
            <Plus className="mr-2" size={18} /> Add New Employee
          </Button>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Employee</DialogTitle>
            </DialogHeader>
            <DashboardAddEmployees
              onSuccess={() => {
                refetch();
                setShowAddModal(false);
              }}
              onRequiresPayment={(ids) => {
                refetch();
                setShowAddModal(false);
                setPaymentEmployeeIds(ids);
                setPaymentModalOpen(true);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Role & Experience</th>
                <th className="px-6 py-4">Expectation</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                  
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex-shrink-0 border overflow-hidden">
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${emp?.profilePhoto}`}
                            alt={emp.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://ui-avatars.com/api/?name=" + emp.name;
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-none">
                            {emp.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />{" "}
                            {emp.location}
                          </p>
                        </div>
                      </div>
                    </td>

                  
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Briefcase size={14} className="text-primary" />{" "}
                          {emp.preferredRole}
                        </span>
                        <span className="text-xs text-gray-500 ml-5">
                          {emp.experience} Experience
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                          <Banknote size={14} /> ${emp.salaryRange}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          {emp.preferred}
                        </span>
                      </div>
                    </td>

                 
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1">
                        {emp.is_paid === false && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white mr-2 h-8 px-3 cursor-pointer"
                            onClick={() => {
                              setPaymentEmployeeIds([emp.id]);
                              setPaymentModalOpen(true);
                            }}
                          >
                            Pay Now
                          </Button>
                        )}
                
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary-600 hover:bg-blue-50 cursor-pointer"
                            >
                              <Eye size={18} />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-3xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <span className="text-primary">
                                  Full Profile:
                                </span>{" "}
                                {emp.name}
                              </DialogTitle>
                            </DialogHeader>

                         
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                              <InfoTile
                                label="Education"
                                value={emp.educationLevel}
                                icon={
                                  <GraduationCap
                                    className="text-primary"
                                    size={16}
                                  />
                                }
                              />
                              <InfoTile
                                label="Languages"
                                value={emp.languages?.join(", ")}
                                icon={
                                  <Languages
                                    className="text-primary"
                                    size={16}
                                  />
                                }
                              />
                              <InfoTile
                                label="Cooking Skill"
                                value={emp.cooking}
                                icon={
                                  <Heart className="text-primary" size={16} />
                                }
                              />
                              <InfoTile
                                label="Housekeeping"
                                value={emp.housekeeping}
                                icon={
                                  <ShieldCheck
                                    className="text-primary"
                                    size={16}
                                  />
                                }
                              />
                              <InfoTile
                                label="Motherhood"
                                value={emp.isMother ? "Yes" : "No"}
                                icon={
                                  <Baby className="text-primary" size={16} />
                                }
                              />
                              <InfoTile
                                label="Childcare"
                                value={emp.childcare}
                                icon={
                                  <Heart className="text-primary" size={16} />
                                }
                              />
                              <InfoTile
                                label="Kids Ages Handled"
                                value={emp.kidAges?.join(", ")}
                                icon={
                                  <Baby className="text-primary" size={16} />
                                }
                              />
                              <InfoTile
                                label="Pets"
                                value={emp.handlePets ? "Comfortable" : "No"}
                                icon={
                                  <ShieldCheck
                                    className="text-primary"
                                    size={16}
                                  />
                                }
                              />
                              <InfoTile
                                label="Created At"
                                value={new Date(
                                  emp.created_at,
                                ).toLocaleDateString()}
                                icon={
                                  <Calendar
                                    className="text-primary"
                                    size={16}
                                  />
                                }
                              />
                            </div>

                         
                            {emp.schedule?.length > 0 &&
                              emp.schedule[0]?.date?.length > 0 && (
                                <div className="mt-6">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                      <Calendar
                                        className="text-primary"
                                        size={16}
                                      />
                                      Schedule
                                    </h4>

                                    <Button
                                    className="cursor-pointer"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setScheduleViewId(emp.id)}
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>
                              )}

                         
                            <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t">
                              {emp.idCopy && (
                                <Button
                                
                                  variant="outline"
                                  className="text-xs h-8 cursor-pointer"
                                  onClick={() => openFile(emp.idCopy)}
                                >
                                  View ID Copy
                                </Button>
                              )}

                              {emp.aidCertificate && (
                                <Button
                                  variant="outline"
                                  className="text-xs h-8 cursor-pointer"
                                  onClick={() => openFile(emp.aidCertificate)}
                                >
                                  Aid Certificate
                                </Button>
                              )}

                              {emp.goodConductCertificate && (
                                <Button
                                  variant="outline"
                                  className="text-xs h-8 cursor-pointer"
                                  onClick={() =>
                                    openFile(emp.goodConductCertificate)
                                  }
                                >
                                  Good Conduct Certificate
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                 
                        <Dialog
                          open={scheduleViewId === emp.id}
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
                              selectedDates={emp.schedule?.[0]?.date || []}
                              onChange={() => {}}
                            />
                          </DialogContent>
                        </Dialog>

                   
                        <Dialog
                          open={editModalId === emp.id}
                          onOpenChange={(open) => !open && setEditModalId(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                              onClick={() => setEditModalId(emp.id)}
                            >
                              <Edit size={18} />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Update Employee Data</DialogTitle>
                            </DialogHeader>

                            <AgencyEmployee
                              initialData={emp}
                              isUpdate={true}
                              onSuccess={() => {
                                refetch();
                                setEditModalId(null);
                              }}
                            />
                          </DialogContent>
                        </Dialog>


                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:bg-red-50 cursor-pointer"
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
                              You are about to remove{" "}
                              <strong>{emp.name}</strong> from your agency
                              database. This action is irreversible.
                            </p>
                            <DialogFooter className="gap-2 sm:gap-0">
                              <DialogClose asChild>
                                <Button className="cursor-pointer" variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                              className="cursor-pointer"
                                variant="destructive"
                                onClick={() => handleDelete(emp.id)}
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
                    No employees found. Add your first employee to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        employeeIds={paymentEmployeeIds}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

const InfoTile = ({ label, value, icon }) => (
  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center">
    <div className="flex items-center gap-2 text-purple-500 mb-1">
      {icon}
      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">
        {label}
      </span>
    </div>
    <p className="text-sm font-semibold text-gray-800 break-words">
      {value || "Not Specified"}
    </p>
  </div>
);

export default EmployeePage;
