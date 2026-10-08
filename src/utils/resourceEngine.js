// Intelligent Resource Prioritization & Allocation Engine

export function allocateResources(sortedZones, isEscalated = false) {
  // Inventory tracking
  const inventory = {
    ambulances: 2,
    rescueTeams: 3,
    waterTankers: 2,
    heavyVehicles: 1,
    medicalKits: 40
  };

  const allocations = {};
  const reallocationsLog = [];

  // Reset allocations structure
  sortedZones.forEach(z => {
    allocations[z.id] = [];
  });

  if (isEscalated) {
    // Escalated Scenario:
    // Indiranagar is Priority #1 Critical (Score 94+)
    allocations['indiranagar'] = [
      'Ambulance #1 (Critical Trauma Unit)',
      'NDRF Squad #2 (Flood Tactical)',
      'Hydraulic Excavator / Earthmover #1'
    ];
    inventory.ambulances -= 1;
    inventory.rescueTeams -= 1;
    inventory.heavyVehicles -= 1;
    inventory.medicalKits -= 25;

    allocations['bellandur'] = [
      'NDRF Squad #1 (Water Rescue)',
      'Potable Tanker #1 (10,000L)'
    ];
    inventory.rescueTeams -= 1;
    inventory.waterTankers -= 1;
    inventory.medicalKits -= 10;

    allocations['hebbal'] = [
      'Fire & Rescue Unit #3'
    ];
    inventory.rescueTeams -= 1;

    allocations['shivajinagar'] = [
      'Ambulance #2 (Advanced Life Support)'
    ];
    inventory.ambulances -= 1;
    inventory.medicalKits -= 5;

    allocations['peenya'] = [
      'Potable Tanker #2 (15,000L)'
    ];
    inventory.waterTankers -= 1;

    reallocationsLog.push({
      timestamp: '10:26 AM',
      type: 'REALLOCATION',
      resource: 'Ambulance #1 & Earthmover #1',
      from: 'Shivajinagar Depot',
      to: 'Indiranagar Basin',
      reason: 'Indiranagar risk escalated to 94+ (Critical threat to City General Hospital)'
    });
  } else {
    // Pre-escalation Baseline Allocation
    allocations['indiranagar'] = [
      'NDRF Squad #2 (Flood Tactical)'
    ];
    inventory.rescueTeams -= 1;
    inventory.medicalKits -= 15;

    allocations['bellandur'] = [
      'NDRF Squad #1 (Water Rescue)',
      'Potable Tanker #1 (10,000L)'
    ];
    inventory.rescueTeams -= 1;
    inventory.waterTankers -= 1;
    inventory.medicalKits -= 10;

    allocations['hebbal'] = [
      'Fire & Rescue Unit #3'
    ];
    inventory.rescueTeams -= 1;

    allocations['shivajinagar'] = [
      'Ambulance #1 (Critical Trauma Unit)'
    ];
    inventory.ambulances -= 1;
    inventory.medicalKits -= 10;

    allocations['peenya'] = [
      'Potable Tanker #2 (15,000L)'
    ];
    inventory.waterTankers -= 1;
  }

  return {
    allocations,
    inventoryRemaining: inventory,
    reallocationsLog
  };
}

/**
 * Smart Alternative Routing Engine with exact real Bangalore roads
 */
export const SMART_ROUTES = {
  'indiranagar': {
    primaryRoute: {
      name: '100ft Road Corridor via CMH Cross',
      distance: '4.2 km',
      eta: '8 mins',
      status: 'BLOCKED',
      reason: '1.4m standing water near Indiranagar Metro Pillar 84',
      blockedIcon: 'AlertOctagon'
    },
    alternativeRoute: {
      name: 'AI Smart Ingress via Old Airport Road & Command Bypass',
      distance: '6.8 km',
      eta: '11 mins',
      status: 'CLEAR',
      advantage: 'Elevated causeway route, cleared by Traffic Corps',
      safeIcon: 'CheckCircle2'
    }
  },
  'bellandur': {
    primaryRoute: {
      name: 'Outer Ring Road Bellandur Flyover Ingress',
      distance: '5.1 km',
      eta: '12 mins',
      status: 'HEAVY_CONGESTION',
      reason: 'Drain breach causing 45 min vehicular crawl',
      blockedIcon: 'AlertOctagon'
    },
    alternativeRoute: {
      name: 'HAL Airport Perimeter Arterial',
      distance: '7.4 km',
      eta: '14 mins',
      status: 'CLEAR',
      advantage: 'Direct access to lake embankment without waterlogging',
      safeIcon: 'CheckCircle2'
    }
  },
  'hebbal': {
    primaryRoute: {
      name: 'Hebbal Flyover Central Ingress (Airport Expressway)',
      distance: '5.8 km',
      eta: '10 mins',
      status: 'BLOCKED',
      reason: 'Retaining wall breach & tree fall near Esteem Mall',
      blockedIcon: 'AlertOctagon'
    },
    alternativeRoute: {
      name: 'AI Smart Ingress via Outer Ring Road & Nagavara Bypass',
      distance: '7.9 km',
      eta: '13 mins',
      status: 'CLEAR',
      advantage: 'Elevated bypass free of debris and tree hazards',
      safeIcon: 'CheckCircle2'
    }
  },
  'shivajinagar': {
    primaryRoute: {
      name: 'Russell Market - Bowring Hospital Central Avenue',
      distance: '3.4 km',
      eta: '7 mins',
      status: 'BLOCKED',
      reason: '0.9m flash pooling and stalled commercial vehicles',
      blockedIcon: 'AlertOctagon'
    },
    alternativeRoute: {
      name: 'AI Smart Ingress via Queen\'s Road & Cubbon Rd Corridor',
      distance: '4.8 km',
      eta: '9 mins',
      status: 'CLEAR',
      advantage: 'High elevation arterial with cleared traffic signal priority',
      safeIcon: 'CheckCircle2'
    }
  },
  'peenya': {
    primaryRoute: {
      name: 'Peenya 1st Stage Industrial Arterial',
      distance: '6.2 km',
      eta: '15 mins',
      status: 'BLOCKED',
      reason: 'Industrial stormwater culvert overflow at Cross 4',
      blockedIcon: 'AlertOctagon'
    },
    alternativeRoute: {
      name: 'AI Smart Ingress via Tumkur Road Elevated Expressway',
      distance: '8.1 km',
      eta: '11 mins',
      status: 'CLEAR',
      advantage: 'Direct overhead clearance directly into Peenya Depot',
      safeIcon: 'CheckCircle2'
    }
  }
};
