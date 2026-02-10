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
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [editModalId, setEditModalId] = useState(null);

  const { data, isLoading, refetch } = useFetch("/profile");

  useEffect(() => {
    if (data) {
      setEmployees(data?.data?.agencyEmployees || data?.agencyEmployees || []);
    }
  }, [data]);

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting employee...");
    try {
      await axios.delete(`/api/agency/employee/${id}`);
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

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header Section */}
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
          <DialogTrigger asChild>
            <Button className="bg-primary shadow-sm w-full sm:w-auto">
              <Plus className="mr-2" size={18} /> Add New Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Employee</DialogTitle>
            </DialogHeader>
            <AgencyEmployee
              onSuccess={() => {
                refetch();
                setShowAddModal(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
                    {/* Basic Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex-shrink-0 border overflow-hidden">
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

                    {/* Role/Experience */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Briefcase size={14} className="text-purple-500" />{" "}
                          {emp.preferredRole}
                        </span>
                        <span className="text-xs text-gray-500 ml-5">
                          {emp.experience} Experience
                        </span>
                      </div>
                    </td>

                    {/* Salary/Expectation */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                          <Banknote size={14} /> ${emp.salaryRange}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          {emp.liveType}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {/* VIEW DIALOG */}
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
                            <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t">
                              {emp.idCopy && (
                                <Button
                                  variant="outline"
                                  className="text-xs h-8"
                                  onClick={() => openFile(emp.idCopy)}
                                >
                                  View ID Copy
                                </Button>
                              )}

                              {emp.aidCertificate && (
                                <Button
                                  variant="outline"
                                  className="text-xs h-8"
                                  onClick={() => openFile(emp.aidCertificate)}
                                >
                                  Aid Certificate
                                </Button>
                              )}
                              {emp.goodConductCertificate && (
                                <Button
                                  variant="outline"
                                  className="text-xs h-8"
                                  onClick={() =>
                                    openFile(emp.goodConductCertificate)
                                  }
                                >
                                  good Conduct Certificate
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* UPDATE DIALOG */}
                        <Dialog
                          open={editModalId === emp.id}
                          onOpenChange={(open) => !open && setEditModalId(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-emerald-600 hover:bg-emerald-50"
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

                        {/* DELETE DIALOG */}
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
                              You are about to remove{" "}
                              <strong>{emp.name}</strong> from your agency
                              database. This action is irreversible.
                            </p>
                            <DialogFooter className="gap-2 sm:gap-0">
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
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
    </div>
  );
};

// Reusable component for the View Profile Grid
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
