"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { postApi } from "@/lib/apiHandler";
import { useAuth } from "@/hooks/useAuth";

export default function EmployerBookingFormClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const category = searchParams.get("category");

  const [previewMonth, setPreviewMonth] = useState(null);
  const [bookingAmount, setBookingAmount] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [planId, setPlanId] = useState(0);
  const { user } = useAuth();

  const { data: specData, isLoading: specLoading } = useFetch("/specialist");
  const { data, isLoading } = useFetch("/subscription-plan");

  useEffect(() => {
    if (data?.status === 200 && data?.data?.data.length > 0) {
      const individualPlan = data?.data?.data?.find(
        (item) => item.name === "Service Fee",
      );

      if (individualPlan) {
        setServiceFee(parseFloat(individualPlan.price));
        setPlanId(individualPlan.id);
      }
    }
  }, [data]);

  const specialists = specData?.data?.data ?? [];

  const matchedSpecialist = useMemo(
    () => specialists.find((s) => s.id === Number(id)),
    [specialists, id],
  );

  // Specialist Fees
  const monthlyRate = Number(
    matchedSpecialist?.house_manager?.serviceFeeMonth || 0,
  );
  const dailyRate = Number(
    matchedSpecialist?.house_manager?.serviceFeeDay || 0,
  );

  const availableDates = useMemo(
    () => matchedSpecialist?.schedule?.flatMap((s) => s.date) || [],
    [matchedSpecialist],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      lookingFor: "",
      selectedMonths: [],
      selectedDates: [],
      kids: "",
      ageBracket: "",
      homeType: "",
      homeSize: "",
    },
  });

  const lookingFor = watch("lookingFor");
  const selectedMonths = watch("selectedMonths");
  const selectedDates = watch("selectedDates");
  const ageBracket = watch("ageBracket");
  const homeType = watch("homeType");
  const homeSize = watch("homeSize");
  const kids = watch("kids");

  const isMonthly = lookingFor === "monthly";
  const isDaily = lookingFor === "daily";

  React.useEffect(() => {
    if (kids !== "yes") {
      setValue("ageBracket", "");
    }
  }, [kids, setValue]);

  useEffect(() => {
    const amount = isMonthly
      ? selectedMonths.length * monthlyRate
      : selectedDates.length * dailyRate;
    setBookingAmount(amount);
  }, [selectedMonths, selectedDates, isMonthly, monthlyRate, dailyRate]);
  const totalAmount = bookingAmount + serviceFee;

  const getDatesForMonth = (monthKey) =>
    availableDates.filter((d) => d.startsWith(monthKey));

  const isDateDisabled = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    return !availableDates.includes(dateStr);
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    const booking_type = data.lookingFor === "monthly" ? "monthly" : "daily";

    let formattedSelections = [];

    if (data.lookingFor === "monthly") {
      formattedSelections = data.selectedMonths.map((monthKey) => {
        return {
          dates: availableDates.filter((d) => d.startsWith(monthKey)),
        };
      });
    } else {
      formattedSelections = data.selectedDates.map((date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      });
    }

    const payload = {
      specialist_id: Number(id),
      specialist_type: category,
      subRole: category,
      booking_type: booking_type,
      has_kids: data.kids === "yes" ? 1 : 0,
      age_bracket: data.kids === "yes" ? data.ageBracket : null,
      home_type: data.homeType,
      home_size: data.homeSize,
      selected_dates_or_months: formattedSelections,
      booking_amount: bookingAmount,
    };

    try {
      // await postApi("/booking", payload);
      // if (res?.status === 200 || res?.status === 201) {
      //   toast.success("Booking Request Sent!");
      //   router.push("/dashboard/book-history");
      // }

      const paymentData = {
        phone: user?.number,
        plan_id: planId,
        specialist_id: id,
        specialist_type: matchedSpecialist?.type,
        book_amount: bookingAmount,
      };

      const res = await postApi("/booking", payload);

      if (res?.status === 200 || res?.status === 201) {
        const paymentRes = await postApi("/checkout", paymentData);

        const queryRes = await getApi(
          `/mpesa/query/${paymentRes?.data?.checkout_id}`,
        );

        console.log("payment Response:", paymentRes);
        console.log("Mpesa Query Data:", queryRes);

        toast.success("Payment request sent!");
      }
    } catch (error) {
      toast.error("Failed to submit booking");
    }
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
                      <RadioGroupItem
                        className={"cursor-pointer"}
                        value="yes"
                        id="kids-yes"
                      />
                      <Label className={"cursor-pointer"} htmlFor="kids-yes">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        className={"cursor-pointer"}
                        value="no"
                        id="kids-no"
                      />
                      <Label className={"cursor-pointer"} htmlFor="kids-no">
                        No
                      </Label>
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
                          <RadioGroupItem
                            className={"cursor-pointer"}
                            value="0-3"
                            id="age1"
                          />
                          <Label className={"cursor-pointer"} htmlFor="age1">
                            0 – 3 yrs
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            className={"cursor-pointer"}
                            value="4-10"
                            id="age2"
                          />
                          <Label className={"cursor-pointer"} htmlFor="age2">
                            4 – 10 yrs
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            className={"cursor-pointer"}
                            value="11+"
                            id="age3"
                          />
                          <Label className={"cursor-pointer"} htmlFor="age3">
                            11 yrs and Above
                          </Label>
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
                      <RadioGroupItem
                        className={"cursor-pointer"}
                        value="compound"
                        id="compound"
                      />
                      <Label className={"cursor-pointer"} htmlFor="compound">
                        Own compound
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        className={"cursor-pointer"}
                        value="apartment"
                        id="apartment"
                      />
                      <Label className={"cursor-pointer"} htmlFor="apartment">
                        Apartment
                      </Label>
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
                          <RadioGroupItem
                            className={"cursor-pointer"}
                            value={size}
                            id={size}
                          />
                          <Label className={"cursor-pointer"} htmlFor={size}>
                            {size}
                          </Label>
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
                    onValueChange={(val) => setValue("lookingFor", val)}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        className={"cursor-pointer"}
                        value="monthly"
                        id="livein"
                      />
                      <Label className={"cursor-pointer"} htmlFor="livein">
                        Live In{" "}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        className={"cursor-pointer"}
                        value="daily"
                        id="dayburg"
                      />
                      <Label className={"cursor-pointer"} htmlFor="dayburg">
                        Dayburg{" "}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* PLAN SELECTION CARDS */}
                <div className="grid grid-cols-2 gap-6">
                  <div
                    onClick={() => {
                      setValue("lookingFor", "monthly");
                      setValue("selectedMonths", []);
                    }}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      isMonthly
                        ? "border-[#7A295A] bg-[#7A295A]/5"
                        : "border-slate-100"
                    }`}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Monthly Plan
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      KES {monthlyRate.toLocaleString()}
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setValue("lookingFor", "daily");
                      setValue("selectedDates", []);
                    }}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      isDaily
                        ? "border-[#7A295A] bg-[#7A295A]/5"
                        : "border-slate-100"
                    }`}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Daily Plan
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      KES {dailyRate.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* MONTHLY GRID */}
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
                      const isSelected = selectedMonths.includes(monthKey);

                      return (
                        <div key={monthKey} className="relative">
                          <button
                            type="button"
                            disabled={!hasAvailability}
                            onClick={() => {
                              const next = isSelected
                                ? selectedMonths.filter((m) => m !== monthKey)
                                : [...selectedMonths, monthKey];
                              setValue("selectedMonths", next);
                            }}
                            className={`w-full p-5 rounded-xl border flex flex-col items-center cursor-pointer transition-all ${
                              isSelected
                                ? "bg-[#7A295A] text-white border-[#7A295A]"
                                : "bg-white border-slate-200"
                            } ${!hasAvailability && "opacity-25 cursor-not-allowed"}`}
                          >
                            <span className="font-bold text-sm">
                              {monthLabel}
                            </span>
                            <span className="text-[10px]">
                              {hasAvailability ? "Available" : "No Dates"}
                            </span>
                          </button>

                          {hasAvailability && (
                            <button
                              type="button"
                              title="Preview available days"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewMonth(monthKey);
                              }}
                              className="absolute -top-1 -right-1 bg-primary cursor-pointer text-white p-1.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform z-10"
                            >
                              <span
                                role="img"
                                aria-label="view"
                                className="text-[12px] cursor-pointer"
                              >
                                <Eye />
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* DAILY CALENDAR */}
                {isDaily && (
                  <div className="flex justify-center p-6 bg-slate-50 rounded-2xl">
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={(val) => setValue("selectedDates", val)}
                      disabled={isDateDisabled}
                      className="bg-white border rounded-xl w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl cursor-pointer shadow-primary/20"
            >
              {isSubmitting ? "Processing..." : "Confirm & Submit Booking"}
            </Button>
          </form>
        </div>

        {/* RIGHT SUMMARY */}
        <aside>
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-slate-100 sticky top-8">
            <div className="bg-[#7A295A] p-10 text-white rounded-t-[2.5rem]">
              <p className="text-xs uppercase opacity-70 font-bold">
                Estimated Amount
              </p>
              <p className="text-5xl font-black mt-2">
                KES {totalAmount.toLocaleString()}
              </p>
            </div>
            <CardContent className="p-10 space-y-4">
              <div className="flex justify-between font-bold text-sm">
                <span className="text-slate-400">PLAN</span>
                <span className="capitalize">{lookingFor}</span>
              </div>
              <div className="flex justify-between font-bold text-sm">
                <span className="text-slate-400">SELECTION</span>
                <span className="text-[#7A295A]">
                  {isMonthly
                    ? `${selectedMonths.length} Months`
                    : `${selectedDates.length} Days`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Booking Amount</span>
                <span>KES {bookingAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Service Fee</span>
                <span>KES {serviceFee.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-sm">
                <span>Total</span>
                <span className="text-[#7A295A]">
                  KES {totalAmount.toLocaleString()}
                </span>
              </div>
              <Separator />
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* MONTH PREVIEW MODAL */}
      {previewMonth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <Card className="w-full max-w-sm animate-in fade-in zoom-in duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <CardTitle className="text-lg font-bold">
                {new Date(previewMonth + "-02").toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-slate-100"
                onClick={() => setPreviewMonth(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <Calendar
                  mode="multiple"
                  month={new Date(previewMonth + "-02")}
                  disableNavigation
                  selected={availableDates
                    .filter((d) => d.startsWith(previewMonth))
                    .map((d) => new Date(d + "T00:00:00"))}
                  disabled={(date) => isDateDisabled(date)}
                  className="rounded-md border pointer-events-none"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-md">
                <div className="w-3 h-3 bg-primary rounded-sm" />
                <span>Highlighted days are available for care.</span>
              </div>
              <Button
                className="w-full mt-6 cursor-pointer"
                onClick={() => setPreviewMonth(null)}
              >
                Got it
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
