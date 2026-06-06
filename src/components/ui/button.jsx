"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Full-page loading overlay rendered via a Portal.
 * Shows whenever any Button has isActionLoading={true}.
 */
function LoadingOverlay() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Prevent background scroll while loading
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        animation: "fadeIn 0.15s ease",
      }}
      aria-label="Loading, please wait"
    >
      {/* Card */}
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "2rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          animation: "slideUp 0.2s ease",
        }}
      >
        {/* Spinner ring */}
        <div style={{ position: "relative", width: 56, height: 56 }}>
          {/* Outer track */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "4px solid #e9d5f5",
            }}
          />
          {/* Spinning arc */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "4px solid transparent",
              borderTopColor: "var(--color-primary, #7c3aed)",
              animation: "spin 0.8s linear infinite",
            }}
          />
          {/* Center dot */}
          <div
            style={{
              position: "absolute",
              inset: "30%",
              borderRadius: "50%",
              background: "var(--color-primary, #7c3aed)",
              opacity: 0.25,
            }}
          />
        </div>

        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#374151",
            letterSpacing: "0.01em",
          }}
        >
          Please wait…
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            color: "#9ca3af",
            fontWeight: 400,
          }}
        >
          Processing your request
        </p>
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>,
    document.body
  );
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isActionLoading = false,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <>
      {/* Page-level overlay when this button is loading */}
      {isActionLoading && <LoadingOverlay />}

      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isActionLoading || props.disabled}
        {...props}
      >
        {/* Inline mini-spinner inside the button itself */}
        {isActionLoading && (
          <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />
        )}
        {children}
      </Comp>
    </>
  );
}

export { Button, buttonVariants };
