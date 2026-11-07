# Technical Debt & Refactoring Log
**Platform:** EKOTAI BOL / Codename: JANOSHOKTI  

---

## 1. Technical Debt Inventory

| Category | Item | Severity | Remediation Strategy |
| :--- | :--- | :--- | :--- |
| **Authentication** | Firebase Authorized Domains requirement for custom domains | Medium | Documented in `LoginModal.jsx`; immediate 1-click whitelist in Firebase Console. |
| **State Hydration** | LocalStorage fallback synchronization during demo modes | Low | Clean cleanup on real Google OAuth authentication. |
| **Search & Indexing** | Firestore multi-attribute queries requiring composite indexes | Medium | Documented queries in `docs/database/INDEXES.md` with index definitions. |
| **SMS Gateway Integration** | Phone number verification for high-tier admin approvals | Low | Planned Phase 2 integration with local BD SMS gateway (e.g., SSLWireless / Greenweb). |
| **Payment Gateway** | Live bKash/Nagad/Rocket checkout webhook endpoints | Medium | Phase 2 implementation with verified bKash Merchant API integration. |
