import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PublicHome } from './components/PublicHome';
import { FarmerHome } from './components/FarmerDashboard/FarmerHome';
import { MarketIntelligence } from './components/FarmerDashboard/MarketIntelligence';
import { AIPrediction } from './components/FarmerDashboard/AIPrediction';
import { BuyerMatching } from './components/FarmerDashboard/BuyerMatching';
import { MyLots } from './components/FarmerDashboard/MyLots';
import { OfferComparison } from './components/FarmerDashboard/OfferComparison';
import { QualityGrading } from './components/FarmerDashboard/QualityGrading';
import { StorageMarketplace } from './components/FarmerDashboard/StorageMarketplace';

import { BuyerHome } from './components/BuyerDashboard/BuyerHome';
import { BuyerMarketplace } from './components/BuyerDashboard/BuyerMarketplace';
import { MyOffers } from './components/BuyerDashboard/MyOffers';

import { TransporterHome } from './components/TransporterDashboard/TransporterHome';
import { LogisticsTracker } from './components/TransporterDashboard/LogisticsTracker';

import { ColdStorageHome } from './components/ColdStorageDashboard/ColdStorageHome';
import { ColdStorageFacilities } from './components/ColdStorageDashboard/ColdStorageFacilities';
import { ColdStorageBookings } from './components/ColdStorageDashboard/ColdStorageBookings';

import { AdminHome } from './components/AdminDashboard/AdminHome';
import { EscrowPayments } from './components/Common/EscrowPayments';
import { GrievancesPortal } from './components/Common/GrievancesPortal';
import { AccessDenied } from './components/Common/AccessDenied';
import { ConfirmationToast } from './components/Common/ConfirmationToast';

import { CreateLotModal } from './components/FarmerDashboard/CreateLotModal';
import { MakeOfferModal } from './components/BuyerDashboard/MakeOfferModal';
import { BookTransportModal } from './components/BuyerDashboard/BookTransportModal';
import { FarmerPaymentModal } from './components/BuyerDashboard/FarmerPaymentModal';
import { RoleAuthModal } from './components/Common/RoleAuthModal';
import { RateBuyerModal } from './components/Common/RateBuyerModal';
import { UniversalTranslator } from './components/Common/UniversalTranslator';

import { 
  Home, 
  TrendingUp, 
  Cpu, 
  Users, 
  Package, 
  Tag, 
  Scale, 
  ScanLine, 
  Warehouse, 
  Truck, 
  Coins, 
  AlertTriangle, 
  ShieldCheck, 
  Store,
  Compass,
  Layers,
  Sprout,
  Snowflake,
  Calendar
} from 'lucide-react';

