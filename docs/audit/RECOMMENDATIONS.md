# Strategic Recommendations & Technical Guidance
**Platform:** EKOTAI BOL / Codename: JANOSHOKTI  

---

## 1. Top Immediate Priorities

1. **Authorize Vercel Domain in Firebase Console (1 Minute Task):**
   - Navigate to: `https://console.firebase.google.com/project/ekoitaibol/authentication/settings`
   - In **Authorized domains**, click **Add domain**.
   - Enter `ekoitaibol.vercel.app` and save.
   - In **Sign-in method**, confirm **Google** is toggled to **Enabled**.

2. **Publish Production Firestore Security Rules:**
   - Copy rules from `docs/security/FIRESTORE_RULES.md` directly into Firebase Console > Firestore Database > Rules.

3. **Deploy bKash / Nagad Direct Merchant Webhooks:**
   - For live financial transactions, connect standard bKash Tokenized Checkout API with IPN (Instant Payment Notification).

4. **SEO & Search Console Monitoring:**
   - Submit `sitemap.xml` and monitor search queries using `mcp-search-console`.
