# URL Shortener API 🔗

A lightweight, scalable RESTful URL shortener service built with Node.js, Express, and MongoDB.

---

## 📌 Features

- **Shorten Long URLs**: Generates unique, compact alphanumeric keys using `nanoid`.
- **URL Validation & Normalization**: Automatically prepends `https://` if protocol is missing, validates domain names and URL structures.
- **Custom Vanity Aliases**: Create custom short codes with alphanumeric characters, dashes, and underscores (3–30 characters).
- **Link Expiration (TTL)**: Schedule expiry timestamps (`expiresAt`). Expired URLs automatically respond with HTTP 410 Gone.
- **Redirection & Click Tracking**: Track original URLs, unique short codes, and click counts on each redirect.
- **RESTful API**: Clean route separation following the MVC pattern (`routes/`, `controllers/`, `models/`).
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
- [x] **Redirection Endpoint**: `GET /api/urls/:shortCode` redirects users to the original URL and tracks click counts.
- [x] **Custom Aliases**: Allow users to specify custom vanity URLs (e.g., `github-profile`).
- [x] **Link Expiration**: Expire short links after a specified timestamp with `410 Gone` status.
- [ ] **URL Analytics & Dashboard**: Detailed analytics (clicks over time, geographic data, referrers, device types).
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

---

### Shorten a URL
```http
POST /api/urls/shorten
Content-Type: application/json
```

#### Request Body
| Field | Type | Required | Description |
|---|---|---|---|
| `originalUrl` | string | **Yes** | Destination URL (auto-prepends `https://` if omitted). |
| `customAlias` | string | *Optional* | Custom short code (3–30 chars, alphanumeric, hyphens, underscores). |
| `expiresAt` | string (ISO Date) | *Optional* | Future expiration date/time (e.g., `2026-12-31T23:59:59.000Z`). |

#### Example Request
```json
{
  "originalUrl": "github.com/octocat",
  "customAlias": "octocat-profile",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

#### Responses

- **201 Created**:
  ```json
  {
    "message": "URL shortened successfully",
    "data": {
      "_id": "673f...",
      "originalUrl": "https://github.com/octocat",
      "shortCode": "octocat-profile",
      "clicks": 0,
      "expiresAt": "2026-12-31T23:59:59.000Z",
      "createdAt": "2026-10-24T02:00:00.000Z",
      "updatedAt": "2026-10-24T02:00:00.000Z"
    }
  }
  ```

- **400 Bad Request**:
  - Missing/invalid original URL format or protocol.
  - Invalid custom alias (outside 3–30 characters or invalid characters).
  - Invalid or past expiration date.
  ```json
  {
    "message": "Alias must be 3-30 characters and contain only letters, numbers, hyphens, or underscores"
  }
  ```

- **409 Conflict**:
  ```json
  {
    "message": "Custom alias already exists"
  }
  ```

- **500 Internal Server Error**:
  ```json
  {
    "message": "Can't shorten URL at the moment"
  }
  ```

---

### Redirect to Original URL
```http
GET /api/urls/:shortCode
```

#### Parameters
- `shortCode` *(string, required)*: The short code or custom alias for the link.

#### Responses
- **302 Found**: Redirects the client to `originalUrl` and increments `clicks` by 1.
- **410 Gone**: Link has expired.
  ```json
  {
    "message": "This URL has expired"
  }
  ```
- **404 Not Found**: Short code does not exist.
  ```json
  {
    "message": "URL not found"
  }
  ```
- **500 Internal Server Error**:
  ```json
  {
    "message": "Unable to redirect URL at the moment"
  }
  ```

---

## 📁 Project Structure

```
url-shortener/
├── src/
│   ├── app.js                  # Express application setup & middleware
│   ├── config/
│   │   └── db.js               # MongoDB connection config
│   ├── controllers/
│   │   └── url.controllers.js  # Controller logic (shorten, redirect, validate)
│   ├── models/
│   │   └── url.model.js        # Mongoose URL schema (clicks, expiresAt, etc.)
│   └── routes/
│       └── url.routes.js       # Express route handlers
├── .gitignore
├── package.json
├── README.md
└── server.js                   # Entry point / server listener
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
