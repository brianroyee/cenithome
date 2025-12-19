import React, { useState } from "react";

export const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  if (status === "success") {
    return (
      <div className="h-full flex flex-col justify-center items-center text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
          Message Sent
        </h3>
        <p className="text-neutral-500">We'll be in touch shortly.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-8 text-cenit-blue font-medium hover:underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-500 mb-1 uppercase tracking-wider"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="w-full bg-neutral-50 border border-transparent border-b-neutral-200 focus:bg-white focus:border-cenit-blue focus:ring-0 px-4 py-3 transition-colors outline-none"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-500 mb-1 uppercase tracking-wider"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="w-full bg-neutral-50 border border-transparent border-b-neutral-200 focus:bg-white focus:border-cenit-blue focus:ring-0 px-4 py-3 transition-colors outline-none"
          placeholder="john@company.com"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-neutral-500 mb-1 uppercase tracking-wider"
        >
          Project Type
        </label>
        <select
          id="subject"
          className="w-full bg-neutral-50 border border-transparent border-b-neutral-200 focus:bg-white focus:border-cenit-blue focus:ring-0 px-4 py-3 transition-colors outline-none"
        >
          <option>Product Design</option>
          <option>Full-Stack Engineering</option>
          <option>Strategic Consultancy</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-neutral-500 mb-1 uppercase tracking-wider"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          required
          className="w-full bg-neutral-50 border border-transparent border-b-neutral-200 focus:bg-white focus:border-cenit-blue focus:ring-0 px-4 py-3 transition-colors outline-none resize-none"
          placeholder="Tell us about your vision..."
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-neutral-900 text-white py-4 font-bold uppercase tracking-widest hover:bg-cenit-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};
