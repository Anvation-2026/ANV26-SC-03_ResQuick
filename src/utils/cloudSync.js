// ResQuick Global Real-Time Cloud Sync Engine
// Powered by fast pub/sub & persistent cloud relay for 100% cross-device sync

const SYNC_TOPIC = 'resquick_municipal_dispatch_2026';
const NTFY_URL = `https://ntfy.sh/${SYNC_TOPIC}`;
const LOCAL_STORAGE_KEY = 'resquick_cloud_incidents_cache';

// BroadcastChannel for instant zero-latency same-machine multi-tab sync
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('resquick_sync_channel');
  } catch (e) {}
}

const CATEGORY_IMAGES = {
  'Flood': 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
  'Building Damage': 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
  'Road Blockage': 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  'Water Contamination': 'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&w=800&q=80',
  'Fire': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
};

const getSafeImageUrl = (inc) => {
  if (inc.mediaUrl && !inc.mediaUrl.startsWith('blob:')) return inc.mediaUrl;
  const cat = inc.issue || inc.category || 'Road Blockage';
  return CATEGORY_IMAGES[cat] || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
};

/**
 * Fetch all incidents published across devices in the last 24 hours
 */
export async function fetchCloudIncidents() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${NTFY_URL}/json?poll=1&since=24h`, {
      method: 'GET',
      headers: {
        'Accept': 'application/x-ndjson'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const text = await res.text();
    const lines = text.trim().split('\n').filter(Boolean);
    const incidentsMap = new Map();

    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        if (item.event === 'message' && item.message) {
          const parsed = JSON.parse(item.message);
          if (parsed && parsed.id && !parsed.id.startsWith('TEST-')) {
            incidentsMap.set(parsed.id, parsed);
          }
        }
      } catch (e) {
        // Ignore malformed line
      }
    }

    const incidentsList = Array.from(incidentsMap.values());
    if (incidentsList.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(incidentsList));
    }
    return incidentsList;
  } catch (err) {
    console.warn('[CloudSync] Fallback to cached cloud incidents:', err.message);
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  }
}

/**
 * Publish a new incident from any device to the cloud relay
 */
export async function pushIncidentToCloud(newIncident) {
  try {
    const cloudPayload = {
      ...newIncident,
      mediaUrl: getSafeImageUrl(newIncident)
    };

    // 1. Immediately cache locally & notify local tabs
    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        const updated = [newIncident, ...existing.filter(i => i.id !== newIncident.id)];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}

      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'NEW_INCIDENT', incident: newIncident });
      }
    }

    // 2. Publish to cloud relay for all remote devices
    const response = await fetch(NTFY_URL, {
      method: 'POST',
      headers: {
        'Title': `New Incident: ${newIncident.id}`,
        'Priority': 'urgent',
        'Tags': 'rotating_light,warning'
      },
      body: JSON.stringify(cloudPayload)
    });

    return response.ok;
  } catch (err) {
    console.error('[CloudSync] Failed to publish incident to cloud:', err);
    return false;
  }
}

/**
 * Publish an incident status update (e.g. from Admin portal to Citizen)
 */
export async function updateIncidentInCloud(updatedIncident) {
  try {
    const cloudPayload = {
      ...updatedIncident,
      mediaUrl: getSafeImageUrl(updatedIncident)
    };

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        const updated = existing.map(i => i.id === updatedIncident.id ? updatedIncident : i);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}

      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'UPDATE_INCIDENT', incident: updatedIncident });
      }
    }

    const response = await fetch(NTFY_URL, {
      method: 'POST',
      headers: {
        'Title': `Status Update: ${updatedIncident.id}`,
        'Tags': 'arrows_counterclockwise,bell'
      },
      body: JSON.stringify(cloudPayload)
    });

    return response.ok;
  } catch (err) {
    console.error('[CloudSync] Failed to update incident in cloud:', err);
    return false;
  }
}

/**
 * Connect to live real-time Server-Sent Events (SSE) stream
 * Receives incoming complaints from other devices with zero latency
 */
export function connectRealtimeSync(onIncidentReceived) {
  if (typeof window === 'undefined') return () => {};

  let eventSource = null;
  let isClosed = false;

  const connect = () => {
    if (isClosed) return;
    try {
      eventSource = new EventSource(`${NTFY_URL}/sse`);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === 'message' && payload.message) {
            const inc = JSON.parse(payload.message);
            if (inc && inc.id) {
              onIncidentReceived(inc);
            }
          }
        } catch (e) {}
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          // Auto-reconnect after 3 seconds
          if (!isClosed) setTimeout(connect, 3000);
        }
      };
    } catch (err) {
      console.warn('[CloudSync] SSE connection warning:', err);
    }
  };

  connect();

  // Also listen for same-device cross-tab events
  const localHandler = (e) => {
    if (e.data?.incident) {
      onIncidentReceived(e.data.incident);
    }
  };
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', localHandler);
  }

  return () => {
    isClosed = true;
    if (eventSource) eventSource.close();
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', localHandler);
    }
  };
}
