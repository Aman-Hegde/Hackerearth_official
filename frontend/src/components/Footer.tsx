"use client"
import type React from "react"
import { useState, useEffect } from "react"

interface MotionDivProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  initial?: { [key: string]: any }
  animate?: { [key: string]: any }
  exit?: { [key: string]: any }
  transition?: { [key: string]: any }
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

function MotionDiv({
  children,
  className = "",
  style = {},
  initial = {},
  animate = {},
  exit = {},
  transition = {},
  onMouseEnter,
  onMouseLeave,
}: MotionDivProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const animationStyle = isVisible
    ? {
        transform:
          animate.y !== undefined
            ? `translateY(${animate.y})`
            : animate.x !== undefined
              ? `translateX(${animate.x})`
              : "none",
        opacity: animate.opacity !== undefined ? animate.opacity : 1,
        transition: `all ${transition.duration || 0.3}s ${transition.ease || "ease-out"}`,
      }
    : {
        transform:
          initial.y !== undefined
            ? `translateY(${initial.y})`
            : initial.x !== undefined
              ? `translateX(${initial.x})`
              : "none",
        opacity: initial.opacity !== undefined ? initial.opacity : 0,
        transition: "none",
      }

  return (
    <div
      className={className}
      style={{ ...style, ...animationStyle }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}

export function Footer() {
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const isNearBottom = scrollTop + windowHeight >= documentHeight - 100

          setIsAtBottom(isNearBottom)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isAtBottom) return null

  return (
    <MotionDiv
      className="fixed z-50 bottom-0 left-0 w-full h-80 flex justify-center items-center"
      style={{ backgroundColor: "#e78a53" }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div
        className="relative overflow-hidden w-full h-full flex justify-end px-12 text-right items-start py-12"
        style={{ color: "#121113" }}
      >
        <MotionDiv
          className="flex flex-row space-x-12 sm:space-x-16 md:space-x-24 text-sm sm:text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ul className="space-y-2">
            <li
              className="hover:underline cursor-pointer transition-colors"
              style={{ color: "#121113" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
            >
              Home
            </li>
            <li
              className="hover:underline cursor-pointer transition-colors"
              style={{ color: "#121113" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
            >
              Docs
            </li>
            <li
              className="hover:underline cursor-pointer transition-colors"
              style={{ color: "#121113" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
            >
              Components
            </li>
          </ul>
          <ul className="space-y-2">
            <li
              className="hover:underline cursor-pointer transition-colors"
              style={{ color: "#121113" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
            >
              Github
            </li>
            <li
              className="hover:underline cursor-pointer transition-colors"
              style={{ color: "#121113" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
            >
              Twitter
            </li>
            <li
              className="hover:underline cursor-pointer transition-colors"
              style={{ color: "#121113" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
            >
              Discord
            </li>
          </ul>
        </MotionDiv>
        <MotionDiv
          className="absolute bottom-0 left-0 translate-y-1/3 sm:text-[192px] text-[80px] font-bold select-none"
          style={{ color: "#121113" }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          HackerEarth
        </MotionDiv>
      </div>
    </MotionDiv>
  )
}
