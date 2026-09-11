import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Scale, 
  Truck, 
  Coins, 
  Award,
  Layers
} from 'lucide-react';

export const GuidedDemoModal = () => {
  const { 
    isDemoModalOpen, 
    setIsDemoModalOpen, 
    setRole, 
    setActiveTab, 
    acceptOffer, 
    offers, 
    lang, 
    t 
  } = useApp();

  const [currentStep, setCurrentStep] = useState(0);

  if (!isDemoModalOpen) return null;

  const demoSteps = [
    {
      title: "Real-World Agricultural Market Challenge & Benchmark Scenario",
      tag: "THE CHALLENGE",
      desc: "Farmers in Maharashtra suffer from extreme price volatility, 6-12% commission agent cuts at APMCs, and lack of verified institutional buyers. Our benchmark case follows farmer Ramesh Patil in Pune selling 1,000 KG of Grade-A Garwa Onions.",
      actionLabel: "Step 1: Check Market Intelligence",
      actionRole: "farmer",
      actionTab: "marketPrices"
    },
    {
      title: "Smart Price Discovery & Net Realisation Formula",
      tag: "PRICE DISCOVERY",
      desc: "At traditional Pune APMC Mandi, the price is ₹23/KG. After 1.5% cess and transport, farmer nets ₹22,105. AgriLink connects directly with Sahyadri Mega Food Park offering ₹28/KG with 0% cess, yielding ₹27,200 net realisation!",
      actionLabel: "Step 2: View AI Price Forecast",
      actionRole: "farmer",
      actionTab: "aiPrediction"
    },
    {
      title: "AI Price Intelligence: Hold vs Sell Recommendation",
      tag: "AI FORECASTING",
      desc: "Our machine learning engine factors in a 24% drop in weekly Lasalgaon arrivals and projects an upward price swing of +₹3.80/KG over the next 4-6 days, recommending the farmer HOLD for maximum realization.",
      actionLabel: "Step 3: Check Buyer Matching",
      actionRole: "farmer",
      actionTab: "buyerMatching"
    },
    {
      title: "Verified Buyer Matching (94/100 Score)",
      tag: "BUYER MATCHING",
      desc: "Multi-attribute scoring algorithm ranks buyers based on price competitiveness (35%), reliability history (20%), distance (15%), and escrow track record (15%). Sahyadri Food Park scores 94/100 as top match.",
      actionLabel: "Step 4: Compare Digital Offers",
      actionRole: "farmer",
      actionTab: "offers"
    },
    {
      title: "Multi-Buyer Digital Offer Comparison Matrix",
      tag: "OFFER MATRIX",
      desc: "Farmer compares bids side-by-side. The platform highlights the Best Net Realisation offer rather than just raw gross price. Accepting locks ₹28,000 in AgriLink digital escrow.",
      actionLabel: "Step 5: Run AI Quality Scan",
      actionRole: "farmer",
      actionTab: "qualityGrading"
    },
    {
      title: "Computer Vision Optical Quality Grading",
      tag: "QUALITY SCAN",
      desc: "Farmer uploads produce image. Deep learning model analyzes diameter (58mm), skin integrity, and color uniformity to generate an official digital Grade-A Quality Certificate.",
      actionLabel: "Step 6: Track Doorstep Logistics",
      actionRole: "transporter",
      actionTab: "logistics"
    },
    {
      title: "Automated Logistics & Instant DBT Escrow Settlement",
      tag: "LOGISTICS & ESCROW",
      desc: "Upon delivery verification, the 100% escrow vault triggers an automated direct bank transfer. Ramesh Patil receives ₹27,200 net realization — exactly +₹4,200 extra income over traditional mandi sale (+18.3% net lift)!",
      actionLabel: "Complete Tour & View Dashboard",
      actionRole: "farmer",
      actionTab: "home"
    }
  ];

  const currentStepData = demoSteps[currentStep];

  const handleExecuteStep = () => {
    setRole(currentStepData.actionRole);
    setActiveTab(currentStepData.actionTab);

    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsDemoModalOpen(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg" style={{ background: '#0f172a', color: '#ffffff', border: '1px solid #334155' }}>
        <button 
          onClick={() => setIsDemoModalOpen(false)}
          className="modal-close"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            background: '#f59e0b',
            color: '#0f172a',
            fontSize: '0.72rem',
            fontWeight: 900,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={12} />
            MAHAAGRI PLATFORM INTERACTIVE TOUR
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Step {currentStep + 1} of {demoSteps.length}
          </span>
        </div>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginBottom: '14px' }}>
          {currentStepData.title}
        </h3>

        {/* Highlight Tag */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid #22c55e',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#86efac', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
            {currentStepData.tag}
          </span>
          <p style={{ fontSize: '0.94rem', color: '#f0fdf4', lineHeight: 1.6, margin: 0 }}>
            {currentStepData.desc}
          </p>
        </div>

        {/* Dynamic Pune Scenario Comparison Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Traditional Mandi Outcome</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f87171' }}>₹23.00/KG (Net: ₹22,105)</div>
          </div>

          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#64748b' }}>VS</div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#86efac' }}>AgriLink Verified Outcome</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4ade80' }}>₹28.00/KG (Net: ₹27,200)</div>
          </div>

          <div style={{ background: '#f59e0b', color: '#0f172a', padding: '6px 14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, display: 'block' }}>Farmer Extra Income</span>
            <strong style={{ fontSize: '1.2rem', fontWeight: 900 }}>+₹4,200 (+18.3%)</strong>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          {demoSteps.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: 'var(--radius-full)',
                background: i <= currentStep ? '#22c55e' : '#334155',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            />
          ))}
        </div>

        {/* Modal Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="btn btn-secondary"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: '#475569' }}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <button 
            type="button"
            onClick={handleExecuteStep}
            className="btn btn-accent btn-lg"
            style={{ fontWeight: 800 }}
          >
            <span>{currentStepData.actionLabel}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
