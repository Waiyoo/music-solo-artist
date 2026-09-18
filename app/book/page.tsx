"use client";

import React, { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

export default function PublicBookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "Concert / Festival",
    eventDate: "",
    location: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit booking inquiry.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-artist-warmCream">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-6 py-20 w-full space-y-12">
        <div className="space-y-2 text-center">
          <span className="text-xs uppercase tracking-widest text-artist-deepRed font-semibold">Representation</span>
          <h1 className="font-serif text-4xl md:text-5xl text-artist-richBrown">Booking Inquiries</h1>
          <p className="text-artist-earth max-w-xl mx-auto text-sm">
            Complete the form below to submit a performance, festival, or private engagement inquiry directly to management.
          </p>
        </div>

        {success ? (
          <div className="bg-white p-12 rounded-lg border border-artist-sand shadow-sm text-center space-y-4">
            <h2 className="font-serif text-2xl text-artist-richBrown">Inquiry Received Successfully</h2>
            <p className="text-artist-earth text-sm max-w-md mx-auto">
              Thank you for your performance inquiry. Management has received your details and will review availability shortly.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({ name: "", email: "", phone: "", eventType: "Concert / Festival", eventDate: "", location: "", message: "" });
              }}
              className="px-6 py-2.5 bg-artist-deepRed text-artist-warmCream text-xs uppercase tracking-widest rounded font-semibold hover:bg-artist-richBrown transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-lg border border-artist-sand shadow-sm space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-artist-earth mb-2 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-artist-sand rounded focus:outline-none focus:border-artist-deepRed text-sm"
                  placeholder="Organizer / Representative Name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-artist-earth mb-2 font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-artist-sand rounded focus:outline-none focus:border-artist-deepRed text-sm"
                  placeholder="contact@organization.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-artist-earth mb-2 font-semibold">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-artist-sand rounded focus:outline-none focus:border-artist-deepRed text-sm"
                  placeholder="+254 700 000000"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-artist-earth mb-2 font-semibold">Event Type *</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-4 py-3 border border-artist-sand rounded focus:outline-none focus:border-artist-deepRed text-sm bg-white"
                >
                  <option value="Concert / Festival">Concert / Festival</option>
                  <option value="Private Showcase">Private Showcase</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Cultural Residency">Cultural Residency</option>
                  <option value="Media Interview">Media Interview</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-artist-earth mb-2 font-semibold">Event Date *</label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-4 py-3 border border-artist-sand rounded focus:outline-none focus:border-artist-deepRed text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-artist-earth mb-2 font-semibold">Location / Venue *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-artist-sand rounded focus:outline-none focus:border-artist-deepRed text-sm"
                placeholder="City, Venue, Country"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-artist-earth mb-2 font-semibold">Event Details & Message *</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-artist-sand rounded focus:outline-none focus:border-artist-deepRed text-sm"
                placeholder="Provide details about expected audience size, budget parameters, and scheduling."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-artist-deepRed text-artist-warmCream text-xs uppercase tracking-widest rounded font-semibold transition-all hover:bg-artist-richBrown disabled:opacity-50"
            >
              {submitting ? "Submitting Inquiry..." : "Submit Booking Request"}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}