import { Fugaz_One } from "next/font/google";
import React from "react";
import Button from "./Button";
import Calendar from "./Calendar";
import Link from "next/link";
import CallToAction from "./CallToAction";
const fugaz = Fugaz_One({
  variable: "--font-fugaz-one",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Hero() {
  return (
    <div className="py-4 md:py-10 flex flex-col gap-8 sm:gap-10">
      <h2
        className={
          "text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className
        }
      >
        <span className="text-gradient">Broodl</span> helps you track your{" "}
        <span className="text-gradient">daily</span> mood.
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[600px]">
        Create your mood record and see how you feel on{" "}
        <span className="font-semibold">every day of the year.</span>
      </p>
      <CallToAction />
      <Calendar demo />
    </div>
  );
}
