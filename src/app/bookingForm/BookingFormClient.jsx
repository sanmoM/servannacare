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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { postApi } from "@/lib/apiHandler";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function BookingFormClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const id = searchParams.get("id");
  const router = useRouter();
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
    },
  });
  const conditions = watch("conditions") || [];

  const watchMedication = watch("onMedication");
  const allergies = watch("allergies") || [];
  const careType = watch("careFrequency");

  const onSubmit = async (data) => {
    console.log(data);
    const payload = {
      specialist_id: id,
      patient_name: data?.patientName,
      patient_age: data?.age,
      patient_gender: data?.gender,
      relationship_to_booking_person: data?.relationship,
      price_id: 2,
      booking_amount: 1000,
      patient_have_any_conditions: data?.conditions,
      patient_currently_on_medication: data?.onMedication,
      patient_currently_on_medication_data: data?.medications,
      patient_have_any_known_allergies: data?.allergyType,
      patient_have_any_known_allergies_details: data?.allergyDetails,
      mobility_status_of_patient: data?.mobility,
      // care_start_date: data?.startDate,
      // care_end_date: data?.endDate,
      // care_start_date: data?.startMonth,
      // care_end_date: data?.endMonth,

      care_start_date:
        data?.careFrequency === "daily" ? data?.startDate : data?.startMonth,
      care_end_date:
        data?.careFrequency === "daily" ? data?.endDate : data?.endMonth,

      location_of_care: data?.location,
      emergency_contact_name: data?.emergencyName,
      emergency_contact_number: data?.emergencyPhone,
      primary_doctor_name: data?.doctorName,
      primary_doctor_number: data?.doctorContact,
      primary_hospital: data?.hospital,
    };
    console.log("payload",payload)
    try {
      const res = await postApi("/booking", payload);

      if (res?.status === 200) {
        toast.success("Booking Successfully!");
        console.log("response", res);
        router.push("/specialist");
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
      className="max-w-4xl mx-auto space-y-8"
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
              rules={{ required: "Please select care frequency" }}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                </RadioGroup>
              )}
            />

            {/* Start and End Date / Month */}
            {watch("careFrequency") && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Care Start */}
                {watch("careFrequency") === "daily" ? (
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: "Please select start date" }}
                    render={({ field }) => (
                      <div className="space-y-1">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {errors.startDate && (
                          <p className="text-sm text-red-500">
                            {errors.startDate.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                ) : (
                  <Controller
                    name="startMonth"
                    control={control}
                    rules={{ required: "Please select start month" }}
                    render={({ field }) => (
                      <div className="space-y-1">
                        <Label>Start Month</Label>
                        <Input
                          type="month"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {errors.startMonth && (
                          <p className="text-sm text-red-500">
                            {errors.startMonth.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                )}

                {/* Care End */}
                {watch("careFrequency") === "daily" ? (
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{ required: "Please select end date" }}
                    render={({ field }) => (
                      <div className="space-y-1">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {errors.endDate && (
                          <p className="text-sm text-red-500">
                            {errors.endDate.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                ) : (
                  <Controller
                    name="endMonth"
                    control={control}
                    rules={{ required: "Please select end month" }}
                    render={({ field }) => (
                      <div className="space-y-1">
                        <Label>End Month</Label>
                        <Input
                          type="month"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {errors.endMonth && (
                          <p className="text-sm text-red-500">
                            {errors.endMonth.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                )}
              </div>
            )}

            <Label>Care duration::</Label>
            <RadioGroup className="grid md:grid-cols-3 gap-2">
              {["Hourly", "Daily", "Overnight", "Live-in", "Long-term"].map(
                (d) => (
                  <div key={d} className="flex items-center gap-2">
                    <RadioGroupItem value={d} {...register("duration")} />
                    <Label>{d}</Label>
                  </div>
                ),
              )}
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
