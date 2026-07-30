import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const form = useRef<HTMLFormElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setStatusMessage("Success! Your message has been sent.");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => {
        setStatusMessage("Failed to send message! Try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form
      ref={form}
      onSubmit={handleSubmit}
      className="space-y-5"
      aria-busy={isSubmitting}
    >
      {/* NAME */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-ink">
          Your name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="What's your good name?"
          className="min-h-11 w-full rounded-control border border-line-strong bg-surface px-4 py-3 text-ink transition-colors duration-200 placeholder:text-ink-subtle hover:border-brand-400"
          required
        />
      </div>

      {/* EMAIL */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-ink">
          Your email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="What's your email address?"
          className="min-h-11 w-full rounded-control border border-line-strong bg-surface px-4 py-3 text-ink transition-colors duration-200 placeholder:text-ink-subtle hover:border-brand-400"
          required
        />
      </div>

      {/* MESSAGE */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold text-ink">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          rows={5}
          className="w-full resize-none rounded-control border border-line-strong bg-surface px-4 py-3 text-ink transition-colors duration-200 placeholder:text-ink-subtle hover:border-brand-400"
          required
        />
      </div>

      {/* SUBMIT BUTTON */}
      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {/* STATUS MESSAGE */}
      <div className="min-h-5" role="status" aria-live="polite" aria-atomic="true">
        {statusMessage && (
          <p
            className={statusMessage.includes("Success")
              ? "text-center text-sm font-medium text-signal-700 dark:text-signal-300"
              : "text-center text-sm font-medium text-red-600 dark:text-red-300"
            }
          >
            {statusMessage}
          </p>
        )}
      </div>
    </form>
  );

}
