import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  Image as ImageIcon,
  Compass
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MapView } from '../components/map/MapView';
import { CategoryName } from '../types';
import { uploadImageToStorage } from '../services/storageService';

export const AddLocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addLocation, categories } = useData();
  const { user } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryName>('Study');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(42.3601);
  const [longitude, setLongitude] = useState<number>(-71.0589);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // Image Upload State
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle Drag & Drop / File Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter((file) =>
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      );

      if (validFiles.length !== filesArray.length) {
        setError('Only JPG, JPEG, PNG, and WEBP images are supported.');
      } else {
        setError(null);
      }

      setImages((prev) => [...prev, ...validFiles]);

      // Create preview URLs
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setLatitude(Number(lat.toFixed(6)));
    setLongitude(Number(lng.toFixed(6)));
    if (!googleMapsUrl) {
      setGoogleMapsUrl(`https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !address.trim()) {
      setError('Please fill in all required basic information fields.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Upload photos to Firebase Cloud Storage (or Data URL fallback)
      const uploadedUrls: string[] = [];
      for (const file of images) {
        const url = await uploadImageToStorage(file, 'locations');
        uploadedUrls.push(url);
      }

      // Default fallback image if no photo uploaded
      if (uploadedUrls.length === 0) {
        uploadedUrls.push('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80');
      }

      await addLocation({
        name: name.trim(),
        category,
        description: description.trim(),
        address: address.trim(),
        latitude,
        longitude,
        googleMapsUrl: googleMapsUrl.trim() || `https://maps.google.com/?q=${latitude},${longitude}`,
        imageUrls: uploadedUrls,
        createdBy: user?.uid || 'anon',
        createdByName: user?.name || 'Community Member',
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-contributions');
      }, 2500);

    } catch (err: any) {
      setError(err.message || 'Error submitting location. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="mb-8 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Submission</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Know a place worth sharing?</h1>
          <p className="text-sm text-slate-500 font-medium">Help someone discover something useful in your city or college area.</p>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-12 text-center space-y-4 shadow-lg">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h2 className="text-2xl font-extrabold text-slate-900">Thanks for contributing!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your location submission is waiting for verification. Administrators will review it shortly.
            </p>
            <p className="text-xs text-brand-700 font-bold">Redirecting to your contributions...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Basic Info */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">1</span>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Location Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Quiet Study Hub or Student Budget Bites"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryName)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} — {cat.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Full Address / Location Details *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 45 University Ave, Floor 2, Central Campus"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Description *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe why this place is useful (e.g. Wi-Fi speed, outlet availability, pricing, seating space)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            {/* Section 2: Location Map Point Selection */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">2</span>
                  Map Location Coordinates
                </span>
                <span className="text-xs text-brand-700 font-bold flex items-center gap-1">
                  <Compass className="w-4 h-4" /> Pick on Leaflet Map
                </span>
              </h2>

              <p className="text-xs text-slate-500">
                Click anywhere on the interactive map below to automatically pinpoint latitude and longitude coordinates.
              </p>

              <div className="h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <MapView
                  locations={[]}
                  center={[latitude, longitude]}
                  zoom={13}
                  pickerMode={true}
                  selectedLatLng={{ lat: latitude, lng: longitude }}
                  onLocationSelect={handleMapLocationSelect}
                  height="100%"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Google Maps URL (Optional)</label>
                  <input
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Drag & Drop Photo Uploader */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">3</span>
                Upload Photos
              </h2>

              <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 transition-colors">
                <Upload className="w-10 h-10 text-brand-600 mx-auto" />
                <div>
                  <label className="cursor-pointer font-bold text-xs text-brand-700 hover:underline">
                    <span>Click to upload photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-500 block mt-1">Accepts JPG, PNG, WEBP (Uploaded to Firebase Cloud Storage)</span>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative h-28 rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={uploading}
                className="px-8 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-lg shadow-brand-700/20 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading to Firebase Storage...' : 'Submit for Verification'}
              </button>
            </div>

          </form>
        )}

      </main>

      <Footer />
    </div>
  );
};
