"use client";

import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { postApi } from "@/lib/apiHandler";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import useLocalUser from "@/hooks/useLocalUser";
import { Calendar } from "@/components/ui/calendar";

export default function BookingFormClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const id = searchParams.get("id");
  const router = useRouter();
  const [bookingAmount, setBookingAmount] = useState(0);

  const [price, setPrice] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const [selectedMonths, setSelectedMonths] = useState([]);
  const [previewMonth, setPreviewMonth] = useState(null);
  const [selectedDateList, setSelectedDateList] = useState([]);

  const {
    data: specialistData,
    isLoading: specialistLoading,
    error: specialistError,
  } = useFetch("/specialist");

  const {
    data: priceData,
    isLoading: priceLoading,
    error: priceError,
  } = useFetch("/price");

  const specialists = specialistData?.data?.data ?? [];
  const prices = priceData?.data?.data ?? [];

  const matchedData = specialists.find(
    (item) =>
      item.id === Number(id) &&
      item.subRole?.toLowerCase() === category?.toLowerCase(),
  );
  console.log("price", prices);
  console.log("matchedData", matchedData?.schedule);

  const availableDates = matchedData?.schedule?.flatMap((s) => s.date) || [];

  const isDateDisabled = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedLocalDate = `${year}-${month}-${day}`;

    const isAvailable = availableDates.includes(formattedLocalDate);
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

    return !isAvailable || isPast;
  };
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      conditions: [],
      allergies: [],
      selectedDays: [],
    },
  });

  const conditions = watch("conditions") || [];

  const watchMedication = watch("onMedication");
  const allergies = watch("allergies") || [];
  const careType = watch("careFrequency");
  const selectedDays = watch("selectedDays") || [];
  const isDaily = selectedPrice?.name?.toLowerCase() === "daily";
  const isMonthly = selectedPrice?.name?.toLowerCase() === "monthly";
  const isSelectedDays =
    selectedPrice?.name?.toLowerCase().replace(/\s+/g, "") === "selecteddays";

  const calculateDays = (start, end) => {
    const diffTime = endDate - startDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateMonths = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1
    );
  };

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const startMonth = watch("startMonth");
  const endMonth = watch("endMonth");

  useEffect(() => {
    if (selectedPrice && selectedDateList.length > 0) {
      setBookingAmount(selectedDateList.length * selectedPrice.price);
    } else {
      setBookingAmount(0);
    }
  }, [selectedDateList, selectedPrice]);

  const getAvailabilityInMonth = (monthStr) => {
    return availableDates.some((date) => date.startsWith(monthStr));
  };

  const toggleMonth = (monthStr) => {
    if (selectedMonths.includes(monthStr)) {
      setSelectedMonths((prev) => prev.filter((m) => m !== monthStr));
    } else {
      setSelectedMonths((prev) => [...prev, monthStr]);
    }
  };

  useEffect(() => {
    if (isMonthly && selectedPrice) {
      setBookingAmount(selectedMonths.length * selectedPrice.price);
    }
  }, [selectedMonths, isMonthly, selectedPrice]);

  if (specialistLoading || priceLoading) return <LoadingSpinner />;
  if (specialistError || priceError) return <div>Error loading data</div>;

  const onSubmit = async (data) => {
    const payload = {
      specialist_id: id,
      patient_name: data?.patientName,
      patient_age: data?.age,
      patient_gender: data?.gender,
      relationship_to_booking_person: data?.relationship,
      price_id: selectedPrice?.id,
      selected_days: isSelectedDays ? selectedDays : null,
      booking_amount: bookingAmount,

      patient_have_any_conditions: data?.conditions,
      patient_currently_on_medication: data?.onMedication,
      patient_currently_on_medication_data: data?.medications,
      patient_have_any_known_allergies: data?.allergyType,
      patient_have_any_known_allergies_details: data?.allergyDetails,
      mobility_status_of_patient: data?.mobility,
      care_start_date: isDaily ? startDate : startMonth,
      care_end_date: isDaily ? endDate : endMonth,

      location_of_care: data?.location,
      emergency_contact_name: data?.emergencyName,
      emergency_contact_number: data?.emergencyPhone,
      primary_doctor_name: data?.doctorName,
      primary_doctor_number: data?.doctorContact,
      primary_hospital: data?.hospital,
    };
    try {
      const res = await postApi("/booking", payload);

      if (res?.status === 200) {
        toast.success("Booking Successfully!");
        console.log("response", res);
        router.push("/dashboard/my-appointment");
      } else {
        toast.error(
          res?.data?.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message || `Error: ${error.response.status}`,
        );
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-8 my-12"
    >
      <Card className="shadow-xl border-muted">
        <CardHeader>
          <CardTitle className="text-2xl">Booking Questions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* 1. Patient Details */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">
              1. Patient / Care Recipient Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label>
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("patientName", {
                    required: "Full name is required",
                  })}
                  placeholder="Enter patient's full name"
                />
                {errors.patientName && (
                  <p className="text-sm text-red-500">
                    {errors.patientName.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label>
                  Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  {...register("age", {
                    required: "age is required",
                  })}
                  placeholder="Enter patient's age"
                />
                {errors.age && (
                  <p className="text-sm text-red-500">{errors.age.message}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label>
                  Gender <span className="text-red-500">*</span>
                </Label>

                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="others" id="others" />
                        <Label htmlFor="others">Others</Label>
                      </div>
                    </RadioGroup>
                  )}
                />

                {errors.gender && (
                  <p className="text-sm text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>
                  Relationship to Booker <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("relationship", {
                    required: "Relationship is required",
                  })}
                  placeholder="Enter Patient's Relation"
                />
                {errors.relationship && (
                  <p className="text-sm text-red-500">
                    {errors.relationship.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* 2. Health Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">
              2. Health & Medical Information
            </h3>

            {[
              "Diabetes",
              "Hypertension",
              "Asthma",
              "Heart disease",
              "Stroke history",
              "Cancer",
              "Epilepsy",
              "Mental health condition",
              "Mobility limitations",
              "others",
            ].map((condition) => (
              <Controller
                key={condition}
                name="conditions"
                control={control}
                render={({ field }) => {
                  const checked = field.value?.includes(condition);

                  return (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          if (isChecked) {
                            field.onChange([...field.value, condition]);
                          } else {
                            field.onChange(
                              field.value.filter((v) => v !== condition),
                            );
                          }
                        }}
                      />
                      <Label className="capitalize">{condition}</Label>
                    </div>
                  );
                }}
              />
            ))}

            {conditions.includes("others") && (
              <Input
                placeholder="Other condition (specify)"
                {...register("otherCondition", {
                  required: "Please specify other condition",
                })}
              />
            )}
          </section>

          <Separator />

          {/* 3. Medication & Allergies */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">3. Medication & Allergies</h3>

            <section className="space-y-4">
              <Label className="font-medium">
                Is the patient currently on medication?
                <span className="text-red-500"> *</span>
              </Label>

              <Controller
                name="onMedication"
                control={control}
                rules={{ required: "Please select an option" }}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="med-yes" />
                      <Label htmlFor="med-yes">Yes</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="med-no" />
                      <Label htmlFor="med-no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />

              {errors.onMedication && (
                <p className="text-sm text-red-500">
                  {errors.onMedication.message}
                </p>
              )}

              {watch("onMedication") === "yes" && (
                <Controller
                  name="medications"
                  control={control}
                  rules={{ required: "Please list the medications" }}
                  render={({ field }) => (
                    <Textarea placeholder="List medications" {...field} />
                  )}
                />
              )}
            </section>

            <section className="space-y-4">
              <Label className="font-medium">
                Does the patient have any known allergies?
                <span className="text-red-500"> *</span>
              </Label>

              <Controller
                name="allergyType"
                control={control}
                rules={{ required: "Please select an option" }}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="none" id="allergy-none" />
                      <Label htmlFor="allergy-none">None</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="medication"
                        id="allergy-medication"
                      />
                      <Label htmlFor="allergy-medication">
                        Medication allergies (please specify)
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="food" id="allergy-food" />
                      <Label htmlFor="allergy-food">
                        Food allergies (please specify)
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="other" id="allergy-other" />
                      <Label htmlFor="allergy-other">
                        Other allergies (please specify)
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />

              {errors.allergyType && (
                <p className="text-sm text-red-500">
                  {errors.allergyType.message}
                </p>
              )}

              {watch("allergyType") && watch("allergyType") !== "none" && (
                <Input
                  placeholder={`Specify ${watch("allergyType")} allergies`}
                  {...register("allergyDetails", {
                    required: "Please specify the allergy details",
                  })}
                />
              )}
            </section>
          </section>

          <Separator />

          {/* 5. Mobility */}
          <section className="space-y-3">
            <Label>
              Mobility status of patient:{" "}
              <span className="text-red-500">*</span>
            </Label>

            <Controller
              name="mobility"
              control={control}
              rules={{ required: "mobility is required" }}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fully-mobile" id="fully-mobile" />
                    <Label htmlFor="fully-mobile">Fully mobile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="needs-assistance"
                      id="needs-assistance"
                    />
                    <Label htmlFor="needs-assistance">Needs assistance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="wheelchair-bound"
                      id="wheelchair-bound"
                    />
                    <Label htmlFor="wheelchair-bound">Wheelchair Bound</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Bedridden" id="Bedridden" />
                    <Label htmlFor="Bedridden">Bedridden</Label>
                  </div>
                </RadioGroup>
              )}
            />

            {errors.mobility && (
              <p className="text-sm text-red-500">{errors.mobility.message}</p>
            )}
          </section>

          <Separator />

          {/* 6. Care Schedule */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">
              6. Care Schedule & Environment
            </h3>

            <Controller
              name="careFrequency"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    const priceObj = prices.find((p) => String(p.id) === value);
                    setSelectedPrice(priceObj);
                    // Reset selections when switching modes
                    setSelectedMonths([]);
                    setSelectedDateList([]);
                    setBookingAmount(0);
                  }}
                  className="flex gap-6 mb-6"
                >
                  {prices.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={String(item.id)}
                        id={`price-${item.id}`}
                      />
                      <Label
                        htmlFor={`price-${item.id}`}
                        className="cursor-pointer"
                      >
                        {item.name} (KES {item.price})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />

            {isDaily && (
              <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col items-center">
                <Label className="mb-4 font-medium text-slate-600">
                  Select specific days for care
                </Label>
                <Calendar
                  mode="multiple"
                  selected={selectedDateList}
                  onSelect={(dates) => {
                    setSelectedDateList(dates || []);
                    const count = dates ? dates.length : 0;
                    setBookingAmount(count * (selectedPrice?.price || 0));
                  }}
                  disabled={(date) => isDateDisabled(date)}
                  modifiers={{ available: (date) => !isDateDisabled(date) }}
                  modifiersStyles={{
                    available: { fontWeight: "bold", color: "#72275b" ,cursor:"pointer" },
                  }}
                  className="rounded-md border cursor-pointer"
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
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
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
                          <span>Highlighted days are available for care.</span>
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

            {bookingAmount > 0 && (
              <div className="p-4 bg-primary/10 border-2 border-primary rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-primary uppercase">
                    Current Selection
                  </p>
                  <p className="text-slate-600 text-xs">
                    {isDaily
                      ? `${selectedDateList.length} days selected`
                      : `${selectedMonths.length} months selected`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">
                    KES {bookingAmount}
                  </p>
                </div>
              </div>
            )}

            <Label>Care duration::</Label>
            <RadioGroup className="grid md:grid-cols-3 gap-2">
              {/* {["Hourly", "Daily", "Overnight", "Live-in", "Long-term"].map( */}
              {["Daily", "Live-in"].map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <RadioGroupItem value={d} {...register("duration")} />
                  <Label>{d}</Label>
                </div>
              ))}
            </RadioGroup>

            <Label>Location of care:</Label>
            <RadioGroup className="flex gap-6">
              {["Private home", "Hospital", "Hospice facility"].map((loc) => (
                <div key={loc} className="flex items-center gap-2">
                  <RadioGroupItem value={loc} {...register("location")} />
                  <Label>{loc}</Label>
                </div>
              ))}
            </RadioGroup>
          </section>

          <Separator />

          {/* 7. Emergency */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">7. Emergency & Consent</h3>

            {/* Emergency Contact Name */}
            <div className="space-y-1">
              <Label>
                Emergency Contact Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter emergency contact name"
                {...register("emergencyName", {
                  required: "Emergency contact name is required",
                })}
              />
              {errors.emergencyName && (
                <p className="text-sm text-red-500">
                  {errors.emergencyName.message}
                </p>
              )}
            </div>

            {/* Emergency Contact Phone */}
            <div className="space-y-1">
              <Label>
                Emergency Contact Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="Enter emergency contact phone"
                {...register("emergencyPhone", {
                  required: "Emergency contact phone is required",
                })}
              />
              {errors.emergencyPhone && (
                <p className="text-sm text-red-500">
                  {errors.emergencyPhone.message}
                </p>
              )}
            </div>

            {/* Primary Doctor Name & Contact */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Doctor Name */}
              <div className="space-y-1">
                <Label>
                  Primary Doctor Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter primary doctor's name"
                  {...register("doctorName", {
                    required: "Doctor's name is required",
                  })}
                />
                {errors.doctorName && (
                  <p className="text-sm text-red-500">
                    {errors.doctorName.message}
                  </p>
                )}
              </div>

              {/* Doctor Contact */}
              <div className="space-y-1">
                <Label>
                  Primary Doctor Contact <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter doctor's contact"
                  {...register("doctorContact", {
                    required: "Doctor's contact is required",
                    pattern: {
                      value: /^[0-9]{7,15}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />

                {errors.doctorContact && (
                  <p className="text-sm text-red-500">
                    {errors.doctorContact.message}
                  </p>
                )}
              </div>
            </div>

            {/* Primary Hospital */}
            <div className="space-y-1">
              <Label>
                Primary Hospital <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter primary hospital name"
                {...register("hospital", {
                  required: "Primary hospital is required",
                })}
              />
              {errors.hospital && (
                <p className="text-sm text-red-500">
                  {errors.hospital.message}
                </p>
              )}
            </div>
          </section>

          {/* 8. Consent */}
          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <Controller
                name="consent"
                control={control}
                rules={{ required: "You must agree to proceed" }}
                render={({ field }) => (
                  <Label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      I confirm that the information provided is accurate and
                      consent to Cervanna using this information solely for care
                      matching and service delivery.
                    </span>
                  </Label>
                )}
              />

              {errors.consent && (
                <p className="text-sm text-red-500">{errors.consent.message}</p>
              )}
            </div>
            {errors.consent && (
              <p className="text-sm text-red-500">{errors.consent.message}</p>
            )}
          </section>

          <Button type="submit" className="w-full text-lg cursor-pointer">
            Submit Booking
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
