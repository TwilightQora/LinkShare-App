/* =================== Devlinks Builder — script.js =================== */

/* ---------- Keys & Defaults ---------- */
const K = {
  links:  "devlinks.links",
  profile:"devlinks.profile",
  skin:   "devlinks.card.skin",
  theme:  "devlinks.theme",
};

const DEFAULT_PROFILE = { name:"Your Name", email:"you@example.com", initials:"BR", avatar:null };
const DEFAULT_SKIN = {
  font:"system", barStart:"#6d28d9", barEnd:"#8b5cf6",
  surface:"#ffffff", text:"#0f172a", muted:"#64748b", ring:"#8b5cf6",
  radius:22, shadowPct:40, avatarShape:"circle", avatarRing:"ring", linkShape:"pill"
};

/* Plantilla inicial */
const DEFAULT_TEMPLATE_LINKS = [
  { platform:"website",  url:"https://your-site.com" },
  { platform:"github",   url:"https://github.com/your-user" },
  { platform:"linkedin", url:"https://linkedin.com/in/your-profile" },
  { platform:"twitter",  url:"https://x.com/your-handle" }
];

/* ---------- Plataformas + íconos SVG ---------- */
const PLATFORMS = [
  { key:"website",  label:"Website",  className:"website" },
  { key:"github",   label:"GitHub",   className:"github" },
  { key:"gitlab",   label:"GitLab",   className:"gitlab" },
  { key:"linkedin", label:"LinkedIn", className:"linkedin" },
  { key:"facebook", label:"Facebook", className:"facebook" },
  { key:"twitter",  label:"X / Twitter", className:"twitter" },
  { key:"threads",  label:"Threads",  className:"threads" },
  { key:"instagram",label:"Instagram",className:"instagram" },
  { key:"tiktok",   label:"TikTok",   className:"tiktok" },
  { key:"youtube",  label:"YouTube",  className:"youtube" },
  { key:"twitch",   label:"Twitch",   className:"twitch" },
  { key:"discord",  label:"Discord",  className:"discord" },
  { key:"whatsapp", label:"WhatsApp", className:"whatsapp" },
  { key:"telegram", label:"Telegram", className:"telegram" },
  { key:"snapchat", label:"Snapchat", className:"snapchat" },
  { key:"pinterest",label:"Pinterest",className:"pinterest" },
  { key:"dribbble", label:"Dribbble", className:"dribbble" },
  { key:"behance",  label:"Behance",  className:"behance" },
  { key:"medium",   label:"Medium",   className:"medium" },
  { key:"reddit",   label:"Reddit",   className:"reddit" },
  { key:"stackoverflow", label:"Stack Overflow", className:"stackoverflow" },
  { key:"codepen",  label:"CodePen",  className:"codepen" },
  { key:"devto",    label:"dev.to",   className:"devto" },
  { key:"kaggle",   label:"Kaggle",   className:"kaggle" },
  { key:"spotify",  label:"Spotify",  className:"spotify" },
  { key:"applemusic", label:"Apple Music", className:"applemusic" },
  { key:"soundcloud", label:"SoundCloud", className:"soundcloud" },
  { key:"steam",    label:"Steam",    className:"steam" },
  { key:"itch",     label:"Itch.io",  className:"itch" },
  { key:"patreon",  label:"Patreon",  className:"patreon" },
  { key:"buymeacoffee",label:"Buy Me a Coffee", className:"buymeacoffee" },
  { key:"paypal",   label:"PayPal",   className:"paypal" },
  { key:"calendly", label:"Calendly", className:"calendly" },
  /* clave especial para personalizados */
  { key:"custom",   label:"Custom",   className:"website" }, // color se define por item.bg
];

