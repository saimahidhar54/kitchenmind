const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../database');
const { isGuest } = require('../middleware/auth');

// ─── REGISTER ────────────────────────────────────────────────

router.get('/register', isGuest, (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/register');
  }

  const { username, email, password } = req.body;

  try {
    const db = getDb();
    
    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existingUser) {
      req.flash('error', 'Username or email already exists');
      return res.redirect('/register');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(username, email, hashedPassword);

    // Create default profile
    db.prepare(`
      INSERT INTO user_profiles (user_id, daily_calories, daily_protein, daily_carbs, daily_fat, serving_size)
      VALUES (?, 2000, 50, 250, 70, 1)
    `).run(result.lastInsertRowid);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
});

// ─── LOGIN ───────────────────────────────────────────────────

router.get('/login', isGuest, (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/login');
  }

  const { email, password } = req.body;

  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;

    req.flash('success', `Welcome back, ${user.username}!`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Login failed. Please try again.');
    res.redirect('/login');
  }
});

// ─── LOGOUT ──────────────────────────────────────────────────

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
