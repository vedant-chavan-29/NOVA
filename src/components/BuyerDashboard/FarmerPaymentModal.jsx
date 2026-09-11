import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Coins, 
  Building2, 
  User, 
  Phone, 
  Truck, 
  Package, 
  AlertCircle, 
  Sparkles,
  Lock,
  Landmark,
  Smartphone,
  Check
} from 'lucide-react';

export const FarmerPaymentModal = () => {
  const { 
    currentUser,
    isFarmerPaymentModalOpen, 
    closeFarmerPaymentModal, 
    selectedDealForPayment,
    processFarmerPayment,
    openBookTransportModal,
    selectSelfPickup,
    lang 
  } = useApp();

  const deal = selectedDealForPayment || {};

  // Form states
  const [paymentType, setPaymentType] = useState('advance'); // 'advance' | 'full'
  const [advancePercent, setAdvancePercent] = useState(30);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI Instant Escrow');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState(null);

  // Total deal calculation
  const totalAmount = Number(
    deal.totalValue || 
    deal.totalOfferedAmount || 
    (Number(deal.quantity || deal.quantityRequested || 1000) * Number(deal.agreedPrice || deal.offeredRate || 28))
  );

  // Calculate actual amount to pay now
  const calculatePayNowAmount = () => {
    if (paymentType === 'full') return totalAmount;
    if (customAmount && !isNaN(customAmount) && Number(customAmount) > 0) {
      return Math.min(totalAmount, Number(customAmount));
    }
    return Math.round((totalAmount * advancePercent) / 100);
  };

  const payNowAmount = calculatePayNowAmount();
  const remainingBalance = Math.max(0, totalAmount - payNowAmount);

  useEffect(() => {
    if (isFarmerPaymentModalOpen) {
      setCompletedTxn(null);
      setIsProcessing(false);
      setPaymentType('advance');
      setAdvancePercent(30);
      setCustomAmount('');
    }
  }, [isFarmerPaymentModalOpen, deal]);

  if (!isFarmerPaymentModalOpen) return null;

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const txn = processFarmerPayment({
        orderId: deal.id || deal.orderId,
        offerId: deal.offerId || deal.id,
        paymentType,
        amountPaid: payNowAmount,
        paymentMode,
        notes: paymentType === 'advance' 
          ? `Advance payment of ${advancePercent}% (₹${payNowAmount.toLocaleString()}) secured for farmer harvest` 
          : `100% full payment (₹${payNowAmount.toLocaleString()}) deposited into escrow`
      });

      setIsProcessing(false);
      setCompletedTxn(txn);
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.78)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #e2e8f0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          padding: '20px 24px',
          color: '#ffffff',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Coins size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Step 1 of 2: Farmer Payment Escrow
                </span>
                <span style={{ fontSize: '0.76rem', color: '#a7f3d0' }}>
                  Deal #{deal.lotId || deal.id}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.28rem', fontWeight: 800, color: '#ffffff' }}>
                {lang === 'mr' ? 'शेतकऱ्याला रक्कम अदा करा' : 'Payment to Farmer / FPO (Advance or Full)'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#a7f3d0' }}>
                {lang === 'mr' 
                  ? 'वाहतूक नियोजनापूर्वी शेतकऱ्याची आगाऊ किंवा संपूर्ण रक्कम सुरक्षित करा' 
                  : 'Pay advance token or full amount to secure produce before choosing transport'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeFarmerPaymentModal}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'background 0.15s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Screen: Transition to Transport */}
        {completedTxn ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#15803d',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '3px solid #86efac'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b', margin: '0 0 6px 0' }}>
              Payment Secured in Escrow!
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#166534', margin: '0 0 20px 0', maxWidth: '500px', display: 'inline-block' }}>
              ₹{completedTxn.amount.toLocaleString()} ({completedTxn.type}) has been safely locked in the escrow clearing vault for Farmer <strong>{completedTxn.farmerName}</strong>.
            </p>

            {/* Receipt Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px 20px',
              maxWidth: '480px',
              margin: '0 auto 24px auto',
              textAlign: 'left',
              fontSize: '0.84rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>UTR Reference Number:</span>
                <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{completedTxn.utrNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Farmer / Payee:</span>
                <strong>{completedTxn.farmerName} ({deal.farmerPhone || '+91 98220 14892'})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Amount Paid Now:</span>
                <strong style={{ color: '#15803d', fontSize: '0.95rem' }}>₹{completedTxn.amount.toLocaleString()}</strong>
              </div>
              {remainingBalance > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                  <span style={{ color: '#64748b' }}>Remaining Balance on Delivery:</span>
                  <strong style={{ color: '#d97706' }}>₹{remainingBalance.toLocaleString()}</strong>
                </div>
              )}
            </div>

            {/* Next Action: Transport Options */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: '1.5px solid #86efac',
              borderRadius: '16px',
              padding: '20px',
              maxWidth: '540px',
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800, color: '#166534' }}>
                Next Step: Choose Transport & Fulfillment
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: '#15803d' }}>
                Your farmer payment is locked. Now select whether you want to book platform transport with live map distance or arrange self-pickup.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    closeFarmerPaymentModal();
                    openBookTransportModal(deal);
                  }}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                    padding: '10px 22px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    borderRadius: '10px'
                  }}
                >
                  <Truck size={16} />
                  <span>Book Platform Transport</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeFarmerPaymentModal();
                    selectSelfPickup(deal.id || deal.offerId);
                  }}
                  className="btn btn-secondary"
                  style={{
                    padding: '10px 20px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    borderRadius: '10px'
                  }}
                >
                  <Package size={16} />
                  <span>Arrange Self-Pickup</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleConfirmPayment} style={{ padding: '24px' }}>
            
            {/* Deal Info Summary Banner */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Crop & Farmer Details
                </span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {deal.crop || 'Produce'} • {deal.quantity || deal.quantityRequested || 1000} KG
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                  Farmer: <strong>{deal.farmerName || 'Ramesh Patil'}</strong> ({deal.farmerPhone || '+91 98220 14892'}) • {deal.pickupLocation || 'Haveli, Pune'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Agreed Deal Value
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
                  ₹{totalAmount.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  @ ₹{deal.agreedPrice || deal.offeredRate || 28} / KG
                </span>
              </div>
            </div>

            {/* STEP 1: PAYMENT TYPE SELECTION (ADVANCE vs FULL) */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                1. Select Payment Method to Farmer:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Option 1: Advance Payment */}
                <div
                  onClick={() => setPaymentType('advance')}
                  style={{
                    border: paymentType === 'advance' ? '2px solid #059669' : '1.5px solid #e2e8f0',
                    background: paymentType === 'advance' ? '#ecfdf5' : '#ffffff',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🪙</span>
                      <strong style={{ fontSize: '0.95rem', color: paymentType === 'advance' ? '#064e3b' : '#0f172a' }}>
                        Advance Payment
                      </strong>
                    </div>
                    {paymentType === 'advance' && (
                      <span style={{
                        background: '#059669',
                        color: '#ffffff',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                    Deposit an advance token into escrow. Locks the farmer's crop harvest. The remaining balance settles upon delivery.
                  </p>

                  <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                    Recommended: 20% to 50% Advance
                  </div>
                </div>

                {/* Option 2: Full Payment */}
                <div
                  onClick={() => setPaymentType('full')}
                  style={{
                    border: paymentType === 'full' ? '2px solid #059669' : '1.5px solid #e2e8f0',
                    background: paymentType === 'full' ? '#ecfdf5' : '#ffffff',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>💎</span>
                      <strong style={{ fontSize: '0.95rem', color: paymentType === 'full' ? '#064e3b' : '#0f172a' }}>
                        100% Full Payment
                      </strong>
                    </div>
                    {paymentType === 'full' && (
                      <span style={{
                        background: '#059669',
                        color: '#ffffff',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                    Deposit 100% full deal amount into AgriLink Escrow vault. Released to farmer bank account upon delivery inspection.
                  </p>

                  <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                    Fast-Track: Zero Balance Remaining
                  </div>
                </div>
              </div>
            </div>

            {/* Advance Percentage Chips (Only if Advance is selected) */}
            {paymentType === 'advance' && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '20px'
              }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Select Advance Token Percentage:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {[20, 30, 50].map((pct) => {
                    const isSelected = advancePercent === pct && !customAmount;
                    const val = Math.round((totalAmount * pct) / 100);
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setAdvancePercent(pct);
                          setCustomAmount('');
                        }}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                          background: isSelected ? '#ecfdf5' : '#ffffff',
                          color: isSelected ? '#065f46' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        {pct}% Advance (₹{val.toLocaleString()})
                      </button>
                    );
                  })}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Or Custom ₹:</span>
                    <input
                      type="number"
                      min="500"
                      max={totalAmount}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 10000"
                      style={{
                        width: '90px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: customAmount ? '2px solid #059669' : '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textAlign: 'center'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT BREAKDOWN CARD */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #334155' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Total Deal Amount:</span>
                <strong style={{ fontSize: '1rem', color: '#ffffff' }}>₹{totalAmount.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 800 }}>
                    💸 Amount Payable Now ({paymentType === 'advance' ? `${advancePercent}% Advance` : '100% Full Payment'}):
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>
                    Secured immediately in farmer escrow account
                  </span>
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#34d399' }}>
                  ₹{payNowAmount.toLocaleString()}
                </div>
              </div>

              {remainingBalance > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed #334155', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#fbbf24' }}>
                    ⏳ Remaining Balance on Delivery:
                  </span>
                  <strong style={{ fontSize: '0.92rem', color: '#fbbf24' }}>
                    ₹{remainingBalance.toLocaleString()}
                  </strong>
                </div>
              )}
            </div>

            {/* STEP 2: PAYMENT METHOD */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                2. Select Payment Channel:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: paymentMode === 'UPI Instant Escrow' ? '2px solid #059669' : '1px solid #cbd5e1',
                  background: paymentMode === 'UPI Instant Escrow' ? '#ecfdf5' : '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: paymentMode === 'UPI Instant Escrow' ? '#064e3b' : '#334155'
                }}>
                  <input
                    type="radio"
                    name="payMode"
                    checked={paymentMode === 'UPI Instant Escrow'}
                    onChange={() => setPaymentMode('UPI Instant Escrow')}
                  />
                  <Smartphone size={16} />
                  <span>UPI / GPay / PhonePe</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: paymentMode === 'NetBanking Escrow' ? '2px solid #059669' : '1px solid #cbd5e1',
                  background: paymentMode === 'NetBanking Escrow' ? '#ecfdf5' : '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: paymentMode === 'NetBanking Escrow' ? '#064e3b' : '#334155'
                }}>
                  <input
                    type="radio"
                    name="payMode"
                    checked={paymentMode === 'NetBanking Escrow'}
                    onChange={() => setPaymentMode('NetBanking Escrow')}
                  />
                  <Landmark size={16} />
                  <span>NetBanking (SBI/HDFC)</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: paymentMode === 'Corporate e-NAM Escrow' ? '2px solid #059669' : '1px solid #cbd5e1',
                  background: paymentMode === 'Corporate e-NAM Escrow' ? '#ecfdf5' : '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: paymentMode === 'Corporate e-NAM Escrow' ? '#064e3b' : '#334155'
                }}>
                  <input
                    type="radio"
                    name="payMode"
                    checked={paymentMode === 'Corporate e-NAM Escrow'}
                    onChange={() => setPaymentMode('Corporate e-NAM Escrow')}
                  />
                  <Building2 size={16} />
                  <span>e-NAM Escrow Wallet</span>
                </label>
              </div>
            </div>

            {/* Escrow Trust Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              fontSize: '0.74rem',
              color: '#166534',
              marginBottom: '20px'
            }}>
              <ShieldCheck size={16} color="#16a34a" />
              <span>
                <strong>100% Protected Escrow:</strong> Your funds are held securely by AgriLink Clearing Vault and disbursed to farmer bank account upon digital delivery confirmation.
              </span>
            </div>

            {/* Action Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button
                type="button"
                onClick={closeFarmerPaymentModal}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  padding: '11px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
                }}
              >
                <Lock size={16} />
                <span>
                  {isProcessing 
                    ? 'Processing Escrow Payment...' 
                    : `Confirm & Pay ₹${payNowAmount.toLocaleString()}`
                  }
                </span>
                <ArrowRight size={16} />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
