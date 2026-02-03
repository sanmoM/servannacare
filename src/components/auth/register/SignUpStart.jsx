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
import { useSearchParams } from "next/navigation";
import { postApi } from "@/lib/apiHandler";

const SignUpStart = ({ onSuccess }) => {
  const searchParams = useSearchParams();
  const inComingRole = searchParams.get("role");
  const SPECIALIST_SUBROLE = [
    "house-manager",
    "nurse",
    "physiotherapist",
    "nurse-aide-or-assistant",
    "special-need-caregivers",
  ];
  const isSpecialistSubRole = SPECIALIST_SUBROLE.includes(inComingRole);
  const role = isSpecialistSubRole ? "specialist" : inComingRole;
  const subRole = isSpecialistSubRole ? inComingRole : "";

  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState("");
  const [openOTP, setOpenOTP] = useState(false);
  const [temUser, setTemUser] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const phone = form.phone.value;

    if (phone.length !== 11) {
      toast.error("Invalid phone number!");
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
      role,
      subRole,
      number: phone,
      email,
      password,
    };
    try {
      const res = await postApi("/register", newUserData);
      if (res?.data?.status) {
        setTemUser(newUserData);
      }
      setOpenOTP(true);
      toast.success(`OTP send to ${email}!`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "registration failed");
    }
  };

  const handleShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const res = await postApi("/verify", {
        email: temUser?.email,
        otp,
      });
      if (res?.data?.status) {
        const { token, role, is_profile_completed } = res?.data?.data;
        localStorage.setItem("token", token);

        localStorage.setItem(
          "user",
          JSON.stringify({ role, subRole, is_profile_completed }),
        );
        setOpenOTP(false);
        onSuccess({ role, subRole, is_profile_completed });
        toast.success("Account verified successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid Otp");
    }
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
            placeholder="+254xxxxxxx"
            value={phone}
            maxLength={11}
            onFocus={() => {
              if (!phone) setPhone("+254");
            }}
            onChange={(e) => {
              let val = e.target.value;
              if (!val.startsWith("+254")) {
                val = "+254" + val.replace(/\D/g, "").slice(0, 7);
              } else {
                val = "+254" + val.slice(4).replace(/\D/g, "").slice(0, 7);
              }
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
          email={temUser?.email}
          onVerify={handleVerifyOTP}
          onClose={() => setOpenOTP(false)}
        />
      )}
    </div>
  );
};

export default SignUpStart;
