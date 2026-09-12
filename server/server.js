import express from 'express';
import cors from 'cors';
import { databaseService } from './databaseService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with 25MB limit for high-res produce camera uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request Logging Middleware with Visual Status Tags
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toLocaleTimeString();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';
    console.log(`[${timestamp}] ${statusColor} ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// --- API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AgriLink Express Backend API Server',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 1. GET /api/data - Fetch Complete Database
app.get('/api/data', (req, res) => {
  try {
    const data = databaseService.getAllData();
    res.json({
      success: true,
      serverTime: Date.now(),
      data
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/lots - Create or Update Crop Lot
app.post('/api/lots', (req, res) => {
  try {
    const lot = req.body;
    if (!lot || !lot.id) {
      return res.status(400).json({ success: false, error: 'Lot ID and details are required' });
    }
    const saved = databaseService.saveLot(lot);
    console.log(`🌱 [CROP LOT SAVED] Lot #${saved.id} (${saved.crop} - ${saved.quantity} ${saved.unit || 'KG'}) by ${saved.farmerName || 'Farmer'}`);
    res.status(201).json({ success: true, lot: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. DELETE /api/lots/:id - Delete Crop Lot
app.delete('/api/lots/:id', (req, res) => {
  try {
    const lotId = req.params.id;
    const result = databaseService.deleteLot(lotId);
    console.log(`🗑️ [CROP LOT DELETED] Lot #${lotId} removed`);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. POST /api/users - Register or Update User Account
app.post('/api/users', (req, res) => {
  try {
    const user = req.body;
    if (!user) {
      return res.status(400).json({ success: false, error: 'User data required' });
    }
    const saved = databaseService.saveUser(user);
    console.log(`👤 [USER ACTIVE] ${saved.name} (${saved.role.toUpperCase()}) - ${saved.email || saved.phone}`);
    res.json({ success: true, user: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /api/offers - Create or Update Buyer Offer
app.post('/api/offers', (req, res) => {
  try {
    const offer = req.body;
    if (!offer || !offer.id) {
      return res.status(400).json({ success: false, error: 'Offer data required' });
    }
    const saved = databaseService.saveOffer(offer);
    console.log(`💼 [OFFER PLACED] Offer #${saved.id} of ₹${saved.offeredRate}/KG by ${saved.buyerName} on Lot #${saved.lotId}`);
    res.json({ success: true, offer: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/orders - Record Order Status
app.post('/api/orders', (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.id) {
      return res.status(400).json({ success: false, error: 'Order data required' });
    }
    const saved = databaseService.saveOrder(order);
    console.log(`📦 [ORDER STATUS] Order #${saved.id}: ${saved.status}`);
    res.json({ success: true, order: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. POST /api/transactions - Record Financial Escrow / DBT
app.post('/api/transactions', (req, res) => {
  try {
    const txn = req.body;
    if (!txn || !txn.id) {
      return res.status(400).json({ success: false, error: 'Transaction data required' });
    }
    const saved = databaseService.saveTransaction(txn);
    console.log(`💰 [ESCROW TRANSACTION] Txn #${saved.id} amount ₹${saved.netFarmerAmount || saved.grossAmount} (${saved.escrowStatus})`);
    res.json({ success: true, transaction: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. POST /api/activity - Record Platform Activity
app.post('/api/activity', (req, res) => {
  try {
    const saved = databaseService.saveActivity(req.body);
    res.json({ success: true, activity: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. POST /api/sync - Bidirectional Full Sync
app.post('/api/sync', (req, res) => {
  try {
    const result = databaseService.sync(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start listening if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
================================================================
🌾 AgriLink Express Backend API Server Attached & Running
================================================================
📡 Local API:     http://localhost:${PORT}/api/data
🌐 Network API:   http://0.0.0.0:${PORT}/api/data
🗄️ Database:      server/database.json (Persistent Store)
🔒 Master Admin:  vedantkchavan2006@gmail.com / 8482941628
🚀 Microservices: Crops, Offers, Escrow, Orders, Transporters
================================================================
`);
  });
}

export default app;
