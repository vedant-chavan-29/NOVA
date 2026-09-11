import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  X, 
  UploadCloud, 
  Scale,
  MessageSquare
} from 'lucide-react';

export const GrievancesPortal = () => {
  const { 
    grievances, 
    raiseGrievance, 
    resolveGrievance, 
    role, 
    lang, 
    t 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('Payment delay');
  const [description, setDescription] = useState('');
  const [relatedLotId, setRelatedLotId] = useState('LOT-PN-2026-081');
  const [priority, setPriority] = useState('High');
  const [evidenceFileName, setEvidenceFileName] = useState('weighment_slip.jpg');

  const categories = [
    'Payment delay',
    'Quality dispute',
    'Quantity mismatch',
    'Transport issue',
    'Buyer cancellation',
    'Farmer cancellation',
    'Other problems'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) return;

    raiseGrievance({
      category,
      description,
      relatedLotId,
      priority,
      evidenceFile: evidenceFileName
    });

    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-red">
              <Scale size={12} />
              MahaAgri Grievance Redressal Mechanism
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Official Dispute Resolution & Escrow Mediation
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            {lang === 'mr' ? 'तक्रार निवारण व मध्यस्थी केंद्र' : 'Grievance & Dispute Resolution Portal'}
          </h2>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>{t('raiseGrievanceBtn')}</span>
        </button>
      </div>

      {/* Resolution Guarantee Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        color: '#ffffff',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px 0' }}>
            Escrow-Backed 24-Hour Resolution Guarantee
          </h4>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            In case of weight variance, transport breakdown, or quality dispute, the platform freezes disputed escrow tranches and assigns a third-party Mandi Assessor to inspect physical evidence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Average Resolution Time</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80' }}>14.2 Hours</div>
          </div>
        </div>
      </div>

      {/* Grievances List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {grievances.map(ticket => {
          const isResolved = ticket.status === 'Resolved';

          return (
            <div 
              key={ticket.id} 
              className="card"
              style={{
                borderLeft: `4px solid ${isResolved ? '#16a34a' : '#ef4444'}`,
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.98rem', color: 'var(--slate-900)' }}>
                      {ticket.category}
                    </strong>
                    <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                      Ticket #{ticket.ticketId}
                    </span>
                    <span className={`badge ${isResolved ? 'badge-green' : 'badge-amber'}`}>
                      {isResolved ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {ticket.status}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    Raised by <strong>{ticket.userName}</strong> ({ticket.raisedByRole}) • Related Lot: <strong>{ticket.relatedLotId}</strong> • Date: {ticket.createdAt}
                  </span>
                </div>

                <span className={`badge ${ticket.priority === 'High' ? 'badge-red' : 'badge-blue'}`}>
                  {ticket.priority} Priority
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', lineHeight: 1.5, margin: '8px 0 12px 0' }}>
                {ticket.description}
              </p>

              {/* Resolution Notes or Admin action */}
              {isResolved ? (
                <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.82rem', color: '#166534' }}>
                  <strong>Official Resolution Verdict:</strong> {ticket.resolutionNotes} (Resolved on {ticket.resolvedAt})
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)', padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                  <span>Evidence Document: <strong>{ticket.evidenceFile}</strong></span>
                  {role === 'admin' && (
                    <button 
                      onClick={() => resolveGrievance(ticket.id, "Arbitration completed. Escrow adjusted with mutual satisfaction.")}
                      className="btn btn-primary btn-sm"
                    >
                      Resolve as Admin
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Raise Grievance Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <button onClick={() => setIsModalOpen(false)} className="modal-close">
              <X size={18} />
            </button>

            <div style={{ marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                File Official Grievance Ticket
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '4px 0 0 0' }}>
                State Mandi Redressal Authority & Dispute Resolution Panel
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Dispute Category</label>
                <select 
                  className="form-control form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Related Crop Lot ID</label>
                <input 
                  type="text"
                  className="form-control"
                  value={relatedLotId}
                  onChange={(e) => setRelatedLotId(e.target.value)}
                  placeholder="e.g. LOT-PN-2026-081"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description of Incident</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise details of payment delay, weighbridge discrepancy, or transit delay..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Supporting Evidence (Weighment slip, Toll receipt, Photos)</label>
                <div style={{ border: '2px dashed var(--slate-300)', borderRadius: 'var(--radius-md)', padding: '14px', textAlign: 'center', background: 'var(--slate-50)' }}>
                  <UploadCloud size={24} color="#16a34a" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--slate-800)' }}>{evidenceFileName}</div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>File attached and digitally timestamped</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-danger"
                  style={{ fontWeight: 800 }}
                >
                  Submit Grievance to Authority
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
