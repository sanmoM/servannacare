"use client";

import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  CheckCircle2,
  Trash2,
  Calendar as CalIcon,
  MousePointer2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { format, eachDayOfInterval, isBefore, startOfToday } from "date-fns";
import { postApi } from "@/lib/apiHandler";

const ProfessionalSchedule = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [isPublishing, setIsPublishing] = useState(false);
  const today = startOfToday();

  const BRAND_COLOR = "#72275b";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = useCallback(
    (selectionInfo) => {
      const start = selectionInfo.start;
      const end = new Date(selectionInfo.end);
      end.setDate(end.getDate() - 1);

      if (isBefore(start, today)) return;

      const range = eachDayOfInterval({ start, end }).map((d) =>
        format(d, "yyyy-MM-dd"),
      );

      setSelectedDates((prev) => {
        const next = new Set(prev);
        const isSingleToggle = range.length === 1;
        range.forEach((date) => {
          if (isSingleToggle && next.has(date)) next.delete(date);
          else next.add(date);
        });
        return next;
      });
    },
    [today],
  );

const handlePublish = async () => {
  if (selectedDates.size === 0)
    return toast.error("Please select at least one day.");

  setIsPublishing(true);

 
  const payload = {
    dates: Array.from(selectedDates).sort(),
  };

  console.log("payload", payload);

  try {
    const response = await postApi("/schedule", payload); 

    if (response.status === 200) {
      toast.success(`Successfully published ${selectedDates.size} days!`, {
        style: { background: BRAND_COLOR, color: "#fff" },
      });
    } else {
      throw new Error("Failed to publish schedule");
    }
  } catch (error) {
    console.error("Payload Error:", error);
    toast.error("API Error: Could not save schedule.");
  } finally {
    setIsPublishing(false);
  }
};




  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFD] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div
              style={{ backgroundColor: BRAND_COLOR }}
              className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl"
            >
              <CalIcon size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">
                Availability Specialist
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Select dates and publish to API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end px-6 border-r border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Selected
              </span>
              <span
                style={{ color: BRAND_COLOR }}
                className="text-2xl font-black leading-none"
              >
                {selectedDates.size}
              </span>
            </div>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              style={{ backgroundColor: BRAND_COLOR }}
              className="hover:opacity-90 text-white h-16 px-10 rounded-2xl font-bold shadow-xl shadow-[#72275b]/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 size={20} className="mr-2 animate-spin" />
              ) : (
                <CheckCircle2 size={20} className="mr-2" />
              )}
              {isPublishing ? "Sending..." : "Publish Schedule"}
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-6 md:p-12 relative overflow-hidden">
          <div className="flex justify-between mb-10">
            <div className="flex items-center gap-3 text-slate-400">
              <MousePointer2 size={16} style={{ color: BRAND_COLOR }} />
              <span className="text-[11px] font-black uppercase tracking-widest">
                Toggle dates or drag for ranges
              </span>
            </div>
            <button
              onClick={() => setSelectedDates(new Set())}
              className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-2 transition-all"
            >
              <Trash2 size={16} /> Reset
            </button>
          </div>

          <div className="calendar-ui-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              selectMirror={true}
              unselectAuto={false}
              select={handleSelect}
              headerToolbar={{
                left: "title",
                center: "",
                right: "prev,next today",
              }}
              height="auto"
              fixedWeekCount={false}
              dayCellClassNames={(arg) => {
                const dateStr = format(arg.date, "yyyy-MM-dd");
                let classes = [];
                if (isBefore(arg.date, today))
                  classes.push("disabled-day-cell");
                if (selectedDates.has(dateStr)) classes.push("is-selected-day");
                return classes;
              }}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .fc-daygrid-day {
          cursor: pointer !important;
        }
        .fc .fc-view-harness {
          cursor: default !important;
        }
        .fc-highlight {
          cursor: pointer !important;
          opacity: 0.1;
        }

        .disabled-day-cell {
          background-color: #fafafa !important;
          pointer-events: none !important;
          opacity: 0.3;
        }
        .disabled-day-cell .fc-daygrid-day-number {
          text-decoration: line-through;
          color: #cbd5e1 !important;
        }

        .fc {
          --fc-border-color: #f3f4f6;
        }
        .fc-toolbar-title {
          font-size: 1.5rem !important;
          font-weight: 900 !important;
          color: #1e293b;
        }

        .fc-button {
          background: #fff !important;
          border: 1px solid #e2e8f0 !important;
          color: #64748b !important;
          font-weight: 800 !important;
          border-radius: 12px !important;
        }
        .fc-button:hover {
          border-color: ${BRAND_COLOR} !important;
          color: ${BRAND_COLOR} !important;
        }
        .fc-button-active {
          background: ${BRAND_COLOR} !important;
          color: white !important;
          border-color: ${BRAND_COLOR} !important;
        }

        .fc-col-header-cell {
          padding: 15px 0 !important;
          background: #fbfcfe;
          border-bottom: 2px solid #f3f4f6 !important;
        }
        .fc-col-header-cell-cushion {
          font-size: 11px !important;
          font-weight: 900 !important;
          color: #94a3b8 !important;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .fc-daygrid-day-number {
          font-weight: 900 !important;
          font-size: 15px !important;
          color: #475569;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px auto !important;
          border-radius: 50%;
          z-index: 2;
        }

        /* THE STYLING YOU ASKED FOR */
        .is-selected-day .fc-daygrid-day-number {
          background-color: ${BRAND_COLOR} !important;
          color: white !important;
          box-shadow: 0 4px 10px rgba(114, 39, 91, 0.3);
        }

        .fc-bg-event {
          display: none !important;
        }

        .fc-day-today:not(.is-selected-day) .fc-daygrid-day-number {
          color: ${BRAND_COLOR} !important;
          background: #fdf4ff;
          border: 1px solid #fae8ff;
        }
      `}</style>
    </div>
  );
};

export default ProfessionalSchedule;
