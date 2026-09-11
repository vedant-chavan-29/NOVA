import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  X, 
  Award, 
  CheckCircle2, 
  Users, 
  Building2, 
  Coins, 
  Clock, 
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ImpactModal = () => {
  const { isImpactModalOpen, setIsImpactModalOpen } = useApp();

  if (!isImpactModalOpen) return null;

  const metrics = [
    { label: "Farmer Price Realisation Lift", val: "+21.4%", sub: "Over traditional APMC net return", color: "green" },
    { label: "Transaction & Middleman Cost Cut", val: "-42.0%", sub: "Zero commission agents", color: "blue" },
    { label: "Post-Harvest Food Loss Reduction", val: "-31.2%", sub: "Direct farm-gate cold chain", color: "green" },
    { label: "Average Time to Liquidate / Sell", val: "18 Hours", sub: "Down from 4.5 days in mandis", color: "amber" },
    { label: "Connected Farmers & FPOs", val: "12,480", sub: "Across Western Maharashtra", color: "blue" },
    { label: "Verified Corporate Buyers", val: "342", sub: "100% GST & FSSAI compliant", color: "green" },
    { label: "Gross Merchandise Value Transacted", val: "₹4.82 Cr", sub: "100% Escrow Protected", color: "amber" },
    { label: "Escrow Default Rate", val: "0.00%", sub: "Zero delayed / dishonored payouts", color: "green" }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg" style={{ padding: '28px' }}>
        <button 
          onClick={() => setIsImpactModalOpen(false)}
          className="modal-close"
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-green">
              <Sparkles size={12} />
              MahaAgri Socio-Economic Impact Dashboard
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Directorate of Agricultural Marketing
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--slate-900)', margin: 0 }}>
            Quantitative Socio-Economic Farmer Impact
          </h2>
        </div>

        {/* Impact Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {metrics.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                {m.label}
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: m.color === 'green' ? '#15803d' : m.color === 'amber' ? '#b45309' : '#1d4ed8', margin: '4px 0' }}>
                {m.val}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                {m.sub}
              </span>
            </div>
          ))}
        </div>

        {/* SIH Alignment Statement */}
        <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#14532d', margin: '0 0 6px 0' }}>
            Alignment with National Agricultural Goals
          </h4>
          <p style={{ fontSize: '0.84rem', color: '#166534', margin: 0, lineHeight: 1.5 }}>
            AgriLink directly realizes the goals of <strong>e-NAM expansion, PM Kisan Sampada Yojana, and Digital Agriculture Mission</strong> by removing asymmetric pricing barriers, enhancing farmer bargaining power, and establishing a trusted digital escrow rail for agricultural commerce.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => setIsImpactModalOpen(false)}
            className="btn btn-primary"
          >
            Close Impact Report
          </button>
        </div>
      </div>
    </div>
  );
};
