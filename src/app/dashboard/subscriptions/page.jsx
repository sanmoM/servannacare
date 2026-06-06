"use client";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { getApi, postApi } from "@/lib/apiHandler";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Phone Input Imports
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getExampleNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/shared/LoadingSpin";

const Page = () => {
  
  const [isActionLoading, setIsActionLoading] = useState(false);
const router = useRouter();
  const [months, setMonths] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pricePerMonth, setPricePerMonth] = useState(0);
  const [planId, setPlanId] = useState(null);

  const [country, setCountry] = useState("KE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useFetch("/subscription-plan");
  const { user } = useAuth();

  useEffect(() => {
    if (user?.is_subscription_active) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  }, [user]);

  useEffect(() => {
    if (data?.status === 200 && data?.data?.data.length > 0) {
      const individualPlan = data?.data?.data?.find(
        (item) => item.name === "Individual Listing",
      );

      if (individualPlan) {
        setPricePerMonth(parseFloat(individualPlan.price));
        setPlanId(individualPlan.id);
      }
    }
  }, [data]);

  const TOTAL_PRICE = months * pricePerMonth;

  useEffect(() => {
    const savedExpiry = localStorage.getItem("specialist_expiry");
    if (savedExpiry) {
      const now = new Date();
      const expiry = new Date(savedExpiry);
      if (now < expiry) {
        setIsSubscribed(true);
        setExpiryDate(
          expiry.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        );
      }
    }
  }, []);

  const handleCheckoutClick = () => {
    if (!user?.is_profile_completed) {
      toast.error("Please complete your profile first");
      return;
    }

    if (!user?.is_profile_verified) {
      toast.error("Please verify your profile first");
      return;
    }
    setIsSubmitting(true);
    setIsDialogOpen(true);

    // setIsSubmitting(true);

    // setTimeout(() => {
    //   setIsDialogOpen(true);
    //   setIsSubmitting(false);
    // }, 400);
  };

  const handlePayment = async () => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid phone number!");
      return;
    }

    setIsActionLoading(true);
    try {
setLoading(true);

      const paymentData = {
        phone: phoneNumber,
        plan_id: planId,
        specialist_id: user?.id,
        validated_month: months,
      };

      const paymentRes = await postApi("/subscription-pay", paymentData);

      await getApi(`/mpesa/query/${paymentRes?.data?.checkout_id}`);

      toast.success("Payment request sent! Check your phone.");
      setIsDialogOpen(false);
      router.push("/dashboard/house-manager-payment-history");
    }
    catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsActionLoading(false);

      setLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="w-full bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:flex-row border border-slate-100">
        <div className="w-full lg:w-3/5 p-8 md:p-16">
          {!isSubscribed ? (
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  Extend Membership
                </h2>
                <p className="text-slate-500 mt-3 text-lg">
                  Select your preferred duration and secure your status.
                </p>
              </div>

              {/* Month Selector */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold uppercase tracking-widest text-slate-400">
                    Select Duration
                  </label>
                  <span className="text-primary font-bold text-2xl bg-blue-50 px-4 py-1 rounded-lg">
                    {months} {months === 1 ? "Month" : "Months"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>1 MONTH</span>
                  <span>6 MONTHS</span>
                  <span>1 YEAR</span>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 rounded-lg p-8 border border-slate-100">
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Base Subscription</span>
                    <span>{pricePerMonth.toFixed(2)}</span>
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xl font-bold text-slate-900">
                      Total Amount
                    </span>
                    <div className="text-right">
                      <p className="text-3xl font-black text-primary leading-none tracking-tighter">
                        {TOTAL_PRICE.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DIALOG FOR PAYMENT */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    onClick={handleCheckoutClick}
                    disabled={
                      !user?.is_profile_completed ||
                      !user?.is_profile_verified ||
                      isSubmitting
                    }
                    className={`w-full bg-primary  text-white font-black py-5 rounded-lg shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 active:scale-[0.97] ${!user?.is_profile_completed || !user?.is_profile_verified || isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-90 cursor-pointer"}`}
                  >
                    <span className="text-xl tracking-tight uppercase ">
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        "Go To Checkout"
                      )}
                    </span>
                  </button>
                </DialogTrigger>
                {!user?.is_profile_completed && (
                  <p className="text-red-500 text-sm text-center">
                    Please complete your profile before active membership.
                  </p>
                )}
                {!user?.is_profile_verified && user?.is_profile_completed && (
                  <p className="text-red-500 text-sm text-center">
                    Please verify your profile before active membership.
                  </p>
                )}

                <DialogContent className="sm:max-w-md rounded-lg p-8 border-none bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-center mb-4 text-slate-900">
                      M-Pesa Payment
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">
                        Enter M-Pesa Number
                      </label>
                      <div className="phone-input-container">
                        <PhoneInputWithCountrySelect
                          className="w-full flex border rounded-lg px-4 py-3 bg-slate-50 focus-within:ring-2 focus-within:ring-primary transition-all"
                          international
                          defaultCountry={country}
                          value={phoneNumber}
                          onChange={(value) => setPhoneNumber(value || "")}
                          onCountryChange={(countryCode) => {
                            setCountry(countryCode || "KE");
                            const example = countryCode
                              ? getExampleNumber(countryCode)
                              : null;
                            if (example) {
                              setPhoneNumber(`+${example.countryCallingCode}`);
                            } else {
                              setPhoneNumber("");
                            }
                          }}
                        />
                      </div>
                      {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                        <p className="text-red-500 text-[11px] font-bold mt-2 ml-1">
                          Invalid phone number for {country}
                        </p>
                      )}
                    </div>

                    <div className="bg-primary/5 p-5 rounded-lg border border-primary/10 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <span>Period</span>
                        <span>{months} Mo.</span>
                      </div>
                      <div className="flex justify-between items-end border-t border-primary/10 pt-2">
                        <span className="text-xs font-black uppercase text-slate-400">
                          Total Payable:
                        </span>
                        <span className="text-2xl font-black text-primary">
                          {TOTAL_PRICE.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full bg-primary text-white py-4 rounded-lg font-black uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all disabled:bg-slate-300 flex items-center justify-center cursor-pointer"
                    >
                      {loading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-lg animate-spin" />
                      ) : (
                        "Pay Now"
                      )}
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shadow-inner">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                  Status: Active
                </h2>
                <p className="text-slate-500 font-medium max-w-xs mx-auto text-lg">
                  Your specialist privileges have been successfully provisioned.
                </p>
              </div>
              <div className="w-full max-w-sm bg-primary p-1 rounded-lg">
                <div className="bg-white rounded-lg p-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Valid Until
                  </p>
                  <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                    {expiryDate}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Visual Sidebar */}
        <div className="w-full lg:w-2/5 bg-primary p-12 text-white flex flex-col justify-between">
          <div className="space-y-12">
            <span className="font-black text-2xl tracking-tighter italic">
              SPECIALIST
            </span>
            <div className="space-y-8">
              <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200 opacity-80">
                Benefits Included
              </h4>
              <ul className="space-y-6">
                {[
                  {
                    title: "Verified profile listing",
                    desc: "Get a verified badge on your profile to build trust.",
                  },
                  {
                    title: "Visibility to employers",
                    desc: "See who viewed your profile and increase exposure.",
                  },
                  {
                    title: "Access to direct job inquiries",
                    desc: "Receive job requests directly from employers.",
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold text-blue-200">
                      0{idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-none mb-1">
                        {item.title}
                      </p>
                      <p className="text-blue-200/60 text-sm font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12">
            <div className="p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <p className="text-xs font-bold text-blue-200 uppercase mb-2">
                Support Tier
              </p>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                As a paid specialist, you have a dedicated 24/7 success manager
                at your disposal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
