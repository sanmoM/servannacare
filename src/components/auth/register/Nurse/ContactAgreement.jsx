"use client";

import Input from "@/components/shared/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import toast from "react-hot-toast";


const ContactAgreement = ({ defaultValues, onNext, onBack }) => {
  const [form, setForm] = useState({
    phone: defaultValues.phone || "",
    email: defaultValues.email || "",
    additional: defaultValues.additional || "",
    agree: defaultValues.agree || false,
  });

  // handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // handle checkbox
  const handleCheckbox = () => {
    setForm((prev) => ({ ...prev, agree: !prev.agree }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // simple validation
    if (!form.phone) {
      toast.error("Phone number is required!");
      return;
    }

    if (!form.email) {
      toast.error("Email number is required!");
      return;
    }

    if (!form.additional) {
      toast.error("Additional is required!");
      return;
    }

    if (!form.agree) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    console.log(form)

    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="formHeading mb-4">Contact & Agreement</h2>

      {/* Phone & Email */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          label="Phone Number"
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter number"
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </div>

      {/* Additional Info */}
      <Label className="mb-2 mt-4 block">Additional Information</Label>
      <textarea
        rows={5}
        placeholder="Add any other details about yourself that may not have been captured (avoid repeating information)"
        className="border outline-primary w-full text-sm rounded-xl p-3"
        name="additional"
        value={form.additional}
        onChange={handleChange}
      ></textarea>

      {/* Agreement */}
      <div className="flex items-center mt-4 gap-2">
        <Checkbox id="agree" checked={form.agree} onCheckedChange={handleCheckbox} />
        <Label
          htmlFor="agree"
          className="text-gray-700 font-normal cursor-pointer"
        >
          I agree to the terms and conditions
        </Label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" size="lg" variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  );
};

export default ContactAgreement;
