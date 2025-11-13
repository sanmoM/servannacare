"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, Image as ImageIcon } from "lucide-react";
import React, { useState } from "react";

const Review = ({ data, setTermsAccepted, termsAccepted }) => {
  // Format labels nicely from camelCase
  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  // Helper: format file size in KB/MB
  const formatFileSize = (size) => {
    if (!size) return "0 KB";
    const kb = size / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
  };

  // Recursive renderer for nested objects
  const renderSection = (sectionKey, sectionData) => {
    if (typeof sectionData !== "object" || sectionData === null) return null;

    return (
      <div key={sectionKey} className="p-4 my-4 border rounded-xl">
        <h2 className="font-semibold pb-4 text-gray-600">
          {formatLabel(sectionKey)}
        </h2>

        <div className="space-y-2 grid gap-4 md:grid-cols-2">
          {Object.entries(sectionData).map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="flex flex-wrap gap-2 items-start">
                  <Label>{formatLabel(key)}:</Label>
                  {value.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {value.map((item, i) => (
                        <span key={i} className="text-sm text-gray-600">
                          {String(item)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </div>
              );
            } else if (value instanceof File) {
              const isImage = value.type.startsWith("image/");
              return (
                <div key={key}>
                  <Label className={"mb-2"}>{formatLabel(key)}:</Label>
                  <div className="flex rounded-md border p-2 bg-gray-100 gap-2">
                    {isImage ? (
                      <ImageIcon className="text-gray-600 w-6 h-6" />
                    ) : (
                      <FileText className="text-gray-600 w-6 h-6" />
                    )}
                    <div className="flex flex-col text-sm text-gray-700">
                      <span className="font-medium text-xs">{value.name}</span>
                      <span className="text-gray-500 text-xs">
                        {formatFileSize(value.size)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            } else if (typeof value === "object" && value !== null) {
              return renderSection(key, value);
            } else {
              return (
                <div key={key} className="flex gap-2 flex-wrap">
                  <Label>{formatLabel(key)}:</Label>
                  <span className="text-sm text-gray-600">
                    {value ? String(value) : "N/A"}
                  </span>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="formHeading mb-4">Review and Submit</h2>

      {/* Render Agency Details */}
      {Object.entries(data)
        .slice(0, 1)
        .map(([sectionKey, sectionValue]) =>
          renderSection(sectionKey, sectionValue)
        )}

      {/* Employees Summary */}
      <div className="p-4 border rounded-xl">
        <h2 className="font-semibold pb-4 text-gray-600">Employees Details</h2>
        <div className="flex gap-2 flex-wrap">
          <Label>Number of employees added:</Label>
          <span className="text-sm text-gray-600">
            {data.allEmployees.length}
          </span>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-center gap-2 mt-6">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={() => setTermsAccepted(!termsAccepted)}
        />
        <Label
          className="text-gray-700 font-normal cursor-pointer"
          htmlFor="terms"
        >
          I agree to the terms and conditions
        </Label>
      </div>

      {/* Submit button inside Review */}
      {/* <div className="flex justify-end pt-6">
        <Button type="button" size="lg" onClick={handleSubmit}>
          Confirm & Submit
        </Button>
      </div> */}
    </div>
  );
};

export default Review;