/* Íconos: SVG compactos (stroke/currentColor para auto-contraste) */
const ICONS = {
  website: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 12h18M3 6h18M3 18h18"/></svg>`,
  github: `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 .1.7 1.9 2.9 1.3.1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.2-3.2 0-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C16.2 6 17.2 6.3 17.2 6.3c.6 1.6.1 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"/></svg>`,
  gitlab:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M22 13.7 19.2 4.5a.8.8 0 0 0-1.5 0l-1.6 4.9H7.9L6.3 4.5a.8.8 0 0 0-1.5 0L2 13.7a1.3 1.3 0 0 0 .5 1.5l9.5 7 9.5-7c.5-.3.7-1 .5-1.5Z"/></svg>`,
  linkedin:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3.5 8.98h3v11h-3Zm6 0h2.9v1.5h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8v6.4h-3v-5.7c0-1.4 0-3.2-2-3.2-2 0-2.3 1.5-2.3 3v5.9h-3Z"/></svg>`,
  facebook:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M13 22v-9h3l.5-3H13V8.2c0-.9.3-1.5 1.7-1.5H17V4.1A18 18 0 0 0 14.8 4C12.6 4 11 5.4 11 7.9V10H8v3h3v9h2Z"/></svg>`,
  twitter:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="m20.4 7.3 2-2.3h-2.4l-1.7 2-3.6 4.2 4.6 5.6H22l-5.1-6.2 3.5-4.3ZM3 6h6.3l4.6 5.6L9.3 18H3l6.1-6L3 6Z"/></svg>`,
  threads:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2a10 10 0 1 0 .1 20A10 10 0 0 0 12 2Zm4.7 9.6c-.4-2.8-2.3-4.4-4.9-4.4-2.6 0-4.9 1.6-4.9 4.3h3c0-1 .8-1.6 1.9-1.6s1.9.7 1.9 1.9c0 .9-.6 1.6-2 1.6h-1v2.4h1c2.1 0 3.7-1.2 4.1-3.2h1.8Z"/></svg>`,
  instagram:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm6.2-.4a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"/><circle cx="12" cy="12" r="3" fill="#fff" opacity=".15"/></svg>`,
  tiktok:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M14.5 3h3c.2 2 1.8 3.7 3.7 3.9v3.1c-1.5 0-3-.5-4.2-1.4v6.9c0 3-2.4 5.5-5.5 5.5S6 18.5 6 15.5s2.4-5.5 5.5-5.5c.3 0 .7 0 1 .1V14a2.5 2.5 0 1 1-3 2.4V12a5.5 5.5 0 0 1 5-5V3Z"/></svg>`,
  youtube:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M23 12c0 0 0-4-1-5a4 4 0 0 0-3-1C16 6 12 6 12 6s-4 0-7 0a4 4 0 0 0-3 1c-1 1-1 5-1 5s0 4 1 5a4 4 0 0 0 3 1c3 0 7 0 7 0s4 0 7 0a4 4 0 0 0 3-1c1-1 1-5 1-5Zm-13 3V9l5 3-5 3Z"/></svg>`,
  twitch:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 3h16v10l-4 4h-4l-2 2H8v-2H4V3Zm3 2v9h10l2-2V5H7Zm8 2h2v4h-2V7Zm-4 0h2v4h-2V7Z"/></svg>`,
  discord:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 4a16 16 0 0 0-4-1l-.2.4c1.2.3 2.2.8 3.2 1.5a13 13 0 0 0-4.8-1l-.6.7a13 13 0 0 0-4.8 1 8 8 0 0 1 3.2-1.5L7.9 3A16 16 0 0 0 4 4C1.6 7.3 1 10.4 1.1 13.5a12 12 0 0 0 7.9 3.6l1-1.3a8.7 8.7 0 0 1-2.6-1 2.9 2.9 0 0 0 1.4 0c2 .7 4 .7 6 0l.5.1c-.8.6-1.7 1-2.6 1l1 1.3A12 12 0 0 0 23 13.5C23 10.4 22.4 7.3 20 4ZM9 12.6c-.7 0-1.3-.7-1.3-1.6S8.3 9.4 9 9.4s1.3.7 1.3 1.6S9.7 12.6 9 12.6Zm6 0c-.7 0-1.3-.7-1.3-1.6s.6-1.6 1.3-1.6 1.3.7 1.3 1.6-.6 1.6-1.3 1.6Z"/></svg>`,
  whatsapp:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 3.6A10 10 0 0 0 4 17.4L3 22l4.8-1A10 10 0 1 0 20 3.6Zm-8 16.5a8.4 8.4 0 1 1 0-16.8 8.4 8.4 0 0 1 0 16.8Zm4-6.2c-.1-.1-1.3-.7-1.5-.8-.2-.1-.4-.1-.6.1l-.4.5c-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-3-2.7c-.2-.4 0-.5.1-.6l.4-.4c.1-.2.2-.3.1-.6a9.5 9.5 0 0 0-.8-1.5c-.2-.3-.5-.3-.7-.3h-.6c-.2 0-.6.1-.9.5-.4.4-1 1-1 2.4s1 2.8 1.2 3.1a7.6 7.6 0 0 0 2.9 2.9c.4.2 1.8.6 2.4.4s1.6-.8 1.8-1.5c.2-.7.2-1.2.1-1.4Z"/></svg>`,
  telegram:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M21.9 4.7 19 20.5c-.2 1-1 1.3-1.8.8l-5-3.7-2.4 2.3c-.3.3-.6.5-1 .5l.4-5.2 9.5-8.6c.4-.3-.1-.6-.6-.2l-11.7 7.4-5-1.6c-1-.3-1-.9.2-1.3L20.5 3.4c.9-.3 1.6.2 1.4 1.3Z"/></svg>`,
  snapchat:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 3c3 0 5.1 2.3 5.1 5.3 0 1.3-.3 1.9-.3 2.8 0 1.5.9 2.1 2.2 2.6-.5.9-2 1.1-2.7 1.2-.8.1-.7.6-.5 1 .2.4 1.2.8 2 .9-.5.8-3 1.1-4 .9-.6-.1-1.3.4-1.8.7-.4.2-.8.5-1 .5s-.6-.3-1-.5c-.5-.3-1.1-.8-1.8-.7-1 .2-3.5-.1-4-.9.8-.1 1.8-.5 2-.9.2-.4.3-.9-.5-1-1-.1-2.2-.3-2.7-1.2 1.3-.5 2.2-1.1 2.2-2.6 0-.9-.3-1.5-.3-2.8C6.9 5.3 9 3 12 3Z"/></svg>`,
  pinterest:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.6 19.3c-.1-1-.2-2.6 0-3.7l1.5-6.4s-.4-.8-.4-2c0-1.8 1-3.1 2.2-3.1 1 0 1.6.8 1.6 1.7 0 1-.6 2.4-1 3.7-.3 1.1.6 2 1.8 2 2.2 0 3.9-2.3 3.9-5.6 0-2.9-2.1-4.9-5.1-4.9-3.5 0-5.5 2.6-5.5 5.3 0 1 .4 2 1 2.6.1.1.1.2.1.3l-.4 1.6c-.1.2-.2.3-.5.2-1.4-.6-2.3-2.5-2.3-4 0-3.3 2.4-6.4 7-6.4 3.7 0 6.6 2.7 6.6 6.2 0 3.7-2.3 6.7-5.6 6.7-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2.8-.8 1.7-1.2 2.2.9.3 1.8.5 2.8.5a10 10 0 0 0 0-20Z"/></svg>`,
  dribbble:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2a10 10 0 1 0 .1 20A10 10 0 0 0 12 2Zm6.5 8.2a8.2 8.2 0 0 1-3.8-.3c.2-.6.3-1.2.4-1.8a8.3 8.3 0 0 1 3.4 2.1ZM15 6.1c-.1.7-.3 1.5-.6 2.2a27.3 27.3 0 0 1-2.7-4.4 8.3 8.3 0 0 1 3.3 2.2ZM9.3 4.4a26.2 26.2 0 0 0 3 4.7c-1.6.4-3.5.6-5.6.4a8.3 8.3 0 0 1 2.6-5.1ZM4.2 12v-.3c2.7.2 5.1 0 7.1-.5l.7 1.2c-2 .6-3.9 1.7-5.6 3.3a8.3 8.3 0 0 1-2.2-3.7Zm3.7 5.1c1.6-1.5 3.4-2.5 5.2-3l1.4 2.4a8.3 8.3 0 0 1-6.6.6Zm8.6-.8-1.8-3a12 12 0 0 0 3.8-.1 8.3 8.3 0 0 1-2 3.1Z"/></svg>`,
  behance:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 7h4.8c1.8 0 3 .9 3 2.4 0 1-.6 1.7-1.5 2v.1C11.5 12 12 13 12 14c0 1.8-1.6 3-4 3H4V7Zm3.8 3.6c.9 0 1.4-.4 1.4-1s-.5-.9-1.4-.9H6.9v1.9h.9Zm.3 4c1 0 1.6-.4 1.6-1.1s-.6-1.1-1.6-1.1H6.9v2.2h1.2ZM21 10.8c0 3-1.8 4.6-4.3 4.6-2.4 0-4.2-1.7-4.2-4.3 0-2.6 1.8-4.4 4.3-4.4 1.9 0 3 .8 3.7 2l-2 .9c-.3-.7-.9-1-1.7-1-1.2 0-2 1-2 2.3h5.9c0 .3.1.6.1.9ZM16.7 14c1.1 0 1.7-.7 1.9-1.7h-3.9c.1 1 .8 1.7 2 1.7ZM14.5 6H19v1.2h-4.5V6Z"/></svg>`,
  medium:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 7.5c0-.3 0-.6-.3-.8L2 4.7V4h6l4.6 10.1L16.6 4H23v.7l-1.4 1.3c-.1.1-.1.2-.1.4v11.4c0 .2 0 .3.1.4l1.3 1.3V20h-7.4v-.7l1.4-1.4c.1-.1.1-.2.1-.4V8.7l-3.8 11.3h-1L7.1 8.7v7.7c0 .3 0 .6.2.8l1.8 2.2V20H2v-.7L3.8 17c.2-.2.2-.5.2-.8V7.5Z"/></svg>`,
  reddit:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M21 10.1c-.7 0-1.3.2-1.8.7a10 10 0 0 0-5.3-1.5l.9-4.1 2.9.6a1.8 1.8 0 1 0 .2-1l-3.4-.8a.7.7 0 0 0-.8.5l-1.1 4.9a10 10 0 0 0-5.5 1.5 2.6 2.6 0 1 0-3 4 6.9 6.9 0 0 0 2.1 2.9c1.6 1.1 3.6 1.7 5.7 1.7s4.1-.6 5.7-1.7a6.9 6.9 0 0 0 2.1-2.9 2.6 2.6 0 1 0 1.2-4.8ZM9 13a1.6 1.6 0 1 1 0-3.3A1.6 1.6 0 0 1 9 13Zm6 4.1c-1 .7-2.3 1-3.6 1s-2.6-.3-3.6-1a.6.6 0 0 1 .7-1c.8.6 2 .8 2.9.8s2.1-.2 2.9-.8a.6.6 0 1 1 .7 1Zm.1-2.4a1.6 1.6 0 1 1 0-3.3 1.6 1.6 0 0 1 0 3.3Z"/></svg>`,
  stackoverflow:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17 21H5v-7h2v5h8v2Zm-7-3h6v-2H10v2Zm6.5-3.3.4-1.9-6-1.3-.4 2 6 1.2Zm1.2-3.6.8-1.7-5.5-2.6-.9 1.9 5.6 2.4Zm2-3.7 1-1.5-4.7-3.2-1.1 1.7 4.8 3Z"/></svg>`,
  codepen:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="m12 2 10 6v8l-10 6L2 16V8l10-6Zm-7.4 9.4L5 12l-1.4.6v-1.2ZM12 4.3 4.8 8.7 12 13l7.2-4.3L12 4.3ZM18.9 12l1.4-.6v1.2L18.9 12ZM4.8 15.3 12 19.7l7.2-4.4L12 11l-7.2 4.3Z"/></svg>`,
  devto:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7.8 8.4H6.1v7.1h1.7c1.2 0 1.8-.6 1.8-2.1V10.5c0-1.4-.6-2.1-1.8-2.1Zm-.4 6h-.4v-5h.4c.6 0 .9.3.9 1v3c0 .7-.3 1-.9 1ZM13.8 8.4h-2v7.1h2c.8 0 1.3-.4 1.3-1.4V9.8c0-1-.5-1.4-1.3-1.4Zm-.2 6h-.6V9.8h.6c.3 0 .5.1.5.6V14c0 .4-.2.6-.5.6ZM18.2 8.4H16v7.1h2.2V14h-1v-1.3h1V11h-1v-1.3h1V8.4Z"/></svg>`,
  kaggle:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4.5 4h3v7.1L15 4h3.6l-6.9 7.2L19 20h-3.6l-5-6-2 2v4h-3V4Z"/></svg>`,
  spotify:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2a10 10 0 1 0 .1 20A10 10 0 0 0 12 2Zm4.6 14.8a.9.9 0 0 1-1.2.3c-3.2-2-7.2-2-10.2-.6a.9.9 0 1 1-.8-1.6c3.6-1.6 8.2-1.6 11.9.7.5.2.6.8.3 1.2Zm1.6-3.2c-.2.3-.7.4-1 .2-3.8-2.3-9.7-2.4-13.3-.7a.8.8 0 0 1-.7-1.4c4.2-2 10.7-1.9 15 1 .3.2.4.6 0 .9Zm.1-3.4c-4.4-2.6-11.7-2.9-15.9-.8a.8.8 0 1 1-.7-1.5c4.8-2.2 12.9-1.8 18 1.1a.8.8 0 0 1-.8 1.3Z"/></svg>`,
  applemusic:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M16 3v10.7a3.2 3.2 0 1 1-1.5-2.7V7.4l-6 1.3v7.7A3.2 3.2 0 1 1 7 13.7V6.2L16 4V3Z"/></svg>`,
  soundcloud:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M13.3 7.3a5.8 5.8 0 0 1 5.6 4 3.7 3.7 0 1 1 1 7.3H9.3a3.8 3.8 0 0 1 .4-7.6c.4 0 .8.1 1.2.2a5.8 5.8 0 0 1 2.4-3.9Z"/></svg>`,
  steam:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M22 12a10 10 0 1 1-19.4 3.3l4.3 1.8a3.7 3.7 0 0 0 6.8-.6l3.5-1.5a4.7 4.7 0 1 0-2-9 4.8 4.8 0 0 0-4.3 2.6l-2.9 5.9-3.5-1.5A10 10 0 0 1 22 12Zm-4.7-6.8a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/></svg>`,
  itch:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 7c0-1.7 1.3-3 3-3h12c1.7 0 3 1.3 3 3v10l-4 2H7l-4-2V7Zm5 1h8v8H8V8Z"/></svg>`,
  patreon:`<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="15" cy="9" r="5" fill="currentColor"/><rect x="4" y="4" width="3" height="16" fill="currentColor"/></svg>`,
  buymeacoffee:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 3h12l1 6H5l1-6Zm-1 8h14l-1 8H6l-1-8Zm3-5h8l.3 2H7.7L8 6Z"/></svg>`,
  paypal:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 20H3l2-13h6c4.5 0 6.3 2 5.7 5.2-.6 3.2-3.2 4.8-7.7 4.8H7l-.7 3Zm3.2-5.4h1.7c2.3 0 4-.8 4.4-2.8s-.8-2.8-3.2-2.8H8.5l.7 5.6Z"/></svg>`,
  calendly:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 2h2v2h4V2h2v2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm10 8H6v8h12v-8Z"/></svg>`,
  custom:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2 3 6v6c0 4.6 3.2 8.8 9 10 5.8-1.2 9-5.4 9-10V6l-9-4Zm0 3.2 6 2.7v3.3c0 3.2-2.2 6.2-6 7.3-3.8-1.1-6-4.1-6-7.3V7l6-2.8Z"/></svg>`,
};

