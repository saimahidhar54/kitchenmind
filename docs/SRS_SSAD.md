# Software Requirements Specification (SRS)
## KitchenMind - Smart Kitchen Management System
### Structured Systems Analysis and Design (SSAD) Perspective

**Project Team:**
- Sai Mahidhar (25MCMT29)
- Shaik Jani Begum (25MCMT09)

**Course:** M.Tech Computer Science - Software Engineering Lab 2025-26  
**Submission Date:** April 21, 2026

---

## 1. Introduction

### 1.1 Purpose
This document presents the Software Requirements Specification for KitchenMind from a Structured Systems Analysis and Design (SSAD) perspective, focusing on data flow, process decomposition, and structured methodologies.

### 1.2 Scope
KitchenMind is a web-based kitchen management system that processes user data, ingredient information, and recipe data to provide intelligent meal planning and inventory management capabilities.

### 1.3 Definitions and Acronyms
- **SSAD**: Structured Systems Analysis and Design
- **DFD**: Data Flow Diagram
- **ERD**: Entity Relationship Diagram
- **DD**: Data Dictionary
- **STD**: State Transition Diagram

---

## 2. System Overview

### 2.1 System Context
KitchenMind operates as a centralized system that:
- Accepts user inputs (registration, ingredient data, preferences)
- Processes data through business logic
- Stores data in a relational database
- Retrieves and displays information to users
- Integrates with external recipe APIs

### 2.2 System Boundaries
**Inputs:**
- User credentials (registration/login)
- Ingredient details (name, quantity, expiry)
- User preferences (nutrition goals, allergies)
- Meal plan selections
- Shopping list items

**Outputs:**
- Dashboard views
- Ingredient lists with expiry alerts
- Personalized recipe recommendations
- Meal plans
- Shopping lists
- Nutrition summaries

**External Interfaces:**
- TheMealDB API (recipe data)
- Web browser (user interface)

---

## 3. Data Flow Diagrams (DFD)

### 3.1 Context Diagram (Level 0)

```
                    ┌─────────────────┐
                    │                 │
    User ──────────>│   KitchenMind   │──────────> Recipe API
    Credentials     │     System      │  Recipe Request
    Ingredient Data │                 │
    Preferences     └────────┬────────┘
                             │
                             v
                      ┌──────────────┐
                      │   Database   │
                      └──────────────┘
```

### 3.2 Level 1 DFD - Main Processes

```
┌──────┐
│ User │
└───┬──┘
    │
    │ Registration/Login
    v
┌───────────────────┐
│  1.0 Authenticate │
│      User         │
└────────┬──────────┘
         │ User Session
         v
    ┌────────────┐
    │  D1: Users │
    └────────────┘
         │
         │ User Data
         v
┌────────────────────┐
│  2.0 Manage        │
│  Ingredients       │
└─────────┬──────────┘
          │ Ingredient Data
          v
    ┌─────────────────┐
    │ D2: Ingredients │
    └─────────────────┘
          │
          │ Ingredient List
          v
┌─────────────────────┐
│  3.0 Generate       │
│  Recommendations    │
└──────────┬──────────┘
           │ Recipe Query
           v
    ┌──────────────┐
    │ Recipe API   │
    └──────────────┘
           │
           │ Recipe Data
           v
┌──────────────────────┐
│  4.0 Plan Meals      │
└───────────┬──────────┘
            │ Meal Plan
            v
    ┌───────────────┐
    │ D3: MealPlans │
    └───────────────┘
            │
            │ Ingredients Needed
            v
┌─────────────────────────┐
│  5.0 Generate Shopping  │
│       List              │
└──────────┬──────────────┘
           │ Shopping Items
           v
    ┌──────────────────┐
    │ D4: ShoppingList │
    └──────────────────┘
```

### 3.3 Level 2 DFD - Ingredient Management (Process 2.0)

