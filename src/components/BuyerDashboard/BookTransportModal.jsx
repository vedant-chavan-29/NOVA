import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { VEHICLE_OPTIONS } from '../../mockData';
import { calculateRoadDistanceOnline, POPULAR_ROUTE_PRESETS } from '../../utils/distanceService';
import { 
  X, 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Navigation, 
  CheckCircle2, 
  DollarSign, 
  Coins, 
  Package, 
  FileText, 
  AlertCircle, 
  Thermometer, 
  Sparkles,
  Loader2,
  RotateCw,
  Route,
  Zap,
  Check
} from 'lucide-react';

export const BookTransportModal = () => {
  const { 
    currentUser,
    isBookTransportModalOpen, 
    closeBookTransportModal, 
    selectedDealForTransport,
    createTransportBooking,
    lang, 
    t 
  } = useApp();

  const deal = selectedDealForTransport || {};

  // Form states
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [distanceKm, setDistanceKm] = useState(28);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Morning (08:00 AM - 11:00 AM)');
  const [selectedVehicleId, setSelectedVehicleId] = useState('VEH-ACE');
  const [customFare, setCustomFare] = useState('');
  const [notes, setNotes] = useState('');
  const isInitialMount = useRef(true);

  // Prefill data when modal opens
  useEffect(() => {
    if (deal && isBookTransportModalOpen) {
      const initialFrom = deal.pickupLocation || deal.farmerLocation || `${deal.farmerName || 'Farmer'} Farm Gate, Haveli, Pune`;
      const initialTo = deal.deliveryLocation || deal.buyerLocation || currentUser?.location || 'Sahyadri Mega Food Park, Chakan Industrial Zone, Pune';
      setFromLocation(initialFrom);
      setToLocation(initialTo);
      
      const defaultDate = deal.expectedDelivery || deal.pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
      setPickupDate(defaultDate);

      // Auto-select vehicle based on crop quantity
      const qty = Number(deal.quantity || deal.quantityRequested || 1000);
      if (qty <= 1500) {
        setSelectedVehicleId('VEH-ACE');
      } else if (qty <= 2500) {
        setSelectedVehicleId('VEH-BOLERO');
      } else {
        setSelectedVehicleId('VEH-EICHER');
      }

      // Automatically trigger initial online distance calculation
      triggerDistanceCalculation(initialFrom, initialTo);
    }
  }, [deal, currentUser, isBookTransportModalOpen]);

  // Online Road Distance Calculation function
  const triggerDistanceCalculation = async (from, to) => {
    if (!from || !to || from.trim().length < 3 || to.trim().length < 3) return;
    setIsCalculatingDistance(true);
    setRouteError(null);
    try {
      const result = await calculateRoadDistanceOnline(from, to);
      if (result && result.distanceKm) {
        setDistanceKm(result.distanceKm);
        setRouteInfo(result);
      }
    } catch (err) {
      console.warn("Distance calculation fallback error:", err);
      setRouteError("Using regional estimate");
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  // Debounced distance recalculation when fromLocation or toLocation is edited
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!fromLocation || !toLocation) return;

    const timer = setTimeout(() => {
      triggerDistanceCalculation(fromLocation, toLocation);
    }, 650);

    return () => clearTimeout(timer);
  }, [fromLocation, toLocation]);

  if (!isBookTransportModalOpen) return null;

  const currentVehicle = VEHICLE_OPTIONS.find(v => v.id === selectedVehicleId) || VEHICLE_OPTIONS[0];
  const calculatedFare = Math.round(currentVehicle.baseFare + (Number(distanceKm || 0) * currentVehicle.ratePerKm));
  const effectiveFare = customFare && !isNaN(customFare) ? Number(customFare) : calculatedFare;

  const handleSubmit = (e) => {
    e.preventDefault();
    createTransportBooking({
      orderId: deal.id || deal.orderId,
      lotId: deal.lotId,
      offerId: deal.offerId || deal.id,
      crop: deal.crop || 'Produce',
      quantityKg: deal.quantity || deal.quantityRequested || 1000,
      buyerId: currentUser?.id || deal.buyerId || 'BUYER-101',
      buyerName: currentUser?.organization || currentUser?.name || deal.buyerName || 'Verified Buyer',
      buyerPhone: currentUser?.phone || deal.buyerPhone || '+91 98902 44100',
      farmerId: deal.farmerId || 'FARMER-001',
      farmerName: deal.farmerName || 'Ramesh Patil',
      farmerPhone: deal.farmerPhone || '+91 98220 14892',
      fromLocation: fromLocation.trim(),
      fromDistrict: 'Pune',
      toLocation: toLocation.trim(),
      toDistrict: 'Pune',
      distanceKm: Number(distanceKm),
      estimatedDuration: routeInfo?.durationText || `${Math.round(distanceKm * 2.2)} mins`,
      highwayRoute: routeInfo?.highway || 'Maharashtra State Highway Corridor',
      routingEngine: routeInfo?.method || 'AgriLink GIS Routing',
      vehicleId: currentVehicle.id,
      vehicleType: currentVehicle.name,
      pickupDate,
      pickupTimeSlot: timeSlot,
      calculatedFare,
      offeredFare: effectiveFare,
      notes: notes.trim()
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: '20px 20px 0 0'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                background: '#16a34a',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Truck size={12} />
                AgriLink Logistics Fleet
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Deal #{deal.lotId || deal.id} • {deal.crop || 'Produce'} ({deal.quantity || deal.quantityRequested || 1000} KG)
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              {lang === 'mr' ? 'शेतकरी शेत ते खरेदीदार वाहतूक बुकिंग' : 'Book Farm-Gate Transport & Fleet Dispatch'}
            </h3>
          </div>

          <button
            onClick={closeBookTransportModal}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'background 0.15s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* 1. Places: From Where to Where with Online Distance Routing */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>1</span>
                <label style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  {lang === 'mr' ? 'वाहतूक मार्ग: कोठून ते कोठे (Online Road Distance Engine)' : 'Route & Places: From Where to Where (Live Map Distance)'}
                </label>
              </div>

              {isCalculatingDistance ? (
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: '#0284c7', 
                  background: '#e0f2fe', 
                  padding: '3px 8px', 
                  borderRadius: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Loader2 size={12} className="animate-spin" />
                  Calculating Distance Online...
                </span>
              ) : (
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: '#15803d', 
                  background: '#dcfce7', 
                  padding: '3px 8px', 
                  borderRadius: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Zap size={11} />
                  Auto-Calculated Online Distance
                </span>
              )}
            </div>

            {/* Quick Agricultural Corridors Presets */}
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                ⚡ {lang === 'mr' ? 'जलद मार्ग निवडा (1-Click Corridors):' : 'Popular Corridors (Click to Auto-Route & Recalculate):'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {POPULAR_ROUTE_PRESETS.map((preset, idx) => {
                  const isCurrent = fromLocation.includes(preset.from.split(' ')[0]) && toLocation.includes(preset.to.split(' ')[0]);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFromLocation(preset.from);
                        setToLocation(preset.to);
                        triggerDistanceCalculation(preset.from, preset.to);
                      }}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: isCurrent ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                        background: isCurrent ? '#f0f9ff' : '#ffffff',
                        color: isCurrent ? '#0369a1' : '#475569',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>{preset.label}</span>
                      {isCurrent && <Check size={11} color="#0284c7" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>
                    📍 {lang === 'mr' ? 'सुरुवात (Pickup From - शेतकरी शेत)' : 'Pickup Origin (From: Farmer Farm Gate)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g. Haveli Farm Gate, Pune or Nashik Mandi"
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Farmer: {deal.farmerName || 'Ramesh Patil'} ({deal.farmerPhone || '+91 98220 14892'})
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>
                    🎯 {lang === 'mr' ? 'गंतव्य (Delivery To - खरेदीदार गोदाम)' : 'Delivery Destination (To: Buyer Hub)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g. Sahyadri Mega Food Park, Chakan MIDC"
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Buyer: {deal.buyerName || currentUser?.name || 'Verified Buyer'}
                  </span>
                </div>
              </div>

              {/* Online Distance & Route Status Banner */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: isCalculatingDistance 
                  ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' 
                  : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: isCalculatingDistance ? '1px solid #7dd3fc' : '1px solid #86efac',
                marginTop: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      background: isCalculatingDistance ? '#0284c7' : '#15803d', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      {isCalculatingDistance ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: isCalculatingDistance ? '#0369a1' : '#166534' }}>
                          {isCalculatingDistance ? 'Routing in Progress...' : 'Live Calculated Road Distance:'}
                        </span>
                        <span style={{ 
                          fontSize: '1.05rem', 
                          fontWeight: 900, 
                          color: '#0f172a',
                          background: '#ffffff',
                          padding: '1px 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1'
                        }}>
                          {distanceKm} KM
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span>⏱️ Est. Drive: <strong>{routeInfo?.durationText || `~${Math.round(distanceKm * 2.2)} mins`}</strong></span>
                        <span>•</span>
                        <span>🛣️ {routeInfo?.highway || 'Maharashtra State Highway'}</span>
                        {routeInfo?.method && (
                          <>
                            <span>•</span>
                            <span style={{ color: '#15803d', fontWeight: 600 }}>Source: {routeInfo.method}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => triggerDistanceCalculation(fromLocation, toLocation)}
                      title="Recalculate distance using live map"
                      disabled={isCalculatingDistance}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 10px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCw size={12} className={isCalculatingDistance ? 'animate-spin' : ''} />
                      <span>Recalculate</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b' }}>
                      <span>Manual KM:</span>
                      <input
                        type="number"
                        min="1"
                        max="800"
                        value={distanceKm}
                        onChange={(e) => setDistanceKm(Number(e.target.value))}
                        style={{
                          width: '56px',
                          padding: '3px 6px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          textAlign: 'center',
                          background: '#ffffff'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.7rem', color: '#166534', marginTop: '6px', fontWeight: 600 }}>
                  ✓ All vehicle fleet options below have updated their fares for {distanceKm} KM in real-time.
                </div>
              </div>
            </div>
          </div>

          {/* 2. Booking Date & Time */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{
                background: '#0284c7',
                color: '#ffffff',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>2</span>
              <label style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                {lang === 'mr' ? 'वाहतूक तारीख व वेळ (Booking Date & Pickup Window)' : 'Booking Date & Time Schedule'}
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Pickup Date *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Pickup Time Slot *
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    'Morning (07:00 AM - 11:00 AM)',
                    'Afternoon (12:00 PM - 04:00 PM)',
                    'Evening (05:00 PM - 09:00 PM)'
                  ].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: timeSlot === slot ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        background: timeSlot === slot ? '#f0f9ff' : '#ffffff',
                        color: timeSlot === slot ? '#0369a1' : '#64748b',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Vehicle Selection Options */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>3</span>
                <label style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  {lang === 'mr' ? 'वाहन प्रकार निवडा (Select Vehicle Type)' : 'Vehicle Fleet Options & Capacity'}
                </label>
              </div>

              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                Produce: {deal.quantity || deal.quantityRequested || 1000} KG {deal.crop || 'Crop'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {VEHICLE_OPTIONS.map(veh => {
                const isSelected = selectedVehicleId === veh.id;
                const estPrice = Math.round(veh.baseFare + (distanceKm * veh.ratePerKm));
                const fitsCargo = veh.capacityKg >= Number(deal.quantity || deal.quantityRequested || 1000);

                return (
                  <div
                    key={veh.id}
                    onClick={() => setSelectedVehicleId(veh.id)}
                    style={{
                      border: isSelected ? '2px solid #16a34a' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '12px',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      boxShadow: isSelected ? '0 4px 12px rgba(22, 163, 74, 0.15)' : 'none'
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: '#16a34a'
                      }}>
                        <CheckCircle2 size={16} />
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{veh.imageIcon}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>
                          {lang === 'mr' ? veh.nameMr : veh.name}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: fitsCargo ? '#15803d' : '#d97706', fontWeight: 700 }}>
                          Capacity: {veh.capacityDisplay}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      background: isSelected ? 'rgba(22, 163, 74, 0.08)' : '#f8fafc',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '0.72rem',
                      color: '#475569',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span>Rate:</span>
                        <strong>₹{veh.ratePerKm}/km + ₹{veh.baseFare} base</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 800 }}>
                        <span>Est. Trip Fare:</span>
                        <span style={{ fontSize: '0.85rem' }}>₹{estPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      ✓ {veh.features[0]} • {veh.speed}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Price & Negotiation Setting */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{
                background: '#0284c7',
                color: '#ffffff',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>4</span>
              <label style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                {lang === 'mr' ? 'भाडे व दर प्रस्ताव (Prices & Proposed Booking Fare)' : 'Pricing & Fare Proposal'}
              </label>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                    Calculated Standard Rate ({distanceKm} km @ ₹{currentVehicle.ratePerKm}/km + ₹{currentVehicle.baseFare}):
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                    ₹{calculatedFare.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                    Includes driver allowance, fuel & transit insurance
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Your Proposed Booking Offer to Transporters (₹):
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b', fontWeight: 700, fontSize: '0.85rem' }}>₹</span>
                      <input
                        type="number"
                        min="100"
                        placeholder={calculatedFare.toString()}
                        value={customFare}
                        onChange={(e) => setCustomFare(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 24px',
                          borderRadius: '8px',
                          border: '1.5px solid #0284c7',
                          fontSize: '0.92rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          background: '#ffffff',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setCustomFare(calculatedFare.toString())}
                      style={{
                        padding: '9px 12px',
                        background: '#e2e8f0',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#475569',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Reset to Standard
                    </button>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Transporter has the option to confirm this rate or counter-negotiate.
                  </span>
                </div>
              </div>

              {/* Special Instructions */}
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Loading / Cargo Notes for Transporter & Driver (Optional):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cured onion sacks; driver should bring clean tarpaulin cover; farm gate accessible via road."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={closeBookTransportModal}
              className="btn btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                padding: '10px 24px',
                fontWeight: 800,
                fontSize: '0.92rem'
              }}
            >
              <Truck size={16} />
              <span>Submit Transport Booking (₹{effectiveFare.toLocaleString()})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
