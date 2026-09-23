# CrowdMap

> **Discover what matters around you. Share what you know. Help keep local information useful.**

CrowdMap is a community-powered local knowledge platform. People use CrowdMap to discover useful places, services, resources, and local knowledge around them. Users can discover places on interactive Leaflet maps, contribute new locations with photos and coordinates, share experiences, rate places, save locations, and report inaccurate or inappropriate information.

A separate administrative system manages verification, moderation, users, reports, categories, and platform health.

---

## 1. PRODUCT ARCHITECTURE & SEPARATION OF RESPONSIBILITIES

| Feature / Experience | Public & User Product Experience | Administrative Suite |
| :--- | :---: | :---: |
| **Primary Focus** | Discovering, Saving & Sharing Local Knowledge | Verification, Moderation & Platform Health |
| **Routes & Layout** | Split-view discovery (`/explore`), detail view (`/location/:id`), saved places (`/saved`), contribution wizard (`/add-location`), profile (`/profile`) | Moderation suite (`/admin`, `/admin/locations`, `/admin/reports`, `/admin/reviews`, `/admin/users`, `/admin/categories`, `/admin/analytics`, `/admin/settings`) |
| **Interactive Map** | Leaflet + OpenStreetMap with location preview drawer & marker clustering | Side-by-side inspection workspace with interactive pinned coordinates |
| **Place Contributions** | 4-Step progressive contribution flow (`PENDING` / *Under review* status) | Verification queue with *Publish*, *Request changes (with reason)*, & *Reject* |
| **Photos Storage** | Firebase Cloud Storage uploads with live progress | Photo URL review & moderation |
| **Ratings & Reviews** | Community reviews with serverless aggregate ratings | Review moderation (Keep, Hide, Remove) |
| **Saved Places** | Bookmark toggle and saved collection (`/saved`) | N/A |
| **Category Management** | Filter chips & category discovery | Create, edit, and disable categories |
| **Reports Queue** | Submit issues (inaccurate, duplicate, inappropriate) | Action queue (*Open*, *Reviewed*, *Resolved*, *Dismissed*) |

---

## 2. COMMUNITY VERIFICATION & MODERATION WORKFLOW

```text
                  USER
                    │
                    ▼
          Add Location Flow (/add-location)
       (Step 1: Info, Step 2: Map, Step 3: Photos, Step 4: Review)
                    │
                    ▼
         Firebase Cloud Storage
                    │
                    ▼
          Cloud Firestore Database
        (verificationStatus = PENDING)
                    │
                    ▼
                  ADMIN
         Moderation Queue (/admin/locations)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     PUBLISH     REQUEST     REJECT
        │        CHANGES        │
        │      (with note)      │
        ▼           │           ▼
   Public Map       ▼        Rejected
   (/explore)   User Fixes   Status
                & Resubmits
```

---

## 3. TECHNOLOGY STACK

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router
- **Interactive Mapping**: Leaflet + OpenStreetMap (No Google Maps API required; external directions links supported)
- **Backend Services**: Firebase Authentication, Cloud Firestore, Firebase Cloud Storage, Cloud Functions
- **Security & Validation**: Firestore Security Rules, Storage Security Rules, Serverless Cloud Function rating aggregations

---

## 4. LOCAL DEVELOPMENT & BUILD

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

Production build output is generated in `dist/`.

---

## 5. ENVIRONMENT VARIABLES

Copy `.env.example` to `.env` and fill in your Firebase project configuration credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
