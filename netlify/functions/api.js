import { getStore } from '@netlify/blobs';

const DEFAULT_USERS = [
  {
    id: 'FARMER-001',
    name: 'Ramesh Patil',
    phone: '+91 98220 14892',
    rawPhone: '9822014892',
    email: 'ramesh.patil@sahyadrifpo.org',
    role: 'farmer',
    organization: 'Sahyadri FPO',
    location: 'Haveli, Pune, Maharashtra',
    avatar: '👨‍🌾'
  },
  {
    id: 'FARMER-002',
    name: 'Sanjay Shinde',
    phone: '+91 94220 54129',
    rawPhone: '9422054129',
    email: 'sanjay.shinde@godavariagro.com',
    role: 'farmer',
    organization: 'Godavari Agro FPO',
    location: 'Dindori, Nashik, Maharashtra',
    avatar: '👨‍🌾'
  },
  {
    id: 'FARMER-003',
    name: 'Kishor Ghadge',
    phone: '+91 97632 88401',
    rawPhone: '9763288401',
    email: 'kishor.ghadge@pravaragroup.org',
    role: 'farmer',
    organization: 'Pravara Farmers Group',
    location: 'Sangamner, Ahmednagar, Maharashtra',
    avatar: '👨‍🌾'
  },
  {
    id: 'BUYER-101',
    name: 'Amit Deshmukh',
    phone: '+91 98902 44100',
    rawPhone: '9890244100',
    email: 'procurement@sahyadrifoodpark.com',
    role: 'buyer',
    organization: 'Sahyadri Mega Food Park',
    location: 'Chakan Industrial Zone, Pune',
    avatar: '🏢'
  },
  {
    id: 'TRANS-201',
    name: 'Tukaram Shinde',
    phone: '+91 94223 90812',
    rawPhone: '9422390812',
    email: 'dispatch@kisanexpress.in',
    role: 'transporter',
    organization: 'Kisan Express Logistics',
    location: 'Western Maharashtra',
    avatar: '🚚'
  },
  {
    id: 'STORAGE-301',
    name: 'Balasaheb Kadam',
    phone: '+91 97654 32190',
    rawPhone: '9765432190',
    email: 'operations@sahyadricoldchain.com',
    role: 'cold_storage',
    organization: 'Sahyadri Agro Cold Chain & Mega Warehousing',
    location: 'Niphad Cold Hub, Nashik',
    avatar: '❄️'
  },
  {
    id: 'ADMIN-SUPER-01',
    name: 'Vedant Chavan',
    phone: '+91 84829 41628',
    rawPhone: '8482941628',
    email: 'vedantkchavan2006@gmail.com',
    role: 'admin',
    isSuperAdmin: true,
    organization: 'MahaAgri Central Directorate & Platform Control',
    department: 'Chief Platform Administrator & State System Overseer',
    location: 'State Command Headquarters, Maharashtra',
    avatar: '👑'
  }
];

const DEFAULT_LOTS = [
  {
    id: "LOT-PN-2026-081",
    farmerId: "FARMER-001",
    farmerName: "Ramesh Patil",
    farmerPhone: "+91 98220 14892",
    farmerEmail: "ramesh.patil@sahyadrifpo.org",
    farmerFpo: "Sahyadri Farmers Producer Co.",
    location: "Haveli, Pune, Maharashtra",
    district: "pune",
    category: "Vegetable",
    crop: "Onion",
    cropMr: "कांदा",
    cropId: "onion",
    variety: "Garwa Red Onion",
    quantity: 1000,
    unit: "KG",
    grade: "A",
    expectedPrice: 28,
    harvestDate: "2026-09-03",
    status: "Offers Received",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80"
    ],
    qualityScore: 94,
    freshness: "96%",
    damagePercent: 1.8,
    bulbSize: "55-65 mm",
    createdAt: "2026-09-04",
    description: "Premium Grade A Garwa Red Onion with high shelf life."
  }
];

let inMemoryDb = {
  version: 1,
  updatedAt: new Date().toISOString(),
  registeredUsers: DEFAULT_USERS,
  lots: DEFAULT_LOTS,
  offers: [],
  orders: [],
  transactions: [],
  activity: [
    { id: 'ACT-1', text: 'Ramesh Patil created a new Onion lot (1,000 KG Grade A in Pune)', time: '2 minutes ago', type: 'lot' }
  ],
  transportBookings: [],
  storageBookings: []
};

// Helper to get store or in-memory
const getDb = async () => {
  try {
    const store = getStore({ name: 'agrilink_store', consistency: 'strong' });
    const remoteData = await store.get('database', { type: 'json' });
    if (remoteData && remoteData.lots) {
      return { store, data: remoteData };
    }
    // Initialize store
    await store.setJSON('database', inMemoryDb);
    return { store, data: inMemoryDb };
  } catch (err) {
    console.warn('[Netlify Blobs] Using in-memory fallback:', err.message);
    return { store: null, data: inMemoryDb };
  }
};

const saveDb = async (store, data) => {
  data.updatedAt = new Date().toISOString();
  inMemoryDb = data;
  if (store) {
    try {
      await store.setJSON('database', data);
    } catch (err) {
      console.warn('[Netlify Blobs] Could not write to store:', err.message);
    }
  }
};

const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};

