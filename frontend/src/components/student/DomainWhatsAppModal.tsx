import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, MessageCircle, X } from "lucide-react";
import type { DomainCommunity } from "../../lib/studentApi";

interface DomainWhatsAppModalProps {
  isOpen: boolean;
  groups: DomainCommunity[];
  onClose: () => void;
}

export const domainCommunityDescriptions: Record<DomainCommunity["domain"], string> = {
  "Web Development":
    "Connect with the Web Development community for updates, discussions and learning resources.",
  DSA: "Connect with the DSA community for updates, discussions and learning resources.",
  Aptitude:
    "Connect with the Aptitude community for updates, discussions and learning resources.",
};

const modalAccents = [
  {
    card: "border-technical/25",
    icon: "border-technical/25 bg-technical/10 text-technical-text",
  },
  {
    card: "border-creative/25",
    icon: "border-creative/25 bg-creative/10 text-creative-text",
  },
  {
    card: "border-dream/25",
    icon: "border-dream/25 bg-dream/10 text-dream-text",
  },
] as const;

export const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    role="img"
    aria-label="WhatsApp"
    fill="none"
  >
    <path
      fill="currentColor"
      d="M16.04 4C9.41 4 4.02 9.35 4.02 15.93c0 2.1.56 4.16 1.61 5.96L4 28l6.31-1.61A12.1 12.1 0 0 0 16.04 28C22.67 28 28 22.65 28 16.07 28 9.49 22.67 4 16.04 4Zm0 21.88c-1.84 0-3.64-.49-5.21-1.42l-.37-.22-3.74.95.99-3.62-.24-.38a9.72 9.72 0 0 1-1.49-5.26c0-5.4 4.51-9.79 10.06-9.79 5.53 0 10.01 4.45 10.01 9.93 0 5.41-4.49 9.81-10.01 9.81Zm5.51-7.35c-.3-.15-1.79-.87-2.07-.97-.28-.1-.48-.15-.68.15-.2.29-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.47-.89-.79-1.5-1.77-1.67-2.07-.17-.29-.02-.45.13-.6.13-.13.3-.35.45-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.03-.52-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.07-.8.37-.28.29-1.05 1.02-1.05 2.48 0 1.47 1.08 2.88 1.23 3.08.15.2 2.12 3.2 5.14 4.49.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.79-.72 2.04-1.42.25-.69.25-1.29.18-1.42-.08-.12-.28-.2-.58-.34Z"
    />
  </svg>
);

export default function DomainWhatsAppModal({
  isOpen,
  groups,
  onClose,
}: DomainWhatsAppModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && groups.length > 0 && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-md dark:bg-canvas/70 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="domain-whatsapp-modal-title"
            className="relative max-h-[min(42rem,calc(100vh-2rem))] w-full max-w-3xl overflow-y-auto rounded-panel border border-dream/30 bg-glass/95 p-5 text-ink shadow-glass backdrop-blur-2xl sm:p-6 lg:p-7"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 22, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 14, scale: 0.98 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-dream/15"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 left-8 size-56 rounded-full bg-technical/10"
            />

            <button
              ref={closeButtonRef}
              type="button"
              className="btn btn-ghost btn-icon absolute right-4 top-4 z-10 border-line/80 bg-surface/80 text-ink-muted shadow-soft hover:text-ink focus-visible:outline-offset-2"
              onClick={onClose}
              aria-label="Close community popup"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <div className="relative pr-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-dream/30 bg-dream/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-dream-text">
                <MessageCircle className="size-4" aria-hidden="true" />
                HackerEarth Hub • NMAMIT
              </span>
              <h2
                id="domain-whatsapp-modal-title"
                className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                Join Your HackerEarth Communities
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
                Stay connected with your learning communities. Join your official domain WhatsApp groups for announcements, resources, session updates, and important notices.
              </p>
            </div>

            <div className="relative mt-6 grid gap-3">
              {groups.map((group, index) => {
                const accent = modalAccents[index % modalAccents.length];

                return (
                  <article
                    key={group.domain}
                    className={`rounded-card border bg-surface/80 p-4 shadow-soft ${accent.card}`}
                  >
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          className={`flex size-11 shrink-0 items-center justify-center rounded-control border ${accent.icon}`}
                        >
                          <WhatsAppIcon className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-semibold text-ink">
                            {group.domain}
                          </h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                            Official Community
                          </p>
                        </div>
                      </div>
                      <a
                        href={group.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-full justify-center sm:w-auto"
                      >
                        Join WhatsApp Group
                        <ExternalLink className="size-4" aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="relative mt-6 flex flex-col gap-3 border-t border-line/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-ink-muted">
                You can access these groups anytime from your dashboard.
              </p>
              <button
                type="button"
                className="btn btn-secondary w-full justify-center sm:w-auto"
                onClick={onClose}
              >
                Maybe Later
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
