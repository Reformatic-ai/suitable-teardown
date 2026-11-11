# Suitable public surface (read 2026-11-11, anonymous, no login)

> In this repo, paths under `raw/` and `rea/` point to the Bizon copy in `~/agent-research/evidence/suitable/`. They hold Suitable's own pages, scripts and captures, which are kept out of git. The two inventories are in `evidence/`.

Rules: robots.txt respected (raw/www.suitable.co_robots.txt); 3 s between pages; no forms, no login, no API calls.

## Fetched with curl (raw/pages/*.html → .txt → .clean.txt)
- https://www.suitable.co/products/guided-pathways
- https://www.suitable.co/products/co-curricular-transcripts
- https://www.suitable.co/products/student-organization-management
- https://www.suitable.co/solutions
- https://www.suitable.co/solutions/student-development-skill-acquisition
- https://www.suitable.co/solutions/student-engagement-awareness
- https://www.suitable.co/solutions/student-enrollment-retention-persistence
- https://www.suitable.co/site/handbook
- https://www.suitable.co/universities
- https://www.suitable.co/guide-combining-suitable-products-for-ultimate-student-success
- https://www.suitable.co/knowledge-center/guides/how-suitable-student-engagement-app-works
- https://www.suitable.co/knowledge-center/guides/how-suitable-goes-beyond-student-experience-apps
- https://www.suitable.co/knowledge-center/blog/the-co-curricular-transcript-what-is-it
- https://www.suitable.co/knowledge-center/blog/anthology-integrations
- https://www.suitable.co/knowledge-center/blog/canvas-integration-how-the-popular-lms-pairs-seamlessly-with-suitable
- https://www.suitable.co/knowledge-center/blog/new-feature-suitable-data-integration-with-blackboard-canvas
- https://www.suitable.co/knowledge-center/blog/suitable-salesforce-integration
- https://www.suitable.co/knowledge-center/events/making-your-tools-talk-mastering-seamless-integrations-with-suitable
- https://www.suitable.co/knowledge-center/events/the-handshake-calendar-and-attendance-feed-integration-product-showcase
- https://www.suitable.co/knowledge-center/events/guided-pathways-release-activity-sharing-and-drag-drop-2026-october
- https://www.suitable.co/knowledge-center/events/june-product-update-customizable-activity-cards-calendar-integration
- https://www.suitable.co/knowledge-center/events/product-showcase-the-hub-event-automations
- https://www.suitable.co/knowledge-center/events/product-showcase-the-hub-workflows-2025
- https://www.suitable.co/knowledge-center/events/product-update-general-workflows-room-reservations
- https://www.suitable.co/knowledge-center/events/product-update-nace-ready-competency-assessment-tool
- https://www.suitable.co/knowledge-center/events/nace-ready-product-update-nace-benchmarking
- https://www.suitable.co/knowledge-center/events/real-time-push-notifications-product-showcase
- https://www.suitable.co/knowledge-center/events/the-future-of-forms-product-showcase-2025
- https://www.suitable.co/knowledge-center/events/thepersonalizationproductshowcase-feb
- https://www.suitable.co/knowledge-center/events/thersvpeventmanagementproductshowcase
- https://www.suitable.co/knowledge-center/events/linkedinsharingproductshowcase2024
- https://www.suitable.co/knowledge-center/events/suitables-2026-road-show-ft.-ai-student-engagement-and-career-readiness-philly-templeu
- https://www.suitable.co/knowledge-center/events/suitables-2026-road-show-ft.-ai-student-engagement-and-career-readiness-at-northern-illinois-university
- https://www.suitable.co/-suitables_2026_impact_report
- https://www.suitable.co/sitemap.xml (512 page URLs in raw/sitemap-pages.txt)
- https://www.suitable.co/robots.txt

## Loaded in a private headless Chrome 134 (setuid sandbox on, throwaway profile, stopped by PID)
- https://app.suitable.co/ → /login: REA inspect-web-page (rea/app-page.json), export (rea/app-scripts), analyze-javascript-application (rea/app-analysis.json.gz), screenshot rea/shots/app-login.png
  - Origins the page loaded (Performance API): d2pfp8afw01t91.cloudfront.net (42 scripts, 39 styles, 2 images), static.zdassets.com (1 script, Zendesk), ekr.zdassets.com (1 fetch), app.suitable.co (1 fetch).
  - Inventories pulled from the shipped code: rea/api-surface.tsv (100 API client methods), rea/screens.tsv (66 named screens + titles).
- https://nace.suitable.co/: REA inspect-web-page (rea/nace-page.json), visible text rea/nace-visible-text.txt, screenshot rea/shots/nace.png
  - Origins: nace.suitable.co, cdnjs, jsdelivr, Google Tag Manager, LinkedIn insight, HubSpot, Unbounce embed. A marketing landing page, not the tool itself.

## University and app-store pages
See facts.md (Part B list), read by a research subagent with WebFetch.

## Not touched
- /sample-* (sample transcript), /knowledge-center/case-studies/* in the robots list, /knowledge-center/blog/video/*, any form, app.suitable.co beyond the login page, the APK/IPA.
