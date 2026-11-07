# Security Findings & Vulnerability Mitigation
**Platform:** EKOTAI BOL / Codename: JANOSHOKTI  
**Standard:** OWASP Top 10 + Alibaba Code Review Security Standards

---

## 1. Threat Matrix & Implemented Safeguards

### Threat 1: Unauthorized Exposure of Submitter Personal Identifiable Information (PII)
- **Risk:** Citizen submits a sensitive local corruption or governance idea. If their phone number or real email is exposed on the public notice board, they could face retaliation.
- **Safeguard:**
  - Submitter phone number, email, and internal UID are never returned in public DTO queries.
  - Public notice board displays proposals completely anonymously (attributed as "বেনামী নাগরিক / প্রস্তাবক, [জেলা]").
  - Private contact fields are strictly restricted to admin moderation views.

### Threat 2: Live Database & Data Purging Catastrophe
- **Risk:** Malicious scripts or accidental triggers performing SQL `DROP` or Firestore batch deletion commands.
- **Safeguard:**
  - Enforced Global Critical Database Protection Rule.
  - Zero deletion code allowed across codebase. Status transitions use soft-deletes (`isPublic: false`, `status: 'REJECTED'`) preserving complete audit trails.

### Threat 3: Financial Misrepresentation & Ledger Tampering
- **Risk:** Arbitrary balance updates or fake donation entries spoofing public backing.
- **Safeguard:**
  - Every transaction produces an immutable record in the `donations` collection with a unique `txId`.
  - Aggregated project funds use Firestore atomic `increment(amount)` operations to prevent race conditions.
  - Public transaction feed masks all donor phone numbers (`0171****890`).

### Threat 4: Client-Side Admin Elevation Bypass
- **Risk:** Malicious client forging local storage to perform unauthorized Firestore writes.
- **Safeguard:**
  - Firestore Security Rules enforce `request.auth != null` and verify admin custom claims / Firestore document role.
  - Sensitive approval mutations (`status: 'PUBLISHED'`) are guarded server-side.
