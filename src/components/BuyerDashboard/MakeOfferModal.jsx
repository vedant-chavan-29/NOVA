import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Tag, 
  ShieldCheck, 
  Calendar, 
  Truck, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  Lock
} from 'lucide-react';

const MakeOfferModalContent = () => {
  const { 
    currentUser,
    setIsMakeOfferModalOpen, 
    selectedLotForOffer, 
    submitOffer, 
    lang, 
    t 
  } = useApp();

  const [offeredRate, setOfferedRate] = useState(selectedLotForOffer?.expectedPrice || 28);
  const [quantityRequested, setQuantityRequested] = useState(selectedLotForOffer?.quantity || 1000);
  const [pickupDate, setPickupDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [qualityRequirement, setQualityRequirement] = useState(`Certified Grade ${selectedLotForOffer.grade} (${selectedLotForOffer.bulbSize})`);
  const [paymentTerms, setPaymentTerms] = useState("100% Escrow deposit locked upfront with AgriLink. Auto-released on delivery confirmation.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalOffered = offeredRate * quantityRequested;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitOffer({
        lotId: selectedLotForOffer.id,
        offeredRate,
        quantityRequested,
        pickupDate,
        qualityRequirement,
        paymentTerms,
        buyerName: currentUser?.organization || currentUser?.name || "Verified Institutional Buyer",
        buyerPhone: currentUser?.phone || "+91 98902 44100"
      });
      setIsSubmitting(false);
      setIsMakeOfferModalOpen(false);
    }, 600);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg">
        {/* Close Button */}
        <button 
          onClick={() => setIsMakeOfferModalOpen(false)}
          className="modal-close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-blue">
              <Tag size={12} />
              Formal Commercial Bid Submission
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Target: Lot #{selectedLotForOffer.id}
            </span>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Submit Digital Purchase Offer
          </h3>
        </div>

        {/* Lot Target Info Card */}
        <div style={{ background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>PRODUCE LOT</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              {selectedLotForOffer.crop} ({selectedLotForOffer.variety}) • Grade {selectedLotForOffer.grade}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
              Farmer: <strong>{selectedLotForOffer.farmerName}</strong> ({selectedLotForOffer.location})
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>FARMER ASKING PRICE</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16a34a' }}>
              ₹{selectedLotForOffer.expectedPrice} / {selectedLotForOffer.unit}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>
              Available: {selectedLotForOffer.quantity.toLocaleString()} {selectedLotForOffer.unit}
            </span>
          </div>
        </div>

        {/* Offer Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Offered Bid Price (₹ per {selectedLotForOffer.unit})</label>
              <input 
                type="number"
                className="form-control"
                style={{ fontSize: '1.1rem', fontWeight: 700 }}
                value={offeredRate}
                onChange={(e) => setOfferedRate(Number(e.target.value))}
                step="0.5"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Required Quantity ({selectedLotForOffer.unit})</label>
              <input 
                type="number"
                className="form-control"
                value={quantityRequested}
                onChange={(e) => setQuantityRequested(Number(e.target.value))}
                min="100"
                max={selectedLotForOffer.quantity}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Farm Pickup Date</label>
              <input 
                type="date"
                className="form-control"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quality Specification Requirement</label>
              <input 
                type="text"
                className="form-control"
                value={qualityRequirement}
                onChange={(e) => setQualityRequirement(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Payment Escrow Terms</label>
              <textarea 
                className="form-control"
                rows="2"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              />
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Total Purchase Valuation:</span>
              <strong style={{ fontSize: '1.15rem', color: '#f8fafc' }}>₹{totalOffered.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Transport & Logistics:</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Arranged by Buyer (₹0 Farmer Deduction)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '8px' }}>
              <span style={{ fontSize: '0.86rem', color: '#86efac', fontWeight: 700 }}>Farmer Direct Payout:</span>
              <strong style={{ fontSize: '1.3rem', color: '#4ade80' }}>₹{totalOffered.toLocaleString()} (₹{Number(offeredRate).toFixed(2)}/KG • 100%)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button"
              onClick={() => setIsMakeOfferModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{ fontWeight: 800 }}
            >
              <Lock size={16} />
              <span>{isSubmitting ? 'Locking Escrow & Sending...' : 'Confirm & Send Digital Offer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MakeOfferModal = () => {
  const { isMakeOfferModalOpen, selectedLotForOffer } = useApp();
  if (!isMakeOfferModalOpen || !selectedLotForOffer) return null;
  return <MakeOfferModalContent key={selectedLotForOffer.id} />;
};
