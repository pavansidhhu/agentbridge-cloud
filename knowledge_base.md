# AgentBridge Cloud Backend — Knowledge Base

This document serves as the central knowledge base for the **AgentBridge Cloud** backend, landing pages, and database configuration. 

---

## 🏗️ Architecture Overview

The AgentBridge infrastructure is divided into two primary parts:

1. **PyQt Desktop Application (Local Client):**
   - Handles automation via Playwright.
   - Hosts a local WebSocket API.
   - Prompts Google OAuth/Login.
   - Synchronizes telemetry with the Cloud Backend.

2. **Next.js Web Server (Vercel Serverless Backend & landing site):**
   - Serves the Landing, Download, and Privacy pages.
   - Provides stateless serverless REST API endpoints for user registration, config control, heartbeats, and admin stats.
   - Connects directly to a free-tier MongoDB Atlas cluster.

---

## 🗄️ MongoDB Database Setup

Only two collections are needed in the `agentbridge` database:

### 1. `users` Collection
Stores registered app clients and active sessions.

* **Unique Index Requirement:**
  - Index field: `email`
  - Option: `Unique = true` (prevents duplicate users)

* **Schema Document Example:**
  ```json
  {
    "_id": "ObjectId",
    "email": "user@gmail.com",
    "machineId": "DESKTOP-ABC123",
    "appVersion": "1.0.0",
    "firstSeen": "2026-06-13T10:00:00Z",
    "lastSeen": "2026-06-13T10:00:00Z",
    "os": "Windows 11",
    "country": "India"
  }
  ```

### 2. `config` Collection
Stores global administration variables.

* **Single Document Requirement:**
  - Query identifier: `_id: "global"`
  
* **Schema Document Example:**
  ```json
  {
    "_id": "global",
    "latestVersion": "1.0.0",
    "forceUpdate": false,
    "maintenance": false,
    "announcement": ""
  }
  ```

---

## 🔌 API Documentation

### 1. `POST /api/register`
* **Trigger:** Desktop app calls this once at startup after successful login.
* **Payload Format (JSON):**
  ```json
  {
    "email": "user@gmail.com",
    "appVersion": "1.0.0",
    "machineId": "ABC123"
  }
  ```
* **Server-side Logic:**
  - Sanitizes and validates inputs (email validation, max length limits).
  - Automatically parses the user's Operating System from the request `User-Agent`.
  - Automatically parses the user's country from the edge header `x-vercel-ip-country` (inserted by Vercel routers).
  - Upserts the document using:
    ```javascript
    await users.updateOne(
      { email },
      {
        $set: { appVersion, machineId, lastSeen: new Date(), os, country },
        $setOnInsert: { firstSeen: new Date() }
      },
      { upsert: true }
    );
    ```
* **Response:** `{ "success": true }` (or standard `400` / `500` error schemas)

---

### 2. `POST /api/heartbeat`
* **Trigger:** Desktop app periodically sends heartbeats to maintain active status.
* **Payload Format (JSON):**
  ```json
  {
    "email": "user@gmail.com"
  }
  ```
* **Response:** `{ "success": true }`

---

### 3. `GET /api/config`
* **Trigger:** Called at client startup to retrieve administration rules.
* **Database Auto-Initialization:** If the config collection is empty, the server auto-populates it with defaults.
* **Response:**
  ```json
  {
    "latestVersion": "1.0.0",
    "forceUpdate": false,
    "maintenance": false,
    "announcement": ""
  }
  ```

---

### 4. `GET /api/stats`
* **Trigger:** Admin tool or metrics monitoring script.
* **Security:** Must pass the admin secret key via the headers:
  - Header Name: `x-admin-key`
  - Value: Must match the backend environment variable `ADMIN_SECRET`.
* **Response:**
  ```json
  {
    "users": 152,
    "activeToday": 41,
    "latestVersion": "1.0.0"
  }
  ```

---

## 🛠️ Desktop Integration Details

### Email Extraction (Python/Playwright)
Once your local Google login succeeds, retrieve the email address by inspecting the DOM:
```python
emails = await page.evaluate("""
() => {
    return document.body.innerText.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/gi
    ) || [];
}
""")
email = emails[0].lower() if emails else ""
state.user_email = email
```

### Version Checking & Blocking Flow (Python)
Compare client configuration against API response:
```python
import requests

API_URL = "https://your-domain.vercel.app/api"
APP_VERSION = "1.0.0"

# Startup flow
try:
    config = requests.get(f"{API_URL}/config").json()
    
    if config.get("maintenance"):
        show_maintenance_banner()
        block_app_usage()
        
    if config.get("latestVersion") != APP_VERSION:
        show_update_dialog()
        if config.get("forceUpdate"):
            block_app_usage()
except Exception as e:
    print(f"Network error verification: {e}")
```

---

## 🚀 Deployment Instructions

### 1. Local Environment Config
1. Create a `.env.local` file at the root of `agentbridge-cloud`.
2. Populate the parameters:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agentbridge
   ADMIN_SECRET=your_super_secret_admin_key
   ```
3. Run the development server: `npm run dev`

### 2. Vercel Cloud Deployment
1. Import your project into [Vercel](https://vercel.com).
2. Go to project **Settings → Environment Variables**.
3. Add `MONGODB_URI` and `ADMIN_SECRET` with values pointing to your live Atlas instance.
4. Deploy the main branch. Your endpoints will be live instantly!
