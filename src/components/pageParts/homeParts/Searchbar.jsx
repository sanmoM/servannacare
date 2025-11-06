import React from "react";
import { useState } from "react";
import {
  Calendar,
  Search,
  ChevronRight,
  ListChecks,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Searchbar = () => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("02/11/2025");
  const [checkOut, setCheckOut] = useState("03/11/2025");
  const [guests, setGuests] = useState("1 guest, 1 room");
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  return (
    <div data-aos="fade-up" className="w-full mx-auto my-8 md:!mt-0 -translate-y-1/2 z-[20] relative -mb-30 md:-mb-14  max-w-4xl">
      {/* Mobile View */}
      <div className="md:hidden mx-8 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
          {/* Category  */}
          <div className="flex items-center gap-3 pb-3 border-b">
            <ScrollText className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500  tracking-wide">
                Category
              </p>
              <Select>
                <SelectTrigger className="w-full cursor-pointer border-0 pl-0 shadow-none  ">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Check-in */}
          <div className="flex items-center gap-3 pb-3 border-b">
            <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Check in</p>
              <Input
                type="text"
                placeholder="DD/MM/YYYY"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border-0 p-0 text-sm font-semibold placeholder:text-gray-400 focus:ring-0"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="flex items-center gap-3 pb-3 border-b">
            <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Check out</p>
              <Input
                type="text"
                placeholder="DD/MM/YYYY"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border-0 p-0 text-sm font-semibold placeholder:text-gray-400 focus:ring-0"
              />
            </div>
          </div>
        </div>

        <Button className={"w-full rounded-full"} size={"lg"}>
          <Search className="w-5 h-5" />
          Search
        </Button>
      </div>


      {/* Desktop View */}
      <div  className="hidden md:flex bg-white rounded-full justify-between shadow-2xl p-4 items-center gap-2">
        {/* Category */}
        <div className="flex items-center gap-3">
          <ScrollText className="w-6 h-6 text-gray-600 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500  tracking-wide">
              Category
            </p>
            <Select>
              <SelectTrigger className="w-[150px] cursor-pointer border-0 pl-0 shadow-none  ">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

        {/* Check-in */}
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-gray-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Check in
            </p>
            <Input
              type="text"
              placeholder="DD/MM/YYYY"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border-0 p-0 text-base font-semibold placeholder:text-gray-400 focus:ring-0 bg-transparent"
            />
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 hidden xl:block" />
        </div>

        <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

        {/* Check-out */}
        <div className="flex items-center gap-3 ">
          <Calendar className="w-6 h-6 text-gray-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Check out
            </p>
            <Input
              type="text"
              placeholder="DD/MM/YYYY"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border-0 p-0 text-base font-semibold placeholder:text-gray-400 focus:ring-0 bg-transparent"
            />
          </div>
        </div>

        <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

        {/* Search Button */}
        <Button className={"rounded-full "} size={"lg"}>
          <Search className="w-7 h-7" />
          SEARCH
        </Button>
      </div>
    </div>
  );
};

export default Searchbar;
