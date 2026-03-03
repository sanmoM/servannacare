"use client";
import LoadingSpinner from "@/components/shared/LoadingSpin";
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

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 5;
  const currentPage = Number(searchParams.get("page")) || 1;
  const filterStatus = searchParams.get("status") || "All";

  const { data, isLoading } = useFetch("/subscription-payment");

  const rawPayments = data?.data?.payments || [];

  const filteredPayments =
    filterStatus !== "All"
      ? rawPayments.filter(
          (p) => p.payment_status?.toLowerCase() === filterStatus.toLowerCase(),
        )
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
    completed: "bg-blue-500",
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="">
      <h1 className="sectionHeading text-2xl font-bold mb-4">
        Payment History
      </h1>

      <div className="flex justify-end mb-4">
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto w-full border rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Plan Type</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Method</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">
                Transaction / Request ID
              </th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium">{row.plan_type}</td>
                  <td className="px-6 py-4">
                    {row.currency} {row.amount}
                  </td>
                  <td className="px-6 py-4 uppercase">{row.payment_method}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        statusColors[row.payment_status] || "bg-gray-400"
                      } text-white px-3 py-1 rounded-full text-xs font-medium capitalize`}
                    >
                      {row.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {row.transaction_id || row.checkout_request_id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6 flex justify-center md:justify-end">
          <PaginationContent>
            <PaginationPrevious
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            />
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
            <PaginationNext
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              onClick={() =>
                currentPage < totalPages && goToPage(currentPage + 1)
              }
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaymentPage;
