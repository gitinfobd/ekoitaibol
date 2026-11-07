# Acceptance Criteria Specification
**Platform:** EKOTAI BOL (একতাই বল)  

---

## AC-01: Idea Submission & Privacy Boundary
- **Given** an unauthenticated visitor on `/submit-idea`,
- **When** they attempt to submit an idea,
- **Then** the application must require Google Sign-In or provide an explicit instant test option.
- **When** the idea document is saved to Firestore,
- **Then** `authorUid`, `authorName`, and `authorPhone` must be saved in private fields, and `isPublic` must be initialized to `false`.

---

## AC-02: Public Notice Board Query Quarantine
- **Given** any query reading documents from the `ideas` collection on public routes (`/notice-board`, `/`),
- **When** ideas are fetched,
- **Then** only ideas with `status === 'PUBLISHED'` and `isPublic === true` may be rendered.
- **Then** no personal submitter phone number or email may appear in the DOM.

---

## AC-03: Donor Phone Masking on Public Ledger
- **Given** a donation submission on `/projects`,
- **When** a donor enters an 11-digit mobile number (e.g., `01712345678`),
- **Then** the transaction feed must render the masked string: `0171****678`.
- **Then** the project's `raisedAmount` must be atomically incremented by the donation amount.

---

## AC-04: Admin Access & Moderation Flow
- **Given** a visitor navigating to `/admin`,
- **When** the user is not authenticated as Super Admin,
- **Then** access is locked behind an authorization gateway.
- **When** authenticated as Super Admin,
- **Then** the user can approve an idea (setting `status = 'PUBLISHED'` and `isPublic = true`) or reject it.
- **Then** approved ideas immediately appear on the public notice board upon refresh.
