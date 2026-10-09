import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Camera, 
  Upload, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Save
} from 'lucide-react';
import { MUNICIPAL_DEPARTMENTS, STATUS_OPTIONS } from '../data/sampleIncidents';
import { SUB_OFFICERS_LIST } from '../data/resourcesData';
import { playDispatchPing } from '../utils/soundEffects';

export function ApplicationManageModal({
  isOpen,
  onClose,
  incident,
  onUpdateIncident,
  onOpenGovtReport
}) {
  if (!isOpen || !incident) return null;

  const DISPATCHABLE_RESOURCES = [
    { id: 'ambulance', label: '🚑 Critical Care Ambulance (108 Triage Unit)' },
    { id: 'boat', label: '🚤 NDRF Tactical Inflatable Rescue Boat' },
    { id: 'excavator', label: '🚜 Hydraulic Heavy Excavator / Earthmover' },
    { id: 'pump', label: '💧 High-Capacity Dewatering Sludge Pump (50 HP)' },
    { id: 'tanker', label: '🚛 Potable Drinking Water Tanker (10,000L)' },
    { id: 'generator', label: '⚡ BESCOM Emergency Mobile Power Generator' },
    { id: 'volunteers', label: '🦺 Civic Rapid Disaster Volunteer Squad (15 Personnel)' }
  ];

  const defaultSubOfficer = SUB_OFFICERS_LIST[0].name;

  const [currentStatus, setCurrentStatus] = useState(incident.status || 'Assigned');
  const [assignedDept, setAssignedDept] = useState(incident.assignedDepartment || MUNICIPAL_DEPARTMENTS[0]);
  const [subOfficer, setSubOfficer] = useState(incident.assignedSubOfficer || defaultSubOfficer);
  const [selectedResources, setSelectedResources] = useState(incident.dispatchedResources || [
    '💧 High-Capacity Dewatering Sludge Pump (50 HP)',
    '🚑 Critical Care Ambulance (108 Triage Unit)'
  ]);
  const [fieldOfficer, setFieldOfficer] = useState(incident.assignedOfficer || defaultSubOfficer);
  const [progressNote, setProgressNote] = useState(incident.officerProgressNote || '');
  const [consolidatedLink, setConsolidatedLink] = useState(incident.consolidatedIncident || 'Unlinked');
  const [workProofPreview, setWorkProofPreview] = useState(null);
  const [isCommitted, setIsCommitted] = useState(false);
  const [timeline, setTimeline] = useState(incident.timeline || []);

  React.useEffect(() => {
    if (incident) {
      setCurrentStatus(incident.status || 'Assigned');
      setAssignedDept(incident.assignedDepartment || MUNICIPAL_DEPARTMENTS[0]);
      setSubOfficer(incident.assignedSubOfficer || defaultSubOfficer);
      setSelectedResources(incident.dispatchedResources || [
        '💧 High-Capacity Dewatering Sludge Pump (50 HP)',
        '🚑 Critical Care Ambulance (108 Triage Unit)'
      ]);
      setFieldOfficer(incident.assignedOfficer || defaultSubOfficer);
      setProgressNote(incident.officerProgressNote || '');
      setConsolidatedLink(incident.consolidatedIncident || 'Unlinked');
      setTimeline(incident.timeline || []);
    }
  }, [incident]);

  // 1-Click Approve Requisition from Field Engineer
  const handleApproveRequisition = () => {
    playDispatchPing();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const requested = incident.resourceRequisition?.resources || [];
    const merged = Array.from(new Set([...selectedResources, ...requested]));
    setSelectedResources(merged);

    const updatedRequisition = {
      ...incident.resourceRequisition,
      status: 'Approved & Dispatched by Admin',
      approvedAt: nowTime
    };

    const newNote = `Admin Command authorized & dispatched tactical resource requisition (${requested.length} units) requested by Sub-Officer ${incident.resourceRequisition?.requestedBy || subOfficer}.`;
    setProgressNote(newNote);

    const updatedTimeline = (timeline || []).map(step => {
      if (step.step === 'Assigned' || step.step === 'In Progress') {
        return {
          ...step,
          note: `${step.note || ''} [Resource Requisition Authorized by Admin Hub]`
        };
      }
      return step;
    });

    const updated = {
      ...incident,
      resourceRequisition: updatedRequisition,
      dispatchedResources: merged,
      officerProgressNote: newNote,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
    setIsCommitted(true);
    setTimeout(() => setIsCommitted(false), 3000);
  };

  const toggleResource = (resourceLabel) => {
    if (selectedResources.includes(resourceLabel)) {
      setSelectedResources(selectedResources.filter(r => r !== resourceLabel));
    } else {
      setSelectedResources([...selectedResources, resourceLabel]);
    }
  };

  const handleWorkProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWorkProofPreview(URL.createObjectURL(file));
    }
  };

  const handleCommitUpdate = (e) => {
    e.preventDefault();
    playDispatchPing();

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedTimeline = [...timeline];
    
    // Status progression: mark corresponding steps as done
    if (currentStatus === 'Verified') {
      updatedTimeline = updatedTimeline.map(s => {
        if (s.step === 'Submitted' || s.step === 'Verified') {
          return { ...s, status: 'done', time: s.time === 'Pending' ? nowTime : s.time };
        }
        return s;
      });
    } else if (currentStatus === 'Assigned') {
      updatedTimeline = updatedTimeline.map(s => {
        if (s.step === 'Submitted' || s.step === 'Verified') {
          return { ...s, status: 'done', time: s.time === 'Pending' ? nowTime : s.time };
        }
        if (s.step === 'Assigned') {
          return { 
            ...s, 
            status: 'done', 
            time: nowTime, 
            note: `Assigned to ${assignedDept}. Sub-Officer ${subOfficer} assigned.` 
          };
        }
        return s;
      });
    } else if (currentStatus === 'In Progress') {
      updatedTimeline = updatedTimeline.map(s => {
        if (s.step === 'Submitted' || s.step === 'Verified' || s.step === 'Assigned') {
          return { ...s, status: 'done', time: s.time === 'Pending' ? nowTime : s.time };
        }
        if (s.step === 'In Progress') {
          return {
            ...s,
            status: 'done',
            time: nowTime,
            note: progressNote || `Sub-Officer ${subOfficer} mobilized with ${selectedResources.length} tactical resources on site.`
          };
        }
        return s;
      });
    } else if (currentStatus === 'Resolved') {
      updatedTimeline = updatedTimeline.map(s => {
        if (s.step === 'Resolved') {
          return {
            ...s,
            status: 'done',
            time: nowTime,
            note: progressNote || `Operations successfully resolved by Sub-Officer ${subOfficer}. Public safety verified.`
          };
        }
        return { ...s, status: 'done', time: s.time === 'Pending' ? nowTime : s.time };
      });
    }

    setTimeline(updatedTimeline);

    const updatedIncident = {
      ...incident,
      status: currentStatus,
      assignedDepartment: assignedDept,
      assignedOfficer: fieldOfficer,
      assignedSubOfficer: subOfficer,
      dispatchedResources: selectedResources,
      officerProgressNote: progressNote,
      consolidatedIncident: consolidatedLink,
      timeline: updatedTimeline
    };

    onUpdateIncident(updatedIncident);
    setIsCommitted(true);
    setTimeout(() => setIsCommitted(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl glass-modal p-5 sm:p-7 border border-white/20 text-slate-100 shadow-2xl my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header matching Screenshot 5 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-black text-white">
                Application Review: <span className="font-mono text-cyan-400">{incident.id}</span>
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                incident.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                incident.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
              }`}>
                Severity: {incident.severity.toLowerCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 whitespace-nowrap inline-flex items-center">
                {currentStatus || incident.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Municipal Grievance Core • Automated Intelligence Assessment & Action Workflow
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenGovtReport(incident)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Govt Report</span>
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-h-[75vh] overflow-y-auto pr-1">
          
          {/* LEFT COLUMN: Problem Statements & Citizen Info */}
          <div className="space-y-4">
            
            {/* English Problem Statement (For Municipal Officers) */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-1">
                <span>English Problem Statement (For Municipal Officers)</span>
                <span className="text-[10px] text-slate-400 font-mono">AI Translated • {incident.originalLanguage} → English</span>
              </div>
              <p className="text-sm text-white font-medium italic bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                "{incident.translatedEnglishText}"
              </p>
            </div>

            {/* Original Citizen Voice Submission */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
                <span>Original Citizen Voice Submission ({incident.originalLanguage})</span>
                <span className="text-[10px] text-slate-400">Verbatim citizen input</span>
              </div>
              <p className="text-sm text-cyan-200 font-medium italic bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                "{incident.originalVoiceText}"
              </p>
            </div>

            {/* AI Intelligence Assessment */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Intelligence Assessment ({incident.aiAssessment?.confidence || '95%'} Confidence)</span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>• <strong>Domain:</strong> {incident.aiAssessment?.domain || incident.domain}</div>
                <div>• <strong>Issue:</strong> {incident.aiAssessment?.issue || incident.issue}</div>
                <div>• <strong>Assessed Severity:</strong> {incident.aiAssessment?.assessedSeverity || incident.severity}</div>
                <div>• <strong>Recommended Dept:</strong> {incident.aiAssessment?.recommendedDept || incident.assignedDepartment}</div>
              </div>
            </div>

            {/* Reported Address & Coordinates */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-1 text-xs">
              <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                Reported Address
              </div>
              <div className="text-white font-medium flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{incident.location}</span>
              </div>
              <div className="text-[11px] text-cyan-400 font-mono pl-5">
                GPS Coordinates: {incident.coordinates ? `${incident.coordinates[0]}, ${incident.coordinates[1]}` : '12.7303, 77.7096'}
              </div>
            </div>

            {/* Citizen Information */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs space-y-1.5">
              <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                Citizen Information
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Name: <strong className="text-white">{incident.reporterName}</strong></div>
                <div>Contact: <strong className="text-cyan-400 font-mono">{incident.reporterPhone}</strong></div>
              </div>
              <div className="text-[11px] text-slate-400">
                Reported: {incident.date}, {incident.time}
              </div>
            </div>

            {/* Photo Evidence Attached & AI Image Forensics */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  Photo Evidence Attached
                </span>
                {incident.mediaUrl && (
                  <a 
                    href={incident.mediaUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <span>View Full</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {incident.mediaUrl && (
                <div className="h-32 rounded-lg overflow-hidden border border-white/15">
                  <img src={incident.mediaUrl} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200">
                <strong className="text-emerald-400 block mb-0.5">AI Image Forensics: {incident.forensics?.status || 'Verified Real On-Site Photo'}</strong>
                <span>{incident.forensics?.details || 'Natural daylight lighting, realistic material fracture/surface degradation, and non-synthetic pixel continuity verified.'}</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Administrative Actions & Status Progression (Screenshot 5) */}
          <div className="space-y-4">

            {/* LIVE SUB-OFFICER FIELD REQUISITION & URGENT MEASURES ALERT */}
            {incident.resourceRequisition && (
              <div className="p-4 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-black uppercase text-rose-300 tracking-wider">
                      🚨 Field Requisition from Sub-Officer
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    incident.resourceRequisition.status?.includes('Approved')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  }`}>
                    {incident.resourceRequisition.status || 'Pending Admin Approval'}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-0.5">
                  <div>Officer: <strong className="text-white">{incident.resourceRequisition.requestedBy}</strong> ({incident.resourceRequisition.officerDept})</div>
                  <div>Phone: <span className="font-mono text-cyan-300">📞 {incident.resourceRequisition.officerPhone}</span> • Time: <span className="font-mono text-slate-400">{incident.resourceRequisition.timestamp}</span></div>
                </div>

                {/* Requested Resources */}
                <div>
                  <div className="text-[11px] font-bold text-slate-300 mb-1">
                    Requested Tactical Fleet Resources:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(incident.resourceRequisition.resources || []).map((res, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-slate-950 border border-rose-400/30 text-[11px] text-rose-200 font-semibold shadow-sm">
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Urgent Measures */}
                {incident.resourceRequisition.urgentMeasures && (
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-white/10 text-xs">
                    <div className="text-[10px] uppercase font-bold text-amber-400 mb-0.5">
                      ⚠️ Urgent Field Safety Measures:
                    </div>
                    <p className="text-slate-200 italic">
                      "{incident.resourceRequisition.urgentMeasures}"
                    </p>
                  </div>
                )}

                {/* 1-Click Admin Approval Button */}
                {incident.resourceRequisition.status !== 'Approved & Dispatched by Admin' && (
                  <button
                    type="button"
                    onClick={handleApproveRequisition}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition active:scale-[0.99]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Approve Fleet Dispatch to Sub-Officer</span>
                  </button>
                )}
              </div>
            )}
            
            <form onSubmit={handleCommitUpdate} className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 space-y-3.5">
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Administrative Actions & Status Progression</span>
              </div>

              {/* Update Status Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Update Status *
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 transition"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Assign Department Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assign Department
                </label>
                <select
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-cyan-400 transition"
                >
                  {MUNICIPAL_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Assign Responsible Sub-Officer (First-Come, First-Served Protocol) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Assign Sub-Officer (Operations & Resource Lead) *</span>
                  <span className="text-[10px] text-cyan-400 font-bold">Field Commander</span>
                </label>

                {incident.claimedBy ? (
                  <div className="mb-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <span>
                      <strong>FCFS Claimed:</strong> {incident.claimedBy} accepted duty responsibility at {incident.claimedAt || 'Dispatch'}.
                    </span>
                  </div>
                ) : (
                  <div className="mb-2 p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1.5">
                    <span>⚡ Open for Sub-Officer FCFS Claim or direct Admin assignment below.</span>
                  </div>
                )}

                <select
                  value={subOfficer}
                  onChange={(e) => setSubOfficer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-200 text-xs font-bold focus:outline-none focus:border-cyan-400 transition"
                >
                  {SUB_OFFICERS_LIST.map(so => (
                    <option key={so.id} value={so.name} className="bg-slate-900 text-white">
                      {so.name} — {so.role} (📞 {so.phone})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Designated Sub-Officer coordinates all on-ground dispatched resources and reports live progress back to Admin Command.
                </p>
              </div>

              {/* Resource Dispatch Fleet Selection Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Deploy Required Emergency Resources *</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{selectedResources.length} Selected</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-white/10 max-h-40 overflow-y-auto">
                  {DISPATCHABLE_RESOURCES.map(res => {
                    const isSelected = selectedResources.includes(res.label);
                    return (
                      <button
                        type="button"
                        key={res.id}
                        onClick={() => toggleResource(res.label)}
                        className={`p-2 rounded-lg text-left text-[11px] font-semibold transition border flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-sm' 
                            : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'border border-slate-600'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                        <span className="truncate">{res.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Field Officer */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assigned Field Engineer / Inspector
                </label>
                <input
                  type="text"
                  value={fieldOfficer}
                  onChange={(e) => setFieldOfficer(e.target.value)}
                  placeholder="e.g. Sudeep (Junior Engineer)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Consolidated Incident Link (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Consolidated Incident Link (Optional)
                </label>
                <input
                  type="text"
                  value={consolidatedLink}
                  onChange={(e) => setConsolidatedLink(e.target.value)}
                  placeholder="Unlinked"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Officer Progress Note (Visible on Citizen Timeline) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Officer Progress Note (Visible on Citizen Timeline)
                </label>
                <textarea
                  rows={2}
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="Enter official action taken..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Work Progress Evidence */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Work Progress Evidence (Photo or Video)
                </label>
                <p className="text-[10px] text-slate-400 mb-1.5">
                  Add official photographic or video proof of ongoing work or resolution for the citizen.
                </p>
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2 px-3 rounded-xl bg-slate-950 border border-dashed border-white/20 text-slate-300 text-xs text-center cursor-pointer hover:border-cyan-400 transition">
                    <span>Upload Photo / Video</span>
                    <input type="file" accept="image/*,video/*" onChange={handleWorkProofUpload} className="hidden" />
                  </label>
                  {workProofPreview && (
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0">
                      <img src={workProofPreview} alt="Work proof" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Commit Status Update Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                <span>Commit Status Update</span>
              </button>

              {isCommitted && (
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 text-center font-bold animate-in fade-in">
                  ✓ Status Successfully Updated & Synced to Citizen Timeline!
                </div>
              )}
            </form>

            {/* Status Timeline (Exact from Screenshot 5) */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Status Timeline
              </div>
              <div className="space-y-3 text-xs">
                {timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 mt-0.5 ${
                      step.status === 'done'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500 border-white/10'
                    }`}>
                      {step.status === 'done' ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${step.status === 'done' ? 'text-white' : 'text-slate-400'}`}>
                          {step.step}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {step.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
