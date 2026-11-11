# Suitable teardown

> Research for a possible college client, 2026-11-11.
>
> **In this repo:**
> - [`evidence/surface.md`](evidence/surface.md): every URL read.
> - [`evidence/facts.md`](evidence/facts.md): the cited fact sheet. A citation such as `GP:41` means page and line; the code table is at its top.
> - [`evidence/api-surface.tsv`](evidence/api-surface.tsv) and [`evidence/screens.tsv`](evidence/screens.tsv): the two inventories taken from the shipped code.
> - [`tools/`](tools/): the scripts that produced them. [`tools/README.md`](tools/README.md) explains how to re-run them.
> - `index.html` + `serve.sh`: read all of this as a small local site. Run `./serve.sh`, then open http://localhost:8765.
>
> **Kept out of git:** Suitable's own material, meaning the downloaded pages, the captured scripts, the REA captures and the screenshots. It sits in the local `raw/` and `rea/` folders, which `.gitignore` excludes, because it is their copyright. Since 2026-11-11 it lives only in the copy on Connor's Mac; nothing is on the Bizon.
>
> Nothing in this repo is Suitable's code or copy; it describes behaviour in our own words. Console ADRs cited below (ADR-0002, 0009, 0012, 0013, 0014, 0016) are in [Reformatic-ai/reformatic-console](https://github.com/Reformatic-ai/reformatic-console) `docs/adr/`.

