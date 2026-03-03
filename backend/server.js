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
const PORT = process.env.PORT || 3000; // 🔥 IMPORTANT for Azure

/* ================= MONGODB ================= */

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

/* ================= EXPRESS ================= */

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* ================= IN-MEMORY BUFFER ================= */

const recentReadings = [];
const MAX_RECENT = parseInt(process.env.MAX_RECENT_READINGS) || 5000;

/* ================= IOT ROUTES ================= */

app.post("/iot/reading", async (req, res) => {
  try {
    const { deviceId, exercise, variation, rawValue, maxValue } = req.body;

    if (typeof rawValue !== "number" || typeof maxValue !== "number") {
      return res.status(400).json({ ok: false, error: "Invalid data format" });
    }

    const percentage = Math.max(0, Math.min(100, (rawValue / maxValue) * 100));

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
    if (recentReadings.length > MAX_RECENT) {
      recentReadings.length = MAX_RECENT;
    }

    console.log("📡 IoT Reading:", rawValue);

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error("❌ HTTP Error:", err.message);
    res.status(500).json({ ok: false });
  }
});

/* ================= GET LATEST ================= */

app.get("/iot/latest", async (req, res) => {
  try {

    if (recentReadings.length > 0) {
      return res.json({ ok: true, data: recentReadings[0] });
    }

    const latest = await Variation.findOne().sort({ timestamp: -1 });

    if (!latest) {
      return res.json({ ok: true, data: null });
    }

    res.json({ ok: true, data: latest });

  } catch (err) {
    console.error("❌ Latest Error:", err.message);
    res.status(500).json({ ok: false });
  }
});

/* ================= DASHBOARD ================= */

app.get('/api/dashboard', async (req, res) => {
  try {

    if (recentReadings.length > 0) {

      const map = new Map();

      for (const r of recentReadings) {
        const key = `${r.exercise}||${r.variation}`;

        if (!map.has(key)) {
          map.set(key, {
            exercise: r.exercise,
            variation: r.variation,
            sum: 0,
            count: 0
          });
        }

        const entry = map.get(key);
        entry.sum += r.percentage;
        entry.count += 1;
      }

      const aggr = Array.from(map.values()).map(v => ({
        _id: { exercise: v.exercise, variation: v.variation },
        avg: v.sum / v.count,
        count: v.count
      }));

      aggr.sort((a, b) =>
        a._id.exercise.localeCompare(b._id.exercise) || b.avg - a.avg
      );

      return res.json({ ok: true, data: aggr });
    }

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

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ================= AUTH ================= */

app.use('/api/auth', authRoutes);

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ ok: false });
    res.json({ ok: true, user });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

/* ================= GEMINI ================= */

app.post('/api/generate-plan', async (req, res) => {
  try {

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        ok: false,
        error: 'GEMINI_API_KEY not set'
      });
    }

    const output = await generatePlan(req.body);

    res.json({ ok: true, plan: output });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ================= SERVE FRONTEND ================= */

// 🔥 ALWAYS serve React build (no NODE_ENV check)
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

/* ================= START SERVER ================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});