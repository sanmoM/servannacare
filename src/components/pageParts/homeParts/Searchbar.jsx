"use client";

import React, { useState } from "react";
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

const Searchbar = () => {
  const [category, setCategory] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(null);
  const router = useRouter();

  const today = startOfDay(new Date());

  // Disable past dates for check-in
  const disabledCheckInDates = (date) => {
    return isBefore(date, today);
  };

  // Disable dates before check-in for check-out
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
      toast.error("Please select checkout date!");
      return;
    }

    const query = new URLSearchParams({
      category: category,
      startDate: format(checkIn, "dd-MM-yyyy"),
      endDate: format(checkOut, "dd-MM-yyyy"),
    }).toString();

    router.push(`/specialist?${query}`);

    console.log(category, checkIn);
  };

  const categories = [
    { id: 1, value: "house manager nanny", label: "HOUSE MANAGER / NANNY" },
    { id: 2, value: "certifie nursing assistant (C.N.A)", label: "CERTIFIED NURSING ASSISTANT (C.N.A)" },
    { id: 3, value: "medical nurse", label: "MEDICAL NURSE" },
    { id: 4, value: "physiotherapist", label: "PHYSIOTHERAPIST" },
    { id: 5, value: "special-need-care-giver", label: "SPECIAL NEEDS CARE GIVER" },
  ];

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
                    {categories.map((item) => (
                      <SelectItem key={item.id} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
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

          {/* Check-out */}
          <div className="flex items-center gap-3 pb-3">
            <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Check out</p>
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
        <div className="pl-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 tracking-wide">CATEGORY</p>
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
                  {categories.map((item) => (
                    <SelectItem key={item.id} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
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
            <p className="text-xs text-gray-500 uppercase mb-2 tracking-wide">
              Check in
            </p>
            <Popover>
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

        {/* Check-out */}
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-gray-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs mb-2 text-gray-500 uppercase tracking-wide">
              Check out
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <button className="border-0 cursor-pointer p-0 text-base font-semibold text-gray-700 text-sm focus:ring-0 bg-transparent w-full text-left">
                  {formatDate(checkOut)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
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

        <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="rounded-full" size="lg">
          <Search className="w-7 h-7" /> SEARCH
        </Button>
      </div>
    </div>
  );
};

export default Searchbar;
