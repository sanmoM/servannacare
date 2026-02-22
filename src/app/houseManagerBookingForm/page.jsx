"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";

export default function EmployerBookingFormClient() {
  // Employer Section State
  const [lookingFor, setLookingFor] = useState("monthly");
  const [kids, setKids] = useState("");
  const [ageBracket, setAgeBracket] = useState("");
  const [homeType, setHomeType] = useState("");
  const [homeSize, setHomeSize] = useState("");

  // Care Duration State
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [previewMonth, setPreviewMonth] = useState(null);

  const isMonthly = lookingFor === "monthly";
  const isDaily = lookingFor === "daily";

  const monthlyPrice = 100;
  const dailyPrice = 4;

  const bookingAmount = isMonthly
    ? selectedMonths.length * monthlyPrice
    : selectedDates.length * dailyPrice;

  // Demo available dates
  const availableDates = [
    "2026-02-20",
    "2026-02-21",
    "2026-02-26",
    "2026-03-17",
  ];

  const getDatesForMonth = (monthKey) =>
    availableDates.filter((d) => d.startsWith(monthKey));

  const isDateDisabled = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return !availableDates.includes(`${y}-${m}-${d}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* EMPLOYER FORM */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-white p-6">
              <CardTitle>WHAT THE EMPLOYER FILLS</CardTitle>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* 1. Looking For */}
              <div>
                <Label className="font-bold block mb-4">1. Looking for:</Label>

                <RadioGroup
                  value={lookingFor}
                  onValueChange={(val) => {
                    setLookingFor(val);
                    setSelectedMonths([]);
                    setSelectedDates([]);
                  }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="monthly" id="livein" />
                    <Label htmlFor="livein">Live In</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="daily" id="dayburg" />
                    <Label htmlFor="dayburg">Dayburg</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* 2. Kids */}
              <div>
                <Label className="font-bold block mb-4">
                  2. Do you have kids?
                </Label>

                <RadioGroup
                  value={kids}
                  onValueChange={setKids}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="kids-yes" />
                    <Label htmlFor="kids-yes">Yes</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="kids-no" />
                    <Label htmlFor="kids-no">No</Label>
                  </div>
                </RadioGroup>

                {kids === "yes" && (
                  <div className="mt-6 space-y-3">
                    <Label className="font-medium">
                      IF YES (choose age bracket)
                    </Label>

                    <RadioGroup
                      value={ageBracket}
                      onValueChange={setAgeBracket}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="0-3" id="age1" />
                        <Label htmlFor="age1">0 – 3 yrs</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="4-10" id="age2" />
                        <Label htmlFor="age2">4 – 10 yrs</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="11+" id="age3" />
                        <Label htmlFor="age3">11 yrs and Above</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>

              <Separator />

              {/* 3. Type of Home */}
              <div>
                <Label className="font-bold block mb-4">3. Type of home:</Label>

                <RadioGroup
                  value={homeType}
                  onValueChange={setHomeType}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="compound" id="compound" />
                    <Label htmlFor="compound">Own compound</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="apartment" id="apartment" />
                    <Label htmlFor="apartment">Apartment</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* 4. Home Size */}
              <div>
                <Label className="font-bold block mb-4">
                  4. How Big is your home:
                </Label>

                <RadioGroup
                  value={homeSize}
                  onValueChange={setHomeSize}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {["1Br", "2Br", "3Br", "4Br", "5Br and above"].map((size) => (
                    <div key={size} className="flex items-center gap-2">
                      <RadioGroupItem value={size} id={size} />
                      <Label htmlFor={size}>{size}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* CARE DURATION SECTION */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-white p-6">
              <CardTitle>Care Schedule</CardTitle>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* PLAN CARDS */}
              <div className="grid grid-cols-2 gap-6">
                {/* Monthly Plan */}
                <div
                  onClick={() => {
                    setLookingFor("monthly");
                    setSelectedMonths([]);
                    setSelectedDates([]);
                  }}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all
      ${isMonthly ? "border-[#7A295A] bg-[#7A295A]/5" : "border-slate-200"}
    `}
                >
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                    Monthly Plan
                  </p>
                  <p className="text-2xl font-bold mt-2">KES 100</p>
                </div>

                {/* Daily Plan */}
                <div
                  onClick={() => {
                    setLookingFor("daily");
                    setSelectedMonths([]);
                    setSelectedDates([]);
                  }}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all
      ${isDaily ? "border-[#7A295A] bg-[#7A295A]/5" : "border-slate-200"}
    `}
                >
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                    Daily Plan
                  </p>
                  <p className="text-2xl font-bold mt-2">KES 4</p>
                </div>
              </div>

              {/* Monthly */}
              {isMonthly && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const monthKey = `2026-${String(i + 1).padStart(2, "0")}`;
                    const monthLabel = new Date(2026, i).toLocaleString(
                      "default",
                      { month: "long" },
                    );

                    const hasAvailability =
                      getDatesForMonth(monthKey).length > 0;

                    const selected = selectedMonths.includes(monthKey);
                    return (
                      <div key={monthKey} className="relative">
                        {/* MONTH BUTTON */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedMonths((prev) =>
                              prev.includes(monthKey)
                                ? prev.filter((m) => m !== monthKey)
                                : [...prev, monthKey],
                            )
                          }
                          className={`
                            w-full p-5 rounded-2xl border transition-all duration-200 relative
                            ${
                              selected
                                ? "bg-[#7A295A] text-white border-[#7A295A]"
                                : "bg-white border-slate-200 hover:border-[#7A295A]"
                            }
  `}
                        >
                          <p className="font-semibold">{monthLabel}</p>
                          <p className="text-xs text-slate-500">
                            {hasAvailability ? "Available" : "Unavailable"}
                          </p>
                        </button>

                        {/* 👁 EYE BUTTON */}
                        {hasAvailability && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewMonth(monthKey);
                            }}
                            className="absolute -top-2 -right-2 bg-black text-white rounded-full p-2 text-xs shadow-md"
                          >
                            👁
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Daily */}
              {isDaily && (
                <div className="flex justify-center">
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={setSelectedDates}
                    disabled={isDateDisabled}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Button className="w-full h-16 text-xl font-bold rounded-2xl bg-[#7A295A] hover:bg-[#65224a]">
            Confirm & Submit
          </Button>
        </div>

        {/* RIGHT SUMMARY */}
        <aside>
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-100 sticky top-8">
            <div className="bg-[#7A295A] p-10 text-white">
              <p className="text-xs uppercase opacity-70">Estimated Amount</p>
              <p className="text-5xl font-black mt-2">KES {bookingAmount}</p>
            </div>

            <CardContent className="p-10 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 uppercase font-bold">Plan</span>
                <span className="font-bold capitalize">{lookingFor}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400 uppercase font-bold">
                  Selection
                </span>
                <span className="font-bold text-[#7A295A]">
                  {isMonthly
                    ? `${selectedMonths.length} Months`
                    : `${selectedDates.length} Days`}
                </span>
              </div>

              <Separator />

              <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500">
                Secure Booking: Your data is strictly confidential.
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* MONTH PREVIEW MODAL */}
      {previewMonth && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setPreviewMonth(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-bold">
                {new Date(previewMonth + "-01").toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>

              <button onClick={() => setPreviewMonth(null)} className="text-xl">
                ✕
              </button>
            </div>

            {/* Calendar */}
            <div className="p-6">
              <Calendar
                month={new Date(previewMonth + "-01")}
                mode="multiple"
                selected={getDatesForMonth(previewMonth).map(
                  (d) => new Date(d),
                )}
                disabled={() => true}
              />

              <Button
                onClick={() => setPreviewMonth(null)}
                className="w-full mt-6 bg-[#7A295A]"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
