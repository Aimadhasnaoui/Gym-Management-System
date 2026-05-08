# 🏋️ Gym Management System — Project Summary

## 1. Project Context

A **web-based gym management system** built as a school project for a client's gym.
The goal is to deliver a clean, working MVP fast — no over-engineering.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Routing | React Router |
| HTTP Client | Axios |
| Styling | TailwindCSS |
| Backend | Node.js + Express |
| Authentication | JWT (stored in localStorage) |
| Database | MongoDB + Mongoose |

---

## 3. User Roles

Two roles only for V1:

| Role | Description |
|---|---|
| **Admin** | Full control — manages members, plans, check-ins, and dashboard |
| **Member** | Read-only portal — views personal info, plan, and attendance |

> Employee role is excluded from V1 to keep scope manageable.

---

## 4. Core Features (MVP)

### 4.1 Authentication
- Login page shared by both roles
- JWT-based session
- Role detection on login → redirect to correct dashboard
- Protected routes per role

### 4.2 Member Management
- Admin can add, edit, and view members
- Member profile fields: name, contact, photo, assigned plan, start date, expiry date

### 4.3 Membership Plans
- Admin creates and manages plans (name, duration in months, price label)
- Plans are assigned to members at registration
- No payment processing — just record that it was paid

### 4.4 Renewal Alerts
- Admin dashboard highlights members expiring within 7 days
- Also flags already-expired memberships
- Implemented as a simple filtered query — no external notifications

### 4.5 Check-in System
- Admin searches a member by name and clicks "Check In"
- Logs member ID + timestamp to the database
- No QR codes at this stage

### 4.6 Member Portal
- Member logs in and sees:
  - Their name and plan details
  - Membership expiry date
  - Last 5 check-ins
- Fully read-only

### 4.7 Admin Dashboard
- Total active members
- Expired memberships count
- Today's check-in count
- Renewal alerts list

---

## 5. Out of Scope for V1

These features are valid for V2 but excluded now to stay on schedule:

- Payment processing / invoicing
- QR code check-ins
- Email / SMS notifications
- Multiple gym locations
- Class scheduling
- Employee role and permissions
- Deep analytics

---

## 6. Folder Structure

```
/client                     → React frontend
  /src
    /pages                  → Login, AdminDashboard, Members, MemberPortal
    /components             → Sidebar, MemberCard, PlanBadge, RenewalAlert
    /context                → AuthContext (user + role state)
    /api                    → Axios API call functions

/server                     → Express backend
  /models                   → User.js, Plan.js, Checkin.js
  /routes                   → auth.js, members.js, plans.js, checkins.js
  /controllers              → Logic per route
  /middleware               → authMiddleware.js, roleCheck.js
```

---

## 7. Database Models (Overview)

### User
```
name, email, password (hashed), role (admin | member),
phone, photo, planId, startDate, expiryDate, createdAt
```

### Plan
```
name, durationMonths, priceLabel, createdAt
```

### Checkin
```
memberId, checkedInAt
```

---

## 8. Routing Structure

```
/login                      → Auth page (both roles)

/admin
  /dashboard                → Stats + renewal alerts
  /members                  → Member list
  /members/:id              → Member profile
  /members/add              → Add member form
  /plans                    → Plan management

/member
  /portal                   → Personal dashboard (read-only)
```

---

## 9. Build Order

Follow this sequence to always have something working and demonstrable:

1. **Auth** — backend JWT + login page + protected routes
2. **Member CRUD** — the core of the app
3. **Plans** — simple model, assign to members
4. **Check-in** — one endpoint, one button
5. **Member Portal** — read-only, reuses existing data
6. **Renewal Alerts** — filtered query on the dashboard

---

## 10. Key Design Decisions

- **Single React app** with role-based routing (not two separate projects)
- **MongoDB** chosen for flexible schema and fast setup — no migrations
- **No self-registration** — admin creates member accounts
- **Subscription is a first-class feature**, not optional — it drives check-in access and renewal alerts
- Keep UI **light for members**, **functional for admin**

---

## 11. Future V2 Ideas

- Employee role with limited permissions
- QR code check-in system
- Email reminders for expiring memberships
- Payment tracking and invoicing
- Multi-location support
- Analytics and reporting dashboard
