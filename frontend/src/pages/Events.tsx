import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import SectionReveal from '../components/ui/SectionReveal';

const pastEvents = [
  {
    id: 1,
    title: "MindMesh 2025",
    date: "2025-10-11",
    image: "/images/MindMesh.jpeg",
    link: "",
  },
  {
    id: 2,
    title: "Git & Github Workshop",
    date: "2025-09-06",
    image: "/images/workshop1.jpg",
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
      className="ui-card-glass top-border-accent-primary group flex h-full min-w-0 flex-col overflow-hidden border-dream/25 transition duration-300 hover:border-dream/50 hover:shadow-glow"
    >
      <div className="relative m-3 mb-0 aspect-[16/10] overflow-hidden rounded-[1.35rem] border border-line/70 bg-surface-muted shadow-soft sm:m-4 sm:mb-0">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          decoding="async"
          className={`size-full object-contain transition-transform duration-500 ${
            shouldReduceMotion ? '' : 'group-hover:scale-[1.02]'
          }`}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-rose/70 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex w-fit items-center gap-2 rounded-full border border-highlight/25 bg-highlight/10 px-3 py-2 text-sm font-semibold text-highlight-text shadow-soft">
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
          className="btn btn-primary group/button mt-6 w-full justify-center focus-visible:outline-offset-4 sm:w-fit"
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
  return (
    <PageTransition className="relative isolate min-h-screen overflow-hidden bg-transparent text-ink transition-colors duration-500">
      <main className="min-h-screen">
      <section className="section-glow-subtle section-space relative overflow-x-clip pt-28 sm:pt-32">
        <div className="site-container">
          <SectionReveal
            variant="slide-up"
            className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16"
            amount={0.3}
          >
            <h1 className="section-heading">
              <span className="text-gradient-subtle">EVENTS</span>
            </h1>
          </SectionReveal>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 rounded-panel border border-line/50 bg-glass/30 p-3 shadow-glass sm:p-5 md:grid-cols-2 lg:gap-8 lg:p-7">
            {pastEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>
      </main>
    </PageTransition>
  );
};

export default Events;
