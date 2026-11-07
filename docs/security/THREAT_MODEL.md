# Threat Model & Risk Register (STRIDE)
**Platform:** EKOTAI BOL (একতাই বল)  

---

## 1. STRIDE Analysis

| Category | Threat | Countermeasure |
| :--- | :--- | :--- |
| **Spoofing** | Attacker impersonates an admin to approve fraudulent projects. | Strict role-based access control with master email whitelist and Firestore claim verification. |
| **Tampering** | Attacker alters project donation total or modifies budget. | Server-side Firestore rules prevent unauthorized document mutations; donations ledger is append-only. |
| **Repudiation** | Submitter claims they never posted an idea or donor claims forged donation. | Cryptographic transaction IDs (`txId`) and server-side timestamps (`serverTimestamp()`). |
| **Information Disclosure** | Submitter phone number or private identity leaked to public. | Phone number excluded from public notice board projection; donor phone masked to `0171****890`. |
| **Denial of Service** | Bot flooding `/submit-idea` with junk submissions. | Requirement for Google Authentication; rate limiting per user UID. |
| **Elevation of Privilege** | Citizen attempts to elevate their own role to `SUPER_ADMIN`. | Elevation protected by strict admin verification and server rules. |