/* ---------- Helpers ---------- */
const $  = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
const getJSON=(k,f)=>{try{const v=localStorage.getItem(k); return v?JSON.parse(v):f;}catch{return f;}};
const setJSON=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const copy=(t)=>navigator.clipboard?.writeText(t);
const hexUp = (v)=>String(v||"").toUpperCase();

/* ---------- State ---------- */
const state = {
  links:   getJSON(K.links, []),          // mezcla de preset y custom (platform:"custom")
  profile: getJSON(K.profile, {...DEFAULT_PROFILE}),
  skin:    getJSON(K.skin,   {...DEFAULT_SKIN}),
  theme:   getJSON(K.theme,  "light"),
  zoom:    1
};

/* ---------- Theme ---------- */
function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  $("#themeToggle")?.setAttribute("aria-pressed", t==="dark" ? "true":"false");
}
function initTheme(){
  if(!state.theme){
    state.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light";
  }
  applyTheme(state.theme);
}
/* Elevación topbar */
(function(){
  const tb = $("#topbar");
  const setElev = ()=> tb?.classList.toggle("elevated", window.scrollY > 6);
  window.addEventListener("scroll", setElev, {passive:true});
  setElev();
})();

/* ---------- Toasts ---------- */
function showToast(msg, type="info", life=2800){
  const wrap = $("#toasts");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.style.setProperty("--life", life+"ms");
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(()=>{ el.remove(); }, life + 700);
}

