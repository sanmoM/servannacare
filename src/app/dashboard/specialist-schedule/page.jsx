"use client";

import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CheckCircle2, Trash2, Calendar as CalIcon, MousePointer2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { format, eachDayOfInterval, isBefore, startOfToday } from "date-fns";

const ProfessionalSchedule = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedDates, setSelectedDates] = useState(new Set());
  const today = startOfToday();

  // Your brand color
  const BRAND_COLOR = "#72275b";

  useEffect(() => { setMounted(true); }, []);

  // --- Multi-Select & Toggle Logic ---
  const handleSelect = useCallback((selectionInfo) => {
    const start = selectionInfo.start;
    const end = new Date(selectionInfo.end);
    end.setDate(end.getDate() - 1); 

    // Prevent interaction with past dates
    if (isBefore(start, today)) return;

    const range = eachDayOfInterval({ start, end }).map(d => format(d, "yyyy-MM-dd"));
    
    setSelectedDates(prev => {
      const next = new Set(prev);
      const isSingleToggle = range.length === 1;
      
      range.forEach(date => {
        if (isSingleToggle && next.has(date)) {
          next.delete(date);
        } else {
          next.add(date);
        }
      });
      return next;
    });
  }, [today]);

  const handlePublish = () => {
    if (selectedDates.size === 0) return toast.error("Select availability dates first");
    toast.success(`Schedule Published! ${selectedDates.size} days active.`, {
      style: { borderRadius: '12px', background: BRAND_COLOR, color: '#fff' }
    });
  };

  const events = Array.from(selectedDates).map((date) => ({
    start: date,
    allDay: true,
    display: "background",
    backgroundColor: BRAND_COLOR,
  }));

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFD] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header --- */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div 
              style={{ backgroundColor: BRAND_COLOR }}
              className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-[#72275b]/30"
            >
              <CalIcon size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">Availability Specialist</h1>
              <p className="text-sm text-slate-500 font-medium">Configure your working schedule</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end px-6 border-r border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Days</span>
                <span style={{ color: BRAND_COLOR }} className="text-2xl font-black">{selectedDates.size}</span>
            </div>
            <Button 
              onClick={handlePublish} 
              style={{ backgroundColor: BRAND_COLOR }}
              className="hover:opacity-90 text-white h-16 px-10 rounded-2xl font-bold shadow-xl shadow-[#72275b]/20 transition-all active:scale-95 cursor-pointer border-none"
            >
              <CheckCircle2 size={20} className="mr-2" />
              Publish Plan
            </Button>
          </div>
        </div>

        {/* --- Calendar Container --- */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-6 md:p-12 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 text-slate-400">
              <MousePointer2 size={16} style={{ color: BRAND_COLOR }} />
              <span className="text-[11px] font-black uppercase tracking-widest">Click or drag to manage your dates</span>
            </div>
            <button 
              onClick={() => setSelectedDates(new Set())}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-all p-2"
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
              events={events}
              headerToolbar={{
                left: "title",
                center: "",
                right: "prev,next today",
              }}
              height="auto"
              fixedWeekCount={false}
              dayCellClassNames={(arg) => {
                if (isBefore(arg.date, today)) {
                  return "disabled-day-cell";
                }
                return "";
              }}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* CURSOR RESET - STOP THE PLUS SIGN */
        .fc-daygrid-day { cursor: pointer !important; }
        .fc .fc-view-harness { cursor: default !important; }
        .fc-highlight { cursor: pointer !important; }

        /* DISABLED PAST DATES */
        .disabled-day-cell {
          background-color: #fafafa !important;
          pointer-events: none !important;
          opacity: 0.3;
        }
        .disabled-day-cell .fc-daygrid-day-number {
          text-decoration: line-through;
          color: #cbd5e1 !important;
        }

        /* CALENDAR BRANDING */
        .fc { --fc-border-color: #f3f4f6; }
        .fc-toolbar-title { font-size: 1.5rem !important; font-weight: 900 !important; color: #1e293b; }
        
        .fc-button { 
          background: #fff !important; 
          border: 1px solid #e2e8f0 !important; 
          color: #64748b !important; 
          font-weight: 800 !important; 
          border-radius: 12px !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
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

        .fc-col-header-cell { padding: 15px 0 !important; background: #fbfcfe; border-bottom: 2px solid #f3f4f6 !important; }
        .fc-col-header-cell-cushion { font-size: 11px !important; font-weight: 900 !important; color: #94a3b8 !important; text-transform: uppercase; letter-spacing: 0.1em; }
        
        .fc-daygrid-day-number { font-weight: 900 !important; font-size: 15px !important; color: #475569; padding: 12px !important; }
        
        /* THE SELECTED BACKGROUND */
        .fc-bg-event { 
            opacity: 1 !important; 
            background-color: ${BRAND_COLOR} !important; 
            box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
        }

        .fc-highlight { background: rgba(114, 39, 91, 0.1) !important; }

        /* TODAY MARKER */
        .fc-day-today { background: transparent !important; }
        .fc-day-today .fc-daygrid-day-number { 
          color: ${BRAND_COLOR} !important; 
          background: #fdf4ff; 
          border-radius: 10px; 
          margin: 8px;
          border: 1px solid #fae8ff;
        }
      `}</style>
    </div>
  );
};

export default ProfessionalSchedule;