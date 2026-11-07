# Production Cloud Firestore Security Rules
**Platform:** EKOTAI BOL (একতাই বল)  

Copy and paste these rules into the Firebase Console at:  
👉 `https://console.firebase.google.com/project/ekoitaibol/firestore/rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper: Check if caller is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper: Check if caller is Super Admin
    function isSuperAdmin() {
      return isAuthenticated() && (
        request.auth.token.email in ['gitinfobd@gmail.com', 'admin@ekoitaibol.com'] ||
        request.auth.token.role == 'SUPER_ADMIN' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'SUPER_ADMIN'
      );
    }

    // 1. Ideas Collection
    match /ideas/{ideaId} {
      // Anyone can read published ideas on the public notice board
      allow read: if resource.data.isPublic == true || isSuperAdmin() || (isAuthenticated() && resource.data.authorUid == request.auth.uid);
      
      // Authenticated users can submit ideas
      allow create: if isAuthenticated() && request.resource.data.authorUid == request.auth.uid;
      
      // Only Super Admins can approve, reject or edit ideas
      allow update: if isSuperAdmin();
      
      // Absolutely no deletions allowed
      allow delete: if false;
    }

    // 2. Projects Collection
    match /projects/{projectId} {
      // Publicly readable
      allow read: if true;
      
      // Created and managed exclusively by Super Admins
      allow create, update: if isSuperAdmin();
      
      // Critical: Zero deletion allowed
      allow delete: if false;
    }

    // 3. Donations & Live Ledger
    match /donations/{donationId} {
      // Public can read the masked ledger
      allow read: if true;
      
      // Anyone can contribute a voluntary micro-donation
      allow create: if request.resource.data.amount > 0;
      
      // Financial ledger entries are immutable once written
      allow update, delete: if false;
    }

    // 4. Users Collection
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isSuperAdmin());
      allow create, update: if isAuthenticated() && request.auth.uid == userId;
      allow delete: if false;
    }
  }
}
```
