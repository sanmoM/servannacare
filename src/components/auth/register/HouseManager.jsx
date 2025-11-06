"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/utilities/data";
import React, { useState } from "react";
import Progress from "./Progress";

const HouseManager = () => {
  

  return (
    <div className="w-full flex justify-center  px-2">
      <div className="w-full max-w-[700px] bg-white">
        {/* Header */}
        <h2 className="text-xl mb-4 font-semibold text-center text-gray-900">
          Continue as Nanny/Housekeeper
        </h2>

        <Progress/>

        {/* Section Title */}
        <h4 className="text-base md:text-lg text-gray-700 font-semibold mt-4">
          Basic Information
        </h4>

        <form className="space-y-6 mt-6">
          {/* Full Name + Education */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                label="Full Name"
                name="name"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="edu"
              >
                Education Level
              </label>
              <Select>
                <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Experience + Salary */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="year"
              >
                Experience (Years)
              </label>
              <Select>
                <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="4">4 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="more">More than 5 years</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="salary"
              >
                Salary Range (USD)
              </label>
              <Select>
                <SelectTrigger className="w-full cursor-pointer py-5.5 shadow-none">
                  <SelectValue placeholder="Select expected salary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="200-400">$200 - $400</SelectItem>
                    <SelectItem value="400-600">$400 - $600</SelectItem>
                    <SelectItem value="600-800">$600 - $800</SelectItem>
                    <SelectItem value="800-1000">$800 - $1000</SelectItem>
                    <SelectItem value="1000+">More than $1000</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <Input
            label="Your Location"
            name="location"
            placeholder="Type your location.."
          />

          {/* Languages */}
          <div>
            <Label className="font-medium text-gray-700">Languages</Label>
            <div className="flex flex-wrap gap-3 mt-3">
              {languages.map((lan) => (
                <div key={lan.id} className="flex items-center gap-2">
                  <Checkbox id={lan.value} />
                  <Label
                    className="text-gray-700 font-normal cursor-pointer"
                    htmlFor={lan.value}
                  >
                    {lan.text}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Details */}
          <h4 className="text-base md:text-lg text-gray-700 font-semibold">
            Bank Details
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Bank Name" name="bname" placeholder="Your bank name" />
            <Input
              label="Account Name"
              name="aname"
              placeholder="Your account name"
            />
            <Input
              label="Account Number"
              name="anumber"
              placeholder="Your account number"
            />
          </div>

          {/* Remember Me */}
          <div className="text-sm mt-6 flex items-center gap-2 text-gray-700">
            <input id="reminder" type="checkbox" className="cursor-pointer" />
            <label htmlFor="reminder" className="cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Submit */}
          <Button size="lg" className="w-full mt-4">
            Next
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HouseManager;
