// Available emergency resources pool
export const INITIAL_RESOURCES = [
  {
    id: 'res-amb',
    type: 'Ambulances',
    icon: 'Ambulance',
    total: 2,
    available: 2,
    allocated: 0,
    unitNames: ['Ambulance #1 (Advanced Life Support)', 'Ambulance #2 (Critical Trauma)'],
    department: 'Emergency Medical Services'
  },
  {
    id: 'res-rescue',
    type: 'Rescue Teams',
    icon: 'ShieldAlert',
    total: 3,
    available: 3,
    allocated: 0,
    unitNames: ['NDRF Squad #1 (Water Rescue)', 'NDRF Squad #2 (Flood Tactical)', 'Fire & Rescue Unit #3'],
    department: 'Disaster Rapid Action'
  },
  {
    id: 'res-tanker',
    type: 'Water Tankers',
    icon: 'Droplets',
    total: 2,
    available: 2,
    allocated: 0,
    unitNames: ['Potable Tanker #1 (10,000L)', 'Emergency Tanker #2 (15,000L)'],
    department: 'Water Board & Sanitization'
  },
  {
    id: 'res-heavy',
    type: 'Heavy Vehicles',
    icon: 'Truck',
    total: 1,
    available: 1,
    allocated: 0,
    unitNames: ['Hydraulic Excavator / Earthmover #1'],
    department: 'Infrastructure & Heavy Works'
  },
  {
    id: 'res-medical',
    type: 'Medical Kits',
    icon: 'HeartPulse',
    total: 40,
    available: 40,
    allocated: 0,
    unitNames: ['Standard Emergency Trauma Kits (x40)'],
    department: 'Health Ministry Logistics'
  }
];

// Department listings for admin login & dispatch
export const DEPARTMENTS = [
  { id: 'head_commissioner', name: 'Head Disaster Commissioner', role: 'Chief Municipal Officer', icon: 'Shield', fullAccess: true },
  { id: 'fire_rescue', name: 'Fire & Emergency Rescue Operations', role: 'Fire Chief Officer', icon: 'Flame', fullAccess: false },
  { id: 'flood_weather', name: 'Meteorological & Flood Command', role: 'Weather & Hydro Officer', icon: 'CloudRain', fullAccess: false },
  { id: 'medical_health', name: 'Trauma & Medical Response Unit', role: 'Chief Medical Officer', icon: 'HeartPulse', fullAccess: false },
  { id: 'traffic_roads', name: 'Traffic & Road Maintenance Corps', role: 'Roads & Infrastructure Officer', icon: 'Construction', fullAccess: false }
];

export const JURISDICTIONS = [
  'All City Regions (Head Command)',
  'Bangalore Central Metro',
  'South Zone Flood Division',
  'North Outer Ring Corridor',
  'East Lake Basin Division',
  'West Industrial Belt'
];

export const MUNICIPAL_DEPARTMENTS = [
  'Road Maintenance & Traffic Department',
  'Waste Management Department',
  'Water Supply & Sewerage Board (BWSSB)',
  'Electrical & Streetlight Division (BESCOM)',
  'Disaster Management & Emergency Services',
  'Urban Accessibility & Pedestrian Infrastructure',
  'Metropolitan Transport Corporation (BMTC)',
  'Smart City Operations Center'
];
