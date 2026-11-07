# Cloud Firestore Database Schema — EKOTAI BOL (ekoitaibol.com)

## Collections Specification

### 1. `users/{uid}`
Stores general citizen / user profiles synced with Firebase Google Auth.
- `uid` (string, required): Firebase Auth UID
- `name` (string, required): Full Name
- `email` (string, required): Email address
- `photoURL` (string, optional): Avatar image URL
- `role` (string, required): `'CITIZEN'` | `'IDEA_REVIEWER'` | `'SUPER_ADMIN'`
- `createdAt` (timestamp, required)
- `lastLoginAt` (timestamp, required)

### 2. `ideas/{ideaId}`
Stores submitted proposals from citizens across all 64 districts.
- `title` (string, required): Title of the idea
- `problem` (string, required): Detailed problem statement
- `solution` (string, required): Actionable community solution
- `category` (string, required): Category slug (`agriculture`, `education`, `health`, etc.)
- `divisionId` (string, required): Division ID
- `districtId` (string, required): District ID
- `upazila` (string, required): Upazila/Union location
- `estimatedBudget` (string, optional): Estimated BDT budget
- `authorUid` (string, required): Firebase Auth UID of submitter
- `authorName` (string, private): Submitter name (hidden from public view)
- `authorEmail` (string, private): Submitter email
- `authorPhone` (string, private): Submitter contact phone (hidden from public view)
- `status` (string, required): `'SUBMITTED'` | `'UNDER_REVIEW'` | `'PUBLISHED'` | `'REJECTED'`
- `isPublic` (boolean, required): Set to `true` ONLY after human moderation
- `rating` (number): Current calculated rating (1.0 to 5.0)
- `ratingCount` (number): Number of citizen ratings
- `totalStars` (number): Aggregate stars received
- `critiques` (array of objects): Community constructive feedback
- `createdAt` (timestamp, required)
- `publishedAt` (timestamp, optional)

### 3. `projects/{projectId}`
Stores actual approved ground-level projects.
- `title` (string, required): Project Name
- `location` (string, required): Project implementation site
- `goalAmount` (number, required): Target budget in BDT
- `raisedAmount` (number, required): Verified raised funds in BDT
- `backersCount` (number, required): Total citizen backers
- `description` (string, required): Project scope and welfare plan
- `isPilot` (boolean, required): Indicates pilot initiative
- `status` (string, required): `'FUNDRAISING'` | `'IN_PROGRESS'` | `'COMPLETED'`
- `createdAt` (timestamp, required)

### 4. `donations/{donationId}`
Double-entry micro-donation record with privacy protection.
- `txId` (string, required): Public transaction ID
- `projectId` (string, required): Project reference ID
- `projectTitle` (string, required): Project reference title
- `phoneMasked` (string, required): Privacy-masked donor phone (e.g. `0171****890`)
- `amount` (number, required): BDT amount (100, 200, 500, etc.)
- `method` (string, required): Payment method (`bKash`, `Nagad`, `Rocket`, `Bank`)
- `donorUid` (string, optional): Submitter UID or `'ANONYMOUS'`
- `status` (string, required): `'COMPLETED_SANDBOX'` | `'VERIFIED'`
- `createdAt` (timestamp, required)
