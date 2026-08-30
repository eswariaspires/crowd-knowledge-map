import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/explore';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(email.trim(), password);

      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (role: 'USER' | 'ADMIN') => {
    demoLogin(role);
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-[#fcfbf8] to-slate-100 p-4">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-md p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">
              Crowd<span className="text-brand-600">Map</span>
            </span>
          </Link>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to CrowdMap</h1>
          <p className="text-xs text-slate-500">Access community locations, submit places, and post reviews.</p>
        </div>

        {/* Quick Demo Sign In Box */}
        <div className="p-4 bg-brand-50/80 border border-brand-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-brand-800 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-700" />
              Quick One-Click Sign In
            </span>
            <span className="bg-brand-200 text-brand-900 px-1.5 py-0.5 rounded text-[10px]">Demo Mode</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemoSignIn('USER')}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-brand-200 text-slate-900 text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-brand-700" />
              <span>User Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('ADMIN')}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Sign In</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@crowdmap.edu or admin@crowdmap.edu"
                className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo password reset instructions.'); }} className="text-[11px] text-brand-700 font-semibold hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-700 hover:underline">
              Register as New User
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
