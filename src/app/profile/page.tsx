'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Camera, Edit2, Save, X, Plus, Trash2 } from 'lucide-react'
import BottomNav from '@/components/BottomNav'

interface Profile {
  name: string
  email: string
  title: string
  phone: string
  address: string
  bio: string
  languages: string[]
  education: string[]
  eventsAttended: string[]
  photoUrl?: string
  tshirtSize: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    title: '',
    phone: '',
    address: '',
    bio: '',
    languages: [],
    education: [],
    eventsAttended: [],
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=faces&auto=format&q=90',
    tshirtSize: ''
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newLanguage, setNewLanguage] = useState('')
  const [newEducation, setNewEducation] = useState('')
  const [newEvent, setNewEvent] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile')
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) throw new Error('Failed to save changes')
      
      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload photo')

      const data = await response.json()
      setProfile(prev => ({ ...prev, photoUrl: data.url }))
    } catch (err) {
      console.error('Error uploading photo:', err)
      setError('Failed to upload photo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setProfile(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }))
      setNewLanguage('')
    }
  }

  const handleRemoveLanguage = (index: number) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }))
  }

  const handleAddEducation = () => {
    if (newEducation.trim()) {
      setProfile(prev => ({
        ...prev,
        education: [...prev.education, newEducation.trim()]
      }))
      setNewEducation('')
    }
  }

  const handleRemoveEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const handleAddEvent = () => {
    if (newEvent.trim()) {
      setProfile(prev => ({
        ...prev,
        eventsAttended: [...prev.eventsAttended, newEvent.trim()]
      }))
      setNewEvent('')
    }
  }

  const handleRemoveEvent = (index: number) => {
    setProfile(prev => ({
      ...prev,
      eventsAttended: prev.eventsAttended.filter((_, i) => i !== index)
    }))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-sm pb-40">
        {/* Header */}
        <div className="relative h-48">
          <div className="absolute inset-0">
            <Image
              src="/images/WOMAN LEADING-3.png"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            {/* Add a semi-transparent overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="relative">
              <button
                onClick={handlePhotoClick}
                className={`relative ${isEditing ? 'cursor-pointer' : ''}`}
                disabled={!isEditing || isUploading}
              >
                <Image
                  src={profile.photoUrl || '/placeholder-avatar.jpg'}
                  alt="Profile"
                  width={128}
                  height={128}
                  className={`rounded-full border-4 border-white ${isUploading ? 'opacity-50' : ''}`}
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white">
                    <Camera className="w-5 h-5" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-6 pb-24">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end mb-4">
            {isEditing ? (
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                  disabled={isSaving}
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  disabled={isSaving}
                >
                  <Save className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Basic Info */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg font-semibold">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              {isEditing ? (
                <select
                  value={profile.title}
                  onChange={e => setProfile({ ...profile, title: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a title</option>
                  <option value="CHW">Community Health Worker (CHW)</option>
                  <option value="RN">Registered Nurse (RN)</option>
                  <option value="MD">Medical Doctor (MD)</option>
                  <option value="NP">Nurse Practitioner (NP)</option>
                  <option value="PA">Physician Assistant (PA)</option>
                  <option value="SW">Social Worker (SW)</option>
                  <option value="OTHER">Other Healthcare Professional</option>
                </select>
              ) : (
                <p>{profile.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{profile.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              {isEditing ? (
                <textarea
                  value={profile.address}
                  onChange={e => setProfile({ ...profile, address: e.target.value })}
                  rows={2}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{profile.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* T-Shirt Size */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">T-Shirt Size</h3>
            <div>
              {isEditing ? (
                <select
                  value={profile.tshirtSize}
                  onChange={e => setProfile({ ...profile, tshirtSize: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a size</option>
                  <option value="XS">Extra Small (XS)</option>
                  <option value="S">Small (S)</option>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                  <option value="2XL">2X Large (2XL)</option>
                  <option value="3XL">3X Large (3XL)</option>
                  <option value="4XL">4X Large (4XL)</option>
                </select>
              ) : (
                <p className="text-gray-600">
                  {profile.tshirtSize ? `${profile.tshirtSize}` : 'Not specified'}
                </p>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Languages</h3>
            <div className="space-y-2">
              {profile.languages.map((language, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{language}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveLanguage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={e => setNewLanguage(e.target.value)}
                    placeholder="Add language..."
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddLanguage}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Education</h3>
            <div className="space-y-2">
              {profile.education.map((edu, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{edu}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEducation}
                    onChange={e => setNewEducation(e.target.value)}
                    placeholder="Add education..."
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddEducation}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Events Attended */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Events Attended</h3>
            <div className="space-y-2">
              {(profile.eventsAttended || []).map((event, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{event}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveEvent(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <div className="flex gap-2">
                  <select
                    value={newEvent}
                    onChange={e => setNewEvent(e.target.value)}
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an event...</option>
                    <option value="Community Health Fair 2024">Community Health Fair 2024</option>
                    <option value="Wellness Workshop Series">Wellness Workshop Series</option>
                    <option value="Healthcare Navigation Training">Healthcare Navigation Training</option>
                    <option value="Mental Health Awareness Day">Mental Health Awareness Day</option>
                    <option value="Diabetes Prevention Program">Diabetes Prevention Program</option>
                    <option value="Women's Health Symposium">Women's Health Symposium</option>
                    <option value="Senior Care Conference">Senior Care Conference</option>
                  </select>
                  <button
                    onClick={handleAddEvent}
                    className="p-2 text-blue-600 hover:text-blue-800"
                    disabled={!newEvent}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-20" /> {/* Extra space at bottom */}
      <BottomNav />
    </main>
  )
}
