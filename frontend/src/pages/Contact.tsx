"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/image.png";

const Contact = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-24 ${isDark ? "bg-black/50 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}
    >
      <div className="max-w-2xl w-full">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="HackerEarth Club" className="w-20 h-20 mb-4" />
          <h1 className="text-4xl font-bold text-center mb-2">Contact Us</h1>
          <p className="text-center text-base opacity-80 mb-6">
            Last updated on September 27, 2025
          </p>
        </div>
        <div className="mb-6 text-lg">
          You may contact the HackerEarth NMAMIT club using the information below:
        </div>
        <div className="space-y-4 text-base md:text-lg">
          <div>
            <span className="font-bold">Club Name:</span>{' '}
            HackerEarth-NMAMIT Student Club
          </div>
          <div>
            <span className="font-bold">Operational Address:</span>{' '}
            <span>
              Room 301, CS Building, NMAMIT, Nitte, Karnataka – 574110
            </span>
          </div>
          <div>
            <span className="font-bold">For Technical Queries/Issues:</span>{' '}
            <span>
              <Phone className="inline w-5 h-5" /> +91 76195 45988
            </span>
          </div>
          <div>
            <span className="font-bold">General Inquiries:</span>{' '}
            <span>
              <Mail className="inline w-5 h-5" />{' '}
              <a
                href="mailto:hackerearth@nmamit.in"
                className="underline"
              >
                hackerearth@nmamit.in
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
