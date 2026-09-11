import React, { useState } from 'react';
import { useApp, isUserLot } from '../../context/AppContext';
import { STORAGE_PROVIDERS, VEHICLE_OPTIONS } from '../../mockData';
import { 
  Building2, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  Calculator, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  Truck,
  Snowflake,
  Clock,
  AlertCircle,
  X,
  Navigation,
  Check,
  Package,
  PhoneCall,
  Warehouse
} from 'lucide-react';

export const StorageMarketplace = () => {
  const { 
    currentUser, 
    lots, 
    lang, 
    t, 
    storageBookings, 
    setStorageBookings, 
    storageFacilities,
    bookStorage, 
    createTransportBooking, 
    pushNotification, 
    showConfirmation 
  } = useApp();

  // Dynamic storage facilities list
  const facilitiesList = (storageFacilities && storageFacilities.length > 0) ? storageFacilities : STORAGE_PROVIDERS;

  // Holding ROI simulator states
  const [holdingDays, setHoldingDays] = useState(15);
  const [holdingQuantityKg, setHoldingQuantityKg] = useState(1000);
  const [currentSpotPrice, setCurrentSpotPrice] = useState(24.8);
  const [projectedFuturePrice, setProjectedFuturePrice] = useState(28.6);
  const [selectedFacilityId, setSelectedFacilityId] = useState(facilitiesList[0]?.id || 'STORE-301');

  // Direct Storage Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedFacilityForBooking, setSelectedFacilityForBooking] = useState(null);
  const [bookingCrop, setBookingCrop] = useState('Onion');
  const [bookingQtyKg, setBookingQtyKg] = useState(1000);
  const [bookingDays, setBookingDays] = useState(15);
  const [bookingPaymentMode, setBookingPaymentMode] = useState('UPI Instant Escrow');

  // Cold Storage Transport Booking Modal States
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [selectedFacilityForTransport, setSelectedFacilityForTransport] = useState(null);
  const [targetReservation, setTargetReservation] = useState(null);

  // Farmer's lots for transport selection
  const farmerLots = (lots || []).filter(l => isUserLot(l, currentUser));
  const availableLots = farmerLots.length > 0 ? farmerLots : (lots || []);

  const [transportLotId, setTransportLotId] = useState(availableLots[0]?.id || '');
  const [transportCrop, setTransportCrop] = useState(availableLots[0]?.crop || 'Onion');
  const [transportQuantity, setTransportQuantity] = useState(1000);
  const [pickupLocation, setPickupLocation] = useState(currentUser?.location || 'Haveli, Pune, Maharashtra');
  const [selectedVehicleId, setSelectedVehicleId] = useState('VEH-REEFER'); // Default to Cold Chain Reefer
  const [pickupDate, setPickupDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [pickupTimeSlot, setPickupTimeSlot] = useState('Morning (07:00 AM - 10:00 AM)');
  const [transportNotes, setTransportNotes] = useState('Cold chain produce, maintain 0°C to 4°C active cooling.');

  const selectedFacility = facilitiesList.find(s => s.id === selectedFacilityId) || facilitiesList[0];

  // Calculations
  const dailyFeePerKg = selectedFacility.costPerKgPerDay;
  const totalStorageFee = Math.round(dailyFeePerKg * holdingQuantityKg * holdingDays);
  const storageFeePerKg = (totalStorageFee / holdingQuantityKg).toFixed(2);
  const projectedGrossAppreciation = Math.round((projectedFuturePrice - currentSpotPrice) * holdingQuantityKg);
  const netStorageProfit = projectedGrossAppreciation - totalStorageFee;
  const isProfitable = netStorageProfit > 0;

  const handleOpenBookingModal = (facility) => {
    setSelectedFacilityForBooking(facility);
    setBookingQtyKg(holdingQuantityKg);
    setBookingDays(holdingDays);
    setBookingCrop(availableLots[0]?.crop || 'Onion');
    setIsBookingModalOpen(true);
  };

  const handleConfirmStorageBooking = (e) => {
    if (e) e.preventDefault();
    if (!selectedFacilityForBooking) return;

    bookStorage(selectedFacilityForBooking.id, bookingQtyKg, bookingDays, {
      crop: bookingCrop,
      paymentMode: bookingPaymentMode
    });

    setIsBookingModalOpen(false);
  };

  // Open Transport Booking Modal for a Facility
  const handleOpenTransportModal = (facility, reservation = null) => {
    setSelectedFacilityForTransport(facility);
    setTargetReservation(reservation);
    if (reservation) {
      setTransportCrop(reservation.crop);
      setTransportQuantity(reservation.quantityKg);
    }
    setIsTransportModalOpen(true);
  };

  // Selected vehicle details and fare calculation
  const selectedVehicle = VEHICLE_OPTIONS.find(v => v.id === selectedVehicleId) || VEHICLE_OPTIONS[1]; // VEH-REEFER or fallback
  const facilityDistanceKm = selectedFacilityForTransport?.distanceKm || 20;
  const calculatedTransportFare = (selectedVehicle?.baseFare || 600) + ((selectedVehicle?.ratePerKm || 25) * facilityDistanceKm);

  // Submit Cold Storage Transport Booking
  const handleConfirmTransportBooking = (e) => {
    if (e) e.preventDefault();
    if (!selectedFacilityForTransport) return;

    const bookingId = `TRB-CS-${Date.now().toString().slice(-4)}`;

    // Create platform transport booking
    createTransportBooking({
      id: bookingId,
      crop: transportCrop,
      quantityKg: Number(transportQuantity),
      fromLocation: pickupLocation,
      fromDistrict: pickupLocation.split(',')?.[1]?.trim() || 'Pune',
      toLocation: `${selectedFacilityForTransport.facilityName}, ${selectedFacilityForTransport.location}`,
      toDistrict: selectedFacilityForTransport.location.split(',')?.[1]?.trim() || 'Pune',
      distanceKm: facilityDistanceKm,
      vehicleId: selectedVehicle.id,
      vehicleType: selectedVehicle.name,
      pickupDate,
      pickupTimeSlot,
      calculatedFare: calculatedTransportFare,
      offeredFare: calculatedTransportFare,
      finalAgreedFare: calculatedTransportFare,
      notes: transportNotes || `Farm-to-Cold-Storage shipment to ${selectedFacilityForTransport.facilityName}.`
    });

    // If booking was for a specific active storage reservation, link it
    if (targetReservation && setStorageBookings) {
      setStorageBookings(prev => prev.map(b => {
        if (b.id === targetReservation.id) {
          return {
            ...b,
            hasTransport: true,
            transportBookingId: bookingId,
            transportVehicle: selectedVehicle.name,
            transportVehicleReg: selectedVehicle.id === 'VEH-REEFER' ? 'MH-12-RC-8812' : 'MH-12-QZ-4592',
            driverName: selectedVehicle.id === 'VEH-REEFER' ? 'Dnyaneshwar More' : 'Tukaram Shinde',
            driverPhone: selectedVehicle.id === 'VEH-REEFER' ? '+91 97621 11309' : '+91 94223 90812',
            transportFare: calculatedTransportFare,
            pickupDate,
            pickupTimeSlot,
            transportStatus: 'Transport Confirmed'
          };
        }
        return b;
      }));
    }

    setIsTransportModalOpen(false);

    pushNotification(
      "Cold Storage Transport Booked!",
      `Vehicle ${selectedVehicle.name} confirmed for ${transportQuantity} KG ${transportCrop} from farm to ${selectedFacilityForTransport.facilityName} on ${pickupDate}.`,
      "शीतगृहासाठी वाहतूक बुकिंग निश्चित झाली!",
      "success"
    );

    showConfirmation(
      "Cold Storage Transport Booked",
      `Vehicle assigned. Farm-gate pickup scheduled on ${pickupDate} (${pickupTimeSlot}) to ${selectedFacilityForTransport.facilityName}.`,
      "success"
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-amber">
            <Calculator size={12} />
            Post-Harvest Storage & Cold Chain Transport
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            WDRA Certified Cold Stores & Dedicated Farm-Gate Logistics
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'शीतगृह बाजारपेठ व थेट शेतातून वाहतूक' : lang === 'hi' ? 'कोल्ड स्टोरेज व खेत से परिवहन' : 'Cold Storage Marketplace & Farm-Gate Transport'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          Evaluate warehouse holding gains and <strong>book refrigerated cold-chain transport</strong> directly from your farm gate to certified cold storage vaults.
        </p>
      </div>

      {/* Storage ROI Decision Simulator Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        border: '1px solid #334155',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#fef08a" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              AI Storage vs. Immediate Sale Decision Matrix
            </h3>
          </div>
          <span className={`badge ${isProfitable ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
            {isProfitable ? 'RECOMMENDED: STORE IN COLD VAULT' : 'RECOMMENDED: SELL IMMEDIATELY'}
          </span>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Holding Duration (Days)
            </label>
            <input 
              type="number"
              className="form-control"
              style={{ background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
              value={holdingDays}
              onChange={(e) => setHoldingDays(Math.max(1, Number(e.target.value)))}
              min="1"
              max="90"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Produce Quantity (KG)
            </label>
            <input 
              type="number"
              className="form-control"
              style={{ background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
              value={holdingQuantityKg}
              onChange={(e) => setHoldingQuantityKg(Math.max(100, Number(e.target.value)))}
              step="100"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Current Spot Price (₹/KG)
            </label>
            <input 
              type="number"
              className="form-control"
              style={{ background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
              value={currentSpotPrice}
              onChange={(e) => setCurrentSpotPrice(Number(e.target.value))}
              step="0.5"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Projected Price in {holdingDays}d (₹/KG)
            </label>
            <input 
              type="number"
              className="form-control"
              style={{ background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
              value={projectedFuturePrice}
              onChange={(e) => setProjectedFuturePrice(Number(e.target.value))}
              step="0.5"
            />
          </div>
        </div>

        {/* Dynamic ROI Calculation Breakdown Strip */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>
              Storage Cost for {holdingDays} Days
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>
              – ₹{totalStorageFee.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
              (₹{storageFeePerKg} / KG fee)
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>
              Expected Price Gain
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80' }}>
              + ₹{projectedGrossAppreciation.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
              (+₹{(projectedFuturePrice - currentSpotPrice).toFixed(2)} / KG)
            </span>
          </div>

          <div style={{
            background: isProfitable ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1.5px solid ${isProfitable ? '#22c55e' : '#ef4444'}`,
            borderRadius: 'var(--radius-md)',
            padding: '10px 20px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, color: isProfitable ? '#86efac' : '#fca5a5', display: 'block' }}>
              Net Farmer Holding Profit
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isProfitable ? '#4ade80' : '#f87171' }}>
              {isProfitable ? '+' : ''}₹{netStorageProfit.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#ffffff' }}>
              Net Benefit: ₹{(netStorageProfit / holdingQuantityKg).toFixed(2)} / KG
            </span>
          </div>
        </div>
      </div>

      {/* Confirmed Bookings List with Cold Storage Transport Status */}
      {storageBookings && storageBookings.length > 0 && (
        <div className="card" style={{ marginBottom: '28px', padding: '20px', border: '1.5px solid #22c55e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span className="badge badge-green">
                Active Cold Vault Reservations
              </span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: '4px 0 0' }}>
                My Reserved Storage & Farm-to-Store Logistics Status
              </h4>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {storageBookings.length} Active Reservations
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {storageBookings.map((b, idx) => {
              const facility = STORAGE_PROVIDERS.find(s => s.id === b.facilityId) || STORAGE_PROVIDERS[0];

              return (
                <div 
                  key={idx} 
                  style={{ 
                    background: '#f8fafc', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    padding: '16px',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: '14px' 
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>{b.facilityName}</strong>
                      <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>Storage Confirmed</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '6px' }}>
                      {b.quantityKg.toLocaleString()} KG {b.crop} • {b.days} Days Reservation • Total Rent: <strong>₹{b.totalCost.toLocaleString()}</strong>
                    </div>

                    {/* Transport Link Status */}
                    {b.hasTransport ? (
                      <div style={{
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.78rem',
                        color: '#15803d'
                      }}>
                        <Truck size={14} color="#16a34a" />
                        <span>
                          <strong>{b.transportStatus}:</strong> {b.transportVehicle} ({b.transportVehicleReg}) • Driver: {b.driverName} ({b.driverPhone})
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: '#b45309', background: '#fef3c7', padding: '3px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertCircle size={12} />
                          Farm-to-Cold-Storage Transport Not Booked
                        </span>
                        <button
                          onClick={() => handleOpenTransportModal(facility, b)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.74rem', padding: '4px 10px', fontWeight: 700 }}
                        >
                          <Truck size={13} />
                          <span>Book Transport for this Reservation</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Booking ID: {b.id}</span>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>WDRA Certified Insured</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Storage Facilities Directory */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '16px' }}>
        Nearby Certified Cold Storage Facilities
      </h3>

      <div className="grid-2">
        {facilitiesList.map(facility => (
          <div key={facility.id} className="card hover-lift" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Optional Facility Image Banner */}
            {facility.image && (
              <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                <img
                  src={facility.image}
                  alt={facility.facilityName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)'
                }} />
                <span className="badge badge-green" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  WDRA Certified
                </span>
              </div>
            )}

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className="badge badge-blue" style={{ marginBottom: '6px' }}>
                      {facility.storageType}
                    </span>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: '2px 0' }}>
                      {facility.facilityName}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} />
                        {facility.location} ({facility.distanceKm} km away)
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={13} color="#f59e0b" fill="#f59e0b" />
                        <strong>{facility.rating}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                      Daily Rent
                    </span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#16a34a' }}>
                      ₹{facility.costPerKgPerDay}
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--slate-500)' }}> /KG/day</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.82rem', color: 'var(--slate-700)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Available Space:</span>
                    <strong>{facility.availableCapacityMT} MT / {facility.totalCapacityMT} MT</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Certification:</span>
                    <strong>{facility.accreditation}</strong>
                  </div>
                  <p style={{ margin: '6px 0 0 0', color: '#15803d', fontWeight: 600, fontSize: '0.78rem' }}>
                    ✓ {facility.roiSummary}
                  </p>
                </div>

                {facility.suitableCrops && (
                  <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {facility.suitableCrops.split(',').map((c, idx) => (
                      <span key={idx} style={{ background: '#ecfeff', color: '#0891b2', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 600 }}>
                        {c.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 2 Action Buttons: Book Storage Space AND Book Transport */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button 
                  onClick={() => handleOpenBookingModal(facility)}
                  className="btn btn-secondary"
                  style={{ fontWeight: 700, fontSize: '0.82rem', justifyContent: 'center' }}
                >
                  <CheckCircle2 size={15} />
                  <span>Book Storage Space</span>
                </button>

                <button 
                  onClick={() => handleOpenTransportModal(facility)}
                  className="btn btn-primary"
                  style={{ fontWeight: 800, fontSize: '0.82rem', justifyContent: 'center' }}
                >
                  <Truck size={15} />
                  <span>Book Transport to Store</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* DIRECT STORAGE ESCROW BOOKING MODAL                                       */}
      {/* ========================================================================= */}
      {isBookingModalOpen && selectedFacilityForBooking && (
        <div className="modal-overlay" style={{ zIndex: 1050 }}>
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Warehouse size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                    Reserve Cold Storage Space
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                    {selectedFacilityForBooking.facilityName}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmStorageBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Commodity / Crop
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingCrop}
                    onChange={(e) => setBookingCrop(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Deposit Quantity (KG)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={bookingQtyKg}
                    onChange={(e) => setBookingQtyKg(Number(e.target.value))}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Reservation Duration (Days)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="180"
                    value={bookingDays}
                    onChange={(e) => setBookingDays(Number(e.target.value))}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Escrow Payment Gateway
                  </label>
                  <select
                    value={bookingPaymentMode}
                    onChange={(e) => setBookingPaymentMode(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="UPI Instant Escrow">UPI Instant Escrow</option>
                    <option value="Direct DBT Transfer">Direct DBT Bank Transfer</option>
                    <option value="e-NAM Clearing Trust">SBI e-NAM Clearing Trust</option>
                  </select>
                </div>
              </div>

              {/* Total Rental Fee Banner */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', color: '#166534', fontWeight: 700 }}>
                    Total Storage Rental Fee:
                  </span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d' }}>
                    ₹{Math.round((selectedFacilityForBooking.costPerKgPerDay || 0.04) * bookingQtyKg * bookingDays).toLocaleString()}
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#15803d', display: 'block', marginTop: '2px' }}>
                  ✓ Secured in Triple-Lock Escrow Vault until produce check-in
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldCheck size={16} />
                  <span>Confirm Space & Deposit Escrow</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COLD STORAGE TRANSPORT BOOKING MODAL                                     */}
      {/* ========================================================================= */}
      {isTransportModalOpen && selectedFacilityForTransport && (
        <div className="modal-overlay" style={{ zIndex: 1050 }}>
          <div className="modal-content modal-lg" style={{ maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setIsTransportModalOpen(false)} 
              className="modal-close"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                <Truck size={13} />
                <span>Farm-to-Cold-Storage Logistics Booking</span>
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--slate-900)', margin: 0 }}>
                Book Farm Pickup & Transport to {selectedFacilityForTransport.facilityName}
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                Dispatch a dedicated cold-chain reefer van or carrier truck directly from your farm gate.
              </p>
            </div>

            <form onSubmit={handleConfirmTransportBooking}>
              {/* Origin & Destination Display Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> 1. Pickup Origin (Farm Gate)
                  </span>
                  <input 
                    type="text"
                    className="form-control"
                    style={{ marginTop: '6px', fontSize: '0.85rem', fontWeight: 600 }}
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Enter Farm Gate / Village Address"
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Driver will navigate directly to this farm location.
                  </span>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={12} /> 2. Delivery Destination (Cold Vault)
                  </span>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0f172a', marginTop: '6px' }}>
                    {selectedFacilityForTransport.facilityName}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {selectedFacilityForTransport.location} ({selectedFacilityForTransport.distanceKm} km from cluster)
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                    ✓ Pre-cleared loading bay reserved
                  </span>
                </div>
              </div>

              {/* Produce & Quantity Selection */}
              <div className="grid-2" style={{ marginBottom: '18px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Select Harvest Lot / Produce Name *
                  </label>
                  {availableLots.length > 0 ? (
                    <select
                      className="form-control form-select"
                      value={transportLotId}
                      onChange={(e) => {
                        setTransportLotId(e.target.value);
                        const found = availableLots.find(l => l.id === e.target.value);
                        if (found) {
                          setTransportCrop(found.crop);
                          setTransportQuantity(found.quantity);
                        }
                      }}
                      style={{ fontWeight: 700 }}
                    >
                      {availableLots.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.crop} ({l.variety}) — {l.quantity} {l.unit} [Grade {l.grade}]
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text"
                      className="form-control"
                      value={transportCrop}
                      onChange={(e) => setTransportCrop(e.target.value)}
                      placeholder="e.g. Onion, Tomato, Pomegranate..."
                      required
                    />
                  )}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Produce Volume to Transport (KG) *
                  </label>
                  <input 
                    type="number"
                    className="form-control"
                    value={transportQuantity}
                    onChange={(e) => setTransportQuantity(Math.max(50, Number(e.target.value)))}
                    min="50"
                    step="50"
                    required
                  />
                </div>
              </div>

              {/* Vehicle Options Selection Grid (Including Cold Chain Reefer) */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={15} color="#16a34a" />
                  <span>Choose Transport Carrier (वाहन प्रकार निवडा):</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {/* Option 1: Cold Chain Reefer (Recommended for Cold Storage) */}
                  <div
                    onClick={() => setSelectedVehicleId('VEH-REEFER')}
                    style={{
                      border: selectedVehicleId === 'VEH-REEFER' ? '2.5px solid #0284c7' : '1px solid #cbd5e1',
                      background: selectedVehicleId === 'VEH-REEFER' ? '#f0f9ff' : '#ffffff',
                      borderRadius: '10px',
                      padding: '12px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#0284c7',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      RECOMMENDED
                    </span>
                    <div style={{ fontSize: '1.4rem' }}>❄️</div>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>
                      Refrigerated Reefer Van (3.5 MT)
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                      0°C to 4°C Active Cold Chain • Zero Thermal Shock
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 800, marginTop: '4px' }}>
                      ₹32 / km + ₹750 base
                    </div>
                  </div>

                  {/* Option 2: Tata Ace Gold */}
                  <div
                    onClick={() => setSelectedVehicleId('VEH-ACE')}
                    style={{
                      border: selectedVehicleId === 'VEH-ACE' ? '2.5px solid #16a34a' : '1px solid #cbd5e1',
                      background: selectedVehicleId === 'VEH-ACE' ? '#f0fdf4' : '#ffffff',
                      borderRadius: '10px',
                      padding: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '1.4rem' }}>🚚</div>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>
                      Tata Ace Gold (1.5 MT)
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      Fast Farm-Gate Access • Ideal for Onion & Potato
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 800, marginTop: '4px' }}>
                      ₹18 / km + ₹300 base
                    </div>
                  </div>

                  {/* Option 3: Mahindra Bolero Maxi Truck */}
                  <div
                    onClick={() => setSelectedVehicleId('VEH-BOLERO')}
                    style={{
                      border: selectedVehicleId === 'VEH-BOLERO' ? '2.5px solid #16a34a' : '1px solid #cbd5e1',
                      background: selectedVehicleId === 'VEH-BOLERO' ? '#f0fdf4' : '#ffffff',
                      borderRadius: '10px',
                      padding: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '1.4rem' }}>🚛</div>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>
                      Mahindra Bolero Maxi (2.5 MT)
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      Heavy Rural Springs • Crates & High-Side Tarpaulin
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 800, marginTop: '4px' }}>
                      ₹22 / km + ₹450 base
                    </div>
                  </div>

                  {/* Option 4: Eicher Pro Canter */}
                  <div
                    onClick={() => setSelectedVehicleId('VEH-EICHER')}
                    style={{
                      border: selectedVehicleId === 'VEH-EICHER' ? '2.5px solid #16a34a' : '1px solid #cbd5e1',
                      background: selectedVehicleId === 'VEH-EICHER' ? '#f0fdf4' : '#ffffff',
                      borderRadius: '10px',
                      padding: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '1.4rem' }}>🚚</div>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>
                      Eicher Pro Canter (5.0 MT)
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      Bulk Farm Aggregation • Enclosed Weatherproof Deck
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 800, marginTop: '4px' }}>
                      ₹28 / km + ₹600 base
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Schedule & Slots */}
              <div className="grid-2" style={{ marginBottom: '18px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Pickup Date (उचलण्याची तारीख) *
                  </label>
                  <input 
                    type="date"
                    className="form-control"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Pickup Time Slot (वेळ) *
                  </label>
                  <select
                    className="form-control form-select"
                    value={pickupTimeSlot}
                    onChange={(e) => setPickupTimeSlot(e.target.value)}
                  >
                    <option value="Morning (07:00 AM - 10:00 AM)">Morning (07:00 AM - 10:00 AM)</option>
                    <option value="Noon (11:00 AM - 02:00 PM)">Noon (11:00 AM - 02:00 PM)</option>
                    <option value="Evening (03:00 PM - 06:00 PM)">Evening (03:00 PM - 06:00 PM)</option>
                    <option value="Night Cold Transit (08:00 PM - 11:00 PM)">Night Cold Transit (08:00 PM - 11:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Total Fare Breakdown Card */}
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                    Calculated Transit Fare ({facilityDistanceKm} KM distance)
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d' }}>
                    ₹{calculatedTransportFare.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#475569' }}>
                    Includes driver loading support, GPS monitoring & transit insurance
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                    Guaranteed Same-Day Docking
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsTransportModalOpen(false)}
                  className="btn btn-secondary"
                >
                  <X size={15} />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ fontWeight: 900 }}
                >
                  <CheckCircle2 size={18} />
                  <span>Confirm & Book Cold Storage Transport</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
