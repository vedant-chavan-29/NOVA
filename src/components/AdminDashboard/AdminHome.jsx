import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CloudSyncModal } from '../Common/CloudSyncModal';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  TrendingUp, 
  Package, 
  Coins, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  FileCheck2, 
  Scale,
  RefreshCw,
  Search,
  Truck,
  Sprout,
  X,
  Clock,
  Ban,
  Eye,
  Activity,
  Calendar,
  DollarSign,
  Radio,
  Server,
  Zap,
  Lock,
  Warehouse,
  PhoneCall,
  Mail,
  MapPin,
  Sparkles,
  ChevronRight,
  Sliders,
  Send,
  Download,
  AlertCircle,
  Award,
  Trash2,
  Tag,
  Cloud
} from 'lucide-react';

export const AdminHome = () => {
  const { 
    currentUser,
    login,
    orders,
    cancelOrder,
    liveActivityFeed,
    lots, 
    offers, 
    transactions, 
    grievances, 
    resolveGrievance, 
    lang, 
    t, 
    pushNotification,
    showConfirmation,
    registeredUsers,
    deleteLot,
    deleteOffer,
    deleteVehicle,
    toggleUserStatus,
    fleetVehicles,
    deleteUser,
    deleteOrder,
    deleteGrievance,
    deleteTransaction,
    clearActivityFeed,
    deleteAllLots,
    deleteAllOffers,
    deleteAllOrders,
    deleteAllVehicles
  } = useApp();

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState('command'); // 'command', 'users', 'lots', 'offers', 'farmers', 'buyers', 'transport', 'orders', 'grievances', 'feed'
  const [isCloudSyncModalOpen, setIsCloudSyncModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearchText, setUserSearchText] = useState('');
  const [lotSearchQuery, setLotSearchQuery] = useState('');
  const [offerSearchQuery, setOfferSearchQuery] = useState('');
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
  
  // Selected Order for 10-step Timeline
  const [selectedOrderForTimeline, setSelectedOrderForTimeline] = useState(null);

  // Deletion & Suspension Confirmation Modals
  const [lotToDelete, setLotToDelete] = useState(null);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [userToToggle, setUserToToggle] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [grievanceToDelete, setGrievanceToDelete] = useState(null);
  const [purgeTarget, setPurgeTarget] = useState(null); // 'lots' | 'offers' | 'orders' | 'vehicles' | 'audit' | null
  const [actionReason, setActionReason] = useState('Administrative compliance review');

  // Cancellation Modal State
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('Transport unavailable due to logistical bottleneck');
  const [cancellationNotes, setCancellationNotes] = useState('');

  // Live Broadcast Message State (Hosts website-wide announcements)
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [activeBroadcast, setActiveBroadcast] = useState('🟢 All systems nominal: APMC Lasalgaon, Narayangaon & Gultekdi live price feed synchronized.');
  
  // Website Operating Mode
  const [platformMode, setPlatformMode] = useState('normal'); // 'normal', 'peak_harvest', 'maintenance'

  // Farmers Directory (Master analysis state)
  const [farmersList, setFarmersList] = useState([
    {
      id: 'FARMER-001',
      name: 'Ramesh Patil',
      fpo: 'Sahyadri Farmers Producer Co.',
      phone: '+91 98220 14892',
      email: 'ramesh.patil@sahyadrifpo.org',
      district: 'Pune (Haveli)',
      crops: 'Onion (Garwa Red), Tomato',
      totalLots: 6,
      volumeMT: 18.5,
      revenueRealized: 486000,
      avgQualityScore: 94,
      kycStatus: 'Verified (7/12 & Aadhaar)',
      isVerified: true
    },
    {
      id: 'FARMER-002',
      name: 'Sanjay Shinde',
      fpo: 'Godavari Agro FPO',
      phone: '+91 94220 54129',
      email: 'sanjay.shinde@godavariat.in',
      district: 'Nashik (Dindori)',
      crops: 'Tomato (Abhinav Hybrid), Pomegranate',
      totalLots: 9,
      volumeMT: 32.0,
      revenueRealized: 742000,
      avgQualityScore: 92,
      kycStatus: 'Verified (7/12 & Aadhaar)',
      isVerified: true
    },
    {
      id: 'FARMER-003',
      name: 'Kishor Ghadge',
      fpo: 'Pravara Farmers Producer Group',
      phone: '+91 97632 88401',
      email: 'kishor.ghadge@pravarafpo.org',
      district: 'Ahmednagar (Sangamner)',
      crops: 'Soybean (JS 335), Wheat',
      totalLots: 4,
      volumeMT: 16.0,
      revenueRealized: 560000,
      avgQualityScore: 86,
      kycStatus: 'Verified (7/12 & Aadhaar)',
      isVerified: true
    },
    {
      id: 'FARMER-004',
      name: 'Sunita More',
      fpo: 'Krushna Vasant FPO',
      phone: '+91 98231 77412',
      email: 'sunita.more@krushnaagro.in',
      district: 'Solapur (Pandharpur)',
      crops: 'Pomegranate (Bhagwa), Onion',
      totalLots: 5,
      volumeMT: 12.8,
      revenueRealized: 980000,
      avgQualityScore: 95,
      kycStatus: 'Pending Inspection',
      isVerified: false
    },
    {
      id: 'FARMER-005',
      name: 'Bapurao Deshmukh',
      fpo: 'Vidarbha Cotton Collective',
      phone: '+91 94218 66209',
      email: 'bapurao.deshmukh@vidarbhaagro.org',
      district: 'Nagpur (Katol)',
      crops: 'Cotton (BT Cotton II), Soybean',
      totalLots: 7,
      volumeMT: 28.4,
      revenueRealized: 1120000,
      avgQualityScore: 89,
      kycStatus: 'Verified (7/12 & Aadhaar)',
      isVerified: true
    }
  ]);

  // Institutional Buyers Directory (Master analysis state)
  const [buyersList, setBuyersList] = useState([
    {
      id: 'BUYER-101',
      name: 'Sahyadri Mega Food Park & Agro Processing',
      type: 'Agro Processor & Exporter',
      contactPerson: 'Amit Deshmukh',
      phone: '+91 98902 44100',
      email: 'procurement@sahyadrifoodpark.com',
      location: 'Chakan Industrial Zone, Pune',
      gstin: '27AABCS9182K1ZU',
      fssai: '11518036000412',
      totalProcuredMT: 142.5,
      totalSpend: 3980000,
      activeBids: 8,
      escrowReliability: '99.8%',
      status: 'Verified Enterprise',
      isFrozen: false
    },
    {
      id: 'BUYER-102',
      name: 'Reliance Fresh Direct Agro Sourcing',
      type: 'Organized Retail & Supermarket Chain',
      contactPerson: 'Pradeep Kulkarni',
      phone: '+91 98224 88310',
      email: 'agri.procure@rilfresh.com',
      location: 'Bhosari MIDC, Pune',
      gstin: '27AABCR4491J1ZP',
      fssai: '11521034000199',
      totalProcuredMT: 210.0,
      totalSpend: 5460000,
      activeBids: 12,
      escrowReliability: '99.4%',
      status: 'Verified Enterprise',
      isFrozen: false
    },
    {
      id: 'BUYER-103',
      name: 'BigBasket Agro Sourcing Hub (Supermarket Grocery)',
      type: 'E-Commerce / B2B Wholesale',
      contactPerson: 'Nitin Sawant',
      phone: '+91 97640 12890',
      email: 'sourcing.west@bigbasket.com',
      location: 'Taloja MIDC, Navi Mumbai',
      gstin: '27AABCI6521K1ZM',
      fssai: '11519011000871',
      totalProcuredMT: 185.0,
      totalSpend: 4720000,
      activeBids: 9,
      escrowReliability: '99.1%',
      status: 'Verified Enterprise',
      isFrozen: false
    },
    {
      id: 'BUYER-104',
      name: 'ITC Agri-Business Division (Choupal Fresh)',
      type: 'Conglomerate Commodity Processor',
      contactPerson: 'Rajesh Iyer',
      phone: '+91 98200 99411',
      email: 'agri.contracts@itcltd.com',
      location: 'Nashik Industrial Corridor',
      gstin: '27AABCI1100N1ZZ',
      fssai: '11517028000301',
      totalProcuredMT: 320.0,
      totalSpend: 8140000,
      activeBids: 15,
      escrowReliability: '99.9%',
      status: 'Verified Enterprise',
      isFrozen: false
    },
    {
      id: 'BUYER-105',
      name: 'Mother Dairy Fruit & Vegetable Pvt Ltd',
      type: 'National Cooperative Processor',
      contactPerson: 'Mahesh Jadhav',
      phone: '+91 98901 33290',
      email: 'safal.sourcing@motherdairy.com',
      location: 'Vashi Terminal, Navi Mumbai',
      gstin: '27AABCM7712Q1ZW',
      fssai: '11516001000210',
      totalProcuredMT: 95.0,
      totalSpend: 2450000,
      activeBids: 5,
      escrowReliability: '98.7%',
      status: 'Verified Enterprise',
      isFrozen: false
    }
  ]);

  // Transporters & Fleet Directory (Master analysis state)
  const [fleetList, setFleetList] = useState([
    {
      id: 'TRANS-01',
      vehicleNo: 'MH-12-RN-4819',
      driverName: 'Tukaram Shinde',
      phone: '+91 94223 90812',
      type: 'Eicher 14ft High-Deck (5 MT)',
      agency: 'Kisan Express Logistics',
      currentLocation: 'Haveli ➔ Chakan Corridor',
      speed: '48 km/h',
      status: 'In Transit (Order #ORD-701)',
      gpsStatus: 'Active GPS Pulse',
      health: 'Optimal',
      temp: 'Ambient',
      tripsCompleted: 42
    },
    {
      id: 'TRANS-02',
      vehicleNo: 'MH-15-EG-8821',
      driverName: 'Pandurang Kale',
      phone: '+91 98224 11902',
      type: 'Refrigerated Reefer Van (3.5 MT)',
      agency: 'Sahyadri Cold Chain Express',
      currentLocation: 'Nashik Dindori Cold Yard',
      speed: '0 km/h (Docked)',
      status: 'Ready for Dispatch',
      gpsStatus: 'Active GPS Pulse',
      health: 'Optimal',
      temp: '4.2°C (Cold Stored)',
      tripsCompleted: 68
    },
    {
      id: 'TRANS-03',
      vehicleNo: 'MH-14-BT-3304',
      driverName: 'Ganesh Waghmare',
      phone: '+91 97633 44810',
      type: 'Tata 407 Medium Carrier (3 MT)',
      agency: 'MahaAgri Freight Network',
      currentLocation: 'Pune Gultekdi Mandi Dock',
      speed: '0 km/h (Loading)',
      status: 'Loading Farm Produce',
      gpsStatus: 'Active GPS Pulse',
      health: 'Optimal',
      temp: 'Ambient',
      tripsCompleted: 35
    },
    {
      id: 'TRANS-04',
      vehicleNo: 'MH-16-CV-9912',
      driverName: 'Babasaheb Kadam',
      phone: '+91 94218 55019',
      type: 'Mahindra Bolero Maxi Truck (1.5 MT)',
      agency: 'Krishi Rath Rural Transit',
      currentLocation: 'Sangamner Bypass Highway',
      speed: '54 km/h',
      status: 'In Transit (Order #ORD-702)',
      gpsStatus: 'Active GPS Pulse',
      health: 'Optimal',
      temp: 'Ambient',
      tripsCompleted: 84
    }
  ]);

  // System Health Metrics
  const systemMetrics = {
    serverUptime: '99.98%',
    apiLatency: '34ms',
    activeSessions: 148,
    escrowVaultStatus: 'Solvent & Cryptographically Audited',
    escrowLockedTotal: '₹2.18 Cr',
    totalTradeVolume: '₹4.82 Cr',
    smsGateway: 'Fast2SMS Cellular Carrier Linked (100% Delivery)',
    aiPredictEngine: 'LSTM & XGBoost v2.4 (94.2% accuracy)',
    visionGradingEngine: 'YOLOv8 AGMARKNET (96.5% confidence)'
  };

  const openGrievances = grievances.filter(g => g.status !== 'Resolved');

  // Verify whether the currently active user is an authorized Administrator
  const isAuthorizedMasterAdmin = 
    currentUser && 
    (currentUser.email === 'vedantkchavan2006@gmail.com' || 
     currentUser.phone?.replace(/\D/g, '').slice(-10) === '8482941628' || 
     currentUser.isSuperAdmin ||
     currentUser.role === 'admin');

  // Security Unlock function
  const handleAuthorizeMasterAdmin = () => {
    login('admin');
  };

  // Combined Fleet Vehicles from Context and local directory
  const displayVehicles = (fleetVehicles && fleetVehicles.length > 0) ? fleetVehicles : fleetList;

  // Admin Action: Delete Farmer Lot
  const handleConfirmDeleteLot = (e) => {
    if (e) e.preventDefault();
    if (!lotToDelete) return;
    deleteLot(lotToDelete.id, actionReason);
    setLotToDelete(null);
  };

  // Admin Action: Delete Buyer Offer
  const handleConfirmDeleteOffer = (e) => {
    if (e) e.preventDefault();
    if (!offerToDelete) return;
    deleteOffer(offerToDelete.id, actionReason);
    setOfferToDelete(null);
  };

  // Admin Action: Delete Transport Vehicle
  const handleConfirmDeleteVehicle = (e) => {
    if (e) e.preventDefault();
    if (!vehicleToDelete) return;
    const vId = vehicleToDelete.id || vehicleToDelete.vehicleRegNumber || vehicleToDelete.vehicleNo;
    deleteVehicle(vId, actionReason);
    setFleetList(prev => prev.filter(v => v.id !== vId && v.vehicleNo !== vId && v.vehicleRegNumber !== vId));
    setVehicleToDelete(null);
  };

  // Admin Action: Stop / Freeze or Activate Any User
  const handleConfirmToggleUser = (e) => {
    if (e) e.preventDefault();
    if (!userToToggle) return;
    const updatedStatus = toggleUserStatus(userToToggle.id, actionReason);
    // Sync local buyersList and farmersList
    setBuyersList(prev => prev.map(b => (b.id === userToToggle.id || b.phone === userToToggle.phone) ? { ...b, isFrozen: updatedStatus } : b));
    setFarmersList(prev => prev.map(f => (f.id === userToToggle.id || f.phone === userToToggle.phone) ? { ...f, isFrozen: updatedStatus } : f));
    setUserToToggle(null);
  };

  // Admin Action: Delete User Permanently
  const handleConfirmDeleteUser = (e) => {
    if (e) e.preventDefault();
    if (!userToDelete) return;
    deleteUser(userToDelete.id, actionReason);
    setFarmersList(prev => prev.filter(f => f.id !== userToDelete.id && f.phone !== userToDelete.phone));
    setBuyersList(prev => prev.filter(b => b.id !== userToDelete.id && b.phone !== userToDelete.phone));
    setUserToDelete(null);
  };

  // Admin Action: Delete Order Permanently
  const handleConfirmDeleteOrder = (e) => {
    if (e) e.preventDefault();
    if (!orderToDelete) return;
    deleteOrder(orderToDelete.id, actionReason);
    setOrderToDelete(null);
  };

  // Admin Action: Delete Grievance Dispute
  const handleConfirmDeleteGrievance = (e) => {
    if (e) e.preventDefault();
    if (!grievanceToDelete) return;
    deleteGrievance(grievanceToDelete.id);
    setGrievanceToDelete(null);
  };

  // Admin Action: Execute Bulk Purge
  const handleExecutePurge = () => {
    if (purgeTarget === 'lots') {
      deleteAllLots();
    } else if (purgeTarget === 'offers') {
      deleteAllOffers();
    } else if (purgeTarget === 'orders') {
      deleteAllOrders();
    } else if (purgeTarget === 'vehicles') {
      deleteAllVehicles();
      setFleetList([]);
    } else if (purgeTarget === 'audit') {
      clearActivityFeed();
    } else if (purgeTarget === 'all') {
      deleteAllLots();
      deleteAllOffers();
      deleteAllOrders();
      deleteAllVehicles();
      setFleetList([]);
      clearActivityFeed();
      showConfirmation("Total Platform Purge Completed", "All harvest lots, buyer offers, orders, and vehicle listings have been wiped.", "danger");
    }
    setPurgeTarget(null);
  };

  // Direct quick toggle for users
  const handleQuickToggleUser = (user) => {
    const updatedStatus = toggleUserStatus(user.id);
    setBuyersList(prev => prev.map(b => (b.id === user.id || b.phone === user.phone) ? { ...b, isFrozen: updatedStatus } : b));
    setFarmersList(prev => prev.map(f => (f.id === user.id || f.phone === user.phone) ? { ...f, isFrozen: updatedStatus } : f));
  };

  // Farmer Verification Toggle
  const handleToggleFarmerVerification = (farmerId) => {
    setFarmersList(prev => prev.map(f => {
      if (f.id === farmerId) {
        const nextState = !f.isVerified;
        pushNotification(
          nextState ? "Farmer Certified" : "Certification Revoked",
          `${f.name} (${f.fpo}) verification status updated to ${nextState ? 'MahaAgri Certified' : 'Pending'}.`,
          "शेतकरी पडताळणी अद्यतनित",
          "info"
        );
        showConfirmation("Status Updated", `${f.name}: Verification is now ${nextState ? 'Active' : 'Unverified'}.`);
        return { ...f, isVerified: nextState, kycStatus: nextState ? 'Verified (7/12 & Aadhaar)' : 'Pending Inspection' };
      }
      return f;
    }));
  };

  // Farmer Stop / Suspend Toggle
  const handleToggleFarmerStop = (farmer) => {
    const targetId = farmer.id || farmer.phone;
    const nextState = toggleUserStatus(targetId);
    setFarmersList(prev => prev.map(f => {
      if (f.id === farmer.id) {
        return { ...f, isFrozen: nextState };
      }
      return f;
    }));
  };

  // Buyer Verification Toggle / Freeze
  const handleToggleBuyerFreeze = (buyerId) => {
    const nextState = toggleUserStatus(buyerId);
    setBuyersList(prev => prev.map(b => {
      if (b.id === buyerId || b.phone === buyerId) {
        return { ...b, isFrozen: nextState, status: nextState ? 'Frozen / Under Review' : 'Verified Enterprise' };
      }
      return b;
    }));
  };

  // Broadcast Alert Message Across Platform
  const handlePublishBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    setActiveBroadcast(broadcastMsg.trim());
    pushNotification(
      "Platform Broadcast Dispatched",
      `System announcement broadcasted to all active farmers, buyers, and transporters across Maharashtra.`,
      "व्यासपीठ सूचना प्रसारित",
      "info"
    );
    showConfirmation("Announcement Live", "Broadcast banner is now live across the website.");
    setBroadcastMsg('');
  };

  // Order Cancellation Handler
  const handleOpenCancelModal = (order) => {
    setOrderToCancel(order);
    setCancellationReason('Transport unavailable due to logistical bottleneck');
    setCancellationNotes('');
  };

  const handleConfirmCancelOrder = (e) => {
    e.preventDefault();
    if (!orderToCancel) return;
    const finalReason = cancellationNotes ? `${cancellationReason}: ${cancellationNotes}` : cancellationReason;
    cancelOrder(orderToCancel.id, finalReason, 'Vedant Chavan (Chief Platform Administrator)');
    setOrderToCancel(null);
  };

  // Filter Orders
  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 10 Steps Timeline Definition
  const orderSteps = [
    { step: 1, title: 'Lot Created & Inspected', desc: 'Farmer created produce lot with optical AI quality grading.' },
    { step: 2, title: 'Buyer Offer Submitted', desc: 'Institutional buyer submitted binding purchase price offer.' },
    { step: 3, title: 'Offer Accepted & Deal Locked', desc: 'Farmer accepted the offer; legal agreement generated.' },
    { step: 4, title: 'Escrow Funds Secured', desc: 'Buyer deposited total settlement into protected escrow ledger.' },
    { step: 5, title: 'Transport Dispatched', desc: 'Carrier vehicle assigned with GPS tracking enabled.' },
    { step: 6, title: 'Farm-Gate Produce Loaded', desc: 'Driver arrived at farm gate; loading inspection completed.' },
    { step: 7, title: 'Weighbridge & In-Transit', desc: 'Produce weighed at APMC weighbridge; GPS telemetry active.' },
    { step: 8, title: 'Arrival at Buyer Hub', desc: 'Shipment docked at buyer receiving terminal.' },
    { step: 9, title: 'Quality Verification', desc: 'Receiver completed sample verification and accepted grade.' },
    { step: 10, title: 'Escrow Released to Farmer', desc: 'Instant bank transfer completed directly to farmer account.' }
  ];

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. MASTER SECURITY AUTHORIZATION HEADER & VERIFICATION SEAL               */}
      {/* ========================================================================= */}
      <div style={{
        background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0f172a 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        color: '#ffffff',
        marginBottom: '24px',
        border: '1.5px solid #312e81',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient background glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)'
              }}>
                <ShieldCheck size={14} />
                Exclusive Master Authority Clearance
              </span>
              <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 600 }}>
                Govt of Maharashtra • MahaAgri State Command Center
              </span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Central Platform Administration & Ecosystem Analytics
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.86rem', color: '#cbd5e1' }}>
              <span>
                Presiding Authority: <strong style={{ color: '#ffffff' }}>{currentUser?.name || 'Vedant Chavan'}</strong> ({currentUser?.department || currentUser?.organization || 'Chief Platform Administrator'})
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: '#86efac', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={13} /> {currentUser?.email || 'vedantkchavan2006@gmail.com'}
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: '#93c5fd', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <PhoneCall size={13} /> {currentUser?.phone || '+91 84829 41628'}
              </span>
            </div>
          </div>

          {/* Quick Authority Seal & Toggle Mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '8px 14px',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                System Hosting Status
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 800, color: '#4ade80' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
                <span>All 7 Services Online</span>
              </div>
            </div>

            {!isAuthorizedMasterAdmin && (
              <button
                onClick={handleAuthorizeMasterAdmin}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                }}
              >
                <Lock size={15} />
                <span>Unlock Master Authority (Vedant Chavan)</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Website Broadcast Strip */}
        <div style={{
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '850px' }}>
            <span style={{
              background: '#f59e0b',
              color: '#0f172a',
              fontSize: '0.68rem',
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Radio size={12} /> LIVE BROADCAST
            </span>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.4 }}>
              {activeBroadcast}
            </p>
          </div>

          <form onSubmit={handlePublishBroadcast} style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '400px', minWidth: '260px' }}>
            <input 
              type="text"
              placeholder="Type new platform announcement..."
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!broadcastMsg.trim()}
              style={{
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: broadcastMsg.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Send size={12} />
              <span>Broadcast</span>
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MASTER NAVIGATION TABS (ALL 7 DIMENSIONS)                              */}
      {/* ========================================================================= */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        padding: '6px',
        marginBottom: '24px',
        display: 'flex',
        overflowX: 'auto',
        gap: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
      }}>
        {[
          { id: 'command', label: '🌐 Website Hosting & Master Control', icon: Server },
          { id: 'users', label: `👥 Platform Users & Registry (${(registeredUsers || []).length})`, icon: Users },
          { id: 'lots', label: `🌾 All Farmer Lots (${(lots || []).length})`, icon: Sprout },
          { id: 'offers', label: `🏷️ All Buyer Offers (${(offers || []).length})`, icon: Tag },
          { id: 'farmers', label: `🚜 Farmers & FPOs (${farmersList.length})`, icon: Sprout },
          { id: 'buyers', label: `🏢 Institutional Buyers (${buyersList.length})`, icon: Building2 },
          { id: 'transport', label: `🚚 Fleet & Cold Storage (${displayVehicles.length})`, icon: Truck },
          { id: 'orders', label: `📦 Orders & Contracts (${orders.length})`, icon: Package },
          { id: 'grievances', label: `⚖️ Disputes & Arbitration (${openGrievances.length})`, icon: AlertTriangle },
          { id: 'feed', label: '📜 Live Website Audit Trail', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0f172a' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} color={isActive ? '#38bdf8' : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. MASTER SYSTEM KPIS (TOP-LEVEL FINANCIAL & VOLUME PULSE)                */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #16a34a', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Gross Platform Volume</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '3px 0' }}>₹4.82 Cr</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>+21.4% vs APMC Middleman Deductions</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #0284c7', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Escrow Clearing Vault</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '3px 0' }}>₹2.18 Cr</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>100% Solvent • In Active Transit</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #d97706', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>Total Registered Farmers</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '3px 0' }}>1,248</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Across 14 Maharashtra Districts</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #9333ea', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#9333ea', textTransform: 'uppercase' }}>Institutional Buyers</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '3px 0' }}>420</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>100% GSTIN & FSSAI Screened</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #ea580c', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase' }}>Active Carrier Fleet</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '3px 0' }}>286</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>45 Cold Warehouses Linked</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WEBSITE HOSTING & MASTER CONTROL CENTER                           */}
      {/* ========================================================================= */}
      {adminTab === 'command' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Microservices & Infrastructure Grid */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Live Microservices & Platform Host Infrastructure
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Real-time telemetry of compute nodes, ML prediction models, escrow clearance, and SMS gateways.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={() => setIsCloudSyncModalOpen(true)}
                  style={{
                    background: '#047857',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(4, 120, 87, 0.25)'
                  }}
                >
                  <Cloud size={14} color="#86efac" />
                  <span>Netlify & Cloud Sync Control</span>
                </button>
                <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700 }}>
                  Server Uptime: {systemMetrics.serverUptime}
                </span>
                <span style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '4px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700 }}>
                  Global Latency: {systemMetrics.apiLatency}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {[
                { title: 'Netlify Cloud Multi-Device Sync', node: 'Netlify Blobs + Realtime Cloud', status: '🟢 Active & Synced', latency: '14ms', load: '0ms SSE' },
                { title: 'Frontend Web Portal', node: 'React 19 + Vite HMR', status: '🟢 Operational', latency: '28ms', load: '14% CPU' },
                { title: 'AI Price Forecasting (LSTM)', node: 'AgriPredict™ Multi-Variable', status: '🟢 Operational', latency: '44ms', load: '32% GPU' },
                { title: 'Quality Scanner (Vision)', node: 'YOLOv8 + AGMARKNET Engine', status: '🟢 Operational', latency: '65ms', load: '41% GPU' },
                { title: 'Escrow Clearing Smart Vault', node: 'Cryptographic Ledger Node', status: '🟢 Solvent & Verified', latency: '18ms', load: '9% CPU' },
                { title: 'Cellular SMS Gateway', node: 'Fast2SMS Indian Operator Rail', status: '🟢 Active & Ready', latency: '120ms', load: '12% API' },
                { title: 'GIS Fleet & Logistics Tracker', node: 'OSRM / State Route Corridors', status: '🟢 Tracking Active', latency: '35ms', load: '19% CPU' }
              ].map((srv, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{srv.title}</strong>
                    <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700 }}>{srv.status}</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '8px' }}>{srv.node}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                    <span>Latency: <strong>{srv.latency}</strong></span>
                    <span>Load: <strong>{srv.load}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commodity Trade Distribution & Heatmap */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                Commodity Volume Share across Mandis
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: "Onion (कांदा)", volumeMT: 4800, share: 38, color: "#16a34a", hub: "Lasalgaon / Pimpalgaon" },
                  { name: "Soybean (सोयाबीन)", volumeMT: 3200, share: 25, color: "#2563eb", hub: "Latur / Ahmednagar" },
                  { name: "Tomato (टोमॅटो)", volumeMT: 2100, share: 17, color: "#dc2626", hub: "Narayangaon / Junnar" },
                  { name: "Pomegranate (डाळिंब)", volumeMT: 1400, share: 11, color: "#d97706", hub: "Solapur / Sangli" },
                  { name: "Cotton (कापूस)", volumeMT: 1100, share: 9, color: "#9333ea", hub: "Jalgaon / Vidarbha" }
                ].map((crop, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{crop.name} <small style={{ color: '#64748b' }}>({crop.hub})</small></span>
                      <strong>{crop.volumeMT} MT ({crop.share}%)</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${crop.share}%`, height: '100%', background: crop.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                District Procurement Hubs & Active Corridors
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { district: "Pune District", lots: "340 Lots", volume: "1,250 MT", topBuyer: "Sahyadri Mega Food Park", rate: "₹28.00/KG" },
                  { district: "Nashik District", lots: "420 Lots", volume: "1,820 MT", topBuyer: "ITC Agri-Business", rate: "₹25.50/KG" },
                  { district: "Ahmednagar District", lots: "210 Lots", volume: "890 MT", topBuyer: "Reliance Fresh Agro", rate: "₹48.00/KG" },
                  { district: "Solapur District", lots: "150 Lots", volume: "620 MT", topBuyer: "Mother Dairy Fruit Hub", rate: "₹110.00/KG" },
                  { district: "Nagpur District", lots: "128 Lots", volume: "580 MT", topBuyer: "Vidarbha Agro Exports", rate: "₹72.00/KG" }
                ].map((dist, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem' }}>
                    <div>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{dist.district}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{dist.lots} • {dist.volume}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#15803d', fontWeight: 700, display: 'block' }}>{dist.topBuyer}</span>
                      <span style={{ fontSize: '0.74rem', color: '#475569' }}>Avg: {dist.rate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Master Purge & Database Control */}
          <div style={{ background: '#ffffff', border: '2px solid #fecaca', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#991b1b' }}>
                    🚨 Platform Master Purge & Database Controls
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Irreversible administrative wipe controls. As Super Admin, you can selectively purge lots, bids, orders, vehicles, or trigger a total database reset.
                  </p>
                </div>
              </div>
              <span style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                ⚠️ ROOT ADMIN PRIVILEGES
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '14px' }}>
              {/* Purge Lots */}
              <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#9a3412', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <span>🌾</span> Purge Crop Lots
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.76rem', color: '#7c2d12', lineHeight: 1.4 }}>
                    Deletes all {lots.length} active farmer crop listings & bids.
                  </p>
                </div>
                <button
                  onClick={() => setPurgeTarget('lots')}
                  style={{
                    background: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={13} />
                  <span>Purge Lots ({lots.length})</span>
                </button>
              </div>

              {/* Purge Offers */}
              <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#854d0e', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <span>🏷️</span> Purge Buyer Offers
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.76rem', color: '#713f12', lineHeight: 1.4 }}>
                    Deletes all {offers.length} buyer bids across the platform.
                  </p>
                </div>
                <button
                  onClick={() => setPurgeTarget('offers')}
                  style={{
                    background: '#ca8a04',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={13} />
                  <span>Purge Offers ({offers.length})</span>
                </button>
              </div>

              {/* Purge Orders */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#166534', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <span>📦</span> Purge Orders
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.76rem', color: '#14532d', lineHeight: 1.4 }}>
                    Deletes all {orders.length} trade order contracts.
                  </p>
                </div>
                <button
                  onClick={() => setPurgeTarget('orders')}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={13} />
                  <span>Purge Orders ({orders.length})</span>
                </button>
              </div>

              {/* Purge Vehicles */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#1e40af', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <span>🚚</span> Purge Carrier Fleet
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.76rem', color: '#1e3a8a', lineHeight: 1.4 }}>
                    Deletes all {displayVehicles.length} logistics vehicles.
                  </p>
                </div>
                <button
                  onClick={() => setPurgeTarget('vehicles')}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={13} />
                  <span>Purge Fleet ({displayVehicles.length})</span>
                </button>
              </div>

              {/* Total Wipeout */}
              <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, color: '#991b1b', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <span>💥</span> TOTAL PLATFORM PURGE
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.76rem', color: '#7f1d1d', lineHeight: 1.4 }}>
                    Nukes all lots, bids, orders, carrier vehicles, & logs.
                  </p>
                </div>
                <button
                  onClick={() => setPurgeTarget('all')}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)'
                  }}
                >
                  <AlertTriangle size={13} />
                  <span>TOTAL RESET PURGE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: ALL PLATFORM USERS & REGISTRY (Track all users on the website)       */}
      {/* ========================================================================= */}
      {adminTab === 'users' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                All Platform Users Directory & Stakeholder Registry
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Real-time tracking of all accounts registered across the website: Farmers, Institutional Buyers, Transporters, and Administrators.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: '#f8fafc', color: '#0f172a', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, border: '1px solid #cbd5e1' }}>
                Total Accounts: {(registeredUsers || []).length}
              </span>
            </div>
          </div>

          {/* Quick Filter Buttons & Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Stakeholders' },
                { id: 'farmer', label: '👨‍🌾 Farmers / FPOs' },
                { id: 'buyer', label: '🏢 Corporate Buyers' },
                { id: 'transporter', label: '🚚 Logistics Partners' },
                { id: 'admin', label: '👑 Administrators' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setUserRoleFilter(f.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: userRoleFilter === f.id ? '1px solid #0f172a' : '1px solid #cbd5e1',
                    background: userRoleFilter === f.id ? '#0f172a' : '#ffffff',
                    color: userRoleFilter === f.id ? '#ffffff' : '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', width: '280px' }}>
              <Search size={14} color="#64748b" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search user by name, phone, email..."
                value={userSearchText}
                onChange={(e) => setUserSearchText(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', width: '100%' }}
              />
            </div>
          </div>

          {/* Users Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>User ID</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>User Profile</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Role / Category</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Organization / Department</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Contact Mobile</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Email Address</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Location</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Account Status</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {(registeredUsers || [])
                  .filter(u => userRoleFilter === 'all' || u.role === userRoleFilter)
                  .filter(u => {
                    if (!userSearchText.trim()) return true;
                    const q = userSearchText.toLowerCase();
                    return (
                      (u.name && u.name.toLowerCase().includes(q)) ||
                      (u.phone && u.phone.toLowerCase().includes(q)) ||
                      (u.email && u.email.toLowerCase().includes(q)) ||
                      (u.organization && u.organization.toLowerCase().includes(q)) ||
                      (u.location && u.location.toLowerCase().includes(q)) ||
                      (u.id && u.id.toLowerCase().includes(q))
                    );
                  })
                  .map(user => {
                    const roleColor = 
                      user.role === 'farmer' ? '#15803d' :
                      user.role === 'buyer' ? '#0369a1' :
                      user.role === 'transporter' ? '#b45309' : '#dc2626';
                    const roleBg = 
                      user.role === 'farmer' ? '#dcfce7' :
                      user.role === 'buyer' ? '#e0f2fe' :
                      user.role === 'transporter' ? '#fef3c7' : '#fee2e2';

                    return (
                      <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', background: user.isFrozen ? '#fff1f2' : 'transparent' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#64748b', fontSize: '0.78rem' }}>
                          {user.id}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{user.avatar || '👤'}</span>
                            <div>
                              <strong style={{ color: '#0f172a', display: 'block' }}>{user.name}</strong>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                {user.isSuperAdmin ? 'Super Administrator' : 'Platform User'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            background: roleBg,
                            color: roleColor,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            textTransform: 'uppercase'
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>
                          {user.organization || user.department || 'Direct Individual'}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.8rem' }}>
                          {user.phone || '—'}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.8rem' }}>
                          {user.email || '—'}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.78rem' }}>
                          {user.location || user.city || 'Maharashtra'}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span style={{
                            background: user.isFrozen ? '#fee2e2' : '#dcfce7',
                            color: user.isFrozen ? '#991b1b' : '#166534',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {user.isFrozen ? <Ban size={12} /> : <CheckCircle2 size={12} />}
                            {user.isFrozen ? 'Suspended / Stopped' : 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          {user.isSuperAdmin || user.role === 'admin' ? (
                            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>Root Admin</span>
                          ) : (
                            <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                              <button
                                onClick={() => {
                                  setUserToToggle(user);
                                  setActionReason(user.isFrozen ? 'Account restored by administrator' : 'Suspended for regulatory compliance review');
                                }}
                                style={{
                                  background: user.isFrozen ? '#16a34a' : '#fee2e2',
                                  color: user.isFrozen ? '#ffffff' : '#b91c1c',
                                  border: user.isFrozen ? 'none' : '1px solid #fca5a5',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontWeight: 800,
                                  fontSize: '0.74rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title={user.isFrozen ? 'Activate user account' : 'Stop / suspend user'}
                              >
                                {user.isFrozen ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                                <span>{user.isFrozen ? 'Activate' : 'Stop'}</span>
                              </button>
                              <button
                                onClick={() => {
                                  setUserToDelete(user);
                                  setActionReason('Account permanently expunged by administrator');
                                }}
                                style={{
                                  background: '#fef2f2',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontWeight: 800,
                                  fontSize: '0.74rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Permanently delete user record"
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: ALL FARMER LOTS & MARKETPLACE INVENTORY (ADMIN DELETE CONTROL)       */}
      {/* ========================================================================= */}
      {adminTab === 'lots' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sprout color="#16a34a" size={22} />
                All Farmer Crop Lots & Marketplace Inventory (Admin Delete Authority)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Full supervisory control across all harvest listings on the marketplace. Administrator can inspect details and permanently delete any non-compliant, expired, or disputed lot.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800 }}>
                Total Active Lots: {(lots || []).length}
              </span>
            </div>
          </div>

          {/* Lot Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', width: '320px' }}>
              <Search size={15} color="#64748b" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search lots by crop, farmer, variety, district..."
                value={lotSearchQuery}
                onChange={(e) => setLotSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', width: '100%' }}
              />
            </div>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Showing {(lots || []).filter(l => {
                if (!lotSearchQuery.trim()) return true;
                const q = lotSearchQuery.toLowerCase();
                return (
                  l.id?.toLowerCase().includes(q) ||
                  l.crop?.toLowerCase().includes(q) ||
                  l.farmerName?.toLowerCase().includes(q) ||
                  l.district?.toLowerCase().includes(q) ||
                  l.variety?.toLowerCase().includes(q)
                );
              }).length} of {(lots || []).length} crop lots
            </span>
          </div>

          {/* Lots Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Lot ID & Image</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Crop & Variety</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Farmer / FPO</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Location / Cluster</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Quantity & Grade</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Expected Rate</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Est. Total Value</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Status</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {(lots || []).length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      No crop lots listed on the marketplace.
                    </td>
                  </tr>
                ) : (
                  (lots || [])
                    .filter(l => {
                      if (!lotSearchQuery.trim()) return true;
                      const q = lotSearchQuery.toLowerCase();
                      return (
                        l.id?.toLowerCase().includes(q) ||
                        l.crop?.toLowerCase().includes(q) ||
                        l.farmerName?.toLowerCase().includes(q) ||
                        l.district?.toLowerCase().includes(q) ||
                        l.variety?.toLowerCase().includes(q)
                      );
                    })
                    .map(lot => {
                      const estValue = Number(lot.expectedPrice || 0) * Number(lot.quantity || 0);

                      return (
                        <tr key={lot.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={lot.image || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&auto=format&fit=crop&q=80'}
                                alt={lot.crop}
                                style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                              />
                              <div>
                                <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.82rem' }}>{lot.id}</strong>
                                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{lot.harvestDate || 'Fresh'}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                              <strong style={{ color: '#0f172a', display: 'block' }}>{lot.crop}</strong>
                              <span style={{
                                background: lot.category === 'Fruit' ? '#fff7ed' : lot.category === 'Crop' ? '#fffbeb' : '#f0fdf4',
                                color: lot.category === 'Fruit' ? '#c2410c' : lot.category === 'Crop' ? '#b45309' : '#15803d',
                                border: `1px solid ${lot.category === 'Fruit' ? '#fed7aa' : lot.category === 'Crop' ? '#fde68a' : '#bbf7d0'}`,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontSize: '0.68rem',
                                fontWeight: 800
                              }}>
                                {lot.category === 'Fruit' ? '🍎 Fruit' : lot.category === 'Crop' ? '🌾 Crop' : '🥦 Vegetable'}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{lot.variety || 'Standard Hybrid'}</span>
                            <span style={{ fontSize: '0.7rem', color: '#0284c7', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                              📷 {lot.images?.length || 4} AI Photos
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <strong style={{ color: '#0f172a', display: 'block' }}>{lot.farmerName}</strong>
                            <span style={{ fontSize: '0.74rem', color: '#15803d' }}>{lot.farmerFpo || lot.farmerPhone || 'Verified Farmer'}</span>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.8rem' }}>
                            {lot.location || lot.district || 'Maharashtra'}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>
                              {Number(lot.quantity || 0).toLocaleString()} {lot.unit || 'KG'}
                            </span>
                            <span style={{
                              background: '#dcfce7',
                              color: '#15803d',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 800
                            }}>
                              Grade {lot.grade || 'A'} • {lot.qualityScore || 90}/100
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                            ₹{lot.expectedPrice}/{lot.unit || 'KG'}
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#15803d' }}>
                            ₹{estValue.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              background: lot.status === 'Open' ? '#e0f2fe' : lot.status === 'Offers Received' ? '#fef3c7' : '#dcfce7',
                              color: lot.status === 'Open' ? '#0369a1' : lot.status === 'Offers Received' ? '#b45309' : '#15803d',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {lot.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <button
                              onClick={() => {
                                setLotToDelete(lot);
                                setActionReason('Administrative removal per platform quality and regulatory standards');
                              }}
                              style={{
                                background: '#fee2e2',
                                color: '#b91c1c',
                                border: '1px solid #fca5a5',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontWeight: 800,
                                fontSize: '0.74rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.15s ease'
                              }}
                              title="Permanently delete this farmer lot"
                            >
                              <Trash2 size={13} />
                              <span>Delete Lot</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: ALL BUYER OFFERS & PURCHASE BIDS (ADMIN DELETE CONTROL)              */}
      {/* ========================================================================= */}
      {adminTab === 'offers' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag color="#d97706" size={22} />
                All Institutional Buyer Offers & Purchase Bids (Admin Delete Authority)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Supervisory oversight of all purchase bids submitted by corporate buyers. Administrator can delete or cancel any predatory, invalid, or non-compliant bids.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800 }}>
                Total Active Offers: {(offers || []).length}
              </span>
            </div>
          </div>

          {/* Offer Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', width: '320px' }}>
              <Search size={15} color="#64748b" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search offers by buyer, crop, lot ID..."
                value={offerSearchQuery}
                onChange={(e) => setOfferSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', width: '100%' }}
              />
            </div>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Showing {(offers || []).filter(o => {
                if (!offerSearchQuery.trim()) return true;
                const q = offerSearchQuery.toLowerCase();
                return (
                  o.id?.toLowerCase().includes(q) ||
                  o.lotId?.toLowerCase().includes(q) ||
                  o.buyerName?.toLowerCase().includes(q) ||
                  o.crop?.toLowerCase().includes(q)
                );
              }).length} of {(offers || []).length} offers
            </span>
          </div>

          {/* Offers Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Offer ID</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Target Lot & Crop</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Institutional Buyer</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Offered Rate</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Quantity Requested</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Total Deal Value</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Pickup Date</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Status</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {(offers || []).length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      No buyer offers submitted yet.
                    </td>
                  </tr>
                ) : (
                  (offers || [])
                    .filter(o => {
                      if (!offerSearchQuery.trim()) return true;
                      const q = offerSearchQuery.toLowerCase();
                      return (
                        o.id?.toLowerCase().includes(q) ||
                        o.lotId?.toLowerCase().includes(q) ||
                        o.buyerName?.toLowerCase().includes(q) ||
                        o.crop?.toLowerCase().includes(q)
                      );
                    })
                    .map(offer => {
                      return (
                        <tr key={offer.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                            {offer.id}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <strong style={{ color: '#0f172a', display: 'block' }}>{offer.crop || 'Produce'}</strong>
                            <span style={{ fontSize: '0.74rem', color: '#0284c7' }}>Lot #{offer.lotId}</span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <strong style={{ color: '#0f172a', display: 'block' }}>{offer.buyerName}</strong>
                            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{offer.buyerPhone || 'Institutional Buyer'}</span>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#15803d', fontSize: '0.92rem' }}>
                            ₹{offer.offeredRate}/KG
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                            {Number(offer.quantityRequested || 0).toLocaleString()} KG
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                            ₹{(offer.totalOfferedAmount || (offer.offeredRate * (offer.quantityRequested || 1000))).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.78rem' }}>
                            {offer.pickupDate || 'Flexible Pickup'}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              background: offer.status === 'Accepted' ? '#dcfce7' : offer.status === 'Countered' ? '#e0f2fe' : offer.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                              color: offer.status === 'Accepted' ? '#15803d' : offer.status === 'Countered' ? '#0369a1' : offer.status === 'Rejected' ? '#991b1b' : '#b45309',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {offer.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <button
                              onClick={() => {
                                setOfferToDelete(offer);
                                setActionReason('Non-compliant pricing or administrative cancellation');
                              }}
                              style={{
                                background: '#fee2e2',
                                color: '#b91c1c',
                                border: '1px solid #fca5a5',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontWeight: 800,
                                fontSize: '0.74rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.15s ease'
                              }}
                              title="Permanently delete this buyer offer"
                            >
                              <Trash2 size={13} />
                              <span>Delete Offer</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FARMERS & FPOS ECOSYSTEM ANALYSIS                                 */}
      {/* ========================================================================= */}
      {adminTab === 'farmers' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Farmer Producer Organizations (FPO) & Cultivator Registry
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Complete oversight of registered farmers, listed harvest volumes, optical quality score distribution, and 7/12 land record verifications.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: '#f0fdf4', color: '#15803d', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #bbf7d0' }}>
                Total Produce Listed: 107.7 MT
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Farmer ID</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Farmer & FPO</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>District / Cluster</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Crops Listed</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Total MT Sold</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Earnings Realized</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Avg AI Grade</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Verification</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {farmersList.map(farmer => {
                  const matchedUser = (registeredUsers || []).find(u => u.id === farmer.id || u.phone === farmer.phone);
                  const isFarmerFrozen = matchedUser ? Boolean(matchedUser.isFrozen) : Boolean(farmer.isFrozen);

                  return (
                    <tr key={farmer.id} style={{ borderBottom: '1px solid #f1f5f9', background: isFarmerFrozen ? '#fff1f2' : 'transparent' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#64748b' }}>{farmer.id}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <strong style={{ color: '#0f172a', display: 'block' }}>{farmer.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>{farmer.fpo}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>{farmer.district}</td>
                      <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>{farmer.crops}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{farmer.volumeMT} MT</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#15803d' }}>₹{farmer.revenueRealized.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          background: farmer.avgQualityScore >= 90 ? '#dcfce7' : '#fef3c7',
                          color: farmer.avgQualityScore >= 90 ? '#15803d' : '#b45309',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.76rem'
                        }}>
                          {farmer.avgQualityScore}/100 (Grade A)
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          background: isFarmerFrozen ? '#fee2e2' : farmer.isVerified ? '#dcfce7' : '#fef3c7',
                          color: isFarmerFrozen ? '#991b1b' : farmer.isVerified ? '#166534' : '#b45309',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {isFarmerFrozen ? <Ban size={12} /> : farmer.isVerified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          {isFarmerFrozen ? 'Account Stopped' : farmer.isVerified ? 'MahaAgri Verified' : 'Pending Review'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleToggleFarmerVerification(farmer.id)}
                            style={{
                              background: farmer.isVerified ? '#f8fafc' : '#16a34a',
                              color: farmer.isVerified ? '#475569' : '#ffffff',
                              border: farmer.isVerified ? '1px solid #cbd5e1' : 'none',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.74rem',
                              cursor: 'pointer'
                            }}
                          >
                            {farmer.isVerified ? 'Revoke Seal' : 'Grant Seal'}
                          </button>
                          <button
                            onClick={() => handleToggleFarmerStop(farmer)}
                            style={{
                              background: isFarmerFrozen ? '#16a34a' : '#fee2e2',
                              color: isFarmerFrozen ? '#ffffff' : '#b91c1c',
                              border: isFarmerFrozen ? 'none' : '1px solid #fca5a5',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontWeight: 800,
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isFarmerFrozen ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                            <span>{isFarmerFrozen ? 'Activate' : 'Stop Farmer'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setAdminTab('lots');
                              setLotSearchQuery(farmer.name);
                            }}
                            style={{
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              border: '1px solid #bfdbfe',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.74rem',
                              cursor: 'pointer'
                            }}
                            title="View and delete lots by this farmer"
                          >
                            🌾 Lots
                          </button>
                          <button
                            onClick={() => {
                              setUserToDelete({ id: farmer.id, name: farmer.name, phone: farmer.phone, role: 'farmer' });
                              setActionReason('Farmer account permanently deleted by administrator');
                            }}
                            style={{
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fecaca',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Permanently delete farmer account"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INSTITUTIONAL BUYERS NETWORK ANALYSIS                             */}
      {/* ========================================================================= */}
      {adminTab === 'buyers' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Institutional Buyer Network & Enterprise KYC Registry
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Audit procurement spend, corporate escrow deposit solvency, FSSAI licenses, and account standing.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #bae6fd' }}>
                Total Enterprise Capital: ₹2.47 Cr Deployed
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Buyer Entity</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Business Category</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Hub Location</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Total Sourced</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Total Spend</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Escrow Reliability</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>GSTIN & FSSAI</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Account Control</th>
                </tr>
              </thead>
              <tbody>
                {buyersList.map(buyer => (
                  <tr key={buyer.id} style={{ borderBottom: '1px solid #f1f5f9', background: buyer.isFrozen ? '#fff1f2' : 'transparent' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{buyer.name}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Contact: {buyer.contactPerson} ({buyer.phone})</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#0369a1', fontWeight: 600 }}>{buyer.type}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{buyer.location}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{buyer.totalProcuredMT} MT</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#15803d' }}>₹{buyer.totalSpend.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>
                        ⭐ {buyer.escrowReliability}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem' }}>
                      <div style={{ color: '#334155' }}>GST: <code>{buyer.gstin}</code></div>
                      <div style={{ color: '#64748b' }}>FSSAI: <code>{buyer.fssai}</code></div>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleToggleBuyerFreeze(buyer.id)}
                          style={{
                            background: buyer.isFrozen ? '#16a34a' : '#fee2e2',
                            color: buyer.isFrozen ? '#ffffff' : '#b91c1c',
                            border: buyer.isFrozen ? 'none' : '1px solid #fca5a5',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontWeight: 800,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {buyer.isFrozen ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                          <span>{buyer.isFrozen ? 'Activate' : 'Freeze / Stop'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setAdminTab('offers');
                            setOfferSearchQuery(buyer.name);
                          }}
                          style={{
                            background: '#fef3c7',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            cursor: 'pointer'
                          }}
                          title="View and delete bids by this buyer"
                        >
                          🏷️ Bids
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete({ id: buyer.id, name: buyer.name, phone: buyer.phone, role: 'buyer' });
                            setActionReason('Buyer enterprise account permanently deleted by administrator');
                          }}
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Permanently delete buyer account"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FLEET LOGISTICS & COLD STORAGE NETWORK                            */}
      {/* ========================================================================= */}
      {adminTab === 'transport' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Active Freight Fleet & Cold Storage Network Tracking
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Real-time tracking of carrier trucks, refrigerated reefer vans, farm-gate pickup routes, and transit telematics.
              </p>
            </div>

            <span style={{ background: '#fffbeb', color: '#b45309', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid #fde68a' }}>
              Active Highway Corridors: 4 Active Routes
            </span>
          </div>

          {/* Vehicle Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', width: '320px' }}>
              <Search size={15} color="#64748b" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search fleet by reg number, driver, agency..."
                value={vehicleSearchQuery}
                onChange={(e) => setVehicleSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', width: '100%' }}
              />
            </div>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Showing {displayVehicles.filter(v => {
                if (!vehicleSearchQuery.trim()) return true;
                const q = vehicleSearchQuery.toLowerCase();
                const regNo = (v.vehicleRegNumber || v.vehicleNo || '').toLowerCase();
                const agency = (v.providerName || v.agency || '').toLowerCase();
                const driver = (v.driverName || '').toLowerCase();
                const vType = (v.vehicleType || v.type || '').toLowerCase();
                return regNo.includes(q) || agency.includes(q) || driver.includes(q) || vType.includes(q);
              }).length} of {displayVehicles.length} fleet vehicles
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {displayVehicles
              .filter(v => {
                if (!vehicleSearchQuery.trim()) return true;
                const q = vehicleSearchQuery.toLowerCase();
                const regNo = (v.vehicleRegNumber || v.vehicleNo || '').toLowerCase();
                const agency = (v.providerName || v.agency || '').toLowerCase();
                const driver = (v.driverName || '').toLowerCase();
                const vType = (v.vehicleType || v.type || '').toLowerCase();
                return regNo.includes(q) || agency.includes(q) || driver.includes(q) || vType.includes(q);
              })
              .map(vehicle => {
                const regNo = vehicle.vehicleRegNumber || vehicle.vehicleNo || vehicle.id;
                const vType = vehicle.vehicleType || vehicle.type || 'Carrier Vehicle';
                const agency = vehicle.providerName || vehicle.agency || 'Kisan Logistics';
                const driver = vehicle.driverName || 'Fleet Driver';
                const phone = vehicle.driverPhone || vehicle.phone || '+91 94223 90812';
                const status = vehicle.status || 'Ready for Dispatch';
                const location = vehicle.currentLocation || 'State Highway Hub';
                const capacity = vehicle.capacityKg ? `${vehicle.capacityKg} KG` : (vehicle.capacity || '2.5 MT');
                
                // Check if transporter / driver is frozen
                const transporterUser = (registeredUsers || []).find(u => 
                  (u.phone && phone && u.phone.includes(phone.slice(-10))) ||
                  (u.organization && u.organization.toLowerCase() === agency.toLowerCase()) ||
                  (u.name && u.name.toLowerCase() === driver.toLowerCase())
                );
                const isTransporterFrozen = transporterUser ? Boolean(transporterUser.isFrozen) : false;

                return (
                  <div key={vehicle.id || regNo} style={{ border: isTransporterFrozen ? '1.5px solid #fca5a5' : '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: isTransporterFrozen ? '#fff1f2' : '#f8fafc', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ background: '#0f172a', color: '#ffffff', padding: '4px 9px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 800, fontFamily: 'monospace' }}>
                        {regNo}
                      </span>
                      <span style={{
                        background: status.includes('In Transit') ? '#dcfce7' : status.includes('Confirmed') ? '#fef3c7' : '#e0f2fe',
                        color: status.includes('In Transit') ? '#15803d' : status.includes('Confirmed') ? '#b45309' : '#0369a1',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                      {vType}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '10px' }}>
                      Carrier: <strong>{agency}</strong> • Driver: {driver} ({phone})
                    </div>

                    <div style={{ background: '#ffffff', borderRadius: '8px', padding: '10px', border: '1px solid #e2e8f0', fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Capacity:</span>
                        <strong style={{ color: '#1e293b' }}>{capacity}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Current Location:</span>
                        <strong style={{ color: '#1e293b' }}>{location}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Speed & Telemetry:</span>
                        <strong style={{ color: '#16a34a' }}>{vehicle.speed || 'GPS Active'} ({vehicle.gpsStatus || 'Active Telemetry'})</strong>
                      </div>
                      {vehicle.temp && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Cargo Temp:</span>
                          <strong style={{ color: '#0284c7' }}>{vehicle.temp}</strong>
                        </div>
                      )}
                    </div>

                    {/* Admin Actions on Vehicle & Transporter */}
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                      <button
                        onClick={() => {
                          setVehicleToDelete(vehicle);
                          setActionReason('Carrier vehicle de-listed per administrative inspection');
                        }}
                        style={{
                          flex: 1,
                          background: '#fee2e2',
                          color: '#b91c1c',
                          border: '1px solid #fca5a5',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                        title="Delete vehicle from platform fleet"
                      >
                        <Trash2 size={13} />
                        <span>Delete Vehicle</span>
                      </button>

                      <button
                        onClick={() => {
                          const userObj = transporterUser || {
                            id: vehicle.id || regNo,
                            name: driver || agency,
                            role: 'transporter',
                            organization: agency,
                            phone: phone,
                            isFrozen: false
                          };
                          setUserToToggle(userObj);
                          setActionReason(isTransporterFrozen ? 'Transporter logistics authorization restored' : 'Transporter suspended per administrative notice');
                        }}
                        style={{
                          flex: 1,
                          background: isTransporterFrozen ? '#16a34a' : '#fff1f2',
                          color: isTransporterFrozen ? '#ffffff' : '#be123c',
                          border: isTransporterFrozen ? 'none' : '1px solid #fecdd3',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        {isTransporterFrozen ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                        <span>{isTransporterFrozen ? 'Activate' : 'Stop Carrier'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Cold Storage Facility Tracker */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
              Linked Cold Storage & Controlled Atmosphere Warehouses (MahaAgri Audited)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {[
                { name: "Sahyadri Chakan Cold Hub", capacity: "2,000 MT", occupancy: "68%", temp: "2°C - 4°C", crop: "Onion, Potato" },
                { name: "Lasalgaon Multi-Chamber Storage", capacity: "3,500 MT", occupancy: "82%", temp: "1°C - 3°C", crop: "Garwa Onion" },
                { name: "Narayangaon Cold Aggregation Point", capacity: "1,200 MT", occupancy: "45%", temp: "4°C - 8°C", crop: "Tomato, Fruits" },
                { name: "Solapur Fruit Chill Center", capacity: "1,500 MT", occupancy: "60%", temp: "-0.5°C - 2°C", crop: "Pomegranate" }
              ].map((cs, i) => (
                <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block', marginBottom: '2px' }}>{cs.name}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '6px' }}>Suitable for: {cs.crop}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                    <span>Occupancy: <strong>{cs.occupancy}</strong> of {cs.capacity}</span>
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>{cs.temp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ORDERS & ESCROW FINANCIAL CLEARING                                 */}
      {/* ========================================================================= */}
      {adminTab === 'orders' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Platform Order Management & Escrow Oversight
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Real-time tracking of institutional purchase contracts, delivery statuses, and cancellation controls.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by Order ID, Crop, Farmer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button
                onClick={() => setPurgeTarget('orders')}
                style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
                title="Purge all platform orders"
              >
                <Trash2 size={14} />
                <span>Purge All ({orders.length})</span>
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Order ID</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Farmer / FPO</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Institutional Buyer</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Commodity</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Total Value</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Payment Status</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569' }}>Order Status</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      No orders found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const isCancelled = order.status === 'Cancelled';
                    const isDelivered = order.status === 'Delivered';

                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', background: isCancelled ? '#fff1f2' : 'transparent' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>{order.id}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <strong style={{ color: '#0f172a', display: 'block' }}>{order.farmerName}</strong>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{order.farmerPhone || 'Verified Kisan'}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <strong style={{ color: '#0f172a', display: 'block' }}>{order.buyerName}</strong>
                          <span style={{ fontSize: '0.74rem', color: '#0284c7' }}>Escrow Guaranteed</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{order.crop}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                            {order.quantity} {order.unit} (Grade {order.grade})
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#15803d' }}>
                          ₹{order.totalAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            background: order.paymentStatus === 'Paid' ? '#dcfce7' : '#fef3c7',
                            color: order.paymentStatus === 'Paid' ? '#15803d' : '#b45309',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 700
                          }}>
                            {order.paymentStatus || 'Escrow Locked'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            background: isCancelled ? '#fee2e2' : isDelivered ? '#dcfce7' : '#e0f2fe',
                            color: isCancelled ? '#991b1b' : isDelivered ? '#166534' : '#0369a1',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.74rem',
                            fontWeight: 700
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button
                              onClick={() => setSelectedOrderForTimeline(order)}
                              style={{
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                color: '#334155'
                              }}
                            >
                              Timeline
                            </button>
                            {!isCancelled && !isDelivered && (
                              <button
                                onClick={() => handleOpenCancelModal(order)}
                                style={{
                                  background: '#fee2e2',
                                  border: '1px solid #fca5a5',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  color: '#dc2626'
                                }}
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setOrderToDelete(order);
                                setActionReason('Contract order purged by administrator');
                              }}
                              style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                color: '#dc2626',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Permanently delete order contract"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: APMC REGULATORY DISPUTES & GRIEVANCE REDRESSAL                    */}
      {/* ========================================================================= */}
      {adminTab === 'grievances' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                APMC Dispute Tribunal & Grievance Arbitration
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Legal arbitration and fast-track dispute settlement under Maharashtra Agricultural Produce Marketing (Regulation) Act.
              </p>
            </div>

            <span style={{
              background: openGrievances.length > 0 ? '#fee2e2' : '#f0fdf4',
              color: openGrievances.length > 0 ? '#dc2626' : '#15803d',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              border: openGrievances.length > 0 ? '1px solid #fca5a5' : '1px solid #bbf7d0'
            }}>
              {openGrievances.length} Active Dispute Cases
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {grievances.map(ticket => {
              const isResolved = ticket.status === 'Resolved';

              return (
                <div 
                  key={ticket.id} 
                  style={{
                    border: isResolved ? '1px solid #e2e8f0' : '1.5px solid #f87171',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    background: isResolved ? '#f8fafc' : '#ffffff',
                    boxShadow: isResolved ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{ticket.id}</span>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                          Order #{ticket.orderId}
                        </span>
                        <span style={{
                          background: isResolved ? '#dcfce7' : '#fee2e2',
                          color: isResolved ? '#15803d' : '#dc2626',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: 800, color: '#1e293b' }}>
                        {ticket.issue}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {!isResolved && (
                        <button
                          onClick={() => resolveGrievance(ticket.id, 'Escrow payout verified and awarded per APMC quality standards.')}
                          style={{
                            background: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)'
                          }}
                        >
                          <CheckCircle2 size={14} />
                          <span>Arbitrate & Resolve</span>
                        </button>
                      )}
                      <button
                        onClick={() => setGrievanceToDelete(ticket)}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        title="Delete grievance dispute record"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <p style={{ margin: '0 0 10px 0', fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                    {ticket.details}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    <span>Raised by: <strong style={{ color: '#0f172a' }}>{ticket.raisedBy}</strong> ({ticket.role})</span>
                    <span>Date Filed: {ticket.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: LIVE GLOBAL AUDIT TRAIL & SYSTEM LOG                              */}
      {/* ========================================================================= */}
      {adminTab === 'feed' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Chronological Website Audit Trail & System Log
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Real-time cryptographic trail of every login, lot listing, bid, dispatch, and settlement.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.76rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                Live Telemetry Stream Active
              </span>
              <button
                onClick={() => setPurgeTarget('audit')}
                style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Wipe global activity feed"
              >
                <Trash2 size={12} />
                <span>Clear Audit Trail</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {liveActivityFeed.map(act => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.84rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: act.type === 'auth' ? '#e0f2fe' : act.type === 'offer' ? '#fef3c7' : act.type === 'order' ? '#dcfce7' : '#f1f5f9',
                  color: act.type === 'auth' ? '#0369a1' : act.type === 'offer' ? '#b45309' : act.type === 'order' ? '#15803d' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  {act.type === 'auth' ? '🔑' : act.type === 'offer' ? '🏷️' : act.type === 'order' ? '📦' : '🌾'}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{act.text}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {act.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: 10-STEP ORDER LIFECYCLE INSPECTOR                               */}
      {/* ========================================================================= */}
      {selectedOrderForTimeline && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.76rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase' }}>
                  Lifecycle Audit Trail
                </span>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  Order #{selectedOrderForTimeline.id} • {selectedOrderForTimeline.crop}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedOrderForTimeline(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.84rem' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Farmer / FPO:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{selectedOrderForTimeline.farmerName}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Institutional Buyer:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{selectedOrderForTimeline.buyerName}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Quantity & Grade:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{selectedOrderForTimeline.quantity} {selectedOrderForTimeline.unit} (Grade {selectedOrderForTimeline.grade})</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Escrow Total Amount:</span>
                <strong style={{ display: 'block', color: '#15803d' }}>₹{selectedOrderForTimeline.totalAmount?.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: '#cbd5e1' }} />
              {orderSteps.map(step => (
                <div key={step.step} style={{ position: 'relative', marginBottom: '18px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#16a34a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {step.step}
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>{step.title}</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>{step.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <button 
                onClick={() => setSelectedOrderForTimeline(null)}
                className="btn btn-secondary"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: ADMIN ORDER CANCELLATION OVERRIDE                                */}
      {/* ========================================================================= */}
      {orderToCancel && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#dc2626' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Administrative Order Cancellation Override
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
              You are cancelling <strong>Order #{orderToCancel.id}</strong> ({orderToCancel.crop} - ₹{orderToCancel.totalAmount?.toLocaleString()}). 
              As Super Administrator, cancelling will immediately unlock escrow funds and notify both parties.
            </p>

            <form onSubmit={handleConfirmCancelOrder}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Official Cancellation Reason *
                </label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="Transport unavailable due to logistical bottleneck">Transport unavailable due to logistical bottleneck</option>
                  <option value="Severe weather / transit disruption">Severe weather / transit disruption</option>
                  <option value="Mutual cancellation agreed by Farmer and Buyer">Mutual cancellation agreed by Farmer and Buyer</option>
                  <option value="Quality mismatch before loading">Quality mismatch before loading</option>
                  <option value="Administrative regulatory order by MahaAgri">Administrative regulatory order by MahaAgri</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Detailed Supervisory Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter audit notes for the official order record..."
                  value={cancellationNotes}
                  onChange={(e) => setCancellationNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.78rem', color: '#991b1b' }}>
                ⚠️ Authorized by: <strong>Vedant Chavan</strong> (Chief Platform Administrator)
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setOrderToCancel(null)}
                  className="btn btn-secondary"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Official Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: PERMANENT LOT DELETION (SUPER ADMIN OVERRIDE)                   */}
      {/* ========================================================================= */}
      {lotToDelete && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#dc2626' }}>
              <Trash2 size={24} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Confirm Permanent Lot Deletion
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
              You are permanently deleting <strong>Lot #{lotToDelete.id}</strong> ({lotToDelete.crop} - {lotToDelete.quantity} {lotToDelete.unit || 'KG'}) listed by <strong>{lotToDelete.farmerName}</strong>. 
              This will remove the produce from the public marketplace and cancel any pending buyer bids on this lot.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '0.8rem', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><span style={{ color: '#64748b' }}>Farmer:</span> <strong>{lotToDelete.farmerName}</strong></div>
              <div><span style={{ color: '#64748b' }}>Contact:</span> <strong>{lotToDelete.farmerPhone || 'N/A'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Variety & Grade:</span> <strong>{lotToDelete.variety || 'Standard'} (Grade {lotToDelete.grade || 'A'})</strong></div>
              <div><span style={{ color: '#64748b' }}>Expected Price:</span> <strong>₹{lotToDelete.expectedPrice}/{lotToDelete.unit || 'KG'}</strong></div>
            </div>

            <form onSubmit={handleConfirmDeleteLot}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Official Deletion Reason *
                </label>
                <select
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="Non-compliant harvest listing or quality check failure">Non-compliant harvest listing or quality check failure</option>
                  <option value="Farmer requested administrative cancellation/withdrawal">Farmer requested administrative cancellation/withdrawal</option>
                  <option value="Duplicate or fraudulent crop lot listing">Duplicate or fraudulent crop lot listing</option>
                  <option value="APMC regulatory directive / quarantine order">APMC regulatory directive / quarantine order</option>
                  <option value="Expired crop lot past viable distribution window">Expired crop lot past viable distribution window</option>
                </select>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.78rem', color: '#991b1b' }}>
                ⚠️ Authorized by: <strong>Vedant Chavan</strong> (Chief Platform Administrator)
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setLotToDelete(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Confirm Permanent Deletion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: PERMANENT BUYER OFFER DELETION (SUPER ADMIN OVERRIDE)           */}
      {/* ========================================================================= */}
      {offerToDelete && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#dc2626' }}>
              <Trash2 size={24} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Confirm Buyer Offer Deletion
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
              You are permanently deleting <strong>Offer #{offerToDelete.id}</strong> on <strong>{offerToDelete.crop || 'Produce'}</strong> (Lot #{offerToDelete.lotId}) placed by <strong>{offerToDelete.buyerName}</strong> for ₹{offerToDelete.offeredRate}/KG.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '0.8rem', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><span style={{ color: '#64748b' }}>Buyer:</span> <strong>{offerToDelete.buyerName}</strong></div>
              <div><span style={{ color: '#64748b' }}>Offered Rate:</span> <strong>₹{offerToDelete.offeredRate}/KG</strong></div>
              <div><span style={{ color: '#64748b' }}>Quantity:</span> <strong>{offerToDelete.quantityRequested} KG</strong></div>
              <div><span style={{ color: '#64748b' }}>Total Value:</span> <strong>₹{(offerToDelete.totalOfferedAmount || (offerToDelete.offeredRate * (offerToDelete.quantityRequested || 1000))).toLocaleString()}</strong></div>
            </div>

            <form onSubmit={handleConfirmDeleteOffer}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Official Deletion Reason *
                </label>
                <select
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="Predatory or non-viable below-market bid rate">Predatory or non-viable below-market bid rate</option>
                  <option value="Buyer requested bid cancellation">Buyer requested bid cancellation</option>
                  <option value="Unverified institutional buyer credentials">Unverified institutional buyer credentials</option>
                  <option value="Duplicate or erroneous purchase bid">Duplicate or erroneous purchase bid</option>
                  <option value="Regulatory administrative decision">Regulatory administrative decision</option>
                </select>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.78rem', color: '#991b1b' }}>
                ⚠️ Authorized by: <strong>Vedant Chavan</strong> (Chief Platform Administrator)
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setOfferToDelete(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Confirm Delete Offer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: PERMANENT VEHICLE DELETION (SUPER ADMIN OVERRIDE)               */}
      {/* ========================================================================= */}
      {vehicleToDelete && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#dc2626' }}>
              <Trash2 size={24} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Confirm Vehicle De-Registration
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
              You are removing vehicle <strong>{vehicleToDelete.vehicleRegNumber || vehicleToDelete.vehicleNo || vehicleToDelete.id}</strong> ({vehicleToDelete.vehicleType || vehicleToDelete.type}) from the platform carrier fleet.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '0.8rem', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><span style={{ color: '#64748b' }}>Carrier Agency:</span> <strong>{vehicleToDelete.providerName || vehicleToDelete.agency || 'Kisan Logistics'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Driver:</span> <strong>{vehicleToDelete.driverName || 'Driver'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Capacity:</span> <strong>{vehicleToDelete.capacityKg || vehicleToDelete.capacity || 'Standard'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Current Status:</span> <strong>{vehicleToDelete.status || 'Active'}</strong></div>
            </div>

            <form onSubmit={handleConfirmDeleteVehicle}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  De-Registration Reason *
                </label>
                <select
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="Vehicle fitness or transit permit non-compliance">Vehicle fitness or transit permit non-compliance</option>
                  <option value="Carrier agency requested de-listing of vehicle">Carrier agency requested de-listing of vehicle</option>
                  <option value="GPS telemetry hardware malfunction">GPS telemetry hardware malfunction</option>
                  <option value="Repeated transit delay / logistics service grievance">Repeated transit delay / logistics service grievance</option>
                  <option value="Administrative fleet re-allocation">Administrative fleet re-allocation</option>
                </select>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.78rem', color: '#991b1b' }}>
                ⚠️ Authorized by: <strong>Vedant Chavan</strong> (Chief Platform Administrator)
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setVehicleToDelete(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Confirm Vehicle Removal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: USER ACCOUNT STOP / SUSPENSION / REACTIVATION                   */}
      {/* ========================================================================= */}
      {userToToggle && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: userToToggle.isFrozen ? '#16a34a' : '#dc2626' }}>
              {userToToggle.isFrozen ? <CheckCircle2 size={24} /> : <Ban size={24} />}
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {userToToggle.isFrozen ? 'Reactivate Stakeholder Account' : 'Stop / Suspend Stakeholder Account'}
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
              {userToToggle.isFrozen ? (
                <>
                  You are reactivating the account for <strong>{userToToggle.name}</strong> ({(userToToggle.role || 'user').toUpperCase()}). 
                  Full trading, bidding, and booking privileges will be instantly restored.
                </>
              ) : (
                <>
                  You are stopping and suspending trading privileges for <strong>{userToToggle.name}</strong> ({(userToToggle.role || 'user').toUpperCase()}). 
                  While stopped, this user cannot list crop lots, submit purchase bids, accept deals, or dispatch vehicles.
                </>
              )}
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '0.8rem', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><span style={{ color: '#64748b' }}>Stakeholder:</span> <strong>{userToToggle.name}</strong></div>
              <div><span style={{ color: '#64748b' }}>Category:</span> <strong style={{ textTransform: 'capitalize' }}>{userToToggle.role}</strong></div>
              <div><span style={{ color: '#64748b' }}>Contact:</span> <strong>{userToToggle.phone || userToToggle.email || 'N/A'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Current Status:</span> <strong>{userToToggle.isFrozen ? 'Suspended' : 'Active'}</strong></div>
            </div>

            <form onSubmit={handleConfirmToggleUser}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Supervisory Action Reason *
                </label>
                <select
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="Regulatory compliance audit / quality inspection review">Regulatory compliance audit / quality inspection review</option>
                  <option value="APMC dispute arbitration order">APMC dispute arbitration order</option>
                  <option value="Escrow payment irregularity or verification hold">Escrow payment irregularity or verification hold</option>
                  <option value="User requested account freeze / maintenance">User requested account freeze / maintenance</option>
                  <option value="General administrative policy enforcement">General administrative policy enforcement</option>
                </select>
              </div>

              <div style={{
                background: userToToggle.isFrozen ? '#f0fdf4' : '#fef2f2',
                border: userToToggle.isFrozen ? '1px solid #bbf7d0' : '1px solid #fecaca',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '18px',
                fontSize: '0.78rem',
                color: userToToggle.isFrozen ? '#15803d' : '#991b1b'
              }}>
                ⚖️ Authorized by: <strong>Vedant Chavan</strong> (Chief Platform Administrator)
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setUserToToggle(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: userToToggle.isFrozen ? '#16a34a' : '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {userToToggle.isFrozen ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                  <span>{userToToggle.isFrozen ? 'Confirm Reactivation' : 'Confirm Account Stop'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE USER CONFIRMATION                                           */}
      {/* ========================================================================= */}
      {userToDelete && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#dc2626' }}>
              <Trash2 size={24} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Permanently Delete Stakeholder Account
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
              You are permanently expunging the account of <strong>{userToDelete.name}</strong> ({(userToDelete.role || 'user').toUpperCase()}). 
              This will erase their profile, contact details, authentication records, and unlink active listings. This action <strong>cannot be undone</strong>.
            </p>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', fontSize: '0.8rem', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><span style={{ color: '#64748b' }}>Account Name:</span> <strong>{userToDelete.name}</strong></div>
              <div><span style={{ color: '#64748b' }}>Role:</span> <strong style={{ textTransform: 'capitalize' }}>{userToDelete.role}</strong></div>
              <div><span style={{ color: '#64748b' }}>Phone / Contact:</span> <strong>{userToDelete.phone || userToDelete.email || 'N/A'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Account ID:</span> <strong>{userToDelete.id}</strong></div>
            </div>

            <form onSubmit={handleConfirmDeleteUser}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Reason for Account Deletion *
                </label>
                <input
                  type="text"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g., Regulatory violation, fraudulent identity, user request"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '18px',
                fontSize: '0.78rem',
                color: '#9f1239'
              }}>
                ⚖️ Permanent administrative expungement authorized by: <strong>Vedant Chavan</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Confirm Permanent Deletion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE ORDER CONTRACT CONFIRMATION                                 */}
      {/* ========================================================================= */}
      {orderToDelete && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#dc2626' }}>
              <Trash2 size={24} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Permanently Delete Order Contract
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
              You are deleting purchase contract <strong>#{orderToDelete.id}</strong> ({orderToDelete.crop} - {orderToDelete.quantity} {orderToDelete.unit || 'KG'}) 
              between <strong>{orderToDelete.farmerName}</strong> and <strong>{orderToDelete.buyerName}</strong>. 
              The order and associated escrow records will be expunged from the platform.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '0.8rem', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><span style={{ color: '#64748b' }}>Order ID:</span> <strong>#{orderToDelete.id}</strong></div>
              <div><span style={{ color: '#64748b' }}>Commodity:</span> <strong>{orderToDelete.crop}</strong></div>
              <div><span style={{ color: '#64748b' }}>Total Value:</span> <strong>₹{(orderToDelete.totalAmount || 0).toLocaleString()}</strong></div>
              <div><span style={{ color: '#64748b' }}>Current Status:</span> <strong>{orderToDelete.status}</strong></div>
            </div>

            <form onSubmit={handleConfirmDeleteOrder}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Reason for Deletion *
                </label>
                <input
                  type="text"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g., Contract invalidated, duplicated trade, regulatory order"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete Order Contract</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE GRIEVANCE DISPUTE                                           */}
      {/* ========================================================================= */}
      {grievanceToDelete && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#dc2626' }}>
              <Trash2 size={24} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Delete Dispute Ticket
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
              Are you sure you want to permanently remove dispute <strong>#{grievanceToDelete.id}</strong>: "{grievanceToDelete.issue}" filed by <strong>{grievanceToDelete.raisedBy}</strong>?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setGrievanceToDelete(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteGrievance}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)'
                }}
              >
                <Trash2 size={14} />
                <span>Delete Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BULK PURGE CONFIRMATION                                            */}
      {/* ========================================================================= */}
      {purgeTarget && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '520px', border: '2px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#dc2626' }}>
              <AlertTriangle size={28} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#991b1b' }}>
                {purgeTarget === 'all' ? '🚨 CONFIRM TOTAL DATABASE PURGE' : `Confirm Bulk Purge: ${purgeTarget.toUpperCase()}`}
              </h3>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '14px', marginBottom: '16px', fontSize: '0.85rem', color: '#991b1b', lineHeight: 1.5 }}>
              {purgeTarget === 'lots' && (
                <>You are about to delete <strong>ALL {lots.length} active crop lots</strong> listed by farmers across Maharashtra. All active offers associated with these lots will also be removed.</>
              )}
              {purgeTarget === 'offers' && (
                <>You are about to delete <strong>ALL {offers.length} buyer bids/offers</strong> across all crops. Farmer crop lots will remain but their bid queues will be reset to zero.</>
              )}
              {purgeTarget === 'orders' && (
                <>You are about to delete <strong>ALL {orders.length} transaction orders</strong> and escrow contract records from the platform.</>
              )}
              {purgeTarget === 'vehicles' && (
                <>You are about to delete <strong>ALL {displayVehicles.length} carrier vehicles</strong> from the transport logistics registry.</>
              )}
              {purgeTarget === 'audit' && (
                <>You are about to clear the entire chronological activity audit log.</>
              )}
              {purgeTarget === 'all' && (
                <><strong>EXTREME ACTION:</strong> You are triggering a complete platform wipeout! This will permanently delete all {lots.length} crop lots, {offers.length} buyer offers, {orders.length} orders, {displayVehicles.length} vehicles, and system audit logs simultaneously!</>
              )}
            </div>

            <p style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '18px' }}>
              This action is executed under Chief Administrator privileges (<strong>Vedant Chavan</strong>) and cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPurgeTarget(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecutePurge}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                }}
              >
                <Trash2 size={16} />
                <span>Execute Purge Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Cloud & Multi-Device Sync Modal */}
      <CloudSyncModal 
        isOpen={isCloudSyncModalOpen} 
        onClose={() => setIsCloudSyncModalOpen(false)} 
      />
    </div>
  );
};
