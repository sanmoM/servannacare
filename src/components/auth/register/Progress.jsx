"use client";

import React from "react";

export default function Progress({
  currentStep = 1,
  totalSteps = 4,
  steps = [
    { label: "Step 1", description: "Start" },
    { label: "Step 2", description: "Process" },
    { label: "Step 3", description: "Review" },
    { label: "Step 4", description: "Complete" },
  ],
}) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto ">
      {/* Steps Container */}
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-3 lg:top-4 left-0 right-0 h-1 bg-gray-200" />

        {/* Progress Line */}
        <div
          className="absolute top-3 lg:top-4 left-0 h-1 bg-blue-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Steps */}
        <div className="relative flex items-center justify-between w-full">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* Circle Step Indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-blue-500 text-white ring-4 ring-blue-200"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Step Label */}
                {/* <p
                  className={`mt-2 text-sm font-medium ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {step.label}
                </p> */}

                {/* Step Description */}
                {/* {step.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                )} */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
