"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export const WhatsAppIcon = ({ className = "size-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 2C6.516 2 2.029 6.486 2.029 12c0 2.188.71 4.218 1.921 5.867L2 22l4.316-1.913A9.914 9.914 0 0 0 12.031 22c5.514 0 10.001-4.486 10.001-10s-4.487-10-10.001-10zm0 18.25c-1.854 0-3.578-.588-4.992-1.587l-.358-.251-2.56.804.818-2.493-.243-.365A8.197 8.197 0 0 1 3.781 12c0-4.549 3.701-8.25 8.25-8.25s8.25 3.701 8.25 8.25-3.701 8.25-8.25 8.25zm4.524-6.177c-.248-.124-1.467-.723-1.694-.806-.228-.083-.394-.124-.56.124-.166.248-.642.806-.787.972-.145.166-.29.186-.538.062-.248-.124-1.047-.386-1.995-1.231-.738-.658-1.236-1.471-1.381-1.719-.145-.248-.016-.382.108-.505.112-.111.248-.29.373-.435.124-.145.166-.248.248-.414.083-.166.041-.311-.021-.435-.062-.124-.56-1.35-.767-1.849-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.248-.87 0.85-.87 2.073 0 1.223.891 2.405 1.015 2.571.124.166 1.752 2.675 4.245 3.751.593.256 1.056.409 1.418.524.596.189 1.138.162 1.567.098.478-.071 1.467-.6 1.674-1.18.207-.58.207-1.077.145-1.18-.062-.103-.228-.166-.476-.29z" />
  </svg>
);

const WHATSAPP_URL = "https://wa.me/message/BCDIGKLB5F4OF1";

const WhatsAppCTA = ({ hasChatbot = true }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show callout tooltip after a short delay to draw attention
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("wa_cta_dismissed");
      if (!dismissed) {
        setShowTooltip(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    sessionStorage.setItem("wa_cta_dismissed", "true");
  };

  return (
    <aside
      aria-label="WhatsApp Support"
      className={`fixed ${
        hasChatbot ? "bottom-[90px]" : "bottom-6"
      } right-6 z-50 flex flex-col items-end gap-2 select-none`}
    >
      {/* Callout Prompt Bubble */}
      {showTooltip && (
        <div className="relative animate-bounce-subtle bg-white text-gray-800 rounded-2xl p-3.5 shadow-2xl border border-gray-100 max-w-[260px] sm:max-w-[280px] transition-all text-left">
          <button
            onClick={handleDismiss}
            aria-label="Dismiss WhatsApp popup"
            className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-1 shadow-xs transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-left group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600">
                Online • Instant Reply
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
              👋 Need care or have questions?
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
              Chat with Cervanna Care directly on WhatsApp.
            </p>
          </a>
        </div>
      )}

      {/* Main Floating Action Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex items-center gap-2.5 cursor-pointer"
      >
 

        {/* Circular WhatsApp Button stacked right above Chatbot button */}
        <div className="relative w-[58px] h-[58px] rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-300 transform group-hover:scale-105 active:scale-95">
     

          <WhatsAppIcon className="size-7 text-white shrink-0 drop-shadow-xs" />
        </div>
      </a>
    </aside>
  );
};

export default WhatsAppCTA;
