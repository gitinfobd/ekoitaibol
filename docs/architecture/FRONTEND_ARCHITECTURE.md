# Frontend Architecture Specification
**Platform:** EKOTAI BOL (একতাই বল)  

---

## 1. Directory Structure

```
src/
├── app/
│   ├── layout.jsx        # Root HTML wrapper, Font loader, AuthProvider
│   ├── page.jsx          # Public landing page with live statistics
│   ├── submit-idea/      # Citizen proposal submission form with AI copilot
│   ├── notice-board/     # Ranked public notice board with community voting
│   ├── projects/         # Active campaigns, 100 BDT funding & masked ledger
│   ├── welfare/          # Labor Act 2006 & Universal Pension framework
│   ├── about/            # Governance, ethics & transparency charter
│   └── admin/            # Super Admin moderation & database portal
├── components/
│   ├── Navbar.jsx        # Navigation, dark mode toggle, user profile badge
│   ├── Footer.jsx        # Footer links, statutory references
│   └── LoginModal.jsx    # Google OAuth dialog with authorized domain diagnostic
└── lib/
    ├── firebase/
    │   ├── config.js     # Firebase client SDK initialization
    │   └── auth-context.jsx # React Context for global auth state & bypass
    └── data/
        ├── districts.js  # 8 divisions & 64 districts master data
        └── mock-projects.js # Pilot seed definitions
```

---

## 2. Rendering Strategy
- **Static Pages / ISR:** Landing page, About, and Welfare pages prerender static HTML at build time for instant loading.
- **Client Side Components:** Interactive pages (`submit-idea`, `notice-board`, `projects`, `admin`) use `'use client'` to bind directly with Firebase Auth and Firestore real-time listeners.
