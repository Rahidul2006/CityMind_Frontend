import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Hexagon, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Building2, 
  PieChart, 
  MapPin, 
  Sparkles, 
  Zap, 
  Copy, 
  Check,
  X,
  Bot
} from 'lucide-react';

interface LandingPageProps {
  initialShowLogin?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ initialShowLogin = false }) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(initialShowLogin);
  const [email, setEmail] = useState('admin@citymind.gov.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'admin' | 'officer' | 'citizen'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState(false);

  const demoAccounts = [
    {
      roleTitle: 'Super Administrator',
      roleType: 'admin' as const,
      email: 'admin@citymind.gov.in',
      pass: 'admin123',
      dept: 'Central Municipal Command',
      badge: 'Full Access'
    },
    {
      roleTitle: 'Department Head',
      roleType: 'officer' as const,
      email: 'pwd.head@citymind.gov.in',
      pass: 'pwd2025',
      dept: 'Public Works & Roads',
      badge: 'Operations'
    },
    {
      roleTitle: 'Field Inspector',
      roleType: 'officer' as const,
      email: 'inspector@citymind.gov.in',
      pass: 'field2025',
      dept: 'Sanitation & Health',
      badge: 'Field Ops'
    }
  ];

  const handleFillDemo = (acc: typeof demoAccounts[0], index: number) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setRole(acc.roleType);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccessMsg(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Mesh Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Top Header Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-[#070d1e]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Hexagon className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                CITYMIND <span className="text-blue-400 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 font-semibold">AI v2.4</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Smart Urban Governance Platform</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Key Features</a>
            <a href="#credentials" className="hover:text-blue-400 transition-colors">Demo Logins</a>
            <a href="#analytics" className="hover:text-blue-400 transition-colors">Impact & Stats</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors shadow-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 lg:pt-24 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Intro & Headline */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Next-Gen Municipal Governance & Incident Triage</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Empowering Smart Cities with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">Predictive Intelligence</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              CityMind AI unifies public complaints, automated departmental SLA routing, real-time spatial heatmaps, and executive emergency response into one seamless civic dashboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
              >
                <Lock className="w-5 h-5 text-blue-200" />
                <span>Access Login Portal</span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 text-base"
              >
                <span>Direct Live Demo</span>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Mini Trust Stats */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">98.4%</div>
                <div className="text-xs text-slate-400 mt-0.5">SLA Resolution Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">14.2k+</div>
                <div className="text-xs text-slate-400 mt-0.5">Active Smart Sensors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-400">&lt; 45 mins</div>
                <div className="text-xs text-slate-400 mt-0.5">Avg Incident Dispatch</div>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Quick Login Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f172a]/95 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-blue-950/50 backdrop-blur-xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Officer Portal Sign In</h2>
                    <p className="text-xs text-slate-400">Municipal Credentials Required</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Demo Ready
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-6">
                {/* Role Tabs */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Select Portal Context</label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        role === 'admin' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('officer')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        role === 'officer' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Department
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('citizen')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        role === 'citizen' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Auditor
                    </button>
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Official Email / Staff ID</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@citymind.gov.in"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">Password</label>
                    <span className="text-[11px] text-blue-400 hover:underline cursor-pointer">Forgot?</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded-sm border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300">Remember credentials</span>
                  </label>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                    2FA Verified
                  </span>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading || loginSuccessMsg}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : loginSuccessMsg ? (
                    <span className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Authenticated! Redirecting...
                    </span>
                  ) : (
                    <>
                      <span>Sign In to CityMind Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* One Click Fill Hint */}
              <div className="mt-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Want pre-filled credentials?</span>
                <button
                  onClick={() => handleFillDemo(demoAccounts[0], 0)}
                  className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
                >
                  Auto-fill Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Reference Section */}
      <section id="credentials" className="relative z-10 py-16 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Testing & Evaluation
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">Demo Login Credentials</h2>
            <p className="text-slate-400 text-sm mt-2">
              Use any of these preset demo credentials to experience different administrative role perspectives within CityMind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {demoAccounts.map((acc, index) => (
              <div 
                key={acc.email} 
                className="bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {acc.dept}
                    </span>
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-full">
                      {acc.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {acc.roleTitle}
                  </h3>

                  <div className="mt-4 space-y-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="text-slate-200 font-medium">{acc.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Password:</span>
                      <span className="text-blue-400 font-medium">{acc.pass}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => {
                      handleFillDemo(acc, index);
                      setShowLoginModal(true);
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-200 text-xs font-bold rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-2"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Filled to Form!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        <span>Load Credentials & Sign In</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Built for High-Scale Municipal Governance</h2>
          <p className="text-slate-400 text-base mt-3">
            Designed for city administrators, department directors, and emergency responders.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Incident Triage</h3>
            <p className="text-sm text-slate-400">
              AI NLP engine categorizes, prioritizes, and routes incoming public complaints to appropriate municipal departments instantly.
            </p>
          </div>

          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-5">
              <MapPin className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">GIS Spatial Heatmaps</h3>
            <p className="text-sm text-slate-400">
              Live geographic mapping highlights complaint clusters, road hazard hot zones, and active municipal field teams.
            </p>
          </div>

          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-teal-600/15 border border-teal-500/30 flex items-center justify-center mb-5">
              <Building2 className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Inter-Dept Workflows</h3>
            <p className="text-sm text-slate-400">
              Seamless collaboration across PWD, Water Supply, Electricity, Health, and Transport departments with live SLA tracking.
            </p>
          </div>

          <div className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-5">
              <PieChart className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Predictive Analytics</h3>
            <p className="text-sm text-slate-400">
              Executive dashboard metrics forecasting resolution timelines, officer workloads, and seasonal citizen complaint trends.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#050814] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Hexagon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-sm font-bold text-white">CITYMIND AI Governance Platform</span>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 CityMind Municipal AI Inc. All rights reserved. Urban Operating System.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Launch Dashboard →
            </button>
          </div>
        </div>
      </footer>

      {/* Pop-up Login Modal (Triggered by Header / CTA) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sign In to CityMind</h3>
                <p className="text-xs text-slate-400">Access your municipal workspace</p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Role</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-1.5 text-xs font-semibold rounded-lg ${
                      role === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('officer')}
                    className={`py-1.5 text-xs font-semibold rounded-lg ${
                      role === 'officer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`py-1.5 text-xs font-semibold rounded-lg ${
                      role === 'citizen' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Auditor
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Fill Button inside Modal */}
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Demo Admin Creds</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@citymind.gov.in');
                    setPassword('admin123');
                    setRole('admin');
                  }}
                  className="text-blue-400 font-semibold hover:underline"
                >
                  Auto-Fill
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || loginSuccessMsg}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : loginSuccessMsg ? (
                  <span className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Success! Entering App...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
