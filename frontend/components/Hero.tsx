import React from "react";
import Button from "./Button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-emerald-50 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-semibold leading-tight mb-4">
            You deserve to be happy.
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Our licensed, compassionate therapists are here to help you navigate
            life's challenges. Find the right care and start your journey.
          </p>
          <div className="flex gap-3 mb-6">
            <Button
              href="/register"
              variant="default"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Get started
            </Button>
            <Button href="#how-it-works" variant="ghost">
              Learn more
            </Button>
          </div>

          {/* small stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md">
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-[rgb(31,82,78)]">
                200+
              </div>
              <div className="text-sm text-gray-600">Licensed therapists</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-[rgb(31,82,78)]">
                50k+
              </div>
              <div className="text-sm text-gray-600">Sessions completed</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-[rgb(31,82,78)]">12</div>
              <div className="text-sm text-gray-600">Countries served</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-0 shadow-md overflow-hidden">
          <div>
            <img
              src="/images/hero.png"
              alt="Hero"
              className="w-full h-72 md:h-80 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
