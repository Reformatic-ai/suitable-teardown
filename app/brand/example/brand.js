// Example brand pack: "Larkspur University", an invented college.
// Open the app with ?brand=example to see it. Copy this folder to make a pack for another college.
window.WP_BRAND = {
  college: 'Larkspur University',   // replaces the college name everywhere
  logo: 'logo.svg',                 // shown in the sidebar and on the transcript
  mark: 'logo.svg',                 // small version for the phone top bar and the browser tab
  logoAlt: 'Larkspur University',
  note: 'Example brand pack on sample data. Larkspur University is not a real college.',
  // Colour tokens. Any token from the top of styles.css can be set; unset ones keep the default.
  light: {
    '--bg': '#f4f6fa', '--surface': '#ffffff', '--ink': '#162033', '--muted': '#566179', '--line': '#d9dfeb',
    '--brand': '#1f3f8f', '--brand-ink': '#ffffff', '--brand-soft': '#dde6f8',
    '--accent': '#8a5a00', '--accent-soft': '#f8ecc9', '--accent-bright': '#e0a100',
    '--hero-bg': '#1f3f8f', '--hero-ink': '#ffffff', '--hero-bar': '#f2c230', '--paper-brand': '#1f3f8f',
  },
  dark: {
    '--bg': '#10141d', '--surface': '#181e2b', '--ink': '#e7ebf3', '--muted': '#9aa5ba', '--line': '#2a3345',
    '--brand': '#93b0f2', '--brand-ink': '#0f1626', '--brand-soft': '#1f2c4a',
    '--accent': '#f0c452', '--accent-soft': '#3a3015', '--accent-bright': '#f0c452',
    '--hero-bg': '#243a73', '--hero-ink': '#eef2fb', '--hero-bar': '#f2c230',
  },
  // Optional: adjust the sample data for this college.
  data: function (D) { D.me.program = 'B.A. Environmental Policy'; },
};
