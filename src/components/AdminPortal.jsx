import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  RotateCcw, 
  Send, 
  FileText, 
  Download, 
  Search, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  ChevronRight, 
  BarChart3, 
  ArrowUpRight,
  Radio,
  Camera,
  Layers,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Activity,
  AlertTriangle,
  Building2,
  Users,
  Clock,
  Eye,
  RefreshCw,
  HardHat
} from 'lucide-react';
import { RiskMap } from './RiskMap';
import { WeatherForecastWidget } from './WeatherForecastWidget';
import { generateWhyThisZone } from '../utils/riskEngine';
import { allocateResources } from '../utils/resourceEngine';
import { MUNICIPAL_DEPARTMENTS } from '../data/resourcesData';

export function AdminPortal({
  zones,
  incidents,
  isEscalated,
  onToggleEscalation,
  onResetSimulation,
  onOpenSMSModal,
  onOpenAIReportModal,
  onOpenHelplinesModal,
  onSwitchToCitizen,
  currentOfficer,
  onUpdateIncident,
  onOpenManageModal,
  onOpenGovtReport
}) {
  // Navigation active tab: 'dashboard' | 'applications' | 'map' | 'priority' | 'resources'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // View mode: 'focused' (shows selected section prominently) vs 'all' (unified scroll view)
  const [viewMode, setViewMode] = useState('all'); 
  const [highlightedSection, setHighlightedSection] = useState(null);

  const [selectedZone, setSelectedZone] = useState(zones[0] || null);
  const mainScrollRef = useRef(null);
  
  // Search & Filters for Screenshot 5 Table
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');

  // Compute resource allocation
  const allocationResult = allocateResources(zones, isEscalated);

  const whyExplanation = selectedZone 
    ? generateWhyThisZone(selectedZone, selectedZone.priorityRank) 
    : (zones[0] ? generateWhyThisZone(zones[0], 1) : null);

  const criticalCount = zones.filter(z => z.calculatedScore >= 80).length;

  // Filtered incidents for the Screenshot 5 Table
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.issue && inc.issue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDomain = filterDomain === 'All' || inc.domain === filterDomain.toLowerCase() || inc.domainLabel?.includes(filterDomain);
    const matchesStatus = filterStatus === 'All' || inc.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || inc.severity === filterSeverity.toUpperCase();

    return matchesSearch && matchesDomain && matchesStatus && matchesSeverity;
  });

  // Handle Tab Navigation Click:
  // If in 'all' view: smoothly scroll directly to that specific section and flash highlight
  // If in 'focused' view: switch directly to that specific section
  const handleNavClick = (sectionId) => {
    setActiveTab(sectionId);
    
    // In 'all' mode, scroll directly to the target element
    if (viewMode === 'all') {
      setTimeout(() => {
        const el = document.getElementById(`section-${sectionId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setHighlightedSection(sectionId);
          setTimeout(() => setHighlightedSection(null), 2400);
        }
      }, 50);
    } else {
      // In focused mode, reset scroll to top of main area
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: 'Overview' },
    { id: 'applications', label: 'All Applications', icon: FileText, badge: `${incidents.length}` },
    { id: 'map', label: 'Live City Map', icon: MapPin, badge: 'GIS' },
    { id: 'priority', label: 'Priority Issues', icon: ShieldAlert, badge: `#1-${zones.length}` },
    { id: 'resources', label: 'Resource Fleet', icon: Truck, badge: 'Fleet' }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-60px)]">
      
      {/* 1. LEFT ADMIN SIDEBAR (Screenshot 4 & user screenshot) */}
      <aside className="w-full lg:w-64 bg-slate-950/95 border-r border-white/10 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Admin Command Hub Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30">
              CS
            </div>
            <div>
              <div className="text-sm font-black text-white tracking-tight">
                CivicSense / ResQuick
              </div>
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                ADMIN COMMAND
              </div>
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 flex items-center justify-between">
            <span>Municipal Operations</span>
            <span className="text-[9px] text-cyan-400/80 font-mono">LIVE GRID</span>
          </div>

          {/* Navigation Links - Taking user to that specific section */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={`Navigate to ${item.label} section`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Quick Action Tools */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <button
              onClick={onOpenSMSModal}
              className="w-full py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-2 transition shadow-sm group"
            >
              <Send className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition" />
              <span>Broadcast Siren SMS</span>
            </button>
          </div>

        </div>

        {/* Bottom Switcher */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={onSwitchToCitizen}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-bold flex items-center justify-between transition"
          >
            <span>Switch to Citizen View</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN ADMIN CONTENT AREA */}
      <main ref={mainScrollRef} className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-60px)]">
        
        {/* Top Operations Header (Screenshot 4) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <h1 className="text-xl sm:text-2xl font-black text-white">
                City Operations Dashboard
              </h1>
              {/* Active Section Indicator */}
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                Active Section: {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mt-1">
              Officer: <strong>{currentOfficer?.name || 'Chief Officer'}</strong> • Municipal Command & Civic Intelligence Hub • <span className="font-mono text-cyan-400">2:15 PM</span>
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[11px] font-semibold">
                Assigned Dept: {currentOfficer?.department || 'Road Maintenance & Traffic Department'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px]">
                Jurisdiction: {currentOfficer?.location || 'All City Regions'}
              </span>
            </div>
          </div>

          {/* Quick Header Actions & View Mode Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle: All Sections vs Focused Section */}
            <div className="flex items-center bg-slate-900 border border-white/15 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-lg transition ${
                  viewMode === 'all' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View all sections together with direct scrolling"
              >
                All Sections View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('focused')}
                className={`px-3 py-1 rounded-lg transition ${
                  viewMode === 'focused' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View only the selected section in focus"
              >
                Focus Section View
              </button>
            </div>

            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," 
                  + "ApplicationID,Citizen,Issue,Domain,Severity,Status,Location\n"
                  + incidents.map(i => `"${i.id}","${i.reporterName}","${i.issue || i.title}","${i.domain}","${i.severity}","${i.status}","${i.location}"`).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "Municipal_Applications_Data.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              title="Export all applications to CSV Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenSMSModal}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Emergency Siren SMS</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: DASHBOARD OVERVIEW & METRICS
           ========================================================================= */}
        {(viewMode === 'all' || activeTab === 'dashboard') && (
          <section 
            id="section-dashboard"
            className={`space-y-4 rounded-2xl transition duration-500 ${
              highlightedSection === 'dashboard' ? 'ring-2 ring-cyan-400 p-2 bg-cyan-950/20' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Dashboard Operations Overview</span>
              </h2>
              <span className="text-xs text-slate-400">Live Municipal Metrics</span>
            </div>

            {/* METRICS CARDS ROW (Screenshot 4) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div 
                onClick={() => handleNavClick('applications')}
                className="p-4 rounded-xl glass-panel border border-white/10 hover:border-blue-500/50 cursor-pointer transition"
              >
                <div className="text-[11px] text-slate-400 font-semibold">Total Reports</div>
                <div className="text-2xl font-black text-white mt-1">{incidents.length}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-3 h-3" /> 12% from yesterday
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-white/10">
                <div className="text-[11px] text-slate-400 font-semibold">Pending Review</div>
                <div className="text-2xl font-black text-amber-400 mt-1">
                  {incidents.filter(i => i.status === 'Submitted' || i.status === 'Pending').length}
                </div>
                <div className="text-[10px] text-slate-500">Awaiting triage</div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-white/10">
                <div className="text-[11px] text-slate-400 font-semibold">In Progress</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {incidents.filter(i => i.status.includes('Progress') || i.status.includes('Assigned')).length}
                </div>
                <div className="text-[10px] text-cyan-400 flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-3 h-3" /> Field teams active
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-white/10">
                <div className="text-[11px] text-slate-400 font-semibold">Resolved Cases</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {incidents.filter(i => i.status === 'Resolved').length}
                </div>
                <div className="text-[10px] text-slate-500">Public verified</div>
              </div>

              <div 
                onClick={() => handleNavClick('map')}
                className="p-4 rounded-xl glass-panel border border-white/10 hover:border-blue-500/50 cursor-pointer transition"
              >
                <div className="text-[11px] text-slate-400 font-semibold">Active Zones</div>
                <div className="text-2xl font-black text-blue-400 mt-1">{zones.length}</div>
                <div className="text-[10px] text-slate-400">Bengaluru wards</div>
              </div>

              <div 
                onClick={() => handleNavClick('priority')}
                className="p-4 rounded-xl glass-panel border border-red-500/30 bg-red-950/20 hover:border-red-500/50 cursor-pointer transition"
              >
                <div className="text-[11px] text-red-300 font-semibold">Critical Priority</div>
                <div className="text-2xl font-black text-red-500 mt-1">{criticalCount}</div>
                <div className="text-[10px] text-red-400 font-bold">Immediate action</div>
              </div>
            </div>

            {/* Live Meteorological Weather Intelligence & Predictive Disaster Forecast ("What Could Happen Next") */}
            <WeatherForecastWidget isEscalated={isEscalated} currentLanguage="en" />

            {/* Quick Summary Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Dynamic AI Priority Engine Active</h3>
                  <p className="text-[11px] text-slate-400">
                    Highest Priority Ward: <strong className="text-red-400">{zones[0]?.name}</strong> (Score: {zones[0]?.calculatedScore}/100) • Automated Resource Redistribution Enabled
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('priority')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <span>Inspect Priority #1</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 2: ALL APPLICATIONS (SCREENSHOT 5 TABLE)
           ========================================================================= */}
        {(viewMode === 'all' || activeTab === 'applications') && (
          <section 
            id="section-applications"
            className={`p-5 rounded-2xl glass-panel border border-white/15 space-y-4 transition duration-500 ${
              highlightedSection === 'applications' ? 'ring-2 ring-blue-400 bg-blue-950/20' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>High-Priority Consolidated Incidents (Duplicate Intelligence)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Manage grievances, assign departments, generate official government inspection reports
                </p>
              </div>
              <span className="text-xs text-blue-400 font-bold">
                Showing {filteredIncidents.length} of {incidents.length} Records
              </span>
            </div>

            {/* Search Bar & Filter Controls (Exact from Screenshot 5) */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by app #, citizen, issue or location..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-blue-400 transition"
              >
                <option value="All">All Domains</option>
                <option value="traffic">Traffic & Roads</option>
                <option value="disaster">Disaster & Flood</option>
                <option value="waste">Waste Management</option>
                <option value="water">Water Supply</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-blue-400 transition"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Verified">Verified</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-blue-400 transition"
              >
                <option value="All">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>

            {/* Sub-Officer FCFS Claim Status Summary Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300 font-bold flex items-center gap-1.5 text-[11px]">
                <HardHat className="w-3.5 h-3.5 text-blue-400" />
                <span>Field Engineer FCFS Protocol:</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                ✓ {incidents.filter(i => i.assignedSubOfficer && i.assignedSubOfficer !== 'Unassigned').length} Claimed
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold">
                ⚡ {incidents.filter(i => !i.assignedSubOfficer || i.assignedSubOfficer === 'Unassigned').length} Open for Claim
              </span>
              {incidents.some(i => i.resourceRequisition && !i.resourceRequisition.status?.includes('Approved')) && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono text-[11px] font-bold animate-pulse">
                  🚨 {incidents.filter(i => i.resourceRequisition && !i.resourceRequisition.status?.includes('Approved')).length} Resource Requests Pending
                </span>
              )}
            </div>

            {/* Applications Table (Screenshot 5) */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-white/10 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
                    <th className="py-3 px-3 whitespace-nowrap">APPLICATION NO.</th>
                    <th className="py-3 px-3 whitespace-nowrap">CITIZEN</th>
                    <th className="py-3 px-3">ISSUE & DOMAIN</th>
                    <th className="py-3 px-3 whitespace-nowrap text-center">SEVERITY</th>
                    <th className="py-3 px-3 whitespace-nowrap text-center">STATUS</th>
                    <th className="py-3 px-3 whitespace-nowrap">SUB-OFFICER / FCFS CLAIM</th>
                    <th className="py-3 px-3 whitespace-nowrap text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-950/60">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No applications matched your search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-white/5 transition">
                        <td className="py-3.5 px-3 font-mono font-bold text-blue-400 whitespace-nowrap">
                          {inc.id}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-white whitespace-nowrap">
                          <div>
                            <span>{inc.reporterName}</span>
                            <span className="block text-[10px] text-slate-500 font-mono">{inc.contact}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-white text-xs">{inc.issue || inc.title}</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 text-[9px] font-bold border border-emerald-500/40 flex items-center gap-1">
                                <span>🌐 Auto-Translated to English</span>
                              </span>
                            </div>
                            
                            {/* Official English Translation for Officers */}
                            <div className="text-[11px] text-slate-200 font-medium bg-slate-900/80 p-1.5 rounded-lg border border-white/10 max-w-sm">
                              "{inc.translatedEnglishText || inc.description}"
                            </div>

                            {/* Spoken Language Tag + Original Citizen Text */}
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 flex-wrap">
                              <span className="font-mono text-cyan-300">
                                🗣️ Spoken in {inc.originalLanguageFull || inc.originalLanguage}:
                              </span>
                              <span className="italic truncate max-w-[160px] text-slate-400">
                                "{inc.originalVoiceText || inc.description}"
                              </span>
                              {inc.mediaUrl && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] flex items-center gap-1 shrink-0">
                                  📷 Photo
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap leading-none ${
                            inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                          }`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap leading-none ${
                            inc.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            inc.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm' :
                            inc.status === 'Assigned' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {inc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {inc.assignedSubOfficer && inc.assignedSubOfficer !== 'Unassigned' ? (
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                <span>Claimed: {inc.assignedSubOfficer}</span>
                              </div>
                              {inc.claimedAt && (
                                <span className="block text-[9px] text-slate-400 font-mono">
                                  FCFS at {inc.claimedAt}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                              <span>⚡ Open for Claim (FCFS)</span>
                            </span>
                          )}

                          {inc.resourceRequisition && (
                            <div className="mt-1">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${
                                inc.resourceRequisition.status?.includes('Approved')
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              }`}>
                                <span>🚨 {inc.resourceRequisition.resources?.length || 0} Fleet Units Req</span>
                              </span>
                            </div>
                          )}

                          {inc.consolidatedIncident && inc.consolidatedIncident !== 'Unlinked' && (
                            <span className="block text-[9px] text-slate-500 font-mono mt-0.5">
                              Linked: {inc.consolidatedIncident}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Govt Report Button beside the problem */}
                            <button
                              onClick={() => onOpenGovtReport(inc)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition"
                              title="Generate Humanized Govt Word Document Report"
                            >
                              <FileText className="w-3 h-3 text-amber-400" />
                              <span>Govt Report</span>
                            </button>

                            {/* Open & Manage Button */}
                            <button
                              onClick={() => onOpenManageModal(inc)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-sm"
                            >
                              <span>Open & Manage</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 3: LIVE CITY MAP
           ========================================================================= */}
        {(viewMode === 'all' || activeTab === 'map') && (
          <section 
            id="section-map"
            className={`space-y-3 rounded-2xl transition duration-500 ${
              highlightedSection === 'map' ? 'ring-2 ring-emerald-400 p-2 bg-emerald-950/20' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>City Disaster Perimeter Map (Specific Bengaluru Places)</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-800">
                    Live Coordinates
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click on any place name (Indiranagar, Bellandur, etc.) to view on-site photo evidence
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">
                  {zones.length} Active Hazard Perimeters
                </span>
              </div>
            </div>

            <div className="w-full">
              <RiskMap
                zones={zones}
                incidents={incidents}
                selectedZone={selectedZone}
                onSelectZone={(z) => setSelectedZone(z)}
                onSelectIncident={(inc) => {
                  const matchedZone = zones.find(z => z.id === inc.zoneId);
                  if (matchedZone) setSelectedZone(matchedZone);
                }}
                isEscalated={isEscalated}
                isAdminView={true}
              />
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 4: PRIORITY ISSUES (DYNAMIC RANKING & RISK SCORE FORMULA)
           ========================================================================= */}
        {(viewMode === 'all' || activeTab === 'priority') && (
          <section 
            id="section-priority"
            className={`space-y-4 rounded-2xl transition duration-500 ${
              highlightedSection === 'priority' ? 'ring-2 ring-amber-400 p-2 bg-amber-950/20' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <span>Dynamic Response Priorities & AI Risk Assessment Engine</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multi-factor risk scoring: 0.30×Hazard + 0.25×Pop + 0.20×Infra + 0.15×Access + 0.10×Facility
                </p>
              </div>

              <button
                onClick={onToggleEscalation}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  isEscalated 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' 
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{isEscalated ? 'Active Escalation Scenario' : 'Simulate Escalation'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dynamic Response Priorities List */}
              <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Real-Time Ranked Zones ({zones.length} Perimeters)
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-bold">Auto-Ranked</span>
                </div>

                <div className="space-y-2">
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        selectedZone?.id === zone.id
                          ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-400'
                          : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          zone.priorityRank === 1 ? 'bg-red-500 text-white shadow-md shadow-red-500/30' :
                          zone.priorityRank === 2 ? 'bg-orange-500 text-white' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          #{zone.priorityRank}
                        </span>
                        <div>
                          <div className="font-bold text-white text-xs">{zone.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {zone.hazard} • {zone.populationAffected?.toLocaleString()} Citizens
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${zone.riskLevel?.badgeClass}`}>
                          Score {zone.calculatedScore}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {zone.roadBlockages} Roads Blocked
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explainable AI ("Why This Zone?") */}
              <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Explainable AI Priority Assessment</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    Zone: {selectedZone?.name || 'Selected'}
                  </span>
                </div>

                {selectedZone && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{selectedZone.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-black text-[10px]">
                          Priority #{selectedZone.priorityRank}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-red-400">
                        ⚠️ {selectedZone.problemTitle || selectedZone.hazard}
                      </div>
                      <p className="text-[11px] text-slate-200 leading-relaxed bg-slate-950/70 p-2 rounded-lg border border-white/5">
                        "{selectedZone.problemDescription || whyExplanation?.summary || selectedZone.hazardDescription}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">Hazard Severity</span>
                        <strong className="text-white text-sm">{selectedZone.severity}/100</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">Population Impact</span>
                        <strong className="text-white text-sm">{selectedZone.populationAffected?.toLocaleString()}</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">Infrastructure Damage</span>
                        <strong className="text-white text-sm">{selectedZone.infrastructureDamage}%</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                        <span className="text-slate-400 block text-[10px]">Critical Facilities</span>
                        <strong className="text-white text-sm">{selectedZone.criticalFacilities} Hospital/Shelter</strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200">
                      <strong>AI Dispatch Recommendation:</strong> Dispatched {selectedZone.assignedResources?.join(', ') || 'Emergency Tactical Team'}.
                    </div>
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 5: RESOURCE FLEET (MANAGEMENT & ALLOCATION)
           ========================================================================= */}
        {(viewMode === 'all' || activeTab === 'resources') && (
          <section 
            id="section-resources"
            className={`space-y-4 rounded-2xl transition duration-500 ${
              highlightedSection === 'resources' ? 'ring-2 ring-blue-400 p-2 bg-blue-950/20' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <span>City Emergency Resource Fleet & Department Dispatch</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated prioritization and department equipment management across city zones
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                  Fleet Operational: 100%
                </span>
              </div>
            </div>

            {/* Emergency Fleet Inventory Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>🚑 Ambulances</span>
                  <span className="text-emerald-400 font-bold">ICU Ready</span>
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {allocationResult.inventoryRemaining.ambulances} <span className="text-xs text-slate-400 font-normal">/ 2 Free</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${(allocationResult.inventoryRemaining.ambulances / 2) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>🚒 Rescue Teams</span>
                  <span className="text-orange-400 font-bold">NDRF / SDRF</span>
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {allocationResult.inventoryRemaining.rescueTeams} <span className="text-xs text-slate-400 font-normal">/ 3 Free</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full" 
                    style={{ width: `${(allocationResult.inventoryRemaining.rescueTeams / 3) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>🚚 Water Tankers</span>
                  <span className="text-cyan-400 font-bold">BWSSB 10KL</span>
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {allocationResult.inventoryRemaining.waterTankers} <span className="text-xs text-slate-400 font-normal">/ 2 Free</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-cyan-500 h-1.5 rounded-full" 
                    style={{ width: `${(allocationResult.inventoryRemaining.waterTankers / 2) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>🏗️ Heavy Vehicles</span>
                  <span className="text-amber-400 font-bold">Earthmovers</span>
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {allocationResult.inventoryRemaining.heavyVehicles} <span className="text-xs text-slate-400 font-normal">/ 1 Free</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full" 
                    style={{ width: `${(allocationResult.inventoryRemaining.heavyVehicles / 1) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Department Fleet & Officer Allocation Table */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Municipal Department Resource Assignments</span>
                </h3>
                <span className="text-[10px] text-cyan-400 font-bold">8 Municipal Divisions</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 text-[10px] font-bold uppercase">
                      <th className="py-2.5 px-3">DEPARTMENT</th>
                      <th className="py-2.5 px-3">ASSIGNED FLEET EQUIPMENT</th>
                      <th className="py-2.5 px-3">ACTIVE JURISDICTION</th>
                      <th className="py-2.5 px-3">DISPATCH READINESS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-slate-950/60">
                    {MUNICIPAL_DEPARTMENTS.slice(0, 6).map((dept, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="py-3 px-3 font-semibold text-white">
                          {dept}
                        </td>
                        <td className="py-3 px-3 text-cyan-300 font-mono text-[11px]">
                          {idx === 0 ? 'Road Rollers, Asphalt Trucks, Barricades' :
                           idx === 1 ? 'Compactor Trucks, Waste Shredders' :
                           idx === 2 ? 'Emergency Water Tankers (10,000L), Jetting Units' :
                           idx === 3 ? 'Bucket Cranes, Generator Vans, Pole Repair Units' :
                           idx === 4 ? 'Quick Inflatable Boats, Water Rescue Squads' :
                           'Low-Floor Evacuation Buses, Route Diversions'}
                        </td>
                        <td className="py-3 px-3 text-slate-300 text-xs">
                          {zones[idx % zones.length]?.name || 'Central Bangalore'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Deployed & Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Zone-by-Zone Dynamic Allocation Matrix */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Automated Allocation Matrix by Priority Rank
              </h3>

              <div className="space-y-2 text-xs">
                {zones.map((zone) => (
                  <div key={zone.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400">#{zone.priorityRank}</span>
                      <strong className="text-white">{zone.name}</strong>
                      <span className="text-slate-400">({zone.hazard})</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {zone.assignedResources && zone.assignedResources.length > 0 ? (
                        zone.assignedResources.map((res, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-200 border border-blue-500/30 text-[10px] font-medium">
                            {res}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                          Standby Monitoring Unit
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

      </main>

    </div>
  );
}
