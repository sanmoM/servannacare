"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import { Eye, FileText, User, Briefcase, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Stethoscope, Activity, Heart, Hospital, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
const InstitutionBookingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 5;
  const currentPage = Number(searchParams.get("page")) || 1;
  const activeFilter = searchParams.get("status") || "all";
  const [bookings, setBookings] = useState([]);
  const {
    data,
    isLoading,
    error,
    refetch
  } = useFetch("/institution-booking");
  useEffect(() => {
    if (data) {
      const rawData = data?.data?.data ?? data?.data ?? [];
      const sorted = Array.isArray(rawData) ? [...rawData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : [];
      setBookings(sorted);
    }
  }, [data]);
  const updateParams = (newStatus, newPage) => {
    const params = new URLSearchParams(searchParams);
    if (newStatus) {
      if (newStatus === "all") params.delete("status");else params.set("status", newStatus);
      params.set("page", "1");
    }
    if (newPage) {
      params.set("page", newPage.toString());
    }
    router.push(`?${params.toString()}`);
  };
  const getSelectedDates = row => {
    let parsed;
    try {
      parsed = typeof row.selected_dates_or_months === "string" ? JSON.parse(row.selected_dates_or_months) : row.selected_dates_or_months;
    } catch (e) {
      return [];
    }
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    if (parsed[0]?.dates) {
      return parsed.flatMap(item => Array.isArray(item.dates) ? item.dates.map(d => new Date(d)) : []);
    }
    if (typeof parsed[0] === "string" && parsed[0].length > 7) {
      return parsed.map(d => new Date(d));
    }
    if (typeof parsed[0] === "string" && parsed[0].length === 7) {
      const [year, month] = parsed[0].split("-").map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from({
        length: daysInMonth
      }, (_, i) => new Date(year, month - 1, i + 1));
    }
    return [];
  };
  const handleStatusChange = async (id, newStatus) => {
    const previousBookings = [...bookings];
    setBookings(prev => prev.map(b => b.id === id ? {
      ...b,
      booking_status: newStatus
    } : b));
    toast.success(`Status updated to ${newStatus}`);
    setIsActionLoading(true);
    try {
      const response = await postApi(`/update-booking-status/${id}`, {
        booking_status: newStatus
      });
      if (response.status !== 200) {
        throw new Error("Failed");
      }
    } catch (err) {
      toast.error("Failed to update status");
      setBookings(previousBookings);
    } finally {
      setIsActionLoading(false);
    }
  };
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-10 text-center text-red-500 font-bold text-xl italic">
        Failed to sync with server.
      </div>;
  const filteredBookings = activeFilter === "all" ? bookings : bookings.filter(b => b.booking_status === activeFilter);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  const statusOptions = ["pending", "accepted", "rejected", "completed"];
  const getStatusStyles = status => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "accepted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-rose-100 text-red-700 border-rose-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const buildImageUrl = path => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${path}`;
  };
  const getSpecialistTypeLabel = type => {
    switch (type) {
      case "institution-nurse":
        return "Nurse";
      case "institution-nurse-assistant":
        return "Nurse Aide";
      case "institution-physiotherapist":
        return "Physiotherapist";
      case "institution-special-need":
        return "Special Need Caregiver";
      default:
        return type?.replace(/-/g, " ") || "Specialist";
    }
  };
  return <div className="w-full py-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Specialist Bookings
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage and control bookings for your institution's specialists.
          </p>
        </div>
        <div className="w-full sm:w-[220px]">
          <Select value={activeFilter} onValueChange={value => updateParams(value, null)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map(status => <SelectItem key={status} value={status} className="capitalize">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Specialist
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Patient Info
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Client (Booker)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Status Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentBookings.length > 0 ? currentBookings.map(row => {
              const selectedDates = getSelectedDates(row);
              const specialist = row.specialist;
              const client = row.user;
              return <tr key={row.id} className="hover:bg-green-50/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 flex-shrink-0 border overflow-hidden">
                            <Image src={buildImageUrl(specialist?.profilePhoto) || `https://ui-avatars.com/api/?name=${specialist?.fullName || specialist?.name || "S"}`} alt={specialist?.fullName || specialist?.name || "Specialist"} width={40} height={40} className="h-full w-full object-cover" onError={e => {
                        e.currentTarget.srcset = `https://ui-avatars.com/api/?name=${specialist?.fullName || specialist?.name || "S"}`;
                      }} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-none">
                              {specialist?.fullName || specialist?.name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Stethoscope size={11} className="text-gray-400" />
                              {getSpecialistTypeLabel(specialist?.type || row.specialist_type)}
                            </p>
                            {specialist?.preferredRole && <p className="text-[10px] text-primary font-medium mt-0.5">
                                {specialist.preferredRole}
                              </p>}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-sm border border-rose-100">
                            {row.patient_name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {row.patient_name || "N/A"}
                            </p>
                            <div className="text-xs text-gray-500 space-y-0.5">
                              <p>
                                {row.patient_age && `${row.patient_age} yrs`}
                                {row.patient_gender && ` • ${row.patient_gender}`}
                              </p>
                              {row.location_of_care && <p className="flex items-center gap-1">
                                  <Hospital size={10} className="text-gray-400" />
                                  {row.location_of_care}
                                </p>}
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="text-[10px] text-primary font-bold mt-1 cursor-pointer hover:underline">
                                  View Details →
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Heart size={18} className="text-rose-500" />
                                    Patient Details
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-2">
                                  <div className="grid grid-cols-2 gap-3">
                                    <DetailTile label="Patient Name" value={row.patient_name} />
                                    <DetailTile label="Age" value={row.patient_age ? `${row.patient_age} years` : null} />
                                    <DetailTile label="Gender" value={row.patient_gender} />
                                    <DetailTile label="Relationship to booking person" value={row.relationship_to_booking_person} />
                                  </div>

                                  <div className="border-t pt-3">
                                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                                      <Activity size={12} className="text-primary" />{" "}
                                      Medical Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                      <DetailTile label="Conditions" value={row.patient_have_any_conditions?.join(", ") || "None"} />
                                      <DetailTile label="Other Conditions" value={row.patient_have_any_others_conditions} />
                                      <DetailTile label="On Medication" value={row.patient_currently_on_medication ? "Yes" : "No"} />
                                      {row.patient_currently_on_medication_data && <DetailTile label="Medication Details" value={row.patient_currently_on_medication_data} />}
                                      <DetailTile label="Allergies" value={row.patient_have_any_known_allergies} />
                                      {row.patient_have_any_known_allergies_details && <DetailTile label="Allergy Details" value={row.patient_have_any_known_allergies_details} />}
                                      <DetailTile label="Mobility Status" value={row.mobility_status_of_patient} />
                                      <DetailTile label="Location of Care" value={row.location_of_care} />
                                    </div>
                                  </div>

                                  {(row.communication_type || row.communication_method) && <div className="border-t pt-3">
                                      <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">
                                        Communication
                                      </h4>
                                      <div className="grid grid-cols-2 gap-3">
                                        <DetailTile label="Type" value={row.communication_type} />
                                        <DetailTile label="Instruction Level" value={row.instruction_level} />
                                        <DetailTile label="Method" value={row.communication_method} />
                                        <DetailTile label="Responds to Name" value={row.responds_to_name ? "Yes" : "No"} />
                                      </div>
                                    </div>}

                                  {(row.emergency_contact_name || row.primary_doctor_name) && <div className="border-t pt-3">
                                      <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                                        <AlertCircle size={12} className="text-red-400" />{" "}
                                        Emergency & Doctor
                                      </h4>
                                      <div className="grid grid-cols-2 gap-3">
                                        <DetailTile label="Emergency Contact" value={row.emergency_contact_name} />
                                        <DetailTile label="Emergency Phone" value={row.emergency_contact_number} />
                                        <DetailTile label="Primary Doctor" value={row.primary_doctor_name} />
                                        <DetailTile label="Doctor Phone" value={row.primary_doctor_number} />
                                        <DetailTile label="Primary Hospital" value={row.primary_hospital} />
                                      </div>
                                    </div>}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-50 text-primary flex items-center justify-center font-bold text-sm border border-green-100">
                            {client?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {client?.name || "N/A"}
                            </p>
                            <div className="text-xs text-gray-500 space-y-0.5">
                              {client?.number && <p className="flex items-center gap-1">
                                  <Phone size={10} className="text-gray-400" />
                                  {client.number}
                                </p>}
                              {client?.email && <p className="flex items-center gap-1">
                                  <Mail size={10} className="text-gray-400" />
                                  {client.email}
                                </p>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-sm font-medium text-gray-700 capitalize">
                              {row.booking_type} Plan
                            </div>
                            <div className="text-[11px] text-green-500 font-bold">
                              {row.booking_type === "monthly" ? (() => {
                          const parsed = typeof row.selected_dates_or_months === "string" ? JSON.parse(row.selected_dates_or_months) : row.selected_dates_or_months;
                          const monthKey = parsed?.[0]?.month || (typeof parsed?.[0] === "string" ? parsed[0] : null);
                          if (!monthKey) return "--";
                          return <span className="bg-purple-50 text-primary px-2 py-0.5 rounded border border-purple-100">
                                      {new Date(monthKey.length === 7 ? monthKey + "-01" : monthKey).toLocaleString("default", {
                              month: "long",
                              year: "numeric"
                            })}
                                    </span>;
                        })() : <span className="text-gray-500">
                                  {selectedDates.length} day
                                  {selectedDates.length !== 1 ? "s" : ""}{" "}
                                  selected
                                </span>}
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="p-2 cursor-pointer bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-green-200 rounded-lg shadow-sm transition-all">
                                <Eye size={16} />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>Selected Dates</DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center py-4">
                                <Calendar mode="multiple" selected={selectedDates} defaultMonth={selectedDates.length ? selectedDates[0] : new Date()} disabled={date => !selectedDates.some(d => d.toDateString() === date.toDateString())} className="rounded-md border shadow-sm" />
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg text-xs text-primary font-medium">
                                Highlighting dates for{" "}
                                <strong>{row.booking_type}</strong> plan •
                                Specialist:{" "}
                                <strong>
                                  {specialist?.fullName || specialist?.name || "N/A"}
                                </strong>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-gray-900">
                          KSh {row.booking_amount}
                        </span>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">
                          {row.booking_type === "monthly" ? "Per Month" : "Per Day"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <select value={row.booking_status} onChange={e => handleStatusChange(row.id, e.target.value)} className={`text-[11px] font-black uppercase px-2 py-1.5 rounded-lg border outline-none cursor-pointer ${getStatusStyles(row.booking_status)}`}>
                          {statusOptions.map(opt => <option key={opt} value={opt}>
                              {opt}
                            </option>)}
                        </select>
                      </td>
                    </tr>;
            }) : <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-400">
                    <FileText className="mx-auto mb-3 opacity-20" size={48} />
                    <p className="italic font-medium">
                      No {activeFilter !== "all" ? activeFilter : ""} bookings
                      found.
                    </p>
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>

        {filteredBookings.length > itemsPerPage && <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(startIndex + itemsPerPage, filteredBookings.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredBookings.length}
              </span>{" "}
              results
            </p>
            <div className="flex gap-2">
              <button onClick={() => updateParams(null, currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => <button key={i} onClick={() => updateParams(null, i + 1)} className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    {i + 1}
                  </button>)}
              </div>
              <button onClick={() => updateParams(null, currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>}
      </div>
    </div>;
};
const DetailTile = ({
  label,
  value
}) => <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
      {label}
    </span>
    <p className="text-sm font-semibold text-gray-800 break-words">
      {value || "Not Specified"}
    </p>
  </div>;
export default InstitutionBookingsPage;