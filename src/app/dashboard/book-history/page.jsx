"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Calendar as CalendarIcon,
  User,
  Stethoscope,
  FileText,
  Home,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Award,
  GraduationCap,
  Car,
  Languages,
  ShieldCheck,
  Briefcase,
  Clock,
  ExternalLink,
  FileCheck,
  Activity,
  Sparkles,
  AlertCircle,
  Star,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import LoadingSpinner from "@/components/shared/LoadingSpin";
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
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { postApi } from "@/lib/apiHandler";
import toast from "react-hot-toast";

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${path}`;
};

const getSpecialistTypeLabel = (type) => {
  if (!type) return "Specialist";
  switch (type.toLowerCase()) {
    case "house-manager":
      return "House Manager";
    case "agency-employee":
      return "Agency Employee";
    case "institution-nurse":
    case "nurse":
      return "Nurse";
    case "institution-nurse-assistant":
    case "nurse-assistant":
      return "Nurse Aide";
    case "institution-physiotherapist":
    case "physiotherapist":
      return "Physiotherapist";
    case "institution-special-need":
    case "special-need":
      return "Special Need Caregiver";
    default:
      return type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
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

const BookingHistoryPage = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 5;
  const currentPage = Number(searchParams.get("page")) || 1;
  const filterStatus = searchParams.get("status") || "All";
  const [bookings, setBookings] = useState([]);

  // Modals state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [justReviewed, setJustReviewed] = useState([]);

  // Specialist Details Modal
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [isSpecialistModalOpen, setIsSpecialistModalOpen] = useState(false);

  // Booking Service Details Modal
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [isBookingDetailsModalOpen, setIsBookingDetailsModalOpen] =
    useState(false);

  const { data, isLoading, error, mutate } = useFetch("/user-booking");

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setIsReviewOpen(true);
  };

  const handleOpenSpecialistDetails = (booking) => {
    setSelectedSpecialist({
      ...booking.specialist,
      specialist_type: booking.specialist_type,
      booking_id: booking.id,
      booking_status: booking.booking_status,
      booking_type: booking.booking_type,
      booking_amount: booking.booking_amount,
    });
    setIsSpecialistModalOpen(true);
  };

  const handleOpenBookingDetails = (booking) => {
    setSelectedBookingDetails(booking);
    setIsBookingDetailsModalOpen(true);
  };

  useEffect(() => {
    if (data) {
      const fetchedBookings = Array.isArray(data?.data?.data)
        ? data?.data?.data
        : Array.isArray(data?.data)
          ? data?.data
          : [];
      setBookings(fetchedBookings);
    }
  }, [data]);

  const getSelectedDates = (dateData) => {
    if (!dateData) return [];
    let parsed = dateData;
    if (typeof dateData === "string") {
      try {
        parsed = JSON.parse(dateData);
      } catch (e) {
        return [];
      }
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

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        Failed to sync with server.
      </div>
    );

  const filteredBookings =
    filterStatus !== "All"
      ? bookings.filter(
          (b) => b.booking_status?.toLowerCase() === filterStatus.toLowerCase(),
        )
      : bookings;

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const statusStyles = {
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    accepted: "bg-primary/10 text-primary border-primary/20",
    rejected: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="sectionHeading text-gray-900">Booking History</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your service requests, schedules, and booked specialist
            details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Filter:</span>
          <Select
            value={filterStatus}
            onValueChange={(v) => router.push(`?page=1&status=${v}`)}
          >
            <SelectTrigger className="w-full sm:w-44 bg-white border-gray-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Service / Recipient
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Specialist Details
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Schedule
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
              {currentBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <FileText className="mx-auto mb-2 opacity-30" size={40} />
                    <p className="font-medium text-gray-500">
                      No records found.
                    </p>
                  </td>
                </tr>
              ) : (
                currentBookings.map((row) => {
                  const dates = getSelectedDates(row.selected_dates_or_months);
                  const isAlreadyReviewed =
                    row.review_count > 0 || justReviewed.includes(row.id);
                  const isHouseManager =
                    row.specialist_type === "house-manager";
                  const specialist = row.specialist;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Service / Recipient Info */}
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
                            <p className="font-semibold text-gray-900 leading-tight mb-0.5">
                              {isHouseManager
                                ? "Home Care"
                                : row.patient_name || "Patient Care"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {isHouseManager
                                ? `${row.home_type || "House"} • ${row.home_size || "Standard"}`
                                : `Age: ${row.patient_age || "N/A"} • ${row.patient_gender || "Not specified"}`}
                            </p>
                            <button
                              onClick={() => handleOpenBookingDetails(row)}
                              className="text-[11px] text-primary font-medium hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <FileText size={11} />
                              View Details
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Specialist Details */}
                      <td className="px-6 py-4">
                        {specialist ? (
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary border border-primary/20 overflow-hidden flex items-center justify-center font-bold text-sm">
                              {specialist.profilePhoto ? (
                                <Image
                                  src={buildImageUrl(specialist.profilePhoto)}
                                  alt={specialist.name || "Specialist"}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span>
                                  {(specialist.name || "S")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-semibold text-gray-900 leading-tight truncate">
                                  {specialist.name ||
                                    specialist.fullName ||
                                    "Specialist"}
                                </p>
                                {specialist.is_profile_verified && (
                                  <ShieldCheck
                                    size={14}
                                    className="text-primary shrink-0"
                                    title="Verified Specialist"
                                  />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="inline-block bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/20">
                                  {getSpecialistTypeLabel(
                                    specialist.type ||
                                      specialist.subRole ||
                                      row.specialist_type,
                                  )}
                                </span>
                              </div>
                              <button
                                onClick={() => handleOpenSpecialistDetails(row)}
                                className="text-[11px] text-primary font-medium hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye size={12} />
                                View Profile
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            Specialist details unavailable
                          </span>
                        )}
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="text-sm font-medium text-gray-900 block capitalize">
                              {row.booking_type} Plan
                            </span>
                            <span className="text-xs text-gray-500">
                              {dates.length > 0
                                ? `${dates.length} day${dates.length === 1 ? "" : "s"} selected`
                                : row.created_at?.split("T")[0] || "Custom"}
                            </span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg cursor-pointer"
                              >
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-gray-900">
                                  <CalendarIcon
                                    size={18}
                                    className="text-primary"
                                  />
                                  Selected Dates
                                </DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center p-2">
                                <Calendar
                                  mode="multiple"
                                  selected={dates}
                                  defaultMonth={dates[0] || new Date()}
                                  className="rounded-md border border-gray-200"
                                />
                              </div>
                              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs text-gray-700 text-center">
                                Total{" "}
                                <strong className="text-primary">
                                  {dates.length}
                                </strong>{" "}
                                service days selected.
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 text-sm">
                          {row.booking_amount
                            ? `KSh ${row.booking_amount}`
                            : "KSh --"}
                        </span>
                        <p className="text-[10px] text-gray-400 uppercase font-medium">
                          {row.booking_type === "monthly"
                            ? "Per Month"
                            : "Total"}
                        </p>
                      </td>

                      {/* Status & Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                          {/* <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                              statusStyles[row.booking_status?.toLowerCase()] ||
                              "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {row.booking_status || "Pending"}
                          </span> */}

                          {row.booking_status?.toLowerCase() === "completed" &&
                            (isAlreadyReviewed ? (
                              <Button
                                size="xs"
                                variant="outline"
                                disabled
                                className="cursor-default text-[11px]"
                              >
                                Reviewed
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                className="cursor-pointer bg-primary text-white hover:bg-primary/90 text-[11px]"
                                onClick={() => handleOpenReview(row)}
                                isActionLoading={isActionLoading}
                              >
                                <Star size={12} className="mr-1 fill-white" />
                                Review
                              </Button>
                            ))}

                          {row.specialist_id && (
                            <Button
                              variant="outline"
                              size="xs"
                              className="cursor-pointer border-primary text-primary hover:bg-primary hover:text-white transition-colors text-[11px]"
                              onClick={() =>
                                router.push(
                                  `/dashboard/user-inbox?specialistId=${row.specialist_id}&specialistName=${encodeURIComponent(
                                    specialist?.name ||
                                      specialist?.fullName ||
                                      "Specialist",
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
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of{" "}
              {filteredBookings.length}
            </p>
            <Pagination className="m-0 w-auto">
              <PaginationContent>
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious
                    onClick={() => goToPage(currentPage - 1)}
                  />
                </PaginationItem>
                <PaginationItem className="cursor-pointer">
                  <PaginationNext onClick={() => goToPage(currentPage + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* ================= SPECIALIST DETAILS DIALOG ================= */}
      <Dialog
        open={isSpecialistModalOpen}
        onOpenChange={setIsSpecialistModalOpen}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Stethoscope size={20} className="text-primary" />
              Specialist Profile Details
            </DialogTitle>
            <DialogDescription>
              Complete profile details for your booked specialist.
            </DialogDescription>
          </DialogHeader>

          {selectedSpecialist && (
            <div className="space-y-5 mt-2">
              {/* Header Hero Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative h-18 w-18 rounded-2xl bg-white border border-gray-200 shadow-xs overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xl text-primary">
                  {selectedSpecialist.profilePhoto ? (
                    <Image
                      src={buildImageUrl(selectedSpecialist.profilePhoto)}
                      alt={selectedSpecialist.name || "Specialist"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>
                      {(selectedSpecialist.name || "S").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedSpecialist.name ||
                        selectedSpecialist.fullName ||
                        "Specialist"}
                    </h3>
                    {selectedSpecialist.is_profile_verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        <CheckCircle2 size={13} className="text-primary" />
                        Verified
                      </span>
                    )}
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      {getSpecialistTypeLabel(
                        selectedSpecialist.type ||
                          selectedSpecialist.subRole ||
                          selectedSpecialist.specialist_type,
                      )}
                    </span>
                  </div>

                  {selectedSpecialist.preferredRole && (
                    <p className="text-sm text-gray-600 mt-1">
                      Preferred Role:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedSpecialist.preferredRole}
                      </span>
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-gray-500">
                    {selectedSpecialist.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-primary" />
                        {selectedSpecialist.location}
                      </span>
                    )}
                    {selectedSpecialist.employmentStatus && (
                      <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                        <Clock size={12} className="text-gray-500" />
                        {selectedSpecialist.employmentStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Phone size={13} className="text-primary" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSpecialist.number && (
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                        Phone Number
                      </span>
                      <a
                        href={`tel:${selectedSpecialist.number}`}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
                      >
                        <Phone size={13} />
                        {selectedSpecialist.number}
                      </a>
                    </div>
                  )}
                  {selectedSpecialist.number_two && (
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                        Alternative Phone
                      </span>
                      <a
                        href={`tel:${selectedSpecialist.number_two}`}
                        className="text-sm font-semibold text-gray-800 hover:underline flex items-center gap-1.5"
                      >
                        <Phone size={13} />
                        {selectedSpecialist.number_two}
                      </a>
                    </div>
                  )}
                  {selectedSpecialist.email && (
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${selectedSpecialist.email}`}
                        className="text-sm font-semibold text-gray-800 hover:underline flex items-center gap-1.5 break-all"
                      >
                        <Mail size={13} />
                        {selectedSpecialist.email}
                      </a>
                    </div>
                  )}
                  <DetailTile
                    icon={MapPin}
                    label="Location"
                    value={selectedSpecialist.location}
                  />
                </div>
              </div>

              {/* Bio Summary */}
              {selectedSpecialist.bio && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-primary" />
                    About / Bio
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-sm text-gray-700 leading-relaxed italic">
                    "{selectedSpecialist.bio}"
                  </div>
                </div>
              )}

              {/* Profile & Qualifications */}
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Award size={13} className="text-primary" />
                  Qualifications & Profile
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <DetailTile
                    icon={User}
                    label="Age"
                    value={
                      selectedSpecialist.age
                        ? `${selectedSpecialist.age} yrs`
                        : null
                    }
                  />
                  <DetailTile
                    icon={User}
                    label="Gender"
                    value={selectedSpecialist.gender}
                  />
                  <DetailTile
                    icon={GraduationCap}
                    label="Education"
                    value={selectedSpecialist.education}
                  />
                  <DetailTile
                    icon={Car}
                    label="Can Drive"
                    value={
                      selectedSpecialist.canDrive !== undefined &&
                      selectedSpecialist.canDrive !== null
                        ? selectedSpecialist.canDrive
                          ? "Yes (Licensed/Ready)"
                          : "No"
                        : null
                    }
                  />
                  <DetailTile
                    icon={Home}
                    label="Arrangement"
                    value={
                      Array.isArray(selectedSpecialist.preferred)
                        ? selectedSpecialist.preferred.join(", ")
                        : selectedSpecialist.preferred
                    }
                  />
                  <DetailTile
                    icon={Briefcase}
                    label="Preferred Role"
                    value={selectedSpecialist.preferredRole}
                  />
                </div>

                {/* Languages */}
                {Array.isArray(selectedSpecialist.languages) &&
                  selectedSpecialist.languages.length > 0 && (
                    <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                        <Languages size={12} className="text-primary" />
                        Languages Spoken
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSpecialist.languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="bg-white text-gray-800 border border-gray-200 text-xs font-medium px-2.5 py-1 rounded-lg"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Experience & Background */}
              {(selectedSpecialist.homeBasedCare ||
                selectedSpecialist.homeBasedYearsOfExperience ||
                selectedSpecialist.hospitalBasedCare ||
                selectedSpecialist.hospitalBasedYearsOfExperience) && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Briefcase size={13} className="text-primary" />
                    Care Experience & Background
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                        Home-Based Care
                      </span>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedSpecialist.homeBasedYearsOfExperience
                          ? `${selectedSpecialist.homeBasedYearsOfExperience} Years Experience`
                          : selectedSpecialist.homeBasedCare
                            ? "Experienced"
                            : "None"}
                      </p>
                      {selectedSpecialist.homeBasedReferenceContact && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ref: {selectedSpecialist.homeBasedReferenceContact}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                        Hospital-Based Care
                      </span>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedSpecialist.hospitalBasedYearsOfExperience
                          ? `${selectedSpecialist.hospitalBasedYearsOfExperience} Years Experience`
                          : selectedSpecialist.hospitalBasedCare
                            ? "Experienced"
                            : "None"}
                      </p>
                      {selectedSpecialist.hospitalBasedReferenceContact && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ref:{" "}
                          {selectedSpecialist.hospitalBasedReferenceContact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Verified Documents */}
              {(selectedSpecialist.goodConductCertificate ||
                selectedSpecialist.idCopy ||
                selectedSpecialist.drivingLicense ||
                selectedSpecialist.referenceLetter) && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <FileCheck size={13} className="text-primary" />
                    Verification Documents & Records
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialist.goodConductCertificate && (
                      <a
                        href={buildImageUrl(
                          selectedSpecialist.goodConductCertificate,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
                      >
                        <FileCheck size={14} className="text-primary" />
                        Good Conduct Certificate
                        <ExternalLink size={11} className="opacity-60" />
                      </a>
                    )}
                    {selectedSpecialist.idCopy && (
                      <a
                        href={buildImageUrl(selectedSpecialist.idCopy)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
                      >
                        <ShieldCheck size={14} className="text-primary" />
                        National ID / ID Copy
                        <ExternalLink size={11} className="opacity-60" />
                      </a>
                    )}
                    {selectedSpecialist.drivingLicense && (
                      <a
                        href={buildImageUrl(selectedSpecialist.drivingLicense)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Car size={14} className="text-primary" />
                        Driving License
                        <ExternalLink size={11} className="opacity-60" />
                      </a>
                    )}
                    {selectedSpecialist.referenceLetter && (
                      <a
                        href={buildImageUrl(selectedSpecialist.referenceLetter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
                      >
                        <FileText size={14} className="text-primary" />
                        Reference Letter
                        <ExternalLink size={11} className="opacity-60" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            {selectedSpecialist && (
              <>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    setIsSpecialistModalOpen(false);
                    router.push(
                      `/profile?type=${
                        selectedSpecialist.type ||
                        selectedSpecialist.subRole ||
                        selectedSpecialist.specialist_type ||
                        "specialist"
                      }&id=${selectedSpecialist.id}`,
                    );
                  }}
                >
                  <ExternalLink size={14} className="mr-1.5" />
                  View Public Profile
                </Button>
                <Button
                  className="cursor-pointer bg-primary text-white hover:bg-primary/90"
                  onClick={() => {
                    setIsSpecialistModalOpen(false);
                    router.push(
                      `/dashboard/user-inbox?specialistId=${selectedSpecialist.id}&specialistName=${encodeURIComponent(
                        selectedSpecialist.name || "Specialist",
                      )}`,
                    );
                  }}
                >
                  <MessageSquare size={14} className="mr-1.5" />
                  Message Specialist
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => setIsSpecialistModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= BOOKING / SERVICE DETAILS DIALOG ================= */}
      <Dialog
        open={isBookingDetailsModalOpen}
        onOpenChange={setIsBookingDetailsModalOpen}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <FileText size={20} className="text-primary" />
              Service & Request Information
            </DialogTitle>
            <DialogDescription>
              Detailed service requirements submitted for Booking #
              {selectedBookingDetails?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedBookingDetails && (
            <div className="space-y-4 mt-2">
              {/* House Manager specific fields */}
              {selectedBookingDetails.specialist_type === "house-manager" ? (
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Home size={13} className="text-primary" />
                    Home & Family Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailTile
                      icon={Home}
                      label="Home Type"
                      value={selectedBookingDetails.home_type}
                    />
                    <DetailTile
                      icon={Home}
                      label="Home Size"
                      value={selectedBookingDetails.home_size}
                    />
                    <DetailTile
                      icon={User}
                      label="Has Kids"
                      value={selectedBookingDetails.has_kids ? "Yes" : "No"}
                    />
                    <DetailTile
                      icon={User}
                      label="Kids Age Brackets"
                      value={
                        Array.isArray(selectedBookingDetails.age_bracket) &&
                        selectedBookingDetails.age_bracket.length > 0
                          ? selectedBookingDetails.age_bracket.join(", ")
                          : "None"
                      }
                    />
                  </div>
                </div>
              ) : (
                /* Patient / Healthcare specific fields */
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <User size={13} className="text-primary" />
                    Patient Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailTile
                      icon={User}
                      label="Patient Name"
                      value={selectedBookingDetails.patient_name}
                    />
                    <DetailTile
                      icon={User}
                      label="Age"
                      value={
                        selectedBookingDetails.patient_age
                          ? `${selectedBookingDetails.patient_age} yrs`
                          : null
                      }
                    />
                    <DetailTile
                      icon={User}
                      label="Gender"
                      value={selectedBookingDetails.patient_gender}
                    />
                    <DetailTile
                      icon={User}
                      label="Relationship to Booker"
                      value={
                        selectedBookingDetails.relationship_to_booking_person
                      }
                    />
                  </div>

                  {/* Medical Info */}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <Activity size={13} className="text-primary" />
                      Medical & Care Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <DetailTile
                        label="Known Conditions"
                        value={
                          Array.isArray(
                            selectedBookingDetails.patient_have_any_conditions,
                          )
                            ? selectedBookingDetails.patient_have_any_conditions.join(
                                ", ",
                              )
                            : selectedBookingDetails.patient_have_any_conditions
                        }
                      />
                      <DetailTile
                        label="Other Conditions"
                        value={
                          selectedBookingDetails.patient_have_any_others_conditions
                        }
                      />
                      <DetailTile
                        label="On Medication"
                        value={
                          selectedBookingDetails.patient_currently_on_medication
                            ? "Yes"
                            : "No"
                        }
                      />
                      <DetailTile
                        label="Medication Details"
                        value={
                          selectedBookingDetails.patient_currently_on_medication_data
                        }
                      />
                      <DetailTile
                        label="Known Allergies"
                        value={
                          selectedBookingDetails.patient_have_any_known_allergies
                        }
                      />
                      <DetailTile
                        label="Allergy Details"
                        value={
                          selectedBookingDetails.patient_have_any_known_allergies_details
                        }
                      />
                      <DetailTile
                        label="Mobility Status"
                        value={
                          selectedBookingDetails.mobility_status_of_patient
                        }
                      />
                      <DetailTile
                        label="Location of Care"
                        value={selectedBookingDetails.location_of_care}
                      />
                    </div>
                  </div>

                  {/* Emergency Contact & Doctor */}
                  {(selectedBookingDetails.emergency_contact_name ||
                    selectedBookingDetails.primary_doctor_name) && (
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertCircle size={13} className="text-gray-500" />
                        Emergency & Doctor Contacts
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <DetailTile
                          label="Emergency Contact Name"
                          value={selectedBookingDetails.emergency_contact_name}
                        />
                        <DetailTile
                          label="Emergency Contact Phone"
                          value={
                            selectedBookingDetails.emergency_contact_number
                          }
                        />
                        <DetailTile
                          label="Primary Doctor"
                          value={selectedBookingDetails.primary_doctor_name}
                        />
                        <DetailTile
                          label="Doctor Phone"
                          value={selectedBookingDetails.primary_doctor_number}
                        />
                        <DetailTile
                          label="Primary Hospital"
                          value={selectedBookingDetails.primary_hospital}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule & Financial Overview */}
              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Plan & Booking Info
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <DetailTile
                    label="Booking Plan"
                    value={selectedBookingDetails.booking_type}
                  />
                  <DetailTile
                    label="Total Amount"
                    value={
                      selectedBookingDetails.booking_amount
                        ? `KSh ${selectedBookingDetails.booking_amount}`
                        : "KSh --"
                    }
                  />
                  <DetailTile
                    label="Booking Status"
                    value={selectedBookingDetails.booking_status}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsBookingDetailsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= LEAVE A REVIEW DIALOG ================= */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              Leave a Review
            </DialogTitle>
            <DialogDescription>
              Share your feedback for{" "}
              <strong>
                {selectedBooking?.specialist?.name ||
                  selectedBooking?.specialist?.fullName ||
                  "your specialist"}
              </strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Rating (1 – 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={
                        star <= rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-gray-700">
                  {rating} / 5
                </span>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label className="text-sm font-semibold text-gray-700">
                Your Review Message
              </label>
              <Textarea
                placeholder="How was the service provided? What did you appreciate most?"
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                rows={4}
                className="rounded-xl border-gray-200"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => setIsReviewOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer bg-primary text-white hover:bg-primary/90"
              disabled={isSubmittingReview}
              onClick={handleReviewSubmit}
              isActionLoading={isActionLoading}
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  async function handleReviewSubmit() {
    if (!reviewMessage.trim()) return toast.error("Please write a review.");
    setIsActionLoading(true);
    try {
      setIsSubmittingReview(true);
      await postApi("/review", {
        booking_id: selectedBooking?.id,
        specialist_id: selectedBooking?.specialist_id,
        rating: Number(rating),
        review: reviewMessage.trim(),
        specialist_type: selectedBooking?.specialist_type,
      });
      setJustReviewed((prev) => [...prev, selectedBooking.id]);
      toast.success("Review submitted successfully!");
      setIsReviewOpen(false);
      setReviewMessage("");
    } catch (err) {
      toast.error("Failed to submit review.");
    } finally {
      setIsActionLoading(false);
      setIsSubmittingReview(false);
    }
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    router.push(`?page=${page}&status=${filterStatus}`);
  }
};

export default BookingHistoryPage;
