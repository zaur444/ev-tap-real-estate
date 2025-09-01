import React, { useState, useEffect } from 'react';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { getProperties, subscribeToProperties, trackPropertyView } from './firebase/database';
import AuthModal from './components/AuthModal';
import FirebaseStatus from './components/FirebaseStatus';

// Enhanced property data with more details
const MOCK_PROPERTIES = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
  },
  {
    id: 4,
    title: "2-Room Apartment for Rent in Nasimi",
    price: 800,
    type: "rent",
    propertyType: "apartment",
    location: { 
      district: "Nasimi", 
      address: "28 May St 12", 
      coordinates: { lat: 40.4093, lng: 49.8671 },
      metroDistance: 0.2
    },
    nearMetro: true,
    isNewBuild: false,
    isVerified: false,
    rooms: 2,
    area: 60,
    floor: 5,
    totalFloors: 9,
    yearBuilt: 2015,
    imageUrls: [
      "https://placehold.co/600x400/f59e0b/ffffff?text=Compact+Living",
      "https://placehold.co/600x400/3b82f6/ffffff?text=Modern+Kitchen",
      "https://placehold.co/600x400/10b981/ffffff?text=City+View"
    ],
    description: "Bright and comfortable 2-room apartment for rent, just steps away from 28 May metro and shopping malls. Excellent for students or young professionals.",
    features: ["Balcony", "City View", "Near Metro", "Shopping Nearby"],
    agent: {
      name: "Elvin Mammadov",
      phone: "+994 50 111 22 33",
      email: "elvin@evtap.az",
      avatar: "https://placehold.co/100x100/f59e0b/ffffff?text=EM"
    },
    priceHistory: [
      { date: "2024-01-01", price: 750 },
      { date: "2024-05-01", price: 800 }
    ],
    views: 567,
    listedDate: "2024-01-20"
  },
  {
    id: 5,
    title: "Commercial Space in Narimanov",
    price: 3500,
    type: "rent",
    propertyType: "commercial",
    location: { 
      district: "Narimanov", 
      address: "Tebriz St 89", 
      coordinates: { lat: 40.4093, lng: 49.8671 },
      metroDistance: 0.4
    },
    nearMetro: true,
    isNewBuild: false,
    isVerified: true,
    rooms: 5,
    area: 200,
    floor: 1,
    totalFloors: 3,
    yearBuilt: 2020,
    imageUrls: [
      "https://placehold.co/600x400/ef4444/ffffff?text=Office+Space",
      "https://placehold.co/600x400/3b82f6/ffffff?text=Reception",
      "https://placehold.co/600x400/10b981/ffffff?text=Meeting+Room"
    ],
    description: "Large commercial property on a busy street in Narimanov, perfect for an office, clinic, or retail store. Close to Ganjlik metro.",
    features: ["High Traffic", "Parking", "Air Conditioning", "Security", "Elevator"],
    agent: {
      name: "Aysel Karimova",
      phone: "+994 50 444 55 66",
      email: "aysel@evtap.az",
      avatar: "https://placehold.co/100x100/ef4444/ffffff?text=AK"
    },
    priceHistory: [
      { date: "2023-11-01", price: 3200 },
      { date: "2024-04-01", price: 3500 }
    ],
    views: 445,
    listedDate: "2023-11-15"
  },
  {
    id: 6,
    title: "Old City Gem in Sabayil",
    price: 350000,
    type: "buy",
    propertyType: "apartment",
    location: { 
      district: "Sabayil", 
      address: "Icherisheher 15", 
      coordinates: { lat: 40.3661, lng: 49.8352 },
      metroDistance: 0.8
    },
    nearMetro: true,
    isNewBuild: false,
    isVerified: true,
    rooms: 3,
    area: 80,
    floor: 2,
    totalFloors: 3,
    yearBuilt: 1890,
    imageUrls: [
      "https://placehold.co/600x400/6b7280/ffffff?text=Historic+Building",
      "https://placehold.co/600x400/3b82f6/ffffff?text=Traditional+Interior",
      "https://placehold.co/600x400/10b981/ffffff?text=Old+City+View"
    ],
    description: "Unique apartment with historical charm located within the ancient walls of Icherisheher. A rare opportunity to own a piece of Baku's history.",
    features: ["Historic", "Unique", "Tourist Area", "Cultural Heritage"],
    agent: {
      name: "Kamran Rahimov",
      phone: "+994 50 777 88 99",
      email: "kamran@evtap.az",
      avatar: "https://placehold.co/100x100/6b7280/ffffff?text=KR"
    },
    priceHistory: [
      { date: "2023-10-01", price: 320000 },
      { date: "2024-03-01", price: 350000 }
    ],
    views: 1890,
    listedDate: "2023-10-01"
  }
];

