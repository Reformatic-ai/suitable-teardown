# Suitable (suitable.co): facts from public material

> Paths under `raw/` and `rea/` are the local folders of those names next to this repo's files. They hold Suitable's own pages, scripts and captures, so `.gitignore` keeps them out of git; they exist only in the local copy on Connor's Mac. The two inventories are in `evidence/`.

Built 2026-11-11 from 34 saved Suitable pages and 8 university and app-store pages. Vendor claims are marketing, not proof.

**Evidence key.** Local files sit in `raw/pages/`. Drop `.clean.txt` and turn `__` into `/` to get the URL on www.suitable.co. Citations are `CODE:line`.

| Code | File | Code | File |
|---|---|---|---|
| GP | products__guided-pathways | E-NUDGE | knowledge-center__events__real-time-push-notifications-product-showcase |
| CCT | products__co-curricular-transcripts | E-RSVP | knowledge-center__events__thersvpeventmanagementproductshowcase |
| HUB | products__student-organization-management | E-PERS | knowledge-center__events__thepersonalizationproductshowcase-feb |
| SOL | solutions (same text as universities) | E-HS | knowledge-center__events__the-handshake-calendar-and-attendance-feed-integration-product-showcase |
| SEA | solutions__student-engagement-awareness | E-LI | knowledge-center__events__linkedinsharingproductshowcase2024 |
| SDA | solutions__student-development-skill-acquisition | E-FORM | knowledge-center__events__the-future-of-forms-product-showcase-2025 |
| SER | solutions__student-enrollment-retention-persistence | E-WF | knowledge-center__events__product-showcase-the-hub-workflows-2025 |
| IMP | -suitables_2026_impact_report | E-RS1 | knowledge-center__events__suitables-2026-road-show-…-philly-templeu |
| GAPP | knowledge-center__guides__how-suitable-student-engagement-app-works | E-INT | knowledge-center__events__making-your-tools-talk-mastering-seamless-integrations-with-suitable |
| GBEY | knowledge-center__guides__how-suitable-goes-beyond-student-experience-apps | E-RS2 | knowledge-center__events__suitables-2026-road-show-…-at-northern-illinois-university |
| HBK | site__handbook | E-NACE | knowledge-center__events__product-update-nace-ready-competency-assessment-tool |
| CMB | guide-combining-suitable-products-for-ultimate-student-success | E-AUTO | knowledge-center__events__product-showcase-the-hub-event-automations |
| B-LTI | knowledge-center__blog__new-feature-suitable-data-integration-with-blackboard-canvas | E-CAL | knowledge-center__events__june-product-update-customizable-activity-cards-calendar-integration |
| B-CAN | knowledge-center__blog__canvas-integration-how-the-popular-lms-pairs-seamlessly-with-suitable | E-GP | knowledge-center__events__guided-pathways-release-activity-sharing-and-drag-drop-2026-october |
| B-ANT | knowledge-center__blog__anthology-integrations | E-ROOM | knowledge-center__events__product-update-general-workflows-room-reservations |
| B-SF | knowledge-center__blog__suitable-salesforce-integration | E-BENCH | knowledge-center__events__nace-ready-product-update-nace-benchmarking |
| B-CCT | knowledge-center__blog__the-co-curricular-transcript-what-is-it | | |

Web pages W1–W8 are listed at the end. The four products are Guided Pathways, The Hub (student orgs), Co-Curricular Transcripts and NACE Ready (CMB:37; GP:7-14).

## 1. Roles

