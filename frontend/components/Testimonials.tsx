import React from "react";
import Card from "./Card";
import * as Avatar from "@radix-ui/react-avatar";

const testimonials = [
  {
    name: "Hanna M.",
    role: "Individual Therapy",
    quote:
      "Melkam made online therapy so easy and comfortable. My therapist has helped me manage my anxiety.",
  },
  {
    name: "Dawit T.",
    role: "Couples Therapy",
    quote:
      "The couples therapy sessions saved our relationship. We're stronger than ever now.",
  },
  {
    name: "Bethelhem K.",
    role: "Trauma Therapy",
    quote:
      "After struggling with PTSD, I found the right support here. Forever grateful.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 px-6 bg-emerald-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium">Trusted by thousands</h2>
          <p className="text-gray-600 mt-2">
            Real stories from people who've found healing and growth through
            therapy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col">
              <div className="mb-4">
                <div className="text-sm text-gray-700">"{t.quote}"</div>
              </div>

              <div className="mt-auto pt-4 border-t flex items-center gap-3">
                <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden inline-flex items-center justify-center bg-[rgb(31,82,78)]">
                  <Avatar.Image
                    src={undefined as any}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                  <Avatar.Fallback className="text-white">
                    {t.name.charAt(0)}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
