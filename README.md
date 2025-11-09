# Card Genius - Credit Card Recommendation Engine

A full-stack web application that helps users discover the most rewarding credit card for their spending habits. Users enter their monthly spends across travel, shopping, fuel, and food to receive personalised card recommendations with projected savings.

## 🎯 Features

- **Category Selection** – choose spend categories that matter the most
- **Dynamic Spend Entry** – drag sliders or use quick chips to adjust monthly spends
- **Real-time Savings** – recommendations update automatically with debounced API calls
- **Carousel of Cards** – swipe through ranked cards with savings breakdown
- **Detailed Card View** – explore fees, rewards, eligibility, and per-category savings
- **Analytics Logging** – card applications are logged to MongoDB (or in-memory fallback)
- **Caching Layer** – Redis (or in-memory cache) accelerates category and card detail responses
- **Responsive UI** – built with Next.js (App Router) & Material UI (mobile-first)

## 🧩 Tech Stack

### Frontend
- Next.js 14 (App Router) with React 18
- Material UI 5 with custom theme

### Backend
- Express.js with modular controller/service architecture
- MySQL (MySQL2) for relational data
- Redis (async-redis) with automatic in-memory fallback
- MongoDB (mongodb driver) for analytics logging
- Joi for payload validation

## 📦 Repository Layout

```
cashkaro/
├── backend/
│   ├── config/
│   │   └── database.js             # MySQL pool export (singleton)
│   ├── scripts/
│   │   ├── createDatabase.js       # Database schema creation
│   │   ├── seed.js                 # Seed data script
│   │   └── setup.js                # Complete setup script
│   ├── src/
│   │   ├── config/constants.js     # Savings constants loader
│   │   ├── controllers/            # Route controllers
│   │   ├── errors/                 # Custom ApiError
│   │   ├── lib/                    # MySQL, Redis & Mongo singletons
│   │   ├── middleware/             # Validation & error handler middleware
│   │   ├── models/                 # Data access layer
│   │   ├── routes/                 # Express routers
│   │   ├── services/               # Business logic (recommendations, analytics, etc.)
│   │   ├── utils/                  # Async handler helpers
│   │   └── validators/             # Joi schemas
│   ├── server.js                   # Express server bootstrapper
│   ├── package.json
│   └── .env                        # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx            # Screen 1 – Category selection
│   │       ├── spends/page.tsx     # Screen 2 – Add spends
│   │       ├── cards/page.tsx      # Screen 3 – Recommendations carousel
│   │       └── cards/[id]/page.tsx # Screen 4 – Card details + apply CTA
│   ├── package.json
│   └── next.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8 (unless using Docker compose)
- Redis 7 (optional – the backend falls back to an in-memory cache)
- MongoDB 6 (optional – required only for analytics logging)
- Docker & Docker Compose (optional for containerised setup)

### 1. Install Dependencies

```bash
npm run install:all
```

*(or install manually in both `backend/` and `frontend/` folders)*

### 2. Configure Environment Variables

Copy `.env.example` to `.env` inside `backend/` and adjust values:

```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=card_genius
DB_PORT=3306

TRAVEL_CONSTANT=2
SHOPING_CONSTANT=3
FUEL_CONSTANT=4
FOOD_CONSTANT=5

PORT=8080

# Redis (optional)
REDIS_URL=redis://127.0.0.1:6379
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DISABLED=false   # set to true to use in-memory cache

# MongoDB (optional analytics)
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=card_genius_analytics
```

Create `.env.local` in `frontend/` if you wish to override `NEXT_PUBLIC_API_URL`:

```ini
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Prepare MySQL

```bash
cd backend
npm run setup
```

This will create the schema and seed sample banks, cards, and savings percentages.  
You can also run `node scripts/createDatabase.js` and `npm run seed` separately.

### 4. Run the Applications (Local)

```bash
# Terminal 1
cd backend
npm run dev     # launches Express on http://localhost:8080

# Terminal 2
cd frontend
npm run dev     # launches Next.js on http://localhost:3000
```

### 5. Verify the Flow

1. Visit `http://localhost:3000`
2. Select one or more categories and click **Add Spends**
3. Adjust sliders to represent monthly spend amounts
4. Watch recommendations update automatically
5. Click **View Details** on a recommended card
6. Inspect savings breakdown and eligibility
7. Click **Apply Now** to log the application (stored in MongoDB / in-memory cache). An animated card overlay appears while the API runs, and you’ll be redirected home automatically once complete.

