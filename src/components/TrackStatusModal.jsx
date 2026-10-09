import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Truck, 
  PhoneCall, 
  ShieldCheck, 
  User, 
  ChevronRight,
  Sparkles,
  PlusCircle,
  FolderClock,
  FileQuestion
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export function TrackStatusModal({
  isOpen,
  onClose,
  currentLanguage,
  incidents = [],
  initialSelectedId,
  currentUser,
  currentRole = 'citizen',
  onOpenReportModal
}) {
  const cleanPhone = (phoneStr) => (phoneStr || '').replace(/\D/g, '').slice(-10);
  const userPhone = cleanPhone(currentUser?.phone);
  const userName = (currentUser?.name || '').trim().toLowerCase();
  const userId = currentUser?.id || currentUser?.reporterUserId;

  // For Admin: show all city incidents
  // For Citizen: strictly scope to incidents submitted by their account
  const scopedIncidents = React.useMemo(() => {
    if (currentRole === 'admin') {
      return incidents;
    }
    return incidents.filter(inc => {
      const incPhone = cleanPhone(inc.reporterPhone);
      const incName = (inc.reporterName || '').trim().toLowerCase();
      const incUserId = inc.reporterUserId;

      if (userPhone && incPhone && userPhone === incPhone) return true;
      if (userId && incUserId && (userId === incUserId || userPhone === incUserId)) return true;
      if (userName && incName && userName !== 'citizen resident' && userName !== 'citizen user' && userName === incName) return true;
      return false;
    });
  }, [incidents, currentRole, userPhone, userName, userId]);

  const [searchId, setSearchId] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Auto-sync whenever initialSelectedId or scopedIncidents change
  React.useEffect(() => {
    if (!isOpen) return;

    if (initialSelectedId) {
      setSearchId(initialSelectedId);
      const foundInScoped = scopedIncidents.find(i => i.id.toLowerCase().trim() === initialSelectedId.toLowerCase().trim());
      const foundInAll = incidents.find(i => i.id.toLowerCase().trim() === initialSelectedId.toLowerCase().trim());

      if (foundInScoped) {
        setSelectedIncident(foundInScoped);
      } else if (currentRole === 'admin' && foundInAll) {
        setSelectedIncident(foundInAll);
      } else if (foundInAll && (cleanPhone(foundInAll.reporterPhone) === userPhone || foundInAll.reporterName?.toLowerCase().trim() === userName)) {
        setSelectedIncident(foundInAll);
      } else if (scopedIncidents.length > 0) {
        setSelectedIncident(scopedIncidents[0]);
        setSearchId(scopedIncidents[0].id);
      } else {
        setSelectedIncident(null);
        setSearchId(initialSelectedId);
      }
    } else if (scopedIncidents.length > 0) {
      setSelectedIncident(scopedIncidents[0]);
      setSearchId(scopedIncidents[0].id);
    } else {
      setSelectedIncident(null);
      setSearchId('');
    }
  }, [isOpen, initialSelectedId, scopedIncidents, incidents, currentRole, userPhone, userName]);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const target = searchId.trim().toLowerCase();

    // Check in scoped incidents first
    let found = scopedIncidents.find(i => i.id.toLowerCase() === target);

    // If not found in scoped list, allow checking all incidents if matching citizen phone/name or if in admin mode, or exact token search
    if (!found) {
      const matchAll = incidents.find(i => i.id.toLowerCase() === target);
      if (matchAll) {
        found = matchAll;
      }
    }

    if (found) {
      setSelectedIncident(found);
    } else {
      setSelectedIncident(null);
    }
  };

  const currentInc = selectedIncident;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl glass-modal p-5 sm:p-7 border border-white/20 text-slate-100 shadow-2xl my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {t.trackStatus}
            </h2>
            <p className="text-xs text-slate-400">
              Live status, automated dispatch timeline, and assigned municipal responder
            </p>
          </div>
        </div>

        {/* Citizen Account Context Banner */}
        {currentRole === 'citizen' && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-cyan-200">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Signed-in Account: <strong className="text-white">{currentUser?.name || 'Citizen Resident'}</strong> {userPhone ? `(📞 +91 ${userPhone})` : ''}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">
              {scopedIncidents.length === 0 
                ? '0 Active Reports' 
                : `${scopedIncidents.length} Registered Complaint${scopedIncidents.length > 1 ? 's' : ''}`}
            </span>
          </div>
        )}

        {/* Search Bar & Quick Switcher */}
        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Application No. (e.g. CS-2026-8492)"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-cyan-400 transition"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
            >
              Track
            </button>
          </form>

          {/* Quick select pills: Strictly scoped to current user's complaints (or city for admin) */}
          {scopedIncidents.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {scopedIncidents.slice(0, 4).map(inc => (
                <button
                  key={inc.id}
                  onClick={() => {
                    setSearchId(inc.id);
                    setSelectedIncident(inc);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition border ${
                    currentInc?.id === inc.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-slate-900/60 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {inc.id}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentInc ? (
          <div className="space-y-5">
            
            {/* Top Incident Summary Card */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black text-cyan-400 tracking-wider">
                    {currentInc.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {currentInc.severity}
                  </span>
                  <span className="text-xs text-slate-400">
                    • {currentInc.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {currentInc.title}
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{currentInc.location}</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-right shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 whitespace-nowrap">
                  {currentInc.status}
                </span>
                <div className="text-[11px] text-slate-400 mt-1">
                  Reported: {currentInc.date} at {currentInc.time}
                </div>
              </div>
            </div>

            {/* Step-by-Step Live Tracking Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Emergency Response Timeline
              </h4>
              <div className="space-y-3">
                {currentInc.timeline.map((step, idx) => {
                  const isDone = step.done || step.status === 'done';
                  return (
                    <div key={idx} className="flex items-start gap-3 relative">
                      {/* Progress dot & connecting line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                          isDone 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-800 text-slate-500 border-white/10'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        {idx < currentInc.timeline.length - 1 && (
                          <div className={`w-0.5 h-8 my-0.5 ${isDone ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pb-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isDone ? 'text-white' : 'text-slate-400'}`}>
                            {step.step}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {step.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ASSIGNED OFFICER & SUB-OFFICER DETAILS (Requirement 10) */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Assigned Municipal Field Lead & Sub-Officer In-Charge</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-800">
                  ⚡ Live On-Site
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-white/10 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Responsible Sub-Officer (Resource Lead)
                  </div>
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{currentInc.assignedSubOfficer || 'Sudeep M'}</span>
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-cyan-400" />
                    <span>Direct Helpline: 9448067890</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    BBMP Junior Engineer (Stormwater Drains)
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-white/10 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Field Engineer / Inspector
                  </div>
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{currentInc.assignedOfficer || 'Sudeep (Junior Engineer)'}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Dept: {currentInc.assignedDepartment || 'Road Maintenance & Traffic Department'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    ✓ Operational status synced to Admin Command
                  </div>
                </div>
              </div>

              {currentInc.officerProgressNote && (
                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
                  <strong>Officer Progress Note:</strong> {currentInc.officerProgressNote}
                </div>
              )}
            </div>

            {/* Media & Assigned Team Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              
              {/* Assigned Responder Info */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Assigned Emergency Units & Dispatched Resources
                </span>
                <div className="text-white font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{currentInc.assignedDepartment}</span>
                </div>
                <div className="text-slate-300 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>Primary Unit: {currentInc.assignedVehicle}</span>
                </div>
                {currentInc.dispatchedResources && currentInc.dispatchedResources.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Dispatched Tactical Fleet:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentInc.dispatchedResources.map((res, rIdx) => (
                        <span key={rIdx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-cyan-300">
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200">
                  ⚡ <strong>Ingress Status:</strong> Vehicle dispatch en route via AI Smart Clear Bypass (ETA 9 mins).
                </div>
              </div>

              {/* Photo & Original Voice Proof */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Verification & Voice Record
                </span>
                {currentInc.mediaUrl && (
                  <div className="h-20 rounded-lg overflow-hidden border border-white/15">
                    <img 
                      src={currentInc.mediaUrl} 
                      alt="Citizen Proof" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <div className="text-[11px] text-slate-300 italic truncate">
                  "{currentInc.originalVoiceText}"
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  Translated: "{currentInc.translatedEnglishText}"
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center py-10 px-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 flex items-center justify-center mx-auto">
              <FolderClock className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-white">
                {searchId ? `No Grievance Record Found for "${searchId}"` : 'No Grievance Records Under This Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {currentRole === 'citizen'
                  ? `Signed in as ${currentUser?.name || 'Citizen'} ${userPhone ? `(📞 +91 ${userPhone})` : ''}. Only complaints submitted by your account appear here.`
                  : 'Enter a valid Application No. (e.g., CS-2026-00001) in the search bar above to inspect grievance status.'}
              </p>
            </div>
            {currentRole === 'citizen' && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenReportModal) onOpenReportModal();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report an Emergency / Problem Now</span>
                </button>
              </div>
            )}
            <p className="text-[11px] text-slate-500">
              Tip: If you have a tracking Application No. from an SMS dispatch, enter it in the search bar above.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
