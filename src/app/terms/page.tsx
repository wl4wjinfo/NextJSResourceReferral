'use client'

import Link from 'next/link'
import BottomNav from '../components/BottomNav'

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="mb-4 text-gray-700">
            By accessing or using HealthcareReferrals ("Service"), you agree to be bound by these 
            Terms of Service ("Terms") and our Privacy Policy. If you disagree with any part of 
            these Terms, you may not use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4 text-gray-700">
            HealthcareReferrals is a healthcare referral management platform that provides:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Healthcare referral coordination and tracking</li>
            <li>Calendar integration and appointment management</li>
            <li>Communication tools for healthcare providers</li>
            <li>Patient information management</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <div className="space-y-4 text-gray-700">
            <p>When creating an account, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any changes to your information</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
          <p className="mb-4 text-gray-700">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Use the Service for any illegal purpose</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Interfere with the Service's security features</li>
            <li>Share sensitive medical information outside secure channels</li>
            <li>Impersonate others or provide false information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
          <p className="mb-4 text-gray-700">
            Your use of HealthcareReferrals is also governed by our{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            . By using our Service, you agree to the collection and use of information 
            as detailed in our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="mb-4 text-gray-700">
            The Service and its original content, features, and functionality are owned 
            by HealthcareReferrals and are protected by international copyright, trademark, 
            patent, trade secret, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
          <p className="mb-4 text-gray-700">
            We may terminate or suspend your account and access to the Service immediately, 
            without prior notice, for conduct that we believe violates these Terms or is 
            harmful to other users of the Service, us, or third parties, or for any other 
            reason.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4 text-gray-700">
            HealthcareReferrals shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages, or any loss of profits or revenues, whether 
            incurred directly or indirectly, or any loss of data, use, goodwill, or other 
            intangible losses.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p className="text-gray-700">
            For any questions about these Terms, please contact us at:
            <br />
            Email: <a href="mailto:wl4wjinfo@gmail.com" className="text-blue-600 hover:underline">wl4wjinfo@gmail.com</a>
          </p>
        </section>

        <footer className="text-sm text-gray-500 mt-12 pt-8 border-t">
          <p>Last updated: January 2025</p>
          <p className="mt-2">
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </footer>
      </div>
      <BottomNav />
    </main>
  )
}
