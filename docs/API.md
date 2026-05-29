# API Reference

Base URL: `http://localhost:3000/api/v1`

All responses are JSON. Errors have the shape `{ "message": "..." }`.

---

## Auth

### POST /auth/signup

Create a new user.

**Body**

| Field | Type | Required | Notes |
|---|---|---|---|
| username | string | yes | 3–50 chars, must be unique |
| password | string | yes | min 6 chars |
| email | string | no | must be a valid email if provided |

**Example**

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"rahul","email":"rahul@example.com","password":"secret123"}'
```

**201 Created**

```json
{
  "message": "signup successful",
  "user": {
    "id": 1,
    "username": "rahul",
    "email": "rahul@example.com",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors**

| Code | When |
|---|---|
| 400 | Missing fields, password too short, invalid email format |
| 409 | Username already taken |
| 429 | Too many attempts (rate limit: 10 per 15 min per IP) |

---

### POST /auth/login

Authenticate and get a JWT.

**Body**

| Field | Type | Required |
|---|---|---|
| username | string | yes |
| password | string | yes |

**Example**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"rahul","password":"secret123"}'
```

**200 OK**

```json
{
  "message": "login successful",
  "user": {
    "id": 1,
    "username": "rahul",
    "email": "rahul@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors**

| Code | When |
|---|---|
| 400 | Missing username or password |
| 401 | User doesn't exist OR password is wrong (same message in both cases — don't leak which one failed) |
| 429 | Rate limit hit |

---

## Users

All `/users/*` routes require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

### GET /users/me

Returns the user whose token was sent.

**Example**

```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**200 OK**

```json
{
  "user": {
    "id": 1,
    "username": "rahul",
    "email": "rahul@example.com",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

**Errors**

| Code | When |
|---|---|
| 401 | No `Authorization` header, malformed token, or expired token |
| 404 | Token is valid but the user no longer exists in the DB |

---

### GET /users/:username

Look up any user by username.

**Example**

```bash
curl http://localhost:3000/api/v1/users/rahul \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**200 OK**

```json
{
  "user": {
    "id": 1,
    "username": "rahul",
    "email": "rahul@example.com",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

**Errors**

| Code | When |
|---|---|
| 401 | No/invalid token |
| 404 | No user with that username |

---

## Health

### GET /health

Simple liveness check. No auth, not under `/api/v1`.

```bash
curl http://localhost:3000/health
```

**200 OK**

```json
{ "status": "ok" }
```

---

## Discord slash commands

These run in Discord, not over HTTP. They share the same service + repository layer as the REST API.

### `/ppcreateuser`

Create a new user.

| Option | Required | Description |
|---|---|---|
| username | yes | The username |
| password | yes | The password |
| email | no | Optional email |

### `/ppcreateservice`

Add a service for an existing user.

| Option | Required | Description |
|---|---|---|
| username | yes | Owner's username (must already exist) |
| name | yes | Service name |
| description | no | Free text |
| price | no | Number |

### `/ppgetuser`

Look up a user. Returns an embed with the user's id, email, and service count.

| Option | Required | Description |
|---|---|---|
| username | yes | The user to look up |

All bot replies are **ephemeral** — only the person who ran the command sees them.

---

## Using the Postman collection

1. Import `docs/postman_collection.json` into Postman.
2. The `baseUrl` variable defaults to `http://localhost:3000/api/v1` — change it if you're hitting the deployed URL.
3. Run **Signup** or **Login** — the token is auto-saved into the `token` collection variable by the test script.
4. The **Users** requests use `{{token}}` automatically, so they just work after step 3.

If you ever want to inspect or override the token, click the collection name → **Variables** tab → look at `token`.
