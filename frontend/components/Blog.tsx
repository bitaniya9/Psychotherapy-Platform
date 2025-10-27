import React from "react";

const posts = [
  {
    title: "Mindfulness: A Guide",
    excerpt: "Intro to mindfulness practices for daily life.",
  },
  {
    title: "Therapy for PTSD",
    excerpt: "How trauma-focused therapy can help recovery.",
  },
];

export default function Blog() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-lg font-medium mb-6">Latest from our blog</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((p) => (
            <article
              key={p.title}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <h4 className="font-semibold">{p.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{p.excerpt}</p>
              <a className="mt-3 inline-block text-emerald-700">Read More</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
