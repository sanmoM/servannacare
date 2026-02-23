"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import LoadingSpinner from "@/components/shared/LoadingSpin";

export default function EmployerBookingFormClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: specData, isLoading: specLoading } = useFetch("/specialist");

  const specialists = specData?.data?.data ?? [];

  const matchedSpecialist = useMemo(
    () => specialists.find((s) => s.id === Number(id)),
    [specialists, id],
  );

  // Extract Fees from Specialist Data
  const monthlyPrice = Number(
    matchedSpecialist?.house_manager?.serviceFeeMonth || 0,
  );
  const dailyPrice = Number(
    matchedSpecialist?.house_manager?.serviceFeeDay || 0,
  );

  // Extract available dates from schedule
  const availableDates = useMemo(() => {
    return matchedSpecialist?.schedule?.flatMap((s) => s.date) || [];
  }, [matchedSpecialist]);

  const [previewMonth, setPreviewMonth] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      lookingFor: "",
      kids: "",
      ageBracket: "",
      homeType: "",
      homeSize: "",
      selectedMonths: [],
      selectedDates: [],
    },
  });

  const lookingFor = watch("lookingFor");
  const selectedDates = watch("selectedDates") || [];
  const selectedMonths = watch("selectedMonths") || [];
  const ageBracket = watch("ageBracket");
  const homeType = watch("homeType");
  const homeSize = watch("homeSize");
  const kids = watch("kids");

  React.useEffect(() => {
    if (kids !== "yes") {
      setValue("ageBracket", "");
    }
  }, [kids, setValue]);

  const bookingAmount = useMemo(() => {
    if (lookingFor === "monthly") {
      return selectedMonths.length * monthlyPrice;
    } else if (lookingFor === "daily") {
      return selectedDates.length * dailyPrice;
    }
    return 0;
  }, [lookingFor, selectedMonths, selectedDates, monthlyPrice, dailyPrice]);

  const handleLookingForChange = (val) => {
    setValue("lookingFor", val);

    setValue("selectedMonths", []);
    setValue("selectedDates", []);
  };

  const isMonthly = lookingFor === "monthly";
  const isDaily = lookingFor === "daily";

  const isDateDisabled = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const dateString = `${y}-${m}-${d}`;
    return !availableDates.includes(dateString);
  };

  if (specLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            {/* EMPLOYER FORM */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="border-b bg-white p-6">
                <CardTitle>Booking Form</CardTitle>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* <Separator /> */}

                {/* 2. Kids */}
                <div>
                  <Label className="font-bold block mb-4">
                    2. Do you have kids?
                  </Label>

                  <RadioGroup
                    value={kids}
                    onValueChange={(val) => setValue("kids", val)}
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
                      <Label className="font-medium">choose age bracket</Label>
                      <RadioGroup
                        value={watch("ageBracket")}
                        onValueChange={(val) => setValue("ageBracket", val)}
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
                  <Label className="font-bold block mb-4">
                    3. Type of home:
                  </Label>

                  <RadioGroup
                    value={homeType}
                    // onValueChange={setHomeType}
                    onValueChange={(val) => setValue("homeType", val)}
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
                    onValueChange={(val) => setValue("homeSize", val)}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {["1Br", "2Br", "3Br", "4Br", "5Br and above"].map(
                      (size) => (
                        <div key={size} className="flex items-center gap-2">
                          <RadioGroupItem value={size} id={size} />
                          <Label htmlFor={size}>{size}</Label>
                        </div>
                      ),
                    )}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200 mt-6">
              <CardHeader className="border-b bg-white p-6">
                <div>
                  <Label className="font-bold block mb-4">
                    1. Looking for:
                  </Label>

                  <RadioGroup
                    value={lookingFor}
                    onValueChange={handleLookingForChange}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="monthly" id="livein" />
                      <Label htmlFor="livein">Live In </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="daily" id="dayburg" />
                      <Label htmlFor="dayburg">Dayburg </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div
                    className={`p-6 rounded-2xl border-2 ${isMonthly ? "border-[#7A295A] bg-[#7A295A]/5" : "border-slate-100 opacity-50"}`}
                  >
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                      Monthly Rate
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      KES {monthlyPrice}
                    </p>
                  </div>
                  <div
                    className={`p-6 rounded-2xl border-2 ${isDaily ? "border-[#7A295A] bg-[#7A295A]/5" : "border-slate-100 opacity-50"}`}
                  >
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                      Daily Rate
                    </p>
                    <p className="text-2xl font-bold mt-2">KES {dailyPrice}</p>
                  </div>
                </div>

                {/* Monthly Selection */}
                {isMonthly && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const monthKey = `2026-${String(i + 1).padStart(2, "0")}`;
                      const monthLabel = new Date(2026, i).toLocaleString(
                        "default",
                        { month: "long" },
                      );
                      const hasAvailability = availableDates.some((d) =>
                        d.startsWith(monthKey),
                      );
                      const selected = selectedMonths.includes(monthKey);

                      return (
                        <div key={monthKey} className="relative">
                          <button
                            type="button"
                            disabled={!hasAvailability}
                            onClick={() => {
                              const next = selected
                                ? selectedMonths.filter((m) => m !== monthKey)
                                : [...selectedMonths, monthKey];
                              setValue("selectedMonths", next);
                            }}
                            className={`w-full p-5 rounded-2xl border transition-all ${
                              selected
                                ? "bg-[#7A295A] text-white"
                                : "bg-white text-slate-900"
                            } ${!hasAvailability && "opacity-30 cursor-not-allowed"}`}
                          >
                            <p className="font-semibold">{monthLabel}</p>
                            <p className="text-[10px]">
                              {hasAvailability ? "Available" : "No Dates"}
                            </p>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Daily Selection */}
                {isDaily && (
                  <div className="flex flex-col items-center">
                    <p className="mb-4 text-sm text-slate-500">
                      Select available dates from the specialist's schedule:
                    </p>
                    <Calendar
                      mode="multiple"
                      selected={selectedDates.map((d) => new Date(d))}
                      onSelect={(dates) => {
                        const dateStrings = dates.map(
                          (d) => d.toISOString().split("T")[0],
                        );
                        setValue("selectedDates", dateStrings);
                      }}
                      disabled={isDateDisabled}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Button className="w-full h-16 text-xl font-bold rounded-2xl bg-[#7A295A] hover:bg-[#65224a]">
              Confirm & Submit
            </Button>
          </form>
        </div>

        {/* RIGHT SUMMARY */}
        <aside>
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-slate-100 sticky top-8">
            <div className="bg-[#7A295A] p-10 text-white rounded-t-[2.5rem]">
              <p className="text-xs uppercase opacity-70">Total to Pay</p>
              <p className="text-5xl font-black mt-2">KES {bookingAmount}</p>
            </div>
            <CardContent className="p-10 space-y-4">
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">UNIT PRICE</span>
                <span>KES {isMonthly ? monthlyPrice : dailyPrice}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">QUANTITY</span>
                <span>
                  {isMonthly
                    ? `${selectedMonths.length} Months`
                    : `${selectedDates.length} Days`}
                </span>
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
