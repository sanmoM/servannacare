"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import { postApi, getApi } from "@/lib/apiHandler";
import { useAuth } from "@/hooks/useAuth";
import OTPInputs from "@/components/auth/OtpInput";

const VerifyOtpPage = () => {
  const router = useRouter();
  const { setUser, setRole } = useAuth();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verifyEmail");

    if (!storedEmail) {
      router.push("/signup");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits long!");
      return;
    }

    try {
      setLoading(true);

      const res = await postApi("/verify", { email, otp });

      if (res?.data?.status) {
        const { token } = res?.data?.data;

        localStorage.setItem("token", token);

        const profile = await getApi("/profile");

        setUser(profile?.data?.data);
        setRole(profile?.data?.data?.role);

        sessionStorage.removeItem("verifyEmail");

        toast.success("Account verified successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-2">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-center mb-4">
          Verify Your E-mail
        </h2>

        <p className="text-center text-sm text-gray-600 mb-4">
          We sent a 6-digit OTP to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        <OTPInputs length={6} value={otp} onChange={setOtp} />

        <Button
          size="lg"
          className="w-full mt-8"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
