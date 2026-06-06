"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { User, ShieldCheck, Activity, HeartPulse, Phone, Eye } from "lucide-react";
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
import { getApi, postApi } from "@/lib/apiHandler";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/hooks/useAuth";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
export default function BookingFormClient() {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("KE");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingFormData, setBookingFormData] = useState(null);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const id = searchParams.get("id");
  const router = useRouter();
  const {
    user
  } = useAuth();
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDateList, setSelectedDateList] = useState([]);
  const [previewMonth, setPreviewMonth] = useState(null);
  const [serviceFee, setServiceFee] = useState(0);
  const [planId, setPlanId] = useState(0);
  const {
    data: specData,
    isLoading: specLoading
  } = useFetch("/specialist");
  const {
    data,
    isLoading
  } = useFetch("/subscription-plan");
  useEffect(() => {
    if (data?.status === 200 && data?.data?.data.length > 0) {
      const individualPlan = data?.data?.data?.find(item => item.name === "Service Fee");
      if (individualPlan) {
        setServiceFee(parseFloat(individualPlan.price));
        setPlanId(individualPlan.id);
      }
    }
  }, [data]);
  const specialists = specData?.data?.data ?? [];
  const matchedSpecialist = useMemo(() => specialists.find(s => s.id === Number(id)), [specialists, id]);
  const pricingData = useMemo(() => {
    if (!matchedSpecialist) return null;
    const roleKeyMap = {
      "house-manager": "house_manager",
      nurse: "nurse",
      physiotherapist: "physiotherapist",
      "nurse-aide-or-assistant": "nurse_assistant",
      "special-need-caregivers": "special_need"
    };
    const key = roleKeyMap[matchedSpecialist.subRole];
    const nestedData = key ? matchedSpecialist[key] : null;
    if (nestedData && (nestedData.serviceFeeDay || nestedData.serviceFeeMonth)) {
      return nestedData;
    }
    return {
      serviceFeeDay: matchedSpecialist.serviceFeeDay,
      serviceFeeMonth: matchedSpecialist.serviceFeeMonth
    };
  }, [matchedSpecialist]);
  const monthlyRate = Number(pricingData?.serviceFeeMonth || 0);
  const dailyRate = Number(pricingData?.serviceFeeDay || 0);
  const availableDates = useMemo(() => {
    if (!matchedSpecialist?.schedule) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return matchedSpecialist?.schedule?.flatMap(s => s.date)?.filter(d => {
      const dateObj = new Date(d);
      dateObj.setHours(0, 0, 0, 0);
      return dateObj >= today;
    }) || [];
  }, [matchedSpecialist]);
  const hasSchedule = availableDates.length > 0;
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: {
      errors,
      isSubmitting
    }
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
      communication_type: "",
      instruction_level: "",
      communication_method: "",
      responds_to_name: "",
      consent: false
    }
  });
  const watchConditions = watch("patient_have_any_conditions");
  const watchMedication = watch("patient_currently_on_medication");
  const watchAllergy = watch("patient_have_any_known_allergies");
  const watchbooking_type = watch("booking_type");
  const isDaily = watchbooking_type === "daily";
  const isMonthly = watchbooking_type === "monthly";
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
      const next = current.includes(val) ? current.filter(v => v !== val) : [...current.filter(v => v !== "None"), val];
      onChange(next);
    }
  };
  const getDatesForMonth = monthKey => {
    return availableDates.filter(date => date.startsWith(monthKey));
  };
  const isDateDisabled = date => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !availableDates.includes(dateStr) || date < today;
  };
  const bookingAmount = useMemo(() => {
    if (isDaily) {
      return selectedDateList.length * dailyRate;
    }
    if (isMonthly) {
      return selectedMonths.length * monthlyRate;
    }
    return 0;
  }, [selectedDateList, selectedMonths, isDaily, isMonthly, dailyRate, monthlyRate]);
  const totalAmount = useMemo(() => {
    if (bookingAmount === 0) return 0;
    return bookingAmount + serviceFee;
  }, [bookingAmount, serviceFee]);
  const onSubmit = async data => {
    if (isSubmitting) return;
    const formDataToObject = formData => {
      const obj = {};
      formData.forEach((value, key) => {
        if (obj[key]) {
          if (Array.isArray(obj[key])) {
            obj[key].push(value);
          } else {
            obj[key] = [obj[key], value];
          }
        } else {
          obj[key] = value;
        }
      });
      return obj;
    };
    if (!data.consent) {
      toast.error("You must accept the condition before booking.");
      return;
    }
    if (!data.booking_type) {
      toast.error("You must select care duration before booking.");
      return;
    }
    if (isDaily && selectedDateList.length === 0 || isMonthly && selectedMonths.length === 0) {
      toast.error("Please select your schedule dates/months.");
      return;
    }
    const formData = new FormData();
    const scheduleItems = isDaily ? Object.values(selectedDateList.reduce((acc, date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const monthKey = `${year}-${month}`;
      const fullDate = `${year}-${month}-${day}`;
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          dates: []
        };
      }
      acc[monthKey].dates.push(fullDate);
      return acc;
    }, {})) : selectedMonths.map(month => ({
      month,
      dates: getDatesForMonth(month)
    }));
    if (matchedSpecialist) {
      formData.append("specialist_id", parseInt(matchedSpecialist?.id));
      formData.append("specialist_type", matchedSpecialist?.type);
    }
    Object.keys(data).forEach(key => {
      if (key === "patient_have_any_conditions" || key === "prescriptionFile" || key === "consent") return;
      if (key === "patient_currently_on_medication") {
        formData.append(key, data[key] === "yes" ? 1 : 0);
      } else if (key === "responds_to_name") {
        formData.append(key, data[key] === "Yes" ? 1 : 0);
      } else {
        formData.append(key, data[key]);
      }
    });
    data.patient_have_any_conditions.forEach(condition => {
      formData.append("patient_have_any_conditions[]", condition);
    });
    formData.append("booking_amount", totalAmount);
    scheduleItems.forEach((item, index) => {
      formData.append(`selected_dates_or_months[${index}][month]`, item.month);
      item?.dates?.forEach((date, i) => {
        formData.append(`selected_dates_or_months[${index}][dates][${i}]`, date);
      });
    });
    if (data.prescriptionFile) {
      formData.append("prescription_file", data.prescriptionFile);
    }
    const payloadObject = formDataToObject(formData);

    // console.log("Payload:", payloadObject);

    // for (let pair of formData.entries()) {
    //   console.log("payload", pair[0], pair[1]);
    // }

    setBookingFormData(formData);
    setPhoneNumber("");
    setIsPayModalOpen(true);
  };
  const handlePayment = async () => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      return toast.error("Enter valid phone number");
    }
    setIsProcessingPayment(true);
    setIsActionLoading(true);
    try {
const paymentRes = await postApi("/checkout", {
        phone: phoneNumber,
        plan_id: planId,
        specialist_id: parseInt(matchedSpecialist?.id),
        specialist_type: matchedSpecialist?.type,
        book_amount: bookingAmount
      });
      const checkoutId = paymentRes?.data?.checkout_id;
      if (!checkoutId) {
        throw new Error("Checkout failed");
      }
      toast.success("M-Pesa prompt sent!");
      const queryRes = await getApi(`/mpesa/query/${checkoutId}`);
      if (queryRes?.status === 200) {
        const bookingRes = await postApi("/booking", bookingFormData);
        if (bookingRes?.status === 200 || bookingRes?.status === 201) {
          toast.success("Booking confirmed successfully!");
          setIsPayModalOpen(false);
          router.push("/dashboard/book-history");
        }
      } else {
        toast.error("Payment not completed.");
      }
    }
    catch (error) {
      toast.error("Payment failed or cancelled.");
    } finally {
      setIsActionLoading(false);

      setIsProcessingPayment(false);
    }
  };
  if (specLoading) return <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>;
  return <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit, errors => {
        const firstError = Object.values(errors)[0];
        if (firstError?.message) {
          toast.error(firstError.message);
        } else {
          toast.error("Please complete all required fields before submitting.");
        }
      })} className="lg:col-span-2 space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              BOOKING FORM
            </h1>
          </div>

          {/* 1. Patient Details */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-white p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User size={20} className="text-primary" /> Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name of Patient *</Label>
                <Input {...register("patient_name", {
                required: "Patient name is required"
              })} placeholder="e. g. Full Name" />
                {errors.patient_name && <p className="text-xs text-red-500">
                    {errors.patient_name.message}
                  </p>}
              </div>
              <div className="space-y-2">
                <Label>Age *</Label>
                <Input type="number" min="0" onKeyDown={e => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()} {...register("patient_age", {
                required: "Age is required",
                min: 0
              })} placeholder="e. g. age" />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Controller name="patient_gender" control={control} rules={{
                required: "Gender is required"
              }} render={({
                field
              }) => <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                      {["Male", "Female", "Other"].map(g => <div key={g} className="flex items-center gap-1.5">
                          <RadioGroupItem className="cursor-pointer" value={g} id={`g-${g}`} />
                          <Label className="cursor-pointer" htmlFor={`g-${g}`}>
                            {g}
                          </Label>
                        </div>)}
                    </RadioGroup>} />
                {errors.patient_gender && <p className="text-xs text-red-500">
                    {errors.patient_gender.message}
                  </p>}
              </div>
              <div className="space-y-2">
                <Label>Relationship to person making booking *</Label>
                <Input {...register("relationship_to_booking_person", {
                required: "Relationship is required"
              })} placeholder="e.g. Son, Daughter" />
              </div>
            </CardContent>
          </Card>

          {/* 2. Health Information */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-white p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <HeartPulse size={20} className="text-primary" />
                Health & Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 space-y-8">
              <div className="space-y-4">
                <Label className="font-bold">
                  Does the patient have any of the following conditions? *
                </Label>
                <Controller name="patient_have_any_conditions" control={control} rules={{
                required: "Select at least one"
              }} render={({
                field
              }) => <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["None", "Diabetes", "Hypertension", "Asthma", "Heart disease", "Stroke history", "Cancer", "Epilepsy", "Mental health condition", "Mobility limitations", "others"].map(c => <div key={c} className="flex items-center gap-2 p-3 border rounded-xl">
                          <Checkbox className="cursor-pointer" id={c} checked={field.value.includes(c)} onCheckedChange={() => toggleCondition(c, field.value, field.onChange)} />
                          <Label htmlFor={c} className="text-xs cursor-pointer">
                            {c}
                          </Label>
                        </div>)}
                    </div>} />
                {watchConditions.includes("others") && <Input {...register("patient_have_any_others_conditions", {
                required: "Please specify"
              })} placeholder="Specify other condition" />}
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-bold">
                  Is the patient currently on medication? *
                </Label>
                <Controller name="patient_currently_on_medication" control={control} rules={{
                required: "Please select an option"
              }} render={({
                field
              }) => <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-8">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem className={"cursor-pointer"} value="yes" id="med-y" />
                        <Label className={"cursor-pointer"} htmlFor="med-y">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem className={"cursor-pointer"} value="no" id="med-n" />
                        <Label className={"cursor-pointer"} htmlFor="med-n">
                          No
                        </Label>
                      </div>
                    </RadioGroup>} />
                {errors.patient_currently_on_medication && <p className="text-xs text-red-500">
                    {errors.patient_currently_on_medication.message}
                  </p>}
                {watchMedication === "yes" && <div className="space-y-4 pt-2 animate-in fade-in">
                    <Textarea {...register("patient_currently_on_medication_data", {
                  required: "List medication or upload prescription"
                })} placeholder="List medications here..." />
                    <Controller name="prescriptionFile" control={control} render={({
                  field
                }) => <FileUpload title="Or upload prescription" file={field.value} onFileSelect={field.onChange} />} />
                  </div>}
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-bold">
                  Does the patient have any known allergies? *
                </Label>
                <Controller name="patient_have_any_known_allergies" control={control} rules={{
                required: "Please select an option"
              }} render={({
                field
              }) => <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
                      {["None", "Medication allergies", "Food allergies", "Other allergies"].map(a => <div key={a} className="flex items-center gap-2">
                          <RadioGroupItem className={"cursor-pointer"} value={a} id={`all-${a}`} />
                          <Label className={"cursor-pointer"} htmlFor={`all-${a}`}>
                            {a}
                          </Label>
                        </div>)}
                    </RadioGroup>} />
                {errors.patient_have_any_known_allergies && <p className="text-xs text-red-500">
                    {errors.patient_have_any_known_allergies.message}
                  </p>}
                {watchAllergy && watchAllergy !== "None" && <Input {...register("patient_have_any_known_allergies_details", {
                required: "Please specify allergy details"
              })} placeholder="Please specify details" />}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-white p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity size={20} className="text-primary" />
                Communication Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="px-8 space-y-8">
              <div className="space-y-4">
                <Label className="font-bold">Communication Type *</Label>
                <Controller name="communication_type" control={control} rules={{
                required: "Communication type is required"
              }} render={({
                field
              }) => <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                      {["Verbal", "Non-verbal"].map(type => <div key={type} className="flex items-center gap-2">
                          <RadioGroupItem className={"cursor-pointer"} value={type} id={`comm-${type}`} />
                          <Label htmlFor={`comm-${type}`} className="cursor-pointer">
                            {type}
                          </Label>
                        </div>)}
                    </RadioGroup>} />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-bold">Can Follow Instructions *</Label>
                <Controller name="instruction_level" control={control} rules={{
                required: "Instruction level is required"
              }} render={({
                field
              }) => <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-3">
                      {["1-step instructions", "2-step instructions"].map(step => <div key={step} className="flex items-center gap-2">
                            <RadioGroupItem className={"cursor-pointer"} value={step} id={`inst-${step}`} />
                            <Label htmlFor={`inst-${step}`} className="cursor-pointer">
                              {step}
                            </Label>
                          </div>)}
                    </RadioGroup>} />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-bold">
                  Primary Communication Method *
                </Label>
                <Controller name="communication_method" control={control} rules={{
                required: "Communication method is required"
              }} render={({
                field
              }) => <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Gestures", "PECS", "Communication device", "Words"].map(method => <div key={method} className="flex items-center gap-2">
                          <RadioGroupItem className={"cursor-pointer"} value={method} id={`method-${method}`} />
                          <Label htmlFor={`method-${method}`} className="cursor-pointer">
                            {method}
                          </Label>
                        </div>)}
                    </RadioGroup>} />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-bold">Responds to Name? *</Label>
                <Controller name="responds_to_name" control={control} rules={{
                required: "Please select an option"
              }} render={({
                field
              }) => <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                      {["Yes", "No"].map(val => <div key={val} className="flex items-center gap-2">
                          <RadioGroupItem className={"cursor-pointer"} value={val} id={`name-${val}`} />
                          <Label htmlFor={`name-${val}`} className="cursor-pointer">
                            {val}
                          </Label>
                        </div>)}
                    </RadioGroup>} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-white p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity size={20} className="text-primary" />
                Mobility & Care Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 space-y-8">
              <div className="space-y-4">
                <Label className="font-bold">
                  Mobility status of patient *
                </Label>
                <Controller name="mobility_status_of_patient" control={control} rules={{
                required: "mobility is required"
              }} render={({
                field
              }) => <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-3">
                      {["Fully mobile", "Needs assistance", "Wheelchair-bound", "Bedridden"].map(m => <div key={m} className="flex items-center gap-2 p-3 border rounded-lg">
                          <RadioGroupItem className={"cursor-pointer"} value={m} id={m} />
                          <Label className={"cursor-pointer"} htmlFor={m}>
                            {m}
                          </Label>
                        </div>)}
                    </RadioGroup>} />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-bold flex items-center gap-2">
                  Location of care *
                </Label>
                <Controller name="location_of_care" control={control} rules={{
                required: "Location is required"
              }} render={({
                field
              }) => <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                      {["Private home", "Hospital", "Hospice facility"].map(l => <div key={l} className="flex items-center gap-2">
                            <RadioGroupItem className={"cursor-pointer"} value={l} id={l} />
                            <Label className={"cursor-pointer"} htmlFor={l}>
                              {l}
                            </Label>
                          </div>)}
                    </RadioGroup>} />
              </div>

              <div className="space-y-4">
                <Label className="font-bold">Care duration *</Label>
                <Controller name="booking_type" control={control} rules={{
                required: "care duration Required"
              }} render={({
                field
              }) => <RadioGroup onValueChange={val => {
                field.onChange(val);
              }} value={field.value} className="flex flex-wrap gap-4">
                      {[{
                  label: "Live-in",
                  value: "monthly"
                }, {
                  label: "Daily",
                  value: "daily"
                }].map(d => <div key={d.value} className="flex items-center gap-2">
                          <RadioGroupItem className={"cursor-pointer"} value={d.value} id={`dur-${d.value}`} />
                          <Label className={"cursor-pointer"} htmlFor={`dur-${d.value}`}>
                            {d.label}
                          </Label>
                        </div>)}
                    </RadioGroup>} />

                {errors.booking_type && <p className="text-xs text-red-500">
                    {errors.booking_type.message}
                  </p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => {
                setValue("booking_type", "monthly");
                setSelectedMonths([]);
                setSelectedDateList([]);
              }} className={`p-6 rounded-2xl border-2 cursor-pointer ${isMonthly ? "border-primary bg-primary/5" : "border-slate-100"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Live-in Plan
                  </p>
                  <div className="text-xl font-bold">
                    KES {monthlyRate.toLocaleString()}
                  </div>
                </div>

                <div onClick={() => {
                setValue("booking_type", "daily");
                setSelectedMonths([]);
                setSelectedDateList([]);
              }} className={`p-6 rounded-2xl border-2 cursor-pointer ${isDaily ? "border-primary bg-primary/5" : "border-slate-100"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Daily Plan
                  </p>
                  <div className="text-xl font-bold">
                    KES {dailyRate.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
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
               </div> */}

              {isDaily && <>
                  {!hasSchedule ? <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-lg font-semibold text-slate-500">
                        No available dates for this specialist.
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Please select another specialist.
                      </p>
                    </div> : <div className="flex justify-center p-6 bg-slate-50 rounded-2xl">
                      <Calendar mode="multiple" selected={selectedDateList} onSelect={setSelectedDateList} disabled={isDateDisabled} className="bg-white border rounded-xl w-full cursor-pointer" />
                    </div>}
                </>}

              {isMonthly && <>
                  {!hasSchedule ? <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-lg font-semibold text-slate-500">
                        No available month for this specialist.
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        Please select another specialist.
                      </p>
                    </div> : <div className="space-y-4">
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {Array.from({
                    length: 12
                  }).map((_, i) => {
                    const monthNumber = String(i + 1).padStart(2, "0");
                    const monthKey = `2026-${monthNumber}`;
                    const displayDate = new Date(2026, i, 1);
                    const monthLabel = displayDate.toLocaleString("default", {
                      month: "long"
                    });
                    const hasAvailability = availableDates.some(d => d.startsWith(monthKey));
                    const isSelected = selectedMonths.includes(monthKey);
                    return <div key={monthKey} className="relative group">
                              <button type="button" disabled={!hasAvailability} onClick={() => {
                        const newMonths = isSelected ? selectedMonths.filter(m => m !== monthKey) : [...selectedMonths, monthKey];
                        setSelectedMonths(newMonths);
                        // setBookingAmount(newMonths.length * monthlyRate);
                      }} className={`w-full py-4 px-2 rounded-lg border flex flex-col cursor-pointer items-center transition-all shadow-sm ${isSelected ? "bg-primary border-primary text-white ring-2 ring-primary ring-offset-1" : "bg-white border-slate-200 hover:border-primary text-slate-700"} ${!hasAvailability && "opacity-25 cursor-not-allowed bg-slate-50"}`}>
                                <span className="text-sm font-bold">
                                  {monthLabel}
                                </span>
                                <span className={`text-[10px] mt-1 font-medium ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                                  {hasAvailability ? "Available" : "Unavailable"}
                                </span>
                              </button>

                              {hasAvailability && <button type="button" title="Preview available days" onClick={e => {
                        e.stopPropagation();
                        setPreviewMonth(monthKey);
                      }} className="absolute -top-1 -right-1 bg-primary cursor-pointer text-white p-1.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform z-10">
                                  <span role="img" aria-label="view" className="text-[12px] cursor-pointer">
                                    <Eye />
                                  </span>
                                </button>}
                            </div>;
                  })}
                      </div>

                      {previewMonth && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
                          <Card className="w-full max-w-sm animate-in fade-in zoom-in duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                              <CardTitle className="text-lg font-bold">
                                {new Date(previewMonth + "-02").toLocaleString("default", {
                          month: "long",
                          year: "numeric"
                        })}
                              </CardTitle>
                              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" onClick={() => setPreviewMonth(null)} isActionLoading={isActionLoading}>
                                ✕
                              </Button>
                            </CardHeader>
                            <CardContent className="pt-6">
                              <div className="flex justify-center">
                                <Calendar mode="multiple" month={new Date(previewMonth + "-02")} disableNavigation selected={availableDates.filter(d => d.startsWith(previewMonth)).map(d => new Date(d + "T00:00:00"))} disabled={date => isDateDisabled(date)} className="rounded-md border pointer-events-none" />
                              </div>
                              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-md">
                                <div className="w-3 h-3 bg-primary rounded-sm" />
                                <span>
                                  Highlighted days are available for care.
                                </span>
                              </div>
                              <Button className="w-full mt-6" onClick={() => setPreviewMonth(null)} isActionLoading={isActionLoading}>
                                Got it
                              </Button>
                            </CardContent>
                          </Card>
                        </div>}
                    </div>}
                </>}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b bg-white p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone size={20} className="text-primary" />
                Emergency & Logistics
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Emergency Contact Name *</Label>
                  <Input {...register("emergency_contact_name", {
                  required: "Emergency Contant name is required"
                })} placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Phone *</Label>
                  <Controller name="emergency_contact_number" control={control} rules={{
                  required: "Emergency contact phone is required",
                  validate: value => isValidPhoneNumber(value || "") || "Invalid phone number"
                }} render={({
                  field
                }) => <PhoneInputWithCountrySelect international defaultCountry="KE"
                // defaultCountry={country}
                // onCountryChange={(c) => setCountry(c)}
                value={field.value} onChange={field.onChange} className="w-full border rounded-md px-3 py-2" />} />

                  {watch("emergency_contact_number") && !isValidPhoneNumber(watch("emergency_contact_number")) && <p className="text-red-500 text-xs font-bold">
                        Invalid phone number
                      </p>}
                </div>
                <div className="space-y-2">
                  <Label>Primary Doctor Name *</Label>
                  <Input {...register("primary_doctor_name", {
                  required: "Primary Doctor name is required"
                })} placeholder="Doctor's Name" />
                </div>
                <div className="space-y-2">
                  <Label>Primary Doctor Contact *</Label>
                  <Controller name="primary_doctor_number" control={control} rules={{
                  required: "Primary doctor phone is required",
                  validate: value => isValidPhoneNumber(value || "") || "Invalid phone number"
                }} render={({
                  field
                }) => <PhoneInputWithCountrySelect international defaultCountry={country} onCountryChange={c => setCountry(c)} value={field.value} onChange={field.onChange} className="w-full border rounded-md px-3 py-2" />} />

                  {watch("primary_doctor_number") && !isValidPhoneNumber(watch("primary_doctor_number")) && <p className="text-red-500 text-xs font-bold">
                        Invalid phone number for {country}
                      </p>}
                </div>
                {/* <div className="space-y-2">
                  <Label>Phone Number</Label>
                    <div className="w-full mt-2">
                    <PhoneInputWithCountrySelect
                      className="w-full border rounded-md px-3 py-2"
                      international
                      defaultCountry={country}
                      value={data?.phone}
                      onChange={(value) => {
                        setData((prev) => ({ ...prev, phone: value || "" }));
                      }}
                      onCountryChange={(countryCode) => {
                        setCountry(countryCode);
                        const exampleNumber = countryCode
                          ? getExampleNumber(countryCode)
                          : null;
                        if (exampleNumber) {
                          setData((prev) => ({
                            ...prev,
                            phone: `+${exampleNumber.countryCallingCode}`,
                          }));
                        } else {
                          setData((prev) => ({ ...prev, phone: "" }));
                        }
                      }}
                    />
                  </div>
                    {data?.phone && !isValidPhoneNumber(data?.phone) && (
                    <p className="text-red-500 text-sm mt-1">
                      Invalid phone number for selected country
                    </p>
                  )}
                 </div> */}
                <div className="md:col-span-2 space-y-2">
                  <Label>Primary Hospital *</Label>
                  <Input {...register("primary_hospital", {
                  required: "Primary hospital name is required"
                })} placeholder="Hospital Name" />
                </div>
              </div>

              <Controller name="consent" control={control} rules={{}} render={({
              field
            }) => <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <Checkbox id="confirm" checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                    <Label htmlFor="confirm" className="text-xs text-emerald-800 font-medium leading-relaxed cursor-pointer">
                      I confirm that the information provided is accurate and
                      consent to Cervanna using this information solely for care
                      matching and service delivery.
                    </Label>
                  </div>} />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting} className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 cursor-pointer" isActionLoading={isActionLoading}>
            {isSubmitting ? "Processing..." : "Go To Checkout"}
          </Button>
        </form>

        {/* SIDEBAR SUMMARY */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-4">
            <Card className="border-none shadow-2xl rounded-lg overflow-hidden bg-white ring-1 ring-slate-100">
              <div className="bg-primary p-10 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Estimated Amount
                </p>
                <div className="text-5xl font-black">
                  KES {totalAmount.toLocaleString()}
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
                    {watchbooking_type ? watchbooking_type === "daily" ? "Daily" : "Live-in" : "--"}
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
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase">
                    Plan Cost
                  </span>
                  <span className="font-black text-slate-900">
                    KES {bookingAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase">
                    Service Fee
                  </span>
                  <span className="font-black text-slate-900">
                    KES {serviceFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-base pt-3 border-t font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    KES {totalAmount.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border">
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

        <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 border-none bg-white overflow-hidden">
            <div className="bg-primary p-8 text-white text-center">
              <DialogTitle className="text-2xl font-black">
                M-Pesa Checkout
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Enter your number to initiate payment.
              </DialogDescription>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">
                  Enter M-Pesa Number
                </label>

                <PhoneInputWithCountrySelect className="w-full flex border rounded-2xl px-4 py-3 bg-slate-50" international defaultCountry={country} value={phoneNumber} onChange={value => setPhoneNumber(value || "")} onCountryChange={countryCode => setCountry(countryCode || "KE")} />

                {phoneNumber && !isValidPhoneNumber(phoneNumber) && <p className="text-red-500 text-xs font-bold">
                    Invalid phone number for {country}
                  </p>}
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border flex justify-between">
                <span className="text-xs font-black text-slate-400">
                  TOTAL:
                </span>
                <span className="text-2xl font-black text-primary">
                  KES {totalAmount.toLocaleString()}
                </span>
              </div>

              <Button onClick={handlePayment} disabled={isProcessingPayment || phoneNumber !== "" && !isValidPhoneNumber(phoneNumber)} className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase cursor-pointer" isActionLoading={isActionLoading}>
                {isProcessingPayment ? "Requesting..." : "Confirm & Pay"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
}