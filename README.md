# Whaatachi 🇪🇹

**Premium Ethiopian Social Connection Platform**

---

## Stack
- **Frontend**: React 19 + Vite + Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or set `MONGO_URI` in `.env`

### 1. Backend

```bash
cd backend
npm install           # already done
npm start             # or: node server.js
```

Server starts on **http://localhost:5000**

> On first start, an admin user is seeded automatically:
> - Username: `admin`
> - Password: `admin123`

### 2. Frontend

```bash
cd frontend
npm install           # already done
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## Routes

### Public
| Route | Page |
|---|---|
| `/` | Home — hero, intent selector, gender toggle |
| `/browse` | Browse profiles with filters |
| `/profile/:id` | Profile detail + contact reveal |
| `/register` | Create a profile |

### Admin
| Route | Page |
|---|---|
| `/admin/login` | Admin sign-in |
| `/admin/dashboard` | Stats overview |
| `/admin/users` | Approve / reject / delete users |
| `/admin/payments` | Verify / reject payments |
| `/admin/stats` | Charts & analytics |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Create profile (multipart/form-data) |
| GET | `/api/users` | List approved profiles (gender/goal filter) |
| GET | `/api/users/:id/public` | Public profile (no private data) |
| GET | `/api/users/:id/contact` | Contact info (requires payment) |
| POST | `/api/payments/initiate` | Create pending payment |
| POST | `/api/payments/confirm/:id` | Confirm payment (demo) |
| POST | `/api/admin/login` | Admin JWT login |
| GET | `/api/admin/users` | All users (admin) |
| PATCH | `/api/admin/users/:id` | Approve/reject user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/payments` | All payments |
| PATCH | `/api/admin/payments/:id` | Verify/reject payment |
| GET | `/api/admin/stats` | Platform statistics |

---

## Payment Flow

1. User clicks "View Contact" on a **female** profile
2. `PaymentModal` opens — user picks Telebirr or CBE Birr
3. `POST /api/payments/initiate` creates a pending record
4. `POST /api/payments/confirm/:id` confirms it (demo mode — instant)
5. Contact info is revealed client-side
6. Admin can also verify manually via `/admin/payments`

> Male profiles are always free — no payment required.

---

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/whaatachi
JWT_SECRET=your_secret_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

## Design System

| Token | Value |
|---|---|
| Primary Rose | `#E91E8C` |
| Deep Rose | `#C2185B` |
| Midnight Navy | `#0D1B2A` |
| Electric Blue | `#1565C0` |
| Rose Gradient | `135deg, #E91E8C → #C2185B → #1565C0` |
| Display Font | Playfair Display |
| Body Font | Inter |
