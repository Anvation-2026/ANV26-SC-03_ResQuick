// Sample citizen incident reports & tracking logs
// Includes detailed fields matching the Municipal Command Review schema

export const INITIAL_INCIDENTS = [
  {
    id: 'CS-2026-00001',
    zoneId: 'anekal',
    zoneName: 'Anekal — Kammasandra Agrahara',
    title: 'Pothole & Road Fracture',
    issue: 'Pothole',
    domain: 'traffic',
    domainLabel: 'Road Maintenance & Traffic',
    description: 'Road surface completely fractured and cratered causing severe two-wheeler hazards and emergency vehicle slowdowns.',
    originalLanguage: 'KN',
    originalLanguageFull: 'Kannada',
    originalVoiceText: 'ಇಲ್ಲಿ ರೋಡ್ ಕೆಟ್ಟುಹೋಗಿದೆ.',
    translatedEnglishText: 'The road here is bad.',
    severity: 'MEDIUM',
    status: 'Assigned',
    statusCode: 'assigned', // submitted | verified | assigned | in_progress | resolved | rejected
    reporterName: 'K. Suresh',
    reporterPhone: '+91 98765 43210',
    location: 'Anekal Main Road, Kammasandra Agrahara, Bengaluru, Karnataka, 562106',
    coordinates: [12.7303, 77.7096],
    date: '10/7/2026',
    time: '2:08:53 PM',
    assignedDepartment: 'Road Maintenance & Traffic Department',
    assignedOfficer: 'Sudeep (Junior Engineer)',
    assignedVehicle: 'Road Maintenance Unit #4',
    consolidatedIncident: 'Unlinked',
    officerProgressNote: 'Field inspection completed by Junior Engineer Sudeep. Work order #WM-4402 issued for bitumen resurfacing.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    forensics: {
      status: 'Verified Real On-Site Photo',
      details: 'Natural daylight lighting, realistic material fracture/surface degradation, and non-synthetic pixel continuity verified.'
    },
    aiAssessment: {
      confidence: '95%',
      domain: 'traffic',
      issue: 'Pothole',
      assessedSeverity: 'MEDIUM',
      recommendedDept: 'Road Maintenance & Traffic Department'
    },
    timeline: [
      { 
        step: 'Submitted', 
        status: 'done', 
        time: 'Oct 7, 2026, 2:08 PM', 
        note: 'Application submitted and received in Municipal Grievance Core.' 
      },
      { 
        step: 'Verified', 
        status: 'done', 
        time: 'Oct 7, 2026, 2:08 PM', 
        note: 'AI and GIS cross-verification completed. Priority flagged.' 
      },
      { 
        step: 'Assigned', 
        status: 'done', 
        time: 'Oct 7, 2026, 2:09 PM', 
        note: 'Assigned to Road Maintenance & Traffic Department (Officer: Sudeep (Junior Engineer)).' 
      },
      { 
        step: 'In Progress', 
        status: 'pending', 
        time: 'Pending', 
        note: 'Field maintenance team mobilized with equipment on site.' 
      },
      { 
        step: 'Resolved', 
        status: 'pending', 
        time: 'Pending', 
        note: 'Civil works finalized. Public space restored & inspected.' 
      }
    ]
  },
  {
    id: 'CS-2026-8492',
    zoneId: 'indiranagar',
    zoneName: 'Indiranagar — Halasuru Basin',
    title: 'Severe Flood & Hospital Access Cutoff',
    issue: 'Severe Flood',
    domain: 'disaster',
    domainLabel: 'Disaster Management & Emergency Services',
    description: '100ft road submerged under 4.5 feet of water. Ambulance entrance to City General Hospital completely blocked. 8 patients stranded.',
    originalLanguage: 'KN',
    originalLanguageFull: 'Kannada',
    originalVoiceText: 'ನಮ್ಮ ಏರಿಯಾದಲ್ಲಿ ನೀರು ತುಂಬಿದೆ, ಜನರಲ್ ಆಸ್ಪತ್ರೆ ರಸ್ತೆ ಪೂರ್ತಿ ಬಂದ್ ಆಗಿದೆ. ತುರ್ತು ಬೋಟ್ ಮತ್ತು ಆಂಬುಲೆನ್ಸ್ ಕಳುಹಿಸಿ!',
    translatedEnglishText: 'Water has flooded our area, General Hospital entrance is completely shut. Please dispatch emergency rescue boat and ambulance immediately!',
    severity: 'CRITICAL',
    status: 'In Progress',
    statusCode: 'in_progress',
    reporterName: 'Ward Resident (Indiranagar)',
    reporterPhone: '+91 83108 13290',
    location: '100ft Road, Near Metro Pillar 84, Indiranagar, Bengaluru, 560038',
    coordinates: [12.9784, 77.6408],
    date: '10/7/2026',
    time: '10:15:20 AM',
    assignedDepartment: 'Disaster Management & Emergency Services',
    assignedOfficer: 'Capt. R. Deshmukh (NDRF Commander)',
    assignedVehicle: 'Ambulance #1 & NDRF Squad #2',
    consolidatedIncident: 'Linked to Inundation Cluster #1',
    officerProgressNote: 'Emergency de-watering high-capacity pumps operational. Alternative elevated bypass route activated for hospital ambulance ingress.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    forensics: {
      status: 'Verified Real On-Site Photo',
      details: 'Hydrological depth markers matched, geo-spatial metadata matches Indiranagar flood basin, verified authentic.'
    },
    aiAssessment: {
      confidence: '98%',
      domain: 'disaster',
      issue: 'Severe Flood',
      assessedSeverity: 'CRITICAL',
      recommendedDept: 'Disaster Management & Emergency Services'
    },
    timeline: [
      { 
        step: 'Submitted', 
        status: 'done', 
        time: 'Oct 7, 2026, 10:15 AM', 
        note: 'Citizen voice submission in Kannada geotagged via live GPS.' 
      },
      { 
        step: 'Verified', 
        status: 'done', 
        time: 'Oct 7, 2026, 10:16 AM', 
        note: 'AI multi-factor risk scored 94 (CRITICAL #1). Lifeline facility threat flagged.' 
      },
      { 
        step: 'Assigned', 
        status: 'done', 
        time: 'Oct 7, 2026, 10:18 AM', 
        note: 'Assigned to Disaster Management & Emergency Services (Commander: Capt. Deshmukh).' 
      },
      { 
        step: 'In Progress', 
        status: 'done', 
        time: 'Oct 7, 2026, 10:22 AM', 
        note: 'NDRF Squad #2 and Ambulance #1 en route via AI Clear Bypass.' 
      },
      { 
        step: 'Resolved', 
        status: 'pending', 
        time: 'Pending', 
        note: 'Water pumped to permissible level and hospital gate access cleared.' 
      }
    ]
  },
  {
    id: 'CS-2026-3109',
    zoneId: 'hebbal',
    zoneName: 'Hebbal — Outer Ring Flyover',
    title: 'Flyover Ramp Blockage / Heavy Debris Collapse',
    issue: 'Debris Collapse',
    domain: 'traffic',
    domainLabel: 'Road Maintenance & Traffic',
    description: 'Flyover retaining barrier collapsed onto arterial ramp during heavy downpour. 3 lanes blocked.',
    originalLanguage: 'HI',
    originalLanguageFull: 'Hindi',
    originalVoiceText: 'हेब्बल फ्लाईओवर के पास दीवार गिर गई है और सड़क पूरी तरह जाम है, भारी मशीनरी की जरूरत है।',
    translatedEnglishText: 'Retaining wall has collapsed near Hebbal flyover blocking all traffic. Heavy excavation equipment required urgently.',
    severity: 'HIGH',
    status: 'Assigned',
    statusCode: 'assigned',
    reporterName: 'Karthik S',
    reporterPhone: '+91 63662 58223',
    location: 'Hebbal Flyover Ramp, Outer Ring Road, Bengaluru, 560024',
    coordinates: [13.0358, 77.5970],
    date: '10/7/2026',
    time: '10:05:10 AM',
    assignedDepartment: 'Road Maintenance & Traffic Department',
    assignedOfficer: 'Manjunath (Superintending Engineer)',
    assignedVehicle: 'Hydraulic Excavator #1',
    consolidatedIncident: 'Unlinked',
    officerProgressNote: 'Traffic police diverting vehicles to service lane. Excavator #1 dispatched from Hebbal depot.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    forensics: {
      status: 'Verified Real On-Site Photo',
      details: 'Structural concrete debris fracture verified with traffic camera feeds.'
    },
    aiAssessment: {
      confidence: '96%',
      domain: 'traffic',
      issue: 'Debris Collapse',
      assessedSeverity: 'HIGH',
      recommendedDept: 'Road Maintenance & Traffic Department'
    },
    timeline: [
      { step: 'Submitted', status: 'done', time: 'Oct 7, 2026, 10:05 AM', note: 'Reported with voice memo.' },
      { step: 'Verified', status: 'done', time: 'Oct 7, 2026, 10:07 AM', note: 'Priority #3 High assigned.' },
      { step: 'Assigned', status: 'done', time: 'Oct 7, 2026, 10:10 AM', note: 'Assigned to Traffic & Road Maintenance.' },
      { step: 'In Progress', status: 'pending', time: 'Pending', note: 'Debris removal crew mobilizing.' },
      { step: 'Resolved', status: 'pending', time: 'Pending', note: 'All lanes restored.' }
    ]
  }
];

// Available departments for municipal assignment (Screenshot 5)
export const MUNICIPAL_DEPARTMENTS = [
  'Road Maintenance & Traffic Department',
  'Disaster Management & Emergency Services',
  'Water Supply & Sewerage Board',
  'Waste Management Department',
  'Electrical & Streetlight Division',
  'Urban Accessibility & Pedestrian Infrastructure',
  'Metropolitan Transport Corporation',
  'Smart City Operations Center'
];

export const STATUS_OPTIONS = [
  'Submitted',
  'Verified',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected / Closed'
];
