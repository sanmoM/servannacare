import Input from "@/components/shared/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

const ContactAgreement = () => {
  return (
    <div>
      <h2 className="formHeading mb-4">Contact & Agreement</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          label="Phone Number"
          type="text"
          name="phone"
          placeholder="Enter number"
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter email"
        />
      </div>
      <Label className={"mb-2 mt-4"}>Additional Information</Label>
      <textarea
        rows={5}
        placeholder="Add any other details about yourself that may not have been capture (avoid repeating information)"
        className="border outline-primary w-full text-sm rounded-xl p-3"
        name="additional"
        id=""
      ></textarea>
      <div className="flex items-center mt-4 gap-2">
        <Checkbox id="agree" />
        <Label htmlFor={"agree"} className="text-gray-700 font-normal cursor-pointer">
          I agree to the terms and conditions
        </Label>
      </div>
    </div>
  );
};

export default ContactAgreement;
