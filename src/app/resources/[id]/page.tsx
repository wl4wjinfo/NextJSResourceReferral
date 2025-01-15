'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Calendar, Share2 } from 'lucide-react';
import { Resource } from '@/types/resource';

export default function ResourceDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch('/api/resources');
        const resources = await response.json();
        const found = resources.find((r: Resource) => r.id === id);
        setResource(found || null);
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/map"
            className="inline-flex items-center text-healthcare-600 hover:text-healthcare-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Map
          </Link>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Resource Not Found</h1>
            <p className="text-gray-600">The resource you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Back Button */}
        <Link
          href="/map"
          className="inline-flex items-center text-healthcare-600 hover:text-healthcare-700 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Map
        </Link>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{resource.Organization}</h1>
            <p className="text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {resource.geocodedAddress || `${resource.Address}, ${resource.City}, ${resource.State} ${resource.Zip}`}
            </p>
            {resource.County && (
              <p className="text-gray-500 mt-1">{resource.County} County</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50">
            {(resource.ContactPersonPhone || resource.GeneralConactPhone) && (
              <a
                href={`tel:${resource.ContactPersonPhone || resource.GeneralConactPhone}`}
                className="flex items-center justify-center gap-2 bg-healthcare-600 text-white px-4 py-2 rounded-md hover:bg-healthcare-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            )}
            {resource.ContactPersonEmail && (
              <a
                href={`mailto:${resource.ContactPersonEmail}`}
                className="flex items-center justify-center gap-2 bg-healthcare-600 text-white px-4 py-2 rounded-md hover:bg-healthcare-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            )}
            {resource.Website && (
              <a
                href={resource.Website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-healthcare-600 text-white px-4 py-2 rounded-md hover:bg-healthcare-700 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>

          {/* Details Sections */}
          <div className="p-6 space-y-8">
            {/* Resource Description */}
            {resource.ResourceDescription && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700">{resource.ResourceDescription}</p>
              </section>
            )}

            {/* Contact Information */}
            {(resource.ContactPerson || resource.GeneralConactName_Department) && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  {resource.ContactPerson && (
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Contact Person:</span> {resource.ContactPerson}
                    </p>
                  )}
                  {resource.GeneralConactName_Department && (
                    <p className="text-gray-700">
                      <span className="font-medium">Department:</span> {resource.GeneralConactName_Department}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Eligibility */}
            {resource["Eligibility_(What_do_I_need_to_have_to_Qualify_for_benefit?)"] && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Eligibility</h2>
                <p className="text-gray-700">
                  {resource["Eligibility_(What_do_I_need_to_have_to_Qualify_for_benefit?)"]}
                </p>
              </section>
            )}

            {/* How to Apply */}
            {resource["Apply_(How_do_I Apply_to_get_the_benefit?)"] && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Apply</h2>
                <p className="text-gray-700">{resource["Apply_(How_do_I Apply_to_get_the_benefit?)"]}</p>
              </section>
            )}

            {/* Additional Notes */}
            {resource.Notes && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
                <p className="text-gray-700">{resource.Notes}</p>
              </section>
            )}

            {/* Status Information */}
            {(resource.CurrentStatus || resource.LastContactDate) && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Information</h2>
                <div className="flex items-center gap-4">
                  {resource.CurrentStatus && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        resource.CurrentStatus.toLowerCase() === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      Status: {resource.CurrentStatus}
                    </span>
                  )}
                  {resource.LastContactDate && (
                    <span className="text-gray-500 text-sm">
                      Last Updated: {resource.LastContactDate}
                    </span>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  // Add to calendar functionality
                  console.log('Add to calendar clicked');
                }}
                className="flex items-center gap-2 px-4 py-2 text-healthcare-600 hover:text-healthcare-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Add to Calendar
              </button>
              <button
                onClick={() => {
                  // Share functionality
                  console.log('Share clicked');
                }}
                className="flex items-center gap-2 px-4 py-2 text-healthcare-600 hover:text-healthcare-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
