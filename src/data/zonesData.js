// Centralized realistic disaster places and hazard locations
export const INITIAL_ZONES = [
  {
    id: 'indiranagar',
    name: 'Indiranagar — Halasuru Basin',
    placeName: 'Indiranagar 100ft Road & Halasuru Lake Basin',
    hazard: 'Severe Flood',
    severity: 82,
    populationExposure: 88,
    populationCount: 8500,
    infrastructureImpact: 80,
    accessibilityDifficulty: 72,
    criticalFacilityImpact: 90,
    criticalFacilitiesCount: 3,
    criticalFacilities: ['City General Hospital', 'Halasuru BESCOM Substation', 'Metro Pillar 84 Corridor'],
    roadsBlocked: 4,
    coordinates: [12.9784, 77.6408],
    requiredResources: ['Ambulance', 'Rescue Team', 'Heavy Vehicle'],
    assignedResources: ['Rescue Team #2 (NDRF Water Tactical)'],
    forecast: [
      { time: 'Now', score: 82 },
      { time: '+15 min', score: 87 },
      { time: '+30 min', score: 94 },
      { time: '+45 min', score: 98 }
    ],
    status: 'High Escalation Risk',
    problemTitle: 'Severe Flash Inundation & Culvert Overflow (Score 82)',
    problemDescription: 'Heavy monsoonal downpour caused 1.4m standing water near Metro Pillar 84 and Halasuru Lake culvert breach. Ingress underpass submerged, cutting off access to City General Hospital for ambulances and stranded patients.',
    userPhotos: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514632595-4944383f2737?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'bellandur',
    name: 'Bellandur — Yamalur Lake Drainage',
    placeName: 'Bellandur Eco-World & Yamalur Storm Drain',
    hazard: 'Flash Inundation & Drain Breach',
    problemTitle: 'Stormwater Lake Breach & Toxic Foam Surge (Score 63)',
    problemDescription: 'Stormwater culvert breach near Yamalur drainage canal resulting in 1.1m road inundation and toxic foam backwash across Outer Ring Road tech corridors. Residential ground-floor flooding reported.',
    severity: 72,
    populationExposure: 65,
    populationCount: 4200,
    infrastructureImpact: 60,
    accessibilityDifficulty: 70,
    criticalFacilityImpact: 30,
    criticalFacilitiesCount: 1,
    criticalFacilities: ['Water Pumping Substation B'],
    roadsBlocked: 2,
    coordinates: [12.9260, 77.6762],
    requiredResources: ['Rescue Team', 'Water Tanker'],
    assignedResources: ['Rescue Team #1', 'Potable Tanker #1'],
    forecast: [
      { time: 'Now', score: 64 },
      { time: '+15 min', score: 66 },
      { time: '+30 min', score: 69 },
      { time: '+45 min', score: 71 }
    ],
    status: 'Active Flood Watch',
    userPhotos: [
      'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'hebbal',
    name: 'Hebbal — Outer Ring Flyover',
    placeName: 'Hebbal Flyover Ramp & Estuary Ingress',
    hazard: 'Road & Debris Blockage',
    problemTitle: 'Flyover Retaining Barrier Collapse & Traffic Blockage (Score 64)',
    problemDescription: 'Retaining wall barrier collapsed under torrential downpour near Hebbal flyover ramp. 3 arterial highway lanes blocked with concrete debris and mudslide, halting emergency airport access.',
    severity: 73,
    populationExposure: 60,
    populationCount: 3100,
    infrastructureImpact: 75,
    accessibilityDifficulty: 45,
    criticalFacilityImpact: 50,
    criticalFacilitiesCount: 2,
    criticalFacilities: ['Highway Emergency Transit Hub', 'Baptist Hospital Transit Lane'],
    roadsBlocked: 3,
    coordinates: [13.0358, 77.5970],
    requiredResources: ['Rescue Team', 'Heavy Vehicle'],
    assignedResources: ['Fire & Rescue Unit #3'],
    forecast: [
      { time: 'Now', score: 64 },
      { time: '+15 min', score: 65 },
      { time: '+30 min', score: 65 },
      { time: '+45 min', score: 64 }
    ],
    status: 'Traffic Cutoff',
    userPhotos: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'shivajinagar',
    name: 'Shivajinagar — Russell Market',
    placeName: 'Russell Market & Commercial Street Hub',
    hazard: 'Structural Building Collapse',
    problemTitle: 'Commercial Heritage Building Fracture & Flash Pooling (Score 54)',
    problemDescription: 'Deep structural cracks and facade detachment reported in Russell Market heritage corridor after continuous downpour. 0.9m flash pooling threatening high-density commercial stalls.',
    severity: 55,
    populationExposure: 50,
    populationCount: 2000,
    infrastructureImpact: 65,
    accessibilityDifficulty: 55,
    criticalFacilityImpact: 40,
    criticalFacilitiesCount: 1,
    criticalFacilities: ['Fire Substation #2'],
    roadsBlocked: 1,
    coordinates: [12.9856, 77.6057],
    requiredResources: ['Heavy Vehicle', 'Ambulance'],
    assignedResources: ['Ambulance #1'],
    forecast: [
      { time: 'Now', score: 54 },
      { time: '+15 min', score: 55 },
      { time: '+30 min', score: 56 },
      { time: '+45 min', score: 57 }
    ],
    status: 'Structural Inspection',
    userPhotos: [
      'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'peenya',
    name: 'Peenya — Industrial Reservoir',
    placeName: 'Peenya 4th Phase Industrial Catchment',
    hazard: 'Chemical Water Contamination',
    problemTitle: 'Industrial Drainage Backflow & Reservoir Contamination Watch (Score 38)',
    problemDescription: 'Industrial stormwater culvert overflow at 4th Phase Cross 4. Toxic industrial runoff threatening contamination of the local drinking water purification plant.',
    severity: 31,
    populationExposure: 40,
    populationCount: 1400,
    infrastructureImpact: 25,
    accessibilityDifficulty: 80,
    criticalFacilityImpact: 20,
    criticalFacilitiesCount: 1,
    criticalFacilities: ['Secondary Purification Plant'],
    roadsBlocked: 0,
    coordinates: [13.0285, 77.5197],
    requiredResources: ['Water Tanker'],
    assignedResources: ['Potable Tanker #2'],
    forecast: [
      { time: 'Now', score: 38 },
      { time: '+15 min', score: 39 },
      { time: '+30 min', score: 40 },
      { time: '+45 min', score: 40 }
    ],
    status: 'Under Monitoring',
    userPhotos: [
      'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

// Escalation delta parameters for Indiranagar (Zone C)
export const ESCALATION_ZONE_C = {
  severity: 94,
  populationExposure: 96,
  populationCount: 9700,
  infrastructureImpact: 91,
  accessibilityDifficulty: 88,
  criticalFacilityImpact: 95,
  roadsBlocked: 5,
  status: 'CRITICAL ESCALATION (Rainfall +35%, Flood Rise +20%)',
  problemTitle: 'CRITICAL ESCALATION: 1.8m Inundation & Substation Breach (Score 94)',
  problemDescription: 'Cloudburst escalation caused 1.8m flood surge. Halasuru BESCOM substation under imminent threat of short circuit. Metro corridor halted and hospital emergency ICU generator cut off.',
  forecast: [
    { time: 'Now', score: 94 },
    { time: '+15 min', score: 97 },
    { time: '+30 min', score: 99 },
    { time: '+45 min', score: 100 }
  ]
};
