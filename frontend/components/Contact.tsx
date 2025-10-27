"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Mail, Phone, MapPin, Clock, User, MessageSquare } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE || ""}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Failed");
      toast.success("Message sent — we will be in touch soon.");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 px-6 bg-[#FAFBFA]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* left: large form card */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-2">Contact us</h3>
            <p className="text-gray-600 mb-6">
              Have questions or ready to start therapy? Fill the form and our
              team will reach out.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First name
                  </label>
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <input
                      className="w-full outline-none"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last name
                  </label>
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <input
                      className="w-full outline-none"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full outline-none"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone (optional)
                </label>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <input
                    className="w-full outline-none"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <div className="flex items-start gap-2 border rounded-lg px-3 py-2">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                  <textarea
                    className="w-full outline-none h-28 resize-none"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[rgb(31,82,78)] text-white font-medium"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* right: contact info + map */}
        <div className="space-y-4">
          <div className="bg-[rgb(255,249,219)] rounded-2xl p-6 shadow-sm">
            <h4 className="font-semibold mb-3">Contact information</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <MapPin className="w-5 h-5 text-[rgb(31,82,78)]" />
                </div>
                <div>
                  <div className="text-sm font-medium">Visit our office</div>
                  <div className="text-sm text-gray-600">
                    Addis Ababa, Ethiopia
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Mail className="w-5 h-5 text-[rgb(31,82,78)]" />
                </div>
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-gray-600">hello@melkam.org</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Phone className="w-5 h-5 text-[rgb(31,82,78)]" />
                </div>
                <div>
                  <div className="text-sm font-medium">Call us</div>
                  <div className="text-sm text-gray-600">+251 11 123 4567</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400">
              Map placeholder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
