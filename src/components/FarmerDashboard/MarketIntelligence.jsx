import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CROPS_CATALOG, DISTRICTS, PRICE_CHANNELS_DEMO } from '../../mockData';
import { 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Layers, 
  HelpCircle,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MarketIntelligence = () => {
  const { lang, t, setActiveTab, setIsCreateLotModalOpen } = useApp();

  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [selectedDistrictId, setSelectedDistrictId] = useState('pune');
  const [lotQuantity, setLotQuantity] = useState(1000); // KG

  const currentCrop = CROPS_CATALOG.find(c => c.id === selectedCropId) || CROPS_CATALOG[0];
  const currentDistrict = DISTRICTS.find(d => d.id === selectedDistrictId) || DISTRICTS[0];

  // Dynamic calculations for each channel based on lotQuantity
  const channels = PRICE_CHANNELS_DEMO.map(ch => {
    const grossTotal = ch.offeredRate * lotQuantity;
    const isMandi = ch.id === 'mandi-pune';
    // For direct buyers on AgriLink, transport is borne by the buyer (₹0 farmer deduction) and 0% cess.
    // For traditional Mandi, farmer pays transport and APMC cess.
    const transportEst = isMandi ? Math.round((ch.distanceKm * 18 + 300) * (lotQuantity / 1000)) : 0;
    const cessTotal = isMandi ? Math.round(grossTotal * 0.015) : 0;
    const netTotal = grossTotal - transportEst - cessTotal;
    const netPerKg = (netTotal / lotQuantity).toFixed(2);

    return {
      ...ch,
      isMandi,
      calculatedGross: grossTotal,
      calculatedTransport: transportEst,
      calculatedCess: cessTotal,
      calculatedNet: netTotal,
      calculatedNetPerKg: Number(netPerKg)
    };
  });

  // Sort channels by net realization descending
  const sortedChannels = [...channels].sort((a, b) => b.calculatedNet - a.calculatedNet);
  const bestChannel = sortedChannels[0];
  const traditionalChannel = channels.find(c => c.id === 'mandi-pune') || sortedChannels[sortedChannels.length - 1];
  const netGain = bestChannel.calculatedNet - traditionalChannel.calculatedNet;

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-green">
            <Sparkles size={12} />
            Smart Price Discovery Engine
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Real-time Arbitrage & Net Realisation Matrix
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'बाजारभाव गुप्तवार्ता व थेट नफा शोध' : 'Market Intelligence & Net Price Discovery'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          {lang === 'mr'
            ? 'थेट खरेदीदारांना विक्री करून वाहतूक व सेस कपात वाचवा — खरेदीदार वाहतूक खर्च करतात आणि शेतकऱ्यांना १००% रक्कम मिळते.'
            : 'Compare direct buyers vs Mandi — AgriLink institutional buyers fund logistics, giving farmers 100% full payout with zero deductions.'}
        </p>
      </div>

      {/* Filter Bar: Crop, Location, Quantity */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('selectCrop')}</label>
            <select 
              className="form-control form-select"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
            >
              {CROPS_CATALOG.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nameMr}) - Base: ₹{c.avgPrice}/KG
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('selectLocation')}</label>
            <select 
              className="form-control form-select"
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
            >
              {DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.nameMr})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Lot Quantity (KG)</label>
            <input 
              type="number" 
              className="form-control"
              value={lotQuantity}
              onChange={(e) => setLotQuantity(Math.max(100, Number(e.target.value)))}
              step="100"
              min="100"
            />
          </div>

          <div>
            <button 
              onClick={() => setIsCreateLotModalOpen(true)}
              className="btn btn-primary"
              style={{ width: '100%', height: '42px' }}
            >
              <span>+ Create Lot from this Rate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Net Farmer Realisation Formula Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        color: '#ffffff',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#86efac', fontWeight: 800, letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
            AgriLink Direct Trade Advantage
          </span>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'monospace', color: '#f8fafc' }}>
            Direct Buyer Payout = 100% Gross Offered Price (Zero Transport & Cess Deductions)
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '6px 0 0 0' }}>
            Buyers arrange and fund transport separately with 0% APMC cess, whereas Mandi cuts freight, 1.5% cess, and commission.
          </p>
        </div>

        {/* Highlighting the Extra Income */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1.5px solid #22c55e',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: '#86efac', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>
            Additional Income vs Mandi
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4ade80' }}>
            +₹{netGain.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
            for {lotQuantity.toLocaleString()} KG {currentCrop.name}
          </span>
        </div>
      </div>

      {/* Channels Comparative Cards Grid */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', color: 'var(--slate-800)' }}>
          {lang === 'mr' ? 'खरेदीदार व बाजारभाव तुलना तालिका' : 'Buyer Channels & Net Return Comparison'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {sortedChannels.map((channel, idx) => {
            const isBest = channel.id === bestChannel.id;
            const isTraditional = channel.id === 'mandi-pune';

            return (
              <div 
                key={channel.id}
                className="card hover-lift"
                style={{
                  border: isBest ? '2px solid #22c55e' : '1px solid var(--border-subtle)',
                  background: isBest ? 'linear-gradient(135deg, rgba(240, 253, 244, 0.7) 0%, #ffffff 100%)' : '#ffffff',
                  padding: '20px',
                  position: 'relative'
                }}
              >
                {isBest && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '24px',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 12px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Award size={13} />
                    {t('bestNetPriceBadge')}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  {/* Channel Info */}
                  <div style={{ maxWidth: '420px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className={`badge ${isBest ? 'badge-green' : isTraditional ? 'badge-red' : 'badge-blue'}`}>
                        {channel.type}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} />
                        {channel.distanceKm} km from farm
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: '4px 0' }}>
                      {channel.name}
                    </h4>

                    <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', margin: 0 }}>
                      Payment: <strong style={{ color: 'var(--slate-700)' }}>{channel.paymentTerm}</strong> • Trust: <strong style={{ color: '#16a34a' }}>{channel.paymentReliability}</strong>
                    </p>
                  </div>

                  {/* Pricing Breakdown: Rate, Transport, Net */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {/* Gross Rate */}
                    <div style={{ textAlign: 'center', minWidth: '100px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                        Offered Rate
                      </span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-800)' }}>
                        ₹{channel.offeredRate.toFixed(2)}
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--slate-500)' }}>/KG</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                        Gross: ₹{channel.calculatedGross.toLocaleString()}
                      </span>
                    </div>

                    {/* Logistics & Cess Deductions */}
                    <div style={{ textAlign: 'center', minWidth: '110px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                        Logistics & Cess
                      </span>
                      {channel.isMandi ? (
                        <>
                          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#dc2626' }}>
                            – ₹{(channel.calculatedTransport + channel.calculatedCess).toLocaleString()}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                            Tr: ₹{channel.calculatedTransport} | Cess: ₹{channel.calculatedCess}
                          </span>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a' }}>
                            ₹0 (Free)
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>
                            Paid by Buyer
                          </span>
                        </>
                      )}
                    </div>

                    {/* Net Realisation */}
                    <div style={{
                      background: isBest ? '#15803d' : 'var(--slate-100)',
                      color: isBest ? '#ffffff' : 'var(--slate-900)',
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      minWidth: '150px'
                    }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, opacity: 0.9, display: 'block' }}>
                        Net Farmer Realisation
                      </span>
                      <div style={{ fontSize: '1.45rem', fontWeight: 900, lineHeight: 1.1 }}>
                        ₹{channel.calculatedNet.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, opacity: 0.9 }}>
                        {channel.isMandi 
                          ? `₹${channel.calculatedNetPerKg.toFixed(2)} / KG Net` 
                          : `₹${channel.calculatedNetPerKg.toFixed(2)} / KG (100%)`}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isBest ? (
                        <button 
                          onClick={() => { setActiveTab('offers'); }}
                          className="btn btn-primary"
                        >
                          <span>Review Offers</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setActiveTab('buyerMatching'); }}
                          className="btn btn-secondary btn-sm"
                        >
                          <span>Compare</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
