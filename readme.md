# Backend Test – Express + TypeScript (MySQL + Raw Query + Zod + JWT + API Key)

Project ini dibuat untuk memenuhi technical test Backend Developer.  
Aplikasi menggunakan **Express + TypeScript** dengan query **raw SQL** (tanpa ORM), serta menerapkan praktik clean architecture, modular services, DTO + Zod validation, JWT auth, API Key auth, logging menggunakan Winston, dan scheduler worker.

---

## 🚀 Features

### 🔐 Authentication
- Login menggunakan **JWT**
- Login menggunakan **API Key** (alternative authentication)
- Endpoint untuk generate API Key

### 🧾 CRUD & Business Logic
- CRUD Products
- CRUD Customers
- Create Orders
- Transaction (MySQL) untuk memastikan konsistensi data
- Handling **race condition** untuk sequence order dan pengurangan stok

### 📊 Reports
- Top customers by total purchase
- Paginated list products
- Generic response wrapper

### 🔁 Scheduler
- Task yang berjalan setiap menit menggunakan `node-cron`
- Log hasil task ke table `scheduled_logs`

### 🪵 Winston Logging
- Log ke console (berwarna)
- Log ke file `logs/combined.log` dan `logs/error.log`

### 🧰 Clean Architecture
- DTO + Zod Validation
- Service layer
- Controller layer
- Custom error handling (`ApiError`)
- Request/Response wrapper

---

## 🛠 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **MySQL (raw query)**
- **Zod** (schema validation)
- **Winston** (logging)
- **JWT**
- **node-cron** (scheduler)
- **ts-node-dev** (development)

---

## 📁 Folder Structure

```src/
├── app.ts
├── server.ts
├── config/
│ └── db.ts
├── middlewares/
│ ├── authJwt.ts
│ ├── authApiKey.ts
│ ├── errorHandler.ts
│ └── responseWrapper.ts
├── modules/
│ ├── auth/
│ ├── customers/
│ ├── orders/
│ ├── products/
│ ├── reports/
│ └── scheduler/
├── routes/
│ └── index.ts
├── utils/
│ ├── ApiError.ts
│ ├── logger.ts
│ ├── generateApiKey.ts
│ ├── pagination.ts
│ └── password.ts
sql/
└── schema.sql
logs/
├── combined.log
└── error.log
```


---

## ⚙️ Installation

### 1️⃣ Install dependencies
- yarn install

### 2️⃣ Copy environment file
- cp .env.example .env


### 3️⃣ Import MySQL schema
- Buat database:

```sql
CREATE DATABASE backend_test;
```
- Lalu import schema:
- mysql -u root -p backend_test < sql/schema.sql

### 4️⃣ Jalankan Project
- yarn dev