| Role | What they do | Evidence |
|---|---|---|
| Student | Browses activities, scans event QR codes, completes tasks (reflection, file, survey, form), tracks points, levels and badges on a Scorecard, keeps an ePortfolio, downloads or shares the transcript, joins orgs, RSVPs. | W1; W3; W2; CCT:38-61; E-RSVP:13 |
| Program staff / activity owner | Creates activities, sets validation, level and competency, approves submissions, gives credit by hand, builds badges and segments, sends pushes, pulls reports. Access is tiered. | GP:38; W2; W3; W7; E-PERS:14-15 |
| Global admin / publisher | Campus-wide admin who can credit any activity and set up org advisors. | W6 |
| Institution org admin (Hub) | Adds orgs, bulk-imports members across orgs, manages registration and standing, reviews event requests and workflows. | W7; E-AUTO:16-18; HUB:44, 50 |
| Org leader / advisor | Access roles: Member, Leader, Manager. Leaders edit the org page and roster; Managers (advisor, president) also assign Leaders. They request events, get QR codes, message members. At WKU only advisors can give credit. | W6; W7; HUB:38, 52 |
| Faculty | Through the LMS (LTI) adds activities to courses, sees co-curricular data in Canvas, can grade participation. Faculty dashboards. | B-LTI:13-14, 27; B-CAN:22-29; W8; SER:68 |
| Advisor (academic) | Sees the involvement timeline. At ACU Dallas, opens the transcript from Salesforce. | CCT:45; B-SF:18 |
| Registrar | Signs or seals the co-curricular transcript. | CCT:40; SDA:63 |
| Observer (NACE tool) | Assesses assigned students and gets single or combined emails. Who observers are is not stated. | E-NACE:13-14 |
| Employer / grad school | Views shared transcripts and portfolios. No account role is described. | CCT:55; B-CCT:32; W2 |
| Other-system admins | Get Suitable data synced into their own tools without logging in to Suitable. | E-INT:12 |
| Suitable staff | Implement integrations and build custom reports in under a week. | GP:68; B-CAN:45; B-SF:12 |

## 2. Feature map

