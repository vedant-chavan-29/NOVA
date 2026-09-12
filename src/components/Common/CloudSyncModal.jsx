import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudRain, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Server, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  ArrowRightLeft, 
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';
import { apiService, getCloudDbUrl, setCloudDbUrl } from '../../services/apiService';
import { useApp } from '../../context/AppContext';

export const CloudSyncModal = ({ isOpen, onClose }) => {
  const { syncStatus, lastSyncTime, loadServerData, lots, registeredUsers, orders } = useApp();
  const [cloudUrlInput, setCloudUrlInput] = useState('');
  const [testing, setTesting] = useState(false);
  const [diagnostics, setDiagnostics] = useState(null);
  const [migrating, setMigrating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCloudUrlInput(getCloudDbUrl() || '');
      runDiagnostics();
    }
  }, [isOpen]);

  const runDiagnostics = async () => {
    setTesting(true);
    try {
      const diag = await apiService.testConnection();
      setDiagnostics(diag);
    } catch {
      setDiagnostics({ apiConnected: false, cloudConnected: false, activeMode: 'Local Storage Cache' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveCloudUrl = () => {
    setCloudDbUrl(cloudUrlInput);
    setSavedSuccess(true);
    runDiagnostics();
    loadServerData();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePushToCloud = async () => {
    setMigrating(true);
    try {
      const allData = {
        lots,
        registeredUsers,
        orders,
        updatedAt: new Date().toISOString()
      };
      const ok = await apiService.syncToCloud(allData);
      if (ok) {
        alert('All local data successfully synced to Cloud Database! All connected devices will now see this data.');
      } else {
        alert('Could not push to Cloud Database. Please verify your Cloud URL.');
      }
    } finally {
      setMigrating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cloud size={24} color="#86efac" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Live Cloud & Multi-Device Sync
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#a7f3d0' }}>
                Netlify Functions, Blobs & Realtime Cloud Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Status Banner */}
          <div style={{
            background: diagnostics?.apiConnected || diagnostics?.cloudConnected ? '#f0fdf4' : '#fefce8',
            border: `1px solid ${diagnostics?.apiConnected || diagnostics?.cloudConnected ? '#bbf7d0' : '#fef08a'}`,
            borderRadius: '14px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: diagnostics?.apiConnected || diagnostics?.cloudConnected ? '#22c55e' : '#eab308',
                boxShadow: diagnostics?.apiConnected || diagnostics?.cloudConnected ? '0 0 10px #22c55e' : 'none'
              }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  {diagnostics?.activeMode || 'Detecting sync engine...'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Last sync: {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Active'}
                </div>
              </div>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={testing}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 600,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} style={{ animation: testing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Multi-Device Architecture Diagram */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Laptop size={15} color="#059669" />
              <span>Multi-Device Architecture:</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', textAlign: 'center', fontSize: '0.74rem', color: '#475569' }}>
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <Laptop size={20} color="#2563eb" style={{ margin: '0 auto 4px' }} />
                <strong>Device 1 (Laptop)</strong>
                <div>Creates Crop Lot</div>
              </div>
              <ArrowRightLeft size={18} color="#94a3b8" />
              <div style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                <Cloud size={20} color="#059669" style={{ margin: '0 auto 4px' }} />
                <strong style={{ color: '#065f46' }}>Netlify / Cloud DB</strong>
                <div>Instant Sync</div>
              </div>
              <ArrowRightLeft size={18} color="#94a3b8" />
              <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <Smartphone size={20} color="#7c3aed" style={{ margin: '0 auto 4px' }} />
                <strong>Device 2 (Phone/Laptop)</strong>
                <div>Logs in with same email</div>
              </div>
            </div>
          </div>

          {/* Cloud Database URL Configuration (For Netlify / Custom Domain) */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
              Cloud Realtime Database URL (Optional for Netlify Live Sync):
            </label>
            <p style={{ margin: '0 0 8px', fontSize: '0.76rem', color: '#64748b' }}>
              On Netlify, our backend uses Netlify Functions & Blobs. For sub-second live WebSockets anywhere on Earth, enter a free Firebase Realtime Database URL:
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="https://your-project-default-rtdb.firebaseio.com"
                value={cloudUrlInput}
                onChange={(e) => setCloudUrlInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={handleSaveCloudUrl}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 16px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
            {savedSuccess && (
              <div style={{ marginTop: '6px', fontSize: '0.76rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                <span>Cloud Database URL saved and active!</span>
              </div>
            )}
          </div>

          {/* Quick Setup Instructions */}
          <div style={{
            background: '#f1f5f9',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '0.78rem',
            color: '#334155'
          }}>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '6px' }}>
              📋 How to deploy & sync on Netlify:
            </strong>
            <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Connect your repository to <strong>Netlify</strong>.</li>
              <li>Netlify automatically detects <code>netlify.toml</code> and deploys the <strong>API Functions</strong> with <strong>Netlify Blobs</strong>.</li>
              <li>When you add a product on Laptop 1, it persists to the cloud and appears on Laptop 2 when logging in with the same email!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f8fafc',
          padding: '14px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudSyncModal;
