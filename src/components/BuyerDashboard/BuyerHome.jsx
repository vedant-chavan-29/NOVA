import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Store, 
  Tag, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  TrendingUp,
  PackageCheck
} from 'lucide-react';

export const BuyerHome = () => {
  const { currentUser, lots, offers, transactions, lang, t, setActiveTab } = useApp();

  const activeBids = offers.filter(o => o.status === 'Pending');
  const acceptedBids = offers.filter(o => o.status === 'Accepted');
  const totalEscrowLocked = acceptedBids.reduce((sum, o) => sum + o.totalOfferedAmount, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-blue">
              Verified Institutional Buyer Portal
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Entity: <strong>{currentUser ? currentUser.name : 'Buyer Enterprise'}</strong> ({currentUser?.organization || 'Institutional Procurement'} • {currentUser?.phone || ''})
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Procurement Command Center
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className="btn btn-primary"
          >
            <Store size={16} />
            <span>Search Farmer Lots</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="stat-card blue hover-lift" onClick={() => setActiveTab('marketplace')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Available Farm Lots</div>
            <div className="stat-val">{lots.length}</div>
            <div className="stat-sub">Across 5 Districts</div>
          </div>
          <div className="stat-icon blue">
            <Store size={24} />
          </div>
        </div>

        <div className="stat-card amber hover-lift" onClick={() => setActiveTab('myOffers')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Active Bids Submitted</div>
            <div className="stat-val">{offers.length}</div>
            <div className="stat-sub">{activeBids.length} awaiting farmer acceptance</div>
          </div>
          <div className="stat-icon amber">
            <Tag size={24} />
          </div>
        </div>

        <div className="stat-card green hover-lift" onClick={() => setActiveTab('transactions')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Escrow Funds Committed</div>
            <div className="stat-val">₹{totalEscrowLocked.toLocaleString()}</div>
            <div className="stat-sub">100% Protected via Escrow</div>
          </div>
          <div className="stat-icon green">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="stat-card green hover-lift" onClick={() => setActiveTab('logistics')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Fulfillment Deliveries</div>
            <div className="stat-val">{transactions.length}</div>
            <div className="stat-sub">Direct Farm-Gate Pickups</div>
          </div>
          <div className="stat-icon green">
            <Truck size={24} />
          </div>
        </div>
      </div>

      {/* Recommended Lots Ready for Direct Purchase */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <span className="card-title">
            <PackageCheck size={18} color="#16a34a" />
            Top Matching Farmer Lots (Grade A Verified)
          </span>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className="btn btn-secondary btn-sm"
          >
            <span>View Full Marketplace</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid-2">
          {lots.slice(0, 2).map(lot => (
            <div key={lot.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <img 
                src={lot.image} 
                alt={lot.crop} 
                style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                    {lot.crop} ({lot.variety})
                  </h4>
                  <span className="badge badge-green">Grade {lot.grade}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '2px 0 6px 0' }}>
                  {lot.quantity.toLocaleString()} {lot.unit} • {lot.location}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.1rem', color: '#15803d' }}>
                    ₹{lot.expectedPrice}/{lot.unit}
                  </strong>
                  <button 
                    onClick={() => setActiveTab('marketplace')}
                    className="btn btn-primary btn-sm"
                  >
                    Make Offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
