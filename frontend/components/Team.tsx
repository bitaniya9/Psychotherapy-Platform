import React from "react";
import Card from "./Card";

const team = [
  {
    name: "Dr. Selam Tesfaye",
    title: "Clinical Psychologist",
    langs: "Amharic, English, Tigrinya",
  },
  {
    name: "Dr. Dawit Kebede",
    title: "Marriage & Family Therapist",
    langs: "Amharic, English",
  },
  {
    name: "Dr. Alem Tadesse",
    title: "Trauma Specialist",
    langs: "Amharic, English, Oromo",
  },
  {
    name: "Dr. Rahel Assefa",
    title: "Child & Adolescent Therapist",
    langs: "Amharic, English",
  },
];

export default function Team() {
  return (
    <section className="py-16 px-6 bg-[#FFF9DB]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium">
            Professional and qualified therapists who you can trust
          </h2>
          <p className="text-gray-600 mt-2">
            Our team of licensed, compassionate professionals is dedicated to
            supporting your mental health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t, idx) => (
            <Card
              key={t.name}
              className="flex flex-col items-start group transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative w-full overflow-hidden rounded-md">
                <img
                  src={`/images/team-${idx + 1}.png`}
                  alt={t.name}
                  className="w-full h-40 object-cover"
                />
                {/* image — no rating overlay per design */}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-gray-600">{t.title}</p>
                <div className="mt-3 text-sm text-gray-500">{t.langs}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