```
┌──────┐
│ User │
└───┬──┘
    │
    │ Add Request
    v
┌────────────────────┐
│ 2.1 Validate       │
│ Ingredient Data    │
└─────────┬──────────┘
          │ Valid Data
          v
┌────────────────────┐
│ 2.2 Check Expiry   │
│ Date               │
└─────────┬──────────┘
          │ Categorized Data
          v
┌────────────────────┐
│ 2.3 Store          │
│ Ingredient         │
└─────────┬──────────┘
          │
          v
    ┌─────────────────┐
    │ D2: Ingredients │
    └─────────────────┘
          │
          │ Query
          v
┌────────────────────┐
│ 2.4 Retrieve       │
│ Ingredients        │
└─────────┬──────────┘
          │ Ingredient List
          v
┌────────────────────┐
│ 2.5 Filter &       │
│ Sort               │
└─────────┬──────────┘
          │ Filtered List
          v
┌────────────────────┐
│ 2.6 Identify       │
│ Expiring Items     │
└─────────┬──────────┘
          │ Alert Data
          v
       ┌──────┐
       │ User │
       └──────┘
```

### 3.4 Level 2 DFD - Recipe Recommendation (Process 3.0)

```
┌──────┐
│ User │
└───┬──┘
    │ Request Recipes
    v
┌────────────────────┐
│ 3.1 Get User       │
│ Profile            │
└─────────┬──────────┘
          │ Profile Data
          v
    ┌──────────────────┐
    │ D5: UserProfiles │
    └──────────────────┘
          │
          v
┌────────────────────┐
│ 3.2 Get User       │
│ Ingredients        │
└─────────┬──────────┘
          │ Ingredient List
          v
    ┌─────────────────┐
    │ D2: Ingredients │
    └─────────────────┘
          │
          v
┌────────────────────┐
│ 3.3 Build Query    │
│ Parameters         │
└─────────┬──────────┘
          │ Query
          v
    ┌──────────────┐
    │ Recipe API   │
    └──────┬───────┘
           │ Raw Recipes
           v
┌────────────────────┐
│ 3.4 Filter by      │
│ Allergies          │
└─────────┬──────────┘
          │ Safe Recipes
          v
┌────────────────────┐
│ 3.5 Filter by      │
│ Dietary Preference │
└─────────┬──────────┘
          │ Matched Recipes
          v
┌────────────────────┐
│ 3.6 Scale Servings │
└─────────┬──────────┘
          │ Scaled Recipes
          v
       ┌──────┐
       │ User │
       └──────┘
```

---

## 4. Data Dictionary

### 4.1 Data Stores

#### D1: Users
| Field Name  | Data Type    | Length | Constraints           | Description                    |
|-------------|--------------|--------|-----------------------|--------------------------------|
| id          | INTEGER      | -      | PRIMARY KEY, AUTO_INC | Unique user identifier         |
| username    | VARCHAR      | 50     | UNIQUE, NOT NULL      | User's chosen username         |
| email       | VARCHAR      | 100    | UNIQUE, NOT NULL      | User's email address           |
| password    | VARCHAR      | 255    | NOT NULL              | Hashed password                |
| created_at  | DATETIME     | -      | DEFAULT CURRENT_TIME  | Account creation timestamp     |

#### D2: Ingredients
| Field Name   | Data Type    | Length | Constraints           | Description                    |
|--------------|--------------|--------|-----------------------|--------------------------------|
| id           | INTEGER      | -      | PRIMARY KEY, AUTO_INC | Unique ingredient identifier   |
| user_id      | INTEGER      | -      | FOREIGN KEY, NOT NULL | Owner user ID                  |
| name         | VARCHAR      | 100    | NOT NULL              | Ingredient name                |
| quantity     | DECIMAL      | 10,2   | NOT NULL              | Amount available               |
| unit         | VARCHAR      | 20     | NOT NULL              | Measurement unit               |
| category     | VARCHAR      | 50     | NOT NULL              | Food category                  |
| expiry_date  | DATE         | -      | NOT NULL              | Expiration date                |
| added_date   | DATE         | -      | DEFAULT CURRENT_DATE  | Date added to inventory        |
| notes        | TEXT         | -      | -                     | Additional notes               |

#### D3: MealPlans
| Field Name   | Data Type    | Length | Constraints           | Description                    |
|--------------|--------------|--------|-----------------------|--------------------------------|
| id           | INTEGER      | -      | PRIMARY KEY, AUTO_INC | Unique meal plan entry ID      |
| user_id      | INTEGER      | -      | FOREIGN KEY, NOT NULL | Owner user ID                  |
| recipe_id    | INTEGER      | -      | FOREIGN KEY, NOT NULL | Associated recipe ID           |
| meal_date    | DATE         | -      | NOT NULL              | Scheduled meal date            |
| meal_type    | VARCHAR      | 20     | NOT NULL              | breakfast/lunch/dinner/snack   |
| servings     | INTEGER      | -      | DEFAULT 1             | Number of servings             |
| created_at   | DATETIME     | -      | DEFAULT CURRENT_TIME  | Entry creation timestamp       |

