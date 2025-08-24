import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/image.png'

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    title: 'Contests',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: logo,
  },
  {
    title: 'Tech Events',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: logo,
  },
  {
    title: 'Roadmaps',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: logo,
  },
  {
    title: 'DPPs',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: logo,
  },
];

const ExploreMoreSection = () => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Marquee horizontal scroll animations stay the same
    gsap.fromTo(
      '.marquee-text-1',
      { x: -250, backgroundPosition: '145% 0' },
      {
        x: -10,
        backgroundPosition: '0% 0%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.marquee-container',
          start: 'top bottom',
          end: 'bottom 90%',
          scrub: 1,
        },
      }
    );
    gsap.fromTo(
      '.marquee-text-2',
      { x: 70, backgroundPosition: '145% 0' },
      {
        x: -10,
        backgroundPosition: '0% 0%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.marquee-container',
          start: 'top bottom',
          end: 'bottom 90%',
          scrub: 1,
        },
      }
    );

    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.event-card');

      cards.forEach((card, index) => {
        const img = card.querySelector('img') as HTMLElement;
        const title = card.querySelector('h3') as HTMLElement;
        const desc = card.querySelector('p') as HTMLElement;

        // Image slides in from left/right alternating sides
        if (img) {
          gsap.fromTo(
            img,
            { opacity: 0, x: index % 2 === 0 ? -200 : 200 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: img,
                start: 'top 95%',
                end: 'top 40%',
                toggleActions: 'play reverse play reverse',
                scrub: 0.6,
              },
            }
          );
        }

        // Title slides in from opposite side of image
        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, x: index % 2 === 0 ? 200 : -200 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: title,
                start: 'top 90%',
                toggleActions: 'play reverse play reverse',
                scrub: 0.7,
              },
            }
          );
        }

        // Description slides up separately with fade
        if (desc) {
          gsap.fromTo(
            desc,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: desc,
                start: 'top 90%',
                toggleActions: 'play reverse play reverse',
                scrub: 0.8,
              },
            }
          );
        }
      });
    }
        // Left cards slide in from left
    gsap.utils.toArray('.feature-left').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -200 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'top 40%',
            toggleActions: 'play reverse play reverse',
            scrub: 0.2,
          },
        }
      );
    });

    // Right cards slide in from right
    gsap.utils.toArray('.feature-right').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 200 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'top 40%',
            toggleActions: 'play reverse play reverse',
            scrub: 0.2,
          },
        }
      );
    });

    // Middle card slides down from top
    gsap.utils.toArray('.feature-middle').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: -200 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'top 40%',
            toggleActions: 'play reverse play reverse',
            scrub: 0.2,
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className={`benifits-section content-container mb-16 overflow-hidden px-4 max-w-7xl mx-auto ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      {/* Marquee Text */}
      <div className="marquee-container relative whitespace-nowrap h-[60px] flex justify-center text-6xl md:text-8xl flex-col gap-0 font-bold tracking-tight select-none overflow-visible mb-12">
        <h1 className="marquee-text-1 inline-block whitespace-nowrap bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text">
          Explore
        </h1>
        <h1 className="marquee-text-2 absolute top-[40%] inline-block whitespace-nowrap bg-gradient-to-r from-purple-500 to-pink-600 text-transparent bg-clip-text">
          More
        </h1>
      </div>

      {/* Event Cards */}
      <div className="flex flex-col gap-24">
        {events.map((event, idx) => (
          <div
            key={idx}
            className={`event-card flex flex-col md:flex-row items-center gap-8 rounded-2xl shadow-lg p-6 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            <img
              src={event.imageUrl}
              alt={event.title}
              className="max-w-full md:max-w-[600px] rounded-xl object-cover shadow-md"
            />
            <div className={`event-text max-w-xl text-center md:text-left px-4 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
              <h3 className="text-4xl font-bold mb-4">{event.title}</h3>
              <p className="text-lg">{event.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreMoreSection;
