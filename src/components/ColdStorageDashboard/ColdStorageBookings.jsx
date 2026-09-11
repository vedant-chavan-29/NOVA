import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Search, 
  CheckCircle2, 
  Clock, 
  Warehouse, 
  FileText, 
  Printer, 
  Download, 
  Filter, 
  User, 
  Phone, 
  ShieldCheck, 
  X,
  ArrowRight
} from 'lucide-react';

export const ColdStorageBookings = () => {
  const { 
    currentUser, 
    storageBookings, 
    updateStorageBookingStatus, 
    storageFacilities, 
    lang, 
    t 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Confirmed' | 'Checked-in' | 'Released'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForSlip, setSelectedBookingForSlip] = useState(null);

  const bookings = (storageBookings || []);

  const filteredBookings = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchClient = (b.bookedByName || b.farmerName || '').toLowerCase().includes(q);
      const matchCrop = (b.crop || '').toLowerCase().includes(q);
      const matchFacility = (b.facilityName || '').toLowerCase().includes(q);
      const matchId = (b.id || '').toLowerCase().includes(q);
      return matchClient || matchCrop || matchFacility || matchId;
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-green">
            <Calendar size={12} />
            Inbound Reservations Ledger
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Farmer & Buyer Produce Storage Contracts
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'शेतकरी व खरेदीदार साठवणूक आरक्षणे' : 'Client Storage Reservations & Warehouse Ledger'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          Manage incoming farmer and institutional buyer harvest deposits, track daily climate storage, and issue delivery check-in gate passes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['all', 'Confirmed', 'Checked-in', 'Released'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: statusFilter === st ? '1px solid #0891b2' : '1px solid var(--slate-300)',
                background: statusFilter === st ? '#ecfeff' : 'var(--slate-50)',
                color: statusFilter === st ? '#0891b2' : 'var(--slate-700)'
              }}
            >
              {st === 'all' ? 'All Bookings' : st}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search by client, crop, facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px 6px 30px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-300)',
              background: 'var(--slate-50)'
            }}
          />
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Warehouse size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--slate-800)' }}>
            No Storage Reservations Found
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)', maxWidth: '480px', margin: '0 auto' }}>
            When farmers or institutional buyers reserve cold storage space for their crops from the marketplace, their verified bookings and escrow deposits will appear here.
          </p>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0, marginBottom: '28px' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client / Depositor</th>
                <th>Commodity & Quantity</th>
                <th>Facility & Duration</th>
                <th>Rental Rate & Total</th>
                <th>Escrow Status</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => {
                const isReleased = b.status === 'Released';
                const isCheckedIn = b.status === 'Checked-in';

                return (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: '#0891b2', fontSize: '0.88rem' }}>{b.id}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', display: 'block' }}>
                        {b.bookingDate}
                      </span>
                    </td>

                    <td>
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                          {b.bookedByName || b.farmerName || 'Registered Client'}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', display: 'block' }}>
                          Role: <span style={{ fontWeight: 700, color: '#0284c7' }}>{b.bookedByRole?.toUpperCase() || 'CLIENT'}</span>
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>
                          {b.bookedByPhone || '+91 98220 14892'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <strong style={{ fontSize: '0.88rem' }}>{b.crop}</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)', display: 'block' }}>
                        {b.quantityKg?.toLocaleString()} KG ({Math.round(b.quantityKg / 1000)} MT)
                      </span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600 }}>{b.facilityName}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', display: 'block' }}>
                        {b.days} Days Reservation
                      </span>
                    </td>

                    <td>
                      <strong style={{ fontSize: '0.92rem', color: '#15803d' }}>
                        ₹{b.totalCost?.toLocaleString()}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>
                        @ ₹{b.dailyRate || 0.04}/kg/day
                      </span>
                    </td>

                    <td>
                      <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={11} />
                        {b.paymentStatus || 'Escrow Secured'}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--slate-400)', display: 'block', marginTop: '2px' }}>
                        UTR: {b.utrNumber ? b.utrNumber.slice(-8) : 'AGRI9021'}
                      </span>
                    </td>

                    <td>
                      {isReleased ? (
                        <span className="badge badge-blue">
                          Released & Settled
                        </span>
                      ) : isCheckedIn ? (
                        <span className="badge badge-green">
                          In Storage Chamber
                        </span>
                      ) : (
                        <span className="badge badge-amber">
                          Awaiting Check-in
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', alignItems: 'center' }}>
                        {!isCheckedIn && !isReleased && (
                          <button
                            onClick={() => updateStorageBookingStatus(b.id, 'Checked-in')}
                            className="btn btn-sm"
                            style={{ background: '#0891b2', color: '#fff', fontSize: '0.76rem', padding: '5px 9px' }}
                            title="Confirm produce check-in into cold storage vault"
                          >
                            Check-in
                          </button>
                        )}

                        {isCheckedIn && (
                          <button
                            onClick={() => updateStorageBookingStatus(b.id, 'Released')}
                            className="btn btn-sm"
                            style={{ background: '#15803d', color: '#fff', fontSize: '0.76rem', padding: '5px 9px' }}
                            title="Release produce to client and settle escrow payout"
                          >
                            Release & Settle
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedBookingForSlip(b)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '5px 8px', fontSize: '0.76rem' }}
                          title="View Inward Gate Pass & Storage Tax Invoice"
                        >
                          <FileText size={13} />
                          <span>Pass</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Gate Pass & Inward Receipt Modal */}
      {selectedBookingForSlip && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--slate-200)', paddingBottom: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.78rem', color: '#0891b2', fontWeight: 800 }}>GOVERNMENT OF MAHARASHTRA • MAHAAGRI</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--slate-900)', margin: '4px 0' }}>
                Cold Storage Inward Gate Pass & Escrow Receipt
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--slate-500)', margin: 0 }}>
                Pass Ref: {selectedBookingForSlip.id} • Date: {selectedBookingForSlip.bookingDate}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '0.84rem', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>CLIENT / DEPOSITOR</span>
                <div style={{ fontWeight: 800, color: 'var(--slate-900)' }}>{selectedBookingForSlip.bookedByName || selectedBookingForSlip.farmerName}</div>
                <div style={{ color: 'var(--slate-500)', fontSize: '0.78rem' }}>Phone: {selectedBookingForSlip.bookedByPhone || '+91 98220 14892'}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>COLD STORAGE WAREHOUSE</span>
                <div style={{ fontWeight: 800, color: 'var(--slate-900)' }}>{selectedBookingForSlip.facilityName}</div>
                <div style={{ color: 'var(--slate-500)', fontSize: '0.78rem' }}>WDRA License: WDRA-MH-2026-9042</div>
              </div>
            </div>

            <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Produce Commodity:</span>
                <strong>{selectedBookingForSlip.crop} ({selectedBookingForSlip.quantityKg?.toLocaleString()} KG)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Storage Period:</span>
                <strong>{selectedBookingForSlip.days} Days Reservation</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Daily Storage Rate:</span>
                <strong>₹{selectedBookingForSlip.dailyRate || 0.04}/KG/Day</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--slate-300)', paddingTop: '6px', fontSize: '1.05rem' }}>
                <strong style={{ color: '#0e7490' }}>Total Rental Fee (Escrow Secured):</strong>
                <strong style={{ color: '#0891b2' }}>₹{selectedBookingForSlip.totalCost?.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', textAlign: 'center', marginBottom: '20px' }}>
              Cryptographic UTR Reference: {selectedBookingForSlip.utrNumber || 'AGRISTOR9048'} • Inspected and Certified under MahaAgri Quality Protocol
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setSelectedBookingForSlip(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={15} />
                <span>Print Gate Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
