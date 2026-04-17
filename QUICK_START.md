# ⚡ KitchenMind - Quick Start Guide

## 🚀 Get Running in 3 Steps

### Step 1: Install Dependencies (1 minute)
```bash
npm install
```

### Step 2: Start the Server (5 seconds)
```bash
npm start
```

### Step 3: Open Browser
Navigate to: **http://localhost:3000**

---

## 🎯 First-Time Demo Setup (5 minutes)

### 1. Register a Test Account
- Click "Get Started"
- Username: `demo_user`
- Email: `demo@kitchenmind.com`
- Password: `demo123`
- Click "Register"

### 2. Login
- Email: `demo@kitchenmind.com`
- Password: `demo123`
- Click "Login"

### 3. Set Up Profile
- Click "Profile" in navbar
- Set nutritional goals:
  - Calories: 2200
  - Protein: 60g
  - Carbs: 275g
  - Fat: 75g
- Serving size: 2 people
- Allergies: `peanuts, shellfish`
- Dietary preference: `Vegetarian`
- Click "Save Changes"

### 4. Add Sample Ingredients

**Ingredient 1 (Expiring Today):**
- Name: Milk
- Quantity: 1
- Unit: litre
- Category: Dairy
- Expiry: [Today's date]
- Notes: Full cream

**Ingredient 2 (Expiring Soon):**
- Name: Tomatoes
- Quantity: 6
- Unit: pcs
- Category: Vegetables
- Expiry: [Tomorrow's date]
- Notes: Fresh

**Ingredient 3 (Fresh):**
- Name: Rice
- Quantity: 2
- Unit: kg
- Category: Grains
- Expiry: [30 days from now]
- Notes: Basmati

**Ingredient 4 (Use Soon):**
- Name: Chicken Breast
- Quantity: 500
- Unit: grams
- Category: Meat
- Expiry: [3 days from now]
- Notes: Boneless

### 5. Test Features
- ✅ Search for "milk"
- ✅ Filter by "Dairy" category
- ✅ Click "Rescue" button to see expiring items
- ✅ Edit an ingredient
- ✅ Delete an ingredient
- ✅ Scroll down to see recipe recommendations

---

## 🎤 Presentation Demo Script (10 minutes)

### Minute 1-2: Introduction
> "Good morning/afternoon. We're presenting KitchenMind, a smart kitchen management system that helps reduce food waste through intelligent inventory tracking and personalized meal planning."

**Show:** Landing page

### Minute 3-4: Authentication
> "The system features secure user authentication with bcrypt password hashing and session-based authorization."

**Demo:**
1. Click "Register"
2. Fill form and submit
3. Login with credentials
4. Show dashboard

### Minute 5-6: Inventory Management
> "Users can manage their kitchen inventory with automatic expiry tracking. The system color-codes items based on urgency."

**Demo:**
1. Add 2-3 ingredients
2. Show search functionality
3. Show filter by category
4. Edit an ingredient
5. Delete an ingredient

### Minute 7: Expiry Alerts
> "The 'Rescue My Food' feature proactively alerts users about items expiring within 3 days, helping prevent waste."

**Demo:**
1. Click "Rescue" button
2. Show expiring items
3. Explain color coding (red = urgent, yellow = use soon, green = fresh)

### Minute 8: User Profiles
> "Each user can set personalized nutritional goals, track allergies, and specify dietary preferences. The system uses this information to filter recipe recommendations."

**Demo:**
1. Navigate to Profile
2. Show nutritional goals
3. Show allergy tracking
4. Show dietary preferences
5. Show serving size customization

### Minute 9: Recipe Recommendations
> "The system integrates with external recipe APIs and filters recommendations based on user preferences and available ingredients."

**Demo:**
1. Scroll to recipe section
2. Explain filtering logic
3. Click on a recipe

### Minute 10: Architecture & Documentation
> "The application follows MVC architecture with comprehensive documentation from both OOAD and SSAD perspectives."

**Show:**
1. Open `docs/SRS_OOAD.md` - show class diagram
2. Open `docs/SRS_SSAD.md` - show DFD
3. Mention 7 database tables
4. Mention 20+ API endpoints

---

## 🐛 Quick Troubleshooting

### Problem: npm install fails
**Solution:**
```bash
# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### Problem: Port 3000 already in use
**Solution:**
```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Problem: Database errors
**Solution:**
```bash
# Delete database and restart
rm kitchenmind.db kitchenmind.db-shm kitchenmind.db-wal
npm start
```

### Problem: Login not working
**Solution:**
- Clear browser cookies
- Try incognito/private mode
- Check console for errors (F12)

---

## 📊 Quick Stats

- **Total Code:** ~3,500 lines
- **Files:** 25+
- **Database Tables:** 7
- **API Endpoints:** 20+
- **Documentation:** 100+ pages
- **Development Time:** 4 weeks

---

## 🎯 Key Features to Highlight

1. ✅ **Secure Authentication** - bcrypt + sessions
2. ✅ **User Profiles** - Personalized goals & preferences
3. ✅ **Inventory Tracking** - Expiry alerts & categorization
4. ✅ **Recipe Filtering** - Based on allergies & diet
5. ✅ **Meal Planning** - API ready for scheduling
6. ✅ **Shopping Lists** - Auto-generation from meal plans
7. ✅ **Comprehensive SRS** - OOAD + SSAD perspectives

---

## 📁 Important Files

### For Demo:
- `http://localhost:3000` - Application
- `views/dashboard.ejs` - Main UI
- `database.js` - Schema
- `server.js` - Main server

### For Documentation:
- `README.md` - Overview
- `docs/SRS_OOAD.md` - OOAD perspective
- `docs/SRS_SSAD.md` - SSAD perspective
- `docs/PROJECT_SUMMARY.md` - Executive summary

---

## ⏱️ Time Estimates

| Task                          | Time    |
|-------------------------------|---------|
| Install dependencies          | 1 min   |
| Start server                  | 5 sec   |
| Create test account           | 1 min   |
| Set up profile                | 1 min   |
| Add sample ingredients        | 2 min   |
| Test all features             | 3 min   |
| **Total Setup Time**          | **8 min**|

---

## 🎬 Pre-Presentation Checklist

**30 Minutes Before:**
- [ ] Start the server
- [ ] Create demo account
- [ ] Add sample ingredients
- [ ] Test all features
- [ ] Open documentation files
- [ ] Close unnecessary apps
- [ ] Disable notifications

**5 Minutes Before:**
- [ ] Restart server
- [ ] Test login
- [ ] Verify ingredients display
- [ ] Check recipe section loads
- [ ] Have backup screenshots ready

---

## 🌟 Success Criteria

Your demo is successful if you can show:
1. ✅ User registration and login
2. ✅ Adding ingredients with expiry tracking
3. ✅ Search and filter functionality
4. ✅ "Rescue My Food" expiry alerts
5. ✅ User profile with preferences
6. ✅ Recipe recommendations
7. ✅ Code architecture (MVC)
8. ✅ Database schema (7 tables)
9. ✅ Documentation (SRS files)

---

## 💡 Pro Tips

1. **Practice the demo** 2-3 times before presentation
2. **Have screenshots** as backup if live demo fails
3. **Explain as you click** - don't just show, tell why
4. **Highlight security** - password hashing, session management
5. **Mention scalability** - architecture supports growth
6. **Show enthusiasm** - you built something awesome!

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just follow this guide and you'll have a smooth presentation.

**Good luck! 🚀**

---

## 📞 Emergency Contacts

If something goes wrong during setup:
1. Check `SETUP_GUIDE.md` for detailed troubleshooting
2. Review `IMPLEMENTATION_SUMMARY.md` for what's implemented
3. Check `PRESENTATION_CHECKLIST.md` for demo flow

---

**Last Updated:** April 17, 2026  
**Status:** ✅ Ready for Presentation
