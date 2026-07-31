# JhaTech Backend — Setup Guide

## Tech Stack
- PHP 8+
- MySQL 5.7+
- Google Gemini AI (Free API)
- Apache (.htaccess for routing)

---

## Step 1 — Install XAMPP (local server)

Download from: https://www.apachefriends.org/
- Start **Apache** and **MySQL** from XAMPP Control Panel

---

## Step 2 — Place project in htdocs

```
C:/xampp/htdocs/ai-digital-growth-platform-1/
```

---

## Step 3 — Create MySQL Database

1. Open **phpMyAdmin** → http://localhost/phpmyadmin
2. Click **Import** → select `backend/db/schema.sql`
3. Click **Go** — all 4 tables will be created

---

## Step 4 — Configure Database

Edit `backend/config/db.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // your MySQL username
define('DB_PASS', '');           // your MySQL password
define('DB_NAME', 'jhatech_db');
```

---

## Step 5 — Get Free Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click **Create API Key**
4. Copy the key

Edit `backend/config/gemini.php`:

```php
define('GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY_HERE');
```

---

## Step 6 — Configure Frontend

Create `.env` file in project root:

```
VITE_API_URL=http://localhost/ai-digital-growth-platform-1/backend/api
```

---

## Step 7 — Run Frontend

```bash
npm install
npm run dev
```

Open: http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pain-analysis.php` | Submit business form → Gemini AI report |
| POST | `/api/register-partner.php` | Register referral partner |
| GET  | `/api/get-referrals.php?code=JTXXXX` | Get partner dashboard data |
| POST | `/api/contact.php` | Submit contact/pricing enquiry |

---

## Folder Structure

```
backend/
├── config/
│   ├── cors.php        ← CORS headers (allow React to call PHP)
│   ├── db.php          ← MySQL connection
│   └── gemini.php      ← Gemini AI helper
├── api/
│   ├── pain-analysis.php     ← AI report endpoint
│   ├── register-partner.php  ← Referral registration
│   ├── get-referrals.php     ← Partner dashboard data
│   └── contact.php           ← Enquiry form
├── db/
│   └── schema.sql      ← MySQL table definitions
└── .htaccess           ← Routing + security
```
