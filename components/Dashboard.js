"use client";
import { Fugaz_One } from "next/font/google";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Loading from "./Loading";
import Login from "./Login";

const fugaz = Fugaz_One({
  variable: "--font-fugaz",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Dashboard() {
  const { currentUser, userData, setUserData, loading } = useAuth();
  const [data, setData] = useState({});

  const now = new Date();

  function countValues() {
    let total_num_of_days = 0;
    let sum_moods = 0;

    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let day_mood = data[year][month][day];
          total_num_of_days++;
          sum_moods += day_mood;
        }
      }
    }

    return {
      num_days: total_num_of_days,
      average_mood: sum_moods / total_num_of_days,
    };
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
  };

  async function handleSetMood(mood) {
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    try {
      const newData = { ...userData };
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }
      newData[year][month][day] = mood;
      // update current
      setData(newData);
      // update global
      setUserData(newData);
      // update firebase
      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: mood,
            },
          },
        },
        { merge: true },
      );
    } catch (error) {
      console.log("Failed to set data: ", error);
    }
  }

  const moods = {
    "&*@#$": "😭",
    Sad: "😢",
    Existing: "😑",
    Good: "🙂",
    Elated: "😍",
  };

  useEffect(() => {
    if (!currentUser || !userData) {
      return;
    }
    setData(userData);
  }, [currentUser, userData]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 bg-indigo-50 text-indigo-500 rounded-lg">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className="p-4 flex flex-col gap-1 sm:gap-2">
              <p className="font-medium capitalize text-xs sm:text-sm">
                {status.replaceAll("_", " ")}
              </p>
              <p className={"text-base sm:text-lg " + fugaz.className}>
                {statuses[status] || 0}
                {status == "num_days" && statuses[status] > 0 ? " 🔥" : ""}
              </p>
            </div>
          );
        })}
      </div>
      <h4
        className={
          "text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className
        }
      >
        How do you <span className="text-gradient">feel</span> today?
      </h4>
      <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button
              onClick={() => {
                const currentMoodValue = moodIndex + 1;
                handleSetMood(currentMoodValue);
              }}
              className="flex-1 cursor-pointer p-4 px-5 rounded-2xl purple-shadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col gap-2 items-center "
              key={moodIndex}
            >
              <p className="text-4xl sm:text-5xl md:text-6xl">{moods[mood]}</p>
              <p
                className={
                  "text-indigo-500 text-xs sm:text-sm md:text-base " +
                  fugaz.className
                }
              >
                {mood}
              </p>
            </button>
          );
        })}
      </div>
      <Calendar completeData={data} handleSetMood={handleSetMood} />
    </div>
  );
}
