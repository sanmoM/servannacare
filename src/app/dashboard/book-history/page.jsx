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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Calendar as CalendarIcon,
  User,
  Stethoscope,
  FileText,
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

const BookingHistoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemsPerPage = 5;
  const currentPage = Number(searchParams.get("page")) || 1;
  const filterStatus = searchParams.get("status") || "All";

  const [bookings, setBookings] = useState([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Local state to instantly disable button before re-fetch completes
  const [justReviewed, setJustReviewed] = useState([]);

  // Destructure mutate to refresh data after posting a review
  const { data, isLoading, error, mutate } = useFetch("/user-booking");

  useEffect(() => {
    if (data) {
      setBookings(Array.isArray(data?.data?.data) ? data?.data?.data : []);
    }
  }, [data]);

  const getSelectedDates = (dateData, bookingType) => {
    if (!dateData) return [];
    let parsed;
    try {
      parsed = typeof dateData === "string" ? JSON.parse(dateData) : dateData;
    } catch (e) {
      return [];
    }

    if (bookingType === "daily") {
      return Array.isArray(parsed) ? parsed.map((d) => new Date(d)) : [];
    }

    if (bookingType === "monthly") {
      if (parsed[0]?.dates) {
        return parsed.flatMap((item) => item.dates.map((d) => new Date(d)));
      }
      return Array.isArray(parsed) ? parsed.map((d) => new Date(d)) : [];
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
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rejected: "bg-rose-50 text-red-700 border-rose-100",
    completed: "bg-blue-50 text-green-700 border-blue-100",
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
          <p className="text-sm text-gray-500">
            Manage and track your history.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Filter:</span>
          <Select
            value={filterStatus}
            onValueChange={(v) => router.push(`?page=1&status=${v}`)}
          >
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Specialist
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Schedule
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <FileText className="mx-auto mb-2" />
                    No records found.
                  </td>
                </tr>
              ) : (
                currentBookings.map((row) => {
                  const selectedDates = getSelectedDates(
                    row.selected_dates_or_months,
                    row.booking_type,
                  );

                  // Logic to check if review is already done
                  const isAlreadyReviewed =
                    row.review_count > 0 || justReviewed.includes(row.id);

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {row.patient_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Age: {row.patient_age} • {row.patient_gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">
                            {row.specialist?.name || "Unassigned"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <CalendarIcon
                                size={14}
                                className="text-gray-400"
                              />
                              <span className="max-w-[150px] truncate block">
                                {row.booking_type === "monthly"
                                  ? "Monthly Plan"
                                  : "Daily Plan"}
                              </span>
                            </div>
                            <span className="text-[10px] bg-blue-50 text-primary px-2 py-0.5 rounded-md font-bold uppercase">
                              {row.booking_type}
                            </span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-blue-200 rounded-lg shadow-sm transition-all cursor-pointer">
                                <Eye size={16} />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>Booking Dates</DialogTitle>
                                <DialogDescription>
                                  Selected dates for {row.patient_name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-center py-4">
                                <Calendar
                                  mode="multiple"
                                  selected={selectedDates}
                                  defaultMonth={selectedDates[0] || new Date()}
                                  className="rounded-md border shadow"
                                  onSelect={() => {}}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        KSh {row.booking_amount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyles[row.booking_status.toLowerCase()] || "bg-gray-100"}`}
                          >
                            {row.booking_status}
                          </span>

                          {row.booking_status.toLowerCase() === "completed" &&
                            (isAlreadyReviewed ? (
                              // Button shown AFTER review is done (No handler, purely visual)
                              <Button
                                variant="outline"
                                size="sm"
                                // disabled
                                className="h-8 px-3 text-xs cursor-pointer"
                              >
                                Reviewed
                              </Button>
                            ) : (
                              // Button shown BEFORE review
                              <Button
                                size="sm"
                                className="h-8 px-3 text-xs cursor-pointer"
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <p className="text-sm text-gray-500">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Rating (1 – 5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

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

                  // Update local state to disable button immediately
                  setJustReviewed((prev) => [...prev, selectedBooking.id]);

                  // Refresh server data to sync 'review_count'
                  mutate();

                  toast.success("Review submitted successfully!");
                  setIsReviewOpen(false);
                  setRating(5);
                  setReviewMessage("");
                  setSelectedBooking(null);
                } catch (err) {
                  toast.error("Failed to submit review.");
                } finally {
                  setIsSubmittingReview(false);
                }
              }}
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingHistoryPage;
