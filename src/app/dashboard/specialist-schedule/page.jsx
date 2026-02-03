"use client";

import React, { useState } from "react";
import { CheckCircle, Clock, Calendar as CalendarIcon, Plus, Trash2, Save, Loader2, CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar"; 
import { format, isBefore, startOfToday } from "date-fns";
import toast from "react-hot-toast";

const page = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Daily State ---
  const [dailyDays, setDailyDays] = useState([]);

  // --- Monthly State ---
  const [monthlyData, setMonthlyData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // --- Display State ---
  const [activeSchedules, setActiveSchedules] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const today = startOfToday();

  const handleSave = async () => {
    const isDaily = activeTab === "daily";
    if (isDaily && dailyDays.length === 0) return toast.error("Select at least one day");
    if (!isDaily && Object.keys(monthlyData).length === 0) return toast.error("Select at least one date");

    setIsSubmitting(true);
    
    const payload = {
      id: Date.now(),
      type: isDaily ? "Daily Plan" : "Monthly Plan",
      price: isDaily ? "KSH 4/day" : "KSH 100/mo",
      color: isDaily ? "bg-primary" : "bg-purple-600",
      details: isDaily ? { days: dailyDays } : { dates: monthlyData }
    };

    setTimeout(() => {
      setActiveSchedules([payload, ...activeSchedules]);
      setDailyDays([]);
      setMonthlyData({});
      setIsSubmitting(false);
    }, 800);
  };

  const addTimeSlot = (dateKey) => {
    const currentSlots = monthlyData[dateKey] || [];
    setMonthlyData({
      ...monthlyData,
      [dateKey]: [...currentSlots, { start: "09:00", end: "17:00" }]
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Set Your Availability</h1>
          <p className="text-sm text-gray-500 font-medium">Manage your KSH 4 Daily or KSH 100 Monthly schedules</p>
        </div>
        <Button onClick={handleSave} disabled={isSubmitting} className="bg-primary hover:opacity-90 h-12 px-10 rounded-xl">
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
          Save Schedule
        </Button>
      </div>

      <Tabs defaultValue="daily" onValueChange={setActiveTab} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-50 p-0 rounded-none border-b">
          <TabsTrigger value="daily" className="font-bold data-[state=active]:text-primary data-[state=active]:bg-white rounded-none border-r">
            Daily Rate (Full Day)
          </TabsTrigger>
          <TabsTrigger value="monthly" className="font-bold data-[state=active]:text-purple-600 data-[state=active]:bg-white rounded-none">
            Monthly Plan (Calendar)
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          {/* --- DAILY TAB --- */}
          <TabsContent value="daily" className="py-6">
            <div className="text-center mb-8">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">KSH 4 / Day (Full Availability)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 max-w-4xl mx-auto">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  onClick={() => setDailyDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                  className={`p-4 rounded-xl border-2 text-xs font-bold transition-all ${
                    dailyDays.includes(day) ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-400 hover:border-primary/30"
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </TabsContent>

          {/* --- MONTHLY TAB --- */}
          <TabsContent value="monthly">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="lg:w-[350px]">
                <h3 className="font-bold text-purple-600 mb-4 flex items-center gap-2">
                  <CalendarIcon size={18} /> Select Dates
                </h3>
                <div className="border rounded-2xl p-2 bg-white shadow-sm">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => isBefore(date, today)} // DISABLING PREVIOUS DAYS & TODAY
                    className="rounded-md"
                  />
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-[11px] text-purple-700 font-medium">Select a future date to set specific working hours for KSH 100/mo plan.</p>
                </div>
              </div>

              <div className="flex-1">
                {selectedDate ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{format(selectedDate, "PPPP")}</h2>
                        <p className="text-purple-600 text-sm">Define hours for this date</p>
                      </div>
                      <Button size="sm" onClick={() => addTimeSlot(format(selectedDate, "yyyy-MM-dd"))} className="bg-purple-600 hover:bg-purple-700">
                        <Plus size={16} className="mr-1" /> Add Slot
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(monthlyData[format(selectedDate, "yyyy-MM-dd")] || []).map((slot, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-purple-50 group hover:border-purple-200 transition-all">
                          <input 
                            type="time" 
                            value={slot.start} 
                            onChange={(e) => {
                              const slots = [...monthlyData[format(selectedDate, "yyyy-MM-dd")]];
                              slots[index].start = e.target.value;
                              setMonthlyData({ ...monthlyData, [format(selectedDate, "yyyy-MM-dd")]: slots });
                            }}
                            className="bg-transparent font-bold outline-none text-gray-700" 
                          />
                          <span className="text-purple-300">to</span>
                          <input 
                            type="time" 
                            value={slot.end} 
                            onChange={(e) => {
                              const slots = [...monthlyData[format(selectedDate, "yyyy-MM-dd")]];
                              slots[index].end = e.target.value;
                              setMonthlyData({ ...monthlyData, [format(selectedDate, "yyyy-MM-dd")]: slots });
                            }}
                            className="bg-transparent font-bold outline-none text-gray-700" 
                          />
                          <button 
                            onClick={() => {
                              const slots = [...monthlyData[format(selectedDate, "yyyy-MM-dd")]];
                              slots.splice(index, 1);
                              setMonthlyData({ ...monthlyData, [format(selectedDate, "yyyy-MM-dd")]: slots });
                            }}
                            className="ml-auto text-gray-300 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 bg-gray-50/30">
                    <CalendarDays size={48} className="mb-4 opacity-10" />
                    <p className="font-medium text-sm">Please select a future date on the calendar</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* --- PUBLISHED VIEW --- */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-500" /> Active Schedule Preview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSchedules.map(s => (
            <div key={s.id} className="bg-white border rounded-2xl overflow-hidden relative shadow-sm">
              <div className={`${s.color} h-1.5 w-full`} />
              <div className="p-5">
                <button onClick={() => setActiveSchedules(activeSchedules.filter(x => x.id !== s.id))} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <p className="text-xl font-black text-gray-800">{s.price}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{s.type}</p>
                <div className="flex flex-wrap gap-1">
                  {s.details.days?.map(d => <span key={d} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] font-bold">{d}</span>)}
                  {s.details.dates && Object.keys(s.details.dates).map(d => <span key={d} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-[10px] font-bold">{d}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;