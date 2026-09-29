// AgriLink Mock Seed Database & Initial State

export const CROPS_CATALOG = [
  // Vegetables
  { id: "onion", name: "Onion", nameMr: "कांदा", category: "Vegetable", defaultUnit: "KG", avgPrice: 26, varieties: ["Garwa Red", "Fursungi", "Nasik Red"] },
  { id: "tomato", name: "Tomato", nameMr: "टोमॅटो", category: "Vegetable", defaultUnit: "KG", avgPrice: 22, varieties: ["Abhinav Hybrid", "Vaishali", "Arka Rakshak"] },
  { id: "potato", name: "Potato", nameMr: "बटाटा", category: "Vegetable", defaultUnit: "KG", avgPrice: 20, varieties: ["Kufri Jyoti", "Kufri Pukhraj", "Chipsona"] },
  { id: "capsicum", name: "Capsicum (Bell Pepper)", nameMr: "ढोबळी मिरची", category: "Vegetable", defaultUnit: "KG", avgPrice: 42, varieties: ["Indra", "Bachata", "Inspiration"] },
  { id: "ginger", name: "Ginger", nameMr: "आले", category: "Vegetable", defaultUnit: "KG", avgPrice: 85, varieties: ["Mahim", "Varada", "Nadia"] },
  { id: "garlic", name: "Garlic", nameMr: "लसूण", category: "Vegetable", defaultUnit: "KG", avgPrice: 140, varieties: ["G-282", "Yamuna Safed", "Bhima Omkar"] },
  { id: "green-chilli", name: "Green Chilli", nameMr: "हिरवी मिरची", category: "Vegetable", defaultUnit: "KG", avgPrice: 38, varieties: ["Jwala", "Sitara", "Teja"] },

  // Fruits
  { id: "pomegranate", name: "Pomegranate", nameMr: "डाळिंब", category: "Fruit", defaultUnit: "KG", avgPrice: 110, varieties: ["Bhagwa", "Arakta", "Ganesh"] },
  { id: "grapes", name: "Grapes", nameMr: "द्राक्षे", category: "Fruit", defaultUnit: "KG", avgPrice: 75, varieties: ["Thompson Seedless", "Tas-A-Ganesh", "Sharad Seedless"] },
  { id: "mango", name: "Mango", nameMr: "आंबा", category: "Fruit", defaultUnit: "KG", avgPrice: 120, varieties: ["Alphonso (Hapus)", "Kesar", "Rajapuri"] },
  { id: "banana", name: "Banana", nameMr: "केळी", category: "Fruit", defaultUnit: "KG", avgPrice: 18, varieties: ["Grand Naine (G-9)", "Robusta", "Shrimanti"] },
  { id: "orange", name: "Orange / Mosambi", nameMr: "संत्रे / मोसंबी", category: "Fruit", defaultUnit: "KG", avgPrice: 45, varieties: ["Nagpur Mandarin", "Katol Gold", "Valencia"] },
  { id: "papaya", name: "Papaya", nameMr: "पपई", category: "Fruit", defaultUnit: "KG", avgPrice: 22, varieties: ["Red Lady 786", "Coorg Honey Dew", "Pusa Dwarf"] },
  { id: "custard-apple", name: "Custard Apple", nameMr: "सीताफळ", category: "Fruit", defaultUnit: "KG", avgPrice: 65, varieties: ["Balanagar", "NM-1", "Golden"] },

  // Crops (Grains, Cash Crops & Pulses)
  { id: "soybean", name: "Soybean", nameMr: "सोयाबीन", category: "Crop", defaultUnit: "KG", avgPrice: 48, varieties: ["JS 335", "Phule Kalyani", "MACS 1407"] },
  { id: "cotton", name: "Cotton", nameMr: "कापूस", category: "Crop", defaultUnit: "KG", avgPrice: 72, varieties: ["BT Cotton II", "DCH 32", "Ajeet 155"] },
  { id: "wheat", name: "Wheat", nameMr: "गहू", category: "Crop", defaultUnit: "KG", avgPrice: 32, varieties: ["Lokwan", "Sharbati", "Kalyansona"] },
  { id: "maize", name: "Maize (Corn)", nameMr: "मका", category: "Crop", defaultUnit: "KG", avgPrice: 24, varieties: ["Pioneer 3396", "Dekalb 9108", "Rasi 3033"] },
  { id: "chickpea", name: "Chickpea (Chana)", nameMr: "हरभरा", category: "Crop", defaultUnit: "KG", avgPrice: 58, varieties: ["Vijay", "Digvijay", "Vishal"] },
  { id: "sugarcane", name: "Sugarcane", nameMr: "ऊस", category: "Crop", defaultUnit: "MT", avgPrice: 3200, varieties: ["Co 86032", "CoM 0265", "MS 10001"] }
];

