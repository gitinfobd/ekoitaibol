# System Architecture Specification
**Platform:** EKOTAI BOL / Codename: JANOSHOKTI  
**Standard:** 12-Tier Enterprise Architecture  

---

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    Client[Web Browser / Android WebView] -->|HTTPS / WSS| CDN[Vercel Edge Network - sin1 Singapore]
    CDN --> NextApp[Next.js 15 App Router Serverless Runtime]
    
    subgraph Frontend Layer
        NextApp --> RSC[React Server Components]
        NextApp --> RCC[Client Components & Hydration]
    end

    subgraph Authentication Layer
        NextApp --> FirebaseAuth[Firebase Auth / Google OAuth 2.0]
    end

    subgraph Database Layer
        NextApp --> Firestore[(Google Cloud Firestore)]
        Firestore --> IdeasColl[(Collection: ideas)]
        Firestore --> ProjColl[(Collection: projects)]
        Firestore --> DonColl[(Collection: donations)]
        Firestore --> UserColl[(Collection: users)]
    end

    subgraph Security & Policy Layer
        NextApp --> Rules[Firestore Security Rules]
        NextApp --> PIIShield[PII Redaction & Phone Masking Engine]
    end
```

---

## 2. Layer Definitions

1. **Presentation Layer:** Next.js App Router with Tailwind CSS, Lucide Icons, and dark/light mode themes.
2. **Authentication Layer:** Firebase Authentication with Google OAuth popup and ID token session state.
3. **API & Route Layer:** Next.js Server Components and client hooks interacting directly with Firebase SDK.
4. **Data Layer:** Cloud Firestore with strict document schema enforcement.
5. **Security Layer:** PII masking (author phone hidden, donor phone masked to `0171****890`).
6. **Edge Infrastructure:** Vercel Singapore region (`sin1`) for optimal Bangladesh latency (~35ms).
