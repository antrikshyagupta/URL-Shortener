# URL Shortener API 🔗

A lightweight, scalable RESTful URL shortener service built with Node.js, Express, and MongoDB.

---

## 📌 Features

- **Shorten Long URLs**: Generates unique, compact alphanumeric keys using `nanoid`.
- **Redirection & Click Tracking**: Track original URLs, unique short codes, and click statistics.
- **RESTful API**: Clean route separation following MVC pattern (`routes/`, `controllers/`, `models/`).
- **MongoDB Persistence**: Schema validation and timestamped record management via Mongoose.

---

## 🛠 Tech Stack

### Current
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (ODM)
- **Utilities**:
  - `nanoid` (for unique short-code generation)
  - `dotenv` (environment configuration)
- **Development**: `nodemon` (hot reloading)

### Future Enhancements & Roadmap
- [ ] **Redirection Endpoint**: `GET /:shortCode` to redirect users and increment click counts.
- [ ] **URL Analytics & Dashboard**: Detailed analytics (clicks over time, geographic data, referrers, device types).
- [ ] **Custom Aliases**: Allow users to specify custom vanity URLs (e.g., `/my-brand-url`).
- [ ] **Link Expiration**: Expire short links after a specified TTL or date.
- [ ] **Authentication & User Accounts**: User registration and JWT-based auth to manage personal links.
- [ ] **Rate Limiting & Abuse Protection**: Using Redis or Express rate limiters to prevent bot spam.
- [ ] **Caching Layer**: Redis cache for high-throughput redirection lookups.
- [ ] **Frontend Client**: Modern responsive web interface for creating and managing short links.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) instance running locally or via MongoDB Atlas

### Installation

1. **Clone the repository**:
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd url-shortener
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   BASE_URL=http://localhost:3000
   ```

4. **Start the application**:
   - For development (with hot-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

---

## 📡 API Reference

### Health / Base Check
```http
GET /
```
**Response**:
```text
URL Shortener API
```

### Shorten a URL
```http
POST /api/urls/shorten
Content-Type: application/json
```
**Request Body**:
```json
{
  "originalUrl": "https://example.com/very/long/url/path"
}
```

**Response (201 Created)**:
```json
{
  "message": "URL shortened successfully",
  "data": {
    "_id": "673f...",
    "originalUrl": "https://example.com/very/long/url/path",
    "shortCode": "abc123",
    "clicks": 0,
    "createdAt": "2026-10-23T14:24:00.000Z",
    "updatedAt": "2026-10-23T14:24:00.000Z"
  }
}
```

---

## 📁 Project Structure

```
url-shortener/
├── src/
│   ├── app.js            # Express application setup & middleware
│   ├── config/
│   │   └── db.js         # MongoDB connection config
│   ├── controllers/
│   │   └── url.controllers.js  # Controller logic for URL actions
│   ├── models/
│   │   └── url.model.js        # Mongoose URL schema
│   └── routes/
│       └── url.routes.js       # Express route handlers
├── .gitignore
├── package.json
├── README.md
└── server.js             # Entry point / server listener
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
