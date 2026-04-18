"use client";
import { gradients, baseRating, demoData } from "@/utils";
import { Fugaz_One } from "next/font/google";
import React, { useState } from "react";
const months = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sept",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};
const monthsArr = Object.keys(months);
const now = new Date();
const dayList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const fugaz = Fugaz_One({
  variable: '--font-fugaz-one',
  subsets: ['latin'],
  weight: ['400']
})

export default function Calendar(props) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const [selectedMonth, setSelectedMonth] = useState(monthsArr[currentMonth]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const { demo, completeData, handleSetMood } = props;
  const monthNow = new Date(selectedYear, monthsArr.indexOf(selectedMonth), 1);
  const firstDayOfMonth = monthNow.getDay();
  const numOfDaysInMonth = new Date(
    selectedYear,
    monthsArr.indexOf(selectedMonth) + 1,
    0,
  ).getDate();
  const numOfDaysToDisplay = firstDayOfMonth + numOfDaysInMonth;
  const numRows =
    Math.floor(numOfDaysToDisplay / 7) + (numOfDaysToDisplay % 7 ? 1 : 0);

  const numericMonth = monthsArr.indexOf(selectedMonth);
  const data = completeData?.[selectedYear]?.[numericMonth] || {};

  function handleMonthChange(val) {
    if (numericMonth + val < 0) {
      setSelectedYear(curr => curr - 1);
      setSelectedMonth(monthsArr[monthsArr.length - 1]);
    } else if (numericMonth + val > 11) {
      setSelectedYear(curr => curr + 1);
      setSelectedMonth(monthsArr[0]);
    } else {
      setSelectedMonth(monthsArr[numericMonth + val]);
    }
  }


  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => {
          handleMonthChange(-1);
        }} className="cursor-pointer text-indigo-400 mr-auto text-lg sm:text-xl duration-200 hover:opacity-60">
          <i className="text-lg sm:text-xl fa-solid fa-circle-chevron-left"></i>
        </button>
        <p className={"text-center capitalize text-gradient w-full " + fugaz.className}>{selectedMonth} {selectedYear}</p>
        <button onClick={() => {
          handleMonthChange(+1);
        }} className="cursor-pointer text-indigo-400 ml-auto duration-200 hover:opacity-60">
          <i className="text-lg sm:text-xl fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>
      <div className="flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-8">
        {[...Array(numRows).keys()].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid grid-cols-7">
              {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                let dayIndex =
                  rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1);
                let dayDisplay =
                  dayIndex > numOfDaysInMonth
                    ? false
                    : row === 0 && dayOfWeekIndex < firstDayOfMonth
                      ? false
                      : true;
                let isToday = dayIndex === now.getDate();
                if (!dayDisplay) {
                  return <div className="bg-white" key={dayOfWeekIndex} />;
                }
                let color = demo
                  ? gradients.indigo[baseRating[dayIndex]]
                  : dayIndex in data
                    ? gradients.indigo[data[dayIndex]]
                    : "white";
                return (
                  <div
                    style={{ background: color }}
                    className={
                      "p-4 text-xs border border-solid p-2 flex items-center gap-2 justify-between rounded-lg " +
                      (isToday ? " border-indigo-500 " : " border-indigo-100 ") +
                      (color === "white"
                        ? " text-indigo-500 bg-white "
                        : "text-white bg-indigo-500")
                    }
                    key={dayOfWeekIndex}
                  >
                    <p>{dayIndex}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
