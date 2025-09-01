import React, { useState } from 'react';

// Sample property data
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Modern Apartment in Yasamal",
    price: 250000,
    type: "buy",
    propertyType: "apartment",
    location: { district: "Yasamal", address: "H. Cavid Ave" },
    nearMetro: true,
    isNewBuild: true,
    isVerified: true,
    rooms: 3,
    area: 95,
    imageUrl: "https://placehold.co/600x400/3b82f6/ffffff?text=Modern+Apartment",
    description: "A beautiful, newly built 3-room apartment in the heart of Yasamal, close to Elmler Akademiyasi metro. Perfect for a modern family.",
  },
  {
    id: 2,
    title: "Cozy House in Khatai for Rent",
    price: 1200,
    type: "rent",
    propertyType: "house",
    location: { district: "Khatai", address: "M. Hadi St" },
    nearMetro: true,
    isNewBuild: false,
    isVerified: true,
    rooms: 4,
    area: 150,
    imageUrl: "https://placehold.co/600x400/10b981/ffffff?text=Cozy+House",
    description: "Spacious 4-room house for rent near Hazi Aslanov metro. Comes fully furnished with a small garden. Ideal for a large family.",
  },
  {
    id: 3,
    title: "Luxury Villa in Sabayil",
    price: 850000,
    type: "buy",
    propertyType: "villa",
    location: { district: "Sabayil", address: "Badamdar Highway" },
    nearMetro: false,
    isNewBuild: true,
    isVerified: true,
    rooms: 6,
    area: 400,
    imageUrl: "https://placehold.co/600x400/8b5cf6/ffffff?text=Luxury+Villa",
    description: "Exclusive villa with stunning sea views in the prestigious Badamdar area. Features a private pool, modern design, and high-end finishes.",
  }
];

function App() {
  const [properties] = useState(MOCK_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'buy',
    district: '',
    propertyType: '',
  });
  const [favorites, setFavorites] = useState(new Set());

  // Filter and search logic
  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchQuery === '' || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = 
      property.type === filters.type &&
      (filters.district === '' || property.location.district === filters.district) &&
      (filters.propertyType === '' || property.propertyType === filters.propertyType);

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

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen font-sans" style={{WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)'}}>
      <header className="bg-white shadow-lg border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-sm bg-white/95" style={{WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)'}}>
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
        <div>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
            Login
          </button>
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
                {filteredProperties.map(property => (
                  <div key={property.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100 group" style={{WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)', willChange: 'transform'}}>
                    <div className="relative overflow-hidden">
                      <img 
                        src={property.imageUrl} 
                        alt={property.title} 
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" 
                        style={{WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)', willChange: 'transform'}}
                        loading="lazy"
                        decoding="async"
                      />
                      
                      <button 
                        onClick={() => toggleFavorite(property.id)} 
                        className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-white hover:scale-110 transition-all duration-200 shadow-md"
                      >
                        <svg className="w-5 h-5" fill={favorites.has(property.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
      </main>
    </div>
  );
}

export default App;