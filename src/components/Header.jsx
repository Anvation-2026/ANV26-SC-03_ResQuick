import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  RotateCcw, 
  Globe, 
  Bell, 
  User, 
  Radio, 
  PhoneCall, 
  FileText, 
  MapPin, 
  Compass, 
  Sparkles,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  Palette,
  Download
} from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../data/translations';

export function Header({
  currentRole, // 'citizen' | 'admin'
  currentUser,
  currentLanguage,
  onLanguageChange,
  currentTheme = 'dark',
  onThemeChange,
  isEscalated,
  onToggleEscalation,
  onOpenReportModal,
  onOpenTrackModal,
  onOpenNewsModal,
  onOpenHelplinesModal,
  onSwitchPortal,
  onOpenLoginModal,
  onOpenNotifications,
  onSignOut,
  unreadCount = 4
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const currentLangObj = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  const THEMES = [
    { id: 'dark', label: 'Dark Tactical', icon: Moon, desc: 'High-contrast Night Command' },
    { id: 'light', label: 'Light Municipal', icon: Sun, desc: 'Official Civic Government White' },
    { id: 'navy', label: 'Cyber Navy', icon: Palette, desc: 'Deep Indigo Command Hub' },
    { id: 'emerald', label: 'Emerald Ops', icon: Palette, desc: 'Disaster Relief Forest Grid' }
  ];

  const currentThemeObj = THEMES.find(th => th.id === currentTheme) || THEMES[0];
  const ThemeIcon = currentThemeObj.icon;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Brand Identity & Tagline */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-600 shadow-lg shadow-cyan-500/25 border border-cyan-400/40 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                  Res<span className="text-cyan-400">Quick</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Quick Simulation Active Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{t.simulationActive}</span>
          </div>
        </div>

        {/* Center: Clean spacer (Both Admin and Citizen portals have dedicated vertical sidebars) */}
        <div className="flex-1" />

        {/* Right Controls: Escalation Button, Theme Switcher, Language Selector, User Badge */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-end">
          
          {/* SIMULATE ESCALATION / RESET SIMULATION BUTTON */}
          <button
            onClick={onToggleEscalation}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0 ${
              isEscalated
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 ring-2 ring-amber-400/50'
                : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-700/40 ring-2 ring-red-500/50 animate-pulse'
            }`}
          >
            {isEscalated ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetSimulation}</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 fill-white" />
                <span>{t.simulateEscalation}</span>
              </>
            )}
          </button>

          {/* THEME SWITCHER DROPDOWN (Works in both Admin & User portal) */}
          <div className="relative">
            <button
              onClick={() => { setThemeMenuOpen(!themeMenuOpen); setLangMenuOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs text-slate-200 transition"
              title="Change Theme (Dark, Light, Navy, Emerald)"
            >
              <ThemeIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium hidden sm:inline">{currentThemeObj.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {themeMenuOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-52 rounded-xl bg-slate-900 border border-white/15 shadow-2xl py-1 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
                onClick={() => setThemeMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
                  Select Portal Theme
                </div>
                {THEMES.map((th) => {
                  const IconComp = th.icon;
                  const isSelected = currentTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => onThemeChange(th.id)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-500/20 transition ${
                        isSelected ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComp className="w-3.5 h-3.5 text-cyan-400" />
                        <div>
                          <div>{th.label}</div>
                          <div className="text-[10px] text-slate-400">{th.desc}</div>
                        </div>
                      </div>
                      {isSelected && <span className="text-cyan-400 text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language Selector Dropdown (Citizen Portal Only - Admin is English strictly) */}
          {currentRole !== 'admin' && (
            <div className="relative">
              <button
                onClick={() => { setLangMenuOpen(!langMenuOpen); setThemeMenuOpen(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs text-slate-200 transition"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium">{currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-48 rounded-xl bg-slate-900 border border-white/15 shadow-2xl py-1 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
                  onClick={() => setLangMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
                    Select Indian Language
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => onLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-500/20 transition ${
                        currentLanguage === lang.code ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-slate-300'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-400">({lang.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notification Indicator */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 transition"
            title="Emergency Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Portal Switcher & User Profile */}
          <button
            onClick={onSwitchPortal}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/30 text-xs text-white transition font-medium"
            title="Switch Portal Mode"
          >
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xs border border-cyan-400/30">
              {currentRole === 'admin' ? '🛡️' : currentRole === 'sub_officer' ? '👷' : '👤'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold leading-tight">
                {currentRole === 'admin' 
                  ? 'Admin Command' 
                  : currentRole === 'sub_officer' 
                  ? currentUser?.name || 'Field Engineer' 
                  : currentUser?.name || 'Citizen'}
              </div>
              <div className="text-[9px] text-cyan-300 leading-tight">
                {currentRole === 'admin' 
                  ? 'Click: Switch View' 
                  : currentRole === 'sub_officer' 
                  ? 'Sub-Officer Field Lead' 
                  : 'Click: Admin Portal'}
              </div>
            </div>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/80 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 text-xs transition flex items-center gap-1.5"
            title="Sign Out to Login Page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xl:inline font-semibold">{t.logout || 'Logout'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
