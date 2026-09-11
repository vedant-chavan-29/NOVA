import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  X, 
  Sprout, 
  Building2, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Lock,
  Phone,
  CheckCircle2
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { setRole, setActiveTab, pushNotification, t, lang } = useApp();
  const [selectedRole, setSelectedRole] = useState('farmer');

  if (!isOpen) return null;

  const demoAccounts = [
    {
      roleId: 'farmer',
      title: 'Farmer / FPO Portal',
      name: 'Ramesh Patil',
      sub: 'Sahyadri Farmers Producer Co. • Haveli, Pune',
      phone: '+91 98220 14892',
      badge: 'Verified FPO Member',
      icon: Sprout,
      color: '#16a34a'
    },
    {
      roleId: 'buyer',
      title: 'Verified Corporate Buyer',
      name: 'Amit Deshmukh (Procurement Head)',
      sub: 'Sahyadri Mega Food Park • GSTIN: 27AABCS9182K1ZU',
      phone: '+91 98902 44100',
      badge: '100% Escrow Backed',
      icon: Building2,
      color: '#2563eb'
    },
    {
      roleId: 'transporter',
      title: 'Logistics & Storage Operator',
      name: 'Tukaram Shinde',
      sub: 'Kisan Express Agro Logistics • Fleet: 18 Vehicles',
      phone: '+91 94223 90812',
      badge: 'GPS Active Fleet',
      icon: Truck,
      color: '#d97706'
    },
    {
      roleId: 'admin',
      title: 'Master System Admin / Authority',
      name: 'Vedant Chavan',
      sub: 'Chief Platform Administrator & State System Controller',
      phone: '+91 84829 41628',
      email: 'vedantkchavan2006@gmail.com',
      badge: 'Super Admin Authority',
      icon: ShieldCheck,
      color: '#dc2626'
    }
  ];

  const handleSelectAndLogin = (roleId, name) => {
    setRole(roleId);
    setActiveTab('home');
    pushNotification(
      `Authenticated as ${name}`,
      `Switched session to ${roleId.toUpperCase()} portal.`,
      `यशस्वी लॉगिन: ${name}`,
      "info"
    );
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', padding: '28px' }}>
        <button onClick={onClose} className="modal-close">
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            boxShadow: '0 4px 10px rgba(22, 163, 74, 0.3)'
          }}>
            <Sprout size={28} />
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--slate-900)', margin: 0 }}>
            AgriLink Role Authentication & Demo Access
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', margin: '4px 0 0 0' }}>
            Choose a verified stakeholder profile to experience customized workflows:
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {demoAccounts.map(acc => {
            const Icon = acc.icon;

            return (
              <div
                key={acc.roleId}
                onClick={() => handleSelectAndLogin(acc.roleId, acc.name)}
                style={{
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  background: 'var(--slate-50)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = acc.color;
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'var(--slate-50)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: `${acc.color}15`,
                    color: acc.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--slate-900)' }}>
                        {acc.title}
                      </strong>
                      <span className="badge" style={{ background: `${acc.color}15`, color: acc.color, fontSize: '0.68rem', padding: '1px 6px' }}>
                        {acc.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)' }}>
                      {acc.sub}
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ background: '#ffffff', border: '1px solid var(--border-subtle)' }}
                >
                  <span>Login</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--slate-400)' }}>
          Secure JWT Role-Based Access Control • OTP & Aadhaar / GSTIN Simulation Active
        </div>
      </div>
    </div>
  );
};
