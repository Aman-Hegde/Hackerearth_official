import { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loader from '../components/Loader';

const pastEvents = [
  {
    id: 1,
    title: "MindMesh 2025",
    date: "2025-10-11",
    image: "/images/MindMesh.jpeg",
    gradient: "from-gray-500 to-gray-100",
    link: "",
  },
  {
    id: 2,
    title: "Git & Github Workshop",
    date: "2025-09-06",
    image: "/images/workshop1.jpg",
    gradient: "from-purple-300 to-purple-600",
    link: "https://drive.google.com/drive/folders/1cKVk40LXLwJVtkqSQy5FfbbPWqI8zG7n",
  },
];

type EventItem = (typeof pastEvents)[number];

const EventCard = ({ event, index }: { event: EventItem; index: number }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true, amount: 0.25 }}
      className="ui-card top-border-accent-primary group flex h-full min-w-0 flex-col overflow-hidden border-primary/25 transition-colors duration-300 hover:border-primary/45 hover:shadow-surface"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-muted">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          decoding="async"
          className="size-full object-contain"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary to-technical"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex w-fit items-center gap-2 rounded-control border border-highlight/20 bg-highlight/5 px-3 py-2 text-sm font-medium text-highlight-text">
          <Calendar className="icon-accent-amber size-4 shrink-0" aria-hidden="true" />
          <time dateTime={event.date}>
            {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
        </div>

        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink">
          {event.title}
        </h3>

        <Link
          to={event.link}
          className="btn btn-secondary group/button mt-6 w-full justify-center border-line-strong text-primary-text hover:border-technical focus-visible:outline-offset-4 sm:w-fit"
        >
          <span>View Highlights</span>
          <ArrowRight
            className={`size-4 text-technical transition-transform duration-200 ${
              shouldReduceMotion ? '' : 'group-hover/button:translate-x-0.5'
            }`}
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
};

const Events = () => {
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-ink transition-colors duration-500">
        <Loader size={80} />
        <p className="mt-4 text-lg font-medium">Loading Events...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-canvas text-ink transition-colors duration-500">
      <section className="section-glow-subtle section-space overflow-x-clip pt-28 sm:pt-32">
        <div className="site-container">
          <motion.div
            className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h1 className="section-heading">
              <span className="text-gradient-subtle">EVENTS</span>
            </h1>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {pastEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Events;
