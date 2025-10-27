import React from "react";
import Card from "./Card";
import Button from "./Button";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Individual Therapy",
    desc: "One-on-one sessions tailored to your unique needs.",
  },
  {
    title: "Couples Therapy",
    desc: "Strengthen your relationship through improved communication.",
  },
  {
    title: "Family Therapy",
    desc: "Navigate family dynamics and create a healthier home.",
  },
  {
    title: "Trauma & PTSD",
    desc: "Specialized care for processing traumatic experiences.",
  },
  {
    title: "Career Counseling",
    desc: "Navigate career transitions and workplace stress.",
  },
  {
    title: "Workshops & Groups",
    desc: "Join group sessions on mindfulness and stress management.",
  },
];

export default function Services() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium">
            What type of therapy are you looking for?
          </h2>
          <p className="text-gray-600 mt-2">
            We offer a wide range of therapeutic services to support your mental
            health and wellbeing journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => {
            const bgColors = [
              "bg-emerald-50",
              "bg-amber-50",
              "bg-pink-50",
              "bg-sky-50",
              "bg-lime-50",
              "bg-rose-50",
            ];
            const bg = bgColors[idx % bgColors.length];
            return (
              <Card
                key={s.title}
                className={`flex flex-col group ${bg} transition-transform transform hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="overflow-hidden rounded-md">
                  <img
                    src={`/images/services-${idx + 1}.png`}
                    alt={s.title}
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
                  <div className="mt-4">
                    <Button variant="ghost" className="px-3 py-2" asChild>
                      <a className="inline-flex items-center gap-2">
                        Learn more
                        <ArrowRight className="w-4 h-4 text-emerald-700" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
