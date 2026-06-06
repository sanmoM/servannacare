"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CheckCircle2, Trash2, Calendar as CalIcon, MousePointer2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { format, eachDayOfInterval, isBefore, startOfToday } from "date-fns";
import { postApi } from "@/lib/apiHandler";
import { useFetch } from "@/hooks/useFetch";
const ProfessionalSchedule = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const isDraggingRef = useRef(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const today = startOfToday();
  const BRAND_COLOR = "#72275b";
  const {
    data,
    error,
    loading
  } = useFetch("/profile");
  useEffect(() => {
    if (data?.data?.schedule?.length) {
      const allDates = data.data.schedule.flatMap(s => s.date);
      setSelectedDates(new Set(allDates));
    }
  }, [data]);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleSelect = useCallback(selectionInfo => {
    isDraggingRef.current = true;
    const start = selectionInfo.start;
    const end = new Date(selectionInfo.end);
    end.setDate(end.getDate() - 1);
    if (isBefore(start, today)) return;
    const range = eachDayOfInterval({
      start,
      end
    }).map(d => format(d, "yyyy-MM-dd"));
    setSelectedDates(prev => {
      const next = new Set(prev);
      const isSingleToggle = range.length === 1;
      range.forEach(date => {
        if (isSingleToggle && next.has(date)) next.delete(date);else next.add(date);
      });
      return next;
    });
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  }, [today]);
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  const handleDateClick = info => {
    if (isDraggingRef.current) return;
    const dateStr = format(info.date, "yyyy-MM-dd");
    if (isBefore(info.date, today)) return;
    setSelectedDates(prev => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);else next.add(dateStr);
      return next;
    });
  };
  const handlePublish = async () => {
    if (selectedDates.size === 0) return toast.error("Please select at least one day.");
    setIsPublishing(true);
    const payload = {
      date: Array.from(selectedDates).sort()
    };
    try {
      const response = await postApi("/schedule", payload);
      if (response.status === 200) {
        toast.success(`Successfully published ${selectedDates.size} days!`, {
          style: {
            background: BRAND_COLOR,
            color: "#fff"
          }
        });
        if (response.data?.data?.date) {
          setSelectedDates(new Set(response.data.data.date));
        }
      } else {
        throw new Error("Failed to publish schedule");
      }
    } catch (error) {
      toast.error("API Error: Could not save schedule.");
    } finally {
      setIsPublishing(false);
    }
  };
  if (!mounted || loading) return null;
  return <div className="min-h-screen bg-[#FDFCFD] font-sans text-slate-900">
      <div className="w-full py-4 space-y-6">
    
        <div className="bg-white rounded-lg p-6 md:p-10 border border-slate-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div style={{
            backgroundColor: BRAND_COLOR
          }} className="w-16 h-16 rounded-lg flex items-center justify-center text-white shadow-2xl">
              <CalIcon size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">
                Specialist availability
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Select dates and publish to API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-2 sm:gap-0 sm:px-6 sm:border-r border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Selected
              </span>
              <span style={{
              color: BRAND_COLOR
            }} className="text-xl sm:text-2xl font-black leading-none">
                {selectedDates.size}
              </span>
            </div>
            <Button onClick={handlePublish} disabled={isPublishing} style={{
            backgroundColor: BRAND_COLOR
          }} className="hover:opacity-90 text-white h-16 px-10 rounded-lg font-bold shadow-xl shadow-[#72275b]/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50" isActionLoading={isActionLoading}>
              {isPublishing ? <Loader2 size={20} className="mr-2 animate-spin" /> : <CheckCircle2 size={20} className="mr-2" />}
              {isPublishing ? "Sending..." : "Publish Schedule"}
            </Button>
          </div>
        </div>

      
        <div className="bg-white rounded-lg border border-slate-100 shadow-2xl p-6 md:p-12 relative overflow-hidden">
          <div className="flex justify-between mb-10">
            <div className="flex items-center gap-3 text-slate-400">
              <MousePointer2 size={16} style={{
              color: BRAND_COLOR
            }} />
              <span className="text-[11px] font-black uppercase tracking-widest">
                Toggle dates or drag for ranges
              </span>
            </div>
            <button onClick={() => {
            if (data?.schedule?.length) {
              const allDates = data.schedule.flatMap(s => s.date);
              setSelectedDates(new Set(allDates));
            } else {
              setSelectedDates(new Set());
            }
          }} className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-2 transition-all">
              <Trash2 size={16} /> Reset
            </button>
          </div>

          <div className="calendar-ui-wrapper">
            <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" selectable={true} selectMirror={true} unselectAuto={false} select={handleSelect} dateClick={handleDateClick} longPressDelay={300} selectLongPressDelay={300} headerToolbar={{
            left: "title",
            center: "",
            right: "prev,next today"
          }} height="auto" contentHeight="auto" aspectRatio={1.35} fixedWeekCount={false} dayCellClassNames={arg => {
            const dateStr = format(arg.date, "yyyy-MM-dd");
            let classes = [];
            if (isBefore(arg.date, today)) {
              classes.push("disabled-day-cell");
            }
            if (selectedDates.has(dateStr)) {
              classes.push("is-selected-day");
            }
            return classes;
          }} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .fc-daygrid-day {
          cursor: pointer !important;
          touch-action: manipulation;
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

        .is-selected-day {
          background-color: ${BRAND_COLOR} !important;
          color: white !important;
          border-radius: 0.5rem; /* optional: rounded corners for nicer look */
          box-shadow: 0 4px 10px rgba(114, 39, 91, 0.3);
        }

        /* Make the day number itself visible on top */
        .is-selected-day .fc-daygrid-day-number {
          color: white !important;
          background: transparent !important; /* remove circle background */
          box-shadow: none !important;
        }
      `}</style>
    </div>;
};
export default ProfessionalSchedule;