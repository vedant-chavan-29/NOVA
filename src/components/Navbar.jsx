import React, { useState } from 'react';
import { useApp, DEMO_STAKEHOLDERS } from '../context/AppContext';
import { CloudSyncModal } from './Common/CloudSyncModal';
import { 
  Sprout, 
  Languages, 
  UserCheck, 
  Bell, 
  ChevronDown,
  Building2,
  Truck, 
  Snowflake,
  ShieldCheck,
  LogOut,
  LogIn,
  CheckCircle2,
  PhoneCall,
  User,
  ExternalLink
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentUser,
    role, 
    login,
    logout,
    lang, 
    setLang, 
    activeTab, 
    setActiveTab, 
    t, 
    notifications,
    setIsAuthModalOpen,
    setAuthDefaultRole,
    openAuthModal,
    syncStatus,
    loadServerData
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleSwitchOpen, setIsRoleSwitchOpen] = useState(false);
  const [isCloudSyncModalOpen, setIsCloudSyncModalOpen] = useState(false);
  const unreadNotifs = notifications.filter(n => n.unread).length;

  const roleConfig = {
    farmer: { label: t('roleFarmer'), icon: Sprout, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
    buyer: { label: t('roleBuyer'), icon: Building2, color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
    transporter: { label: t('roleTransporter'), icon: Truck, color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    cold_storage: { label: t('roleColdStorage') || 'Cold Storage Provider', icon: Snowflake, color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
    admin: { label: t('roleAdmin'), icon: ShieldCheck, color: '#991b1b', bg: '#fef2f2', border: '#fecaca' }
  };

  const currentRoleInfo = (role && roleConfig[role]) || roleConfig.farmer;
  const RoleIcon = currentRoleInfo.icon;

  const handleOpenAuth = (roleKey = null) => {
    if (openAuthModal) {
      openAuthModal(roleKey, 'login');
    } else {
      if (roleKey) setAuthDefaultRole(roleKey);
      setIsAuthModalOpen(true);
    }
  };

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top MahaAgri Government Header Strip */}
      <div style={{ background: '#064e3b', color: '#f0fdf4', padding: '6px 20px', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 700, letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {t('govtHeaderTitle')}
          </span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ color: '#86efac', fontWeight: 600 }}>
            {t('govtSubTitle')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            title="Live Multi-Device Cloud Sync Status. Click to configure cloud database or view diagnostics."
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: syncStatus === 'synced' ? 'rgba(34, 197, 94, 0.18)' : 'rgba(234, 179, 8, 0.2)', 
              border: `1px solid ${syncStatus === 'synced' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(250, 204, 21, 0.4)'}`,
              padding: '2px 10px', 
              borderRadius: '999px',
              fontSize: '0.72rem',
              color: syncStatus === 'synced' ? '#86efac' : '#fde047',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => setIsCloudSyncModalOpen(true)}
          >
            <span style={{ 
              width: '7px', 
              height: '7px', 
              borderRadius: '50%', 
              background: syncStatus === 'synced' ? '#4ade80' : '#facc15',
              boxShadow: syncStatus === 'synced' ? '0 0 6px #4ade80' : 'none'
            }} />
            <span>{syncStatus === 'synced' ? 'Live Cloud Sync: Connected' : 'Sync: Connecting...'}</span>
          </div>

          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
            <PhoneCall size={13} color="#4ade80" />
            <span>{t('kisanHelpline')}: <strong>1800-233-0244</strong> ({t('tollFree')})</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand & Logo */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} 
          onClick={() => {
            if (!currentUser) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              setActiveTab('home');
            }
          }}
        >
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(220, 38, 38, 0.25)'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                AgriLink
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803d' }}>
                {lang === 'hi' ? t('brandHindiName') : t('brandMarathiName')}
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, margin: 0 }}>
              {t('brandSubtitle')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Trilingual Language Switcher Toggle (EN / मराठी / हिन्दी) */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '30px', padding: '3px', border: '1px solid #e2e8f0', gap: '2px' }}>
            <button
              onClick={() => setLang('en')}
              style={{
                background: lang === 'en' ? '#15803d' : 'transparent',
                color: lang === 'en' ? '#ffffff' : '#64748b',
                fontWeight: lang === 'en' ? 800 : 600,
                padding: '4px 10px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                boxShadow: lang === 'en' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLang('mr')}
              style={{
                background: lang === 'mr' ? '#15803d' : 'transparent',
                color: lang === 'mr' ? '#ffffff' : '#64748b',
                fontWeight: lang === 'mr' ? 800 : 600,
                padding: '4px 10px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                boxShadow: lang === 'mr' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title="मराठी मध्ये बदला"
            >
              मराठी
            </button>
            <button
              onClick={() => setLang('hi')}
              style={{
                background: lang === 'hi' ? '#15803d' : 'transparent',
                color: lang === 'hi' ? '#ffffff' : '#64748b',
                fontWeight: lang === 'hi' ? 800 : 600,
                padding: '4px 10px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                boxShadow: lang === 'hi' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title="हिन्दी में बदलें"
            >
              हिन्दी
            </button>
          </div>

          {/* PUBLIC USER (Not logged in) */}
          {!currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleOpenAuth()}
                style={{
                  background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(21, 128, 61, 0.2)'
                }}
              >
                <LogIn size={15} />
                <span>{t('navLoginSignUp')}</span>
              </button>
            </div>
          ) : (
            /* AUTHENTICATED USER */
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Active Role Info Badge with Interactive Portal Switcher */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsRoleSwitchOpen(!isRoleSwitchOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: currentRoleInfo.bg,
                    border: `1.5px solid ${currentRoleInfo.border}`,
                    padding: '6px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  title="Click to Switch Stakeholder Portal"
                >
                  <RoleIcon size={16} color={currentRoleInfo.color} />
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                      {currentUser.name} {currentUser.phone ? `(${currentUser.phone})` : ''}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: currentRoleInfo.color, fontWeight: 700 }}>
                      {currentRoleInfo.label} • {currentUser.organization || 'Verified Session'}
                    </div>
                  </div>
                  <ChevronDown size={14} color={currentRoleInfo.color} style={{ marginLeft: '4px' }} />
                </button>

                {isRoleSwitchOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '280px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                    zIndex: 200,
                    padding: '8px',
                    animation: 'fadeIn 0.15s ease'
                  }}>
                    <div style={{ padding: '6px 10px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                      Switch Portal Interface (Live Demo)
                    </div>

                    {[
                      { key: 'farmer', title: 'Farmer Portal', desc: 'Ramesh Patil (Sahyadri FPO)', icon: Sprout, color: '#15803d', bg: '#f0fdf4' },
                      { key: 'buyer', title: 'Institutional Buyer', desc: 'Sahyadri Mega Food Park', icon: Building2, color: '#0369a1', bg: '#f0f9ff' },
                      { key: 'transporter', title: 'Transporter Portal', desc: 'Tukaram Shinde (Kisan Express)', icon: Truck, color: '#b45309', bg: '#fffbeb' },
                      { key: 'cold_storage', title: 'Cold Storage Hub', desc: 'Balasaheb Kadam (Sahyadri Cold Chain)', icon: Snowflake, color: '#0891b2', bg: '#ecfeff' },
                      { key: 'admin', title: 'Master Admin Console', desc: 'Vedant Chavan (Super Admin)', icon: ShieldCheck, color: '#991b1b', bg: '#fef2f2' }
                    ].map(stk => {
                      const StkIcon = stk.icon;
                      const isCurrent = role === stk.key;

                      return (
                        <div
                          key={stk.key}
                          onClick={() => {
                            login(stk.key);
                            setIsRoleSwitchOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: isCurrent ? stk.bg : '#ffffff',
                            border: isCurrent ? `1px solid ${stk.color}` : '1px solid transparent',
                            marginBottom: '4px'
                          }}
                        >
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: stk.color,
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <StkIcon size={14} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                              {stk.title}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {stk.desc}
                            </div>
                          </div>
                          {isCurrent && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: stk.color }}>
                              Active
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Notifications Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    color: '#475569'
                  }}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadNotifs > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 2px #ffffff'
                    }}>
                      {unreadNotifs}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '320px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                    zIndex: 200,
                    padding: '12px',
                    animation: 'fadeIn 0.15s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Platform Notifications</span>
                      <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700 }}>{notifications.length} Total</span>
                    </div>
                    <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {notifications.map(n => (
                        <div key={n.id} style={{ padding: '8px 10px', borderRadius: '8px', background: n.unread ? '#f0fdf4' : '#f8fafc', borderLeft: n.unread ? '3px solid #16a34a' : '3px solid transparent' }}>
                          <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                            {lang === 'mr' ? n.titleMr || n.title : n.title}
                          </p>
                          <p style={{ fontSize: '0.74rem', color: '#475569', margin: '3px 0 0 0' }}>
                            {n.message}
                          </p>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                            {n.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Sign Out to Public Home"
              >
                <LogOut size={15} />
                <span>{t('logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cloud & Multi-Device Sync Modal */}
      <CloudSyncModal 
        isOpen={isCloudSyncModalOpen} 
        onClose={() => setIsCloudSyncModalOpen(false)} 
      />
    </header>
  );
};
