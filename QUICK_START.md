# Quick Start - Card Genius

## 🚀 Fastest Way to Get Started

### Prerequisites
- Node.js installed
- MySQL running
- Terminal access

### 1. Install Everything
```bash
npm run install:all
```

### 2. Configure Database
Edit `backend/.env`:
```env
DB_PASSWORD=your_mysql_password
```

### 3. Setup Database
```bash
cd backend
npm run setup
```

### 4. Start Everything

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 5. Open Browser
Navigate to: **http://localhost:3000**

---

## 📋 What You Get

✅ **4 Complete Screens**
- Category Selection
- Spending Input with Sliders
- Recommended Cards Carousel
- Detailed Card Information

✅ **Full API Backend**
- 3 RESTful endpoints
- MySQL database
- Savings calculation engine

✅ **Production Ready**
- Error handling
- Loading states
- Responsive design
- Type-safe code

---

## 🧪 Test the API

After starting the backend, run:
```bash
cd backend
node test-api.js
```

---

## 📚 Documentation

- **README.md** - Complete project documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - API reference
- **PROJECT_SUMMARY.md** - Project overview

---

## ⚡ Troubleshooting

**Database Connection Error?**
- Check MySQL is running
- Verify credentials in `backend/.env`

**Port Already in Use?**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Next.js auto-finds next port

**Module Not Found?**
- Run `npm install` in the affected directory

---

## 🎯 Next Steps

1. Select categories on the home screen
2. Adjust spending sliders
3. View recommended cards
4. Check card details
5. See savings breakdown

**Enjoy exploring Card Genius! 🎉**

