# Cloud Firestore Indexing Strategy
**Platform:** EKOTAI BOL (একতাই বল)  

---

## 1. Required Composite Indexes

### 1.1 Ideas Collection Index 1 (Notice Board Sorting)
- **Collection:** `ideas`
- **Fields:**
  - `status` (Ascending)
  - `isPublic` (Ascending)
  - `createdAt` (Descending)
- **Query:** `query(collection(db, 'ideas'), where('status', '==', 'PUBLISHED'), where('isPublic', '==', true), orderBy('createdAt', 'desc'))`

### 1.2 Ideas Collection Index 2 (District Filtering)
- **Collection:** `ideas`
- **Fields:**
  - `status` (Ascending)
  - `isPublic` (Ascending)
  - `districtId` (Ascending)
  - `createdAt` (Descending)

### 1.3 Donations Collection Index (Recent Activity)
- **Collection:** `donations`
- **Fields:**
  - `createdAt` (Descending)
- **Query:** `query(collection(db, 'donations'), orderBy('createdAt', 'desc'), limit(20))`
