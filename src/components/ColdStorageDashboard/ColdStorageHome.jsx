import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Warehouse, 
  Snowflake, 
  Thermometer, 
  Droplets, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  Coins, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Building2, 
  User, 
  Phone, 
  Truck, 
  AlertTriangle,
  Upload,
  Layers,
  MapPin,
  Sparkles,
  Zap,
  X
} from 'lucide-react';

export const ColdStorageHome = () => {
  const { 
    currentUser, 
    storageFacilities, 
    addStorageFacility, 
    storageBookings, 
    updateStorageBookingStatus, 
    setActiveTab, 
    lang, 
    t 
  } = useApp();

  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] = useState(false);

  // New Facility Form State
  const [facilityName, setFacilityName] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [totalCapacityMT, setTotalCapacityMT] = useState(2000);
  const [availableCapacityMT, setAvailableCapacityMT] = useState(1500);
  const [costPerKgPerDay, setCostPerKgPerDay] = useState(0.04);
  const [tempRange, setTempRange] = useState('0°C to 4°C');
  const [humidity, setHumidity] = useState('85-95% RH');
  const [suitableCrops, setSuitableCrops] = useState('Grapes, Pomegranates, Onions, Apples');
  const [accreditation, setAccreditation] = useState('WDRA & MahaAgri Certified Cold Chain Node');
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80');

  // Preset cold storage images
  const presetImages = [
    { label: 'Modern Multi-Chamber Cold Store', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80' },
    { label: 'Reefer Controlled Atmosphere Silo', url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80' },
    { label: 'Pre-cooling & Palletized Storage', url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80' },
    { label: 'Ventilated Agri Warehouse Vault', url: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80' }
  ];

  // Operator facilities
  const myFacilities = (storageFacilities || []).filter(f => 
    !f.ownerId || f.ownerId === currentUser?.id || f.ownerName === currentUser?.name
  );
  const displayedFacilities = myFacilities.length > 0 ? myFacilities : (storageFacilities || []);

  // Aggregated metrics
  const totalCapacity = displayedFacilities.reduce((sum, f) => sum + Number(f.totalCapacityMT || 0), 0);
  const availableCapacity = displayedFacilities.reduce((sum, f) => sum + Number(f.availableCapacityMT || 0), 0);
  const occupiedCapacity = Math.max(0, totalCapacity - availableCapacity);
  const occupancyPercent = totalCapacity > 0 ? Math.round((occupiedCapacity / totalCapacity) * 100) : 0;

  // Inbound reservations
  const activeBookings = (storageBookings || []);
  const totalRentalRevenue = activeBookings.reduce((sum, b) => sum + Number(b.totalCost || 0), 0);

  // File upload handler
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new facility
  const handleCreateFacility = (e) => {
    e.preventDefault();
    addStorageFacility({
      facilityName: facilityName.trim() || 'Sahyadri Premier Cold Chain Hub',
      location: location.trim() || `${district}, Maharashtra`,
      district,
      totalCapacityMT: Number(totalCapacityMT),
      availableCapacityMT: Number(availableCapacityMT),
      costPerKgPerDay: Number(costPerKgPerDay),
      storageType: `Climate Controlled Cold Storage (${tempRange})`,
      humidity,
      suitableCrops,
      accreditation,
      image: imagePreview
    });

    setIsAddFacilityModalOpen(false);
  };

  return (
    <div>
      {/* Cold Storage Facility Operator Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0e7490 0%, #0891b2 50%, #0284c7 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        color: '#ffffff',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              color: '#cffafe', 
              padding: '3px 10px', 
              borderRadius: '20px', 
              fontWeight: 800, 
              fontSize: '0.72rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Snowflake size={12} />
              Active Cold Chain Operator Node
            </span>
            <span style={{ fontSize: '0.78rem', color: '#e0f2fe', opacity: 0.9 }}>
              WDRA License: WDRA-MH-2026-9042
            </span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '2px 0 6px 0', color: '#ffffff' }}>
            {currentUser?.organization || 'Sahyadri Agro Cold Chain & Mega Warehousing'}
          </h2>

          <p style={{ fontSize: '0.88rem', color: '#e0f2fe', margin: 0, maxWidth: '680px' }}>
            {lang === 'mr'
              ? 'शेतकरी व खरेदीदारांच्या शेतीमालासाठी नियंत्रित तापमानाची शीतगृहे, सीए (Controlled Atmosphere) चेंबर्स व सुरक्षित एस्क्रो भाडे व्यवस्थापन.'
              : 'Managing multi-commodity cold chambers, controlled atmosphere vaults, and automated escrow rental settlements for farmers and institutional buyers.'}
          </p>
        </div>

        {/* Header Action: Add Storage Space */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsAddFacilityModalOpen(true)}
            className="btn"
            style={{
              background: '#ffffff',
              color: '#0891b2',
              fontWeight: 800,
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer'
            }}
          >
            <PlusCircle size={16} />
            <span>
              {lang === 'mr' ? '+ नवीन शीतगृह जागा नोंदवा' : '+ Upload Storage Space / Facility'}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {/* Total Capacity */}
        <div className="stat-card blue hover-lift" onClick={() => setActiveTab('facilities')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Total Cold Storage Capacity</div>
            <div className="stat-val">{totalCapacity.toLocaleString()} MT</div>
            <div className="stat-sub">{displayedFacilities.length} Licensed Facilities</div>
          </div>
          <div className="stat-icon blue">
            <Warehouse size={24} />
          </div>
        </div>

        {/* Available Space */}
        <div className="stat-card green hover-lift" onClick={() => setActiveTab('facilities')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Available Vacant Space</div>
            <div className="stat-val" style={{ color: '#0891b2' }}>{availableCapacity.toLocaleString()} MT</div>
            <div className="stat-sub">
              {100 - occupancyPercent}% Vacant • {occupancyPercent}% Occupied
            </div>
          </div>
          <div className="stat-icon green" style={{ background: '#ecfeff', color: '#0891b2' }}>
            <Snowflake size={24} />
          </div>
        </div>

        {/* Active Reservations */}
        <div className="stat-card amber hover-lift" onClick={() => setActiveTab('storageBookings')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Client Reservations</div>
            <div className="stat-val">{activeBookings.length}</div>
            <div className="stat-sub">From Farmers & Buyers</div>
          </div>
          <div className="stat-icon amber">
            <Calendar size={24} />
          </div>
        </div>

        {/* Rental Escrow Revenue */}
        <div className="stat-card green hover-lift" onClick={() => setActiveTab('transactions')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Rental Escrow Volume</div>
            <div className="stat-val" style={{ color: '#15803d' }}>₹{totalRentalRevenue.toLocaleString()}</div>
            <div className="stat-sub">100% Escrow Protected Payouts</div>
          </div>
          <div className="stat-icon green">
            <Coins size={24} />
          </div>
        </div>
      </div>

      {/* IoT Chamber Climate & Sensor Monitor Simulation */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <span className="card-title">
            <Activity size={18} color="#0891b2" />
            Live IoT Multi-Chamber Climate & Refrigeration Telemetry
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={12} />
              Diesel Genset Backup: 100% Ready
            </span>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '16px' }}>
          {/* Chamber A */}
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <strong style={{ fontSize: '0.98rem', color: '#0369a1' }}>Chamber 1: Cold Vault A</strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Perishable Fruits (Grapes, Berries)</span>
              </div>
              <span className="badge badge-green">Running Normal</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Temperature</span>
                <strong style={{ fontSize: '1.35rem', color: '#0369a1' }}>+0.8 °C</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Relative Humidity</span>
                <strong style={{ fontSize: '1.35rem', color: '#0891b2' }}>92 % RH</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Nitrogen Purge</span>
                <strong style={{ fontSize: '1.1rem', color: '#16a34a' }}>98.5 %</strong>
              </div>
            </div>
          </div>

          {/* Chamber B */}
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <strong style={{ fontSize: '0.98rem', color: '#047857' }}>Chamber 2: Curing Silo B</strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Onions, Potatoes & Garlic</span>
              </div>
              <span className="badge badge-green">Ventilating</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Temperature</span>
                <strong style={{ fontSize: '1.35rem', color: '#047857' }}>+12.4 °C</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Relative Humidity</span>
                <strong style={{ fontSize: '1.35rem', color: '#059669' }}>66 % RH</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Air Exchange</span>
                <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>Active ✓</strong>
              </div>
            </div>
          </div>

          {/* Chamber C */}
          <div style={{ background: '#fdf4ff', border: '1px solid #f0abfc', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <strong style={{ fontSize: '0.98rem', color: '#a21caf' }}>Chamber 3: Pre-Cooler Blast</strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Rapid Core Temperature Pull-Down</span>
              </div>
              <span className="badge badge-green">Chilling</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Target Temp</span>
                <strong style={{ fontSize: '1.35rem', color: '#a21caf' }}>-1.5 °C</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Pull-down Speed</span>
                <strong style={{ fontSize: '1.35rem', color: '#c026d3' }}>45 mins</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Ethylene Level</span>
                <strong style={{ fontSize: '1.1rem', color: '#16a34a' }}>0.01 ppm</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inbound Reservations Table */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <span className="card-title">
            <Calendar size={18} color="#15803d" />
            Inbound Farmer & Buyer Space Reservations
          </span>
          <button 
            onClick={() => setActiveTab('storageBookings')}
            className="btn btn-secondary btn-sm"
          >
            <span>View Full Ledger</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {activeBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--slate-500)' }}>
            <Warehouse size={40} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ margin: '0 0 4px', color: 'var(--slate-800)' }}>No Inbound Bookings Yet</h4>
            <p style={{ fontSize: '0.84rem', margin: 0 }}>
              When farmers or institutional buyers book space at your cold storage facilities, their reservation slips and escrow deposits will appear here.
            </p>
          </div>
        ) : (
          <div className="table-container" style={{ padding: 0 }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Client / Depositor</th>
                  <th>Commodity & Quantity</th>
                  <th>Duration & Facility</th>
                  <th>Total Storage Fee</th>
                  <th>Escrow Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeBookings.slice(0, 5).map(b => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: '#0891b2' }}>{b.id}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>
                        {b.bookingDate}
                      </span>
                    </td>

                    <td>
                      <strong>{b.bookedByName || b.farmerName || 'Registered Client'}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', display: 'block' }}>
                        Role: {b.bookedByRole?.toUpperCase() || 'CLIENT'} • {b.bookedByPhone || '+91 98220 14892'}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700 }}>{b.crop}</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)', display: 'block' }}>
                        {b.quantityKg?.toLocaleString()} KG ({Math.round(b.quantityKg / 1000)} MT)
                      </span>
                    </td>

                    <td>
                      <span>{b.days} Days Reservation</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', display: 'block' }}>
                        {b.facilityName}
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: '#15803d', fontSize: '0.95rem' }}>
                        ₹{b.totalCost?.toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={11} />
                        {b.paymentStatus || 'Escrow Secured'}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {b.status !== 'Checked-in' && b.status !== 'Released' && (
                          <button
                            onClick={() => updateStorageBookingStatus(b.id, 'Checked-in')}
                            className="btn btn-sm"
                            style={{ background: '#0891b2', color: '#fff', fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            Check-in
                          </button>
                        )}
                        {b.status === 'Checked-in' && (
                          <button
                            onClick={() => updateStorageBookingStatus(b.id, 'Released')}
                            className="btn btn-sm"
                            style={{ background: '#15803d', color: '#fff', fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            Release
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Upload New Cold Storage Facility & Space */}
      {isAddFacilityModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfeff', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Warehouse size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                    {lang === 'mr' ? 'नवीन शीतगृह जागा / युनिट नोंदणी' : 'Upload New Cold Storage Facility'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    List warehouse space for farmers & institutional buyers on AgriLink
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsAddFacilityModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFacility}>
              {/* Facility Name & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Cold Storage Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahyadri Ultra-Cool Vault & Silos"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    District / Region *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="Nashik">Nashik (नाशिक)</option>
                    <option value="Pune">Pune (पुणे)</option>
                    <option value="Ahmednagar">Ahmednagar (अहमदनगर)</option>
                    <option value="Solapur">Solapur (सोलापूर)</option>
                    <option value="Sangli">Sangli (सांगली)</option>
                    <option value="Satara">Satara (सातारा)</option>
                    <option value="Nagpur">Nagpur (नागपूर)</option>
                    <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar (छ. संभाजीनगर)</option>
                  </select>
                </div>
              </div>

              {/* Exact Address / Location */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                  Exact Storage Location & Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gat No. 42, Pimpalgaon Toll Post, Niphad, Nashik"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                />
              </div>

              {/* Capacity & Pricing */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Total Capacity (MT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    value={totalCapacityMT}
                    onChange={(e) => setTotalCapacityMT(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Available Space (MT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={availableCapacityMT}
                    onChange={(e) => setAvailableCapacityMT(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Rental Rate (₹/KG/Day) *
                  </label>
                  <input
                    type="number"
                    step="0.005"
                    required
                    value={costPerKgPerDay}
                    onChange={(e) => setCostPerKgPerDay(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--slate-500)' }}>
                    ₹{(costPerKgPerDay * 1000).toFixed(0)}/MT/Day
                  </span>
                </div>
              </div>

              {/* Climate & Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Temperature Range (°C)
                  </label>
                  <input
                    type="text"
                    value={tempRange}
                    onChange={(e) => setTempRange(e.target.value)}
                    className="form-control"
                    placeholder="-2°C to 4°C"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Humidity Spec (RH)
                  </label>
                  <input
                    type="text"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    className="form-control"
                    placeholder="85% - 95% RH"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Suitable Crops */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                  Suitable Crops / Produce Commodities
                </label>
                <input
                  type="text"
                  value={suitableCrops}
                  onChange={(e) => setSuitableCrops(e.target.value)}
                  className="form-control"
                  placeholder="Grapes, Pomegranates, Onions, Apples, Tomatoes, Potatoes"
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                />
              </div>

              {/* Photo Upload & Gallery */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  Facility Image / Photo *
                </label>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '90px', height: '65px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                  />

                  <div style={{ flex: 1 }}>
                    <label 
                      htmlFor="facilityPhotoFile" 
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Upload size={14} />
                      <span>Upload Photo from Computer</span>
                    </label>
                    <input 
                      id="facilityPhotoFile"
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageFileChange}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', display: 'block', marginTop: '4px' }}>
                      PNG, JPG up to 10MB
                    </span>
                  </div>
                </div>

                {/* Preset Options */}
                <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginBottom: '4px' }}>
                  Or select a standard cold storage preset:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {presetImages.map((p, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setImagePreview(p.url)}
                      style={{
                        border: imagePreview === p.url ? '2px solid #0891b2' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                      title={p.label}
                    >
                      <img src={p.url} alt={p.label} style={{ width: '100%', height: '40px', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--slate-200)', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddFacilityModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: '#0891b2', borderColor: '#0891b2', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Warehouse size={15} />
                  <span>Register & List Cold Storage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
