const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { isLoggedIn } = require('../middleware/auth');

// ─── GET PERSONALIZED RECIPES ────────────────────────────────

router.get('/api/recipes/personalized', isLoggedIn, async (req, res) => {
  try {
    const db = getDb();
    
    // Get user profile
    const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(req.session.userId);
    
    // Get user ingredients
    const ingredients = db.prepare('SELECT name FROM ingredients WHERE user_id = ?').all(req.session.userId);
    
    if (!profile || ingredients.length === 0) {
      return res.json({ success: true, data: [], message: 'Add ingredients to get personalized recipes' });
    }

    // Build query parameters for recipe API
    const allergies = profile.allergies ? profile.allergies.split(',').map(a => a.trim().toLowerCase()) : [];
    const dietary = profile.dietary_preference || '';
    
    // For now, return recipes from TheMealDB filtered by dietary preference
    // In production, you'd integrate with a more sophisticated API or AI
    const recipes = [];
    
    res.json({ 
      success: true, 
      data: recipes,
      userPreferences: {
        allergies,
        dietary,
        servingSize: profile.serving_size
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── SAVE RECIPE ─────────────────────────────────────────────

router.post('/api/recipes', isLoggedIn, (req, res) => {
  try {
    const { title, ingredients, instructions, calories, protein, carbs, fat, fiber, servings, allergens } = req.body;
    
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO recipes (user_id, title, ingredients, instructions, calories, protein, carbs, fat, fiber, servings, allergens)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.session.userId,
      title,
      JSON.stringify(ingredients),
      instructions,
      calories || 0,
      protein || 0,
      carbs || 0,
      fat || 0,
      fiber || 0,
      servings || 1,
      allergens || ''
    );

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET USER RECIPES ────────────────────────────────────────

router.get('/api/recipes', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    const recipes = db.prepare('SELECT * FROM recipes WHERE user_id = ? ORDER BY created_at DESC').all(req.session.userId);
    res.json({ success: true, data: recipes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
