require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns'); 
dns.setServers(["8.8.8.8"]);

const { Variation, User } = require('./models');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const { generatePlan } = require('./services/geminiService');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fsr_fitness';
const PORT = process.env.PORT || 8080;

/* ================= MONGODB ================= */

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error', err));

/* ================= EXPRESS ================= */

const app = express();
// since frontend will be served from same origin, simple CORS or none
app.use(cors());
app.use(bodyParser.json());

// In-memory buffer for incoming IoT readings (no DB writes)
const recentReadings = [];
const MAX_RECENT = parseInt(process.env.MAX_RECENT_READINGS) || 5000; // cap to avoid memory blowup
/* ================= IOT HTTP ROUTE ================= */

app.post("/iot/reading", async (req, res) => {
  try {
    const { deviceId, exercise, variation, rawValue, maxValue } = req.body;

    if (typeof rawValue !== "number" || typeof maxValue !== "number") {
      return res.status(400).json({ ok: false, error: "Invalid data format" });
    }

    const percentage = Math.max(0, Math.min(100, (rawValue / maxValue) * 100));

    // Push to in-memory buffer instead of persisting to DB
    const record = {
      _id: Date.now().toString(),
      deviceId: deviceId || 'esp',
      exercise: exercise || 'unknown',
      variation: variation || 'default',
      rawValue,
      maxValue,
      percentage,
      timestamp: new Date()
    };

    recentReadings.unshift(record);
    if (recentReadings.length > MAX_RECENT) recentReadings.length = MAX_RECENT;

    console.log('✅ In-memory reading:', record.rawValue);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ HTTP Error:', err.message);
    res.status(500).json({ ok: false });
  }
});

/* ================= GET LATEST READING ================= */

app.get("/iot/latest", async (req, res) => {
  try {
    if (recentReadings.length > 0) {
      return res.json({ ok: true, data: recentReadings[0] });
    }
    // fallback to DB if in-memory is empty (older data)
    const latest = await Variation.findOne().sort({ timestamp: -1 });
    if (!latest) return res.json({ ok: true, data: null });
    res.json({ ok: true, data: latest });
  } catch (err) {
    console.error("❌ Error fetching latest:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ================= DASHBOARD ================= */

app.get('/api/dashboard', async (req, res) => {
  try {
    // If we have recent in-memory readings, aggregate from them
    if (recentReadings.length > 0) {
      const map = new Map();
      for (const r of recentReadings) {
        const key = `${r.exercise}||${r.variation}`;
        if (!map.has(key)) map.set(key, { exercise: r.exercise, variation: r.variation, sum: 0, count: 0 });
        const ent = map.get(key);
        ent.sum += (typeof r.percentage === 'number') ? r.percentage : 0;
        ent.count += 1;
      }
      const aggr = Array.from(map.values()).map(v => ({ _id: { exercise: v.exercise, variation: v.variation }, avg: v.sum / v.count, count: v.count }));
      aggr.sort((a,b) => a._id.exercise.localeCompare(b._id.exercise) || b.avg - a.avg);
      return res.json({ ok: true, data: aggr });
    }

    // Fallback: aggregate from DB for historical data
    const aggr = await Variation.aggregate([
      { 
        $group: { 
          _id: { exercise: '$exercise', variation: '$variation' }, 
          avg: { $avg: '$percentage' }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { '_id.exercise': 1, avg: -1 } }
    ]);

    res.json({ ok: true, data: aggr });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ================= AUTH ROUTES ================= */

app.use('/api/auth', authRoutes);

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select('-password');
    if (!u) return res.status(404).json({ ok: false });
    res.json({ ok: true, user: u });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ================= GEMINI ROUTE ================= */

app.post('/api/generate-plan', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ ok: false, error: 'GEMINI_API_KEY not set' });
    }

    const output = await generatePlan(req.body);
    res.json({ ok: true, plan: output });

  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ================= START SERVER ================= */

// serve client build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HTTP Server running on port ${PORT}`);
});