const { Database } = require('arangojs');
const { faker } = require('@faker-js/faker');

// North Carolina boundaries (approximate)
const NC_BOUNDS = {
  lat: { min: 33.8363, max: 36.5881 },
  lng: { min: -84.3219, max: -75.4601 }
};

// Healthcare service types
const HEALTHCARE_SERVICES = [
  'Primary Care',
  'Emergency Care',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Mental Health',
  'Dental Care',
  'Physical Therapy',
  'Urgent Care',
  'Family Medicine',
  'Internal Medicine',
  'OB/GYN',
  'Neurology',
  'Dermatology',
  'Ophthalmology'
];

// Insurance providers
const INSURANCE_PROVIDERS = [
  'Blue Cross Blue Shield NC',
  'UnitedHealthcare',
  'Aetna',
  'Cigna',
  'Humana',
  'Medicare',
  'Medicaid',
  'Tricare',
  'WellCare'
];

// Connect to ArangoDB
const db = new Database({
  url: 'http://localhost:8529',
  databaseName: '_system',
  auth: { username: 'root', password: 'Yfhk9r76q@@12345' }
});

async function generateOrganization() {
  const randomLat = NC_BOUNDS.lat.min + (Math.random() * (NC_BOUNDS.lat.max - NC_BOUNDS.lat.min));
  const randomLng = NC_BOUNDS.lng.min + (Math.random() * (NC_BOUNDS.lng.max - NC_BOUNDS.lng.min));
  
  // Generate 1-3 random services
  const numServices = Math.floor(Math.random() * 3) + 1;
  const services = Array.from(new Set(Array(numServices).fill(0).map(() => 
    HEALTHCARE_SERVICES[Math.floor(Math.random() * HEALTHCARE_SERVICES.length)]
  )));

  // Generate 2-5 random insurance providers
  const numInsurance = Math.floor(Math.random() * 4) + 2;
  const insuranceAccepted = Array.from(new Set(Array(numInsurance).fill(0).map(() => 
    INSURANCE_PROVIDERS[Math.floor(Math.random() * INSURANCE_PROVIDERS.length)]
  )));

  return {
    'Organization Name': faker.company.name() + ' ' + services[0],
    'Contact Person': faker.person.fullName(),
    'Phone': faker.phone.number('(###) ###-####'),
    'Email': faker.internet.email().toLowerCase(),
    'Website': faker.internet.url(),
    'Address': {
      'Street': faker.location.streetAddress(),
      'City': faker.location.city(),
      'State': 'NC',
      'ZIP': faker.location.zipCode('#####')
    },
    'Services': services,
    'Insurance Accepted': insuranceAccepted,
    'Hours of Operation': {
      'Monday': '9:00 AM - 5:00 PM',
      'Tuesday': '9:00 AM - 5:00 PM',
      'Wednesday': '9:00 AM - 5:00 PM',
      'Thursday': '9:00 AM - 5:00 PM',
      'Friday': '9:00 AM - 5:00 PM',
      'Saturday': Math.random() > 0.5 ? '10:00 AM - 2:00 PM' : 'Closed',
      'Sunday': 'Closed'
    },
    'Accepting New Patients': Math.random() > 0.2,
    'Languages Spoken': ['English'].concat(Math.random() > 0.7 ? ['Spanish'] : []),
    'location': {
      'type': 'Point',
      'coordinates': [randomLat, randomLng]
    },
    'Created At': new Date().toISOString(),
    'Last Updated': new Date().toISOString()
  };
}

async function seedDatabase() {
  try {
    // Create or get the collection
    const collection = db.collection('WL4WJHealthCareReferrals');
    const exists = await collection.exists();
    
    if (!exists) {
      await collection.create();
      console.log('Collection created successfully');
      
      // Create geospatial index
      await collection.ensureIndex({
        type: 'geo',
        fields: ['location.coordinates'],
        name: 'geo_location'
      });
      console.log('Geospatial index created successfully');
    } else {
      console.log('Collection already exists');
    }

    // Generate and insert 100 organizations
    const organizations = await Promise.all(Array(100).fill(0).map(generateOrganization));
    
    // Insert in batches of 10
    const batchSize = 10;
    for (let i = 0; i < organizations.length; i += batchSize) {
      const batch = organizations.slice(i, i + batchSize);
      await collection.saveAll(batch);
      console.log(`Inserted organizations ${i + 1} to ${Math.min(i + batchSize, organizations.length)}`);
    }

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

// Run the seeding
seedDatabase();
