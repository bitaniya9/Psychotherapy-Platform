import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[rgb(31,82,78)] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-bold">Melkam</div>
          <div className="text-sm mt-2">
            © {new Date().getFullYear()} Melkam Psychotherapy
          </div>
        </div>
        <div>
          <div className="font-semibold">Services</div>
          <ul className="mt-2 text-sm">
            <li>Individual Therapy</li>
            <li>Couples Therapy</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <div className="text-sm mt-2">support@melkam.example</div>
        </div>
      </div>
    </footer>
  );
}
