window.Icons = {
  back: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
  chevronRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9EA2AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
  chevronLeft: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
  chevronRightDark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg>`,
  people: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  history: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  headphones: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
  book: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  vocab: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>`,
  irregularVerbs: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10"/><path d="M4 12h16"/><path d="M4 17h12"/><path d="M17 5l3 2-3 2"/></svg>`,
  navHome: (active) => active
    ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="#C82B2B"><path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v6H4.5A1.5 1.5 0 0 1 3 20v-9.5z"/></svg>`
    : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A7A7E" stroke-width="1.8" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20v-9.5z"/></svg>`,
  navExam: (active) => active
    ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="#C82B2B"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><text x="12" y="15" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="700">A</text></svg>`
    : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A7A7E" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><text x="12" y="16" text-anchor="middle" fill="#7A7A7E" stroke="none" font-size="8.5" font-weight="700">A</text></svg>`,
  navGroups: (active) => active
    ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="#C82B2B"><circle cx="9" cy="7" r="3.5"/><path d="M2 19c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5v1H2v-1z"/><circle cx="17" cy="8" r="2.5"/><circle cx="18" cy="17" r="4" fill="#C82B2B" stroke="#FFFFFF" stroke-width="1.5"/><path d="M16.5 17l1 1 2-2" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`
    : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A7A7E" stroke-width="1.7"><circle cx="9" cy="7" r="3.2"/><path d="M2.5 19.5c0-3 2.9-5 6.5-5s6.5 2 6.5 5"/><circle cx="16.5" cy="7.5" r="2.2"/><circle cx="18" cy="17" r="3.5" fill="#FFFFFF"/><path d="M16.6 17l.9.9 1.9-1.9" stroke-linecap="round"/></svg>`,
  navSupport: (active) => active
    ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="#C82B2B" stroke="#C82B2B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><circle cx="15" cy="9" r="1.5" fill="#FFFFFF" stroke="none"/></svg>`
    : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A7A7E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  lockSmall: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
  lockLg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
  plusLg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  qr: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 7V4a1 1 0 0 1 1-1h3M17 3h3a1 1 0 0 1 1 1v3M21 17v3a1 1 0 0 1-1 1h-3M7 21H4a1 1 0 0 1-1-1v-3"/><rect x="7" y="7" width="4" height="4" rx="0.5"/><rect x="13" y="7" width="4" height="4" rx="0.5"/><rect x="7" y="13" width="4" height="4" rx="0.5"/><path d="M13 13h2v2h-2zM16 15h1v2h-2"/></svg>`,
  calendar: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  clock: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  pin: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  eyeOff: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  eye: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  uzFlag: `<svg width="22" height="22" viewBox="0 0 24 24"><clipPath id="uzc"><circle cx="12" cy="12" r="11"/></clipPath><g clip-path="url(#uzc)"><rect width="24" height="8" y="0" fill="#0099B5"/><rect width="24" height="0.8" y="8" fill="#CE1126"/><rect width="24" height="6.4" y="8.8" fill="#FFFFFF"/><rect width="24" height="0.8" y="15.2" fill="#CE1126"/><rect width="24" height="8" y="16" fill="#1EB53A"/></g></svg>`,
  arrowDownLeft: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M17 7L7 17M17 17H7V7"/></svg>`,
  arrowUpRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 17L17 7M7 7h10v10"/></svg>`,
  sealBadge: (verified) => `<svg width="17" height="17" viewBox="0 0 24 24" fill="${verified ? '#1A85FF' : '#9EA2AA'}"><path d="M12 2l2.4 1.9 3-.4 1.1 2.8 2.8 1.1-.4 3L22.8 12l-1.9 2.4.4 3-2.8 1.1-1.1 2.8-3-.4L12 22.8l-2.4-1.9-3 .4-1.1-2.8-2.8-1.1.4-3L1.2 12l1.9-2.4-.4-3 2.8-1.1 1.1-2.8 3 .4L12 2z"/><path d="M9 12l2 2 4-4" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sealOutline: `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#8C6D62" stroke-width="1.3"><path d="M12 2.5l2.1 1.6 2.6-.3 1 2.4 2.4 1-.3 2.6 1.6 2.1-1.6 2.1.3 2.6-2.4 1-1 2.4-2.6-.3L12 21.5l-2.1-1.6-2.6.3-1-2.4-2.4-1 .3-2.6L2.5 12l1.6-2.1-.3-2.6 2.4-1 1-2.4 2.6.3L12 2.5z"/></svg>`,
  branch: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>`,
  level: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5L7 21l5-2.5L17 21l-1.5-8.5"/></svg>`,
  pulse: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>`,
  dollar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5a2.5 2.5 0 0 0-5 0c0 2 5 2 5 4a2.5 2.5 0 0 1-5 0M12 6v12" stroke-linecap="round"/></svg>`,
  chat: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  speaker: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
  instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>`,
  telegram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
  panda: `<svg width="128" height="118" viewBox="0 0 140 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="43" cy="28" rx="13" ry="12" fill="#2F3337"/>
    <ellipse cx="97" cy="28" rx="13" ry="12" fill="#2F3337"/>
    <path d="M25 76c-8-10-12-26-2-40 4-6 12-4 15 3l6 16-19 21z" fill="#2F3337"/>
    <rect x="32" y="64" width="76" height="52" rx="26" fill="#F3F4F6"/>
    <path d="M32 82c0 20 14 34 38 34s38-14 38-34H32z" fill="#2F3337" opacity="0.1"/>
    <path d="M88 64c12 2 22 14 22 28s-6 24-16 24c-7 0-12-8-12-20 0-16 2-26 6-32z" fill="#383C42"/>
    <ellipse cx="70" cy="48" rx="34" ry="29" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5"/>
    <ellipse cx="55" cy="47" rx="10" ry="8" transform="rotate(-18 55 47)" fill="#2F3337"/>
    <ellipse cx="85" cy="47" rx="10" ry="8" transform="rotate(18 85 47)" fill="#2F3337"/>
    <circle cx="56" cy="46" r="2.8" fill="#FFFFFF"/>
    <circle cx="84" cy="46" r="2.8" fill="#FFFFFF"/>
    <circle cx="56" cy="46" r="1.4" fill="#1E293B"/>
    <circle cx="84" cy="46" r="1.4" fill="#1E293B"/>
    <ellipse cx="70" cy="54" rx="5.5" ry="3.8" fill="#2F3337"/>
    <path d="M58 61c3 6 21 6 24 0H58z" fill="#FFFFFF" stroke="#2F3337" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M99 28c0 0 7 8 7 13a7 7 0 1 1-14 0c0-5 7-13 7-13z" fill="#60A5FA"/>
    <ellipse cx="97" cy="39" rx="1.6" ry="3" fill="#BFDBFE"/>
  </svg>`,
  heroClipboard: `<svg width="104" height="104" viewBox="0 0 110 110" fill="none">
    <rect x="20" y="18" width="58" height="74" rx="10" fill="#B91C1C" transform="rotate(-6 49 55)"/>
    <rect x="26" y="24" width="46" height="62" rx="6" fill="#FFFFFF" transform="rotate(-6 49 55)"/>
    <rect x="37" y="12" width="22" height="11" rx="4" fill="#991B1B" transform="rotate(-6 48 17)"/>
    <path d="M36 52l9 9 18-20" stroke="#C82B2B" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="52" y="64" width="6" height="14" rx="2" fill="#C82B2B"/>
    <rect x="61" y="57" width="6" height="21" rx="2" fill="#C82B2B"/>
    <rect x="70" y="49" width="6" height="29" rx="2" fill="#C82B2B"/>
    <rect x="90" y="24" width="7" height="58" rx="3.5" fill="#B91C1C" transform="rotate(6 93 53)"/>
  </svg>`
};
