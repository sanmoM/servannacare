"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import OtpModal from "../OtpModal";
import { generateToken } from "@/utilities/helperFunction";

const UserForm = () => {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [openOTP, setOpenOTP] = useState(false);
  const [temUser, setTemUser] = useState(null);
  const [phone, setPhone] = useState("");

  const handleCreateUser = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const phone = form.phone.value;

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (phone.length !== 11) {
      toast.error("Invalied phone number!");
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

    const token = generateToken();

    const userInfo = {
      name,
      email,
      phone,
      location: null,
      joinedSince: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      role: "user",
      token,
    };

    setTemUser(userInfo);
    setOpenOTP(true);
    toast.success(`OTP send to ${phone}!`);
  };

  const handleShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleVerifyOTP = (otp) => {
    //todo
    if (otp !== "123456") {
      toast.error("Invalid OTP!");
      return;
    }
    setOpenOTP(false);

    localStorage.setItem("user", JSON.stringify(temUser));
    router.push("/dashboard");
    toast.success("User Create Successfully!");
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen px-2">
      <div className="w-full  max-w-[400px] bg-white">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">
          Continue as User
        </h2>
        <form onSubmit={handleCreateUser} className="space-y-5 " action="">
          <Input
            label="Name"
            name="name"
            type="text"
            placeholder="Enter Your Name"
          />
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
            placeholder="Enter Your email"
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
          <Button size={"lg"} className={"w-full "}>
            Register
          </Button>
        </form>
        <div className="flex gap-2 mt-6 items-center">
          <p className="text-sm">Already have an account?</p>
          <Link href={"/login"}>
            <Button variant={"link"}>LOGIN</Button>
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

export default UserForm;
