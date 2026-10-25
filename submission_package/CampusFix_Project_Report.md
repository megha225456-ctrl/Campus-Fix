# ICT ACADEMY OF KERALA
## Summer Internship Report
### Full Stack Application Development with ReactJS

---

<br><br><br>

# Full Stack Application Development with ReactJS

<br>

### **CampusFix — Campus Maintenance & Grievance Portal**

<br><br>

**Submitted by:**  
**Megha K H**  
**Sahrdaya College of Engineering and Technology**  
**25.10.2026**  

<br><br><br>

---
\pagebreak

## EXECUTIVE SUMMARY

During the full-stack development internship organized by the Information and Communication Technology Academy of Kerala (ICTAK), an end-to-end institutional web application titled **CampusFix** was architected, implemented, tested, and version-controlled. The project delivers an agile, responsive infrastructure maintenance and grievance tracking interface built using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The solution eliminates untracked campus facility breakdowns through an authenticated, role-based workflow distinguishing Student/Faculty reporters from Facility Maintenance Administrators. Key milestones accomplished include building a stateless RESTful API, enforcing salted password hashing with bcrypt, issuing signed JSON Web Tokens (JWT) for session management, provisioning a cloud-hosted MongoDB Atlas cluster, and connecting a reactive Vite frontend capable of handling all four core UI states (loading, success, empty, and descriptive error views) in real time.

---

## INTRODUCTION

Full-stack enterprise and educational applications demand seamless interoperability between client-side user experiences and secure, persistent backend environments. Within educational institutions, maintenance incidents—ranging from computer laboratory equipment failures and classroom projector defects to electrical and plumbing hazards—are traditionally recorded via physical registers or fragmented communication channels. These legacy channels suffer from a lack of progress visibility, redundant duplicate reporting, and absence of administrative metrics.

This capstone internship project bridges this gap by engineering a decoupled, lightweight Single Page Application (SPA). Utilizing an API-first design pattern, user interactions in React communicate with an Express.js server over an authenticated REST contract. The system provides immediate status transparency (`Pending` → `In Progress` → `Resolved`), peer upvoting, and administrative resolution logging while guaranteeing data privacy and rapid sub-second render performance.

---

## OBJECTIVES

* **MERN Architectural Mastery**: Implement clean separation of concerns across reusable React UI components, Express REST routes, business logic controllers, authentication middleware, and Mongoose document schemas.
* **Role-Based Access Control (RBAC) & Tenant Security**: Enforce JWT-based route guarding and bcrypt password hashing (10 salt rounds) to guarantee that students can only manage their own tickets while restricting ticket status updates and official maintenance remarks strictly to administrative facility staff.
* **State-Driven User Interface**: Develop an accessible, mobile-first interface reflecting the four vital UI states mandated by ICTAK guidelines: loading spinners, dynamic success feeds, actionable empty states, and user-friendly error banners.
* **Cloud Database Engineering & Version Control**: Connect a production-ready MongoDB Atlas replica set and maintain a professional Git commit history adhering to milestone schedules without leaking sensitive environment credentials (`.env` vs `.env.example`).

---

## SCOPE AND DELIVERABLES

### 1. Scope of the System
* **User Management**: Secure student and faculty registration, institutional department mapping (*Computer Science, Mechanical, Civil, Electrical, etc.*), persistent authentication, and role assignment (*Student/Faculty* vs. *Facility Admin*).
* **Ticket Lifecycle Management**: Complete CRUD operations allowing campus members to report issues with category tags (*IT & Lab, Electrical, Plumbing, Furniture, Cleanliness*), specific campus locations, and priority levels (*Low, Medium, High, Urgent*).
* **Administrative Moderation**: Real-time administrative dashboard featuring metric summaries (Total Filtered, Pending, In Progress, Resolved) and ticket status resolution panels.
* **Peer Upvoting**: Community-driven issue validation allowing students to upvote reported problems to indicate severity and prevent duplicate reporting.

### 2. Tangible Deliverables
* **Frontend Application (`client/`)**: Modular React 18 single-page application built with Vite, React Router DOM, Lucide Icons, and accessible responsive CSS.
* **Backend API Server (`server/`)**: Modular Node.js and Express RESTful API with structured routes, controllers, error handlers, and Mongoose ODM models.
* **Cloud Database (`MongoDB Atlas`)**: Normalized, indexed database collections (`users`, `issues`) hosted on an AWS cloud cluster.
* **Source Code Repository**: Clean GitHub repository with milestone commits, complete README documentation, and sanitized `.env.example` templates.

---

## METHODOLOGY

