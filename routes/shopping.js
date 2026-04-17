const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { isLoggedIn } = require('../middleware/auth');

// ─── GET SHOPPING LIST ───────────────────────────────────────

router.get('/api/shopping-list', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    const items = db.prepare(`
      SELECT * FROM shopping_lists 
      WHERE user_id = ? 
      ORDER BY checked ASC, created_at DESC
    `).all(req.session.userId);
    
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ADD TO SHOPPING LIST ────────────────────────────────────

router.post('/api/shopping-list', isLoggedIn, (req, res) => {
  try {
    const { ingredient_name, quantity, unit } = req.body;
    
    if (!ingredient_name || !quantity || !unit) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO shopping_lists (user_id, ingredient_name, quantity, unit)
      VALUES (?, ?, ?, ?)
    `).run(req.session.userId, ingredient_name, quantity, unit);
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── TOGGLE CHECKED ──────────────────────────────────────────

router.patch('/api/shopping-list/:id/toggle', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    const item = db.prepare('SELECT checked FROM shopping_lists WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
    
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    const newChecked = item.checked ? 0 : 1;
    db.prepare('UPDATE shopping_lists SET checked = ? WHERE id = ?').run(newChecked, req.params.id);
    
    res.json({ success: true, checked: newChecked });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── DELETE FROM SHOPPING LIST ───────────────────────────────

router.delete('/api/shopping-list/:id', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM shopping_lists WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── CLEAR CHECKED ITEMS ─────────────────────────────────────

router.delete('/api/shopping-list/clear-checked', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM shopping_lists WHERE user_id = ? AND checked = 1').run(req.session.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