#### D4: ShoppingList
| Field Name      | Data Type    | Length | Constraints           | Description                    |
|-----------------|--------------|--------|-----------------------|--------------------------------|
| id              | INTEGER      | -      | PRIMARY KEY, AUTO_INC | Unique shopping item ID        |
| user_id         | INTEGER      | -      | FOREIGN KEY, NOT NULL | Owner user ID                  |
| ingredient_name | VARCHAR      | 100    | NOT NULL              | Item to purchase               |
| quantity        | DECIMAL      | 10,2   | NOT NULL              | Amount needed                  |
| unit            | VARCHAR      | 20     | NOT NULL              | Measurement unit               |
| checked         | BOOLEAN      | -      | DEFAULT 0             | Purchase status                |
| created_at      | DATETIME     | -      | DEFAULT CURRENT_TIME  | Item addition timestamp        |

#### D5: UserProfiles
| Field Name         | Data Type    | Length | Constraints           | Description                    |
|--------------------|--------------|--------|-----------------------|--------------------------------|
| id                 | INTEGER      | -      | PRIMARY KEY, AUTO_INC | Unique profile ID              |
| user_id            | INTEGER      | -      | FOREIGN KEY, UNIQUE   | Associated user ID             |
| daily_calories     | INTEGER      | -      | DEFAULT 2000          | Daily calorie goal             |
| daily_protein      | INTEGER      | -      | DEFAULT 50            | Daily protein goal (g)         |
| daily_carbs        | INTEGER      | -      | DEFAULT 250           | Daily carbs goal (g)           |
| daily_fat          | INTEGER      | -      | DEFAULT 70            | Daily fat goal (g)             |
| serving_size       | INTEGER      | -      | DEFAULT 1             | Number of people cooking for   |
| allergies          | TEXT         | -      | -                     | Comma-separated allergens      |
| dietary_preference | VARCHAR      | 50     | -                     | Diet type (vegan, keto, etc.)  |

#### D6: Recipes
| Field Name   | Data Type    | Length | Constraints           | Description                    |
|--------------|--------------|--------|-----------------------|--------------------------------|
| id           | INTEGER      | -      | PRIMARY KEY, AUTO_INC | Unique recipe ID               |
| user_id      | INTEGER      | -      | FOREIGN KEY           | Owner user ID (if saved)       |
| title        | VARCHAR      | 200    | NOT NULL              | Recipe name                    |
| ingredients  | TEXT         | -      | NOT NULL              | JSON array of ingredients      |
| instructions | TEXT         | -      | NOT NULL              | Cooking steps                  |
| calories     | DECIMAL      | 10,2   | -                     | Calories per serving           |
| protein      | DECIMAL      | 10,2   | -                     | Protein per serving (g)        |
| carbs        | DECIMAL      | 10,2   | -                     | Carbs per serving (g)          |
| fat          | DECIMAL      | 10,2   | -                     | Fat per serving (g)            |
| fiber        | DECIMAL      | 10,2   | -                     | Fiber per serving (g)          |
| servings     | INTEGER      | -      | DEFAULT 1             | Default serving count          |
| allergens    | TEXT         | -      | -                     | Comma-separated allergens      |
| created_at   | DATETIME     | -      | DEFAULT CURRENT_TIME  | Recipe save timestamp          |

### 4.2 Data Flows

