# URL Shortener API 🔗

A lightweight, scalable RESTful URL shortener service built with Node.js, Express, and MongoDB — featuring JWT authentication, custom aliases, link expiration, click tracking, and full CRUD operations.

---

## 📌 Features

- **User Authentication**: Register and login with secure password hashing (`bcryptjs`) and JWT-based session tokens.
- **Shorten Long URLs**: Generates unique, compact alphanumeric short codes using `nanoid`.
- **URL Validation & Normalization**: Automatically prepends `https://` if the protocol is missing; validates domain names and URL structures.
- **Custom Vanity Aliases**: Create custom short codes with alphanumeric characters, dashes, and underscores (3–30 characters).
- **Link Expiration (TTL)**: Schedule expiry timestamps (`expiresAt`). Expired URLs automatically respond with HTTP 410 Gone.
- **Redirection & Click Tracking**: Public redirect endpoint tracks click counts on each redirect.
- **Owner-Scoped CRUD**: Authenticated users can list, view stats, update, and delete only their own URLs.
- **Paginated URL Listing**: Fetch your URLs with customizable `page` and `limit` query parameters.
- **URL Stats**: View detailed statistics for any of your short links (total clicks, expiry status, creation date).
- **RESTful API**: Clean route separation following the MVC pattern (`routes/`, `controllers/`, `models/`).
- **Input Validation**: Dedicated validation utilities for URLs, expiration dates, and auth inputs.
- **Health Check Endpoint**: Simple base route (`GET /`) to verify API status.
- **MongoDB Persistence**: Schema validation and timestamped record management via Mongoose.

---

## 🛠 Tech Stack

### Current
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (ODM)
- **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (JWT) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (password hashing)
- **Utilities**:
  - `nanoid` (unique short-code generation)
  - `dotenv` (environment configuration)
- **Development**: `nodemon` (hot reloading)

### Future Enhancements & Roadmap
- [x] **Redirection Endpoint**: `GET /api/urls/:shortCode` redirects users to the original URL and tracks click counts.
- [x] **Custom Aliases**: Allow users to specify custom vanity URLs (e.g., `github-profile`).
- [x] **Link Expiration**: Expire short links after a specified timestamp with `410 Gone` status.
- [x] **Authentication & User Accounts**: User registration and JWT-based auth to manage personal links.
- [x] **URL Stats**: View click counts, expiry status, and creation date per link.
- [x] **Update & Delete Links**: Full CRUD — update original URL or expiry, delete links entirely.
- [x] **Owner-Scoped Access**: Users can only manage their own links.
- [x] **Input Validation Layer**: Dedicated utility modules for URL, expiry, and auth validation.
- [ ] **URL Analytics & Dashboard**: Detailed analytics (clicks over time, geographic data, referrers, device types).
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
   git clone https://github.com/antrikshyagupta/URL-Shortener.git
   cd URL-Shortener
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
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

### 🔐 Authentication

#### Register a New User
```http
POST /api/auth/register
Content-Type: application/json
```

##### Request Body
| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | User's display name. |
| `email` | string | **Yes** | Valid email address (must be unique). |
| `password` | string | **Yes** | Minimum 8 characters. |

##### Example Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

##### Responses

- **201 Created**:
  ```json
  {
    "message": "Registration successful",
    "user": {
      "id": "673f...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

- **400 Bad Request**: Invalid name, email format, or password too short.
  ```json
  {
    "message": "Valid name, email, and password (8+ characters) are required"
  }
  ```

- **409 Conflict**: Email already registered.
  ```json
  {
    "message": "Email is already registered"
  }
  ```

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json
```

##### Request Body
| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | **Yes** | Registered email address. |
| `password` | string | **Yes** | Account password. |

##### Example Request
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

##### Responses

- **200 OK**: Returns a JWT token for authenticated requests.
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "673f...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

- **400 Bad Request**: Missing email or password.
  ```json
  {
    "message": "Email and password are required"
  }
  ```

- **401 Unauthorized**: Invalid credentials.
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

---

### 🔗 URL Management

> **Note**: All URL management endpoints (except redirect) require a valid JWT token in the `Authorization` header:
> ```
> Authorization: Bearer <your_jwt_token>
> ```

---

#### Shorten a URL
```http
POST /api/urls/shorten
Authorization: Bearer <token>
Content-Type: application/json
```

