"use client";

import React from "react";

export default function Progress({ currentStep = 1, totalSteps = 4 }) {
  const progressPercentage =
    totalSteps === 1 ? 100 : ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-3 lg:top-4 left-0 right-0 h-1 bg-gray-200" />

        {/* Progress Line */}
        <div
          className="absolute top-3 lg:top-4 left-0 h-1 bg-blue-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Step Circles */}
        <div className="relative flex items-center justify-between w-full">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
