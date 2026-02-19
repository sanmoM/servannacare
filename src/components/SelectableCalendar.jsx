"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SelectableCalendar = ({
  mode = "multiple",
  selectedDates: externalSelectedDates,
  onChange,
  disabled, // ✅ add this
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [internalSelectedDates, setInternalSelectedDates] = useState([]);

  const isControlled = externalSelectedDates !== undefined;

  const selectedDates = isControlled
    ? externalSelectedDates
    : internalSelectedDates;

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year, month) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const formatDate = (day) =>
    new Date(year, month, day).toISOString().split("T")[0];

  const handleSelect = (day) => {
    if (!day) return;

    const dateObj = new Date(year, month, day);

    // ✅ disable check
    if (disabled && disabled(dateObj)) return;

    const dateStr = formatDate(day);

    let updatedDates = [];

    if (mode === "single") {
      updatedDates = [dateStr];
    } else {
      if (selectedDates.includes(dateStr)) {
        updatedDates = selectedDates.filter((d) => d !== dateStr);
      } else {
        updatedDates = [...selectedDates, dateStr];
      }
    }

    if (!isControlled) {
      setInternalSelectedDates(updatedDates);
    }

    onChange && onChange(updatedDates);
  };

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));

  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let d = 1; d <= daysInMonth; d++) daysArray.push(d);

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-2xl p-5 border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft size={18} />
        </button>

        <h3 className="font-semibold text-lg text-gray-800">
          {monthName} {year}
        </h3>

        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-sm">
        {daysArray.map((day, i) => {
          const dateStr = day ? formatDate(day) : null;
          const isSelected = selectedDates.includes(dateStr);

          const dateObj = day ? new Date(year, month, day) : null;
          const isDisabled =
            day && disabled ? disabled(dateObj) : false;

          return (
            <div
              key={i}
              onClick={() => day && !isDisabled && handleSelect(day)}
              className={`
                h-10 flex items-center justify-center rounded-xl
                transition-all duration-200
                ${!day && "cursor-default"}
                ${
                  isDisabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isSelected
                    ? "bg-primary text-white shadow-md scale-105 cursor-pointer"
                    : day
                    ? "hover:bg-primary/10 text-gray-700 cursor-pointer"
                    : ""
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectableCalendar;
