import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_LOTS, 
  INITIAL_OFFERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_GRIEVANCES, 
  INITIAL_NOTIFICATIONS,
  TRANSPORT_PROVIDERS,
  STORAGE_PROVIDERS,
  VERIFIED_BUYERS_DIRECTORY,
  VEHICLE_OPTIONS,
  INITIAL_TRANSPORT_BOOKINGS,
  CROPS_CATALOG
} from '../mockData';
import { translations } from '../translations';
import { apiService, subscribeToBroadcast } from '../services/apiService';

const AppContext = createContext();

const STORAGE_KEYS = {
  USER: 'agrisetu_auth_active_user_v7',
  REGISTERED_USERS: 'agrisetu_registered_users_v2',
  LANG: 'agrisetu_lang_v2',
  LOTS: 'agrisetu_lots_v3',
  OFFERS: 'agrisetu_offers_v3',
  ORDERS: 'agrisetu_orders_v3',
  TRANSACTIONS: 'agrisetu_txns_v3',
  GRIEVANCES: 'agrisetu_grv_v2',
  ACTIVITY: 'agrisetu_activity_v2',
  NOTIFICATIONS: 'agrisetu_notif_v2',
  STORAGE_BOOKINGS: 'agrisetu_storage_v2',
  STORAGE_FACILITIES: 'agrisetu_storage_facilities_v1',
  TRANSPORT_BOOKINGS: 'agrisetu_transport_bookings_v2',
  FLEET_VEHICLES: 'agrisetu_fleet_vehicles_v1'
};

export const getClean10DigitPhone = (rawPhone) => {
  if (!rawPhone) return '';
  return rawPhone.toString().replace(/\D/g, '').slice(-10);
};

export const INITIAL_REGISTERED_USERS = [
  {
    id: 'FARMER-001',
    name: 'Ramesh Patil',
    phone: '+91 98220 14892',
    rawPhone: '9822014892',
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
    role: 'cold_storage',
    organization: 'Sahyadri Agro Cold Chain & Mega Warehousing',
    location: 'Niphad Cold Hub, Nashik',
    email: 'operations@sahyadricoldchain.com',
    avatar: '❄️'
  },
  {
    id: 'ADMIN-SUPER-01',
    name: 'Vedant Chavan',
    phone: '+91 84829 41628',
    rawPhone: '8482941628',
    role: 'admin',
    isSuperAdmin: true,
    organization: 'MahaAgri Central Directorate & Platform Control',
    department: 'Chief Platform Administrator & State System Overseer',
    location: 'State Command Headquarters, Maharashtra',
    email: 'vedantkchavan2006@gmail.com',
    avatar: '👑'
  }
];


export const isUserLot = (lot, user) => {
  if (!lot || !user) return false;
  if (user.role === 'admin') return true;
  
  // 1. Check user email match (crucial for multi-device sync with same email)
  const userEmail = (user.email || '').toLowerCase().trim();
  const lotEmail = (lot.farmerEmail || '').toLowerCase().trim();
  if (userEmail && lotEmail && userEmail === lotEmail) return true;

  // 2. Check clean 10-digit phone match
  const userPhoneClean = user.phone ? user.phone.replace(/[^0-9]/g, '').slice(-10) : '';
  const lotPhoneClean = lot.farmerPhone ? lot.farmerPhone.replace(/[^0-9]/g, '').slice(-10) : '';
  if (userPhoneClean && lotPhoneClean && userPhoneClean === lotPhoneClean) return true;

  // 3. Check ID match
  if (user.id && lot.farmerId && user.id === lot.farmerId) return true;

  // 4. Check name match
  if (user.name && lot.farmerName && user.name.toLowerCase().trim() === lot.farmerName.toLowerCase().trim()) return true;

  return false;
};

export const DEMO_STAKEHOLDERS = {
  farmer: {
    id: 'FARMER-001',
    name: 'Ramesh Patil',
    role: 'farmer',
    organization: 'Sahyadri FPO',
    village: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    phone: '+91 98220 14892',
    email: 'ramesh.patil@sahyadrifpo.org',
    mainCrops: 'Onion, Tomato, Soybean',
    avatar: '👨‍🌾'
  },
  buyer: {
    id: 'BUYER-101',
    name: 'Amit Deshmukh',
    role: 'buyer',
    organization: 'Sahyadri Mega Food Park',
    businessType: 'Food Processing & Institutional Export',
    location: 'Chakan Industrial Zone, Pune',
    gstin: '27AABCS9182K1ZU',
    phone: '+91 98902 44100',
    email: 'procurement@sahyadrifoodpark.com',
    avatar: '🏢'
  },
  transporter: {
    id: 'TRANS-201',
    name: 'Tukaram Shinde',
    role: 'transporter',
    organization: 'Kisan Express Logistics',
    serviceArea: 'Western Maharashtra (Pune, Nashik, Ahmednagar)',
    fleetSize: 18,
    phone: '+91 94223 90812',
    email: 'dispatch@kisanexpress.in',
    avatar: '🚚'
  },
  cold_storage: {
    id: 'STORAGE-301',
    name: 'Balasaheb Kadam',
    role: 'cold_storage',
    organization: 'Sahyadri Agro Cold Chain & Mega Warehousing',
    location: 'Niphad Cold Hub, Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    capacityMT: 5000,
    availableSpaceMT: 2200,
    phone: '+91 97654 32190',
    rawPhone: '9765432190',
    email: 'operations@sahyadricoldchain.com',
    avatar: '❄️'
  },
  admin: {
    id: 'ADMIN-SUPER-01',
    name: 'Vedant Chavan',
    role: 'admin',
    isSuperAdmin: true,
    organization: 'MahaAgri Central Directorate & Platform Control',
    department: 'Chief Platform Administrator & State System Overseer',
    location: 'State Command Headquarters, Maharashtra',
    phone: '+91 84829 41628',
    rawPhone: '8482941628',
    email: 'vedantkchavan2006@gmail.com',
    avatar: '👑'
  }
};

// Real orders will be populated dynamically upon accepted buyer offers (no fake/hardcoded orders)
const INITIAL_ORDERS = [];

const INITIAL_ACTIVITY = [
  { id: 'ACT-1', text: 'Ramesh Patil created a new Onion lot (1,000 KG Grade A in Pune)', time: '2 minutes ago', type: 'lot' },
  { id: 'ACT-2', text: 'Sahyadri Mega Food Park placed an offer of ₹28/KG on Lot #LOT-PN-2026-081', time: '5 minutes ago', type: 'offer' },
  { id: 'ACT-3', text: 'Order #AGR10245 confirmed between Ramesh Patil and Sahyadri Mega Food Park', time: '8 minutes ago', type: 'order' },
  { id: 'ACT-4', text: 'Kisan Express Logistics assigned vehicle Tata Ace MH-12-QZ-4592', time: '14 minutes ago', type: 'transport' },
  { id: 'ACT-5', text: 'Order #AGR10241 marked as Delivered at Hadapsar Buyer Hub', time: '22 minutes ago', type: 'delivery' },
  { id: 'ACT-6', text: 'Demo escrow payout of ₹47,050 confirmed to Sunita More bank account', time: '28 minutes ago', type: 'payment' }
];

