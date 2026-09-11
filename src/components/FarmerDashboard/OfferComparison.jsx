import React, { useState, useEffect } from 'react';
import { useApp, isUserLot } from '../../context/AppContext';
import { 
  Scale, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Repeat, 
  ShieldCheck, 
  Star, 
  Truck, 
  ArrowRight, 
  Sparkles,
  AlertCircle,
  Package,
  Plus
} from 'lucide-react';

export const OfferComparison = () => {
  const { 
    currentUser,
    offers, 
    lots, 
    acceptOffer, 
    counterOffer, 
    rejectOffer, 
    lang, 
    t, 
    setActiveTab,
    selectedLotIdForOffers,
    setSelectedLotIdForOffers,
    setIsCreateLotModalOpen
  } = useApp();

  const [counterInputOfferId, setCounterInputOfferId] = useState(null);
  const [counterRate, setCounterRate] = useState('');

  // 1. Identify all lots belonging to this farmer
  const myLots = lots.filter(l => isUserLot(l, currentUser));
  const myLotIds = myLots.map(l => l.id);

  // 2. Determine active selected lot
  const [activeLotId, setActiveLotId] = useState(() => {
    if (selectedLotIdForOffers && myLotIds.includes(selectedLotIdForOffers)) {
      return selectedLotIdForOffers;
    }
    const lotWithOffers = myLots.find(l => offers.some(o => o.lotId === l.id));
    return lotWithOffers ? lotWithOffers.id : (myLots[0]?.id || null);
  });

  // Keep activeLotId in sync if selectedLotIdForOffers changes externally
  useEffect(() => {
    if (selectedLotIdForOffers && myLotIds.includes(selectedLotIdForOffers)) {
      setActiveLotId(selectedLotIdForOffers);
    }
  }, [selectedLotIdForOffers, myLotIds]);

  // Target lot and its offers
  const targetLot = myLots.find(l => l.id === activeLotId) || myLots[0] || null;
  const lotOffers = targetLot ? offers.filter(o => o.lotId === targetLot.id) : [];

  // Total offers for this farmer across all lots
  const allMyOffers = offers.filter(o => myLotIds.includes(o.lotId));

  // Best offer logic: highest offered rate / payout with high reliability
  const sortedOffers = [...lotOffers].sort((a, b) => (b.totalOfferedAmount || b.netFarmerRealisation || 0) - (a.totalOfferedAmount || a.netFarmerRealisation || 0));
  const bestOfferId = sortedOffers.length > 0 ? sortedOffers[0].id : null;

  const handleAccept = (offerId) => {
    const txn = acceptOffer(offerId);
    if (txn) {
      setTimeout(() => {
        setActiveTab('transactions');
      }, 1400);
    }
  };

  const handleSendCounter = (offerId) => {
    if (!counterRate || isNaN(counterRate)) return;
    counterOffer(offerId, counterRate);
    setCounterInputOfferId(null);
    setCounterRate('');
  };

  // If farmer has no lots uploaded yet
  if (myLots.length === 0) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-green">
              <Scale size={12} />
              Buyer Offer & Bidding Console
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {lang === 'mr' ? 'खरेदी प्रस्ताव तुलना व थेट करार' : 'Buyer Offer Comparison & Deal Confirmation'}
          </h2>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Package size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
            {lang === 'mr' ? 'अद्याप कोणतेही पीक लॉट नोंदवले नाही' : 'No Active Crop Lots Found'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', maxWidth: '500px', margin: '0 auto 24px' }}>
            {lang === 'mr' 
              ? 'आपल्या शेतातील पिकाचा लॉट तयार करा आणि थेट संस्थात्मक खरेदीदारांकडून खरेदी प्रस्ताव मिळवा.'
              : `You have not listed any crop lots yet under ${currentUser?.phone || 'your account'}. Publish your harvest lot to start receiving verified buyer bids.`}
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
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-green">
            <Scale size={12} />
            Digital Negotiation & Bidding Matrix
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            {allMyOffers.length} Total Offers Received across {myLots.length} Lots
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'खरेदी प्रस्ताव तुलना व थेट करार' : 'Buyer Offer Comparison & Deal Confirmation'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          {lang === 'mr' 
            ? 'शेतकऱ्यांना १००% थेट पूर्ण मोबदला – वाहतूक खर्च खरेदीदाराकडून केला जातो, शेतकऱ्याच्या रकमेतून कोणतीही कपात नाही.'
            : 'Direct Farm-Gate Procurement – 100% payout to farmer with zero transport deductions (logistics arranged & funded by buyer).'}
        </p>
      </div>

      {/* LOT SELECTION TABS / PILLS */}
      {myLots.length > 1 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Select Your Crop Lot to View Offers:
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {myLots.map(lot => {
              const count = offers.filter(o => o.lotId === lot.id).length;
              const isSelected = targetLot?.id === lot.id;
              return (
                <button
                  key={lot.id}
                  onClick={() => {
                    setActiveLotId(lot.id);
                    if (setSelectedLotIdForOffers) setSelectedLotIdForOffers(lot.id);
                  }}
                  style={{
                    background: isSelected ? 'var(--primary-700)' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--slate-700)',
                    border: isSelected ? '2px solid var(--primary-700)' : '1px solid var(--slate-300)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{lot.crop} ({lot.quantity} {lot.unit})</span>
                  <span style={{
                    background: isSelected ? '#ffffff' : (count > 0 ? '#dcfce7' : '#f1f5f9'),
                    color: isSelected ? 'var(--primary-800)' : (count > 0 ? '#15803d' : '#64748b'),
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {count} {count === 1 ? 'Offer' : 'Offers'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Benchmark Summary Strip */}
      {targetLot && (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          color: '#ffffff',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#22c55e', color: '#0f172a', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '0.78rem' }}>
              LOT #{targetLot.id}
            </div>
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              {targetLot.quantity} {targetLot.unit} {targetLot.crop} ({targetLot.variety}) • Farm Gate: {targetLot.location}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
            <span>Asking Target: <strong style={{ color: '#fef08a' }}>₹{targetLot.expectedPrice}/{targetLot.unit}</strong></span>
            <span>•</span>
            <span>Bids Received: <strong style={{ color: '#86efac' }}>{lotOffers.length} Verified Buyers</strong></span>
          </div>
        </div>
      )}

      {/* If no offers received yet for this specific lot */}
      {lotOffers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#fef9c3',
            color: '#ca8a04',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <AlertCircle size={28} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 6px 0' }}>
            {lang === 'mr' ? 'या लॉटसाठी अद्याप खरेदी प्रस्ताव आले नाहीत' : `No Bids Received Yet for Lot #${targetLot?.id}`}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', maxWidth: '480px', margin: '0 auto 16px' }}>
            {lang === 'mr'
              ? 'आपला पीक लॉट खरेदीदार बाजारपेठेत दृश्यमान आहे. खरेदीदाराने प्रस्ताव दिल्यावर तो येथे तात्काळ दिसेल.'
              : 'Your crop lot is published and visible to institutional buyers in the Produce Marketplace. As soon as a buyer places an offer, you will be able to review, accept, or counter here.'}
          </p>
          <button 
            onClick={() => setActiveTab('myLots')}
            className="btn btn-secondary btn-sm"
            style={{ margin: '0 auto' }}
          >
            <span>View All My Lots</span>
            <ArrowRight size={13} />
          </button>
        </div>
      ) : (
        /* Offer Comparison Matrix Table */
        <div className="table-container card" style={{ padding: 0, marginBottom: '28px' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Buyer / Enterprise</th>
                <th>Offered Rate</th>
                <th>Net Farmer Payout (100%)</th>
                <th>Buyer Rating</th>
                <th>Payment Reliability</th>
                <th>Match Score</th>
                <th>Negotiation Action</th>
              </tr>
            </thead>
            <tbody>
            {sortedOffers.map((offer) => {
              const isBest = offer.id === bestOfferId && offer.status !== 'Rejected';
              const isAccepted = offer.status === 'Accepted';
              const isRejected = offer.status === 'Rejected';
              const isCountered = offer.status === 'Countered';
              const totalPayout = offer.totalOfferedAmount || (offer.offeredRate * (targetLot?.quantity || 1000));

              return (
                <tr 
                  key={offer.id} 
                  style={{ 
                    background: isBest ? 'rgba(34, 197, 94, 0.06)' : undefined,
                    opacity: isRejected ? 0.5 : 1
                  }}
                >
                  {/* Buyer Details */}
                  <td>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                          {offer.buyerName}
                        </strong>
                        {isBest && (
                          <span style={{
                            background: '#16a34a',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-full)'
                          }}>
                            BEST OFFER
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)', display: 'block' }}>
                        {offer.buyerType} • {offer.buyerLocation}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>
                        ✓ GST & FSSAI Verified
                      </span>
                    </div>
                  </td>

                  {/* Offered Rate */}
                  <td>
                    <div>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                        ₹{offer.offeredRate.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}> / KG</span>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'block', fontWeight: 600 }}>
                        ✓ Zero Farmer Deductions
                      </span>
                    </div>
                  </td>

                  {/* Net Price Realisation (100% Payout to Farmer) */}
                  <td>
                    <div style={{
                      background: isBest ? '#15803d' : 'var(--slate-100)',
                      color: isBest ? '#ffffff' : 'var(--slate-900)',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      display: 'inline-block'
                    }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>
                        ₹{totalPayout.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.9, display: 'block' }}>
                        ₹{offer.offeredRate.toFixed(2)} / KG • 100% Net
                      </span>
                    </div>
                  </td>

                  {/* Rating */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      <strong style={{ fontSize: '0.88rem' }}>{offer.rating}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>/ 5.0</span>
                    </div>
                  </td>

                  {/* Payment Reliability */}
                  <td>
                    <div>
                      <strong style={{ color: '#16a34a', fontSize: '0.92rem' }}>
                        {offer.reliabilityScore}%
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>
                        Escrow Deposit Guaranteed
                      </span>
                    </div>
                  </td>

                  {/* Match Score */}
                  <td>
                    <span className="badge badge-green" style={{ fontSize: '0.82rem', padding: '4px 8px' }}>
                      {offer.matchScore}/100
                    </span>
                  </td>

                  {/* Negotiation Action Buttons */}
                  <td>
                    {isAccepted ? (
                      <div>
                        <span className="badge badge-green" style={{ fontSize: '0.82rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} />
                          DEAL LOCKED
                        </span>
                        {offer.paymentStatus === 'Advance Paid' ? (
                          <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                            🪙 Advance Received: ₹{offer.advancePaid?.toLocaleString()}
                            {offer.remainingBalance > 0 && (
                              <span style={{ display: 'block', color: '#64748b', fontWeight: 500 }}>
                                Balance on Delivery: ₹{offer.remainingBalance?.toLocaleString()}
                              </span>
                            )}
                          </div>
                        ) : offer.paymentStatus === 'Full Payment Escrowed' ? (
                          <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                            💎 100% Escrow Secured
                          </div>
                        ) : (
                          <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>
                            ⏳ Buyer Payment Pending
                          </div>
                        )}
                      </div>
                    ) : isRejected ? (
                      <span className="badge badge-red">
                        <XCircle size={14} />
                        Declined
                      </span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {counterInputOfferId === offer.id ? (
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <input 
                              type="number"
                              className="form-control"
                              style={{ width: '80px', padding: '4px 6px', fontSize: '0.8rem' }}
                              placeholder="₹/KG"
                              value={counterRate}
                              onChange={(e) => setCounterRate(e.target.value)}
                              step="0.5"
                            />
                            <button 
                              onClick={() => handleSendCounter(offer.id)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 8px' }}
                            >
                              Send
                            </button>
                            <button 
                              onClick={() => setCounterInputOfferId(null)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 6px' }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              onClick={() => handleAccept(offer.id)}
                              className={`btn ${isBest ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                              style={{ fontWeight: 700 }}
                            >
                              <CheckCircle2 size={13} />
                              <span>Accept</span>
                            </button>

                            <button 
                              onClick={() => {
                                setCounterInputOfferId(offer.id);
                                setCounterRate((offer.offeredRate + 0.5).toString());
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Counter Offer"
                            >
                              <Repeat size={13} />
                              <span>Counter</span>
                            </button>

                            <button 
                              onClick={() => rejectOffer(offer.id)}
                              className="btn btn-secondary btn-sm"
                              title="Decline Offer"
                            >
                              <XCircle size={13} />
                            </button>
                          </div>
                        )}

                        {isCountered && (
                          <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700 }}>
                            Countered at ₹{offer.counterRate}/KG
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* Offer Terms & Escrow Assurance Box */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
              {lang === 'mr' ? 'अॅग्रीलिंक १००% एस्क्रो हमी व शून्य वाहतूक कपात' : 'AgriLink Escrow Guarantee & Zero Farmer Deductions'}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', margin: '2px 0 0 0' }}>
              {lang === 'mr'
                ? 'प्रस्ताव स्वीकारताच १००% रक्कम एस्क्रोमध्ये सुरक्षित होते. वाहतूक व्यवस्था खरेदीदाराकडून स्वतंत्रपणे केली जाते.'
                : 'Upon offer acceptance, 100% of purchase value is deposited in AgriLink Escrow upfront. Buyer covers transport separately.'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('logistics')}
          className="btn btn-primary"
        >
          <span>Check Logistics Status</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
