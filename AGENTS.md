<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version uses Next.js App Router with React 19 / Server Components conventions. Read relevant guidelines and adhere to best practices.
<!-- END:nextjs-agent-rules -->

# 🚨 CRITICAL DATABASE & DATA PROTECTION RULE (ABSOLUTE RESTRICTION)
- NEVER, under any circumstance, delete, wipe, drop, clear, or bulk-remove any database, collection, document, table, user profile, or transaction data.
- NEVER run scripts, Firebase/Firestore batch deletes, SQL drop commands, or write code that purges live database records without:
  1. Giving a LARGE, PROMINENT WARNING to the user in Bengali explaining exactly what is at risk.
  2. Clearly listing all potential losses (users, ideas, financial records, irreversible damage).
  3. Obtaining explicit, clear, manual written permission from the user specifically authorizing the deletion.
- Even with Turbo Mode or auto-proceed active, DATA DELETION / DATABASE PURGING IS STRICTLY FORBIDDEN without prior explicit user confirmation. Protecting the database and user data is the #1 highest priority at all times.

# ⚡ Ponytail Senior Developer Rules (YAGNI & Anti-Bloat)
- The best code is the code you never wrote. Before generating code, stop at the first rung of the Decision Ladder:
  1. **Does this need to exist?** (YAGNI) -> If speculative, skip it.
  2. **Already in this codebase?** -> Search first. Reuse existing helpers, components, and hooks.
  3. **Stdlib does it?** -> Use standard language/runtime built-ins.
  4. **Native platform feature?** -> Prefer native HTML5/CSS/browser APIs over heavy external packages.
  5. **Installed dependency?** -> Use existing packages in package.json.
  6. **Can it be one line?** -> Keep it one line.
  7. **Only then:** -> Write the minimum clean code that works.
- **Lazy, not negligent:** Never compromise database & user data protection, input validation, authentication boundaries, security, or accessibility.
- **Root cause over symptoms:** Fix issues at their shared origin, not by patching symptoms across multiple callers.
- **Deletion over addition:** Remove dead code, avoid speculative boilerplate.

# 🛡️ Alibaba OpenCodeReview (OCR) & Security Standards
- Always enforce Alibaba code review standards: zero `var`, strict equality `===`, defensive null checking, zero unsanitized `innerHTML` or script injection vulnerabilities, and verified error boundaries.
- Run or verify with `scripts/ocr-check.js` on every code change.

# 🧠 Autonomous 280+ Agency Agents Coordination (Zero Manual Overhead)
- The entire 280+ Agency Agents repository is permanently installed locally at `C:\Users\missi\.gemini\agency-agents` and `C:\Users\missi\.claude\agents`.
- The user does not need to invoke agents manually. The AI autonomously detects the task domain and assumes the specialist persona:
  - **Frontend / UI / UX**: Frontend Developer, UI Designer, Design System Lead (AA contrast, micro-interactions, responsive 60fps).
  - **Backend / Database**: Backend Architect, Database Administrator (zero data loss, safe indexing, concurrency protection).
  - **Security / Audit**: Security Auditor, AppSec Engineer (OWASP Top 10, auth validation, least privilege).
  - **Growth / SEO / Copy**: Conversion Copywriter, SEO Specialist (high-converting active CTAs, JSON-LD, Core Web Vitals).
  - **QA & Testing**: QA Engineer, Edge Case Tester.
- Always synthesize the specialized agent persona with **Ponytail simplicity** and **Alibaba security**.

# 🚀 Mandatory Autonomous GitHub & Vercel Push
- On EVERY completed task, bug fix, feature addition, or code change, automatically:
  1. Verify the project builds cleanly without errors (`npm run build`).
  2. Run Alibaba OCR check (`npm run ocr:check`).
  3. Stage all modifications (`git add .`).
  4. Commit with a clear, descriptive message (`git commit -m "..."`).
  5. Push to remote repository (`git push origin main`), triggering Vercel deployment.
- Place the successful GitHub push commit hash number (e.g. `Commit Hash: ...`) at the VERY FIRST LINE of the response.

# 🔍 Global 3-Tier SEO & Generative Engine Optimization (GEO) Protocol
- **Tier 1 — Search Telemetry (Google Search Console MCP)**: Monitor high-impression, low-CTR queries and indexing health.
- **Tier 2 — Semantic Intent & Local E-Commerce SEO**: High intent mapping, semantic architecture, clean URL slugs, and 1 H1 per page.
- **Tier 3 — Generative Engine Optimization (GEO) & AI Discovery**: AI-friendly `robots.txt` (GPTBot, ClaudeBot, PerplexityBot) and maintain structured `llms.txt` and Schema.org JSON-LD across public pages.

# 💡 EKOTAI BOL — Project Specific Directives & Architecture
- **Brand**: EKOTAI BOL (একতাই বল)
- **Domain**: `ekoitaibol.com`
- **Tagline**: একতাই শক্তি, উদ্যোগে পরিবর্তন।
- **Platform Architecture**:
  1. **Public Idea Submission**: Free submission via Google OAuth. Innovator personal contact kept private (author anonymized to public).
  2. **AI Screening & Categorization**: Duplicate detection, viability assessment, and objective summarization.
  3. **Notice Board & Community Voting**: Ranked public notice board, 5-star ratings, constructive critique (পজেটিভ / নেগেটিভ / উন্নয়নের প্রস্তাব).
  4. **Micro-Fundraising & Live Ledger**: 100 Taka voluntary community backing with live transparent transaction feed (donor phone number masked: `0171****890`).
  5. **District Project Execution**: Selected projects executed locally in the region of origin, creating verified jobs with social safety nets (universal pension / provident fund).
