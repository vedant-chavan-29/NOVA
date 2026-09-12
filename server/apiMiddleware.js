import { databaseService } from './databaseService.js';

const parseJsonBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 15 * 1024 * 1024) { // 15MB limit for image uploads
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
};

const sendJson = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
};

export const apiMiddleware = async (req, res, next) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  const url = req.url || '';

  // Skip fast2sms proxy route (handled by Vite proxy or separate handler)
  if (url.startsWith('/api/fast2sms')) {
    return next();
  }

  // Only handle /api/ routes
  if (!url.startsWith('/api/')) {
    return next();
  }

  const pathName = url.split('?')[0];

  try {
    // 1. GET /api/data - Full database fetch
    if (req.method === 'GET' && pathName === '/api/data') {
      const allData = databaseService.getAllData();
      return sendJson(res, 200, {
        success: true,
        serverTime: Date.now(),
        data: allData
      });
    }

    // 2. POST /api/lots - Create or update crop lot
    if (req.method === 'POST' && pathName === '/api/lots') {
      const lot = await parseJsonBody(req);
      if (!lot || !lot.id) {
        return sendJson(res, 400, { success: false, error: 'Invalid lot data' });
      }
      const saved = databaseService.saveLot(lot);
      return sendJson(res, 200, { success: true, lot: saved });
    }

    // 3. DELETE /api/lots/:id - Delete lot
    if (req.method === 'DELETE' && pathName.startsWith('/api/lots/')) {
      const lotId = pathName.replace('/api/lots/', '');
      const result = databaseService.deleteLot(lotId);
      return sendJson(res, 200, result);
    }

    // 4. POST /api/users - Register or update user profile
    if (req.method === 'POST' && pathName === '/api/users') {
      const user = await parseJsonBody(req);
      if (!user) {
        return sendJson(res, 400, { success: false, error: 'Invalid user data' });
      }
      const saved = databaseService.saveUser(user);
      return sendJson(res, 200, { success: true, user: saved });
    }

    // 5. POST /api/offers - Create or update buyer offer
    if (req.method === 'POST' && pathName === '/api/offers') {
      const offer = await parseJsonBody(req);
      if (!offer || !offer.id) {
        return sendJson(res, 400, { success: false, error: 'Invalid offer data' });
      }
      const saved = databaseService.saveOffer(offer);
      return sendJson(res, 200, { success: true, offer: saved });
    }

    // 6. POST /api/orders - Create or update order
    if (req.method === 'POST' && pathName === '/api/orders') {
      const order = await parseJsonBody(req);
      if (!order || !order.id) {
        return sendJson(res, 400, { success: false, error: 'Invalid order data' });
      }
      const saved = databaseService.saveOrder(order);
      return sendJson(res, 200, { success: true, order: saved });
    }

    // 7. POST /api/transactions - Record financial transaction
    if (req.method === 'POST' && pathName === '/api/transactions') {
      const txn = await parseJsonBody(req);
      if (!txn || !txn.id) {
        return sendJson(res, 400, { success: false, error: 'Invalid transaction data' });
      }
      const saved = databaseService.saveTransaction(txn);
      return sendJson(res, 200, { success: true, transaction: saved });
    }

    // 8. POST /api/activity - Record audit/activity item
    if (req.method === 'POST' && pathName === '/api/activity') {
      const act = await parseJsonBody(req);
      const saved = databaseService.saveActivity(act);
      return sendJson(res, 200, { success: true, activity: saved });
    }

    // 9. POST /api/sync - Bidirectional synchronization
    if (req.method === 'POST' && pathName === '/api/sync') {
      const payload = await parseJsonBody(req);
      const result = databaseService.sync(payload || {});
      return sendJson(res, 200, result);
    }

    // 10. GET /api/health - Health check
    if (req.method === 'GET' && pathName === '/api/health') {
      return sendJson(res, 200, { status: 'healthy', time: Date.now() });
    }

    return next();
  } catch (err) {
    console.error('[API Middleware Error]:', err);
    return sendJson(res, 500, { success: false, error: err.message });
  }
};

export default apiMiddleware;
