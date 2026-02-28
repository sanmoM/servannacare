"use client";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { getApi, postApi } from "@/lib/apiHandler";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const SpecialistSubscription = () => {
  const { user } = useAuth();
  const [tier, setTier] = useState("Silver");
  const [months, setMonths] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [planPrices, setPlanPrices] = useState({ Silver: 0, Gold: 0 });
  const [planId, setPlanId] = useState(null);

  const { data, isLoading } = useFetch("/subscription-plan");

  useEffect(() => {
    if (data?.status === 200 && data?.data?.data) {
      const silverPlan = data?.data?.data?.find(
        (item) => item.name === "Silver",
      );
      const goldPlan = data?.data?.data?.find((item) => item.name === "Gold");

      setPlanPrices({
        Silver: silverPlan ? parseFloat(silverPlan.price) : 500,
        Gold: goldPlan ? parseFloat(goldPlan.price) : 800,
      });
      setPlanId({
        Silver: silverPlan?.id,
        Gold: goldPlan?.id,
      });
    }
  }, [data]);

  const currentPricePerMonth = planPrices[tier];
  const TOTAL_PRICE = months * currentPricePerMonth;

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

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (!planId?.[tier]) {
        toast.error("Plan not loaded yet. Please wait.");
        return;
      }

      const paymentData = {
        phone: user?.number,
        plan_id: planId[tier],
        specialist_id: user?.id,
        validated_month: months,
      };

      const paymentRes = await postApi("/subscription-pay", paymentData);

      const queryRes = await getApi(
        `/mpesa/query/${paymentRes?.data?.checkout_id}`,
      );

      console.log("payment Response:", paymentRes);
      console.log("Mpesa Query Data:", queryRes);

      // router.push("/dashboard/payment-history");
    } catch (err) {
      console.error("Payment Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );

  const benefits = {
    Silver: [
      { title: "Basic agency profile", desc: "Build instant agency trust." },
      {
        title: "Standard search visibility",
        desc: "Priority ranking in searches.",
      },
    ],
    Gold: [
      { title: "Priority support", desc: "Get fast responses from our team." },
      {
        title: "Enhanced search visibility",
        desc: "Stand out in search results.",
      },
      {
        title: "Essential in-app marketing",
        desc: "Promote your profile inside the app.",
      },
      {
        title: "Targeted social media promotion",
        desc: "Reach the right audience online.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 md:p-10 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row border border-slate-100">
        {/* LEFT ACTION PANEL */}
        <div className="flex-1 p-8 md:p-14 lg:p-20 space-y-12">
          {!isSubscribed ? (
            <>
              <header>
                <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                  Agency Portal
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                  Plan Selection
                </h2>
              </header>

              {/* TIER TOGGLE */}
              <div className="flex p-1.5 bg-slate-100 rounded-[2rem] border border-slate-200/50">
                <button
                  onClick={() => setTier("Silver")}
                  className={`flex-1 py-4 rounded-[1.6rem] cursor-pointer font-bold transition-all text-sm ${tier === "Silver" ? "bg-white text-primary shadow-lg translate-y-[-2px]" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Silver Tier
                </button>
                <button
                  onClick={() => setTier("Gold")}
                  className={`flex-1 py-4 rounded-[1.6rem] cursor-pointer font-bold transition-all text-sm ${tier === "Gold" ? "bg-primary text-white shadow-xl translate-y-[-2px]" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Gold Tier
                </button>
              </div>

              {/* DURATION SELECTOR */}
              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Billing Period
                  </span>
                  <span className="text-primary font-bold px-4 py-1.5 bg-blue-50 rounded-2xl text-sm border border-blue-100">
                    {months} {months === 1 ? "Month" : "Months"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>1 MONTH</span>
                  <span>6 MONTHS</span>
                  <span>1 YEAR</span>
                </div>
              </div>

              {/* PAYMENT BREAKDOWN */}
              <div className="bg-[#fcfcfd] rounded-[2.5rem] p-10 border border-slate-100 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-medium">
                    Monthly Rate
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {currentPricePerMonth.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">
                    Total Due
                  </p>
                  <div className="text-right">
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">
                      {TOTAL_PRICE.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* UPDATED BUTTON */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-primary hover:opacity-90 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 active:scale-[0.97]"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="text-xl tracking-tight uppercase cursor-pointer">
                    {localStorage.getItem("specialist_expiry")
                      ? "Renew Subscription"
                      : "Confirm & Pay Now"}
                  </span>
                )}
              </button>
            </>
          ) : (
            <div className="text-center space-y-8 py-10 animate-in fade-in zoom-in duration-700">
              <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto border border-green-100">
                <svg
                  className="w-10 h-10 text-green-500"
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
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Agency Active
              </h2>
              <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-2">
                  Expiry Date
                </p>
                <p className="text-3xl font-bold text-primary font-mono">
                  {expiryDate}
                </p>
              </div>
              <button
                onClick={() => setIsSubscribed(false)}
                className="text-slate-400 hover:text-primary text-xs font-bold uppercase tracking-widest transition-all"
              >
                Change Plan
              </button>
            </div>
          )}
        </div>

        {/* RIGHT INFO SIDEBAR */}
        <div className="w-full lg:w-[420px] bg-primary p-12 md:p-16 text-white flex flex-col justify-between relative">
          <div className="space-y-16 relative z-10">
            <h3 className="text-3xl font-black leading-[0.9] tracking-tighter uppercase italic">
              {tier} <br /> Privileges
            </h3>

            <div className="space-y-10">
              {benefits[tier].map((item, idx) => (
                <div
                  key={idx}
                  className="flex space-x-4 transition-all duration-500"
                >
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                    0{idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none mb-2">
                      {item.title}
                    </p>
                    <p className="text-blue-100/60 text-sm font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 pt-10 border-t border-white/10">
            <p className="text-xs text-white/50 italic leading-relaxed">
              * One-time secure payment. No recurring billing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistSubscription;
