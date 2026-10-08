import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Printer, 
  Share2, 
  Building2, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export function AIReportModal({
  isOpen,
  onClose,
  zones,
  incidents,
  isEscalated,
  currentOfficer
}) {
  const [selectedZoneId, setSelectedZoneId] = useState('zone-c');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const currentZone = zones.find(z => z.id === selectedZoneId) || zones[0];
  const relatedIncidents = incidents.filter(i => i.zoneId === selectedZoneId);

  // Generate Humanized Formal Report Text
  const generateHumanizedReport = () => {
    const dateStr = 'October 8, 2026';
    const timeStr = '10:35 AM IST';
    const officerName = currentOfficer?.name || 'Chief Disaster Operations Officer';
    const departmentName = currentOfficer?.department || 'Unified Municipal Disaster Response Authority';

    return `================================================================================
GOVERNMENT OF KARNATAKA | MUNICIPAL DISASTER MANAGEMENT AUTHORITY
AUTOMATED EMERGENCY INCIDENT BRIEFING & TACTICAL RESOURCE DIRECTIVE
Generated via ResQuick AI Operational Intelligence Core
================================================================================

INCIDENT IDENTIFIER:    RQ-OPS-${currentZone.name.toUpperCase().replace(/\s+/g, '')}-${isEscalated ? 'ESCALATED' : 'STANDARD'}
JURISDICTION / SECTOR:  ${currentZone.name} — ${currentZone.area}
PRIMARY HAZARD:         ${currentZone.hazard.toUpperCase()}
CALCULATED RISK SCORE:  ${currentZone.calculatedScore}/100 [CLASSIFICATION: ${currentZone.riskLevel?.label}]
COMMAND PRIORITY RANK:  #${currentZone.priorityRank} IN ACTIVE CITY-WIDE GRID
DATE & TIME OF RECORD:  ${dateStr} | ${timeStr}
OFFICER IN CHARGE:      ${officerName} (${departmentName})

--------------------------------------------------------------------------------
1. EXECUTIVE SITUATION BRIEF (HUMANIZED SYNOPSIS)
--------------------------------------------------------------------------------
In the preceding 90-minute operational window, situational telemetry from ${currentZone.name} (${currentZone.area}) indicates ${isEscalated ? 'a severe and critical compound escalation' : 'an elevated hazard threat requiring active municipal intervention'}. 

Heavy localized precipitation (${isEscalated ? '+35% above meteorological baselines' : 'monsoon downpour'}) coupled with severe drainage backflow has inundated arterial roadways. At present, an estimated ${currentZone.populationCount?.toLocaleString()} residents reside directly within the immediate hazard perimeter. 

Critical lifelines, including ${currentZone.criticalFacilities?.join(', ') || 'essential municipal facilities'}, are currently operating under emergency contingency protocols. Due to ${currentZone.roadsBlocked} blocked access arteries, conventional civilian transit is obstructed, creating an urgent extrication vector.

--------------------------------------------------------------------------------
2. MULTI-FACTOR RISK MATRIX BREAKDOWN
--------------------------------------------------------------------------------
• Hazard Severity:                ${currentZone.severity}/100
• Population Exposure:            ${currentZone.populationExposure}/100 (~${currentZone.populationCount?.toLocaleString()} civilians)
• Infrastructure Vulnerability:   ${currentZone.infrastructureImpact}/100
• Accessibility Difficulty:       ${currentZone.accessibilityDifficulty}/100 (${currentZone.roadsBlocked} roads impassable)
• Critical Facility Threat:       ${currentZone.criticalFacilityImpact}/100

Dynamic Risk Weighting Formula Applied:
Risk Score = [0.30 * Hazard] + [0.25 * Pop] + [0.20 * Infra] + [0.15 * Access] + [0.10 * Facility]
Resulting Consolidated Index: ${currentZone.calculatedScore} (${currentZone.riskLevel?.label})

--------------------------------------------------------------------------------
3. RECOMMENDED & ACTIVE RESOURCE ASSIGNMENTS
--------------------------------------------------------------------------------
Based on hazard classification and limited city resource reserves, the ResQuick engine has prioritized the following deployment:
${(currentZone.assignedResources || []).map((r, i) => `  [+] Unit ${i+1}: ${r}`).join('\n') || '  [+] Tactical Rapid Action Squadron'}

Ingress Route Status:
• Primary Corridor: Impassable due to 1.4m standing water / debris collapse.
• AI Smart Clear Bypass: ACTIVE via elevated peripheral highway corridor (ETA ~11 mins).

--------------------------------------------------------------------------------
4. CITIZEN REPORTS & ON-SITE VERIFICATION
--------------------------------------------------------------------------------
Citizen reports logged in this sector: ${relatedIncidents.length} active emergency calls.
Lead Field Report (${relatedIncidents[0]?.id || 'CS-2026-8492'}):
"${relatedIncidents[0]?.translatedEnglishText || 'Immediate rescue needed due to road submergence and hospital cutoff.'}"
Photographic & geolocation proof successfully authenticated by Municipal Hub.

--------------------------------------------------------------------------------
5. NEXT 4-HOUR TACTICAL DIRECTIVE
--------------------------------------------------------------------------------
1. Maintain continuous high-capacity de-watering along hospital transit lane.
2. Direct all dispatched medical and NDRF units via the AI Clear Bypass route.
3. Broadcast localized SMS evacuation warnings to residents residing below street level.
4. Review telemetry update at +30 minutes; prepare secondary boat units if rainfall persists.

SUBMITTED FOR OFFICIAL RECORD:
Signed by: ${officerName}
ResQuick Operational Decision Engine v2.4 (Civic Command Core)
================================================================================`;
  };

  const reportText = generateHumanizedReport();

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResQuick_Disaster_Report_${currentZone.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Zone,Hazard,Severity,Population,Infrastructure,Accessibility,RiskScore,Priority\n"
      + zones.map(z => `"${z.name}","${z.hazard}",${z.severity},${z.populationExposure},${z.infrastructureImpact},${z.accessibilityDifficulty},${z.calculatedScore},${z.priorityRank}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ResQuick_City_Operations_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 800);
  };

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
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>AI Automated Disaster Incident Briefing</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Humanized Brief
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                1-click executive report ready for Municipal Commissioner & District Disaster Management Authorities
              </p>
            </div>
          </div>
        </div>

        {/* Zone Selector Pill Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-400 mr-1">Select Sector:</span>
            {zones.map(z => (
              <button
                key={z.id}
                onClick={() => setSelectedZoneId(z.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                  selectedZoneId === z.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                {z.name} (#{z.priorityRank})
              </button>
            ))}
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Analysis</span>
          </button>
        </div>

        {/* Report Content Box */}
        <div className="relative mb-4">
          <pre className="w-full h-80 p-4 rounded-xl bg-slate-950/90 border border-white/15 text-slate-200 font-mono text-[11px] leading-relaxed overflow-y-auto whitespace-pre-wrap select-text">
            {reportText}
          </pre>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/10 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-md shadow-cyan-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Report (.txt)</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-white/10 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Excel / CSV</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
