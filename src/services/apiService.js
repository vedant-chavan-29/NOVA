// AgriLink Centralized API & Multi-Device Real-Time Sync Service
// Supports: Netlify Functions + Blobs, Local Vite/Node API, and Direct Firebase Realtime Cloud Sync

const API_BASE = '/api';

// BroadcastChannel for instant sub-millisecond sync across tabs/windows on same machine
let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('agrilink_multi_device_sync');
  }
} catch {
  broadcastChannel = null;
}

export const notifyBroadcast = (type, payload) => {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
    } catch {
      // ignore
    }
  }
};

export const subscribeToBroadcast = (callback) => {
  if (!broadcastChannel) return () => {};
  const handler = (event) => {
    if (event.data && typeof callback === 'function') {
      callback(event.data);
    }
  };
  broadcastChannel.addEventListener('message', handler);
  return () => broadcastChannel.removeEventListener('message', handler);
};

// Cloud Database Configuration (Firebase Realtime Database REST/SSE)
export const getCloudDbUrl = () => {
  try {
    const saved = localStorage.getItem('agrilink_cloud_db_url');
    if (saved && saved.trim()) return saved.trim().replace(/\/$/, '');
    const envUrl = import.meta.env.VITE_FIREBASE_DB_URL;
    if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/$/, '');
  } catch {
    // ignore
  }
  return null;
};

export const setCloudDbUrl = (url) => {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem('agrilink_cloud_db_url');
    } else {
      localStorage.setItem('agrilink_cloud_db_url', url.trim().replace(/\/$/, ''));
    }
    notifyBroadcast('SYNC_CONFIG_CHANGED', { cloudUrl: url });
  } catch {
    // ignore
  }
};

// Realtime EventSource listener for Firebase Realtime Database
let firebaseEventSource = null;

export const subscribeToCloudEvents = (onDataUpdate) => {
  const cloudUrl = getCloudDbUrl();
  if (!cloudUrl || !cloudUrl.includes('firebaseio.com')) {
    if (firebaseEventSource) {
      firebaseEventSource.close();
      firebaseEventSource = null;
    }
    return () => {};
  }

  try {
    if (firebaseEventSource) {
      firebaseEventSource.close();
    }
    const sseUrl = `${cloudUrl}/agrilink.json`;
    firebaseEventSource = new EventSource(sseUrl);

    firebaseEventSource.addEventListener('put', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.data && typeof onDataUpdate === 'function') {
          onDataUpdate(payload.data);
        }
      } catch (err) {
        console.warn('[Cloud SSE Parse Warning]:', err);
      }
    });

    firebaseEventSource.onerror = (err) => {
      console.warn('[Cloud SSE Connection Warning]:', err);
    };

    return () => {
      if (firebaseEventSource) {
        firebaseEventSource.close();
        firebaseEventSource = null;
      }
    };
  } catch (err) {
    console.warn('[Cloud SSE Init Error]:', err);
    return () => {};
  }
};

