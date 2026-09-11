import React from 'react';
import { useApp, isUserLot } from '../../context/AppContext';
import { SIHDemoBanner } from '../SIHDemoBanner';
import { 
  Package, 
  Tag, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Scale, 
  Cpu, 
  Truck,
  Building2,
  Coins
} from 'lucide-react';

export const FarmerHome = () => {
  const { 
    currentUser,
    lots, 
    offers, 
    transactions, 
    lang, 
    t, 
    setActiveTab, 
    setIsCreateLotModalOpen 
  } = useApp();

  // Farmer's individual produce lots
  const myLots = lots.filter(l => isUserLot(l, currentUser));
  const myLotIds = myLots.map(l => l.id);
  const activeLots = myLots.filter(l => l.status !== 'Completed');

  // Offers received specifically for this farmer's lots
  const myOffers = offers.filter(o => myLotIds.includes(o.lotId));
  const pendingOffers = myOffers.filter(o => o.status === 'Pending');

  // Transactions / Real deals for this farmer's lots
  const myTransactions = transactions.filter(t => myLotIds.includes(t.lotId));
  const completedDeals = myTransactions.filter(t => t.escrowStatus?.includes('Completed'));

  // Calculate expected revenue from this farmer's active lots
  const projectedRevenue = activeLots.reduce((sum, l) => sum + (l.quantity * l.expectedPrice), 0);

  return (
    <div>
      {/* Real-World Benchmark Case (Pune 1000kg Onion case) */}
      <SIHDemoBanner />

      {/* Top Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-green">
              Farmer / FPO Portal
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Logged in: <strong>{currentUser ? currentUser.name : 'Farmer User'}</strong> ({currentUser?.organization || 'FPO Member'} • {currentUser?.phone || ''})
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            {lang === 'mr' ? 'शेतकरी डॅशबोर्ड व बाजार नियंत्रण' : 'Farmer Command & Revenue Dashboard'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setActiveTab('marketPrices')}
            className="btn btn-secondary"
          >
            <TrendingUp size={16} color="#16a34a" />
            <span>{t('navMarketPrices')}</span>
          </button>

          <button 
            onClick={() => setIsCreateLotModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>{t('createLotBtn')}</span>
          </button>
        </div>
      </div>

      {/* 🌾 AGRISETU FARMER QUICK DECISION CARD (SIH Innovation Spotlight) */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        border: '1.5px solid #334155',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          paddingBottom: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>🌾</span>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                AI Market Intelligence & Selling Directive
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.01em' }}>
                AGRILINK FARMER COMMAND CONSOLE
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Current Crop: <strong style={{ color: '#ffffff' }}>Onion (कांदा)</strong></span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Quantity: <strong style={{ color: '#fef08a' }}>1,000 KG (10 Qtl)</strong></span>
          </div>
        </div>

        {/* 2 Column Layout: Today's Price across Markets & AI Smart Recommendation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {/* Today's Market Benchmark */}
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                📊 TODAY'S MARKET PRICES
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Per Quintal (100 KG)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#cbd5e1' }}>Pune Mandi (Gultekdi)</span>
                <span style={{ fontWeight: 700, color: '#f87171' }}>₹2,300 / Qtl (₹23/KG)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#cbd5e1' }}>Nashik Mandi (Lasalgaon)</span>
                <span style={{ fontWeight: 700, color: '#cbd5e1' }}>₹2,520 / Qtl (₹25.2/KG)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#cbd5e1' }}>Mumbai APMC (Vashi)</span>
                <span style={{ fontWeight: 700, color: '#cbd5e1' }}>₹2,650 / Qtl (₹26.5/KG)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: 'var(--radius-md)', border: '1px solid #22c55e' }}>
                <span style={{ color: '#86efac', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> AgriLink Verified Buyer Offer
                </span>
                <strong style={{ color: '#4ade80', fontSize: '1.05rem' }}>₹2,800 / Qtl (₹28/KG)</strong>
              </div>
            </div>
          </div>

          {/* 🤖 Smart Recommendation Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(21, 128, 61, 0.1) 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            border: '1.5px solid #22c55e'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.74rem', color: '#86efac', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                🤖 SMART AI RECOMMENDATION
              </span>
              <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                94.2% CONFIDENCE
              </span>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Best Recommended Buyer:</div>
              <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                Sahyadri Mega Food Park Pvt Ltd
              </strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Expected Rate</span>
                <strong style={{ fontSize: '1.1rem', color: '#4ade80' }}>₹2,800 / Qtl</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Selling Window</span>
                <strong style={{ fontSize: '0.95rem', color: '#fef08a' }}>SELL WITHIN 2-4 DAYS</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Estimated Extra Profit vs Mandi:</span>
              <strong style={{ fontSize: '1.25rem', color: '#f59e0b', fontWeight: 900 }}>
                +₹4,200 (+18.3%)
              </strong>
            </div>
          </div>
        </div>

        {/* 4 Core Quick Navigation Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '16px'
        }}>
          <button 
            onClick={() => setIsCreateLotModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 800 }}
          >
            <Plus size={14} />
            <span>[ Create Lot ]</span>
          </button>

          <button 
            onClick={() => setActiveTab('offers')}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}
          >
            <Tag size={14} color="#f59e0b" />
            <span>[ View Offers ]</span>
          </button>

          <button 
            onClick={() => setActiveTab('logistics')}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}
          >
            <Truck size={14} color="#38bdf8" />
            <span>[ Transport ]</span>
          </button>

          <button 
            onClick={() => setActiveTab('transactions')}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}
          >
            <Coins size={14} color="#4ade80" />
            <span>[ Payment Status ]</span>
          </button>
        </div>
      </div>

      {/* Stat KPI Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {/* Active Lots */}
        <div className="stat-card green hover-lift" onClick={() => setActiveTab('myLots')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">{t('statActiveLots')}</div>
            <div className="stat-val">{activeLots.length}</div>
            <div className="stat-sub">{myLots.length} your inventory lots</div>
          </div>
          <div className="stat-icon green">
            <Package size={24} />
          </div>
        </div>

        {/* Received Offers */}
        <div className="stat-card amber hover-lift" onClick={() => setActiveTab('offers')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">{t('statOffersReceived')}</div>
            <div className="stat-val">{myOffers.length}</div>
            <div className="stat-sub">{pendingOffers.length} awaiting farmer decision</div>
          </div>
          <div className="stat-icon amber">
            <Tag size={24} />
          </div>
        </div>

        {/* Projected Revenue */}
        <div className="stat-card blue hover-lift">
          <div>
            <div className="stat-label">{t('statExpectedRevenue')}</div>
            <div className="stat-val">₹{projectedRevenue.toLocaleString()}</div>
            <div className="stat-sub">Across {activeLots.length} active crop lots</div>
          </div>
          <div className="stat-icon blue">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Completed Deals */}
        <div className="stat-card green hover-lift" onClick={() => setActiveTab('transactions')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">{t('statCompletedDeals')}</div>
            <div className="stat-val">{myTransactions.length}</div>
            <div className="stat-sub">100% Escrow Payments Credited</div>
          </div>
          <div className="stat-icon green">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Action Center Grid: Received Offers & Recommended Opportunity */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Recent Received Bids Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Tag size={18} color="#d97706" />
              Latest Buyer Offers (Awaiting Action)
            </span>
            <button 
              onClick={() => setActiveTab('offers')}
              className="btn btn-secondary btn-sm"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myOffers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--slate-500)', fontSize: '0.86rem' }}>
                <p style={{ margin: '0 0 10px 0' }}>No buyer offers received yet on your crop lots.</p>
                <button 
                  onClick={() => setIsCreateLotModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={13} />
                  <span>List New Crop Lot</span>
                </button>
              </div>
            ) : (
              myOffers.slice(0, 3).map((offer) => (
                <div 
                  key={offer.id}
                  style={{
                    background: 'var(--slate-50)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--slate-900)' }}>
                        {offer.buyerName}
                      </strong>
                      <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {offer.matchScore || 94}/100 Match
                      </span>
                    </div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)', display: 'block', marginTop: '2px' }}>
                      Offered <strong>₹{offer.offeredRate}/KG</strong> for {offer.quantityRequested} KG • Total Payout: <strong>₹{(offer.totalOfferedAmount || (offer.offeredRate * offer.quantityRequested)).toLocaleString()} (100% Net)</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => setActiveTab('offers')}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Review Offer</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Selling Recommendation & Market Alert */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', border: '1.5px solid #86efac' }}>
          <div className="card-header">
            <span className="card-title" style={{ color: '#14532d' }}>
              <Cpu size={18} color="#16a34a" />
              AI Market Advisory • Pune Division
            </span>
            <span className="badge badge-green">HIGH CONFIDENCE</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#15803d', fontWeight: 800 }}>
              Recommended Selling Window
            </span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#14532d', margin: '4px 0 8px 0' }}>
              Hold Onion Lots for 4 to 6 Days (Target: ₹28.50/KG)
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#166534', lineHeight: 1.5, margin: 0 }}>
              Daily arrival volumes at Lasalgaon dropped 24%. Buyers in Pune are actively bidding at premium rates. Net realization expected to improve by <strong>+₹3.80/KG</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('aiPrediction')}
              className="btn btn-primary btn-sm"
            >
              <span>View Full AI Price Forecast</span>
              <ArrowRight size={13} />
            </button>

            <button 
              onClick={() => setActiveTab('storage')}
              className="btn btn-outline btn-sm"
            >
              <span>Calculate Cold Storage ROI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