// Mortgage Calculator Component
function MortgageCalculator({ propertyPrice }) {
  const [downPayment, setDownPayment] = useState(20);
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const loanAmount = propertyPrice * (100 - downPayment) / 100;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const totalInterest = (monthlyPayment * numPayments) - loanAmount;
  const totalCost = loanAmount + totalInterest;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (%)</label>
          <input
            type="range"
            min="5"
            max="50"
            value={downPayment}
            onChange={(e) => setDownPayment(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600 mt-1">{downPayment}%</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="10">10 years</option>
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="25">25 years</option>
            <option value="30">30 years</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
        <input
          type="range"
          min="5"
          max="15"
          step="0.1"
          value={interestRate}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-center text-sm text-gray-600 mt-1">{interestRate}%</div>
      </div>

      <div className="bg-white rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Down Payment:</span>
          <span className="font-semibold">{(propertyPrice * downPayment / 100).toLocaleString()} AZN</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Loan Amount:</span>
          <span className="font-semibold">{loanAmount.toLocaleString()} AZN</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-blue-600">
          <span>Monthly Payment:</span>
          <span>{monthlyPayment.toLocaleString()} AZN</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Interest:</span>
          <span className="font-semibold">{totalInterest.toLocaleString()} AZN</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-600">Total Cost:</span>
          <span className="font-semibold">{totalCost.toLocaleString()} AZN</span>
        </div>
      </div>
    </div>
  );
}

// Property Valuation Component
function PropertyValuation({ property }) {
  const [marketTrend, setMarketTrend] = useState('stable');
  
  // Simple valuation algorithm based on property characteristics
  const calculateValuation = () => {
    let basePrice = property.price;
    let valuation = basePrice;
    
    // Adjust based on property type
    const typeMultipliers = {
      'apartment': 1.0,
      'house': 1.1,
      'villa': 1.3,
      'commercial': 0.9
    };
    
    // Adjust based on year built
    const currentYear = new Date().getFullYear();
    const age = currentYear - property.yearBuilt;
    const ageMultiplier = age < 5 ? 1.1 : age < 10 ? 1.0 : age < 20 ? 0.95 : 0.9;
    
    // Adjust based on location (metro proximity)
    const locationMultiplier = property.nearMetro ? 1.05 : 0.98;
    
    // Adjust based on area
    const areaMultiplier = property.area > 100 ? 1.05 : property.area > 50 ? 1.0 : 0.95;
    
    // Adjust based on market trend
    const trendMultipliers = {
      'rising': 1.08,
      'stable': 1.0,
      'declining': 0.92
    };
    
    valuation = basePrice * typeMultipliers[property.propertyType] * ageMultiplier * 
                locationMultiplier * areaMultiplier * trendMultipliers[marketTrend];
    
    return Math.round(valuation);
  };
  
  const estimatedValue = calculateValuation();
  const priceDifference = estimatedValue - property.price;
  const priceDifferencePercent = ((priceDifference / property.price) * 100).toFixed(1);
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Market Trend</label>
        <select
          value={marketTrend}
          onChange={(e) => setMarketTrend(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="rising">Rising Market</option>
          <option value="stable">Stable Market</option>
          <option value="declining">Declining Market</option>
        </select>
      </div>
      
      <div className="bg-white rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Price:</span>
          <span className="font-semibold">{property.price.toLocaleString()} AZN</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Estimated Value:</span>
          <span className="font-bold text-lg text-green-600">{estimatedValue.toLocaleString()} AZN</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Difference:</span>
          <span className={`font-semibold ${priceDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceDifference >= 0 ? '+' : ''}{priceDifference.toLocaleString()} AZN ({priceDifferencePercent}%)
          </span>
        </div>
        
        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500">
            <p className="mb-1">Valuation factors:</p>
            <ul className="space-y-1">
              <li>• Property type: {property.propertyType}</li>
              <li>• Age: {new Date().getFullYear() - property.yearBuilt} years</li>
              <li>• Area: {property.area} m²</li>
              <li>• Metro proximity: {property.nearMetro ? 'Yes' : 'No'}</li>
              <li>• Market trend: {marketTrend}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component with Firebase integration
function AppContent() {
  const { user, userProfile, loading } = useFirebase();
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [useFirebaseData, setUseFirebaseData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'buy',
    district: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minRooms: '',
    isNewBuild: false,
    nearMetro: false,
    isVerified: false,
  });
  const [favorites, setFavorites] = useState(new Set());
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [comparisonList, setComparisonList] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  // Load properties from Firebase when enabled
  useEffect(() => {
    if (useFirebaseData) {
      const unsubscribe = subscribeToProperties((firebaseProperties) => {
        if (firebaseProperties.length > 0) {
          setProperties(firebaseProperties);
        }
      }, filters);

      return () => unsubscribe();
    }
  }, [useFirebaseData, filters]);

  // Track property views when user opens property modal
  useEffect(() => {
    if (selectedProperty && user) {
      trackPropertyView(selectedProperty.id, user.uid);
    }
  }, [selectedProperty, user]);

  // Filter and search logic
  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchQuery === '' || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = 
      property.type === filters.type &&
      (filters.district === '' || property.location.district === filters.district) &&
      (filters.propertyType === '' || property.propertyType === filters.propertyType) &&
      (filters.minPrice === '' || property.price >= parseInt(filters.minPrice)) &&
      (filters.maxPrice === '' || property.price <= parseInt(filters.maxPrice)) &&
      (filters.minRooms === '' || property.rooms >= parseInt(filters.minRooms)) &&
      (!filters.isNewBuild || property.isNewBuild) &&
      (!filters.nearMetro || property.nearMetro) &&
      (!filters.isVerified || property.isVerified);

    return matchesSearch && matchesFilters;
  });

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const openPropertyModal = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
    
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== property.id);
      return [property, ...filtered].slice(0, 10);
    });
  };

  const closePropertyModal = () => {
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  const toggleComparison = (property) => {
    setComparisonList(prev => {
      const isInList = prev.some(p => p.id === property.id);
      if (isInList) {
        return prev.filter(p => p.id !== property.id);
      } else if (prev.length < 3) {
        return [...prev, property];
      }
      return prev;
    });
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleLogin = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      const { signOutUser } = await import('./firebase/auth');
      await signOutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} min-h-screen font-sans transition-colors duration-300`} style={{WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)'}}>
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-lg border-b p-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-sm ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'}`} style={{WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)'}}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Ev Tap</h1>
            <p className="text-xs text-gray-500 -mt-1">Find Your Dream Property</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'}`}
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
              </svg>
            )}
          </button>

          {/* Comparison Button */}
          {comparisonList.length > 0 && (
            <button 
              onClick={() => setShowComparisonModal(true)}
              className={`p-2 rounded-lg transition-colors relative ${darkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-blue-50'}`}
              title="Compare Properties"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {comparisonList.length}
              </span>
            </button>
          )}

          {/* Favorites Button */}
          <button 
            onClick={() => setShowFavoritesModal(true)}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-gray-800' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'}`}
            title="Favorites"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center space-x-2">
              <img 
                src={user.photoURL || userProfile?.avatar || "https://placehold.co/100x100/3b82f6/ffffff?text=U"} 
                alt={user.displayName || userProfile?.displayName || "User"}
                className="w-8 h-8 rounded-full"
              />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                {user.displayName || userProfile?.displayName || "User"}
              </span>
              <button 
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleLogin}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={handleSignup}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-1/4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Transaction Type</label>
              <div className="flex rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setFilters(f => ({ ...f, type: 'buy' }))}
                  className={`px-4 py-3 w-1/2 text-sm font-medium transition-all duration-200 ${
                    filters.type === 'buy' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setFilters(f => ({ ...f, type: 'rent' }))}
                  className={`px-4 py-3 w-1/2 text-sm font-medium transition-all duration-200 ${
                    filters.type === 'rent' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                <select 
                  name="district" 
                  value={filters.district} 
                  onChange={(e) => setFilters(f => ({ ...f, district: e.target.value }))} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">All Districts</option>
                  <option value="Yasamal">Yasamal</option>
                  <option value="Khatai">Khatai</option>
                  <option value="Sabayil">Sabayil</option>
                  <option value="Nasimi">Nasimi</option>
                  <option value="Narimanov">Narimanov</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select 
                  name="propertyType" 
                  value={filters.propertyType} 
                  onChange={(e) => setFilters(f => ({ ...f, propertyType: e.target.value }))} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (AZN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm"
                  />
                </div>
              </div>

              {/* Rooms */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rooms</label>
                <select 
                  value={filters.minRooms} 
                  onChange={(e) => setFilters(f => ({ ...f, minRooms: e.target.value }))} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Advanced Filters */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Advanced Filters</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isNewBuild}
                      onChange={(e) => setFilters(f => ({ ...f, isNewBuild: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">New Build Only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.nearMetro}
                      onChange={(e) => setFilters(f => ({ ...f, nearMetro: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">Near Metro</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isVerified}
                      onChange={(e) => setFilters(f => ({ ...f, isVerified: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified Only</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <button 
                onClick={() => setFilters({ 
                  type: 'buy', 
                  district: '', 
                  propertyType: '', 
                  minPrice: '', 
                  maxPrice: '', 
                  minRooms: '', 
                  isNewBuild: false, 
                  nearMetro: false, 
                  isVerified: false 
                })}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search properties by title, district, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-gray-700 placeholder-gray-400"
              />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 font-medium">
                Showing <span className="text-blue-600 font-semibold">{filteredProperties.length}</span> of <span className="text-gray-800 font-semibold">{properties.length}</span> results
              </p>
            </div>
            
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                  {filteredProperties.map((property, index) => (
                    <div key={property.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100 group hover-lift stagger-item" style={{WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)', willChange: 'transform', animationDelay: `${index * 0.1}s`}}>
                      <div 
                        className="relative overflow-hidden" 
                        onClick={() => openPropertyModal(property)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openPropertyModal(property);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View details for ${property.title}`}
                      >
                        <img 
                          src={property.imageUrls[0]} 
                          alt={property.title} 
                          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" 
                          style={{WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)', willChange: 'transform'}}
                          loading="lazy"
                          decoding="async"
                        />
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(property.id);
                          }} 
                          className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-white hover:scale-110 transition-all duration-200 shadow-md focus-smooth"
                          aria-label={favorites.has(property.id) ? "Remove from favorites" : "Add to favorites"}
                          tabIndex={0}
                        >
                          <svg className="w-5 h-5" fill={favorites.has(property.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComparison(property);
                          }} 
                          className={`absolute top-3 right-12 p-2.5 bg-white/90 backdrop-blur-sm rounded-full transition-all duration-200 shadow-md focus-smooth ${
                            comparisonList.some(p => p.id === property.id) 
                              ? 'text-blue-600 hover:bg-blue-50' 
                              : 'text-gray-600 hover:bg-white hover:scale-110'
                          }`}
                          disabled={comparisonList.length >= 3 && !comparisonList.some(p => p.id === property.id)}
                          aria-label={comparisonList.some(p => p.id === property.id) ? "Remove from comparison" : "Add to comparison"}
                          tabIndex={0}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </button>
                      
                      {property.isVerified && (
                        <span className="absolute bottom-3 left-3 flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Verified
                        </span>
                      )}
                      
                      {property.isNewBuild && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                          New Build
                        </span>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                          {property.price.toLocaleString()} AZN 
                          {property.type === 'rent' && <span className="text-sm text-gray-500 font-normal">/ month</span>}
                        </p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium capitalize">
                          {property.propertyType}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{property.location.district}, Baku</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-600 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                            </svg>
                            <span className="font-medium">{property.rooms} rooms</span>
                          </span>
                          <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            <span className="font-medium">{property.area} m²</span>
                          </span>
                        </div>
                        {property.nearMetro && (
                          <span className="flex items-center text-purple-600 bg-purple-50 px-2 py-1 rounded-lg text-xs font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Metro
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
                <button 
                  onClick={() => {
                    setFilters({ type: 'buy', district: '', propertyType: '' });
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map(property => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer transition-all duration-200 border border-gray-100"
                  onClick={() => openPropertyModal(property)}
                >
                  <img 
                    src={property.imageUrls[0]} 
                    alt={property.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{property.title}</h3>
                    <p className="text-blue-600 font-bold text-sm">
                      {property.price.toLocaleString()} AZN
                      {property.type === 'rent' && <span className="text-xs text-gray-500 font-normal">/ month</span>}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{property.location.district}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Property Details Modal */}
      {showPropertyModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProperty.title}</h2>
              <button 
                onClick={closePropertyModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Image Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <img 
                    src={selectedProperty.imageUrls[0]} 
                    alt={selectedProperty.title}
                    className="w-full h-64 md:h-80 object-cover rounded-xl"
                  />
                </div>
                {selectedProperty.imageUrls.slice(1, 5).map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${selectedProperty.title} ${index + 2}`}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-gray-800 mb-2">
                        {selectedProperty.price.toLocaleString()} AZN 
                        {selectedProperty.type === 'rent' && <span className="text-lg text-gray-500 font-normal">/ month</span>}
                      </p>
                      <p className="text-gray-600">{selectedProperty.location.address}, {selectedProperty.location.district}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleFavorite(selectedProperty.id)}
                        className={`p-3 rounded-xl transition-colors ${
                          favorites.has(selectedProperty.id) 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                        }`}
                      >
                        <svg className="w-6 h-6" fill={favorites.has(selectedProperty.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => toggleComparison(selectedProperty)}
                        className={`p-3 rounded-xl transition-colors ${
                          comparisonList.some(p => p.id === selectedProperty.id)
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">{selectedProperty.rooms}</div>
                      <div className="text-sm text-gray-600">Rooms</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">{selectedProperty.area}</div>
                      <div className="text-sm text-gray-600">m²</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">{selectedProperty.floor}</div>
                      <div className="text-sm text-gray-600">Floor</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">{selectedProperty.yearBuilt}</div>
                      <div className="text-sm text-gray-600">Year Built</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.features.map((feature, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price History */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Price History</h3>
                    <div className="space-y-2">
                      {selectedProperty.priceHistory.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-gray-600">{new Date(entry.date).toLocaleDateString()}</span>
                          <span className="font-semibold text-gray-800">{entry.price.toLocaleString()} AZN</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Agent Contact */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Agent</h3>
                    <div className="flex items-center space-x-3 mb-4">
                      <img 
                        src={selectedProperty.agent.avatar} 
                        alt={selectedProperty.agent.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{selectedProperty.agent.name}</div>
                        <div className="text-sm text-gray-600">Real Estate Agent</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <a 
                        href={`tel:${selectedProperty.agent.phone}`}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{selectedProperty.agent.phone}</span>
                      </a>
                      <a 
                        href={`mailto:${selectedProperty.agent.email}`}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{selectedProperty.agent.email}</span>
                      </a>
                    </div>
                  </div>

                  {/* Mortgage Calculator */}
                  {selectedProperty.type === 'buy' && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Mortgage Calculator</h3>
                      <MortgageCalculator propertyPrice={selectedProperty.price} />
                    </div>
                  )}

                  {/* Property Valuation */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Valuation</h3>
                    <PropertyValuation property={selectedProperty} />
                  </div>

                  {/* Property Stats */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views</span>
                        <span className="font-semibold">{selectedProperty.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listed</span>
                        <span className="font-semibold">{new Date(selectedProperty.listedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metro Distance</span>
                        <span className="font-semibold">{selectedProperty.location.metroDistance} km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Compare Properties</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={clearComparison}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setShowComparisonModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {comparisonList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comparisonList.map(property => (
                    <div key={property.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <img 
                        src={property.imageUrls[0]} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">{property.title}</h3>
                        <p className="text-xl font-bold text-blue-600 mb-3">
                          {property.price.toLocaleString()} AZN
                          {property.type === 'rent' && <span className="text-sm text-gray-500 font-normal">/ month</span>}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rooms</span>
                            <span className="font-medium">{property.rooms}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Area</span>
                            <span className="font-medium">{property.area} m²</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Floor</span>
                            <span className="font-medium">{property.floor}/{property.totalFloors}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Year Built</span>
                            <span className="font-medium">{property.yearBuilt}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleComparison(property)}
                          className="w-full mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No properties selected for comparison</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavoritesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Favorite Properties</h2>
              <button 
                onClick={() => setShowFavoritesModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {favorites.size > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from(favorites).map(propertyId => {
                    const property = properties.find(p => p.id === propertyId);
                    return property ? (
                      <div key={property.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <img 
                          src={property.imageUrls[0]} 
                          alt={property.title}
                          className="w-full h-48 object-cover cursor-pointer"
                          onClick={() => openPropertyModal(property)}
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2">{property.title}</h3>
                          <p className="text-xl font-bold text-blue-600 mb-3">
                            {property.price.toLocaleString()} AZN
                            {property.type === 'rent' && <span className="text-sm text-gray-500 font-normal">/ month</span>}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{property.location.district}</span>
                            <button 
                              onClick={() => toggleFavorite(property.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-gray-500">No favorite properties yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />

      {/* Firebase Status Indicator */}
      <FirebaseStatus />
    </div>
  );
}

// Main App Component with Firebase Provider
function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}

export default App;