# Quick Start - Card Genius

## 🚀 Fastest Way to Get Started

### Prerequisites
- Node.js installed
- MySQL running
- Terminal access

###1,Start backend (Docker):
cd backend
docker compose up --build
```

### 2. Configure Database
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YourPassword123!
DB_NAME=card_genius
DB_PORT=3306
TRAVEL_CONSTANT=2
SHOPING_CONSTANT=3
FUEL_CONSTANT=4
FOOD_CONSTANT=5
PORT=8080
REDIS_HOST="127.0.0.1"
REDIS_PORT=6380
MONGO_URI = 'mongodb://127.0.0.1:27017'
MONGO_DB_NAME = 'card_genius_analytics'
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


