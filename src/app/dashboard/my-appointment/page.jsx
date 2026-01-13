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

const Page = () => {
  const appointments = [
    {
      id: 1,
      serviceName: "Nurse Care",
      specialist: "Jassy Jea",
      startDate: "23 Jan 2024",
      endDate: "10 Feb 2024",
      totalDays: "18 Days",
      status: "Pending",
    },
    {
      id: 2,
      serviceName: "Elderly Assistance",
      specialist: "Maria Simon",
      startDate: "01 Feb 2024",
      endDate: "12 Feb 2024",
      totalDays: "11 Days",
      status: "Completed",
    },
    {
      id: 3,
      serviceName: "Medical Nurse",
      specialist: "Kelvin Mark",
      startDate: "10 Jan 2024",
      endDate: "20 Jan 2024",
      totalDays: "10 Days",
      status: "Ongoing",
    },
    {
      id: 4,
      serviceName: "Home Care Support",
      specialist: "Sofia Rahman",
      startDate: "05 Feb 2024",
      endDate: "15 Feb 2024",
      totalDays: "10 Days",
      status: "Cancelled",
    },
  ];

  // ✅ Use darker colors so white text looks good
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
      <div className={"flex justify-end"}>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
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
            {appointments.map((row) => (
              <tr
                key={row.id}
                className="bg-white border-b hover:bg-gray-50 transition text-xs sm:text-sm lg:text-base"
              >
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

        {/* ✅ Pagination */}
        <div className="mt-6">
          <Pagination className="flex justify-center md:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Page;
