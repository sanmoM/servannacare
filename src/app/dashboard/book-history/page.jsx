"use client";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
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
import { useRouter, useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import LoadingSpinner from "@/components/shared/LoadingSpin";

const BookingHistoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemsPerPage = 5;
  const currentPage = Number(searchParams.get("page")) || 1;
  const filterStatus = searchParams.get("status") || "All";

  const [bookings, setBookings] = useState([]);
  console.log("bookings", bookings);
  const { data, isLoading, error } = useFetch("/user-booking");
  console.log("data", data);
  useEffect(() => {
    if (data) {
   
      setBookings(Array.isArray(data?.data?.data) ? data?.data?.data : []);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading data</div>;

  // Filter bookings by status
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
    router.push(`?page=${page}&status=${filterStatus}`);
  };

  const onFilterChange = (value) => {
    router.push(`?page=1&status=${value}`);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-4">
      <h1 className="sectionHeading mb-4">Booking History</h1>

      {/* Filter */}
      <div className="flex justify-end mb-4">
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter By Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[900px] w-full table-auto text-sm text-left text-gray-700 border rounded-xl shadow-md divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-xs sm:text-sm lg:text-base font-semibold text-gray-700">
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Specialist</th>
              <th className="px-6 py-3">Care Start</th>
              <th className="px-6 py-3">Care End</th>
              <th className="px-6 py-3">Total Days</th>
              <th className="px-6 py-3">Amount (KSh)</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              currentBookings.map((row) => {
                const start = new Date(row.care_start_date);
                const end = new Date(row.care_end_date);
                const totalDays = Math.ceil(
                  (end - start) / (1000 * 60 * 60 * 24) + 1,
                );

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="font-medium">{row.patient_name}</div>
                      <div className="text-gray-500 text-xs">
                        Age: {row.patient_age}, {row.patient_gender}
                      </div>
                    </td>

                    {/* Specialist */}
                    <td className="px-6 py-4">{row.specialist?.name}</td>

                    {/* Dates */}
                    <td className="px-6 py-4">{row.care_start_date}</td>
                    <td className="px-6 py-4">{row.care_end_date}</td>
                    <td className="px-6 py-4">{totalDays}</td>

                    {/* Amount */}
                    <td className="px-6 py-4">{row.booking_amount}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[row.booking_status.toLowerCase()] ||
                          "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {row.booking_status.charAt(0).toUpperCase() +
                          row.booking_status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6 flex justify-center md:justify-end">
            <PaginationContent>
              <PaginationPrevious
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationLink
                  key={i}
                  isActive={currentPage === i + 1}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              ))}
              <PaginationNext
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              />
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
