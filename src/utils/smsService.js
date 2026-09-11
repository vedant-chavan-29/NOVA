// Fast2SMS Real-Time SMS Gateway Service for AgriSetu
// Allows sending real cellular OTP SMS directly to Indian mobile numbers

export const getFast2SMSApiKey = () => {
  try {
    return localStorage.getItem('agrisetu_fast2sms_key') || import.meta.env.VITE_FAST2SMS_KEY || '';
  } catch {
    return '';
  }
};

export const setFast2SMSApiKey = (key) => {
  try {
    if (key && key.trim()) {
      localStorage.setItem('agrisetu_fast2sms_key', key.trim());
    } else {
      localStorage.removeItem('agrisetu_fast2sms_key');
    }
  } catch {}
};

/**
 * Sends a real SMS with OTP to an Indian 10-digit mobile number via Fast2SMS
 * @param {string} phone 10-digit mobile number
 * @param {string} otpCode 6-digit OTP code
 * @returns {Promise<{sent: boolean, provider?: string, message: string, reason?: string, requestId?: string}>}
 */
export const sendRealSmsOtp = async (phone, otpCode) => {
  const apiKey = getFast2SMSApiKey();
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  if (!apiKey) {
    return {
      sent: false,
      reason: 'NO_API_KEY',
      message: 'Fast2SMS API key not set. Enter your key to receive real cellular SMS on your phone.'
    };
  }

  try {
    // 1. Primary attempt: Fast2SMS GET request through local Vite proxy
    const getUrl = `/api/fast2sms/dev/bulkV2?authorization=${encodeURIComponent(apiKey)}&variables_values=${encodeURIComponent(otpCode)}&route=otp&numbers=${encodeURIComponent(cleanPhone)}`;
    
    let data = null;
    try {
      const getRes = await fetch(getUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      data = await getRes.json();
    } catch {
      data = null;
    }

    // 2. Secondary attempt: POST with JSON body through proxy
    if (!data || data.return !== true) {
      try {
        const postRes = await fetch('/api/fast2sms/dev/bulkV2', {
          method: 'POST',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            variables_values: otpCode,
            route: 'otp',
            numbers: cleanPhone
          })
        });
        const postData = await postRes.json();
        if (postData) data = postData;
      } catch {}
    }

    if (data && data.return === true) {
      return {
        sent: true,
        provider: 'Fast2SMS',
        requestId: data.request_id,
        message: `Real cellular SMS delivered to +91 ${cleanPhone} via Fast2SMS!`
      };
    } else {
      const rawMsg = data?.message;
      const errMsg = Array.isArray(rawMsg) ? rawMsg[0] : (rawMsg || 'Fast2SMS gateway returned an error.');
      return {
        sent: false,
        reason: 'GATEWAY_ERROR',
        message: errMsg
      };
    }
  } catch (err) {
    return {
      sent: false,
      reason: 'NETWORK_ERROR',
      message: err.message || 'Network error connecting to Fast2SMS gateway.'
    };
  }
};
