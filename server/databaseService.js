import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

// Default initial state
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
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80"
    ],
    qualityScore: 94,
    freshness: "96%",
    damagePercent: 1.8,
    bulbSize: "55-65 mm",
    createdAt: "2026-09-04",
    description: "Premium Grade A Garwa Red Onion with high shelf life and cured skin."
  },
  {
    id: "LOT-NSK-2026-042",
    farmerId: "FARMER-002",
    farmerName: "Sanjay Shinde",
    farmerPhone: "+91 94220 54129",
    farmerEmail: "sanjay.shinde@godavariagro.com",
    farmerFpo: "Godavari Agro FPO",
    location: "Dindori, Nashik, Maharashtra",
    district: "nashik",
    category: "Vegetable",
    crop: "Tomato",
    cropMr: "टोमॅटो",
    cropId: "tomato",
    variety: "Abhinav Hybrid",
    quantity: 1200,
    unit: "KG",
    grade: "A",
    expectedPrice: 24,
    harvestDate: "2026-09-05",
    status: "Open",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
    ],
    qualityScore: 91,
    freshness: "98%",
    damagePercent: 2.1,
    bulbSize: "60-70 mm",
    createdAt: "2026-09-05",
    description: "Uniform deep red color, firm texture ideal for food processing."
  },
  {
    id: "LOT-SOL-2026-105",
    farmerId: "FARMER-003",
    farmerName: "Kishor Ghadge",
    farmerPhone: "+91 97632 88401",
    farmerEmail: "kishor.ghadge@pravaragroup.org",
    farmerFpo: "Pravara Farmers Group",
    location: "Sangamner, Ahmednagar, Maharashtra",
    district: "ahmednagar",
    category: "Fruit",
    crop: "Pomegranate",
    cropMr: "डाळिंब",
    cropId: "pomegranate",
    variety: "Bhagwa Export Grade",
    quantity: 800,
    unit: "KG",
    grade: "A+",
    expectedPrice: 115,
    harvestDate: "2026-09-06",
    status: "Open",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80"
    ],
    qualityScore: 97,
    freshness: "99%",
    damagePercent: 0.9,
    bulbSize: "280-350 g/fruit",
    createdAt: "2026-09-06",
    description: "Glossy red skin Bhagwa pomegranates, export standard sweetness."
  }
];

const DEFAULT_OFFERS = [
  {
    id: "OFFER-101",
    lotId: "LOT-PN-2026-081",
    buyerId: "BUYER-101",
    buyerName: "Sahyadri Mega Food Park",
    buyerPhone: "+91 98902 44100",
    buyerType: "Institutional Buyer",
    buyerLocation: "Chakan Industrial Zone, Pune",
    offeredRate: 28,
    quantityRequested: 1000,
    totalOfferedAmount: 28000,
    estTransportCost: 0,
    netFarmerRealisation: 28000,
    netRatePerKg: 28,
    pickupDate: "2026-09-15",
    paymentTerms: "100% Escrow deposit protected. Instant DBT release.",
    status: "Pending",
    createdAt: "2026-09-06",
    createdAtTime: "11:30 AM"
  }
];

const DEFAULT_ACTIVITY = [
  { id: 'ACT-1', text: 'Ramesh Patil created a new Onion lot (1,000 KG Grade A in Pune)', time: '2 minutes ago', type: 'lot' },
  { id: 'ACT-2', text: 'Sahyadri Mega Food Park placed an offer of ₹28/KG on Lot #LOT-PN-2026-081', time: '5 minutes ago', type: 'offer' },
  { id: 'ACT-3', text: 'Order #AGR10245 confirmed between Ramesh Patil and Sahyadri Mega Food Park', time: '8 minutes ago', type: 'order' }
];

class DatabaseService {
  constructor() {
    this.ensureDatabase();
  }

  ensureDatabase() {
    if (!fs.existsSync(__dirname)) {
      fs.mkdirSync(__dirname, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        version: 1,
        updatedAt: new Date().toISOString(),
        registeredUsers: DEFAULT_USERS,
        lots: DEFAULT_LOTS,
        offers: DEFAULT_OFFERS,
        orders: [],
        transactions: [],
        activity: DEFAULT_ACTIVITY,
        transportBookings: [],
        storageBookings: []
      };
      this.writeDatabase(initialData);
    }
  }

  readDatabase() {
    try {
      this.ensureDatabase();
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('[DB] Error reading database file:', err);
      return {
        version: 1,
        updatedAt: new Date().toISOString(),
        registeredUsers: DEFAULT_USERS,
        lots: DEFAULT_LOTS,
        offers: DEFAULT_OFFERS,
        orders: [],
        transactions: [],
        activity: DEFAULT_ACTIVITY,
        transportBookings: [],
        storageBookings: []
      };
    }
  }

  writeDatabase(data) {
    try {
      data.updatedAt = new Date().toISOString();
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
      return true;
    } catch (err) {
      console.error('[DB] Error writing database file:', err);
      return false;
    }
  }

  // --- CRUD HELPERS ---

  getAllData() {
    return this.readDatabase();
  }

  saveLot(lot) {
    const db = this.readDatabase();
    const existingIndex = db.lots.findIndex(l => l.id === lot.id);
    if (existingIndex >= 0) {
      db.lots[existingIndex] = { ...db.lots[existingIndex], ...lot };
    } else {
      db.lots.unshift(lot);
    }
    this.writeDatabase(db);
    return lot;
  }

  deleteLot(lotId) {
    const db = this.readDatabase();
    db.lots = db.lots.filter(l => l.id !== lotId);
    this.writeDatabase(db);
    return { success: true, lotId };
  }

