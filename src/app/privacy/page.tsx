'use client'

import Link from 'next/link'
import BottomNav from '../components/BottomNav'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4 text-gray-700">
            HealthcareReferrals ("we", "our", or "us") respects your privacy and is committed to 
            protecting your personal data. This privacy policy will inform you about how we look 
            after your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
          <div className="space-y-4 text-gray-700">
            <p>We collect and process the following types of personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Basic profile information (name, email)</li>
              <li>Calendar information through Google Calendar integration</li>
              <li>Healthcare referral data and appointment information</li>
              <li>Usage data and analytics</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
          <div className="space-y-4 text-gray-700">
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To manage your calendar and appointments</li>
              <li>To coordinate healthcare referrals</li>
              <li>To improve and personalize our service</li>
              <li>To communicate with you about service updates</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-4 text-gray-700">
            We implement appropriate technical and organizational security measures to protect 
            your personal data against unauthorized access, alteration, disclosure, or destruction. 
            These measures include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Strict access controls and authentication</li>
            <li>Regular backup procedures</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="mb-4 text-gray-700">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
            <li>Request data portability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <p className="text-gray-700">
            For any questions about this Privacy Policy, please contact us at:
            <br />
            Email: <a href="mailto:wl4wjinfo@gmail.com" className="text-blue-600 hover:underline">wl4wjinfo@gmail.com</a>
          </p>
        </section>

        <footer className="text-sm text-gray-500 mt-12 pt-8 border-t">
          <p>Last updated: January 2025</p>
          <p className="mt-2">
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
          </p>
        </footer>
      </div>
      <BottomNav />
    </main>
  )
}
