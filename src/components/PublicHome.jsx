import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CROPS_CATALOG } from '../mockData';
import { 
  Sprout, 
  Building2, 
  Truck, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Search, 
  Scale, 
  Warehouse, 
  Sparkles, 
  Eye, 
  Clock, 
  Award, 
  ChevronRight,
  PhoneCall,
  MapPin,
  Cpu,
  Layers,
  FileCheck2,
  Navigation,
  Snowflake
} from 'lucide-react';

export const PublicHome = () => {
  const { lang, t, setIsAuthModalOpen, setAuthDefaultRole, openAuthModal } = useApp();
  const [activeRoleTab, setActiveRoleTab] = useState('farmer');
  const [selectedMandiCrop, setSelectedMandiCrop] = useState('onion');

  const openAuthWithRole = (roleKey) => {
    if (openAuthModal) {
      openAuthModal(roleKey, 'login');
    } else {
      setAuthDefaultRole(roleKey);
      setIsAuthModalOpen(true);
    }
  };

  // Mock Live Mandi Ticker Data for Maharashtra
  const liveMandiRates = [
    { crop: 'Onion', cropMr: 'कांदा', mandi: 'Lasalgaon / Pimpalgaon (Nashik)', min: '₹18/kg', modal: '₹28/kg', max: '₹34/kg', change: '+₹2.50', trend: 'up' },
    { crop: 'Tomato', cropMr: 'टोमॅटो', mandi: 'Narayangaon (Pune)', min: '₹14/kg', modal: '₹22/kg', max: '₹26/kg', change: '+₹1.80', trend: 'up' },
    { crop: 'Soybean', cropMr: 'सोयाबीन', mandi: 'Latur / Ahmednagar', min: '₹44/kg', modal: '₹48/kg', max: '₹51/kg', change: '-₹0.60', trend: 'down' },
    { crop: 'Pomegranate', cropMr: 'डाळिंब', mandi: 'Solapur / Sangli', min: '₹85/kg', modal: '₹110/kg', max: '₹145/kg', change: '+₹4.00', trend: 'up' },
    { crop: 'Cotton', cropMr: 'कापूस', mandi: 'Jalgaon / Vidarbha', min: '₹68/kg', modal: '₹72/kg', max: '₹76/kg', change: '0.00', trend: 'stable' }
  ];

  // 6 Real-World Challenges
  const challenges = [
    {
      num: '01',
      title: t('problem1Title'),
      desc: t('problem1Desc'),
      icon: Eye,
      tag: 'Information Asymmetry',
      color: '#ef4444',
      bg: '#fef2f2'
    },
    {
      num: '02',
      title: t('problem2Title'),
      desc: t('problem2Desc'),
      icon: Building2,
      tag: 'Direct Connection Gap',
      color: '#f97316',
      bg: '#fff7ed'
    },
    {
      num: '03',
      title: t('problem3Title'),
      desc: t('problem3Desc'),
      icon: Scale,
      tag: 'Disputed Quality',
      color: '#eab308',
      bg: '#fefce8'
    },
    {
      num: '04',
      title: t('problem4Title'),
      desc: t('problem4Desc'),
      icon: Truck,
      tag: 'Post-Harvest Loss',
      color: '#8b5cf6',
      bg: '#f5f3ff'
    },
    {
      num: '05',
      title: t('problem5Title'),
      desc: t('problem5Desc'),
      icon: AlertTriangle,
      tag: 'Price Exploitation',
      color: '#ec4899',
      bg: '#fdf2f8'
    },
    {
      num: '06',
      title: t('problem6Title'),
      desc: t('problem6Desc'),
      icon: DollarSign,
      tag: 'Default Risk',
      color: '#06b6d4',
      bg: '#ecfeff'
    }
  ];

  // 9 Solutions Pipeline
  const solutions = [
    { step: 1, title: t('solStep1Title'), desc: t('solStep1Desc'), icon: Search },
    { step: 2, title: t('solStep2Title'), desc: t('solStep2Desc'), icon: TrendingUp },
    { step: 3, title: t('solStep3Title'), desc: t('solStep3Desc'), icon: Cpu },
    { step: 4, title: t('solStep4Title'), desc: t('solStep4Desc'), icon: Building2 },
    { step: 5, title: t('solStep5Title'), desc: t('solStep5Desc'), icon: FileCheck2 },
    { step: 6, title: t('solStep6Title'), desc: t('solStep6Desc'), icon: Award },
    { step: 7, title: t('solStep7Title'), desc: t('solStep7Desc'), icon: Warehouse },
    { step: 8, title: t('solStep8Title'), desc: t('solStep8Desc'), icon: Navigation },
    { step: 9, title: t('solStep9Title'), desc: t('solStep9Desc'), icon: ShieldCheck }
  ];

  // Stakeholder Journeys
  const stakeholderFlows = {
    farmer: {
      roleKey: 'farmer',
      title: t('farmerFlowTitle'),
      subtitle: 'For Individual Cultivators, Progressive Farmers & Farmer Producer Companies (FPOs)',
      icon: Sprout,
      color: '#15803d',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      steps: [
        { num: 1, title: 'Check Real-Time Market Rates', desc: 'Browse live APMC mandi benchmarks and buyer purchase bids across Maharashtra.' },
        { num: 2, title: 'AI Price & Optimal Window Advisory', desc: 'Get automated price trend analysis and guidance on whether to sell now or store.' },
        { num: 3, title: 'Create Verified Crop Lot', desc: 'Upload harvest details, variety, quantity, and optional AI quality photo scan.' },
        { num: 4, title: 'Receive & Compare Buyer Offers', desc: 'Direct corporate and wholesale offers arrive without intermediate broker cuts.' },
        { num: 5, title: 'Doorstep Pickup & Escrow Settlement', desc: 'Logistics arrives at your farm gate; payment is released directly to your bank.' }
      ]
    },
    buyer: {
      roleKey: 'buyer',
      title: t('buyerFlowTitle'),
      subtitle: 'For Food Processors, Retail Chains, Exporters & Bulk Institutional Buyers',
      icon: Building2,
      color: '#0369a1',
      bg: '#f0f9ff',
      border: '#bae6fd',
      steps: [
        { num: 1, title: 'Discover Farm-Fresh Produce Lots', desc: 'Filter verified lots by crop, variety, Grade A/B standard, location, and volume.' },
        { num: 2, title: 'Review Digital Quality Reports', desc: 'Inspect AI computer-vision grading, moisture, size uniformity, and defect percentages.' },
        { num: 3, title: 'Place Binding Purchase Offers', desc: 'Submit transparent per-KG pricing with delivery terms and pickup specifications.' },
        { num: 4, title: 'Secure Escrow Commitment', desc: 'Deposit funds into protected escrow ledger to assure farmers of guaranteed settlement.' },
        { num: 5, title: 'Direct Warehouse Delivery & Invoicing', desc: 'Track shipment live via GPS and receive GST-compliant electronic invoices.' }
      ]
    },
    transporter: {
      roleKey: 'transporter',
      title: t('logisticsFlowTitle'),
      subtitle: 'For Rural Fleet Owners, Commercial Truckers & Cold Storage Warehouse Operators',
      icon: Truck,
      color: '#b45309',
      bg: '#fffbeb',
      border: '#fde68a',
      steps: [
        { num: 1, title: 'View Farm-to-Hub Transport Orders', desc: 'Discover scheduled produce pickups matched along your preferred transit routes.' },
        { num: 2, title: 'Accept Cargo & Route Confirmation', desc: 'Accept fixed freight rates with milestone-based automated fuel and dispatch payments.' },
        { num: 3, title: 'List Cold Storage & Warehouse Capacity', desc: 'Publish available humidity-controlled cubic space for farmers requiring post-harvest curing.' },
        { num: 4, title: 'GPS Live Tracking & Digital Waybills', desc: 'Generate electronic e-way documentation and update checkpoint statuses.' },
        { num: 5, title: 'Guaranteed Freight Payout', desc: 'Instant escrow release upon weighbridge offloading and digital receiver sign-off.' }
      ]
    },
    cold_storage: {
      roleKey: 'cold_storage',
      title: lang === 'mr' ? 'शीतगृह चालक (Cold Storage)' : lang === 'hi' ? 'कोल्ड स्टोरेज संचालक' : 'Cold Storage Operator',
      subtitle: 'For Cold Chain Facility Owners, Warehouse Operators & Controlled Atmosphere Hubs',
      icon: Snowflake,
      color: '#0891b2',
      bg: '#ecfeff',
      border: '#a5f3fc',
      steps: [
        { num: 1, title: 'List Cold Storage Facility & Capacity', desc: 'Publish available MT storage space, temperature zones, and daily rental rates.' },
        { num: 2, title: 'Upload Facility Photos & Specs', desc: 'Showcase chambers, backup genset, nitrogen purge, and WDRA compliance.' },
        { num: 3, title: 'Receive Direct Farmer & Buyer Bookings', desc: 'Accept produce storage reservations from farmers delaying sale for price appreciation.' },
        { num: 4, title: 'Digital Gate Pass & Chamber Check-in', desc: 'Log produce arrival, issue digital receipt, and monitor climate telemetry.' },
        { num: 5, title: 'Guaranteed Escrow Rental Payout', desc: 'Receive secured escrow rental payment upon stock checkout and produce release.' }
      ]
    },
    admin: {
      roleKey: 'admin',
      title: t('adminFlowTitle'),
      subtitle: 'For MahaAgri Officers, Mandi Secretaries & Agricultural Governance Authorities',
      icon: ShieldCheck,
      color: '#991b1b',
      bg: '#fef2f2',
      border: '#fecaca',
      steps: [
        { num: 1, title: 'Monitor State-Wide Mandi Alignments', desc: 'Audit price spreads between farm-gate prices, APMC yards, and retail terminal hubs.' },
        { num: 2, title: 'Supervise Contract & Order Execution', desc: 'Oversee multi-party agreements, delivery timelines, and order statuses in real time.' },
        { num: 3, title: 'Intervene on Order Cancellations', desc: 'Audit and authorize cancellations with mandatory reason documentation to prevent bad-faith exits.' },
        { num: 4, title: 'Arbitrate Disputes & Grievances', desc: 'Resolve quality disputes, transit delays, or payment holds within strict 24-hour SLA targets.' },
        { num: 5, title: 'Track Value Chain Transparency', desc: 'Live oversight of farmers protected, fair pricing delivered, and illegal brokerage eliminated.' }
      ]
    }
  };

  const currentFlow = stakeholderFlows[activeRoleTab];
  const FlowIcon = currentFlow.icon;

  // 8 Trust Pillars
  const trustPillars = [
    { title: t('trust1'), desc: 'Verified Aadhaar, FPO registration, GSTIN, and corporate trade licenses.' },
    { title: t('trust2'), desc: 'Benchmark prices synchronized directly with APMC yard transactions across Maharashtra.' },
    { title: t('trust3'), desc: 'Fixed, binding price quotes with zero illegal deductions or hidden broker brokerage.' },
    { title: t('trust4'), desc: 'Standardized optical AI quality score cards guaranteeing grade authenticity.' },
    { title: t('trust5'), desc: 'Live GPS vehicle telemetry from farm gate to buyer warehouse loading dock.' },
    { title: t('trust6'), desc: 'Escrow-backed payout guarantees ensuring farmers receive funds within 24 hours.' },
    { title: t('trust7'), desc: 'Immutable digital logs and downloadable GST/e-Way electronic tax receipts.' },
    { title: t('trust8'), desc: 'Dedicated MahaAgri grievance ombudsman desk for rapid dispute resolution.' }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '70px 20px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Grid Glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Official Endorsement Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '0.84rem',
            fontWeight: 600,
            marginBottom: '24px',
            color: '#86efac'
          }}>
            <span>🇮🇳</span>
            <span>Government of Maharashtra • MahaAgri Market Linkage Network</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                {t('brandName')} <span style={{ color: '#4ade80' }}>({t('brandMarathiName')})</span>
              </h1>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f0fdf4', margin: '0 0 16px' }}>
                {t('motto')}
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: '#cbd5e1', margin: '0 0 32px', maxWidth: '620px' }}>
                {t('heroDesc')} Empowering agricultural producers with transparent price discovery, direct institutional buyer contracts, and verified logistics without middleman exploitation.
              </p>

              {/* Primary Call to Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <button
                  onClick={() => openAuthWithRole('farmer')}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 20px -5px rgba(34, 197, 94, 0.5)'
                  }}
                >
                  <Sprout size={20} />
                  <span>{t('roleFarmer')} Portal</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => openAuthWithRole('buyer')}
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 20px -5px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Building2 size={20} color="#0369a1" />
                  <span>{t('roleBuyer')} Portal</span>
                </button>

                <button
                  onClick={() => (openAuthModal ? openAuthModal(null, 'login') : setIsAuthModalOpen(true))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={18} color="#fbbf24" />
                  <span>{t('navLoginSignUp')}</span>
                </button>
              </div>

              {/* Supported by badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.82rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#4ade80" /> Verified FPO Network
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#4ade80" /> Safe Escrow Settlements
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#4ade80" /> GPS Cold Chain Ready
                </span>
              </div>
            </div>

            {/* Stakeholder Role Sign-In Gateway Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#86efac' }}>
                  {lang === 'mr' ? 'पोर्टल प्रवेश (लॉगिन)' : 'Access Your Portal'}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  {lang === 'mr' ? 'मोबाईल OTP द्वारे' : 'Via Mobile OTP'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Farmer Role Button */}
                <div 
                  onClick={() => openAuthWithRole('farmer')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.6rem' }}>👨‍🌾</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                        {lang === 'mr' ? 'शेतकरी / FPO पोर्टल' : 'Farmer / FPO Portal'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {lang === 'mr' ? 'माल नोंदणी, बाजार भाव व थेट विक्री' : 'List produce, check mandi rates & sell'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4ade80', background: 'rgba(34, 197, 94, 0.15)', padding: '6px 12px', borderRadius: '8px' }}>
                    {lang === 'mr' ? 'लॉगिन →' : 'Sign In →'}
                  </span>
                </div>

                {/* Buyer Role Button */}
                <div 
                  onClick={() => openAuthWithRole('buyer')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.6rem' }}>🏢</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                        {lang === 'mr' ? 'संस्थात्मक खरेदीदार पोर्टल' : 'Institutional Buyer Portal'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {lang === 'mr' ? 'थेट शेतीमाल खरेदी व सुरक्षित व्यवहार' : 'Bulk procurement & verified contracts'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '6px 12px', borderRadius: '8px' }}>
                    {lang === 'mr' ? 'लॉगिन →' : 'Sign In →'}
                  </span>
                </div>

                {/* Transporter Role Button */}
                <div 
                  onClick={() => openAuthWithRole('transporter')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.6rem' }}>🚚</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                        {lang === 'mr' ? 'वाहतूकदार पोर्टल' : 'Fleet Transporter Portal'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {lang === 'mr' ? 'फ्लीट वाहने, थेट शेतीमाल वाहतूक' : 'Fleet trips & route freight booking'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.15)', padding: '6px 12px', borderRadius: '8px' }}>
                    {lang === 'mr' ? 'लॉगिन →' : 'Sign In →'}
                  </span>
                </div>

                {/* Cold Storage Role Button */}
                <div 
                  onClick={() => openAuthWithRole('cold_storage')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.6rem' }}>❄️</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                        {lang === 'mr' ? 'शीतगृह चालक / मालक पोर्टल' : 'Cold Storage Provider Portal'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {lang === 'mr' ? 'शीतगृह क्षमता नोंदणी व शेतीमाल आरक्षण' : 'List storage space & manage client bookings'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(6, 182, 212, 0.15)', padding: '6px 12px', borderRadius: '8px' }}>
                    {lang === 'mr' ? 'लॉगिन →' : 'Sign In →'}
                  </span>
                </div>

                {/* Admin Role Button */}
                <div style={{ marginTop: '6px', textAlign: 'center' }}>
                  <button 
                    onClick={() => openAuthWithRole('admin')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>🏛️</span>
                    <span>{lang === 'mr' ? 'शासकीय अधिकारी / Mandi Officer Login' : 'Government / Mandi Officer Console'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Counter Bar */}
        <div style={{
          maxWidth: '1280px',
          margin: '50px auto 0',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '18px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#4ade80' }}>14,800+</div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Verified Farmers & FPOs</div>
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#38bdf8' }}>420+</div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Institutional Buyers & Exporters</div>
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fbbf24' }}>850+</div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>GPS-Tracked Fleet Vehicles</div>
          </div>
          <div>
            <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#f472b6' }}>₹48.2 Cr</div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Protected Escrow Transactions</div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME MAHARASHTRA APMC MANDI TICKER */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{
              background: '#dc2626',
              color: '#ffffff',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: '0.04em'
            }}>
              LIVE MARKET
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Maharashtra Mandi Rates Today:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', flex: 1, padding: '4px 0' }}>
            {liveMandiRates.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <strong style={{ color: '#0f172a' }}>{item.crop} ({item.cropMr})</strong>
                <span style={{ color: '#64748b' }}>{item.mandi}</span>
                <span style={{ fontWeight: 800, color: '#15803d' }}>{item.modal}</span>
                <span style={{ fontSize: '0.74rem', color: item.trend === 'up' ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION: CHALLENGES FARMERS FACE */}
      <section style={{ padding: '70px 20px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span style={{ 
            background: '#fef2f2', 
            color: '#dc2626', 
            padding: '4px 14px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            Real-World Agri-Marketing Obstacles
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '14px 0 10px' }}>
            {t('challengesTitle')}
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.6 }}>
            {t('challengesSubtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {challenges.map((c, i) => {
            const Icon = c.icon;
            return (
              <div 
                key={i}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '28px 24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: c.bg,
                    color: c.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} />
                  </div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e2e8f0' }}>
                    {c.num}
                  </span>
                </div>

                <div style={{ 
                  display: 'inline-block', 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  color: c.color, 
                  background: c.bg, 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}>
                  {c.tag}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', margin: '0 0 10px' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION: HOW AGRISETU HELPS (9-Step Value Chain Pipeline) */}
      <section style={{ background: '#f0fdf4', borderTop: '1px solid #dcfce7', borderBottom: '1px solid #dcfce7', padding: '70px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span style={{ 
              background: '#dcfce7', 
              color: '#15803d', 
              padding: '4px 14px', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              End-to-End Agri Value Chain Engine
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '14px 0 10px' }}>
              {t('solutionTitle')}
            </h2>
            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
              {t('solutionSubtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {solutions.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    padding: '22px',
                    border: '1px solid #bbf7d0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: '#dcfce7',
                        color: '#15803d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} />
                      </div>
                      <span style={{ 
                        background: '#15803d', 
                        color: '#ffffff', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.76rem', 
                        fontWeight: 800 
                      }}>
                        {s.step}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#14532d', margin: '0 0 8px' }}>
                      {s.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SECTION: HOW IT WORKS BY STAKEHOLDER (Interactive Tabs) */}
      <section style={{ padding: '70px 20px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span style={{ 
            background: '#eff6ff', 
            color: '#1d4ed8', 
            padding: '4px 14px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            Multi-Stakeholder Architecture
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '14px 0 10px' }}>
            {t('hiwTitle')}
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.6 }}>
            {t('hiwSubtitle')}
          </p>
        </div>

        {/* Stakeholder Selector Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {Object.keys(stakeholderFlows).map(roleKey => {
            const flow = stakeholderFlows[roleKey];
            const isCurrent = activeRoleTab === roleKey;
            const TabIcon = flow.icon;
            return (
              <button
                key={roleKey}
                onClick={() => setActiveRoleTab(roleKey)}
                style={{
                  background: isCurrent ? flow.color : '#ffffff',
                  color: isCurrent ? '#ffffff' : '#334155',
                  border: isCurrent ? `2px solid ${flow.color}` : '1px solid #cbd5e1',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isCurrent ? '0 4px 12px rgba(0, 0, 0, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <TabIcon size={18} />
                <span>{flow.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stakeholder Journey Box */}
        <div style={{
          background: currentFlow.bg,
          border: `1px solid ${currentFlow.border}`,
          borderRadius: '20px',
          padding: '36px 30px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', borderBottom: `1px solid ${currentFlow.border}`, paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: currentFlow.color,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FlowIcon size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {currentFlow.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#475569', margin: '4px 0 0' }}>
                  {currentFlow.subtitle}
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={() => openAuthWithRole(currentFlow.roleKey)}
                style={{
                  background: currentFlow.color,
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 22px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
                }}
              >
                <span>{lang === 'mr' ? `${currentFlow.title} म्हणून प्रवेश करा` : `Sign In as ${currentFlow.title}`}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Steps Timeline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
            {currentFlow.steps.map((step, sIdx) => (
              <div 
                key={sIdx}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '18px',
                  border: '1px solid #e2e8f0',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: currentFlow.color,
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION: TRUST & TRANSPARENCY (8 Verified Pillars) */}
      <section style={{ background: '#0f172a', color: '#ffffff', padding: '70px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span style={{ 
              background: 'rgba(34, 197, 94, 0.2)', 
              color: '#4ade80', 
              padding: '4px 14px', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Zero Middleman Commission • 100% Verified
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '14px 0 10px' }}>
              {t('trustTitle')}
            </h2>
            <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
              {t('trustSubtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {trustPillars.map((tp, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '20px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <ShieldCheck size={20} color="#4ade80" />
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {tp.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0, paddingLeft: '30px' }}>
                  {tp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INSTITUTIONAL PARTNERS & MAHAAGRI ALIGNMENT BANNER */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '36px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '18px' }}>
            Aligned with National & State Agricultural Protocols
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '36px', flexWrap: 'wrap', opacity: 0.85 }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>🏛️ MahaAgri APMC Yards</span>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>🌾 e-NAM Price Integration</span>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>🔍 FSSAI Quality Standards</span>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>🤝 NABARD FPO Consortium</span>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>🌐 ONDC Agri Protocol Compliant</span>
          </div>
        </div>
      </section>

      {/* 8. REAL-WORLD PRODUCTION FOOTER */}
      <footer style={{ background: '#090d16', color: '#94a3b8', padding: '50px 20px 30px', fontSize: '0.84rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Sprout size={16} />
              </div>
              <strong style={{ fontSize: '1.2rem', color: '#ffffff' }}>AgriLink (कृषीलिंक)</strong>
            </div>
            <p style={{ lineHeight: 1.6, color: '#64748b', margin: '0 0 16px' }}>
              Smart Market Linkage & Transparent Price Discovery Platform. Connecting Maharashtra farmers and FPOs with institutional buyers, cold storage, and fleet logistics.
            </p>
            <div style={{ color: '#4ade80', fontWeight: 600, fontSize: '0.8rem' }}>
              Directorate of Agricultural Marketing, Government of Maharashtra
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '14px', fontSize: '0.9rem' }}>Stakeholder Portals</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a onClick={() => openAuthWithRole('farmer')} style={{ color: '#94a3b8', cursor: 'pointer' }}>Farmer & FPO Portal</a>
              <a onClick={() => openAuthWithRole('buyer')} style={{ color: '#94a3b8', cursor: 'pointer' }}>Institutional Buyer Terminal</a>
              <a onClick={() => openAuthWithRole('transporter')} style={{ color: '#94a3b8', cursor: 'pointer' }}>Transport & Cold Storage Network</a>
              <a onClick={() => openAuthWithRole('admin')} style={{ color: '#94a3b8', cursor: 'pointer' }}>MahaAgri Mandi Oversight Console</a>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '14px', fontSize: '0.9rem' }}>Tools & Intelligence</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Live APMC Mandi Rates</span>
              <span style={{ color: '#94a3b8' }}>AI Selling Window Advisory</span>
              <span style={{ color: '#94a3b8' }}>Computer Vision Grading</span>
              <span style={{ color: '#94a3b8' }}>Escrow Guarantee Settlement</span>
              <span style={{ color: '#94a3b8' }}>Grievance Redressal Desk</span>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '14px', fontSize: '0.9rem' }}>Kisan Support & Helpdesk</div>
            <p style={{ color: '#64748b', lineHeight: 1.5, margin: '0 0 12px' }}>
              Toll-Free Kisan Helpline (Maharashtra):
              <strong style={{ display: 'block', color: '#4ade80', fontSize: '1.1rem', marginTop: '4px' }}>1800-233-0244</strong>
            </p>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.78rem' }}>
              Operating Hours: Monday – Saturday (8:00 AM to 8:00 PM IST)
              <br />
              Email: support@agrilink.mahaagri.gov.in
            </p>
          </div>
        </div>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          borderTop: '1px solid #1e293b',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div>
            © 2026 AgriLink Platform. All Rights Reserved. Govt of Maharashtra Agriculture Initiative.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Escrow Safeguards</span>
            <span>Fair Mandi Charter</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
