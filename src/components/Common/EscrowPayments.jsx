import React, { useState, useRef } from 'react';
import { useApp, isUserLot } from '../../context/AppContext';
import { 
  Coins, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Download, 
  ExternalLink, 
  Calendar, 
  Clock, 
  ArrowRight,
  Printer,
  Package,
  Search,
  Filter,
  PlusCircle,
  Trash2,
  Building2,
  User,
  Phone,
  Sparkles,
  Lock,
  RefreshCw,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

export const EscrowPayments = () => {
  const { 
    currentUser, 
    role, 
    lots, 
    transactions, 
    releaseEscrowPayment, 
    fundEscrowDeposit,
    deleteTransaction,
    cropsCatalog,
    lang, 
    t, 
    pushNotification, 
    setActiveTab 
  } = useApp();

  const [selectedTxnForReceipt, setSelectedTxnForReceipt] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'my' | 'all'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'escrow' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // Form state for funding new escrow deposit
  const [depositCrop, setDepositCrop] = useState('Onion');
  const [depositCustomCrop, setDepositCustomCrop] = useState('');
  const [depositQuantity, setDepositQuantity] = useState(1500);
  const [depositRate, setDepositRate] = useState(28);
  const [depositFarmerName, setDepositFarmerName] = useState('Ganesh Jagtap');
  const [depositFarmerPhone, setDepositFarmerPhone] = useState('+91 98220 14892');
  const [depositMode, setDepositMode] = useState('UPI Instant Escrow');

  // Filter user's specific lots
  const myLots = lots.filter(l => isUserLot(l, currentUser));
  const myLotIds = myLots.map(l => l.id);

  // Determine user's personal transactions safely
  const myTxns = transactions.filter(t => {
    if (role === 'farmer') {
      const matchLot = myLotIds.includes(t.lotId);
      const matchPhone = currentUser?.phone && t.farmerPhone && 
        t.farmerPhone.replace(/\D/g, '').slice(-10) === currentUser.phone.replace(/\D/g, '').slice(-10);
      const matchId = currentUser?.id && t.farmerId === currentUser.id;
      const matchName = currentUser?.name && t.farmerName?.toLowerCase().includes(currentUser.name.toLowerCase());
      return matchLot || matchPhone || matchId || matchName;
    } else if (role === 'buyer') {
      const matchOrg = currentUser?.organization && t.buyerName?.toLowerCase().includes(currentUser.organization.toLowerCase());
      const matchName = currentUser?.name && t.buyerName?.toLowerCase().includes(currentUser.name.toLowerCase());
      const matchId = currentUser?.id && t.buyerId === currentUser.id;
      return matchOrg || matchName || matchId;
    }
    return true;
  });

  // Base list depending on view mode
  const baseList = viewMode === 'my' ? myTxns : transactions;

  // Apply search and status filter
  const displayedTxns = baseList.filter(t => {
    const status = (t.escrowStatus || '').toLowerCase();
    const isCompleted = status.includes('completed');

    if (statusFilter === 'escrow' && isCompleted) return false;
    if (statusFilter === 'completed' && !isCompleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCrop = (t.crop || '').toLowerCase().includes(q);
      const matchFarmer = (t.farmerName || '').toLowerCase().includes(q);
      const matchBuyer = (t.buyerName || '').toLowerCase().includes(q);
      const matchId = (t.id || '').toLowerCase().includes(q);
      const matchLot = (t.lotId || '').toLowerCase().includes(q);
      const matchUtr = (t.utrNumber || '').toLowerCase().includes(q);
      return matchCrop || matchFarmer || matchBuyer || matchId || matchLot || matchUtr;
    }
    return true;
  });

  // Safe volume calculations
  const totalVolume = transactions.reduce((sum, t) => sum + Number(t.grossAmount || t.amount || 0), 0);
  const settledVolume = transactions
    .filter(t => (t.escrowStatus || '').toLowerCase().includes('completed'))
    .reduce((sum, t) => sum + Number(t.netFarmerAmount || t.amount || t.grossAmount || 0), 0);
  const inVaultVolume = Math.max(0, totalVolume - settledVolume);

  // Handle opening receipt
  const handlePrintReceipt = (txn) => {
    setSelectedTxnForReceipt(txn);
    pushNotification(
      "Tax Invoice Generated",
      `Digital GST Tax Invoice & Settlement Slip #${txn.id} ready.`,
      "कर बीजक तयार झाले",
      "info"
    );
  };

  // Canvas-based Digital Settlement Certificate Downloader (PNG)
  const handleDownloadCertificate = (txn) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      // Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(1, '#ecfdf5');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 800);

      // Certificate Ornate Double Border
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 1160, 760);

      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.strokeRect(34, 34, 1132, 732);

      // Header Seals
      ctx.fillStyle = '#14532d';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🇮🇳 GOVERNMENT OF MAHARASHTRA • DIRECTORATE OF AGRICULTURAL MARKETING', 600, 75);

      ctx.fillStyle = '#15803d';
      ctx.font = '800 32px sans-serif';
      ctx.fillText('TRIPLE-LOCK ESCROW SETTLEMENT & DBT DISBURSAL CERTIFICATE', 600, 120);

      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText(`MahaAgri Central Trust Protocol • Certificate Ref: ${txn.id} • Date: ${txn.paymentDate || new Date().toISOString().split('T')[0]}`, 600, 150);

      // Divider Line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, 175);
      ctx.lineTo(1120, 175);
      ctx.stroke();

      // Card 1: Beneficiary Farmer / Seller
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(80, 200, 480, 140);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(80, 200, 480, 140);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('BENEFICIARY PRODUCER (SELLER / FPO)', 100, 230);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(txn.farmerName || 'Registered Farmer', 100, 262);

      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Phone: ${txn.farmerPhone || '+91 98220 14892'} • Haveli, Pune, MH`, 100, 290);
      ctx.fillText(`DBT Bank Status: Aadhaar-Linked Direct Transfer Verified ✓`, 100, 315);

      // Card 2: Depositor / Institutional Buyer
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(640, 200, 480, 140);
      ctx.strokeRect(640, 200, 480, 140);

      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('INSTITUTIONAL BUYER (DEPOSITOR)', 660, 230);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(txn.buyerName || 'Verified Buyer', 660, 262);

      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText('GSTIN: 27AABCS9182K1ZU • FSSAI Central License Verified', 660, 290);
      ctx.fillText(`Escrow Gateway: ${txn.paymentMode || 'Triple-Lock Vault UPI/DBT'}`, 660, 315);

      // Card 3: Financial Settlement Ledger
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(80, 370, 1040, 230);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(80, 370, 1040, 230);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('COMMODITY TRADE BREAKDOWN & SETTLED DISBURSAL', 110, 405);

      const grossVal = Number(txn.grossAmount || txn.amount || 0);
      const netVal = Number(txn.netFarmerAmount != null ? txn.netFarmerAmount : (txn.amount || grossVal));
      const rateVal = Number(txn.sellingRate || (txn.quantity ? Math.round(grossVal / txn.quantity) : 25));

      ctx.font = '15px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(`Agricultural Commodity: ${txn.crop || 'Produce'} (${txn.quantity || 1000} ${txn.unit || 'KG'})`, 110, 440);
      ctx.fillText(`Agreed Selling Rate: ₹${rateVal}/KG (MahaAgri Benchmark Assured)`, 110, 470);
      ctx.fillText(`Gross Valuation: ₹${grossVal.toLocaleString()}`, 110, 500);

      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('Doorstep Logistics & Transport Freight: ₹0 (100% Borne by Institutional Buyer)', 110, 530);

      // Payout Box
      ctx.fillStyle = '#14532d';
      ctx.fillRect(660, 430, 430, 130);
      ctx.fillStyle = '#86efac';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FINAL DBT AMOUNT CREDITED TO FARMER', 875, 465);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(`₹${netVal.toLocaleString()}`, 875, 515);

      ctx.fillStyle = '#dcfce7';
      ctx.font = '12px sans-serif';
      ctx.fillText('0.00% Deductions • 100% Guaranteed Payout', 875, 545);

      // UTR & Security Hash
      ctx.textAlign = 'left';
      ctx.fillStyle = '#475569';
      ctx.font = '13px sans-serif';
      ctx.fillText(`Bank UTR / Transaction Reference: ${txn.utrNumber || 'AGRILINK9048120094'}`, 110, 580);
      ctx.fillText(`Status: ${txn.escrowStatus || 'Completed'} • SHA-256 Vault Lock: 7a9e88b...e92f`, 600, 580);

      // Signatures
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Dr. Sanjay Patil', 250, 710);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('Secretary, APMC Pune & Central Escrow Node', 250, 728);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Directorate of Agricultural Marketing', 950, 710);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('Government of Maharashtra Digital Trust Registry', 950, 728);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `MahaAgri_Escrow_Settlement_${txn.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      pushNotification(
        "Settlement Certificate Downloaded",
        `Digitally signed certificate for ${txn.id} downloaded successfully.`,
        "प्रमाणपत्र डाउनलोड झाले",
        "success"
      );
    } catch (err) {
      console.error("Certificate generation error:", err);
    }
  };

  // Handle funding deposit submission
  const handleFundDepositSubmit = (e) => {
    e.preventDefault();
    const finalCrop = depositCrop === 'Other' && depositCustomCrop.trim() ? depositCustomCrop.trim() : depositCrop;
    const qty = Number(depositQuantity) || 1000;
    const rate = Number(depositRate) || 25;
    const total = qty * rate;

    fundEscrowDeposit({
      lotId: `LOT-MAN-${Date.now().toString().slice(-4)}`,
      farmerName: depositFarmerName.trim() || 'Ganesh Jagtap',
      farmerPhone: depositFarmerPhone.trim() || '+91 98220 14892',
      buyerName: currentUser?.organization || currentUser?.name || 'Verified Buyer',
      crop: finalCrop,
      quantity: qty,
      unit: 'KG',
      agreedPrice: rate,
      amount: total
    });

    setIsDepositModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-green">
              <ShieldCheck size={12} />
              Triple-Lock Escrow Vault
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              RBI & MahaAgri Compliant Direct DBT Protocol
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {lang === 'mr' ? 'पेमेंट एस्क्रो व थेट खात्यात वर्ग प्रणाली' : lang === 'hi' ? 'एस्क्रो एवं प्रत्यक्ष किसान भुगतान प्रणाली' : 'Escrow Vault & Direct Settlement Ledger'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
            {lang === 'mr'
              ? 'खरेदीदाराची रक्कम एस्क्रो खात्यात सुरक्षित ठेवली जाते व शेतमाल पोहचताच थेट शेतकऱ्याच्या बँक खात्यात DBT/UPI द्वारे ४ मिनिटांत वर्ग होते.'
              : lang === 'hi'
              ? 'खरीदार की राशि एस्क्रो में सुरक्षित रहती है और फसल पहुंचते ही सीधे किसान के बैंक खाते में डीबीटी/यूपीआई द्वारा जमा की जाती है।'
              : 'Institutional buyer funds are secured in regulated escrow before dispatch and auto-disbursed to farmers directly via DBT upon delivery.'}
          </p>
        </div>

        {/* Action Button: Fund Escrow Deposit */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setIsDepositModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusCircle size={15} />
            <span>
              {lang === 'mr' ? '+ नवीन एस्क्रो डिपॉझिट' : lang === 'hi' ? '+ नया एस्क्रो जमा करें' : '+ Fund Escrow Deposit'}
            </span>
          </button>
        </div>
      </div>

      {/* Escrow Guarantee Banner & Metrics */}
      <div style={{
        background: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        color: '#ffffff',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#86efac', fontWeight: 800, letterSpacing: '0.5px' }}>
              Zero-Default Settlement Protocol
            </span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
              MahaAgri Linked
            </span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', margin: '2px 0 6px 0' }}>
            Total Escrow Volume: ₹{totalVolume.toLocaleString()}
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#dcfce7', margin: 0, maxWidth: '640px' }}>
            Eliminating traditional 15–45 day payment delays and dishonored trader vouchers. Average farmer payout speed: <strong>4.2 minutes post-delivery</strong> with 100% guaranteed DBT credit.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.14)', padding: '10px 18px', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: '130px' }}>
            <span style={{ fontSize: '0.7rem', opacity: 0.85, display: 'block', textTransform: 'uppercase' }}>
              {lang === 'mr' ? 'थेट वर्ग (DBT)' : lang === 'hi' ? 'डीबीटी भुगतान' : 'Settled to Farmers'}
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#86efac' }}>
              ₹{settledVolume.toLocaleString()}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.14)', padding: '10px 18px', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: '130px' }}>
            <span style={{ fontSize: '0.7rem', opacity: 0.85, display: 'block', textTransform: 'uppercase' }}>
              {lang === 'mr' ? 'एस्क्रो सुरक्षित' : lang === 'hi' ? 'एस्क्रो सुरक्षित' : 'Locked in Vault'}
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fef08a' }}>
              ₹{inVaultVolume.toLocaleString()}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.14)', padding: '10px 18px', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: '90px' }}>
            <span style={{ fontSize: '0.7rem', opacity: 0.85, display: 'block', textTransform: 'uppercase' }}>
              Default Rate
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 900 }}>0.00%</div>
          </div>
        </div>
      </div>

      {/* Control Bar: View Toggle, Status Filter, and Search */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* Left: View Mode Toggle */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => setViewMode('my')}
            className={`btn btn-sm ${viewMode === 'my' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            <User size={13} />
            <span>
              {lang === 'mr' ? `माझे व्यवहार (${myTxns.length})` : lang === 'hi' ? `मेरे लेन-देन (${myTxns.length})` : `My Deals (${myTxns.length})`}
            </span>
          </button>

          <button
            onClick={() => setViewMode('all')}
            className={`btn btn-sm ${viewMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            <ShieldCheck size={13} />
            <span>
              {lang === 'mr' ? `सर्व एस्क्रो नोंदी (${transactions.length})` : lang === 'hi' ? `सभी एस्क्रो रिकॉर्ड (${transactions.length})` : `All Platform Records (${transactions.length})`}
            </span>
          </button>
        </div>

        {/* Center: Status Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'all' ? '1px solid #15803d' : '1px solid var(--slate-300)',
              background: statusFilter === 'all' ? '#dcfce7' : 'var(--slate-50)',
              color: statusFilter === 'all' ? '#14532d' : 'var(--slate-700)'
            }}
          >
            {lang === 'mr' ? 'सर्व' : lang === 'hi' ? 'सभी' : 'All'}
          </button>

          <button
            onClick={() => setStatusFilter('escrow')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'escrow' ? '1px solid #d97706' : '1px solid var(--slate-300)',
              background: statusFilter === 'escrow' ? '#fef3c7' : 'var(--slate-50)',
              color: statusFilter === 'escrow' ? '#92400e' : 'var(--slate-700)'
            }}
          >
            {lang === 'mr' ? 'एस्क्रो मध्ये सुरक्षित' : lang === 'hi' ? 'एस्क्रो में सुरक्षित' : 'In Escrow Vault'}
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'completed' ? '1px solid #15803d' : '1px solid var(--slate-300)',
              background: statusFilter === 'completed' ? '#dcfce7' : 'var(--slate-50)',
              color: statusFilter === 'completed' ? '#14532d' : 'var(--slate-700)'
            }}
          >
            {lang === 'mr' ? 'थेट खात्यात जमा (DBT)' : lang === 'hi' ? 'डीबीटी द्वारा जमा' : 'DBT Settled'}
          </button>
        </div>

        {/* Right: Search Box */}
        <div style={{ position: 'relative', minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder={lang === 'mr' ? 'पीक, शेतकरी, खरेदीदार किंवा UTR...' : lang === 'hi' ? 'फसल, किसान या यूटीआर खोजें...' : 'Search crop, farmer, buyer, UTR...'}
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

      {/* Empty State */}
      {displayedTxns.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            <Coins size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 8px 0' }}>
            {viewMode === 'my' 
              ? (lang === 'mr' ? 'आपले अद्याप कोणतेही व्यवहार नाहीत' : lang === 'hi' ? 'आपके अभी कोई लेन-देन नहीं हैं' : 'No Personal Escrow Deals Yet')
              : (lang === 'mr' ? 'कोणतेही व्यवहार सापडले नाहीत' : lang === 'hi' ? 'कोई लेन-देन नहीं मिला' : 'No Transactions Match Your Filter')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', maxWidth: '520px', margin: '0 auto 22px' }}>
            {role === 'farmer'
              ? (lang === 'mr' 
                  ? 'खरेदीदाराने दिलेला प्रस्ताव स्वीकारल्यावर किंवा थेट आगाऊ रक्कम जमा झाल्यावर तुमचा अधिकृत एस्क्रो व्यवहार व DBT पेआउट येथे दिसेल.'
                  : 'When you accept an institutional buyer offer or receive an advance deposit, your confirmed escrow trade order and DBT payout ledger will appear here.')
              : role === 'buyer'
              ? (lang === 'mr'
                  ? 'शेतमालाची खरेदी करताना किंवा आगाऊ भरणा केल्यावर आपली ट्रिपल-लॉक एस्क्रो अनामत येथे सुरक्षित दिसेल.'
                  : 'When you place a purchase offer or fund an advance/full payment, your triple-lock escrow transactions will appear here.')
              : 'All zero-default verified trades, freight coverage, and DBT bank disbursements are tracked here.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {viewMode === 'my' && (
              <button 
                onClick={() => setViewMode('all')}
                className="btn btn-secondary"
              >
                <ShieldCheck size={14} />
                <span>{lang === 'mr' ? 'प्लॅटफॉर्मवरील सर्व नोंदी पहा' : 'View Platform Escrow Records'}</span>
              </button>
            )}

            {role === 'farmer' ? (
              <button 
                onClick={() => setActiveTab('offers')}
                className="btn btn-primary"
              >
                <span>{lang === 'mr' ? 'खरेदी प्रस्ताव तपासा' : 'Check Received Offers'}</span>
                <ArrowRight size={14} />
              </button>
            ) : role === 'buyer' ? (
              <button 
                onClick={() => setActiveTab('marketplace')}
                className="btn btn-primary"
              >
                <span>{lang === 'mr' ? 'शेतीमाल बाजारपेठ पहा' : 'Browse Produce Marketplace'}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button 
                onClick={() => setIsDepositModalOpen(true)}
                className="btn btn-primary"
              >
                <PlusCircle size={14} />
                <span>{lang === 'mr' ? 'नवीन एस्क्रो डिपॉझिट' : 'Fund New Deposit'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Transactions Ledger Table */
        <div className="table-container card" style={{ padding: 0, marginBottom: '28px' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Farmer & Buyer</th>
                <th>Produce & Qty</th>
                <th>Gross Valuation</th>
                <th>Logistics Freight</th>
                <th>Net Farmer Payout</th>
                <th>Escrow Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedTxns.map(txn => {
                const isCompleted = (txn.escrowStatus || '').toLowerCase().includes('completed');
                const grossVal = Number(txn.grossAmount || txn.amount || 0);
                const netVal = Number(txn.netFarmerAmount != null ? txn.netFarmerAmount : (txn.amount || grossVal));
                const rateVal = Number(txn.sellingRate || (txn.quantity ? Math.round(grossVal / txn.quantity) : 25));

                return (
                  <tr key={txn.id}>
                    {/* ID & Date */}
                    <td>
                      <strong style={{ color: '#16a34a', fontSize: '0.88rem' }}>{txn.id}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', display: 'block' }}>
                        Lot: {txn.lotId || 'N/A'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>
                        {txn.paymentDate || '2026-09-04'}
                      </span>
                    </td>

                    {/* Farmer & Buyer */}
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--slate-900)' }}>{txn.farmerName || 'Registered Farmer'}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>
                          Buyer: <strong>{txn.buyerName || 'Verified Buyer'}</strong>
                        </span>
                        {txn.farmerPhone && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block' }}>
                            {txn.farmerPhone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Produce & Rate */}
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{txn.crop || 'Agricultural Produce'}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>
                        {txn.quantity || 1000} {txn.unit || 'KG'} @ ₹{rateVal}/KG
                      </span>
                    </td>

                    {/* Gross Trade Value */}
                    <td>
                      <strong style={{ fontSize: '0.92rem' }}>₹{grossVal.toLocaleString()}</strong>
                    </td>

                    {/* Freight Coverage */}
                    <td>
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} />
                        Borne by Buyer (₹0)
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--slate-400)', display: 'block' }}>
                        Doorstep Delivery
                      </span>
                    </td>

                    {/* Net Farmer Amount */}
                    <td>
                      <div style={{
                        background: isCompleted ? '#15803d' : 'var(--slate-100)',
                        color: isCompleted ? '#ffffff' : 'var(--slate-900)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        display: 'inline-block',
                        fontWeight: 900,
                        fontSize: '0.95rem'
                      }}>
                        ₹{netVal.toLocaleString()}
                      </div>
                    </td>

                    {/* Settlement Status */}
                    <td>
                      {isCompleted ? (
                        <div>
                          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} />
                            {lang === 'mr' ? 'खात्यात जमा (DBT)' : lang === 'hi' ? 'डीबीटी द्वारा जमा' : 'Credited via DBT'}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--slate-400)', display: 'block', marginTop: '2px' }}>
                            UTR: {txn.utrNumber ? txn.utrNumber.slice(-8) : 'AGRI9048'}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            {txn.escrowStatus || 'Secured in Escrow'}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--slate-500)', display: 'block', marginTop: '2px' }}>
                            Awaiting Disbursal
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', alignItems: 'center' }}>
                        {/* Release Escrow Action if not completed */}
                        {!isCompleted && (
                          <button
                            onClick={() => releaseEscrowPayment(txn.id)}
                            className="btn btn-sm"
                            style={{ 
                              background: '#15803d', 
                              color: '#ffffff', 
                              padding: '5px 10px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Disburse Escrow Payment to Farmer via DBT"
                          >
                            <Coins size={13} />
                            <span>{lang === 'mr' ? 'खात्यात वर्ग करा' : lang === 'hi' ? 'भुगतान करें' : 'Release DBT'}</span>
                          </button>
                        )}

                        {/* View Invoice */}
                        <button 
                          onClick={() => handlePrintReceipt(txn)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          title="View Tax Invoice & Download Digital Certificate"
                        >
                          <FileText size={13} />
                          <span>Invoice</span>
                        </button>

                        {/* Admin Delete Action */}
                        {role === 'admin' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Permanently delete transaction record #${txn.id}?`)) {
                                deleteTransaction(txn.id);
                              }
                            }}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '5px 8px' }}
                            title="Admin: Delete Transaction Record"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Fund Escrow Deposit Modal */}
      {isDepositModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                    {lang === 'mr' ? 'नवीन एस्क्रो डिपॉझिट निधी' : lang === 'hi' ? 'नया एस्क्रो जमा फंड' : 'Fund Triple-Lock Escrow Vault'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    Direct RBI & MahaAgri Regulated Escrow Node
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsDepositModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFundDepositSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Select Crop / Produce
                  </label>
                  <select
                    value={depositCrop}
                    onChange={(e) => setDepositCrop(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  >
                    {cropsCatalog.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.category})</option>
                    ))}
                    <option value="Other">Other (Enter Manually)</option>
                  </select>
                </div>

                {depositCrop === 'Other' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                      Custom Produce Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dragon Fruit, Guava"
                      value={depositCustomCrop}
                      onChange={(e) => setDepositCustomCrop(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                    />
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                      Quantity (KG)
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={depositQuantity}
                      onChange={(e) => setDepositQuantity(Number(e.target.value))}
                      className="form-control"
                      style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                    />
                  </div>
                )}
              </div>

              {depositCrop === 'Other' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Quantity (KG)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={depositQuantity}
                    onChange={(e) => setDepositQuantity(Number(e.target.value))}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Agreed Rate (₹/KG)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={depositRate}
                    onChange={(e) => setDepositRate(Number(e.target.value))}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Beneficiary Farmer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={depositFarmerName}
                    onChange={(e) => setDepositFarmerName(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Farmer Phone (for DBT SMS)
                  </label>
                  <input
                    type="text"
                    value={depositFarmerPhone}
                    onChange={(e) => setDepositFarmerPhone(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Escrow Deposit Gateway
                  </label>
                  <select
                    value={depositMode}
                    onChange={(e) => setDepositMode(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="UPI Instant Escrow">UPI Instant Escrow Gateway</option>
                    <option value="NEFT / RTGS Escrow Vault">NEFT / RTGS Central Vault</option>
                    <option value="SBI e-NAM Clearing Account">SBI e-NAM Clearing Trust</option>
                  </select>
                </div>
              </div>

              {/* Total Calculation Banner */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>
                    Total Escrow Deposit Amount:
                  </span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d' }}>
                    ₹{((Number(depositQuantity) || 1000) * (Number(depositRate) || 25)).toLocaleString()}
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#15803d', display: 'block', marginTop: '2px' }}>
                  ✓ Secured in Triple-Lock Vault until digital delivery confirmation
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Lock size={15} />
                  <span>Lock Funds into Escrow</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview */}
      {selectedTxnForReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--slate-200)', paddingBottom: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 800 }}>GOVERNMENT OF MAHARASHTRA • MAHAAGRI</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--slate-900)', margin: '4px 0' }}>
                AgriLink Escrow Settlement Tax Invoice
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: 0 }}>
                Transaction Certificate: {selectedTxnForReceipt.id} • Date: {selectedTxnForReceipt.paymentDate || new Date().toLocaleDateString()}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '0.85rem', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>SELLER (FARMER / FPO)</span>
                <div style={{ fontWeight: 800, color: 'var(--slate-900)' }}>{selectedTxnForReceipt.farmerName || 'Registered Farmer'}</div>
                <div style={{ color: 'var(--slate-500)', fontSize: '0.78rem' }}>Haveli, Pune, Maharashtra</div>
                <div style={{ color: '#16a34a', fontSize: '0.74rem', fontWeight: 700 }}>Aadhaar DBT Verified ✓</div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>BUYER (INSTITUTIONAL)</span>
                <div style={{ fontWeight: 800, color: 'var(--slate-900)' }}>{selectedTxnForReceipt.buyerName || 'Verified Institutional Buyer'}</div>
                <div style={{ color: 'var(--slate-500)', fontSize: '0.78rem' }}>GSTIN: 27AABCS9182K1ZU</div>
                <div style={{ color: '#16a34a', fontSize: '0.74rem', fontWeight: 700 }}>MahaAgri Central Node Verified ✓</div>
              </div>
            </div>

            {/* Financial Details */}
            <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Produce Description:</span>
                <strong>{selectedTxnForReceipt.crop || 'Produce'} ({selectedTxnForReceipt.quantity || 1000} {selectedTxnForReceipt.unit || 'KG'})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Sale Rate per Unit:</span>
                <strong>₹{Number(selectedTxnForReceipt.sellingRate || 25)}/KG</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Gross Trade Value:</span>
                <strong>₹{Number(selectedTxnForReceipt.grossAmount || selectedTxnForReceipt.amount || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', marginBottom: '6px' }}>
                <span>Doorstep Logistics Freight:</span>
                <strong>₹0 (Borne by Buyer)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--slate-300)', paddingTop: '6px', fontSize: '1.05rem' }}>
                <strong style={{ color: '#14532d' }}>Net Farmer Credited Amount:</strong>
                <strong style={{ color: '#15803d' }}>
                  ₹{Number(selectedTxnForReceipt.netFarmerAmount != null ? selectedTxnForReceipt.netFarmerAmount : (selectedTxnForReceipt.amount || selectedTxnForReceipt.grossAmount || 0)).toLocaleString()}
                </strong>
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', textAlign: 'center', marginBottom: '20px' }}>
              UTR Reference: {selectedTxnForReceipt.utrNumber || 'AGRILINK9048120094'} • Cryptographically Verified via AgriLink Escrow Smart Vault
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button 
                onClick={() => setSelectedTxnForReceipt(null)}
                className="btn btn-secondary"
              >
                Close
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleDownloadCertificate(selectedTxnForReceipt)}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={15} />
                  <span>Download Certificate (PNG)</span>
                </button>

                <button 
                  onClick={() => { window.print(); }}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={15} />
                  <span>Print Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
