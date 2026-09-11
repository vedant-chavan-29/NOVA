import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Tag, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Repeat, 
  ArrowRight, 
  Building2, 
  ShieldCheck,
  Calendar,
  Truck,
  Package,
  AlertCircle,
  Phone,
  Sparkles,
  Coins,
  CreditCard
} from 'lucide-react';

export const MyOffers = () => {
  const { 
    currentUser, 
    offers, 
    lots, 
    transportBookings,
    openFarmerPaymentModal,
    openBookTransportModal,
    selectSelfPickup,
    acceptTransportCounter,
    lang, 
    t, 
    setActiveTab 
  } = useApp();

  const buyerName = currentUser?.organization || currentUser?.name || 'Verified Buyer';

  // Filter offers for this buyer
  const displayedOffers = offers.filter(o => 
    !currentUser || 
    (currentUser.id && o.buyerId === currentUser.id) ||
    (currentUser.organization && o.buyerName?.toLowerCase().includes(currentUser.organization.toLowerCase())) ||
    (currentUser.name && o.buyerName?.toLowerCase().includes(currentUser.name.toLowerCase())) ||
    offers.indexOf(o) < 2 // Fallback so buyer always has context if brand new
  );

  // Phase 1: Accepted by farmer, but Payment to Farmer is NOT yet completed
  const acceptedOffersAwaitingPayment = displayedOffers.filter(o => {
    return o.status === 'Accepted' && (!o.paymentStatus || o.paymentStatus === 'Payment Pending');
  });

  // Phase 2: Payment has been made (Advance or Full), now ready for Logistics / Transport
  const acceptedOffersAwaitingLogistics = displayedOffers.filter(o => {
    if (o.status !== 'Accepted') return false;
    const isPaid = o.paymentStatus === 'Advance Paid' || o.paymentStatus === 'Full Payment Escrowed';
    if (!isPaid) return false;
    const booking = transportBookings.find(b => b.offerId === o.id || b.lotId === o.lotId);
    return !booking || booking.status === 'Pending Transporter Confirmation' || booking.status === 'Price Countered';
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-blue">
            <Tag size={12} />
            Procurement Bids & Contracts
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Corporate Buyer: {buyerName}
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'माझे खरेदी प्रस्ताव व सौदे' : 'My Commercial Offers & Deal Status'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          Track submitted digital offers, manage logistics fulfillment (Book Platform Transport or Self-Pickup), and verify payments.
        </p>
      </div>

      {/* 1. ACTION REQUIRED BANNER: Accepted Deals Waiting for Farmer Payment (Step 1) */}
      {acceptedOffersAwaitingPayment.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1.5px solid #fcd34d',
          borderRadius: '16px',
          padding: '18px 20px',
          marginBottom: '20px',
          boxShadow: '0 4px 15px rgba(217, 119, 6, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(180, 83, 9, 0.25)'
              }}>
                <Coins size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#78350f' }}>
                    {lang === 'mr' ? 'पायरी १: शेतकऱ्याने करार स्वीकारला! रक्कम अदा करा' : 'Step 1 of 2: Deal Accepted by Farmer! Process Payment to Farmer'}
                  </h4>
                  <span className="badge badge-amber" style={{ background: '#fef08a', color: '#854d0e', fontWeight: 800 }}>
                    {acceptedOffersAwaitingPayment.length} Payment Required
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#92400e' }}>
                  Before booking transport or self-pickup, deposit an <strong>Advance Payment (20% - 50%)</strong> or <strong>100% Full Payment</strong> into escrow to secure the harvest.
                </p>
              </div>
            </div>

            <button
              onClick={() => openFarmerPaymentModal(acceptedOffersAwaitingPayment[0])}
              className="btn btn-primary"
              style={{ 
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', 
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                boxShadow: '0 3px 10px rgba(180, 83, 9, 0.3)'
              }}
            >
              <Coins size={16} />
              <span>{lang === 'mr' ? 'शेतकऱ्याला रक्कम भरा' : 'Pay Farmer Now (Advance / Full)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ACTION REQUIRED BANNER: Payment Completed -> Waiting for Logistics Selection (Step 2) */}
      {acceptedOffersAwaitingLogistics.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '1.5px solid #86efac',
          borderRadius: '16px',
          padding: '18px 20px',
          marginBottom: '24px',
          boxShadow: '0 4px 15px rgba(22, 163, 74, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#16a34a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Truck size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#064e3b' }}>
                    {lang === 'mr' ? 'पायरी २: रक्कम सुरक्षित! वाहतूक नियोजन करा' : 'Step 2 of 2: Payment Secured in Escrow! Choose Logistics'}
                  </h4>
                  <span className="badge badge-green">
                    {acceptedOffersAwaitingLogistics.length} Deal Ready for Transit
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#166534' }}>
                  Farmer payment is locked. Now choose whether to <strong>Book Platform Transport</strong> (with online map routing) or <strong>Arrange Self-Pickup</strong>.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => openBookTransportModal(acceptedOffersAwaitingLogistics[0])}
                className="btn btn-primary btn-sm"
                style={{ background: '#16a34a', fontWeight: 800 }}
              >
                <Truck size={14} />
                <span>Book Transport Now</span>
              </button>
              <button
                onClick={() => selectSelfPickup(acceptedOffersAwaitingLogistics[0].id)}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 700 }}
              >
                <Package size={14} />
                <span>Arrange Self-Pickup</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offers Table */}
      <div className="table-container card" style={{ padding: 0 }}>
        <table className="table-custom">
          <thead>
            <tr>
              <th>Lot ID & Crop</th>
              <th>Farmer / FPO</th>
              <th>Offered Rate</th>
              <th>Quantity</th>
              <th>Gross Value</th>
              <th>Pickup Date</th>
              <th>Logistics & Negotiation Status</th>
              <th>Fulfillment Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedOffers.map(offer => {
              const targetLot = lots.find(l => l.id === offer.lotId);
              const booking = transportBookings.find(b => b.offerId === offer.id || b.lotId === offer.lotId);

              return (
                <tr key={offer.id}>
                  <td>
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--slate-900)' }}>
                        {targetLot?.crop || 'Produce'} ({targetLot?.variety})
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: '#16a34a', display: 'block', fontWeight: 700 }}>
                        {offer.lotId}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                        {targetLot?.farmerName || 'Ramesh Patil'}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)', display: 'block' }}>
                        {targetLot?.location || 'Pune, MH'}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                        ₹{offer.offeredRate.toFixed(2)}
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}> / KG</span>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontWeight: 600 }}>
                      {offer.quantityRequested.toLocaleString()} KG
                    </span>
                  </td>

                  <td>
                    <strong style={{ fontSize: '1rem', color: '#15803d' }}>
                      ₹{offer.totalOfferedAmount.toLocaleString()}
                    </strong>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {booking?.pickupDate || offer.pickupDate}
                    </span>
                  </td>

                  {/* Logistics & Negotiation Status */}
                  <td>
                    {offer.status === 'Accepted' ? (
                      (!offer.paymentStatus || offer.paymentStatus === 'Payment Pending') ? (
                        <div>
                          <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Coins size={12} />
                            Payment to Farmer Pending
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#b45309', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                            Step 1: Advance or Full Payment
                          </span>
                        </div>
                      ) : booking ? (
                        booking.status === 'Confirmed' ? (
                          <div>
                            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} />
                              Transport Confirmed
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#15803d', display: 'block', fontWeight: 700, marginTop: '2px' }}>
                              {booking.vehicleRegNumber} • {booking.driverName}
                            </span>
                          </div>
                        ) : booking.status === 'Price Countered' ? (
                          <div>
                            <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Repeat size={12} />
                              Transporter Countered: ₹{booking.counterFare}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#b45309', display: 'block', marginTop: '2px' }}>
                              {booking.counterReason || 'Rate adjustment for route'}
                            </span>
                          </div>
                        ) : booking.status === 'Self-Pickup Arranged' ? (
                          <span className="badge badge-blue">
                            <Package size={12} />
                            Self-Pickup by Buyer
                          </span>
                        ) : (
                          <span className="badge badge-blue">
                            <Clock size={12} />
                            Awaiting Transporter Acceptance
                          </span>
                        )
                      ) : (
                        <div>
                          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} />
                            {offer.paymentStatus === 'Advance Paid' 
                              ? `Advance Paid (₹${offer.advancePaid?.toLocaleString()})` 
                              : '100% Full Payment Escrowed'
                            }
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#166534', display: 'block', marginTop: '2px' }}>
                            Ready for Transport Selection
                          </span>
                        </div>
                      )
                    ) : offer.status === 'Countered' ? (
                      <span className="badge badge-amber">
                        <Repeat size={12} />
                        Farmer Countered: ₹{offer.counterRate}/KG
                      </span>
                    ) : offer.status === 'Rejected' ? (
                      <span className="badge badge-red">
                        <XCircle size={12} />
                        Declined
                      </span>
                    ) : (
                      <span className="badge badge-blue">
                        <Clock size={12} />
                        Awaiting Farmer Review
                      </span>
                    )}
                  </td>

                  {/* Fulfillment Action */}
                  <td>
                    {offer.status === 'Accepted' ? (
                      (!offer.paymentStatus || offer.paymentStatus === 'Payment Pending') ? (
                        <button
                          onClick={() => openFarmerPaymentModal(offer)}
                          className="btn btn-primary btn-sm"
                          style={{
                            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                            fontWeight: 800,
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)'
                          }}
                          title="Pay Advance or Full amount to farmer before booking transport"
                        >
                          <Coins size={13} />
                          <span>Pay Farmer (Step 1)</span>
                        </button>
                      ) : !booking ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => openBookTransportModal(offer)}
                            className="btn btn-primary btn-sm"
                            title="Book Platform Transport (Step 2)"
                            style={{ padding: '5px 10px', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            <Truck size={13} />
                            <span>Book Transport</span>
                          </button>
                          <button
                            onClick={() => selectSelfPickup(offer.id)}
                            className="btn btn-secondary btn-sm"
                            title="Self-Pickup (Get by own)"
                            style={{ padding: '5px 8px', fontSize: '0.78rem' }}
                          >
                            <Package size={13} />
                            <span>Self-Pickup</span>
                          </button>
                        </div>
                      ) : booking.status === 'Price Countered' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => acceptTransportCounter(booking.id)}
                            className="btn btn-primary btn-sm"
                            style={{ background: '#16a34a', padding: '5px 8px', fontSize: '0.76rem', fontWeight: 800 }}
                          >
                            <CheckCircle2 size={12} />
                            <span>Accept ₹{booking.counterFare}</span>
                          </button>
                          <button
                            onClick={() => openBookTransportModal(offer)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '5px 8px', fontSize: '0.76rem' }}
                          >
                            <Repeat size={12} />
                            <span>Negotiate</span>
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setActiveTab('logistics')}
                          className="btn btn-secondary btn-sm"
                        >
                          <span>Track Trip</span>
                          <ArrowRight size={13} />
                        </button>
                      )
                    ) : (
                      <button 
                        onClick={() => setActiveTab('marketplace')}
                        className="btn btn-secondary btn-sm"
                      >
                        <span>Browse More</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

