import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const page = () => {
  const bookingHistory = [
    {
      id: 1,
      serviceName: "Nurse Care",
      specialist: "Jassy Jea",
      bookingDate: "15 Jan 2024",
      startDate: "23 Jan 2024",
      endDate: "10 Feb 2024",
      totalDays: 18,
      status: "Pending",
      amountPaid: "KSh 25,000",
    },
    {
      id: 2,
      serviceName: "Elderly Assistance",
      specialist: "Maria Simon",
      bookingDate: "25 Jan 2024",
      startDate: "01 Feb 2024",
      endDate: "12 Feb 2024",
      totalDays: 11,
      status: "Completed",
      amountPaid: "KSh 15,000",
    },
    {
      id: 3,
      serviceName: "Medical Nurse",
      specialist: "Kelvin Mark",
      bookingDate: "05 Jan 2024",
      startDate: "10 Jan 2024",
      endDate: "20 Jan 2024",
      totalDays: 10,
      status: "Ongoing",
      amountPaid: "KSh 20,000",
    },
    {
      id: 4,
      serviceName: "Home Care Support",
      specialist: "Sofia Rahman",
      bookingDate: "30 Jan 2024",
      startDate: "05 Feb 2024",
      endDate: "15 Feb 2024",
      totalDays: 10,
      status: "Cancelled",
      amountPaid: "KSh 1200",
    },
    {
      id: 5,
      serviceName: "Post-Surgery Assistance",
      specialist: "David Kim",
      bookingDate: "10 Mar 2024",
      startDate: "12 Mar 2024",
      endDate: "22 Mar 2024",
      totalDays: 10,
      status: "Pending",
      amountPaid: "KSh 30,000",
    },
    {
      id: 6,
      serviceName: "Pediatric Care",
      specialist: "Anna Lee",
      bookingDate: "15 Mar 2024",
      startDate: "18 Mar 2024",
      endDate: "25 Mar 2024",
      totalDays: 7,
      status: "Completed",
      amountPaid: "KSh 18,000",
    },
    {
      id: 7,
      serviceName: "Physiotherapy",
      specialist: "Mark Anthony",
      bookingDate: "20 Mar 2024",
      startDate: "01 Apr 2024",
      endDate: "10 Apr 2024",
      totalDays: 9,
      status: "Pending",
      amountPaid: "KSh 22,000",
    },
  ];

  const statusColors = {
    Pending: "bg-amber-300",
    Completed: "bg-green-300",
    Ongoing: "bg-blue-300",
    Cancelled: "bg-red-300",
  };

  return (
    <div>
      <h1 className="sectionHeading">Booking History</h1>

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

      <div className="mt-6 overflow-x-auto w-full">
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
                Booked At
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
                Amount (KSh)
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {bookingHistory.map((row) => (
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
                  {row.bookingDate}
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
                  {row.amountPaid}
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

export default page;
