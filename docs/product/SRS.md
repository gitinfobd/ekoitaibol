# Software Requirements Specification (SRS)
**Product:** EKOTAI BOL (একতাই বল)  
**Specification Level:** IEEE 830 Standard Compliant  

---

## 1. External Interface Requirements

### 1.1 User Interfaces
- Responsive web design supporting screen sizes from 320px (mobile) to 2560px (ultra-wide desktop).
- Dual theme support: High-contrast Dark Mode and clean Minimalist Light Mode with persistence in `localStorage`.
- Bengali SolaimanLipi / Inter typography stack ensuring crisp rendering on Android and Windows browsers.

### 1.2 Software Interfaces
- **Firebase Authentication:** Google OAuth 2.0 Web SDK (`signInWithPopup`, `onAuthStateChanged`).
- **Cloud Firestore:** Client and server-side document database interactions.
- **Vercel Edge Network:** Edge runtime in Singapore (`sin1`) with HTTP/2 and Brotli compression.

---

## 2. Functional System Features

### Feature 1: Anonymous Idea Lifecycle
```
[DRAFT] --> [SUBMITTED] --> [AI_PROCESSING] --> [MODERATION_QUEUE]
                                                       |
                             +-------------------------+-------------------------+
                             |                                                   |
                     [PUBLISHED] (Public Board)                               [REJECTED]
```

### Feature 2: Micro-Donation & Idempotent Ledger Write
1. System validates 11-digit Bangladesh phone number format (`01XXXXXXXXX`).
2. Client generates deterministic transaction payload including `projectId`, `amount` (BDT), and `paymentMethod`.
3. Firestore executes transactional batch:
   - Appends audit document to `donations` collection.
   - Atomically increments `raisedAmount` on `projects/{projectId}`.
   - Atomically increments `backerCount` on `projects/{projectId}`.

---

## 3. Data Integrity & Safety Constraints
- **Strict Prohibition of Bulk Deletions:** Deleting collections or records without explicit multi-stage administrative confirmation is prohibited by architecture.
- **Input Sanitization:** All text inputs are trimmed and rendered using React safe bindings (no unescaped `dangerouslySetInnerHTML`).
