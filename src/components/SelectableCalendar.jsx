"use client";
import React, { useState } from "react";

const SelectableCalendar = ({ mode = "multiple", onChange }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDates, setSelectedDates] = useState([]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year, month) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const formatDate = (day) => {
    return new Date(year, month, day).toISOString().split("T")[0];
  };

  const handleSelect = (day) => {
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

    setSelectedDates(updatedDates);
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
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={prevMonth}>{"<"}</button>
        <h3>{monthName} {year}</h3>
        <button onClick={nextMonth}>{">"}</button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        textAlign: "center",
        fontWeight: "bold",
        marginTop: "10px"
      }}>
        {daysOfWeek.map((d) => <div key={d}>{d}</div>)}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        gap: "5px",
        marginTop: "8px"
      }}>
        {daysArray.map((day, i) => {
          const dateStr = day ? formatDate(day) : null;
          const isSelected = selectedDates.includes(dateStr);

          return (
            <div
              key={i}
              onClick={() => day && handleSelect(day)}
              style={{
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                cursor: day ? "pointer" : "default",
                backgroundColor: isSelected
                  ? "#2563eb"
                  : "#f3f4f6",
                color: isSelected ? "#fff" : "#000",
              }}
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