export const DISTRICTS = [
  { id: "pune", name: "Pune", nameMr: "पुणे", state: "Maharashtra" },
  { id: "nashik", name: "Nashik", nameMr: "नाशिक", state: "Maharashtra" },
  { id: "ahmednagar", name: "Ahmednagar", nameMr: "अहमदनगर", state: "Maharashtra" },
  { id: "solapur", name: "Solapur", nameMr: "सोलापूर", state: "Maharashtra" },
  { id: "nagpur", name: "Nagpur", nameMr: "नागपूर", state: "Maharashtra" }
];

export const INITIAL_LOTS = [
  {
    id: "LOT-PN-2026-081",
    farmerId: "FARMER-001",
    farmerName: "Ramesh Patil",
    farmerPhone: "+91 98220 14892",
    farmerFpo: "Sahyadri Farmers Producer Co.",
    location: "Haveli, Pune, Maharashtra",
    district: "pune",
    category: "Vegetable",
    crop: "Onion",
    cropMr: "कांदा",
    cropId: "onion",
    variety: "Garwa Red Onion",
    quantity: 1000,
    unit: "KG",
    grade: "A",
    expectedPrice: 28,
    harvestDate: "2026-09-03",
    status: "Offers Received", // 'Open', 'Offers Received', 'Deal Locked', 'In Transit', 'Completed'
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=600&auto=format&fit=crop&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-holding-fresh-red-tomatoes-42994-large.mp4",
    videoDuration: 45,
    qualityScore: 94,
    freshness: "96%",
    damagePercent: 2.1,
    bulbSize: "55-65 mm",
    color: "Deep Pink / Reddish Purple",
    createdAt: "2026-09-05",
    description: "Cured Grade-A Garwa onions, low moisture, ideal for premium institutional retail & long shelf storage."
  },
  {
    id: "LOT-NS-2026-042",
    farmerId: "FARMER-002",
    farmerName: "Sanjay Shinde",
    farmerPhone: "+91 94220 54129",
    farmerFpo: "Godavari Agro FPO",
    location: "Dindori, Nashik, Maharashtra",
    district: "nashik",
    category: "Vegetable",
    crop: "Tomato",
    cropMr: "टोमॅटो",
    cropId: "tomato",
    variety: "Abhinav Hybrid",
    quantity: 2500,
    unit: "KG",
    grade: "A",
    expectedPrice: 22,
    harvestDate: "2026-09-06",
    status: "Open",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546470427-227c7369a94d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&auto=format&fit=crop&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-freshly-harvested-ripe-tomatoes-42995-large.mp4",
    videoDuration: 52,
    qualityScore: 91,
    freshness: "94%",
    damagePercent: 3.2,
    bulbSize: "60-70 mm",
    color: "Glossy Uniform Red",
    createdAt: "2026-09-06",
    description: "Plump, firm skin hybrid tomatoes picked at breaker stage for 8+ day shelf life."
  },
  {
    id: "LOT-AH-2026-119",
    farmerId: "FARMER-003",
    farmerName: "Kishor Ghadge",
    farmerPhone: "+91 97632 88401",
    farmerFpo: "Pravara Farmers Producer Group",
    location: "Rahuri, Ahmednagar, Maharashtra",
    district: "ahmednagar",
    category: "Crop",
    crop: "Soybean",
    cropMr: "सोयाबीन",
    cropId: "soybean",
    variety: "JS 335",
    quantity: 4000,
    unit: "KG",
    grade: "B",
    expectedPrice: 47,
    harvestDate: "2026-09-01",
    status: "Deal Locked",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80"
    ],
    qualityScore: 86,
    freshness: "88%",
    damagePercent: 4.8,
    bulbSize: "Uniform Grains",
    color: "Yellowish Golden",
    createdAt: "2026-09-04",
    description: "Machine-cleaned oilseed soybean, certified moisture under 10%."
  },
  {
    id: "LOT-SL-2026-065",
    farmerId: "FARMER-004",
    farmerName: "Babanrao Chavan",
    farmerPhone: "+91 98811 72349",
    farmerFpo: "Solapur Organic Fruits Collective",
    location: "Pandharpur, Solapur, Maharashtra",
    district: "solapur",
    category: "Fruit",
    crop: "Pomegranate",
    cropMr: "डाळिंब",
    cropId: "pomegranate",
    variety: "Bhagwa",
    quantity: 1500,
    unit: "KG",
    grade: "A",
    expectedPrice: 115,
    harvestDate: "2026-09-04",
    status: "Open",
    image: "https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80"
    ],
    qualityScore: 96,
    freshness: "98%",
    damagePercent: 1.5,
    bulbSize: "280-350 g/fruit",
    color: "Deep Ruby Red",
    createdAt: "2026-09-07",
    description: "Export-grade Bhagwa pomegranates with soft arils and rich red colouration."
  }
];

