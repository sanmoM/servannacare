"use client";
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
import { useFetch } from "@/hooks/useFetch";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const PaymentHistoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 4;
  const currentPage = Number(searchParams.get("page")) || 1;
  const filterStatus = searchParams.get("status") || "All";


  const { data, isLoading } = useFetch("/user-payment");
  

  const rawPayments = data?.data?.payments || [];

  
  const filteredPayments =
    filterStatus !== "All"
      ? rawPayments.filter((p) => p.payment_status?.toLowerCase() === filterStatus.toLowerCase())
      : rawPayments;

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentPayments = filteredPayments.slice(
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
    pending: "bg-amber-500",
    paid: "bg-green-500",
    failed: "bg-red-500",
  };

  if (isLoading) return <div className="p-10 text-center">Loading History...</div>;

  return (
    <div>
      <h1 className="sectionHeading text-2xl font-bold mb-4">Payment History</h1>

      <div className="flex justify-end mb-4">
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 overflow-x-auto w-full border rounded-xl shadow">
        <table className="min-w-[800px] w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr className="text-xs sm:text-sm lg:text-base">
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Service/Plan</th>
              <th className="px-6 py-4 font-semibold">Amount (KES)</th>
              <th className="px-6 py-4 font-semibold">Method</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Reference ID</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((row) => (
                <tr key={row.id} className="bg-white border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Formatting the ISO date to readable string */}
                    {new Date(row.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {row.plan_type}
                  </td>
                  <td className="px-6 py-4">
                    {row.amount}
                  </td>
                  <td className="px-6 py-4 uppercase">
                    {row.payment_method}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        statusColors[row.payment_status?.toLowerCase()] || "bg-gray-400"
                      } text-white px-3 py-1 rounded-full text-xs font-semibold capitalize`}
                    >
                      {row.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {/* Show transaction_id, if null show checkout_request_id */}
                    {row.transaction_id || row.checkout_request_id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        {totalPages > 1 && (
          <Pagination className="flex justify-center md:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  onClick={() => goToPage(currentPage - 1)}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    className="cursor-pointer"
                    isActive={currentPage === i + 1}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  onClick={() => goToPage(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;