  saveUser(user) {
    const db = this.readDatabase();
    const userEmail = (user.email || '').toLowerCase().trim();
    const userPhone = (user.rawPhone || user.phone || '').replace(/\D/g, '').slice(-10);

    const existingIndex = db.registeredUsers.findIndex(u => {
      if (u.id && user.id && u.id === user.id) return true;
      if (userEmail && u.email && u.email.toLowerCase().trim() === userEmail) return true;
      const uPhone = (u.rawPhone || u.phone || '').replace(/\D/g, '').slice(-10);
      if (userPhone && uPhone && userPhone === uPhone) return true;
      return false;
    });

    if (existingIndex >= 0) {
      db.registeredUsers[existingIndex] = { ...db.registeredUsers[existingIndex], ...user };
    } else {
      db.registeredUsers.unshift(user);
    }
    this.writeDatabase(db);
    return user;
  }

  saveOffer(offer) {
    const db = this.readDatabase();
    const existingIndex = db.offers.findIndex(o => o.id === offer.id);
    if (existingIndex >= 0) {
      db.offers[existingIndex] = { ...db.offers[existingIndex], ...offer };
    } else {
      db.offers.unshift(offer);
    }
    this.writeDatabase(db);
    return offer;
  }

  saveOrder(order) {
    const db = this.readDatabase();
    const existingIndex = db.orders.findIndex(o => o.id === order.id);
    if (existingIndex >= 0) {
      db.orders[existingIndex] = { ...db.orders[existingIndex], ...order };
    } else {
      db.orders.unshift(order);
    }
    this.writeDatabase(db);
    return order;
  }

  saveTransaction(txn) {
    const db = this.readDatabase();
    const existingIndex = db.transactions.findIndex(t => t.id === txn.id);
    if (existingIndex >= 0) {
      db.transactions[existingIndex] = { ...db.transactions[existingIndex], ...txn };
    } else {
      db.transactions.unshift(txn);
    }
    this.writeDatabase(db);
    return txn;
  }

  saveActivity(activity) {
    const db = this.readDatabase();
    db.activity = [activity, ...(db.activity || []).slice(0, 29)];
    this.writeDatabase(db);
    return activity;
  }

  // Bidirectional Bulk Sync
  sync(clientPayload) {
    const db = this.readDatabase();
    let hasChanges = false;

    // Merge lots from client if newer or missing
    if (Array.isArray(clientPayload.lots)) {
      clientPayload.lots.forEach(clientLot => {
        if (!clientLot || !clientLot.id) return;
        const idx = db.lots.findIndex(l => l.id === clientLot.id);
        if (idx === -1) {
          db.lots.unshift(clientLot);
          hasChanges = true;
        } else {
          // If status or expected price updated
          if (db.lots[idx].status !== clientLot.status || db.lots[idx].expectedPrice !== clientLot.expectedPrice) {
            db.lots[idx] = { ...db.lots[idx], ...clientLot };
            hasChanges = true;
          }
        }
      });
    }

    // Merge registered users
    if (Array.isArray(clientPayload.registeredUsers)) {
      clientPayload.registeredUsers.forEach(clientUser => {
        if (!clientUser || !clientUser.id) return;
        const cEmail = (clientUser.email || '').toLowerCase().trim();
        const cPhone = (clientUser.rawPhone || clientUser.phone || '').replace(/\D/g, '').slice(-10);

        const exists = db.registeredUsers.some(u => {
          if (u.id === clientUser.id) return true;
          if (cEmail && u.email && u.email.toLowerCase().trim() === cEmail) return true;
          const uPhone = (u.rawPhone || u.phone || '').replace(/\D/g, '').slice(-10);
          if (cPhone && uPhone && cPhone === uPhone) return true;
          return false;
        });

        if (!exists) {
          db.registeredUsers.unshift(clientUser);
          hasChanges = true;
        }
      });
    }

    // Merge offers
    if (Array.isArray(clientPayload.offers)) {
      clientPayload.offers.forEach(clientOffer => {
        if (!clientOffer || !clientOffer.id) return;
        const idx = db.offers.findIndex(o => o.id === clientOffer.id);
        if (idx === -1) {
          db.offers.unshift(clientOffer);
          hasChanges = true;
        } else if (db.offers[idx].status !== clientOffer.status) {
          db.offers[idx] = { ...db.offers[idx], ...clientOffer };
          hasChanges = true;
        }
      });
    }

    // Merge orders
    if (Array.isArray(clientPayload.orders)) {
      clientPayload.orders.forEach(clientOrder => {
        if (!clientOrder || !clientOrder.id) return;
        const idx = db.orders.findIndex(o => o.id === clientOrder.id);
        if (idx === -1) {
          db.orders.unshift(clientOrder);
          hasChanges = true;
        } else if (db.orders[idx].status !== clientOrder.status || db.orders[idx].timelineStep !== clientOrder.timelineStep) {
          db.orders[idx] = { ...db.orders[idx], ...clientOrder };
          hasChanges = true;
        }
      });
    }

    // Merge transactions
    if (Array.isArray(clientPayload.transactions)) {
      clientPayload.transactions.forEach(clientTxn => {
        if (!clientTxn || !clientTxn.id) return;
        const idx = db.transactions.findIndex(t => t.id === clientTxn.id);
        if (idx === -1) {
          db.transactions.unshift(clientTxn);
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      this.writeDatabase(db);
    }

    return {
      success: true,
      serverTime: Date.now(),
      data: db
    };
  }
}

export const databaseService = new DatabaseService();
export default databaseService;
