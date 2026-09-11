import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Warehouse, 
  Snowflake, 
  MapPin, 
  Star, 
  PlusCircle, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  Thermometer, 
  Droplets, 
  Trash2, 
  Search, 
  Check, 
  Upload, 
  X,
  ArrowRight
} from 'lucide-react';

export const ColdStorageFacilities = () => {
  const { 
    currentUser, 
    storageFacilities, 
    addStorageFacility, 
    deleteStorageFacility, 
    lang, 
    t 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [facilityName, setFacilityName] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [totalCapacityMT, setTotalCapacityMT] = useState(2500);
  const [availableCapacityMT, setAvailableCapacityMT] = useState(1800);
  const [costPerKgPerDay, setCostPerKgPerDay] = useState(0.04);
  const [tempRange, setTempRange] = useState('-1°C to 4°C');
  const [humidity, setHumidity] = useState('90-95% RH');
  const [suitableCrops, setSuitableCrops] = useState('Grapes, Pomegranates, Onions, Apples');
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80');

  const presetImages = [
    { label: 'Modern Multi-Chamber Cold Store', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80' },
    { label: 'Reefer Controlled Atmosphere Silo', url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80' },
    { label: 'Pre-cooling & Palletized Storage', url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80' },
    { label: 'Ventilated Agri Warehouse Vault', url: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80' }
  ];

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

  const handleCreateFacility = (e) => {
    e.preventDefault();
    addStorageFacility({
      facilityName: facilityName.trim() || 'Modern Agro Cold Storage Vault',
      location: location.trim() || `${district}, Maharashtra`,
      district,
      totalCapacityMT: Number(totalCapacityMT),
      availableCapacityMT: Number(availableCapacityMT),
      costPerKgPerDay: Number(costPerKgPerDay),
      storageType: `Climate Controlled Cold Storage (${tempRange})`,
      humidity,
      suitableCrops,
      image: imagePreview
    });

    setIsModalOpen(false);
  };

  // Filter facilities
  const filteredFacilities = (storageFacilities || []).filter(f => {
    const matchesDistrict = selectedDistrict === 'all' || 
      (f.district && f.district.toLowerCase() === selectedDistrict.toLowerCase()) ||
      (f.location && f.location.toLowerCase().includes(selectedDistrict.toLowerCase()));
    
    const matchesQuery = !searchQuery.trim() ||
      (f.facilityName && f.facilityName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.location && f.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.suitableCrops && f.suitableCrops.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDistrict && matchesQuery;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-green">
              <Snowflake size={12} />
              Cold Chain Infrastructure
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              WDRA & MahaAgri Accredited Warehouse Registry
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {lang === 'mr' ? 'माझी शीतगृहे व साठवणूक जागा' : 'My Cold Storage Facilities & Space'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
            Upload, update, and manage your commercial cold rooms, controlled atmosphere vaults, and warehouse capacity available for bookings.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ background: '#0891b2', borderColor: '#0891b2', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <PlusCircle size={16} />
          <span>{lang === 'mr' ? '+ नवीन शीतगृह जागा जोडा' : '+ Upload New Facility / Space'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>District Filter:</span>
          {['all', 'Nashik', 'Pune', 'Ahmednagar', 'Solapur', 'Sangli'].map(dist => (
            <button
              key={dist}
              onClick={() => setSelectedDistrict(dist)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedDistrict === dist ? '1px solid #0891b2' : '1px solid var(--slate-300)',
                background: selectedDistrict === dist ? '#ecfeff' : 'var(--slate-50)',
                color: selectedDistrict === dist ? '#0891b2' : 'var(--slate-700)'
              }}
            >
              {dist === 'all' ? 'All Districts' : dist}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search facility name or crop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px 6px 30px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-300)',
              background: 'var(--slate-50)'
            }}
          />
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid-2" style={{ gap: '24px', marginBottom: '32px' }}>
        {filteredFacilities.map(facility => {
          const totalMT = Number(facility.totalCapacityMT || 1000);
          const availMT = Number(facility.availableCapacityMT != null ? facility.availableCapacityMT : 600);
          const occupiedMT = Math.max(0, totalMT - availMT);
          const occupancyRate = Math.min(100, Math.round((occupiedMT / totalMT) * 100));

          return (
            <div 
              key={facility.id} 
              className="card hover-lift"
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Facility Image with Badges */}
              <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                <img
                  src={facility.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'}
                  alt={facility.facilityName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)'
                }} />

                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                  <span className="badge badge-green" style={{ background: '#15803d', color: '#ffffff' }}>
                    <ShieldCheck size={12} />
                    WDRA Certified
                  </span>
                  <span className="badge badge-blue" style={{ background: '#0284c7', color: '#ffffff' }}>
                    <Snowflake size={12} />
                    Active Cooling
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 2px' }}>
                    {facility.facilityName}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#38bdf8" />
                    {facility.location}
                  </span>
                </div>
              </div>

              {/* Facility Specs & Capacity */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Occupancy Meter */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--slate-600)' }}>Capacity Utilization</span>
                      <strong>{occupiedMT.toLocaleString()} MT / {totalMT.toLocaleString()} MT ({occupancyRate}%)</strong>
                    </div>
                    <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${occupancyRate}%`,
                        background: occupancyRate > 80 ? '#f59e0b' : '#0891b2',
                        borderRadius: '5px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#0891b2', marginTop: '4px', fontWeight: 700 }}>
                      <span>✓ {availMT.toLocaleString()} MT Available for Booking</span>
                      <span style={{ color: '#64748b' }}>Rate: ₹{facility.costPerKgPerDay}/KG/Day</span>
                    </div>
                  </div>

                  {/* Storage Specs Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'var(--slate-50)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.7rem' }}>Temperature Spec</span>
                      <strong style={{ color: '#0369a1' }}>{facility.storageType?.split('(')[1]?.replace(')', '') || '0°C to 4°C'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.7rem' }}>Relative Humidity</span>
                      <strong style={{ color: '#0891b2' }}>{facility.humidity || '85-95% RH'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.7rem' }}>Daily Unit Rent</span>
                      <strong style={{ color: '#15803d' }}>₹{(facility.costPerKgPerDay * 1000).toFixed(0)} / Metric Ton</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.7rem' }}>Security & Insurance</span>
                      <strong style={{ color: '#16a34a' }}>100% Insured ✓</strong>
                    </div>
                  </div>

                  {/* Suitable Crops Tags */}
                  {facility.suitableCrops && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                        Suitable Commodities:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {facility.suitableCrops.split(',').map((crop, i) => (
                          <span key={i} style={{ background: '#ecfeff', color: '#0891b2', padding: '2px 8px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 600 }}>
                            {crop.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)' }}>
                    Facility ID: <strong>{facility.id}</strong>
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {facility.ownerId === currentUser?.id && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete facility ${facility.facilityName}?`)) {
                            deleteStorageFacility(facility.id);
                          }
                        }}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Delete Facility"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>Update Space</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Facility Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfeff', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Warehouse size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                    Add New Cold Storage Facility
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    List warehouse space for farmers & institutional buyers on AgriLink
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFacility}>
              {/* Facility Name & District */}
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

              {/* Exact Location */}
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

              {/* Capacities & Pricing */}
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

              {/* Climate Specs */}
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
                      htmlFor="facilityFileField" 
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Upload size={14} />
                      <span>Upload Photo from Computer</span>
                    </label>
                    <input 
                      id="facilityFileField"
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
                  onClick={() => setIsModalOpen(false)}
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
