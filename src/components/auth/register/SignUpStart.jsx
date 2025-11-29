"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Input from "@/components/shared/Input";
import { Eye, EyeOff } from "lucide-react";

import Link from "next/link";
import OtpModal from "../OtpModal";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const SignUpStart = ({ onSuccess }) => {
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState("");
  const [openOTP, setOpenOTP] = useState(false);
  const [temUser, setTemUser] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const phone = form.phone.value;

    // validate phone (Kenya)
    if (phone.length !== 10) {
      toast.error("Invalied phone number!");
      return;
    }

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password will be more than 6 character");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept terms and condition!");
      return;
    }

    const newUserData = {
      email,
      phone,
      role: "service provider",
      joinedSince: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };

    setTemUser(newUserData);

    setOpenOTP(true);

    toast.success(`OTP send to ${phone}!`);
  };

  const handleShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleVerifyOTP = (otp) => {
    if (otp !== "123456") {
      toast.error("Invalid OTP!");
      return;
    }

    toast.success("Phone number verified!");
    setOpenOTP(false);

    onSuccess(temUser);
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen px-2">
      <div className="w-full max-w-[400px] px-4 bg-white">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">
          Create an Account!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Your Email"
          />

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Enter Your Password"
            />
            <div
              onClick={handleShowPassword}
              className="absolute cursor-pointer top-10 right-5"
            >
              {showPass ? (
                <EyeOff className="text-gray-600" />
              ) : (
                <Eye className="text-gray-600" />
              )}
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

          <Button size={"lg"} className={"w-full"}>
            SIGN UP
          </Button>
        </form>

        <div className="flex gap-2 mt-6 items-center">
          <p className="text-sm">Already have an account?</p>
          <Link href={"/login"}>
            <Button variant={"link"}>Login</Button>
          </Link>
        </div>
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

export default SignUpStart;
