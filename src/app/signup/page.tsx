'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import WomanLeadingImage from '@/assets/WOMAN LEADING.zip - 3.png';

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Signup successful, redirect to sign in
      router.push('/signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating your account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-[90vw] md:max-w-md flex flex-col items-center">
        {/* Woman Leading Image Container */}
        <div className="relative w-40 h-40 md:w-64 md:h-64 mb-6">
          <Image
            src={WomanLeadingImage}
            alt="Woman Leading"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text Content */}
        <h1 className="text-xl md:text-2xl font-bold text-center mb-3 md:mb-4">
          Create Your Account
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 text-center">
          Join Women Leading for Wellness and Justice to access community resources.
        </p>

        {/* Error Message */}
        {error && (
          <div className="w-full p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Create a password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg text-center font-semibold mb-4 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <Link
          href="/signin"
          className="w-full bg-white text-black py-3 md:py-4 rounded-lg text-center font-semibold border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}
