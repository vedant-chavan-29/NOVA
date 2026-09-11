import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  sendRealSmsOtp, 
  getFast2SMSApiKey, 
  setFast2SMSApiKey 
} from '../../utils/smsService';
import { sendEmailOtp } from '../../utils/emailService';
import { 
  X, 
  Sprout, 
  Building2, 
  Truck, 
  ShieldCheck, 
  Snowflake,
  Phone, 
  Lock, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  AlertCircle,
  Clock,
  RotateCw,
  Edit3,
  Smartphone,
  MapPin,
  Key,
  Mail,
  CheckCircle2
} from 'lucide-react';

const RoleAuthModalContent = () => {
  const { 
    setIsAuthModalOpen, 
    authDefaultRole, 
    authDefaultTab,
    loginWithPhone, 
    registerUser, 
    findRegisteredUser,
    pushNotification,
    lang
  } = useApp();

  // The primary stakeholder roles
  const [selectedRole, setSelectedRole] = useState(authDefaultRole || 'farmer');
  // Defaults to 'login' or requested tab
  const [authTab, setAuthTab] = useState(authDefaultTab || 'login'); // 'login' | 'register'

  useEffect(() => {
    if (authDefaultRole) setSelectedRole(authDefaultRole);
    if (authDefaultTab) setAuthTab(authDefaultTab);
  }, [authDefaultRole, authDefaultTab]);
  
  // Login State - Supports Email (Instant, zero hassle) and Mobile SMS
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
  const [loginStep, setLoginStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailPreview, setEmailPreview] = useState(null);
  const [realtimeOtp, setRealtimeOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Registration State - Supports Email or Mobile
  const [regAuthMethod, setRegAuthMethod] = useState('email'); // 'email' | 'phone'
  const [regStep, setRegStep] = useState('form'); // 'form' | 'otp'
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    city: '',
    state: 'Maharashtra'
  });
  const [regRealtimeOtp, setRegRealtimeOtp] = useState(null);
  const [enteredRegOtp, setEnteredRegOtp] = useState('');
  const [regError, setRegError] = useState('');
  const [regOtpError, setRegOtpError] = useState('');
  const [regCountdown, setRegCountdown] = useState(0);

  // Real SMS Gateway (Fast2SMS) Configuration
  const [fast2smsKey, setFast2smsKeyState] = useState(() => getFast2SMSApiKey());
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [keySaveMsg, setKeySaveMsg] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState(null);

  // Timers for OTP resend countdown
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    let timer;
    if (regCountdown > 0) {
      timer = setInterval(() => setRegCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [regCountdown]);

  const roles = [
    {
      id: 'farmer',
      title: lang === 'mr' ? 'शेतकरी / FPO' : 'Farmer / FPO',
      desc: lang === 'mr' ? 'उत्पादन नोंदणी, बाजार भाव व थेट विक्री' : 'List produce, check mandi rates & sell direct',
      icon: Sprout,
      color: '#15803d',
      lightBg: '#f0fdf4',
      border: '#bbf7d0'
    },
    {
      id: 'buyer',
      title: lang === 'mr' ? 'संस्थात्मक खरेदीदार' : 'Institutional Buyer',
      desc: lang === 'mr' ? 'थेट शेतीमाल खरेदी व सुरक्षित व्यवहार' : 'Procure bulk farm produce with verified escrow',
      icon: Building2,
      color: '#0369a1',
      lightBg: '#f0f9ff',
      border: '#bae6fd'
    },
    {
      id: 'transporter',
      title: lang === 'mr' ? 'वाहतूकदार' : lang === 'hi' ? 'परिवहन' : 'Transporter',
      desc: lang === 'mr' ? 'वाहतूक भाडे व थेट शेतीमाल वाहतूक' : 'Offer fleet transport & logistics trips',
      icon: Truck,
      color: '#b45309',
      lightBg: '#fffbeb',
      border: '#fde68a'
    },
    {
      id: 'cold_storage',
      title: lang === 'mr' ? 'शीतगृह चालक' : lang === 'hi' ? 'कोल्ड स्टोरेज' : 'Cold Storage',
      desc: lang === 'mr' ? 'शीतगृह क्षमता नोंदणी व शेतीमाल आरक्षण' : 'List cold storage space & manage client reservations',
      icon: Snowflake,
      color: '#0891b2',
      lightBg: '#ecfeff',
      border: '#a5f3fc'
    },
    {
      id: 'admin',
      title: lang === 'mr' ? 'प्रशासक / अधिकारी' : 'Administrator',
      desc: lang === 'mr' ? 'केंद्रीय व्यासपीठ प्रशासन, विश्लेषण व नियंत्रण' : 'Platform administration, analytics & ecosystem control',
      icon: ShieldCheck,
      color: '#dc2626',
      lightBg: '#fef2f2',
      border: '#fecaca'
    }
  ];

  const currentRoleObj = roles.find(r => r.id === selectedRole) || {
    id: 'admin',
    title: lang === 'mr' ? 'प्रशासक / अधिकारी' : 'Administrator',
    desc: lang === 'mr' ? 'केंद्रीय व्यासपीठ प्रशासन, विश्लेषण व नियंत्रण' : 'Chief Platform Administrator & State System Controller',
    icon: ShieldCheck,
    color: '#dc2626',
    lightBg: '#fef2f2',
    border: '#fecaca'
  };

  // Safe tab switching that cleans previous errors
  const handleSwitchTab = (tab) => {
    setAuthTab(tab);
    setPhoneError('');
    setEmailError('');
    setOtpError('');
    setRegError('');
    setRegOtpError('');
    setGatewayStatus(null);
    setEmailPreview(null);
    setShowKeyPrompt(false);
    setLoginStep('phone');
    setRegStep('form');
  };

  // Phone input sanitizer: strictly digits only, max 10 digits
  const handlePhoneInputChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
    setPhoneError('');
  };

  const handleRegPhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setRegData(prev => ({ ...prev, phone: digitsOnly }));
    setRegError('');
  };

  // Save Fast2SMS API Key
  const handleSaveApiKey = () => {
    setFast2SMSApiKey(fast2smsKey);
    setFast2smsKeyState(fast2smsKey);
    setShowKeyPrompt(false);
    setKeySaveMsg('API Key Saved! Real SMS will be sent for new OTPs.');
    setTimeout(() => setKeySaveMsg(''), 4000);
  };

  // -------------------------------------------------------------------------
  // LOGIN FLOW: Email or Real/Simulated SMS OTP generation & delivery
  // -------------------------------------------------------------------------
  const handleSendLoginOtp = async (e, forceDemo = false) => {
    if (e && e.preventDefault) e.preventDefault();
    setPhoneError('');
    setEmailError('');
    setOtpError('');
    setGatewayStatus(null);
    setEmailPreview(null);

    try {
      // FLOW 1: Instant Zero-Friction Email OTP
      if (authMethod === 'email') {
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          setEmailError(lang === 'mr' 
            ? 'कृपया वैध ईमेल पत्ता टाका (उदा. yourname@gmail.com).' 
            : 'Please enter a valid email address (e.g. yourname@gmail.com).');
          return;
        }

        // Check if user has an existing account with this email
        const existing = findRegisteredUser ? findRegisteredUser(cleanEmail) : null;
        if (existing && existing.role && existing.role !== selectedRole && selectedRole !== 'admin') {
          setSelectedRole(existing.role);
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setRealtimeOtp(code);
        setEnteredOtp('');
        setCountdown(60);

        setIsSendingEmail(true);
        const emailResult = await sendEmailOtp(cleanEmail, code, selectedRole);
        setIsSendingEmail(false);
        if (emailResult && emailResult.preview) {
          setEmailPreview(emailResult.preview);
        }

        setLoginStep('otp');
        pushNotification(
          "AgriLink Verification Code",
          `Security OTP [ ${code} ] generated for ${cleanEmail}. Click auto-fill to enter dashboard!`,
          `ईमेल OTP: ${code}`,
          "info"
        );
        return;
      }

      // FLOW 2: Mobile Phone SMS (Clean, no dead-end prompts)
      const clean = phone.replace(/\D/g, '').slice(0, 10);

      if (clean.length !== 10) {
        setPhoneError(lang === 'mr' 
          ? 'कृपया वैध १० अंकी मोबाईल क्रमांक टाका (उदा. 98220 14892).' 
          : 'Please enter a valid 10-digit mobile number (e.g. 98220 14892).');
        return;
      }

      const currentKey = getFast2SMSApiKey();

      const existing = findRegisteredUser ? findRegisteredUser(clean) : null;
      if (existing && existing.role && existing.role !== selectedRole && selectedRole !== 'admin') {
        setSelectedRole(existing.role);
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setRealtimeOtp(code);
      setEnteredOtp('');
      setCountdown(60);

      if (currentKey && !forceDemo) {
        setIsSendingSms(true);
        const smsResult = await sendRealSmsOtp(clean, code);
        setIsSendingSms(false);
        setGatewayStatus(smsResult);

        if (smsResult.sent) {
          setLoginStep('otp');
          pushNotification(
            "Real SMS OTP Dispatched",
            `Real cellular SMS sent to +91 ${clean} via Fast2SMS. Check your mobile.`,
            `SMS पाठवला (+91 ${clean})`,
            "info"
          );
        } else {
          setGatewayStatus({
            sent: false,
            isDemo: true,
            demoOtp: code,
            message: `Fast2SMS Notice: ${smsResult.message || 'Key expired or balance 0'}. Generated Instant OTP below.`
          });
          setLoginStep('otp');
        }
      } else {
        // Instant Demo Simulation: Never blocks the user with an error wall
        setIsDemoMode(true);
        setGatewayStatus({
          sent: false,
          isDemo: true,
          demoOtp: code,
          message: 'Instant Simulation Mode (Zero Gateway Setup)'
        });
        setLoginStep('otp');
        pushNotification(
          "Instant OTP Ready",
          `Simulated OTP for +91 ${clean}: ${code}. (Zero setup required).`,
          `डेमो OTP: ${code}`,
          "info"
        );
      }
    } catch (err) {
      console.error("Login OTP dispatch error:", err);
      setIsSendingEmail(false);
      setIsSendingSms(false);
      setEmailError(err.message || 'Error generating OTP. Please try again.');
    }
  };

  // Verify Real-Time OTP and enter website
  const handleVerifyLoginOtp = (e) => {
    if (e) e.preventDefault();
    setOtpError('');

    const cleanOtp = enteredOtp.trim();
    if (cleanOtp.length !== 6) {
      setOtpError(lang === 'mr' ? 'कृपया पूर्ण ६ अंकी OTP टाका.' : 'Please enter the complete 6-digit OTP.');
      return;
    }

    if (cleanOtp !== realtimeOtp) {
      const dest = authMethod === 'email' ? email : `+91 ${phone}`;
      setOtpError(lang === 'mr' 
        ? 'चुकीचा OTP! कृपया आपल्या ईमेल/मोबाईलवर आलेला खरा OTP टाका.' 
        : `Invalid OTP! Please enter the 6-digit OTP generated for ${dest}.`);
      return;
    }

    try {
      // OTP matched! Log into website
      const identifier = authMethod === 'email' ? email.trim().toLowerCase() : phone;
      const res = loginWithPhone(selectedRole, identifier);
      if (res && res.success === false) {
        setOtpError(res.error || 'Failed to authenticate');
      }
    } catch (err) {
      console.error("Login verification error:", err);
      setOtpError(err.message || 'Error authenticating user. Please try again.');
    }
  };

  // -------------------------------------------------------------------------
  // REGISTRATION FLOW: User enters own city, and OTP goes to email/phone
  // -------------------------------------------------------------------------
  const handleSendRegOtp = async (e, forceDemo = false) => {
    if (e && e.preventDefault) e.preventDefault();
    setRegError('');
    setRegOtpError('');
    setGatewayStatus(null);
    setEmailPreview(null);

    try {
      if (!regData.name.trim()) {
        setRegError(lang === 'mr' ? 'कृपया आपले पूर्ण नाव टाका.' : 'Please enter your full name.');
        return;
      }

      if (!regData.organization.trim()) {
        setRegError(lang === 'mr' 
          ? 'कृपया संस्था किंवा कंपनीचे नाव टाका.' 
          : 'Please enter FPO / Company / Business name.');
        return;
      }

      if (!regData.city.trim()) {
        setRegError(lang === 'mr' 
          ? 'कृपया आपल्या शहराचे किंवा गावाचे नाव टाका.' 
          : 'Please enter your city / town / district name.');
        return;
      }

      // Registration Flow 1: Email
      if (regAuthMethod === 'email') {
        const cleanEmail = (regData.email || '').trim().toLowerCase();
        if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          setRegError(lang === 'mr' ? 'कृपया वैध ईमेल पत्ता टाका.' : 'Please enter a valid email address.');
          return;
        }

        const existing = findRegisteredUser ? findRegisteredUser(cleanEmail) : null;
        if (existing) {
          setRegError(lang === 'mr'
            ? `ईमेल ${cleanEmail} आधीच नोंदणीकृत आहे (${existing.name} - ${existing.role.toUpperCase()}). कृपया लॉगिन करा.`
            : `Email ${cleanEmail} is already registered (${existing.name} - ${existing.role.toUpperCase()}). Please sign in.`);
          return;
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setRegRealtimeOtp(code);
        setEnteredRegOtp('');
        setRegCountdown(60);

        setIsSendingEmail(true);
        const emailResult = await sendEmailOtp(cleanEmail, code, selectedRole);
        setIsSendingEmail(false);
        if (emailResult && emailResult.preview) {
          setEmailPreview(emailResult.preview);
        }

        setRegStep('otp');
        pushNotification(
          "AgriLink Registration Code",
          `Verification OTP [ ${code} ] sent to ${cleanEmail}. Click auto-fill to complete registration!`,
          `नोंदणी ईमेल OTP: ${code}`,
          "info"
        );
        return;
      }

      // Registration Flow 2: Mobile Phone
      const clean = regData.phone.replace(/\D/g, '').slice(0, 10);

      if (clean.length !== 10) {
        setRegError(lang === 'mr' 
          ? 'मोबाईल क्रमांक बरोबर १० अंकांचा असणे आवश्यक आहे.' 
          : 'Mobile number must be exactly 10 digits.');
        return;
      }

      const existing = findRegisteredUser ? findRegisteredUser(clean) : null;
      if (existing) {
        setRegError(lang === 'mr'
          ? `मोबाईल क्रमांक +91 ${clean} आधीच नोंदणीकृत आहे (${existing.name} - ${existing.role.toUpperCase()}). कृपया लॉगिन करा.`
          : `Mobile number +91 ${clean} is already registered with an active account (${existing.name} - ${existing.role.toUpperCase()}). Please sign in.`);
        return;
      }

      const currentKey = getFast2SMSApiKey();
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setRegRealtimeOtp(code);
      setEnteredRegOtp('');
      setRegCountdown(60);

      if (currentKey && !forceDemo) {
        setIsSendingSms(true);
        const smsResult = await sendRealSmsOtp(clean, code);
        setIsSendingSms(false);
        setGatewayStatus(smsResult);

        if (smsResult.sent) {
          setRegStep('otp');
          pushNotification(
            "Real Registration SMS Sent",
            `Real cellular SMS sent to +91 ${clean} via Fast2SMS. Check your mobile.`,
            `नोंदणी SMS पाठवला (+91 ${clean})`,
            "info"
          );
        } else {
          setGatewayStatus({
            sent: false,
            isDemo: true,
            demoOtp: code,
            message: `Fast2SMS notice: ${smsResult.message || 'SMS error'}. Using Instant Demo OTP below.`
          });
          setRegStep('otp');
        }
      } else {
        setIsDemoMode(true);
        setGatewayStatus({
          sent: false,
          isDemo: true,
          demoOtp: code,
          message: 'Demo Simulation Mode (SMS Gateway key not configured)'
        });
        setRegStep('otp');
        pushNotification(
          "Demo Mode Active",
          `Simulated OTP for +91 ${clean}: ${code}.`,
          `नोंदणी डेमो OTP: ${code}`,
          "info"
        );
      }
    } catch (err) {
      console.error("Registration OTP dispatch error:", err);
      setIsSendingEmail(false);
      setIsSendingSms(false);
      setRegError(err.message || 'Error generating registration OTP. Please try again.');
    }
  };

  // Verify Registration OTP & Complete Registration
  const handleVerifyRegOtp = (e) => {
    if (e) e.preventDefault();
    setRegOtpError('');

    const cleanOtp = enteredRegOtp.trim();
    if (cleanOtp.length !== 6) {
      setRegOtpError(lang === 'mr' ? 'कृपया पूर्ण ६ अंकी OTP टाका.' : 'Please enter the complete 6-digit OTP.');
      return;
    }

    if (cleanOtp !== regRealtimeOtp) {
      setRegOtpError(lang === 'mr' 
        ? 'चुकीचा OTP! कृपया आलेला ६ अंकी OTP टाका.' 
        : `Invalid OTP! Please enter the 6-digit code.`);
      return;
    }

    try {
      // OTP matched! Complete registration
      const res = registerUser({
        name: regData.name.trim(),
        phone: regAuthMethod === 'phone' ? regData.phone : (regData.phone || ''),
        email: regAuthMethod === 'email' ? regData.email.trim().toLowerCase() : (regData.email || ''),
        organization: regData.organization.trim(),
        city: regData.city.trim(),
        district: regData.city.trim(),
        state: regData.state || 'Maharashtra',
        location: `${regData.city.trim()}, ${regData.state || 'Maharashtra'}`
      }, selectedRole);

      if (res && res.success === false) {
        setRegOtpError(res.error || 'Registration failed');
      }
    } catch (err) {
      console.error("Registration verification error:", err);
      setRegOtpError(err.message || 'Error completing registration. Please try again.');
    }
  };

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
        width: '100%',
        maxWidth: '560px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: currentRoleObj.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: `0 4px 10px ${currentRoleObj.color}30`
              }}>
                <Sprout size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.22rem', fontWeight: 800, color: '#0f172a' }}>
                AgriLink (कृषीलिंक) • {lang === 'mr' ? 'प्रवेश व नोंदणी' : 'Sign In & Access'}
              </h3>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              {lang === 'mr' 
                ? 'आपली भूमिका निवडा आणि मोबाईल OTP द्वारे थेट प्रवेश करा' 
                : 'Enter your 10-digit mobile number to receive OTP via SMS'}
            </p>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'background 0.15s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* 1. ROLE SELECTION CARDS */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              1. {lang === 'mr' ? 'आपली भूमिका निवडा' : 'Select Your Stakeholder Role'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
              {roles.map(r => {
                const isSelected = selectedRole === r.id;
                const Icon = r.icon;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    style={{
                      border: isSelected ? `2px solid ${r.color}` : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '12px 8px',
                      cursor: 'pointer',
                      background: isSelected ? r.lightBg : '#ffffff',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                      boxShadow: isSelected ? `0 4px 12px ${r.lightBg}` : 'none'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isSelected ? r.color : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 6px'
                    }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: isSelected ? r.color : '#1e293b' }}>
                      {r.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. MODE SWITCH: LOGIN vs REGISTER (Requirement 3: Cleanly separated tabs) */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <button
              onClick={() => handleSwitchTab('login')}
              style={{
                flex: 1,
                background: authTab === 'login' ? currentRoleObj.color : '#f8fafc',
                color: authTab === 'login' ? '#ffffff' : '#64748b',
                border: authTab === 'login' ? `1px solid ${currentRoleObj.color}` : '1px solid #e2e8f0',
                padding: '9px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              <LogIn size={15} />
              <span>{lang === 'mr' ? 'मोबाईलने प्रवेश करा' : 'Sign In with Mobile'}</span>
            </button>

            <button
              onClick={() => handleSwitchTab('register')}
              style={{
                flex: 1,
                background: authTab === 'register' ? currentRoleObj.color : '#f8fafc',
                color: authTab === 'register' ? '#ffffff' : '#64748b',
                border: authTab === 'register' ? `1px solid ${currentRoleObj.color}` : '1px solid #e2e8f0',
                padding: '9px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              <UserPlus size={15} />
              <span>{lang === 'mr' ? 'नवीन नोंदणी' : 'New User Registration'}</span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: LOGIN FLOW (Strict 10-digit number & Real-Time OTP)     */}
          {/* ============================================================== */}
          {authTab === 'login' && (
            <div>
              {/* STEP 1: Method Selector & Input (Email or Mobile) */}
              {loginStep === 'phone' && (
                <form onSubmit={handleSendLoginOtp}>
                  {/* Auth Method Selector Toggle */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={() => { setAuthMethod('email'); setPhoneError(''); setEmailError(''); }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: authMethod === 'email' ? `2px solid ${currentRoleObj.color}` : '1px solid #cbd5e1',
                        background: authMethod === 'email' ? currentRoleObj.lightBg : '#ffffff',
                        color: authMethod === 'email' ? currentRoleObj.color : '#64748b',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <Mail size={16} color={authMethod === 'email' ? currentRoleObj.color : '#64748b'} />
                      <span>{lang === 'mr' ? 'ईमेल OTP (विनामूल्य व जलद)' : 'Email OTP (Instant • No Setup)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAuthMethod('phone'); setPhoneError(''); setEmailError(''); }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: authMethod === 'phone' ? `2px solid ${currentRoleObj.color}` : '1px solid #cbd5e1',
                        background: authMethod === 'phone' ? currentRoleObj.lightBg : '#ffffff',
                        color: authMethod === 'phone' ? currentRoleObj.color : '#64748b',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <Smartphone size={16} color={authMethod === 'phone' ? currentRoleObj.color : '#64748b'} />
                      <span>{lang === 'mr' ? 'मोबाईल SMS' : 'Mobile SMS'}</span>
                    </button>
                  </div>

                  {/* -------------------- METHOD A: EMAIL LOGIN -------------------- */}
                  {authMethod === 'email' && (
                    <div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                            {lang === 'mr' ? 'आपला ईमेल पत्ता टाका' : 'Enter Your Email Address'} *
                          </label>
                          <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                            ✓ Zero Telecom Delay
                          </span>
                        </div>

                        <div style={{ position: 'relative', display: 'flex' }}>
                          <span style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRight: 'none',
                            borderRadius: '10px 0 0 10px',
                            padding: '11px 12px',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <Mail size={16} />
                          </span>
                          <input
                            type="email"
                            required
                            placeholder="e.g. yourname@gmail.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError('');
                            }}
                            autoFocus
                            style={{
                              flex: 1,
                              padding: '11px 12px',
                              borderRadius: '0 10px 10px 0',
                              border: emailError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                              fontSize: '0.94rem',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>

                      {/* Email Error Alert */}
                      {emailError && (
                        <div style={{
                          background: '#fef2f2',
                          border: '1px solid #fca5a5',
                          borderRadius: '10px',
                          padding: '12px',
                          marginBottom: '16px',
                          fontSize: '0.82rem',
                          color: '#991b1b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <AlertCircle size={16} color="#dc2626" />
                          <span>{emailError}</span>
                        </div>
                      )}

                      {/* Quick Test Demo Emails */}
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        marginBottom: '18px',
                        border: '1px dashed #cbd5e1'
                      }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                          {lang === 'mr' ? 'किंवा चाचणीसाठी डेमो ईमेल निवडा:' : 'Quick Demo Accounts (Or type your OWN personal email):'}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('farmer');
                              setEmail('farmer.patil@agrilink.in');
                              setEmailError('');
                            }}
                            style={{
                              background: email === 'farmer.patil@agrilink.in' ? '#dcfce7' : '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#15803d',
                              fontWeight: 600
                            }}
                          >
                            👨‍🌾 farmer.patil@agrilink.in
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('buyer');
                              setEmail('buyer.deshmukh@agrilink.in');
                              setEmailError('');
                            }}
                            style={{
                              background: email === 'buyer.deshmukh@agrilink.in' ? '#e0f2fe' : '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#0369a1',
                              fontWeight: 600
                            }}
                          >
                            🏢 buyer.deshmukh@agrilink.in
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('transporter');
                              setEmail('transporter.shinde@agrilink.in');
                              setEmailError('');
                            }}
                            style={{
                              background: email === 'transporter.shinde@agrilink.in' ? '#fef3c7' : '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#b45309',
                              fontWeight: 600
                            }}
                          >
                            🚚 transporter.shinde@agrilink.in
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('cold_storage');
                              setEmail('operations@sahyadricoldchain.com');
                              setEmailError('');
                            }}
                            style={{
                              background: email === 'operations@sahyadricoldchain.com' ? '#cffafe' : '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#0891b2',
                              fontWeight: 600
                            }}
                          >
                            ❄️ operations@sahyadricoldchain.com
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('admin');
                              setEmail('vedantkchavan2006@gmail.com');
                              setEmailError('');
                            }}
                            style={{
                              background: email === 'vedantkchavan2006@gmail.com' ? '#fee2e2' : '#ffffff',
                              border: '1.5px solid #dc2626',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#991b1b',
                              fontWeight: 700
                            }}
                          >
                            👑 Admin (vedantkchavan2006@gmail.com)
                          </button>
                        </div>
                      </div>

                      {/* Email Submit Button */}
                      <button
                        type="submit"
                        disabled={!email.trim() || isSendingEmail}
                        style={{
                          width: '100%',
                          background: email.trim() ? currentRoleObj.color : '#94a3b8',
                          color: '#ffffff',
                          border: 'none',
                          padding: '13px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          cursor: email.trim() ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: email.trim() ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                          transition: 'all 0.15s'
                        }}
                      >
                        <Mail size={18} />
                        <span>{isSendingEmail ? 'Dispatching OTP...' : (lang === 'mr' ? 'ईमेलवर OTP पाठवा' : 'Send Verification Code to Email')}</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  )}

                  {/* -------------------- METHOD B: MOBILE SMS LOGIN -------------------- */}
                  {authMethod === 'phone' && (
                    <div>
                      {/* SMS Gateway Status Indicator */}
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        marginBottom: '14px',
                        background: fast2smsKey ? '#f0fdf4' : '#fffbeb',
                        border: fast2smsKey ? '1px solid #bbf7d0' : '1px solid #fde68a',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.76rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: fast2smsKey ? '#22c55e' : '#f59e0b',
                            boxShadow: fast2smsKey ? '0 0 6px #22c55e' : 'none',
                            display: 'inline-block'
                          }} />
                          <span style={{ fontWeight: 700, color: fast2smsKey ? '#15803d' : '#92400e' }}>
                            {fast2smsKey ? 'Fast2SMS Ready (Real Cellular SMS)' : 'Instant Simulation Mode (Zero Gateway Setup Needed)'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowKeyPrompt(!showKeyPrompt)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: fast2smsKey ? '#15803d' : '#b45309',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          {fast2smsKey ? 'Edit Key' : 'Configure Key'}
                        </button>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                            {lang === 'mr' ? 'आपला १० अंकी मोबाईल क्रमांक' : 'Enter 10-Digit Mobile Number'} *
                          </label>
                          <span style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: phone.length === 10 ? '#dcfce7' : '#fef3c7',
                            color: phone.length === 10 ? '#15803d' : '#b45309',
                            border: phone.length === 10 ? '1px solid #86efac' : '1px solid #fde68a'
                          }}>
                            {phone.length === 10 ? '✓ 10/10 Digits' : `${phone.length}/10 Digits`}
                          </span>
                        </div>

                        <div style={{ position: 'relative', display: 'flex' }}>
                          <span style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRight: 'none',
                            borderRadius: '10px 0 0 10px',
                            padding: '11px 12px',
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Phone size={15} color="#64748b" />
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="Enter your 10-digit mobile number"
                            value={phone}
                            onChange={handlePhoneInputChange}
                            autoFocus
                            style={{
                              flex: 1,
                              padding: '11px 12px',
                              borderRadius: '0 10px 10px 0',
                              border: phoneError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                              fontSize: '0.96rem',
                              outline: 'none',
                              boxSizing: 'border-box',
                              letterSpacing: '1px',
                              fontWeight: 600
                            }}
                          />
                        </div>
                      </div>

                      {/* Error Notification */}
                      {phoneError && (
                        <div style={{
                          background: '#fef2f2',
                          border: '1px solid #fca5a5',
                          borderRadius: '10px',
                          padding: '12px',
                          marginBottom: '16px',
                          fontSize: '0.82rem',
                          color: '#991b1b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <AlertCircle size={16} color="#dc2626" />
                          <span>{phoneError}</span>
                        </div>
                      )}

                      {/* Demo Quick Test Accounts */}
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        marginBottom: '18px',
                        border: '1px dashed #cbd5e1'
                      }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                          {lang === 'mr' ? 'किंवा चाचणीसाठी डेमो क्रमांक निवडा:' : 'Demo Test Accounts (Or type your OWN mobile number):'}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('farmer');
                              setPhone('9822014892');
                              setPhoneError('');
                            }}
                            style={{
                              background: phone === '9822014892' ? '#dcfce7' : '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#15803d',
                              fontWeight: 600
                            }}
                          >
                            👨‍🌾 Ramesh Patil (98220 14892)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('buyer');
                              setPhone('9890244100');
                              setPhoneError('');
                            }}
                            style={{
                              background: phone === '9890244100' ? '#e0f2fe' : '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#0369a1',
                              fontWeight: 600
                            }}
                          >
                            🏢 Amit Deshmukh (98902 44100)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('transporter');
                              setPhone('9422390812');
                              setPhoneError('');
                            }}
                            style={{
                              background: phone === '9422390812' ? '#fef3c7' : '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#b45309',
                              fontWeight: 600
                            }}
                          >
                            🚚 Tukaram Shinde (94223 90812)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('cold_storage');
                              setPhone('9765432190');
                              setPhoneError('');
                            }}
                            style={{
                              background: phone === '9765432190' ? '#cffafe' : '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#0891b2',
                              fontWeight: 600
                            }}
                          >
                            ❄️ Balasaheb Kadam (97654 32190)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole('admin');
                              setPhone('8482941628');
                              setPhoneError('');
                            }}
                            style={{
                              background: phone === '8482941628' ? '#fee2e2' : '#ffffff',
                              border: '1.5px solid #dc2626',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              color: '#991b1b',
                              fontWeight: 700
                            }}
                          >
                            👑 Admin Vedant Chavan (84829 41628)
                          </button>
                        </div>
                      </div>

                      {/* Key Setup Prompt when Fast2SMS is needed */}
                      {showKeyPrompt && (
                        <div style={{
                          background: '#fffbeb',
                          border: '1.5px solid #f59e0b',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '16px',
                          animation: 'fadeIn 0.2s ease'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#92400e', fontWeight: 800, fontSize: '0.9rem' }}>
                            <AlertCircle size={18} color="#d97706" />
                            <span>Optional: Fast2SMS Key for Real Handset Delivery</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: 1.5, marginBottom: '12px' }}>
                            You do not need this key to test! You can use the instant simulation mode, or switch to <strong>Email OTP</strong> above. If you want a real SMS sent to your phone, paste your Fast2SMS key below:
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                            <input
                              type="password"
                              placeholder="Paste Fast2SMS Authorization Key here"
                              value={fast2smsKey}
                              onChange={(e) => setFast2smsKeyState(e.target.value)}
                              style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'monospace' }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                handleSaveApiKey();
                                handleSendLoginOtp();
                              }}
                              style={{
                                background: '#15803d',
                                color: '#ffffff',
                                border: 'none',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Save Key
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={phone.length !== 10 || isSendingSms}
                        style={{
                          width: '100%',
                          background: phone.length === 10 ? currentRoleObj.color : '#94a3b8',
                          color: '#ffffff',
                          border: 'none',
                          padding: '13px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          cursor: phone.length === 10 ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: phone.length === 10 ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                          transition: 'all 0.15s'
                        }}
                      >
                        <Smartphone size={18} />
                        <span>{isSendingSms ? 'Sending SMS via Fast2SMS...' : (lang === 'mr' ? 'मोबाईलवर OTP पाठवा' : 'Send OTP via SMS to this Number')}</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* STEP 2: Real-Time OTP Verification Screen */}
              {loginStep === 'otp' && (
                <form onSubmit={handleVerifyLoginOtp}>
                  {/* Flow 1: Interactive Email Dispatch Preview Card */}
                  {authMethod === 'email' && (
                    <div style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: '#f8fafc',
                      borderRadius: '14px',
                      padding: '18px',
                      marginBottom: '20px',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.3)',
                      border: '1.5px solid #22c55e',
                      animation: 'fadeIn 0.2s ease-out'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: '#15803d',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Mail size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#f8fafc' }}>
                            {lang === 'mr' ? 'अधिकृत ईमेल पडताळणी कोड' : 'Official Verification Email Dispatched'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            To: <strong>{emailPreview?.to || email}</strong> • From: {emailPreview?.from || 'no-reply@agrilink.gov.in'}
                          </div>
                        </div>
                      </div>

                      {/* Email Content Box */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        marginBottom: '10px'
                      }}>
                        <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>
                          Subject: <strong>{emailPreview?.subject || 'Your AgriLink Login Verification Code'}</strong>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '10px' }}>
                          Use the 6-digit code below to enter your dashboard:
                        </div>

                        {/* OTP Display & 1-Click Auto Fill */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px',
                          background: 'rgba(0, 0, 0, 0.35)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(74, 222, 128, 0.3)'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase' }}>
                              Verification OTP Code
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '6px', color: '#4ade80' }}>
                              {realtimeOtp}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEnteredOtp(realtimeOtp);
                              setOtpError('');
                            }}
                            style={{
                              background: 'linear-gradient(135deg, #15803d, #16a34a)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 14px',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.4)'
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>1-Click Auto-fill OTP</span>
                          </button>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                        <span>Instant delivery • Zero spam delay • Valid for 10 minutes</span>
                      </div>
                    </div>
                  )}

                  {/* Flow 2: Mobile SMS Confirmation Card */}
                  {authMethod === 'phone' && (
                    <div style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: '#f8fafc',
                      borderRadius: '14px',
                      padding: '18px',
                      marginBottom: '20px',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.3)',
                      border: (gatewayStatus && gatewayStatus.sent) ? '1.5px solid #22c55e' : '1.5px solid #f59e0b',
                      animation: 'fadeIn 0.2s ease-out'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: (gatewayStatus && gatewayStatus.sent) ? '#16a34a' : '#0284c7',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#f8fafc' }}>
                            {gatewayStatus && gatewayStatus.sent 
                              ? (lang === 'mr' ? 'मोबाईलवर खरा SMS पाठवला आहे' : 'Cellular SMS Dispatched to Handset') 
                              : (lang === 'mr' ? 'झटपट SMS OTP पडताळणी' : 'Instant Verification Code Ready')}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Recipient: +91 {phone}
                          </div>
                        </div>
                      </div>

                      {/* Instant Simulated Badge */}
                      {(!gatewayStatus || !gatewayStatus.sent || isDemoMode) && (
                        <div style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          marginBottom: '10px'
                        }}>
                          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '6px' }}>
                            Instant OTP Code for +91 {phone}:
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '10px'
                          }}>
                            <div style={{
                              fontSize: '1.4rem',
                              fontWeight: 900,
                              letterSpacing: '5px',
                              color: '#4ade80'
                            }}>
                              {realtimeOtp}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEnteredOtp(realtimeOtp);
                                setOtpError('');
                              }}
                              style={{
                                background: 'linear-gradient(135deg, #15803d, #16a34a)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Click to Auto-fill Demo OTP
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Destination Info & Edit Link */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                      {authMethod === 'email' 
                        ? (lang === 'mr' ? 'OTP पाठवलेला ईमेल:' : 'OTP Sent to Email:') 
                        : (lang === 'mr' ? 'OTP पाठवलेला क्रमांक:' : 'OTP Sent to:')} <strong>{authMethod === 'email' ? email : `+91 ${phone}`}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep('phone');
                        setEnteredOtp('');
                        setOtpError('');
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: currentRoleObj.color,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Edit3 size={13} />
                      {authMethod === 'email' ? (lang === 'mr' ? 'ईमेल बदला' : 'Change Email') : (lang === 'mr' ? 'क्रमांक बदला' : 'Change Number')}
                    </button>
                  </div>

                  {/* OTP Input Field */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      {authMethod === 'email' 
                        ? (lang === 'mr' ? 'ईमेलवरील ६ अंकी OTP कोड टाका' : 'Enter 6-Digit Email Verification Code') 
                        : (lang === 'mr' ? 'मोबाईलवर आलेला ६ अंकी OTP टाका' : 'Enter 6-Digit Verification OTP from SMS')} *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                        <Lock size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="••••••"
                        value={enteredOtp}
                        onChange={(e) => {
                          setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                          setOtpError('');
                        }}
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 38px',
                          borderRadius: '10px',
                          border: otpError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                          fontSize: '1.2rem',
                          letterSpacing: '8px',
                          fontWeight: 800,
                          textAlign: 'left',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Error display */}
                  {otpError && (
                    <div style={{
                      background: '#fef2f2',
                      border: '1px solid #fca5a5',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginBottom: '16px',
                      fontSize: '0.82rem',
                      color: '#991b1b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <AlertCircle size={16} color="#dc2626" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  {/* Resend OTP Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.8rem' }}>
                    {countdown > 0 ? (
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        {lang === 'mr' ? `${countdown} सेकंदांत पुन्हा मागवा` : `Resend code in ${countdown}s`}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendLoginOtp}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: currentRoleObj.color,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0
                        }}
                      >
                        <RotateCw size={13} />
                        {authMethod === 'email' 
                          ? (lang === 'mr' ? 'नवीन ईमेल OTP पाठवा' : 'Resend Email OTP') 
                          : (lang === 'mr' ? 'नवीन SMS OTP पाठवा' : 'Resend SMS OTP')}
                      </button>
                    )}

                    <span style={{ color: '#64748b' }}>
                      {enteredOtp.length}/6 digits
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    onClick={handleVerifyLoginOtp}
                    disabled={enteredOtp.length !== 6}
                    style={{
                      width: '100%',
                      background: enteredOtp.length === 6 ? currentRoleObj.color : '#94a3b8',
                      color: '#ffffff',
                      border: 'none',
                      padding: '13px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: enteredOtp.length === 6 ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: enteredOtp.length === 6 ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>
                      {lang === 'mr' 
                        ? `OTP तपासा व ${currentRoleObj.title} पोर्टलमध्ये जा` 
                        : `Verify OTP & Enter ${currentRoleObj.title} Portal`}
                    </span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: NEW USER REGISTRATION (Own City Name & SMS to Phone)    */}
          {/* ============================================================== */}
          {authTab === 'register' && (
            <div>
              {/* STEP 1: Registration Details */}
              {regStep === 'form' && (
                <form onSubmit={handleSendRegOtp}>
                  {/* Registration Method Selector Toggle */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <button
                      type="button"
                      onClick={() => { setRegAuthMethod('email'); setRegError(''); setRegOtpError(''); }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: regAuthMethod === 'email' ? `2px solid ${currentRoleObj.color}` : '1px solid #cbd5e1',
                        background: regAuthMethod === 'email' ? currentRoleObj.lightBg : '#ffffff',
                        color: regAuthMethod === 'email' ? currentRoleObj.color : '#64748b',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Mail size={15} color={regAuthMethod === 'email' ? currentRoleObj.color : '#64748b'} />
                      <span>{lang === 'mr' ? 'ईमेलने नोंदणी करा' : 'Register with Email (Instant)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setRegAuthMethod('phone'); setRegError(''); setRegOtpError(''); }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: regAuthMethod === 'phone' ? `2px solid ${currentRoleObj.color}` : '1px solid #cbd5e1',
                        background: regAuthMethod === 'phone' ? currentRoleObj.lightBg : '#ffffff',
                        color: regAuthMethod === 'phone' ? currentRoleObj.color : '#64748b',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Smartphone size={15} color={regAuthMethod === 'phone' ? currentRoleObj.color : '#64748b'} />
                      <span>{lang === 'mr' ? 'मोबाईलने नोंदणी करा' : 'Register with Mobile'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        {lang === 'mr' ? 'पूर्ण नाव' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Patil"
                        value={regData.name}
                        onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Email vs Mobile Input Field */}
                    {regAuthMethod === 'email' ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                            {lang === 'mr' ? 'ईमेल पत्ता' : 'Email Address'} *
                          </label>
                          <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>
                            Instant OTP
                          </span>
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="e.g. yourname@gmail.com"
                          value={regData.email}
                          onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                            {lang === 'mr' ? 'मोबाईल क्रमांक' : 'Mobile Number'} *
                          </label>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: regData.phone.length === 10 ? '#15803d' : '#b45309'
                          }}>
                            {regData.phone.length}/10
                          </span>
                        </div>
                        <div style={{ position: 'relative', display: 'flex' }}>
                          <span style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRight: 'none',
                            borderRadius: '8px 0 0 8px',
                            padding: '8px 8px',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: '#475569'
                          }}>
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="10-digit number"
                            value={regData.phone}
                            onChange={handleRegPhoneChange}
                            style={{
                              flex: 1,
                              padding: '8px 10px',
                              borderRadius: '0 8px 8px 0',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.88rem',
                              fontWeight: 600,
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {selectedRole === 'farmer' ? (lang === 'mr' ? 'FPO / शेतकरी गट' : 'FPO / Farmer Group Name') :
                       selectedRole === 'buyer' ? (lang === 'mr' ? 'कंपनी / खरेदीदार संस्था' : 'Company / Enterprise Name') :
                       selectedRole === 'transporter' ? (lang === 'mr' ? 'वाहतूक कंपनी / फ्लीट' : 'Logistics / Fleet Company') :
                       selectedRole === 'cold_storage' ? (lang === 'mr' ? 'शीतगृह / वेअरहाऊस संस्था' : 'Cold Storage & Warehousing Co.') :
                       (lang === 'mr' ? 'प्रशासकीय विभाग / संस्था' : 'Department / Administrative Authority')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        selectedRole === 'farmer' ? 'e.g. Sahyadri Farmer Producer Co.' :
                        selectedRole === 'buyer' ? 'e.g. Sahyadri Agro Processing Ltd.' :
                        selectedRole === 'transporter' ? 'e.g. Kisan Express Logistics' :
                        selectedRole === 'cold_storage' ? 'e.g. Sahyadri Agro Cold Chain & Mega Warehousing' :
                        'e.g. Maharashtra State Agricultural Marketing Board (MSAMB)'
                      }
                      value={regData.organization}
                      onChange={(e) => setRegData({ ...regData, organization: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* User enters their OWN city name (Free Text Input) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        <MapPin size={13} color={currentRoleObj.color} />
                        <span>{lang === 'mr' ? 'आपले शहर / गाव / तालुका' : 'Your City / Town / District'} *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'mr' ? 'उदा. पुणे, बारामती, नाशिक, लातूर' : 'e.g. Pune, Baramati, Nashik, Latur, etc.'}
                        value={regData.city}
                        onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        {lang === 'mr' ? 'राज्य' : 'State'}
                      </label>
                      <input
                        type="text"
                        value={regData.state || 'Maharashtra'}
                        onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.88rem', color: '#1e293b' }}
                      />
                    </div>
                  </div>

                  {/* Duplicate Registration Error Alert */}
                  {regError && (
                    <div style={{
                      background: '#fef2f2',
                      border: '1px solid #fca5a5',
                      borderRadius: '10px',
                      padding: '12px',
                      marginBottom: '16px',
                      fontSize: '0.82rem',
                      color: '#991b1b',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={16} color="#dc2626" />
                        <span>{regError}</span>
                      </div>
                      {regError.includes('already registered') && (
                        <button
                          type="button"
                          onClick={() => {
                            if (regAuthMethod === 'email') {
                              setEmail(regData.email);
                              setAuthMethod('email');
                            } else {
                              setPhone(regData.phone);
                              setAuthMethod('phone');
                            }
                            handleSwitchTab('login');
                          }}
                          style={{
                            background: '#0369a1',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            alignSelf: 'flex-start'
                          }}
                        >
                          👉 {lang === 'mr' ? 'या खात्याने लॉगिन करा' : 'Switch to Sign In'}
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      (regAuthMethod === 'email' ? !regData.email.trim() : regData.phone.length !== 10) || 
                      isSendingEmail || 
                      isSendingSms
                    }
                    style={{
                      width: '100%',
                      background: (regAuthMethod === 'email' ? regData.email.trim() : regData.phone.length === 10) ? currentRoleObj.color : '#94a3b8',
                      color: '#ffffff',
                      border: 'none',
                      padding: '13px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: (regAuthMethod === 'email' ? regData.email.trim() : regData.phone.length === 10) ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
                    }}
                  >
                    {regAuthMethod === 'email' ? (
                      <>
                        <Mail size={18} />
                        <span>{isSendingEmail ? 'Dispatching OTP...' : (lang === 'mr' ? 'ईमेलवर OTP पाठवा' : 'Send Registration OTP to Email')}</span>
                      </>
                    ) : (
                      <>
                        <Smartphone size={18} />
                        <span>{isSendingSms ? 'Sending SMS...' : (lang === 'mr' ? 'मोबाईलवर OTP पाठवा' : 'Send Registration OTP via SMS')}</span>
                      </>
                    )}
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}

              {/* STEP 2: Registration OTP Verification */}
              {regStep === 'otp' && (
                <form onSubmit={handleVerifyRegOtp}>
                  {/* Flow 1: Registration Email Preview Card */}
                  {regAuthMethod === 'email' && (
                    <div style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: '#f8fafc',
                      borderRadius: '14px',
                      padding: '18px',
                      marginBottom: '20px',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.3)',
                      border: '1.5px solid #22c55e',
                      animation: 'fadeIn 0.2s ease-out'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: '#15803d',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Mail size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#f8fafc' }}>
                            {lang === 'mr' ? 'नोंदणी पडताळणी ईमेल पाठवला' : 'Registration Verification Email Sent'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            To: <strong>{emailPreview?.to || regData.email}</strong> • From: {emailPreview?.from || 'no-reply@agrilink.gov.in'}
                          </div>
                        </div>
                      </div>

                      {/* Email preview card */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        marginBottom: '10px'
                      }}>
                        <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>
                          Subject: <strong>{emailPreview?.subject || 'Your AgriLink Registration Code'}</strong>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '10px' }}>
                          Welcome to AgriLink! Use this 6-digit code to complete registration for <strong>{regData.name}</strong>:
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px',
                          background: 'rgba(0, 0, 0, 0.35)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(74, 222, 128, 0.3)'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase' }}>
                              Registration OTP Code
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '6px', color: '#4ade80' }}>
                              {regRealtimeOtp}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEnteredRegOtp(regRealtimeOtp);
                              setRegOtpError('');
                            }}
                            style={{
                              background: 'linear-gradient(135deg, #15803d, #16a34a)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 14px',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.4)'
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>1-Click Auto-fill OTP</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Flow 2: Registration Mobile SMS Card */}
                  {regAuthMethod === 'phone' && (
                    <div style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: '#f8fafc',
                      borderRadius: '14px',
                      padding: '18px',
                      marginBottom: '20px',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.3)',
                      border: (gatewayStatus && gatewayStatus.sent) ? '1.5px solid #22c55e' : '1.5px solid #f59e0b',
                      animation: 'fadeIn 0.2s ease-out'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: (gatewayStatus && gatewayStatus.sent) ? '#16a34a' : '#0284c7',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#f8fafc' }}>
                            {gatewayStatus && gatewayStatus.sent 
                              ? (lang === 'mr' ? 'नोंदणी SMS पाठवला आहे' : 'Registration SMS Dispatched to Handset') 
                              : (lang === 'mr' ? 'झटपट नोंदणी पडताळणी' : 'Instant Registration Code Ready')}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Recipient: +91 {regData.phone}
                          </div>
                        </div>
                      </div>

                      {/* Instant Simulated Code Badge */}
                      {(!gatewayStatus || !gatewayStatus.sent || isDemoMode) && (
                        <div style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          marginBottom: '10px'
                        }}>
                          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '6px' }}>
                            Instant OTP Code for +91 {regData.phone}:
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '10px'
                          }}>
                            <div style={{
                              fontSize: '1.4rem',
                              fontWeight: 900,
                              letterSpacing: '5px',
                              color: '#4ade80'
                            }}>
                              {regRealtimeOtp}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEnteredRegOtp(regRealtimeOtp);
                                setRegOtpError('');
                              }}
                              style={{
                                background: 'linear-gradient(135deg, #15803d, #16a34a)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Click to Auto-fill Demo OTP
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                        {regAuthMethod === 'email' 
                          ? (lang === 'mr' ? 'ईमेलवरील ६ अंकी OTP कोड टाका' : 'Enter 6-Digit Email Verification Code') 
                          : (lang === 'mr' ? 'नोंदणी OTP कोड टाका' : 'Enter 6-Digit Registration OTP from SMS')} *
                      </label>
                      <button
                        type="button"
                        onClick={() => setRegStep('form')}
                        style={{ background: 'transparent', border: 'none', color: currentRoleObj.color, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {lang === 'mr' ? 'माहिती बदला' : 'Edit Info'}
                      </button>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                        <Lock size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="••••••"
                        value={enteredRegOtp}
                        onChange={(e) => {
                          setEnteredRegOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                          setRegOtpError('');
                        }}
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 38px',
                          borderRadius: '10px',
                          border: regOtpError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                          fontSize: '1.2rem',
                          letterSpacing: '8px',
                          fontWeight: 800,
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {regOtpError && (
                    <div style={{
                      background: '#fef2f2',
                      border: '1px solid #fca5a5',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginBottom: '16px',
                      fontSize: '0.82rem',
                      color: '#991b1b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <AlertCircle size={16} color="#dc2626" />
                      <span>{regOtpError}</span>
                    </div>
                  )}

                  {/* Resend Timer for Registration */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.8rem' }}>
                    {regCountdown > 0 ? (
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        Resend code in {regCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendRegOtp}
                        style={{ background: 'transparent', border: 'none', color: currentRoleObj.color, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        <RotateCw size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        {regAuthMethod === 'email' ? 'Resend Email OTP' : 'Resend SMS OTP'}
                      </button>
                    )}
                    <span style={{ color: '#64748b' }}>{enteredRegOtp.length}/6 digits</span>
                  </div>

                  <button
                    type="submit"
                    onClick={handleVerifyRegOtp}
                    disabled={enteredRegOtp.length !== 6}
                    style={{
                      width: '100%',
                      background: enteredRegOtp.length === 6 ? currentRoleObj.color : '#94a3b8',
                      color: '#ffffff',
                      border: 'none',
                      padding: '13px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: enteredRegOtp.length === 6 ? 'pointer' : 'not-allowed',
                      boxShadow: enteredRegOtp.length === 6 ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
                    }}
                  >
                    {lang === 'mr' ? 'नोंदणी पूर्ण करा व डॅशबोर्ड उघडा' : `Confirm OTP & Enter ${currentRoleObj.title} Portal`}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 3. Fast2SMS Real Cellular SMS Gateway Configuration Toggle */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                style={{
                  background: fast2smsKey ? '#f0fdf4' : '#f8fafc',
                  border: fast2smsKey ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                  color: fast2smsKey ? '#15803d' : '#64748b',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Key size={13} color={fast2smsKey ? '#15803d' : '#64748b'} />
                <span>
                  {fast2smsKey 
                    ? '✓ Fast2SMS Live Gateway Connected' 
                    : '⚙️ Configure Fast2SMS API Key (For Live Cellular SMS)'}
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedRole('admin');
                  setPhone('9422100921');
                  setAuthTab('login');
                  setLoginStep('phone');
                  setPhoneError('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ShieldCheck size={13} color="#991b1b" />
                <span>Admin Quick Access</span>
              </button>
            </div>

            {/* Collapsible Fast2SMS Key Input */}
            {showKeyConfig && (
              <div style={{
                marginTop: '12px',
                padding: '14px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                animation: 'fadeIn 0.15s ease'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                  Fast2SMS API Authorization Key
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '8px' }}>
                  Get your free API key at <a href="https://www.fast2sms.com" target="_blank" rel="noreferrer" style={{ color: '#0369a1', fontWeight: 600 }}>fast2sms.com</a> (Dev API tab) to receive real SMS directly on your Indian mobile phone.
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    placeholder="Paste Fast2SMS API Key here"
                    value={fast2smsKey}
                    onChange={(e) => setFast2smsKeyState(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      fontFamily: 'monospace'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    style={{
                      background: '#15803d',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Save Key
                  </button>
                </div>

                {keySaveMsg && (
                  <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700, marginTop: '6px' }}>
                    {keySaveMsg}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RoleAuthModal = () => {
  const { isAuthModalOpen } = useApp();
  if (!isAuthModalOpen) return null;
  return <RoleAuthModalContent key="active-role-auth-modal" />;
};