// Price intelligence comparison channels for Pune Onion (1000 kg)
export const PRICE_CHANNELS_DEMO = [
  {
    id: "mandi-pune",
    name: "Pune APMC Mandi (Gultekdi)",
    type: "Local Mandi",
    distanceKm: 18,
    offeredRate: 23.00,
    transportCostTotal: 550,
    handlingMandiCess: 345, // 1.5% cess
    netRealisationPerKg: 22.10,
    netRealisationTotal: 22105,
    paymentTerm: "Physical cash / 7-14 days delayed voucher",
    buyerRating: 3.6,
    paymentReliability: "78%",
    isRecommended: false,
    channelTag: "Traditional Channel"
  },
  {
    id: "buyer-sahyadri",
    name: "Sahyadri Mega Food Park & Agro Processing",
    type: "Agro Processor & Exporter",
    distanceKm: 28,
    offeredRate: 28.00,
    transportCostTotal: 0, // Direct trade - buyer funds transport
    handlingMandiCess: 0, // Direct trade - 0% mandi cess
    netRealisationPerKg: 28.00,
    netRealisationTotal: 28000,
    paymentTerm: "AgriLink Escrow (instant release on delivery)",
    buyerRating: 4.9,
    paymentReliability: "99.2%",
    isRecommended: true,
    channelTag: "⭐ Best Net Realisation Channel"
  },
  {
    id: "buyer-reliance",
    name: "Reliance Fresh Direct Procurement Hub",
    type: "Organized Retail Chain",
    distanceKm: 22,
    offeredRate: 27.50,
    transportCostTotal: 0,
    handlingMandiCess: 0,
    netRealisationPerKg: 27.50,
    netRealisationTotal: 27500,
    paymentTerm: "T+1 Direct Bank Transfer via Escrow",
    buyerRating: 4.8,
    paymentReliability: "98.5%",
    isRecommended: false,
    channelTag: "Verified Institutional Buyer"
  },
  {
    id: "buyer-metro",
    name: "Metro Cash & Carry Wholesale Hub",
    type: "Cash & Carry Wholesaler",
    distanceKm: 15,
    offeredRate: 26.00,
    transportCostTotal: 0,
    handlingMandiCess: 0,
    netRealisationPerKg: 26.00,
    netRealisationTotal: 26000,
    paymentTerm: "Escrow Instant UPI Release",
    buyerRating: 4.6,
    paymentReliability: "96.0%",
    isRecommended: false,
    channelTag: "Wholesale Partner"
  },
  {
    id: "processor-chakan",
    name: "Dehydrated Onion Flakes Corp (Chakan)",
    type: "Dehydration Processing Plant",
    distanceKm: 34,
    offeredRate: 26.50,
    transportCostTotal: 0,
    handlingMandiCess: 0,
    netRealisationPerKg: 26.50,
    netRealisationTotal: 26500,
    paymentTerm: "Direct NEFT in 48 hours",
    buyerRating: 4.5,
    paymentReliability: "94.0%",
    isRecommended: false,
    channelTag: "Industrial Buyer"
  }
];

