"use client";

import { Button } from "@/components/ui/button";

import React, { useState } from "react";
import Progress from "../Progress";
import { useForm } from "react-hook-form";
import BasicInfo from "./BasicInfo";
import AdditionalDetails from "./AdditionalDetails";
import DocumentUploads from "./DocumentUploads";
import toast from "react-hot-toast";

const HouseManager = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log("Final Submitted Data:", data);
      toast.success("Register Successfully!");
      reset();
      setStep(1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full flex justify-center  px-2">
      <div className="w-full  max-w-[700px] bg-white">
        {/* Header */}
        <h2 className="text-xl mb-6 font-semibold text-center text-gray-900">
          Continue as Nanny/Housekeeper
        </h2>

        <Progress currentStep={step} totalSteps={totalSteps} />

        <form  onSubmit={handleSubmit(onSubmit)} className="space-y-7 mt-6">
          {step === 1 && <BasicInfo  />}
          {step === 2 && <AdditionalDetails />}
          {step === 3 && <DocumentUploads  />}

          {/* Submit */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}
            <Button type="submit" size="lg">
              {step === totalSteps ? "Submit" : "Next"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseManager;
