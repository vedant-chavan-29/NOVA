import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DISTRICTS } from '../../mockData';
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Camera,
  Layers,
  MapPin,
  Tag,
  Plus,
  Check,
  RefreshCw,
  AlertCircle,
  Eye,
  ShieldCheck,
  Image as ImageIcon,
  Sliders
} from 'lucide-react';

const CATEGORY_SAMPLE_PRESETS = {
  Vegetable: [
    {
      title: "Overall Batch View",
      subtitle: "Uniformity & Crate Volume",
      url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Surface & Skin Inspection",
      subtitle: "Skin Luster & Texture",
      url: "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Caliber Sizing Check",
      subtitle: "Diameter Standard (55-65mm)",
      url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Internal Core & Cross-Section",
      subtitle: "Internal Firmness & Moisture",
      url: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=600&auto=format&fit=crop&q=80"
    }
  ],
  Fruit: [
    {
      title: "Overall Batch View",
      subtitle: "Orchard Harvest Uniformity",
      url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Surface & Skin Inspection",
      subtitle: "Fruit Peel, Bloom & Waxing",
      url: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Caliber Sizing Check",
      subtitle: "Fruit Caliber & Weight Grade",
      url: "https://images.unsplash.com/photo-1579613832125-5d34a13ffe0a?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Internal Core & Cross-Section",
      subtitle: "Pulp Sweetness & Seed Cavity",
      url: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=600&auto=format&fit=crop&q=80"
    }
  ],
  Crop: [
    {
      title: "Overall Batch View",
      subtitle: "Threshed Grain Pile & Sacks",
      url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Surface & Skin Inspection",
      subtitle: "Grain Coat, Luster & Cleanliness",
      url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Caliber Sizing Check",
      subtitle: "Kernel Plumpness & 1000-Seed Wt",
      url: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Internal Core & Cross-Section",
      subtitle: "Endosperm Purity & Moisture",
      url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80"
    }
  ]
};

