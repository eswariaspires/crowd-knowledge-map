# CROWD KNOWLEDGE MAP

> **Discover. Contribute. Connect.**

A modern, cloud-native community knowledge platform where users can discover useful local places/resources on an interactive map, contribute new locations, upload photos, provide ratings and reviews, and report inappropriate content. Administrators verify community submissions before they become publicly visible.

**Course**: Cloud Computing Subject Project  
**Tech Stack**: React, Vite, TypeScript, Tailwind CSS, Leaflet, OpenStreetMap, Firebase (Auth, Firestore, Cloud Storage, Cloud Functions, Hosting)

---

## 1. USER VS ADMIN ROLE RESPONSIBILITIES

| Feature / Responsibility | User Web App (Community Side) | Admin Web App (Management Side) |
| :--- | :---: | :---: |
| **Primary Goal** | Discover & Contribute Local Knowledge | Verify, Moderate & Monitor Platform |
| **Navigation & Layout** | Public Navbar (`/`, `/explore`, `/location/:id`) | Fixed Dark Sidebar & Header (`/admin/*`) |
| **Explore & Search Map** | ✅ Yes (Leaflet + OpenStreetMap) | 📊 Monitored via Stats & Maps |
| **Submit Locations** | ✅ Yes (`PENDING` status) | ❌ Management side |
| **Upload Photos** | ✅ Yes (Firebase Storage) | 🔍 Review submitted photo URLs |
| **Write & Rate Reviews** | ✅ Yes (1 to 5 Stars) | 🛡️ Audit & Moderate comments |
| **Report Abuse** | ✅ Submit content flags | ⚖️ Resolve & Dismiss reports |
| **Verification Pipeline** | ❌ Cannot Approve | ✅ Approve / Reject submissions |
| **Category Management** | ❌ Consumer view | ✅ Add / Edit / Disable categories |
| **User Directory & Roles** | ❌ Own profile only | ✅ View users & authorization audit |
| **Platform Analytics** | ❌ Consumer view | ✅ Growth, verification rates & charts |

---

## 2. COMMUNITY VERIFICATION WORKFLOW

```text
                 USER
                   │
                   ▼
            Add New Location (/add-location)
                   │
                   ▼
            Upload Photos to Cloud Storage
                   │
                   ▼
         Cloud Firestore Database
                   │
                   ▼
        verificationStatus = PENDING
                   │
                   │
                   ▼
                ADMIN
                   │
             ┌─────┴─────┐
             ▼           ▼
          APPROVE       REJECT
             │           (with reason)
             ▼
       Public Map (/explore)
             │
             ▼
        Other Users
             │
       ┌─────┴─────┐
       ▼           ▼
     Rating      Review
       │           │
       └─────┬─────┘
             ▼
     Serverless Cloud Function
   (aggregateRatingsOnWrite)
             │
             ▼
       Updated Rating & Count
```

---

## 3. ADMIN MANAGEMENT SUITE ROUTES

- `/admin` — Admin Dashboard & Metrics Overview
- `/admin/locations` — Location Verification Queue (Approve / Reject)
- `/admin/reports` — Content Moderation & Community Reports Handling Center
- `/admin/reviews` — Review Moderation (Hide / Delete abusive comments)
- `/admin/users` — User Directory & Role Authorization Audit
- `/admin/categories` — Category Management (Add / Edit / Toggle categories)
- `/admin/analytics` — Platform Growth & Verification Success Rates
- `/admin/settings` — System Configuration

---

## 4. LOCAL SETUP & DEVELOPMENT

```bash
# 1. Enter project directory
cd crowd-knowledge-map

# 2. Install dependencies
npm install

# 3. Start Vite dev server
npm run dev
```

The application opens at `http://localhost:5173`.
