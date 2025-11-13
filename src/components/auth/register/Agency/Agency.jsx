"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Progress from "../Progress";
import AgencyBasicInfo from "./AgencyBasicInfo";
import EmployeDetails from "./EmployeDetails";
import { Plus, Trash } from "lucide-react";
import Review from "./ReviewAndSubmit";

const validateEmployee = (data) => {
  const errors = [];

  if (!data.name) errors.push("Full name is required");
  if (!data.educationLevel) errors.push("Education level is required");
  if (!data.location) errors.push("Location is required");
  if (!data.experience) errors.push("Experience is required");
  if (!data.salaryRange) errors.push("Salary range is required");
  if (data.isMother === null) errors.push("Please select if you are a mother");
  if (data.kidAges.length === 0)
    errors.push("Please select at least one kid age group");
  if (data.handlePets === null)
    errors.push("Please select if you can handle pets");
  if (!data.preferredRole) errors.push("Preferred role is required");
  if (data.languages.length === 0)
    errors.push("Please select at least one language");
  if (
    !data.skills.cooking ||
    !data.skills.housekeeping ||
    !data.skills.childcare
  )
    errors.push("All skill proficiencies must be selected");
  if (!data.liveType) errors.push("Live preference is required");

  // document validation (optional)
  const requiredDocs = [1, 2, 3, 4];
  for (const id of requiredDocs) {
    if (!data.documents[id]) {
      errors.push(`Document #${id} is required`);
    }
  }

  return errors;
};

const Agency = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [employees, setEmployees] = useState([1]);
  const [formData, setFormData] = useState({
    agency: {},
    allEmployees: [],
  });

  console.log(termsAccepted);

  const handleNext = () => {
    if (step < totalSteps) {
      if (step === 2) {
        // validate all employees before moving on
        if (formData.allEmployees.length === 0) {
          toast.error("Please fill in at least one employee’s details!");
          return;
        }

        for (let i = 0; i < formData.allEmployees.length; i++) {
          const emp = formData.allEmployees[i];
          const errors = validateEmployee(emp || {});
          if (errors.length > 0) {
            toast.error(`Employee #${i + 1} has errors:\n${errors[0]}`);
            return;
          }
        }
      }

      setStep(step + 1);
    } else if (step === 3 && !termsAccepted) {
      toast.error("You must agree to the terms and conditions!");
      return;
    } else {
      toast.success("Registration Submitted Successfully!");
      console.log("Submitted data:", formData);
      // reset form
      setStep(1);
      setFormData({ agency: {}, allEmployees: [] });
      setEmployees([1]);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // store agency data
  const handleAgencyDataChange = (data) => {
    setFormData((prev) => ({ ...prev, agency: { ...prev.agency, ...data } }));
  };

  // store employee data by index
  const handleEmployeeChange = (index, employeeData) => {
    setFormData((prev) => {
      const updated = [...prev.allEmployees];
      updated[index] = employeeData;
      return { ...prev, allEmployees: updated };
    });
  };

  // add new employee
  const handleAddEmployee = () => {
    setEmployees((prev) => [...prev, prev.length + 1]);
    toast.success("New Employee Form Added!");
  };

  // remove employee
  const handleRemoveEmployee = (index) => {
    setEmployees((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => {
      const updated = prev.allEmployees.filter((_, i) => i !== index);
      return { ...prev, allEmployees: updated };
    });
    toast.error("Employee Removed!");
  };

  return (
    <div className="w-full flex justify-center px-2">
      <div className="w-full max-w-[700px] bg-white">
        {/* Header */}
        <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900">
          Agency Registration
        </h2>

        <Progress currentStep={step} totalSteps={totalSteps} />

        <div className="space-y-8 mt-6">
          {/* STEP 1 — AGENCY INFO */}
          {step === 1 && (
            <AgencyBasicInfo
              key="agency-step"
              defaultValues={formData.agency}
              onNext={(data) => {
                handleAgencyDataChange(data);
                handleNext();
              }}
            />
          )}

          {step === 2 && (
            <div className="space-y-8">
              {employees.map((num, index) => (
                <div key={index} className="relative">
                  <EmployeDetails
                    key={`employee-${index}`}
                    employeeNumber={num}
                    onDataChange={(data) => handleEmployeeChange(index, data)}
                    onNext={handleNext}
                    defaultValues={formData.allEmployees[index] || {}}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      className="absolute bg-red-400 hover:bg-red-500 top-2 right-2"
                      onClick={() => handleRemoveEmployee(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 — REVIEW */}
          {step === 3 && (
            <Review
              data={formData}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
            />
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
                  onClick={handleAddEmployee}
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

            {/* {step === 3 && (
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agency;
