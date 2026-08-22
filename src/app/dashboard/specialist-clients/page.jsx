"use client";

import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import { postApi } from "@/lib/apiHandler";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Home,
  MapPin,
  Calendar as CalendarIcon,
  MessageSquare,
  Activity,
  AlertCircle,
  FileText,
  Heart,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${path}`;
};

const DetailTile = ({ icon: Icon, label, value, className = "" }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div
      className={`bg-gray-50 rounded-xl p-3 border border-gray-200 ${className}`}
    >
      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-primary" />}
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 break-words">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </span>
    </div>
  );
};

const Page = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("status") || "all";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 5;
  const [clients, setClients] = useState([]);

  // Detail Modal State
  const [selectedClientBooking, setSelectedClientBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data, isLoading, error, mutate } = useFetch("/specialist-booking");

  useEffect(() => {
    if (data) {
      const rawData = Array.isArray(data?.data?.data)
        ? data?.data?.data
        : Array.isArray(data?.data)
          ? data?.data
          : Array.isArray(data)
            ? data
            : [];
      const sortedData = [...rawData].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setClients(sortedData);
    }
  }, [data]);

  const updateParams = (newStatus, newPage) => {
    const params = new URLSearchParams(searchParams);
    if (newStatus) {
      if (newStatus === "all") params.delete("status");
      else params.set("status", newStatus);
      params.set("page", "1");
    }
    if (newPage) {
      params.set("page", newPage.toString());
    }
    router.push(`?${params.toString()}`);
  };

  const getSelectedDates = (row) => {
    let parsed;
    try {
      parsed =
        typeof row.selected_dates_or_months === "string"
          ? JSON.parse(row.selected_dates_or_months)
          : row.selected_dates_or_months;
    } catch (e) {
      return [];
    }
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    if (parsed[0]?.dates && Array.isArray(parsed[0].dates)) {
      return parsed.flatMap((item) =>
        Array.isArray(item.dates) ? item.dates.map((d) => new Date(d)) : [],
      );
    }

    if (typeof parsed[0] === "string" && parsed[0].length > 7) {
      return parsed.map((d) => new Date(d));
    }

    if (typeof parsed[0] === "string" && parsed[0].length === 7) {
      const [year, month] = parsed[0].split("-").map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from(
        { length: daysInMonth },
        (_, i) => new Date(year, month - 1, i + 1),
      );
    }
    return [];
  };

  const handleStatusChange = async (id, newStatus) => {
    const previousClients = [...clients];
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              booking_status: newStatus,
            }
          : c,
      ),
    );
    if (selectedClientBooking?.id === id) {
      setSelectedClientBooking((prev) => ({
        ...prev,
        booking_status: newStatus,
      }));
    }
    toast.success(`Status updated to ${newStatus}`);
    setIsActionLoading(true);
    try {
      const response = await postApi(`/update-booking-status/${id}`, {
        booking_status: newStatus,
      });
      if (response.status !== 200) {
        throw new Error("Failed");
      }
    } catch (err) {
      toast.error("Failed to update status");
      setClients(previousClients);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenClientDetails = (row) => {
    setSelectedClientBooking(row);
    setIsDetailModalOpen(true);
  };

  const filteredClients =
    activeFilter === "all"
      ? clients
      : clients.filter(
          (c) => c.booking_status?.toLowerCase() === activeFilter.toLowerCase(),
        );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold text-xl italic">
        Error loading client data.
      </div>
    );

  const statusOptions = ["pending", "accepted", "rejected", "completed"];

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "accepted":
        return "bg-primary/10 text-primary border-primary/20";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="sectionHeading text-gray-900">Client Management</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your client bookings, booker contact details, and service
            schedules.
          </p>
        </div>

        <div className="w-full sm:w-[220px]">
          <Select
            value={activeFilter}
            onValueChange={(value) => updateParams(value, null)}
          >
            <SelectTrigger className="w-full bg-white border-gray-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client (Book Person)
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Service / Recipient
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Actions
                </th>
                {/* <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Status & Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((row) => {
                  const selectedDates = getSelectedDates(row);
                  const isHouseManager =
                    row.specialist_type === "house-manager" ||
                    Boolean(row.home_type);
                  const clientUser = row.user;
                  const clientPhone =
                    clientUser?.number || row.emergency_contact_number;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Client (Book Person) Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                            {clientUser?.name
                              ? clientUser.name.charAt(0).toUpperCase()
                              : "C"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 leading-tight truncate">
                              {clientUser?.name || "Client / Booker"}
                            </p>
                            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                              {clientPhone ? (
                                <a
                                  href={`tel:${clientPhone}`}
                                  className="flex items-center gap-1 text-primary font-medium hover:underline"
                                >
                                  <Phone
                                    size={11}
                                    className="text-primary/70"
                                  />
                                  {clientPhone}
                                </a>
                              ) : (
                                <span className="text-gray-400">
                                  No phone provided
                                </span>
                              )}
                              {clientUser?.email && (
                                <a
                                  href={`mailto:${clientUser.email}`}
                                  className="flex items-center gap-1 text-gray-500 hover:text-gray-800 truncate"
                                >
                                  <Mail size={11} className="text-gray-400" />
                                  {clientUser.email}
                                </a>
                              )}
                            </div>
                            <span className="inline-block text-[10px] text-gray-400 font-medium mt-0.5">
                              Booker ID: #
                              {row.booking_person_id ||
                                clientUser?.id ||
                                row.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Service / Recipient Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-100 text-primary flex items-center justify-center border border-gray-200 font-medium">
                            {isHouseManager ? (
                              <Home size={18} />
                            ) : (
                              <User size={18} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">
                              {isHouseManager
                                ? "Home Care"
                                : row.patient_name ||
                                  clientUser?.name ||
                                  "Patient Care"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {isHouseManager
                                ? `${row.home_type || "House"} • ${row.home_size || "Standard"}`
                                : `Age: ${row.patient_age || "N/A"} • ${row.patient_gender || "N/A"}`}
                            </p>
                            <button
                              onClick={() => handleOpenClientDetails(row)}
                              className="text-[11px] text-primary font-medium hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <FileText size={11} />
                              View Details
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {row.booking_type} Plan
                            </div>
                            <div className="text-xs text-primary font-semibold mt-0.5">
                              {row.booking_type === "monthly" ? (
                                (() => {
                                  const parsed =
                                    typeof row.selected_dates_or_months ===
                                    "string"
                                      ? JSON.parse(row.selected_dates_or_months)
                                      : row.selected_dates_or_months;
                                  const monthKey =
                                    parsed?.[0]?.month ||
                                    (typeof parsed?.[0] === "string"
                                      ? parsed[0]
                                      : null);
                                  if (!monthKey)
                                    return `${selectedDates.length} days`;
                                  return (
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20 text-[11px]">
                                      {new Date(
                                        monthKey.length === 7
                                          ? monthKey + "-01"
                                          : monthKey,
                                      ).toLocaleString("default", {
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </span>
                                  );
                                })()
                              ) : (
                                <span className="text-gray-500">
                                  {selectedDates.length > 0
                                    ? `${selectedDates.length} days selected`
                                    : row.created_at?.split("T")[0] || "Custom"}
                                </span>
                              )}
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="p-2 cursor-pointer bg-white border border-gray-200 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                                <Eye size={15} />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-gray-900">
                                  <CalendarIcon
                                    size={18}
                                    className="text-primary"
                                  />
                                  Booking Calendar View
                                </DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center py-3">
                                <Calendar
                                  mode="multiple"
                                  selected={selectedDates}
                                  defaultMonth={
                                    selectedDates.length
                                      ? selectedDates[0]
                                      : new Date()
                                  }
                                  disabled={(date) =>
                                    !selectedDates.some(
                                      (d) =>
                                        d.toDateString() ===
                                        date.toDateString(),
                                    )
                                  }
                                  className="rounded-md border border-gray-200"
                                />
                              </div>
                              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs text-gray-700 text-center">
                                Highlighting{" "}
                                <strong className="text-primary">
                                  {selectedDates.length}
                                </strong>{" "}
                                service dates for{" "}
                                <strong>{row.booking_type}</strong> plan.
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md text-[12px] font-medium inline-flex items-center gap-1">
                          <MapPin size={11} className="text-primary" />
                          {row.location_of_care ||
                            row.home_type ||
                            "Not Specified"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {row.booking_amount
                          ? `KSh ${row.booking_amount}`
                          : "KSh --"}
                        <p className="text-[10px] text-gray-400 font-medium uppercase">
                          {row.booking_type === "monthly"
                            ? "Per Month"
                            : "Plan"}
                        </p>
                      </td>

                      {/* Status Action & Buttons */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                          {/* <select
                            value={row.booking_status}
                            onChange={(e) =>
                              handleStatusChange(row.id, e.target.value)
                            }
                            className={`text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors ${getStatusStyles(
                              row.booking_status,
                            )}`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select> */}

                          {(row.booking_person_id || clientUser?.id) && (
                            <Button
                              variant="outline"
                              size="xs"
                              className="cursor-pointer border-primary text-primary hover:bg-primary hover:text-white transition-colors text-[11px]"
                              onClick={() =>
                                router.push(
                                  `/dashboard/specialist-inbox?userId=${
                                    row.booking_person_id || clientUser?.id
                                  }&userName=${encodeURIComponent(
                                    clientUser?.name || "Client",
                                  )}`,
                                )
                              }
                            >
                              <MessageSquare size={12} className="mr-1" />
                              Message
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center text-gray-400 italic font-medium"
                  >
                    <FileText className="mx-auto mb-2 opacity-30" size={40} />
                    No {activeFilter !== "all" ? activeFilter : ""} bookings
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredClients.length > itemsPerPage && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(indexOfLastItem, filteredClients.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredClients.length}
              </span>{" "}
              clients
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => updateParams(null, currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateParams(null, i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                      currentPage === i + 1
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => updateParams(null, currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= CLIENT & BOOKING DETAILS MODAL ================= */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <User size={20} className="text-primary" />
                Client & Booking Details
              </DialogTitle>
              {selectedClientBooking && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusStyles(
                    selectedClientBooking.booking_status,
                  )}`}
                >
                  {selectedClientBooking.booking_status}
                </span>
              )}
            </div>
            <DialogDescription>
              Full details for Booking #{selectedClientBooking?.id} placed on{" "}
              {selectedClientBooking?.created_at?.split("T")[0]}
            </DialogDescription>
          </DialogHeader>

          {selectedClientBooking && (
            <div className="space-y-5 mt-2">
              {/* Client / Book Person Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                      {selectedClientBooking.user?.name
                        ? selectedClientBooking.user.name
                            .charAt(0)
                            .toUpperCase()
                        : "C"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {selectedClientBooking.user?.name ||
                            "Client / Booker"}
                        </h3>
                        <span className="bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full border border-primary/20">
                          Book Person
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Client ID: #
                        {selectedClientBooking.booking_person_id ||
                          selectedClientBooking.user?.id}
                      </p>
                    </div>
                  </div>

                  {/* Quick message client button */}
                  {(selectedClientBooking.booking_person_id ||
                    selectedClientBooking.user?.id) && (
                    <Button
                      size="sm"
                      className="cursor-pointer bg-primary text-white hover:bg-primary/90 shrink-0"
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        router.push(
                          `/dashboard/specialist-inbox?userId=${
                            selectedClientBooking.booking_person_id ||
                            selectedClientBooking.user?.id
                          }&userName=${encodeURIComponent(
                            selectedClientBooking.user?.name || "Client",
                          )}`,
                        );
                      }}
                    >
                      <MessageSquare size={14} className="mr-1.5" />
                      Message Client
                    </Button>
                  )}
                </div>

                {/* Client Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-200">
                  <div className="bg-white rounded-xl p-3 border border-gray-200">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Phone Number
                    </span>
                    {selectedClientBooking.user?.number ||
                    selectedClientBooking.emergency_contact_number ? (
                      <a
                        href={`tel:${
                          selectedClientBooking.user?.number ||
                          selectedClientBooking.emergency_contact_number
                        }`}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
                      >
                        <Phone size={13} />
                        {selectedClientBooking.user?.number ||
                          selectedClientBooking.emergency_contact_number}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400 font-medium">
                        N/A
                      </span>
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-gray-200">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Email Address
                    </span>
                    {selectedClientBooking.user?.email ? (
                      <a
                        href={`mailto:${selectedClientBooking.user.email}`}
                        className="text-sm font-semibold text-gray-800 hover:underline flex items-center gap-1.5 truncate"
                      >
                        <Mail size={13} />
                        {selectedClientBooking.user.email}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400 font-medium">
                        N/A
                      </span>
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-gray-200">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Relationship to Service
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedClientBooking.relationship_to_booking_person ||
                        (selectedClientBooking.specialist_type ===
                        "house-manager"
                          ? "Homeowner / Client"
                          : "Client")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service & Requirements Details */}
              {selectedClientBooking.specialist_type === "house-manager" ||
              Boolean(selectedClientBooking.home_type) ? (
                /* House Manager Booking Details */
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Home size={13} className="text-primary" />
                    Home & Household Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <DetailTile
                      icon={Home}
                      label="Home Type"
                      value={selectedClientBooking.home_type}
                    />
                    <DetailTile
                      icon={Home}
                      label="Home Size"
                      value={selectedClientBooking.home_size}
                    />
                    <DetailTile
                      icon={User}
                      label="Has Kids"
                      value={selectedClientBooking.has_kids ? "Yes" : "No"}
                    />
                    <DetailTile
                      icon={User}
                      label="Kids Age Bracket"
                      value={
                        Array.isArray(selectedClientBooking.age_bracket) &&
                        selectedClientBooking.age_bracket.length > 0
                          ? selectedClientBooking.age_bracket.join(", ")
                          : "None"
                      }
                    />
                  </div>
                </div>
              ) : (
                /* Patient Care Booking Details */
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Heart size={13} className="text-primary" />
                    Patient Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <DetailTile
                      icon={User}
                      label="Patient Name"
                      value={selectedClientBooking.patient_name}
                    />
                    <DetailTile
                      icon={User}
                      label="Patient Age"
                      value={
                        selectedClientBooking.patient_age
                          ? `${selectedClientBooking.patient_age} yrs`
                          : null
                      }
                    />
                    <DetailTile
                      icon={User}
                      label="Patient Gender"
                      value={selectedClientBooking.patient_gender}
                    />
                    <DetailTile
                      icon={User}
                      label="Relationship"
                      value={
                        selectedClientBooking.relationship_to_booking_person
                      }
                    />
                  </div>

                  {/* Medical Details */}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <Activity size={13} className="text-primary" />
                      Medical & Health Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <DetailTile
                        label="Known Conditions"
                        value={
                          Array.isArray(
                            selectedClientBooking.patient_have_any_conditions,
                          )
                            ? selectedClientBooking.patient_have_any_conditions.join(
                                ", ",
                              )
                            : selectedClientBooking.patient_have_any_conditions
                        }
                      />
                      <DetailTile
                        label="Other Conditions"
                        value={
                          selectedClientBooking.patient_have_any_others_conditions
                        }
                      />
                      <DetailTile
                        label="On Medication"
                        value={
                          selectedClientBooking.patient_currently_on_medication
                            ? "Yes"
                            : "No"
                        }
                      />
                      <DetailTile
                        label="Medication Details"
                        value={
                          selectedClientBooking.patient_currently_on_medication_data
                        }
                      />
                      <DetailTile
                        label="Known Allergies"
                        value={
                          selectedClientBooking.patient_have_any_known_allergies
                        }
                      />
                      <DetailTile
                        label="Allergy Details"
                        value={
                          selectedClientBooking.patient_have_any_known_allergies_details
                        }
                      />
                      <DetailTile
                        label="Mobility Status"
                        value={selectedClientBooking.mobility_status_of_patient}
                      />
                      <DetailTile
                        label="Location of Care"
                        value={selectedClientBooking.location_of_care}
                      />
                    </div>

                    {/* Prescription file */}
                    {selectedClientBooking.prescription_file && (
                      <div className="mt-3">
                        <a
                          href={buildImageUrl(
                            selectedClientBooking.prescription_file,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 hover:text-primary transition-colors"
                        >
                          <FileCheck size={14} className="text-primary" />
                          View Patient Prescription File
                          <ExternalLink size={11} className="opacity-60" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Emergency & Doctor Contacts */}
                  {(selectedClientBooking.emergency_contact_name ||
                    selectedClientBooking.emergency_contact_number ||
                    selectedClientBooking.primary_doctor_name) && (
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertCircle size={13} className="text-gray-500" />
                        Emergency & Doctor Information
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <DetailTile
                          label="Emergency Contact"
                          value={selectedClientBooking.emergency_contact_name}
                        />
                        <DetailTile
                          label="Emergency Phone"
                          value={selectedClientBooking.emergency_contact_number}
                        />
                        <DetailTile
                          label="Primary Doctor"
                          value={selectedClientBooking.primary_doctor_name}
                        />
                        <DetailTile
                          label="Doctor Phone"
                          value={selectedClientBooking.primary_doctor_number}
                        />
                        <DetailTile
                          label="Hospital"
                          value={selectedClientBooking.primary_hospital}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule & Financial Summary */}
              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <CalendarIcon size={13} className="text-primary" />
                  Schedule & Payment Overview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <DetailTile
                    label="Plan Type"
                    value={selectedClientBooking.booking_type}
                  />
                  <DetailTile
                    label="Scheduled Days"
                    value={`${getSelectedDates(selectedClientBooking).length} Days`}
                  />
                  <DetailTile
                    label="Booking Amount"
                    value={
                      selectedClientBooking.booking_amount
                        ? `KSh ${selectedClientBooking.booking_amount}`
                        : "KSh --"
                    }
                  />
                  <DetailTile
                    label="Current Status"
                    value={selectedClientBooking.booking_status}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                Update Status:
              </span>
              {selectedClientBooking && (
                <select
                  value={selectedClientBooking.booking_status}
                  onChange={(e) =>
                    handleStatusChange(selectedClientBooking.id, e.target.value)
                  }
                  className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${getStatusStyles(
                    selectedClientBooking.booking_status,
                  )}`}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
