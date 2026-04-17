const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const { getDb } = require('./database');
const { getNutrients } = require('./utils/nutrition');
const { attachUser, isLoggedIn } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'kitchenmind-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

app.use(flash());
app.use(attachUser);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── ROUTES ──────────────────────────────────────────────────────────

// Import route modules
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const recipeRoutes = require('./routes/recipes');
const mealplanRoutes = require('./routes/mealplan');
const shoppingRoutes = require('./routes/shopping');

// Use routes
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', recipeRoutes);
app.use('/', mealplanRoutes);
app.use('/', shoppingRoutes);

// Landing page (public)
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('landing', { title: 'KitchenMind - Smart Kitchen Management' });
});

// Dashboard (protected)
app.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

// ─── API: INGREDIENTS CRUD ───────────────────────────────────────────

// GET all ingredients (user-specific)
app.get('/api/ingredients', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM ingredients WHERE user_id = ? ORDER BY expiry_date ASC').all(req.session.userId);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single ingredient
app.get('/api/ingredients/:id', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM ingredients WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
    if (!row) return res.status(404).json({ success: false, error: 'Ingredient not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST new ingredient
app.post('/api/ingredients', isLoggedIn, (req, res) => {
  try {
    const { name, quantity, unit, category, expiry_date, notes } = req.body;
    if (!name || !quantity || !unit || !category || !expiry_date) {
      return res.status(400).json({ success: false, error: 'All required fields must be provided.' });
    }
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO ingredients (user_id, name, quantity, unit, category, expiry_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.session.userId, name, quantity, unit, category, expiry_date, notes || '');

    const newItem = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update ingredient
app.put('/api/ingredients/:id', isLoggedIn, (req, res) => {
  try {
    const { name, quantity, unit, category, expiry_date, notes } = req.body;
    if (!name || !quantity || !unit || !category || !expiry_date) {
      return res.status(400).json({ success: false, error: 'All required fields must be provided.' });
    }
    const db = getDb();
    const existing = db.prepare('SELECT * FROM ingredients WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
    if (!existing) return res.status(404).json({ success: false, error: 'Ingredient not found' });

    db.prepare(`
      UPDATE ingredients SET name = ?, quantity = ?, unit = ?, category = ?, expiry_date = ?, notes = ?
      WHERE id = ? AND user_id = ?
    `).run(name, quantity, unit, category, expiry_date, notes || '', req.params.id, req.session.userId);

    const updated = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE ingredient
app.delete('/api/ingredients/:id', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM ingredients WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
    if (!existing) return res.status(404).json({ success: false, error: 'Ingredient not found' });

    db.prepare('DELETE FROM ingredients WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
    res.json({ success: true, message: 'Ingredient deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── API: RESCUE MY FOOD (near-expiry items) ────────────────────────

app.get('/api/rescue', isLoggedIn, (req, res) => {
  try {
    const db = getDb();
    // Items expiring within 3 days
    const rows = db.prepare(`
      SELECT * FROM ingredients
      WHERE user_id = ? AND date(expiry_date) <= date('now', '+3 days')
      ORDER BY expiry_date ASC
    `).all(req.session.userId);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/generate-recipe', async (req, res) => {
  const { goal, dietary, ingredients } = req.body;
  // e.g. goal = "high protein", dietary = "vegetarian"

  // 1. Generate recipe with Claude (Anthropic API)
  const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Generate a ${goal} ${dietary} recipe using: ${ingredients}.
                  Return JSON: { title, ingredients: [], instructions, servings }`
      }]
    })
  });

  const recipeData = JSON.parse(aiResponse.content[0].text);

  // 2. Get nutrient breakdown
  const nutrients = await getNutrients(recipeData.ingredients);

  // 3. Save to DB
  const stmt = db.prepare(`
    INSERT INTO recipes (title, ingredients, instructions, calories, protein, carbs, fat, fiber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    recipeData.title,
    JSON.stringify(recipeData.ingredients),
    recipeData.instructions,
    nutrients.calories, nutrients.protein, nutrients.carbs, nutrients.fat, nutrients.fiber
  );

  res.json({ recipe: recipeData, nutrients, id: result.lastInsertRowid });
});


// Log a meal
app.post('/log-meal', (req, res) => {
  const { userId, recipeId, servings } = req.body;
  db.prepare(`INSERT INTO nutrition_log (user_id, recipe_id, servings) VALUES (?, ?, ?)`)
    .run(userId, recipeId, servings);
  res.json({ success: true });
});

// Get today's totals
app.get('/nutrition-summary/:userId', (req, res) => {
  const summary = db.prepare(`
    SELECT 
      SUM(r.calories * l.servings) AS total_calories,
      SUM(r.protein  * l.servings) AS total_protein,
      SUM(r.carbs    * l.servings) AS total_carbs,
      SUM(r.fat      * l.servings) AS total_fat
    FROM nutrition_log l
    JOIN recipes r ON r.id = l.recipe_id
    WHERE l.user_id = ? AND l.date = date('now')
  `).get(req.params.userId);
  res.json(summary);
});

// ─── START SERVER ────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🍳 KitchenMind is running at http://localhost:${PORT}\n`);
});
