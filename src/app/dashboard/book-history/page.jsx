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
  const [justReviewed, setJustReviewed] = useState([]);

  const { data, isLoading, error, mutate } = useFetch("/user-booking");

  // console.log(data?.data?.data);

  useEffect(() => {
    if (data) {
      const fetchedBookings = Array.isArray(data?.data?.data)
        ? data?.data?.data
        : [];
      setBookings(fetchedBookings);
    }
  }, [data]);

  const getSelectedDates = (dateData) => {
    if (!dateData || !Array.isArray(dateData)) return [];

    return dateData.flatMap((item) => item.dates.map((d) => new Date(d)));
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500">
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

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rejected: "bg-rose-50 text-red-700 border-rose-100",
    completed: "bg-green-50 text-green-700 border-green-100",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Booking History
          </h1>
          <p className="text-sm text-gray-500">
            Track your service requests and schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Filter:</span>
          <Select
            value={filterStatus}
            onValueChange={(v) => router.push(`?page=1&status=${v}`)}
          >
            <SelectTrigger className="w-full sm:w-40 bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

     
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Service/Recipient
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
                    <FileText className="mx-auto mb-2 opacity-20" size={40} />
                    No records found.
                  </td>
                </tr>
              ) : (
                currentBookings.map((row) => {
                  const dates = getSelectedDates(row.selected_dates_or_months);
                  const isAlreadyReviewed =
                    row.review_count > 0 || justReviewed.includes(row.id);
                  const isHouseManager =
                    row.specialist_type === "house-manager";

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 rounded-full bg-green-50 flex items-center justify-center text-primary">
                            {isHouseManager ? (
                              <Home size={18} />
                            ) : (
                              <User size={18} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-none mb-1">
                              {isHouseManager
                                ? "Home Care"
                                : row.patient_name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {isHouseManager
                                ? `${row.home_type || ""} • ${row.home_size || ""}`
                                : `Age: ${row.patient_age || "N/A"} • ${row.patient_gender || ""}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {row.specialist?.name || row.specialist?.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="text-sm font-medium block capitalize">
                              {row.booking_type} Plan
                            </span>
                            <span className="text-[10px] text-gray-400 italic">
                              {dates.length} days selected
                            </span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-primary cursor-pointer"
                              >
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>Selected Dates</DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center p-2">
                                <Calendar
                                  mode="multiple"
                                  selected={dates}
                                  defaultMonth={dates[0] || new Date()}
                                  className="rounded-md border"
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
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusStyles[row.booking_status.toLowerCase()] || "bg-gray-100"}`}
                          >
                            {row.booking_status}
                          </span>
                          {row.booking_status.toLowerCase() === "completed" &&
                            (isAlreadyReviewed ? (
                              <Button
                                className={"cursor-pointer"}
                                variant="outline"
                                disabled
                              >
                                Reviewed
                              </Button>
                            ) : (
                              <Button
                                className={"cursor-pointer"}
                                onClick={() => handleOpenReview(row)}
                              >
                                Leave Review
                              </Button>
                            ))}
                          {row.specialist_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer border-primary text-primary hover:bg-primary hover:text-white"
                              onClick={() =>
                                router.push(
                                  `/dashboard/user-inbox?specialistId=${row.specialist_id}`,
                                )
                              }
                            >
                              <MessageSquare size={14} className="mr-2" />
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
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
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

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedBooking?.specialist?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                placeholder="How was the service?"
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className={"cursor-pointer"}
              variant="outline"
              onClick={() => setIsReviewOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className={"cursor-pointer"}
              disabled={isSubmittingReview}
              onClick={handleReviewSubmit}
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
      toast.success("Review submitted!");
      setIsReviewOpen(false);
      setReviewMessage("");
    } catch (err) {
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    router.push(`?page=${page}&status=${filterStatus}`);
  }
};

export default BookingHistoryPage;
