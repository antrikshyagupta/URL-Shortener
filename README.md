# URL Shortener (MERN Stack) 🔗

A full-stack, production-ready URL shortener web application with a separated MERN architecture (**`backend/`** and **`frontend/`**). Features JWT authentication, link expiration (TTL), custom vanity aliases, click analytics, and a modern frontend designed with the **Organic Intelligence** aesthetic (Playfair Display, JetBrains Mono, Inter, cream/charcoal palette, and fluid micro-interactions).

---

## 📌 Features

### 🖥️ Frontend (React + Vite + Tailwind CSS)
- **Editorial Tech Hybrid Design**: Styled with the "Organic Intelligence" aesthetic pairing serif headings (*Playfair Display*) with monospace technical accents (*JetBrains Mono*) and readable body typography (*Inter*).
- **Interactive Dashboard**: Create new links, set custom vanity aliases, and assign optional expiry dates.
- **Link Telemetry & Stats Modal**: Real-time click counter, destination view, creation timestamp, and active/expired status indicators.
- **Clipboard & Direct Redirection**: One-click link copying and direct preview testing.
- **User Authentication**: Dedicated Register and Login flows with form validation and JWT session persistence.
- **Responsive & Accessible**: Seamlessly adapts from desktop monitors to mobile devices.

### ⚙️ Backend (Node.js + Express + MongoDB)
- **User Authentication**: Secure signup and login with salt-hashed passwords (`bcryptjs`) and JWT bearer tokens.
- **Shorten Long URLs**: Generates compact, collision-resistant alphanumeric codes via `nanoid`.
- **URL Validation & Normalization**: Automatically validates destination URLs and prepends missing protocols (`https://`).
- **Custom Vanity Aliases**: Supports custom slugs (3–30 characters, letters, numbers, hyphens, and underscores).
- **Link Expiration (TTL)**: Schedule expiry timestamps (`expiresAt`). Expired URLs return HTTP `410 Gone`.
- **Redirection & Click Tracking**: Public redirect endpoint tracks click counts on each visit.
- **Owner-Scoped CRUD**: Authenticated users can list, view stats, update, and delete only their own URLs.
- **Paginated URL Listing**: Query URLs with customizable `page` and `limit` parameters.
- **Dedicated Validation Layer**: Modular validation utilities for credentials, URLs, and expiration dates.
- **DNS Resiliency**: Automated public DNS fallback (`1.1.1.1`, `8.8.8.8`) to prevent MongoDB SRV resolution timeouts on Windows.

---

## 🛠 Tech Stack

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (ODM)
- **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (JWT) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Utilities**: `nanoid` (short codes), `dotenv` (environment variables)
- **Dev Tools**: `nodemon` (hot reloading)