| Feature | What it does | Area | Evidence | Release date |
|---|---|---|---|---|
| Opportunity catalog | Searchable list of all co-curricular opportunities that any authorised staff member can add to. Filters by tag, competency and level. | Pathways | GP:36-38; SDA:68-71; W3 | |
| Activity types | Event (timed, checked in by QR), Task (on your own time), Point Total Activity (needs N points), Experience Set (a group of activities). | Pathways | W2; W7; B-LTI:31 | |
| Program dashboards | One campus runs several dashboards, each with its own competencies and leaderboard. Students switch between them. | Platform | W1; W3; W6 | |
| QR check-in | Each event emails its creator a "smart code" that can be printed as a branded PDF. Students scan it in the app. It works only during the event and about 30 minutes after. A direct link serves students without the app. | Pathways/Hub | W2; W6; W1; SEA:65 | |
| Geolocation check-in | No evidence. The app's privacy label lists no location data. | n/a | W4 | |
| Reflection / file / photo / self-report | Tasks can require a written reflection (up to 5,000 characters) or an uploaded file. The app has a photo picker. Pitt calls Task completions self-reporting. | Pathways | W2; W7; W1; W4; SEA:92 | App photo picker 2025-09-08 |
| Approvals / verification | Admin approval can be set per activity. Pending items wait in an Approvals tab. Staff "Give Credit" one by one or in bulk after an event. Service hours are checked through workflows. | Pathways | W2; W7; W3; SEA:72, 93 | |
| Points | Set by activity level (10/20/50/75, plus 150 at GVSU). More competencies raise the points. | Pathways | W2; W3; W7; GP:53 | |
| Leaderboards | Student and group leaderboards that can be filtered by org. Students can opt out. | Pathways | GP:56; W6; W8 | |
| Levels / milestones | Levels of engagement depth. A "system level" is reached by doing 3 activities per competency at that level. Stackable badges act as milestones. | Pathways | GP:47, 53, 61; SDA:80; W2 | |
| Competencies | Every activity maps to competencies, from a Suitable framework or the school's own. FAMU used NACE. | Pathways/CCT | GP:41-44; CCT:54; B-CCT:38 | |
| Rubrics / assessment | Claims a built-in assessment rubric per experience and a campus-wide standard. The format is not shown. | Pathways | GP:46-50 | |
| Badges | Branded badges with requirements: micro, macro or stackable. Built in a wizard. Open to all, targeted at a cohort, or draft. Org-specific badges exist. Open Badges and Credly are never mentioned. | Pathways | GP:58-62; SDA:56-58; E-PERS:14; SEA:90 | 2024-02-29 (wizard and segments) |
| Co-curricular transcript | Live record in five parts: showcase (major, GPA, bio), timeline, badge backpack, competency map, ePortfolio. Branded download (Enterprise tier), share links, PDF from the web app at WKU. Verification is only seal and registrar signature. | CCT | CCT:32-61; SDA:61-64, 89; B-CCT:19; W3 | |
| ePortfolio | Any file or media type. Each item can be private or public. | CCT | CCT:58-61; W3 | |
| LinkedIn sharing | One click shares a badge or credential, or drafts a LinkedIn post, on web and mobile. | CCT | E-LI:12-13; GP:62 | 2024-12-17 |
| Events / RSVP / attendance | RSVP with a capacity limit and a live counter. Attendance reports, plus a completion report after the event. | Hub/Pathways | HUB:43-46; E-RSVP:13; W7 | 2024-01-30 |
| Event requests | Orgs submit event requests for admin review. The QR code is emailed once approved. | Hub | HUB:44; W6; W1 | |
| Forms | Drag-and-drop builder that replaces Google Forms and Qualtrics. Shared by link or QR code. Public forms need no account. Tied to Pathways and NACE. Submitting a form can earn activity credit. | Platform | E-FORM:13-16; W4 | 2025-02-25; app 2024-11-05/17 |
| Workflows | Custom approval chains with a queue, a view of where each request is stuck, and a full history. Routes forms to the right reviewer. | Hub | E-WF:12-13; HUB:50 | 2025-04-30 |
| Automations | An approved event request creates the activity in the feed by itself. Bulk org re-registration. A standing field (active/pending/inactive). | Hub | E-AUTO:16-18 | 2026-05-28 |
| Room reservations | Connects to the school's existing booking system (CollegeNet and EMS are named). | Hub | HUB:45; E-ROOM:13 | 2026-11-10 |
| Push notifications | In-app nudges, segmented and scheduled by date, time and audience. Org leaders can message members. GVSU limits org requests. | Platform | HUB:52; E-NUDGE:11-14; E-PERS:15; SEA:51; W7 | 2021-12-02; 2024-02-29 |
| Personalization | Claims journeys personalise "as students engage". UF mentions recommendations. "AI Powered Personalization" appears as a bare list item. | Pathways | GP:31, 55; SDA:44, 76; W8 | |
| Calendar | Pulls in campus calendars. Students add an activity to their own calendar. Activity cards take custom images. | Platform | SEA:66; SDA:70; E-CAL:13 | 2026-06-18 |
| Reporting / warehouse | Real-time reports and custom tags. Pushes data to data warehouses. Faculty dashboards. Activity Sharing Report. | Platform | GP:65-68; SOL:47; SER:68; E-GP:15 | 2026-10-13 (sharing report) |
| Pathway ordering / sharing | Drag activities into order and move them between "available" and "required". Share activities across units (Enterprise). | Pathways | E-GP:14-15; SDA:47, 71 | 2026-10-13 |
| NACE assessment tool | Career-readiness assessment after a work experience, done by students and observers. Automated emails. Bulk upload of students from a Career Readiness tab. | NACE | GP:13-14; E-NACE:11-15 | 2026-04-30 update |
| NACE benchmarking | Compares a school's students with others in Suitable's network, sliced by cohort, demographics or tag. | NACE | E-BENCH:15-21 | 2026-12-10 (upcoming) |
| Org directory / profiles | An org page made of sections. Each section is public, visible to all students, or members only. | Hub | HUB:37-40; W6; W7 | |
| Rosters / roles | Add members one by one, import or export them, and assign access roles and display titles. | Hub | HUB:38; W6; W7 | |
| Elections | Listed only ("Elections, polls" and "coming 2022"). No details. | Hub | HUB:59; SEA:87 | |
| Budgets / finance | Listed as coming in 2022. A 2026 page says finance features were designed. No details. | Hub | HUB:58; E-AUTO:14 | |
| Service hours | Students log hours, staff verify them, and each student gets a record. Reports per student and in total. | Pathways | SEA:70-74 | |
| Virtual engagement | Online events, one-to-one meetings, group chat rooms and video libraries. | Platform | SEA:52-53 | |
| Retention programs | Flags at-risk students from involvement data, with automated alerts and nudges. First-year, transfer-record and first-gen programs. | Platform | SER:43-61, 75 | |
| Mobile app | iOS and Android, for students only. Admins use the mobile web. | Platform | W3; W4; W5; W8; E-LI:13 | |
| Migration | Claims ready migration plans from the major competitors. Temple moved hundreds of orgs and forms. | Platform | SOL:49; E-RS1:37 | |

## 3. Integrations

