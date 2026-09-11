import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Navigation, 
  CheckCircle2, 
  DollarSign, 
  User, 
  Phone, 
  Scale, 
  Snowflake, 
  FileText, 
  AlertCircle,
  Sparkles,
  Camera,
  Upload,
  Image as ImageIcon,
  Check,
  Building2,
  Trash2
} from 'lucide-react';

const PRESET_VEHICLE_TEMPLATES = [
  { 
    name: 'Tata Ace Gold (Chhota Hathi)', 
    customName: 'Tata Ace Gold - Kisan Express',
    category: 'Mini Truck', 
    capacity: 1500, 
    rate: 18, 
    base: 300, 
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
    icon: '🛻' 
  },
  { 
    name: 'Mahindra Bolero Maxi Truck Plus', 
    customName: 'Bolero Maxi Truck - Fast Rural Carrier',
    category: 'Pickup / Maxi Truck', 
    capacity: 2500, 
    rate: 22, 
    base: 450, 
    image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80',
    icon: '🚛' 
  },
  { 
    name: 'Ashok Leyland Dost+ Agro', 
    customName: 'Ashok Leyland Dost - Mandi Direct',
    category: 'Light Commercial Vehicle', 
    capacity: 2000, 
    rate: 20, 
    base: 400, 
    image: 'https://images.unsplash.com/photo-1586191582152-475269c719e7?w=600&auto=format&fit=crop&q=80',
    icon: '🛻' 
  },
  { 
    name: 'Eicher Pro 2049 Light Truck', 
    customName: 'Eicher Pro 14ft - High Capacity Canter',
    category: 'Medium Commercial Truck', 
    capacity: 4500, 
    rate: 34, 
    base: 700, 
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=80',
    icon: '🚚' 
  },
  { 
    name: 'Tata 407 Gold SFC High-Deck', 
    customName: 'Tata 407 Gold - Maharashtra Agro Lines',
    category: 'Heavy Commercial Truck', 
    capacity: 5000, 
    rate: 38, 
    base: 800, 
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    icon: '🚚' 
  },
  { 
    name: 'ColdChain Reefer Van (Temp: 2-8°C)', 
    customName: 'Reefer Express - Cold Chain Carrier',
    category: 'Refrigerated Vehicle', 
    capacity: 3500, 
    rate: 48, 
    base: 1200, 
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&auto=format&fit=crop&q=80',
    icon: '❄️', 
    hasReefer: true 
  }
];

