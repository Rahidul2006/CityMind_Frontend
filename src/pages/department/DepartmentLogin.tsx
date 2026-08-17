import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { departmentLogin } from '../../services/departmentTaskService';

export const DepartmentLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await departmentLogin(email, password);
      navigate('/department/dashboard');
    } catch (err: any) {
      console.error('Department login error:', err);
      setError(err.message || 'Invalid email or password for department portal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative overflow-hidden font-sans">
      {/* Background Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="inline-flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">CITYMIND AI</span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Department Officer Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Authorized municipal department access & field operations workspace.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/90 border border-slate-800/80 py-8 px-6 shadow-2xl rounded-3xl backdrop-blur-xl sm:px-10 space-y-6">
          {error && (
            <div className="bg-red-950/80 border border-red-800 text-red-200 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Officer Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="road@citymind.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Login to Department Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Municipal Infrastructure Authentication</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Are you a Municipal Administrator?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-blue-400 font-bold hover:underline"
              >
                Go to Admin Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentLogin;