export const INITIAL_OFFERS = [
  {
    id: "OFFER-001",
    lotId: "LOT-PN-2026-081",
    buyerId: "BUYER-101",
    buyerName: "Sahyadri Mega Food Park",
    buyerType: "Agro Processor & Exporter",
    buyerLocation: "Chakan Industrial Zone, Pune",
    gstVerified: true,
    rating: 4.9,
    reliabilityScore: 99.2,
    offeredRate: 28.00, // per kg
    quantityRequested: 1000,
    totalOfferedAmount: 28000,
    estTransportCost: 0,
    netFarmerRealisation: 28000,
    netRatePerKg: 28.00,
    pickupDate: "2026-09-10",
    paymentTerms: "100% Escrow deposit locked upfront. Auto-release to farmer account upon digital delivery confirmation.",
    matchScore: 94, // 94/100
    matchBreakdown: {
      priceScore: "35 / 35",
      buyerReliability: "20 / 20",
      distanceScore: "12 / 15",
      paymentReliability: "15 / 15",
      demandMatch: "8 / 10",
      ratingScore: "4 / 5"
    },
    status: "Pending", // 'Pending', 'Accepted', 'Rejected', 'Countered'
    createdAt: "2026-09-06"
  },
  {
    id: "OFFER-002",
    lotId: "LOT-PN-2026-081",
    buyerId: "BUYER-102",
    buyerName: "Reliance Fresh Direct Hub",
    buyerType: "Organized Retail",
    buyerLocation: "Hadapsar Agro Hub, Pune",
    gstVerified: true,
    rating: 4.8,
    reliabilityScore: 98.5,
    offeredRate: 27.50,
    quantityRequested: 1000,
    totalOfferedAmount: 27500,
    estTransportCost: 0,
    netFarmerRealisation: 27500,
    netRatePerKg: 27.50,
    pickupDate: "2026-09-09",
    paymentTerms: "Escrow T+1 Direct Bank Transfer with instant weighing slip.",
    matchScore: 91,
    matchBreakdown: {
      priceScore: "33 / 35",
      buyerReliability: "19 / 20",
      distanceScore: "14 / 15",
      paymentReliability: "15 / 15",
      demandMatch: "7 / 10",
      ratingScore: "3 / 5"
    },
    status: "Pending",
    createdAt: "2026-09-06"
  },
  {
    id: "OFFER-003",
    lotId: "LOT-PN-2026-081",
    buyerId: "BUYER-103",
    buyerName: "Metro Cash & Carry Wholesale",
    buyerType: "Wholesale Superstore",
    buyerLocation: "Pimpri-Chinchwad, Pune",
    gstVerified: true,
    rating: 4.6,
    reliabilityScore: 96.0,
    offeredRate: 26.00,
    quantityRequested: 1000,
    totalOfferedAmount: 26000,
    estTransportCost: 0,
    netFarmerRealisation: 26000,
    netRatePerKg: 26.00,
    pickupDate: "2026-09-09",
    paymentTerms: "Instant UPI on gate inspection.",
    matchScore: 86,
    matchBreakdown: {
      priceScore: "29 / 35",
      buyerReliability: "18 / 20",
      distanceScore: "15 / 15",
      paymentReliability: "14 / 15",
      demandMatch: "7 / 10",
      ratingScore: "3 / 5"
    },
    status: "Pending",
    createdAt: "2026-09-07"
  }
];

