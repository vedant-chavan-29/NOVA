import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TRANSPORT_PROVIDERS, STORAGE_PROVIDERS } from '../../mockData';
import { AddVehicleModal } from './AddVehicleModal';
import { 
  Truck, 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Star, 
  Layers, 
  Coins, 
  Navigation, 
  Repeat, 
  Clock, 
  ShieldCheck, 
  Package, 
  AlertCircle,
  X,
  FileText,
  Plus,
  PlusCircle,
  Snowflake,
  Sparkles
} from 'lucide-react';

export const TransporterHome = () => {
  const { 
    currentUser, 
    transactions, 
    transportBookings, 
    fleetVehicles,
    setIsAddVehicleModalOpen,
    confirmTransportBooking, 
    counterTransportPrice, 
    advanceTransportStep,
    setActiveTab, 
    lang, 
    t 
  } = useApp();

  // State for active negotiation/confirmation popups
  const [negotiatingBookingId, setNegotiatingBookingId] = useState(null);
  const [counterPriceInput, setCounterPriceInput] = useState('');
  const [counterReasonInput, setCounterReasonInput] = useState('');

  const [confirmingBookingId, setConfirmingBookingId] = useState(null);
  const [assignVehicleReg, setAssignVehicleReg] = useState('MH-12-QZ-4592');
  const [assignDriverName, setAssignDriverName] = useState('Tukaram Shinde');
  const [assignDriverPhone, setAssignDriverPhone] = useState('+91 94223 90812');

  const pendingBookings = transportBookings.filter(b => b.status === 'Pending Transporter Confirmation' || b.status === 'Price Countered');
  const confirmedBookings = transportBookings.filter(b => b.status === 'Confirmed' || b.status === 'Vehicle Dispatched' || b.status === 'In Transit');

  const handleOpenNegotiate = (booking) => {
    setNegotiatingBookingId(booking.id);
    setCounterPriceInput((booking.offeredFare + 150).toString());
    setCounterReasonInput('Fuel surcharge & rural farm approach road');
  };

  const handleSendCounter = (bookingId) => {
    if (!counterPriceInput || isNaN(counterPriceInput)) return;
    counterTransportPrice(bookingId, counterPriceInput, counterReasonInput);
    setNegotiatingBookingId(null);
  };

  const handleOpenConfirm = (booking) => {
    setConfirmingBookingId(booking.id);
    setAssignVehicleReg(booking.vehicleRegNumber || 'MH-12-QZ-4592');
    setAssignDriverName(booking.driverName || 'Tukaram Shinde');
    setAssignDriverPhone(booking.driverPhone || '+91 94223 90812');
  };

  const handleConfirmBooking = (bookingId) => {
    confirmTransportBooking(bookingId, assignVehicleReg, assignDriverName, assignDriverPhone);
    setConfirmingBookingId(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-amber">
              Logistics & Cold Chain Fleet Portal
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Operator: <strong>{currentUser ? currentUser.name : 'Tukaram Shinde'}</strong> ({currentUser?.organization || 'Kisan Express Agro Logistics'} • {currentUser?.phone || '+91 94223 90812'})
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Fleet & Transit Dispatch Center
          </h2>
        </div>

        <button 
          onClick={() => setActiveTab('logistics')}
          className="btn btn-primary"
        >
          <Truck size={16} />
          <span>Active Trip Tracker</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="stat-card amber hover-lift">
          <div>
            <div className="stat-label">Pending Booking Requests</div>
            <div className="stat-val">{pendingBookings.length}</div>
            <div className="stat-sub">Requires confirmation or counter</div>
          </div>
          <div className="stat-icon amber">
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card green hover-lift">
          <div>
            <div className="stat-label">Active / Confirmed Trips</div>
            <div className="stat-val">{confirmedBookings.length}</div>
            <div className="stat-sub">100% GPS Monitored</div>
          </div>
          <div className="stat-icon green">
            <Truck size={24} />
          </div>
        </div>

        <div className="stat-card blue hover-lift">
          <div>
            <div className="stat-label">Registered Fleet Vehicles</div>
            <div className="stat-val">{TRANSPORT_PROVIDERS.length}</div>
            <div className="stat-sub">Tata Ace, Bolero, Reefer</div>
          </div>
          <div className="stat-icon blue">
            <Layers size={24} />
          </div>
        </div>

        <div className="stat-card green hover-lift">
          <div>
            <div className="stat-label">Total Freight Earnings</div>
            <div className="stat-val">₹28,400</div>
            <div className="stat-sub">Direct Escrow Payouts</div>
          </div>
          <div className="stat-icon green">
            <Coins size={24} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: INCOMING BOOKING REQUESTS & PRICE NEGOTIATIONS    */}
      {/* ------------------------------------------------------------- */}
      <div className="card" style={{ marginBottom: '32px', border: '1.5px solid #fed7aa', background: '#fffcf7' }}>
        <div className="card-header" style={{ borderBottom: '1px solid #fed7aa', paddingBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: '#ea580c',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.74rem',
                fontWeight: 800
              }}>
                <Truck size={13} />
                DISPATCH BOARD
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9a3412', margin: 0 }}>
                Incoming Transport Bookings & Price Negotiations
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#c2410c', margin: '4px 0 0' }}>
              Review customer trip routes (from where to where), confirm vehicle dispatch, or propose negotiated rates.
            </p>
          </div>

          <span className="badge badge-amber" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
            {transportBookings.length} Total Bookings
          </span>
        </div>

        {transportBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--slate-500)' }}>
            <p>No transport bookings recorded yet. Once a buyer books transport, it will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {transportBookings.map(booking => {
              const isPending = booking.status === 'Pending Transporter Confirmation';
              const isCountered = booking.status === 'Price Countered';
              const isConfirmed = booking.status === 'Confirmed' || booking.status === 'Vehicle Dispatched' || booking.status === 'In Transit';

              return (
                <div
                  key={booking.id}
                  style={{
                    background: '#ffffff',
                    border: isPending ? '2px solid #f97316' : (isCountered ? '1.5px solid #f59e0b' : '1px solid #e2e8f0'),
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Top Bar: Booking ID, Cargo & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: '#0f172a',
                        color: '#f8fafc',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.78rem'
                      }}>
                        #{booking.id}
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                        {booking.crop} • {booking.quantityKg.toLocaleString()} KG
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        Requested Vehicle: <strong style={{ color: '#0369a1' }}>{booking.vehicleType}</strong>
                      </span>
                    </div>

                    <div>
                      {isConfirmed ? (
                        <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                          <CheckCircle2 size={13} />
                          Booking Confirmed • {booking.status}
                        </span>
                      ) : isCountered ? (
                        <span className="badge badge-amber" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                          <Repeat size={13} />
                          Counter Sent: ₹{booking.counterFare} (Awaiting Buyer)
                        </span>
                      ) : (
                        <span className="badge badge-amber" style={{ fontSize: '0.8rem', padding: '4px 10px', background: '#ffedd5', color: '#c2410c' }}>
                          <Clock size={13} />
                          Awaiting Your Confirmation
                        </span>
                      )}
                    </div>
                  </div>

                  {/* VISUAL ROUTE CARD: FROM WHERE TO WHERE */}
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      {/* ORIGIN (FROM) */}
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                            FROM (Farm Gate Pickup)
                          </span>
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                          📍 {booking.fromLocation}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--slate-600)', display: 'block' }}>
                          Farmer: <strong>{booking.farmerName}</strong> ({booking.farmerPhone || '+91 98220 14892'})
                        </span>
                      </div>

                      {/* ROUTE ARROW & DISTANCE */}
                      <div style={{ textAlign: 'center', padding: '0 16px', minWidth: '130px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <Navigation size={12} />
                          <span>{booking.distanceKm || 28} KM</span>
                        </div>
                        <div style={{
                          height: '2px',
                          background: 'linear-gradient(90deg, #16a34a 0%, #0284c7 100%)',
                          position: 'relative',
                          margin: '6px 0'
                        }}>
                          <div style={{
                            position: 'absolute',
                            right: '-3px',
                            top: '-4px',
                            width: '0',
                            height: '0',
                            borderTop: '5px solid transparent',
                            borderBottom: '5px solid transparent',
                            borderLeft: '6px solid #0284c7'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', display: 'block' }}>
                          ~{booking.estimatedDuration || '1 hr 15 mins'}
                        </span>
                      </div>

                      {/* DESTINATION (TO) */}
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                            TO (Buyer Delivery Hub)
                          </span>
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                          🎯 {booking.toLocation}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--slate-600)', display: 'block' }}>
                          Buyer: <strong>{booking.buyerName}</strong> ({booking.buyerPhone || '+91 98902 44100'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details & Pricing Strip */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px',
                    paddingTop: '12px',
                    borderTop: '1px dashed #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem', color: 'var(--slate-600)', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.72rem' }}>Pickup Schedule:</span>
                        <strong style={{ color: 'var(--slate-800)' }}>
                          📅 {booking.pickupDate} ({booking.pickupTimeSlot})
                        </strong>
                      </div>

                      <div>
                        <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.72rem' }}>Buyer Proposed Fare:</span>
                        <strong style={{ color: '#16a34a', fontSize: '1.05rem' }}>
                          ₹{booking.offeredFare.toLocaleString()}
                        </strong>
                      </div>

                      {booking.vehicleRegNumber && (
                        <div>
                          <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.72rem' }}>Assigned Vehicle & Driver:</span>
                          <strong style={{ color: 'var(--slate-800)' }}>
                            🚚 {booking.vehicleRegNumber} • {booking.driverName}
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {isConfirmed ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => advanceTransportStep(booking.id)}
                            className="btn btn-primary btn-sm"
                            style={{ background: '#16a34a' }}
                          >
                            <span>Next Transit Step</span>
                            <ArrowRight size={13} />
                          </button>
                          <button
                            onClick={() => setActiveTab('logistics')}
                            className="btn btn-secondary btn-sm"
                          >
                            <span>Track Map</span>
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenConfirm(booking)}
                            className="btn btn-primary btn-sm"
                            style={{ background: '#16a34a', fontWeight: 800 }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Confirm Booking (₹{booking.offeredFare})</span>
                          </button>

                          <button
                            onClick={() => handleOpenNegotiate(booking)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontWeight: 700 }}
                          >
                            <Repeat size={14} />
                            <span>Negotiate Price</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* INLINE NEGOTIATION FORM */}
                  {negotiatingBookingId === booking.id && (
                    <div style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: '#fffbeb',
                      border: '1.5px solid #fde68a',
                      borderRadius: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.88rem', color: '#92400e' }}>
                          Negotiate / Propose Counter Fare to Buyer
                        </strong>
                        <button
                          onClick={() => setNegotiatingBookingId(null)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e' }}
                        >
                          ✕
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr auto', gap: '10px', alignItems: 'center' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.74rem', color: '#78350f', fontWeight: 700, marginBottom: '2px' }}>
                            Your Counter Price (₹):
                          </label>
                          <input
                            type="number"
                            value={counterPriceInput}
                            onChange={(e) => setCounterPriceInput(e.target.value)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #f59e0b', fontSize: '0.9rem', fontWeight: 800 }}
                            placeholder="e.g. 950"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.74rem', color: '#78350f', fontWeight: 700, marginBottom: '2px' }}>
                            Reason / Notes for Buyer:
                          </label>
                          <input
                            type="text"
                            value={counterReasonInput}
                            onChange={(e) => setCounterReasonInput(e.target.value)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #f59e0b', fontSize: '0.82rem' }}
                            placeholder="e.g. Toll charges & bad farm road conditions"
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '6px', paddingTop: '16px' }}>
                          <button
                            onClick={() => handleSendCounter(booking.id)}
                            className="btn btn-primary btn-sm"
                            style={{ background: '#b45309' }}
                          >
                            Send Counter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INLINE CONFIRMATION POPUP */}
                  {confirmingBookingId === booking.id && (
                    <div style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: '#f0fdf4',
                      border: '1.5px solid #86efac',
                      borderRadius: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.88rem', color: '#166534' }}>
                          Confirm Booking & Assign Fleet Vehicle / Driver
                        </strong>
                        <button
                          onClick={() => setConfirmingBookingId(null)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534' }}
                        >
                          ✕
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.74rem', color: '#166534', fontWeight: 700, marginBottom: '2px' }}>
                            Vehicle Reg Number:
                          </label>
                          <input
                            type="text"
                            value={assignVehicleReg}
                            onChange={(e) => setAssignVehicleReg(e.target.value)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '0.84rem', fontWeight: 700 }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.74rem', color: '#166534', fontWeight: 700, marginBottom: '2px' }}>
                            Driver Name:
                          </label>
                          <input
                            type="text"
                            value={assignDriverName}
                            onChange={(e) => setAssignDriverName(e.target.value)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '0.84rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.74rem', color: '#166534', fontWeight: 700, marginBottom: '2px' }}>
                            Driver Phone:
                          </label>
                          <input
                            type="text"
                            value={assignDriverPhone}
                            onChange={(e) => setAssignDriverPhone(e.target.value)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '0.84rem' }}
                          />
                        </div>

                        <div style={{ paddingTop: '16px' }}>
                          <button
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="btn btn-primary btn-sm"
                            style={{ background: '#15803d' }}
                          >
                            Dispatch Vehicle
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: REGISTERED FLEET VEHICLES & CAPACITY              */}
      {/* ------------------------------------------------------------- */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '18px', 
        flexWrap: 'wrap', 
        gap: '12px',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
        border: '1px solid #bbf7d0',
        borderRadius: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534', margin: 0 }}>
              {lang === 'mr' ? 'नोंदणीकृत ट्रान्सपोर्ट ताफा व वाहने' : 'Registered Transport Fleet & Capacity'}
            </h3>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              background: '#15803d', 
              color: '#ffffff', 
              padding: '2px 8px', 
              borderRadius: '9999px' 
            }}>
              {(fleetVehicles || TRANSPORT_PROVIDERS).length} Active Vehicles
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#166534', opacity: 0.9 }}>
            {lang === 'mr' 
              ? 'शेतमालाची जलद वाहतूक करण्यासाठी नवीन वाहने जोडा व भाडे व्यवस्थापित करा' 
              : 'Add commercial mini-trucks, pickups, and refrigerated vehicles ready for farm pickup'}
          </p>
        </div>

        <button 
          onClick={() => setIsAddVehicleModalOpen(true)}
          className="btn btn-primary"
          style={{ 
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', 
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '10px 18px',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderRadius: '12px'
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>{lang === 'mr' ? '+ नवीन वाहन जोडा' : '+ Add Your Vehicle'}</span>
        </button>
      </div>

      <div className="grid-3">
        {(fleetVehicles && fleetVehicles.length > 0 ? fleetVehicles : TRANSPORT_PROVIDERS).map(vehicle => (
          <div key={vehicle.id} className="card hover-lift" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '16px', overflow: 'hidden' }}>
            <div>
              {/* Vehicle Photo */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '140px',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '12px',
                backgroundColor: '#f1f5f9'
              }}>
                <img 
                  src={vehicle.image || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'} 
                  alt={vehicle.customName || vehicle.vehicleType} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  right: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                    Available
                  </span>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    fontSize: '0.78rem',
                    background: 'rgba(0,0,0,0.65)',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backdropFilter: 'blur(4px)'
                  }}>
                    <Star size={13} color="#f59e0b" fill="#f59e0b" />
                    <strong>{vehicle.rating || 5.0}</strong>
                  </div>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '8px',
                  right: '8px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontWeight: 600, truncate: true }}>{vehicle.providerName || 'Fleet Operator'}</span>
                  <span style={{ color: '#86efac', fontWeight: 700 }}>{vehicle.capacityKg} KG</span>
                </div>
              </div>

              {/* Title & Registration */}
              <div style={{ marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 2px 0' }}>
                  {vehicle.customName || vehicle.vehicleType}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.82rem', 
                    color: '#15803d', 
                    fontWeight: 800, 
                    letterSpacing: '0.5px',
                    display: 'inline-block',
                    background: '#dcfce7',
                    padding: '1px 7px',
                    borderRadius: '5px'
                  }}>
                    {vehicle.vehicleRegNumber}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {vehicle.vehicleType}
                  </span>
                </div>
              </div>

              {/* Feature Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                {vehicle.hasGps !== false && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: '#ecfdf5', color: '#047857', borderRadius: '4px', border: '1px solid #a7f3d0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Navigation size={10} /> Live GPS
                  </span>
                )}
                {vehicle.isInsured !== false && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '4px', border: '1px solid #bfdbfe', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={10} /> Insured
                  </span>
                )}
                {vehicle.hasReefer && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: '#ecfeff', color: '#0e7490', borderRadius: '4px', border: '1px solid #a5f3fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Snowflake size={10} /> Reefer
                  </span>
                )}
              </div>

              {/* Specs Box */}
              <div style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '0.8rem', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Driver:</span>
                  <strong>{vehicle.driverName} {vehicle.driverPhone && <span style={{ color: '#0284c7', fontWeight: 600 }}>({vehicle.driverPhone})</span>}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Standard Rate:</span>
                  <strong style={{ color: '#0f172a' }}>₹{vehicle.ratePerKm}/km + ₹{vehicle.baseFare || 300} base</strong>
                </div>
                {vehicle.currentLocation && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px dashed var(--slate-200)', marginTop: '4px' }}>
                    <span style={{ color: 'var(--slate-500)' }}>Base Hub:</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-700)', fontWeight: 600 }}>{vehicle.currentLocation}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                onClick={() => {
                  setAssignVehicleReg(vehicle.vehicleRegNumber);
                  setAssignDriverName(vehicle.driverName);
                  setAssignDriverPhone(vehicle.driverPhone || '+91 94223 90812');
                }}
                className="btn btn-secondary btn-sm"
                title="Use this vehicle for booking confirmation above"
                style={{ fontSize: '0.78rem' }}
              >
                <span>Select for Order</span>
              </button>

              <button 
                onClick={() => setActiveTab('logistics')}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.78rem', background: '#0f766e', borderColor: '#0f766e' }}
              >
                <span>Logistics Hub</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal />
    </div>
  );
};

