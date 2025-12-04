import { Button } from "@/components/ui/button";

import {
  CheckCircle,
  ClipboardList,
  Clock,
  Edit,
  Eye,
  Plus,
  Trash,
  UserLock,
  UserRoundCheck,
  UserRoundCog,
  UsersRound,
} from "lucide-react";
import React from "react";

const page = () => {
  const employee = [
  {
    id: 1,
    name: "John Williams",
    role: "Housekeeper",
    location: "Dhaka",
    status: "Booked",
  },
  {
    id: 2,
    name: "Sarah Ahmed",
    role: "Nanny",
    location: "Chittagong",
    status: "Available",
  },
  {
    id: 3,
    name: "Mahfuz Rahman",
    role: "Housekeeper",
    location: "Khulna",
    status: "Work",
  },
  {
    id: 4,
    name: "Ayesha Khan",
    role: "Nanny",
    location: "Sylhet",
    status: "Booked",
  },
  {
    id: 5,
    name: "Jamal Uddin",
    role: "Housekeeper",
    location: "Dhaka",
    status: "Available",
  },
  {
    id: 6,
    name: "Nadia Islam",
    role: "Nanny",
    location: "Rajshahi",
    status: "Work",
  },
];


  const statusColors = {
    Booked: "bg-amber-300",
    Available: "bg-green-300",
    Work: "bg-blue-300",
  };
  return (
    <div>
      <div className="mb-10">
        <h1 className="sectionHeading">All Employee</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="border  sm:max-w-[300px] w-full bg-purple-300 flex gap-4 overflow-hidden items-center rounded-md ">
          <div className="bg-purple-600">
            <UsersRound className="w-full text-white h-full p-4" size={"40"} />
          </div>
          <div className="text-white">
            <h2 className="font-semibold  mb-1 text-sm">Total</h2>
            <span className="text-2xl  font-semibold">43</span>
          </div>
        </div>
        <div className="border  sm:max-w-[300px] w-full bg-amber-300 flex gap-4 overflow-hidden items-center rounded-md ">
          <div className="bg-yellow-600">
            <UserLock className="w-full text-white h-full p-4" size={"40"} />
          </div>
          <div className="text-white">
            <h2 className="font-semibold  mb-1 text-sm">Upcoming Booked</h2>
            <span className="text-2xl  font-semibold">4</span>
          </div>
        </div>
        <div className="border sm:max-w-[300px] w-full bg-blue-300 flex gap-4 overflow-hidden items-center rounded-md ">
          <div className="bg-blue-600">
            <UserRoundCheck
              className="w-full text-white h-full p-4"
              size={"40"}
            />
          </div>
          <div className="text-white">
            <h2 className="font-semibold  mb-1 text-sm">In Work</h2>
            <span className="text-2xl  font-semibold">5</span>
          </div>
        </div>
        <div className="border sm:max-w-[300px] w-full bg-green-300 flex gap-4 overflow-hidden items-center rounded-md ">
          <div className="bg-green-600">
            <UserRoundCog
              className="w-full text-white h-full p-4"
              size={"40"}
            />
          </div>
          <div className="text-white">
            <h2 className="font-semibold  mb-1 text-sm">Available </h2>
            <span className="text-2xl  font-semibold">12</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-10">
        <Button>
          <Plus />
          Add Employee
        </Button>
      </div>
      <div>
        <div className="mt-6 overflow-x-auto w-full">
          <table className="min-w-[700px] w-full text-sm text-left text-gray-700 border rounded-xl shadow">
            <thead className="bg-gray-100 border-b">
              <tr className="text-xs sm:text-sm lg:text-base">
                <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                  No
                </th>
                <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                  Role
                </th>
                <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                  Location
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
              {employee.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white border-b hover:bg-gray-50 transition text-xs sm:text-sm lg:text-base"
                >
                  <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 lg:py-6 whitespace-nowrap">
                    {row.role}
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
                  <td className="px-6 space-x-2 py-4 lg:py-6 whitespace-nowrap">
                    <Button><Eye/></Button>
                    <Button className={"bg-green-500 hover:bg-green-400"}><Edit/></Button>
                    <Button className={"bg-red-500 hover:bg-red-400"}><Trash/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