export const VERIFIED_BUYERS_DIRECTORY = [
  {
    id: "BUYER-101",
    name: "Sahyadri Mega Food Park",
    category: "Agro Processor & Exporter",
    gstin: "27AABCS9182K1ZU",
    fssai: "10018022007891",
    location: "Chakan Industrial Zone, Pune",
    establishedYear: 2014,
    rating: 4.9,
    totalPurchasesMT: 14850,
    paymentReliability: 99.2,
    cancellationRate: "0.4%",
    riskLevel: "Low Risk",
    preferredCrops: ["Onion", "Tomato", "Pomegranate"],
    verifiedBadge: true
  },
  {
    id: "BUYER-102",
    name: "Reliance Fresh Direct Procurement Hub",
    category: "Organized Modern Retail",
    gstin: "27AAACR1209Q1ZM",
    fssai: "10014021000543",
    location: "Hadapsar Agro Logistics, Pune",
    establishedYear: 2006,
    rating: 4.8,
    totalPurchasesMT: 32400,
    paymentReliability: 98.5,
    cancellationRate: "0.8%",
    riskLevel: "Low Risk",
    preferredCrops: ["Onion", "Tomato", "Wheat", "Soybean"],
    verifiedBadge: true
  },
  {
    id: "BUYER-103",
    name: "Metro Cash & Carry Wholesale Hub",
    category: "Wholesaler / B2B",
    gstin: "27AABCM6491R1ZN",
    fssai: "10019011006120",
    location: "Pimpri-Chinchwad, Pune",
    establishedYear: 2011,
    rating: 4.6,
    totalPurchasesMT: 19800,
    paymentReliability: 96.0,
    cancellationRate: "1.2%",
    riskLevel: "Low Risk",
    preferredCrops: ["Onion", "Soybean", "Wheat"],
    verifiedBadge: true
  },
  {
    id: "BUYER-104",
    name: "Pune Agro Exports & Cold Chain",
    category: "Fresh Produce Exporter",
    gstin: "27AAGCP4512D1ZT",
    fssai: "10020022001490",
    location: "Marketyard, Pune",
    establishedYear: 2017,
    rating: 4.7,
    totalPurchasesMT: 8200,
    paymentReliability: 97.4,
    cancellationRate: "1.0%",
    riskLevel: "Low Risk",
    preferredCrops: ["Pomegranate", "Onion", "Grapes"],
    verifiedBadge: true
  }
];

