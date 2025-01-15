import { geocodeAddress } from './geocoding';

export interface Resource {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  services: string[];
  category: string;
  latitude?: number;
  longitude?: number;
  contactPerson: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  generalContactName: string;
  generalContactPhone: string;
  lastContactDate: string;
  currentStatus: string;
  notes: string;
  resourceDescription: string;
  eligibility: string;
  howToApply: string;
}

// Helper function to format address for geocoding
function formatAddress(item: any): string {
  // Handle case where address might be a complete address string
  const addressParts = item.Address?.split(',') || [];
  let street = item.Address;
  let city = item.City;
  let zip = item.Zip;

  // If address contains city and zip, extract them
  if (addressParts.length > 1) {
    street = addressParts[0].trim();
    const cityStateZip = addressParts[1].trim().split(' ');
    if (cityStateZip.length > 0) {
      city = cityStateZip[0];
      zip = cityStateZip[cityStateZip.length - 1];
    }
  }

  const components = [
    street?.trim(),
    city?.trim(),
    'NC',  // State is always NC
    zip?.toString().trim()
  ];
  
  const formatted = components.filter(Boolean).join(', ');
  console.log('Formatted address:', formatted);
  return formatted;
}

// Helper function to delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to process resources in batches
async function processBatch(items: any[], batchSize: number = 10): Promise<Resource[]> {
  console.log('Processing batch of items:', items.length);
  const resources: Resource[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    console.log(`Processing batch ${i / batchSize + 1}`);
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(async (item) => {
      try {
        // Skip empty or incomplete records
        if (!item.Organization || !item.Address) {
          console.warn('Skipping incomplete record:', item.Organization);
          return null;
        }

        const formattedAddress = formatAddress(item);
        if (!formattedAddress) {
          console.warn(`Missing address information for resource: ${item.Organization}`);
          return null;
        }

        console.log(`Geocoding address for ${item.Organization}:`, formattedAddress);
        const location = await geocodeAddress(formattedAddress);
        console.log('Geocoding result:', location);

        if (location) {
          return {
            id: String(Math.random()),
            name: item.Organization,
            address: item.Address,
            city: item.City || '',
            state: 'NC',
            zip: item.Zip?.toString() || '',
            phone: item['Phone Number'] || '',
            website: item.Website || '',
            services: [item.ResourceType].filter(Boolean),
            category: item.ResourceType || 'General',
            latitude: location.lat,
            longitude: location.lng,
            contactPerson: item.ContactPerson || '',
            contactPersonPhone: item.ContactPersonPhone || '',
            contactPersonEmail: item.ContactPersonEmail || '',
            generalContactName: item.GeneralConactName_Department || '',
            generalContactPhone: item.GeneralConactPhone || '',
            lastContactDate: item.LastContactDate || '',
            currentStatus: item.CurrentStatus || '',
            notes: item.Notes || '',
            resourceDescription: item.ResourceDescription || '',
            eligibility: item['Eligibility_(What_do_I_need_to_have_to_Qualify_for_benefit?)'] || '',
            howToApply: item['Apply_(How_do_I Apply_to_get_the_benefit?)'] || ''
          };
        } else {
          console.warn(`Could not geocode address for resource: ${item.Organization} (${formattedAddress})`);
          return null;
        }
      } catch (error) {
        console.error(`Error processing resource ${item.Organization}:`, error);
        return null;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    const validResults = batchResults.filter((r): r is Resource => r !== null);
    console.log(`Batch ${i / batchSize + 1} results:`, validResults.length);
    resources.push(...validResults);
    
    // Delay between batches to respect rate limits
    if (i + batchSize < items.length) {
      console.log('Waiting between batches...');
      await delay(2000); // 2 second delay between batches
    }
  }

  console.log('Total resources processed:', resources.length);
  return resources;
}

export const loadResources = async (): Promise<Resource[]> => {
  try {
    console.log('Loading resource data...');
    const response = await fetch('/api/misc/WL4WJresourceSpreadsheet');
    if (!response.ok) {
      throw new Error('Failed to load resource data');
    }

    const data = await response.json();
    console.log('Loaded raw data:', data);
    return await processBatch(data);
  } catch (error) {
    console.error('Error loading resources:', error);
    return [];
  }
};
