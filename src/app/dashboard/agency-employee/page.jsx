import { Button } from "@/components/ui/button";
import { CheckCircle, ClipboardList, Clock, Plus, UserLock, UserRoundCheck, UserRoundCog, UsersRound } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="mb-10">
        <h1 className="sectionHeading">All Employee</h1>
        
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="border  sm:max-w-[300px] w-full bg-purple-300 flex gap-4 overflow-hidden items-center rounded-md ">
          <div className="bg-purple-600">
            <UsersRound
              className="w-full text-white h-full p-4"
              size={"40"}
            />
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
            <UserRoundCheck className="w-full text-white h-full p-4" size={"40"} />
          </div>
          <div className="text-white">
            <h2 className="font-semibold  mb-1 text-sm">In Work</h2>
            <span className="text-2xl  font-semibold">5</span>
          </div>
        </div>
        <div className="border sm:max-w-[300px] w-full bg-green-300 flex gap-4 overflow-hidden items-center rounded-md ">
          <div className="bg-green-600">
            <UserRoundCog className="w-full text-white h-full p-4" size={"40"} />
          </div>
          <div className="text-white">
            <h2 className="font-semibold  mb-1 text-sm">Available </h2>
            <span className="text-2xl  font-semibold">12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
