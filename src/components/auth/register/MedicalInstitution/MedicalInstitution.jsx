"use clinet"



import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Progress from '../Progress';
import SignUpStart from '../SignUpStart';
import BasicInfo from './BasicInfo';
import { useRouter } from 'next/navigation';

const MedicalInstitution = () => {
    const [started, setStarted] = useState(false);
    const router = useRouter;
    const [step,setstep] = useState(1);
    const [user,setUser] = useState({})
    const totalSteps = 5;
    const [formData,setFormData] = useState({
        basicInfo:{},
    });

    const handleSignupSuccess = (accountData) => {
        setStarted(true)
        setUser(accountData);
    }

    const handleNext = (dataForStep) => {
        if(step === 1)
            setFormData((prev) => ({...prev,basicInfo:dataForStep}));

        if(step < totalSteps) {
            setstep(step+1)
        }else {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    user
                })
            )
            toast.success("Register Successfully!")
            router.push("/dashboard")
        }
    }

    const handleBack = () => {
        if(step>1) setstep(step-1);
    };


  return (
    <div className="w-full flex justify-center  px-2">
      <div
        className={`w-full ${
          !started ? "my-0" : "my-12"
        } max-w-[700px] bg-white`}
      >
        {!started ? (
          <SignUpStart onSuccess={handleSignupSuccess} />
        ) : (
          <>
            {/* Header */}
            <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900">
              Medical Institution Registration
            </h2>

            <Progress currentStep={step} totalSteps={totalSteps} />

            <div className="space-y-8 mt-6">
              {step === 1 && (
                <BasicInfo
                  defaultValues={formData.basicInfo}
                  onNext={handleNext}
                />
              )}
              {/* {step === 2 && (
                <Education
                  defaultValues={formData.education}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )} */}
              {/* {step === 3 && (
                <Experience
                  defaultValues={formData.experience}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )} */}
              {/* {step === 4 && (
                <SkillsServices
                  defaultValues={formData.skillsServices}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )} */}
              {/* {step === 4 && (
                <Document
                  defaultValues={formData.documents}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )} */}
              {/* {step === 6 && (
                <ContactAgreement
                  defaultValues={formData.contactAgrement}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )} */}
              {/* {step === 5 && (
                <Review
                  data={formData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )} */}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MedicalInstitution
