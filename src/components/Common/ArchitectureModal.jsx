import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Database, 
  X, 
  Table, 
  Layers, 
  Code2, 
  ShieldCheck, 
  Network, 
  ArrowRight,
  CheckCircle2,
  Server
} from 'lucide-react';

export const ArchitectureModal = () => {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen } = useApp();
  const [activeSchemaTab, setActiveSchemaTab] = useState('database'); // 'database', 'apis', 'security'

  if (!isArchitectureModalOpen) return null;

  const dbTables = [
    {
      name: "Users",
      type: "PostgreSQL / MongoDB Collection",
      fields: "id (UUID PK), phone (VARCHAR Unique), role (ENUM: farmer, buyer, transporter, admin), full_name (VARCHAR), district_id (FK), state (VARCHAR), created_at (TIMESTAMP), is_active (BOOLEAN)"
    },
    {
      name: "Farmers",
      type: "Entity Table",
      fields: "id (UUID PK), user_id (FK -> Users.id), fpo_id (FK -> FPOs.id Nullable), land_holding_acres (DECIMAL), kisan_credit_card_no (VARCHAR Encrypted), aadhar_hash (VARCHAR)"
    },
    {
      name: "FPOs",
      type: "Entity Table",
      fields: "id (UUID PK), registration_no (VARCHAR), name (VARCHAR), district (VARCHAR), total_member_farmers (INT), storage_capacity_mt (INT), bank_account_ifsc (VARCHAR)"
    },
    {
      name: "Buyers",
      type: "Entity Table",
      fields: "id (UUID PK), user_id (FK -> Users.id), company_name (VARCHAR), gstin (VARCHAR Verified), fssai_license (VARCHAR), risk_score (DECIMAL), escrow_credit_limit (DECIMAL)"
    },
    {
      name: "Crops",
      type: "Master Data Table",
      fields: "id (VARCHAR PK), name_en (VARCHAR), name_mr (VARCHAR), category (VARCHAR), standard_unit (VARCHAR), moisture_threshold_pct (DECIMAL), default_grade_specs (JSONB)"
    },
    {
      name: "MarketPrices",
      type: "Time-Series Data Table",
      fields: "id (UUID PK), crop_id (FK -> Crops.id), mandi_id (VARCHAR), district (VARCHAR), min_price (DECIMAL), max_price (DECIMAL), modal_price (DECIMAL), arrival_volume_mt (DECIMAL), recorded_date (DATE)"
    },
    {
      name: "CropLots",
      type: "Transactional Table",
      fields: "id (VARCHAR PK: LOT-MH-2026-XXX), farmer_id (FK -> Farmers.id), crop_id (FK), variety (VARCHAR), quantity_kg (DECIMAL), certified_grade (ENUM: A, B, C), asking_rate_per_kg (DECIMAL), farm_latitude (DECIMAL), farm_longitude (DECIMAL), status (ENUM: Open, OffersReceived, DealLocked, Dispatched, Completed)"
    },
    {
      name: "QualityReports",
      type: "Computer Vision Metadata Table",
      fields: "id (UUID PK), lot_id (FK -> CropLots.id), cv_model_version (VARCHAR), freshness_index (DECIMAL), damage_percentage (DECIMAL), avg_diameter_mm (DECIMAL), color_uniformity (DECIMAL), grade_assigned (VARCHAR), image_s3_url (VARCHAR)"
    },
    {
      name: "Offers",
      type: "Transactional Table",
      fields: "id (VARCHAR PK: OFFER-XXX), lot_id (FK -> CropLots.id), buyer_id (FK -> Buyers.id), offered_rate (DECIMAL), requested_qty (DECIMAL), total_amount (DECIMAL), est_transport_cost (DECIMAL), pickup_date (DATE), status (ENUM: Pending, Accepted, Countered, Rejected), escrow_funded (BOOLEAN)"
    },
    {
      name: "Transactions",
      type: "Escrow Core Table",
      fields: "id (VARCHAR PK: TXN-2026-XXX), offer_id (FK -> Offers.id), lot_id (FK -> CropLots.id), buyer_id (FK), farmer_id (FK), transporter_id (FK), gross_amount (DECIMAL), net_farmer_amount (DECIMAL), escrow_vault_status (ENUM: Funded, InTransit, Released, Disputed), utr_number (VARCHAR)"
    },
    {
      name: "TransportProviders",
      type: "Logistics Table",
      fields: "id (VARCHAR PK), vehicle_type (VARCHAR), reg_number (VARCHAR), driver_name (VARCHAR), driver_phone (VARCHAR), capacity_kg (INT), rate_per_km (DECIMAL), base_fare (DECIMAL), gps_device_imei (VARCHAR)"
    },
    {
      name: "StorageProviders",
      type: "Warehousing Table",
      fields: "id (VARCHAR PK), facility_name (VARCHAR), warehouse_type (ENUM: ColdStore, DrySilo), district (VARCHAR), total_capacity_mt (INT), available_capacity_mt (INT), cost_per_kg_per_day (DECIMAL), wdra_certified (BOOLEAN)"
    },
    {
      name: "Bookings",
      type: "Transactional Table",
      fields: "id (UUID PK), storage_facility_id (FK), farmer_id (FK), crop_id (FK), quantity_kg (DECIMAL), days_booked (INT), total_rent_amount (DECIMAL), status (ENUM: Confirmed, Active, Vacated)"
    },
    {
      name: "Payments",
      type: "Audit Ledger Table",
      fields: "id (UUID PK), txn_id (FK -> Transactions.id), payment_rail (ENUM: UPI_Autopay, NEFT, RTGS, Escrow_Direct), debit_party (VARCHAR), credit_party (VARCHAR), amount (DECIMAL), fee_deducted (DECIMAL), timestamp (TIMESTAMP)"
    },
    {
      name: "Notifications",
      type: "Event Table",
      fields: "id (UUID PK), user_id (FK -> Users.id), event_type (VARCHAR), message_en (TEXT), message_mr (TEXT), is_read (BOOLEAN), created_at (TIMESTAMP)"
    },
    {
      name: "Grievances",
      type: "Governance Table",
      fields: "id (VARCHAR PK: GRV-2026-XXX), ticket_id (VARCHAR), raised_by_user_id (FK), category (VARCHAR), related_lot_id (FK), evidence_file_url (VARCHAR), arbitrator_notes (TEXT), status (ENUM: Open, Investigating, Resolved)"
    },
    {
      name: "Ratings",
      type: "Reputation Table",
      fields: "id (UUID PK), rater_user_id (FK), rated_user_id (FK), txn_id (FK), rating_stars (DECIMAL 1-5), payment_timeliness_score (DECIMAL), quality_accuracy_score (DECIMAL), review_text (TEXT)"
    }
  ];

  const restApis = [
    { method: "GET", endpoint: "/api/v1/market-prices/discover", desc: "Returns real-time arbitrage & net realisation matrix across Mandis, Processors, and Institutional Buyers" },
    { method: "POST", endpoint: "/api/v1/ai/predict-price", desc: "Triggers LSTM / Gradient Boost price projection model for selected crop & horizon" },
    { method: "POST", endpoint: "/api/v1/lots/create", desc: "Publishes new crop lot with AI computer vision quality parameters & generates unique Lot ID" },
    { method: "POST", endpoint: "/api/v1/offers/bidding", desc: "Corporate buyer submits binding digital offer with escrow authorization" },
    { method: "PUT", endpoint: "/api/v1/offers/:id/accept", desc: "Farmer accepts offer; auto-locks escrow funds and dispatches logistics notification" },
    { method: "POST", endpoint: "/api/v1/logistics/dispatch", desc: "Assigns closest verified vehicle and activates live GPS trip tracker" },
    { method: "POST", endpoint: "/api/v1/escrow/release-payout", desc: "Disburses 100% net realization payout directly to farmer bank account upon delivery verification" },
    { method: "POST", endpoint: "/api/v1/grievance/file", desc: "Files formal dispute ticket with evidence to State Mandi Arbitrator panel" }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-xl" style={{ maxHeight: '92vh', overflowY: 'auto', padding: '28px' }}>
        <button 
          onClick={() => setIsArchitectureModalOpen(false)}
          className="modal-close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-green">
              <Server size={12} />
              Enterprise Technical Architecture Blueprint
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              17 Relational Entities & Microservices Specification
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--slate-900)', margin: 0 }}>
            AgriLink Database Schema & REST API Architecture
          </h2>
        </div>

        {/* Sub Navigation */}
        <div className="nav-tabs" style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveSchemaTab('database')}
            className={`nav-tab-btn ${activeSchemaTab === 'database' ? 'active' : ''}`}
          >
            <Database size={15} />
            <span>Relational Schema (17 Tables)</span>
          </button>

          <button 
            onClick={() => setActiveSchemaTab('diagram')}
            className={`nav-tab-btn ${activeSchemaTab === 'diagram' ? 'active' : ''}`}
          >
            <Network size={15} />
            <span>System Architecture Flowchart</span>
          </button>

          <button 
            onClick={() => setActiveSchemaTab('apis')}
            className={`nav-tab-btn ${activeSchemaTab === 'apis' ? 'active' : ''}`}
          >
            <Code2 size={15} />
            <span>REST API Specifications</span>
          </button>

          <button 
            onClick={() => setActiveSchemaTab('security')}
            className={`nav-tab-btn ${activeSchemaTab === 'security' ? 'active' : ''}`}
          >
            <ShieldCheck size={15} />
            <span>Security & Escrow Isolation</span>
          </button>
        </div>

        {/* Database Tables View */}
        {activeSchemaTab === 'database' && (
          <div>
            <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
              Designed for high-concurrency ACID transactions, role-based row-level security (RLS), and sub-second price query execution across thousands of Mandis:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dbTables.map((tbl, idx) => (
                <div key={idx} style={{ background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Table size={15} color="#16a34a" />
                      <strong style={{ fontSize: '0.96rem', color: 'var(--slate-900)', fontFamily: 'monospace' }}>
                        {tbl.name}
                      </strong>
                    </div>
                    <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                      {tbl.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', fontFamily: 'monospace', lineHeight: 1.4 }}>
                    {tbl.fields}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Architecture Flowchart Diagram */}
        {activeSchemaTab === 'diagram' && (
          <div>
            <div style={{ background: '#0f172a', color: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '20px', overflowX: 'auto', border: '1px solid #334155' }}>
              <span style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                End-to-End System Microservices & Data Topology
              </span>
              <pre style={{ fontFamily: 'monospace', fontSize: '0.84rem', lineHeight: '1.4', margin: 0, color: '#cbd5e1' }}>
{`                  ┌─────────────────────────────────────────┐
                  │                 USERS                   │
                  └────────────────────┬────────────────────┘
                                       │
             ┌─────────────────────────┼─────────────────────────┐
             │                         │                         │
             ▼                         ▼                         ▼
      👨‍🌾 Farmer / FPO             🏢 Buyer                👨‍💼 Admin
             │                         │                         │
             └─────────────────────────┼─────────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │          Frontend Web / PWA             │
                  │        React 19 + Lucide + CSS          │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            Backend API Layer            │
                  │           Node.js / Express REST        │
                  └────────────────────┬────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
┌───────────────┐              ┌───────────────┐              ┌───────────────┐
│ Price Engine  │              │  Marketplace  │              │  User System  │
└───────┬───────┘              └───────┬───────┘              └───────┬───────┘
        │                              │                              │
        ▼                              ▼                              ▼
 • Price Prediction             • Buyer Matching               • JWT Auth (RBAC)
 • Market Mandi Trends          • Digital Offers               • KYC / Verification
 • Selling Recommendation       • Escrow Settlements           • Profiles & Roles

        │                              │
        └──────────────────────────────┼──────────────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            Database Engine              │
                  │        PostgreSQL / MongoDB Atlas       │
                  └────────────────────┬────────────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          ▼                            ▼                            ▼
      Farmers                      Buyers                      Transactions
       Crops                       Offers                       Complaints
    Crop Lots                  Quality Reports                  Logistics`}
              </pre>
            </div>

            <div className="grid-3">
              <div className="card" style={{ padding: '16px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>1. Client Presentation (PWA)</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--slate-600)', margin: '4px 0 0 0' }}>
                  Mobile-first responsive design supporting offline caching, low-bandwidth Marathi localization, and rapid role-switching.
                </p>
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>2. Microservices Business Logic</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--slate-600)', margin: '4px 0 0 0' }}>
                  Decoupled engines for price arbitrage calculation, multi-attribute buyer scoring, and optical quality verification.
                </p>
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--slate-900)' }}>3. Resilient Data Tier</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--slate-600)', margin: '4px 0 0 0' }}>
                  ACID transactional integrity for escrow ledgers and automated real-time event broadcasting to buyers and logistics providers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* REST APIs View */}
        {activeSchemaTab === 'apis' && (
          <div>
            <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
              Standardized RESTful microservices architecture with JWT authentication headers, rate-limiting, and cryptographic request signing for escrow disbursements:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {restApis.map((api, idx) => (
                <div key={idx} style={{ background: 'var(--slate-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      background: api.method === 'GET' ? '#dbeafe' : api.method === 'POST' ? '#dcfce7' : '#fef3c7',
                      color: api.method === 'GET' ? '#1d4ed8' : api.method === 'POST' ? '#15803d' : '#b45309',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      fontFamily: 'monospace'
                    }}>
                      {api.method}
                    </span>
                    <strong style={{ fontSize: '0.88rem', fontFamily: 'monospace', color: 'var(--slate-800)' }}>
                      {api.endpoint}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                    {api.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security & Escrow Isolation */}
        {activeSchemaTab === 'security' && (
          <div>
            <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '18px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#14532d', margin: '0 0 6px 0' }}>
                Escrow Multi-Sig Financial Protocol
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#166534', margin: 0, lineHeight: 1.5 }}>
                Buyer funds are isolated in an RBI-compliant scheduled escrow nodal account. Neither buyer nor farmer can unilaterally recall funds once the lot is picked up. Automated digital release happens upon proof-of-delivery (POD) weighbridge signature.
              </p>
            </div>

            <div className="grid-2">
              <div className="card" style={{ padding: '16px' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                  Role-Based Access Control (RBAC)
                </h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', margin: 0 }}>
                  Farmers only view their own lots and private counter-offers. Buyers cannot see rival bidding rates until auction closing. Transporters only view delivery waybill credentials.
                </p>
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                  Data Integrity & Auditability
                </h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', margin: 0 }}>
                  Every lot creation, offer event, gate weighment, and bank settlement generates an immutable SHA-256 cryptographic audit hash accessible to the State Mandi Authority.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
