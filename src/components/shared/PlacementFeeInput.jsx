"use client";

import React, { useState } from "react";
import { Banknote, Percent, PenLine, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PERCENT_PRESETS = ["10%", "15%", "20%", "25%", "30%", "50%"];
const FIXED_PRESETS = ["3000", "5000", "7500", "10000", "15000"];
const BASIS_OPTIONS = [
  { id: "of employee salary", label: "of employee salary" },
  { id: "of 1st month salary", label: "of 1st month salary" },
  { id: "of monthly salary", label: "of monthly salary" },
  { id: "% only", label: "% only" },
];
const CUSTOM_SUGGESTIONS = [
  "50% of first month salary",
  "100% of first month salary",
  "15% of monthly salary for 3 months",
  "Negotiable based on experience",
];

export const parsePlacementFee = (val) => {
  if (val === null || val === undefined || String(val).trim() === "") {
    return {
      mode: "percentage",
      fixedAmount: "",
      percentAmount: "",
      percentBasis: "of house manager salary",
      customText: "",
    };
  }

  const str = String(val).trim();

  // 1. Pure numeric or "KSh <number>"
  const numMatch = str.match(/^(?:ksh\s*)?(\d+(?:\.\d+)?)$/i);
  if (numMatch) {
    return {
      mode: "fixed",
      fixedAmount: numMatch[1],
      percentAmount: "",
      percentBasis: "of house manager salary",
      customText: "",
    };
  }

  // 2. Percentage pattern: "20%", "20% of ..."
  const pctMatch = str.match(/^(\d+(?:\.\d+)?)\s*%\s*(?:of\s+(.+))?$/i);
  if (pctMatch) {
    const pct = pctMatch[1];
    const rawBasis = pctMatch[2] ? pctMatch[2].toLowerCase().trim() : "";
    let basis = "of house manager salary";
    if (!rawBasis) {
      basis = "% only";
    } else if (rawBasis.includes("1st") || rawBasis.includes("first")) {
      basis = "of 1st month salary";
    } else if (rawBasis.includes("monthly")) {
      basis = "of monthly salary";
    } else if (rawBasis.includes("house manager")) {
      basis = "of house manager salary";
    } else {
      basis = `of ${pctMatch[2].trim()}`;
    }
    return {
      mode: "percentage",
      fixedAmount: "",
      percentAmount: pct,
      percentBasis: basis,
      customText: "",
    };
  }

  // 3. Custom text / written down
  return {
    mode: "custom",
    fixedAmount: "",
    percentAmount: "",
    percentBasis: "of house manager salary",
    customText: str,
  };
};

const buildPercentValue = (amount, basis) => {
  if (!amount && amount !== 0) return "";
  const cleaned = String(amount).replace(/%/g, "").trim();
  if (!cleaned) return "";
  if (basis === "% only") {
    return `${cleaned}%`;
  }
  return `${cleaned}% ${basis}`;
};

const PlacementFeeInput = ({
  value = "",
  onChange,
  name = "placementFee",
  label = "Placement Fee",
  error,
  className,
}) => {
  const initial = parsePlacementFee(value);
  const [mode, setMode] = useState(initial.mode);
  const [fixedAmount, setFixedAmount] = useState(initial.fixedAmount);
  const [percentAmount, setPercentAmount] = useState(initial.percentAmount);
  const [percentBasis, setPercentBasis] = useState(initial.percentBasis);
  const [customText, setCustomText] = useState(initial.customText);

  const [prevPropValue, setPrevPropValue] = useState(value);
  if (value !== prevPropValue) {
    setPrevPropValue(value);
    const parsed = parsePlacementFee(value);
    setMode(parsed.mode);
    setFixedAmount(parsed.fixedAmount);
    setPercentAmount(parsed.percentAmount);
    setPercentBasis(parsed.percentBasis);
    setCustomText(parsed.customText);
  }

  const emit = (val) => {
    setPrevPropValue(val);
    if (onChange) {
      onChange({
        target: {
          name,
          value: val,
        },
      });
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "fixed") {
      emit(fixedAmount);
    } else if (newMode === "percentage") {
      emit(buildPercentValue(percentAmount, percentBasis));
    } else if (newMode === "custom") {
      emit(customText);
    }
  };

  const handleFixedChange = (val) => {
    const cleaned = val.replace(/[^\d.]/g, "");
    setFixedAmount(cleaned);
    emit(cleaned);
  };

  const handlePercentChange = (val) => {
    const cleaned = val.replace(/[^\d.]/g, "");
    setPercentAmount(cleaned);
    emit(buildPercentValue(cleaned, percentBasis));
  };

  const handleBasisChange = (newBasis) => {
    setPercentBasis(newBasis);
    emit(buildPercentValue(percentAmount, newBasis));
  };

  const handleCustomChange = (val) => {
    setCustomText(val);
    emit(val);
  };

  const currentPreview = () => {
    if (mode === "percentage") {
      return buildPercentValue(percentAmount, percentBasis) || "e.g. 20% of house manager salary";
    }
    if (mode === "fixed") {
      return fixedAmount ? `KSh ${Number(fixedAmount).toLocaleString()}` : "e.g. KSh 5,000";
    }
    return customText || "e.g. 50% of first month salary";
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} <span className="text-red-500">*</span>
        </label>
     
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => handleModeChange("percentage")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 px-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer",
            mode === "percentage"
              ? "bg-primary text-white shadow-xs font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
          )}
        >
          <Percent className="size-3.5 sm:size-4 shrink-0" />
          <span className="truncate">% of Salary</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("fixed")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 px-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer",
            mode === "fixed"
              ? "bg-primary text-white shadow-xs font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
          )}
        >
          <Banknote className="size-3.5 sm:size-4 shrink-0" />
          <span className="truncate">Fixed (KSh)</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("custom")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 px-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer",
            mode === "custom"
              ? "bg-primary text-white shadow-xs font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
          )}
        >
          <PenLine className="size-3.5 sm:size-4 shrink-0" />
          <span className="truncate">Write it down</span>
        </button>
      </div>

      {/* Mode Content: Percentage of Salary */}
      {mode === "percentage" && (
        <div className="p-4 bg-purple-50/40 rounded-xl border border-primary/20 space-y-3.5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Percentage of House Manager Salary
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Quick select:</span>
              <div className="flex flex-wrap gap-1">
                {PERCENT_PRESETS.map((preset) => {
                  const num = preset.replace("%", "");
                  const isSelected = percentAmount === num;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePercentChange(num)}
                      className={cn(
                        "px-2 py-0.5 text-xs rounded border transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary text-white border-primary font-medium"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                      )}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Percentage input */}
            <div className="sm:col-span-4">
              <div className="relative flex items-center rounded-md border border-input bg-white overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 20"
                  value={percentAmount}
                  onChange={(e) => handlePercentChange(e.target.value)}
                  className="w-full bg-transparent px-3 py-2.5 text-sm font-semibold outline-none text-gray-900"
                />
                <span className="px-3 py-2.5 bg-gray-50 text-gray-600 text-sm font-bold border-l">
                  %
                </span>
              </div>
            </div>

            {/* Salary Basis Chips */}
            <div className="sm:col-span-8 flex flex-wrap items-center gap-1.5">
              {BASIS_OPTIONS.map((basis) => {
                const isSelected = percentBasis === basis.id;
                return (
                  <button
                    key={basis.id}
                    type="button"
                    onClick={() => handleBasisChange(basis.id)}
                    className={cn(
                      "px-2.5 py-1.5 text-xs rounded-md border transition-all cursor-pointer flex items-center gap-1",
                      isSelected
                        ? "bg-primary text-white border-primary font-medium shadow-2xs"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {isSelected && <Check className="size-3" />}
                    {basis.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview & Write it down switch */}
          <div className="pt-2 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="text-gray-600 flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-gray-700">Display Preview:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                {currentPreview()}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleModeChange("custom")}
              className="text-primary hover:underline font-medium text-left cursor-pointer"
            >
              Have unique fee terms? Write it down &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Mode Content: Fixed Amount KSh */}
      {mode === "fixed" && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Fixed Placement Fee (KSh)
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Quick select:</span>
              <div className="flex flex-wrap gap-1">
                {FIXED_PRESETS.map((amt) => {
                  const isSelected = fixedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleFixedChange(amt)}
                      className={cn(
                        "px-2 py-0.5 text-xs rounded border transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary text-white border-primary font-medium"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                      )}
                    >
                      KSh {Number(amt).toLocaleString()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative flex items-center rounded-md border border-input bg-white overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
            <span className="px-3 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium border-r">
              KSh
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 5,000"
              value={fixedAmount}
              onChange={(e) => handleFixedChange(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-sm font-semibold outline-none text-gray-900"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span>One-off fixed placement fee paid upon successful hiring.</span>
            {fixedAmount && (
              <span className="font-medium text-gray-700">
                Display: KSh {Number(fixedAmount).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mode Content: Write It Down (Custom) */}
      {mode === "custom" && (
        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/80 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              
              Write Down Placement Fee Terms
            </span>
           
          </div>

          {/* Preset Suggestions */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-gray-500">Suggestions:</span>
            {CUSTOM_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleCustomChange(suggestion)}
                className="px-2 py-0.5 text-xs bg-white hover:bg-amber-100/60 text-gray-700 border border-gray-200 rounded transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="relative rounded-md border border-input bg-white overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
            <input
              type="text"
              placeholder="e.g. 50% of first month salary, 15% monthly, or negotiable..."
              value={customText}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none text-gray-900 placeholder:text-gray-400 font-medium"
            />
          </div>

         
        </div>
      )}

      {/* Hidden input to ensure native form compatibility */}
      <input type="hidden" name={name} value={value || ""} />

      {/* Error display */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PlacementFeeInput;