/* ---------- Skin → CSS Vars ---------- */
function applySkin(){
  const el = $("#previewCard"), s = state.skin;
  const fonts = {
    system:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Arial, sans-serif',
    inter:'"Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    poppins:'"Poppins", ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    merriweather:'"Merriweather", Georgia, "Times New Roman", serif',
    robotomono:'"Roboto Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    nunito:'"Nunito", ui-sans-serif, system-ui',
    lato:'"Lato", ui-sans-serif, system-ui',
    opensans:'"Open Sans", ui-sans-serif, system-ui',
    montserrat:'"Montserrat", ui-sans-serif, system-ui',
    playfair:'"Playfair Display", Georgia, serif',
    worksans:'"Work Sans", ui-sans-serif, system-ui',
    dmsans:'"DM Sans", ui-sans-serif, system-ui',
    sourcesans:'"Source Sans 3", ui-sans-serif, system-ui',
    ibmplex:'"IBM Plex Sans", ui-sans-serif, system-ui',
    spacegrotesk:'"Space Grotesk", ui-sans-serif, system-ui',
    outfit:'"Outfit", ui-sans-serif, system-ui',
    firacode:'"Fira Code", SFMono-Regular, Menlo, Consolas, monospace',
    jetbrains:'"JetBrains Mono", SFMono-Regular, Menlo, Consolas, monospace'
  };
  const pct = Math.max(0, Math.min(100, Number(s.shadowPct)||0));
  const blur = 10 + Math.round(pct*0.5);
  const alpha = 0.08 + pct/100*0.18;
  const shadow = `0 18px ${blur}px rgba(15,23,42,${alpha.toFixed(2)})`;

  el.style.setProperty('--card-font', fonts[s.font]||fonts.system);
  el.style.setProperty('--card-surface', s.surface);
  el.style.setProperty('--card-text', s.text);
  el.style.setProperty('--card-muted', s.muted);
  el.style.setProperty('--card-ring', s.ring);
  el.style.setProperty('--card-bar-start', s.barStart);
  el.style.setProperty('--card-bar-end', s.barEnd);
  el.style.setProperty('--card-radius', s.radius+'px');
  el.style.setProperty('--card-shadow', shadow);

  el.dataset.avatarShape = s.avatarShape || "circle";
  el.dataset.avatarRing  = s.avatarRing  || "ring";
  el.dataset.linkShape   = s.linkShape   || "pill";

  // Mirror full preview
  const full = $("#previewCardFull");
  if(full){
    full.style.setProperty('--card-font', getComputedStyle(el).getPropertyValue('--card-font'));
    full.style.setProperty('--card-surface', s.surface);
    full.style.setProperty('--card-text', s.text);
    full.style.setProperty('--card-muted', s.muted);
    full.style.setProperty('--card-ring', s.ring);
    full.style.setProperty('--card-bar-start', s.barStart);
    full.style.setProperty('--card-bar-end', s.barEnd);
    full.style.setProperty('--card-radius', s.radius+'px');
    full.dataset.avatarShape = s.avatarShape;
    full.dataset.avatarRing  = s.avatarRing;
    full.dataset.linkShape   = s.linkShape;
  }

  applyFontPreview();
  updateColorSwatchUI();
}