export const AddVehicleModal = () => {
  const { 
    currentUser,
    isAddVehicleModalOpen, 
    setIsAddVehicleModalOpen, 
    addFleetVehicle, 
    lang 
  } = useApp();

  const cameraInputRef = useRef(null);
  const deviceInputRef = useRef(null);

  // Form states
  const [providerName, setProviderName] = useState(currentUser?.organization || currentUser?.name || 'Kisan Express Agro Logistics');
  const [customName, setCustomName] = useState('Tata Ace Gold - Kisan Express');
  const [vehicleType, setVehicleType] = useState('Tata Ace Gold (Chhota Hathi)');
  const [vehicleRegNumber, setVehicleRegNumber] = useState('MH-12-FL-4892');
  const [capacityKg, setCapacityKg] = useState(1500);
  const [ratePerKm, setRatePerKm] = useState(18);
  const [baseFare, setBaseFare] = useState(300);
  const [driverName, setDriverName] = useState(currentUser?.name || 'Tukaram Shinde');
  const [driverPhone, setDriverPhone] = useState(currentUser?.phone || '9422390812');
  const [currentLocation, setCurrentLocation] = useState('Pune APMC Yard, Gultekdi');
  const [vehicleImage, setVehicleImage] = useState(PRESET_VEHICLE_TEMPLATES[0].image);
  const [isCustomImageUploaded, setIsCustomImageUploaded] = useState(false);
  const [hasGps, setHasGps] = useState(true);
  const [isInsured, setIsInsured] = useState(true);
  const [hasReefer, setHasReefer] = useState(false);
  const [hasTarpaulin, setHasTarpaulin] = useState(true);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAddVehicleModalOpen) return null;

  // Handle Preset Model Selection
  const handleSelectPreset = (template) => {
    setVehicleType(template.name);
    setCustomName(template.customName);
    setCapacityKg(template.capacity);
    setRatePerKm(template.rate);
    setBaseFare(template.base);
    if (!isCustomImageUploaded) {
      setVehicleImage(template.image);
    }
    if (template.hasReefer) setHasReefer(true);
  };

  // Image Upload Handler (handles both Camera Click and File Upload)
  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicleImage(reader.result);
        setIsCustomImageUploaded(true);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Ensure registration number
    let regPlate = vehicleRegNumber.trim().toUpperCase();
    if (!regPlate) {
      regPlate = `MH-12-FL-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Sanitize driver phone: allow standard numbers, ensure not empty
    let cleanPhone = driverPhone.toString().trim();
    if (!cleanPhone) {
      cleanPhone = '+91 94223 90812';
    } else if (!cleanPhone.startsWith('+') && cleanPhone.length >= 9) {
      cleanPhone = `+91 ${cleanPhone}`;
    }

    // Call context action
    addFleetVehicle({
      providerName: providerName.trim() || 'Kisan Express Agro Logistics',
      customName: customName.trim() || vehicleType,
      vehicleType: vehicleType.trim(),
      vehicleRegNumber: regPlate,
      image: vehicleImage,
      capacityKg: Number(capacityKg) || 1500,
      ratePerKm: Number(ratePerKm) || 18,
      baseFare: Number(baseFare) || 300,
      driverName: (driverName.trim() || currentUser?.name || 'Fleet Driver'),
      driverPhone: cleanPhone,
      currentLocation: (currentLocation.trim() || 'Pune APMC Hub'),
      hasGps,
      isInsured,
      hasReefer,
      notes: `${notes} ${hasTarpaulin ? '[Heavy Tarpaulin Included]' : ''}`.trim()
    });

    setIsAddVehicleModalOpen(false);
  };

  // Sample earnings for 100km corridor
  const sampleEarnings100Km = Math.round((Number(baseFare) || 300) + (100 * (Number(ratePerKm) || 18)));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.78)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      {/* Hidden File Inputs for Camera and Device Upload */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={cameraInputRef} 
        onChange={handleImageFileChange} 
        style={{ display: 'none' }} 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={deviceInputRef} 
        onChange={handleImageFileChange} 
        style={{ display: 'none' }} 
      />

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #e2e8f0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          padding: '20px 24px',
          color: '#ffffff',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Truck size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Fleet Dispatch Portal
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                {lang === 'mr' ? 'नवीन वाहन ताफ्यात जोडा' : 'Add Vehicle to Active Fleet'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#a7f3d0' }}>
                {lang === 'mr' 
                  ? 'शेतमाल वाहतुकीसाठी नवीन वाहनाचे नाव, फोटो व दर नोंदवा' 
                  : 'Register commercial mini-truck, pickup, or refrigerated container for farm-gate booking'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddVehicleModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'background 0.15s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          
          {errorMsg && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#b91c1c',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SECTION 1: CUSTOM IDENTITY & VEHICLE NAME */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                background: '#047857',
                color: '#ffffff',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>1</span>
              <label style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                {lang === 'mr' ? 'वाहनाचे नाव व ट्रान्सपोर्टर माहिती (Custom Identity)' : 'Transporter Fleet & Custom Vehicle Name'}
              </label>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    🏢 {lang === 'mr' ? 'ट्रान्सपोर्ट कंपनी / ऑपरेटरचे नाव' : 'Fleet Operator / Business Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder="e.g. Kisan Express Logistics or Patil Roadlines"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Your transport firm or individual operator title
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>
                    🏷️ {lang === 'mr' ? 'वाहनाचे स्वतःचे नाव (Custom Vehicle Name)' : 'Custom Vehicle Name / Nickname'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Tata Ace Gold - Bullet Express or Bolero Pickup Fast"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #059669',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#065f46',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px', display: 'block' }}>
                    Name shown prominently on your vehicle card to buyers & farmers
                  </span>
                </div>
              </div>

              {/* Quick Template Presets */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  ⚡ Quick Vehicle Templates (Click to Auto-Fill Specs & Base Rates):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                  {PRESET_VEHICLE_TEMPLATES.map((tmpl) => {
                    const isSelected = vehicleType === tmpl.name;
                    return (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => handleSelectPreset(tmpl)}
                        style={{
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                          background: isSelected ? '#ecfdf5' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '1rem' }}>{tmpl.icon}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#065f46' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {tmpl.name.split('(')[0]}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                          <span>{tmpl.capacity} kg</span>
                          <span style={{ fontWeight: 700, color: '#059669' }}>₹{tmpl.rate}/km</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: PHOTO UPLOAD (CAMERA & DEVICE) */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: '#047857',
                  color: '#ffffff',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>2</span>
                <label style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                  {lang === 'mr' ? 'वाहनाचा फोटो (कॅमेऱ्याने काढा किंवा डिव्हाइसमधून अपलोड करा)' : 'Vehicle Photo: Click from Camera & Upload from Device'}
                </label>
              </div>

              {isCustomImageUploaded ? (
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Check size={12} /> Custom Photo Attached
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  (Template Preview Active)
                </span>
              )}
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexWrap: 'wrap'
            }}>
              {/* Photo Preview */}
              <div style={{
                position: 'relative',
                width: '160px',
                height: '110px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                border: '2px solid #059669',
                flexShrink: 0
              }}>
                <img 
                  src={vehicleImage} 
                  alt="Vehicle Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '4px',
                  right: '4px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#ffffff',
                  fontSize: '0.66rem',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {customName || vehicleType}
                </span>
              </div>

              {/* Action Buttons: Camera & Device Upload */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#475569' }}>
                  Attach a clear picture of your vehicle to attract instant bookings from institutional buyers & farmers.
                </p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Click from Camera */}
                  <button
                    type="button"
                    onClick={() => {
                      if (cameraInputRef.current) cameraInputRef.current.click();
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '9px 16px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                    }}
                  >
                    <Camera size={16} />
                    <span>Click from Camera</span>
                  </button>

                  {/* Upload from Device */}
                  <button
                    type="button"
                    onClick={() => {
                      if (deviceInputRef.current) deviceInputRef.current.click();
                    }}
                    style={{
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1.5px solid #cbd5e1',
                      padding: '9px 16px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Upload size={16} />
                    <span>Upload from Device</span>
                  </button>

                  {/* Reset to template */}
                  {isCustomImageUploaded && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomImageUploaded(false);
                        const match = PRESET_VEHICLE_TEMPLATES.find(t => t.name === vehicleType) || PRESET_VEHICLE_TEMPLATES[0];
                        setVehicleImage(match.image);
                      }}
                      style={{
                        background: 'transparent',
                        color: '#94a3b8',
                        border: 'none',
                        padding: '9px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem'
                      }}
                      title="Reset to default vehicle image"
                    >
                      <Trash2 size={14} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SPECS, PLATE & RATES */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                background: '#047857',
                color: '#ffffff',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>3</span>
              <label style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                {lang === 'mr' ? 'गाडी क्रमांक, क्षमता व भाडे दर (Rates & Plate Number)' : 'Vehicle Registration Plate & Pricing Rates'}
              </label>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    🚗 {lang === 'mr' ? 'वाहनाचा मॉडेल प्रकार' : 'Vehicle Model / Type'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    placeholder="e.g. Tata Ace Gold, Bolero Maxi Truck, Eicher 14ft"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>
                    🪪 {lang === 'mr' ? 'गाडी नंबर प्लेट (RTO Number)' : 'Vehicle Number Plate (RTO)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleRegNumber}
                    onChange={(e) => setVehicleRegNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. MH-12-RN-4892"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #059669',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      letterSpacing: '1px',
                      color: '#065f46',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* 3-Column Rates & Capacity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>
                    ⚖️ {lang === 'mr' ? 'वहन क्षमता (KG)' : 'Payload Capacity (KG)'} *
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="40000"
                    step="50"
                    required
                    value={capacityKg}
                    onChange={(e) => setCapacityKg(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    {(Number(capacityKg || 0) / 1000).toFixed(1)} Metric Tons Max
                  </span>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', marginBottom: '4px' }}>
                    💵 {lang === 'mr' ? 'किमी दर (₹ / KM)' : 'Rate Per KM (₹ / KM)'} *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    step="1"
                    required
                    value={ratePerKm}
                    onChange={(e) => setRatePerKm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Charged on road distance
                  </span>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#d97706', marginBottom: '4px' }}>
                    🏷️ {lang === 'mr' ? 'मूळ भाडे (Base ₹)' : 'Base Booking Fee (₹)'} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    step="50"
                    required
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Loading & gate allowance
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: DRIVER & BASE HUB */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                background: '#047857',
                color: '#ffffff',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>4</span>
              <label style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                {lang === 'mr' ? 'चालक व बेस स्टेशन (Driver & Station)' : 'Assigned Driver & Base Logistics Station'}
              </label>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    👤 {lang === 'mr' ? 'चालकाचे नाव' : 'Assigned Driver Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Tukaram Shinde or Ramesh Patil"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    📞 {lang === 'mr' ? 'चालकाचा मोबाईल नंबर' : 'Driver Mobile Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="e.g. 9422390812 or 8987833930"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Used for automated farm pickup coordination
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  📍 {lang === 'mr' ? 'सध्याचे स्थान / बेस स्टेशन' : 'Current Base Hub / Parking Location'}
                </label>
                <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="e.g. Pune APMC Market, Gultekdi or Chakan Agro Logistics Yard"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.86rem',
                    color: '#0f172a',
                    background: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: SAFETY BADGES & SIMULATION */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
              🛡️ Equipment, Safety Badges & Features:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '14px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: hasGps ? '1.5px solid #059669' : '1px solid #cbd5e1',
                background: hasGps ? '#ecfdf5' : '#ffffff',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: hasGps ? '#065f46' : '#475569'
              }}>
                <input type="checkbox" checked={hasGps} onChange={(e) => setHasGps(e.target.checked)} />
                <span>🛰️ Live GPS</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: isInsured ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                background: isInsured ? '#f0f9ff' : '#ffffff',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: isInsured ? '#0369a1' : '#475569'
              }}>
                <input type="checkbox" checked={isInsured} onChange={(e) => setIsInsured(e.target.checked)} />
                <span>🛡️ Cargo Insured</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: hasReefer ? '1.5px solid #0891b2' : '1px solid #cbd5e1',
                background: hasReefer ? '#ecfeff' : '#ffffff',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: hasReefer ? '#0e7490' : '#475569'
              }}>
                <input type="checkbox" checked={hasReefer} onChange={(e) => setHasReefer(e.target.checked)} />
                <span>❄️ Cold Chain</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: hasTarpaulin ? '1.5px solid #059669' : '1px solid #cbd5e1',
                background: hasTarpaulin ? '#ecfdf5' : '#ffffff',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: hasTarpaulin ? '#065f46' : '#475569'
              }}>
                <input type="checkbox" checked={hasTarpaulin} onChange={(e) => setHasTarpaulin(e.target.checked)} />
                <span>🌧️ Tarpaulin Cover</span>
              </label>
            </div>

            {/* Trip Earnings Simulation */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Trip Fare Simulation (Sample 100 KM Corridor)
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                  ₹{sampleEarnings100Km.toLocaleString('en-IN')}
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginLeft: '6px' }}>
                    (₹{baseFare || 300} Base + 100 KM × ₹{ratePerKm || 18})
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, display: 'block' }}>
                  0% Commission
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Direct Payout to Transporter
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={() => setIsAddVehicleModalOpen(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
            </button>

            <button
              type="submit"
              style={{
                padding: '11px 28px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
              }}
            >
              <CheckCircle2 size={18} />
              <span>{lang === 'mr' ? 'वाहन ताफ्यात जोडा' : 'Add Vehicle to Fleet'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
