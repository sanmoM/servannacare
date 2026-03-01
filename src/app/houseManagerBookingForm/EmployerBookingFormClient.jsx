"use client";

import React, { useMemo, useState, useEffect } from "react";
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
import toast from "react-hot-toast";
import { Eye, Smartphone, Info } from "lucide-react";
import { postApi, getApi } from "@/lib/apiHandler";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";

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

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("KE");

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

  const monthlyRate = Number(
    matchedSpecialist?.house_manager?.serviceFeeMonth || 0,
  );
  const dailyRate = Number(
    matchedSpecialist?.house_manager?.serviceFeeDay || 0,
  );

  const availableDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      matchedSpecialist?.schedule
        ?.flatMap((s) => s.date)
        ?.filter((d) => {
          const dateObj = new Date(d);
          dateObj.setHours(0, 0, 0, 0);
          return dateObj >= today;
        }) || []
    );
  }, [matchedSpecialist]);

  const hasSchedule = availableDates.length > 0;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      lookingFor: "monthly",
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
  const kids = watch("kids");
  const homeType = watch("homeType");
  const homeSize = watch("homeSize");

  const isMonthly = lookingFor === "monthly";
  const isDaily = lookingFor === "daily";

  useEffect(() => {
    if (kids !== "yes") setValue("ageBracket", "");
  }, [kids, setValue]);

  useEffect(() => {
    const amount = isMonthly
      ? selectedMonths.length * monthlyRate
      : selectedDates.length * dailyRate;
    setBookingAmount(amount);
  }, [selectedMonths, selectedDates, isMonthly, monthlyRate, dailyRate]);

  const totalAmount = bookingAmount + serviceFee;

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current = new Date(date);
    current.setHours(0, 0, 0, 0);

    if (current < today) return true;

    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    return !availableDates.includes(dateStr);
  };

  const onSubmit = async () => {
    if (
      (isMonthly && !selectedMonths.length) ||
      (isDaily && !selectedDates.length)
    ) {
      return toast.error("Please select dates/months");
    }
    if (!homeType || !homeSize || !kids)
      return toast.error("Please complete all fields");

    // setPhoneNumber(user?.number || "");
    setIsPayModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      return toast.error("Please enter a valid phone number");
    }

    setIsProcessingPayment(true);
    const formData = watch();

    let formattedSelections = isMonthly
      ? formData.selectedMonths.map((m) => ({
          dates: availableDates.filter((d) => d.startsWith(m)),
        }))
      : formData.selectedDates.map((d) => d.toISOString().split("T")[0]);

    const bookingPayload = {
      specialist_id: Number(id),
      specialist_type: category,
      subRole: category,
      booking_type: isMonthly ? "monthly" : "daily",
      has_kids: formData.kids === "yes" ? 1 : 0,
      age_bracket: formData.kids === "yes" ? formData.ageBracket : null,
      home_type: formData.homeType,
      home_size: formData.homeSize,
      selected_dates_or_months: formattedSelections,
      booking_amount: bookingAmount,
    };
    console.log("booking payload",bookingPayload)

    // try {
    //   const paymentRes = await postApi("/checkout", {
    //     phone: phoneNumber,
    //     plan_id: planId,
    //     specialist_id: id,
    //     specialist_type: category,
    //     book_amount: bookingAmount,
    //   });

    //   const checkoutId = paymentRes?.data?.checkout_id;

    //   if (!checkoutId) {
    //     throw new Error("Checkout failed");
    //   }

    //   toast.success("M-Pesa prompt sent!");

    //   const queryRes = await getApi(`/mpesa/query/${checkoutId}`);

    //   if (queryRes?.status === 200) {
    //     const bookingRes = await postApi("/booking", bookingPayload);

    //     if (bookingRes?.status === 200 || bookingRes?.status === 201) {
    //       toast.success("Booking confirmed successfully!");
    //       setIsPayModalOpen(false);
    //       router.push("/dashboard/book-history");
    //     }
    //   } else {
    //     toast.error("Payment not completed.");
    //   }
    // } catch (error) {
    //   toast.error("Payment failed. Try again.");
    // } finally {
    //   setIsProcessingPayment(false);
    // }
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
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="border-b bg-white p-6">
                <CardTitle>Booking Form</CardTitle>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
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
                        {["0-3", "4-10", "11+"].map((range) => (
                          <div key={range} className="flex items-center gap-2">
                            <RadioGroupItem
                              className={"cursor-pointer"}
                              value={range}
                              id={`age-${range}`}
                            />
                            <Label
                              className={"cursor-pointer"}
                              htmlFor={`age-${range}`}
                            >
                              {range === "11+"
                                ? "11 yrs and Above"
                                : `${range} yrs`}
                            </Label>
                          </div>
                        ))}
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
                <Label className="font-bold block mb-4">1. Looking for:</Label>
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
                      Live In
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      className={"cursor-pointer"}
                      value="daily"
                      id="dayburg"
                    />
                    <Label className={"cursor-pointer"} htmlFor="dayburg">
                      Dayburg
                    </Label>
                  </div>
                </RadioGroup>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div
                    onClick={() => {
                      setValue("lookingFor", "monthly");
                      setValue("selectedMonths", []);
                    }}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${isMonthly ? "border-[#7A295A] bg-[#7A295A]/5" : "border-slate-100"}`}
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
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${isDaily ? "border-[#7A295A] bg-[#7A295A]/5" : "border-slate-100"}`}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Daily Plan
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      KES {dailyRate.toLocaleString()}
                    </p>
                  </div>
                </div>

                {isMonthly && (
                  <>
                    {!hasSchedule ? (
                      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-lg font-semibold text-slate-500">
                          No available month for this specialist.
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                          Please select another specialist.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => {
                          const monthKey = `2026-${String(i + 1).padStart(2, "0")}`;
                          const monthLabel = new Date(2026, i).toLocaleString(
                            "default",
                            { month: "long" },
                          );
                          const hasAvailability = availableDates.some((d) => {
                            if (!d.startsWith(monthKey)) return false;

                            const dateObj = new Date(d);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            dateObj.setHours(0, 0, 0, 0);

                            return dateObj >= today;
                          });
                          const isSelected = selectedMonths.includes(monthKey);

                          return (
                            <div key={monthKey} className="relative">
                              <button
                                type="button"
                                disabled={!hasAvailability}
                                onClick={() => {
                                  const next = isSelected
                                    ? selectedMonths.filter(
                                        (m) => m !== monthKey,
                                      )
                                    : [...selectedMonths, monthKey];
                                  setValue("selectedMonths", next);
                                }}
                                className={`w-full cursor-pointer p-5 rounded-xl border flex flex-col items-center transition-all ${isSelected ? "bg-[#7A295A] text-white border-[#7A295A]" : "bg-white border-slate-200"} ${!hasAvailability && "opacity-25 cursor-not-allowed"}`}
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewMonth(monthKey);
                                  }}
                                  className="absolute -top-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-lg cursor-pointer"
                                >
                                  <Eye size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {isDaily && (
                  <>
                    {!hasSchedule ? (
                      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-lg font-semibold text-slate-500">
                          No available dates for this specialist.
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                          Please select another specialist.
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-center p-6 bg-slate-50 rounded-2xl">
                        <Calendar
                          mode="multiple"
                          selected={selectedDates}
                          onSelect={(val) => setValue("selectedDates", val)}
                          disabled={isDateDisabled}
                          className="bg-white border rounded-xl w-full cursor-pointer"
                        />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={!hasSchedule && isSubmitting}
              className="w-full h-16 text-xl font-bold rounded-2xl cursor-pointer shadow-xl mt-8 bg-[#7A295A] hover:bg-[#631f49] text-white"
            >
              {isSubmitting ? "Processing..." : "Go To Checkout"}
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
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* 1. M-PESA PAYMENT MODAL */}
      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 border-none bg-white overflow-hidden">
          <div className="bg-[#7A295A] p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone size={32} />
            </div>
            <DialogTitle className="text-2xl font-black">
              M-Pesa Checkout
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Confirm your number to initiate payment.
            </DialogDescription>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">
                Enter M-Pesa Number
              </label>
              <div className="phone-input-container">
                <PhoneInputWithCountrySelect
                  className="w-full flex border rounded-2xl px-4 py-3 bg-slate-50 focus-within:ring-2 focus-within:ring-primary transition-all"
                  international
                  defaultCountry={country}
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value || "")}
                  onCountryChange={(countryCode) => {
                    setCountry(countryCode || "KE");
                    const example = countryCode
                      ? getExampleNumber(countryCode)
                      : null;
                    if (example) {
                      setPhoneNumber(`+${example.countryCallingCode}`);
                    } else {
                      setPhoneNumber("");
                    }
                  }}
                />
              </div>
              {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                <p className="text-red-500 text-[11px] font-bold mt-2 ml-1">
                  Invalid phone number for {country}
                </p>
              )}
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border flex justify-between items-center">
              <span className="text-xs font-black text-slate-400">TOTAL:</span>
              <span className="text-2xl font-black text-[#7A295A]">
                KES {totalAmount.toLocaleString()}
              </span>
            </div>

            <Button
              onClick={handleFinalSubmit}
              disabled={
                isProcessingPayment ||
                (phoneNumber !== "" && !isValidPhoneNumber(phoneNumber))
              }
              className="w-full h-14 bg-[#7A295A] text-white rounded-2xl font-black uppercase cursor-pointer tracking-widest shadow-xl"
            >
              {isProcessingPayment ? "Requesting...." : "Confirm & Pay"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. MONTH PREVIEW MODAL */}
      {previewMonth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
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
                className="rounded-full"
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
                  className="rounded-md border pointer-events-none"
                />
              </div>
              <Button
                className="w-full mt-6 bg-[#7A295A] text-white cursor-pointer"
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
