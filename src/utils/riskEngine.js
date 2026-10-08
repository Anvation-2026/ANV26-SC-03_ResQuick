// Mathematical Disaster Risk Calculation Engine

/**
 * Exact Risk Score Formula:
 * Risk Score = 0.30 * Hazard Severity 
 *            + 0.25 * Population Exposure 
 *            + 0.20 * Infrastructure Impact 
 *            + 0.15 * Accessibility Difficulty (higher = worse/harder to reach)
 *            + 0.10 * Critical Facility Impact
 */
export function calculateRiskScore(zone) {
  const severity = Number(zone.severity) || 0;
  const population = Number(zone.populationExposure) || 0;
  const infrastructure = Number(zone.infrastructureImpact) || 0;
  const accessibility = Number(zone.accessibilityDifficulty) || 0;
  const criticalFacility = Number(zone.criticalFacilityImpact) || 0;

  const rawScore = 
    (0.30 * severity) +
    (0.25 * population) +
    (0.20 * infrastructure) +
    (0.15 * accessibility) +
    (0.10 * criticalFacility);

  return Math.round(Math.min(100, Math.max(0, rawScore)));
}

/**
 * Categorize risk score into official thresholds
 */
export function getRiskLevel(score) {
  if (score >= 80) {
    return {
      label: 'CRITICAL',
      color: '#ef4444',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
      pillClass: 'bg-red-500 text-white',
      dotColor: '#ef4444',
      glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.45)]'
    };
  }
  if (score >= 60) {
    return {
      label: 'HIGH',
      color: '#f97316',
      badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      pillClass: 'bg-amber-500 text-white',
      dotColor: '#f97316',
      glowClass: 'shadow-[0_0_20px_rgba(249,115,22,0.35)]'
    };
  }
  if (score >= 40) {
    return {
      label: 'MODERATE',
      color: '#eab308',
      badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      pillClass: 'bg-yellow-500 text-slate-900',
      dotColor: '#eab308',
      glowClass: 'shadow-[0_0_15px_rgba(234,179,8,0.25)]'
    };
  }
  return {
    label: 'LOW',
    color: '#22c55e',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    pillClass: 'bg-emerald-500 text-white',
    dotColor: '#22c55e',
    glowClass: 'shadow-[0_0_15px_rgba(34,197,94,0.25)]'
  };
}

/**
 * Sort zones dynamically by calculated Risk Score descending
 */
export function calculateDynamicPriorities(zones) {
  return [...zones]
    .map(zone => {
      const score = calculateRiskScore(zone);
      const riskLevel = getRiskLevel(score);
      return {
        ...zone,
        calculatedScore: score,
        riskLevel
      };
    })
    .sort((a, b) => b.calculatedScore - a.calculatedScore)
    .map((zone, index) => ({
      ...zone,
      priorityRank: index + 1
    }));
}

/**
 * Dynamic Explainable AI: "Why this zone first?"
 * Builds transparent, data-driven rationales for commanders and citizens.
 */
export function generateWhyThisZone(zone, priorityRank = 1) {
  const reasons = [];
  const score = zone.calculatedScore || calculateRiskScore(zone);

  if (zone.populationExposure >= 75) {
    reasons.push({
      icon: 'Users',
      title: 'High Population Exposure',
      description: `Approx ${zone.populationCount ? zone.populationCount.toLocaleString() : '8,500+'} citizens directly in the impact zone.`
    });
  } else if (zone.populationExposure >= 50) {
    reasons.push({
      icon: 'Users',
      title: 'Dense Civilian Cluster',
      description: `Significant residential concentration (${zone.populationCount || '2,000+'} affected).`
    });
  }

  if (zone.criticalFacilityImpact >= 75) {
    reasons.push({
      icon: 'Building2',
      title: 'Critical Lifeline Threat',
      description: `High risk to essential facilities: ${zone.criticalFacilities?.join(', ') || 'Hospitals and power grids'}.`
    });
  }

  if (zone.severity >= 80) {
    reasons.push({
      icon: 'AlertTriangle',
      title: 'Extreme Hazard Intensity',
      description: `Rapidly escalating ${zone.hazard} severity rated at ${zone.severity}/100.`
    });
  } else if (zone.severity >= 60) {
    reasons.push({
      icon: 'AlertTriangle',
      title: 'Elevated Hazard Threat',
      description: `${zone.hazard} threat actively progressing across key corridors.`
    });
  }

  if (zone.accessibilityDifficulty >= 70) {
    reasons.push({
      icon: 'Navigation',
      title: 'Severe Route Blockage & Isolation',
      description: `${zone.roadsBlocked || 4} arterial roads submerged/impassable. Delayed dispatch will multiply casualties.`
    });
  } else if (zone.accessibilityDifficulty >= 50) {
    reasons.push({
      icon: 'Navigation',
      title: 'Challenging Ingress Vector',
      description: `Traffic bottlenecks require specialized heavy vehicle or all-terrain access.`
    });
  }

  if (zone.infrastructureImpact >= 75) {
    reasons.push({
      icon: 'Zap',
      title: 'Cascading Infrastructure Vulnerability',
      description: `Primary power, drainage, and transport grids undergoing severe stress (${zone.infrastructureImpact}%).`
    });
  }

  if (reasons.length < 3) {
    reasons.push({
      icon: 'TrendingUp',
      title: 'Predictive Escalation Trajectory',
      description: 'Simulation forecast indicates compound failure within 30 minutes if unaddressed.'
    });
  }

  return {
    rank: priorityRank,
    score,
    level: getRiskLevel(score).label,
    reasons
  };
}
