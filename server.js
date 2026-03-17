const express = require('express');
const path = require('path');
const cors = require('cors');
const { getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── ROUTES ──────────────────────────────────────────────────────────

// Main page
app.get('/', (req, res) => {
  res.render('index', { title: 'KitchenMind' });
});

// ─── API: INGREDIENTS CRUD ───────────────────────────────────────────

// GET all ingredients
app.get('/api/ingredients', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM ingredients ORDER BY expiry_date ASC').all();
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single ingredient
app.get('/api/ingredients/:id', (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Ingredient not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST new ingredient
app.post('/api/ingredients', (req, res) => {
  try {
    const { name, quantity, unit, category, expiry_date, notes } = req.body;
    if (!name || !quantity || !unit || !category || !expiry_date) {
      return res.status(400).json({ success: false, error: 'All required fields must be provided.' });
    }
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO ingredients (name, quantity, unit, category, expiry_date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, quantity, unit, category, expiry_date, notes || '');

    const newItem = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update ingredient
app.put('/api/ingredients/:id', (req, res) => {
  try {
    const { name, quantity, unit, category, expiry_date, notes } = req.body;
    if (!name || !quantity || !unit || !category || !expiry_date) {
      return res.status(400).json({ success: false, error: 'All required fields must be provided.' });
    }
    const db = getDb();
    const existing = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Ingredient not found' });

    db.prepare(`
      UPDATE ingredients SET name = ?, quantity = ?, unit = ?, category = ?, expiry_date = ?, notes = ?
      WHERE id = ?
    `).run(name, quantity, unit, category, expiry_date, notes || '', req.params.id);

    const updated = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE ingredient
app.delete('/api/ingredients/:id', (req, res) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Ingredient not found' });

    db.prepare('DELETE FROM ingredients WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Ingredient deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── API: RESCUE MY FOOD (near-expiry items) ────────────────────────

app.get('/api/rescue', (req, res) => {
  try {
    const db = getDb();
    // Items expiring within 3 days
    const rows = db.prepare(`
      SELECT * FROM ingredients
      WHERE date(expiry_date) <= date('now', '+3 days')
      ORDER BY expiry_date ASC
    `).all();
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── START SERVER ────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🍳 KitchenMind is running at http://localhost:${PORT}\n`);
});
