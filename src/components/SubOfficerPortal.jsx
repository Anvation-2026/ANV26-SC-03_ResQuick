import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HardHat, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  PhoneCall, 
  Send, 
  Layers, 
  Activity, 
  Flame, 
  Droplets, 
  ChevronRight, 
  Sparkles, 
  Lock, 
  Check, 
  Wrench, 
  FileText, 
  ArrowRight, 
  AlertOctagon, 
  Radio, 
  PlusCircle, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { RiskMap } from './RiskMap';
import { WeatherForecastWidget } from './WeatherForecastWidget';
import { SUB_OFFICERS_LIST } from '../data/resourcesData';
import { playDispatchPing } from '../utils/soundEffects';

export function SubOfficerPortal({
  currentOfficer,
  incidents = [],
  zones = [],
  isEscalated = false,
  onUpdateIncident,
  onSwitchEngineer,
  onOpenHelplinesModal,
  onSwitchToCitizen,
  onSwitchToAdmin
}) {
  const [selectedZone, setSelectedZone] = useState(zones[0] || null);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'my_assignments' | 'map'
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [successMessage, setSuccessMessage] = useState('');

  // Selected incident for resource requisition modal / inline drawer
  const [activeRequisitionIncidentId, setActiveRequisitionIncidentId] = useState(null);
  const [requisitionResources, setRequisitionResources] = useState([]);
  const [urgentMeasuresText, setUrgentMeasuresText] = useState('');

  // Progress update input for claimed incidents
  const [progressNotes, setProgressNotes] = useState({});

  const officerName = currentOfficer?.name || 'Er. Sudeep M';

  // 1. Incidents claimed by THIS sub-officer
  const myAssignedIncidents = incidents.filter(
    inc => inc.assignedSubOfficer?.toLowerCase().trim() === officerName.toLowerCase().trim()
  );

  // 2. Open incidents available in the city queue
  const openQueueIncidents = incidents.filter(inc => {
    if (filterSeverity === 'All') return true;
    return inc.severity === filterSeverity;
  });

  // Severity-based recommended tactical resources
  const getSeverityResourceSuggestions = (severity, category) => {
    if (severity === 'CRITICAL' || category === 'Flood') {
      return [
        '💧 Submersible Dewatering Sludge Pump (50 HP) x2',
        '🚤 NDRF Inflatable Tactical Rescue Boat x1',
        '🚑 Critical Care Ambulance (108 ALS Unit)',
        '⚡ BESCOM 11kV Substation Line Isolation Team',
        '🧱 Polypropylene Sandbags (x100 Batch)'
      ];
    } else if (severity === 'HIGH' || category === 'Road Blockage' || category === 'Debris Collapse') {
      return [
        '🚜 Hydraulic Heavy Excavator / Earthmover #1',
        '🚛 16-Ton Debris Tipper Dump Truck x2',
        '🚧 High-Visibility Traffic Diversion Barricades (x20)',
        '🦺 Heavy Shoring Structural Props Squad'
      ];
    } else {
      return [
        '🛣️ Rapid Bitumen Hot-Mix Cold Patch Road Unit',
        '🚿 High-Pressure Sewer Jetting Machine',
        '⚠️ Fluorescent Traffic Cones & Beacon Flares (x15)',
        '🚛 Municipal Utility Crew Van #4'
      ];
    }
  };

  // Severity-based recommended urgent measures
  const getSeverityUrgentMeasures = (severity, category) => {
    if (severity === 'CRITICAL' || category === 'Flood') {
      return 'Immediate power grid de-energization to prevent electrocution near flooded transformer. Cordon off 100ft road and establish elevated ambulance bypass route to City General Hospital.';
    } else if (severity === 'HIGH') {
      return 'Halt arterial traffic ingress; divert heavy vehicles to outer ring bypass. Secure unstable retaining structure before debris removal to prevent secondary collapse.';
    } else {
      return 'Deploy warning barricades immediately around hazardous roadway fracture. Initiate rapid resurfacing under dry weather window.';
    }
  };

  // FIRST-COME, FIRST-SERVED CLAIM HANDLER
  const handleClaimIncident = (inc) => {
    // If already claimed by another officer, prevent claim
    if (inc.assignedSubOfficer && inc.assignedSubOfficer !== 'Unassigned' && inc.assignedSubOfficer !== 'Open for Sub-Officer Claim' && inc.assignedSubOfficer !== officerName) {
      alert(`First-Come, First-Served Rule: This incident has already been claimed by ${inc.assignedSubOfficer} and cannot be accepted by other officers.`);
      return;
    }

    playDispatchPing();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update timeline steps
    const updatedTimeline = (inc.timeline || []).map(step => {
      if (step.step === 'Submitted' || step.step === 'Verified') {
        return { ...step, status: 'done', time: step.time === 'Pending' ? nowTime : step.time };
      }
      if (step.step === 'Assigned') {
        return {
          ...step,
          status: 'done',
          time: nowTime,
          note: `Responsibility accepted by Field Lead ${officerName} (${currentOfficer?.roleTitle || 'Field Engineer'}). Live field command active.`
        };
      }
      if (step.step === 'In Progress' && inc.status === 'Submitted') {
        return {
          ...step,
          status: 'done',
          time: nowTime,
          note: `Field teams mobilized to site under direction of Sub-Officer ${officerName}.`
        };
      }
      return step;
    });

    const updated = {
      ...inc,
      status: 'In Progress',
      assignedSubOfficer: officerName,
      claimedBy: officerName,
      claimedAt: nowTime,
      assignedOfficerPhone: currentOfficer?.phone || '9448067890',
      officerProgressNote: `Field lead ${officerName} accepted direct responsibility under first-come, first-served dispatch protocol.`,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
    setSuccessMessage(`✓ Responsibility for ${inc.id} successfully locked and claimed by you!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // COMMIT PROGRESS UPDATE HANDLER (e.g. In Progress -> Resolved)
  const handleCommitStatusStep = (inc, newStatus) => {
    playDispatchPing();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const note = progressNotes[inc.id] || `Operational status updated to ${newStatus} by Sub-Officer ${officerName}.`;

    const updatedTimeline = (inc.timeline || []).map(step => {
      if (newStatus === 'In Progress' && (step.step === 'Submitted' || step.step === 'Verified' || step.step === 'Assigned' || step.step === 'In Progress')) {
        return { ...step, status: 'done', time: step.time === 'Pending' ? nowTime : step.time, note: step.step === 'In Progress' ? note : step.note };
      }
      if (newStatus === 'Resolved') {
        return { ...step, status: 'done', time: step.time === 'Pending' ? nowTime : step.time, note: step.step === 'Resolved' ? (note || 'All restoration and public safety clearance verified on-site.') : step.note };
      }
      return step;
    });

    const updated = {
      ...inc,
      status: newStatus,
      officerProgressNote: note,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
    setSuccessMessage(`✓ Status for ${inc.id} updated to "${newStatus}" and synced to Admin & Citizen!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // OPEN REQUISITION DESK FOR AN INCIDENT
  const handleOpenRequisition = (inc) => {
    setActiveRequisitionIncidentId(inc.id);
    const defaults = getSeverityResourceSuggestions(inc.severity, inc.issue || inc.category);
    setRequisitionResources(defaults);
    setUrgentMeasuresText(getSeverityUrgentMeasures(inc.severity, inc.issue || inc.category));
  };

  // SUBMIT RESOURCE REQUISITION TO ADMIN COMMAND
  const handleSubmitRequisition = (inc) => {
    playDispatchPing();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const requisitionData = {
      requestedBy: officerName,
      officerPhone: currentOfficer?.phone || '9448067890',
      officerDept: currentOfficer?.department || 'Municipal Engineering Corps',
      severity: inc.severity,
      timestamp: nowTime,
      resources: requisitionResources,
      urgentMeasures: urgentMeasuresText,
      status: 'Pending Admin Approval'
    };

    const updated = {
      ...inc,
      resourceRequisition: requisitionData,
      officerProgressNote: `Tactical Resource Requisition (${requisitionResources.length} units) and urgent safety measures dispatched to Admin Command by ${officerName}.`
    };

    onUpdateIncident(updated);
    setActiveRequisitionIncidentId(null);
    setSuccessMessage(`🚨 Resource Requisition for ${inc.id} dispatched to Admin Command Hub!`);
    setTimeout(() => setSuccessMessage(''), 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-6 animate-in fade-in">
      
      {/* 0. LEFT VERTICAL SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-72 shrink-0 space-y-4 lg:sticky lg:top-20 self-start">
        
        {/* Officer Identity Card */}
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
              ⚡ FIELD ENGINEER
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <HardHat className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-white truncate">
                {officerName}
              </h3>
              <p className="text-[11px] text-emerald-400 font-mono">
                ID: {currentOfficer?.id || 'ENG-01'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentOfficer?.roleTitle || 'Junior Engineer'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
            <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{currentOfficer?.department || 'Road Maintenance & Traffic'}</span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-1.5 font-mono">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>+91 {currentOfficer?.phone || '9448067890'}</span>
            </div>
            <div className="text-[11px] text-cyan-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{currentOfficer?.zone || 'All City Zones'}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">My Active Leads:</span>
            <span className="text-emerald-400 font-black text-sm">{myAssignedIncidents.length}</span>
          </div>

          {/* Quick Active Field Engineer Switcher (5 Engineers Pool) */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Switch Active Engineer:</span>
              <span className="text-emerald-400 font-mono text-[9px]">5 Engineers</span>
            </label>
            <select
              value={currentOfficer?.id || 'ENG-01'}
              onChange={(e) => onSwitchEngineer && onSwitchEngineer(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-200 text-xs font-bold focus:outline-none focus:border-emerald-400 cursor-pointer transition shadow-inner"
            >
              {SUB_OFFICERS_LIST.map(eng => (
                <option key={eng.id} value={eng.id} className="bg-slate-900 text-white">
                  {eng.name} ({eng.department.split(' ')[0]})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1 italic">
              Switch engineers to test First-Come, First-Served locking between field leads!
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-1.5 text-xs font-bold">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 mb-2">
            Field Command Menu
          </div>

          <button
            onClick={() => setActiveTab('queue')}
            className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition ${
              activeTab === 'queue'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Incident Dispatch Queue</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-900/80">
              {incidents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('my_assignments')}
            className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition ${
              activeTab === 'my_assignments'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>My Active Field Leads</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-900/80 text-emerald-400">
              {myAssignedIncidents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition ${
              activeTab === 'map'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Live City GIS Hazard Map</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300">GPS Live</span>
          </button>
        </div>

        {/* Emergency Quick Hotlines */}
        <div className="p-3.5 rounded-2xl glass-panel border border-rose-500/30 bg-rose-950/20 space-y-2 text-xs">
          <div className="text-[10px] font-black uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>Emergency Tactical Radio</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Central Command:</span>
              <span className="font-mono text-white font-bold">112</span>
            </div>
            <div className="flex justify-between">
              <span>NDRF Control Room:</span>
              <span className="font-mono text-white font-bold">1078</span>
            </div>
            <div className="flex justify-between">
              <span>BBMP Flood Cell:</span>
              <span className="font-mono text-white font-bold">080-22221188</span>
            </div>
          </div>
        </div>

        {/* Portal Switcher Buttons */}
        <div className="space-y-1.5 pt-1">
          <button
            onClick={onSwitchToCitizen}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-bold flex items-center justify-between transition border border-white/10"
          >
            <span>Switch to Citizen Portal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onSwitchToAdmin}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 text-xs font-bold flex items-center justify-between transition border border-white/10"
          >
            <span>Admin Command Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Banner with First-Come First-Served Rule Highlight */}
        <div className="relative rounded-2xl overflow-hidden glass-panel border border-emerald-500/30 p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60 shadow-2xl">
          <div className="relative z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                FIRST-COME, FIRST-SERVED CLAIMING PROTOCOL ACTIVE
              </span>
              <span className="text-slate-400">
                Operational Terminal: {currentOfficer?.department || 'Field Corps'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Field Command: {officerName}</span>
              <span className="text-2xl">👷‍♂️</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Inspect open civic complaints, <strong>claim direct lead responsibility</strong> under the FCFS protocol, dispatch tactical resource requisitions to Admin Command, and broadcast live field progress updates to citizens.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Single Officer Responsibility Lock</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Severity-Based Resource Requisitions</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1.5 text-blue-300">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Live GIS Coordinate Tracking</span>
              </div>
            </div>
          </div>

          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* =====================================================================
            SECTION 1: DISPATCH QUEUE (FIRST-COME, FIRST-SERVED ACCEPTANCE)
           ===================================================================== */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>Open Grievances & Incident Dispatch Queue</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">
                    {openQueueIncidents.length} Issues
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Accept responsibility to become the exclusive lead sub-officer in charge. First-come, first-served rule applies.
                </p>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1.5">
                {['All', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                      filterSeverity === sev
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                        : 'bg-slate-900 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaints Grid */}
            <div className="grid grid-cols-1 gap-4">
              {openQueueIncidents.map(inc => {
                const isClaimedByMe = inc.assignedSubOfficer?.toLowerCase().trim() === officerName.toLowerCase().trim();
                const isClaimedByOther = inc.assignedSubOfficer && inc.assignedSubOfficer !== 'Unassigned' && inc.assignedSubOfficer !== 'Open for Sub-Officer Claim' && !isClaimedByMe;
                const isUnclaimed = !inc.assignedSubOfficer || inc.assignedSubOfficer === 'Unassigned' || inc.assignedSubOfficer === 'Open for Sub-Officer Claim';

                return (
                  <div 
                    key={inc.id}
                    className={`p-5 rounded-2xl glass-panel border transition duration-300 ${
                      isClaimedByMe 
                        ? 'border-emerald-500/60 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : isClaimedByOther
                        ? 'border-white/10 opacity-75 bg-slate-950/40'
                        : 'border-white/15 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3 pb-3 border-b border-white/10">
                      
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                          {inc.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                          'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                        }`}>
                          {inc.severity}
                        </span>
                        <span className="text-xs font-bold text-white">
                          • {inc.issue || inc.title}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          (Reported: {inc.date || 'Today'} at {inc.time || '10:00 AM'})
                        </span>
                      </div>

                      {/* Claim Status Badge */}
                      <div className="shrink-0">
                        {isClaimedByMe ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">
                            <Check className="w-3.5 h-3.5" />
                            <span>Claimed by You (Active Lead)</span>
                          </span>
                        ) : isClaimedByOther ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-white/10">
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Locked: Claimed by {inc.assignedSubOfficer}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 animate-pulse">
                            <span>⚡ Open for Field Lead Claim (FCFS)</span>
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Middle: Details & Photo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Left: Location & Citizen Voice Translation */}
                      <div className="md:col-span-2 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                          <span className="font-medium">{inc.location}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Official Citizen Translated Report:
                          </div>
                          <div className="text-xs text-white font-medium">
                            "{inc.translatedEnglishText || inc.description}"
                          </div>
                          {inc.originalVoiceText && (
                            <div className="text-[11px] text-slate-400 italic">
                              Spoken in {inc.originalLanguageFull || inc.originalLanguage}: "{inc.originalVoiceText}"
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>Reporter: <strong className="text-slate-300">{inc.reporterName}</strong></span>
                          <span>•</span>
                          <span>Phone: <strong className="font-mono text-cyan-300">{inc.reporterPhone}</strong></span>
                        </div>
                      </div>

                      {/* Right: Media Thumbnail */}
                      <div className="space-y-2">
                        {inc.mediaUrl ? (
                          <div className="h-24 rounded-xl overflow-hidden border border-white/15 relative group">
                            <img 
                              src={inc.mediaUrl} 
                              alt="Incident Proof" 
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                            />
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] text-emerald-400 font-mono">
                              ✓ Verified On-Site
                            </span>
                          </div>
                        ) : (
                          <div className="h-24 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-xs text-slate-500">
                            No photo attached
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                      
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Current Status: <strong className="text-white">{inc.status}</strong></span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* FIRST-COME, FIRST-SERVED ACCEPTANCE BUTTON */}
                        {isUnclaimed ? (
                          <button
                            onClick={() => handleClaimIncident(inc)}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>⚡ Accept Responsibility & Claim Lead</span>
                          </button>
                        ) : isClaimedByMe ? (
                          <button
                            onClick={() => setActiveTab('my_assignments')}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                          >
                            <span>Manage in Active Assignments</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 text-slate-500 border border-white/10 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                            title="Another sub-officer accepted this complaint under first-come first-served protocol"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Locked (Claimed by {inc.assignedSubOfficer})</span>
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            SECTION 2: MY ACTIVE FIELD ASSIGNMENTS & RESOURCE REQUISITION DESK
           ===================================================================== */}
        {activeTab === 'my_assignments' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>My Active Field Assignments & Operational Desk</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-mono">
                  {myAssignedIncidents.length} Under Your Command
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Update step-by-step progress, write field inspection notes, and requisition tactical emergency resources from Admin Command.
              </p>
            </div>

            {myAssignedIncidents.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl glass-panel border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <HardHat className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  You Have Not Claimed Any Incidents Yet
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Switch to the "Incident Dispatch Queue" above and click "Accept Responsibility" on an open complaint to become its lead field engineer.
                </p>
                <button
                  onClick={() => setActiveTab('queue')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition inline-flex items-center gap-1.5"
                >
                  <span>Go to Open Dispatch Queue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {myAssignedIncidents.map(inc => (
                  <div 
                    key={inc.id}
                    className="p-5 rounded-2xl glass-panel border border-emerald-500/40 bg-slate-900/90 space-y-5 shadow-xl"
                  >
                    
                    {/* Header: ID, Severity & Location */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-black text-cyan-400">
                            {inc.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                          }`}>
                            {inc.severity}
                          </span>
                          <span className="text-xs text-slate-300 font-bold">
                            {inc.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span>{inc.location}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                          {inc.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          Claimed At: {inc.claimedAt || '10:00 AM'}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Live Status Progression */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="flex items-center gap-1.5 text-cyan-400 uppercase tracking-wider text-[11px]">
                          <Activity className="w-4 h-4" />
                          <span>Update Field Progress & Timeline (Syncs Live to Citizen & Admin)</span>
                        </span>
                      </div>

                      {/* 1-Click Status Stepper */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['Verified', 'Assigned', 'In Progress', 'Resolved'].map(st => (
                          <button
                            key={st}
                            onClick={() => handleCommitStatusStep(inc, st)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                              inc.status === st
                                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                                : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {inc.status === st && <Check className="w-3.5 h-3.5 text-white" />}
                            <span>Set: {st}</span>
                          </button>
                        ))}
                      </div>

                      {/* Officer On-Site Inspection Note */}
                      <div className="pt-2 space-y-1.5">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Officer Field Inspection Log Note:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={progressNotes[inc.id] || inc.officerProgressNote || ''}
                            onChange={(e) => setProgressNotes({ ...progressNotes, [inc.id]: e.target.value })}
                            placeholder="e.g. Submersible pump installed at 100ft road. Flood level receding 15cm/hr."
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                          />
                          <button
                            onClick={() => handleCommitStatusStep(inc, inc.status || 'In Progress')}
                            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shrink-0"
                          >
                            Commit Note
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* TACTICAL RESOURCE & URGENT MEASURES REQUISITION */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-950 to-slate-950 border border-cyan-500/30 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-cyan-400" />
                            <span>Resource Requisition & Urgent Measures to Admin Command</span>
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Requisition specialized fleet, personnel, and urgent protective measures according to severity.
                          </p>
                        </div>

                        <button
                          onClick={() => handleOpenRequisition(inc)}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 font-bold text-xs transition flex items-center gap-1.5 shrink-0"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Configure Requisition</span>
                        </button>
                      </div>

                      {/* Display existing requisition if submitted */}
                      {inc.resourceRequisition && (
                        <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-cyan-300">
                            <span>✓ Requisition Dispatched to Admin (Status: {inc.resourceRequisition.status})</span>
                            <span className="font-mono text-[11px] text-slate-400">{inc.resourceRequisition.timestamp}</span>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Requested Tactical Fleet:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {inc.resourceRequisition.resources?.map((res, rIdx) => (
                                <span key={rIdx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-200 text-[11px]">
                                  {res}
                                </span>
                              ))}
                            </div>
                          </div>

                          {inc.resourceRequisition.urgentMeasures && (
                            <div className="text-[11px] text-amber-200 pt-1">
                              <strong>Urgent Measures:</strong> {inc.resourceRequisition.urgentMeasures}
                            </div>
                          )}
                        </div>
                      )}

                      {/* INLINE REQUISITION MODAL / DRAWER */}
                      {activeRequisitionIncidentId === inc.id && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-400/50 space-y-3.5 animate-in fade-in">
                          <div className="flex items-center justify-between text-xs font-bold text-white border-b border-white/10 pb-2">
                            <span>Configure Emergency Requisition for {inc.id}</span>
                            <button 
                              onClick={() => setActiveRequisitionIncidentId(null)}
                              className="text-slate-400 hover:text-white text-xs"
                            >
                              ✕ Close
                            </button>
                          </div>

                          {/* Resource Checklist */}
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                              Select Required Resources (Severity: {inc.severity}):
                            </label>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {getSeverityResourceSuggestions(inc.severity, inc.issue || inc.category).map((res, idx) => {
                                const isChecked = requisitionResources.includes(res);
                                return (
                                  <label 
                                    key={idx}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-200 cursor-pointer hover:bg-slate-850"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {
                                        if (isChecked) {
                                          setRequisitionResources(requisitionResources.filter(r => r !== res));
                                        } else {
                                          setRequisitionResources([...requisitionResources, res]);
                                        }
                                      }}
                                      className="rounded bg-slate-800 border-white/20 text-cyan-500 focus:ring-0"
                                    />
                                    <span>{res}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Urgent Measures Input */}
                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                              Urgent Safety & Tactical Measures Required:
                            </label>
                            <textarea
                              rows={2}
                              value={urgentMeasuresText}
                              onChange={(e) => setUrgentMeasuresText(e.target.value)}
                              placeholder="Specify urgent electrical isolation, traffic diversions, or public evacuation measures..."
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                            />
                          </div>

                          {/* Dispatch Requisition Button */}
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setActiveRequisitionIncidentId(null)}
                              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSubmitRequisition(inc)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>🚨 Dispatch Requisition to Admin Command</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            SECTION 3: LIVE CITY GIS HAZARD MAP (Directly in Sub-Officer Portal)
           ===================================================================== */}
        {(activeTab === 'map' || activeTab === 'my_assignments') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Live Municipal GIS Hazard & Ingress Map</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
                    Field View
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect incident coordinates, blocked road ingress points, and verified citizen proof photos in real time.
                </p>
              </div>
            </div>

            <RiskMap
              zones={zones}
              incidents={incidents}
              selectedZone={selectedZone}
              onSelectZone={(z) => setSelectedZone(z)}
              isEscalated={isEscalated}
              isAdminView={true}
            />
          </div>
        )}

      </main>

    </div>
  );
}
export default SubOfficerPortal;
