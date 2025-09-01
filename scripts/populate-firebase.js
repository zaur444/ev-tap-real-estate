#!/usr/bin/env node

// Script to populate Firebase Firestore with sample property data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_4lqGsD6AhSOXbNRWWJeRsIGizW-gzY8",
  authDomain: "ev-tap-real-estate.firebaseapp.com",
  projectId: "ev-tap-real-estate",
  storageBucket: "ev-tap-real-estate.firebasestorage.app",
  messagingSenderId: "311282498758",
  appId: "1:311282498758:web:2fffd9232e346aed062bc7",
  measurementId: "G-L59TENB6WG"
};

// Sample property data from MOCK_PROPERTIES
const sampleProperties = [
  {
    title: "Modern Apartment in Yasamal",
    price: 250000,
    type: "buy",
    propertyType: "apartment",
    location: { 
      district: "Yasamal", 
      address: "H. Cavid Ave 45", 
      coordinates: { lat: 40.4093, lng: 49.8671 },
      metroDistance: 0.3
    },
    nearMetro: true,
    isNewBuild: true,
    isVerified: true,
    rooms: 3,
    area: 95,
    floor: 8,
    totalFloors: 12,
    yearBuilt: 2023,
    imageUrls: [
      "https://placehold.co/600x400/3b82f6/ffffff?text=Living+Room",
      "https://placehold.co/600x400/10b981/ffffff?text=Kitchen",
      "https://placehold.co/600x400/8b5cf6/ffffff?text=Bedroom",
      "https://placehold.co/600x400/f59e0b/ffffff?text=Bathroom"
    ],
    description: "A beautiful, newly built 3-room apartment in the heart of Yasamal, close to Elmler Akademiyasi metro. Perfect for a modern family.",
    features: ["Balcony", "Parking", "Elevator", "Security", "Gym", "Pool"],
    agent: {
      name: "Leyla Mammadova",
      phone: "+994 50 123 45 67",
      email: "leyla@evtap.az",
      avatar: "https://placehold.co/100x100/3b82f6/ffffff?text=LM"
    },
    priceHistory: [
      { date: "2024-01-01", price: 240000 },
      { date: "2024-06-01", price: 250000 }
    ],
    views: 1247,
    listedDate: "2024-01-15"
  },
  {
    title: "Cozy House in Khatai for Rent",
    price: 1200,
    type: "rent",
    propertyType: "house",
    location: { 
      district: "Khatai", 
      address: "M. Hadi St 23", 
      coordinates: { lat: 40.3733, lng: 49.8603 },
      metroDistance: 0.5
    },
    nearMetro: true,
    isNewBuild: false,
    isVerified: true,
    rooms: 4,
    area: 150,
    floor: 1,
    totalFloors: 2,
    yearBuilt: 2018,
    imageUrls: [
      "https://placehold.co/600x400/10b981/ffffff?text=House+Exterior",
      "https://placehold.co/600x400/3b82f6/ffffff?text=Garden",
      "https://placehold.co/600x400/8b5cf6/ffffff?text=Living+Room",
      "https://placehold.co/600x400/f59e0b/ffffff?text=Kitchen"
    ],
    description: "Spacious 4-room house for rent near Hazi Aslanov metro. Comes fully furnished with a small garden. Ideal for a large family.",
    features: ["Garden", "Parking", "Furnished", "Balcony", "Storage"],
    agent: {
      name: "Rashad Aliyev",
      phone: "+994 50 987 65 43",
      email: "rashad@evtap.az",
      avatar: "https://placehold.co/100x100/10b981/ffffff?text=RA"
    },
    priceHistory: [
      { date: "2023-12-01", price: 1100 },
      { date: "2024-03-01", price: 1200 }
    ],
    views: 892,
    listedDate: "2023-12-10"
  },
  {
    title: "Luxury Villa in Sabayil",
    price: 850000,
    type: "buy",
    propertyType: "villa",
    location: { 
      district: "Sabayil", 
      address: "Badamdar Highway 78", 
      coordinates: { lat: 40.3589, lng: 49.8322 },
      metroDistance: 1.2
    },
    nearMetro: false,
    isNewBuild: true,
    isVerified: true,
    rooms: 6,
    area: 400,
    floor: 1,
    totalFloors: 3,
    yearBuilt: 2024,
    imageUrls: [
      "https://placehold.co/600x400/8b5cf6/ffffff?text=Villa+Exterior",
      "https://placehold.co/600x400/3b82f6/ffffff?text=Pool+Area",
      "https://placehold.co/600x400/10b981/ffffff?text=Master+Bedroom",
      "https://placehold.co/600x400/f59e0b/ffffff?text=Sea+View"
    ],
    description: "Exclusive villa with stunning sea views in the prestigious Badamdar area. Features a private pool, modern design, and high-end finishes.",
    features: ["Private Pool", "Sea View", "Garden", "Parking", "Security", "Smart Home", "Gym", "Wine Cellar"],
    agent: {
      name: "Nigar Hasanova",
      phone: "+994 50 555 77 99",
      email: "nigar@evtap.az",
      avatar: "https://placehold.co/100x100/8b5cf6/ffffff?text=NH"
    },
    priceHistory: [
      { date: "2024-02-01", price: 800000 },
      { date: "2024-08-01", price: 850000 }
    ],
    views: 2156,
    listedDate: "2024-02-01"
  }
];

async function populateFirebase() {
  try {
    console.log('🔥 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'evtapapp');
    
    console.log('📝 Adding sample properties to Firestore...');
    
    for (const property of sampleProperties) {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...property,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Added property: ${property.title} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 Successfully populated Firebase with sample data!');
    console.log('📊 Added', sampleProperties.length, 'properties to your "evtapapp" database');
    
  } catch (error) {
    console.error('❌ Error populating Firebase:', error);
  }
}

// Run the script
populateFirebase();
