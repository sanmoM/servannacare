"use client";

import OtpModal from "@/components/auth/OtpModal";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [openOTP, setOpenOTP] = useState(false);
  const [phone, setPhone] = useState("");
  const router = useRouter()


  const handleSubmit = () => {
    if(phone.length === 0){
      toast.error("Enter your phone number");
      return;
    }
    if(phone.length < 10) {
      toast.error("Enter a valid phone number");
      return;
    }
    setOpenOTP(true);
  };

  const handleVerifyOTP = (otp) => {
    if (otp !== "123456") {
      toast.error("Invalid OTP!");
      return;
    }

    toast.success("Phone number verified!");
    setOpenOTP(false);
    router.push("/")
    
    

    // onSuccess(temUser);
  };
  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="max-w-[350px] w-full mx-4">
        <h2 className="text-lg font-semibold text-center mb-8">
          Recovery Your Account!
        </h2>
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="07xxxxxxxx "
          value={phone}
          maxLength={10}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setPhone(val);
          }}
        />
        <Button onClick={handleSubmit} size={"lg"} className={"w-full mt-8"}>
          Send OTP
        </Button>
      </div>
      {/* OTP Modal  */}
      {openOTP && (
        <OtpModal
          phone={phone}
          onVerify={handleVerifyOTP}
          onClose={() => setOpenOTP(false)}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