### 6. Run Everything with Docker (Optional)

From the `backend/` directory:

```bash
docker-compose up --build
```

This starts Express, MySQL, Redis, and MongoDB with sensible defaults. Adjust `docker-compose.yml` as needed.

Build/run the frontend container (optional) from `frontend/`:

```bash
docker build -t card-genius-frontend .
docker run -p 3000:3000 card-genius-frontend
```

## 🔌 API Endpoints

| Method | Endpoint              | Description                                    |
|--------|----------------------|------------------------------------------------|
| GET    | `/categories`        | List active spend categories (Redis cached)   |
| POST   | `/calculate-list`    | Returns ranked card recommendations           |
| GET    | `/cards/:id`         | Detailed card information (Redis cached)      |
| POST   | `/analytics/apply`   | Stores card application analytics in MongoDB  |

### `/calculate-list` Request Body

```json
{
  "travel": 12000,
  "shopping": 8000,
  "fuel": 6000,
  "food": 5000
}
```

One or more fields can be provided. The response keeps the original shape used by the frontend.

### `/analytics/apply` Request Body

```json
{
  "cardId": 1,
  "cardName": "HDFC Regalia Gold Credit Card",
  "bankName": "HDFC Bank",
  "userSpends": { "travel": 12000, "shopping": 8000 },
  "savings": {
    "totalSavings": 16250,
    "netSavings": 14750,
    "categories": [
      { "category": "Travel", "savings": 6250 }
    ]
  },
  "metadata": {}
}
```

Response:

```json
{ "success": true }
```

## 🧮 Savings Formula

```
save_monthly =
  (travel   * 0.4 * TRAVEL_CONSTANT) +
  (shopping * 0.5 * SHOPING_CONSTANT) +
  (fuel     * 0.6 * FUEL_CONSTANT) +
  (food     * 0.7 * FOOD_CONSTANT)
```

Constants are configurable via environment variables, making the engine adaptable without code changes.

## 🗄️ Database Schema (MySQL)

1. `categories`
2. `banks`
3. `cards`
4. `card_features`
5. `eligibility_criteria`
6. `category_savings`

Each table is indexed for common lookup patterns (e.g., `card_id`, `category_key`, `is_active`).

## 📊 Analytics Storage (MongoDB)

`card_applications` collection captures:

- `cardId`, `cardName`, `bankName`
- User spend snapshot
- Savings snapshot (total, net, per category)
- Optional metadata (e.g., client, device)
- `createdAt` timestamp

If MongoDB is unavailable, analytics calls succeed silently (errors are logged to the server console).

## 🧠 Architecture Highlights

- **Singleton clients** – MySQL, Redis, and Mongo connections are created once and reused
- **Service layer** – complex calculations and logging kept out of controllers
- **Validation** – Joi schemas guard every POST payload
- **Caching** – Redis (or in-memory map) accelerates frequently requested data
- **Graceful degradation** – missing data falls back to mock values
- **Analytics** – Apply Now triggers a background log entry without altering response payloads

## ✅ Testing the Flow

```bash
# Ensure backend is running
curl http://localhost:8080/health

# Fetch categories (may be served from Redis cache)
curl http://localhost:8080/categories

# Generate recommendations
curl -X POST http://localhost:8080/calculate-list \
  -H "Content-Type: application/json" \
  -d '{"travel":12000,"shopping":8000}'

# Card details
curl http://localhost:8080/cards/1

# Log analytics (mirrors frontend Apply)
curl -X POST http://localhost:8080/analytics/apply \
  -H "Content-Type: application/json" \
  -d '{"cardId":1,"cardName":"HDFC Regalia Gold Credit Card"}'
```

## 📝 Notes

- To disable Redis, set `REDIS_DISABLED=true` (in-memory cache will be used automatically).
- MongoDB is optional but recommended for analytics. If unreachable, the API still returns success.
- All responses retain their original shape to avoid breaking the frontend contract.
- Debounced API calls in the frontend reduce backend load for rapid slider movements.
- A friendly 404 page is included and the Apply flow now shows an animated overlay before returning to the home screen.

## 📄 License

This project is created as an assignment submission. Feel free to extend or adapt it as required.

---

Need help or want to extend the analytics dashboards? Reach out or open an issue! 🚀
