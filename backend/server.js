require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const Code = require('./models/Code');
const Redemption = require('./models/Redemption');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/redeemDB';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

// Reward pool
const rewards = [
  "🎁 Free Extra Glass!",
  "💸 Product worth $20!",
  "🛍️ 10% discount on any one product!"
];

// Public redeem endpoint
app.post('/api/redeem', async (req, res) => {
  try {
    const { name, phone, code } = req.body;
    if (!name || !phone || !code) return res.status(400).json({ message: 'All fields required.' });

    const found = await Code.findOne({ code: code.toUpperCase() });
    if (!found) return res.status(404).json({ message: 'Invalid code.' });
    if (found.isUsed) return res.status(400).json({ message: 'Code already used.' });

    // Determine reward (for example, 50% chance)
    const isLucky = Math.random() < 0.5;
    const reward = isLucky ? rewards[Math.floor(Math.random() * rewards.length)] : '😢 Better luck next time.';

    // Mark used and save redemption
    found.isUsed = true;
    found.redeemedAt = new Date();
    found.reward = reward;
    await found.save();

    const redemption = new Redemption({ name, phone, code: found.code, reward });
    await redemption.save();

    res.json({ message: reward });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin login (simple: compare password from env)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'password123';

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '8h' });
  res.json({ token });
});

// Protected admin routes
app.get('/api/admin/codes', auth, async (req, res) => {
  const codes = await Code.find().sort({ isUsed: 1, code: 1 });
  res.json(codes);
});

app.post('/api/admin/codes', auth, async (req, res) => {
  // Accept array of codes or single code
  const { codes } = req.body;
  if (!codes || !Array.isArray(codes)) return res.status(400).json({ message: 'Provide codes array' });

  const docs = codes.map(c => ({ code: c.toUpperCase().trim() }));
  await Code.insertMany(docs, { ordered: false }).catch(e => {/* ignore duplicates */});
  res.json({ message: 'Codes added' });
});

app.get('/api/admin/redemptions', auth, async (req, res) => {
  const list = await Redemption.find().sort({ date: -1 }).limit(1000);
  res.json(list);
});

app.put('/api/admin/code/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { isUsed } = req.body;
  const code = await Code.findById(id);
  if (!code) return res.status(404).json({ message: 'Not found' });
  code.isUsed = !!isUsed;
  if (isUsed) code.redeemedAt = code.redeemedAt || new Date();
  await code.save();
  res.json({ message: 'Updated' });
});

// Seed endpoint (for dev) to add sample codes (protected)
app.post('/api/admin/seed', auth, async (req, res) => {
  const sample = [
    '0RIQ-3C9X-X3J5-T6UM',
    'IVTG-FGJB-MJ1R-V3NK',
    '2UQD-Z4IF-1LKH-QLSB',
    'EQ23-PS22-AWFX-SOPG',
    '2EJJ-1OFR-RZU1-224O',
    '3OSP-TOGR-5WKQ-LGPA',
    'F2J6-85Q4-ZWVP-IGTY',
    'HN3M-Y9HO-50W9-3ACZ',
    'X3XE-HRQ6-10D9-FVZR'
  ];
  const docs = sample.map(c => ({ code: c }));
  await Code.insertMany(docs, { ordered: false }).catch(()=>{});
  res.json({ message: 'Seeded' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server listening on', PORT));
