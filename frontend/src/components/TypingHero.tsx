import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function TypingHero() {
  const { isDark } = useTheme();

  const [displayText, setDisplayText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const phrases = [
    {
      text: "Hackathons",
      colorDark: "text-emerald-400",
      colorLight: "text-green-600",
      cursorColorDark: "bg-emerald-400",
      cursorColorLight: "bg-green-600"
    },
    {
      text: "Skill Assessments",
      colorDark: "text-blue-400",
      colorLight: "text-blue-700",
      cursorColorDark: "bg-blue-400",
      cursorColorLight: "bg-blue-700"
    },
    {
      text: "Developer Community",
      colorDark: "text-orange-400",
      colorLight: "text-orange-600",
      cursorColorDark: "bg-orange-400",
      cursorColorLight: "bg-orange-600"
    }
  ];

  const baseText = "HackerEarth empowers ";
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex].text;

    if (!isDeleting && currentCharIndex < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && currentCharIndex === currentPhrase.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentCharIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, currentCharIndex - 1));
        setCurrentCharIndex(currentCharIndex - 1);
      }, deletingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentCharIndex === 0) {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [currentCharIndex, isDeleting, currentPhraseIndex]);

  const phraseColors = isDark ? phrases[currentPhraseIndex].colorDark : phrases[currentPhraseIndex].colorLight;
  const cursorColor = isDark ? phrases[currentPhraseIndex].cursorColorDark : phrases[currentPhraseIndex].cursorColorLight;
  const baseTextColor = isDark ? "text-white" : "text-gray-900";

  // Calculate minWidth based on the longest phrase so the text doesn't wrap or jump
  const maxPhraseLength = Math.max(...phrases.map(p => p.text.length));
  // Estimate character width approx 0.68em (adjust if font or styling changes)
  const minWidthEm = maxPhraseLength * 0.68;

  return (
    <h1 className="text-2xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter font-mono">
      <div className="flex flex-wrap justify-center">
        <div className="relative">
          <span className={`${baseTextColor}`}>{baseText}</span>
          {/* 
            Use inline block with nowrap and minWidth to keep container stable 
          */}
          <span
            className={`${phraseColors} drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] inline-block whitespace-nowrap`}
            style={{ minWidth: `${minWidthEm}em` }}
          >
            {displayText}
            <span
  className={`inline-block w-1.5 ml-1 ${cursorColor} animate-pulse align-middle rounded-sm`}
  style={{ height: "0.95em" }}
/>
          </span>
        </div>
      </div>
    </h1>
  );
}

export default TypingHero;
