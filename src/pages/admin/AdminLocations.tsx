import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  X, 
  Eye, 
  Check, 
  Ban 
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatusBadge } from '../../components/common/Badge';
import { MapView } from '../../components/map/MapView';
import { LocationItem, VerificationStatus } from '../../types';

export const AdminLocations: React.FC = () => {
  const { locations, approveLocation, rejectLocation } = useData();
  
  const [activeTab, setActiveTab] = useState<'ALL' | VerificationStatus>('PENDING');
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Inaccurate details or duplicate entry');

  const filteredLocations = locations.filter((loc) => {
    if (activeTab === 'ALL') return true;
    return loc.verificationStatus === activeTab;
  });

  const handleApprove = async (id: string) => {
    await approveLocation(id);
    if (selectedLocation?.id === id) {
      setSelectedLocation(prev => prev ? { ...prev, verificationStatus: 'APPROVED' } : null);
    }
  };

  const handleConfirmReject = async () => {
    if (selectedLocation) {
      await rejectLocation(selectedLocation.id, rejectionReason);
      setSelectedLocation(prev => prev ? { ...prev, verificationStatus: 'REJECTED', rejectionReason } : null);
      setRejectionModalOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Location Verification Center"
          subtitle="Review and verify community place submissions before they appear on public maps."
        />

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs w-fit">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => {
              const count = tab === 'ALL'
                ? locations.length
                : locations.filter(l => l.verificationStatus === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === tab
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Locations Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Contributor</th>
                    <th className="py-4 px-4">Submitted</th>
                    <th className="py-4 px-4">Rating</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLocations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No locations matching status "{activeTab}".
                      </td>
                    </tr>
                  ) : (
                    filteredLocations.map((loc) => (
                      <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
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

                        <td className="py-4 px-4 font-semibold text-slate-700">{loc.category}</td>

                        <td className="py-4 px-4 text-slate-600">{loc.createdByName || 'Community User'}</td>

                        <td className="py-4 px-4 text-slate-400">{new Date(loc.createdAt).toLocaleDateString()}</td>

                        <td className="py-4 px-4 font-bold text-slate-800">
                          {loc.averageRating > 0 ? `★ ${loc.averageRating.toFixed(1)} (${loc.reviewCount})` : 'No ratings'}
                        </td>

                        <td className="py-4 px-4">
                          <StatusBadge status={loc.verificationStatus} />
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setSelectedLocation(loc)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                            title="Inspect details"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>

                          {loc.verificationStatus !== 'APPROVED' && (
                            <button
                              onClick={() => handleApprove(loc.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                            >
                              Approve
                            </button>
                          )}

                          {loc.verificationStatus !== 'REJECTED' && (
                            <button
                              onClick={() => {
                                setSelectedLocation(loc);
                                setRejectionModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Verification Inspect Modal */}
      {selectedLocation && !rejectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">{selectedLocation.name}</h3>
                <StatusBadge status={selectedLocation.verificationStatus} />
              </div>
              <button onClick={() => setSelectedLocation(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Category</span>
                <span className="font-bold text-slate-800 text-sm">{selectedLocation.category}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Contributor</span>
                <span className="font-bold text-slate-800 text-sm">{selectedLocation.createdByName || 'Community Member'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Address</span>
                <span className="font-medium text-slate-700">{selectedLocation.address}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedLocation.description}
                </p>
              </div>
            </div>

            {/* Photos Preview */}
            {selectedLocation.imageUrls.length > 0 && (
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-xs block mb-2">Uploaded Images</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedLocation.imageUrls.map((url, i) => (
                    <img key={i} src={url} alt="Uploaded" className="w-24 h-24 object-cover rounded-xl border border-slate-200" />
                  ))}
                </div>
              </div>
            )}

            {/* Leaflet Map Location Preview */}
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-xs block mb-2">Coordinates & Map</span>
              <div className="h-44 rounded-xl overflow-hidden border border-slate-200">
                <MapView
                  locations={[selectedLocation]}
                  center={[selectedLocation.latitude, selectedLocation.longitude]}
                  zoom={14}
                  height="100%"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {selectedLocation.googleMapsUrl && (
                <a
                  href={selectedLocation.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-700 flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Google Maps Link
                </a>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRejectionModalOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
                >
                  Reject Submission
                </button>
                <button
                  onClick={() => handleApprove(selectedLocation.id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Approve & Publish Live
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModalOpen && selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Reject Location Submission</h3>
            <p className="text-xs text-slate-500">Provide a reason for rejecting "{selectedLocation.name}".</p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g., Inaccurate coordinates, fake place, duplicate..."
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
