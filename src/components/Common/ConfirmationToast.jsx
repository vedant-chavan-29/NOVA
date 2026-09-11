import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ConfirmationToast = () => {
  const { confirmationToast } = useApp();

  if (!confirmationToast || !confirmationToast.isOpen) return null;

  const { title, message, type } = confirmationToast;

  const icons = {
    success: <CheckCircle2 size={20} color="#16a34a" />,
    error: <AlertCircle size={20} color="#dc2626" />,
    info: <Info size={20} color="#2563eb" />
  };

  const borderColors = {
    success: '#86efac',
    error: '#fca5a5',
    info: '#93c5fd'
  };

  const bgColors = {
    success: '#f0fdf4',
    error: '#fef2f2',
    info: '#eff6ff'
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: bgColors[type] || '#ffffff',
        border: `1px solid ${borderColors[type] || '#e2e8f0'}`,
        borderRadius: '12px',
        padding: '14px 18px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        maxWidth: '420px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ marginTop: '2px', flexShrink: 0 }}>
        {icons[type] || icons.info}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '2px' }}>
          {title}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
          {message}
        </div>
      </div>
    </div>
  );
};
