'use client';

import { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import { useRouter } from 'next/navigation';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Value>(new Date())
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/calendar/events')
      
      if (!response.ok) {
        const data = await response.json()
        
        if (response.status === 401) {
          // Clear any existing error
          setError(null)
          
          // Redirect to sign in
          router.push('/signin')
          return
        }
        
        throw new Error(data.message || 'Failed to fetch events')
      }
      
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const getEventsForDate = (selectedDate: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime)
      return eventDate.toDateString() === selectedDate.toDateString()
    })
  }

  const formatEventTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr)
    return format(date, 'h:mm a')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-md text-center">
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchEvents}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-healthcare-800">Calendar</h1>
        <div className="space-x-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded ${
              view === 'list'
                ? 'bg-healthcare-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded ${
              view === 'calendar'
                ? 'bg-healthcare-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="bg-white rounded-lg shadow p-4">
          <Calendar
            onChange={setDate}
            value={date}
            className="w-full rounded-lg border-none shadow-lg"
            tileContent={({ date }) => {
              const dayEvents = getEventsForDate(date)
              return dayEvents.length > 0 ? (
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="h-1 bg-blue-600 rounded-full mx-1"></div>
                </div>
              ) : null
            }}
          />
          
          {date && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">
                Events for {date instanceof Date ? date.toLocaleDateString() : ''}
              </h3>
              <div className="space-y-4">
                {getEventsForDate(date instanceof Date ? date : new Date()).map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-healthcare-700">
                      {event.summary}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatEventTime(event.start.dateTime)} - {formatEventTime(event.end.dateTime)}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow">
              <p className="mb-2">No upcoming events</p>
              <button
                onClick={() => router.push('/signin')}
                className="text-healthcare-600 hover:text-healthcare-700 underline text-sm"
              >
                Connect Google Calendar
              </button>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-healthcare-700">
                      {event.summary}
                    </h3>
                    {event.description && (
                      <p className="text-gray-600 mt-1 text-sm">{event.description}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(event.start.dateTime).toLocaleDateString()}</p>
                    <p>{formatEventTime(event.start.dateTime)}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.location && (
                    <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      📍 {event.location}
                    </span>
                  )}
                  <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    ⏱️ {formatEventTime(event.start.dateTime)} - {formatEventTime(event.end.dateTime)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
