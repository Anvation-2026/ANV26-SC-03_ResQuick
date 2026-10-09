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

// Pre-configured 5 Sub-Officers / Field Engineers for login & duty assignment
export const SUB_OFFICERS_LIST = [
  {
    id: 'ENG-01',
    name: 'Er. Sudeep M',
    role: 'Junior Engineer (Stormwater Drains & Roads)',
    department: 'Road Maintenance & Traffic Department',
    phone: '9448067890',
    zone: 'Anekal & East Lake Basin',
    specialization: 'Culvert breaches, pothole craters & road fracture stabilization'
  },
  {
    id: 'ENG-02',
    name: 'Er. Manjunath R',
    role: 'Superintending Engineer (Structural & Debris)',
    department: 'Disaster Management & Emergency Services',
    phone: '9845012389',
    zone: 'Hebbal & North Outer Ring Corridor',
    specialization: 'Flyover debris collapse, structural shoring & heavy machinery'
  },
  {
    id: 'ENG-03',
    name: 'Er. Kavitha Rao',
    role: 'Assistant Executive Engineer (Flood Tactical Lead)',
    department: 'Disaster Management & Emergency Services',
    phone: '9449823456',
    zone: 'Indiranagar & Halasuru Central Basin',
    specialization: 'Severe flood de-watering, hospital lifeline bypass & boat rescue'
  },
  {
    id: 'ENG-04',
    name: 'Er. Rajesh Gowda',
    role: 'Assistant Engineer (Water Supply & Drainage)',
    department: 'Water Supply & Sewerage Board (BWSSB)',
    phone: '9900145678',
    zone: 'Bellandur & Yamalur Wetland Belt',
    specialization: 'Sewage drain breaches, water contamination & high-capacity pumping'
  },
  {
    id: 'ENG-05',
    name: 'Er. Priya Sharma',
    role: 'Emergency Electrical Grid Inspector',
    department: 'Electrical & Streetlight Division (BESCOM)',
    phone: '9844078901',
    zone: 'Shivajinagar & Central Metro Corridor',
    specialization: 'Transformer fires, 11kV line isolation & emergency power routing'
  }
];

