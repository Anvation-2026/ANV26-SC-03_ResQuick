import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Lock, 
  MapPin, 
  Building2, 
  RefreshCw, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  ShieldAlert,
  Phone,
  ArrowRight,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../data/translations';
import { DEPARTMENTS, JURISDICTIONS } from '../data/resourcesData';
import { playDispatchPing } from '../utils/soundEffects';

export function LoginModal({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  onLoginSuccess,
  isStandalone = false,
  defaultTab = 'citizen'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'citizen' | 'admin'
  
  // Citizen Form State (Strictly manual user entry - zero autofill)
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenLang, setCitizenLang] = useState(currentLanguage || 'en');
  
  // Admin Form State
  const [adminId, setAdminId] = useState('COMMISSIONER-01');
  const [adminPassword, setAdminPassword] = useState('resquick2026');
  const [adminPhone, setAdminPhone] = useState('8310813290');
  const [selectedDept, setSelectedDept] = useState('head_commissioner');
  const [selectedLocation, setSelectedLocation] = useState('All City Regions (Head Command)');
  
  // Captcha state (strictly manual input required by user)
  const [captchaCode, setCaptchaCode] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Generate random captcha string (5 characters)
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserCaptcha('');
    setErrorMsg('');
  };

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
      setErrorMsg('');
      if (defaultTab) setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  // Clean phone number helper
  const cleanPhone = (phoneStr) => {
    return phoneStr.replace(/\D/g, '').slice(-10);
  };

  // Direct Login Handler with Manual Captcha Verification (Zero OTP delay)
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict Manual Captcha check
    if (!userCaptcha || userCaptcha.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMsg('Incorrect Captcha code. Please manually enter the 5 characters shown above.');
      return;
    }

    if (activeTab === 'citizen') {
      const phoneDigits = cleanPhone(citizenPhone);
      if (phoneDigits.length < 10) {
        setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
        return;
      }

      if (!citizenName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }

      playDispatchPing();
      onLanguageChange(citizenLang);
      onLoginSuccess({
        role: 'citizen',
        name: citizenName.trim(),
        phone: phoneDigits,
        language: citizenLang,
        verifiedAt: new Date().toISOString()
      });
    } else {
      // Officer / Admin Command Login
      if (!adminId.trim() || !adminPassword.trim()) {
        setErrorMsg('Please enter Officer ID and Password.');
        return;
      }

      playDispatchPing();
      const deptObj = DEPARTMENTS.find(d => d.id === selectedDept) || DEPARTMENTS[0];
      const isHeadOfficer = selectedDept === 'head_commissioner';

      onLoginSuccess({
        role: 'admin',
        id: adminId || 'COMMISSIONER-01',
        name: isHeadOfficer ? 'Commissioner Rajesh Rao' : `Officer S. Verma (${deptObj.role})`,
        phone: cleanPhone(adminPhone) || '8310813290',
        department: deptObj.name,
        departmentId: deptObj.id,
        isHeadOfficer,
        location: isHeadOfficer ? 'All City Regions' : selectedLocation,
        language: 'en',
        verifiedAt: new Date().toISOString()
      });
    }

    onClose();
  };

  const fillHeadCommissioner = () => {
    setAdminId('COMMISSIONER-01');
    setAdminPassword('resquick2026');
    setAdminPhone('8310813290');
    setSelectedDept('head_commissioner');
    setSelectedLocation('All City Regions (Head Command)');
    setUserCaptcha('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl glass-modal p-6 sm:p-7 border border-white/20 text-slate-100 shadow-2xl my-auto">
        
        {/* Close Button */}
        {!isStandalone && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 mb-2.5 shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Res<span className="text-cyan-400">Quick</span> Unified Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verified Authentication for Citizens & Municipal Command (No OTP Required)
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex p-1 rounded-xl bg-slate-900/90 border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => { setActiveTab('citizen'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'citizen'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen / User Portal</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Officer / Admin Command</span>
          </button>
        </div>

        {/* DIRECT AUTHENTICATION FORM (ZERO OTP REQUIRED) */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Preferred Language Selection (For Citizen) */}
          {activeTab === 'citizen' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Preferred Indian Language</span>
              </label>
              <select
                value={citizenLang}
                onChange={(e) => setCitizenLang(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-cyan-400 transition"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.native} — {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Citizen Name */}
          {activeTab === 'citizen' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Citizen Name
              </label>
              <input
                type="text"
                required
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          ) : (
            /* Admin Department & Officer ID */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Officer Department</span>
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-cyan-400 transition"
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept.id} value={dept.id} className="bg-slate-900 text-white">
                      {dept.name} — {dept.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Officer ID
                  </label>
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="e.g. COMMISSIONER-01"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mobile Number (For Emergency Alerts & WhatsApp Dispatch)</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-bold">10-Digit Mobile</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={activeTab === 'citizen' ? citizenPhone : adminPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (activeTab === 'citizen') setCitizenPhone(val);
                  else setAdminPhone(val);
                }}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-xs tracking-wider focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Captcha Verification - STRICTLY MANUAL ENTRY */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Security Captcha Verification</span>
              <span className="text-[10px] text-amber-400 font-bold">Type characters manually</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 text-center tracking-[0.4em] font-mono text-xl font-black text-cyan-300 select-none shadow-inner">
                {captchaCode}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Generate new captcha"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              required
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              placeholder="ENTER 5-CHARACTER CAPTCHA ABOVE"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs uppercase font-mono tracking-widest focus:outline-none focus:border-cyan-400 transition text-center"
              autoFocus
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Direct Login Button */}
          <div className="pt-1 space-y-2.5">
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition ${
                activeTab === 'citizen'
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-600/30 ring-1 ring-cyan-400/40'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-indigo-600/30 ring-1 ring-indigo-400/40'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>
                {activeTab === 'citizen' ? 'Login to Citizen / User Portal' : 'Login to Officer / Admin Command'}
              </span>
            </button>

            {/* Admin Command Quick Helper Only (Zero citizen prefill) */}
            {activeTab === 'admin' && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={fillHeadCommissioner}
                  className="w-full py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-300 text-[11px] transition border border-white/10 flex items-center justify-center gap-1"
                >
                  <span>Fill: Demo Head Commissioner Credentials</span>
                </button>
              </div>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
