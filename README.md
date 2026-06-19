# AgentBridge Cloud ☁️

AgentBridge Cloud is the web dashboard and API backend for the **AgentBridge Local Automation System**. It serves as the bridge between your local Gemini automation workers and your users, providing a beautiful landing page, software distribution, and a comprehensive admin command center.

![Admin Dashboard](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel)

## 🌟 Features

* **Modern Landing Page:** A stunning, glassmorphism-inspired landing page to distribute your desktop application.
* **Frictionless Downloads:** Direct links to your GitHub releases for seamless user onboarding.
* **Real-time Admin Dashboard:** A secure, password-protected dashboard (`/admin`) to monitor your network.
* **Live Status Tracking:** See exactly which of your users are online right now with pulsing status indicators.
* **User Feedback System:** A dedicated `/feedback` page where users can submit their experiences directly to your database.
* **API Endpoints:** Built-in endpoints for your Python desktop application to register users and send heartbeats (`/api/register`, `/api/heartbeat`).

## 🚀 Quick Start (Local Development)

### Prerequisites
* Node.js 18+
* A MongoDB Atlas Cluster (Free tier works perfectly)

### 1. Clone & Install
```bash
git clone https://github.com/pavansidhhu/agentbridge-cloud.git
cd agentbridge-cloud
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Your MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/agentbridge?retryWrites=true&w=majority

# Admin Dashboard Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_SESSION_SECRET=your_super_secret_random_string_here
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page, and [http://localhost:3000/admin](http://localhost:3000/admin) to view your dashboard.

## ☁️ Deployment (Vercel)

This project is optimized for deployment on Vercel.

1. Push your code to GitHub.
2. Import the repository in your Vercel Dashboard.
3. Add your Environment Variables (`MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) in the Vercel project settings.
4. Deploy!

### Important Note on MongoDB with Vercel
Vercel uses dynamic IP addresses. To allow your deployed Vercel app to connect to your MongoDB Atlas database:
1. Go to your MongoDB Atlas Dashboard.
2. Click **Network Access** under the Security menu.
3. Click **Add IP Address**.
4. Select **Allow Access From Anywhere** (`0.0.0.0/0`).
5. Confirm and wait for it to become Active.

## 🔗 Architecture

AgentBridge Cloud relies on two main MongoDB collections within the `agentbridge` database:
* `users`: Stores hardware IDs, emails, versions, and last-seen timestamps from the desktop app.
* `feedback`: Stores user-submitted feedback and experiences from the `/feedback` route.


