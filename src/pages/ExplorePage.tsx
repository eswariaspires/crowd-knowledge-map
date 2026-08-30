import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  X, 
  Filter, 
  MapPin, 
  Star, 
  ShieldCheck, 
  List, 
  Map as MapIcon, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MapView } from '../components/map/MapView';
import { LocationCard } from '../components/locations/LocationCard';
import { LocationItem, CategoryName } from '../types';

export const ExplorePage: React.FC = () => {
  const { locations, categories, loading } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const initialCategory = searchParams.get('category') || 'ALL';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'reviews'>('rating');
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);

  // Mobile View Toggle
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredLocations = useMemo(() => {
    return locations
      .filter((loc) => {
        // Show APPROVED locations publicly (or PENDING if user submitted, but per requirements default public view is APPROVED)
        if (verifiedOnly && loc.verificationStatus !== 'APPROVED') return false;

        // Category filter
        if (selectedCategory !== 'ALL' && loc.category !== selectedCategory) return false;

        // Min Rating
        if (minRating > 0 && loc.averageRating < minRating) return false;

        // Search Query (matches name, description, address, category)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = loc.name.toLowerCase().includes(q);
          const matchDesc = loc.description.toLowerCase().includes(q);
          const matchAddr = loc.address.toLowerCase().includes(q);
          const matchCat = loc.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchAddr && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'rating') {
          return b.averageRating - a.averageRating;
        }
        if (sortBy === 'reviews') {
          return b.reviewCount - a.reviewCount;
        }
        return 0;
      });
  }, [locations, selectedCategory, searchQuery, minRating, verifiedOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setMinRating(0);
    setVerifiedOnly(true);
    setSortBy('rating');
    setSearchParams({});
  };

  const mapCenter: [number, number] = selectedLocation
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : [42.3601, -71.0589];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Search Bar & Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs space-y-4">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places, services or resources... (e.g., Quiet Study, Cheap Food, Wi-Fi, Repair)"
                className="w-full text-sm pl-11 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 placeholder-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setMobileTab('list')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${
                  mobileTab === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <List className="w-4 h-4" />
                <span>List ({filteredLocations.length})</span>
              </button>
              <button
                onClick={() => setMobileTab('map')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${
                  mobileTab === 'map' ? 'bg-brand-700 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span>Map View</span>
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchParams({});
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSearchParams({ category: cat.name });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Expanded Filter Panel */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600">
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Min Rating */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Min Rating:</span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2 py-1 font-semibold text-slate-800 focus:outline-none"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3.5}>3.5+ Stars</option>
                  <option value={4.0}>4.0+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              {/* Verified Filter */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-700 focus:ring-brand-500 border-slate-300"
                />
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Only
                </span>
              </label>

              {/* Sort By */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2 py-1 font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>

          </div>

        </div>

        {/* Desktop Split View / Mobile Tab View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Location Cards List */}
          <div className={`lg:col-span-6 space-y-4 ${mobileTab === 'map' ? 'hidden lg:block' : 'block'}`}>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Found {filteredLocations.length} Community {filteredLocations.length === 1 ? 'Location' : 'Locations'}
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse h-40"></div>
                ))}
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No matching locations found</h3>
                <p className="text-xs text-slate-500">Try clearing your filters or searching for broader terms like "study" or "food".</p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-brand-700 text-white font-bold text-xs rounded-xl"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
                {filteredLocations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`cursor-pointer transition-all ${
                      selectedLocation?.id === loc.id ? 'ring-2 ring-brand-700 rounded-2xl' : ''
                    }`}
                  >
                    <LocationCard location={loc} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Leaflet Map */}
          <div className={`lg:col-span-6 sticky top-20 ${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm h-[calc(100vh-220px)] min-h-[450px]">
              <MapView
                locations={filteredLocations}
                center={mapCenter}
                zoom={13}
                selectedLocationId={selectedLocation?.id}
                onMarkerClick={(loc) => setSelectedLocation(loc)}
                height="100%"
              />
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};
