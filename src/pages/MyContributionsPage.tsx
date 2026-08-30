import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, PlusCircle, Clock, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { StatusBadge } from '../components/common/Badge';

export const MyContributionsPage: React.FC = () => {
  const { locations } = useData();
  const { user } = useAuth();

  const userLocations = locations.filter(l => l.createdBy === user?.uid || l.createdBy === 'user-alex');

  const totalCount = userLocations.length;
  const approvedCount = userLocations.filter(l => l.verificationStatus === 'APPROVED').length;
  const pendingCount = userLocations.filter(l => l.verificationStatus === 'PENDING').length;
  const rejectedCount = userLocations.filter(l => l.verificationStatus === 'REJECTED').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Contributions</h1>
            <p className="text-xs text-slate-500 font-medium">Track your community location submissions and verification statuses.</p>
          </div>

          <Link
            to="/add-location"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Place</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Submissions</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{totalCount}</span>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-xs bg-emerald-50/30">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
            </span>
            <span className="text-2xl font-black text-emerald-900 block mt-1">{approvedCount}</span>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs bg-amber-50/30">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending
            </span>
            <span className="text-2xl font-black text-amber-900 block mt-1">{pendingCount}</span>
          </div>

          <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-xs bg-rose-50/30">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Rejected
            </span>
            <span className="text-2xl font-black text-rose-900 block mt-1">{rejectedCount}</span>
          </div>
        </div>

        {/* Table / List */}
        {userLocations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No contributions yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Know a quiet study hub, cheap food spot, or public Wi-Fi space? Share it with your community!
            </p>
            <Link to="/add-location" className="inline-block px-5 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs">
              Contribute a Place
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Submitted Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {userLocations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={loc.imageUrls[0] || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=150&q=80'}
                            alt={loc.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{loc.name}</span>
                            <span className="text-[11px] text-slate-400 line-clamp-1">{loc.address}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {loc.category}
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {new Date(loc.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={loc.verificationStatus} />
                        {loc.rejectionReason && (
                          <span className="block text-[10px] text-rose-600 font-semibold mt-1">
                            Reason: {loc.rejectionReason}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/location/${loc.id}`}
                          className="inline-flex items-center gap-1 font-bold text-brand-700 hover:text-brand-800"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
