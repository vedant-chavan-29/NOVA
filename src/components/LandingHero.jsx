import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  BadgeCheck, 
  Coins, 
  Sparkles,
  Users,
  FileCheck2,
  Store,
  Scale
} from 'lucide-react';

export const LandingHero = () => {
  const { lang, t, setActiveTab, setIsCreateLotModalOpen, setIsDemoModalOpen } = useApp();

  const benefits = [
    {
      icon: TrendingUp,
      title: "Smart Price Discovery",
      titleMr: "स्मार्ट बाजारभाव शोध",
      desc: "Compare nearby APMC mandis, food processors, retail chains & digital buyers with automated net realisation deducting transport & storage costs.",
      color: "green"
    },
    {
      icon: Cpu,
      title: "AI Selling Recommendation",
      titleMr: "एआय विक्री शिफारस",
      desc: "Projected 7-day price curves, arrival volumes, and definitive 'Sell Now' vs 'Hold / Store' decision intelligence with 94%+ model confidence.",
      color: "amber"
    },
    {
      icon: ShieldCheck,
      title: "Verified Buyer Matching",
      titleMr: "सत्यापित खरेदीदार जुळवणी",
      desc: "Multi-parameter matching algorithm (score out of 100) factoring offered price, distance, GSTIN verification, payment reliability & rating.",
      color: "blue"
    },
    {
      icon: Truck,
      title: "Transparent Logistics & Escrow",
      titleMr: "पारदर्शक वाहतूक व एस्क्रो पेमेंट",
      desc: "Direct-from-farm pickup booking, live GPS transit tracking, and automated digital escrow release straight to farmer bank account upon delivery.",
      color: "green"
    }
  ];

  const workflowSteps = [
    { step: 1, title: "Farmer Details", desc: "Farmer / FPO enters crop, variety, quantity & location" },
    { step: 2, title: "Market Intelligence", desc: "System scans Mandis, Processors, Institutional buyers" },
    { step: 3, title: "AI Price Forecast", desc: "AI forecasts price & recommends optimal selling window" },
    { step: 4, title: "Create Crop Lot", desc: "Farmer generates verified Lot ID with AI quality scan" },
    { step: 5, title: "Buyer Matching & Bids", desc: "Verified buyers place binding digital bids" },
    { step: 6, title: "Offer Comparison", desc: "Matrix compares net returns after transport & taxes" },
    { step: 7, title: "Deal & Escrow Lock", desc: "Farmer accepts offer; buyer deposits 100% escrow" },
    { step: 8, title: "Logistics & Storage", desc: "Vehicle assigned with live GPS tracking from farm gate" },
    { step: 9, title: "Instant Escrow Payment", desc: "Delivery confirmed; funds auto-credited via DBT / UPI" }
  ];

  return (
    <div style={{ marginBottom: '40px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '48px 36px',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        marginBottom: '32px'
      }}>
        {/* Subtle Decorative Shapes */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', padding: '6px 14px', borderRadius: 'var(--radius-full)', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <BadgeCheck size={16} color="#86efac" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f0fdf4', letterSpacing: '0.03em' }}>
              Government of Maharashtra • Directorate of Agricultural Marketing
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            {lang === 'mr' ? 'कृषीलिंक' : 'AgriLink'}
            <span style={{ display: 'block', fontSize: '1.65rem', fontWeight: 700, color: '#fef08a', marginTop: '6px' }}>
              {t('tagline')}
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#dcfce7', lineHeight: 1.6, marginBottom: '20px', maxWidth: '720px' }}>
            Eliminating agricultural information asymmetry, middleman exploitation, and post-harvest losses. Empowering Indian farmers and FPOs with algorithmic price discovery, verified buyer matchmaking, transparent logistics, and digital escrow payments.
          </p>

          {/* Core Innovation Quote Strip */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderLeft: '4px solid #fef08a',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            marginBottom: '28px',
            maxWidth: '780px'
          }}>
            <p style={{ fontSize: '0.92rem', color: '#fef9c3', fontStyle: 'italic', margin: '0 0 6px 0', lineHeight: 1.5 }}>
              “AgriLink is not just a marketplace. It is an AI-assisted market intelligence & transaction platform that empowers farmers to decide <strong>WHERE</strong> to sell, <strong>WHEN</strong> to sell, <strong>WHOM</strong> to sell to, and <strong>WHAT</strong> their actual net realization will be after logistics and storage costs.”
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: '#86efac', fontWeight: 700, flexWrap: 'wrap' }}>
              <span>📍 WHERE to sell?</span>
              <span>⏰ WHEN to sell?</span>
              <span>🤝 WHOM to sell to?</span>
              <span>💰 WHAT is the Net Price?</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { setActiveTab('home'); setIsCreateLotModalOpen(true); }}
              className="btn btn-accent btn-lg"
              style={{ fontWeight: 800, fontSize: '1rem', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)' }}
            >
              <span>👨‍🌾 Get Started as Farmer / FPO</span>
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => setActiveTab('marketplace')}
              className="btn btn-secondary btn-lg"
              style={{ background: '#ffffff', color: '#14532d', border: 'none', fontWeight: 800, fontSize: '1rem' }}
            >
              <span>🏢 Buy Agricultural Produce</span>
            </button>

            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="btn btn-outline btn-lg"
              style={{ borderColor: '#86efac', color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}
            >
              <Sparkles size={18} color="#fef08a" />
              <span>Interactive Platform Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Pillar Benefit Cards */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Platform Architecture & Core Innovation
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Four Pillars of AgriLink
          </h2>
        </div>

        <div className="grid-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="card hover-lift" style={{ borderTop: `4px solid ${b.color === 'green' ? '#16a34a' : b.color === 'amber' ? '#f59e0b' : '#2563eb'}` }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: b.color === 'green' ? 'var(--primary-50)' : b.color === 'amber' ? 'var(--amber-50)' : 'var(--blue-50)',
                  color: b.color === 'green' ? '#15803d' : b.color === 'amber' ? '#b45309' : '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', color: 'var(--slate-900)' }}>
                  {lang === 'mr' ? b.titleMr : b.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Flowchart / Process Section */}
      <div className="card" style={{ background: '#ffffff', padding: '32px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Complete Farmer-to-Buyer Pipeline
          </span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px' }}>
            How AgriLink Works End-to-End
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)', maxWidth: '650px', margin: '6px auto 0' }}>
            A synchronized, real-time workflow connecting price discovery, verified bidding, computer vision grading, logistics fulfillment, and instant escrow settlement.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          position: 'relative'
        }}>
          {workflowSteps.map((s, idx) => (
            <div 
              key={idx}
              style={{
                background: 'var(--slate-50)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{
                  background: '#15803d',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {s.step}
                </span>
                {idx < workflowSteps.length - 1 && (
                  <ChevronRight size={16} color="#94a3b8" />
                )}
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '4px' }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', lineHeight: 1.4, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
