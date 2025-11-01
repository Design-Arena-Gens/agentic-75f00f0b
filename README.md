# Customer Texting Agent 🤖

An AI-powered SMS agent that helps you communicate with your customers and clients using Twilio and OpenAI.

## Features

- 📱 Send SMS messages to customers via Twilio
- 🤖 AI-powered message generation using OpenAI GPT-4
- 📝 Write custom messages or let AI generate them
- 📊 View conversation history
- 🎨 Beautiful, responsive UI

## Setup

### 1. Get Your API Keys

**Twilio (for SMS):**
1. Sign up at [twilio.com](https://www.twilio.com/try-twilio)
2. Get your Account SID and Auth Token from the console
3. Buy a phone number with SMS capabilities

**OpenAI (for AI):**
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Generate an API key

### 2. Configure Environment Variables

Set these in your Vercel project settings:

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
OPENAI_API_KEY=your_openai_key
BUSINESS_NAME=Your Business Name
YOUR_NAME=Your Name
```

### 3. Deploy to Vercel

```bash
npm install
npm run build
vercel deploy --prod
```

## Usage

1. Enter customer phone number (with country code, e.g., +1234567890)
2. Choose between:
   - **Custom Message**: Write your own message
   - **AI Generated**: Describe what you want to say, AI writes it for you
3. Click send!

## Example AI Prompts

- "Thank them for their recent purchase and offer a 10% discount"
- "Remind them about their appointment tomorrow at 2pm"
- "Follow up on their inquiry about our premium package"
- "Send a friendly check-in message"

## Tech Stack

- Next.js 14 - React framework
- TypeScript - Type safety
- Twilio - SMS delivery
- OpenAI GPT-4 - AI message generation
- Vercel - Hosting
