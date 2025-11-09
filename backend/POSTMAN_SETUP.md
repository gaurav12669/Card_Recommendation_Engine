# Postman Collection Setup Guide

This guide will help you import and use the Card Genius API Postman collection.

## 📦 Files Included

1. **Card_Genius_API.postman_collection.json** - Complete API collection
2. **Postman_Environment.postman_environment.json** - Environment variables

## 🚀 Import Steps

### Method 1: Import Collection and Environment

1. **Open Postman**
2. **Click "Import"** button (top left)
3. **Select Files**:
   - Choose `Card_Genius_API.postman_collection.json`
   - Choose `Postman_Environment.postman_environment.json`
4. **Click "Import"**

### Method 2: Import via File Browser

1. **Open Postman**
2. **File → Import** (or `Ctrl+O` / `Cmd+O`)
3. **Drag and drop** both JSON files
4. **Click "Import"**

### Method 3: Import via URL (if hosted)

If the collection is hosted online, you can import via URL:
1. Click "Import"
2. Select "Link" tab
3. Enter the collection URL
4. Click "Continue" → "Import"

## ⚙️ Environment Setup

1. **Select Environment**: 
   - Click the environment dropdown (top right)
   - Select "Card Genius - Local"

2. **Verify Variables**:
   - `base_url`: `http://localhost:8080`
   - `card_id`: `1` (default card ID for testing)

3. **Edit if Needed**:
   - Click the eye icon next to environment dropdown
   - Edit `base_url` if your backend runs on a different port

## 🧪 Testing the APIs

### 1. Health Check
- **Request**: `GET /health`
- **Purpose**: Verify API is running
- **Expected**: `200 OK` with status message

### 2. Get Categories
- **Request**: `GET /categories`
- **Purpose**: Fetch all spending categories
- **Expected**: Array of 4 categories (Travel, Shopping, Fuel, Food)

### 3. Calculate Savings
- **Request**: `POST /calculate-list`
- **Body Example**:
  ```json
  {
    "travel": 12000,
    "shopping": 8000,
    "fuel": 6000,
    "food": 5000
  }
  ```
- **Purpose**: Get recommended cards based on spending
- **Expected**: Array of recommended cards with savings

### 4. Get Card Details
- **Request**: `GET /cards/:id`
- **Path Variable**: `id = 1` (or any valid card ID)
- **Purpose**: Get detailed card information
- **Expected**: Complete card details with features and eligibility

## 📝 Collection Structure

```
Card Genius API
├── Health Check
├── Get Categories
├── Calculate Savings
│   ├── Success Response - All Categories
│   └── Success Response - Selected Categories Only
└── Get Card Details
    ├── Success Response
    ├── Card Not Found (404)
    └── Invalid Card ID (400)
```

## 🔧 Customization

### Change Base URL

1. **Option 1**: Edit environment variable
   - Select environment → Edit
   - Change `base_url` value

2. **Option 2**: Edit collection variable
   - Right-click collection → Edit
   - Go to "Variables" tab
   - Change `base_url` value

### Add New Requests

1. Right-click collection → "Add Request"
2. Configure method, URL, headers, body
3. Use `{{base_url}}` variable in URL

### Create Test Scripts

Add test scripts to requests:

```javascript
// Example: Test Calculate Savings
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has cards array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

pm.test("Card has required fields", function () {
    var jsonData = pm.response.json();
    if (jsonData.length > 0) {
        pm.expect(jsonData[0]).to.have.property('card_name');
        pm.expect(jsonData[0]).to.have.property('total_savings');
        pm.expect(jsonData[0]).to.have.property('net_savings');
    }
});
```

## 🎯 Pre-request Scripts

Example for dynamic card ID:

```javascript
// Set card_id from previous response
var calculateResponse = pm.globals.get("last_calculate_response");
if (calculateResponse) {
    var cards = JSON.parse(calculateResponse);
    if (cards.length > 0) {
        pm.environment.set("card_id", cards[0].id);
    }
}
```

## 📊 Collection Runner

Run all requests in sequence:

1. Click collection → "Run"
2. Select requests to run
3. Configure iterations and delays
4. Click "Run Card Genius API"
5. View test results

## 🌐 Production Environment

Create a new environment for production:

1. Click "Environments" (left sidebar)
2. Click "+" to create new environment
3. Add variables:
   - `base_url`: `https://api.yourdomain.com`
   - `card_id`: `1`
4. Save as "Card Genius - Production"
5. Switch between environments as needed

## 🔍 Troubleshooting

### Collection Not Importing
- Ensure JSON files are valid
- Check Postman version (recommended: v10+)
- Try importing one file at a time

### Variables Not Working
- Verify environment is selected
- Check variable names match exactly (case-sensitive)
- Ensure `{{base_url}}` syntax is correct

### Requests Failing
- Verify backend server is running
- Check `base_url` matches your server port
- Review CORS settings in backend
- Check backend logs for errors

### 404 Errors
- Ensure database is seeded
- Verify card IDs exist in database
- Check database connection

## 📚 Additional Resources

- [Postman Documentation](https://learning.postman.com/docs/)
- [Collection Format v2.1](https://schema.getpostman.com/json/collection/v2.1.0/docs/index.html)
- API Documentation: See `API_DOCUMENTATION.md`

## ✅ Quick Test Checklist

- [ ] Collection imported successfully
- [ ] Environment selected
- [ ] Backend server running
- [ ] Health Check returns 200
- [ ] Categories endpoint returns 4 categories
- [ ] Calculate endpoint returns recommendations
- [ ] Card details endpoint returns card info

---

**Happy Testing! 🚀**

