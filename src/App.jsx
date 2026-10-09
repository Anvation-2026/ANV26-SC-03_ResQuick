import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CitizenPortal } from './components/CitizenPortal';
import { AdminPortal } from './components/AdminPortal';
import { LoginModal } from './components/LoginModal';
import { ReportProblemModal } from './components/ReportProblemModal';
import { TrackStatusModal } from './components/TrackStatusModal';
import { BroadcastSMSModal } from './components/BroadcastSMSModal';
import { AIReportModal } from './components/AIReportModal';
import { EscalationModal } from './components/EscalationModal';
import { NewsModal } from './components/NewsSection';
import { HelplinesModal } from './components/HelplinesModal';
import { QuickerChatbot } from './components/QuickerChatbot';
import { ApplicationManageModal } from './components/ApplicationManageModal';
import { GovtReportModal } from './components/GovtReportModal';
import { SubOfficerPortal } from './components/SubOfficerPortal';
import { SUB_OFFICERS_LIST } from './data/resourcesData';

import { INITIAL_ZONES, ESCALATION_ZONE_C } from './data/zonesData';
import { INITIAL_INCIDENTS } from './data/sampleIncidents';
import { INDIA_DISASTER_NEWS } from './data/indiaNews';
import { calculateDynamicPriorities } from './utils/riskEngine';
import { playEmergencySiren, playDispatchPing } from './utils/soundEffects';
import { 
  fetchCloudIncidents, 
  pushIncidentToCloud, 
  updateIncidentInCloud, 
  connectRealtimeSync 
} from './utils/cloudSync';

