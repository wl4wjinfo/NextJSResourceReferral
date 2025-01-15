'use client'

import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

export default function BookAppointment() {
  const router = useRouter()

  return (
    <div className="min-h-screen p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      
      <h1 className="text-3xl font-bold mb-6">Book Appointment</h1>
      
      {/* Add your appointment booking form here */}
    </div>
  )
}