export const AppProvider = ({ children }) => {
  // Current Authenticated User (saved in localStorage to stay stable across reloads until logout)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      // Purge any stale legacy test user from previous sessions
      localStorage.removeItem('agrisetu_user_v2');
      localStorage.removeItem('agrisetu_user');
      localStorage.removeItem('agrisetu_role');
      sessionStorage.removeItem('agrisetu_user_v2');
      sessionStorage.removeItem('agrisetu_session_user_v5');
    } catch (e) {}

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Active Role (derived from currentUser or null)
  const role = currentUser ? currentUser.role : null;

  // Active Language ('en' | 'mr')
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LANG) || 'en';
  });

  // Active navigation tab within role
  const [activeTab, setActiveTab] = useState('home');

  // Selected Lot ID for reviewing offers
  const [selectedLotIdForOffers, setSelectedLotIdForOffers] = useState(null);

  // Dynamic Crops & Produce Catalog (Fruit, Vegetable, Crops - No limit)
  const [cropsCatalog, setCropsCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisetu_crops_catalog_v2');
      return saved ? JSON.parse(saved) : CROPS_CATALOG;
    } catch {
      return CROPS_CATALOG;
    }
  });

  const addCustomCrop = (category, cropName, variety = 'Standard') => {
    if (!cropName || !cropName.trim()) return null;
    const cleanName = cropName.trim();
    const existing = cropsCatalog.find(c => c.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      if (variety && !existing.varieties.includes(variety)) {
        const updated = cropsCatalog.map(c => c.id === existing.id ? { ...c, varieties: [...c.varieties, variety] } : c);
        setCropsCatalog(updated);
        try { localStorage.setItem('agrisetu_crops_catalog_v2', JSON.stringify(updated)); } catch (e) { console.warn(e); }
      }
      return existing;
    }

    const newCropObj = {
      id: cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: cleanName,
      nameMr: cleanName,
      category: category || 'Vegetable',
      defaultUnit: 'KG',
      avgPrice: 30,
      varieties: variety ? [variety] : ['Standard Hybrid', 'Local Farm Produce']
    };

    const updated = [newCropObj, ...cropsCatalog];
    setCropsCatalog(updated);
    try {
      localStorage.setItem('agrisetu_crops_catalog_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    return newCropObj;
  };

  // Core Data
  const [lots, setLots] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOTS);
    return saved ? JSON.parse(saved) : INITIAL_LOTS;
  });

  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
    const rawOffers = saved ? JSON.parse(saved) : INITIAL_OFFERS;
    return rawOffers.map(o => {
      const total = o.totalOfferedAmount || (Number(o.offeredRate) * Number(o.quantityRequested || 1000));
      return {
        ...o,
        estTransportCost: 0,
        totalOfferedAmount: total,
        netFarmerRealisation: total,
        netRatePerKg: Number(o.offeredRate)
      };
    });
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const rawOrders = saved ? JSON.parse(saved) : INITIAL_ORDERS;
    return rawOrders.map(o => ({
      ...o,
      transportCost: 0,
      netFarmerAmount: o.totalValue || (Number(o.agreedPrice) * Number(o.quantity))
    }));
  });

  const [transactions, setTransactions] = useState(() => {
    let list = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) {
        list = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not read transactions from localStorage:", e);
    }
    if (!list || !Array.isArray(list) || list.length === 0) {
      list = INITIAL_TRANSACTIONS;
    }
    return list.map(t => {
      const gross = Number(t.grossAmount != null ? t.grossAmount : (t.amount != null ? t.amount : (Number(t.quantity || 1000) * Number(t.sellingRate || 25))));
      const net = Number(t.netFarmerAmount != null ? t.netFarmerAmount : (t.amount != null ? t.amount : gross));
      const rate = Number(t.sellingRate || (t.quantity ? Math.round(gross / Number(t.quantity)) : 25));
      return {
        ...t,
        grossAmount: isNaN(gross) ? 0 : gross,
        transportCost: 0,
        netFarmerAmount: isNaN(net) ? 0 : net,
        sellingRate: isNaN(rate) ? 0 : rate,
        escrowStatus: t.escrowStatus || "Completed",
        crop: t.crop || "Produce",
        quantity: Number(t.quantity) || 1000,
        unit: t.unit || "KG",
        farmerName: t.farmerName || "Registered Farmer",
        buyerName: t.buyerName || "Institutional Buyer",
        paymentMode: t.paymentMode || "Direct DBT Bank Transfer",
        utrNumber: t.utrNumber || `AGRILINK${Math.floor(1000000000 + Math.random() * 9000000000)}`
      };
    });
  });

  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRIEVANCES);
    return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
  });

  const [liveActivityFeed, setLiveActivityFeed] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [storageBookings, setStorageBookings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORAGE_BOOKINGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [storageFacilities, setStorageFacilities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORAGE_FACILITIES);
      return saved ? JSON.parse(saved) : STORAGE_PROVIDERS;
    } catch (e) {
      return STORAGE_PROVIDERS;
    }
  });

  const [transportBookings, setTransportBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSPORT_BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSPORT_BOOKINGS;
    } catch (e) {
      return INITIAL_TRANSPORT_BOOKINGS;
    }
  });

  const [fleetVehicles, setFleetVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLEET_VEHICLES);
      return saved ? JSON.parse(saved) : TRANSPORT_PROVIDERS;
    } catch (e) {
      return TRANSPORT_PROVIDERS;
    }
  });

  // Modals & UI States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState(null);
  const [authDefaultTab, setAuthDefaultTab] = useState('login'); // 'login' | 'register'
  const [isCreateLotModalOpen, setIsCreateLotModalOpen] = useState(false);
  const [isMakeOfferModalOpen, setIsMakeOfferModalOpen] = useState(false);
  const [selectedLotForOffer, setSelectedLotForOffer] = useState(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [ratedTxn, setRatedTxn] = useState(null);
  const [isBookTransportModalOpen, setIsBookTransportModalOpen] = useState(false);
  const [selectedDealForTransport, setSelectedDealForTransport] = useState(null);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isFarmerPaymentModalOpen, setIsFarmerPaymentModalOpen] = useState(false);
  const [selectedDealForPayment, setSelectedDealForPayment] = useState(null);

  // Registered Users Registry (persisted across sessions to enforce single registration and OTP login)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_REGISTERED_USERS;
  });

  // Confirmation Toast
  const [confirmationToast, setConfirmationToast] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  // Helper to find registered user by 10-digit phone or email
  const findRegisteredUser = (identifier) => {
    if (!identifier) return null;
    const str = identifier.toString().trim().toLowerCase();
    // If identifier is an email
    if (str.includes('@')) {
      return registeredUsers.find(u => (u.email || '').toLowerCase() === str) || null;
    }
    // If identifier is a phone number
    const clean = getClean10DigitPhone(str);
    if (!clean || clean.length !== 10) return null;
    return registeredUsers.find(u => {
      const userPhoneClean = getClean10DigitPhone(u.rawPhone || u.phone);
      return userPhoneClean === clean;
    }) || null;
  };

  // Helper to explicitly open auth modal with specific role and tab
  const openAuthModal = (defaultRole = null, defaultTab = 'login') => {
    if (defaultRole) setAuthDefaultRole(defaultRole);
    setAuthDefaultTab(defaultTab || 'login');
    setIsAuthModalOpen(true);
  };


  // Persist states across page reloads
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOTS, JSON.stringify(lots));
  }, [lots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(liveActivityFeed));
  }, [liveActivityFeed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSPORT_BOOKINGS, JSON.stringify(transportBookings));
    } catch (e) {}
  }, [transportBookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STORAGE_FACILITIES, JSON.stringify(storageFacilities));
    } catch (e) {}
  }, [storageFacilities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STORAGE_BOOKINGS, JSON.stringify(storageBookings));
    } catch (e) {}
  }, [storageBookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FLEET_VEHICLES, JSON.stringify(fleetVehicles));
    } catch (e) {}
  }, [fleetVehicles]);

  // Live Multi-Device Sync Engine State
  const [syncStatus, setSyncStatus] = useState('connecting'); // 'connecting' | 'synced' | 'offline'
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Initial Data Hydration & Background Sync from Central Server API
  const loadServerData = async () => {
    try {
      const serverData = await apiService.fetchData();
      if (serverData) {
        if (Array.isArray(serverData.lots) && serverData.lots.length > 0) {
          setLots(prevLots => {
            const map = new Map();
            serverData.lots.forEach(l => { if (l && l.id) map.set(l.id, l); });
            // Keep any local-only lots not yet in server
            prevLots.forEach(l => {
              if (l && l.id && !map.has(l.id)) {
                map.set(l.id, l);
                apiService.saveLot(l); // sync upstream
              }
            });
            return Array.from(map.values());
          });
        }
        if (Array.isArray(serverData.registeredUsers) && serverData.registeredUsers.length > 0) {
          setRegisteredUsers(prevUsers => {
            const map = new Map();
            serverData.registeredUsers.forEach(u => { if (u && u.id) map.set(u.id, u); });
            prevUsers.forEach(u => {
              if (u && u.id && !map.has(u.id)) {
                map.set(u.id, u);
                apiService.saveUser(u);
              }
            });
            return Array.from(map.values());
          });
        }
        if (Array.isArray(serverData.offers)) {
          setOffers(serverData.offers);
        }
        if (Array.isArray(serverData.orders)) {
          setOrders(serverData.orders);
        }
        if (Array.isArray(serverData.transactions)) {
          setTransactions(serverData.transactions);
        }
        if (Array.isArray(serverData.activity)) {
          setLiveActivityFeed(serverData.activity);
        }
        setSyncStatus('synced');
        setLastSyncTime(new Date());
      } else {
        setSyncStatus('offline');
      }
    } catch (err) {
      console.warn('Central server sync warning:', err);
      setSyncStatus('offline');
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Load
    loadServerData();

    // 2. Cross-tab instant broadcast listener
    const unsubscribe = subscribeToBroadcast((msg) => {
      if (!isMounted) return;
      if (msg.type === 'LOT_UPDATED' && msg.payload) {
        setLots(prev => {
          const idx = prev.findIndex(l => l.id === msg.payload.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = msg.payload;
            return next;
          }
          return [msg.payload, ...prev];
        });
      } else if (msg.type === 'LOT_DELETED' && msg.payload) {
        setLots(prev => prev.filter(l => l.id !== msg.payload.lotId));
      } else if (msg.type === 'OFFER_UPDATED' && msg.payload) {
        setOffers(prev => {
          const idx = prev.findIndex(o => o.id === msg.payload.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = msg.payload;
            return next;
          }
          return [msg.payload, ...prev];
        });
      } else if (msg.type === 'ORDER_UPDATED' && msg.payload) {
        setOrders(prev => {
          const idx = prev.findIndex(o => o.id === msg.payload.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = msg.payload;
            return next;
          }
          return [msg.payload, ...prev];
        });
      } else if (msg.type === 'USER_UPDATED' && msg.payload) {
        setRegisteredUsers(prev => {
          const idx = prev.findIndex(u => u.id === msg.payload.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = msg.payload;
            return next;
          }
          return [msg.payload, ...prev];
        });
      }
      setLastSyncTime(new Date());
      setSyncStatus('synced');
    });

    // 3. Periodic Background Sync (every 3.5 seconds) to pull updates from other laptops/devices
    const syncInterval = setInterval(async () => {
      try {
        const serverData = await apiService.fetchData();
        if (serverData && isMounted) {
          if (Array.isArray(serverData.lots)) {
            setLots(prevLots => {
              const prevStr = JSON.stringify(prevLots.map(l => ({ id: l.id, status: l.status, price: l.expectedPrice })));
              const serverStr = JSON.stringify(serverData.lots.map(l => ({ id: l.id, status: l.status, price: l.expectedPrice })));
              return prevStr !== serverStr ? serverData.lots : prevLots;
            });
          }
          if (Array.isArray(serverData.offers)) {
            setOffers(prevOffers => {
              const prevStr = JSON.stringify(prevOffers.map(o => ({ id: o.id, status: o.status })));
              const serverStr = JSON.stringify(serverData.offers.map(o => ({ id: o.id, status: o.status })));
              return prevStr !== serverStr ? serverData.offers : prevOffers;
            });
          }
          if (Array.isArray(serverData.orders)) {
            setOrders(prevOrders => {
              const prevStr = JSON.stringify(prevOrders.map(o => ({ id: o.id, status: o.status, step: o.timelineStep })));
              const serverStr = JSON.stringify(serverData.orders.map(o => ({ id: o.id, status: o.status, step: o.timelineStep })));
              return prevStr !== serverStr ? serverData.orders : prevOrders;
            });
          }
          if (Array.isArray(serverData.registeredUsers)) {
            setRegisteredUsers(prevUsers => {
              if (prevUsers.length !== serverData.registeredUsers.length) {
                return serverData.registeredUsers;
              }
              return prevUsers;
            });
          }
          setSyncStatus('synced');
          setLastSyncTime(new Date());
        }
      } catch {
        // network hiccup
      }
    }, 3500);

    // 4. Focus trigger: when tab on Laptop 2 is activated/clicked
    const handleFocus = () => loadServerData();
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      unsubscribe();
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, newLang);
    } catch (e) {
      console.warn("Could not persist language to localStorage", e);
    }
  };

  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const pushActivity = (text, type = 'info') => {
    const newAct = {
      id: `ACT-${Date.now()}`,
      text,
      time: 'Just now',
      type
    };
    setLiveActivityFeed(prev => [newAct, ...prev.slice(0, 19)]);
  };

  const pushNotification = (title, message, titleMr, type = 'info') => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      titleMr: titleMr || title,
      message,
      time: "Just now",
      unread: true,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const showConfirmation = (title, message, type = 'success') => {
    setConfirmationToast({ isOpen: true, title, message, type });
    setTimeout(() => {
      setConfirmationToast(prev => ({ ...prev, isOpen: false }));
    }, 4000);
  };

  // Auth Operations
  // Login with strictly 10-digit Phone Number OR Email & OTP verification
  const loginWithIdentifier = (userRole, identifier, optionalName = null, optionalOrg = null) => {
    if (!identifier) {
      return { success: false, error: 'Please enter a valid mobile number or email address.' };
    }

    const trimmed = identifier.toString().trim();
    const isEmail = trimmed.includes('@');
    let cleanPhone = '';
    let cleanEmail = '';

    if (isEmail) {
      cleanEmail = trimmed.toLowerCase();
    } else {
      cleanPhone = getClean10DigitPhone(trimmed);
      if (!cleanPhone || cleanPhone.length !== 10) {
        return { success: false, error: 'Mobile number must be exactly 10 digits.' };
      }
    }

    let userToLogin;

    // Admin login handling
    if (userRole === 'admin') {
      const isMasterAdmin = 
        (isEmail && cleanEmail === 'vedantkchavan2006@gmail.com') ||
        (!isEmail && cleanPhone === '8482941628');
      
      const existingAdmin = findRegisteredUser(isEmail ? cleanEmail : cleanPhone);

      if (isMasterAdmin) {
        userToLogin = {
          id: 'ADMIN-SUPER-01',
          name: 'Vedant Chavan',
          role: 'admin',
          isSuperAdmin: true,
          organization: 'MahaAgri Central Directorate & Platform Control',
          department: 'Chief Platform Administrator & State System Overseer',
          location: 'State Command Headquarters, Maharashtra',
          phone: '+91 84829 41628',
          rawPhone: '8482941628',
          email: 'vedantkchavan2006@gmail.com',
          avatar: '👑'
        };
      } else if (existingAdmin) {
        userToLogin = {
          ...existingAdmin,
          role: 'admin',
          isSuperAdmin: true,
          name: optionalName || existingAdmin.name,
          organization: optionalOrg || existingAdmin.organization || 'MahaAgri Platform Control',
          phone: existingAdmin.phone || (cleanPhone ? `+91 ${cleanPhone}` : ''),
          rawPhone: cleanPhone || existingAdmin.rawPhone || '',
          email: cleanEmail || existingAdmin.email || '',
          avatar: '👑'
        };
      } else {
        const userSuffix = isEmail ? cleanEmail.split('@')[0].slice(0, 8) : cleanPhone.slice(-4);
        userToLogin = {
          id: `ADMIN-${userSuffix}`,
          name: optionalName || (isEmail ? cleanEmail.split('@')[0] : 'Administrator'),
          role: 'admin',
          isSuperAdmin: true,
          organization: optionalOrg || 'MahaAgri Central Directorate & Platform Control',
          department: 'Platform Administration & Oversight',
          location: 'State Command Headquarters, Maharashtra',
          phone: cleanPhone ? `+91 ${cleanPhone}` : '',
          rawPhone: cleanPhone || '',
          email: cleanEmail || '',
          avatar: '👑'
        };
        setRegisteredUsers(prev => [userToLogin, ...prev]);
      }

      setCurrentUser(userToLogin);
      apiService.saveUser(userToLogin);
      setActiveTab('home');
      setIsAuthModalOpen(false);
      pushActivity(`Admin ${userToLogin.name} signed into Master Control Console`, 'auth');
      showConfirmation(
        "Admin Clearance Verified",
        `Welcome ${userToLogin.name} (${userToLogin.organization || 'Administrator'})`,
        'success'
      );
      return { success: true, user: userToLogin };
    }

    const existing = findRegisteredUser(isEmail ? cleanEmail : cleanPhone);

    if (existing) {
      const resolvedRole = userRole || existing.role || 'farmer';
      userToLogin = {
        ...existing,
        role: resolvedRole,
        isSuperAdmin: resolvedRole === 'admin',
        name: optionalName || existing.name,
        organization: optionalOrg || existing.organization,
        phone: existing.phone || (cleanPhone ? `+91 ${cleanPhone}` : ''),
        rawPhone: cleanPhone || existing.rawPhone || '',
        email: cleanEmail || existing.email || '',
        avatar: resolvedRole === 'farmer' ? '👨‍🌾' : resolvedRole === 'buyer' ? '🏢' : resolvedRole === 'transporter' ? '🚚' : resolvedRole === 'cold_storage' ? '❄️' : '👑'
      };
    } else {
      // Auto-create profile for verified new identifier
      const resolvedRole = userRole || 'farmer';
      const userSuffix = isEmail ? cleanEmail.split('@')[0].slice(0, 8) : cleanPhone.slice(-4);
      userToLogin = {
        id: `${resolvedRole.toUpperCase()}-${userSuffix}`,
        name: optionalName || (resolvedRole === 'farmer' ? 'Kisan Member' : resolvedRole === 'buyer' ? 'Procurement Buyer' : resolvedRole === 'transporter' ? 'Logistics Partner' : resolvedRole === 'cold_storage' ? 'Cold Storage Operator' : 'Administrator'),
        role: resolvedRole,
        isSuperAdmin: resolvedRole === 'admin',
        organization: optionalOrg || (resolvedRole === 'farmer' ? 'Farmer Producer Collective' : resolvedRole === 'buyer' ? 'Agricultural Enterprise' : resolvedRole === 'transporter' ? 'Logistics Partner' : resolvedRole === 'cold_storage' ? 'Cold Storage & Warehousing Facility' : 'MahaAgri Central Directorate'),
        location: 'Maharashtra, India',
        phone: cleanPhone ? `+91 ${cleanPhone}` : '',
        rawPhone: cleanPhone || '',
        email: cleanEmail || '',
        avatar: resolvedRole === 'farmer' ? '👨‍🌾' : resolvedRole === 'buyer' ? '🏢' : resolvedRole === 'transporter' ? '🚚' : resolvedRole === 'cold_storage' ? '❄️' : '👑'
      };
      setRegisteredUsers(prev => [userToLogin, ...prev]);
    }

    setCurrentUser(userToLogin);
    apiService.saveUser(userToLogin);
    setActiveTab('home');
    setIsAuthModalOpen(false);

    const displayId = isEmail ? cleanEmail : `+91 ${cleanPhone}`;
    pushActivity(`${userToLogin.name} (${displayId}) signed into ${userToLogin.role.toUpperCase()} portal`, 'auth');
    showConfirmation(
      "Signed In",
      `Logged in as ${userToLogin.name} (${displayId})`,
      'success'
    );
    return { success: true, user: userToLogin };
  };

  // Backwards compatibility alias for loginWithPhone
  const loginWithPhone = (userRole, phoneOrEmail, optionalName = null, optionalOrg = null) => {
    return loginWithIdentifier(userRole, phoneOrEmail, optionalName, optionalOrg);
  };

  const login = (stakeholderKeyOrUser) => {
    let userToLogin;
    if (stakeholderKeyOrUser === 'admin') {
      userToLogin = DEMO_STAKEHOLDERS.admin;
    } else if (typeof stakeholderKeyOrUser === 'string') {
      userToLogin = DEMO_STAKEHOLDERS[stakeholderKeyOrUser] || DEMO_STAKEHOLDERS.farmer;
    } else {
      userToLogin = stakeholderKeyOrUser;
    }

    setCurrentUser(userToLogin);
    setActiveTab('home');
    setIsAuthModalOpen(false);

    pushActivity(`${userToLogin.name} logged in to ${userToLogin.role.toUpperCase()} portal`, 'auth');
    showConfirmation(
      t('welcomeBack'),
      `${userToLogin.name} (${userToLogin.organization || userToLogin.role})`,
      'success'
    );
  };

  const logout = () => {
    const prevName = currentUser ? currentUser.name : 'User';
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      sessionStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem('agrisetu_user_v2');
      localStorage.removeItem('agrisetu_user');
      localStorage.removeItem('agrisetu_role');
      sessionStorage.removeItem('agrisetu_session_user_v5');
    } catch (e) {}
    setActiveTab('home');
    pushActivity(`${prevName} logged out. Returned to Public Home Page`, 'auth');
    showConfirmation("Logged Out", "You have successfully returned to the AgriLink home page.", 'info');
  };

  // Register New User: Supports Phone or Email, prevents duplicate registration, and supports custom city
  const registerUser = (formData, userRole) => {
    const isEmailReg = !formData.phone && Boolean(formData.email);
    let cleanPhone = '';
    let cleanEmail = (formData.email || '').trim().toLowerCase();

    if (!isEmailReg) {
      cleanPhone = getClean10DigitPhone(formData.phone);
      if (!cleanPhone && !cleanEmail) {
        return { success: false, error: 'Mobile number or email address is required.' };
      }
      if (formData.phone && cleanPhone.length !== 10) {
        return { success: false, error: 'Mobile number must be exactly 10 digits.' };
      }
    }

    const checkId = isEmailReg ? cleanEmail : (cleanPhone || cleanEmail);
    const existing = findRegisteredUser(checkId);
    if (existing) {
      return {
        success: false,
        error: isEmailReg
          ? `Email ${cleanEmail} is already registered with an active account (${existing.name} - ${existing.role.toUpperCase()}). Please sign in instead.`
          : `Mobile number +91 ${cleanPhone} is already registered with an active account (${existing.name} - ${existing.role.toUpperCase()}). Please sign in instead.`,
        isAlreadyRegistered: true,
        existingUser: existing
      };
    }

    const cityOrLocation = (formData.city || formData.district || 'Pune').trim();
    const newUser = {
      id: `${userRole.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: (formData.name || (userRole === 'admin' ? 'Admin Officer' : 'Agri User')).trim(),
      role: userRole,
      isSuperAdmin: userRole === 'admin',
      organization: (formData.organization || (userRole === 'admin' ? 'MahaAgri Central Directorate' : `${formData.name || 'Agri'}'s Enterprise`)).trim(),
      department: (formData.department || formData.organization || (userRole === 'admin' ? 'Platform Administration & Oversight' : '')).trim(),
      location: formData.location || `${cityOrLocation}, ${formData.state || 'Maharashtra'}`,
      city: cityOrLocation,
      phone: cleanPhone ? `+91 ${cleanPhone}` : '',
      rawPhone: cleanPhone || '',
      email: cleanEmail || '',
      avatar: userRole === 'farmer' ? '👨‍🌾' : userRole === 'buyer' ? '🏢' : userRole === 'transporter' ? '🚚' : userRole === 'cold_storage' ? '❄️' : '👑'
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    apiService.saveUser(newUser);
    setActiveTab('home');
    setIsAuthModalOpen(false);

    const displayId = isEmailReg ? cleanEmail : `+91 ${cleanPhone}`;
    pushActivity(`${newUser.name} (${displayId}) registered as ${newUser.role.toUpperCase()}`, 'auth');
    showConfirmation(
      userRole === 'admin' ? "Admin Account Created" : t('welcomeNewUser'),
      userRole === 'admin' 
        ? `Welcome ${newUser.name}, your Administrator clearance is active!` 
        : `Welcome ${newUser.name}! Your account has been created.`,
      'success'
    );
    return { success: true, user: newUser };
  };


  // Farmer Actions: Create New Crop Lot (Supports Fruit, Vegetable, Crops & 4 Photos)
  const createLot = (lotData) => {
    if (currentUser?.isFrozen) {
      showConfirmation("Account Suspended", "Your farmer account has been suspended by the platform administrator. You cannot list crop lots.", "danger");
      return null;
    }

    // Auto-register custom crop in catalog if not existing
    if (lotData.crop) {
      addCustomCrop(lotData.category || 'Vegetable', lotData.crop, lotData.variety);
    }

    const newLotId = `LOT-MH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const imagesList = (lotData.images && lotData.images.length > 0) 
      ? lotData.images 
      : [lotData.image || "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80"];

    const newLot = {
      id: newLotId,
      farmerId: currentUser ? currentUser.id : "FARMER-001",
      farmerName: currentUser ? currentUser.name : "Ramesh Patil",
      farmerPhone: currentUser ? currentUser.phone : "+91 98220 14892",
      farmerEmail: (currentUser?.email || '').toLowerCase().trim() || 'ramesh.patil@sahyadrifpo.org',
      farmerFpo: currentUser ? currentUser.organization : "Sahyadri Farmers Producer Co.",
      location: lotData.location || "Haveli, Pune, Maharashtra",
      district: lotData.district || "pune",
      category: lotData.category || "Vegetable", // 'Fruit' | 'Vegetable' | 'Crop'
      crop: lotData.crop,
      cropMr: lotData.cropMr || lotData.crop,
      cropId: lotData.cropId || lotData.crop.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      variety: lotData.variety || "Hybrid Standard",
      quantity: Number(lotData.quantity),
      unit: lotData.unit || "KG",
      grade: lotData.grade || "A",
      expectedPrice: Number(lotData.expectedPrice),
      harvestDate: lotData.harvestDate || new Date().toISOString().split('T')[0],
      status: "Open",
      image: imagesList[0],
      images: imagesList,
      qualityScore: lotData.qualityScore || 92,
      freshness: lotData.freshness || "95%",
      damagePercent: lotData.damagePercent || 2.4,
      bulbSize: lotData.bulbSize || "50-65 mm",
      analysisBreakdown: lotData.analysisBreakdown || null,
      createdAt: new Date().toISOString().split('T')[0],
      description: lotData.description || `Fresh harvest lot of ${lotData.quantity} ${lotData.unit || 'KG'} ${lotData.crop} (${lotData.category || 'Vegetable'}).`
    };

    setLots(prev => [newLot, ...prev]);
    apiService.saveLot(newLot); // Immediately persist to central backend & notify all devices
    pushActivity(`${newLot.farmerName} published new lot #${newLotId} (${newLot.quantity} KG ${newLot.crop} - ${newLot.category})`, 'lot');

    showConfirmation(
      "Crop Lot Published",
      `Lot #${newLotId} (${newLot.quantity} KG ${newLot.crop}) with 4 AI-verified inspection photos is now live on the marketplace.`,
      "success"
    );

    return newLot;
  };

  // Buyer Action: Submit Offer
  const submitOffer = (offerData) => {
    if (currentUser?.isFrozen) {
      showConfirmation("Account Suspended", "Your buyer account has been suspended by the platform administrator. You cannot place offers.", "danger");
      return null;
    }

    const totalOffered = Number(offerData.offeredRate) * Number(offerData.quantityRequested);
    const netTotal = totalOffered; // No transport deduction from farmer (buyer funds/handles transport)
    const netPerKg = Number(offerData.offeredRate).toFixed(2);

    const targetLot = lots.find(l => l.id === offerData.lotId);

    const newOffer = {
      id: `OFFER-${Math.floor(200 + Math.random() * 800)}`,
      lotId: offerData.lotId,
      crop: targetLot ? targetLot.crop : "Produce",
      variety: targetLot ? targetLot.variety : "",
      farmerId: targetLot ? targetLot.farmerId : null,
      farmerName: targetLot ? targetLot.farmerName : null,
      farmerPhone: targetLot ? targetLot.farmerPhone : null,
      buyerId: currentUser ? currentUser.id : "BUYER-101",
      buyerName: currentUser ? (currentUser.organization || currentUser.name) : (offerData.buyerName || "Institutional Buyer"),
      buyerPhone: currentUser ? currentUser.phone : (offerData.buyerPhone || "+91 98902 44100"),
      buyerType: "Institutional Buyer",
      buyerLocation: currentUser ? currentUser.location : "Chakan Industrial Zone, Pune",
      gstVerified: true,
      rating: 4.9,
      reliabilityScore: 99.2,
      offeredRate: Number(offerData.offeredRate),
      quantityRequested: Number(offerData.quantityRequested),
      totalOfferedAmount: totalOffered,
      estTransportCost: 0,
      netFarmerRealisation: netTotal,
      netRatePerKg: Number(netPerKg),
      pickupDate: offerData.pickupDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      paymentTerms: offerData.paymentTerms || "100% Escrow deposit protected. Instant release upon delivery verification.",
      matchScore: 94,
      status: "Pending",
      createdAt: new Date().toISOString().split('T')[0],
      createdAtTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOffers(prev => [newOffer, ...prev]);
    setLots(prev => prev.map(l => l.id === offerData.lotId ? { ...l, status: "Offers Received" } : l));

    apiService.saveOffer(newOffer);
    if (targetLot) {
      apiService.saveLot({ ...targetLot, status: "Offers Received" });
    }

    pushActivity(`${newOffer.buyerName} placed an offer of ₹${newOffer.offeredRate}/KG on Lot #${newOffer.lotId} (${targetLot?.crop || 'Produce'})`, 'offer');

    pushNotification(
      "New Offer Received",
      `${newOffer.buyerName} placed an offer of ₹${newOffer.offeredRate}/KG on your ${targetLot?.crop || 'crop'} lot #${newOffer.lotId}`,
      "नवीन खरेदी प्रस्ताव प्राप्त झाला",
      "info"
    );

    showConfirmation(
      t('msgPurchaseConfirmedTitle') || "Offer Submitted",
      `Offer of ₹${offerData.offeredRate}/KG for Lot #${offerData.lotId} submitted to farmer.`,
      'success'
    );

    return newOffer;
  };

  // Farmer Action: Accept Offer -> Generates Real Order & Sets Deal Accepted
  const acceptOffer = (offerId) => {
    if (currentUser?.isFrozen) {
      showConfirmation("Account Suspended", "Your account has been suspended by the platform administrator.", "danger");
      return;
    }
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    const targetLot = lots.find(l => l.id === offer.lotId);

    // Update offer status
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) return { ...o, status: "Accepted", paymentStatus: "Payment Pending", logisticsStatus: "Awaiting Farmer Payment" };
      if (o.lotId === offer.lotId && o.id !== offerId && o.status === "Pending") return { ...o, status: "Rejected" };
      return o;
    }));

    // Update lot status
    setLots(prev => prev.map(l => l.id === offer.lotId ? { ...l, status: "Deal Locked" } : l));

    // Create New Official Real Order (Awaiting Buyer Logistics Choice)
    const newOrderId = `AGR${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newOrderId,
      lotId: offer.lotId,
      offerId: offer.id,
      farmerId: targetLot ? targetLot.farmerId : (currentUser ? currentUser.id : "FARMER-001"),
      farmerName: targetLot ? targetLot.farmerName : (currentUser ? currentUser.name : "Farmer"),
      farmerPhone: targetLot ? targetLot.farmerPhone : (currentUser ? currentUser.phone : "+91 98220 14892"),
      farmerFpo: targetLot ? targetLot.farmerFpo : (currentUser ? currentUser.organization : "Farmers Producer Co."),
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerPhone: offer.buyerPhone || "+91 98902 44100",
      crop: targetLot ? targetLot.crop : (offer.crop || "Produce"),
      quantity: offer.quantityRequested,
      unit: targetLot ? targetLot.unit : "KG",
      agreedPrice: offer.offeredRate,
      totalValue: offer.totalOfferedAmount,
      transportCost: 0,
      netFarmerAmount: offer.totalOfferedAmount,
      grade: targetLot ? targetLot.grade : "A",
      pickupLocation: targetLot ? targetLot.location : "Haveli, Pune",
      deliveryLocation: offer.buyerLocation || "Chakan Mega Food Park, Pune",
      logisticsMode: null, // 'platform_transport' | 'self_pickup'
      logisticsStatus: "Awaiting Farmer Payment",
      transporter: null,
      driverName: null,
      vehicleNumber: null,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: offer.pickupDate,
      status: "Deal Accepted - Payment Required",
      paymentStatus: "Payment Pending",
      paymentReference: `ESCROW-PAY-${newOrderId.slice(-5)}`,
      timelineStep: 2,
      isRealOrder: true,
      cancellationReason: null,
      cancelledBy: null,
      cancelledAt: null
    };

    setOrders(prev => [newOrder, ...prev]);

    // Also record initial transaction in Transactions ledger
    const newTxn = {
      id: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: offer.lotId,
      orderId: newOrderId,
      farmerId: newOrder.farmerId,
      farmerName: newOrder.farmerName,
      farmerPhone: newOrder.farmerPhone,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      crop: newOrder.crop,
      quantity: offer.quantityRequested,
      unit: newOrder.unit,
      sellingRate: offer.offeredRate,
      grossAmount: offer.totalOfferedAmount,
      transportCost: 0,
      netFarmerAmount: offer.totalOfferedAmount,
      escrowStatus: "Escrow Locked (Awaiting Dispatch)",
      paymentDate: "Pending Delivery",
      paymentMode: "Direct DBT Escrow Transfer",
      utrNumber: `AGRILINK${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      status: "Secured in Escrow",
      grade: newOrder.grade,
      dealDate: new Date().toISOString().split('T')[0]
    };

    setTransactions(prev => [newTxn, ...prev]);

    apiService.saveOrder(newOrder);
    apiService.saveTransaction(newTxn);
    apiService.saveOffer({ ...offer, status: "Accepted", paymentStatus: "Payment Pending", logisticsStatus: "Awaiting Farmer Payment" });
    if (targetLot) {
      apiService.saveLot({ ...targetLot, status: "Deal Locked" });
    }

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    pushActivity(`Deal locked on Lot #${offer.lotId} between ${newOrder.farmerName} and ${newOrder.buyerName}`, 'order');

    pushNotification(
      "Farmer Accepted Your Offer!",
      `${newOrder.farmerName} accepted your bid of ₹${newOrder.agreedPrice}/KG for ${newOrder.quantity} KG ${newOrder.crop}. Please process Advance or Full Payment before transport dispatch.`,
      "शेतकऱ्याने आपला खरेदी प्रस्ताव स्वीकारला! वाहतूक नियोजनापूर्वी आगाऊ किंवा पूर्ण भरणा करा.",
      "success"
    );

    showConfirmation(
      t('msgOrderConfirmedTitle') || "Deal Accepted",
      `Deal accepted for Lot #${offer.lotId}. Buyer must process Advance or Full Payment to unlock transport options.`,
      'success'
    );

    return newOrder;
  };

  // Open and close Farmer Payment Modal
  const openFarmerPaymentModal = (dealOrOrder) => {
    setSelectedDealForPayment(dealOrOrder);
    setIsFarmerPaymentModalOpen(true);
  };

  const closeFarmerPaymentModal = () => {
    setIsFarmerPaymentModalOpen(false);
    setSelectedDealForPayment(null);
  };

  // Buyer Action: Process Advance or Full Payment to Farmer
  const processFarmerPayment = ({ 
    orderId, 
    offerId, 
    paymentType = 'advance', 
    amountPaid, 
    paymentMode = 'UPI Instant Escrow', 
    notes = '' 
  }) => {
    const numericAmount = Number(amountPaid);

    // Update orders
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.offerId === offerId) {
        const total = Number(o.totalValue || o.agreedPrice * o.quantity || numericAmount);
        const rem = Math.max(0, total - numericAmount);
        const newPaymentStatus = paymentType === 'advance' ? 'Advance Paid' : 'Full Payment Escrowed';
        return {
          ...o,
          paymentStatus: newPaymentStatus,
          paymentType,
          advancePaid: numericAmount,
          remainingBalance: rem,
          status: "Payment Completed - Choose Logistics",
          logisticsStatus: "Awaiting Logistics Selection",
          timelineStep: 3,
          paidAt: new Date().toISOString()
        };
      }
      return o;
    }));

    // Update offers
    setOffers(prev => prev.map(o => {
      if (o.id === offerId || o.orderId === orderId) {
        const total = Number(o.totalOfferedAmount || o.offeredRate * o.quantityRequested || numericAmount);
        const rem = Math.max(0, total - numericAmount);
        const newPaymentStatus = paymentType === 'advance' ? 'Advance Paid' : 'Full Payment Escrowed';
        return {
          ...o,
          paymentStatus: newPaymentStatus,
          paymentType,
          advancePaid: numericAmount,
          remainingBalance: rem,
          logisticsStatus: "Awaiting Logistics Selection"
        };
      }
      return o;
    }));

    // Add transaction to ledger
    const dealRef = selectedDealForPayment || {};
    const qty = Number(dealRef.quantity || dealRef.quantityRequested || 1000);
    const grossVal = Number(dealRef.totalValue || dealRef.totalOfferedAmount || numericAmount);
    const calcRate = Number(dealRef.agreedPrice || dealRef.offeredRate || (qty > 0 ? Math.round(grossVal / qty) : 25));
    const newTxn = {
      id: `TXN-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: orderId || dealRef.orderId || dealRef.id || `ORD-${Date.now().toString().slice(-5)}`,
      offerId: offerId || dealRef.offerId || dealRef.id,
      lotId: dealRef.lotId || `LOT-${dealRef.id || Date.now().toString().slice(-5)}`,
      farmerId: dealRef.farmerId || 'FARMER-001',
      farmerName: dealRef.farmerName || 'Farmer',
      farmerPhone: dealRef.farmerPhone || '+91 98220 14892',
      buyerId: dealRef.buyerId || currentUser?.id || 'BUYER-101',
      buyerName: dealRef.buyerName || currentUser?.organization || currentUser?.name || 'Verified Buyer',
      crop: dealRef.crop || 'Produce',
      quantity: qty,
      unit: dealRef.unit || 'KG',
      sellingRate: calcRate,
      grossAmount: grossVal,
      transportCost: 0,
      netFarmerAmount: numericAmount,
      amount: numericAmount,
      type: paymentType === 'advance' ? 'Farmer Advance Payment' : 'Farmer Full Escrow Payment',
      escrowStatus: paymentType === 'advance' ? 'Advance Secured in Escrow' : 'Full Payment Locked in Escrow',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode,
      utrNumber: `AGRIPAY${Date.now().toString().slice(-9)}`,
      notes
    };
    setTransactions(prev => [newTxn, ...prev]);

    // Push activity
    pushActivity(
      `Buyer paid ${paymentType === 'advance' ? 'Advance' : 'Full'} payment of ₹${numericAmount.toLocaleString()} to Farmer ${newTxn.farmerName} for ${newTxn.crop}.`,
      'payment'
    );

    // Push Notifications
    pushNotification(
      "Farmer Payment Secured",
      `Payment of ₹${numericAmount.toLocaleString()} (${paymentType === 'advance' ? 'Advance' : 'Full Payment'}) was deposited into escrow for Farmer ${newTxn.farmerName}. You can now proceed to book transport or self-pickup.`,
      `शेतकऱ्याला ₹${numericAmount.toLocaleString()} चा भरणा जमा झाला. आता वाहतूक नियोजन करा.`,
      "success"
    );

    showConfirmation(
      "Payment Completed",
      `₹${numericAmount.toLocaleString()} (${paymentType === 'advance' ? 'Advance Escrow' : '100% Full Payment'}) secured successfully! Now select transport for dispatch.`,
      "success"
    );

    setIsFarmerPaymentModalOpen(false);
    return newTxn;
  };

  // Open and close Book Transport Modal
  const openBookTransportModal = (dealOrOrder) => {
    setSelectedDealForTransport(dealOrOrder);
    setIsBookTransportModalOpen(true);
  };

  const closeBookTransportModal = () => {
    setIsBookTransportModalOpen(false);
    setSelectedDealForTransport(null);
  };

  // Buyer Action 1: Select Self-Pickup (Get by their own)
  const selectSelfPickup = (orderIdOrOfferId, pickupDetails = {}) => {
    const matchedOrder = orders.find(o => o.id === orderIdOrOfferId || o.offerId === orderIdOrOfferId);
    const orderId = matchedOrder ? matchedOrder.id : orderIdOrOfferId;
    
    // Update order
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.offerId === orderIdOrOfferId) {
        return {
          ...o,
          logisticsMode: 'self_pickup',
          logisticsStatus: 'Self-Pickup Arranged',
          transporter: pickupDetails.vehicleDetails || 'Buyer Own Vehicle',
          driverName: pickupDetails.driverName || 'Buyer Pickup Staff',
          driverPhone: pickupDetails.driverPhone || currentUser?.phone || '+91 98902 44100',
          vehicleNumber: pickupDetails.vehicleNumber || 'MH-12-BY-1001',
          transportCost: 0,
          netFarmerAmount: o.totalValue,
          status: 'Self-Pickup Scheduled',
          timelineStep: 3
        };
      }
      return o;
    }));

    // Update offer
    setOffers(prev => prev.map(o => {
      if (o.id === orderIdOrOfferId || (matchedOrder && o.id === matchedOrder.offerId)) {
        return { ...o, logisticsStatus: 'Self-Pickup Arranged' };
      }
      return o;
    }));

    // Record self-pickup entry in transportBookings
    const selfBooking = {
      id: `TRB-${Date.now().toString().slice(-4)}`,
      orderId: orderId,
      lotId: matchedOrder?.lotId || 'LOT-PN-2026-081',
      offerId: matchedOrder?.offerId || orderIdOrOfferId,
      crop: matchedOrder?.crop || 'Produce',
      quantityKg: matchedOrder?.quantity || 1000,
      buyerId: currentUser?.id || 'BUYER-101',
      buyerName: currentUser?.organization || currentUser?.name || 'Institutional Buyer',
      buyerPhone: currentUser?.phone || '+91 98902 44100',
      farmerId: matchedOrder?.farmerId || 'FARMER-001',
      farmerName: matchedOrder?.farmerName || 'Ramesh Patil',
      farmerPhone: matchedOrder?.farmerPhone || '+91 98220 14892',
      fromLocation: matchedOrder?.pickupLocation || 'Haveli Farm Gate, Pune',
      fromDistrict: 'Pune',
      toLocation: matchedOrder?.deliveryLocation || 'Buyer Processing Facility, Pune',
      toDistrict: 'Pune',
      distanceKm: 28,
      estimatedDuration: 'Direct Self-Pickup',
      vehicleId: 'SELF',
      vehicleType: pickupDetails.vehicleDetails || 'Buyer Commercial Vehicle',
      pickupDate: pickupDetails.pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupTimeSlot: pickupDetails.timeSlot || 'Daytime (09:00 AM - 05:00 PM)',
      calculatedFare: 0,
      offeredFare: 0,
      finalAgreedFare: 0,
      vehicleRegNumber: pickupDetails.vehicleNumber || 'MH-12-BY-1001',
      driverName: pickupDetails.driverName || 'Buyer Representative',
      driverPhone: pickupDetails.driverPhone || currentUser?.phone || '+91 98902 44100',
      status: 'Self-Pickup Arranged',
      bookingType: 'self_pickup',
      notes: pickupDetails.notes || 'Buyer will arrange own vehicle for farm-gate loading.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTransportBookings(prev => [selfBooking, ...prev]);

    pushActivity(`Buyer selected Self-Pickup for Order #${orderId} (${selfBooking.crop})`, 'transport');
    pushNotification(
      "Self-Pickup Confirmed",
      `Buyer opted for Self-Pickup for Order #${orderId}. Produce will be collected at farm gate on ${selfBooking.pickupDate}.`,
      "खरेदीदाराने स्वतः माल उचलण्याचा पर्याय निवडला",
      "info"
    );

    showConfirmation(
      "Self-Pickup Confirmed",
      `Self-pickup pass generated. Farmer notified to keep produce ready at farm gate.`,
      "success"
    );
  };

  // Buyer Action 2: Book Transport via Platform Fleet
  const createTransportBooking = (bookingData) => {
    const bookingId = `TRB-${Date.now().toString().slice(-4)}`;
    const newBooking = {
      id: bookingId,
      orderId: bookingData.orderId,
      lotId: bookingData.lotId,
      offerId: bookingData.offerId,
      crop: bookingData.crop || 'Produce',
      quantityKg: Number(bookingData.quantityKg || 1000),
      buyerId: currentUser?.id || bookingData.buyerId || 'BUYER-101',
      buyerName: currentUser?.organization || currentUser?.name || bookingData.buyerName || 'Verified Buyer',
      buyerPhone: currentUser?.phone || bookingData.buyerPhone || '+91 98902 44100',
      farmerId: bookingData.farmerId || 'FARMER-001',
      farmerName: bookingData.farmerName || 'Ramesh Patil',
      farmerPhone: bookingData.farmerPhone || '+91 98220 14892',
      fromLocation: bookingData.fromLocation || 'Haveli Farm Gate, Pune',
      fromDistrict: bookingData.fromDistrict || 'Pune',
      toLocation: bookingData.toLocation || 'Chakan Industrial Hub, Pune',
      toDistrict: bookingData.toDistrict || 'Pune',
      distanceKm: Number(bookingData.distanceKm || 28),
      estimatedDuration: bookingData.estimatedDuration || '1 hr 20 mins',
      vehicleId: bookingData.vehicleId || 'VEH-ACE',
      vehicleType: bookingData.vehicleType || 'Tata Ace Gold (Chhota Hathi)',
      pickupDate: bookingData.pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupTimeSlot: bookingData.pickupTimeSlot || 'Morning (08:00 AM - 11:00 AM)',
      calculatedFare: Number(bookingData.calculatedFare || 804),
      offeredFare: Number(bookingData.offeredFare || bookingData.calculatedFare || 800),
      counterFare: null,
      counterReason: null,
      finalAgreedFare: Number(bookingData.offeredFare || bookingData.calculatedFare || 800),
      transporterId: null,
      transporterName: 'Pending Assignment',
      vehicleRegNumber: null,
      driverName: null,
      driverPhone: null,
      status: 'Pending Transporter Confirmation',
      bookingType: 'platform_transport',
      notes: bookingData.notes || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTransportBookings(prev => [newBooking, ...prev]);

    // Update order
    setOrders(prev => prev.map(o => {
      if (o.id === bookingData.orderId || o.offerId === bookingData.offerId) {
        return {
          ...o,
          logisticsMode: 'platform_transport',
          logisticsStatus: 'Awaiting Transporter Confirmation',
          transportCost: newBooking.offeredFare,
          pickupLocation: newBooking.fromLocation,
          deliveryLocation: newBooking.toLocation
        };
      }
      return o;
    }));

    // Update offer
    setOffers(prev => prev.map(o => {
      if (o.id === bookingData.offerId || o.lotId === bookingData.lotId) {
        return { ...o, logisticsStatus: 'Awaiting Transporter Confirmation' };
      }
      return o;
    }));

    closeBookTransportModal();

    pushActivity(`New transport booking #${bookingId} posted: ${newBooking.vehicleType} from ${newBooking.fromLocation} to ${newBooking.toLocation}`, 'transport');

    pushNotification(
      "New Transport Booking Request",
      `New booking for ${newBooking.crop} (${newBooking.quantityKg} KG) from ${newBooking.fromLocation} to ${newBooking.toLocation}. Offered fare: ₹${newBooking.offeredFare}.`,
      "नवीन वाहतूक बुकिंग विनंती प्राप्त झाली",
      "info"
    );

    showConfirmation(
      "Transport Booking Submitted",
      `Booking request #${bookingId} sent to logistics network. Transporters can confirm or negotiate rate.`,
      "success"
    );

    return newBooking;
  };

  // Transporter Action 1: Confirm Booking (Assign vehicle & driver)
  const confirmTransportBooking = (bookingId, vehicleRegNumber, driverName, driverPhone) => {
    if (currentUser?.isFrozen) {
      showConfirmation("Account Suspended", "Your transporter account has been suspended by the platform administrator.", "danger");
      return;
    }
    const booking = transportBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const assignedReg = vehicleRegNumber || 'MH-12-QZ-4592';
    const assignedDriver = driverName || 'Tukaram Shinde';
    const assignedPhone = driverPhone || '+91 94223 90812';
    const assignedTransporter = currentUser?.organization || currentUser?.name || 'Kisan Express Agro Logistics';

    setTransportBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Confirmed',
          vehicleRegNumber: assignedReg,
          driverName: assignedDriver,
          driverPhone: assignedPhone,
          transporterId: currentUser?.id || 'TRANS-201',
          transporterName: assignedTransporter
        };
      }
      return b;
    }));

    // Update corresponding order
    setOrders(prev => prev.map(o => {
      if (o.id === booking.orderId || o.offerId === booking.offerId) {
        return {
          ...o,
          status: 'Transport Confirmed',
          logisticsStatus: 'Transport Confirmed',
          transporter: assignedTransporter,
          vehicleNumber: assignedReg,
          driverName: assignedDriver,
          driverPhone: assignedPhone,
          timelineStep: 3
        };
      }
      return o;
    }));

    // Update offers
    setOffers(prev => prev.map(o => {
      if (o.id === booking.offerId || o.lotId === booking.lotId) {
        return { ...o, logisticsStatus: 'Transport Confirmed' };
      }
      return o;
    }));

    // Update transactions
    setTransactions(prev => prev.map(t => {
      if (t.orderId === booking.orderId || t.lotId === booking.lotId) {
        return {
          ...t,
          vehicleNumber: assignedReg,
          driverName: assignedDriver,
          escrowStatus: 'Escrow Funded (Transport Scheduled)'
        };
      }
      return t;
    }));

    try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } }); } catch (e) {}

    pushActivity(`Transporter ${assignedTransporter} CONFIRMED booking #${bookingId} (Vehicle: ${assignedReg})`, 'transport');

    pushNotification(
      "Transport Booking Confirmed!",
      `${assignedTransporter} confirmed vehicle ${assignedReg} (Driver: ${assignedDriver}) for pickup on ${booking.pickupDate}.`,
      "वाहतूक बुकिंग निश्चित झाली!",
      "success"
    );

    showConfirmation(
      "Booking Confirmed & Dispatched",
      `Vehicle ${assignedReg} assigned. Buyer and farmer have been notified.`,
      "success"
    );
  };

  // Transporter Action 2: Negotiate Price / Counter Fare
  const counterTransportPrice = (bookingId, counterFare, counterReason) => {
    const numericCounter = Number(counterFare);
    if (!numericCounter || numericCounter <= 0) return;

    const booking = transportBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setTransportBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Price Countered',
          counterFare: numericCounter,
          counterReason: counterReason || 'Fuel surcharge and road distance adjustment',
          transporterId: currentUser?.id || 'TRANS-201',
          transporterName: currentUser?.organization || currentUser?.name || 'Kisan Express Agro Logistics'
        };
      }
      return b;
    }));

    // Update order
    setOrders(prev => prev.map(o => {
      if (o.id === booking.orderId || o.offerId === booking.offerId) {
        return {
          ...o,
          logisticsStatus: `Transporter Countered: ₹${numericCounter}`
        };
      }
      return o;
    }));

    // Update offers
    setOffers(prev => prev.map(o => {
      if (o.id === booking.offerId || o.lotId === booking.lotId) {
        return { ...o, logisticsStatus: `Transporter Countered: ₹${numericCounter}` };
      }
      return o;
    }));

    pushActivity(`Transporter countered fare on booking #${bookingId}: ₹${numericCounter} (was ₹${booking.offeredFare})`, 'transport');

    pushNotification(
      "Transporter Countered Fare",
      `Transporter proposed ₹${numericCounter} for shipment from ${booking.fromLocation} to ${booking.toLocation} (${counterReason || 'Rate revision'}).`,
      "वाहतूकदाराने नवीन भाडे प्रस्तावित केले",
      "info"
    );

    showConfirmation(
      "Counter Rate Dispatched",
      `Counter offer of ₹${numericCounter} sent to buyer for review.`,
      "info"
    );
  };

  // Buyer Action 3: Accept Transporter Counter Offer
  const acceptTransportCounter = (bookingId) => {
    const booking = transportBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const agreedFare = booking.counterFare || booking.offeredFare;

    setTransportBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Confirmed',
          offeredFare: agreedFare,
          finalAgreedFare: agreedFare,
          vehicleRegNumber: b.vehicleRegNumber || 'MH-12-QZ-4592',
          driverName: b.driverName || 'Tukaram Shinde',
          driverPhone: b.driverPhone || '+91 94223 90812'
        };
      }
      return b;
    }));

    // Update order
    setOrders(prev => prev.map(o => {
      if (o.id === booking.orderId || o.offerId === booking.offerId) {
        return {
          ...o,
          transportCost: agreedFare,
          netFarmerAmount: o.totalValue - agreedFare,
          logisticsStatus: 'Transport Confirmed',
          status: 'Transport Confirmed',
          timelineStep: 3
        };
      }
      return o;
    }));

    pushActivity(`Buyer accepted negotiated transport rate of ₹${agreedFare} for booking #${bookingId}`, 'transport');

    pushNotification(
      "Transport Fare Accepted",
      `Buyer approved the negotiated fare of ₹${agreedFare}. Transport is confirmed.`,
      "वाहतूक भाडे स्वीकारले गेले",
      "success"
    );

    showConfirmation(
      "Negotiated Fare Accepted",
      `Transport rate of ₹${agreedFare} confirmed with transporter.`,
      "success"
    );
  };

  // Advance Transport Milestone
  const advanceTransportStep = (bookingId) => {
    setTransportBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        let nextStatus = b.status;
        if (b.status === 'Confirmed') nextStatus = 'Vehicle Dispatched';
        else if (b.status === 'Vehicle Dispatched') nextStatus = 'Arrived at Farm Gate';
        else if (b.status === 'Arrived at Farm Gate') nextStatus = 'In Transit';
        else if (b.status === 'In Transit') nextStatus = 'Delivered';

        // Synchronize with order
        setOrders(ordPrev => ordPrev.map(o => {
          if (o.id === b.orderId) {
            let nextStep = o.timelineStep + 1;
            let orderStat = nextStatus === 'Delivered' ? 'Delivered' : (nextStatus === 'In Transit' ? 'In Transit' : o.status);
            return {
              ...o,
              status: orderStat,
              logisticsStatus: nextStatus,
              timelineStep: Math.min(10, nextStep)
            };
          }
          return o;
        }));

        showConfirmation("Milestone Advanced", `Transport status updated: ${nextStatus}`, "info");

        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  // Transporter Action: Add New Vehicle to Fleet
  const addFleetVehicle = (vehicleData) => {
    if (currentUser?.isFrozen) {
      showConfirmation("Account Suspended", "Your transporter account has been suspended by the platform administrator.", "danger");
      return null;
    }
    const newId = `TRANS-${Math.floor(200 + Math.random() * 800)}`;
    const newVehicle = {
      id: newId,
      providerName: (vehicleData.providerName || currentUser?.organization || currentUser?.name || "Kisan Express Agro Logistics").trim(),
      customName: (vehicleData.customName || vehicleData.vehicleType || "Commercial Fleet Vehicle").trim(),
      vehicleType: vehicleData.vehicleType || "Tata Ace Gold (Chhota Hathi)",
      vehicleRegNumber: (vehicleData.vehicleRegNumber || `MH-12-FL-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase().trim(),
      image: vehicleData.image || vehicleData.vehicleImage || "https://images.unsplash.com/photo-1586191582152-475269c719e7?w=600&auto=format&fit=crop&q=80",
      driverName: (vehicleData.driverName || "Fleet Driver").trim(),
      driverPhone: (vehicleData.driverPhone || currentUser?.phone || "+91 94223 90812").trim(),
      capacityKg: Number(vehicleData.capacityKg || 1500),
      ratePerKm: Number(vehicleData.ratePerKm || 18),
      baseFare: Number(vehicleData.baseFare || 300),
      currentLocation: vehicleData.currentLocation || "Ready for Dispatch (Base Station)",
      rating: 5.0,
      completedTrips: 0,
      hasGps: vehicleData.hasGps !== false,
      isInsured: vehicleData.isInsured !== false,
      hasReefer: Boolean(vehicleData.hasReefer),
      notes: vehicleData.notes || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setFleetVehicles(prev => [newVehicle, ...prev]);
    setIsAddVehicleModalOpen(false);

    pushActivity(`New fleet vehicle registered: ${newVehicle.vehicleRegNumber} (${newVehicle.vehicleType}) by ${newVehicle.providerName}`, 'transport');

    pushNotification(
      "Vehicle Added to Fleet",
      `Vehicle ${newVehicle.vehicleRegNumber} (${newVehicle.vehicleType}, ${newVehicle.capacityKg} KG) is now active and ready for farm bookings.`,
      "नवीन वाहन ताफ्यात समाविष्ट झाले",
      "success"
    );

    showConfirmation(
      "Vehicle Registered",
      `${newVehicle.vehicleType} (${newVehicle.vehicleRegNumber}) registered successfully.`,
      "success"
    );

    return newVehicle;
  };

  // Farmer Action: Counter-Offer
  const counterOffer = (offerId, counterRate) => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          status: "Countered",
          counterRate: Number(counterRate)
        };
      }
      return o;
    }));

    pushActivity(`Farmer countered offer #${offerId} with rate ₹${counterRate}/KG`, 'offer');
    showConfirmation("Counter Offer Sent", `Counter offer of ₹${counterRate}/KG dispatched to buyer.`, 'info');
  };

  // Farmer Action: Reject Offer
  const rejectOffer = (offerId) => {
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: "Rejected" } : o));
    pushActivity(`Offer #${offerId} declined by farmer`, 'offer');
    showConfirmation("Offer Declined", "The offer has been marked as declined.", 'info');
  };

  // Admin Action: Cancel Order with reason
  const cancelOrder = (orderId, reason, adminName = 'MahaAgri Market Officer') => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: "Cancelled",
          cancellationReason: reason || "Administrative action",
          cancelledBy: adminName,
          cancelledAt: new Date().toISOString().split('T')[0]
        };
      }
      return ord;
    }));

    pushActivity(`🔴 Order #${orderId} was CANCELLED by ${adminName} (${reason})`, 'order');

    showConfirmation(
      t('msgOrderCancelledTitle'),
      `Order #${orderId} has been cancelled. Reason recorded: ${reason}`,
      'danger'
    );
  };

  // Admin Action: Delete Any Farmer Lot
  const deleteLot = (lotId, reason = 'Administrative removal') => {
    const targetLot = lots.find(l => l.id === lotId);
    const lotDesc = targetLot ? `${targetLot.crop} (${targetLot.quantity} ${targetLot.unit || 'KG'}) by ${targetLot.farmerName}` : `#${lotId}`;

    setLots(prev => prev.filter(l => l.id !== lotId));
    // Also remove any offers associated with this lot
    setOffers(prev => prev.filter(o => o.lotId !== lotId));
    apiService.deleteLot(lotId);

    pushActivity(`🔴 Administrator DELETED Crop Lot #${lotId} (${lotDesc})`, 'lot');
    pushNotification(
      "Crop Lot Deleted",
      `Crop Lot #${lotId} (${lotDesc}) was removed by the platform administrator: ${reason}`,
      "प्रशासकाद्वारे पीक लॉट हटवला गेला",
      "warning"
    );
    showConfirmation(
      "Lot Deleted",
      `Lot #${lotId} (${lotDesc}) has been permanently deleted from the platform.`,
      'danger'
    );
    return true;
  };

  // Admin Action: Delete Any Buyer Offer
  const deleteOffer = (offerId, reason = 'Administrative removal') => {
    const targetOffer = offers.find(o => o.id === offerId);
    if (!targetOffer) return false;

    const offerDesc = `₹${targetOffer.offeredRate}/KG on Lot #${targetOffer.lotId} by ${targetOffer.buyerName}`;
    setOffers(prev => prev.filter(o => o.id !== offerId));

    // Reset lot status if no offers remain
    setLots(prev => prev.map(l => {
      if (l.id === targetOffer.lotId) {
        const remaining = offers.filter(o => o.lotId === l.id && o.id !== offerId);
        if (remaining.length === 0 && l.status === 'Offers Received') {
          return { ...l, status: 'Open' };
        }
      }
      return l;
    }));

    pushActivity(`🔴 Administrator DELETED Buyer Offer #${offerId} (${offerDesc})`, 'offer');
    pushNotification(
      "Buyer Offer Deleted",
      `Offer #${offerId} (${offerDesc}) was deleted by the platform administrator: ${reason}`,
      "प्रशासकाद्वारे खरेदी प्रस्ताव हटवला गेला",
      "warning"
    );
    showConfirmation(
      "Offer Deleted",
      `Offer #${offerId} (${offerDesc}) has been permanently removed.`,
      'danger'
    );
    return true;
  };

  // Admin Action: Delete Any Transporter Vehicle
  const deleteVehicle = (vehicleId, reason = 'Administrative de-registration') => {
    const targetVeh = (fleetVehicles || []).find(v => v.id === vehicleId || v.vehicleRegNumber === vehicleId);
    const regNo = targetVeh ? (targetVeh.vehicleRegNumber || targetVeh.vehicleNo) : vehicleId;
    const type = targetVeh ? (targetVeh.vehicleType || targetVeh.type) : 'Carrier Vehicle';

    setFleetVehicles(prev => (prev || []).filter(v => v.id !== vehicleId && v.vehicleRegNumber !== vehicleId && v.vehicleNo !== vehicleId));

    pushActivity(`🔴 Administrator DELETED Vehicle ${regNo} (${type}) from logistics fleet (${reason})`, 'transport');
    pushNotification(
      "Vehicle Removed from Fleet",
      `Vehicle ${regNo} (${type}) was removed by the platform administrator: ${reason}`,
      "वाहन ताफ्यातून काढून टाकले",
      "warning"
    );
    showConfirmation(
      "Vehicle Deleted",
      `Vehicle ${regNo} (${type}) has been removed from the platform fleet.`,
      'danger'
    );
    return true;
  };

  // Admin Action: Stop / Freeze or Activate Any User (Farmer, Buyer, Transporter)
  const toggleUserStatus = (userId, reason = 'Administrative policy enforcement') => {
    let nextState = false;
    let targetUser = null;

    setRegisteredUsers(prev => prev.map(u => {
      const isTarget = 
        u.id === userId || 
        (u.rawPhone && u.rawPhone === userId) || 
        (u.phone && u.phone === userId) ||
        (u.email && u.email.toLowerCase() === (userId || '').toLowerCase());
      if (isTarget) {
        nextState = !u.isFrozen;
        targetUser = u;
        return {
          ...u,
          isFrozen: nextState,
          status: nextState ? 'Suspended' : 'Active',
          frozenReason: nextState ? reason : null,
          frozenAt: nextState ? new Date().toISOString() : null
        };
      }
      return u;
    }));

    // If active user session matches, sync currentUser
    if (currentUser && (
      currentUser.id === userId || 
      currentUser.rawPhone === userId || 
      currentUser.phone === userId || 
      (currentUser.email && currentUser.email.toLowerCase() === (userId || '').toLowerCase())
    )) {
      setCurrentUser(prev => prev ? {
        ...prev,
        isFrozen: nextState,
        status: nextState ? 'Suspended' : 'Active'
      } : null);
    }

    const userName = targetUser ? targetUser.name : userId;
    const userRole = targetUser ? targetUser.role.toUpperCase() : 'USER';
    const actionLabel = nextState ? 'STOPPED / SUSPENDED' : 'ACTIVATED / RESTORED';

    pushActivity(`⚖️ Administrator ${actionLabel} ${userRole} account: ${userName}`, 'auth');
    pushNotification(
      nextState ? "Account Suspended by Admin" : "Account Reactivated",
      `Account of ${userName} (${userRole}) has been ${nextState ? 'temporarily stopped' : 'restored'}.`,
      nextState ? "खाते निलंबित केले" : "खाते पुन्हा सक्रिय केले",
      nextState ? "error" : "success"
    );
    showConfirmation(
      nextState ? "Account Stopped" : "Account Active",
      `${userName} (${userRole}) has been ${nextState ? 'suspended & stopped from trading' : 're-activated'}.`,
      nextState ? 'danger' : 'success'
    );
    return nextState;
  };

  const stopUser = (userId, reason) => toggleUserStatus(userId, reason);
  const activateUser = (userId) => toggleUserStatus(userId);

  // Admin Action: Permanently Delete Any User from Registry
  const deleteUser = (userId, reason = 'Administrative de-registration') => {
    let deletedUserName = '';
    let deletedUserRole = '';

    setRegisteredUsers(prev => {
      const target = prev.find(u => 
        u.id === userId || 
        (u.rawPhone && u.rawPhone === userId) || 
        (u.phone && u.phone === userId) ||
        (u.email && u.email.toLowerCase() === (userId || '').toLowerCase())
      );
      if (target) {
        deletedUserName = target.name;
        deletedUserRole = target.role;
      }
      return prev.filter(u => 
        u.id !== userId && 
        u.rawPhone !== userId && 
        u.phone !== userId && 
        (u.email || '').toLowerCase() !== (userId || '').toLowerCase()
      );
    });

    if (currentUser && (
      currentUser.id === userId || 
      currentUser.rawPhone === userId || 
      currentUser.phone === userId || 
      (currentUser.email && currentUser.email.toLowerCase() === (userId || '').toLowerCase())
    )) {
      if (!currentUser.isSuperAdmin) {
        setCurrentUser(null);
      }
    }

    pushActivity(`🔴 Administrator PERMANENTLY DELETED ${deletedUserRole ? deletedUserRole.toUpperCase() : 'USER'} account: ${deletedUserName || userId}`, 'auth');
    pushNotification(
      "User Account Deleted",
      `Account of ${deletedUserName || userId} was permanently deleted from the platform registry: ${reason}`,
      "वापरकर्ता खाते कायमचे हटवले",
      "warning"
    );
    showConfirmation(
      "User Deleted",
      `User ${deletedUserName || userId} has been permanently deleted from the platform.`,
      'danger'
    );
    return true;
  };

  // Admin Action: Permanently Delete Any Order / Contract
  const deleteOrder = (orderId, reason = 'Administrative cancellation and purge') => {
    const targetOrder = orders.find(o => o.id === orderId);
    const orderDesc = targetOrder ? `${targetOrder.crop} (${targetOrder.farmerName} ➔ ${targetOrder.buyerName})` : `#${orderId}`;

    setOrders(prev => prev.filter(o => o.id !== orderId));

    pushActivity(`🔴 Administrator DELETED Order #${orderId} (${orderDesc})`, 'order');
    pushNotification(
      "Order Record Deleted",
      `Order #${orderId} was permanently deleted from the registry: ${reason}`,
      "ऑर्डर नोंद हटवली गेली",
      "warning"
    );
    showConfirmation(
      "Order Deleted",
      `Order #${orderId} (${orderDesc}) has been permanently deleted.`,
      'danger'
    );
    return true;
  };

  // Admin Action: Permanently Delete Any Grievance Dispute Ticket
  const deleteGrievance = (grievanceId) => {
    setGrievances(prev => prev.filter(g => g.id !== grievanceId && g.ticketId !== grievanceId));
    pushActivity(`🔴 Administrator DELETED Grievance Ticket #${grievanceId}`, 'grievance');
    showConfirmation("Grievance Deleted", `Dispute ticket #${grievanceId} was removed from records.`, 'danger');
    return true;
  };

  // Admin Action: Permanently Delete Any Transaction Record
  const deleteTransaction = (txnId) => {
    setTransactions(prev => prev.filter(t => t.id !== txnId && t.txnId !== txnId));
    pushActivity(`🔴 Administrator DELETED Transaction #${txnId}`, 'payment');
    showConfirmation("Transaction Deleted", `Transaction record #${txnId} removed.`, 'danger');
    return true;
  };

  // Escrow Action: Disburse & Settle Escrow Payment directly to Farmer DBT
  const releaseEscrowPayment = (txnId) => {
    let releasedTxn = null;
    setTransactions(prev => prev.map(t => {
      if (t.id === txnId || t.orderId === txnId || t.lotId === txnId) {
        releasedTxn = t;
        return {
          ...t,
          escrowStatus: "Completed",
          paymentDate: new Date().toISOString().split('T')[0],
          settledAt: new Date().toISOString(),
          utrNumber: t.utrNumber || `AGRILINK${Date.now().toString().slice(-9)}`
        };
      }
      return t;
    }));

    // Update corresponding order
    setOrders(prev => prev.map(o => {
      if (o.id === txnId || o.lotId === txnId || (releasedTxn && o.id === releasedTxn.orderId)) {
        return { ...o, paymentStatus: 'Settled / Completed', status: 'Delivered' };
      }
      return o;
    }));

    try { confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } }); } catch (e) {}

    const farmerName = releasedTxn?.farmerName || 'Farmer';
    const amountVal = (releasedTxn?.netFarmerAmount || releasedTxn?.grossAmount || releasedTxn?.amount || 0).toLocaleString();

    pushActivity(`Escrow settlement completed: ₹${amountVal} disbursed to Farmer ${farmerName} via DBT`, 'payment');

    pushNotification(
      "Escrow Payment Disbursed!",
      `₹${amountVal} released from RBI-compliant escrow directly to ${farmerName}'s bank account via DBT.`,
      `शेतकऱ्याला ₹${amountVal} एस्क्रो रक्कम थेट बँक खात्यात वर्ग झाली आहे!`,
      "success"
    );

    showConfirmation(
      "Escrow Payment Disbursed",
      `₹${amountVal} credited to farmer's account via Instant DBT Bank Transfer.`,
      "success"
    );
    return true;
  };

  // Escrow Action: Direct Escrow Deposit Funding
  const fundEscrowDeposit = ({ lotId, farmerName, farmerPhone, buyerName, crop, quantity, unit, agreedPrice, amount }) => {
    const total = Number(amount || (Number(quantity || 1000) * Number(agreedPrice || 25)));
    const newTxn = {
      id: `TXN-ESC-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: lotId || `LOT-DEP-${Date.now().toString().slice(-5)}`,
      orderId: `ORD-${Date.now().toString().slice(-5)}`,
      farmerName: farmerName || 'Registered Farmer',
      farmerPhone: farmerPhone || '+91 98220 14892',
      buyerName: buyerName || currentUser?.organization || currentUser?.name || 'Verified Buyer',
      crop: crop || 'Produce',
      quantity: Number(quantity) || 1000,
      unit: unit || 'KG',
      sellingRate: Number(agreedPrice) || (Number(quantity) ? Math.round(total / Number(quantity)) : 25),
      grossAmount: total,
      amount: total,
      transportCost: 0,
      netFarmerAmount: total,
      escrowStatus: 'Escrow Locked (Secured in Vault)',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Triple-Lock Escrow Vault (UPI / NEFT)',
      utrNumber: `AGRIESC${Date.now().toString().slice(-9)}`,
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTxn, ...prev]);

    try { confetti({ particleCount: 75, spread: 60, origin: { y: 0.5 } }); } catch (e) {}

    pushActivity(`New escrow deposit secured: ₹${total.toLocaleString()} for ${crop || 'Produce'} by ${newTxn.buyerName}`, 'payment');

    pushNotification(
      "Escrow Vault Deposit Secured!",
      `₹${total.toLocaleString()} successfully locked in RBI-compliant escrow for ${newTxn.farmerName}.`,
      "एस्क्रो खात्यात रक्कम सुरक्षित जमा करण्यात आली.",
      "success"
    );

    showConfirmation("Escrow Deposit Secured", `₹${total.toLocaleString()} locked into Triple-Lock Escrow Vault.`, "success");
    return newTxn;
  };

  // Admin Action: Clear Activity Audit Log
  const clearActivityFeed = () => {
    setLiveActivityFeed([{
      id: `ACT-${Date.now()}`,
      text: 'Administrator cleared the global system activity log',
      time: 'Just now',
      type: 'auth'
    }]);
    showConfirmation("Audit Trail Cleared", "Global activity log has been reset.", "info");
  };

  // Admin Actions: Bulk Purge Options
  const deleteAllLots = () => {
    setLots([]);
    setOffers([]);
    pushActivity("🔴 Administrator PURGED all crop lots from the marketplace", "lot");
    showConfirmation("All Lots Deleted", "Every crop lot on the marketplace has been removed.", "danger");
  };

  const deleteAllOffers = () => {
    setOffers([]);
    setLots(prev => prev.map(l => l.status === 'Offers Received' ? { ...l, status: 'Open' } : l));
    pushActivity("🔴 Administrator PURGED all buyer purchase bids", "offer");
    showConfirmation("All Offers Deleted", "All purchase offers have been deleted.", "danger");
  };

  const deleteAllOrders = () => {
    setOrders([]);
    pushActivity("🔴 Administrator PURGED all orders and contracts", "order");
    showConfirmation("All Orders Deleted", "All platform orders and contracts have been purged.", "danger");
  };

  const deleteAllVehicles = () => {
    setFleetVehicles([]);
    pushActivity("🔴 Administrator PURGED all carrier vehicles from the fleet", "transport");
    showConfirmation("All Vehicles Deleted", "Carrier fleet registry has been cleared.", "danger");
  };

  // Advance Order Milestone / Status
  const advanceOrderStep = (orderId) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        let nextStatus = ord.status;
        let nextPayment = ord.paymentStatus;
        let nextStep = ord.timelineStep + 1;

        if (ord.timelineStep < 6) {
          nextStatus = "In Transit";
          showConfirmation(t('msgTransportAssignedTitle'), `Order #${orderId} picked up by ${ord.transporter}. Now in transit.`, 'info');
        } else if (ord.timelineStep < 9) {
          nextStatus = "Delivered";
          nextPayment = "Payment Confirmed";
          try { confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } }); } catch (e) {}
          showConfirmation(t('msgDeliveryConfirmedTitle'), `Order #${orderId} delivered at ${ord.deliveryLocation}. Payment confirmed!`, 'success');
        }

        return {
          ...ord,
          status: nextStatus,
          paymentStatus: nextPayment,
          timelineStep: Math.min(10, nextStep)
        };
      }
      return ord;
    }));
  };

  // Grievances
  const raiseGrievance = (formData) => {
    const newGrievance = {
      id: `GRV-2026-${Math.floor(200 + Math.random() * 800)}`,
      ticketId: `TKT-MH-${Math.floor(1000 + Math.random() * 9000)}`,
      raisedByRole: currentUser ? currentUser.role : 'farmer',
      userName: currentUser ? currentUser.name : 'Ramesh Patil',
      category: formData.category,
      relatedLotId: formData.relatedLotId || "LOT-PN-2026-081",
      description: formData.description,
      status: "Investigating",
      priority: formData.priority || "High",
      evidenceFile: formData.evidenceFile || "evidence_document.pdf",
      resolutionNotes: null,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setGrievances(prev => [newGrievance, ...prev]);
    pushActivity(`New grievance filed: ${newGrievance.category} by ${newGrievance.userName}`, 'grievance');
    showConfirmation("Grievance Submitted", `Ticket #${newGrievance.ticketId} submitted to Market Redressal Authority.`, 'info');
    return newGrievance;
  };

  const resolveGrievance = (grievanceId, notes) => {
    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        return {
          ...g,
          status: "Resolved",
          resolutionNotes: notes || "Resolved by Market Authority with mutual settlement.",
          resolvedAt: new Date().toISOString().split('T')[0]
        };
      }
      return g;
    }));

    pushActivity(`Grievance #${grievanceId} resolved by Admin`, 'grievance');
    showConfirmation("Grievance Resolved", `Dispute marked as resolved by Market Authority.`, 'success');
  };

  // Cold Storage Facilities Management
  const addStorageFacility = (facilityData) => {
    const newFacility = {
      id: `STORE-${Date.now().toString().slice(-4)}`,
      facilityName: facilityData.facilityName || "New Cold Vault Hub",
      location: facilityData.location || "Maharashtra, India",
      district: facilityData.district || "Pune",
      distanceKm: Number(facilityData.distanceKm) || 20,
      totalCapacityMT: Number(facilityData.totalCapacityMT) || 1000,
      availableCapacityMT: Number(facilityData.availableCapacityMT) || Number(facilityData.totalCapacityMT) || 800,
      costPerKgPerDay: Number(facilityData.costPerKgPerDay) || 0.04,
      storageType: facilityData.storageType || "Climate Controlled Cold Storage (0°C to 4°C)",
      humidity: facilityData.humidity || "85-95% RH",
      rating: 5.0,
      insuranceCovered: true,
      accreditation: facilityData.accreditation || "WDRA & MahaAgri Certified Cold Chain Node",
      image: facilityData.image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
      ownerId: currentUser?.id || 'STORAGE-301',
      ownerName: currentUser?.name || 'Balasaheb Kadam',
      ownerPhone: currentUser?.phone || '+91 97654 32190',
      suitableCrops: facilityData.suitableCrops || "Grapes, Pomegranates, Onions, Apples",
      amenities: facilityData.amenities || ["Backup Diesel Genset", "Active Nitrogen Purge", "Ethylene Scrubber", "CCTV 24x7"],
      roiSummary: `Ideal for ${facilityData.suitableCrops || 'fruits & perishables'}. Expected daily holding appreciation exceeds storage rental by 3.5x.`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setStorageFacilities(prev => [newFacility, ...prev]);

    try { confetti({ particleCount: 75, spread: 60, origin: { y: 0.5 } }); } catch (e) {}

    pushActivity(`New cold storage facility added: ${newFacility.facilityName} (${newFacility.totalCapacityMT} MT) in ${newFacility.location}`, 'storage');

    pushNotification(
      "Cold Storage Facility Listed!",
      `${newFacility.facilityName} (${newFacility.totalCapacityMT} MT capacity) is now open for farmer and buyer reservations.`,
      "नवीन शीतगृह यशस्वीरित्या नोंदवले गेले!",
      "success"
    );

    showConfirmation(
      "Facility Registered",
      `${newFacility.facilityName} is now live and available on the marketplace.`,
      "success"
    );
    return newFacility;
  };

  const deleteStorageFacility = (facilityId) => {
    setStorageFacilities(prev => prev.filter(f => f.id !== facilityId));
    pushActivity(`Storage facility #${facilityId} deleted by operator`, 'storage');
    showConfirmation("Facility Removed", `Cold storage facility #${facilityId} was removed from records.`, "danger");
    return true;
  };

  const updateStorageBookingStatus = (bookingId, newStatus) => {
    setStorageBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    }));

    // If released or completed, settle escrow transaction
    if (newStatus === 'Released' || newStatus === 'Completed') {
      setTransactions(prev => prev.map(t => {
        if (t.orderId === bookingId) {
          return {
            ...t,
            escrowStatus: "Completed",
            settledAt: new Date().toISOString()
          };
        }
        return t;
      }));
    }

    pushActivity(`Storage Reservation #${bookingId} status updated to: ${newStatus}`, 'storage');
    showConfirmation("Reservation Updated", `Booking #${bookingId} is now ${newStatus}.`, 'info');
  };

  const bookStorage = (facilityId, qtyKg, days, options = {}) => {
    const facility = (storageFacilities || []).find(s => s.id === facilityId) || STORAGE_PROVIDERS.find(s => s.id === facilityId);
    const cost = Math.round((facility ? facility.costPerKgPerDay : 0.04) * qtyKg * days);
    const cropName = options.crop || "Onion";
    const bookedByName = currentUser ? (currentUser.organization || currentUser.name) : "Registered Client";
    const userRole = currentUser ? currentUser.role : "farmer";

    const booking = {
      id: `BOOK-ST-${Date.now().toString().slice(-4)}`,
      facilityId,
      facilityName: facility ? facility.facilityName : "Pune Agro Storage",
      facilityLocation: facility ? facility.location : "Maharashtra",
      facilityOwnerName: facility ? (facility.ownerName || "Balasaheb Kadam") : "Cold Storage Operator",
      facilityOwnerPhone: facility ? (facility.ownerPhone || "+91 97654 32190") : "+91 97654 32190",
      bookedById: currentUser?.id || 'CLIENT-001',
      bookedByName,
      bookedByPhone: currentUser?.phone || '+91 98220 14892',
      bookedByRole: userRole,
      farmerName: userRole === 'farmer' ? bookedByName : (options.farmerName || "Registered Farmer"),
      buyerName: userRole === 'buyer' ? bookedByName : (options.buyerName || "Institutional Buyer"),
      crop: cropName,
      quantityKg: qtyKg,
      days,
      dailyRate: facility ? facility.costPerKgPerDay : 0.04,
      totalCost: cost,
      bookingDate: new Date().toISOString().split('T')[0],
      status: "Confirmed",
      paymentStatus: "Escrow Secured (Storage Reserved)",
      paymentMode: options.paymentMode || "UPI Instant Escrow",
      utrNumber: `AGRISTOR${Date.now().toString().slice(-8)}`
    };

    setStorageBookings(prev => [booking, ...prev]);

    // Update facility available capacity
    setStorageFacilities(prev => prev.map(f => {
      if (f.id === facilityId) {
        const bookedMT = Math.round(qtyKg / 1000);
        return {
          ...f,
          availableCapacityMT: Math.max(0, (f.availableCapacityMT || f.totalCapacityMT) - bookedMT)
        };
      }
      return f;
    }));

    // Auto-create Escrow Transaction for storage rental
    const storageTxn = {
      id: `TXN-ST-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: booking.id,
      lotId: `LOT-ST-${Date.now().toString().slice(-4)}`,
      farmerName: booking.farmerName,
      farmerPhone: booking.bookedByPhone,
      buyerName: booking.facilityName,
      crop: `${cropName} (Cold Storage Reservation - ${days} Days)`,
      quantity: qtyKg,
      unit: "KG",
      sellingRate: (cost / qtyKg).toFixed(2),
      grossAmount: cost,
      amount: cost,
      transportCost: 0,
      netFarmerAmount: cost,
      escrowStatus: "Escrow Secured (Storage Reserved)",
      paymentDate: booking.bookingDate,
      paymentMode: booking.paymentMode,
      utrNumber: booking.utrNumber,
      notes: `${days} days cold storage reservation for ${qtyKg} KG ${cropName} at ${booking.facilityName}`
    };

    setTransactions(prev => [storageTxn, ...prev]);

    try { confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } }); } catch (e) {}

    pushActivity(`${bookedByName} booked ${qtyKg} KG space for ${days} days at ${booking.facilityName} (₹${cost.toLocaleString()} secured in Escrow)`, 'storage');

    pushNotification(
      "Cold Storage Space Reserved!",
      `Reserved ${qtyKg.toLocaleString()} KG for ${days} days at ${booking.facilityName}. ₹${cost.toLocaleString()} secured in Escrow.`,
      `शीतगृहात जागा यशस्वीरित्या आरक्षित झाली! ₹${cost.toLocaleString()} एस्क्रो मध्ये सुरक्षित.`,
      "success"
    );

    showConfirmation(
      "Storage Space Reserved",
      `Space for ${qtyKg.toLocaleString()} KG confirmed at ${booking.facilityName}. Payment secured in Escrow.`,
      "success"
    );

    return booking;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        lang,
        setLang,
        activeTab,
        setActiveTab,
        t,
        login,
        loginWithPhone,
        loginWithIdentifier,
        logout,
        registerUser,
        lots,
        setLots,
        createLot,
        deleteLot,
        offers,
        setOffers,
        submitOffer,
        acceptOffer,
        counterOffer,
        rejectOffer,
        deleteOffer,
        orders,
        cancelOrder,
        deleteOrder,
        advanceOrderStep,
        deleteVehicle,
        toggleUserStatus,
        stopUser,
        activateUser,
        deleteUser,
        transactions,
        deleteTransaction,
        releaseEscrowPayment,
        fundEscrowDeposit,
        grievances,
        raiseGrievance,
        resolveGrievance,
        deleteGrievance,
        liveActivityFeed,
        clearActivityFeed,
        deleteAllLots,
        deleteAllOffers,
        deleteAllOrders,
        deleteAllVehicles,
        notifications,
        pushNotification,
        storageBookings,
        setStorageBookings,
        storageFacilities,
        setStorageFacilities,
        addStorageFacility,
        deleteStorageFacility,
        updateStorageBookingStatus,
        bookStorage,
        confirmationToast,
        showConfirmation,
        // Modals & Auth State
        isAuthModalOpen,
        setIsAuthModalOpen,
        authDefaultRole,
        setAuthDefaultRole,
        authDefaultTab,
        setAuthDefaultTab,
        openAuthModal,
        registeredUsers,
        findRegisteredUser,
        cropsCatalog,
        addCustomCrop,
        isCreateLotModalOpen,
        setIsCreateLotModalOpen,
        isMakeOfferModalOpen,
        setIsMakeOfferModalOpen,
        selectedLotForOffer,
        setSelectedLotForOffer,
        selectedLotIdForOffers,
        setSelectedLotIdForOffers,
        // Farmer Payment Actions & Modals
        isFarmerPaymentModalOpen,
        setIsFarmerPaymentModalOpen,
        selectedDealForPayment,
        setSelectedDealForPayment,
        openFarmerPaymentModal,
        closeFarmerPaymentModal,
        processFarmerPayment,
        // Transport Logistics & Fleet
        transportBookings,
        fleetVehicles,
        setFleetVehicles,
        isBookTransportModalOpen,
        setIsBookTransportModalOpen,
        selectedDealForTransport,
        setSelectedDealForTransport,
        openBookTransportModal,
        closeBookTransportModal,
        createTransportBooking,
        confirmTransportBooking,
        counterTransportPrice,
        acceptTransportCounter,
        selectSelfPickup,
        advanceTransportStep,
        isAddVehicleModalOpen,
        setIsAddVehicleModalOpen,
        addFleetVehicle,
        isRateModalOpen,
        setIsRateModalOpen,
        ratedTxn,
        setRatedTxn,
        // Live Multi-Device Sync
        syncStatus,
        lastSyncTime,
        loadServerData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
