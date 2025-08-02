'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 800)
          return 100
        }
        return prev + Math.random() * 12
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Geometric shapes */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-green-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 border-2 border-orange-500/20 rounded-lg rotate-45 animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-56 h-56 border-2 border-purple-500/20 rounded-full animate-bounce-slow" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/3 right-1/3 w-40 h-40 border-2 border-emerald-500/20 rotate-12 animate-ping" style={{ animationDuration: '3s' }} />
            
            {/* Floating particles */}
            <div className="absolute top-20 left-20 w-8 h-8 bg-green-500/30 rounded-full blur-sm animate-float" />
            <div className="absolute top-32 right-32 w-6 h-6 bg-orange-500/30 rounded-full blur-sm animate-float" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-28 left-36 w-10 h-10 bg-purple-500/30 rounded-full blur-sm animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 right-24 w-7 h-7 bg-emerald-500/30 rounded-full blur-sm animate-float" style={{ animationDelay: '1.5s' }} />
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-8">
              <div className="h-full w-full bg-grid-white/[0.03] bg-[length:50px_50px]" />
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/5 via-transparent to-orange-900/5" />
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
            {/* Logo/Brand area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
              className="mb-16"
            >
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative w-full h-full bg-gradient-to-br from-green-400 via-emerald-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-black">K</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-orange-400 bg-clip-text text-transparent mb-6 leading-tight">
                Vai Kharan Ektu
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-gray-400 text-lg md:text-xl font-light tracking-wide"
              >
                Preparing your cinematic experience...
              </motion.p>
            </motion.div>

            {/* Progress bar with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-orange-500/20 to-purple-500/20 animate-gradient-x" />
                
                {/* Progress fill */}
                <motion.div
                  className="relative h-full bg-gradient-to-r from-green-500 via-emerald-500 to-orange-500 rounded-full shadow-lg"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex justify-between items-center mt-4"
              >
                <span className="text-gray-500 text-sm font-medium">LOADING</span>
                <span className="text-green-400 text-sm font-mono">{Math.round(progress)}%</span>
              </motion.div>
            </motion.div>

            {/* Animated elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex justify-center gap-3 mt-12"
            >
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-gradient-to-r from-green-400 to-orange-400 rounded-full"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-12 left-12 w-20 h-20 border-l-2 border-t-2 border-green-500/40 rounded-tl-xl" />
          <div className="absolute top-12 right-12 w-20 h-20 border-r-2 border-t-2 border-orange-500/40 rounded-tr-xl" />
          <div className="absolute bottom-12 left-12 w-20 h-20 border-l-2 border-b-2 border-purple-500/40 rounded-bl-xl" />
          <div className="absolute bottom-12 right-12 w-20 h-20 border-r-2 border-b-2 border-emerald-500/40 rounded-br-xl" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}