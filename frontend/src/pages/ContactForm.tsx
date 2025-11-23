import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import emailjs from "@emailjs/browser";

export function ContactForm() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const form = useRef<HTMLFormElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current!,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setStatusMessage("Success! Your message has been sent.");
      setFormData({ name: '', email: '', message: '' });
    })
    .catch(() => {
      setStatusMessage("Failed to send Message! Try again.");
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <form ref={form} onSubmit={handleSubmit} className="space-y-6">
      {/* your UI (unchanged) */}
    </form>
  );
}
