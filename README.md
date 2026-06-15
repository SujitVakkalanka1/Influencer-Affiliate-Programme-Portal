# Influencer Affiliate Programme Portal - MongoDB Ready

A full-stack influencer affiliate tracking portal using **React + Express + MongoDB**.

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing

## What Works

- Register/login through Express APIs.
- New users are saved in MongoDB.
- Dashboard data is dynamic, not hardcoded frontend dummy data.
- Admin can create campaigns.
- Influencers can generate affiliate links.
- Affiliate clicks are tracked through `/ref/:unique_code`.
- Conversions calculate commission automatically.
- Influencers can request payouts.
- Admin can approve/reject payouts.
- Red/black simplified UI is retained.

## MongoDB Setup

You need either **local MongoDB Community Server** or **MongoDB Atlas**.

### Option A: Local MongoDB

Install MongoDB Community Server and make sure the MongoDB service is running.

Keep this in `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/influencer_affiliate_portal
```

### Option B: MongoDB Atlas

Create a free Atlas cluster and paste your connection string into `backend/.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/influencer_affiliate_portal?retryWrites=true&w=majority
```

## Quick Start on Windows

Double-click in this order:

```txt
1-install-all.bat
2-start-backend.bat
3-start-frontend.bat
```

Then open:

```txt
http://localhost:5173
```

## Manual Start

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
npm install
npm run dev
```

## Admin Login

```txt
Email: admin@portal.com
Password: password
```

## MongoDB Collections

The backend automatically creates/uses these MongoDB collections:

```txt
users
campaigns
affiliatelinks
affiliateclicks
conversions
payoutrequests
counters
```

The backend automatically seeds:

- Admin user
- Starter campaigns

## Important

No MySQL is used in this version. The database is MongoDB only.


## If npm install fails with internal registry / ETIMEDOUT

Run `CLEAN_INSTALL.bat`. This removes old lock files and node_modules, resets npm registry to `https://registry.npmjs.org/`, then installs frontend and backend dependencies again.
