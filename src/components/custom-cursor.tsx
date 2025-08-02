'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const mouseDown = () => setCursorVariant('click')
    const mouseUp = () => setCursorVariant('default')
    const mouseEnterLink = () => setCursorVariant('hover')
    const mouseLeaveLink = () => setCursorVariant('default')

    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mousedown', mouseDown)
    window.addEventListener('mouseup', mouseUp)

    // Add hover effect to clickable elements
    const clickableElements = document.querySelectorAll('button, a, [role="button"], .cursor-pointer')
    clickableElements.forEach(element => {
      element.addEventListener('mouseenter', mouseEnterLink)
      element.addEventListener('mouseleave', mouseLeaveLink)
    })

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mouseup', mouseUp)
      clickableElements.forEach(element => {
        element.removeEventListener('mouseenter', mouseEnterLink)
        element.removeEventListener('mouseleave', mouseLeaveLink)
      })
    }
  }, [])

  const getCursorColor = () => {
    if (!mounted) return 'rgb(239, 68, 68)' // Default red color
    return theme === 'light' ? 'rgb(220, 38, 38)' : 'rgb(239, 68, 68)'
  }

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1.5,
    },
    click: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 0.8,
    }
  }

  const dotVariants = {
    default: {
      x: mousePosition.x - 2,
      y: mousePosition.y - 2,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 2,
      y: mousePosition.y - 2,
      scale: 1,
    },
    click: {
      x: mousePosition.x - 2,
      y: mousePosition.y - 2,
      scale: 1.2,
    }
  }

  if (!mounted) return null

  const cursorColor = getCursorColor()

  return (
    <>
      {/* Outer circle */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ borderColor: cursorColor }}
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      />
      
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 rounded-full pointer-events-none z-50"
        style={{ backgroundColor: cursorColor }}
        variants={dotVariants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 40,
          mass: 0.1
        }}
      />
    </>
  )
}