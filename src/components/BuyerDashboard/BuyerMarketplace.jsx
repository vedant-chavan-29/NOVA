import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DISTRICTS } from '../../mockData';
import { 
  Store, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Tag, 
  Eye, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Building2,
  Lock,
  Camera,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const BuyerMarketplace = () => {
  const { 
    lots, 
    cropsCatalog,
    lang, 
    t, 
    setSelectedLotForOffer, 
    setIsMakeOfferModalOpen 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'Fruit' | 'Vegetable' | 'Crop'
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [maxPrice, setMaxPrice] = useState(250);

  // 4-Photo Lightbox Modal for Buyers
  const [inspectedLot, setInspectedLot] = useState(null);
  const [inspectedPhotoIndex, setInspectedPhotoIndex] = useState(0);

  const angleTitles = [
    'Angle 1: Overall Harvest & Batch View',
    'Angle 2: Surface & Skin Inspection',
    'Angle 3: Caliber / Sizing Measurement',
    'Angle 4: Cross-section / Internal Core'
  ];

  // Filter lots
  const filteredLots = lots.filter(lot => {
    // text search
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      lot.crop?.toLowerCase().includes(q) ||
      lot.farmerName?.toLowerCase().includes(q) ||
      lot.location?.toLowerCase().includes(q) ||
      lot.variety?.toLowerCase().includes(q) ||
      lot.id?.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'all' || lot.category === selectedCategory;
    const matchesCrop = selectedCrop === 'all' || lot.crop?.toLowerCase() === selectedCrop.toLowerCase();
    const matchesGrade = selectedGrade === 'all' || lot.grade === selectedGrade;
    const matchesDistrict = selectedDistrict === 'all' || 
      (lot.district && lot.district.toLowerCase().includes(selectedDistrict.toLowerCase())) ||
      (lot.location && lot.location.toLowerCase().includes(selectedDistrict.toLowerCase()));
    const matchesPrice = Number(lot.expectedPrice || 0) <= maxPrice;

    return matchesSearch && matchesCategory && matchesCrop && matchesGrade && matchesDistrict && matchesPrice;
  });

  // Dynamic list of unique cities / districts across all lots
  const availableCities = Array.from(new Set(
    lots.map(l => l.district).filter(Boolean)
  )).sort();

  const handleOpenOfferModal = (lot) => {
    setSelectedLotForOffer(lot);
    setIsMakeOfferModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-blue">
            <Store size={12} />
            Institutional Procurement Marketplace
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Direct Farm-Gate Lots with 4-Photo AI Quality Verification
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'थेट शेतकरी पीक बाजारपेठ' : lang === 'hi' ? 'सत्यापित किसान उपज मंडी' : 'Verified Farmer & FPO Marketplace'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          Browse verified, cured harvest lots with 4 multi-angle computer vision photos directly from farmers & FPOs across Maharashtra.
        </p>
      </div>

      {/* Category Filter Pills (Fruit, Vegetable, Crops) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        padding: '6px',
        background: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflowX: 'auto'
      }}>
        {[
          { id: 'all', label: t('allCategories'), icon: '🌾' },
          { id: 'Vegetable', label: `🥦 ${t('categoryVegetable')}`, icon: '🥦' },
          { id: 'Fruit', label: `🍎 ${t('categoryFruit')}`, icon: '🍎' },
          { id: 'Crop', label: `🌾 ${t('categoryCrop')}`, icon: '🌾' }
        ].map(cat => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'all' 
            ? lots.length 
            : lots.filter(l => l.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0284c7' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{cat.label}</span>
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                color: isActive ? '#ffffff' : '#64748b',
                padding: '1px 7px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          {/* Search bar */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Lot / Farmer / Location</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                className="form-control"
                style={{ paddingLeft: '36px' }}
                placeholder="e.g. Onion, Ramesh Patil, Pune..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          {/* Dynamic Crop Filter (from cropsCatalog with custom additions) */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Produce / Crop</label>
            <select 
              className="form-control form-select"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="all">All Produce ({cropsCatalog?.length || 0} catalogued)</option>
              {(cropsCatalog || []).map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.nameMr || c.name}) - {c.category}</option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Certified Grade</label>
            <select 
              className="form-control form-select"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="all">All Grades (A/B/C)</option>
              <option value="A">Grade A (Export / Retail Standard)</option>
              <option value="B">Grade B (Domestic / Processing)</option>
              <option value="C">Grade C (Industrial Secondary)</option>
            </select>
          </div>

          {/* City / District Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">City / District / Region</label>
            <select 
              className="form-control form-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="all">All Cities & Regions ({availableCities.length})</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-700)' }}>
          Showing {filteredLots.length} verified produce lots with 4 AI inspection photos
        </span>
      </div>

      {/* Lots Grid */}
      <div className="grid-2">
        {filteredLots.map(lot => {
          const lotImages = (lot.images && lot.images.length > 0) ? lot.images : [lot.image];

          return (
            <div key={lot.id} className="card hover-lift" style={{ padding: '22px' }}>
              <div>
                {/* Title & Category Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800 }}>
                        {lot.id}
                      </span>
                      <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        {lot.category === 'Fruit' ? '🍎 Fruit' : lot.category === 'Crop' ? '🌾 Crop' : '🥦 Vegetable'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--slate-900)', margin: '2px 0' }}>
                      {lot.crop} ({lot.variety})
                    </h3>
                  </div>

                  <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} />
                    Grade {lot.grade} ({lot.qualityScore || 92}/100)
                  </span>
                </div>

                {/* Farmer Info */}
                <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', margin: '0 0 8px 0' }}>
                  Farmer: <strong style={{ color: 'var(--slate-900)' }}>{lot.farmerName}</strong> • {lot.farmerFpo || 'Verified Farmer Producer Group'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} />
                    {lot.location}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    Harvest: {lot.harvestDate}
                  </span>
                </div>

                {/* 4-Photo Multi-Angle Inspection Strip for Buyer */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Camera size={13} color="#0284c7" />
                      <span>4 AI Computer-Vision Photos:</span>
                    </span>
                    <button
                      onClick={() => { setInspectedLot(lot); setInspectedPhotoIndex(0); }}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                    >
                      🔍 Inspect 4 Photos Full-Screen
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {lotImages.slice(0, 4).map((img, i) => (
                      <div 
                        key={i}
                        onClick={() => { setInspectedLot(lot); setInspectedPhotoIndex(i); }}
                        style={{
                          height: '76px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1.5px solid #cbd5e1',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        title={`Click to inspect Angle #${i + 1}`}
                      >
                        <img 
                          src={img} 
                          alt={`${lot.crop} Angle ${i + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute',
                          bottom: '2px',
                          left: '2px',
                          background: 'rgba(15, 23, 42, 0.75)',
                          color: '#ffffff',
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          padding: '1px 4px',
                          borderRadius: '3px'
                        }}>
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Quality Spec Badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span className="badge badge-blue">Freshness {lot.freshness}</span>
                  <span className="badge badge-gray">Size: {lot.bulbSize}</span>
                  <span className="badge badge-gray">Defect: {lot.damagePercent}%</span>
                </div>

                {/* Pricing & Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                      Asking Rate & Volume
                    </span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803d' }}>
                      ₹{lot.expectedPrice} <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 500 }}>/ {lot.unit}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>
                      {lot.quantity.toLocaleString()} {lot.unit} (₹{(lot.quantity * lot.expectedPrice).toLocaleString()})
                    </span>
                  </div>

                  <button 
                    onClick={() => handleOpenOfferModal(lot)}
                    className="btn btn-primary"
                    style={{ fontWeight: 800 }}
                  >
                    <Lock size={14} />
                    <span>Make Digital Offer</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLots.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', marginTop: '20px' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 6px 0' }}>
            No Matching Lots Found
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: 0 }}>
            Try adjusting your category, produce selection, or price filters.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4-PHOTO MULTI-ANGLE LIGHTBOX MODAL FOR BUYERS                             */}
      {/* ========================================================================= */}
      {inspectedLot && (
        <div className="modal-overlay" style={{ zIndex: 1050 }}>
          <div className="modal-content" style={{ maxWidth: '720px', padding: '24px' }}>
            <button 
              onClick={() => setInspectedLot(null)} 
              className="modal-close"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingRight: '28px' }}>
              <div>
                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                  Buyer Produce Inspection • {inspectedLot.category}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0' }}>
                  {inspectedLot.crop} ({inspectedLot.variety}) — 4-Angle AI Inspection Photos
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Photo {inspectedPhotoIndex + 1} of 4
              </span>
            </div>

            {/* Main High-Res Image View with Navigation */}
            <div style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '12px', overflow: 'hidden', background: '#0f172a', marginBottom: '14px' }}>
              <img 
                src={(inspectedLot.images || [inspectedLot.image])[inspectedPhotoIndex]} 
                alt="Inspection angle"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />

              {/* Prev / Next arrows */}
              <button
                onClick={() => setInspectedPhotoIndex(prev => (prev === 0 ? 3 : prev - 1))}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setInspectedPhotoIndex(prev => (prev === 3 ? 0 : prev + 1))}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Angle Tag Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                backdropFilter: 'blur(6px)'
              }}>
                {angleTitles[inspectedPhotoIndex]}
              </div>
            </div>

            {/* 4 Thumbnails Selector Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {(inspectedLot.images || [inspectedLot.image]).slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setInspectedPhotoIndex(i)}
                  style={{
                    height: '65px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: inspectedPhotoIndex === i ? '2.5px solid #0284c7' : '1px solid #cbd5e1',
                    position: 'relative',
                    opacity: inspectedPhotoIndex === i ? 1 : 0.7
                  }}
                >
                  <img src={img} alt={`Angle ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '2px', left: '2px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.62rem', padding: '1px 4px', borderRadius: '2px' }}>
                    Angle #{i + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Diagnostics details & Make Offer button */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Certified Quality Score</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803d' }}>
                  {inspectedLot.qualityScore || 92}/100 • Grade {inspectedLot.grade}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Freshness: {inspectedLot.freshness} • Defect: {inspectedLot.damagePercent}%
                </div>
              </div>

              <button
                onClick={() => {
                  const targetLot = inspectedLot;
                  setInspectedLot(null);
                  handleOpenOfferModal(targetLot);
                }}
                className="btn btn-primary"
                style={{ fontWeight: 800 }}
              >
                <Lock size={14} />
                <span>Place Digital Offer on this Lot</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