| System | Direction and detail | Evidence |
|---|---|---|
| Canvas, Blackboard (LTI) | Both ways. Data is mapped and synced, with a per-field choice to overwrite LMS data. Deep links. Progress can count toward the final grade. UF says instructors must re-sync every semester. | B-LTI:11-19; B-CAN:17-25; W8 |
| Blackboard (WKU) | Faculty add shared activities to courses without a Suitable account. | W6 |
| Brightspace | Named as connected at Villanova. Direction not stated. | W5 |
| Anthology Engage | Engage to Suitable through Suitable's API. Event name, description and link sync in. Engage attendance credit can come across as points. | B-ANT:8-24 |
| Handshake | Handshake to Suitable. Events sync into Suitable's calendar. WKU says career-fair attendance arrives nightly and completes the matching activity. | E-HS:12-13; W3 |
| Salesforce | Link only: the student's Salesforce record holds a link to their Suitable transcript (ACU Dallas). | B-SF:15-20 |
| SIS | Named in general terms. Suitable says it syncs whatever data the other system's admins ask for. | E-INT:12; W5 |
| Advising system / LMS (Enterprise) | Suitable to the other system: badge progress tied to course requirements. | SDA:58 |
| Campus calendars | Into Suitable. | SEA:66; SDA:70; E-INT:12 |
| Room booking (CollegeNet, EMS) | Connects to the existing platform. Direction not stated. | HUB:45; E-ROOM:13 |
| Data warehouse | Suitable to the warehouse. Method not stated. | GP:67; SOL:47 |
| Open API | Custom integrations. The school's IT writes queries against it. | E-INT:13; B-ANT:13; B-SF:11 |
| SSO | Schools sign in with campus single sign-on (SSO). The protocol (for example SAML) is never named. | W5; W6; W7 |
| Qualtrics, Google Forms | Shown as tools to replace, not to integrate with. | E-FORM:13-14 |
| LinkedIn | Suitable to LinkedIn: badge shares and posts. | E-LI:12 |
| Personal calendars | Students export an activity to their own calendar. | E-CAL:13 |

## 4. AI

The claims are almost all event titles and agenda lines:
- The 2026 Road Show is billed as "ft. AI, Student Engagement, and Career Readiness" (E-RS1:1, 16; E-RS2:1, 16).
- Each road show has a session called "Student Engagement & AI" on "AI and the latest product advancements". The speakers are the product manager at Temple and the CTO at NIU (E-RS1:33-34; E-RS2:33-34).
- The NIU speaker list includes "Suity", described as a "Future Virtual AI Agent, Support Desk" (E-RS2:51-52). That is a planned support bot, not a shipped feature.
- "AI Powered Personalization" appears once as a bare feature-list item with no explanation (SDA:76).
- Retention copy promises to "predict persistence" but does not say AI does it (SOL:42). UF mentions "personalized recommendations" (W8).

No page says what any AI does, what data it uses, or when it shipped.

## 5. Data objects

- **Programs and catalog:** Dashboard / Pathway; Activity (Event, Task, Point Total Activity); Experience Set; Experience Type tag; Tag / Category / Filter.
- **Progress:** Level; Competency; Competency Framework; Assessment Rubric; Points; Leaderboard (Students, Groups); Achievement / Badge; Badge Segment.
- **Check-in and approvals:** Smart Code (QR); Validation type (Reflection, Submission, Administrator Approval, Event); Approval; Give Credit; Completion Report.
- **Student record:** Scorecard; Portfolio item; Co-Curricular Transcript / Record (Experience Showcase, Involvement Timeline, Badge Backpack, Competency Map); Skills Graph.
- **Orgs (Hub):** Organization (content sections, account standing); Member (access role, member role, title); Event Request; Registration Request; Room Reservation.
- **Tools and reports:** Form; Workflow; Push Notification / Mobile Nudge; Activity Digest / Experience Sharing Digest; Activity Sharing Report.
- **NACE tool:** NACE Assessment; Observer; Benchmark cohort.

Evidence: W2; W3; W6; W7; GP:36-62; CCT:36-61; SDA:75-90; E-AUTO:16-18; E-GP:15; E-NACE:13; E-BENCH:20; B-ANT:16.

## 6. Scale and numbers

| Figure | Evidence |
|---|---|
| 200+ partner institutions | IMP:37 |
| The impact report covers 8 partners and four pillars (engagement, career readiness, retention, assessment). Its figures sit behind a download form, so none were seen. | IMP:32, 37, 40 |
| 60% of students log in through the mobile app | GAPP:10 |
| Up to 100% engagement increase after switching | GBEY:8 |
| Over 70% of Suitable schools adopted the 80 remote tasks during COVID | HBK:8 |
| Assessment detail "5x greater"; custom reports in under a week | GP:50, 68 |
| NACE tool was in its 2nd year of use nationwide in April 2026 | E-NACE:11 |
| FAMU: about 9,000 students, about 100 programs, live summer 2021 | B-CCT:35-38 |
| Road show: 4 cities in 4 months | E-RS1:16 |
| iOS app rated 4.9 from 6.4K ratings, version 1.50.0. Seller listed as MeshNet Incorporated. | W4 |
| Pitt: 300 points per pathway. Events earn 10–20 points, tasks 50–75. | W1 |

