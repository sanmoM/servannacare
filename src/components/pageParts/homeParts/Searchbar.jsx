"use client";

import React, { useRef, useState } from "react";
import { Calendar, Search, ChevronRight, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { serviceCategory } from "@/utilities/data";

const Searchbar = () => {
  const [category, setCategory] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(null);
  const router = useRouter();

  const today = startOfDay(new Date());


  const disabledCheckInDates = (date) => {
    return isBefore(date, today);
  };


  const disabledCheckOutDates = (date) => {
    if (!checkIn) return isBefore(date, today);
    return isBefore(date, startOfDay(checkIn));
  };

  const formatDate = (date) => {
    return date ? format(date, "dd/MM/yyyy") : "DD/MM/YYYY";
  };

  const handleSearch = () => {
    if (!category) {
      toast.error("Please select a category!");
      return;
    }
    if (!checkOut) {
      toast.error("Please select end date!");
      return;
    }

    const checkIN = format(checkIn, "dd-MM-yyyy");
    const checkOUT = format(checkOut, "dd-MM-yyyy");

    router.push(
      `/specialist?category=${category}&checkIn=${checkIN}&checkOut=${checkOUT}`,
    );
  };

  return (
    <div className="w-full mx-auto my-8 md:!mt-0 -translate-y-1/2 z-[20] relative -mb-30 md:-mb-14 max-w-4xl">
      {/* Mobile View */}
      <div className="md:hidden mx-8 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
          {/* Category */}
          <div className="flex items-center gap-3 pb-3 border-b">
            <ScrollText className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 tracking-wide">Category</p>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger className="w-full cursor-pointer outline-0 focus:outline-0 border-0 pl-0 shadow-none">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {serviceCategory.map((item, indx) => (
                      <SelectItem key={indx} value={item.value}>
                        {item.mainCategory}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-3 pb-3 border-b">
            <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Start Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="border-0 p-0 text-sm font-semibold text-gray-700 focus:ring-0 bg-transparent w-full text-left">
                    {formatDate(checkIn)}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={checkIn}
                    onSelect={(date) => {
                      setCheckIn(date);
                      // reset checkout if it's before new checkin
                      if (checkOut && isBefore(checkOut, date))
                        setCheckOut(null);
                    }}
                    disabled={disabledCheckInDates}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-center gap-3 pb-3">
            <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">End Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="border-0 p-0 text-sm font-semibold text-gray-700 focus:ring-0 bg-transparent w-full text-left">
                    {formatDate(checkOut)}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={disabledCheckOutDates}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <Button
          className={"w-full rounded-full"}
          size={"lg"}
          onClick={handleSearch}
        >
          <Search className="w-5 h-5" /> Search
        </Button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex bg-white rounded-full justify-between shadow-2xl p-4 items-center gap-2">
        {/* Category */}
        <div
          className="pl-6 cursor-pointer"
          onClick={() => setIsSelectOpen(true)}
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 tracking-wide">CATEGORY</p>
            <Select
              open={isSelectOpen}
              onOpenChange={(open) => setIsSelectOpen(open)}
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger className="w-full cursor-pointer outline-0 focus:outline-0 border-0 pl-0 shadow-none">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {serviceCategory.map((item, indx) => (
                    <SelectItem key={indx} value={item.value}>
                      {item.mainCategory}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

        {/* Start Date*/}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsCheckInOpen(true)}
        >
          <Calendar className="w-6 h-6 text-gray-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase mb-2 tracking-wide">
              Start Date
            </p>
            <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
              <PopoverTrigger asChild>
                <button className="border-0 p-0 text-base cursor-pointer font-semibold text-gray-700 text-sm focus:ring-0 bg-transparent w-full text-left">
                  {formatDate(checkIn)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={checkIn}
                  onSelect={(date) => {
                    setCheckIn(date);
                    if (checkOut && isBefore(checkOut, date)) setCheckOut(null);
                    setIsCheckInOpen(false); // close after selecting date
                  }}
                  disabled={disabledCheckInDates}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 hidden xl:block" />
        </div>

        <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

        {/* Date End */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsCheckOutOpen(true)}
        >
          <Calendar className="w-6 h-6 text-gray-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs mb-2 text-gray-500 uppercase tracking-wide">
              Date End
            </p>
            <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
              <PopoverTrigger asChild>
                <button className="border-0 cursor-pointer p-0 text-base font-semibold text-gray-700 text-sm focus:ring-0 bg-transparent w-full text-left">
                  {formatDate(checkOut)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={checkOut}
                  onSelect={(date) => {
                    setCheckOut(date);
                    setIsCheckOutOpen(false);
                  }}
                  disabled={disabledCheckOutDates}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="rounded-full cursor-pointer"
          size="lg"
        >
          <Search className="w-7 h-7" /> SEARCH
        </Button>
      </div>
    </div>
  );
};

export default Searchbar;