The development of **CampusFix** followed an Agile-driven MERN architecture, emphasizing modularity, rapid prototyping, and end-to-end security:

### 1. System Design & Architecture
* **Decoupled 3-Tier Hierarchy**: The client interface runs in the user's browser, communicating asynchronously via JSON HTTP payloads with an Express/Node.js API running on port 5000, which queries the MongoDB Atlas cluster.
* **RESTful Standards**: Standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) with strict semantic status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`).

### 2. Backend & Security Engineering
* **Database Modeling**: Express connected to MongoDB Atlas via Mongoose schemas. The `Issue` model enforces relational foreign key referencing (`reportedBy` pointing to `User._id`) and automated Mongoose timestamps (`createdAt`, `updatedAt`).
* **Stateless Authentication**: Implemented token-based authorization using JSON Web Tokens (JWT) signed with a secret environment key and a 30-day expiration window.
* **Password Hashing**: User passwords salted and hashed using `bcryptjs` (10 salt rounds) via asynchronous Mongoose pre-save hooks.
* **Custom Middleware Pipeline**: Modular middleware verifying `Authorization: Bearer <token>` headers, extracting decoded user IDs, verifying administrative authorization flags (`authorize('admin')`), and catching global server errors.

### 3. Frontend Implementation
* **React SPA (Vite)**: Optimized single-page application utilizing controlled form inputs, custom hooks, and React Context API (`AuthContext`) for application-wide session persistence.
* **Complete Four-State Lifecycle**: Structured components to handle:
  * *Loading*: Animated spinners while asynchronous API calls resolve.
  * *Success*: Dynamic grid layout showing ticket cards with status chips and real-time metric counters.
  * *Empty State*: Illustrated feedback with an actionable button when no tickets match active filters.
  * *Error Alert*: Non-technical alert messages with retry options if communication fails.
* **Centralized API Service**: Encapsulated Fetch client automatically injecting authorization headers and centralizing base URL management via `import.meta.env.VITE_API_URL`.

### 4. Testing & Verification
* **Endpoint Validation**: Backend routes tested for validation boundaries, missing fields, unauthorized access attempts, and role permission guards.
* **Cross-Role Testing**: Comprehensive verification of student submission flows contrasted against administrative status resolution flows.

---

## PROJECT ACTIVITIES

* **Database Modeling**: Formulated normalized Mongoose schemas. The `User` schema enforces lowercase unique email indexes and department categorizations. The `Issue` schema defines structured enumerations for categories, urgency tiers, and status lifecycles.
* **Authentication Flow**: Created dedicated controllers (`registerUser`, `loginUser`, `getMe`) and integrated token extraction middleware to protect private endpoints.
* **Frontend Engineering**: Developed modular components including `Navbar`, `StatusBadge`, `PriorityBadge`, `StateFeedback`, `Dashboard`, `NewTicket`, `MyTickets`, `Login`, and `Register`.
* **Security & CORS Configuration**: Configured explicit Cross-Origin Resource Sharing (CORS) rules on Express, whitelisting `http://localhost:5173` to prevent unauthorized domain requests while ensuring smooth client synchronization.
* **Database Provisioning**: Provisioned an M0 cluster on MongoDB Atlas, created authorized database users, whitelisted global IP access (`0.0.0.0/0`), and connected the live connection string securely through environment variables.

---

## RESULTS & FINDINGS

### 1. Automated API & System Verification
Automated and manual verification tests executed against the live local development server validated all functional requirements, security boundaries, and HTTP response statuses:

| Endpoint / Flow | Method | Verification Criteria | Result |
| :--- | :---: | :--- | :---: |
| `/api/auth/register` | `POST` | User persistence, unique email check, bcrypt hash, JWT issue | **Passed (201)** |
| `/api/auth/login` | `POST` | Password match verification, user profile & token returned | **Passed (200)** |
| `/api/issues (No Token)` | `GET` | Protected route blocks unauthenticated access | **Passed (401)** |
| `/api/issues` | `POST` | Creates maintenance ticket explicitly bound to `req.user._id` | **Passed (201)** |
| `/api/issues` | `GET` | Fetches campus tickets with search & category query filters | **Passed (200)** |
| `/api/issues/:id/status` (Student) | `PUT` | Non-admin attempt to modify ticket status blocked by RBAC | **Passed (403)** |
| `/api/issues/:id/status` (Admin) | `PUT` | Admin successfully updates status and posts official remarks | **Passed (200)** |
| `/api/issues/:id/upvote` | `PUT` | Atomically toggles user ID in upvotes array | **Passed (200)** |
| Vite Client Build Process | `CLI` | Production build executes with 0 warnings, generating clean `/dist` | **Passed** |

