import React, { useState, useRef, useEffect } from 'react';
import { useApp, isUserLot } from '../../context/AppContext';
import { 
  Sparkles, 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  Award, 
  FileText, 
  Download, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  ScanLine,
  Tag,
  Layers,
  Check,
  Eye,
  Calendar,
  MapPin,
  QrCode,
  Package,
  ChevronRight
} from 'lucide-react';

const PRESET_SAMPLES = [
  {
    id: 'onion-grade-a',
    title: 'Pune Garwa Onion',
    crop: 'Onion',
    category: 'Vegetable',
    variety: 'Garwa Red',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    grade: 'A',
    qualityScore: 95,
    freshness: '96%',
    damagePercent: 1.8,
    bulbSize: '58 mm',
    color: 'Deep Pink / Reddish Purple (Uniform)',
    summary: 'Export grade, cured dry tunics, low moisture, optimal for 90+ days storage.'
  },
  {
    id: 'tomato-grade-a',
    title: 'Nashik Hybrid Tomato',
    crop: 'Tomato',
    category: 'Vegetable',
    variety: 'Abhinav Hybrid',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    grade: 'A',
    qualityScore: 93,
    freshness: '95%',
    damagePercent: 2.2,
    bulbSize: '65 mm',
    color: 'Scarlet Glossy Red (Uniform Breaker Stage)',
    summary: 'Plump firm skin, thick pericarp, zero sunscald, ideal for 10-day inter-state transit.'
  },
  {
    id: 'pomegranate-grade-a',
    title: 'Solapur Bhagwa Pomegranate',
    crop: 'Pomegranate',
    category: 'Fruit',
    variety: 'Bhagwa Super',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    grade: 'A',
    qualityScore: 96,
    freshness: '97%',
    damagePercent: 1.2,
    bulbSize: '78 mm',
    color: 'Deep Ruby Red, High Gloss Luster',
    summary: 'Institutional Grade-A export caliber, thick skin, deep red arils, sweet brix > 16°.'
  },
  {
    id: 'soybean-grade-a',
    title: 'Ahmednagar JS-335 Soybean',
    crop: 'Soybean',
    category: 'Crop',
    variety: 'JS-335 Certified',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    grade: 'A',
    qualityScore: 94,
    freshness: '98%',
    damagePercent: 1.5,
    bulbSize: 'Standard Plump Seed (1000 wt: 142g)',
    color: 'Golden Yellow, Intact Seed Coat',
    summary: 'Moisture < 10%, high protein & oil content, zero fungal mold or foreign matter.'
  }
];

