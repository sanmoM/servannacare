"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OtpModal from "../OtpModal";
import { getApi, postApi } from "@/lib/apiHandler";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { useAuth } from "@/hooks/useAuth";

const UserForm = () => {
  const { setUser, setRole } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [redirectUrl, setRedirectUrl] = useState(null);
  // console.log("user form", redirectUrl);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [openOTP, setOpenOTP] = useState(false);
  const [temUser, setTemUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("KE");

  useEffect(() => {
    const r = searchParams.get("redirect");
    if (r) setRedirectUrl(r);
  }, [searchParams]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (!phone) {
      toast.error("Phone number is required!");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      toast.error("Phone number is invalid or incomplete!");
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

    const userInfo = {
      name,
      role: "user",
      number: phone,
      email,
      password,
    };

    try {
      const res = await postApi("/register", userInfo);

      if (res?.data?.status) {
        const emailVerified = res?.data?.email_verified;

        if (emailVerified === null) {
          toast.success(`OTP sent to ${email}!`);
          sessionStorage.setItem("verifyEmail", email);
          const redirectQuery = redirectUrl ? `?redirect=${redirectUrl}` : "";
          router.push(`/verify-otp${redirectQuery}`);
          // router.push("/verify-otp");
        } else {
          toast.success("Registration successful!");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  // const handleVerifyOTP = async (otp) => {
  //   try {
  //     const res = await postApi("/verify", {
  //       email: temUser.email,
  //       otp,
  //     });
  //     const { token, role, is_profile_completed } = res?.data?.data;

  //     localStorage.setItem("token", token);
  //     const data = await getApi("/profile");
  //     setUser(data?.data?.data);
  //     setRole(data?.data?.data?.role);
  //     setOpenOTP(false);
  //     if (redirectUrl && redirectUrl.startsWith("/")) {
  //       router.replace(redirectUrl);
  //     } else {
  //       router.replace("/dashboard");
  //       toast.success("Account verified successfully!");
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Invalid OtP");
  //   }
  // };

  const handleShowPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen px-2">
      <div className="w-full  max-w-[400px] bg-white">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">
          Continue as Client
        </h2>
        <form onSubmit={handleCreateUser} className="space-y-5 " action="">
          <Input
            label="Name"
            name="name"
            type="text"
            placeholder="Enter Your Name"
          />
          <Label>Phone Number</Label>

          <div className="w-full">
            <PhoneInputWithCountrySelect
              className="w-full border rounded-md px-3 py-2"
              international
              defaultCountry={country}
              value={phone}
              onChange={(value) => {
                if (!value) return setPhone("");
                const sanitized = value.replace(/[^+\d]/g, "");
                setPhone(sanitized);
              }}
              onCountryChange={(countryCode) => {
                setCountry(countryCode);
                const exampleNumber = countryCode
                  ? getExampleNumber(countryCode)
                  : null;
                if (exampleNumber) {
                  setPhone(`+${exampleNumber.countryCallingCode}`);
                } else {
                  setPhone("");
                }
              }}
            />
          </div>

          {phone && !isValidPhoneNumber(phone) && (
            <p className="text-red-500 text-sm mt-1">
              Invalid phone number for selected country
            </p>
          )}

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
          <Button size={"lg"} className={"w-full cursor-pointer"}>
            Register
          </Button>
        </form>
        <div className="flex gap-2 mt-6 items-center">
          <p className="text-sm">Already have an account?</p>
          <Link href={`/login?redirect=${redirect || ""}`}>
            <Button variant={"link"}>LOGIN</Button>
          </Link>
        </div>
      </div>

      {/* OTP Modal  */}
      {/* {openOTP && (
        <OtpModal
          email={temUser?.email}
          onVerify={handleVerifyOTP}
          onClose={() => setOpenOTP(false)}
        />
      )} */}
    </div>
  );
};

export default UserForm;
