"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [redirectUrl, setRedirectUrl] = useState(null);
  
  console.log("url", redirectUrl);

  useEffect(() => {
    if (redirect) setRedirectUrl(redirect);
  }, [redirect]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verifyEmail");

    if (!storedEmail) {
      router.push("/");
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

        if (profile?.data?.data?.role === "user") {
          if (redirectUrl && redirectUrl.startsWith("/")) {
            router.replace(redirectUrl);
          } else {
            router.replace("/dashboard");
          }
        } else {
          router.back();
        }

        // if (redirectUrl && redirectUrl.startsWith("/")) {
        //   router.replace(redirectUrl);
        // } else if (profile?.data?.data?.role === "user") {
        //   router.replace("/dashboard");
        // } else {
        //   router.back();
        // }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-blue-50/50 to-transparent blur-3xl pointer-events-none" />

      <div className="relative bg-white/80 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-blue-100">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Check your email
          </h2>
          <p className="text-gray-500 text-center mt-2 leading-relaxed">
            We've sent a secure code to <br />
            <span className="text-gray-900 font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <OTPInputs length={6} value={otp} onChange={setOtp} />
          </div>

          <Button
            size="lg"
            className="w-full h-14 rounded-2xl bg-primary cursor-pointer text-white font-semibold transition-all duration-200 shadow-lg shadow-gray-200 active:scale-[0.98] disabled:opacity-70"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              "Verify Account"
            )}
          </Button>
        </div>

        <div className="mt-8 text-center">
          {/* <p className="text-sm text-gray-500">
        Didn't receive the code?{" "}
        <button className="text-blue-600 font-semibold hover:underline decoration-2 underline-offset-4">
          Resend
        </button>
      </p> */}

          {/* <button className="mt-6 inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to login
      </button> */}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
