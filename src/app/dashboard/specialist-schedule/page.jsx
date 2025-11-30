import { CheckCircle, Clock } from "lucide-react";
import React from "react";

const page = () => {
  const scheduleData = [
    {
      id: 1,
      client: "John Mwangi",
      service: "Home Nursing",
      date: "15 Feb 2025",
      location: "Nairobi, Westlands",
      totalDays: 3,
      status: "Upcoming",
    },
    {
      id: 2,
      client: "Sarah Njeri",
      service: "Elderly Care",
      date: "13 Feb 2025",
      location: "Nairobi, Karen",
      totalDays: 1,
      status: "Completed",
    },
    {
      id: 3,
      client: "Michael Otieno",
      service: "Physical Therapy",
      date: "12 Feb 2025",
      location: "Nairobi, Kasarani",
      totalDays: 2,
      status: "Active",
    },
    {
      id: 4,
      client: "Grace Wanjiku",
      service: "Post-Surgery Care",
      date: "18 Feb 2025",
      location: "Nairobi, Parklands",
      totalDays: 5,
      status: "Upcoming",
    },
    {
      id: 5,
      client: "Peter Kariuki",
      service: "Child Care",
      date: "10 Feb 2025",
      location: "Nairobi, Lang'ata",
      totalDays: 1,
      status: "Upcoming",
    },
    {
      id: 6,
      client: "Lucy Mburu",
      service: "Home Assistance",
      date: "11 Feb 2025",
      location: "Nairobi, South B",
      totalDays: 2,
      status: "Completed",
    },
  ];

  const statusColors = {
    Upcoming: "bg-amber-300",
    Completed: "bg-green-300",
    Ongoing: "bg-blue-300",
    Cancelled: "bg-red-300",
    Active:"bg-blue-300"
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="sectionHeading">My Schedule</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Manage your schedule efficiently</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="border  sm:max-w-[300px] w-full bg-amber-300 flex gap-4 overflow-hidden items-center rounded-md ">
          <div className="bg-yellow-600">
            <Clock className="w-full text-white h-full p-4" size={"40"} />
          </div>
          <div className="text-white">
            <h2 className="font-semibold  mb-1 text-sm">Upcoming</h2>
            <span className="text-2xl  font-semibold">4</span>
          </div>
        </div>
        <div className="border sm:max-w-[300px] w-full bg-blue-300 flex gap-4 overflow-hidden items-center rounded-md ">
          <div className="bg-blue-600">
            <CheckCircle className="w-full text-white h-full p-4" size={"40"} />
          </div>
          <div className="text-white">
            <h2 className="font-semibold  mb-1 text-sm">Active</h2>
            <span className="text-2xl  font-semibold">1</span>
          </div>
        </div>
        <div className="border sm:max-w-[300px] w-full bg-green-300 flex gap-4 overflow-hidden items-center rounded-md ">
          <div className="bg-green-600">
            <CheckCircle className="w-full text-white h-full p-4" size={"40"} />
          </div>
          <div className="text-white">
            <h2 className="font-semibold  mb-1 text-sm">Compleate</h2>
            <span className="text-2xl  font-semibold">12</span>
          </div>
        </div>
      </div>

      <div className=" overflow-x-auto mt-12 w-full">
        <table className="min-w-[700px] w-full text-sm text-left text-gray-700 border rounded-xl shadow">
          <thead className="bg-gray-100 border-b">
            <tr className="text-xs sm:text-sm lg:text-base">
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                #
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Client Name
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Date
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Total Days
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                location
              </th>
              <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {scheduleData.map((row, indx) => (
              <tr
                key={row.id}
                className="bg-white border-b hover:bg-gray-50 transition text-xs sm:text-sm lg:text-base"
              >
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {indx + 1}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.client}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.date}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.totalDays}
                </td>
                <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                  {row.location}
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
      </div>
    </div>
  );
};

export default page;
