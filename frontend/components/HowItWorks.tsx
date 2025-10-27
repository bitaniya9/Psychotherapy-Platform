import React from "react";
import Card from "./Card";
import { User, Calendar, Video, TrendingUp } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Answer a few questions",
    desc: "Tell us about yourself and what you're looking for in therapy.",
  },
  {
    id: 2,
    title: "Get matched & schedule",
    desc: "We'll match you with a licensed therapist and pick a convenient time.",
  },
  {
    id: 3,
    title: "Start your session",
    desc: "Connect via secure video call or in-person.",
  },
  {
    id: 4,
    title: "Continue your journey",
    desc: "Track progress and access resources tailored to you.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-6 bg-[#FEF9F3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium">How Melkam works</h2>
          <p className="text-gray-600 mt-2">
            Getting started with therapy has never been easier. Our streamlined
            process gets you connected with care in just a few steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.id} className="relative">
              {/* number badge overlapping card */}
              <div className="absolute -top-4 left-4 z-10">
                <div className="w-10 h-10 rounded-full bg-[rgb(31,82,78)] text-white flex items-center justify-center font-semibold shadow-md">
                  {s.id}
                </div>
              </div>

              <Card className="pt-8">
                <div className="flex items-start gap-4 w-full">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                    {/* small icon from lucide */}
                    {s.id === 1 && <User className="w-6 h-6" />}
                    {s.id === 2 && <Calendar className="w-6 h-6" />}
                    {s.id === 3 && <Video className="w-6 h-6" />}
                    {s.id === 4 && <TrendingUp className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
