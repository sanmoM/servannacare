"use client";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { getApi, postApi } from "@/lib/apiHandler";
import api from "@/utils/api";
import React, { useState, useEffect } from "react";

const page = () => {
  const [months, setMonths] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pricePerMonth, setPricePerMonth] = useState(0);
  const [planId, setPlanId] = useState(null);

  const { data, isLoading } = useFetch("/subscription-plan");
  const { user } = useAuth();

  // const {data } = useFetch('/subscription-status')

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

  const handlePayment = async () => {
    setLoading(true);
    const paymentData = {
      // 'phone': user?.number,
      'phone': "254708374149",
      'plan_id': planId,
      'specialist_id': user?.id,
      'validated_month': months,
    }
    await postApi('/subscription-pay', paymentData).then(async (res) => {
      await api.get(`/mpesa/query/${res.data?.checkout_id}`)
    }).catch(err => {
      console.error(err)
    })
    setTimeout(() => {
      const date = new Date();
      date.setMonth(date.getMonth() + months);

      localStorage.setItem("specialist_expiry", date.toISOString());
      setExpiryDate(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
      setIsSubscribed(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:row-reverse lg:flex-row border border-slate-100">
        {/* Left Section: Action Area */}
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
                  <span className="text-primary font-bold text-2xl bg-blue-50 px-4 py-1 rounded-full">
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
                  style={{ accentColor: "var(--primary)" }}
                />
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>1 MONTH</span>
                  <span>6 MONTHS</span>
                  <span>1 YEAR</span>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
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
                  <span className="text-xl tracking-tight uppercase font-primary">
                    {localStorage.getItem("specialist_expiry")
                      ? "Renew Subscription"
                      : "Confirm & Pay Now"}
                  </span>
                )}
              </button>
            </div>
          ) : (
            /* Success State */
            <div className="h-full flex flex-col justify-center items-center text-center py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
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
                  ></path>
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
              <div className="w-full max-w-sm bg-primary p-1 rounded-3xl">
                <div className="bg-white rounded-[1.4rem] p-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Valid Until
                  </p>
                  <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                    {expiryDate}
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-medium">
                Renewal available after expiry.
              </p>
            </div>
          )}
        </div>

        {/* Right Section: Visual Detail Sidebar */}
        <div className="w-full lg:w-2/5 bg-primary p-12 text-white flex flex-col justify-between">
          <div className="space-y-12">
            <div className="flex items-center space-x-3">
              {/* <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30">
                <div className="w-5 h-5 bg-white rounded-md"></div>
              </div> */}
              <span className="font-black text-2xl tracking-tighter italic">
                SPECIALIST
              </span>
            </div>

            <div className="space-y-8">
              <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200 opacity-80">
                Benefits Included
              </h4>
              <ul className="space-y-6">
                {[
                  {
                    title: "Verified profile listing",
                    desc: "Get a verified badge on your profile to build trust with employers.",
                  },
                  {
                    title: "Visibility to employers",
                    desc: "See who viewed your profile and increase your exposure to potential employers.",
                  },
                  {
                    title: "Access to direct job inquiries",
                    desc: "Receive direct job requests from employers without any middleman.",
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold text-blue-200">
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

          <div className="mt-12 space-y-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
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

export default page;
