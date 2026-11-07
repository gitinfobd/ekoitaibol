# Backend & Data Architecture
**Platform:** EKOTAI BOL (একতাই বল)  

---

## 1. Cloud Firestore Collections

### 1.1 `ideas` Collection
- `id` (string, Auto-generated)
- `title` (string): Idea title
- `problem` (string): Problem statement
- `solution` (string): Proposed solution
- `category` (string): Category ID (`agriculture`, `education`, etc.)
- `divisionId` (string): Division ID (`rangpur`, `rajshahi`, etc.)
- `districtId` (string): District ID
- `upazila` (string): Upazila name
- `estimatedBudget` (string): Budget estimate
- `authorUid` (string): Private Google Auth UID
- `authorName` (string): Private Submitter name
- `authorPhone` (string): Private Submitter phone number
- `status` (string): `'SUBMITTED'` | `'PUBLISHED'` | `'REJECTED'`
- `isPublic` (boolean): `false` until approved by admin
- `rating` (number): Average rating (default: 5.0)
- `ratingCount` (number): Count of reviews
- `aiSummary` (string): AI-generated summary
- `viabilityScore` (number): AI score (0-100)
- `createdAt` (timestamp): Submission timestamp

### 1.2 `projects` Collection
- `id` (string): Unique identifier
- `title` (string): Project title
- `location` (string): District/Upazila
- `goalAmount` (number): Target fundraising amount in BDT
- `raisedAmount` (number): Current raised funds
- `backerCount` (number): Count of unique backers
- `status` (string): `'FUNDING'` | `'IN_PROGRESS'` | `'COMPLETED'`
- `createdAt` (timestamp)

### 1.3 `donations` Collection
- `txId` (string): Unique transaction ID (e.g., `TX-89241`)
- `projectId` (string): Target project ID
- `projectTitle` (string): Project name
- `amount` (number): Contribution amount in BDT (standard: 100)
- `donorPhone` (string): Masked phone number (`0171****890`)
- `paymentMethod` (string): `'bKash'` | `'Nagad'` | `'Rocket'`
- `status` (string): `'VERIFIED'`
- `createdAt` (timestamp)

### 1.4 `users` Collection
- `uid` (string): User UID
- `email` (string): Google email
- `displayName` (string): User name
- `role` (string): `'CITIZEN'` | `'ADMIN'` | `'SUPER_ADMIN'`
- `createdAt` (timestamp)
- `lastLoginAt` (timestamp)
