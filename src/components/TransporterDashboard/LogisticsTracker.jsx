import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TRANSPORT_PROVIDERS } from '../../mockData';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  Navigation, 
  Coins, 
  FileText,
  Sparkles,
  AlertCircle,
  Package
} from 'lucide-react';

export const LogisticsTracker = () => {
  const { 
    currentUser,
    role,
    transactions, 
    transportBookings,
    advanceTransportStep,
    advanceLogisticsStep, 
    releaseEscrowPayment, 
    lang, 
    t, 
    setActiveTab 
  } = useApp();

  const [selectedBookingId, setSelectedBookingId] = useState(() => {
    return transportBookings && transportBookings.length > 0 ? transportBookings[0].id : null;
  });

  const activeBooking = (transportBookings && transportBookings.find(b => b.id === selectedBookingId)) || transportBookings[0] || null;
  const activeTxn = transactions[0] || null;

  if (!activeBooking && !activeTxn) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-green">
              <Truck size={12} />
              Unified Logistics & Escrow Settlement Engine
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {lang === 'mr' ? 'थेट वाहतूक ट्रॅकर व एस्क्रो पेमेंट' : 'Real-Time Logistics Tracking & Escrow Milestones'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
            Direct farm-gate aggregation with calibrated vehicle capacity and automatic payment dispatch upon weighment.
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            <Truck size={30} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 6px 0' }}>
            {lang === 'mr' ? 'सध्या कोणतीही वाहतूक सुरू नाही' : 'No Active Shipments in Transit'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', maxWidth: '480px', margin: '0 auto 20px' }}>
            {lang === 'mr'
              ? 'शेतकरी आणि खरेदीदार यांच्यात खरेदी करार निश्चित झाल्यावर वाहनाची नेमणूक आणि थेट जीपीएस ट्रॅकिंग येथे दिसेल.'
              : 'Once a farmer accepts an institutional buyer offer, the dedicated aggregation vehicle assignment, farm-gate pickup, and weighbridge delivery tracking will appear here.'}
          </p>
          <button 
            onClick={() => setActiveTab(role === 'farmer' ? 'offers' : (role === 'buyer' ? 'myOffers' : 'home'))}
            className="btn btn-primary"
            style={{ margin: '0 auto' }}
          >
            <span>{role === 'farmer' ? 'Check Trade Offers' : (role === 'buyer' ? 'Review My Bids' : 'Return to Fleet Dashboard')}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Determine steps and current progress
  const steps = [
    { title: "Booking Created", desc: activeBooking?.bookingType === 'self_pickup' ? "Buyer self-pickup pass" : "Vehicle requested" },
    { title: "Confirmed & Assigned", desc: `${activeBooking?.driverName || 'Driver'} (${activeBooking?.vehicleRegNumber || 'Vehicle'})` },
    { title: "Goods Picked Up", desc: `Loaded at ${activeBooking?.fromLocation?.split(',')[0] || 'Farm Gate'}` },
    { title: "In Transit", desc: `En route (${activeBooking?.distanceKm || 28} km)` },
    { title: "Delivered to Hub", desc: "Weighbridge confirmation" },
    { title: "Escrow Settled", desc: "Payment released via DBT" }
  ];

  const getCurrentStepIndex = () => {
    if (!activeBooking) return 2;
    const stat = activeBooking.status;
    if (stat === 'Delivered') return 5;
    if (stat === 'In Transit') return 3;
    if (stat === 'Arrived at Farm Gate') return 2;
    if (stat === 'Vehicle Dispatched') return 2;
    if (stat === 'Confirmed' || stat === 'Self-Pickup Arranged') return 1;
    return 0;
  };

  const currentStepIdx = getCurrentStepIndex();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-green">
            <Truck size={12} />
            Unified Logistics & Escrow Settlement Engine
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Booking #{activeBooking?.id || activeTxn?.id} • Route GPS Monitored
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'थेट वाहतूक ट्रॅकर व एस्क्रो पेमेंट' : 'Real-Time Logistics Tracking & Escrow Milestones'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          Direct farm-gate aggregation with calibrated vehicle capacity and automatic payment dispatch upon weighment.
        </p>
      </div>

      {/* Booking Selector Pills if multiple bookings */}
      {transportBookings.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {transportBookings.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBookingId(b.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: selectedBookingId === b.id ? '2px solid #16a34a' : '1px solid #cbd5e1',
                background: selectedBookingId === b.id ? '#f0fdf4' : '#ffffff',
                color: selectedBookingId === b.id ? '#15803d' : '#475569',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              #{b.id} • {b.crop} ({b.quantityKg} KG) - {b.status}
            </button>
          ))}
        </div>
      )}

      {/* ROUTE BANNER: FROM WHERE TO WHERE */}
      {activeBooking && (
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '20px',
          color: '#ffffff',
          marginBottom: '24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {/* Origin (From) */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <span style={{ background: '#16a34a', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                ORIGIN (From: Farm Gate)
              </span>
              <h4 style={{ margin: '6px 0 2px', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                📍 {activeBooking.fromLocation}
              </h4>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Farmer: {activeBooking.farmerName} ({activeBooking.farmerPhone || '+91 98220 14892'})
              </span>
            </div>

            {/* Middle Route Arrow */}
            <div style={{ textAlign: 'center', padding: '0 20px', minWidth: '140px' }}>
              <span style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 800 }}>
                {activeBooking.distanceKm || 28} KM Highway Route
              </span>
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, #22c55e 0%, #38bdf8 100%)',
                margin: '6px 0',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  right: '-4px',
                  top: '-4px',
                  width: 0,
                  height: 0,
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderLeft: '6px solid #38bdf8'
                }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Vehicle: {activeBooking.vehicleType}
              </span>
            </div>

            {/* Destination (To) */}
            <div style={{ flex: 1, minWidth: '220px', textAlign: 'right' }}>
              <span style={{ background: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                DESTINATION (To: Buyer Facility)
              </span>
              <h4 style={{ margin: '6px 0 2px', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                🎯 {activeBooking.toLocation}
              </h4>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Buyer: {activeBooking.buyerName} ({activeBooking.buyerPhone || '+91 98902 44100'})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Milestone Progress Bar */}
      <div className="card" style={{ marginBottom: '28px', padding: '28px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '16px' }}>
          {/* Background track line */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '30px',
            right: '30px',
            height: '4px',
            background: 'var(--slate-200)',
            zIndex: 1
          }} />

          {/* Active green progress fill */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '30px',
            width: `${(currentStepIdx / (steps.length - 1)) * 92}%`,
            height: '4px',
            background: '#16a34a',
            zIndex: 2,
            transition: 'width 0.4s ease'
          }} />

          {/* Steps */}
          {steps.map((s, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div 
                key={idx} 
                style={{ 
                  position: 'relative', 
                  zIndex: 3, 
                  textAlign: 'center', 
                  minWidth: '90px' 
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isCompleted ? '#16a34a' : '#ffffff',
                  border: isCompleted ? '2px solid #16a34a' : '2px solid var(--slate-300)',
                  color: isCompleted ? '#ffffff' : 'var(--slate-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  boxShadow: isCurrent ? '0 0 0 5px rgba(34, 197, 94, 0.25)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {isCompleted ? <CheckCircle2 size={18} /> : (idx + 1)}
                </div>
                <strong style={{ fontSize: '0.8rem', color: isCompleted ? 'var(--slate-900)' : 'var(--slate-400)', display: 'block' }}>
                  {s.title}
                </strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', display: 'block', maxWidth: '120px', margin: '2px auto 0' }}>
                  {s.desc}
                </span>
              </div>
            );
          })}
        </div>

        {/* Advance step button for live demonstration */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-green">
              Status: {activeBooking?.status || "Pickup Scheduled"}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
              Mode: <strong>{activeBooking?.bookingType === 'self_pickup' ? 'Self-Pickup (Buyer Direct)' : 'AgriLink Platform Fleet'}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {activeBooking && currentStepIdx < 5 && (
              <button 
                onClick={() => advanceTransportStep(activeBooking.id)}
                className="btn btn-primary"
              >
                <span>Advance Next Transit Step</span>
                <ArrowRight size={14} />
              </button>
            )}

            {activeTxn && currentStepIdx < 5 && (
              <button 
                onClick={() => releaseEscrowPayment(activeTxn.id)}
                className="btn btn-accent"
              >
                <Coins size={15} />
                <span>Instant Release Payment (Demo)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle & Trip Details Grid */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Assigned Vehicle & Driver */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Truck size={18} color="#16a34a" />
              Assigned Vehicle & Driver
            </span>
            <span className="badge badge-green">GPS Active</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-50)',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={30} />
            </div>

            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                {activeBooking?.vehicleRegNumber || activeTxn?.vehicleNumber || 'MH-12-QZ-4592'}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', margin: '2px 0 0 0' }}>
                {activeBooking?.vehicleType || 'Tata Ace Gold (Chhota Hathi)'} • {activeBooking?.transporterName || 'Kisan Express Agro Logistics'}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--slate-500)' }}>Driver:</span>
              <strong style={{ color: 'var(--slate-800)' }}>{activeBooking?.driverName || activeTxn?.driverName || 'Tukaram Shinde'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--slate-500)' }}>Phone:</span>
              <strong style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={13} /> {activeBooking?.driverPhone || '+91 94223 90812'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Current Location:</span>
              <strong style={{ color: 'var(--slate-800)' }}>Pune-Nashik Highway (14 km from Hub)</strong>
            </div>
          </div>
        </div>

        {/* Settlement Financials & Tax Invoice Summary */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Coins size={18} color="#d97706" />
              Settlement & Escrow Financials
            </span>
            <span className="badge badge-blue">Escrow Secured</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Farmer:</span>
              <strong>{activeBooking?.farmerName || activeTxn?.farmerName || 'Ramesh Patil'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Corporate Buyer:</span>
              <strong>{activeBooking?.buyerName || activeTxn?.buyerName || 'Sahyadri Mega Food Park'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Crop & Cargo:</span>
              <strong>{activeBooking?.crop || 'Onion'} ({activeBooking?.quantityKg || 1000} KG)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
              <span>Agreed Transport Fare:</span>
              <strong>₹{(activeBooking?.finalAgreedFare || activeBooking?.offeredFare || 800).toLocaleString()}</strong>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px dashed var(--border-subtle)',
              paddingTop: '10px',
              marginTop: '4px'
            }}>
              <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>Payment Guarantee:</strong>
              <span className="badge badge-green" style={{ fontSize: '0.85rem' }}>
                100% Escrow Deposited
              </span>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--slate-400)', marginTop: '4px' }}>
              Bank UTR Reference: <strong style={{ color: 'var(--slate-600)' }}>{activeTxn?.utrNumber || 'AGRILINK9048120094'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

