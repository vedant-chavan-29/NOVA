import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export const AccessDenied = ({ requiredRole }) => {
  const { currentUser, setIsAuthModalOpen, setAuthDefaultRole, t } = useApp();

  const handleOpenLogin = () => {
    if (requiredRole) {
      setAuthDefaultRole(requiredRole);
    }
    setIsAuthModalOpen(true);
  };

  return (
    <div style={{
      maxWidth: '640px',
      margin: '60px auto',
      padding: '40px 30px',
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.08)',
      textAlign: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: '#ffedd5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        color: '#ea580c'
      }}>
        <ShieldAlert size={32} />
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>
        {t('accessRestricted')}
      </h2>

      <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
        {currentUser 
          ? `You are currently signed in as "${currentUser.name}" (${currentUser.role}). This section requires ${requiredRole || 'different'} access privileges.`
          : 'This section requires an active verified session. Please choose your stakeholder role and sign in to continue.'}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={handleOpenLogin}
          style={{
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '11px 24px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
          }}
        >
          <LogIn size={18} />
          <span>{t('signInToAccess')}</span>
        </button>
      </div>
    </div>
  );
};
