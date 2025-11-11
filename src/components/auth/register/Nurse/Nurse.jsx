"use client";

import React, { useState } from "react";
import Progress from "../Progress";
import NurseBasicInfo from "./NurseBasicInfo";
import Education from "./Education";
import Exprience from "./Exprience";
import SkillServices from "./SkillServices";
import DocumentUploads from "./DocumentUploads";
import ContactAgreement from "./ContactAgreement";
import toast from "react-hot-toast";

const Nurse = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [formData, setFormData] = useState({
    basicInfo: {},
    education: {},
    exprience: {},
    skillsServices: {},
    documents: {},
    constactAgrement: {},
  });

  const handleNext = (dataForStep) => {
    if(step === 1)
      setFormData((prev) => ({...prev, basicInfo:dataForStep}));
    
    if(step === 2)
      setFormData((prev) => ({...prev, education:dataForStep}));

    if(step === 3)
      setFormData((prev) => ({...prev,exprience:dataForStep}));

    if(step === 4)
      setFormData((prev) => ({...prev,skillsServices:dataForStep}));

    if(step === 5)
      setFormData((prev) => ({...prev,documents:dataForStep}));

    if(step === 6)
      setFormData((prev) => ({...prev,constactAgrement:dataForStep}));

   if (step < totalSteps){
    setStep(step+1);
   }else{
    toast.success("Register Sucessfully!")
    setStep(1);
    setFormData({basicInfo:{}, education:{}, exprience:{},skillsServices:{},documents:{}, constactAgrement:{} })
   }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full flex justify-center  px-2">
      <div className="w-full  max-w-[700px] bg-white">
        {/* Header */}
        <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900">
          Nurse Registration
        </h2>

        <Progress currentStep={step} totalSteps={totalSteps} />

        <div  className="space-y-8 mt-6">
          {step === 1 && <NurseBasicInfo defaultValues={formData.basicInfo} onNext={handleNext} />}
          {step === 2 && <Education />}
          {step === 3 && <Exprience />}
          {step === 4 && <SkillServices />}
          {step === 5 && <DocumentUploads />}
          {step === 6 && <ContactAgreement />}

          {/* <div className="flex justify-between mt-6">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Nurse;
