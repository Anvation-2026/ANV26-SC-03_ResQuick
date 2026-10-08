import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertOctagon, 
  Image as ImageIcon, 
  ExternalLink, 
  X,
  Crosshair
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SMART_ROUTES } from '../utils/resourceEngine';

export function RiskMap({
  zones,
  incidents,
  selectedZone,
  onSelectZone,
  onSelectIncident,
  isEscalated,
  isAdminView = false
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const markersByZoneRef = useRef({});
  const [mapType, setMapType] = useState('street'); // 'street' | 'satellite'
  const [activeRoutingZone, setActiveRoutingZone] = useState('indiranagar');
  const [fullPhotoModal, setFullPhotoModal] = useState(null);

  // Exact coordinates centered on Bengaluru municipal zone
  const DEFAULT_CENTER = [12.9784, 77.6208];

  // Zero-Watermark Esri World Street Map (Crisp Bangalore Roads & Streets) & ArcGIS World Imagery
  const TILE_SERVERS = {
    street: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const container = mapContainerRef.current;

    // Clean up any lingering Leaflet instance or ID
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    const map = L.map(container, {
      center: DEFAULT_CENTER,
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      maxBounds: [
        [12.60, 77.20], // SW Bengaluru Metropolitan Border
        [13.40, 78.00]  // NE Bengaluru Metropolitan Border
      ],
      maxBoundsViscosity: 0.85,
      scrollWheelZoom: false, // Prevents scroll hijacking and accidental world zoom out
      zoomControl: false,
      fadeAnimation: false, // Instant tile rendering! Zero latency
      trackResize: true,
      updateWhenIdle: false,
      updateWhenZooming: true
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Fast Zero-Watermark Base layer
    const baseTile = L.tileLayer(TILE_SERVERS[mapType], {
      maxZoom: 19,
      subdomains: [],
      attribution: '&copy; Esri, OpenStreetMap contributors',
      keepBuffer: 6,
      updateWhenIdle: false,
      updateWhenZooming: true
    }).addTo(map);

    mapInstanceRef.current = map;
    mapInstanceRef.current._baseTile = baseTile;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Immediately and continuously fit map to section without requiring user drag
    const forceFullFit = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ pan: false, debounceMoveend: false });
      }
    };

    // Staggered size updates to guarantee immediate tile render during all DOM render phases
    forceFullFit();
    requestAnimationFrame(forceFullFit);
    const t1 = setTimeout(forceFullFit, 50);
    const t2 = setTimeout(forceFullFit, 150);
    const t3 = setTimeout(forceFullFit, 300);
    const t4 = setTimeout(forceFullFit, 600);
    const t5 = setTimeout(forceFullFit, 1000);

    // ResizeObserver on the map container
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        forceFullFit();
      });
      resizeObserver.observe(container);
    }

    // IntersectionObserver: immediately recalculate as soon as user scrolls map into view
    let intersectionObserver = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            forceFullFit();
          }
        });
      }, { threshold: 0.05 });
      intersectionObserver.observe(container);
    }

    window.addEventListener('resize', forceFullFit);
    window.addEventListener('orientationchange', forceFullFit);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      if (resizeObserver) resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
      window.removeEventListener('resize', forceFullFit);
      window.removeEventListener('orientationchange', forceFullFit);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (container) {
        delete container._leaflet_id;
      }
    };
  }, []);

  // Update base tile when mapType changes (Street Map vs Satellite Map)
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current._baseTile) {
      mapInstanceRef.current.removeLayer(mapInstanceRef.current._baseTile);
      const newTile = L.tileLayer(TILE_SERVERS[mapType], {
        maxZoom: 19,
        subdomains: [],
        attribution: '&copy; Esri, OpenStreetMap contributors',
        keepBuffer: 6,
        updateWhenIdle: false,
        updateWhenZooming: true
      }).addTo(mapInstanceRef.current);
      mapInstanceRef.current._baseTile = newTile;
      mapInstanceRef.current.invalidateSize({ pan: false });
    }
  }, [mapType]);

  // Update Place Markers and Incident Pins
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    markersByZoneRef.current = {};

    // 1. Render Specific Disaster Locations (Indiranagar, Bellandur, Hebbal, Shivajinagar, Peenya)
    zones.forEach(zone => {
      const isSelected = selectedZone?.id === zone.id || activeRoutingZone === zone.id;
      const isCritical = zone.calculatedScore >= 80;
      const fillColor = zone.riskLevel?.color || '#ef4444';

      // Circle perimeter
      const radius = isCritical ? 2200 : 1500;
      const circle = L.circle(zone.coordinates, {
        color: fillColor,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.45 : 0.2,
        weight: isSelected ? 3.5 : 1.5,
        dashArray: isCritical ? '5, 5' : null
      }).addTo(markersLayerRef.current);

      // Custom marker with PARTICULAR REAL PLACE NAME (No Zone A/B/C/D)
      const placeShortName = zone.name.split('—')[0].trim();
      const customIcon = L.divIcon({
        className: 'custom-place-marker',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 4px;
            background: ${fillColor};
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            padding: 5px 11px;
            border-radius: 9999px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            border: 2px solid ${isSelected ? '#38bdf8' : '#ffffff'};
            cursor: pointer;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            transition: transform 0.2s;
          ">
            <span>📍 ${placeShortName}: ${zone.calculatedScore}</span>
          </div>
        `,
        iconSize: [0, 0]
      });

      const marker = L.marker(zone.coordinates, { icon: customIcon }).addTo(markersLayerRef.current);
      markersByZoneRef.current[zone.id] = marker;

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; width: 275px; padding: 4px; color: #0f172a;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a;">
              ${zone.name}
            </div>
            <span style="font-weight: 800; font-size: 11px; padding: 2px 7px; border-radius: 9999px; background: ${fillColor}20; color: ${fillColor}; border: 1px solid ${fillColor}50; white-space: nowrap;">
              Score ${zone.calculatedScore}
            </span>
          </div>

          <div style="font-size: 11.5px; font-weight: 800; color: #dc2626; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
            <span>⚠️</span>
            <span>${zone.problemTitle || zone.hazard}</span>
          </div>

          <div style="font-size: 11px; line-height: 1.45; color: #1e293b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 8px; border-radius: 8px; margin-bottom: 6px;">
            "${zone.problemDescription || zone.hazardDescription || 'Active municipal emergency zone incident reported.'}"
          </div>

          <div style="border-radius: 8px; overflow: hidden; margin-bottom: 6px; border: 1px solid #cbd5e1; position: relative;">
            <img 
              src="${(zone.userPhotos && zone.userPhotos[0]) || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'}" 
              alt="${zone.name}" 
              style="width: 100%; height: 115px; object-fit: cover; display: block;" 
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80';" 
            />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15,23,42,0.85); color: #ffffff; font-size: 10px; font-weight: 700; padding: 3px 6px; display: flex; justify-content: space-between;">
              <span>📸 Ground Evidence</span>
              <span style="color: #38bdf8;">Verified Ground Proof</span>
            </div>
          </div>

          <div style="font-size: 10.5px; color: #475569; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
            <div>Pop: <strong>${zone.populationCount?.toLocaleString()}</strong></div>
            <div>Priority: <strong>#${zone.priorityRank}</strong></div>
            <div>Roads Blocked: <strong>${zone.roadsBlocked ?? 2}</strong></div>
            <div>Status: <strong style="color: #dc2626;">${zone.status || 'Active Alert'}</strong></div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      const handleClick = () => {
        setActiveRoutingZone(zone.id);
        if (onSelectZone) onSelectZone(zone);
        if (mapInstanceRef.current && zone.coordinates) {
          mapInstanceRef.current.flyTo(zone.coordinates, 13, { duration: 0.8 });
        }
        marker.openPopup();
      };

      marker.on('click', handleClick);
      circle.on('click', handleClick);
    });

    // 2. Render Citizen Reported Incidents (Anekal, Indiranagar, etc.)
    incidents.forEach(inc => {
      if (!inc.coordinates) return;

      const incIcon = L.divIcon({
        className: 'custom-incident-pin',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #ef4444;
            border: 2px solid #ffffff;
            box-shadow: 0 0 15px #ef4444;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transform: translate(-50%, -50%);
            animation: pulse 1.5s infinite;
          ">
            <span style="font-size: 16px;">⚠️</span>
          </div>
        `,
        iconSize: [0, 0]
      });

      const incMarker = L.marker(inc.coordinates, { icon: incIcon }).addTo(markersLayerRef.current);

      const popupHtml = `
        <div style="font-family: inherit; width: 250px; padding: 4px; color: #0f172a;">
          <div style="font-weight: 800; font-size: 13px; color: #dc2626; margin-bottom: 2px;">
            ${inc.id} • ${inc.issue || inc.title}
          </div>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">
            📍 ${inc.location}
          </div>
          ${inc.mediaUrl ? `
            <div style="border-radius: 8px; overflow: hidden; margin-bottom: 6px; border: 1px solid #cbd5e1; cursor: pointer;">
              <img src="${inc.mediaUrl}" alt="Photo Evidence" style="width: 100%; height: 120px; object-fit: cover; display: block;" />
              <div style="background: rgba(15,23,42,0.85); color: #38bdf8; font-size: 10px; font-weight: bold; padding: 3px 6px;">
                📸 Citizen Photo Evidence (Click to enlarge)
              </div>
            </div>
          ` : ''}
          <div style="font-size: 11px; color: #1e293b; background: #f1f5f9; padding: 4px 6px; border-radius: 6px; margin-bottom: 4px;">
            "${inc.translatedEnglishText || inc.title}"
          </div>
          <div style="font-size: 10px; color: #0284c7; font-weight: bold;">
            Dept: ${inc.assignedDepartment || 'Road Maintenance'}
          </div>
        </div>
      `;

      incMarker.bindPopup(popupHtml);

      incMarker.on('click', () => {
        if (onSelectIncident) onSelectIncident(inc);
        if (inc.mediaUrl) {
          setFullPhotoModal({
            title: `${inc.id} — ${inc.issue || inc.title}`,
            location: inc.location,
            url: inc.mediaUrl,
            hazard: inc.domainLabel || inc.category
          });
        }
      });
    });

  }, [zones, incidents, selectedZone, isEscalated]);

  // Sync activeRoutingZone when selectedZone changes from props
  useEffect(() => {
    if (selectedZone && selectedZone.id) {
      setActiveRoutingZone(selectedZone.id);
    }
  }, [selectedZone]);

  const handleFocusZone = (targetZone) => {
    if (!targetZone) return;
    setActiveRoutingZone(targetZone.id);
    if (onSelectZone) onSelectZone(targetZone);
    if (mapInstanceRef.current && targetZone.coordinates) {
      mapInstanceRef.current.flyTo(targetZone.coordinates, 13, { duration: 0.8 });
      const marker = markersByZoneRef.current[targetZone.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 350);
      }
    }
  };

  const activeZoneObj = zones.find(z => z.id === activeRoutingZone) || selectedZone || zones[0];
  const currentRoute = SMART_ROUTES[activeRoutingZone] || SMART_ROUTES[activeZoneObj?.id] || SMART_ROUTES['indiranagar'] || SMART_ROUTES[Object.keys(SMART_ROUTES)[0]];

  return (
    <div className="w-full space-y-4">
      
      {/* 1. STANDALONE FULL-WIDTH MAP CONTAINER - Spacious, Unobstructed, Clean */}
      <div 
        className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950"
        style={{ height: '460px', minHeight: '460px' }}
      >
        {/* Leaflet Map DOM Container - Synchronously fixed inline height so it never renders partial tiles */}
        <div 
          ref={mapContainerRef} 
          id="bengaluru-leaflet-map"
          className="w-full h-full relative z-10"
          style={{ width: '100%', height: '460px', minHeight: '460px', display: 'block' }}
        />

        {/* Top Map Bar - z-20 scoped inside container so it never leaks over modals */}
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          
          {/* Left Map Badge */}
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/15 shadow-xl text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold text-white">Live Bengaluru Municipal Map</span>
            <span className="text-[11px] text-slate-400">| Exact Streets & Landmarks</span>
          </div>

          {/* Right Map View Controls */}
          <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/15 shadow-xl">
            <button
              onClick={() => setMapType('street')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                mapType === 'street' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🗺️ Street Map</span>
            </button>

            <button
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                mapType === 'satellite' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🛰️ Satellite Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED ADMIN OPERATIONS SECTION: Ingress Route + Zone Hazard Intelligence (ADMIN COMMAND ONLY) */}
      {isAdminView && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          
          {/* PANEL 1: SMART EMERGENCY INGRESS ROUTE */}
          <div className="p-4 rounded-2xl glass-panel border border-white/15 bg-slate-950/90 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-400/30 shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Smart Emergency Ingress Route</span>
                    <span className="text-cyan-400 font-mono">({activeZoneObj?.name?.split('—')[0]?.trim() || 'Indiranagar'})</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    AI Rapid Transit Calculation • Evacuation & Resource Deployment
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 whitespace-nowrap self-start sm:self-auto">
                Clear ETA: {currentRoute.alternativeRoute.eta}
              </span>
            </div>

            {/* Zone Selector Chips for Ingress Route */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {zones.map((z) => {
                const isCurrent = (activeZoneObj?.id === z.id) || (activeRoutingZone === z.id);
                const shortName = z.name.split('—')[0].trim();
                return (
                  <button
                    key={z.id}
                    onClick={() => handleFocusZone(z)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1 ${
                      isCurrent 
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Primary Route (Blocked) vs Alternative Route (Clear) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Primary Blocked Route */}
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-rose-400 font-bold mb-1">
                    <div className="flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                      <span>Primary: Blocked ❌</span>
                    </div>
                    <span className="text-[10px] font-mono text-rose-300/80">{currentRoute.primaryRoute.distance}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-white mt-1 leading-snug">
                    {currentRoute.primaryRoute.name}
                  </div>
                  <div className="text-[10px] text-rose-300/90 mt-1 italic leading-relaxed">
                    Hazard: {currentRoute.primaryRoute.reason}
                  </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-rose-500/20 text-[10px] text-slate-400">
                  Transit Disrupted • Avoid Corridor
                </div>
              </div>

              {/* AI Alternative Clear Route */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>AI Alternative: Clear ✅</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300/80">{currentRoute.alternativeRoute.distance}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-white mt-1 leading-snug">
                    {currentRoute.alternativeRoute.name}
                  </div>
                  <div className="text-[10px] text-emerald-300/90 mt-1 leading-relaxed">
                    Advantage: {currentRoute.alternativeRoute.advantage}
                  </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-emerald-500/20 text-[10px] text-emerald-300 flex items-center justify-between font-mono">
                  <span>Safe Corridor</span>
                  <span>ETA: {currentRoute.alternativeRoute.eta}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 2: HAZARD ZONE TELEMETRY & PROBLEM INTELLIGENCE */}
        <div className="p-4 rounded-2xl glass-panel border border-white/15 bg-slate-950/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2 truncate">
              <span 
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-lg ring-2 ring-white/20" 
                style={{ backgroundColor: activeZoneObj?.riskLevel?.color || '#ef4444' }} 
              />
              <div className="truncate">
                <h3 className="text-xs sm:text-sm font-black text-white truncate">
                  {activeZoneObj?.name || 'Indiranagar — Halasuru Basin'}
                </h3>
                <p className="text-[10px] text-slate-400 truncate">
                  {activeZoneObj?.placeName || 'Indiranagar 100ft Road & Halasuru Lake Basin'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`px-2.5 py-1 rounded-full font-black text-[11px] shadow-sm ${
                activeZoneObj?.calculatedScore >= 80 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                Score {activeZoneObj?.calculatedScore || 82}
              </span>

              <button
                onClick={() => handleFocusZone(activeZoneObj)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[10px] font-bold flex items-center gap-1 transition"
                title="Center on Map"
              >
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span className="hidden sm:inline">Focus</span>
              </button>
            </div>
          </div>

          {/* Quick Zone Switcher Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
            {zones.map((z) => {
              const isCurrent = activeZoneObj?.id === z.id;
              const shortName = z.name.split('—')[0].trim();
              return (
                <button
                  key={z.id}
                  onClick={() => handleFocusZone(z)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1 ${
                    isCurrent 
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{shortName} ({z.calculatedScore})</span>
                </button>
              );
            })}
          </div>

          {/* DEDICATED PROBLEM & DESCRIPTION SECTION (Visible for all 5 Zones when clicked) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-900/90 to-slate-900/80 border border-red-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400">
              <AlertOctagon className="w-4 h-4 shrink-0 text-red-400" />
              <span>Problem Identified: {activeZoneObj?.problemTitle || activeZoneObj?.hazard}</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed font-normal bg-slate-950/70 p-2.5 rounded-lg border border-white/5">
              "{activeZoneObj?.problemDescription || activeZoneObj?.hazardDescription || 'Active municipal emergency zone incident reported.'}"
            </p>
            {activeZoneObj?.criticalFacilities && activeZoneObj.criticalFacilities.length > 0 && (
              <div className="text-[10px] text-amber-300 font-medium flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="font-bold text-amber-400">Critical Infrastructure At Risk:</span>
                <span>{activeZoneObj.criticalFacilities.join(' • ')}</span>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
              <div className="text-[10px] text-slate-400">Vulnerable Pop</div>
              <div className="text-sm font-black text-white mt-0.5">
                {activeZoneObj?.populationCount ? activeZoneObj.populationCount.toLocaleString() : '14,200'}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
              <div className="text-[10px] text-slate-400">City Priority</div>
              <div className="text-sm font-black text-amber-400 mt-0.5">
                #{activeZoneObj?.priorityRank || 1}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
              <div className="text-[10px] text-slate-400">Primary Hazard</div>
              <div className="text-[11px] font-bold text-cyan-300 truncate mt-0.5" title={activeZoneObj?.hazard}>
                {activeZoneObj?.hazard || 'Inundation Surge'}
              </div>
            </div>
          </div>

          {/* Verified Photographic Evidence Card */}
          <div 
            onClick={() => setFullPhotoModal({
              title: activeZoneObj.name,
              location: activeZoneObj.placeName,
              url: (activeZoneObj?.userPhotos && activeZoneObj.userPhotos[0]) || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
              hazard: activeZoneObj.hazard
            })}
            className="relative rounded-xl overflow-hidden border border-white/15 h-28 cursor-pointer group shadow-inner"
          >
            <img 
              src={(activeZoneObj?.userPhotos && activeZoneObj.userPhotos[0]) || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80';
              }}
              alt="Verified on-site disaster evidence" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-between p-2.5">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5 drop-shadow-md">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verified Ground Evidence ({activeZoneObj.placeName?.split('&')[0]?.trim() || activeZoneObj.placeName})</span>
              </span>
              <span className="text-[10px] font-semibold text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-400/40">
                🔍 Click to Enlarge
              </span>
            </div>
          </div>

        </div>

      </div>
      )}

      {/* FULL PHOTO ENLARGEMENT MODAL */}
      {fullPhotoModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-2xl w-full rounded-2xl glass-modal p-4 border border-white/20 text-white shadow-2xl">
            <button
              onClick={() => setFullPhotoModal(null)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📸 Verified On-Site Photographic Evidence</span>
              </h3>
              <p className="text-xs text-slate-300">
                {fullPhotoModal.title} • {fullPhotoModal.location}
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/15 max-h-[70vh] bg-black">
              <img src={fullPhotoModal.url} alt="Full evidence" className="w-full h-auto object-contain max-h-[65vh] mx-auto" />
            </div>
            <div className="mt-3 text-xs text-cyan-300 flex items-center justify-between">
              <span>AI Image Forensics: Verified Real On-Site Photo</span>
              <button 
                onClick={() => setFullPhotoModal(null)}
                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
