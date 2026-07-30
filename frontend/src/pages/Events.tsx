import { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="ui-card group flex h-full min-w-0 flex-col overflow-hidden transition duration-300 hover:border-brand-400 hover:shadow-glow"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-muted">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${event.gradient}`}
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-ink-muted">
          <Calendar className="size-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
          <time dateTime={event.date}>
            {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
        </div>

        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink">
          {event.title}
        </h3>

        <Link
          to={event.link}
          className="btn btn-secondary group/button mt-6 w-full justify-center focus-visible:outline-offset-4 sm:w-fit"
        >
          <span>View Highlights</span>
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover/button:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
};

const Events = () => {
  const [loading, setLoading] = useState(true);

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
      <section className="section-space">
        <div className="site-container">
          <motion.div
            className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading">EVENTS</h2>
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