- **Target.** Suitable ([suitable.co](https://www.suitable.co/)) sells higher-ed student engagement software. The app is at `app.suitable.co` and the NACE tool at `nace.suitable.co`.
- **Limit (Connor, 2026-11-11): public pages only.**
  - No login, no account, no forms.
  - Pages were loaded one at a time, a few seconds apart.
  - Nothing `robots.txt` disallows was loaded. That rules out the sample transcript and the blocked case studies.
  - Suitable's Terms of Service have no reverse-engineering clause. Their competing-use clause binds subscribers, which we are not.
- **Method.**
  - **Suitable's own pages.** 34 product, solution, integration, release-note and AI road-show pages, read as text.
  - **University pages.** Eight public pages from universities (Pitt, GVSU, WKU, Villanova, UF) plus the App Store listing, read by a research subagent. I re-checked 11 of its citations against the saved pages, and fetched one GVSU page again myself.
  - **REA on the app.** REA (`rea-agents` 6.5.0, CLI) ran in a sandboxed headless Chrome 134 against the app's login page and the NACE page:
    - `inspect-web-page --include-script-sources` captured the 42 scripts the login page ships.
    - `export-web-scripts` and `analyze-javascript-application` then built REA's static graph.
    - REA's structured findings are aimed at desktop (Electron) apps, so they were thin for this bundle. The useful part was two inventories inside the shipped code: the API client and the screen-name map.
- **Legend:**
  - **[code]** is in the JavaScript Suitable serves to any visitor.
  - **[site]** is Suitable's own pages.
  - **[uni]** is a university's public page.
  - **[inference]** is my reading, not observed.

---

## 1. What it is, in five lines

1. **Four products for universities**, claimed at 200+ partner schools [site IMP:37]:
   - **Guided Pathways**: an activity catalog with points, levels, competencies and badges.
   - **The Hub**: student-organization management.
   - **Co-Curricular Transcripts.**
   - **NACE Ready**: a career-readiness assessment run with NACE.
2. **The core loop.**
   - Staff publish activities, each tagged with competencies and a level.
   - Students complete them:
     - at events, by scanning a QR "smart code" that only works during the event window;
     - or on their own, with tasks proved by a written reflection, a file, or staff approval.
   - Completions earn points, levels and badges.
   - Everything adds up to a live transcript, which students download or share [site GP:36-62, CCT:32-61; uni W1, W2, W7].
3. **Built as one multi-tenant app.**
   - A React web app plus native student apps, over a `/v1` REST API.
   - Two tenant types: *institutions* (universities) and *organizations* (the student-org side).
   - SAML single sign-on, configured per tenant, and LTI 1.3 for course tools [code].
4. **Integrations are mostly feeds into Suitable** [site B-ANT, E-HS; uni W3, W8; code]:
   - Handshake events and attendance (nightly at WKU);
   - Anthology Engage;
   - campus calendars and rosters.

   The exception is the LTI link with Canvas and Blackboard, which runs both ways.
5. **AI is mostly talk.**
   - The website has AI only in event titles, and lists "Suity" as a *future* support-desk agent [site E-RS2:51-52].
   - The shipped code, though, already has one AI call: a chat with "Suity", scoped to one student, one school and one pathway, on a separate service [code].

**Verdict.**
- **What Suitable is.** Its value is the record (activity → proof → competency → transcript), plus a lot of staff work around it: approving submissions, giving credit after events, event requests, forms and workflows.
- **Where AI stands.** Its AI is one chat endpoint, with no public account of what it does.
- **What Reformatic should do.** Don't rebuild the platform. It means a catalog, QR check-in, badges, transcript PDFs, mobile apps and LTI, and 200+ schools already run it. Build **staff-side agents that sit beside whatever engagement system the college already runs**, on the Bizon, so student records never leave the box. §6 ranks them.

---

## 2. How the app is built [code]

**Stack**
- **Web app.** A React single-page app bundled with webpack, served from a CloudFront CDN. The login page ships 42 scripts, including React, lodash, FontAwesome, `qs`, `validator` and `tldjs`. No source maps.
- **Help.** A Zendesk Messenger widget behind a "Help" button.
- **Native apps.** iOS app id 1088594177 and Android package `co.suitable`; both store links are in the login code. The App Store lists the seller as "MeshNet Incorporated" and shows 4.9 stars from 6.4K ratings [uni W4]. The apps are for students; staff use the mobile web [uni W3].
- **Marketing.** The www site runs on HubSpot CMS. `nace.suitable.co` is a HubSpot/Unbounce landing page, not the tool itself.

**Sign-in**
- **Email first.** The login page asks for a school email, then "Continue"; [inference] the domain picks SSO or a password.
- **Tokens.** `/v1/auth/login`, `/refresh` and `/logout`. The access and refresh tokens live in `localStorage`, per REA's storage findings.
- **SAML.** Configured per institution and per organization, with identity-provider records and a metadata-file upload. The public pages only ever say "campus SSO".
- **Impersonation.** Suitable staff can impersonate any user (`/v1/admin/users/{id}/impersonate`).

**Tenancy**
- **Institutions** are universities. They contain **schools**, which contain **groups**.
- **Organizations** are the second tenant type. Each holds **student organizations** and their members, and has its own SSO, users, permissions, forms, workflows and finance accounts. [inference] This is The Hub, which is sold to student affairs separately from Pathways.
- **Employers** and **partnerships** link an employer to a school.
- Every tenant has **service permissions**: an on/off switch per module.
- Every institution has an **email quota** for notifications, with a limit.

**The API the login page ships** (100 methods in [`evidence/api-surface.tsv`](evidence/api-surface.tsv))

| First path segment | Methods |
|---|---|
| organizations | 25 |
| institutions | 23 |
| admin | 23 |
| schools | 5 |
| employers | 4 |
| auth | 4 |
| competencies | 3 |
| reports | 3 |
| others (public, partnerships, me, users, levels, catalogs, the Suity chat) | 10 |

- **Admin:**
  - enable, disable or delete an institution;
  - SAML identity providers;
  - LTI 1.3 platform registrations.
- **Feeds, per institution:**
  - roster feed setup;
  - calendar feeds, each with an on/off status;
  - LTI 1.3 tool deployments.
- **Rosters:**
  - streamed roster search;
  - student-org member imports **by URL or JSON**, run as background jobs that report their status;
  - member exports, as reports.
- **Content:**
  - competencies;
  - pathway details (in the code a pathway is a "catalog");
  - file uploads, through a pre-signed URL.
- **Reports:** list them, run one, or run them all.
- **Scorecard lookup:** finds a student's scorecard by a chosen field.

[inference] The everyday student calls (activities, completions, badges, the transcript) are not in this client. They load only after sign-in.

**Screens** (66 named routes with titles, in [`evidence/screens.tsv`](evidence/screens.tsv))

**Inside an institution:**
- **Home and activities.**
  - Dashboard, Explore, Activities, Activity Detail, Create/Edit Activity, Activities Digest.
  - **Adopt Shared Activity**: copy an activity that another unit shared. This matches the 2026-10 "activity sharing" release [site E-GP].
- **Requests and credit.**
  - Request Activity, Review Activity Request.
  - **Approvals**, Completion Detail, Pending Completion Detail.
  - A "get credit" route.
- **The student's record.**
  - Achievements: create, edit, detail.
  - Create Goal, Portfolio items, Leaderboard.
  - **Career Readiness** and Scorecard Lookup.
- **Admin tools.**
  - Forms and Form Builder, Workflows, Requests.
  - **Finance Accounts**, plus a finance detail screen.
  - Notifications, Settings, Roster Imports.
  - Course Builder and Course Sync Logs (LTI).

**Inside an organization:**
- Student Organizations: create, manage, add and edit members.
- **Handshake Imports.**
- Forms, Workflows, Requests, Finance Accounts, Career Readiness.

**Public (no login):**
- **Institution pages:** Leaderboard, Profile and **Scorecard**.
- **Achievement Detail.**
- **Organization and student-org profiles.**
- **Form submission**, including a "targeted response" link. Forms can earn activity credit [site E-FORM; uni W4].

[inference] The public Scorecard and Achievement pages are the shareable transcript and badge views.

**AI: "Suity"**
- **The call.** The client has one AI call. It sends `{message, conversationId, profileId, institutionId, pathwayId}` to a separate service, `suity.app.suitable.co/ai/chat`. [inference] The reply is read as plain text, not JSON, so it probably streams.
- **Where it shows.** The login screen's code includes a Suity panel that slides in.
- **What the website says.** The 2026 road show lists Suity as a "Future Virtual AI Agent, Support Desk" [site E-RS2:51-52].
- **What it adds up to.** Suity is built into the client and scoped to a student's pathway. Whether any school has it switched on, and which model runs it, can't be seen from outside.

---

## 3. Feature map

Evidence codes are explained at the top of `facts.md`; W1–W8 are the university and App Store pages.

| Feature | What it does | Area | Evidence |
|---|---|---|---|
| Activity catalog | A searchable list of every co-curricular opportunity. Any authorised staff member can add to it. It filters by tag, competency and level. | Pathways | site GP:36-38; uni W3; code |
| Activity types | **Event:** timed, with QR check-in.<br>**Task:** done on the student's own time.<br>**Point Total:** completed by reaching N points.<br>**Experience Set:** a group of activities. | Pathways | uni W2, W7 |
| Several dashboards | One campus can run several programs. Each has its own competencies and leaderboard. | Platform | uni W1, W3, W6 |
| QR check-in | Each event gets a "smart code", also available as a branded printable PDF. It scans only during the event and about 30 minutes after. A direct link covers students without the app. No geolocation is evident: the app's privacy label lists no location data. | Pathways / Hub | uni W2, W4, W6 |
| Proof for tasks | A written reflection (up to 5,000 characters), a file, a photo, or a self-report. | Pathways | uni W2, W7 |
| Approvals and credit | Admin approval can be required per activity, and items wait in an Approvals tab. Staff can "Give Credit" one at a time or in bulk after an event. | Pathways | uni W2, W3, W7; code |
| Points and levels | Points come from the activity's level. GVSU's five levels start at 10, and Pitt's events earn 10–20 and tasks 50–75. A "system level" takes 3 activities per competency at that level. | Pathways | uni W1, W2 (glossary); site GP:47-53 |
| Competencies | Every activity maps to competencies, from Suitable's framework or the school's own; FAMU uses NACE's. | Pathways / CCT | site GP:41-44, B-CCT:38 |
| Rubrics | A built-in rubric per experience is claimed, but its format is never shown. | Pathways | site GP:46-50 |
| Badges | Micro, macro or stackable. Built in a wizard, then opened to all, targeted at a segment, or kept as a draft. Shareable to LinkedIn (2024-12). Open Badges and Credly are never mentioned. | Pathways | site GP:58-62, E-PERS, E-LI |
| Co-curricular transcript | A live record with a showcase (major, GPA, bio), timeline, badge backpack, competency map and ePortfolio. Students can download a branded version (Enterprise) or share a link. The only "verification" is the school seal and the registrar's signature. | CCT | site CCT:32-61, SDA:61-64 |
| ePortfolio | Any file or media, each item private or public. | CCT | site CCT:58-61; code |
| Leaderboards | For students and for groups, with an opt-out. One is public. | Pathways | site GP:56; uni W6; code |
| Events and RSVP | Capacity limits, a live counter, attendance and completion reports (2024-01). | Hub / Pathways | site E-RSVP, HUB:43-46 |
| Event requests | An org requests an event and an admin reviews it. Once approved, the activity is created by itself (2026-05). | Hub | site E-AUTO:16-18; uni W6 |
| Forms | A drag-and-drop builder with public forms, aimed at replacing Google Forms and Qualtrics (2025-02). Submitting a form can earn credit. | Platform | site E-FORM; uni W4; code |
| Workflows | Custom approval chains with a queue and a history (2025-04). | Hub | site E-WF; code |
| Finance | The website says "coming 2022" and nothing since. The code has **Finance Accounts** screens for both tenant types, so something shipped. | Hub | site HUB:58; code |
| Elections | A list item only ("coming 2022"). Nothing in the code we saw. | Hub | site HUB:59 |
| Room reservations | Connects to CollegeNet or EMS (2026-11-10). | Hub | site E-ROOM |
| Push nudges | Segmented and scheduled. Org leaders can message their members. | Platform | site E-NUDGE, E-PERS; code (email quota) |
| Retention | Claims to flag at-risk students from their involvement, with alerts and nudges. | Platform | site SER:43-61 |
| Reporting | Real-time reports, faculty dashboards, a push to the data warehouse, and an Activity Sharing Report (2026-10). | Platform | site GP:65-68, E-GP; code |
| NACE Ready | An assessment after an internship, co-op or campus job, done by the student and by an observer. Results email out automatically. Schools can add their own questions. National benchmarks are due 2026-12-10. | NACE | site E-NACE, E-BENCH; NACE page; code (Career Readiness) |

---

## 4. Integrations

| System | Direction and detail | Evidence |
|---|---|---|
| SSO | SAML, set up per institution and per organization; metadata is uploaded. | code |
| Canvas, Blackboard | LTI 1.3: Suitable registers as a platform and deploys per institution. Course Builder and Course Sync Logs screens exist. Data flows both ways: activities go into courses, and progress can count toward a grade. UF instructors re-sync every semester. Villanova also names Brightspace as connected, without saying how. | code; site B-LTI, B-CAN; uni W5, W8 |
| Handshake | Into Suitable: calendar and attendance, nightly at WKU. Organizations have a Handshake Imports screen. | site E-HS; uni W3; code |
| Anthology Engage | Into Suitable, written by the school's IT through Suitable's API. Engage attendance can arrive as points. | site B-ANT:8-24 |
| Rosters, SIS | A roster feed per institution, plus member imports by URL or JSON. Suitable offers to sync whatever the other system's admins ask for. | code; site E-INT |
| Calendars | Campus calendar feeds come in, each with an on/off status. Google and Outlook calendar icons appear. Students can add an activity to their own calendar. | code; site E-CAL |
| Salesforce | A link only: the transcript URL is stored on the student's Salesforce record. | site B-SF:15-18 |
| Data warehouse | Out to the warehouse. The method is never stated. | site GP:67 |
| Open API | IT teams can write their own queries against the Guided Pathways API. | site B-ANT:13 |
| LinkedIn | Out: shares badges and drafts posts. | site E-LI |
| Room booking | CollegeNet and EMS. The direction is never stated. | site E-ROOM |
| Zendesk | Help widget for users. | code |

---

## 5. What stays unknown without a login

- **Commercial and trust.**
  - Pricing, and what the Enterprise and Pro tiers include.
  - Hosting, security certifications and data retention. The only privacy statement is a FERPA claim [site SOL:51].
- **The student-side API.** Activities, completions, badges and the transcript all load after sign-in.
- **Suity.**
  - Its model and provider.
  - What it can see beyond the pathway id.
  - Whether any school has it switched on.
- **Credentials.** Whether badges or transcripts follow Open Badges, 1EdTech CLR or Credly, and how anyone can verify a transcript beyond its seal.
- **Check-in.** Any cheating checks beyond the time window, and how offline records work.
- **Assessment.**
  - The rubric format.
  - The NACE instrument.
  - Who the observers are.
  - How benchmarks are built.
- **Finance and elections.** What the Finance Accounts screens do, and whether elections exist.
- **The warehouse push.** Its format and schedule.
- **Scale.** The impact report's figures sit behind a download form.

---

## 6. On the Bizon: what Reformatic could build for a college

**Rules for the list**
- **The send rule.** Nothing reaches a student without a staff click.
- **Student records stay on the box.** FERPA data is the strongest reason a college would pick a local model.
- **Each item has to save staff time** that Suitable's own pages show is real.
- **Build on what the console already has:**
  - agents made from templates (ADR-0012);
  - the review queue (ADR-0002);
  - register-first Ask and the Brain (ADR-0009);
  - roles and rights (ADR-0014);
  - the decision log (ADR-0016).

The data would come from the college's own exports, or from its engagement system's API under the college's account (see decision 4).

1. **Activity writer and competency tagger.**
   - **What it does.** Staff paste an event blurb or a flyer. The agent drafts the catalog entry: title, description, competencies, level, proof type and suggested points. Staff edit it and publish it in their own system.
   - **Why first.** Keeping the catalog up to date is constant staff work [site GP:36-38; uni W2]. It needs no student data, so it's the quickest demo.
   - **Console fit.** A template agent plus the review queue.
   - **Size.** S.
2. **Reflection reviewer.**
   - **What it does.** Reflections of up to 5,000 characters pile up in Approvals [uni W2, W7]. The agent reads each one against the activity's competencies. It drafts "approve" or "needs more" with a one-line reason and the passage that shows the competency. Staff decide.
   - **Data and safeguards.** Student writing stays on the box. Every decision is logged, the way the Inbox logs its decisions (ADR-0016).
   - **Size.** M.
3. **Transcript and résumé drafter.**
   - **What it does.** From a student's *verified* completions and competencies, the agent drafts the transcript's showcase text and LinkedIn or résumé lines. The student edits them.
   - **Safeguard.** It needs the grounding check (the 2026-09-27 grader research). We have seen a draft invent a claim before, in the outreach "Novonesis" case.
   - **Size.** M.
4. **Advisor digest and nudge drafts.**
   - **What it does.** A weekly list of students whose involvement dropped, with a short personal note drafted for each. The advisor sends it, or doesn't.
   - **What it mirrors.** Suitable's retention pitch [site SER:43-61], built on the console's customer-signal and at-risk patterns (ADR-0013).
   - **What it needs.** An involvement export from the college. This is FERPA-heavy.
   - **Size.** M–L.
5. **Student-org leader assistant.**
   - **What it does.**
     - Answers "how do I…" from the college's own handbook (Brain plus Ask).
     - Drafts event requests and form or workflow summaries for the student-affairs office.
   - **Data.** Little sensitive data.
   - **Size.** S–M.
6. **A student-facing "what next" chat** (Suity's job).
   - **What it would do.** Suggest a student's next activities from their pathway progress.
   - **Why last.**
     - It's a new trust surface: thousands of students signing in.
     - It doesn't fit the box today. Qwen keeps 40 tok/s only up to about 4 to 8 calls at once, and other clients already fill it at busy times (Bizon capacity report, 2026-11).
   - **When to revisit.** Only with a capacity plan.

**Don't build** a Suitable replacement: the catalog, QR check-in, badges, transcript PDFs, mobile apps and LTI. That's years of product, and a college that already runs Suitable or Engage won't switch for it.

---

## 7. Open decisions for Connor

1. **Which college?** The order of the list depends on what it runs today: Suitable, Anthology Engage, a homegrown system, or nothing.
2. **Beside or instead?**
   - **Beside** (recommended): agents next to the college's existing engagement system.
   - **Instead:** our own engagement product.
3. **Student data on the box.** FERPA needs the college's data agreement before any real record arrives. Encryption at rest and offsite backups for that data should be confirmed first.
4. **Suitable's competing-use clause.** If the college is a Suitable subscriber, reading its Suitable data through the college's account to power our agents may fall under that clause ("must not use the service for the benefit of any … competitive" service). That needs a legal read before any integration. Working from the college's own exports avoids the question.
5. **Student-facing chat.** Is it wanted at all? If so, it needs a capacity plan for the box first (item 6).
