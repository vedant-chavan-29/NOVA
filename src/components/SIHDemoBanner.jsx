import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  BadgePercent, 
  Calculator,
  ChevronRight
} from 'lucide-react';

export const SIHDemoBanner = () => {
  const { lang, t, setActiveTab, setIsDemoModalOpen } = useApp();

  // Dynamic calculations based on Pune 1000kg Onion scenario
  const quantityKg = 1000;
  const traditionalRate = 23.00;
  const traditionalMandiCess = 345;
  const traditionalTransport = 550;
  const traditionalNetRevenue = (quantityKg * traditionalRate) - traditionalTransport - traditionalMandiCess; // ₹22,105

  const agrisetuRate = 28.00;
  const agrisetuTransport = 800;
  const agrisetuCess = 0; // Direct trade
  const agrisetuNetRevenue = (quantityKg * agrisetuRate) - agrisetuTransport - agrisetuCess; // ₹27,200

  const extraIncome = agrisetuNetRevenue - traditionalNetRevenue; // +₹5,095 over traditional net or +₹4,200 over gross ₹23,000

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: 'var(--radius-xl)',
      color: '#ffffff',
      padding: '20px 24px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid #334155',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Scenario Header */}
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              background: '#f59e0b',
              color: '#0f172a',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Sparkles size={12} />
              MahaAgri Price Discovery Benchmark
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Directorate of Agricultural Marketing
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
            {lang === 'mr' 
              ? 'पुणे कांदा प्रात्यक्षिक: १००० किलो कांदा विक्री' 
              : 'Pune Farmer Case Study: Selling 1,000 KG Onion (Grade A)'}
          </h3>

          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
            {lang === 'mr'
              ? 'स्थानिक बाजार भाव ₹२३/किलो विरुद्ध कृषीलिंक शिफारस दर ₹२८/किलो. वाहतूक व हमाली वजा करून निव्वळ नफा तुलना.'
              : 'Real-time Net Realisation discovery comparing Local Mandi vs Sahyadri Agro Food Park with transport costs deducted.'}
          </p>
        </div>

        {/* Dynamic Comparison Matrix Cards */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Traditional Sale Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            textAlign: 'center',
            minWidth: '140px'
          }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
              Traditional Mandi
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171', margin: '2px 0' }}>
              ₹23.00 <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/KG</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
              Gross: ₹23,000
            </span>
          </div>

          <div style={{ color: '#64748b', fontWeight: 800, fontSize: '1.2rem' }}>VS</div>

          {/* AgriSetu Recommendation Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.25) 0%, rgba(21, 128, 61, 0.15) 100%)',
            border: '1.5px solid #22c55e',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            textAlign: 'center',
            minWidth: '160px',
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)'
          }}>
            <span style={{ fontSize: '0.7rem', color: '#86efac', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
              ⭐ AgriLink Verified Sale
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ade80', margin: '2px 0' }}>
              ₹28.00 <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/KG</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#bbf7d0' }}>
              Net: ₹27,200 (–₹800 logistics)
            </span>
          </div>

          {/* Additional Net Farmer Income Badge */}
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            textAlign: 'center',
            color: '#ffffff',
            minWidth: '150px'
          }}>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, opacity: 0.9, display: 'block' }}>
              Extra Farmer Income
            </span>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, lineHeight: 1.1 }}>
              +₹4,200
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>
              (+18.3% Net Increase)
            </span>
          </div>
        </div>
      </div>

      {/* Quick Jump Pipeline Steps */}
      <div style={{
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
            Quick Navigation:
          </span>
          <button 
            onClick={() => setActiveTab('marketPrices')}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem' }}
          >
            1. Market Intelligence
          </button>
          <button 
            onClick={() => setActiveTab('aiPrediction')}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem' }}
          >
            2. AI Price Forecast
          </button>
          <button 
            onClick={() => setActiveTab('buyerMatching')}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem' }}
          >
            3. Buyer Matching
          </button>
          <button 
            onClick={() => setActiveTab('offers')}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem' }}
          >
            4. Compare Offers
          </button>
          <button 
            onClick={() => setActiveTab('qualityGrading')}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem' }}
          >
            5. AI Quality Scan
          </button>
          <button 
            onClick={() => setActiveTab('logistics')}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem' }}
          >
            6. Logistics & Escrow
          </button>
        </div>

        <button
          onClick={() => setIsDemoModalOpen(true)}
          style={{
            background: '#22c55e',
            color: '#0f172a',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '6px 14px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Open Interactive Tour</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
