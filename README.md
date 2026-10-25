# CampusFix — Campus Maintenance & Grievance Portal

> **Full Stack MERN Application** developed by **Megha K H** (Sahrdaya College of Engineering and Technology) as part of the **ICT Academy of Kerala Summer Internship Program**.

* 🌐 **Live Hosted Website (Vercel)**: [https://campus-fix-lake.vercel.app](https://campus-fix-lake.vercel.app)
* ⚙️ **Live Backend API (Render)**: [https://campus-fix-n3qc.onrender.com](https://campus-fix-n3qc.onrender.com)
* 📄 **Summer Internship Report**: [`docs/CampusFix_Summer_Internship_Report.md`](./docs/CampusFix_Summer_Internship_Report.md)
* 📋 **Software Requirements Specification (SRS)**: [`docs/CampusFix_Software_Requirements_Specification_SRS.md`](./docs/CampusFix_Software_Requirements_Specification_SRS.md)

---

## 📌 Project Overview
**CampusFix** is a private, role-based campus grievance and facility maintenance portal for educational institutions. It replaces manual complaint registers and scattered communication with an organized, transparent system:
* **Students & Staff**: Quickly lodge maintenance issues across campus (classrooms, computer labs, hostels, libraries) and track their resolution status in real time.
* **Campus Maintenance & Administrators**: Manage an overview dashboard of reported tickets, filter by department, urgency, or category, assign technicians, update progress (`Pending` → `In Progress` → `Resolved`), and add official resolution remarks.

---

## 🛠️ Tech Stack (MERN)
* **Frontend**: React.js (Vite), React Router, Lucide Icons, Modern CSS
* **Backend API**: Node.js & Express.js (RESTful API architecture)
* **Database**: MongoDB with Mongoose ODM
* **Security & Auth**: JSON Web Tokens (JWT), Password Hashing with `bcryptjs`, Role-Based Access Control (RBAC)

---

## 📂 Project Architecture
```text
campusfix/
├── client/                 # React frontend application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI pieces (Navbar, TicketCard, StatusBadge)
│   │   ├── pages/          # Route views (Home, Login, Register, Dashboard, NewTicket)
│   │   ├── services/       # Centralized API client (Axios/Fetch)
│   │   └── context/        # Authentication & global state
│   ├── .env.example        # Frontend environment template
│   └── package.json
├── server/                 # Node.js & Express API backend
│   ├── src/
│   │   ├── config/         # Database connection setup
│   │   ├── models/         # Mongoose schemas (User, Issue)
│   │   ├── routes/         # Express endpoint definitions
│   │   ├── controllers/    # Business logic & request handling
│   │   └── middleware/     # Auth verification & error handling
│   ├── .env.example        # Backend environment template
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js** (v18 or higher)
* **npm**
* **MongoDB** (Local instance or MongoDB Atlas connection string)

### 1. Clone the repository
```bash
git clone <repository-url>
cd campusfix
```

### 2. Configure Backend (`server/`)
```bash
cd server
npm install
cp .env.example .env
# Edit .env and supply your MONGODB_URI and JWT_SECRET
npm run dev
```

### 3. Configure Frontend (`client/`)
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

The application will be running at:
* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:5000`

---

## 👥 User Roles & Features
| Feature | Student / Staff | Admin / Maintenance |
| :--- | :---: | :---: |
| Account Registration & Login | ✅ | ✅ |
| Submit New Maintenance Ticket | ✅ | ❌ |
| View Personal Submitted Tickets | ✅ | ❌ |
| View Campus Feed & Filter Tickets | ✅ | ✅ |
| Change Ticket Status (`In Progress` / `Resolved`) | ❌ | ✅ |
| Add Official Resolution Remarks | ❌ | ✅ |
| Delete Duplicate/Invalid Tickets | ❌ | ✅ |
