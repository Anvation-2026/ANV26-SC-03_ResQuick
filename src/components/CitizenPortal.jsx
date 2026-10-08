import React, { useState } from 'react';
import { 
  PlusCircle, 
  FolderClock, 
  Activity, 
  Bell, 
  MapPin, 
  PhoneCall, 
  Search, 
  Globe2, 
  AlertTriangle, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  Bot,
  ExternalLink,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { RiskMap } from './RiskMap';
import { WeatherForecastWidget } from './WeatherForecastWidget';

export function CitizenPortal({
  currentUser,
  currentLanguage,
  zones,
  incidents,
  isEscalated,
  onOpenReportModal,
  onOpenTrackModal,
  onOpenNewsModal,
  onOpenHelplinesModal,
  onSelectZone,
  selectedZone,
  onViewIncidentDetails,
  onSwitchToAdmin
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Indian Timeline Greetings: Morning (04:00 - 11:59), Afternoon (12:00 - 16:59), Evening (17:00 - 03:59)
  const getIndianGreeting = (lang) => {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const istHours = (utcHours + 5 + Math.floor((utcMinutes + 30) / 60)) % 24;

    if (istHours >= 4 && istHours < 12) {
      return {
        text: lang === 'kn' ? 'ಶುಭೋದಯ' : lang === 'hi' ? 'शुभ प्रभात' : 'Good Morning',
        icon: '🌅',
        slot: 'Morning'
      };
    } else if (istHours >= 12 && istHours < 17) {
      return {
        text: lang === 'kn' ? 'ಶುಭ ಮಧ್ಯಾಹ್ನ' : lang === 'hi' ? 'शुभ दोपहर' : 'Good Afternoon',
        icon: '☀️',
        slot: 'Afternoon'
      };
    } else {
      return {
        text: lang === 'kn' ? 'ಶುಭ ಸಂಜೆ' : lang === 'hi' ? 'शुभ संध्या' : 'Good Evening',
        icon: '🌇',
        slot: 'Evening'
      };
    }
  };

  const getISTTimeString = () => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' IST';
  };

  const greeting = getIndianGreeting(currentLanguage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-6 animate-in fade-in">
      
      {/* 0. VERTICAL LEFT SIDEBAR NAVIGATION (Screenshots 1 & 2) */}
      <aside className="w-full lg:w-64 shrink-0 space-y-4 lg:sticky lg:top-20 self-start">
        {/* Navigation Card */}
        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Citizen Navigation</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition group"
            >
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 group-hover:scale-110 transition">
                🏠
              </span>
              <span>{t.home}</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 flex items-center gap-2.5 transition shadow-sm group"
            >
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition">
                🚨
              </span>
              <div className="flex-1">
                <div>{t.reportProblem}</div>
                <div className="text-[10px] text-cyan-400 font-normal">Voice / Photo / GPS</div>
              </div>
            </button>

            <button
              onClick={onOpenTrackModal}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-indigo-300 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition group"
            >
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 group-hover:scale-110 transition">
                📋
              </span>
              <div className="flex-1">
                <div>{t.trackStatus || 'Track Status'}</div>
                <div className="text-[10px] text-slate-400 font-normal">Check Grievance #</div>
              </div>
            </button>

            <button
              onClick={onOpenNewsModal}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-amber-300 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition group"
            >
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-400/20 group-hover:scale-110 transition">
                📰
              </span>
              <div className="flex-1">
                <div>{t.relatableNews || 'Disaster Bulletins'}</div>
                <div className="text-[10px] text-slate-400 font-normal">National Live Feed</div>
              </div>
            </button>

            <button
              onClick={onOpenHelplinesModal}
              className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-rose-300 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition group"
            >
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-400/20 group-hover:scale-110 transition">
                📞
              </span>
              <div className="flex-1">
                <div>{t.emergencyHelplines}</div>
                <div className="text-[10px] text-slate-400 font-normal">Dial 112 / 1078 (24/7)</div>
              </div>
            </button>
          </nav>
        </div>

        {/* Quick Emergency Helplines Call Card */}
        <div className="p-4 rounded-2xl glass-panel border border-rose-500/30 space-y-2.5 bg-gradient-to-b from-rose-950/30 to-slate-900/60">
          <div className="text-[11px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Universal Helpline</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Emergency police, fire & medical dispatch:
          </p>
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md transition"
          >
            <span>📞 Dial 112 Toll-Free</span>
          </a>
          <a
            href="tel:1078"
            className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition"
          >
            <span>Disaster Relief: 1078</span>
          </a>
        </div>

        {/* Municipal Operational Status Card */}
        <div className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-1.5 text-[11px]">
          <div className="font-bold text-slate-300">Municipal Action Core</div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Online • Auto-Triage Active</span>
          </div>
          <div className="text-slate-400 text-[10px]">
            Voice & Language Engine: Ready (8 Languages)
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 space-y-6">

        {/* 1. HERO GREETING BANNER - Accurate Indian Timeline Greeting */}
        <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/15 p-6 md:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/80 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            
            <div className="space-y-2 max-w-2xl">
              {/* Telemetry pill */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-cyan-300">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  MUNICIPAL GRID ACTIVE • Real-Time Civic Dispatch
                </span>
                <span className="text-slate-400">🕒 {getISTTimeString()}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{greeting.text}, {currentUser?.name || 'Citizen'}!</span>
                <span className="text-2xl">{greeting.icon}</span>
              </h1>

              <p className="text-sm text-slate-300 font-medium">
                {t.citizenSubtext} ResQuick continuously prioritizes emergency response teams to protect vulnerable citizens.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Spatial Consolidation: Active
                </span>
                <span>•</span>
                <span className="text-emerald-300">8 Indian Languages Live Voice Engine</span>
                <span>•</span>
                <span className="text-blue-300">24/7 Municipal Action Core</span>
              </div>
            </div>

            {/* Right Performance Stats (from screenshot) */}
            <div className="flex items-center gap-4 sm:gap-6 bg-slate-950/60 p-4 rounded-xl border border-white/10 shrink-0">
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  AI Precision
                </div>
                <div className="text-2xl font-black text-cyan-400 mt-0.5">
                  98.4%
                </div>
                <div className="text-[10px] text-slate-500">Automated Routing</div>
              </div>

              <div className="w-px h-10 bg-white/10" />

              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Avg Dispatch
                </div>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">
                  &lt; 9 min
                </div>
                <div className="text-[10px] text-slate-500">Fast Tactical Action</div>
              </div>
            </div>

          </div>

          {/* Ambient background glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        </div>

      {/* 2. QUICK CITIZEN ACTIONS GRID */}
      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          {t.quickActions}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Action 1: Report a Problem */}
          <button
            onClick={onOpenReportModal}
            className="p-4 rounded-2xl glass-panel glass-card-hover text-left border border-white/10 flex flex-col justify-between group transition"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-cyan-400/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                {t.reportProblem}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t.reportProblemSub}
              </p>
            </div>
          </button>

          {/* Action 2: Track Complaint Status */}
          <button
            onClick={onOpenTrackModal}
            className="p-4 rounded-2xl glass-panel glass-card-hover text-left border border-white/10 flex flex-col justify-between group transition"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-indigo-400/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                {t.trackStatus || 'Track Status'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t.statusSub || 'Live grievance progress'}
              </p>
            </div>
          </button>

          {/* Action 3: Relatable News & Emergency Bulletins */}
          <button
            onClick={onOpenNewsModal}
            className="p-4 rounded-2xl glass-panel glass-card-hover text-left border border-white/10 flex flex-col justify-between group transition"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-amber-400/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                {t.relatableNews || 'Live Bulletins'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Disaster news & advisories
              </p>
            </div>
          </button>

          {/* Action 4: Emergency Helplines */}
          <button
            onClick={onOpenHelplinesModal}
            className="p-4 rounded-2xl glass-panel glass-card-hover text-left border border-white/10 flex flex-col justify-between group transition"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-rose-400/30">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-rose-300 transition">
                24/7 Helplines
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Call 112 / 1078 Universal Emergency
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* 4.5. LIVE WEATHER & PREDICTIVE DISASTER FORECAST */}
      <WeatherForecastWidget isEscalated={isEscalated} currentLanguage={currentLanguage} />

      {/* 5. LIVE DISASTER RISK MAP (Interactive with satellite layer toggle) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Interactive City Hazard & Response Map</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                5 Active Zones
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Click on any hazard zone or incident marker to inspect telemetry and uploaded photo proof
            </p>
          </div>
        </div>

        <RiskMap
          zones={zones}
          incidents={incidents}
          selectedZone={selectedZone}
          onSelectZone={onSelectZone}
          isEscalated={isEscalated}
          isAdminView={false}
        />
      </div>

      </main>
    </div>
  );
}