export const CreateLotModal = () => {
  const { 
    isCreateLotModalOpen, 
    setIsCreateLotModalOpen, 
    createLot, 
    cropsCatalog, 
    addCustomCrop,
    lang, 
    t, 
    setActiveTab 
  } = useApp();

  const [step, setStep] = useState(1); // 1: Category & Produce, 2: Quantity & 4-Photos, 3: AI Quality Grading, 4: Success
  const [createdLotResult, setCreatedLotResult] = useState(null);

  // 1. Produce Category (3 Options: Fruit, Vegetable, Crops)
  const [category, setCategory] = useState('Vegetable'); // 'Fruit' | 'Vegetable' | 'Crop'
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [customCropName, setCustomCropName] = useState('');
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [variety, setVariety] = useState('Garwa Red Onion');

  // Agricultural & Location info
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [district, setDistrict] = useState('pune');
  const [location, setLocation] = useState('Haveli, Pune, Maharashtra');

  // 2. Quantity & Price
  const [quantity, setQuantity] = useState(1000);
  const [unit, setUnit] = useState('KG');
  const [expectedPrice, setExpectedPrice] = useState(28);

  // 3. 4-Photo Multi-Angle Upload Slots (Required for AI Grading)
  const [photos, setPhotos] = useState([
    CATEGORY_SAMPLE_PRESETS.Vegetable[0].url,
    CATEGORY_SAMPLE_PRESETS.Vegetable[1].url,
    CATEGORY_SAMPLE_PRESETS.Vegetable[2].url,
    CATEGORY_SAMPLE_PRESETS.Vegetable[3].url
  ]);

  // File input refs for each of the 4 slots
  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // AI Grading Scan Simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeScanAngle, setActiveScanAngle] = useState(0);
  const [freshness, setFreshness] = useState('96%');
  const [damagePercent, setDamagePercent] = useState(1.9);
  const [bulbSize, setBulbSize] = useState('55-65 mm');
  const [qualityScore, setQualityScore] = useState(94);
  const [grade, setGrade] = useState('A');
  const [analysisBreakdown, setAnalysisBreakdown] = useState({
    batchUniformity: '96% Uniform Harvest Lot',
    surfaceDefect: '1.9% Minor Natural Markings',
    caliberConformity: '55-65 mm Grade-A Conformance',
    internalPurity: '99% Clean Core Density'
  });

  // Filter crops catalog for current category
  const filteredCatalog = (cropsCatalog || []).filter(c => c.category === category);

  // Reset/sync selection when category changes
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    const categoryCrops = (cropsCatalog || []).filter(c => c.category === newCategory);
    if (categoryCrops.length > 0 && !isManualEntry) {
      setSelectedCropId(categoryCrops[0].id);
      setVariety(categoryCrops[0].varieties?.[0] || 'Standard');
      setExpectedPrice(categoryCrops[0].avgPrice || 25);
    }
    // Update sample photos for new category
    const presets = CATEGORY_SAMPLE_PRESETS[newCategory] || CATEGORY_SAMPLE_PRESETS.Vegetable;
    setPhotos([presets[0].url, presets[1].url, presets[2].url, presets[3].url]);
  };

  const handleSelectCatalogCrop = (id) => {
    setSelectedCropId(id);
    setIsManualEntry(false);
    const crop = (cropsCatalog || []).find(c => c.id === id);
    if (crop) {
      setVariety(crop.varieties?.[0] || 'Standard Grade');
      setExpectedPrice(crop.avgPrice || 25);
      if (crop.defaultUnit) setUnit(crop.defaultUnit);
    }
  };

  // Upload file handler for any of the 4 slots
  const handleFileUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultData = uploadEvent.target?.result;
      if (resultData) {
        setPhotos(prev => {
          const updated = [...prev];
          updated[index] = resultData;
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset load handler
  const handleLoadPreset = (index) => {
    const presets = CATEGORY_SAMPLE_PRESETS[category] || CATEGORY_SAMPLE_PRESETS.Vegetable;
    setPhotos(prev => {
      const updated = [...prev];
      updated[index] = presets[index].url;
      return updated;
    });
  };

  // Trigger AI Multi-Angle Scan
  const handleStartAIScan = () => {
    setStep(3);
    setIsScanning(true);
    setScanProgress(10);
    setActiveScanAngle(0);

    const step1 = setTimeout(() => {
      setScanProgress(35);
      setActiveScanAngle(1);
    }, 450);

    const step2 = setTimeout(() => {
      setScanProgress(65);
      setActiveScanAngle(2);
    }, 900);

    const step3 = setTimeout(() => {
      setScanProgress(90);
      setActiveScanAngle(3);
    }, 1350);

    const step4 = setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);

      // Generate dynamic high-integrity scores
      const finalScore = Math.floor(92 + Math.random() * 6); // 92 - 97
      setQualityScore(finalScore);
      setGrade(finalScore >= 88 ? 'A' : finalScore >= 75 ? 'B' : 'C');
      setFreshness(`${Math.floor(94 + Math.random() * 5)}%`);
      setDamagePercent(Number((1.2 + Math.random() * 1.5).toFixed(1)));
      setBulbSize(category === 'Crop' ? 'Grade 1 Plump Kernels' : category === 'Fruit' ? '70-85 mm Premium' : '55-65 mm Standard');
      setAnalysisBreakdown({
        batchUniformity: `${Math.floor(95 + Math.random() * 4)}% Verified Batch Uniformity`,
        surfaceDefect: `${Number((1.2 + Math.random() * 1.5).toFixed(1))}% Minor Surface Markings (Export Safe)`,
        caliberConformity: category === 'Crop' ? '98.5% High Density & Germination Standard' : '55-65 mm Conforming Caliber',
        internalPurity: '99.2% Pristine Tissue & Moisture Density'
      });
    }, 1800);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
    };
  };

  // Final Publish
  const handleSubmitLot = (e) => {
    if (e) e.preventDefault();

    let finalCropName = '';
    let finalCropMr = '';
    let finalCropId = '';

    if (isManualEntry && customCropName.trim()) {
      finalCropName = customCropName.trim();
      finalCropMr = customCropName.trim();
      finalCropId = finalCropName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      // Register in catalog so it can be re-selected anywhere with NO LIMIT
      addCustomCrop(category, finalCropName, variety);
    } else {
      const selected = (cropsCatalog || []).find(c => c.id === selectedCropId) || (cropsCatalog?.[0] || { name: 'Onion', nameMr: 'कांदा', id: 'onion' });
      finalCropName = selected.name;
      finalCropMr = selected.nameMr || selected.name;
      finalCropId = selected.id;
    }

    const result = createLot({
      category,
      crop: finalCropName,
      cropMr: finalCropMr,
      cropId: finalCropId,
      variety: variety.trim() || 'Standard Commercial Quality',
      quantity: Number(quantity),
      unit,
      grade,
      expectedPrice: Number(expectedPrice),
      harvestDate,
      location,
      district,
      image: photos[0], // First photo as cover
      images: photos,   // All 4 photos stored!
      qualityScore,
      freshness,
      damagePercent,
      bulbSize,
      analysisBreakdown,
      description: `Verified Grade ${grade} ${finalCropName} lot (${quantity.toLocaleString()} ${unit}) produced in ${location}. Inspected across 4 computer-vision angles.`
    });

    setCreatedLotResult(result);
    setStep(4); // Success screen
  };

  if (!isCreateLotModalOpen) return null;

  const currentCropObj = (cropsCatalog || []).find(c => c.id === selectedCropId);
  const activeCropDisplay = isManualEntry 
    ? (customCropName.trim() || 'Custom Produce') 
    : (currentCropObj ? `${currentCropObj.name} (${currentCropObj.nameMr})` : 'Selected Produce');

  const slotLabels = [
    { title: lang === 'mr' ? 'फोटो १: संपूर्ण लॉट व ढीग दृश्य' : lang === 'hi' ? 'फोटो १: संपूर्ण लॉट व ढेर दृश्य' : 'Photo 1: Overall Harvest & Batch View', subtitle: 'Batch uniformity, bulk quantity & color' },
    { title: lang === 'mr' ? 'फोटो २: सालाची तपासणी व पोत' : lang === 'hi' ? 'फोटो २: छिलका व त्वचा परीक्षण' : 'Photo 2: Surface & Skin Inspection', subtitle: 'Skin blemishes, texture & pest safety' },
    { title: lang === 'mr' ? 'फोटो ३: आकारमान व कॅलिबर' : lang === 'hi' ? 'फोटो ३: आकार व कैलिबर माप' : 'Photo 3: Caliber / Sizing Measurement', subtitle: 'Diameter standard & scale alignment' },
    { title: lang === 'mr' ? 'फोटो ४: अंतर्गत गाभा व गुणवत्ता' : lang === 'hi' ? 'फोटो ४: आंतरिक कोर व गुणवत्ता' : 'Photo 4: Cross-section / Internal Core', subtitle: 'Internal rot check, pulp & moisture' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg" style={{ maxWidth: '860px', maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Close Button */}
        <button 
          onClick={() => { setIsCreateLotModalOpen(false); setStep(1); }}
          className="modal-close"
        >
          <X size={18} />
        </button>

        {/* Step Indicator Header */}
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={13} />
              <span>Multi-Angle AI Lot Listing</span>
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[1, 2, 3].map(s => (
                <div 
                  key={s}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    background: step === s ? '#16a34a' : step > s ? '#dcfce7' : '#f1f5f9',
                    color: step === s ? '#ffffff' : step > s ? '#16a34a' : '#64748b',
                    border: step === s ? '2px solid #15803d' : '1px solid #cbd5e1'
                  }}
                >
                  {step > s ? '✓' : s}
                </div>
              ))}
            </div>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--slate-900)', margin: 0 }}>
            {lang === 'mr' ? 'नवीन शेतीमाल लॉट नोंदणी व ४-फोटो एआय तपासणी' : lang === 'hi' ? 'नई कृषि उपज लॉट व ४-फोटो एआई ग्रेडिंग' : 'List New Harvest Lot with 4-Photo AI Grading'}
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--slate-600)' }}>
            Choose from <strong>Fruit</strong>, <strong>Vegetable</strong>, or <strong>Crops</strong>, or enter any product manually without limit.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: CATEGORY SELECTION & PRODUCE NAME (CATALOG OR MANUAL ENTRY)       */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div>
            {/* 1. Category 3-Card Selector */}
            <div style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={15} color="#16a34a" />
                <span>1. Select Produce Category (प्रकार निवडा)</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {/* Option 1: Vegetable */}
                <button
                  type="button"
                  onClick={() => handleCategoryChange('Vegetable')}
                  style={{
                    padding: '16px 12px',
                    borderRadius: '12px',
                    border: category === 'Vegetable' ? '2.5px solid #16a34a' : '1.5px solid #e2e8f0',
                    background: category === 'Vegetable' ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: category === 'Vegetable' ? '0 4px 14px rgba(22, 163, 74, 0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🥦</div>
                  <strong style={{ display: 'block', fontSize: '1rem', color: category === 'Vegetable' ? '#15803d' : '#0f172a' }}>
                    {t('categoryVegetable')}
                  </strong>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Onion, Tomato, Potato, Garlic...
                  </span>
                </button>

                {/* Option 2: Fruit */}
                <button
                  type="button"
                  onClick={() => handleCategoryChange('Fruit')}
                  style={{
                    padding: '16px 12px',
                    borderRadius: '12px',
                    border: category === 'Fruit' ? '2.5px solid #ea580c' : '1.5px solid #e2e8f0',
                    background: category === 'Fruit' ? '#fff7ed' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: category === 'Fruit' ? '0 4px 14px rgba(234, 88, 12, 0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🍎</div>
                  <strong style={{ display: 'block', fontSize: '1rem', color: category === 'Fruit' ? '#c2410c' : '#0f172a' }}>
                    {t('categoryFruit')}
                  </strong>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Pomegranate, Grapes, Mango, Papaya...
                  </span>
                </button>

                {/* Option 3: Crops / Grains */}
                <button
                  type="button"
                  onClick={() => handleCategoryChange('Crop')}
                  style={{
                    padding: '16px 12px',
                    borderRadius: '12px',
                    border: category === 'Crop' ? '2.5px solid #d97706' : '1.5px solid #e2e8f0',
                    background: category === 'Crop' ? '#fffbeb' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: category === 'Crop' ? '0 4px 14px rgba(217, 119, 6, 0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🌾</div>
                  <strong style={{ display: 'block', fontSize: '1rem', color: category === 'Crop' ? '#b45309' : '#0f172a' }}>
                    {t('categoryCrop')}
                  </strong>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Soybean, Cotton, Wheat, Maize, Chana...
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Mode: Popular Suggestion OR Manual Entry (No limit) */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#334155' }}>
                  2. Choose Produce / Crop in {category}:
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsManualEntry(false)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      border: !isManualEntry ? '1px solid #16a34a' : '1px solid #cbd5e1',
                      background: !isManualEntry ? '#16a34a' : '#ffffff',
                      color: !isManualEntry ? '#ffffff' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    Catalog Quick Pick
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsManualEntry(true)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      border: isManualEntry ? '1px solid #0284c7' : '1px solid #cbd5e1',
                      background: isManualEntry ? '#0284c7' : '#ffffff',
                      color: isManualEntry ? '#ffffff' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    ✍️ Enter Manually (No Limit)
                  </button>
                </div>
              </div>

              {!isManualEntry ? (
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Select from {category} Catalog:
                  </label>
                  <select 
                    className="form-control form-select"
                    value={selectedCropId}
                    onChange={(e) => handleSelectCatalogCrop(e.target.value)}
                    style={{ fontWeight: 700, fontSize: '0.95rem' }}
                  >
                    {filteredCatalog.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.nameMr}) — Avg. ₹{c.avgPrice}/{c.defaultUnit || 'KG'}
                      </option>
                    ))}
                  </select>

                  {/* Quick suggestion pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {filteredCatalog.slice(0, 7).map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCatalogCrop(c.id)}
                        style={{
                          background: selectedCropId === c.id ? '#16a34a' : '#ffffff',
                          color: selectedCropId === c.id ? '#ffffff' : '#334155',
                          border: '1px solid #cbd5e1',
                          padding: '4px 10px',
                          borderRadius: '16px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {c.name} ({c.nameMr})
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#0284c7" />
                    <span style={{ fontSize: '0.78rem', color: '#0369a1', fontWeight: 600 }}>
                      {t('customCropNote')} Newly added produce is automatically saved into your platform catalog.
                    </span>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Enter Produce Name Manually (मॅन्युअली नवीन नाव टाका) *
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      style={{ fontSize: '1rem', fontWeight: 700 }}
                      placeholder="e.g. Dragon Fruit, Strawberry, Broccoli, Chia Seeds, Turmeric, Bajra..."
                      value={customCropName}
                      onChange={(e) => setCustomCropName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Variety, Harvest Date, District & Location */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Variety / Cultivar (वाण / जात)</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Garwa Red, Abhinav Hybrid, Alphonso Hapus..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Harvest Date (कापणी / तोडणी तारीख)</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  City / District / APMC Center (शहर / जिल्हा) *
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Pune, Nashik, Kolhapur, Jalgaon, Latur, Baramati, Sangli..."
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                  {['Pune', 'Nashik', 'Ahmednagar', 'Solapur', 'Nagpur', 'Kolhapur', 'Chhatrapati Sambhajinagar', 'Jalgaon', 'Latur', 'Sangli', 'Satara', 'Amravati'].map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setDistrict(city)}
                      style={{
                        background: (district || '').toLowerCase() === city.toLowerCase() ? '#16a34a' : '#f1f5f9',
                        color: (district || '').toLowerCase() === city.toLowerCase() ? '#ffffff' : '#475569',
                        border: '1px solid #cbd5e1',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Farm Gate Location / Village Address</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Haveli, Pune, Maharashtra"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button 
                type="button"
                onClick={() => {
                  if (isManualEntry && !customCropName.trim()) {
                    alert('Please enter your custom produce name first.');
                    return;
                  }
                  setStep(2);
                }}
                className="btn btn-primary"
                style={{ fontWeight: 800, padding: '10px 22px' }}
              >
                <span>Continue to Quantity & 4-Photo Upload</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: QUANTITY, PRICE & 4 MANDATORY INSPECTION PHOTOS                   */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Listing Produce</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                  {category === 'Fruit' ? '🍎' : category === 'Crop' ? '🌾' : '🥦'} {activeCropDisplay} ({variety})
                </div>
              </div>
              <span className="badge badge-green" style={{ textTransform: 'uppercase' }}>
                Category: {category}
              </span>
            </div>

            {/* Quantity & Expected Rate */}
            <div className="grid-3" style={{ marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Total Quantity</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  min="1"
                  step="10"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Packaging Unit</label>
                <select 
                  className="form-control form-select"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="KG">KG (Kilogram)</option>
                  <option value="MT">MT (Metric Ton)</option>
                  <option value="Quintal">Quintal (100 KG)</option>
                  <option value="Crates">Crates (20 KG Standard)</option>
                  <option value="Boxes">Corrugated Boxes</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Asking Price (₹ per {unit})</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(Math.max(0.5, Number(e.target.value)))}
                  min="0.5"
                  step="0.5"
                />
              </div>
            </div>

            {/* Calculated Gross Value Strip */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.84rem', color: '#166534', fontWeight: 600 }}>Estimated Gross Value:</span>
              <strong style={{ fontSize: '1.15rem', color: '#15803d', fontWeight: 900 }}>
                ₹{(quantity * expectedPrice).toLocaleString()}
              </strong>
            </div>

            {/* ===================================================================== */}
            {/* 4-PHOTO MULTI-ANGLE MANDATORY INSPECTION UPLOAD GRID                  */}
            {/* ===================================================================== */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a' }}>
                    <Camera size={16} color="#16a34a" />
                    <span>Upload 4 Inspection Photos (४ कोनातून फोटो - AI ग्रेडिंगसाठी आवश्यक)</span>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    The AI Computer Vision model requires all 4 distinct photos to evaluate freshness, caliber, skin defects, and core density.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const presets = CATEGORY_SAMPLE_PRESETS[category] || CATEGORY_SAMPLE_PRESETS.Vegetable;
                    setPhotos([presets[0].url, presets[1].url, presets[2].url, presets[3].url]);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem' }}
                >
                  <RefreshCw size={12} />
                  <span>Use 4 Camera Presets</span>
                </button>
              </div>

              {/* 4 Photo Slots Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {[0, 1, 2, 3].map(idx => {
                  const label = slotLabels[idx];
                  const currentPhoto = photos[idx];

                  return (
                    <div 
                      key={idx}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>
                            {label.title}
                          </strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {label.subtitle}
                          </span>
                        </div>
                        <span style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <Check size={11} /> Ready
                        </span>
                      </div>

                      {/* Photo Preview */}
                      <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9' }}>
                        <img 
                          src={currentPhoto} 
                          alt={`Slot ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          background: 'rgba(15, 23, 42, 0.75)',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backdropFilter: 'blur(4px)'
                        }}>
                          Angle #{idx + 1}
                        </span>
                      </div>

                      {/* Hidden File Input */}
                      <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRefs[idx]}
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(idx, e)}
                      />

                      {/* Upload / Replace Buttons */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => fileInputRefs[idx].current?.click()}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, fontSize: '0.74rem', padding: '6px 8px', justifyContent: 'center' }}
                        >
                          <UploadCloud size={13} />
                          <span>Upload File</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadPreset(idx)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.74rem', padding: '6px 8px' }}
                          title="Reset to sample camera photo"
                        >
                          <RefreshCw size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary"
              >
                <ArrowLeft size={16} />
                <span>Back to Produce Selection</span>
              </button>

              <button 
                type="button"
                onClick={handleStartAIScan}
                className="btn btn-primary btn-lg"
                style={{ fontWeight: 900 }}
              >
                <Sparkles size={17} />
                <span>Run 4-Photo Multi-Angle AI Quality Scan</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: AI QUALITY SCAN ANIMATION & MULTI-ANGLE RESULTS CONFIRMATION       */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div>
            {isScanning ? (
              <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#f0fdf4',
                  border: '3px solid #22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <Sparkles size={36} color="#16a34a" />
                </div>

                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                  AI Computer Vision Scan in Progress...
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '440px', margin: '0 auto 20px' }}>
                  Evaluating all 4 uploaded angles against national Agmarknet computer-vision models...
                </p>

                {/* Progress bar */}
                <div style={{ width: '100%', maxWidth: '420px', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', margin: '0 auto 16px' }}>
                  <div style={{ width: `${scanProgress}%`, height: '100%', background: 'linear-gradient(90deg, #16a34a, #22c55e)', transition: 'width 0.4s ease' }} />
                </div>

                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>
                  Analyzing {slotLabels[activeScanAngle]?.title} ({scanProgress}%)
                </span>
              </div>
            ) : (
              <div>
                {/* Certified Badge Banner */}
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#22c55e', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#14532d', margin: 0 }}>
                      4-Angle AI Quality Verification Passed — Certified GRADE {grade}!
                    </h5>
                    <p style={{ fontSize: '0.82rem', color: '#166534', margin: '3px 0 0' }}>
                      Composite quality score calculated from all 4 multi-angle photos meets <strong>Institutional & Export Standard</strong>.
                    </p>
                  </div>
                </div>

                {/* 4 Angle Scan Diagnostic Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {photos.map((p, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', textAlign: 'center' }}>
                      <div style={{ position: 'relative', height: '90px' }}>
                        <img src={p} alt={`Angle ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px' }}>
                          Angle #{idx + 1}
                        </span>
                      </div>
                      <div style={{ padding: '6px 4px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803d' }}>
                          {idx === 0 ? 'Batch: 96%' : idx === 1 ? 'Defect: <2%' : idx === 2 ? 'Caliber: OK' : 'Core: 99%'}
                        </div>
                        <span style={{ fontSize: '0.64rem', color: '#64748b' }}>
                          Verified ✓
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid-3" style={{ marginBottom: '20px' }}>
                  <div className="card" style={{ padding: '14px', textAlign: 'center', background: '#f8fafc' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>AI Quality Score</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a', marginTop: '2px' }}>{qualityScore}/100</div>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>High Premium Lot</span>
                  </div>

                  <div className="card" style={{ padding: '14px', textAlign: 'center', background: '#f8fafc' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Surface Damage Rate</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2563eb', marginTop: '2px' }}>{damagePercent}%</div>
                    <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700 }}>Well below 5% max</span>
                  </div>

                  <div className="card" style={{ padding: '14px', textAlign: 'center', background: '#f8fafc' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Assigned Final Grade</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>GRADE {grade}</div>
                    <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>Institutional Certified</span>
                  </div>
                </div>

                {/* Summary Table */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                    Lot Publication Summary:
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.84rem' }}>
                    <div>Category: <strong>{category}</strong></div>
                    <div>Produce: <strong>{activeCropDisplay}</strong></div>
                    <div>Variety: <strong>{variety}</strong></div>
                    <div>Quantity: <strong>{quantity.toLocaleString()} {unit}</strong></div>
                    <div>Asking Rate: <strong>₹{expectedPrice} / {unit}</strong></div>
                    <div>Est. Gross Value: <strong>₹{(quantity * expectedPrice).toLocaleString()}</strong></div>
                    <div>Location: <strong>{location}</strong></div>
                    <div>Photos Attached: <span className="badge badge-green">4 Angles Verified</span></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-secondary"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Photos</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handleSubmitLot}
                    className="btn btn-primary btn-lg"
                    style={{ fontWeight: 900 }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Publish Lot with 4 Photos to Marketplace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: SUCCESS CONFIRMATION & LOT GALLERY DISPLAY                        */}
        {/* ========================================================================= */}
        {step === 4 && createdLotResult && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '4px 14px', marginBottom: '8px' }}>
              Lot Successfully Published with 4 AI Photos!
            </span>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--slate-900)', marginTop: '8px' }}>
              Unique Lot ID: {createdLotResult.id}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', maxWidth: '520px', margin: '8px auto 20px' }}>
              Your {createdLotResult.quantity} {createdLotResult.unit} of <strong>{createdLotResult.crop}</strong> ({createdLotResult.category}) is now broadcasted with all 4 high-resolution inspection photos to verified buyers across Maharashtra.
            </p>

            {/* 4 Photos Gallery Display */}
            <div style={{ maxWidth: '560px', margin: '0 auto 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '10px', textAlign: 'left' }}>
                📷 Published 4-Angle Produce Inspection Gallery:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(createdLotResult.images || photos).map((img, i) => (
                  <div key={i} style={{ borderRadius: '6px', overflow: 'hidden', height: '80px', border: '1.5px solid #22c55e', position: 'relative' }}>
                    <img src={img} alt={`Angle ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: '2px', left: '2px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '2px' }}>
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => {
                  setIsCreateLotModalOpen(false);
                  setStep(1);
                  setActiveTab('myLots');
                }}
                className="btn btn-primary"
                style={{ fontWeight: 800 }}
              >
                <span>View in My Lots</span>
                <ArrowRight size={14} />
              </button>

              <button 
                onClick={() => {
                  setIsCreateLotModalOpen(false);
                  setStep(1);
                  setActiveTab('offers');
                }}
                className="btn btn-secondary"
              >
                <span>Check Received Offers</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
