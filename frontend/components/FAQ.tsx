"use client";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does online therapy work?",
    a: "You get matched with a licensed therapist and meet via secure video call.",
  },
  {
    q: "Is my data private?",
    a: "Yes — we follow standard security practices and never share your data without consent.",
  },
  {
    q: "How long are sessions?",
    a: "Sessions typically last between 45-60 minutes.",
  },
  {
    q: "Do you offer in-person sessions?",
    a: "Yes — some of our therapists offer in-person appointments depending on location.",
  },
];

export default function FAQ() {
  return (
    <section className="py-16 px-6 bg-[#FEF9F3]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-medium text-center mb-6">
          Frequently asked questions
        </h2>

        <Accordion.Root
          type="single"
          defaultValue="item-0"
          collapsible
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {faqs.map((f, i) => (
            <Accordion.Item
              key={f.q}
              value={`item-${i}`}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex items-center justify-between gap-4 text-left">
                  <div className="font-semibold">{f.q}</div>
                  <ChevronDown className="w-5 h-5" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="mt-3 text-sm text-gray-600">
                {f.a}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