### Frontend
- **Library**: [React 18](https://react.dev/)
- **Bundler & Dev Server**: [Vite 5](https://vitejs.dev/) (with `/api` backend proxy)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/) (v6)

---

## 📁 Project Structure

```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── app.js                    # Express app configuration & route registration
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection logic & logging
│   │   ├── controllers/
│   │   │   ├── auth.controllers.js   # User registration & login controllers
│   │   │   └── url.controllers.js    # Shorten, redirect, stats, update, delete
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js    # JWT verification & request user injection
│   │   ├── models/
│   │   │   ├── url.model.js          # Mongoose schema for short URLs
│   │   │   └── user.model.js         # Mongoose schema for user accounts
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Auth endpoints (/api/auth)
│   │   │   └── url.routes.js         # URL endpoints (/api/urls)
│   │   └── utils/
│   │       ├── authValidation.js     # Auth input format checkers
│   │       └── urlValidation.js      # URL syntax & TTL date checkers
│   ├── server.js                     # Backend HTTP server listener & DB init
│   └── package.json                  # Backend dependencies & scripts
│
├── frontend/
│   ├── index.html                    # Single-page application entry HTML
│   ├── vite.config.js                # Vite bundler & API proxy configuration
│   ├── tailwind.config.cjs           # Theme tokens (cream, charcoal, indigo, fonts)
│   ├── postcss.config.cjs            # PostCSS configuration
│   ├── package.json                  # Frontend dependencies & scripts
│   └── src/
│       ├── main.jsx                  # React DOM mount point
│       ├── App.jsx                   # Layout container & route declarations
│       ├── index.css                 # Tailwind directives & font imports
│       ├── api.js                    # Centralized fetch client for backend APIs
│       ├── context/
│       │   └── AuthContext.jsx       # Auth state provider & localStorage sync
│       ├── components/
│       │   ├── Header.jsx            # Top navbar with auth state & user display
│       │   ├── Hero.jsx              # Landing hero section with wave layout
│       │   ├── UrlForm.jsx           # Link shortener form (URL, alias, expiry)
│       │   ├── UrlCard.jsx           # Short link card (copy, visit, stats, delete)
│       │   └── StatsModal.jsx        # Telemetry & metrics modal
│       └── pages/
│           ├── Home.jsx              # Landing page
│           ├── Login.jsx             # Sign-in page
│           ├── Register.jsx          # Account creation page (Name, Email, Password)
│           ├── Dashboard.jsx         # Authenticated link management hub
│           └── NotFound.jsx          # 404 fallback page
│
├── .env                              # Environment variables (Mongo URI, JWT Secret)
├── .gitignore                        # Git exclusion rules
├── package.json                      # Root workspace scripts
└── README.md                         # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) instance (locally or via MongoDB Atlas)

---

### 1. Clone & Setup Environment

```bash
git clone https://github.com/antrikshyagupta/URL-Shortener.git
cd URL-Shortener
```

Create a `.env` file in the root directory (or in `backend/`):
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
PORT=3000
```

---

### 2. Install Dependencies

Install dependencies in both directories:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 3. Run the Development Servers

Open two terminal windows:

#### Terminal 1 — Backend API
```bash
cd backend
npm run dev
```
*Server starts on `http://localhost:3000`.*

#### Terminal 2 — Frontend UI
```bash
cd frontend
npm run dev
```
*Frontend opens on `http://localhost:5173` (with `/api` requests proxied to the backend).*

Visit **http://localhost:5173** in your browser.

---

## 📡 API Reference

### Base Check
```http
GET /
```
**Response**: `URL Shortener API`

---

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json
```
**Body**:
```json
{
  "name": "Alex Vance",
  "email": "alex@example.com",
  "password": "Password123"
}
```
*Note: Name is required, password must be at least 8 characters.*

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json
```
**Body**:
```json
{
  "email": "alex@example.com",
  "password": "Password123"
}
```
**Response (200 OK)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "660c1...",
    "name": "Alex Vance",
    "email": "alex@example.com"
  }
}
```

---

### URL Endpoints

#### 1. Shorten URL (Protected)
```http
POST /api/urls/shorten
Authorization: Bearer <token>
Content-Type: application/json
```
**Body**:
```json
{
  "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  "customAlias": "mdn-js",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

#### 2. Redirect to Original URL (Public)
```http
GET /api/urls/:shortCode
```
- Increments `clicks` by 1.
- Automatically redirects to the destination URL with HTTP `302`.
- If expired, returns HTTP `410 Gone`.

#### 3. List User URLs (Protected & Paginated)
```http
GET /api/urls?page=1&limit=10
Authorization: Bearer <token>
```
**Response (200 OK)**:
```json
{
  "message": "URLs fetched successfully",
  "data": [
    {
      "_id": "660c1...",
      "originalUrl": "https://example.com",
      "shortCode": "mdn-js",
      "clicks": 5,
      "expiresAt": "2026-12-31T23:59:59.000Z",
      "createdAt": "2026-03-29T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### 4. Get URL Statistics (Protected)
```http
GET /api/urls/:shortCode/stats
Authorization: Bearer <token>
```
**Response (200 OK)**:
```json
{
  "message": "URL stats fetched successfully",
  "data": {
    "originalUrl": "https://example.com",
    "shortCode": "mdn-js",
    "totalClicks": 5,
    "createdAt": "2026-03-29T10:00:00.000Z",
    "expiresAt": "2026-12-31T23:59:59.000Z",
    "isExpired": false
  }
}
```

#### 5. Update URL (Protected)
```http
PATCH /api/urls/:shortCode
Authorization: Bearer <token>
Content-Type: application/json
```
**Body**:
```json
{
  "originalUrl": "https://example.com/new-path",
  "expiresAt": "2027-01-01T00:00:00.000Z"
}
```

#### 6. Delete URL (Protected)
```http
DELETE /api/urls/:shortCode
Authorization: Bearer <token>
```
**Response (200 OK)**:
```json
{
  "message": "URL deleted successfully"
}
```

---

## 🔑 Environment Variables

| Variable | Required | Description | Default |
|---|---|---|---|
| `MONGO_URI` | **Yes** | MongoDB Atlas or local connection string | — |
| `JWT_SECRET` | **Yes** | Secret key for signing JSON Web Tokens | — |
| `JWT_EXPIRES_IN` | No | Token lifetime string (e.g. `1d`, `7d`) | `1d` |
| `PORT` | No | Backend HTTP server listening port | `3000` |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
