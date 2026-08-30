# CLOUD COMPUTING SUBJECT PRESENTATION & EVALUATION GUIDE

## Project Name: CROWD KNOWLEDGE MAP
### Tagline: Discover. Contribute. Connect.

---

## EXECUTIVE SUMMARY FOR EVALUATOR

Crowd Knowledge Map is a cloud-native community knowledge platform designed for college students and local residents to discover, contribute, and verify trusted local resources (study spots, affordable food, free Wi-Fi, repair shops, healthcare) on an interactive map.

---

## CLOUD COMPUTING CONCEPTS DEMONSTRATED

### 1. Cloud Database (Cloud Firestore)
- **Model**: NoSQL Document-based Cloud Database.
- **Role**: Stores users, locations, reviews, reports, and categories.
- **Key Concepts Demonstrated**: Real-time snapshot listeners (`onSnapshot`), document security rules, compound indexing (`firestore.indexes.json`), and eventual consistency.

### 2. Cloud Storage (Firebase Cloud Storage)
- **Model**: Object Storage.
- **Role**: Stores high-resolution community photo uploads and user profile avatars.
- **Key Concepts Demonstrated**: Binary stream file uploads (`uploadBytes`), public CDN download URLs (`getDownloadURL`), content-type validation, and size limitation security rules.

### 3. Serverless Computing (Cloud Functions for Firebase)
- **Model**: FaaS (Function-as-a-Service) / Event-Driven Serverless Compute.
- **Role**: `aggregateRatingsOnWrite` function automatically listens to Firestore document changes on `reviews/{reviewId}`.
- **Key Concepts Demonstrated**: Asynchronous event triggers, authoritative server-side aggregate calculations, zero server management, and automatic scaling.

### 4. Authentication (Firebase Authentication)
- **Model**: Managed Identity & Access Management (IAM).
- **Role**: Secure email/password authentication and JSON Web Token (JWT) role assertions.
- **Key Concepts Demonstrated**: Token claims, client-side auth state synchronization (`onAuthStateChanged`), and backend security rule authorization checks.

### 5. Open-Source Spatial Engine (Leaflet + OpenStreetMap)
- **Model**: Open-Source Spatial Vector Rendering.
- **Role**: Interactive map view, custom category pin markers, coordinates picker.
- **Key Concepts Demonstrated**: Cost efficiency (zero Google Maps API fees), latitude/longitude geocoding, and map state synchronization.

---

## 4-MEMBER TEAM CONTRIBUTION MATRIX

```text
+-----------------------------------------------------------------------------------+
| MEMBER 1: FRONTEND & DESIGN SYSTEM                                                |
| - Landing Page UI, Hero with live Leaflet map preview                              |
| - Resource directory category cards with Lucide icons                             |
| - Responsive design system with Tailwind CSS                                      |
+-----------------------------------------------------------------------------------+
| MEMBER 2: LEAFLET MAP & SPATIAL MODULE                                            |
| - Leaflet + OpenStreetMap engine integration                                      |
| - Dynamic DivIcon category marker rendering & popups                              |
| - Interactive click-to-pick coordinate capture for Add Location                   |
+-----------------------------------------------------------------------------------+
| MEMBER 3: FIREBASE CLOUD BACKEND                                                  |
| - Firebase Auth, Firestore real-time subscriptions                                |
| - Firebase Cloud Storage image uploader service                                   |
| - Serverless Cloud Function for authoritative rating aggregation                   |
+-----------------------------------------------------------------------------------+
| MEMBER 4: ADMIN VERIFICATION & MODERATION                                         |
| - Admin Dashboard with analytics & category breakdown                             |
| - Verification pipeline (PENDING -> APPROVED / REJECTED)                          |
| - Community reports handling center & review moderation                            |
+-----------------------------------------------------------------------------------+
```
