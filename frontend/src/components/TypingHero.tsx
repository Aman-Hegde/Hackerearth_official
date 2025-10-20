import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function TypingHero() {
  const { isDark } = useTheme();

  const [displayText, setDisplayText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    {
      text: "Hackathons ",
      colorDark: "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent",
      colorLight: "bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent",
      cursorColorDark: "bg-gradient-to-r from-cyan-400 to-blue-400",
      cursorColorLight: "bg-gradient-to-r from-cyan-600 to-blue-600",
    },
    {
      text: "Skill Assessments ",
      colorDark: "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",
      colorLight: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
      cursorColorDark: "bg-gradient-to-r from-blue-400 to-purple-400",
      cursorColorLight: "bg-gradient-to-r from-blue-600 to-purple-600",
    },
    {
      text: "Developer Community ",
      colorDark: "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent",
      colorLight: "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",
      cursorColorDark: "bg-gradient-to-r from-purple-400 to-pink-400",
      cursorColorLight: "bg-gradient-to-r from-purple-600 to-pink-600",
    },
  ];

  const baseText = "HackerEarth empowers ";
  const typingSpeed = 80;
  const deletingSpeed = 45;
  const pauseTime = 1800;

  useEffect(() => {
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
  }, [currentCharIndex, isDeleting, currentPhraseIndex]);

  const phraseColors = isDark
    ? phrases[currentPhraseIndex].colorDark
    : phrases[currentPhraseIndex].colorLight;
  const cursorColor = isDark
    ? phrases[currentPhraseIndex].cursorColorDark
    : phrases[currentPhraseIndex].cursorColorLight;
  const baseTextColor = isDark ? "text-white" : "text-gray-900";

  const maxPhraseLength = Math.max(...phrases.map((p) => p.text.length));
  const minWidthEm = maxPhraseLength * 0.65;

  return (
    <h1 className="tracking-tighter font-sans text-center">
      <div className="flex flex-wrap justify-center">
        <div className="relative">
          {/* Base Text */}
          <span className={`${baseTextColor} text-4xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold`}>
            {baseText}
          </span>

          {/* Typing phrase */}
          <span
            className={`${phraseColors} inline-block whitespace-nowrap relative text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold`}
            style={{ minWidth: `${minWidthEm}em` }}
          >
            {displayText.split("").map((char, i) => (
              <span
                key={i}
                className={`inline-block ${i === displayText.length - 1 && !isDeleting ? "animate-fadeInUp" : ""
                  }`}
              >
                {char}
              </span>
            ))}
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