const MainLayout = () => {
  const { 
    currentUser,
    role, 
    activeTab, 
    setActiveTab, 
    lang, 
    t, 
    isRateModalOpen, 
    setIsRateModalOpen, 
    ratedTxn, 
    transactions 
  } = useApp();

  // Role Nav Configuration
  const farmerTabs = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'marketPrices', label: t('navMarketPrices'), icon: TrendingUp },
    { id: 'aiPrediction', label: t('navAIPrediction'), icon: Cpu },
    { id: 'buyerMatching', label: t('navBuyerMatching'), icon: Users },
    { id: 'myLots', label: t('navMyLots'), icon: Package },
    { id: 'offers', label: t('navOffers'), icon: Tag },
    { id: 'qualityGrading', label: t('navQualityGrading'), icon: ScanLine },
    { id: 'storage', label: t('navStorage'), icon: Warehouse },
    { id: 'logistics', label: t('navLogistics'), icon: Truck },
    { id: 'transactions', label: t('navTransactions'), icon: Coins },
    { id: 'grievances', label: t('navGrievances'), icon: AlertTriangle }
  ];

  const buyerTabs = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'marketplace', label: t('navMarketplace'), icon: Store },
    { id: 'myOffers', label: t('navMyOffers'), icon: Tag },
    { id: 'storage', label: t('navStorage'), icon: Warehouse },
    { id: 'logistics', label: t('navLogistics'), icon: Truck },
    { id: 'transactions', label: t('navTransactions'), icon: Coins },
    { id: 'grievances', label: t('navGrievances'), icon: AlertTriangle }
  ];

  const transporterTabs = [
    { id: 'home', label: t('navFleetCenter'), icon: Home },
    { id: 'logistics', label: t('navLogistics'), icon: Truck },
    { id: 'storage', label: t('navStorage'), icon: Warehouse },
    { id: 'transactions', label: t('navTransactions'), icon: Coins },
    { id: 'grievances', label: t('navGrievances'), icon: AlertTriangle }
  ];

  const coldStorageTabs = [
    { id: 'home', label: t('navColdStorageCenter') || 'Cold Storage Hub', icon: Home },
    { id: 'facilities', label: t('navFacilities') || 'My Facilities & Space', icon: Warehouse },
    { id: 'storageBookings', label: t('navStorageBookings') || 'Client Reservations', icon: Calendar },
    { id: 'logistics', label: t('navLogistics'), icon: Truck },
    { id: 'transactions', label: t('navTransactions'), icon: Coins },
    { id: 'grievances', label: t('navGrievances'), icon: AlertTriangle }
  ];

  const adminTabs = [
    { id: 'home', label: t('navAdminOversight'), icon: ShieldCheck },
    { id: 'marketPrices', label: t('navMarketPrices'), icon: TrendingUp },
    { id: 'myLots', label: t('navAllLots'), icon: Package },
    { id: 'logistics', label: t('navLogistics'), icon: Truck },
    { id: 'transactions', label: t('navTransactions'), icon: Coins },
    { id: 'grievances', label: t('navGrievances'), icon: AlertTriangle }
  ];

  const currentTabs = 
    role === 'farmer' ? farmerTabs :
    role === 'buyer' ? buyerTabs :
    role === 'transporter' ? transporterTabs :
    role === 'cold_storage' ? coldStorageTabs : adminTabs;

  // View Router for Authenticated Portals
  const renderTabContent = () => {
    switch (activeTab) {
      // Role Homes
      case 'home':
        if (role === 'farmer') return <FarmerHome />;
        if (role === 'buyer') return <BuyerHome />;
        if (role === 'transporter') return <TransporterHome />;
        if (role === 'cold_storage') return <ColdStorageHome />;
        return <AdminHome />;

      case 'facilities':
        return <ColdStorageFacilities />;

      case 'storageBookings':
        return <ColdStorageBookings />;

      case 'marketPrices':
        return <MarketIntelligence />;

      case 'aiPrediction':
        if (role !== 'farmer' && role !== 'admin') return <AccessDenied requiredRole="Farmer or Admin" />;
        return <AIPrediction />;

      case 'buyerMatching':
        if (role !== 'farmer' && role !== 'admin') return <AccessDenied requiredRole="Farmer or Admin" />;
        return <BuyerMatching />;

      case 'myLots':
        return <MyLots />;

      case 'offers':
      case 'compareOffers':
        return <OfferComparison />;

      case 'qualityGrading':
        return <QualityGrading />;

      case 'storage':
        return <StorageMarketplace />;

      // Buyer Views
      case 'marketplace':
        return <BuyerMarketplace />;

      case 'myOffers':
        return <MyOffers />;

      // Shared Views
      case 'logistics':
        return <LogisticsTracker />;

      case 'transactions':
        return <EscrowPayments />;

      case 'grievances':
        return <GrievancesPortal />;

      default:
        return <FarmerHome />;
    }
  };

  return (
    <div className="app-container">
      {/* Universal Real-Time Trilingual DOM Translator */}
      <UniversalTranslator />

      {/* Universal Responsive Navbar */}
      <Navbar />

      {/* 
        ROUTING LOGIC:
        If unauthenticated (!currentUser): Render rich Public Home Page.
        If authenticated (currentUser): Render Role Navigation Bar and Selected Dashboard View.
      */}
      {!currentUser ? (
        <PublicHome />
      ) : (
        <>
          {/* Authenticated Role Navigation Sub-bar */}
          <div style={{ background: '#ffffff', borderBottom: '1px solid var(--border-subtle)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', position: 'sticky', top: '71px', zIndex: 90 }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 20px', overflowX: 'auto', display: 'flex', gap: '4px' }}>
              {currentTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                    style={{ 
                      padding: '12px 14px', 
                      fontSize: '0.86rem',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Icon size={16} color={isActive ? '#15803d' : '#64748b'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Authenticated Dashboard Container */}
          <main className="main-content" style={{ maxWidth: '1320px', margin: '0 auto', padding: '24px 20px 48px' }}>
            {renderTabContent()}
          </main>

          {/* Authenticated Portal Footer */}
          <footer style={{ background: '#0f172a', color: '#cbd5e1', borderTop: '1px solid #1e293b', padding: '32px 20px 24px', fontSize: '0.82rem' }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '1.15rem', color: '#ffffff' }}>AgriLink (कृषीलिंक)</strong>
                  <span style={{ background: '#166534', color: '#86efac', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.72rem' }}>
                    Govt of Maharashtra • MahaAgri Linked
                  </span>
                </div>
                <p style={{ color: '#94a3b8', margin: 0, maxWidth: '600px' }}>
                  Strengthening market linkages and transparent price discovery for farmers through direct institutional matching, AI price intelligence, computer vision quality grading, and guaranteed escrow settlements.
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#86efac', fontWeight: 700, display: 'block' }}>
                  Directorate of Agricultural Marketing
                </span>
                <span style={{ color: '#64748b' }}>
                  Bilingual Edition (English & मराठी) • APMC & e-NAM Compatible
                </span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Global Modals */}
      <RoleAuthModal />
      <CreateLotModal />
      <MakeOfferModal />
      <FarmerPaymentModal />
      <BookTransportModal />
      <RateBuyerModal isOpen={isRateModalOpen} onClose={() => setIsRateModalOpen(false)} transaction={ratedTxn || transactions[0]} />

      {/* Toast Notification System */}
      <ConfirmationToast />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '20px' }}>
          <div style={{ maxWidth: '500px', background: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={28} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Interface Refresh Needed</h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '20px' }}>{this.state.error?.message || 'An unexpected error occurred while rendering the dashboard.'}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{ background: '#15803d', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Refresh Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    </AppProvider>
  );
}
