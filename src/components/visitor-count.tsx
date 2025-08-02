'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Eye } from 'lucide-react'

export default function VisitorCount() {
  const [visitorCount, setVisitorCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/visitors')
        const data = await response.json()
        setVisitorCount(data.count)
      } catch (error) {
        console.error('Error fetching visitor count:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVisitorCount()
  }, [])

  return (
    <motion.div
      className="flex items-center gap-3 glass-card px-6 py-3 rounded-full border border-white/20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <Eye className="w-5 h-5 text-red-400" />
        <div className="absolute inset-0 bg-red-400/20 rounded-full blur-sm" />
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Visitors:</span>
        {loading ? (
          <div className="w-12 h-6 bg-gray-700 rounded-full animate-pulse" />
        ) : (
          <motion.span
            className="text-white font-bold text-lg"
            key={visitorCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {visitorCount.toLocaleString()}
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}