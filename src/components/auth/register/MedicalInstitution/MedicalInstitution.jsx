"use clinet";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Progress from "../Progress";
import SignUpStart from "../SignUpStart";
import BasicInfo from "./BasicInfo";
import { useRouter } from "next/navigation";
import EmployeDetails from "../Agency/EmployeDetails";
import { Button } from "@/components/ui/button";
import NurseDetails from "./NurseDetails";
import { Plus } from "lucide-react";

const MedicalInstitution = () => {
  const [started, setStarted] = useState(false);
  const router = useRouter;
  const [step, setStep] = useState(1);
   const [nurses, setNurses] = useState([1]);
  const [user, setUser] = useState({});
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    institution: {},
    nurses: [],
  });
   

  const handleSignupSuccess = (accountData) => {
    setStarted(true);
    setUser(accountData)
  };



   const handleNext = () => {
    if (step < totalSteps) {
      if (step === 2) {
        // validate all  before moving on
        // if (formData.allEmployees.length === 0) {
        //   toast.error("Please fill in at least one employee’s details!");
        //   return;
        // }

        // for (let i = 0; i < formData.allEmployees.length; i++) {
        //   const emp = formData.allEmployees[i];
        //   const errors = validateEmployee(emp || {});
        //   if (errors.length > 0) {
        //     toast.error(`Employee #${i + 1} has errors:\n${errors[0]}`);
        //     return;
        //   }
        // }
      }

      setStep(step + 1);
    } 
    else {
      localStorage.setItem(
        "user",
        JSON.stringify(
        user  
        )
      )
      toast.success("Register Successfully!");
      router.push("/dashboard")
      // reset form
      setFormData({ institution: {}, nurses: [] });
      setNurses([1]);
    }
  };




   const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // store Institution data
  const handleInstitutionDataChange = (data) => {
    setFormData((prev) => ({ ...prev, institution: { ...prev.institution, ...data } }));
  };

    // store Nurses data by index
  const handleNursesChange = (index, nurseData) => {
    setFormData((prev) => {
      const updated = [...prev.nurses];
      updated[index] = nurseData;
      return { ...prev, nurses: updated };
    });
  };


    // add new employee
  const handleAddNurse = () => {
    setNurses((prev) => [...prev, prev.length + 1]);
    toast.success("New Nurse Form Added!");
  };


  // remove nurses
  const handleRemoveNurses = (index) => {
    setNurses((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => {
      const updated = prev.nurses.filter((_, i) => i !== index);
      return { ...prev, nurses: updated };
    });
    toast.error("Nurse Removed!");
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
                key="institution-step"
                  defaultValues={formData.institution}
                  onNext={(data) => {
                    handleInstitutionDataChange(data);
                    handleNext();
                  }}
                />
              )}

              {step === 2 && (
                <div className="space-y-8">
                  {nurses.map((num, index) => (
                    <div key={index} className="relative">
                      <NurseDetails
                        key={`nurse-${index}`}
                        nurseNumber={num}
                        onDataChange={(data) =>
                          handleNursesChange(index, data)
                        }
                        onNext={handleNext}
                        defaultValues={formData.nurses[index] || {}}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          className="absolute bg-red-400 hover:bg-red-500 top-2 right-2"
                          onClick={() => handleRemoveNurses(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

                 {/* NAVIGATION BUTTONS */}
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

                {step === 2 && (
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      onClick={handleAddNurse}
                    >
                      <Plus /> Add Employee
                    </Button>

                    <Button type="submit" size="lg" onClick={handleNext}>
                      Next
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex items-center gap-4">
                    <Button type="submit" size="lg" onClick={handleNext}>
                      Confirm & submit
                    </Button>
                  </div>
                )}
              </div>

 
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalInstitution;