##### Request Body
| Field | Type | Required | Description |
|---|---|---|---|
| `originalUrl` | string | **Yes** | Destination URL (auto-prepends `https://` if omitted). |
| `customAlias` | string | *Optional* | Custom short code (3–30 chars, alphanumeric, hyphens, underscores). |
| `expiresAt` | string (ISO Date) | *Optional* | Future expiration date/time (e.g., `2026-12-31T23:59:59.000Z`). |

##### Example Request
```json
{
  "originalUrl": "github.com/octocat",
  "customAlias": "octocat-profile",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

##### Responses

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
      "owner": "673f...",
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

- **401 Unauthorized**: Missing or invalid JWT token.

- **409 Conflict**: Custom alias already exists.
  ```json
  {
    "message": "Custom alias already exists"
  }
  ```

---

#### Redirect to Original URL *(Public — No Auth Required)*
```http
GET /api/urls/:shortCode
```

##### Parameters
- `shortCode` *(string, required)*: The short code or custom alias for the link.

##### Responses
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

---

#### List Your URLs (Paginated)
```http
GET /api/urls/?page=1&limit=10
Authorization: Bearer <token>
```

##### Query Parameters
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number (must be ≥ 1). |
| `limit` | integer | `10` | Results per page (1–100). |

##### Responses

- **200 OK**:
  ```json
  {
    "message": "URLs fetched successfully",
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
  ```

- **400 Bad Request**: Invalid page or limit value.
- **401 Unauthorized**: Missing or invalid JWT token.

---

#### Get URL Stats
```http
GET /api/urls/:shortCode/stats
Authorization: Bearer <token>
```

##### Responses

- **200 OK**:
  ```json
  {
    "message": "URL stats fetched successfully",
    "data": {
      "originalUrl": "https://github.com/octocat",
      "shortCode": "octocat-profile",
      "totalClicks": 42,
      "createdAt": "2026-10-24T02:00:00.000Z",
      "expiresAt": "2026-12-31T23:59:59.000Z",
      "isExpired": false
    }
  }
  ```

- **401 Unauthorized**: Missing or invalid JWT token.
- **404 Not Found**: URL not found or not owned by you.

---

#### Update a URL
```http
PATCH /api/urls/:shortCode
Authorization: Bearer <token>
Content-Type: application/json
```

##### Request Body
| Field | Type | Required | Description |
|---|---|---|---|
| `originalUrl` | string | *Optional* | New destination URL. |
| `expiresAt` | string (ISO Date) or `null` | *Optional* | New expiry date, or `null` to remove expiration. |

> At least one field must be provided.

##### Example Request
```json
{
  "originalUrl": "https://new-destination.com",
  "expiresAt": null
}
```

##### Responses

- **200 OK**:
  ```json
  {
    "message": "URL updated successfully",
    "data": { ... }
  }
  ```

- **400 Bad Request**: No fields provided, invalid URL, or invalid expiry date.
- **401 Unauthorized**: Missing or invalid JWT token.
- **404 Not Found**: URL not found or not owned by you.

---

#### Delete a URL
```http
DELETE /api/urls/:shortCode
Authorization: Bearer <token>
```

##### Responses

- **200 OK**:
  ```json
  {
    "message": "URL deleted successfully"
  }
  ```

- **401 Unauthorized**: Missing or invalid JWT token.
- **404 Not Found**: URL not found or not owned by you.

---

## 📁 Project Structure

```
url-shortener/
├── src/
│   ├── app.js                        # Express application setup & middleware
│   ├── config/
│   │   └── db.js                     # MongoDB connection config
│   ├── controllers/
│   │   ├── auth.controllers.js       # Register & Login logic (bcrypt + JWT)
│   │   └── url.controllers.js        # URL CRUD (shorten, redirect, stats, update, delete)
│   ├── middlewares/
│   │   └── auth.middleware.js        # JWT token verification middleware
│   ├── models/
│   │   ├── url.model.js              # Mongoose URL schema (shortCode, clicks, expiresAt, owner)
│   │   └── user.model.js             # Mongoose User schema (name, email, password)
│   ├── routes/
│   │   ├── auth.routes.js            # POST /register, POST /login
│   │   └── url.routes.js             # URL routes (protected + public redirect)
│   └── utils/
│       ├── authValidation.js         # Register/login input validation
│       └── urlValidation.js          # URL & expiry date validation helpers
├── .gitignore
├── package.json
├── README.md
└── server.js                         # Entry point / server listener
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | **Yes** | MongoDB connection string (local or Atlas). |
| `JWT_SECRET` | **Yes** | Secret key used to sign JWT tokens. |
| `JWT_EXPIRES_IN` | No | Token expiration duration (default: `1d`). |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
