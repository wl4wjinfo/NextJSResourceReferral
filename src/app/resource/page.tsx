'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ResourceFormData {
  Organization: string;
  Address: string;
  City: string;
  'State ': string;
  Zip: string;
  County: string;
  ResourceType: string;
  Department: string;
  ContactPerson: string;
  ContactPersonPhone: string;
  ContactPersonEmail: string;
  GeneralConactName_Department: string;
  GeneralConactPhone: string;
  Website: string;
  ResourceDescription: string;
  Eligibility_: string;
  Apply_: string;
}

const initialFormData: ResourceFormData = {
  Organization: '',
  Address: '',
  City: '',
  'State ': '',
  Zip: '',
  County: '',
  ResourceType: '',
  Department: '',
  ContactPerson: '',
  ContactPersonPhone: '',
  ContactPersonEmail: '',
  GeneralConactName_Department: '',
  GeneralConactPhone: '',
  Website: '',
  ResourceDescription: '',
  Eligibility_: '',
  Apply_: '',
};

export default function ResourcePage() {
  const [formData, setFormData] = useState<ResourceFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save resource');
      }

      setSuccess(true);
      setFormData(initialFormData);
      setShowPreview(false);
      
      // Redirect to map after short delay
      setTimeout(() => {
        router.push('/map');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Add New Resource</h1>
            <button
              type="button"
              onClick={handlePreview}
              className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Preview JSON
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              Resource saved successfully! Redirecting to map...
            </div>
          )}

          {showPreview && (
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">JSON Preview</h3>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Continue Editing
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Append to JSON File'}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={e => { e.preventDefault(); handlePreview(); }} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organization Name*
                </label>
                <input
                  type="text"
                  name="Organization"
                  required
                  value={formData.Organization}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address*
                </label>
                <input
                  type="text"
                  name="Address"
                  required
                  value={formData.Address}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City*
                </label>
                <input
                  type="text"
                  name="City"
                  required
                  value={formData.City}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State*
                </label>
                <input
                  type="text"
                  name="State "
                  required
                  value={formData['State ']}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code*
                </label>
                <input
                  type="text"
                  name="Zip"
                  required
                  value={formData.Zip}
                  onChange={handleChange}
                  pattern="[0-9]{5}"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  County
                </label>
                <input
                  type="text"
                  name="County"
                  value={formData.County}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Resource Type*
                </label>
                <input
                  type="text"
                  name="ResourceType"
                  required
                  value={formData.ResourceType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="ContactPerson"
                  value={formData.ContactPerson}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="ContactPersonPhone"
                  value={formData.ContactPersonPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="ContactPersonEmail"
                  value={formData.ContactPersonEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  name="Website"
                  value={formData.Website}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resource Description*
              </label>
              <textarea
                name="ResourceDescription"
                required
                value={formData.ResourceDescription}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Eligibility Requirements
              </label>
              <textarea
                name="Eligibility_"
                value={formData.Eligibility_}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                How to Apply
              </label>
              <textarea
                name="Apply_"
                value={formData.Apply_}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-healthcare-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Preview & Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
