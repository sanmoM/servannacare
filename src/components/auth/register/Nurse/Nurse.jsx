"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Progress from "../Progress";
import { useForm } from "react-hook-form";
import NurseBasicInfo from "./NurseBasicInfo";
import Education from "./Education";
import Exprience from "./Exprience";
import SkillServices from "./SkillServices";

const Nurse = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log("Final Submitted Data:", data);
      alert("Form successfully submitted!");
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
        <h2 className="text-2xl mb-4 font-semibold text-center text-gray-900">
          Nurse Registration
        </h2>

        <Progress currentStep={step} totalSteps={totalSteps} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
          {step === 1 && <NurseBasicInfo />}
          {step === 2 && <Education />}
          {step === 3 && <Exprience />}
          {step === 4 && <SkillServices />}

          <div className="flex justify-between mt-6">
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

export default Nurse;
