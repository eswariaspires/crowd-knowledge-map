import React from 'react';
import { MapPin, Heart, Shield, Code, Server, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center">
                <MapPin className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CrowdMap</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover. Contribute. Connect. A community-powered cloud platform for sharing local knowledge, study spots, and student resources.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] font-mono text-emerald-400 border border-slate-700">
              <Server className="w-3 h-3 text-emerald-400" />
              Cloud Computing Project
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Explore Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore" className="hover:text-white transition-colors">Interactive Map</Link></li>
              <li><a href="/#categories" className="hover:text-white transition-colors">Resource Categories</a></li>
              <li><Link to="/add-location" className="hover:text-white transition-colors">Contribute a Location</Link></li>
              <li><Link to="/my-contributions" className="hover:text-white transition-colors">Verification Queue</Link></li>
            </ul>
          </div>

          {/* Col 3: Cloud Architecture */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Cloud Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Database className="w-3 h-3 text-brand-400" /> Cloud Firestore</li>
              <li className="flex items-center gap-1.5"><Server className="w-3 h-3 text-amber-400" /> Cloud Functions</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-blue-400" /> Firebase Auth & Storage</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-rose-400" /> Leaflet + OpenStreetMap</li>
            </ul>
          </div>

          {/* Col 4: Project Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">4-Member Team Project</h4>
            <p className="text-xs text-slate-400 mb-2">
              Designed & developed for Cloud Computing subject evaluation.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1 font-mono">
              <p>Member 1: Frontend / UI / UX</p>
              <p>Member 2: Map & Leaflet Engine</p>
              <p>Member 3: Firebase / Cloud Backend</p>
              <p>Member 4: Admin & Moderation</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CrowdMap Project. Built with React, TypeScript, Leaflet & Firebase.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-300">Login</Link>
            <Link to="/admin" className="hover:text-slate-300">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
