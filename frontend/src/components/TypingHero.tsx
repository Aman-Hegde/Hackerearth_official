import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const phrases = [
  {
    text: 'Hackathons ',
    color:
      'from-accent-600 via-accent-500 to-brand-600 dark:from-accent-300 dark:via-accent-400 dark:to-brand-300',
    cursorColor: 'bg-accent-600 dark:bg-accent-300',
  },
  {
    text: 'Skill Assessments ',
    color:
      'from-brand-700 via-brand-600 to-accent-600 dark:from-brand-300 dark:via-brand-400 dark:to-accent-300',
    cursorColor: 'bg-brand-600 dark:bg-brand-300',
  },
  {
    text: 'Developer Community ',
    color:
      'from-brand-600 via-accent-500 to-signal-600 dark:from-brand-300 dark:via-accent-300 dark:to-signal-400',
    cursorColor: 'bg-signal-600 dark:bg-signal-400',
  },
] as const;

const baseText = 'HackerEarth empowers ';
const longestPhrase = phrases.reduce(
  (longest, phrase) => (phrase.text.length > longest.length ? phrase.text : longest),
  '',
);
const accessibleHeading = `${baseText}${phrases
  .map((phrase) => phrase.text.trim())
  .join(', ')}`.trim();
const typingSpeed = 80;
const deletingSpeed = 45;
const pauseTime = 1800;

function TypingHero() {
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const currentPhrase = phrases[currentPhraseIndex].text;

    if (!isDeleting && currentCharIndex < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentCharIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, currentCharIndex - 1));
        setCurrentCharIndex(currentCharIndex - 1);
      }, deletingSpeed);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentCharIndex === 0) {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }
  }, [currentCharIndex, currentPhraseIndex, isDeleting, shouldReduceMotion]);

  const currentPhrase = phrases[currentPhraseIndex];
  const visibleText = shouldReduceMotion ? currentPhrase.text : displayText;

  return (
    <h1
      className="mx-auto w-full min-w-0 text-center font-display text-[clamp(2rem,8vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink"
      aria-label={accessibleHeading}
    >
      <span aria-hidden="true">
        <span className="block text-balance">{baseText}</span>
        <span className="relative mx-auto mt-2 grid w-full max-w-full">
          <span
            className="invisible col-start-1 row-start-1 block max-w-full break-words [overflow-wrap:anywhere]"
          >
            {longestPhrase}
          </span>
          <span className="col-start-1 row-start-1 block max-w-full break-words [overflow-wrap:anywhere]">
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${currentPhrase.color}`}
            >
              {visibleText}
            </span>
            <span
              className={`ml-[0.12em] inline-block min-w-0.5 w-[0.08em] rounded-sm align-baseline ${
                currentPhrase.cursorColor
              } ${shouldReduceMotion ? 'opacity-70' : 'animate-pulse'}`}
              style={{ height: '0.82em' }}
            />
          </span>
        </span>
      </span>
    </h1>
  );
}

export default TypingHero;
