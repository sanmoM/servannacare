"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { User, ShieldCheck, Activity, HeartPulse, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import FileUpload from "@/components/auth/register/FileUpload";
import LoadingSpinner from "@/components/shared/LoadingSpin";

import { postApi } from "@/lib/apiHandler";
import { useFetch } from "@/hooks/useFetch";

export default function BookingFormClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const id = searchParams.get("id");
  const router = useRouter();

  const [bookingAmount, setBookingAmount] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDateList, setSelectedDateList] = useState([]);
  const [previewMonth, setPreviewMonth] = useState(null);

  const { data: specData, isLoading: specLoading } = useFetch("/specialist");

  const { data: priceData, isLoading: priceLoading } = useFetch("/price");

  const specialists = specData?.data?.data ?? [];
  const prices = priceData?.data?.data ?? [];

  const matchedSpecialist = useMemo(
    () => specialists.find((s) => s.id === Number(id)),
    [specialists, id],
  );

  console.log("mathdfd", matchedSpecialist);

  const availableDates =
    matchedSpecialist?.schedule?.flatMap((s) => s.date) || [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      patient_name: "",
      patient_age: "",
      patient_gender: "",
      relationship_to_booking_person: "",
      patient_have_any_conditions: [],
      patient_have_any_others_conditions: "",
      patient_currently_on_medication: "",
      patient_currently_on_medication_data: "",
      prescriptionFile: null,
      patient_have_any_known_allergies: "",
      patient_have_any_known_allergies_details: "",
      mobility_status_of_patient: "",
      location_of_care: "",
      booking_type: "",
      emergency_contact_name: "",
      emergency_contact_number: "",
      primary_doctor_name: "",
      primary_doctor_number: "",
      primary_hospital: "",
      consent: false,
    },
  });

  const watchConditions = watch("patient_have_any_conditions");
  const watchMedication = watch("patient_currently_on_medication");
  const watchAllergy = watch("patient_have_any_known_allergies");
  const watchbooking_type = watch("booking_type");

  const isDaily = selectedPrice?.name?.toLowerCase() === "daily";
  const isMonthly = selectedPrice?.name?.toLowerCase() === "monthly";

  useEffect(() => {
    if (!watchbooking_type || prices.length === 0) return;

    const matchedPlan = prices.find(
      (p) => p.name?.toLowerCase() === watchbooking_type,
    );

    setSelectedPrice(matchedPlan || null);
    setSelectedMonths([]);
    setSelectedDateList([]);
  }, [watchbooking_type, prices]);

  useEffect(() => {
    if (!watchConditions.includes("others")) {
      setValue("patient_have_any_others_conditions", "");
    }
  }, [watchConditions]);

  useEffect(() => {
    if (watchMedication !== "yes") {
      setValue("patient_currently_on_medication_data", "");
      setValue("prescriptionFile", null);
    }
  }, [watchMedication, setValue]);

  useEffect(() => {
    if (!watchAllergy || watchAllergy === "None") {
      setValue("patient_have_any_known_allergies_details", "");
    }
  }, [watchAllergy, setValue]);

  const toggleCondition = (val, current, onChange) => {
    if (val === "None") {
      onChange(["None"]);
    } else {
      const next = current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current.filter((v) => v !== "None"), val];
      onChange(next);
    }
  };

  const getDatesForMonth = (monthKey) => {
    return availableDates.filter((date) => date.startsWith(monthKey));
  };

  const isDateDisabled = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !availableDates.includes(dateStr) || date < today;
  };

  useEffect(() => {
    const rate = selectedPrice?.price || 0;
    setBookingAmount(
      isDaily ? selectedDateList.length * rate : selectedMonths.length * rate,
    );
  }, [selectedDateList, selectedMonths, selectedPrice, isDaily]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    if (!data.consent) {
      toast.error("You must accept the condition before booking.");
      return;
    }
    if (!data.booking_type) {
      toast.error("You must select care duration before booking.");
      return;
    }

    // Schedule validation
    if (
      (isDaily && selectedDateList.length === 0) ||
      (isMonthly && selectedMonths.length === 0)
    ) {
      toast.error("Please select your schedule dates/months.");
      return;
    }

    const formData = new FormData();

    const scheduleItems = isDaily
      ? selectedDateList.map(
          (d) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
        )
      : selectedMonths.map((month) => ({
          month,
          dates: getDatesForMonth(month),
        }));
    if (matchedSpecialist) {
      formData.append("specialist_id", id);
      formData.append("specialist_type", matchedSpecialist?.type);
    }

    Object.keys(data).forEach((key) => {
      if (
        key === "patient_have_any_conditions" ||
        key === "prescriptionFile" ||
        key === "consent"
      )
        return;

      if (key === "patient_currently_on_medication") {
        formData.append(key, data[key] === "yes" ? 1 : 0);
      } else {
        formData.append(key, data[key]);
      }
    });

    formData.append(
      "patient_have_any_conditions",
      JSON.stringify(data.patient_have_any_conditions),
    );
    formData.append("booking_amount", bookingAmount);
    formData.append("selected_dates_or_months", JSON.stringify(scheduleItems));

    if (data.prescriptionFile) {
      formData.append("prescription_file", data.prescriptionFile);
    }

    try {
      const res = await postApi("/booking", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.status === 200 || res?.status === 201) {
        toast.success("Booking Request Sent!");
        router.push("/dashboard/book-history");
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    }
  };

  if (specLoading || priceLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            const firstError = Object.values(errors)[0];

            if (firstError?.message) {
              toast.error(firstError.message);
            } else {
              toast.error(
                "Please complete all required fields before submitting.",
              );
            }
          })}
          className="lg:col-span-2 space-y-6"
        >
          <div className="mb-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              BOOKING FORM
            </h1>
          </div>

          {/* 5 & 6. Mobility & Schedule */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="font-bold">Care duration *</Label>
                <Controller
                  name="booking_type"
                  control={control}
                  rules={{ required: "care duration Required" }}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                      value={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { label: "Live-in", value: "monthly" },
                        { label: "Daily", value: "daily" },
                      ].map((d) => (
                        <div key={d.value} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={d.value}
                            id={`dur-${d.value}`}
                          />
                          <Label htmlFor={`dur-${d.value}`}>{d.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />

                {errors.booking_type && (
                  <p className="text-xs text-red-500">
                    {errors.booking_type.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {prices.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      const planType = p.name?.toLowerCase();

                      setSelectedPrice(p);
                      setValue("booking_type", planType);

                      setSelectedMonths([]);
                      setSelectedDateList([]);
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer
  ${
    selectedPrice?.id === p.id
      ? "border-primary bg-primary/5"
      : "border-slate-100"
  }
`}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {p.name} Plan
                    </p>
                    <div className="text-xl font-bold">
                      KES {p.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {isDaily && (
                <div className="flex justify-center p-6 bg-slate-50 rounded-2xl">
                  <Calendar
                    mode="multiple"
                    selected={selectedDateList}
                    onSelect={setSelectedDateList}
                    disabled={isDateDisabled}
                    className="bg-white border rounded-xl"
                  />
                </div>
              )}

              {isMonthly && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const monthNumber = String(i + 1).padStart(2, "0");
                      const monthKey = `2026-${monthNumber}`;

                      const displayDate = new Date(2026, i, 1);
                      const monthLabel = displayDate.toLocaleString("default", {
                        month: "long",
                      });

                      const hasAvailability = availableDates.some((d) =>
                        d.startsWith(monthKey),
                      );
                      const isSelected = selectedMonths.includes(monthKey);

                      return (
                        <div key={monthKey} className="relative group">
                          <button
                            type="button"
                            disabled={!hasAvailability}
                            onClick={() => {
                              const newMonths = isSelected
                                ? selectedMonths.filter((m) => m !== monthKey)
                                : [...selectedMonths, monthKey];
                              setSelectedMonths(newMonths);
                              setBookingAmount(
                                newMonths.length * selectedPrice.price,
                              );
                            }}
                            className={`w-full py-4 px-2 rounded-lg border flex flex-col items-center transition-all shadow-sm ${
                              isSelected
                                ? "bg-primary border-primary text-white ring-2 ring-primary ring-offset-1"
                                : "bg-white border-slate-200 hover:border-primary text-slate-700"
                            } ${!hasAvailability && "opacity-25 cursor-not-allowed bg-slate-50"}`}
                          >
                            <span className="text-sm font-bold">
                              {monthLabel}
                            </span>
                            <span
                              className={`text-[10px] mt-1 font-medium ${isSelected ? "text-white/80" : "text-slate-400"}`}
                            >
                              {hasAvailability ? "Available" : "Unavailable"}
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
                              className="absolute -top-1 -right-1 bg-slate-900 text-white p-1.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform z-10"
                            >
                              <span
                                role="img"
                                aria-label="view"
                                className="text-[12px]"
                              >
                                👁️
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {previewMonth && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
                      <Card className="w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                          <CardTitle className="text-lg font-bold">
                            {new Date(previewMonth + "-02").toLocaleString(
                              "default",
                              { month: "long", year: "numeric" },
                            )}
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
                            <span>
                              Highlighted days are available for care.
                            </span>
                          </div>
                          <Button
                            className="w-full mt-6"
                            onClick={() => setPreviewMonth(null)}
                          >
                            Got it
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20"
          >
            {isSubmitting ? "Processing..." : "Confirm & Submit Booking"}
          </Button>
        </form>

        {/* SIDEBAR SUMMARY */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-4">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-100">
              <div className="bg-primary p-10 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Estimated Amount
                </p>
                <div className="text-5xl font-black">
                  KES {bookingAmount.toLocaleString()}
                </div>
              </div>
              <CardContent className="p-10 space-y-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase">
                    Service
                  </span>
                  <span className="font-black text-slate-900 capitalize">
                    {category}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase">
                    Plan
                  </span>
                  <span className="font-black text-slate-900">
                    {selectedPrice?.name || "--"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase">
                    Selection
                  </span>
                  <span className="font-black text-primary">
                    {isDaily ? selectedDateList.length : selectedMonths.length}{" "}
                    {isDaily ? "Days" : "Months"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border">
                  <ShieldCheck size={20} className="text-primary mt-0.5" />
                  <p className="text-[10px] text-slate-500 font-bold leading-tight">
                    Secure Booking: Your medical data is strictly confidential
                    and used only for matching.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