export const TRANSPORT_PROVIDERS = [
  {
    id: "TRANS-201",
    providerName: "Kisan Express Agro Logistics",
    vehicleType: "Tata Ace Gold (Chhota Hathi)",
    vehicleRegNumber: "MH-12-QZ-4592",
    driverName: "Tukaram Shinde",
    driverPhone: "+91 94223 90812",
    capacityKg: 1500,
    ratePerKm: 18,
    baseFare: 300,
    currentLocation: "Haveli Toll Plaza (6 km away)",
    rating: 4.8,
    completedTrips: 342,
    hasGps: true,
    isInsured: true
  },
  {
    id: "TRANS-202",
    providerName: "Maharashtra Rural Carriers",
    vehicleType: "Mahindra Bolero Maxi Truck Plus",
    vehicleRegNumber: "MH-14-BT-3091",
    driverName: "Balu Gophane",
    driverPhone: "+91 98901 44102",
    capacityKg: 2500,
    ratePerKm: 22,
    baseFare: 450,
    currentLocation: "Wagholi Hub (12 km away)",
    rating: 4.7,
    completedTrips: 418,
    hasGps: true,
    isInsured: true
  },
  {
    id: "TRANS-203",
    providerName: "Sahyadri Cold Chain Express",
    vehicleType: "Refrigerated Container (Tata 407)",
    vehicleRegNumber: "MH-12-RC-8812",
    driverName: "Dnyaneshwar More",
    driverPhone: "+91 97621 11309",
    capacityKg: 3500,
    ratePerKm: 32,
    baseFare: 750,
    currentLocation: "Chakan Agro Hub (18 km away)",
    rating: 4.9,
    completedTrips: 520,
    hasGps: true,
    isInsured: true
  }
];

export const VEHICLE_OPTIONS = [
  {
    id: "VEH-ACE",
    name: "Tata Ace Gold (Chhota Hathi)",
    nameMr: "टाटा एस गोल्ड (छोटा हत्ती)",
    capacityKg: 1500,
    capacityDisplay: "1.5 Metric Ton",
    ratePerKm: 18,
    baseFare: 300,
    idealFor: "Small to Medium Lots (Vegetables, Onions)",
    imageIcon: "🚚",
    speed: "45 km/h",
    features: ["Farm-gate entry capable", "Fast loading", "GPS live tracking"]
  },
  {
    id: "VEH-BOLERO",
    name: "Mahindra Bolero Maxi Truck Plus",
    nameMr: "महिंद्रा बोलेरो मॅक्सी ट्रक",
    capacityKg: 2500,
    capacityDisplay: "2.5 Metric Ton",
    ratePerKm: 22,
    baseFare: 450,
    idealFor: "Medium Lots, Fruit Crates, Mandi Trips",
    imageIcon: "🚛",
    speed: "50 km/h",
    features: ["Heavy leaf spring", "Tarpaulin cover", "Semi-rural roads"]
  },
  {
    id: "VEH-EICHER",
    name: "Eicher Pro 14ft Canter",
    nameMr: "आयशर १४ फूट कॅन्टर",
    capacityKg: 5000,
    capacityDisplay: "5.0 Metric Ton",
    ratePerKm: 28,
    baseFare: 600,
    idealFor: "Bulk Grains, Large Onion Lots, FPO Aggregations",
    imageIcon: "🚚",
    speed: "55 km/h",
    features: ["High-side deck", "Weather-proof container", "Inter-district routes"]
  },
  {
    id: "VEH-REEFER",
    name: "Cold Chain Reefer (Refrigerated)",
    nameMr: "रेफ्रिजरेटेड शीतगृह व्हॅन",
    capacityKg: 3500,
    capacityDisplay: "3.5 Metric Ton",
    ratePerKm: 32,
    baseFare: 750,
    idealFor: "Tomatoes, Pomegranates, Fresh Cut Berries",
    imageIcon: "❄️",
    speed: "50 km/h",
    features: ["0°C to 4°C active cooling", "Humidity sensor", "Zero spoilage guarantee"]
  },
  {
    id: "VEH-TRACTOR",
    name: "Tractor Trolley (Rural Direct)",
    nameMr: "ट्रॅक्टर ट्रॉली (ग्रामीण थेट)",
    capacityKg: 3000,
    capacityDisplay: "3.0 Metric Ton",
    ratePerKm: 16,
    baseFare: 250,
    idealFor: "Direct Farm to Local APMC / Processing Hub",
    imageIcon: "🚜",
    speed: "25 km/h",
    features: ["Direct field access", "Cost effective", "Immediate local availability"]
  }
];

