import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, X, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';

export const RateBuyerModal = ({ isOpen, onClose, transaction }) => {
  const { pushNotification } = useApp();
  const [rating, setRating] = useState(5);
  const [paymentTimeliness, setPaymentTimeliness] = useState('Instant Escrow Release');
  const [qualityFairness, setQualityFairness] = useState('Completely Fair');
  const [comments, setComments] = useState('Prompt weighing, immediate digital weighment confirmation and zero deductions. Very reliable corporate buyer.');

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    pushNotification(
      "Review Submitted",
      `Rated ${transaction.buyerName} ${rating} Stars! Trust score updated in public buyer directory.`,
      "खरेदीदार पुनरावलोकन सबमिट केले",
      "info"
    );
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <button onClick={onClose} className="modal-close">
          <X size={18} />
        </button>

        <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="badge badge-green" style={{ marginBottom: '4px' }}>
            Post-Delivery Feedback
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Rate Buyer: {transaction.buyerName}
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Transaction #{transaction.id} • {transaction.crop} ({transaction.quantity} {transaction.unit})
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating Selection */}
          <div style={{ textAlign: 'center', marginBottom: '18px', background: 'var(--slate-50)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--slate-600)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              OVERALL EXPERIENCE RATING
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <Star 
                    size={28} 
                    color="#f59e0b" 
                    fill={star <= rating ? "#f59e0b" : "none"} 
                  />
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', marginTop: '4px', display: 'block' }}>
              {rating === 5 ? 'Exceptional (5.0 / 5.0)' : `${rating}.0 / 5.0 Stars`}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Payment & Escrow Timeliness</label>
            <select 
              className="form-control form-select"
              value={paymentTimeliness}
              onChange={(e) => setPaymentTimeliness(e.target.value)}
            >
              <option value="Instant Escrow Release">Instant Escrow Release (Under 10 mins)</option>
              <option value="Within 24 Hours">Within 24 Hours</option>
              <option value="Slightly Delayed">Slightly Delayed (1-2 Days)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Gate Quality & Weighbridge Inspection</label>
            <select 
              className="form-control form-select"
              value={qualityFairness}
              onChange={(e) => setQualityFairness(e.target.value)}
            >
              <option value="Completely Fair">Completely Fair (No Disputed Cuts)</option>
              <option value="Minor Variance Accepted">Minor Variance Accepted</option>
              <option value="Unreasonable Gate Rejection">Unreasonable Gate Rejection</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Feedback for Other Farmers / FPOs</label>
            <textarea 
              className="form-control"
              rows="2"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
              <CheckCircle2 size={16} />
              <span>Submit Verified Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
