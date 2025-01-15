'use client';

import Link from 'next/link'
import { 
  Calendar, 
  Clock,
  Home, 
  MessageSquare, 
  Search, 
  User, 
  Plus,
  Pill,
  TestTube,
  Ambulance
} from 'lucide-react'

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  bgColor: string
}

const ServiceCard = ({ icon, title, description, bgColor }: ServiceCardProps) => (
  <div className={`p-4 rounded-xl ${bgColor} hover:opacity-90 transition-opacity cursor-pointer`}>
    <div className="mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
)

export default function Dashboard() {
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Search</h1>
        <div className="flex items-center gap-2">
          <span className="text-blue-600">Raleigh, NC</span>
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Global Service Search: Food, Rent, Healthcare, etc."
          className="w-full p-3 pl-10 bg-gray-100 rounded-lg"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ServiceCard
          icon={<Search className="text-purple-600" size={24} />}
          title="Referral Service Search"
          description="Find a Service Provider"
          bgColor="bg-purple-50"
        />
        <ServiceCard
          icon={<Plus className="text-blue-600" size={24} />}
          title="Add Service Provider"
          description="Send Provider Onboarding Link"
          bgColor="bg-green-50"
        />
        <ServiceCard
          icon={<Calendar className="text-blue-600" size={24} />}
          title="Book a Referral Appointment"
          description="Connect client with Provider"
          bgColor="bg-blue-50"
        />
        <Link href="/events">
          <ServiceCard
            icon={<Clock className="text-red-600" size={24} />}
            title="Event Tracker"
            description="Track event stats"
            bgColor="bg-red-50"
          />
        </Link>
        <ServiceCard
          icon={<TestTube className="text-orange-600" size={24} />}
          title="Order a Lab Test"
          description="Get Tested at Home"
          bgColor="bg-orange-50"
        />
        <ServiceCard
          icon={<Ambulance className="text-purple-600" size={24} />}
          title="Emergency Situation"
          description="Request an Ambulance"
          bgColor="bg-purple-50"
        />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex flex-col items-center gap-1">
            <Home size={24} className="text-gray-600" />
            <span className="text-xs">Home</span>
          </Link>
          <button className="flex flex-col items-center gap-1">
            <Search size={24} className="text-blue-600" />
            <span className="text-xs text-blue-600">Search</span>
          </button>
          <Link href="/calendar" className="flex flex-col items-center gap-1">
            <Calendar size={24} className="text-gray-600" />
            <span className="text-xs">Calendar</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center gap-1">
            <MessageSquare size={24} className="text-gray-600" />
            <span className="text-xs">Message</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1">
            <User size={24} className="text-gray-600" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
