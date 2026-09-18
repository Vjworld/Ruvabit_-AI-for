# RUVABIT — AI Automation Consulting Site + Admin Portal

A professional marketing site for RUVABIT (AI consulting-as-a-service: automation workflows that cut manual work, reduce errors, and speed up turnaround for teams of 0–200 people), plus a private admin portal where you manage content and leads.

## Positioning

- Brand: **RUVABIT** (ruvab.it.com)
- Offer: AI & workflow automation consulting for startups, small/new companies, and lean B2B enterprises (0–200 employees)
- Proof points drawn from your profile: Agile/PMO governance, business analysis, CRM implementations, n8n/Make/OpenAI automation, and shipped products (LangScribe, FYPPAL, TrendSolver, QR Generator Pro, Doneche, HeyBud)
- Founder credibility block: Vaibhav Selukar — PSM, PMP, NPD (IIM Bangalore), 15+ years across BFSI, SaaS, EduTech, Wellness Tech; links to LinkedIn, Product Hunt, portfolio

## Public pages

- **Home** — hero with clear value promise, outcome stats strip, "manual work vs automated" before/after, services preview, industries, featured case studies, process teaser, CTA to book a discovery call
- **Services** — Automation Audit, Workflow Automation Build, AI Agents & Assistants, Agile/PMO Enablement, Fractional AI Operator retainer. Each with problem, what's delivered, typical timeline, tools used
- **Process** — 4 steps: Discover & audit → Design the workflow → Build & integrate → Measure & hand over
- **Industries** — BFSI, SaaS/Startups, EdTech, Wellness & Healthtech, Professional services
- **Work / Case studies** — index + detail pages for each shipped product with challenge, approach, stack, outcome
- **Pricing** — three engagement tiers (Audit Sprint, Automation Build, Ongoing Partner) with scope and inclusions, **price on request** and an enquiry CTA
- **Insights (Blog)** — listing page + article pages, content managed from the admin portal
- **About** — founder story, credentials, tools, ways of working (remote-first)
- **Contact** — enquiry form (name, company, email, team size, current manual pain, budget range, message) saved as a lead

Shared header + footer, mobile-first responsive, per-page SEO metadata, and an SEO-friendly separate route for every section.

## Design direction

Modern, professional, technology-forward: deep ink/graphite canvas with a bright accent, precise grid layouts, subtle motion on scroll, mono type for labels and metrics, diagram-style visuals for workflow steps. All colors, gradients, and shadows defined as design tokens so the theme stays consistent. No stock-generic purple gradients.

## Admin portal (lightweight CRM + CMS)

Private, login-protected area at `/admin`, restricted to your admin account.

**CRM**
- Leads inbox from the contact form: list with search and filter
- Pipeline stages: New → Contacted → Qualified → Proposal → Won / Lost, with drag-free stage dropdown
- Lead detail: contact info, source page, notes timeline, next follow-up date
- Dashboard counts by stage and recent activity

**CMS**
- Manage blog posts: title, slug, excerpt, cover image, body, tags, draft/published, SEO fields
- Manage services, industries, case studies, pricing tiers, testimonials, and FAQ entries
- Edit key homepage content (hero headline, sub-headline, stats, CTA text)
- Public pages read published records, so edits appear on the live site without a redeploy

## Technical notes

- Lovable Cloud enabled for database, auth, storage, and server logic
- Tables: `leads`, `lead_notes`, `posts`, `services`, `case_studies`, `industries`, `pricing_tiers`, `testimonials`, `faqs`, `site_settings`, `profiles`, `user_roles`
- Roles kept in a separate `user_roles` table with a security-definer `has_role()` check — never on the profile row
- RLS: public read of published rows only; all writes and all lead access require the `admin` role. Contact form inserts a lead through a validated server function rather than a public write policy
- Admin routes live under an authenticated route group with redirect to `/admin/login`
- Content and case studies seeded from your resumes and shipped projects so every page is populated on first load
- Image uploads for blog covers via Cloud storage

## Out of scope for this pass

Payments, client-facing portal, email notifications on new leads, and analytics dashboards — easy follow-ups once the core is live.
