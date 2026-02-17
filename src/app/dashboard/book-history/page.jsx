"use client";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Calendar,
  User,
  Stethoscope,
  FileText,
  ChevronRight,
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
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { postApi } from "@/lib/apiHandler";
import toast from "react-hot-toast";

const BookingHistoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemsPerPage = 5;
  const currentPage = Number(searchParams.get("page")) || 1;
  const filterStatus = searchParams.get("status") || "All";

  const [bookings, setBookings] = useState([]);

  console.log("booking", bookings);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewedBookings, setReviewedBookings] = useState([]);

  const { data, isLoading, error } = useFetch("/user-booking");

  useEffect(() => {
    if (data) {
      setBookings(Array.isArray(data?.data?.data) ? data?.data?.data : []);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        Failed to sync with server. Please try again.
      </div>
    );

  const filteredBookings =
    filterStatus !== "All"
      ? bookings.filter(
          (b) => b.booking_status.toLowerCase() === filterStatus.toLowerCase(),
        )
      : bookings;

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    router.push(`?page=${page}&status=${filterStatus}`);
  };

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    accepted: "bg-emerald-50 text-green-00 border-emerald-100",
    rejected: "bg-rose-50 text-red-700 border-rose-100",
    completed: "bg-rose-50 text-green-700 border-rose-100",
  };

  // Helper to format dates from your specific JSON structure
  const formatBookingDates = (dateString) => {
    try {
      const dates = JSON.parse(dateString);
      if (dates.length === 1) return dates[0];
      if (dates.length > 1) return `${dates[0]} to ${dates[dates.length - 1]}`;
      return "N/A";
    } catch (e) {
      return dateString || "N/A";
    }
  };

  return (
    <div className="p-6  mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Booking History
          </h1>
          <p className="text-sm text-gray-500">
            Manage and track your Booking history.
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Filter:</span>
          <Select
            value={filterStatus}
            onValueChange={(v) => router.push(`?page=1&status=${v}`)}
          >
            <SelectTrigger className="w-40 bg-white border-gray-200 shadow-sm focus:ring-primary">
              <SelectValue placeholder="All Bookings" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="pending">pending</SelectItem>
                <SelectItem value="accepted">accepted</SelectItem>
                <SelectItem value="rejected">rejected</SelectItem>
                <SelectItem value="approved">completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patient Details
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Specialist
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText size={48} strokeWidth={1} className="mb-2" />
                      <p>No booking records found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentBookings.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {row.patient_name}
                          </p>
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            Age: {row.patient_age} • {row.patient_gender}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Specialist */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">
                          {row.specialist?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar size={14} className="text-gray-400" />
                          {formatBookingDates(row.selected_dates_or_months)}
                        </div>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md w-fit italic">
                          {row.booking_type} rate
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">
                        KSh {row.booking_amount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between gap-2">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            statusStyles[row.booking_status.toLowerCase()] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
                          {row.booking_status.charAt(0).toUpperCase() +
                            row.booking_status.slice(1)}
                        </span>

                        {row.booking_status.toLowerCase() === "completed" &&
                          (reviewedBookings.includes(row.id) ? (
                            <Button
                              size="sm"
                              
                              className="h-8 px-3 text-xs cursor-not-allowed"
                            >
                             Already Reviewed
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="h-8 px-3 text-xs"
                              onClick={() => {
                                setSelectedBooking(row);
                                setIsReviewOpen(true);
                              }}
                            >
                              Leave Review
                            </Button>
                          ))}
                      </div>
                    </td>

                    <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Leave a Review</DialogTitle>
                          <DialogDescription>
                            Share your experience with{" "}
                            <span className="font-medium">
                              {selectedBooking?.specialist?.name}
                            </span>
                          </DialogDescription>
                        </DialogHeader>

                        {/* Rating */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Rating (1 – 5)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm"
                          />
                        </div>

                        {/* Review Message */}
                        <div className="space-y-2 mt-4">
                          <label className="text-sm font-medium">Message</label>
                          <Textarea
                            placeholder="Write your review..."
                            value={reviewMessage}
                            onChange={(e) => setReviewMessage(e.target.value)}
                          />
                        </div>

                        <DialogFooter className="mt-6">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsReviewOpen(false);
                              setRating(5);
                              setReviewMessage("");
                            }}
                          >
                            Cancel
                          </Button>

                          <Button
                            disabled={isSubmittingReview}
                            onClick={async () => {
                              if (!reviewMessage.trim()) {
                                toast.error("Please write a review message.");
                                return;
                              }

                              try {
                                setIsSubmittingReview(true);

                                const payload = {
                                  booking_id: selectedBooking?.id,
                                  specialist_id: selectedBooking?.specialist_id,
                                  rating: Number(rating),
                                  review: reviewMessage.trim(),
                                };

                                await postApi("/review", payload);

                                setReviewedBookings((prev) => [
                                  ...prev,
                                  selectedBooking.id,
                                ]);

                                toast.success("Review submitted successfully!");

                                setIsReviewOpen(false);
                                setRating(5);
                                setReviewMessage("");
                                setSelectedBooking(null);
                              } catch (err) {
                                console.error("Review error:", err);
                                toast.error("Failed to submit review.");
                              } finally {
                                setIsSubmittingReview(false);
                              }
                            }}
                          >
                            {isSubmittingReview
                              ? "Submitting..."
                              : "Submit Review"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Actions */}
                    {/* <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => router.push(`/dashboard/bookings/${row.id}`)}
                        className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg transition-all text-gray-400 hover:text-primary group-hover:text-blue-600"
                      >
                        <Eye size={18} />
                      </button>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Premium Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredBookings.length)}
              </span>{" "}
              of <span className="font-medium">{filteredBookings.length}</span>{" "}
              bookings
            </p>
            <Pagination className="m-0 w-auto">
              <PaginationContent>
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious
                    onClick={() => goToPage(currentPage - 1)}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem
                    key={i}
                    className="cursor-pointer hidden sm:block"
                  >
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => goToPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem className="cursor-pointer">
                  <PaginationNext onClick={() => goToPage(currentPage + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