/* ---------- Vista previa (incluye íconos) ---------- */
function iconHTML(item){
  if(item.platform === "custom" && item.icon){
    return `<img alt="" src="${item.icon}" style="width:18px;height:18px;object-fit:contain;filter:brightness(1) saturate(1)" />`;
  }
  const svg = ICONS[item.platform] || ICONS.website;
  return svg;
}

function buildLinks(container){
  container.innerHTML = "";
  state.links.forEach(item=>{
    if(!item.url) return;
    const p = PLATFORMS.find(x=>x.key===item.platform) || {className:"website", label:"Link"};
    const a=document.createElement("a");
    a.className=`btn-link ${p.className}`;
    a.href=item.url; a.target="_blank"; a.rel="noopener";

    // Color de fondo para custom
    if(item.platform==="custom" && item.bg){
      a.style.background = item.bg;
    }

    const label = (item.platform==="custom" && item.name) ? item.name : p.label;
    a.innerHTML=`
      <span class="left" style="display:flex;align-items:center;gap:10px">
        <span class="icon" aria-hidden="true" style="display:grid;place-items:center">${iconHTML(item)}</span>
        <span class="label">${label}</span>
      </span>
      <span class="chev">→</span>
    `;
    container.appendChild(a);
  });
}
function renderPreview(){
  $("#name").textContent  = state.profile.name || DEFAULT_PROFILE.name;
  $("#email").textContent = state.profile.email || DEFAULT_PROFILE.email;
  $("#email").href = `mailto:${state.profile.email || DEFAULT_PROFILE.email}`;
  $("#avatarTxt").textContent = (state.profile.initials || "BR").slice(0,3).toUpperCase();

  const img = $("#avatarImg");
  const wrap = $("#avatar");
  if (state.profile.avatar) { img.src = state.profile.avatar; wrap.classList.add("has-image"); }
  else { img.removeAttribute("src"); wrap.classList.remove("has-image"); }

  buildLinks($("#linksList"));

  // full preview mirrors
  $("#nameFull").textContent = $("#name").textContent;
  $("#emailFull").textContent = $("#email").textContent;
  $("#emailFull").href = $("#email").href;
  $("#avatarTxtFull").textContent = $("#avatarTxt").textContent;
  const imgFull = $("#avatarImgFull");
  if (state.profile.avatar) { imgFull.src = state.profile.avatar; $("#previewCardFull .avatar").classList.add("has-image"); }
  else { imgFull.removeAttribute("src"); $("#previewCardFull .avatar").classList.remove("has-image"); }
  buildLinks($("#linksListFull"));
}

/* ---------- Forms (Links) con sección Custom ---------- */
function ensureLinksSections(){
  const root = $("#linksFormList");
  if(!root.dataset.enhanced){
    // Creamos contenedores para "Presets" y "Custom"
    const presetBox = document.createElement("div");
    presetBox.id = "linksPresetBox";
    const presetHead = document.createElement("div");
    presetHead.className = "link-item-head";
    presetHead.innerHTML = `<span style="font-weight:900">Preset Links</span>
      <div class="row-inline" id="presetActions"></div>`;
    const presetList = document.createElement("div");
    presetList.className="form-list"; presetList.id="presetList";
    presetBox.appendChild(presetHead); presetBox.appendChild(presetList);

    const customBox = document.createElement("div");
    customBox.id = "linksCustomBox"; customBox.style.marginTop="14px";
    const customHead = document.createElement("div");
    customHead.className = "link-item-head";
    customHead.innerHTML = `<span style="font-weight:900">Custom Links</span>
      <div class="row-inline" id="customActions"></div>`;
    const customList = document.createElement("div");
    customList.className="form-list"; customList.id="customList";
    customBox.appendChild(customHead); customBox.appendChild(customList);

    root.innerHTML = "";
    root.appendChild(presetBox);
    root.appendChild(customBox);

    // Botones
    const presetAdd = document.createElement("button");
    presetAdd.className="btn"; presetAdd.type="button"; presetAdd.textContent="Add new link";
    presetAdd.addEventListener("click", ()=> {
      state.links.push({platform:"website", url:""});
      renderForm(); renderPreview();
    });
    $("#presetActions").appendChild(presetAdd);

    const customAdd = document.createElement("button");
    customAdd.className="btn"; customAdd.type="button"; customAdd.textContent="Add custom link";
    customAdd.addEventListener("click", ()=>{
      state.links.push({platform:"custom", name:"Custom", url:"", bg:"#111827", icon:null});
      renderForm(); renderPreview();
    });
    $("#customActions").appendChild(customAdd);

    root.dataset.enhanced = "1";
  }
}

