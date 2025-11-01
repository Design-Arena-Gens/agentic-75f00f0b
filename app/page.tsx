'use client'

import { useState, useEffect } from 'react'

interface Conversation {
  id: string
  phone: string
  message: string
  timestamp: string
  status: string
}

export default function Home() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [useAI, setUseAI] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          message: useAI ? undefined : message,
          aiPrompt: useAI ? prompt : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ type: 'success', message: data.message })
        setPhone('')
        setMessage('')
        setPrompt('')
        fetchConversations()
      } else {
        setResult({ type: 'error', message: data.error || 'Failed to send message' })
      }
    } catch (error) {
      setResult({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <div className="container">
        <h1>🤖 Customer Texting Agent</h1>
        <p className="subtitle">Send AI-powered or custom SMS messages to your customers</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone">Customer Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="useAI">
              <input
                type="checkbox"
                id="useAI"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                disabled={loading}
                style={{ width: 'auto', marginRight: '0.5rem' }}
              />
              Use AI to generate message
            </label>
          </div>

          {useAI ? (
            <div className="form-group">
              <label htmlFor="prompt">AI Prompt (what should the message be about?)</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Thank them for their recent purchase and offer a 10% discount on their next order"
                required
                disabled={loading}
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                required
                disabled={loading}
              />
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : useAI ? 'Generate & Send with AI' : 'Send Message'}
          </button>
        </form>

        {result && (
          <div className={`message ${result.type}`}>
            {result.message}
          </div>
        )}

        {conversations.length > 0 && (
          <div className="conversations">
            <h2>Recent Messages</h2>
            {conversations.map((conv) => (
              <div key={conv.id} className="conversation-item">
                <div className="phone">{conv.phone}</div>
                <div className="text">{conv.message}</div>
                <div className="timestamp">
                  {new Date(conv.timestamp).toLocaleString()} - {conv.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
