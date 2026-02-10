"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CheckCircle, Trash2, Calendar as CalIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { format, isSameDay, parseISO } from "date-fns";

const ProfessionalSchedule = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]); // Array of ISO strings

  useEffect(() => { setMounted(true); }, []);

  // --- Toggle Logic ---
  const handleDateClick = (arg) => {
    const dateStr = arg.dateStr; // Format: "YYYY-MM-DD"
    
    setSelectedDates((prev) => {
      if (prev.includes(dateStr)) {
        // Unselect (2nd click)
        return prev.filter((d) => d !== dateStr);
      } else {
        // Select (1st click)
        return [...prev, dateStr];
      }
    });
  };

  const handlePublish = () => {
    if (selectedDates.length === 0) return toast.error("Select dates first");
    console.log("Published Dates:", selectedDates);
    toast.success(`Successfully published ${selectedDates.length} days!`);
  };

  // Convert our simple strings into FullCalendar events
  const events = selectedDates.map((date) => ({
    start: date,
    allDay: true,
    display: "background",
    backgroundColor: "#2563eb", // bg-primary
    classNames: ["selected-date-glow"],
  }));

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Area */}
        <div className="bg-white rounded-[2rem] p-8 border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg">
              <CalIcon size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black">Availability Specialist</h1>
              <p className="text-sm text-slate-500 font-medium">Click dates to toggle selection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Active selection</span>
                <span className="text-lg font-black text-primary">{selectedDates.length} Days</span>
            </div>
            <Button onClick={handlePublish} className="bg-primary cursor-pointer h-12 px-8 rounded-xl font-bold shadow-md transition-all active:scale-95">
              <CheckCircle size={18} className="mr-2" /> Publish
            </Button>
          </div>
        </div>

        {/* Big Calendar Section */}
        <div className="bg-white rounded-[2.5rem] border shadow-xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-8 left-10 flex items-center gap-2 text-slate-400 z-10">
            <Info size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Click individual dates or select across days</span>
          </div>

          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              dateClick={handleDateClick}
              events={events}
              headerToolbar={{
                left: "title",
                center: "",
                right: "prev,next",
              }}
              height="auto"
              fixedWeekCount={false}
              dayMaxEvents={true}
            />
          </div>

          <div className="mt-8 pt-8 border-t flex justify-between items-center">
            <button 
              onClick={() => setSelectedDates([])}
              className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} /> Reset Selection
            </button>
            <p className="text-[11px] font-medium text-slate-400 italic">
              Blue cells indicate your confirmed availability.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* FullCalendar Customization */
        .fc { --fc-border-color: #f1f5f9; font-family: inherit; }
        .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 900 !important; color: #1e293b; text-transform: capitalize; }
        .fc-button-primary { background-color: white !important; border-color: #e2e8f0 !important; color: #64748b !important; padding: 8px 12px !important; border-radius: 12px !important; }
        .fc-button-primary:hover { background-color: #f8fafc !important; color: #1e293b !important; }
        .fc-col-header-cell { padding: 12px 0 !important; background: #f8fafc; }
        .fc-col-header-cell-cushion { font-size: 11px !important; font-weight: 800 !important; color: #94a3b8 !important; text-transform: uppercase; letter-spacing: 0.05em; }
        
        /* Cell Styling */
        .fc-daygrid-day { transition: all 0.2s ease; cursor: pointer; }
        .fc-daygrid-day:hover { background-color: #f1f7ff; }
        .fc-daygrid-day-number { font-weight: 800 !important; font-size: 14px !important; color: #475569; padding: 10px !important; }
        
        /* The "Selected" look */
        .selected-date-glow {
          opacity: 0.8;
          border: 2px solid #2563eb !important;
          box-shadow: inset 0 0 20px rgba(37, 99, 235, 0.1);
        }

        .fc-day-today { background: #f8fafc !important; }
        .fc-day-today .fc-daygrid-day-number { color: #2563eb; background: #eff6ff; border-radius: 8px; }
      `}</style>
    </div>
  );
};

export default ProfessionalSchedule;