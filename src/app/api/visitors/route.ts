import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory visitor counter (in production, use a database)
let visitorCount = 0

export async function GET() {
  try {
    // Increment visitor count
    visitorCount++
    
    return NextResponse.json({ 
      count: visitorCount,
      message: 'Visitor count retrieved successfully' 
    })
  } catch (error) {
    console.error('Error getting visitor count:', error)
    return NextResponse.json(
      { error: 'Failed to get visitor count' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // Reset visitor count (admin functionality)
    visitorCount = 0
    
    return NextResponse.json({ 
      count: visitorCount,
      message: 'Visitor count reset successfully' 
    })
  } catch (error) {
    console.error('Error resetting visitor count:', error)
    return NextResponse.json(
      { error: 'Failed to reset visitor count' },
      { status: 500 }
    )
  }
}