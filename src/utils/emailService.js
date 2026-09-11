// Email OTP Service for AgriSetu Authentication
// Supports instant on-screen verification preview and optional client-side email delivery (EmailJS / webhook)

export const getEmailConfig = () => {
  try {
    return {
      serviceId: localStorage.getItem('agrisetu_email_service_id') || import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
      templateId: localStorage.getItem('agrisetu_email_template_id') || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
      publicKey: localStorage.getItem('agrisetu_email_public_key') || import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
    };
  } catch {
    return { serviceId: '', templateId: '', publicKey: '' };
  }
};

export const setEmailConfig = (config) => {
  try {
    if (config.serviceId) localStorage.setItem('agrisetu_email_service_id', config.serviceId.trim());
    if (config.templateId) localStorage.setItem('agrisetu_email_template_id', config.templateId.trim());
    if (config.publicKey) localStorage.setItem('agrisetu_email_public_key', config.publicKey.trim());
  } catch {}
};

/**
 * Dispatches an OTP to the given email address.
 * Generates an instant simulation preview and optionally triggers EmailJS if configured.
 * @param {string} email Target email address
 * @param {string} otpCode 6-digit OTP code
 * @param {string} role Target stakeholder role (farmer, buyer, transporter, admin)
 * @returns {Promise<{sent: boolean, isRealEmail: boolean, message: string, preview: object}>}
 */
export const sendEmailOtp = async (email, otpCode, role = 'farmer') => {
  const cleanEmail = (email || '').trim().toLowerCase();
  
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return {
      sent: false,
      isRealEmail: false,
      message: 'Please enter a valid email address (e.g. yourname@gmail.com)'
    };
  }

  const { serviceId, templateId, publicKey } = getEmailConfig();
  const hasEmailJs = serviceId && templateId && publicKey;

  // Prepare standard rich preview object
  const preview = {
    from: 'AgriLink Verification <no-reply@agrilink.gov.in>',
    to: cleanEmail,
    subject: `Your AgriLink Login Verification Code: [ ${otpCode} ]`,
    sentAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    otp: otpCode,
    role
  };

  // If EmailJS credentials are provided, attempt real inbox dispatch
  if (hasEmailJs && typeof window !== 'undefined') {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: cleanEmail,
            otp_code: otpCode,
            platform_name: 'AgriLink (कृषीलिंक)',
            role_name: role.toUpperCase()
          }
        })
      });

      if (res.ok) {
        return {
          sent: true,
          isRealEmail: true,
          message: `Official OTP email dispatched to ${cleanEmail}!`,
          preview
        };
      }
    } catch {}
  }

  // Instant zero-friction mode: Always succeeds immediately with rich preview card
  return {
    sent: true,
    isRealEmail: false,
    message: `Verification code generated for ${cleanEmail}!`,
    preview
  };
};