function renderForm(){
  ensureLinksSections();
  const preset = $("#presetList"); const custom = $("#customList");
  preset.innerHTML = ""; custom.innerHTML = "";

  state.links.forEach((item,idx)=>{
    const isCustom = item.platform==="custom";
    const box=document.createElement("div");
    box.className="link-item"; box.dataset.index=idx;

    if(!isCustom){
      box.innerHTML=`<div class="link-item-head">
        <span>#${idx+1} — ${PLATFORMS.find(p=>p.key===item.platform)?.label || "Link"}</span>
        <button type="button" class="remove-btn">Remove</button>
      </div>
      <div class="row">
        <label class="field">
          <span class="field-label">Platform</span>
          <select class="sel-platform">
            ${PLATFORMS.filter(p=>p.key!=="custom").map(p=>`<option value="${p.key}" ${p.key===item.platform?'selected':''}>${p.label}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span class="field-label">URL</span>
          <input type="url" class="inp-url" placeholder="https://..." value="${item.url||''}">
        </label>
      </div>`;
      preset.appendChild(box);
    }else{
      box.innerHTML=`<div class="link-item-head">
        <span>#${idx+1} — Custom</span>
        <button type="button" class="remove-btn">Remove</button>
      </div>
      <div class="row" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px">
        <label class="field">
          <span class="field-label">Display name</span>
          <input type="text" class="inp-name" placeholder="My Link" value="${item.name||''}">
        </label>
        <label class="field">
          <span class="field-label">URL</span>
          <input type="url" class="inp-url" placeholder="https://..." value="${item.url||''}">
        </label>
        <label class="field">
          <span class="field-label">Background color</span>
          <input type="color" class="inp-bg" value="${item.bg||'#111827'}">
        </label>
        <label class="field">
          <span class="field-label">Icon (upload)</span>
          <input type="file" class="inp-icon" accept="image/*">
        </label>
      </div>`;
      custom.appendChild(box);
    }
  });
}

/* ---------- Photo Cropper (perfil) ---------- */
const crop = { img:null, natural:{w:0,h:0}, baseFit:1, scale:1, rotate:0, tx:0, ty:0, dragging:false, start:{x:0,y:0}, stageSize:320, minCoverScale:1 };
function computeMinCoverScale(){
  const L=crop.stageSize, w0=crop.natural.w*crop.baseFit, h0=crop.natural.h*crop.baseFit;
  const rad=Math.abs(crop.rotate)*Math.PI/180, c=Math.abs(Math.cos(rad)), s=Math.abs(Math.sin(rad));
  const wRot=w0*c+h0*s, hRot=w0*s+h0*c; crop.minCoverScale=Math.max(L/wRot, L/hRot, 1);
}
function clampPan(){
  const L=crop.stageSize, w0=crop.natural.w*crop.baseFit*crop.scale, h0=crop.natural.h*crop.baseFit*crop.scale;
  const rad=Math.abs(crop.rotate)*Math.PI/180, c=Math.abs(Math.cos(rad)), s=Math.abs(Math.sin(rad));
  const halfW=(w0*c+h0*s)/2, halfH=(w0*s+h0*c)/2;
  const maxTx=Math.max(0, halfW-L/2), maxTy=Math.max(0, halfH-L/2);
  crop.tx=Math.max(-maxTx, Math.min(maxTx, crop.tx));
  crop.ty=Math.max(-maxTy, Math.min(maxTy, crop.ty));
}
function openCropper(src){
  const modal=$("#photoModal"), stage=$("#cropStage"), img=$("#cropImg");
  modal.classList.remove("hidden"); modal.setAttribute("aria-hidden","false");
  crop.img=new Image();
  crop.img.onload=()=>{
    crop.natural.w=crop.img.naturalWidth; crop.natural.h=crop.img.naturalHeight;
    const r=stage.getBoundingClientRect(); crop.stageSize=Math.min(r.width,r.height);
    crop.baseFit=crop.stageSize/Math.min(crop.natural.w,crop.natural.h);
    crop.scale=1; crop.rotate=0; crop.tx=0; crop.ty=0;
    img.src=src; img.style.width=(crop.natural.w*crop.baseFit)+"px"; img.style.height=(crop.natural.h*crop.baseFit)+"px"; img.style.left="50%"; img.style.top="50%";
    computeMinCoverScale(); crop.scale=Math.max(crop.scale,crop.minCoverScale);
    $("#zoomRange").value=Number(crop.scale.toFixed(2)); $("#rotateRange").value=0;
    clampPan(); applyCropTransform();
  };
  crop.img.src=src;
}
function applyCropTransform(){
  $("#cropImg").style.transform=`translate(calc(-50% + ${crop.tx}px), calc(-50% + ${crop.ty}px)) rotate(${crop.rotate}deg) scale(${crop.scale})`;
}
function exportCropped(size=512){
  const canvas=document.createElement("canvas"); canvas.width=canvas.height=size;
  const ctx=canvas.getContext("2d"); ctx.clearRect(0,0,size,size); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality="high";
  const ratio=size/crop.stageSize;
  ctx.translate(size/2 + crop.tx*ratio, size/2 + crop.ty*ratio);
  ctx.rotate(crop.rotate*Math.PI/180);
  const totalScale=crop.baseFit*crop.scale*ratio; ctx.scale(totalScale,totalScale);
  ctx.drawImage(crop.img, -crop.natural.w/2, -crop.natural.h/2);
  return canvas.toDataURL("image/png");
}

/* ---------- Font preview en el <select> ---------- */
function applyFontPreview(){
  const select = $("#fontSelect");
  if(!select) return;
  const map = {
    system:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Arial, sans-serif',
    inter:'"Inter"', poppins:'"Poppins"', merriweather:'"Merriweather", Georgia, serif',
    robotomono:'"Roboto Mono", monospace', nunito:'"Nunito"', lato:'"Lato"',
    opensans:'"Open Sans"', montserrat:'"Montserrat"', playfair:'"Playfair Display", Georgia, serif',
    worksans:'"Work Sans"', dmsans:'"DM Sans"', sourcesans:'"Source Sans 3"',
    ibmplex:'"IBM Plex Sans"', spacegrotesk:'"Space Grotesk"', outfit:'"Outfit"',
    firacode:'"Fira Code", monospace', jetbrains:'"JetBrains Mono", monospace'
  };
  select.style.fontFamily = map[state.skin.font] || map.system;
  Array.from(select.options).forEach(opt=>{ opt.style.fontFamily = map[opt.value] || map.system; });
}

/* ---------- Avatar shape picker ---------- */
function renderShapePicker(){
  const host=$("#avatarShapePicker"); if(!host) return;
  host.innerHTML="";
  ["circle","rounded","squircle","hex","diamond"].forEach(shape=>{
    const btn=document.createElement("button");
    btn.type="button"; btn.className="shape-opt"; btn.dataset.shape=shape; btn.title=shape;
    btn.innerHTML=`<div class="mini"></div><div style="font-size:11px;margin-top:6px;text-transform:capitalize;color:var(--muted);text-align:center">${shape}</div>`;
    if(state.skin.avatarShape===shape) btn.classList.add("active");
    btn.addEventListener("click", ()=>{
      $$(".shape-opt", host).forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      state.skin.avatarShape = shape;
      $("#previewCard").dataset.avatarShape = shape;
      $("#previewCardFull").dataset.avatarShape = shape;
    });
    host.appendChild(btn);
  });
}

/* ---------- Color Swatches ---------- */
const COLOR_FIELDS = [
  { key:"barStart", label:"Topbar start" },
  { key:"barEnd",   label:"Topbar end" },
  { key:"surface",  label:"Surface" },
  { key:"text",     label:"Text" },
  { key:"muted",    label:"Muted" },
  { key:"ring",     label:"Ring" },
];

function renderColorSwatches(){
  const grid = $("#colorSwatchGrid"); if(!grid) return;
  grid.innerHTML = "";

  const grad = document.createElement("div");
  grad.className = "color-field";
  grad.innerHTML = `
    <div class="swatch" data-key="barPreview" style="--card-bar-start:${state.skin.barStart};--card-bar-end:${state.skin.barEnd}"></div>
    <div class="meta">
      <div class="label">Topbar (preview)</div>
      <div class="value">Start ${hexUp(state.skin.barStart)} → End ${hexUp(state.skin.barEnd)}</div>
    </div>`;
  grid.appendChild(grad);

  COLOR_FIELDS.forEach(({key,label})=>{
    const field = document.createElement("div");
    field.className = "color-field";
    field.innerHTML = `
      <button type="button" class="swatch" data-key="${key}" aria-label="Pick ${label}" title="${label}"></button>
      <div class="meta">
        <div class="label">${label}</div>
        <div class="value" id="val-${key}"></div>
      </div>
      <input type="color" class="hidden-color" id="picker-${key}" style="position:absolute;opacity:0;pointer-events:none;width:0;height:0" />
    `;
    grid.appendChild(field);
  });

  updateColorSwatchUI();

  COLOR_FIELDS.forEach(({key})=>{
    const sw = $(`.swatch[data-key="${key}"]`);
    const inp = $(`#picker-${key}`);
    sw.addEventListener("click", ()=>{
      inp.value = state.skin[key];
      inp.click();
      $$(".swatch").forEach(x=>x.classList.remove("selected"));
      sw.classList.add("selected");
    });
    inp.addEventListener("input", (e)=>{
      state.skin[key] = e.target.value;
      applySkin();
    });
  });
}
function updateColorSwatchUI(){
  COLOR_FIELDS.forEach(({key})=>{
    const v = state.skin[key];
    const sw = $(`.swatch[data-key="${key}"]`);
    const lab = $(`#val-${key}`);
    if(sw) sw.style.background = v;
    if(lab) lab.textContent = hexUp(v);
  });
  const grad = $(`.swatch[data-key="barPreview"]`);
  const gradMeta = grad?.parentElement?.querySelector(".value");
  if(grad){
    grad.style.setProperty("--card-bar-start", state.skin.barStart);
    grad.style.setProperty("--card-bar-end", state.skin.barEnd);
  }
  if(gradMeta){
    gradMeta.textContent = `Start ${hexUp(state.skin.barStart)} → End ${hexUp(state.skin.barEnd)}`;
  }
}

/* ---------- Publish ---------- */
function buildPublishLink(){
  const snapshot = { profile: state.profile, links: state.links, skin: state.skin };
  const json = JSON.stringify(snapshot);
  const data = encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  const url = `${location.origin}${location.pathname.replace(/[^/]+$/, '')}viewer.html?data=${data}`;
  return url;
}

/* ---------- Wiring ---------- */
function wire(){
  // Tabs
  $$(".tab").forEach(t=>{
    t.addEventListener("click",e=>{
      e.preventDefault();
      $$(".tab").forEach(x=>x.classList.remove("active"));
      t.classList.add("active");
      $("#linksEditor").style.display="none";
      $("#profileDetails").classList.add("hidden");
      $("#appearance").classList.add("hidden");
      $("#publish").classList.add("hidden");
      const tab=t.dataset.tab;
      if(tab==="links") $("#linksEditor").style.display="";
      if(tab==="profile") $("#profileDetails").classList.remove("hidden");
      if(tab==="appearance") $("#appearance").classList.remove("hidden");
      if(tab==="publish") $("#publish").classList.remove("hidden");
    });
  });

  // Full preview
  $("#openFullPreview").addEventListener("click", ()=>{
    const panel = $("#fullPreview");
    panel.classList.remove("hidden","closing");
    renderPreview();
    requestAnimationFrame(()=>panel.classList.add("open"));
  });
  $("#closeFullPreview").addEventListener("click", ()=>{
    const panel = $("#fullPreview");
    panel.classList.remove("open"); panel.classList.add("closing");
    setTimeout(()=>panel.classList.add("hidden"), 600);
  });

  // Theme toggle
  $("#themeToggle").addEventListener("click", ()=>{
    state.theme = (state.theme==="dark") ? "light" : "dark";
    applyTheme(state.theme);
  });

  // Form events (delegación global)
  const container = $("#linksFormList");
  container.addEventListener("click", e=>{
    const rm=e.target.closest(".remove-btn"); if(!rm) return;
    const box=e.target.closest(".link-item"); if(!box) return;
    const idx=Number(box.dataset.index);
    state.links.splice(idx,1);
    renderForm(); renderPreview();
  });

  container.addEventListener("input", e=>{
    const box=e.target.closest(".link-item"); if(!box) return;
    const idx=Number(box.dataset.index);
    const item = state.links[idx] || {};

    if(e.target.classList.contains("sel-platform")){
      item.platform = e.target.value;
      // reset campos si cambió a custom/preset
      if(item.platform==="custom"){
        Object.assign(item, { name:item.name||"Custom", bg:item.bg||"#111827", icon:item.icon||null });
      }else{
        delete item.name; delete item.bg; delete item.icon;
      }
    }
    if(e.target.classList.contains("inp-url")) item.url = e.target.value.trim();
    if(e.target.classList.contains("inp-name")) item.name = e.target.value;
    if(e.target.classList.contains("inp-bg"))   item.bg   = e.target.value;

    state.links[idx]=item;
    renderPreview();
  });

  container.addEventListener("change", e=>{
    if(!e.target.classList.contains("inp-icon")) return;
    const box=e.target.closest(".link-item"); const idx=Number(box.dataset.index);
    const file = e.target.files && e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.links[idx].icon = reader.result;
      renderPreview();
      showToast("Custom icon updated","success");
    };
    reader.readAsDataURL(file);
  });

  // Reset template
  $("#resetTemplateBtn").addEventListener("click", ()=>{
    state.links = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_LINKS));
    state.skin  = {...DEFAULT_SKIN};
    renderForm(); renderPreview(); applySkin(); renderShapePicker(); renderColorSwatches();
    $("#cardSizeRange").value = state.zoom = 1;
    $("#cardZoomWrap").style.setProperty('--card-scale', state.zoom);
    showToast("Default template loaded", "info");
  });

  // Profile inputs
  $("#inpName").addEventListener("input", e=>{ state.profile.name=e.target.value; renderPreview(); });
  $("#inpEmail").addEventListener("input", e=>{ state.profile.email=e.target.value; renderPreview(); });
  $("#inpInitials").addEventListener("input", e=>{ state.profile.initials=e.target.value.toUpperCase(); renderPreview(); });

  // Photo upload/edit
  $("#inpAvatarFile").addEventListener("change", (e)=>{
    const file = e.target.files && e.target.files[0]; if(!file) return;
    const reader = new FileReader(); reader.onload = () => { openCropper(reader.result); }; reader.readAsDataURL(file);
  });
  $("#btnEditPhoto").addEventListener("click", ()=>{
    const src = state.profile.avatar; if(!src){ showToast("Upload a photo first", "error"); return; }
    openCropper(src);
  });
  $("#btnClearPhoto").addEventListener("click", ()=>{
    state.profile.avatar = null; $("#inpAvatarFile").value = ""; renderPreview();
  });

  // Cropper controls
  const stage=$("#cropStage");
  stage.addEventListener("pointerdown", (e)=>{ crop.dragging=true; crop.start.x=e.clientX; crop.start.y=e.clientY; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener("pointermove", (e)=>{ if(!crop.dragging) return; crop.tx += (e.clientX-crop.start.x); crop.ty += (e.clientY-crop.start.y); crop.start.x=e.clientX; crop.start.y=e.clientY; clampPan(); applyCropTransform(); });
  stage.addEventListener("pointerup", (e)=>{ crop.dragging=false; stage.releasePointerCapture?.(e.pointerId); });
  stage.addEventListener("pointercancel", ()=>{ crop.dragging=false; });
  stage.addEventListener("wheel", (e)=>{ e.preventDefault(); const d=e.deltaY>0?-0.06:0.06; crop.scale=Math.min(3, Math.max(0.5, crop.scale + d)); computeMinCoverScale(); if(crop.scale<crop.minCoverScale) crop.scale=crop.minCoverScale; $("#zoomRange").value=Number(crop.scale.toFixed(2)); clampPan(); applyCropTransform(); }, {passive:false});
  $("#zoomRange").addEventListener("input", e=>{ crop.scale=Number(e.target.value); computeMinCoverScale(); if(crop.scale<crop.minCoverScale){ crop.scale=crop.minCoverScale; e.target.value=crop.scale.toFixed(2);} clampPan(); applyCropTransform(); });
  $("#rotateRange").addEventListener("input", e=>{ crop.rotate=Number(e.target.value); computeMinCoverScale(); if(crop.scale<crop.minCoverScale){ crop.scale=crop.minCoverScale; $("#zoomRange").value=crop.scale.toFixed(2);} clampPan(); applyCropTransform(); });
  $("#applyCropBtn").addEventListener("click", ()=>{ const dataURL=exportCropped(512); state.profile.avatar=dataURL; renderPreview(); closeModal(); showToast("Photo updated","success"); });
  $("#resetCropBtn").addEventListener("click", ()=>{ crop.scale=1; crop.rotate=0; crop.tx=0; crop.ty=0; computeMinCoverScale(); if(crop.scale<crop.minCoverScale){ crop.scale=crop.minCoverScale; $("#zoomRange").value=crop.scale.toFixed(2); } $("#rotateRange").value=0; clampPan(); applyCropTransform(); });
  $("#closeModalBtn").addEventListener("click", closeModal);
  $(".modal-backdrop").addEventListener("click", closeModal);

  // Appearance
  $("#fontSelect").addEventListener("change", e=>{ state.skin.font=e.target.value; applySkin(); });
  $("#rangeRadius").addEventListener("input", e=>{ state.skin.radius=Number(e.target.value); applySkin(); });
  $("#rangeShadow").addEventListener("input", e=>{ state.skin.shadowPct=Number(e.target.value); applySkin(); });
  $("#avatarRingSelect").addEventListener("change", e=>{ state.skin.avatarRing=e.target.value; applySkin(); });
  $("#linkShapeSelect").addEventListener("change", e=>{ state.skin.linkShape=e.target.value; applySkin(); });

  // Card size (preview)
  $("#cardSizeRange").addEventListener("input", e=>{
    state.zoom = Number(e.target.value);
    $("#cardZoomWrap").style.setProperty('--card-scale', state.zoom);
  });

  // Save all
  $("#saveAllBtn").addEventListener("click", ()=>{
    setJSON(K.links, state.links);
    setJSON(K.profile, state.profile);
    setJSON(K.skin, state.skin);
    setJSON(K.theme, state.theme);
    showToast("All changes saved", "success");
  });

  // Publish
  $("#btnGenerateLink").addEventListener("click", ()=>{
    const url = buildPublishLink();
    $("#publishUrl").value = url;
    $("#btnCopyLink").disabled = false;
    const a = $("#btnOpenLink");
    a.href = url; a.style.pointerEvents="auto"; a.style.opacity="1";
    showToast("Share link ready", "success");
  });
  $("#btnCopyLink").addEventListener("click", ()=>{
    const url = $("#publishUrl").value; if(!url) return;
    copy(url); showToast("Link copied", "info");
  });
}

/* ---------- Modal helper ---------- */
function closeModal(){
  const modal = $("#photoModal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden","true");
}

/* ---------- Boot ---------- */
(function(){
  initTheme();

  // seed inputs
  $("#inpName").value = state.profile.name;
  $("#inpEmail").value = state.profile.email;
  $("#inpInitials").value = state.profile.initials;

  $("#cardZoomWrap").style.setProperty('--card-scale', state.zoom);

  renderShapePicker();
  renderColorSwatches();

  ensureLinksSections();
  if(state.links.length===0) state.links = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_LINKS));
  renderForm();
  renderPreview();
  applySkin();
  wire();
})();