export default async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  const url = new URL(req.url);
  let pathname = url.pathname;

  // Normalize path from /.netlify/functions/api/... or /api/...
  pathname = pathname.replace(/^\/\.netlify\/functions\/api/, '');
  if (!pathname.startsWith('/')) pathname = '/' + pathname;

  try {
    const { store, data } = await getDb();

    // 1. GET /data or /api/data
    if (req.method === 'GET' && (pathname === '/data' || pathname === '/api/data')) {
      return jsonResponse({
        success: true,
        serverTime: Date.now(),
        data
      });
    }

    // 2. POST /lots or /api/lots
    if (req.method === 'POST' && (pathname === '/lots' || pathname === '/api/lots')) {
      const lot = await req.json();
      if (!lot || !lot.id) {
        return jsonResponse({ success: false, error: 'Invalid lot data' }, 400);
      }
      const existingIdx = data.lots.findIndex(l => l.id === lot.id);
      if (existingIdx >= 0) {
        data.lots[existingIdx] = { ...data.lots[existingIdx], ...lot };
      } else {
        data.lots.unshift(lot);
      }
      await saveDb(store, data);
      return jsonResponse({ success: true, lot });
    }

    // 3. DELETE /lots/:id
    if (req.method === 'DELETE' && (pathname.startsWith('/lots/') || pathname.startsWith('/api/lots/'))) {
      const lotId = pathname.split('/').pop();
      data.lots = data.lots.filter(l => l.id !== lotId);
      await saveDb(store, data);
      return jsonResponse({ success: true, lotId });
    }

    // 4. POST /users
    if (req.method === 'POST' && (pathname === '/users' || pathname === '/api/users')) {
      const user = await req.json();
      if (!user) return jsonResponse({ success: false, error: 'Invalid user' }, 400);
      const uEmail = (user.email || '').toLowerCase().trim();
      const uPhone = (user.rawPhone || user.phone || '').replace(/\D/g, '').slice(-10);

      const existingIdx = data.registeredUsers.findIndex(u => {
        if (u.id === user.id) return true;
        if (uEmail && u.email && u.email.toLowerCase().trim() === uEmail) return true;
        const phone = (u.rawPhone || u.phone || '').replace(/\D/g, '').slice(-10);
        if (uPhone && phone && uPhone === phone) return true;
        return false;
      });

      if (existingIdx >= 0) {
        data.registeredUsers[existingIdx] = { ...data.registeredUsers[existingIdx], ...user };
      } else {
        data.registeredUsers.unshift(user);
      }
      await saveDb(store, data);
      return jsonResponse({ success: true, user });
    }

    // 5. POST /offers
    if (req.method === 'POST' && (pathname === '/offers' || pathname === '/api/offers')) {
      const offer = await req.json();
      const idx = data.offers.findIndex(o => o.id === offer.id);
      if (idx >= 0) {
        data.offers[idx] = { ...data.offers[idx], ...offer };
      } else {
        data.offers.unshift(offer);
      }
      await saveDb(store, data);
      return jsonResponse({ success: true, offer });
    }

    // 6. POST /orders
    if (req.method === 'POST' && (pathname === '/orders' || pathname === '/api/orders')) {
      const order = await req.json();
      const idx = data.orders.findIndex(o => o.id === order.id);
      if (idx >= 0) {
        data.orders[idx] = { ...data.orders[idx], ...order };
      } else {
        data.orders.unshift(order);
      }
      await saveDb(store, data);
      return jsonResponse({ success: true, order });
    }

    // 7. POST /transactions
    if (req.method === 'POST' && (pathname === '/transactions' || pathname === '/api/transactions')) {
      const txn = await req.json();
      const idx = data.transactions.findIndex(t => t.id === txn.id);
      if (idx >= 0) {
        data.transactions[idx] = { ...data.transactions[idx], ...txn };
      } else {
        data.transactions.unshift(txn);
      }
      await saveDb(store, data);
      return jsonResponse({ success: true, transaction: txn });
    }

    // 8. POST /activity
    if (req.method === 'POST' && (pathname === '/activity' || pathname === '/api/activity')) {
      const act = await req.json();
      data.activity = [act, ...(data.activity || []).slice(0, 29)];
      await saveDb(store, data);
      return jsonResponse({ success: true, activity: act });
    }

    // 9. POST /sync
    if (req.method === 'POST' && (pathname === '/sync' || pathname === '/api/sync')) {
      const payload = await req.json();
      if (Array.isArray(payload.lots)) {
        payload.lots.forEach(l => {
          if (!l || !l.id) return;
          const idx = data.lots.findIndex(item => item.id === l.id);
          if (idx === -1) data.lots.unshift(l);
          else data.lots[idx] = { ...data.lots[idx], ...l };
        });
      }
      await saveDb(store, data);
      return jsonResponse({ success: true, serverTime: Date.now(), data });
    }

    // Health
    if (pathname === '/health' || pathname === '/api/health') {
      return jsonResponse({ status: 'healthy', provider: 'Netlify Functions + Blobs', time: Date.now() });
    }

    return jsonResponse({ error: 'Endpoint not found', path: pathname }, 404);
  } catch (err) {
    console.error('[Netlify Function API Error]:', err);
    return jsonResponse({ error: err.message }, 500);
  }
};