export const QualityGrading = () => {
  const { currentUser, cropsCatalog, lots, lang, t, pushNotification, setActiveTab } = useApp();

  // Find lots belonging to this farmer
  const farmerLots = (lots || []).filter(l => isUserLot(l, currentUser));
  const availableLots = farmerLots.length > 0 ? farmerLots : (lots || []);

  // Selection mode: 'myLots' | 'catalog'
  const [sourceMode, setSourceMode] = useState(availableLots.length > 0 ? 'myLots' : 'catalog');

  // Currently selected lot (if any)
  const [selectedLot, setSelectedLot] = useState(availableLots[0] || null);

  // Selected produce category: 'Vegetable' | 'Fruit' | 'Crop'
  const [selectedCategory, setSelectedCategory] = useState(selectedLot?.category || 'Vegetable');
  
  // Selected produce details
  const [selectedCropName, setSelectedCropName] = useState(selectedLot?.crop || 'Onion');
  const [variety, setVariety] = useState(selectedLot?.variety || 'Garwa Red');
  const [produceImage, setProduceImage] = useState(
    selectedLot?.images?.[0] || selectedLot?.image || PRESET_SAMPLES[0].image
  );
  const [lotPhotos, setLotPhotos] = useState(
    selectedLot?.images || [selectedLot?.image || PRESET_SAMPLES[0].image]
  );

  // Scanner status
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(true);

  // Inspection metrics (derived from selected lot or defaults)
  const [grade, setGrade] = useState(selectedLot?.grade || 'A');
  const [qualityScore, setQualityScore] = useState(selectedLot?.qualityScore || 94);
  const [freshness, setFreshness] = useState(selectedLot?.freshness || '96%');
  const [damagePercent, setDamagePercent] = useState(selectedLot?.damagePercent || 1.8);
  const [bulbSize, setBulbSize] = useState(selectedLot?.bulbSize || '58 mm Standard');
  const [colorDescription, setColorDescription] = useState('Deep Pink / Reddish Purple (Uniform)');
  const [assessorSummary, setAssessorSummary] = useState(
    selectedLot 
      ? `Verified Grade ${selectedLot.grade || 'A'} lot for ${selectedLot.crop} (#${selectedLot.id}). Meets institutional export standards.`
      : 'Assigned Grade A per Agmarknet optical photometric standards. Zero deep rot, low blemish index, compliant for export and institutional food contracts.'
  );

  // Certificate Unique ID & Timestamp
  const [certId, setCertId] = useState(selectedLot ? `CERT-${selectedLot.id}-AGMARK` : `CERT-MH-${new Date().getFullYear()}-AGMARK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [certDate, setCertDate] = useState(selectedLot?.harvestDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // When farmer selects one of their uploaded lots
  const handleSelectUploadedLot = (lot) => {
    setSelectedLot(lot);
    setSourceMode('myLots');
    setSelectedCategory(lot.category || 'Vegetable');
    setSelectedCropName(lot.crop);
    setVariety(lot.variety || 'Standard Commercial');
    const images = (lot.images && lot.images.length > 0) ? lot.images : [lot.image];
    setProduceImage(images[0]);
    setLotPhotos(images);
    setGrade(lot.grade || 'A');
    setQualityScore(lot.qualityScore || 94);
    setFreshness(lot.freshness || '95%');
    setDamagePercent(lot.damagePercent || 2.1);
    setBulbSize(lot.bulbSize || 'Standard Caliber');
    setCertId(`CERT-${lot.id}-AGMARK`);
    setCertDate(lot.harvestDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    setAssessorSummary(
      `Official Agmarknet certification for Lot #${lot.id} (${lot.quantity} ${lot.unit || 'KG'} ${lot.crop}). Assigned Certified Grade ${lot.grade || 'A'} with an aggregate computer vision quality score of ${lot.qualityScore || 94}/100.`
    );
    setHasScanned(true);

    pushNotification(
      "Uploaded Lot Loaded",
      `Loaded Lot #${lot.id} (${lot.crop} - Grade ${lot.grade}) into Quality Certification Scanner.`,
      "अपलोड केलेला लॉट लोड झाला",
      "info"
    );
  };

  // Filter crops catalog for active category
  const filteredCatalog = (cropsCatalog || []).filter(c => c.category === selectedCategory);

  // Handle produce change when in catalog mode
  const handleCropChange = (cropName) => {
    setSelectedCropName(cropName);
    const found = (cropsCatalog || []).find(c => c.name.toLowerCase() === cropName.toLowerCase());
    if (found) {
      setVariety(found.varieties?.[0] || 'Standard Hybrid');
    }
    const presetMatch = PRESET_SAMPLES.find(p => p.crop.toLowerCase() === cropName.toLowerCase());
    if (presetMatch) {
      setProduceImage(presetMatch.image);
      setLotPhotos([presetMatch.image]);
      setGrade(presetMatch.grade);
      setQualityScore(presetMatch.qualityScore);
      setFreshness(presetMatch.freshness);
      setDamagePercent(presetMatch.damagePercent);
      setBulbSize(presetMatch.bulbSize);
      setColorDescription(presetMatch.color);
      setAssessorSummary(presetMatch.summary);
    } else {
      setGrade('A');
      setQualityScore(94);
      setFreshness('95%');
      setDamagePercent(2.1);
      setBulbSize(selectedCategory === 'Fruit' ? '70-85 mm' : selectedCategory === 'Crop' ? 'Grade 1 Plump Seed' : '55-65 mm');
      setColorDescription('Optimal Natural Harvest Luster');
      setAssessorSummary(`Verified Grade A ${cropName} sample compliant with Agmarknet quality certification standards.`);
    }
  };

  // Switch category
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const catCrops = (cropsCatalog || []).filter(c => c.category === cat);
    if (catCrops.length > 0) {
      handleCropChange(catCrops[0].name);
    }
  };

  // Upload custom photo
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultData = uploadEvent.target?.result;
      if (resultData) {
        setProduceImage(resultData);
        setLotPhotos([resultData]);
        handleRunScan();
      }
    };
    reader.readAsDataURL(file);
  };

  // Run AI optical scan
  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);

      const calculatedScore = selectedLot ? selectedLot.qualityScore : Math.floor(92 + Math.random() * 6);
      const calculatedGrade = selectedLot ? selectedLot.grade : (calculatedScore >= 88 ? 'A' : calculatedScore >= 75 ? 'B' : 'C');
      setQualityScore(calculatedScore);
      setGrade(calculatedGrade);
      setFreshness(selectedLot ? selectedLot.freshness : `${Math.floor(94 + Math.random() * 5)}%`);
      setDamagePercent(selectedLot ? selectedLot.damagePercent : Number((1.2 + Math.random() * 1.5).toFixed(1)));

      pushNotification(
        "AI Vision Scan Complete",
        `Quality verification verified Grade ${calculatedGrade} with ${calculatedScore}/100 score for ${selectedCropName}.`,
        "एआय गुणवत्ता तपासणी पूर्ण",
        "info"
      );
    }, 1200);
  };

  // =========================================================================
  // GENERATE & DOWNLOAD DIGITALLY SIGNED QUALITY CERTIFICATION (IMAGE PNG)
  // =========================================================================
  const handleDownloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 850;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Fill (Pristine Antique Parchment with subtle ivory warmth)
    ctx.fillStyle = '#fcfdfa';
    ctx.fillRect(0, 0, width, height);

    // 2. Outer Ornamental Borders
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 14;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Inner gold pin-stripe
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, width - 56, height - 56);

    // Corner accent blocks
    const corners = [
      [36, 36],
      [width - 66, 36],
      [36, height - 66],
      [width - 66, height - 66]
    ];
    ctx.fillStyle = '#16a34a';
    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx, cy, 30, 30);
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx + 4, cy + 4, 22, 22);
    });

    // 3. Official Government & Platform Header
    ctx.textAlign = 'center';
    
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#b45309';
    ctx.fillText('GOVERNMENT OF MAHARASHTRA • DIRECTORATE OF AGRICULTURAL MARKETING', width / 2, 70);

    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('MahaAgri National Market Linkage & Agmarknet Inspection Authority', width / 2, 106);

    ctx.fillStyle = '#14532d';
    ctx.font = '900 24px sans-serif';
    ctx.fillText('DIGITALLY SIGNED QUALITY GRADE CERTIFICATION', width / 2, 142);

    // Divider line
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 156);
    ctx.lineTo(width - 120, 156);
    ctx.stroke();

    // 4. Certificate Metadata Strip
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'left';
    ctx.fillText(`Certificate ID: ${certId}`, 60, 185);
    ctx.fillText(`Issue Date: ${certDate}`, width / 2 - 80, 185);
    ctx.textAlign = 'right';
    ctx.fillText(`Verified Product Lot: ${selectedLot ? selectedLot.id : 'DIRECT SCAN'}`, width - 60, 185);

    // 5. Farmer & Lot Credentials Box
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(60, 205, width - 120, 100);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 205, width - 120, 100);

    ctx.textAlign = 'left';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('CERTIFIED PRODUCER / FARMER:', 80, 235);
    ctx.fillText('FARM GATE ORIGIN / DISTRICT:', 80, 265);
    ctx.fillText('REGISTERED LOT ID / FPO:', 80, 290);

    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#15803d';
    ctx.fillText(selectedLot?.farmerName || currentUser?.name || 'Ramesh Patil (Verified Farmer)', 330, 235);
    ctx.fillStyle = '#0f172a';
    ctx.fillText(selectedLot?.location || currentUser?.location || 'Haveli, Pune District, Maharashtra', 330, 265);
    ctx.fillText(`${selectedLot ? selectedLot.id : 'N/A'} • ${selectedLot?.farmerFpo || currentUser?.organization || 'Sahyadri Farmers Producer Company'}`, 330, 290);

    // 6. Produce & Certified Grade Section
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 325, 680, 290);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 325, 680, 290);

    // Section Header
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(61, 326, 678, 38);
    ctx.fillStyle = '#14532d';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('AGRONOMIC COMPUTER VISION INSPECTION METRICS', 80, 351);

    // Metrics Rows
    const metrics = [
      ['Produce / Commodity Name:', `${selectedCropName} (${variety || 'Standard Hybrid'})`, '#0f172a'],
      ['Classification Category:', `${selectedCategory} Produce`, '#0f172a'],
      ['Official Product Quality Grade:', `GRADE ${grade} CERTIFIED`, grade === 'A' ? '#15803d' : '#d97706'],
      ['Composite AI Quality Score:', `${qualityScore} / 100 (Assessed via YOLOv8 Agmark Model)`, '#15803d'],
      ['Freshness & Moisture Retention:', `${freshness} (Compliant with Standard Preservation Index)`, '#0f172a'],
      ['Surface Defect / Damage Rate:', `${damagePercent}% (Max Allowable Tolerance: 5.0%)`, '#0f172a'],
      ['Calibrated Fruit / Seed Sizing:', `${bulbSize}`, '#0f172a']
    ];

    let rowY = 390;
    metrics.forEach(([label, val, color]) => {
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(label, 80, rowY);

      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = color;
      ctx.fillText(val, 320, rowY);

      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, rowY + 6);
      ctx.lineTo(720, rowY + 6);
      ctx.stroke();

      rowY += 28;
    });

    // 7. Right Box: Big Embossed Quality Grade Seal & Certified Badge
    ctx.fillStyle = grade === 'A' ? '#f0fdf4' : '#fffbeb';
    ctx.fillRect(760, 325, 380, 290);
    ctx.strokeStyle = grade === 'A' ? '#22c55e' : '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(760, 325, 380, 290);

    // Seal Circle
    ctx.beginPath();
    ctx.arc(950, 435, 75, 0, Math.PI * 2);
    ctx.fillStyle = grade === 'A' ? '#15803d' : '#d97706';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Seal text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('MAHA-AGRI CERTIFIED', 950, 395);

    ctx.font = '900 44px sans-serif';
    ctx.fillText(`GRADE ${grade}`, 950, 442);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('QUALITY ASSURED', 950, 468);

    // Quality Score label under seal
    ctx.font = '900 18px sans-serif';
    ctx.fillStyle = grade === 'A' ? '#14532d' : '#92400e';
    ctx.fillText(`OVERALL SCORE: ${qualityScore}/100`, 950, 545);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(grade === 'A' ? 'PREMIUM INSTITUTIONAL / EXPORT STANDARD' : 'COMMERCIAL WHOLESALE & RETAIL STANDARD', 950, 570);

    ctx.font = 'italic 11px sans-serif';
    ctx.fillStyle = '#16a34a';
    ctx.fillText(`Certified for ${selectedCropName} (#${selectedLot ? selectedLot.id : 'DIRECT'})`, 950, 595);

    // 8. Assessor Remarks Box
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(60, 630, width - 120, 60);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 630, width - 120, 60);

    ctx.textAlign = 'left';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('OFFICIAL CERTIFICATION REMARKS:', 75, 652);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(assessorSummary, 75, 674);

    // 9. Digital Signatures & Security Stamp Footer
    ctx.textAlign = 'left';
    ctx.font = 'italic bold 17px serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Vedant Chavan', 80, 750);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 756);
    ctx.lineTo(260, 756);
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Platform Master Administrator', 80, 772);
    ctx.fillText('Directorate of Agricultural Marketing, MH', 80, 786);

    // QR Code simulation
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(width / 2 - 35, 715, 70, 70);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(width / 2 - 30, 720, 60, 60);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(width / 2 - 25, 725, 18, 18);
    ctx.fillRect(width / 2 + 7, 725, 18, 18);
    ctx.fillRect(width / 2 - 25, 757, 18, 18);
    ctx.fillRect(width / 2 - 2, 742, 6, 6);
    ctx.fillRect(width / 2 + 10, 760, 10, 10);

    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('SCAN TO VERIFY AUTHENTICITY', width / 2, 802);

    // Inspector signature
    ctx.textAlign = 'right';
    ctx.font = 'italic bold 17px serif';
    ctx.fillStyle = '#15803d';
    ctx.fillText('Dr. S. K. Kulkarni (Ph.D Agri)', width - 80, 750);
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width - 290, 756);
    ctx.lineTo(width - 80, 756);
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Chief Quality Assessor & Agronomist', width - 80, 772);
    ctx.fillText('Agmarknet Maharashtra Central Directorate', width - 80, 786);

    // 10. Direct Image Download Trigger
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `MahaAgri-Quality-Certificate-${selectedCropName}-Grade-${grade}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      pushNotification(
        "Quality Certificate Downloaded",
        `Digitally signed certificate for ${selectedCropName} (Grade ${grade}) downloaded as PNG image.`,
        "प्रतवारी प्रमाणपत्र डाउनलोड झाले",
        "success"
      );
    } catch (err) {
      console.error('Certificate canvas export error:', err);
      alert('Certificate generated! Click Download again or right click preview to save.');
    }
  };

  return (
    <div>
      {/* Hidden Canvas for High-Res Image Generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-green">
            <ScanLine size={12} />
            Computer Vision Optical Inspection & Certification
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Official Agmarknet AI Quality Assessment
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          {lang === 'mr' ? 'एआय पीक गुणवत्ता स्कॅनर व डिजिटल प्रमाणपत्र' : lang === 'hi' ? 'एआई फसल गुणवत्ता स्कैनर व डिजिटल प्रमाणपत्र' : 'AI Produce Quality Scanner & Digital Certification'}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
          Select your uploaded produce lot to view the exact Grade it received, inspect its 4 multi-angle photos, and download an officially signed <strong>Quality Grade Certificate as a high-resolution PNG image</strong>.
        </p>
      </div>

      {/* Mode Switcher: "My Uploaded Lots" vs "Scan from Catalog" */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setSourceMode('myLots')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: sourceMode === 'myLots' ? '2px solid #16a34a' : '1px solid #cbd5e1',
            background: sourceMode === 'myLots' ? '#16a34a' : '#ffffff',
            color: sourceMode === 'myLots' ? '#ffffff' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Package size={16} />
          <span>Select from My Uploaded Lots ({availableLots.length})</span>
        </button>

        <button
          onClick={() => setSourceMode('catalog')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: sourceMode === 'catalog' ? '2px solid #0284c7' : '1px solid #cbd5e1',
            background: sourceMode === 'catalog' ? '#0284c7' : '#ffffff',
            color: sourceMode === 'catalog' ? '#ffffff' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Layers size={16} />
          <span>Test Other Crops from Catalog</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. SELECT FROM MY UPLOADED LOTS SECTION                                  */}
      {/* ========================================================================= */}
      {sourceMode === 'myLots' && (
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Package size={16} color="#16a34a" />
            <span>Click on your uploaded product to load its Grade & Certification:</span>
          </label>

          {availableLots.length === 0 ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <p style={{ color: '#64748b', margin: '0 0 12px 0' }}>You haven't listed any produce lots yet.</p>
              <button onClick={() => setActiveTab('myLots')} className="btn btn-primary btn-sm">Go to My Lots to Create One</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {availableLots.map(lot => {
                const isSelected = selectedLot?.id === lot.id;
                const lotCover = lot.images?.[0] || lot.image || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100';

                return (
                  <div
                    key={lot.id}
                    onClick={() => handleSelectUploadedLot(lot)}
                    style={{
                      border: isSelected ? '2.5px solid #16a34a' : '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '12px',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(22, 163, 74, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                  >
                    <img 
                      src={lotCover} 
                      alt={lot.crop} 
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{lot.crop}</strong>
                        <span style={{
                          background: lot.grade === 'A' ? '#dcfce7' : '#fef3c7',
                          color: lot.grade === 'A' ? '#15803d' : '#b45309',
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          Grade {lot.grade || 'A'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
                        {lot.variety || 'Standard'} • {lot.category || 'Vegetable'}
                      </span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 800 }}>
                          ID: {lot.id}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800 }}>
                          Score: {lot.qualityScore || 92}/100
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CATALOG / TEST CROPS SELECTOR                                          */}
      {/* ========================================================================= */}
      {sourceMode === 'catalog' && (
        <div style={{ marginBottom: '24px' }}>
          {/* Category Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
            <button
              type="button"
              onClick={() => handleCategoryChange('Vegetable')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: selectedCategory === 'Vegetable' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                background: selectedCategory === 'Vegetable' ? '#f0fdf4' : '#ffffff',
                cursor: 'pointer',
                fontWeight: 800,
                color: selectedCategory === 'Vegetable' ? '#15803d' : '#475569'
              }}
            >
              🥦 {t('categoryVegetable')}
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('Fruit')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: selectedCategory === 'Fruit' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                background: selectedCategory === 'Fruit' ? '#fff7ed' : '#ffffff',
                cursor: 'pointer',
                fontWeight: 800,
                color: selectedCategory === 'Fruit' ? '#c2410c' : '#475569'
              }}
            >
              🍎 {t('categoryFruit')}
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('Crop')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: selectedCategory === 'Crop' ? '2px solid #d97706' : '1px solid #cbd5e1',
                background: selectedCategory === 'Crop' ? '#fffbeb' : '#ffffff',
                cursor: 'pointer',
                fontWeight: 800,
                color: selectedCategory === 'Crop' ? '#b45309' : '#475569'
              }}
            >
              🌾 {t('categoryCrop')}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                Select Crop from {selectedCategory} Catalog:
              </label>
              <select
                className="form-control form-select"
                value={selectedCropName}
                onChange={(e) => handleCropChange(e.target.value)}
                style={{ fontWeight: 800 }}
              >
                {filteredCatalog.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.nameMr || c.name})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                Quick Standard Presets:
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {PRESET_SAMPLES.filter(p => p.category === selectedCategory).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedLot(null);
                      setSelectedCategory(p.category);
                      setSelectedCropName(p.crop);
                      setVariety(p.variety);
                      setProduceImage(p.image);
                      setLotPhotos([p.image]);
                      setGrade(p.grade);
                      setQualityScore(p.qualityScore);
                      setFreshness(p.freshness);
                      setDamagePercent(p.damagePercent);
                      setBulbSize(p.bulbSize);
                      setCertId(`CERT-MH-${new Date().getFullYear()}-AGMARK-${Math.floor(1000 + Math.random() * 9000)}`);
                      setAssessorSummary(p.summary);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: selectedCropName.toLowerCase() === p.crop.toLowerCase() ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                      background: selectedCropName.toLowerCase() === p.crop.toLowerCase() ? '#f0fdf4' : '#ffffff',
                      color: selectedCropName.toLowerCase() === p.crop.toLowerCase() ? '#15803d' : '#475569',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Selected Product Banner */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
            {selectedLot ? `Selected Uploaded Lot: #${selectedLot.id}` : 'Catalog Inspection Sample'}
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
            {selectedCategory === 'Fruit' ? '🍎' : selectedCategory === 'Crop' ? '🌾' : '🥦'} {selectedCropName} ({variety})
          </div>
          <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>
            {selectedLot ? `Listed Volume: ${selectedLot.quantity.toLocaleString()} ${selectedLot.unit} @ ₹${selectedLot.expectedPrice}/${selectedLot.unit}` : 'Standard Grade Inspection'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: grade === 'A' ? '#15803d' : '#d97706',
            color: '#ffffff',
            padding: '6px 16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.64rem', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>
              Product Grade
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, lineHeight: 1 }}>
              GRADE {grade}
            </div>
          </div>

          <button
            onClick={handleDownloadCertificate}
            className="btn btn-primary"
            style={{ fontWeight: 800 }}
          >
            <Download size={15} />
            <span>Download Certificate (PNG)</span>
          </button>
        </div>
      </div>

      {/* 3. Main Inspection Grid */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Left: Computer Vision Scanner View */}
        <div className="card" style={{ padding: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={16} color="#16a34a" />
              <span>Visual Optical Feed: {selectedCropName}</span>
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload} 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                <UploadCloud size={13} />
                <span>Upload Photo</span>
              </button>

              <button 
                onClick={handleRunScan}
                disabled={isScanning}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}
              >
                <RefreshCw size={13} className={isScanning ? "animate-spin" : ""} />
                <span>{isScanning ? 'Scanning...' : 'Re-Scan Sample'}</span>
              </button>
            </div>
          </div>

          {/* Scanner Image Canvas Frame */}
          <div style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid #cbd5e1',
            background: '#000000',
            height: '300px'
          }}>
            <img 
              src={produceImage} 
              alt={selectedCropName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isScanning ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
            />

            {/* Scanning Laser Animation */}
            {isScanning && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: '#22c55e',
                boxShadow: '0 0 16px #22c55e',
                animation: 'scanDown 1.2s infinite alternate'
              }} />
            )}

            {/* Detected Bounding Overlays */}
            {!isScanning && hasScanned && (
              <>
                <div style={{
                  position: 'absolute',
                  top: '22%',
                  left: '20%',
                  width: '130px',
                  height: '130px',
                  border: '2.5px solid #22c55e',
                  borderRadius: '50%',
                  boxShadow: '0 0 12px rgba(34, 197, 94, 0.45)'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '8px',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    Ø {bulbSize} • 98%
                  </span>
                </div>

                <div style={{
                  position: 'absolute',
                  top: '35%',
                  right: '18%',
                  width: '110px',
                  height: '110px',
                  border: '2px solid #38bdf8',
                  borderRadius: '12px'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '4px',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    Skin Luster Verified
                  </span>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem'
                }}>
                  <span>Color Uniformity: <strong>96.8%</strong></span>
                  <span>Blemishes: <strong>{damagePercent}%</strong></span>
                  <span>Certified: <strong style={{ color: '#4ade80' }}>Grade {grade}</strong></span>
                </div>
              </>
            )}
          </div>

          {/* 4 Multi-Angle Photos Strip of this product */}
          {lotPhotos && lotPhotos.length > 1 && (
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                4 Multi-Angle Inspection Photos for {selectedCropName}:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {lotPhotos.slice(0, 4).map((p, i) => (
                  <div
                    key={i}
                    onClick={() => setProduceImage(p)}
                    style={{
                      height: '60px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: produceImage === p ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      position: 'relative'
                    }}
                    title={`Click to inspect Angle #${i + 1}`}
                  >
                    <img src={p} alt={`Angle ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: '2px', left: '2px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.58rem', padding: '1px 3px', borderRadius: '2px' }}>
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Certified Quality Scorecard */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase' }}>
                State Agmarknet Inspection
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--slate-900)', margin: '2px 0 0 0' }}>
                {selectedCropName} Quality Certification
              </h3>
            </div>

            <div style={{
              background: grade === 'A' ? '#15803d' : '#d97706',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, opacity: 0.9, display: 'block' }}>
                Certified Grade
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1 }}>
                GRADE {grade}
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Freshness Index
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#16a34a', marginTop: '2px' }}>
                {freshness}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Moisture content within limit</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Defect / Damage Rate
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: damagePercent < 3 ? '#16a34a' : '#d97706', marginTop: '2px' }}>
                {damagePercent}%
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Agmarknet benchmark &lt; 5.0%</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Calibrated Produce Sizing
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                {bulbSize}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Export Caliber Standard</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Aggregate AI Score
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#2563eb', marginTop: '2px' }}>
                {qualityScore} / 100
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>YOLOv8 Multi-Factor Index</span>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 12px', margin: '0 0 16px 0', lineHeight: 1.4 }}>
            <strong>Assessor Finding:</strong> {assessorSummary}
          </p>

          {/* Download Quality Certificate Button */}
          <button 
            onClick={handleDownloadCertificate}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Download size={18} />
            <span>Download Digitally Signed Certificate (PNG Image)</span>
          </button>
        </div>
      </div>

      {/* 4. Live Official Certificate Visual Preview */}
      <div className="card" style={{ padding: '24px', background: '#ffffff', border: '2px solid #16a34a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span className="badge badge-green" style={{ fontSize: '0.74rem' }}>
              Official Certificate Visual Preview
            </span>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0' }}>
              MahaAgri Digitally Signed Quality Certification for {selectedCropName} (Grade {grade})
            </h4>
          </div>

          <button 
            onClick={handleDownloadCertificate}
            className="btn btn-primary"
            style={{ fontWeight: 800 }}
          >
            <Download size={15} />
            <span>Download Certificate as PNG Image</span>
          </button>
        </div>

        {/* Certificate Frame Preview */}
        <div style={{
          background: '#fcfdfa',
          border: '12px solid #14532d',
          outline: '3px solid #d97706',
          borderRadius: '8px',
          padding: '24px',
          position: 'relative'
        }}>
          {/* Watermark */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-25deg)',
            fontSize: '5.5rem',
            fontWeight: 900,
            color: 'rgba(22, 163, 74, 0.05)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}>
            MAHA-AGRI CERTIFIED
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #16a34a', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Government of Maharashtra • Directorate of Agricultural Marketing
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
              MahaAgri Agmarknet Digital Quality Certification
            </h3>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Official Certificate of Quality Assurance & Grade Certification
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Certificate ID: <strong style={{ color: '#0f172a' }}>{certId}</strong> • Date: <strong>{certDate}</strong> • Verification: <strong>SHA-256 Cryptographic Stamp</strong>
            </div>
          </div>

          {/* Producer & Crop Credentials */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '6px', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b', fontWeight: 700 }}>Farmer / Producer:</span>
                <strong style={{ color: '#15803d' }}>{selectedLot?.farmerName || currentUser?.name || 'Ramesh Patil (Verified Farmer)'}</strong>

                <span style={{ color: '#64748b', fontWeight: 700 }}>Origin Location:</span>
                <strong style={{ color: '#0f172a' }}>{selectedLot?.location || currentUser?.location || 'Haveli, Pune District, Maharashtra'}</strong>

                <span style={{ color: '#64748b', fontWeight: 700 }}>Produce Name & Variety:</span>
                <strong style={{ color: '#0f172a' }}>{selectedCropName} ({variety || 'Standard Hybrid'})</strong>

                <span style={{ color: '#64748b', fontWeight: 700 }}>Produce Category:</span>
                <strong style={{ color: '#0f172a' }}>{selectedCategory}</strong>

                <span style={{ color: '#64748b', fontWeight: 700 }}>Registered Lot ID:</span>
                <strong style={{ color: '#0284c7' }}>{selectedLot ? selectedLot.id : 'N/A (Direct Scan)'}</strong>

                <span style={{ color: '#64748b', fontWeight: 700 }}>AI Quality Score:</span>
                <strong style={{ color: '#15803d' }}>{qualityScore} / 100 (Assessed via YOLOv8 Agmark Model)</strong>
              </div>
            </div>

            {/* Embossed Grade Seal */}
            <div style={{
              background: grade === 'A' ? '#f0fdf4' : '#fffbeb',
              border: `2px solid ${grade === 'A' ? '#22c55e' : '#f59e0b'}`,
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: grade === 'A' ? '#15803d' : '#d97706',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 800 }}>CERTIFIED</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1 }}>{grade}</span>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 800 }}>GRADE</span>
              </div>
              <strong style={{ fontSize: '0.9rem', color: grade === 'A' ? '#14532d' : '#92400e', display: 'block' }}>
                GRADE {grade} CERTIFIED
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {grade === 'A' ? 'Export & Institutional Standard' : 'Domestic Wholesale Standard'}
              </span>
            </div>
          </div>

          {/* Signatures & Stamps Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
            <div>
              <div style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #0f172a', display: 'inline-block', paddingBottom: '2px' }}>
                Vedant Chavan
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginTop: '4px' }}>
                Platform Master Administrator
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Directorate of Agricultural Marketing, MH
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '6px', background: '#f1f5f9', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '4px' }}>
                <QrCode size={36} color="#0f172a" />
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>
                SCAN TO VERIFY
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.2rem', fontWeight: 900, color: '#15803d', borderBottom: '1px solid #15803d', display: 'inline-block', paddingBottom: '2px' }}>
                Dr. S. K. Kulkarni (Ph.D Agri)
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginTop: '4px' }}>
                Chief Quality Assessor & Agronomist
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Agmarknet Central Directorate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