| Flow Name           | Source          | Destination        | Data Elements                                    |
|---------------------|-----------------|--------------------|-------------------------------------------------|
| Registration Data   | User            | Process 1.0        | username, email, password                       |
| User Session        | Process 1.0     | D1: Users          | user_id, session_token                          |
| Ingredient Input    | User            | Process 2.0        | name, quantity, unit, category, expiry_date     |
| Ingredient List     | D2: Ingredients | Process 2.6        | All ingredient records for user                 |
| Expiry Alert        | Process 2.6     | User               | List of expiring ingredients                    |
| Profile Data        | D5: UserProfiles| Process 3.0        | allergies, dietary_preference, serving_size     |
| Recipe Query        | Process 3.3     | Recipe API         | ingredients, dietary_preference                 |
| Recipe Results      | Recipe API      | Process 3.4        | recipe_id, title, ingredients, nutrition        |
| Filtered Recipes    | Process 3.5     | User               | Safe, matched recipes                           |
| Meal Plan Entry     | User            | Process 4.0        | recipe_id, meal_date, meal_type, servings       |
| Shopping Items      | Process 5.0     | D4: ShoppingList   | ingredient_name, quantity, unit                 |

---

## 5. Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    USERS    │
├─────────────┤
│ *id         │
│  username   │
│  email      │
│  password   │
│  created_at │
└──────┬──────┘
       │
       │ 1:1
       │
┌──────┴──────────┐
│  USER_PROFILES  │
├─────────────────┤
│ *id             │
│  user_id (FK)   │
│  daily_calories │
│  allergies      │
│  serving_size   │
└─────────────────┘

       │
       │ 1:N
       │
┌──────┴──────────┐
│  INGREDIENTS    │
├─────────────────┤
│ *id             │
│  user_id (FK)   │
│  name           │
│  quantity       │
│  expiry_date    │
└─────────────────┘

       │
       │ 1:N
       │
┌──────┴──────────┐
│    RECIPES      │
├─────────────────┤
│ *id             │
│  user_id (FK)   │
│  title          │
│  ingredients    │
│  calories       │
└─────────┬───────┘
          │
          │ 1:N
          │
┌─────────┴───────┐
│   MEAL_PLANS    │
├─────────────────┤
│ *id             │
│  user_id (FK)   │
│  recipe_id (FK) │
│  meal_date      │
│  meal_type      │
└─────────────────┘

       │
       │ 1:N
       │
┌──────┴──────────────┐
│  SHOPPING_LISTS     │
├─────────────────────┤
│ *id                 │
│  user_id (FK)       │
│  ingredient_name    │
│  quantity           │
│  checked            │
└─────────────────────┘

Legend:
* = Primary Key
FK = Foreign Key
1:1 = One-to-One relationship
1:N = One-to-Many relationship
```

---

## 6. Process Specifications

### 6.1 Process 1.0: Authenticate User

**Process Name:** Authenticate User  
**Input:** User credentials (email, password)  
**Output:** User session or error message  
**Logic:**
1. Receive email and password from user
2. Validate email format
3. Query D1: Users for matching email
4. If user not found, return error "Invalid credentials"
5. If user found, retrieve hashed password
6. Compare input password with stored hash using bcrypt
7. If match fails, return error "Invalid credentials"
8. If match succeeds:
   - Create session with user_id
   - Store session in server memory
   - Return success with redirect to dashboard
9. End

### 6.2 Process 2.1: Validate Ingredient Data

**Process Name:** Validate Ingredient Data  
**Input:** Ingredient details (name, quantity, unit, category, expiry_date)  
**Output:** Validated data or error list  
**Logic:**
1. Check if name is not empty
2. Check if quantity is positive number
3. Check if unit is from allowed list
4. Check if category is from predefined categories
5. Check if expiry_date is valid date format (YYYY-MM-DD)
6. Check if expiry_date is not in the past
7. If any validation fails, collect error messages
8. If all validations pass, return validated data
9. End

### 6.3 Process 2.6: Identify Expiring Items

**Process Name:** Identify Expiring Items  
**Input:** All user ingredients from D2  
**Output:** List of ingredients expiring within 3 days  
**Logic:**
1. Get current date
2. Calculate threshold date (current date + 3 days)
3. For each ingredient in D2 where user_id matches:
   - Compare expiry_date with threshold date
   - If expiry_date <= threshold date, add to expiring list
4. Sort expiring list by expiry_date (ascending)
5. Return expiring list
6. End

### 6.4 Process 3.4: Filter by Allergies

**Process Name:** Filter Recipes by Allergies  
**Input:** Recipe list, user allergies  
**Output:** Safe recipe list  
**Logic:**
1. Parse user allergies into array (split by comma)
2. Convert allergies to lowercase for comparison
3. For each recipe in input list:
   - Get recipe ingredients
   - For each ingredient in recipe:
     - Convert ingredient name to lowercase
     - Check if ingredient contains any allergy keyword
     - If match found, mark recipe as unsafe
   - If recipe is safe, add to output list
4. Return safe recipe list
5. End

### 6.5 Process 5.0: Generate Shopping List

**Process Name:** Generate Shopping List from Meal Plan  
**Input:** Start date, end date, user_id  
**Output:** Aggregated shopping list  
**Logic:**
1. Query D3: MealPlans for entries between start_date and end_date for user_id
2. For each meal plan entry:
   - Get recipe_id
   - Query D6: Recipes for recipe details
   - Parse ingredients JSON
   - For each ingredient in recipe:
     - Calculate needed quantity = ingredient.quantity * meal_plan.servings
     - Create key = ingredient.name + "_" + ingredient.unit
     - If key exists in shopping_map, add to existing quantity
     - Else, create new entry in shopping_map
3. For each item in shopping_map:
   - Insert into D4: ShoppingList with user_id, ingredient_name, quantity, unit
4. Return count of items added
5. End

---

## 7. State Transition Diagrams

### 7.1 User Session State

```
┌─────────┐
│  Guest  │
└────┬────┘
     │
     │ register
     v
