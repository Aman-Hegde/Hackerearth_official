import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import "./EventCarousel.css";
import type { EventSummary } from "../lib/eventApi";

export default function EventCarousel({ event, cinematic = false }: { event: EventSummary; cinematic?: boolean }) {
  const photos = [...new Set(event.imageUrls?.length ? event.imageUrls : [event.posterUrl])];
  return <Carousel key={JSON.stringify(photos)} event={event} photos={photos} cinematic={cinematic} />;
}

function Carousel({ event, photos, cinematic }: { event: EventSummary; photos: string[]; cinematic: boolean }) {
  const initialReducedMotion = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion);
  const [index, setIndex] = useState(0);
  const [navigationVersion, setNavigationVersion] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  const available = photos.filter((url) => !failed.includes(url));
  const count = available.length;
  const current = count ? index % count : 0;

  useEffect(() => {
    // Keep autoplay in sync when the system preference changes while this page is open.
    if (!window.matchMedia) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (count < 2 || reducedMotion || paused || (!cinematic && (hovered || focused))) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % count), cinematic ? 2500 : 4500);
    return () => window.clearInterval(timer);
  }, [count, reducedMotion, paused, hovered, focused, cinematic, navigationVersion]);

  const navigate = (direction: number) => {
    setIndex((value) => (value + direction + count) % count);
    setNavigationVersion((value) => value + 1);
  };

  return (
    <div className={`event-carousel relative isolate flex min-w-0 flex-col justify-end overflow-hidden rounded-[1.35rem] border border-dream/30 bg-[#21152f] text-white ${cinematic ? "event-carousel--cinematic" : "m-3 mb-0 min-h-[32rem] sm:m-4 sm:mb-0 sm:min-h-[34rem]"}`}
      role="region" aria-roledescription={count > 1 ? "carousel" : undefined} aria-label={`${event.title} photographs`}
      onMouseEnter={() => { if (!cinematic) setHovered(true); }} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => { if (!cinematic) setFocused(true); }} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
      {available.map((url, photoIndex) => (
        <img key={url} src={url} alt={`${event.title} — photograph ${photos.indexOf(url) + 1}`}
          aria-hidden={photoIndex !== current} loading="lazy" decoding="async"
          onError={() => setFailed((values) => [...values, url])}
          className={`event-carousel__photo absolute inset-0 -z-20 size-full object-cover transition-opacity ${cinematic ? "duration-[400ms]" : "duration-700"} motion-reduce:transition-none ${photoIndex === current ? "opacity-100" : "opacity-0"}`} />
      ))}
      <div aria-hidden="true" className={`absolute inset-0 -z-10 ${cinematic ? "event-carousel__shade" : "bg-gradient-to-t from-[#160e24]/95 via-[#160e24]/55 to-[#160e24]/10"}`} />
      <div className={cinematic ? "event-carousel__content" : "p-5 sm:p-7"}>
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-purple-200">{event.status === "past" ? "Completed / Past Event" : "Upcoming Event"}</p>
        <h3 className="event-carousel__title break-words font-display text-2xl font-semibold leading-tight sm:text-3xl">{event.title}</h3>
        <p className="mt-3 text-sm text-purple-100"><time dateTime={event.eventDateTime}>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(event.eventDateTime))} | {new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(new Date(event.eventDateTime)).toUpperCase()} IST</time></p>
        {event.tagline && <p className="mt-4 text-lg font-semibold text-purple-200">{event.tagline}</p>}
        <p className="event-carousel__description mt-3 text-sm leading-6 text-white/90">{event.description}</p>
        {cinematic && !!event.rounds?.length && <p className="mt-4 text-sm font-semibold text-purple-100">A three-round technical competition featuring:</p>}
        {!!event.rounds?.length && <ul className="event-carousel__rounds mt-4 flex flex-wrap gap-2">{event.rounds.map((round) => <li key={round} className="rounded-full border border-purple-200/30 bg-purple-300/10 px-3 py-1 text-xs text-purple-100">{round}</li>)}</ul>}
        {count === 0 && <p className="mt-4 text-sm text-purple-200">Photographs are currently unavailable.</p>}
        {count > 1 && <div className="event-carousel__controls mt-5 flex flex-wrap items-center gap-3 text-sm">
          <button type="button" aria-label="Previous photograph" className="min-h-11 rounded-full border border-white/30 px-4 hover:bg-white/10" onClick={() => navigate(-1)}>←</button>
          <span aria-live={paused || reducedMotion || focused ? "polite" : "off"}>{current + 1} / {count}</span>
          <button type="button" aria-label="Next photograph" className="min-h-11 rounded-full border border-white/30 px-4 hover:bg-white/10" onClick={() => navigate(1)}>→</button>
          {!reducedMotion && <button type="button" className="min-h-11 rounded-full border border-white/30 px-4 hover:bg-white/10" onClick={() => setPaused(!paused)}>{paused ? "Play slideshow" : "Pause slideshow"}</button>}
        </div>}
      </div>
    </div>
  );
}
