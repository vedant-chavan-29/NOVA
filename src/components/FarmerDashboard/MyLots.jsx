import React, { useState } from 'react';
import { useApp, isUserLot } from '../../context/AppContext';
import { 
  Package, 
  Plus, 
  MapPin, 
  Calendar, 
  Tag, 
  Eye, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const MyLots = () => {
  const { currentUser, lots, offers, lang, t, setActiveTab, setSelectedLotIdForOffers, setIsCreateLotModalOpen } = useApp();

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'Fruit' | 'Vegetable' | 'Crop'
  
  // Lightbox Modal for 4 Photos
  const [activePhotoModalLot, setActivePhotoModalLot] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Filter lots belonging to this farmer
  const farmerLots = lots.filter(lot => isUserLot(lot, currentUser));

  const filteredLots = farmerLots.filter(lot => {
    if (filterStatus !== 'all' && !lot.status.toLowerCase().includes(filterStatus.toLowerCase())) {
      return false;
    }
    if (filterCategory !== 'all' && lot.category !== filterCategory) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <span className="badge badge-blue"><Clock size={12} /> Open for Bids</span>;
      case 'Offers Received':
        return <span className="badge badge-amber"><AlertCircle size={12} /> Offers Received</span>;
      case 'Deal Locked':
        return <span className="badge badge-green"><CheckCircle2 size={12} /> Deal Locked</span>;
      case 'Completed':
        return <span className="badge badge-green"><ShieldCheck size={12} /> Completed</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const angleTitles = [
    'Angle 1: Overall Harvest & Batch View',
    'Angle 2: Surface & Skin Inspection',
    'Angle 3: Caliber / Sizing Measurement',
    'Angle 4: Cross-section / Internal Core'
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-green">
              <Package size={12} />
              Farm Inventory & Active Listings
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              {farmerLots.length} Lots in Your Farm Gate
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            {lang === 'mr' ? 'माझे शेतीमाल लॉट्स' : lang === 'hi' ? 'मेरे कृषि फसल लॉट्स' : 'My Active Produce Lots'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <select 
            className="form-control form-select"
            style={{ width: '150px', padding: '8px 12px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="offers">Offers Received</option>
            <option value="deal">Deal Locked</option>
            <option value="completed">Completed</option>
          </select>

          <button 
            onClick={() => setIsCreateLotModalOpen(true)}
            className="btn btn-primary"
            style={{ fontWeight: 800 }}
          >
            <Plus size={16} />
            <span>{t('createLotBtn')}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs (Fruit, Vegetable, Crops) */}
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
          const isActive = filterCategory === cat.id;
          const count = cat.id === 'all' 
            ? farmerLots.length 
            : farmerLots.filter(l => l.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '7px',
                border: 'none',
                background: isActive ? '#0f172a' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{cat.label}</span>
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                color: isActive ? '#ffffff' : '#64748b',
                padding: '1px 6px',
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

      {/* Lots Grid */}
      <div className="grid-2">
        {filteredLots.map(lot => {
          const lotOffers = offers.filter(o => o.lotId === lot.id);
          const lotImages = (lot.images && lot.images.length > 0) ? lot.images : [lot.image];

          return (
            <div key={lot.id} className="card hover-lift" style={{ padding: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800, letterSpacing: '0.04em' }}>
                        LOT #{lot.id}
                      </span>
                      <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        {lot.category === 'Fruit' ? '🍎 Fruit' : lot.category === 'Crop' ? '🌾 Crop' : '🥦 Vegetable'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--slate-900)', margin: '2px 0' }}>
                      {lot.crop} ({lot.variety})
                    </h3>
                  </div>
                  {getStatusBadge(lot.status)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '12px', flexWrap: 'wrap' }}>
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

                {/* 4-Photo Multi-Angle Thumbnail Strip */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Camera size={13} color="#16a34a" />
                      <span>4 AI-Inspected Photos:</span>
                    </span>
                    <button
                      onClick={() => { setActivePhotoModalLot(lot); setActivePhotoIndex(0); }}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      Inspect Full View
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {lotImages.slice(0, 4).map((img, i) => (
                      <div 
                        key={i}
                        onClick={() => { setActivePhotoModalLot(lot); setActivePhotoIndex(i); }}
                        style={{
                          height: '74px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1.5px solid #cbd5e1',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'transform 0.15s ease'
                        }}
                        title={`Click to view Angle #${i + 1}`}
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

                {/* Quality & Specs Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={11} /> Grade {lot.grade} ({lot.qualityScore || 92}/100)
                  </span>
                  <span className="badge badge-blue">Freshness {lot.freshness}</span>
                  <span className="badge badge-gray">Size: {lot.bulbSize}</span>
                  <span className="badge badge-gray">Damage: {lot.damagePercent}%</span>
                </div>

                {/* Price & Offers Row */}
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
                      Lot Volume & Target Rate
                    </span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--slate-900)' }}>
                      {lot.quantity.toLocaleString()} {lot.unit} @ ₹{lot.expectedPrice}/{lot.unit}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700 }}>
                      Est. ₹{(lot.quantity * lot.expectedPrice).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => { 
                        if (setSelectedLotIdForOffers) setSelectedLotIdForOffers(lot.id);
                        setActiveTab('offers'); 
                      }}
                      className={`btn ${lotOffers.length > 0 ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    >
                      <span>{lotOffers.length} {lotOffers.length === 1 ? 'Offer' : 'Offers'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLots.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', marginTop: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Package size={28} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 6px 0' }}>
            {lang === 'mr' ? 'कोणतेही शेतीमाल लॉट्स उपलब्ध नाहीत' : 'No Produce Lots Found in this Category'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', maxWidth: '460px', margin: '0 auto 18px' }}>
            {lang === 'mr'
              ? 'आपल्या शेतातील फळे, भाज्या किंवा पिकांची ४ फोटोसह नोंदणी करा.'
              : 'Add your first produce lot with 4 multi-angle inspection photos for AI certified grading.'}
          </p>
          <button 
            onClick={() => setIsCreateLotModalOpen(true)}
            className="btn btn-primary"
            style={{ margin: '0 auto' }}
          >
            <Plus size={16} />
            <span>{t('createLotBtn')}</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4-PHOTO MULTI-ANGLE LIGHTBOX MODAL                                       */}
      {/* ========================================================================= */}
      {activePhotoModalLot && (
        <div className="modal-overlay" style={{ zIndex: 1050 }}>
          <div className="modal-content" style={{ maxWidth: '720px', padding: '24px' }}>
            <button 
              onClick={() => setActivePhotoModalLot(null)} 
              className="modal-close"
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingRight: '28px' }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                  {activePhotoModalLot.category} • Grade {activePhotoModalLot.grade}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0' }}>
                  {activePhotoModalLot.crop} — 4-Angle AI Photo Verification
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Photo {activePhotoIndex + 1} of 4
              </span>
            </div>

            {/* Main High-Res Image View with Navigation */}
            <div style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '12px', overflow: 'hidden', background: '#0f172a', marginBottom: '14px' }}>
              <img 
                src={(activePhotoModalLot.images || [activePhotoModalLot.image])[activePhotoIndex]} 
                alt="Inspection angle"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />

              {/* Prev / Next arrows */}
              <button
                onClick={() => setActivePhotoIndex(prev => (prev === 0 ? 3 : prev - 1))}
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
                onClick={() => setActivePhotoIndex(prev => (prev === 3 ? 0 : prev + 1))}
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
                {angleTitles[activePhotoIndex]}
              </div>
            </div>

            {/* 4 Thumbnails Selector Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {(activePhotoModalLot.images || [activePhotoModalLot.image]).slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActivePhotoIndex(i)}
                  style={{
                    height: '65px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activePhotoIndex === i ? '2.5px solid #16a34a' : '1px solid #cbd5e1',
                    position: 'relative',
                    opacity: activePhotoIndex === i ? 1 : 0.7
                  }}
                >
                  <img src={img} alt={`Angle ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '2px', left: '2px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.62rem', padding: '1px 4px', borderRadius: '2px' }}>
                    Angle #{i + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Diagnostics details */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>AI Vision Score</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#15803d' }}>
                  {activePhotoModalLot.qualityScore || 92}/100 • Grade {activePhotoModalLot.grade}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Assessed Freshness</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{activePhotoModalLot.freshness || '95%'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Caliber / Sizing</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{activePhotoModalLot.bulbSize || '55-65 mm'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Defect Rate</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>{activePhotoModalLot.damagePercent || 2.1}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