export const apiService = {
  // Fetch full live database state
  async fetchData() {
    const cloudUrl = getCloudDbUrl();

    // 1. Try local/Netlify API first
    try {
      const response = await fetch(`${API_BASE}/data`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      const contentType = response.headers.get('content-type') || '';
      // If server returned JSON
      if (response.ok && contentType.includes('application/json')) {
        const json = await response.json();
        if (json && json.data) {
          return json.data;
        }
      }
    } catch (apiErr) {
      console.warn('[ApiService] API unreachable, checking cloud database:', apiErr.message);
    }

    // 2. Fallback to direct Cloud Database (Firebase / Cloud KV) if configured
    if (cloudUrl) {
      try {
        const response = await fetch(`${cloudUrl}/agrilink/data.json`, { cache: 'no-store' });
        if (response.ok) {
          const cloudData = await response.json();
          if (cloudData && typeof cloudData === 'object') {
            return cloudData;
          }
        }
      } catch (cloudErr) {
        console.warn('[ApiService] Cloud DB fetch failed:', cloudErr.message);
      }
    }

    return null;
  },

  // Save or update a crop lot
  async saveLot(lot) {
    notifyBroadcast('LOT_UPDATED', lot);

    // 1. Send to local/Netlify API
    try {
      const response = await fetch(`${API_BASE}/lots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lot)
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.lot) return data.lot;
      }
    } catch (err) {
      console.warn('[ApiService] Failed to save lot via API:', err.message);
    }

    // 2. Direct Cloud Database fallback
    const cloudUrl = getCloudDbUrl();
    if (cloudUrl) {
      try {
        await fetch(`${cloudUrl}/agrilink/data/lots/${lot.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lot)
        });
      } catch (cloudErr) {
        console.warn('[ApiService] Cloud DB lot save failed:', cloudErr.message);
      }
    }

    return lot;
  },

  // Delete a crop lot
  async deleteLot(lotId) {
    notifyBroadcast('LOT_DELETED', { lotId });

    try {
      await fetch(`${API_BASE}/lots/${lotId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[ApiService] Failed to delete lot via API:', err.message);
    }

    const cloudUrl = getCloudDbUrl();
    if (cloudUrl) {
      try {
        await fetch(`${cloudUrl}/agrilink/data/lots/${lotId}.json`, { method: 'DELETE' });
      } catch {
        // ignore
      }
    }

    return true;
  },

  // Save or register user profile
  async saveUser(user) {
    notifyBroadcast('USER_UPDATED', user);

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.user) return data.user;
      }
    } catch (err) {
      console.warn('[ApiService] Failed to save user via API:', err.message);
    }

    const cloudUrl = getCloudDbUrl();
    if (cloudUrl) {
      try {
        await fetch(`${cloudUrl}/agrilink/data/users/${user.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
      } catch {
        // ignore
      }
    }

    return user;
  },

  // Save or update an offer
  async saveOffer(offer) {
    notifyBroadcast('OFFER_UPDATED', offer);

    try {
      const response = await fetch(`${API_BASE}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer)
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.offer) return data.offer;
      }
    } catch {
      // ignore
    }

    const cloudUrl = getCloudDbUrl();
    if (cloudUrl) {
      try {
        await fetch(`${cloudUrl}/agrilink/data/offers/${offer.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(offer)
        });
      } catch {
        // ignore
      }
    }

    return offer;
  },

  // Save or update an order
  async saveOrder(order) {
    notifyBroadcast('ORDER_UPDATED', order);

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.order) return data.order;
      }
    } catch {
      // ignore
    }

    const cloudUrl = getCloudDbUrl();
    if (cloudUrl) {
      try {
        await fetch(`${cloudUrl}/agrilink/data/orders/${order.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
      } catch {
        // ignore
      }
    }

    return order;
  },

  // Save transaction
  async saveTransaction(txn) {
    notifyBroadcast('TRANSACTION_UPDATED', txn);

    try {
      await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txn)
      });
    } catch {
      // ignore
    }

    const cloudUrl = getCloudDbUrl();
    if (cloudUrl) {
      try {
        await fetch(`${cloudUrl}/agrilink/data/transactions/${txn.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(txn)
        });
      } catch {
        // ignore
      }
    }

    return txn;
  },

  // Save activity item
  async saveActivity(activity) {
    notifyBroadcast('ACTIVITY_UPDATED', activity);

    try {
      await fetch(`${API_BASE}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
    } catch {
      // ignore
    }
  },

  // Sync entire dataset to Cloud
  async syncToCloud(fullData) {
    const cloudUrl = getCloudDbUrl();
    if (!cloudUrl) return false;

    try {
      const res = await fetch(`${cloudUrl}/agrilink/data.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Test current connection (returns diagnostic status)
  async testConnection() {
    let apiStatus = false;
    let cloudStatus = false;
    const cloudUrl = getCloudDbUrl();

    try {
      const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        apiStatus = true;
      }
    } catch {
      apiStatus = false;
    }

    if (cloudUrl) {
      try {
        const res = await fetch(`${cloudUrl}/agrilink/ping.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timestamp: Date.now() })
        });
        if (res.ok) cloudStatus = true;
      } catch {
        cloudStatus = false;
      }
    }

    return {
      apiConnected: apiStatus,
      cloudConnected: cloudStatus,
      activeMode: apiStatus ? 'Netlify Functions & Blobs API' : (cloudStatus ? 'Firebase Realtime Cloud' : 'Local Offline Cache')
    };
  }
};

export default apiService;