export const INITIAL_TRANSPORT_BOOKINGS = [
  {
    id: "TRB-901",
    orderId: "AGR10245",
    lotId: "LOT-PN-2026-081",
    offerId: "OFFER-001",
    crop: "Onion",
    quantityKg: 1000,
    buyerId: "BUYER-101",
    buyerName: "Sahyadri Mega Food Park",
    buyerPhone: "+91 98902 44100",
    farmerId: "FARMER-001",
    farmerName: "Ramesh Patil",
    farmerPhone: "+91 98220 14892",
    fromLocation: "Haveli Farm Gate, Pune",
    fromDistrict: "Pune",
    toLocation: "Sahyadri Mega Food Park, Chakan MIDC, Pune",
    toDistrict: "Pune",
    distanceKm: 28,
    estimatedDuration: "1 hr 15 mins",
    vehicleId: "VEH-ACE",
    vehicleType: "Tata Ace Gold (Chhota Hathi)",
    pickupDate: "2026-09-12",
    pickupTimeSlot: "Morning (08:00 AM - 11:00 AM)",
    calculatedFare: 804,
    offeredFare: 800,
    counterFare: null,
    counterReason: null,
    finalAgreedFare: 800,
    transporterId: "TRANS-201",
    transporterName: "Kisan Express Agro Logistics",
    vehicleRegNumber: "MH-12-QZ-4592",
    driverName: "Tukaram Shinde",
    driverPhone: "+91 94223 90812",
    status: "Confirmed",
    bookingType: "platform_transport",
    notes: "Handle with care, cured onion sacks.",
    createdAt: "2026-09-08"
  }
];


export const STORAGE_PROVIDERS = [
  {
    id: "STORE-301",
    facilityName: "Hadapsar Cold Vault & Warehousing",
    location: "Hadapsar Agro Park, Pune",
    distanceKm: 14,
    totalCapacityMT: 1200,
    availableCapacityMT: 450,
    costPerKgPerDay: 0.04, // 4 paise / kg / day = ₹40 / ton / day
    storageType: "Climate Controlled Cold Storage (0°C to 4°C)",
    humidity: "65-75% RH",
    rating: 4.8,
    insuranceCovered: true,
    accreditation: "WDRA Certified Warehouse",
    roiSummary: "Storing 1,000 KG Onion for 15 days costs ₹600. Projected price rise is +₹4.50/kg (+₹4,500). Net Gain: +₹3,900!"
  },
  {
    id: "STORE-302",
    facilityName: "Chakan Central Grain & Agro Silos",
    location: "Chakan MIDC Phase 2, Pune",
    distanceKm: 26,
    totalCapacityMT: 3500,
    availableCapacityMT: 1100,
    costPerKgPerDay: 0.035,
    storageType: "Ventilated Dry Agri Warehouse",
    humidity: "Standard Ambient",
    rating: 4.6,
    insuranceCovered: true,
    accreditation: "State Warehousing Corp Certified",
    roiSummary: "Ideal for grain & onion curing. 20-day storage fee: ₹700 per MT."
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TXN-2026-904",
    lotId: "LOT-PN-2026-075",
    buyerName: "Reliance Fresh Direct Hub",
    farmerName: "Ganesh Jagtap",
    crop: "Onion",
    quantity: 1200,
    unit: "KG",
    sellingRate: 27.00,
    grossAmount: 32400,
    transportCost: 0,
    netFarmerAmount: 32400,
    escrowStatus: "Completed",
    paymentDate: "2026-09-04",
    paymentMode: "Direct DBT Bank Transfer",
    utrNumber: "AGRILINK9048120094",
    invoiceUrl: "#"
  },
  {
    id: "TXN-2026-905",
    lotId: "LOT-NS-2026-039",
    buyerName: "Sahyadri Mega Food Park",
    farmerName: "Sunita More",
    crop: "Tomato",
    quantity: 2000,
    unit: "KG",
    sellingRate: 24.00,
    grossAmount: 48000,
    transportCost: 0,
    netFarmerAmount: 48000,
    escrowStatus: "Completed",
    paymentDate: "2026-09-03",
    paymentMode: "Instant Escrow UPI Release",
    utrNumber: "AGRILINK9051892301",
    invoiceUrl: "#"
  }
];

