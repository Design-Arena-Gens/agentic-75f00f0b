import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import OpenAI from 'openai'
import { conversations } from '@/lib/conversations-store'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, message, aiPrompt } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    let finalMessage = message

    // Generate message with AI if prompt is provided
    if (aiPrompt) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a friendly customer service representative for ${process.env.BUSINESS_NAME || 'our business'}. Your name is ${process.env.YOUR_NAME || 'the team'}. Write personalized, warm, and professional SMS messages. Keep messages concise (under 160 characters when possible) and natural. Always sign off with your name.`
            },
            {
              role: 'user',
              content: aiPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 200,
        })

        finalMessage = completion.choices[0]?.message?.content || 'Hello! Thank you for being our valued customer.'
      } catch (aiError: any) {
        console.error('OpenAI error:', aiError)
        return NextResponse.json(
          { error: `AI generation failed: ${aiError.message || 'Unknown error'}. Please try writing a custom message instead.` },
          { status: 500 }
        )
      }
    }

    if (!finalMessage) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Send SMS via Twilio
    try {
      const twilioMessage = await twilioClient.messages.create({
        body: finalMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      })

      // Store conversation
      const conversation = {
        id: twilioMessage.sid,
        phone,
        message: finalMessage,
        timestamp: new Date().toISOString(),
        status: twilioMessage.status,
      }
      conversations.unshift(conversation)

      // Keep only last 50 conversations
      if (conversations.length > 50) {
        conversations.length = 50
      }

      return NextResponse.json({
        message: 'Message sent successfully!',
        messageId: twilioMessage.sid,
        sentMessage: finalMessage,
      })
    } catch (twilioError: any) {
      console.error('Twilio error:', twilioError)
      return NextResponse.json(
        { error: `Failed to send SMS: ${twilioError.message || 'Unknown error'}. Check your Twilio configuration.` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
