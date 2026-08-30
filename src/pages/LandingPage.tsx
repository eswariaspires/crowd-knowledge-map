import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  BookOpen, 
  Utensils, 
  Wifi, 
  Wrench, 
  ShoppingBag, 
  HeartPulse, 
  Bus, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Star,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import { MapView } from '../components/map/MapView';
import { useData } from '../contexts/DataContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CategoryName } from '../types';

export const LandingPage: React.FC = () => {
  const { locations, categories } = useData();
  const navigate = useNavigate();

  const approvedLocations = locations.filter(l => l.verificationStatus === 'APPROVED');
  const previewLocations = approvedLocations.slice(0, 6);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return BookOpen;
      case 'Utensils': return Utensils;
      case 'Wifi': return Wifi;
      case 'Wrench': return Wrench;
      case 'ShoppingBag': return ShoppingBag;
      case 'HeartPulse': return HeartPulse;
      case 'Bus': return Bus;
      default: return MapPin;
    }
  };

  const handleCategoryClick = (catName: CategoryName) => {
    navigate(`/explore?category=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-brand-50/60 via-[#fcfbf8] to-[#fcfbf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cloud-Powered Community Map</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Your city knows more than <span className="text-brand-700 underline decoration-emerald-300 decoration-wavy decoration-2">you think.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                Discover useful places, hidden gems, student-friendly resources, and local knowledge shared by the people around you.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/explore"
                  className="px-6 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md shadow-brand-700/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <MapIcon className="w-4 h-4" />
                  <span>Explore the Map</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/add-location"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-brand-700" />
                  <span>Share a Place</span>
                </Link>
              </div>

              {/* Stat Counters */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-2xl font-black text-slate-900">100%</span>
                  <span className="block text-xs font-semibold text-slate-500">Verified Places</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-brand-700">4.8★</span>
                  <span className="block text-xs font-semibold text-slate-500">Avg Community Rating</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900">8</span>
                  <span className="block text-xs font-semibold text-slate-500">Resource Types</span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Map Preview */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl p-3 bg-white shadow-2xl border border-slate-200/80">
                <div className="h-[420px] rounded-2xl overflow-hidden">
                  <MapView
                    locations={previewLocations}
                    center={[42.3601, -71.0589]}
                    zoom={13}
                    height="100%"
                  />
                </div>

                {/* Floating Preview Card 1 */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-30 max-w-xs animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Quiet Study Spot</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-amber-500">★★★★★ 4.8</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">✓ Verified</span>
                    </div>
                  </div>
                </div>

                {/* Floating Preview Card 2 */}
                <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-30 max-w-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Student Budget Bites</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-amber-500">★★★★☆ 4.6</span>
                      <span className="text-[10px] text-slate-500">$8 Meals</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Section */}
      <section id="categories" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700">Resource Directories</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">Browse What You Need</p>
            <p className="text-xs text-slate-500">Click any category to filter approved locations instantly on the interactive map.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.iconName);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="group bg-slate-50 hover:bg-brand-700 p-6 rounded-2xl border border-slate-200/80 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${cat.color} group-hover:bg-white group-hover:text-brand-700`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-white transition-colors">{cat.name}</h3>
                  <p className="text-xs text-slate-500 group-hover:text-emerald-100 transition-colors line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#fcfbf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-700">Community Workflow</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">How CrowdMap Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <span className="text-4xl font-black text-brand-700/20 block mb-4">01</span>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Discover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore useful places around you using Leaflet interactive map, category filters, and student ratings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <span className="text-4xl font-black text-brand-700/20 block mb-4">02</span>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Contribute</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Share useful local knowledge with the community by pinning map coordinates and uploading photos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <span className="text-4xl font-black text-brand-700/20 block mb-4">03</span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Verify</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Community submissions are reviewed by admins before becoming trusted, publicly visible resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Verification Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Moderated Quality Guarantee
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Built on verified community knowledge.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every single location on CrowdMap passes through administrative verification to prevent spam, outdated information, or fake entries.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Locations</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Community Ratings</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>User Reviews</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Moderated Submissions</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center font-bold text-lg">
                  CM
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">CrowdMap Verification Protocol</h4>
                  <p className="text-xs text-slate-400">Cloud Firestore Security Rules Enforced</p>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-emerald-400 border border-slate-700 space-y-1">
                <p><span className="text-slate-500">// Firestore verification rule</span></p>
                <p>match /locations/&#123;id&#125; &#123;</p>
                <p className="pl-4 text-slate-300">allow read: if resource.data.verificationStatus == <span className="text-amber-400">'APPROVED'</span>;</p>
                <p className="pl-4 text-slate-300">allow write: if request.auth.token.role == <span className="text-amber-400">'ADMIN'</span>;</p>
                <p>&#125;</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