export const INITIAL_GRIEVANCES = [
  {
    id: "GRV-2026-104",
    ticketId: "TKT-MH-8812",
    raisedByRole: "farmer",
    userName: "Ramesh Patil",
    category: "Transport delay",
    relatedLotId: "LOT-PN-2026-071",
    description: "Driver delayed pickup by 3.5 hours due to vehicle puncture on Pune-Solapur highway.",
    status: "Resolved",
    priority: "Medium",
    evidenceFile: "toll_slip_receipt.jpg",
    resolutionNotes: "Transporter penalized ₹350 rebate credited to farmer as compensation.",
    createdAt: "2026-09-01",
    resolvedAt: "2026-09-02"
  },
  {
    id: "GRV-2026-108",
    ticketId: "TKT-MH-8834",
    raisedByRole: "buyer",
    userName: "Sahyadri Mega Food Park",
    category: "Quality dispute",
    relatedLotId: "LOT-NS-2026-038",
    description: "Gate sampling identified 5.8% damage vs declared 2.5% in AI quality report.",
    status: "Investigating",
    priority: "High",
    evidenceFile: "sampling_report_gate.pdf",
    resolutionNotes: "Third-party Mandi Assessor assigned for physical verification.",
    createdAt: "2026-09-05",
    resolvedAt: null
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-01",
    title: "New Buyer Offer Received!",
    titleMr: "नवीन खरेदी प्रस्ताव आला आहे!",
    message: "Sahyadri Mega Food Park offered ₹28/KG for 1000 KG Onion (Lot #LOT-PN-2026-081).",
    time: "10 mins ago",
    unread: true,
    type: "offer"
  },
  {
    id: "NOTIF-02",
    title: "AI Price Alert: Onion Trend Upward",
    titleMr: "एआय भाव इशारा: कांद्याचे दर वाढण्याचे संकेत",
    message: "Arrival volume in Pune dropped by 18%. Price projected to increase to ₹28.50/KG.",
    time: "1 hour ago",
    unread: true,
    type: "price"
  },
  {
    id: "NOTIF-03",
    title: "Escrow Deposit Verified",
    titleMr: "एस्क्रो डिपॉझिट खात्री झाली आहे",
    message: "Buyer deposited ₹28,000 in AgriLink Escrow Vault. Safe to initiate pickup.",
    time: "3 hours ago",
    unread: false,
    type: "escrow"
  }
];

// 7-day Historical + 7-day Projected AI Price Curve (Pune Onion)
export const ONION_PRICE_CHART_DATA = [
  { day: "Aug 26", actual: 21.5, projected: null, arrivalMT: 1250 },
  { day: "Aug 28", actual: 22.0, projected: null, arrivalMT: 1180 },
  { day: "Aug 30", actual: 22.8, projected: null, arrivalMT: 1100 },
  { day: "Sep 01", actual: 23.2, projected: null, arrivalMT: 980 },
  { day: "Sep 03", actual: 23.5, projected: null, arrivalMT: 920 },
  { day: "Sep 05", actual: 24.2, projected: null, arrivalMT: 860 },
  { day: "Sep 07 (Today)", actual: 24.8, projected: 24.8, arrivalMT: 810 },
  { day: "Sep 09 (+2d)", actual: null, projected: 26.2, arrivalMT: 740 },
  { day: "Sep 11 (+4d)", actual: null, projected: 27.5, arrivalMT: 690 },
  { day: "Sep 13 (+6d)", actual: null, projected: 28.6, arrivalMT: 650 },
  { day: "Sep 15 (+8d)", actual: null, projected: 28.9, arrivalMT: 670 }
];
