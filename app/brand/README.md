# Brand packs

A brand pack restyles Waypoint for one college: its name, colours and logo. Nothing else in the app changes.

## Use one
- Open the app with `?brand=<id>`, for example http://localhost:8765/app/?brand=example.
- The choice is remembered in that browser, so the plain address keeps the brand afterwards.
- `?brand=default` goes back to the standard look.
- If the pack does not exist, the app falls back to the standard look.

## Make one
1. Copy `example/` to a new folder named with a short id (letters, digits, hyphens), such as `app/brand/larkspur/`.
2. Edit `brand.js`:
   - `college`: the name shown throughout the app.
   - `logo`: the full logo, shown in the sidebar and on the transcript. It sits on a white plate, so a logo with dark text works in dark mode too.
   - `mark`: a small, wide-ish version for the phone top bar and the browser tab. Leave it out to reuse the logo.
   - `note`: a line shown at the foot of every screen. Use it to say the page is a demo and who made it.
   - `light` and `dark`: colour tokens. The full list is at the top of `styles.css`. Keep text colours readable: 4.5 to 1 against their background.
   - `data(D)`: optional changes to the sample data in `data.js`.
3. Put the logo files in the same folder.

## Packs for real colleges stay out of this repo
`.gitignore` excludes every folder in `app/brand/` except `example/`. A real college's name and logo are theirs, and a pack shows who you are pitching, so keep those packs on your own machine.
