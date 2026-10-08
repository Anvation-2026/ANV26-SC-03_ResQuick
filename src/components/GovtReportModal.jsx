import React, { useRef, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Building, 
  ShieldCheck 
} from 'lucide-react';

export function GovtReportModal({
  isOpen,
  onClose,
  incident
}) {
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  if (!isOpen || !incident) return null;

  const refNo = `GOK/BBMP/ENG-INSP/2026/${incident.id.replace('CS-', '')}`;
  const inspectionDate = incident.date || 'October 8, 2026';
  const officerName = incident.assignedOfficer || 'Sudeep (Junior Engineer)';
  const deptName = incident.assignedDepartment || 'Road Maintenance & Traffic Department';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `GOVERNMENT OF KARNATAKA
BRUHAT BENGALURU MAHANAGARA PALIKE (BBMP)
DISASTER MANAGEMENT & MUNICIPAL ENGINEERING CORPS
MEMORANDUM & FIELD ACTION REPORT

Ref: ${refNo}
Date: ${inspectionDate}
Subject: Technical Inspection and Emergency Rectification Report for ${incident.issue || incident.title}

1. CITIZEN GRIEVANCE DETAILS:
Application No: ${incident.id}
Complainant: ${incident.reporterName} (${incident.reporterPhone})
Location: ${incident.location}
Coordinates: ${incident.coordinates ? incident.coordinates.join(', ') : '12.7303, 77.7096'}

Original Voice Statement (${incident.originalLanguage}): "${incident.originalVoiceText}"
AI English Translation: "${incident.translatedEnglishText}"

2. FIELD INSPECTION FINDINGS:
On-site inspection was carried out by ${officerName} along with the field maintenance squad. The site examination revealed:
- Visual and structural evidence confirms ${incident.issue || 'surface defect'} at ${incident.location}.
- Assessed severity level is ${incident.severity} requiring priority civic intervention.
- Photographic forensics confirms authentic non-synthetic ground degradation.

3. REMEDIAL DIRECTIVE & RESOURCE COMMITMENT:
- Designated Department: ${deptName}
- Assigned Equipment: ${incident.assignedVehicle || 'Rapid Response Unit'}
- Status: ${incident.status}
- Officer Progress Note: ${incident.officerProgressNote || 'Work order issued for immediate remedial action.'}

Authorized by:
${officerName}
Bruhat Bengaluru Mahanagara Palike`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Govt Report - ${incident.id}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.5; padding: 40px; }
        h1, h2, h3 { text-align: center; margin: 0; }
        .header { border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
        .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .meta-table td { padding: 6px; border: 1px solid #999; }
        .section-title { font-weight: bold; margin-top: 20px; text-decoration: underline; }
      </style>
      </head>
      <body>
        <div class="header">
          <h2>GOVERNMENT OF KARNATAKA</h2>
          <h3>BRUHAT BENGALURU MAHANAGARA PALIKE (BBMP)</h3>
          <p>Disaster Management & Municipal Engineering Cell, Bengaluru</p>
          <hr/>
        </div>
        <p><strong>Memorandum Ref:</strong> ${refNo} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Date:</strong> ${inspectionDate}</p>
        <p><strong>Subject:</strong> Official Inspection & Action Plan for Grievance ${incident.id} (${incident.issue || incident.title})</p>
        
        <div class="section-title">1. Citizen Grievance Particulars</div>
        <table class="meta-table">
          <tr><td><strong>Application No:</strong></td><td>${incident.id}</td><td><strong>Assessed Severity:</strong></td><td>${incident.severity}</td></tr>
          <tr><td><strong>Citizen Name:</strong></td><td>${incident.reporterName}</td><td><strong>Contact:</strong></td><td>${incident.reporterPhone}</td></tr>
          <tr><td><strong>Location Address:</strong></td><td colspan="3">${incident.location}</td></tr>
          <tr><td><strong>GPS Coordinates:</strong></td><td colspan="3">${incident.coordinates ? incident.coordinates.join(', ') : '12.7303, 77.7096'}</td></tr>
        </table>

        <div class="section-title">2. Problem Statement & Audio Verification</div>
        <p><strong>Citizen Native Voice Input (${incident.originalLanguage}):</strong> "${incident.originalVoiceText}"</p>
        <p><strong>Official English Translation:</strong> "${incident.translatedEnglishText}"</p>
        <p><strong>AI Forensics:</strong> ${incident.forensics?.details || 'Verified authentic on-site record.'}</p>

        <div class="section-title">3. Engineering Inspection Findings & Actions</div>
        <p>Field inspection was conducted by <strong>${officerName}</strong> under <strong>${deptName}</strong>. Damage assessment confirms the reported conditions requiring rapid remediation.</p>
        <p><strong>Field Officer Progress Note:</strong> ${incident.officerProgressNote || 'Mobilization underway with required equipment.'}</p>

        <br/><br/>
        <table style="width: 100%; margin-top: 40px;">
          <tr>
            <td style="width: 50%;">
              ___________________________<br/>
              <strong>${officerName}</strong><br/>
              Field Inspecting Engineer<br/>
              ${deptName}
            </td>
            <td style="width: 50%; text-align: right;">
              ___________________________<br/>
              <strong>Chief Operations Officer</strong><br/>
              BBMP Disaster Command Core<br/>
              Government of Karnataka
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Govt_Report_${incident.id}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl glass-modal p-4 sm:p-6 border border-white/20 text-slate-100 shadow-2xl my-auto">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Official Government Inspection Report
              </h3>
              <p className="text-[11px] text-slate-400">
                Word Document Format • Generated for {incident.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadWord}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              title="Download as Word Document (.doc)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word Doc (.doc)</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-white/10 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-white/10 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HUMAN-MADE WORD DOCUMENT PAGE (White paper styling with official Government Letterhead) */}
        <div 
          ref={printRef}
          className="bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl max-h-[75vh] overflow-y-auto font-serif leading-relaxed select-text"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {/* Official Emblem & Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-slate-400 mb-2 text-slate-800 font-bold text-xs tracking-widest">
              GOK
            </div>
            <h1 className="text-lg font-black tracking-wide uppercase text-slate-900 m-0">
              GOVERNMENT OF KARNATAKA
            </h1>
            <h2 className="text-base font-bold text-slate-800 uppercase m-0">
              BRUHAT BENGALURU MAHANAGARA PALIKE (BBMP)
            </h2>
            <p className="text-xs text-slate-600 m-0">
              Department of Disaster Management, Municipal Engineering & Grievance Redressal
            </p>
            <p className="text-[11px] text-slate-500 italic mt-0.5">
              N.R. Square, Bengaluru, Karnataka - 560002
            </p>
          </div>

          {/* Memorandum Header Meta */}
          <div className="flex justify-between items-start text-xs border-b border-slate-300 pb-3 mb-5">
            <div>
              <p className="m-0"><strong>Memorandum Ref:</strong> <span className="font-mono">{refNo}</span></p>
              <p className="m-0"><strong>Grievance File No:</strong> <span className="font-mono font-bold text-blue-900">{incident.id}</span></p>
            </div>
            <div className="text-right">
              <p className="m-0"><strong>Date of Record:</strong> {inspectionDate}</p>
              <p className="m-0"><strong>Disaster Classification:</strong> {incident.severity} PRIORITY</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wider underline">
              SUBJECT: SITE VERIFICATION & REMEDIAL TECHNICAL ACTION REPORT FOR {incident.issue?.toUpperCase() || incident.title?.toUpperCase()}
            </p>
          </div>

          {/* Section 1: Citizen Particulars Table */}
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-l-2 border-slate-900 pl-2">
              1. Citizen Grievance & Geo-Spatial Identification
            </h4>
            <table className="w-full text-xs border border-slate-300 border-collapse mb-2">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-100 w-1/4">Complainant Name:</td>
                  <td className="p-2 w-1/4">{incident.reporterName}</td>
                  <td className="p-2 font-bold bg-slate-100 w-1/4">Contact Number:</td>
                  <td className="p-2 w-1/4 font-mono">{incident.reporterPhone}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-100">Location Address:</td>
                  <td className="p-2" colSpan={3}>{incident.location}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-100">GPS Coordinates:</td>
                  <td className="p-2 font-mono" colSpan={3}>
                    {incident.coordinates ? `${incident.coordinates[0]}° N, ${incident.coordinates[1]}° E` : '12.7303, 77.7096'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Statement of Grievance & AI Translation */}
          <div className="mb-5 text-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-l-2 border-slate-900 pl-2">
              2. Problem Statement & Verified Audio Submission
            </h4>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <p className="m-0 mb-1">
                <strong>Verbatim Citizen Voice Input ({incident.originalLanguage}):</strong> 
                <span className="italic ml-2">"{incident.originalVoiceText}"</span>
              </p>
              <p className="m-0 mb-1">
                <strong>AI Translated Problem Statement (English):</strong> 
                <span className="font-semibold text-blue-900 ml-2">"{incident.translatedEnglishText}"</span>
              </p>
              <p className="m-0 text-[11px] text-slate-600">
                <strong>AI Image Forensics:</strong> {incident.forensics?.details || 'Verified authentic on-site record.'}
              </p>
            </div>
          </div>

          {/* Section 3: Engineering Inspection & Field Findings */}
          <div className="mb-5 text-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-l-2 border-slate-900 pl-2">
              3. Field Inspection Findings & Quantitative Assessment
            </h4>
            <p className="leading-relaxed">
              Pursuant to the automated notification generated by the ResQuick Decision Engine, an on-site reconnaissance was conducted by 
              <strong> {officerName}</strong> attached to the <strong>{deptName}</strong>. 
              The physical inspection at {incident.location} confirms structural/surface degradation of severity index <strong>{incident.severity}</strong>. 
              Circulation of vehicular and emergency transit is presently impeded, posing an immediate risk to local residents.
            </p>
            <p className="leading-relaxed">
              <strong>Progress Notes from Inspecting Officer:</strong><br/>
              <em>"{incident.officerProgressNote || 'Field maintenance squad mobilized with rapid rectification machinery. Work order initiated for immediate completion.'}"</em>
            </p>
          </div>

          {/* Section 4: Authorized Actions & Department Allocation */}
          <div className="mb-8 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-l-2 border-slate-900 pl-2">
              4. Executive Directives & Department Allocation
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Competent Authority Assigned:</strong> {deptName}</li>
              <li><strong>Current Operational Status:</strong> {incident.status}</li>
              <li><strong>Target Remediation Timeline:</strong> Within 4 hours of mobilization</li>
              <li><strong>Safety Precaution:</strong> Warning barricades and diversion signboards erected at ingress points.</li>
            </ul>
          </div>

          {/* Official Signatures with Seals */}
          <div className="pt-6 border-t border-slate-400 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 w-48 mb-1" />
              <p className="m-0 font-bold">{officerName}</p>
              <p className="m-0 text-slate-600">Field Inspecting Officer</p>
              <p className="m-0 text-slate-600">{deptName}</p>
              <p className="m-0 text-[10px] text-slate-500">BBMP Ward Division</p>
            </div>

            <div className="text-right">
              <div className="h-10 border-b border-dashed border-slate-400 w-48 ml-auto mb-1" />
              <p className="m-0 font-bold">Rajesh Rao, IAS</p>
              <p className="m-0 text-slate-600">Executive District Disaster Commissioner</p>
              <p className="m-0 text-slate-600">Unified Municipal Emergency Command</p>
              <p className="m-0 text-[10px] text-slate-500">Government of Karnataka</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
