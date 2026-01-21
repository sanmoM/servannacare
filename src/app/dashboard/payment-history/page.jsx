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
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 4;
  const currentPage = Number(searchParams.get("page")) || 1;
  const filterStatus = searchParams.get("status") || "All";

  const paymentHistory = [
    {
      id: 1,
      date: "25 Nov 2025",
      amount: 2500,
      method: "Bkash",
      status: "Paid",
      transactionId: "TXN-9834521",
    },
    {
      id: 2,
      date: "10 Jan 2025",
      amount: 1800,
      method: "Nagad",
      status: "Paid",
      transactionId: "TXN-8213409",
    },
    {
      id: 3,
      date: "25 Feb 2025",
      amount: 3200,
      method: "Bank Transfer",
      status: "Pending",
      transactionId: "TXN-7645123",
    },
    {
      id: 4,
      date: "16 Feb 2025",
      amount: 1500,
      method: "Rocket",
      status: "Paid",
      transactionId: "TXN-6542387",
    },
    {
      id: 5,
      date: "04 Mar 2025",
      amount: 2900,
      method: "Bkash",
      status: "Failed",
      transactionId: "TXN-5321098",
    },
  ];

  const filteredPayments =
    filterStatus !== "All"
      ? paymentHistory.filter((b) => b.status === filterStatus)
      : paymentHistory;

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
    Pending: "bg-amber-300",
    Paid: "bg-green-300",
    Failed: "bg-red-300",
  };

  return (
    <div>
      <h1 className="sectionHeading">Payment History</h1>

      <div className="flex justify-end">
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 overflow-x-auto w-full">
        <table className="min-w-[700px] w-full text-sm text-left text-gray-700 border rounded-xl shadow">
          <thead className="bg-gray-100 border-b">
            <tr className="text-xs sm:text-sm lg:text-base">
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Date
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Amount (KSh)
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Payment Method
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Status
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Transaction ID
              </th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.map((row) => (
              <tr
                key={row.id}
                className="bg-white border-b hover:bg-gray-50 transition text-xs sm:text-sm lg:text-base"
              >
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.date}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.amount}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.method}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  <span
                    className={`${
                      statusColors[row.status]
                    } text-white px-3 py-1 rounded-full text-xs sm:text-sm`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.transactionId}
                </td>
                {/* <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.totalDays}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.amountPaid}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6">
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
    </div>
  );
};

export default page;