┌──────────────┐
│  Registered  │
└──────┬───────┘
       │
       │ login
       v
┌───────────────┐
│ Authenticated │
└───────┬───────┘
        │
        │ logout / session_expire
        v
┌─────────┐
│  Guest  │
└─────────┘
```

### 7.2 Ingredient Lifecycle State

```
┌─────────┐
│   New   │
└────┬────┘
     │
     │ add_to_inventory
     v
┌──────────┐
│  Active  │
└────┬─────┘
     │
     ├─ update ──> [Active]
     │
     ├─ expiry_date > today + 5 days ──> [Fresh]
     │
     ├─ expiry_date <= today + 5 days ──> [Use Soon]
     │
     ├─ expiry_date <= today + 2 days ──> [Urgent]
     │
     ├─ expiry_date < today ──> [Expired]
     │
     └─ delete ──> [Deleted]
```

### 7.3 Shopping List Item State

```
┌──────────┐
│  Added   │
└────┬─────┘
     │
     ├─ mark_checked ──> [Checked]
     │
     └─ delete ──> [Removed]

┌──────────┐
│ Checked  │
└────┬─────┘
     │
     ├─ uncheck ──> [Added]
     │
     ├─ clear_checked ──> [Removed]
     │
     └─ delete ──> [Removed]
