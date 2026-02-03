"use client";

import React, { useState } from "react";
import { CheckCircle, Clock, Calendar, Plus, Trash2, Save, Loader2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

const page = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Daily State (Full Day Availability) ---
  const [dailyDays, setDailyDays] = useState([]);

  // --- Monthly State (Specific Days + Specific Hours) ---
  const [monthlyDays, setMonthlyDays] = useState([]);
  const [monthlySlots, setMonthlySlots] = useState([{ id: Date.now(), start: "08:00", end: "17:00" }]);

  // --- Display State ---
  const [activeSchedules, setActiveSchedules] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleSave = async () => {
    const isDaily = activeTab === "daily";
    const selectedDays = isDaily ? dailyDays : monthlyDays;

    if (selectedDays.length === 0) {
      toast.error("Please select at least one day.");
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      id: Date.now(),
      type: isDaily ? "Daily Rate (Full Day)" : "Monthly Plan",
      price: isDaily ? "KSH 4/day" : "KSH 100/mo",
      days: selectedDays,
      slots: isDaily ? [{ start: "Full Day", end: "" }] : monthlySlots,
      color: isDaily ? "bg-primary" : "bg-purple-600"
    };

    console.log("payload",payload)

    // Simulate API Call
    setTimeout(() => {
      setActiveSchedules([payload, ...activeSchedules]);
      if (isDaily) setDailyDays([]); else setMonthlyDays([]);
      setIsSubmitting(false);
    }, 800);
  };

  const deleteSchedule = (id) => {
    setActiveSchedules(activeSchedules.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Set Availability</h1>
          <p className="text-gray-500 text-sm">Choose between full-day daily rates or recurring monthly hours.</p>
        </div>
        <Button onClick={handleSave} disabled={isSubmitting} className="bg-primary hover:opacity-90 h-12 px-8">
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
          Save Availability
        </Button>
      </div>

      {/* --- ACTIVE PLANS SECTION --- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="text-green-500" size={20} /> Published Schedules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSchedules.map((s) => (
            <div key={s.id} className="bg-white border rounded-xl shadow-sm overflow-hidden relative group">
              <div className={`${s.color} h-2 w-full`} />
              <div className="p-4">
                <button 
                  onClick={() => deleteSchedule(s.id)}
                  className="absolute top-4 right-2 p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
                <div className="mb-2">
                  <span className="text-[10px] font-bold uppercase text-gray-400">{s.type}</span>
                  <p className="text-lg font-bold text-gray-800">{s.price}</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {s.days.map((d) => (
                    <span key={d} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-medium">{d}</span>
                  ))}
                </div>
                <div className="space-y-1">
                  {s.slots.map((slot, idx) => (
                    <div key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {slot.start} {slot.end && `- ${slot.end}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CONFIGURATION TABS --- */}
      <Tabs defaultValue="daily" onValueChange={setActiveTab} className="bg-white rounded-2xl border shadow-sm">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-50 border-b rounded-t-2xl">
          <TabsTrigger value="daily" className="data-[state=active]:text-primary font-bold">
            Daily (Full Day)
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:text-primary font-bold">
            Monthly (Set Hours)
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="daily">
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="bg-primary/10 p-4 rounded-xl inline-block">
                <p className="text-primary font-bold text-lg">KSH 4 per day</p>
                <p className="text-xs text-primary/70 italic">Full day availability only</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => setDailyDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                    className={`px-3 py-3 rounded-lg border-2 text-xs transition-all ${
                      dailyDays.includes(day) ? "bg-primary text-white border-primary" : "bg-white text-gray-600"
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Day Selection */}
              <div className="space-y-4 border-r pr-6">
                <h3 className="font-bold text-primary flex items-center gap-2">
                   <CalendarDays size={18} /> KSH 100/mo Recurring Days
                </h3>
                <div className="space-y-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      onClick={() => setMonthlyDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                      className={`w-full text-left px-4 py-2 rounded-lg border-2 text-sm transition-all ${
                        monthlyDays.includes(day) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2"><Clock size={18} /> Specify Working Hours</h3>
                  <Button variant="outline" size="sm" onClick={() => setMonthlySlots([...monthlySlots, { id: Date.now(), start: "08:00", end: "17:00" }])}>
                    <Plus size={16} className="mr-1" /> Add Slot
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monthlySlots.map((slot) => (
                    <div key={slot.id} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-dashed group">
                      <input 
                        type="time" 
                        value={slot.start} 
                        onChange={(e) => setMonthlySlots(monthlySlots.map(s => s.id === slot.id ? {...s, start: e.target.value} : s))}
                        className="bg-transparent font-semibold outline-none w-full" 
                      />
                      <span className="text-gray-400">to</span>
                      <input 
                        type="time" 
                        value={slot.end} 
                        onChange={(e) => setMonthlySlots(monthlySlots.map(s => s.id === slot.id ? {...s, end: e.target.value} : s))}
                        className="bg-transparent font-semibold outline-none w-full" 
                      />
                      <button onClick={() => setMonthlySlots(monthlySlots.filter(s => s.id !== slot.id))} className="text-gray-300 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default page;