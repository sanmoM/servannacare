"use client";

import React, { useState } from "react";
import { Check, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "SILVER TIER",
    tier: "Silver",
    price: 500,
    currency: "ksh",
    description: "Perfect for agencies getting started",
    features: ["Basic agency profile", "Standard visibility"],
    highlighted: false,
  },
  {
    name: "GOLD TIER",
    tier: "Gold",
    price: 1000,
    currency: "ksh",
    description: "For growing agencies ready to scale",
    features: [
      "Priority support from our ceryanna team",
      "Essential in-app marketing for increased visibility",
      "Targeted social media promotions to attract more employers",
    ],
    highlighted: true,
    icon: <Zap className="h-5 w-5" />,
  },
  {
    name: "PLATINUM TIER",
    tier: "Platinum",
    price: 1500,
    currency: "ksh",
    description: "For agencies seeking maximum exposure",
    features: [
      "Dedicated premium support for faster resolutions",
      "Featured placement in employer searches and listings",
      "Enhanced in-app marketing tools to spotlight your agency",
      "Exclusive social media promotions to boost your reach",
    ],
    highlighted: false,
  },
];

export function SubscriptionPlans() {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <div className="mx-auto max-w-7xl  pb-6">
     
      <div className="grid md:grid-cols-3 gap-12 md:gap-4 lg:gap-10">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            onMouseEnter={() => setHoveredPlan(plan.tier)}
            onMouseLeave={() => setHoveredPlan(null)}
            className={`group relative rounded-2xl bg-white border shadow-sm hover:shadow-xl transition-all duration-300  p-4 cursor-pointer flex flex-col h-full ${
              plan.highlighted ? "border-blue-400/60 shadow-xl scale-[1.03]" : ""
            }`}
          >
            {/* Highlight Badge */}
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 text-white shadow-lg">
                  <span className="text-xs font-bold tracking-wide">RECOMMENDED</span>
                </div>
              </div>
            )}


            {/* Content Wrapper (Pushes button down) */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                  {plan.tier}
                </h3>
                {plan.icon && <div className="text-blue-500">{plan.icon}</div>}
              </div>

              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="lg:text-5xl text-primary text-3xl font-extrabold text-gray-900">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 font-medium">{plan.currency}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">per head / month</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3  items-start">
                    <Check
                      className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-blue-500" : "text-cyan-500"
                      }`}
                    />
                    <span className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button (Always Bottom) */}
            <Button
              size={"lg"}
              variant={plan.highlighted ? "default" : "outline"}
              className={`mt-auto w-full rounded-xl  font-semibold uppercase tracking-wide transition-all duration-300  ${
                plan.highlighted
                  ? "bg-primary text-white hover:shadow-lg hover:scale-105"
                  : ""
              }`}
            >
              Choose {plan.tier}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
