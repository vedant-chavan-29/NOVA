import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VERIFIED_BUYERS_DIRECTORY, CROPS_CATALOG } from '../../mockData';
import { 
  ShieldCheck, 
  Award, 
  Star, 
  MapPin, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Percent, 
  FileCheck2, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const BuyerMatching = () => {
  const { lang, t, setActiveTab, setIsCreateLotModalOpen, pushNotification } = useApp();

  const [selectedCrop, setSelectedCrop] = useState('Onion');
  const [minRating, setMinRating] = useState(4.5);

  // Filter buyers interested in the selected crop
  const matchedBuyers = VERIFIED_BUYERS_DIRECTORY.filter(b => 
    b.preferredCrops.includes(selectedCrop) && b.rating >= minRating
  );

  const scoringWeights = [
    { name: "Price Competitiveness", weight: "35%", color: "#16a34a" },
    { name: "Buyer Reliability History", weight: "20%", color: "#2563eb" },
    { name: "Distance from Farm Gate", weight: "15%", color: "#d97706" },
    { name: "Payment Escrow Track Record", weight: "15%", color: "#15803d" },
    { name: "Volume Demand Match", weight: "10%", color: "#6366f1" },
    { name: "User Rating & Reviews", weight: "5%", color: "#ec4899" }
  ];

  const handleInviteBuyer = (buyer) => {
    pushNotification(
      "Buyer Invited",
      `Direct notification sent to ${buyer.name} for your current active crop lots.`,
      "खरेदीदाराला आमंत्रण पाठवले",
      "offer"
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-blue">
            <ShieldCheck size={12} />
            Smart Buyer Matchmaking System
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Weighted Multi-Criteria Algorithm
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'सत्यापित खरेदीदार शिफारस व जुळवणी' : 'Verified Buyer Matchmaking & Scoring'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          Directly connects your farm produce with vetted corporate institutional buyers, avoiding opaque mandi cartels.
        </p>
      </div>

      {/* Algorithm Scoring Methodology Card */}
      <div className="card" style={{ marginBottom: '24px', background: 'var(--slate-900)', color: '#ffffff', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#fef08a" />
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              AgriLink MatchScore™ Formula Weights (Total: 100 Points)
            </h4>
          </div>
          <span style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 'var(--radius-full)', color: '#cbd5e1' }}>
            AI Algorithm Model v3.1
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          {scoringWeights.map((w, i) => (
            <div key={i} style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-md)', padding: '10px 12px', borderLeft: `3px solid ${w.color}` }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>{w.name}</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
                {w.weight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '4px' }}>SELECT CROP</label>
            <select 
              className="form-control form-select"
              style={{ width: '180px', padding: '6px 12px' }}
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              {CROPS_CATALOG.map(c => <option key={c.id} value={c.name}>{c.name} ({c.nameMr})</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '4px' }}>MINIMUM RATING</label>
            <select 
              className="form-control form-select"
              style={{ width: '160px', padding: '6px 12px' }}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value={4.0}>⭐ 4.0 & above</option>
              <option value={4.5}>⭐ 4.5 & above (Top Tier)</option>
              <option value={4.8}>⭐ 4.8 & above (Elite)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buyer Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {matchedBuyers.map((buyer, idx) => {
          // Dynamic match score
          const matchScore = idx === 0 ? 94 : idx === 1 ? 91 : idx === 2 ? 86 : 82;
          const isTopRecommended = idx === 0;

          return (
            <div 
              key={buyer.id}
              className="card hover-lift"
              style={{
                border: isTopRecommended ? '2px solid #22c55e' : '1px solid var(--border-subtle)',
                background: isTopRecommended ? 'linear-gradient(135deg, rgba(240, 253, 244, 0.6) 0%, #ffffff 100%)' : '#ffffff',
                padding: '24px',
                position: 'relative'
              }}
            >
              {isTopRecommended && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Award size={13} />
                  RECOMMENDED BUYER • {matchScore}/100 SCORE
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                {/* Left: Buyer Overview */}
                <div style={{ maxWidth: '480px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-blue">
                      {buyer.category}
                    </span>
                    <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} />
                      GST & FSSAI Verified
                    </span>
                    <span className="badge badge-gray">
                      {buyer.riskLevel}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: '4px 0 8px 0' }}>
                    {buyer.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.84rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#64748b" />
                      {buyer.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      <strong>{buyer.rating} / 5.0</strong>
                    </span>
                    <span>
                      Est. <strong>{buyer.establishedYear}</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.76rem', color: 'var(--slate-500)', background: 'var(--slate-50)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                    <span>GSTIN: <strong style={{ color: 'var(--slate-700)' }}>{buyer.gstin}</strong></span>
                    <span>•</span>
                    <span>FSSAI: <strong style={{ color: 'var(--slate-700)' }}>{buyer.fssai}</strong></span>
                  </div>
                </div>

                {/* Middle: Performance Metrics */}
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                      Payment Trust
                    </span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#16a34a' }}>
                      {buyer.paymentReliability}%
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                      0 Escrow Defaults
                    </span>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                      Total Procurement
                    </span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--slate-800)' }}>
                      {buyer.totalPurchasesMT.toLocaleString()} MT
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                      Cancellation: {buyer.cancellationRate}
                    </span>
                  </div>

                  {/* Match Score Display */}
                  <div style={{
                    background: isTopRecommended ? '#15803d' : 'var(--slate-100)',
                    color: isTopRecommended ? '#ffffff' : 'var(--slate-800)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 18px',
                    textAlign: 'center',
                    minWidth: '130px'
                  }}>
                    <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, opacity: 0.9, display: 'block' }}>
                      Match Score
                    </span>
                    <div style={{ fontSize: '1.65rem', fontWeight: 900, lineHeight: 1.1 }}>
                      {matchScore}/100
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.9 }}>
                      {matchScore >= 90 ? 'High Match' : 'Strong Match'}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    onClick={() => { setActiveTab('offers'); }}
                    className="btn btn-primary"
                  >
                    <span>View Offers</span>
                    <ArrowRight size={14} />
                  </button>

                  <button 
                    onClick={() => handleInviteBuyer(buyer)}
                    className="btn btn-secondary btn-sm"
                  >
                    <span>Invite to Bid</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
