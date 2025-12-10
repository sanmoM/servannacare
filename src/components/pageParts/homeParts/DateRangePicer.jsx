"use client";
import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangePicker({ onChange }) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);

    // Return the selected dates to parent component
    onChange({
      startDate,
      endDate,
    });
  };

  return (
    <div>
      <DateRange
        editableDateInputs={true}
        moveRangeOnFirstSelection={false}
        ranges={range}
        onChange={handleSelect}
      />

      <p className="mt-2 text-sm text-gray-600">
        <strong>Start:</strong> {format(range[0].startDate, "dd/MM/yyyy")} |
        <strong> End:</strong> {format(range[0].endDate, "dd/MM/yyyy")}
      </p>
    </div>
  );
}
