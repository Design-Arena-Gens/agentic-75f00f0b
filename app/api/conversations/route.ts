import { NextResponse } from 'next/server'
import { conversations } from '@/lib/conversations-store'

export async function GET() {
  return NextResponse.json({
    conversations: conversations.slice(0, 20), // Return last 20 conversations
  })
}
