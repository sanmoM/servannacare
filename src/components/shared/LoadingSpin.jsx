"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function LoadingSpinner({ size = 24, className }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full mx-auto border-4 border-gray-300 border-t-primary",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
