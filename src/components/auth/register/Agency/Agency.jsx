import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Progress from "../Progress";
import AgencyBasicInfo from "./AgencyBasicInfo";
import EmployeDetails from "./EmployeDetails";
import { Plus, Trash } from "lucide-react";
import ReviewAndSubmit from "./ReviewAndSubmit";

const Agency = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [employees, setEmployees] = useState([1]);
  const [formData, setFormData] = useState({ agency: {}, allEmployees: [] });

  const handleNext = (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
      console.log(formData);
    } else {
      console.log("Final Submitted Data:", formData);
      toast.success("Register Successfully!");
      setStep(1);
      setEmployees([1]);
      setFormData({});
    }
  };

  const handleAgencyDataChange = (data) => {
    setFormData((prev) => ({ ...prev, agency: { ...prev.agency, ...data } }));
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddEmployee = () => {
    setEmployees((prev) => [...prev, prev.length + 1]);
    toast.success("New Employee Form Added!");
  };

  const handleRemoveEmployee = (index) => {
    setEmployees((prev) => prev.filter((_, i) => i !== index));
    toast.error("Employee Removed");
  };

  return (
    <div className="w-full flex justify-center  px-2">
      <div className="w-full  max-w-[700px] bg-white">
        {/* Header */}
        <h2 className="text-2xl mb-6 font-semibold text-center text-gray-900">
          Agency Registration
        </h2>

        <Progress currentStep={step} totalSteps={totalSteps} />

        <form className="space-y-8 mt-6">
          {step === 1 && (
            <AgencyBasicInfo
              onChange={handleAgencyDataChange}
              values={formData.agency}
            />
          )}

          {step === 2 && (
            <div className="space-y-8">
              {employees.map((num, index) => (
                <div key={index} className="relative">
                  <EmployeDetails employeeNumber={num} />
                  {index > 0 && (
                    <Button
                      type="button"
                      className={
                        "absolute bg-red-400 hover:bg-red-500 top-2 right-2"
                      }
                      onClick={() => handleRemoveEmployee(index)}
                    >
                      <Trash /> Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {
           step === 3 && (
            <ReviewAndSubmit
            data={formData}
            />
           )
          }

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

            <div className="flex items-center gap-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleAddEmployee}
                >
                  <Plus /> Add Employee
                </Button>
              )}
              <Button type="submit" size="lg" onClick={handleNext}>
                {step === totalSteps ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agency;
