"use client";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 8;
  const currentPage = Number(searchParams.get("page")) || 1;
  const filterStatus = searchParams.get("status") || "All";

  const appointments = [
    {
      id: 1,
      serviceName: "Nurse Care",
      specialist: "Jassy Jea",
      startDate: "01 Jan 2025",
      endDate: "05 Jan 2025",
      totalDays: "4 Days",
      status: "Pending",
    },
    {
      id: 2,
      serviceName: "Elderly Assistance",
      specialist: "Maria Simon",
      startDate: "02 Jan 2025",
      endDate: "06 Jan 2025",
      totalDays: "4 Days",
      status: "Completed",
    },
    {
      id: 3,
      serviceName: "Medical Nurse",
      specialist: "Kelvin Mark",
      startDate: "03 Jan 2025",
      endDate: "07 Jan 2025",
      totalDays: "4 Days",
      status: "Ongoing",
    },
    {
      id: 4,
      serviceName: "Home Care Support",
      specialist: "Sofia Rahman",
      startDate: "04 Jan 2025",
      endDate: "08 Jan 2025",
      totalDays: "4 Days",
      status: "Cancelled",
    },
    {
      id: 5,
      serviceName: "Nurse Care",
      specialist: "Emma Brown",
      startDate: "05 Jan 2025",
      endDate: "09 Jan 2025",
      totalDays: "4 Days",
      status: "Completed",
    },
    {
      id: 6,
      serviceName: "Elderly Assistance",
      specialist: "Liam Scott",
      startDate: "06 Jan 2025",
      endDate: "10 Jan 2025",
      totalDays: "4 Days",
      status: "Pending",
    },
    {
      id: 7,
      serviceName: "Medical Nurse",
      specialist: "Noah Davis",
      startDate: "07 Jan 2025",
      endDate: "11 Jan 2025",
      totalDays: "4 Days",
      status: "Completed",
    },
    {
      id: 8,
      serviceName: "Home Care Support",
      specialist: "Olivia Wilson",
      startDate: "08 Jan 2025",
      endDate: "12 Jan 2025",
      totalDays: "4 Days",
      status: "Ongoing",
    },
    {
      id: 9,
      serviceName: "Nurse Care",
      specialist: "Jassy Jea",
      startDate: "09 Jan 2025",
      endDate: "13 Jan 2025",
      totalDays: "4 Days",
      status: "Cancelled",
    },
    {
      id: 10,
      serviceName: "Elderly Assistance",
      specialist: "Maria Simon",
      startDate: "10 Jan 2025",
      endDate: "14 Jan 2025",
      totalDays: "4 Days",
      status: "Ongoing",
    },
    {
      id: 11,
      serviceName: "Medical Nurse",
      specialist: "Kelvin Mark",
      startDate: "11 Jan 2025",
      endDate: "15 Jan 2025",
      totalDays: "4 Days",
      status: "Pending",
    },
    {
      id: 12,
      serviceName: "Home Care Support",
      specialist: "Sofia Rahman",
      startDate: "12 Jan 2025",
      endDate: "16 Jan 2025",
      totalDays: "4 Days",
      status: "Completed",
    },
    {
      id: 13,
      serviceName: "Nurse Care",
      specialist: "Emma Brown",
      startDate: "13 Jan 2025",
      endDate: "17 Jan 2025",
      totalDays: "4 Days",
      status: "Ongoing",
    },
    {
      id: 14,
      serviceName: "Elderly Assistance",
      specialist: "Liam Scott",
      startDate: "14 Jan 2025",
      endDate: "18 Jan 2025",
      totalDays: "4 Days",
      status: "Cancelled",
    },
    {
      id: 15,
      serviceName: "Medical Nurse",
      specialist: "Noah Davis",
      startDate: "15 Jan 2025",
      endDate: "19 Jan 2025",
      totalDays: "4 Days",
      status: "Completed",
    },
    {
      id: 16,
      serviceName: "Home Care Support",
      specialist: "Olivia Wilson",
      startDate: "16 Jan 2025",
      endDate: "20 Jan 2025",
      totalDays: "4 Days",
      status: "Pending",
    },
  ];

  const filteredAppointments =
    filterStatus !== "All"
      ? appointments.filter((a) => a.status === filterStatus)
      : appointments;

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentAppointments = filteredAppointments.slice(
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
    Pending: "bg-amber-500",
    Completed: "bg-green-600",
    Ongoing: "bg-blue-600",
    Cancelled: "bg-red-600",
  };

  const handleCancel = (id) => {
    toast.error(`Appointment cancelled with id: ${id}`);
  };

  return (
    <div>
      <h1 className="sectionHeading mb-6">Your Appointment</h1>
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
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-x-auto w-full">
        <table className="min-w-[700px] w-full text-sm text-left text-gray-700 border rounded-xl shadow">
          <thead className="bg-gray-100 border-b">
            <tr className="text-xs sm:text-sm lg:text-base">
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                ids
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Service Name
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Specialist Name
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Start Date
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                End Date
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Total Days
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Status
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {currentAppointments.map((row) => (
              <tr
                key={row.id}
                className="bg-white border-b hover:bg-gray-50 transition text-xs sm:text-sm lg:text-base"
              >
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.id}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.serviceName}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.specialist}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.startDate}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.endDate}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.totalDays}
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
                  {row.status === "Pending" || row.status === "Ongoing" ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="px-4 py-1 text-sm bg-red-500 cursor-pointer hover:bg-red-400 text-white rounded-md transition">
                          Cancel
                        </button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Are you sure?
                          </DialogTitle>
                          <DialogDescription className="text-center" />
                        </DialogHeader>

                        <h2 className="text-sm text-gray-700 font-semibold">
                          Do you want cancel Appointment with{" "}
                          <span className="font-bold">{row.specialist}</span>?
                        </h2>

                        <DialogFooter className="mt-6">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Cancel
                            </Button>
                          </DialogClose>

                          <DialogClose asChild>
                            <Button
                              type="button"
                              onClick={() => handleCancel(row.id)}
                            >
                              Confirm
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <span className="text-gray-400 italic text-sm">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6">
          {totalPages > 1 && (
            <Pagination className="mt-6 flex justify-end">
              <PaginationContent>
                <PaginationPrevious
                  disabled={currentPage === 1}
                  onClick={() => goToPage(Math.max(currentPage - 1, 1))}
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
                  onClick={() =>
                    goToPage(Math.min(currentPage + 1, totalPages))
                  }
                />
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
