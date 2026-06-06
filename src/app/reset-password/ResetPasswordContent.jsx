"use client";

import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { postApi } from "@/lib/apiHandler";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
const ResetPasswordContent = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !token) {
      toast.error("Invalid or missing reset link. Please request a new one.");
      return;
    }
    if (!validate()) return;
    setIsLoading(true);
    setIsActionLoading(true);
    try {
const payload = {
        email,
        token,
        password,
        password_confirmation: confirmPassword
      };
      const res = await postApi("/reset-password", payload);
      setIsSuccess(true);
      toast.success(res?.data?.message || "Password reset successfully!");
    }
    catch (error) {
      const message = error?.response?.data?.message || "Failed to reset password. The link may have expired.";
      toast.error(message);
    } finally {
      setIsActionLoading(false);

      setIsLoading(false);
    }
  };
  const clearFieldError = field => {
    if (errors[field]) {
      setErrors(prev => {
        const updated = {
          ...prev
        };
        delete updated[field];
        return updated;
      });
    }
  };
  return <div className="w-full flex justify-center items-center min-h-screen px-2">
      <div className="w-full max-w-[400px] px-4 bg-white">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Image src="/logo1.png" alt="logo" quality={100} width={80} height={80} />
        </div>

        {isSuccess ? (/* Success State */
      <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Password Reset Successful!
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Your password has been updated. You can now log in with your new
              password.
            </p>
            <Link href="/login" className="block">
              <Button size="lg" className="w-full cursor-pointer" isActionLoading={isActionLoading}>
                Go to Login
              </Button>
            </Link>
          </div>) : (/* Form State */
      <>
            <h2 className="text-xl font-semibold mb-2 text-center text-gray-900">
              Reset Your Password
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enter your new password below.
            </p>

            {/* Show email being reset for */}
            {email && <div className="bg-gray-50 rounded-md px-4 py-2.5 mb-5 border border-gray-100">
                <p className="text-xs text-gray-500">Resetting password for</p>
                <p className="text-sm font-medium text-gray-800">{email}</p>
              </div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password Field */}
              <div className="relative">
                <Input label="New Password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter new password" value={password} onChange={e => {
              setPassword(e.target.value);
              clearFieldError("password");
            }} error={errors.password} />
                <div onClick={() => setShowPassword(!showPassword)} className="absolute cursor-pointer top-10 right-5">
                  {showPassword ? <EyeOff className="text-gray-600" /> : <Eye className="text-gray-600" />}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <Input label="Confirm Password" name="confirm_password" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm new password" value={confirmPassword} onChange={e => {
              setConfirmPassword(e.target.value);
              clearFieldError("confirmPassword");
            }} error={errors.confirmPassword} />
                <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute cursor-pointer top-10 right-5">
                  {showConfirmPassword ? <EyeOff className="text-gray-600" /> : <Eye className="text-gray-600" />}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={isLoading} isActionLoading={isActionLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <div className="flex justify-center mt-6">
              <Link href="/login">
                <Button variant="link" className="cursor-pointer" isActionLoading={isActionLoading}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </>)}
      </div>
    </div>;
};
export default ResetPasswordContent;