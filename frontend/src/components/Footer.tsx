"use client"
import type React from "react"
import { useState, useEffect } from "react"

interface MotionDivProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  initial?: { [key: string]: any }
  animate?: { [key: string]: any }
  exit?: { [key: string]: any } // Note: Full 'exit' animation typically requires a parent component like 'AnimatePresence' to manage unmounting.
  transition?: {
    duration?: number
    ease?: string
    delay?: number // Added delay property
  }
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

export function MotionDiv({ // Added 'export' keyword
  children,
  className = "",
  style = {},
  initial = {},
  animate = {},
  exit = {}, // 'exit' prop is acknowledged but not fully implemented without external context
  transition = {},
  onMouseEnter,
  onMouseLeave,
}: MotionDivProps) {
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    let animationFrameId: number
    // Use requestAnimationFrame to ensure the state update happens right before the next repaint.
    // This allows the initial styles to be applied and rendered,
    // and then the `hasAnimated` state changes, triggering the transition.
    animationFrameId = requestAnimationFrame(() => {
      setHasAnimated(true)
    })

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Function to process style objects (initial, animate) and combine transform properties
  const processStyle = (props: { [key: string]: any }): React.CSSProperties => {
    const newStyle: React.CSSProperties = {}
    const transforms: string[] = []

    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        const value = props[key]
        switch (key) {
          case "x":
            transforms.push(`translateX(${value})`)
            break
          case "y":
            transforms.push(`translateY(${value})`)
            break
          case "scale":
            transforms.push(`scale(${value})`)
            break
          case "rotate":
            transforms.push(`rotate(${value})`)
            break
          // Add more transform properties as needed
          default:
            // Apply other CSS properties directly
            newStyle[key as keyof React.CSSProperties] = value
            break
        }
      }
    }

    if (transforms.length > 0) {
      // If there's an existing transform in the base style, we combine them.
      // For simplicity here, we'll just set it, assuming user doesn't pass complex pre-existing transforms in `style`.
      newStyle.transform = transforms.join(" ")
    }

    return newStyle
  }

  // Construct the CSS transition string including duration, ease, and delay
  const baseTransition = `all ${transition.duration || 0.3}s ${transition.ease || "ease-out"} ${transition.delay || 0}s`

  const currentAnimationStyles: React.CSSProperties = hasAnimated
    ? {
        ...processStyle(animate),
        transition: baseTransition,
      }
    : {
        ...processStyle(initial),
        transition: "none", // Initial state should not transition from nothing
      }

  return (
    <div
      className={className}
      style={{ ...style, ...currentAnimationStyles }}
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

  // If the footer is not at the bottom, don't render it.
  // Note: This approach means the MotionDiv will unmount immediately,
  // preventing any 'exit' animations defined on it.
  if (!isAtBottom) return null

  return (
    <MotionDiv
      className="fixed z-50 bottom-0 left-0 w-full h-80 flex justify-center items-center"
      style={{ backgroundColor: "#e78a53" }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }} // This 'exit' prop won't have an effect as the component unmounts
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
          Footer
        </MotionDiv>
      </div>
    </MotionDiv>
  )
}