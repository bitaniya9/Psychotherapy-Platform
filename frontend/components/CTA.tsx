import React from "react";

export default function CTA() {
  return (
    <section className="py-12 px-6 bg-[rgb(31,82,78)] text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold">
            Ready to prioritize your mental health?
          </h3>
          <p className="text-sm opacity-90">
            Get matched with a licensed therapist and start your journey.
          </p>
        </div>
        <div className="flex gap-3">
          <a className="bg-white text-[rgb(31,82,78)] px-4 py-2 rounded-full">
            Get started
          </a>
          <a className="border border-white px-4 py-2 rounded-full">
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
