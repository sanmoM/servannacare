"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Check, Clock, Save, Loader2, Calendar as CalIcon, ArrowRight, Trash2, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { format, parseISO, startOfToday, eachDayOfInterval, getDay } from "date-fns";

// --- Date Picker ---
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/purple.css";

const SchedulePage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Selection States ---
  const [dailyDays, setDailyDays] = useState([]); 
  const [monthlyDates, setMonthlyDates] = useState([]); 
  const [slot, setSlot] = useState({ start: "09:00", end: "17:00" });
  const [activeSchedules, setActiveSchedules] = useState([]);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = startOfToday();

  useEffect(() => { setMounted(true); }, []);

  // --- Logic: Identify Occupied Slots ---
  const activeRegistry = useMemo(() => {
    const dates = new Set();
    const recurringDays = new Set();
    activeSchedules.forEach(s => {
      if (s.details.days) s.details.days.forEach(day => recurringDays.add(day));
      if (s.details.dates) Object.keys(s.details.dates).forEach(d => dates.add(d));
    });
    return { dates, recurringDays };
  }, [activeSchedules]);

  const toggleDailyDay = (day) => {
    if (activeRegistry.recurringDays.has(day)) {
      return toast.error(`${day} is already published.`);
    }
    setDailyDays((prev) => 
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    const isDaily = activeTab === "daily";
    if (isDaily && dailyDays.length === 0) return toast.error("Select at least one day");
    if (!isDaily && monthlyDates.length === 0) return toast.error("Select dates on the calendar");

    setIsSubmitting(true);
    let monthlyPayload = {};

    if (!isDaily) {
      monthlyDates.forEach((dateInstance) => {
        const dArray = Array.isArray(dateInstance) ? dateInstance : [dateInstance, dateInstance];
        const start = dArray[0]?.toDate();
        const end = dArray[1]?.toDate() || start;
        eachDayOfInterval({ start, end }).forEach(d => {
          monthlyPayload[format(d, "yyyy-MM-dd")] = [{ ...slot }];
        });
      });
    }

    setTimeout(() => {
      const payload = {
        id: Date.now(),
        type: isDaily ? "Daily Recurring" : "Specific Range",
        price: isDaily ? "KSH 4" : "KSH 100",
        color: isDaily ? "bg-primary" : "bg-purple-600",
        details: isDaily ? { days: dailyDays } : { dates: monthlyPayload }
      };
      setActiveSchedules([payload, ...activeSchedules]);
      setDailyDays([]);
      setMonthlyDates([]);
      setIsSubmitting(false);
      toast.success("Availability Published Successfully");
    }, 600);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Unified Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border shadow-sm gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Set Availability</h1>
              <p className="text-sm text-slate-500 font-medium">Configure your working windows and rates</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
            <button 
              onClick={() => setActiveTab("daily")} 
              className={`flex-1 md:px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "daily" ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}
            >
              Daily
            </button>
            <button 
              onClick={() => setActiveTab("monthly")} 
              className={`flex-1 md:px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "monthly" ? "bg-purple-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Main Workspace (Left) --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] border shadow-sm min-h-[550px] overflow-hidden flex flex-col">
              
              {activeTab === "daily" ? (
                <div className="p-10 flex-1 space-y-8 animate-in fade-in duration-500">
                  <div className="border-b pb-6">
                    <h2 className="text-xl font-bold">Recurring Working Days</h2>
                    <p className="text-sm text-slate-400">Select days that repeat every week at KSH 4/day</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {daysOfWeek.map(day => {
                      const isActive = activeRegistry.recurringDays.has(day);
                      const isSelected = dailyDays.includes(day);
                      return (
                        <button 
                          key={day} 
                          disabled={isActive}
                          onClick={() => toggleDailyDay(day)} 
                          className={`group h-32 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                            isActive ? "bg-slate-50 border-slate-100 text-slate-300 opacity-60 grayscale cursor-not-allowed" :
                            isSelected ? "bg-primary border-primary text-white shadow-xl shadow-blue-200 -translate-y-1" : "bg-white border-slate-100 text-slate-400 hover:border-primary/30"
                          }`}
                        >
                          <span className="text-xs font-black uppercase tracking-widest">{day.substring(0, 3)}</span>
                          {isActive ? <Lock size={18} /> : isSelected ? <Check size={20} className="bg-white/20 p-1 rounded-full" /> : <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-primary/40" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row flex-1 animate-in fade-in duration-500">
                  {/* Calendar Sidebar - AUTO OPENED via 'inline' */}
                  <div className="md:w-[400px] p-10 bg-slate-50 border-r flex flex-col items-center gap-6">
                    <div className="w-full text-center md:text-left">
                      <h3 className="text-purple-600 font-black text-xs uppercase tracking-widest">1. Select Dates</h3>
                      <p className="text-xs text-slate-400">Drag to select a range</p>
                    </div>
                    <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                      <DatePicker
                        multiple range inline
                        value={monthlyDates}
                        onChange={setMonthlyDates}
                        minDate={today}
                        className="purple"
                        mapDays={({ date }) => {
                          const dateString = date.format("YYYY-MM-DD");
                          const dayName = daysOfWeek[getDay(date.toDate())];
                          if (activeRegistry.dates.has(dateString) || activeRegistry.recurringDays.has(dayName)) {
                            return { disabled: true, style: { color: "#ccc", textDecoration: "line-through", opacity: 0.5 } };
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Time Config */}
                  <div className="flex-1 p-10 space-y-8">
                    <div>
                      <h3 className="font-bold text-slate-800">2. Define Hours</h3>
                      <p className="text-xs text-slate-400">Applies to all selected dates</p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200 space-y-6">
                      <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border shadow-sm">
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-slate-400 block mb-1">START TIME</label>
                          <input type="time" value={slot.start} onChange={(e) => setSlot({...slot, start: e.target.value})} className="font-bold text-xl bg-transparent outline-none w-full" />
                        </div>
                        <ArrowRight className="text-slate-300 mt-4" />
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-slate-400 block mb-1">END TIME</label>
                          <input type="time" value={slot.end} onChange={(e) => setSlot({...slot, end: e.target.value})} className="font-bold text-xl bg-transparent outline-none w-full" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-purple-600 bg-purple-50 p-3 rounded-xl">
                 
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 bg-slate-50/50 border-t flex justify-end px-10">
                <Button 
                  onClick={handleSave} 
                  disabled={isSubmitting} 
                  className={`rounded-2xl h-14 px-12 font-bold shadow-lg transition-all active:scale-95 ${activeTab === 'daily' ? 'bg-primary hover:bg-primary/90' : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                  Publish Schedule
                </Button>
              </div>
            </div>
          </div>

          {/* --- History / Preview (Right) --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1e293b] rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col h-full min-h-[600px]">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <CalIcon className="text-primary" />
                  <h2 className="text-xl font-bold tracking-tight">Active Plans</h2>
                </div>
                <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full border border-white/10">{activeSchedules.length}</span>
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scroll">
                {activeSchedules.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                    <CalIcon size={48} strokeWidth={1} />
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">No Plans Published</p>
                  </div>
                ) : (
                  activeSchedules.map(s => (
                    <div key={s.id} className="bg-white/5 border border-white/10 p-5 rounded-3xl relative hover:bg-white/10 transition-colors">
                      <button onClick={() => setActiveSchedules(activeSchedules.filter(x => x.id !== s.id))} className="absolute top-5 right-5 text-white/30 hover:text-red-400"><Trash2 size={16} /></button>
                      <div className="mb-4">
                        <p className="text-2xl font-black">{s.price}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${s.color === 'bg-primary' ? 'text-primary' : 'text-purple-400'}`}>{s.type}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {s.details.days?.map(d => <span key={d} className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-xl text-[10px] font-bold border border-primary/20">Every {d}</span>)}
                        {s.details.dates && Object.keys(s.details.dates).map(date => (
                          <div key={date} className="w-full flex justify-between items-center text-[10px] bg-black/40 p-3 rounded-2xl mt-1 border border-white/5">
                            <span className="text-slate-400 font-medium">{format(parseISO(date), "MMM dd, yyyy")}</span>
                            <span className="text-purple-400 font-black">{s.details.dates[date][0].start}—{s.details.dates[date][0].end}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .rmdp-container { width: 100% !important; }
        .rmdp-calendar { border: none !important; box-shadow: none !important; background: transparent !important; padding: 0 !important; }
        .rmdp-day span { font-size: 13px !important; font-weight: 800 !important; }
        .rmdp-range { background-color: #9333ea !important; box-shadow: 0 10px 15px -3px rgba(147, 51, 234, 0.4) !important; border-radius: 8px !important; }
        .rmdp-today span { background-color: #f1f5f9 !important; color: #0f172a !important; border: 1px solid #e2e8f0 !important; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SchedulePage;