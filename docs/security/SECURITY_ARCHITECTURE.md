# Security Architecture & Data Protection — EKOTAI BOL

## 1. Zero Fake / Fictional Public Data Policy
- Never display hardcoded or simulated donation counters as real achievements in production.
- If no projects exist in Firestore, state clearly: "এখনও কোনো প্রকল্প তহবিল সংগ্রহের জন্য অনুমোদিত হয়নি" instead of misleading users or auditors.

## 2. PII Privacy Protection
- Citizens submitting ideas have their `authorName` and `authorPhone` strictly restricted to the Admin Portal (`/admin`).
- Public Notice Board (`/notice-board`) renders anonymized cards.
- Live Public Ledger masks the 5 center digits of all donor MSISDNs (`0171****890`).

## 3. Role-Based Access Control (RBAC)
- Admin portal (`/admin`) is gated behind Firebase Google Authentication.
- Only authenticated users with `role: 'SUPER_ADMIN'` or approved master emails can approve, reject, or create projects.
- General users cannot escalate privileges or delete financial logs.

## 4. Financial Integrity (Anti-Destruction Rule)
- Historical transactions and ledger entries cannot be wiped.
- Cycle closures are handled through archival rather than destructive resets.