## 7. Release timeline (oldest to newest)

| Date | Release | Evidence |
|---|---|---|
| Fall, year not given | LTI integration with Blackboard and Canvas | B-LTI:6, 11 |
| 2021-12-02 | Real-Time Mobile Nudges (re)introduced | E-NUDGE:4, 11 |
| 2024-01-30 | RSVP and event management: capacity limits, attendee counter | E-RSVP:5, 13 |
| 2024-02-29 | Badge wizard, badge segments, scheduled targeted push | E-PERS:6, 14-15 |
| 2024-06-25 | Handshake calendar and attendance feed | E-HS:4, 12 |
| 2024-11-05 / 11-17 | App: view and submit forms; forms count for activity credit | W4 |
| 2024-12-17 | LinkedIn sharing of badges | E-LI:4, 12 |
| 2025-01-16 | App: view your form responses | W4 |
| 2025-02-25 | Native forms builder | E-FORM:6, 14 |
| 2025-04-30 | Hub customizable workflow engine | E-WF:4, 12 |
| 2025-09-08 | App: fixes for special form types, better photo picker | W4 |
| 2026-02-20 | Road show at Temple (AI workshop) | E-RS1:6 |
| 2026-03-12 | Integrations webinar: plug-and-play connectors, open API, LTI | E-INT:4, 12-16 |
| 2026-04-17 | Road show at NIU (AI workshop, "Suity") | E-RS2:6 |
| 2026-04-30 | NACE tool: observer email preferences, automated emails, bulk upload | E-NACE:4, 13-15 |
| 2026-05-28 | Hub: event-request automations, bulk re-registration, org standing | E-AUTO:5, 16-18 |
| 2026-06-18 | Custom activity-card images, add to calendar | E-CAL:4, 13 |
| 2026-10-13 | Pathways drag-and-drop ordering, Activity Sharing Report | E-GP:5, 14-15 |
| 2026-11-10 | Hub room reservations | E-ROOM:5, 13 |
| 2026-12-10 (upcoming) | NACE benchmarking | E-BENCH:8, 11 |

## 8. Unknown

- **Commercial and trust:** pricing and what the Enterprise and Pro tiers include (only hinted at, SDA:47; SER:70); security certifications, data retention and hosting. The only privacy statement is a FERPA claim (SOL:51).
- **Credentials:** whether badges or transcripts follow Open Badges, 1EdTech CLR or Credly; how a transcript can be verified beyond seal and signature.
- **Check-in:** geolocation or other anti-cheating checks beyond the time window; offline scanning ("Offline and Online Records", SDA:88, is not explained).
- **Integration specifics:** SSO protocol; which SIS products, fields, direction and schedule; LTI version and grade passback; how the API is shaped and documented; how data reaches a warehouse.
- **Assessment:** rubric format and scoring; the NACE instrument, who observers are, and how benchmarks are built.
- **Hub status:** whether elections and finance/budgeting have shipped and how they work; which room systems besides CollegeNet and EMS are supported.
- **AI:** any product behaviour at all.
- **Scale:** impact-report figures and total student counts.

## Part B URLs read

- W1 https://studentaffairs.pitt.edu/occ/frequently-asked-questions
- W2 https://www.gvsu.edu/sos/activity-tips-20
- W3 https://www.wku.edu/wkuexperience/
- W4 https://apps.apple.com/us/app/suitable/id1088594177
- W5 https://villanova.teamdynamix.com/TDClient/2759/UNIT/KB/Article/162776/Academic-Application-Suitable
- W6 https://www.wku.edu/wkuexperience/rso.php
- W7 https://www.gvsu.edu/sos/lakerlink-tips-tricks-4
- W8 https://elearning.ufl.edu/instructor-help/teaching-and-learning-tools/tool-finder/items/suitable.html

Tried but not read: https://www.catalog.pitt.edu/node/340 (DNS failure) and https://gvsu.edu/sos/lakerlink-powered-by-suitable-resources-45.htm (404).