```

---

## 8. Functional Requirements (Structured View)

### 8.1 Input Requirements

**IR-1: User Registration Input**
- Username (3-50 characters, alphanumeric)
- Email (valid email format)
- Password (minimum 6 characters)

**IR-2: Ingredient Input**
- Name (1-100 characters, required)
- Quantity (positive decimal, required)
- Unit (from predefined list, required)
- Category (from predefined list, required)
- Expiry Date (YYYY-MM-DD format, future date, required)
- Notes (optional, max 500 characters)

**IR-3: Profile Update Input**
- Daily Calories (1000-5000, integer)
- Daily Protein (0-500, integer)
- Daily Carbs (0-1000, integer)
- Daily Fat (0-500, integer)
- Serving Size (1-20, integer)
- Allergies (comma-separated text)
- Dietary Preference (from predefined list)

### 8.2 Processing Requirements

**PR-1: Authentication Processing**
- Hash passwords using bcrypt with salt rounds = 10
- Create session with 7-day expiry
- Validate email uniqueness before registration

**PR-2: Ingredient Processing**
- Calculate days until expiry
- Categorize urgency level (Fresh/Use Soon/Urgent/Expired)
- Sort by expiry date ascending
- Filter by category and search term

**PR-3: Recipe Filtering Processing**
- Parse user allergies into array
- Match recipe ingredients against allergy list
- Filter by dietary preference
- Scale ingredient quantities by serving size ratio

**PR-4: Shopping List Aggregation**
- Group items by name and unit
- Sum quantities for duplicate items
- Sort by checked status (unchecked first)

### 8.3 Output Requirements

**OR-1: Dashboard Output**
- Total ingredient count
- Fresh items count
- Use soon items count
- Urgent items count
- Ingredient cards with urgency indicators

**OR-2: Recipe Recommendation Output**
- Recipe title
- Recipe image
- Ingredient list
- Nutritional information (calories, protein, carbs, fat)
- Allergen warnings

**OR-3: Shopping List Output**
- Ingredient name
- Quantity with unit
- Checked/unchecked status
- Total item count
- Checked item count

---

## 9. System Interfaces

### 9.1 User Interface Specifications

**UI-1: Login Screen**
- Input fields: Email, Password
- Buttons: Login, Register Link
- Validation: Real-time email format check
- Error display: Alert banner

**UI-2: Dashboard Screen**
- Stats cards: Total, Fresh, Use Soon, Urgent
- Search bar with filter dropdown
- Ingredient grid with cards
- Action buttons: Add, Rescue, Profile, Logout

**UI-3: Profile Screen**
- Account info display (read-only)
- Nutrition goals form (editable)
- Serving size input
- Allergies text input
- Dietary preference dropdown
- Save/Cancel buttons

### 9.2 External Interface Specifications

**EI-1: TheMealDB API**
- Endpoint: https://www.themealdb.com/api/json/v1/1/
- Methods: GET
- Parameters: category, ingredient, search term
- Response: JSON with recipe array
- Rate Limit: None (free tier)

### 9.3 Database Interface Specifications

**DI-1: SQLite Database**
- File: kitchenmind.db
- Mode: WAL (Write-Ahead Logging)
- Foreign Keys: Enabled
- Connection: Synchronous via better-sqlite3
- Transactions: Supported

---

## 10. Performance Requirements

### 10.1 Response Time Requirements

| Operation                  | Maximum Response Time |
|----------------------------|-----------------------|
| User Login                 | 500ms                 |
| Load Dashboard             | 1000ms                |
| Add Ingredient             | 300ms                 |
| Search/Filter Ingredients  | 200ms                 |
| Fetch Recipes              | 2000ms (API dependent)|
| Update Profile             | 500ms                 |
| Generate Shopping List     | 1000ms                |

### 10.2 Throughput Requirements

- Support 100 concurrent users
- Handle 1000 ingredient operations per minute
- Process 500 recipe requests per minute

### 10.3 Capacity Requirements

- Store up to 10,000 users
- Store up to 100 ingredients per user
- Store up to 500 recipes per user
- Store up to 1000 meal plan entries per user

---

## 11. Security Requirements

### 11.1 Authentication Security

- Passwords hashed with bcrypt (cost factor 10)
- Session tokens stored server-side
- Session expiry: 7 days
- No password stored in plain text

### 11.2 Authorization Security

- User data isolated by user_id
- All queries filtered by session user_id
- No cross-user data access
- Middleware enforces authentication on protected routes

### 11.3 Data Security

- SQL injection prevented via prepared statements
- XSS prevention via EJS auto-escaping
- CSRF protection via session validation
- Input validation on all forms

---

## 12. Reliability Requirements

### 12.1 Availability

- System uptime: 99% (excluding maintenance)
- Planned maintenance window: Sunday 2-4 AM
- Database backup: Daily

### 12.2 Error Handling

- All errors logged to console
- User-friendly error messages displayed
- Database transaction rollback on failure
- Graceful degradation for API failures

### 12.3 Data Integrity

- Foreign key constraints enforced
- Cascade delete for user data
- Atomic transactions for multi-step operations
- Date validation before storage

---

## 13. Maintainability Requirements

### 13.1 Code Organization

- Modular route structure (auth, profile, recipes, etc.)
- Middleware separation (auth, session, flash)
- Database schema in single initialization function
- Views organized by feature

### 13.2 Documentation

- Inline code comments for complex logic
- README with setup instructions
- API endpoint documentation
- Database schema documentation

### 13.3 Testability

- Separate business logic from routes
- Database queries use prepared statements
- Validation functions isolated
- Error handling consistent

---

## 14. Conclusion

This SRS document provides a comprehensive structured analysis of the KitchenMind system, focusing on:
- Clear data flow through DFDs
- Detailed process specifications
- Structured data dictionary
- State transition modeling
- Interface specifications

The structured approach ensures:
- Systematic development process
- Clear understanding of data transformations
- Traceable requirements
- Maintainable system architecture

---

**Document Version:** 1.0  
**Last Updated:** April 17, 2026
