'use client'

import { useState } from 'react'
import { Send, Phone, MessageCircle } from 'lucide-react'
import BottomNav from '../components/BottomNav'

interface Message {
  id: string
  text: string
  timestamp: Date
  sender: 'user' | 'recipient'
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !phoneNumber.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          phoneNumber: phoneNumber,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to send message')
        return
      }

      // Add message to local state
      const newMsg: Message = {
        id: Date.now().toString(),
        text: newMessage,
        timestamp: new Date(),
        sender: 'user',
      }

      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
        {/* Header */}
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Messages</h1>
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              <p>{error}</p>
              <a 
                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline mt-1 block"
              >
                Register your number for testing
              </a>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-500" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Messages List */}
        <div className="p-4 space-y-4 min-h-[calc(100vh-300px)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation by sending a message</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading || !newMessage.trim() || !phoneNumber.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        <BottomNav />
      </div>
    </main>
  )
}
