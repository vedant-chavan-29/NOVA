import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ONION_PRICE_CHART_DATA, CROPS_CATALOG, DISTRICTS } from '../../mockData';
import { 
  Cpu, 
  TrendingUp, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Info,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const AIPrediction = () => {
  const { lang, t, setActiveTab, setIsCreateLotModalOpen } = useApp();

  const [selectedCrop, setSelectedCrop] = useState('onion');
  const [selectedDistrict, setSelectedDistrict] = useState('pune');
  const [forecastHorizon, setForecastHorizon] = useState(7); // days

  // SVG Chart Dimensions
  const chartWidth = 760;
  const chartHeight = 260;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  // Calculate scales
  const maxPrice = 32;
  const minPrice = 18;
  const priceRange = maxPrice - minPrice;

  const points = ONION_PRICE_CHART_DATA.map((d, index) => {
    const x = padding.left + (index / (ONION_PRICE_CHART_DATA.length - 1)) * (chartWidth - padding.left - padding.right);
    const val = d.actual !== null ? d.actual : d.projected;
    const y = chartHeight - padding.bottom - ((val - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);
    return { ...d, x, y, val };
  });

  // Split into actual points and projected points
  const actualPoints = points.filter(p => p.actual !== null);
  const projectedPoints = points.filter(p => p.projected !== null);

  const actualPath = actualPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const projectedPath = projectedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const [hoveredPoint, setHoveredPoint] = useState(null);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-amber">
            <Cpu size={12} />
            AgriPredict™ Multi-Variable ML Engine
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            LSTM & Gradient Boosted Ensemble Model v2.4
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'एआय भाव अंदाज व विक्री शिफारस प्रणाली' : 'AI Price Forecasting & Selling Window Intelligence'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          Synthesizing historical mandi arrivals, weather satellite indices, downstream processing demand, and inter-district supply flows.
        </p>
      </div>

      {/* Filter Row */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '4px' }}>CROP</label>
              <select 
                className="form-control form-select"
                style={{ width: '180px', padding: '6px 12px' }}
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                {CROPS_CATALOG.map(c => <option key={c.id} value={c.id}>{c.name} ({c.nameMr})</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '4px' }}>REGION</label>
              <select 
                className="form-control form-select"
                style={{ width: '180px', padding: '6px 12px' }}
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-600)' }}>Forecast Window:</span>
            {[7, 14].map(days => (
              <button
                key={days}
                onClick={() => setForecastHorizon(days)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: forecastHorizon === days ? '1px solid #16a34a' : '1px solid var(--border-subtle)',
                  background: forecastHorizon === days ? 'var(--primary-50)' : '#ffffff',
                  color: forecastHorizon === days ? '#15803d' : 'var(--slate-700)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {days} Days Forecast
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Selling Recommendation Banner (HOLD / SELL NOW) */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '2px solid #22c55e',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              background: '#15803d',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.78rem',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={14} />
              RECOMMENDATION: HOLD / WAIT 4-6 DAYS
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d' }}>
              Model Confidence: 94.2%
            </span>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#14532d', marginBottom: '6px' }}>
            Target Optimal Window: Sep 11 – Sep 14, 2026 (Projected Rate: ₹28.50/KG)
          </h3>

          <p style={{ fontSize: '0.88rem', color: '#166534', lineHeight: 1.5, margin: 0 }}>
            <strong>Why Hold?</strong> Lasalgaon and Pimpalgaon mandi arrivals dropped by <strong>24%</strong> week-over-week due to post-monsoon farm operations. Institutional buyers in Pune and Mumbai are replenishing warehouse inventories, creating a projected price upswing of <strong>+14.8%</strong>.
          </p>
        </div>

        {/* Value Lift Metric */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          border: '1px solid #bbf7d0',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#15803d', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>
            Estimated Net Price Lift
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803d' }}>
            + ₹3.80 / KG
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            (+₹3,800 per 1,000 KG lot)
          </span>
        </div>
      </div>

      {/* Interactive Forecast Price Chart */}
      <div className="card" style={{ marginBottom: '28px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Historical Price vs 7-Day AI Projection (₹/KG)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Solid Green: Actual Mandi Trading • Dashed Amber: AI Projected Rate Curve
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', background: '#16a34a', display: 'inline-block' }} />
              <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>Actual Price</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', background: '#d97706', borderTop: '2px dashed #d97706', display: 'inline-block' }} />
              <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>AI Projected Rate</span>
            </div>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div style={{ overflowX: 'auto', textAlign: 'center' }}>
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            style={{ width: '100%', maxWidth: `${chartWidth}px`, height: 'auto', overflow: 'visible' }}
          >
            {/* Grid lines */}
            {[20, 24, 28, 32].map(priceVal => {
              const yPos = chartHeight - padding.bottom - ((priceVal - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);
              return (
                <g key={priceVal}>
                  <line 
                    x1={padding.left} 
                    y1={yPos} 
                    x2={chartWidth - padding.right} 
                    y2={yPos} 
                    stroke="#e2e8f0" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={padding.left - 10} 
                    y={yPos + 4} 
                    fill="#94a3b8" 
                    fontSize="11" 
                    textAnchor="end" 
                    fontWeight="600"
                  >
                    ₹{priceVal}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {points.map((p, i) => (
              <text 
                key={i} 
                x={p.x} 
                y={chartHeight - 12} 
                fill={p.actual !== null ? "#64748b" : "#d97706"} 
                fontSize="10" 
                textAnchor="middle" 
                fontWeight={p.day.includes("Today") ? "800" : "500"}
              >
                {p.day}
              </text>
            ))}

            {/* Today vertical divider line */}
            {points.filter(p => p.day.includes("Today")).map((p, idx) => (
              <g key={idx}>
                <line 
                  x1={p.x} 
                  y1={padding.top} 
                  x2={p.x} 
                  y2={chartHeight - padding.bottom} 
                  stroke="#22c55e" 
                  strokeWidth="1.5" 
                  strokeDasharray="3 3" 
                />
                <text 
                  x={p.x} 
                  y={padding.top - 10} 
                  fill="#15803d" 
                  fontSize="11" 
                  fontWeight="800" 
                  textAnchor="middle"
                >
                  TODAY
                </text>
              </g>
            ))}

            {/* Actual line (green) */}
            <path 
              d={actualPath} 
              fill="none" 
              stroke="#16a34a" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />

            {/* Projected line (dashed amber) */}
            <path 
              d={projectedPath} 
              fill="none" 
              stroke="#d97706" 
              strokeWidth="3.5" 
              strokeDasharray="6 6" 
              strokeLinecap="round"
            />

            {/* Data Points */}
            {points.map((p, i) => {
              const isActual = p.actual !== null;
              const isHovered = hoveredPoint && hoveredPoint.day === p.day;

              return (
                <g 
                  key={i} 
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={isHovered ? 7 : (p.day.includes("Today") ? 6 : 4.5)} 
                    fill={isActual ? "#16a34a" : "#d97706"} 
                    stroke="#ffffff" 
                    strokeWidth="2" 
                  />
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <g>
                      <rect 
                        x={p.x - 55} 
                        y={p.y - 48} 
                        width="110" 
                        height="40" 
                        rx="6" 
                        fill="#0f172a" 
                        opacity="0.9" 
                      />
                      <text 
                        x={p.x} 
                        y={p.y - 32} 
                        fill="#ffffff" 
                        fontSize="11" 
                        fontWeight="700" 
                        textAnchor="middle"
                      >
                        ₹{p.val.toFixed(2)}/KG
                      </text>
                      <text 
                        x={p.x} 
                        y={p.y - 18} 
                        fill="#94a3b8" 
                        fontSize="9" 
                        textAnchor="middle"
                      >
                        Arrivals: {p.arrivalMT} MT
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Multi-variable Feature Weights & Model Architecture Info */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} color="#16a34a" />
              Mandi Arrival Volumes
            </span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#dc2626' }}>
            -18.4% WoW
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Arrivals dropped from 1,250 MT to 810 MT daily across Pune Division mandis. Lower supply drives price surge.
          </p>
        </div>

        <div className="card">
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#d97706" />
              Buyer Demand Velocity
            </span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a' }}>
            High (+32% RFQs)
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Active bids from institutional buyers (Sahyadri, Reliance, Metro) increased by 32% this week for Grade-A cured lots.
          </p>
        </div>

        <div className="card">
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} color="#2563eb" />
              Weather & Logistics Risk
            </span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2563eb' }}>
            Clear Weather (Low Risk)
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Zero rainfall predicted for next 6 days along Pune-Nashik highway corridors. Uninterrupted transport availability.
          </p>
        </div>
      </div>
    </div>
  );
};
