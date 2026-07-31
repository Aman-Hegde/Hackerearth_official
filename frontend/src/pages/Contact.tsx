"use client"
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ContactForm } from './ContactForm';

const Contact = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      label: "Email",
      contact: "hackerearth@nmamit.in",
      href: "mailto:hackerearth@nmamit.in",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: Phone,
      title: "Call Us",
      label: "Phone",
      contact: "+91 76195 45988",
      href: "tel:+917619545988",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      label: "Visit Us",
      contact: "Room 301, CS Building, NMAMIT",
      href: "https://www.google.com/maps/search/?api=1&query=Room+301+CS+Building+NMAMIT",
      gradient: "from-pink-500 to-red-500",
    }
  ];

  return (
    <main className="section-glow-cyan min-h-screen overflow-hidden bg-canvas text-ink transition-colors duration-500">
      <div className="site-container-wide section-space pt-24 lg:pt-section">
        {/* Hero Section */}
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            delay: 0,
            ease: [0.16, 1, 0.3, 1]
          }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="section-heading">
            <span className="text-gradient-subtle">Get in Touch</span>
          </h1>
        </motion.header>

        <div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-12">
          {/* Contact Form Card */}
          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.04,
              ease: [0.16, 1, 0.3, 1]
            }}
            viewport={{ once: true }}
            className="order-2 min-w-0 lg:order-1"
            aria-labelledby="contact-form-heading"
          >
            <div className="mb-6 sm:mb-8">
              <h2 id="contact-form-heading" className="font-display text-title text-ink">
                Get in Touch
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
                Have questions or ideas? Let's talk! We're always open to discussing new opportunities.
              </p>
            </div>

            <div className="ui-card top-border-accent-cyan p-5 sm:p-8">
              <ContactForm />
            </div>
          </motion.section>

          {/* Contact Information */}
          <motion.aside
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.08,
              ease: [0.16, 1, 0.3, 1]
            }}
            viewport={{ once: true }}
            className="order-1 min-w-0 lg:order-2"
            aria-labelledby="contact-methods-heading"
          >
            <div className="mb-6 sm:mb-8">
              <h2 id="contact-methods-heading" className="font-display text-title text-ink">
                Let's Connect
              </h2>
              <p className="mt-3 leading-relaxed text-ink-muted">
                Prefer other ways to reach out? Here's how you can connect with us.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {contactMethods.map((method, i) => {
                const Icon = method.icon;
                return (
                  <motion.article
                    key={method.title}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={shouldReduceMotion
                      ? undefined
                      : {
                          y: -4,
                          transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                        }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.5,
                      delay: shouldReduceMotion ? 0 : i * 0.05,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    viewport={{ once: true }}
                    className="ui-card group relative min-w-0 overflow-hidden border-technical/20 p-4 transition duration-300 ease-out-expo hover:border-technical/40 hover:shadow-surface sm:p-5"
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-0.5 ${
                        i === 1 ? 'bg-creative/70' : 'bg-technical/70'
                      }`}
                      aria-hidden="true"
                    />
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-control border border-technical/25 bg-technical/10 text-technical-text ${
                          shouldReduceMotion
                            ? ''
                            : 'transition-transform duration-200 group-hover:translate-x-0.5'
                        }`}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        {method.label !== method.title && (
                          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                            {method.label}
                          </p>
                        )}
                        <h3 className="font-display text-base font-semibold text-ink">
                          {method.title}
                        </h3>
                        <a
                          href={method.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex min-h-11 max-w-full items-center break-words text-sm font-semibold leading-relaxed text-technical-text underline underline-offset-4 focus-visible:outline-offset-2"
                        >
                          {method.contact}
                        </a>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );

};

export default Contact;
