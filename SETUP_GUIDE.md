# 🚀 KitchenMind - Quick Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning) - [Download here](https://git-scm.com/)

---

## Installation Steps

### Step 1: Get the Code

**Option A: Clone from GitHub**
```bash
git clone https://github.com/saimahidhar54/kitchenmind.git
cd kitchenmind
```

**Option B: Download ZIP**
1. Download the project ZIP file
2. Extract to a folder
3. Open terminal/command prompt in that folder

---

### Step 2: Install Dependencies

Run the following command in the project directory:

```bash
npm install
```

This will install all required packages:
- express
- ejs
- better-sqlite3
- bcryptjs
- express-session
- connect-flash
- express-validator
- cors

**Expected output:**
```
added 150 packages in 30s
```

---

### Step 3: Start the Server

```bash
npm start
```

**Expected output:**
```
🍳 KitchenMind is running at http://localhost:3000
```

---

### Step 4: Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the KitchenMind landing page

---

## First-Time User Guide

### 1. Register an Account

1. Click **"Get Started"** or **"Register"** button
2. Fill in the registration form:
   - **Username**: Choose a unique username (min 3 characters)
   - **Email**: Enter a valid email address
   - **Password**: Create a secure password (min 6 characters)
3. Click **"Register"**
4. You'll be redirected to the login page

### 2. Login

1. Enter your **email** and **password**
2. Click **"Login"**
3. You'll be redirected to your dashboard

### 3. Set Up Your Profile

1. Click **"Profile"** in the navigation bar
2. Configure your preferences:
   - **Nutritional Goals**: Set daily targets for calories, protein, carbs, and fat
   - **Serving Size**: Enter the number of people you're cooking for
   - **Allergies**: List any food allergies (comma-separated, e.g., "peanuts, shellfish")
   - **Dietary Preference**: Select from options like Vegetarian, Vegan, Keto, etc.
3. Click **"Save Changes"**

### 4. Add Your First Ingredient

1. Click the **"Add"** button in the navigation bar
2. Fill in the ingredient details:
   - **Name**: e.g., "Milk"
   - **Quantity**: e.g., "1"
   - **Unit**: Select from dropdown (e.g., "litre")
   - **Category**: Select category (e.g., "Dairy")
   - **Expiry Date**: Select the expiration date
   - **Notes** (optional): Add any additional information
3. Click **"Save"**
4. Your ingredient will appear in the dashboard

### 5. Explore Features

- **Dashboard**: View all your ingredients with expiry tracking
- **Search & Filter**: Use the search bar and filters to find specific ingredients
- **Rescue My Food**: Click to see items expiring soon
- **Recipe Suggestions**: Scroll down to see recipe recommendations
- **Profile**: Update your preferences anytime

---

## Troubleshooting

### Issue: "npm: command not found"

**Solution:** Node.js is not installed or not in your PATH.
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

---

### Issue: "Port 3000 is already in use"

**Solution:** Another application is using port 3000.

**Option 1:** Stop the other application

**Option 2:** Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change to 3001 or any available port
```

---

### Issue: Database errors on first run

**Solution:** Delete the database file and restart:
```bash
rm kitchenmind.db kitchenmind.db-shm kitchenmind.db-wal
npm start
```

The database will be recreated automatically.

---

### Issue: "Cannot find module 'express'"

**Solution:** Dependencies not installed properly.
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: Login/Register not working

**Solution:** Check the browser console for errors (F12 → Console tab)
- Ensure all form fields are filled correctly
- Check that the server is running
- Try clearing browser cookies and cache

---

## Development Mode

For development with auto-restart on file changes, you can use `nodemon`:

```bash
# Install nodemon globally
npm install -g nodemon

# Run with nodemon
nodemon server.js
```

---

## Testing the Application

### Test User Registration
1. Go to `/register`
2. Create a test account
3. Verify you're redirected to login

### Test Ingredient Management
1. Login to your account
2. Add 3-4 ingredients with different expiry dates
3. Try editing an ingredient
4. Try deleting an ingredient
5. Use search and filter features

### Test Profile Settings
1. Go to `/profile`
2. Update nutritional goals
3. Add allergies (e.g., "peanuts, dairy")
4. Select a dietary preference
5. Save and verify changes persist

### Test Expiry Alerts
1. Add an ingredient with expiry date = today or tomorrow
2. Click "Rescue My Food" button
3. Verify the ingredient appears in the alert section

---

## API Testing with cURL

### Register a User
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&email=test@example.com&password=password123"
```

### Get Ingredients (requires login session)
```bash
curl -X GET http://localhost:3000/api/ingredients \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE"
```

### Add Ingredient (requires login session)
```bash
curl -X POST http://localhost:3000/api/ingredients \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "name": "Tomatoes",
    "quantity": 5,
    "unit": "pcs",
    "category": "Vegetables",
    "expiry_date": "2026-04-25",
    "notes": "Fresh"
  }'
```

---

## Database Management

### View Database Contents

You can use any SQLite browser tool, or use the command line:

```bash
# Install sqlite3 command-line tool (if not already installed)
# On Ubuntu/Debian:
sudo apt-get install sqlite3

# On macOS:
brew install sqlite3

# On Windows: Download from https://www.sqlite.org/download.html

# Open the database
sqlite3 kitchenmind.db

# View tables
.tables

# View users
SELECT * FROM users;

# View ingredients
SELECT * FROM ingredients;

# Exit
.quit
```

---

## Stopping the Server

To stop the server:
- Press `Ctrl + C` in the terminal where the server is running

---

## Uninstallation

To completely remove the application:

```bash
# Delete the project folder
cd ..
rm -rf kitchenmind

# Or on Windows
rmdir /s kitchenmind
```

---

## Next Steps

After successful setup:

1. **Read the Documentation**
   - Check `docs/SRS_OOAD.md` for system design
   - Check `docs/SRS_SSAD.md` for data flow analysis

2. **Explore the Code**
   - `server.js` - Main application entry point
   - `routes/` - API endpoints
   - `views/` - Frontend templates
   - `database.js` - Database schema

3. **Customize**
   - Modify styles in `public/css/style.css`
   - Add new features in `routes/`
   - Update UI in `views/`

4. **Deploy** (Optional)
   - Deploy to Heroku, Vercel, or Railway
   - Set up environment variables for production

---

## Support

If you encounter any issues:

1. Check the **Troubleshooting** section above
2. Review the console output for error messages
3. Check the browser console (F12) for frontend errors
4. Contact the development team:
   - Sai Mahidhar (25MCMT29)
   - Shaik Jani Begum (25MCMT09)

---

**Happy Cooking! 🍳**
