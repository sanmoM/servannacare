"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { postApi } from "@/lib/apiHandler";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
const ForgotPassword = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState({});
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setIsActionLoading(true);
    try {
      const res = await postApi("/forgot-password", {
        email,
      });
      setIsEmailSent(true);
      toast.success(res?.data?.message || "Reset link sent to your email!");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsActionLoading(false);

      setIsLoading(false);
    }
  };
  return (
    <div className="w-full flex justify-center items-center min-h-screen px-2">
      <div className="w-full max-w-[400px] px-4 bg-white">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Image
            src="/logo1.png"
            alt="logo"
            quality={100}
            width={80}
            height={80}
          />
        </div>

        {isEmailSent ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Check Your Email
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-gray-900">{email}</span>. Please
              check your inbox and follow the instructions.
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Didn&apos;t receive the email? Check your spam folder or try
              again.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail("");
                }}
                variant="outline"
                size="lg"
                className="w-full"
                isActionLoading={isActionLoading}
              >
                Try Another Email
              </Button>
              <Link href="/login" className="block">
                <Button
                  variant="link"
                  className="w-full"
                  isActionLoading={isActionLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </div> /* Form State */
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2 text-center text-gray-900">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enter your email to receive a password reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({});
                }}
                error={errors.email}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full cursor-pointer"
                disabled={isLoading}
                isActionLoading={isActionLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="flex justify-center mt-6">
              <Link href="/login">
                <Button variant="link" isActionLoading={isActionLoading}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
