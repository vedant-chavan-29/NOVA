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
  Lock,
  Video,
  Camera,
  Play
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

  const lotImages = (selectedLotForOffer.images && selectedLotForOffer.images.length > 0)
    ? selectedLotForOffer.images 
    : [selectedLotForOffer.image];

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
        <div style={{ marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
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
        <div style={{ background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
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

        {/* ========================================================================= */}
        {/* FARMER RECORDED VIDEO & QUALITY INSPECTION STREAM FOR BUYER              */}
        {/* ========================================================================= */}
        <div style={{
          background: '#0f172a',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '20px',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Video size={16} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', display: 'block' }}>
                  🎥 Farmer Recorded Video Inspection ({selectedLotForOffer.videoDuration || 30}s)
                </span>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Recorded live on farm gate by {selectedLotForOffer.farmerName}
                </span>
              </div>
            </div>

            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} />
              <span>AI Certified Grade {selectedLotForOffer.grade || 'A'} ({selectedLotForOffer.qualityScore || 94}/100)</span>
            </span>
          </div>

          {selectedLotForOffer.videoUrl ? (
            <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', background: '#000000', border: '1px solid #334155' }}>
              <video 
                src={selectedLotForOffer.videoUrl} 
                controls 
                autoPlay 
                loop 
                muted 
                style={{ width: '100%', maxHeight: '230px', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'rgba(22, 163, 74, 0.95)',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>● FARMER VIDEO RECORDING</span>
              </div>
            </div>
          ) : (
            <div style={{ background: '#1e293b', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 700 }}>
                📷 Produce Inspection Photos (4 Angles):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {lotImages.slice(0, 4).map((img, i) => (
                  <div key={i} style={{ height: '75px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
                    <img src={img} alt={`Angle ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: '2px', left: '2px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '2px' }}>
                      Angle #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