---

### 2. User Interface & Workflow Screenshots

Below are the visual records of the functional application corresponding to the user interaction journey:

#### Figure 1 — User Login Screen (`/login`)
![Figure 1: User Login](media_1792934550780_ce0b3f7b.png)  
*Description*: Clean authentication gateway featuring college email and password inputs with client-side validation and navigation links to new user registration.

---

#### Figure 2 — Student & Faculty Registration (`/register`)
![Figure 2: User Registration](media_1792934550783_2e15498b.png)  
*Description*: Registration screen allowing campus members to enter their full name, official college email, department (*Computer Science & Engineering*), and declare their system role (*Student / Faculty* vs. *Facility Admin*).

---

#### Figure 3 — Dashboard Empty State (`/`)
![Figure 3: Empty State](media_1792934550791_c4dc9a12.png)  
*Description*: Implementation of the ICTAK Four UI States requirement. When no tickets exist in the database, the dashboard renders an intuitive empty-state illustration with an actionable *"Report New Issue"* button rather than a blank screen.

---

#### Figure 4 — Maintenance Ticket Submission (`/new-ticket`)
![Figure 4: Report Ticket Form](media_1792934550792_92abb3ba.png)  
*Description*: Controlled submission form capturing issue summary, category (*IT & Lab, Electrical, Plumbing, Furniture, Cleanliness*), priority level, campus location (*e.g., near lab*), and a detailed description.

---

#### Figure 5 — Student Feed with Active Pending Ticket
![Figure 5: Active Ticket Feed](media_1792934550814_a4735635.png)  
*Description*: Real-time feed reflecting the newly created maintenance ticket (`water clog`). The metrics summary cards dynamically increment (`Total Filtered: 1`, `Pending: 1`). The ticket displays color-coded badges (`Plumbing`, `Medium`, `Pending`), reporter metadata (`mgg`, Computer Science & Engineering), and the peer upvote control.

---

#### Figure 6 — Facility Admin Registration (`/register`)
![Figure 6: Admin Registration](media_1792935673276_1e2a13e0.png)  
*Description*: Demonstrating the creation of a maintenance authority account (`Campus Maintenance Admin`, `admin@sahrdaya.ac.in`) with the **Facility Admin** role selected.

---

#### Figure 7 — Administrative Dashboard View with RBAC Controls
![Figure 7: Admin View](media_1792935673279_dc3b8dcf.png)  
*Description*: When logged in with administrative privileges, the user header reflects the gold `ADMIN` badge, and the ticket card conditionally renders the administrative **"Manage Status"** action button.

---

#### Figure 8 — Interactive Admin Resolution Panel
![Figure 8: Admin Resolution Panel](media_1792935673284_7ea2034f.png)  
*Description*: Expanding the resolution drawer allows administrators to adjust ticket status (*Pending*, *In Progress*, *Resolved*) and input official facility remarks and technician assignment notes.

---

#### Figure 9 — Resolved State with Official Remarks & Metric Update
![Figure 9: Resolved State](media_1792935673287_6286238d.png)  
*Description*: The complete lifecycle conclusion. The status badge automatically updates to green (`Resolved`), the top metrics recalculate (`Pending: 0`, `Resolved: 1`), and the blue **Facility Team Update** box displays the official resolution: *"Plumber assigned; pipeline blockage cleared"*.

---

## CONCLUSION

The internship culminated in the successful completion of the **CampusFix** Campus Maintenance & Grievance Portal. All core objectives—enforcing REST standards, securing communications via JWT, building responsive React interfaces with complete lifecycle states, establishing role-based access control, and organizing cloud database collections—were fulfilled under the ICTAK curriculum. 

This project reinforced core competencies in asynchronous state management, API contract discipline, schema relationships with Mongoose, and production-grade security patterns. By modernizing campus maintenance into an intuitive digital workflow, CampusFix demonstrates how full-stack JavaScript architectures deliver tangible operational efficiency in institutional environments.

---

## APPENDIX

### Project File Structure
```text
campusfix/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Badges.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StateFeedback.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyTickets.jsx
│   │   │   ├── NewTicket.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── issueController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── Issue.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── issueRoutes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

### Project Links
* **GitHub Repository**: [https://github.com/megha225456-ctrl/Campus-Fix](https://github.com/megha225456-ctrl/Campus-Fix)
* **Default Branch**: `main`
* **Local Development Hosts**:
  * Client (Vite + React): `http://localhost:5173`
  * Server (Express API): `http://localhost:5000`
  * API Health Check: `http://localhost:5000/api/health`
