import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ContactAgreement = ({ defaultValues, onNext, onBack }) => {
  const [data, setData] = useState({
    phone: defaultValues.phone || "",
    email: defaultValues.email || "",
    additional: defaultValues.additional || "",
    agree: defaultValues.agree || false,
  });

  // handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // handle checkbox
  const handleCheckbox = () => {
    setData((prev) => ({ ...prev, agree: !prev.agree }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // simple validation
    if (!data.phone) {
      toast.error("Phone number is required!");
      return;
    }

    if (!data.email) {
      toast.error("Email number is required!");
      return;
    }

    if (!data.additional) {
      toast.error("Additional is required!");
      return;
    }

    if (!data.agree) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }


    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="formHeading ">Contact & Agreement</h2>
      <div className="flex my-6 flex-col sm:flex-row gap-6 sm:gap-4">
        <Input
          label="Phone Number"
          type="text"
          name="phone"
          placeholder="Enter number"
          value={data.phone}
          onChange={handleChange}
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter email"
          value={data.email}
          onChange={handleChange}
        />
      </div>
      <Label className={"mb-2 "}>Additional Information</Label>
      <textarea
        rows={5}
        placeholder="Add any other details about yourself that may not have been capture (avoid repeating information)"
        className="border outline-primary w-full text-sm rounded-xl p-3"
        name="additional"
        id=""
        value={data.additional}
        onChange={handleChange}
      ></textarea>
      <div className="flex items-center mt-6 gap-2">
        <Checkbox
          id="agree"
          checked={data.agree}
          onCheckedChange={handleCheckbox}
        />
        <Label
          htmlFor={"agree"}
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