export function App() {
  // 1. Session Persistence across Refresh
  const getSavedSession = () => {
    try {
      const s = localStorage.getItem('resquick_session');
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed?.currentUser?.name === 'Apoorva P Keretot') {
          parsed.currentUser.name = 'Citizen Resident';
          parsed.currentUser.phone = '';
        }
        if (!parsed.currentLanguage || parsed.currentLanguage === 'kn') {
          parsed.currentLanguage = 'en';
        }
        if (parsed?.currentUser?.language === 'kn') {
          parsed.currentUser.language = 'en';
        }
        return parsed;
      }
    } catch (e) {}
    return null;
  };

  const initialSession = getSavedSession();

  const [isLoggedIn, setIsLoggedIn] = useState(initialSession ? initialSession.isLoggedIn : false);
  const [currentRole, setCurrentRole] = useState(initialSession ? initialSession.currentRole : 'citizen');
  const [loginModalDefaultTab, setLoginModalDefaultTab] = useState('citizen');

  const [currentUser, setCurrentUser] = useState(
    initialSession?.currentUser && initialSession.currentUser.name !== 'Apoorva P Keretot'
      ? initialSession.currentUser
      : {
          role: 'citizen',
          name: 'Citizen Resident',
          phone: '',
          language: 'en'
        }
  );

  const [currentOfficer, setCurrentOfficer] = useState(
    initialSession?.currentOfficer || {
      role: 'admin',
      name: 'Commissioner Rajesh Rao',
      id: 'COMMISSIONER-01',
      department: 'Head Operations Commissioner (All Regions)',
      isHeadOfficer: true,
      location: 'All City Regions'
    }
  );

  const [currentSubOfficer, setCurrentSubOfficer] = useState(
    initialSession?.currentSubOfficer || null
  );

  // Language state (In Citizen Portal: preferred language, defaults to English 'en'; in Admin: English only)
  const [currentLanguage, setCurrentLanguage] = useState(initialSession?.currentLanguage || 'en');

  // Theme State
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('resquick_theme') || 'dark';
  });

  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
    if (currentTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('resquick_theme', currentTheme);
  }, [currentTheme]);

  // Save session changes to localStorage so refreshing never logs out
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('resquick_session', JSON.stringify({
        isLoggedIn: true,
        currentRole,
        currentUser,
        currentOfficer,
        currentSubOfficer,
        currentLanguage
      }));
    } else {
      localStorage.removeItem('resquick_session');
    }
  }, [isLoggedIn, currentRole, currentUser, currentOfficer, currentSubOfficer, currentLanguage]);

  // Disaster Zones and Escalation Simulation State
  const [isEscalated, setIsEscalated] = useState(false);
  const [rawZones, setRawZones] = useState(INITIAL_ZONES);
  const [zones, setZones] = useState(() => calculateDynamicPriorities(INITIAL_ZONES));
  const [selectedZone, setSelectedZone] = useState(() => zones[0]);

  // 2. Cross-Tab Live Synced Incidents & News
  const [incidents, setIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem('resquick_incidents');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_INCIDENTS;
  });

  const [newsList, setNewsList] = useState(() => {
    try {
      const saved = localStorage.getItem('resquick_news');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INDIA_DISASTER_NEWS;
  });

  const [selectedTrackId, setSelectedTrackId] = useState('CS-2026-00001');

  // BroadcastChannel & Storage Event Listeners for Instant Cross-Tab Sync
  useEffect(() => {
    let syncChannel = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        syncChannel = new BroadcastChannel('resquick_live_sync');
        syncChannel.onmessage = (event) => {
          if (event.data?.type === 'INCIDENTS_UPDATE') {
            setIncidents(event.data.payload);
          } else if (event.data?.type === 'NEWS_UPDATE') {
            setNewsList(event.data.payload);
          }
        };
      } catch (e) {}
    }

    const handleStorageEvent = (e) => {
      if (e.key === 'resquick_incidents' && e.newValue) {
        try {
          setIncidents(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'resquick_news' && e.newValue) {
        try {
          setNewsList(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      if (syncChannel) syncChannel.close();
    };
  }, []);

  // 3. Global Cloud Sync: Real-Time SSE listener + 24h complaint pull for remote cross-device updates
  useEffect(() => {
    // 1. Fetch recent incidents published from any device in the last 24h
    fetchCloudIncidents().then((cloudIncidents) => {
      if (cloudIncidents && cloudIncidents.length > 0) {
        setIncidents((prev) => {
          const map = new Map();
          // Initial/local incidents
          prev.forEach((i) => map.set(i.id, i));
          // Overlay cloud incidents
          cloudIncidents.forEach((i) => map.set(i.id, i));
          const merged = Array.from(map.values());
          try {
            localStorage.setItem('resquick_incidents', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    });

    // 2. Connect live Server-Sent Events stream for instant push when complaints are submitted on other devices
    const disconnectCloudSync = connectRealtimeSync((incomingIncident) => {
      setIncidents((prev) => {
        const exists = prev.some((i) => i.id === incomingIncident.id);
        let updated;
        if (exists) {
          updated = prev.map((i) => (i.id === incomingIncident.id ? incomingIncident : i));
        } else {
          updated = [incomingIncident, ...prev];
          playDispatchPing();
        }
        try {
          localStorage.setItem('resquick_incidents', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    });

    return () => {
      disconnectCloudSync();
    };
  }, []);

  // Modals visibility state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [isAIReportModalOpen, setIsAIReportModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isHelplinesModalOpen, setIsHelplinesModalOpen] = useState(false);

  // Screenshot 5 Modals
  const [selectedManageIncident, setSelectedManageIncident] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedGovtReportIncident, setSelectedGovtReportIncident] = useState(null);
  const [isGovtReportModalOpen, setIsGovtReportModalOpen] = useState(false);

  // Recalculate dynamic priorities whenever raw zones or escalation change
  useEffect(() => {
    let zonesToProcess = [...rawZones];

    if (isEscalated) {
      zonesToProcess = zonesToProcess.map(z => {
        if (z.id === 'indiranagar') {
          return {
            ...z,
            ...ESCALATION_ZONE_C,
            assignedResources: [
              'Ambulance #1 (Critical Trauma Unit)',
              'NDRF Squad #2 (Flood Tactical)',
              'Hydraulic Excavator / Earthmover #1'
            ]
          };
        }
        return z;
      });
    }

    const dynamicallySorted = calculateDynamicPriorities(zonesToProcess);
    setZones(dynamicallySorted);

    if (selectedZone) {
      const refreshed = dynamicallySorted.find(z => z.id === selectedZone.id);
      if (refreshed) setSelectedZone(refreshed);
    }
  }, [rawZones, isEscalated]);

  // Toggle Escalation Simulation
  const handleToggleEscalation = () => {
    if (!isEscalated) {
      setIsEscalated(true);
      setIsEscalationModalOpen(true);
      playEmergencySiren();
    } else {
      handleResetSimulation();
    }
  };

  const handleResetSimulation = () => {
    setIsEscalated(false);
    setRawZones(INITIAL_ZONES);
    playDispatchPing();
  };

  // Submit new citizen report (fast real-time update in both portals & cross tabs & cross devices)
  const handleNewIncidentReport = (newIncident) => {
    const updated = [newIncident, ...incidents];
    setIncidents(updated);
    setSelectedTrackId(newIncident.id);
    setIsTrackModalOpen(true);

    // Save to localStorage & broadcast across tabs
    try {
      localStorage.setItem('resquick_incidents', JSON.stringify(updated));
      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('resquick_live_sync');
        ch.postMessage({ type: 'INCIDENTS_UPDATE', payload: updated });
        ch.close();
      }
    } catch (e) {}

    // Global Cloud Relay: sync immediately to Admin portal across all devices
    pushIncidentToCloud(newIncident);
  };

  // Update existing incident from Admin
  const handleUpdateIncident = (updatedIncident) => {
    const updated = incidents.map(inc => inc.id === updatedIncident.id ? updatedIncident : inc);
    setIncidents(updated);
    if (selectedManageIncident && selectedManageIncident.id === updatedIncident.id) {
      setSelectedManageIncident(updatedIncident);
    }

    try {
      localStorage.setItem('resquick_incidents', JSON.stringify(updated));
      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('resquick_live_sync');
        ch.postMessage({ type: 'INCIDENTS_UPDATE', payload: updated });
        ch.close();
      }
    } catch (e) {}

    // Global Cloud Relay: update status for citizen tracking on any device
    updateIncidentInCloud(updatedIncident);
  };

  // Update National Disaster News from Admin
  const handleUpdateNews = (newNewsItem) => {
    const updated = [newNewsItem, ...newsList];
    setNewsList(updated);

    try {
      localStorage.setItem('resquick_news', JSON.stringify(updated));
      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('resquick_live_sync');
        ch.postMessage({ type: 'NEWS_UPDATE', payload: updated });
        ch.close();
      }
    } catch (e) {}
  };

  // Login handler
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    if (userData.role === 'citizen') {
      setCurrentRole('citizen');
      setCurrentUser(userData);
      if (userData.language) setCurrentLanguage(userData.language);
    } else if (userData.role === 'sub_officer') {
      setCurrentRole('sub_officer');
      setCurrentSubOfficer(userData);
      setCurrentLanguage('en'); // Field Engineer portal is English
    } else {
      setCurrentRole('admin');
      setCurrentOfficer(userData);
      setCurrentLanguage('en'); // In Admin: English strictly
    }
    playDispatchPing();
  };

  // Sign out back to Login Page
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setLoginModalDefaultTab(currentRole === 'sub_officer' ? 'sub_officer' : currentRole);
    playDispatchPing();
  };

  // Switch between citizen & admin/sub-officer views
  const handleSwitchPortal = () => {
    if (currentRole === 'citizen') {
      handleSelectPortal('sub_officer');
    } else if (currentRole === 'sub_officer') {
      handleSelectPortal('admin');
    } else {
      handleSelectPortal('citizen');
    }
  };

  // Direct 1-click switcher between the 3 portals from the Header
  const handleSelectPortal = (targetRole) => {
    setIsLoggedIn(true);
    if (targetRole === 'citizen') {
      setCurrentRole('citizen');
      setCurrentLanguage(currentUser?.language || 'en');
    } else if (targetRole === 'sub_officer') {
      if (!currentSubOfficer) {
        const defaultEng = SUB_OFFICERS_LIST[0];
        setCurrentSubOfficer({
          role: 'sub_officer',
          id: defaultEng.id,
          name: defaultEng.name,
          roleTitle: defaultEng.role,
          department: defaultEng.department,
          phone: defaultEng.phone,
          zone: defaultEng.zone,
          specialization: defaultEng.specialization
        });
      }
      setCurrentRole('sub_officer');
      setCurrentLanguage('en');
    } else if (targetRole === 'admin') {
      setCurrentRole('admin');
      setCurrentLanguage('en');
    }
    playDispatchPing();
  };

  // Switch active engineer inside the Sub-Officer portal
  const handleSwitchSubOfficer = (engineerId) => {
    const eng = SUB_OFFICERS_LIST.find(o => o.id === engineerId);
    if (eng) {
      setCurrentSubOfficer({
        role: 'sub_officer',
        id: eng.id,
        name: eng.name,
        roleTitle: eng.role,
        department: eng.department,
        phone: eng.phone,
        zone: eng.zone,
        specialization: eng.specialization
      });
      playDispatchPing();
    }
  };

  // Helper to open Track Status focusing on current user's grievance
  const handleOpenCitizenTrackStatus = () => {
    const cleanPhone = (p) => (p || '').replace(/\D/g, '').slice(-10);
    const uPhone = cleanPhone(currentUser?.phone);
    const uName = (currentUser?.name || '').trim().toLowerCase();
    
    // Find latest incident reported by this citizen
    const myInc = incidents.find(inc => {
      const incP = cleanPhone(inc.reporterPhone);
      const incN = (inc.reporterName || '').trim().toLowerCase();
      if (uPhone && incP && uPhone === incP) return true;
      if (uName && incN && uName !== 'citizen resident' && uName !== 'citizen user' && uName === incN) return true;
      return false;
    });

    setSelectedTrackId(myInc ? myInc.id : '');
    setIsTrackModalOpen(true);
  };

  // Open Manage Modal
  const handleOpenManageModal = (inc) => {
    setSelectedManageIncident(inc);
    setIsManageModalOpen(true);
  };

  // Open Govt Report Modal (Word document style)
  const handleOpenGovtReport = (inc) => {
    setSelectedGovtReportIncident(inc);
    setIsGovtReportModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* 1. If not logged in, render Login Portal as primary landing page */}
      {!isLoggedIn ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <LoginModal
            isOpen={true}
            onClose={() => {}}
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            onLoginSuccess={handleLoginSuccess}
            isStandalone={true}
            defaultTab={loginModalDefaultTab}
          />
        </div>
      ) : (
        <>
          {/* Universal Top Navigation Header */}
          <Header
            currentRole={currentRole}
            currentUser={
              currentRole === 'citizen'
                ? currentUser
                : currentRole === 'sub_officer'
                ? currentSubOfficer
                : currentOfficer
            }
            currentLanguage={currentRole === 'admin' || currentRole === 'sub_officer' ? 'en' : currentLanguage}
            onLanguageChange={setCurrentLanguage}
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            isEscalated={isEscalated}
            onToggleEscalation={handleToggleEscalation}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenTrackModal={handleOpenCitizenTrackStatus}
            onOpenNewsModal={() => setIsNewsModalOpen(true)}
            onOpenHelplinesModal={() => setIsHelplinesModalOpen(true)}
            onSwitchPortal={handleSwitchPortal}
            onSelectPortal={handleSelectPortal}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onOpenNotifications={() => setIsNewsModalOpen(true)}
            onSignOut={handleSignOut}
            unreadCount={isEscalated ? 5 : 3}
          />

          {/* Primary Portal View (Citizen vs Sub-Officer vs Admin) */}
          <div className="flex-1">
            {currentRole === 'citizen' ? (
              <CitizenPortal
                currentUser={currentUser}
                currentLanguage={currentLanguage}
                zones={zones}
                incidents={incidents}
                isEscalated={isEscalated}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onOpenTrackModal={handleOpenCitizenTrackStatus}
                onOpenNewsModal={() => setIsNewsModalOpen(true)}
                onOpenHelplinesModal={() => setIsHelplinesModalOpen(true)}
                onSelectZone={(z) => setSelectedZone(z)}
                selectedZone={selectedZone}
                onViewIncidentDetails={(inc) => {
                  setSelectedTrackId(inc.id);
                  setIsTrackModalOpen(true);
                }}
                onSwitchToAdmin={() => {
                  setIsLoggedIn(false);
                  setLoginModalDefaultTab('admin');
                  setIsLoginModalOpen(true);
                }}
              />
            ) : currentRole === 'sub_officer' ? (
              <SubOfficerPortal
                currentOfficer={currentSubOfficer}
                incidents={incidents}
                zones={zones}
                isEscalated={isEscalated}
                onUpdateIncident={handleUpdateIncident}
                onSwitchEngineer={handleSwitchSubOfficer}
                onOpenHelplinesModal={() => setIsHelplinesModalOpen(true)}
                onSwitchToCitizen={() => handleSelectPortal('citizen')}
                onSwitchToAdmin={() => handleSelectPortal('admin')}
              />
            ) : (
              <AdminPortal
                zones={zones}
                incidents={incidents}
                isEscalated={isEscalated}
                onToggleEscalation={handleToggleEscalation}
                onResetSimulation={handleResetSimulation}
                onOpenSMSModal={() => setIsSMSModalOpen(true)}
                onOpenAIReportModal={() => setIsAIReportModalOpen(true)}
                onOpenHelplinesModal={() => setIsHelplinesModalOpen(true)}
                onSwitchToCitizen={() => {
                  setCurrentRole('citizen');
                  setCurrentLanguage(currentUser.language || 'en');
                }}
                currentOfficer={currentOfficer}
                onUpdateIncident={handleUpdateIncident}
                onOpenManageModal={handleOpenManageModal}
                onOpenGovtReport={handleOpenGovtReport}
              />
            )}
          </div>

          {/* Floating AI Voice Assistant: "Quicker" - STRICTLY CITIZEN PORTAL ONLY (Removed from Admin as requested) */}
          {currentRole === 'citizen' && (
            <QuickerChatbot
              currentLanguage={currentLanguage}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onOpenTrackModal={handleOpenCitizenTrackStatus}
              onOpenHelplinesModal={() => setIsHelplinesModalOpen(true)}
              incidents={incidents}
            />
          )}
        </>
      )}

      {/* MODALS */}
      {/* Report a Problem (Voice + Live GPS + Photo Upload) */}
      <ReportProblemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentLanguage={currentLanguage}
        currentUser={currentUser}
        onSubmitIncident={handleNewIncidentReport}
      />

      {/* Track Status Timeline Modal */}
      <TrackStatusModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        currentLanguage={currentLanguage}
        incidents={incidents}
        initialSelectedId={selectedTrackId}
        currentUser={currentUser}
        currentRole={currentRole}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* 1-Click Broadcast Emergency SMS Alert Modal with Logged-in citizen direct dispatch */}
      <BroadcastSMSModal
        isOpen={isSMSModalOpen}
        onClose={() => setIsSMSModalOpen(false)}
        isEscalated={isEscalated}
        currentUser={currentUser}
      />

      {/* AI Humanized Disaster Incident Briefing Generator */}
      <AIReportModal
        isOpen={isAIReportModalOpen}
        onClose={() => setIsAIReportModalOpen(false)}
        zones={zones}
        incidents={incidents}
        isEscalated={isEscalated}
        currentOfficer={currentOfficer}
      />

      {/* Escalation Before/After Comparison Modal */}
      <EscalationModal
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        isEscalated={isEscalated}
        onResetSimulation={handleResetSimulation}
      />

      {/* India National Relatable Disaster News Modal (Economic Times Source, Admin Editable) */}
      <NewsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
        currentLanguage={currentRole === 'admin' ? 'en' : currentLanguage}
        newsList={newsList}
        onUpdateNews={handleUpdateNews}
        isAdmin={currentRole === 'admin'}
      />

      {/* 24/7 Emergency Helplines Directory Modal */}
      <HelplinesModal
        isOpen={isHelplinesModalOpen}
        onClose={() => setIsHelplinesModalOpen(false)}
        currentLanguage={currentRole === 'admin' ? 'en' : currentLanguage}
      />

      {/* Screenshot 5: Application Review & Management Modal */}
      <ApplicationManageModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        incident={selectedManageIncident}
        onUpdateIncident={handleUpdateIncident}
        onOpenGovtReport={handleOpenGovtReport}
      />

      {/* Human-made Word Document Style Govt Report Modal */}
      <GovtReportModal
        isOpen={isGovtReportModalOpen}
        onClose={() => setIsGovtReportModalOpen(false)}
        incident={selectedGovtReportIncident}
      />

      {/* Footer Disclaimer */}
      {isLoggedIn && (
        <footer className="border-t border-white/5 py-3 px-4 text-center text-xs text-slate-500 bg-slate-950">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <span>CivicSense / ResQuick Command Core</span>
              <span>•</span>
              <span className="text-slate-400">Assess. Prioritize. Respond.</span>
            </div>
            <div>
              Simulation Environment — Multi-Factor Dynamic Risk & Tactical Resource Allocation
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}

export default App;
