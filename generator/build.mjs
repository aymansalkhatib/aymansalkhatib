// Builds the SVG artwork for the profile README, in light and dark variants.
// Text is converted to vector outlines (Geist and Geist Mono), so every visitor
// sees the same typography whatever fonts their device has.
//
//   npm ci
//   node build.mjs            # writes ../assets/*.svg

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import * as simpleIcons from 'simple-icons';
import octicons from '@primer/octicons';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, process.argv[2] ?? '../assets');
fs.mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------- content

const content = {
  stack: [
    {
      file: 'stack-backend', title: 'Backend', subtitle: 'APIs and services', icon: 'server', hue: 'teal',
      body: 'REST APIs and services that stay secure and easy to extend, with auth, payments, caching, real-time and i18n.',
      chips: [['NestJS', 'nestjs'], ['Spring Boot', 'springboot'], ['Express', 'express'], ['TypeScript', 'typescript'], ['Java', 'openjdk'], ['TypeORM', 'typeorm'], ['Hibernate', 'hibernate'], ['Spring Security', 'springsecurity'], ['JWT / OAuth2', 'jsonwebtokens'], ['Socket.IO', 'socketdotio']],
    },
    {
      file: 'stack-mobile', title: 'Mobile', subtitle: 'Flutter apps', icon: 'device-mobile', hue: 'sky',
      body: 'Flutter apps delivered end to end, from architecture and UI to testing and release.',
      chips: [['Flutter', 'flutter'], ['Dart', 'dart'], ['Bloc'], ['GetX', 'getx'], ['Clean Architecture'], ['Dependency Injection'], ['Dio'], ['Responsive UI'], ['Push Notifications', 'firebase'], ['Google Maps', 'googlemaps']],
    },
    {
      file: 'stack-data', title: 'Data', subtitle: 'Storage and search', icon: 'database', hue: 'indigo',
      body: 'Relational schema design, caching with Redis, and vector search with Pinecone for RAG features.',
      chips: [['PostgreSQL', 'postgresql'], ['MySQL', 'mysql'], ['MongoDB', 'mongodb'], ['Redis', 'redis'], ['Supabase', 'supabase'], ['Firebase', 'firebase'], ['Pinecone']],
    },
    {
      file: 'stack-devops', title: 'Cloud & DevOps', subtitle: 'Shipping and operations', icon: 'cloud', hue: 'violet',
      body: 'Docker images and CI/CD pipelines, with rolling updates and autoscaling on Kubernetes.',
      chips: [['Docker', 'docker'], ['Kubernetes', 'kubernetes'], ['Google Cloud', 'googlecloud'], ['GitHub Actions', 'githubactions'], ['Jenkins', 'jenkins'], ['Terraform', 'terraform'], ['Ansible', 'ansible'], ['Linux', 'linux']],
    },
  ],
  experience: [
    {
      file: 'exp-blendlab', initials: 'BL', role: 'Software Engineer', org: 'BlendLab · Remote', dates: 'May 2025 – Nov 2025',
      body: 'Built AI-powered products end to end, with NestJS services and Flutter apps.',
      bullets: [
        'Subscriptions and payments with Stripe: plans, billing and webhooks',
        'RAG semantic search with Pinecone, wired into backend services',
        'Faster map features through pre-computation and caching',
      ],
      projects: ['BunudAI', 'Tesaa', 'PinRose'],
    },
    {
      file: 'exp-bayan', initials: 'BM', role: 'Flutter Developer', org: 'Bayan Masters · Remote', dates: 'Nov 2024 – Mar 2025',
      body: 'Delivered mobile apps end to end, from architecture and UI design to testing and release.',
      bullets: [
        'Bloc state management for reliable, maintainable apps',
        'Responsive UI that adapts across screen sizes',
        'Maps and location features integrated into the apps',
      ],
      projects: ['AdZone', 'Liiamra', 'Munaseb', 'Wayyak'],
    },
  ],
  projects: [
    {
      file: 'proj-shakwa', name: 'Shakwa', kind: 'Complaint management platform', icon: 'megaphone', hue: 'teal',
      body: 'Full complaint lifecycle built for traffic: rate limiting and lockouts, locking against conflicting edits, audit logs, and k6 and JMeter load tests.',
      chips: [['NestJS', 'nestjs'], ['PostgreSQL', 'postgresql'], ['Redis', 'redis'], ['Kubernetes', 'kubernetes']],
    },
    {
      file: 'proj-nestjs-starter', name: 'NestJS Starter', kind: 'Production-ready API starter', icon: 'rocket', hue: 'indigo',
      body: 'NestJS 11 and PostgreSQL with refresh-token rotation, RBAC, Arabic and English i18n, rate limiting, Docker and CI, backed by 400+ tests.',
      chips: [['NestJS', 'nestjs'], ['PostgreSQL', 'postgresql'], ['Docker', 'docker'], ['GitHub Actions', 'githubactions']],
    },
    {
      file: 'proj-hybrid-search', name: 'Hybrid Search Engine', kind: 'Search as Python microservices', icon: 'search', hue: 'sky',
      body: 'TF-IDF, BM25, Word2Vec and BERT retrieval with re-ranking and rank fusion, query refinement, clustering and built-in IR evaluation.',
      chips: [['Python', 'python'], ['FastAPI', 'fastapi'], ['MongoDB', 'mongodb'], ['Docker', 'docker']],
    },
    {
      file: 'proj-albarakah', name: 'Al-Barakah', kind: 'Charity case management API', icon: 'heart', hue: 'rose',
      body: 'Families, home visits, aid and emergency requests, sponsorships and courses, with role-based and per-user permissions in Arabic and English.',
      chips: [['NestJS', 'nestjs'], ['TypeORM', 'typeorm'], ['PostgreSQL', 'postgresql']],
    },
    {
      file: 'proj-lexora', name: 'Lexora', kind: 'Vocabulary learning app', icon: 'book', hue: 'violet',
      body: 'Spaced repetition with Leitner and FSRS, 10 study modes with pronunciation checks, a reader, detailed stats and cloud sync.',
      chips: [['Flutter', 'flutter'], ['Dart', 'dart'], ['NestJS', 'nestjs']],
    },
    {
      file: 'proj-bio-medika', name: 'Bio Medika', kind: 'Pharmacy ordering app', icon: 'beaker', hue: 'teal',
      body: 'Pharmacists order medicines from a drug warehouse, with catalog search, expiry-date discounts, order tracking and push notifications.',
      chips: [['Flutter', 'flutter'], ['GetX', 'getx'], ['Firebase', 'firebase']],
    },
  ],
  education: {
    file: 'edu-damascus', icon: 'mortar-board', hue: 'sky', title: 'Damascus University', subtitle: 'Faculty of Information Technology Engineering',
    lines: ['Bachelor of Information Technology Engineering', 'Specialization: Software Engineering · 2021 – 2026', 'Competed in the 2023 ICPC Damascus University Collegiate Programming Contest'],
  },
  certificates: {
    file: 'edu-certificates', icon: 'verified', hue: 'amber', title: 'Certificates', subtitle: 'Courses completed',
    lines: [['Learn Nest.js Framework in Details', 'Index Academy · 2024'], ['Flutter Advanced: Clean Architecture with MVVM', 'Udemy · 2023']],
  },
};

// ---------------------------------------------------------------- themes

const THEMES = {
  dark: {
    id: 'dark',
    heroBg1: '#0a101d', heroBg2: '#101a2c', heroBorder: '#1e293b',
    glowA: 0.22, glowB: 0.18, dot: '#ffffff', dotOpacity: 0.075,
    name1: '#f8fafc', name2: '#c7d2fe',
    card: '#0f1621', cardBorder: '#252f3d',
    text: '#e6edf3', text2: '#b1bac6', muted: '#8590a0',
    accent: '#2dd4bf', accent2: '#818cf8',
    nodeFill: '#101a2a', nodeStroke: '#2a374b', edge: '#33435c',
    chipBg: '#141d2a', chipBorder: '#273345',
    hues: { teal: '#2dd4bf', sky: '#38bdf8', indigo: '#818cf8', violet: '#a78bfa', rose: '#fb7185', amber: '#fbbf24' }, glow: 0.10,
  },
  light: {
    id: 'light',
    heroBg1: '#fcfdff', heroBg2: '#eef2f8', heroBorder: '#dce3ec',
    glowA: 0.13, glowB: 0.12, dot: '#0f172a', dotOpacity: 0.085,
    name1: '#0f172a', name2: '#3730a3',
    card: '#ffffff', cardBorder: '#d8dee6',
    text: '#1f2328', text2: '#4a5361', muted: '#687280',
    accent: '#0d9488', accent2: '#4f46e5',
    nodeFill: '#ffffff', nodeStroke: '#d3dbe6', edge: '#c2cddc',
    chipBg: '#f5f7fa', chipBorder: '#e1e6ed',
    hues: { teal: '#0d9488', sky: '#0284c7', indigo: '#4f46e5', violet: '#7c3aed', rose: '#e11d48', amber: '#b45309' }, glow: 0.06,
  },
};

// ---------------------------------------------------------------- fonts and text

const font = (file, key) => Object.assign(opentype.loadSync(path.join(here, 'fonts', file)), { key });
const F = {
  regular: font('Geist-Regular.ttf', 'r'),
  medium: font('Geist-Medium.ttf', 'm'),
  semibold: font('Geist-SemiBold.ttf', 's'),
  bold: font('Geist-Bold.ttf', 'b'),
  mono: font('GeistMono-Regular.ttf', 'k'),
  monoMedium: font('GeistMono-Medium.ttf', 'n'),
};

function measure(str, f, size, ls = 0) {
  const w = f.getAdvanceWidth(str, size, { kerning: true, letterSpacing: ls / size });
  return ls ? w - ls : w;
}

// Glyph outlines are defined once per file in font units and reused with <use>.
const GLYPHS = new Map();

function glyphRef(f, glyph) {
  const id = `${f.key}${glyph.index}`;
  if (!GLYPHS.has(id)) GLYPHS.set(id, glyph.getPath(0, 0, f.unitsPerEm).toPathData(0));
  return id;
}

// Returns the outlines of `str` as SVG. `y` is the baseline.
function text(str, { x, y, size, font: f = F.regular, fill, anchor = 'start', ls = 0 }) {
  const glyphs = f.stringToGlyphs(str);
  const units = f.unitsPerEm;
  const kerning = f.position.getKerningTables(f.position.getDefaultScriptName());
  const w = measure(str, f, size, ls);
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  let pen = 0, uses = '';
  glyphs.forEach((g, i) => {
    if (g.index === 0) throw new Error(`Missing glyph in "${str}"`);
    if (g.path.commands.length) uses += `<use href="#${glyphRef(f, g)}"${pen ? ` x="${Math.round(pen)}"` : ''}/>`;
    pen += g.advanceWidth;
    if (i < glyphs.length - 1) {
      pen += kerning ? f.position.getKerningValue(kerning, g.index, glyphs[i + 1].index) : f.getKerningValue(g, glyphs[i + 1]);
    }
    pen += (ls / size) * units;
  });
  const k = +(size / units).toFixed(5);
  return `<g transform="translate(${+x0.toFixed(1)} ${+y.toFixed(1)}) scale(${k})" fill="${fill}">${uses}</g>`;
}

// Rounds the numbers in SVG path data (arc flags included) to `dec` decimals.
function roundPath(d, dec = 1) {
  const ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
  let i = 0, out = '', last = null;
  const skip = () => { while (i < d.length && /[\s,]/.test(d[i])) i++; };
  const put = (s) => {
    if (last !== null && !(s[0] === '-' || (s[0] === '.' && last.includes('.')))) out += ' ';
    out += s; last = s;
  };
  const num = () => {
    skip();
    const m = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/.exec(d.slice(i));
    if (!m) throw new Error(`Bad path data near "${d.slice(i, i + 12)}"`);
    i += m[0].length;
    return String(+(+m[0]).toFixed(dec)).replace(/^(-?)0\./, '$1.');
  };
  const flag = () => { skip(); return d[i++]; };
  let cmd = null;
  while (i < d.length) {
    skip();
    if (i >= d.length) break;
    if (/[a-zA-Z]/.test(d[i])) { cmd = d[i++]; out += cmd; last = null; if (cmd.toLowerCase() === 'z') continue; }
    const n = ARGS[cmd.toLowerCase()];
    for (let j = 0; j < n; j++) put(cmd.toLowerCase() === 'a' && (j === 3 || j === 4) ? flag() : num());
  }
  return out;
}

function wrap(str, f, size, maxW) {
  const lines = [];
  let cur = '';
  for (const word of str.split(' ')) {
    const next = cur ? `${cur} ${word}` : word;
    if (!cur || measure(next, f, size) <= maxW) cur = next;
    else { lines.push(cur); cur = word; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------------------------------------------------------------- colours and icons

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c) => `#${c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`;
const mix = (a, b, k) => hex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * k));
const lum = (h) => {
  const [r, g, b] = rgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const BRAND_OVERRIDES = { dark: { flutter: '#54c5f8', postgresql: '#7d9cf5', googlecloud: '#76a7fa' } };

// Brand colour of an icon, lightened or darkened until it reaches 3:1 contrast on `bg`.
function brandColor(slug, t, bg) {
  const base = BRAND_OVERRIDES[t.id]?.[slug] ?? `#${siLookup(slug).hex.toLowerCase()}`;
  const target = lum(bg) < 0.4 ? '#ffffff' : '#000000';
  let c = base;
  for (let k = 0.08; contrast(c, bg) < 3 && k <= 1; k += 0.08) c = mix(base, target, k);
  return c;
}

function siLookup(slug) {
  const icon = simpleIcons[`si${slug[0].toUpperCase()}${slug.slice(1)}`];
  if (!icon) throw new Error(`Unknown simple-icons slug: ${slug}`);
  return icon;
}

function siIcon(slug, x, y, size, fill) {
  return `<path transform="translate(${+x.toFixed(1)} ${+y.toFixed(1)}) scale(${+(size / 24).toFixed(4)})" d="${roundPath(siLookup(slug).path)}" fill="${fill}"/>`;
}

function octo(name, x, y, size, fill) {
  const icon = octicons[name];
  if (!icon) throw new Error(`Unknown octicon: ${name}`);
  const h = icon.heights[24] ? 24 : 16;
  return `<g transform="translate(${x} ${y}) scale(${size / h})" fill="${fill}">${icon.heights[h].path}</g>`;
}

// ---------------------------------------------------------------- svg helpers

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function svg(w, h, title, body, { defs = '', style = '' } = {}) {
  const ids = [...new Set([...body.matchAll(/href="#([a-z]\d+)"/g)].map((m) => m[1]))];
  const glyphDefs = ids.map((id) => `<path id="${id}" d="${GLYPHS.get(id)}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">`
    + `<title>${esc(title)}</title>`
    + `<defs>${defs}${glyphDefs}</defs>`
    + (style ? `<style>${style}</style>` : '')
    + body + '</svg>\n';
}

function write(name, data) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), data);
}

const REDUCED_MOTION = '@media (prefers-reduced-motion: reduce){*{animation:none!important}}';

// A row-wrapping list of pills. Returns { svg, height }.
function chips(items, x, y, maxW, t) {
  const H = 26, GAP = 6, ROW = H + 8, SIZE = 12.5, ICON = 13;
  let cx = x, cy = y, out = '';
  for (const [label, slug] of items) {
    const lw = measure(label, F.medium, SIZE);
    const w = (slug ? 9 + ICON + 6 : 11) + lw + 11;
    if (cx > x && cx + w > x + maxW) { cx = x; cy += ROW; }
    out += `<rect x="${cx + 0.5}" y="${cy + 0.5}" width="${w - 1}" height="${H - 1}" rx="${H / 2}" fill="${t.chipBg}" stroke="${t.chipBorder}"/>`;
    let tx = cx + 11;
    if (slug) {
      out += siIcon(slug, cx + 9, cy + (H - ICON) / 2, ICON, brandColor(slug, t, t.chipBg));
      tx = cx + 9 + ICON + 6;
    }
    out += text(label, { x: tx, y: cy + 17.4, size: SIZE, font: F.medium, fill: t.text2 });
    cx += w + GAP;
  }
  return { svg: out, height: cy - y + H };
}

function frame(w, h, t, hue) {
  let s = `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="16" fill="${t.card}" stroke="${t.cardBorder}"/>`;
  if (hue) {
    s += `<radialGradient id="cg" cx="44" cy="44" r="260" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${hue}" stop-opacity="${t.glow}"/><stop offset="1" stop-color="${hue}" stop-opacity="0"/></radialGradient>`
      + `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="15.5" fill="url(#cg)"/>`;
  }
  return s;
}

// 44x44 tile at the top left of a card, tinted with the card's hue.
function tile(inner, hue) {
  return `<rect x="22.5" y="22.5" width="43" height="43" rx="12" fill="${hue}" fill-opacity="0.12" stroke="${hue}" stroke-opacity="0.4"/>` + inner;
}

// ---------------------------------------------------------------- hero

// Architecture sketch on the right of the hero: a Flutter client calls two
// services inside a Kubernetes boundary, which read and write PostgreSQL and Redis.
function diagram(t) {
  const T = 4.4;
  const edges = {
    e1: 'M817 205 C862 205 862 136 907 136',
    e2: 'M817 235 C862 235 862 304 907 304',
    e3: 'M983 136 L1062 136',
    e4: 'M983 304 L1062 304',
    e5: 'M983 146 C1024 146 1022 294 1062 294',
    e6: 'M983 294 C1024 294 1022 146 1062 146',
  };
  let s = '';
  s += `<rect x="885.5" y="58.5" width="119" height="329" rx="18" fill="${t.accent}" fill-opacity="0.035" stroke="${t.edge}" stroke-dasharray="4 6"/>`;
  s += siIcon('kubernetes', 898, 70, 13, brandColor('kubernetes', t, t.nodeFill));
  s += text('kubernetes', { x: 917, y: 81, size: 12, font: F.mono, fill: t.muted });
  for (const d of Object.values(edges)) s += `<path d="${d}" fill="none" stroke="${t.edge}" stroke-width="1.8"/>`;

  // phone
  s += `<rect x="753.5" y="166.5" width="63" height="107" rx="14" fill="${t.nodeFill}" stroke="${t.nodeStroke}" stroke-width="1.2"/>`;
  s += `<rect x="776" y="174" width="18" height="3" rx="1.5" fill="${t.nodeStroke}"/>`;
  s += siIcon('flutter', 770, 205, 30, brandColor('flutter', t, t.nodeFill));
  s += text('flutter app', { x: 785, y: 298, size: 13.5, font: F.mono, fill: t.muted, anchor: 'middle' });

  const node = (cx, cy, slug, label) => {
    const x = cx - 38, y = cy - 38;
    return `<rect x="${x + 0.5}" y="${y + 0.5}" width="75" height="75" rx="18" fill="${t.nodeFill}" stroke="${t.nodeStroke}" stroke-width="1.2"/>`
      + siIcon(slug, cx - 17, cy - 17, 34, brandColor(slug, t, t.nodeFill))
      + text(label, { x: cx, y: y + 76 + 22, size: 13.5, font: F.mono, fill: t.muted, anchor: 'middle' });
  };
  s += node(945, 136, 'nestjs', 'nestjs');
  s += node(945, 304, 'springboot', 'spring boot');
  s += node(1100, 136, 'postgresql', 'postgresql');
  s += node(1100, 304, 'redis', 'redis');

  // Arrival glows, timed to the packets below.
  const glow = (cx, cy, times, color, round = 18, w = 75, h = 75) => {
    const kt = [0], v = [0];
    for (const a of times) { kt.push(a - 0.02, a, a + 0.1); v.push(0, 1, 0); }
    kt.push(1); v.push(0);
    return `<rect x="${cx - w / 2 - 3}" y="${cy - h / 2 - 3}" width="${w + 6}" height="${h + 6}" rx="${round + 3}" fill="none" stroke="${color}" stroke-width="1.6" opacity="0">`
      + `<animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" values="${v.join(';')}" keyTimes="${kt.map((k) => +k.toFixed(3)).join(';')}"/></rect>`;
  };
  s += glow(945, 136, [0.26], t.accent);
  s += glow(945, 304, [0.76], t.accent);
  s += glow(1100, 136, [0.44, 0.92], t.accent2);
  s += glow(1100, 304, [0.44, 0.92], t.accent2);

  const packet = (d, a, b, color) => {
    const f = (arr) => arr.map((k) => +k.toFixed(3)).join(';');
    const e = 0.025;
    const mk = a === 0 ? [0, b, 1] : [0, a, b, 1];
    const mp = a === 0 ? [0, 1, 1] : [0, 0, 1, 1];
    const ok = a === 0 ? [0, e, b - e, b, 1] : [0, a, a + e, b - e, b, 1];
    const ov = a === 0 ? [1, 1, 1, 0, 0] : [0, 0, 1, 1, 0, 0];
    return `<g opacity="0"><circle r="10" fill="${color}" opacity="0.2"/><circle r="4.4" fill="${color}"/>`
      + `<animateMotion dur="${T}s" repeatCount="indefinite" calcMode="linear" keyPoints="${f(mp)}" keyTimes="${f(mk)}" path="${d}"/>`
      + `<animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" values="${f(ov)}" keyTimes="${f(ok)}"/></g>`;
  };
  s += packet(edges.e1, 0.0, 0.26, t.accent);
  s += packet(edges.e3, 0.26, 0.44, t.accent2);
  s += packet(edges.e5, 0.26, 0.44, t.accent2);
  s += packet(edges.e2, 0.5, 0.76, t.accent);
  s += packet(edges.e4, 0.76, 0.92, t.accent2);
  s += packet(edges.e6, 0.76, 0.92, t.accent2);
  return s;
}

function heroBackground(W, H, t, { glowX = 0.78 } = {}) {
  const defs = `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.heroBg1}"/><stop offset="1" stop-color="${t.heroBg2}"/></linearGradient>`
    + `<radialGradient id="glowA" cx="${glowX}" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="${t.glowA}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>`
    + `<radialGradient id="glowB" cx="0.1" cy="0" r="0.6"><stop offset="0" stop-color="${t.accent2}" stop-opacity="${t.glowB}"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>`
    + `<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.1" fill="${t.dot}" fill-opacity="${t.dotOpacity}"/></pattern>`
    + `<linearGradient id="name" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.name1}"/><stop offset="1" stop-color="${t.name2}"/></linearGradient>`
    + `<clipPath id="clip"><rect width="${W}" height="${H}" rx="24"/></clipPath>`;
  const body = `<g clip-path="url(#clip)"><rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#glowB)"/>`
    + `<rect width="${W}" height="${H}" fill="url(#glowA)"/><rect width="${W}" height="${H}" fill="url(#dots)"/></g>`
    + `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="24" fill="none" stroke="${t.heroBorder}"/>`;
  return { defs, body };
}

function pulseDot(cx, cy, color) {
  return `<circle cx="${cx}" cy="${cy}" r="4" fill="${color}"/>`
    + `<circle cx="${cx}" cy="${cy}" r="4" fill="none" stroke="${color}" stroke-width="1.5">`
    + `<animate attributeName="r" values="4;11" dur="2.2s" repeatCount="indefinite"/>`
    + `<animate attributeName="opacity" values="0.8;0" dur="2.2s" repeatCount="indefinite"/></circle>`;
}

const HERO = {
  eyebrow: 'SOFTWARE ENGINEER',
  name: 'Ayman Al-Khatib',
  tagline: ['Backend systems in NestJS and Spring Boot,', 'and the Flutter apps that run on top of them.'],
  meta: [['location', 'Damascus, Syria'], ['mortar-board', 'Damascus University graduate']],
  alt: 'Ayman Al-Khatib, Software Engineer. Backend systems in NestJS and Spring Boot, and the Flutter apps that run on top of them.',
};

function hero(t) {
  const W = 1200, H = 440;
  const bg = heroBackground(W, H, t);
  let s = bg.body;
  const x0 = 72;
  s += pulseDot(80, 111, t.accent);
  s += text(HERO.eyebrow, { x: 97, y: 117, size: 16, font: F.monoMedium, fill: t.accent, ls: 3.2 });
  s += text(HERO.name, { x: x0 - 4, y: 197, size: 70, font: F.bold, fill: 'url(#name)', ls: -1.2 });
  s += text(HERO.tagline[0], { x: x0, y: 254, size: 25, fill: t.text2 });
  s += text(HERO.tagline[1], { x: x0, y: 289, size: 25, fill: t.text2 });
  let mx = x0;
  for (const [icon, label] of HERO.meta) {
    s += octo(icon, mx, 334, 19, t.muted);
    s += text(label, { x: mx + 27, y: 349, size: 16, font: F.mono, fill: t.muted });
    mx += 27 + measure(label, F.mono, 16) + 30;
  }
  s += diagram(t);
  return svg(W, H, HERO.alt, s, { defs: bg.defs, style: REDUCED_MOTION });
}

// Stacked layout for narrow screens. It keeps its own dark background, so it
// reads well on both GitHub themes.
function heroMobile() {
  const t = THEMES.dark;
  const W = 640, H = 600;
  const bg = heroBackground(W, H, t, { glowX: 0.5 });
  let s = bg.body;
  // The diagram spans x 753-1145 and starts at y 58 in hero coordinates.
  const k = 0.84;
  s += `<g transform="translate(${(W - 392 * k) / 2 - 753 * k} ${34 - 58 * k}) scale(${k})">${diagram(t)}</g>`;
  const cx = W / 2;
  const ew = measure(HERO.eyebrow, F.monoMedium, 17, 3.4);
  s += pulseDot(cx - ew / 2 - 16, 380, t.accent);
  s += text(HERO.eyebrow, { x: cx + 8, y: 386, size: 17, font: F.monoMedium, fill: t.accent, ls: 3.4, anchor: 'middle' });
  s += text(HERO.name, { x: cx, y: 450, size: 60, font: F.bold, fill: 'url(#name)', ls: -1, anchor: 'middle' });
  s += text('Backend systems in NestJS and Spring Boot,', { x: cx, y: 500, size: 23, fill: t.text2, anchor: 'middle' });
  s += text('and the Flutter apps that run on them.', { x: cx, y: 533, size: 23, fill: t.text2, anchor: 'middle' });
  s += text('Damascus, Syria · Damascus University graduate', { x: cx, y: 571, size: 15.5, font: F.mono, fill: t.muted, anchor: 'middle' });
  return svg(W, H, HERO.alt, s, { defs: bg.defs, style: REDUCED_MOTION });
}

// ---------------------------------------------------------------- cards

const CARD_W = 415, PAD = 22, INNER = CARD_W - PAD * 2;

function header(t, title, subtitle, right) {
  let s = text(title, { x: 80, y: 41, size: 18, font: F.semibold, fill: t.text });
  s += text(subtitle, { x: 80, y: 61.5, size: 13.5, fill: t.muted });
  if (right) s += right;
  return s;
}

function paragraph(lines, x, y, t, { size = 14.5, lh = 22, fill } = {}) {
  return lines.map((ln, i) => text(ln, { x, y: y + i * lh, size, fill: fill ?? t.text2 })).join('');
}

// Each builder returns { height, render(height) } so cards in a row can share a height.
function stackCard(c, t) {
  const hue = t.hues[c.hue];
  const lines = wrap(c.body, F.regular, 14.5, INNER);
  const bodyY = 104;
  const chipsY = bodyY + (lines.length - 1) * 22 + 22;
  const ch = chips(c.chips, PAD, chipsY, INNER, t);
  const height = chipsY + ch.height + PAD;
  return {
    height,
    render: (h) => svg(CARD_W, h, `${c.title}: ${c.body} ${c.chips.map((x) => x[0]).join(', ')}.`,
      frame(CARD_W, h, t, hue) + tile(octo(c.icon, 32, 32, 24, hue), hue) + header(t, c.title, c.subtitle)
      + paragraph(lines, PAD, bodyY, t) + ch.svg),
  };
}

function experienceCard(c, t) {
  const lines = wrap(c.body, F.regular, 14.5, INNER);
  let y = 104;
  let s = paragraph(lines, PAD, y, t, { fill: t.text });
  y += (lines.length - 1) * 22 + 30;
  for (const b of c.bullets) {
    const bl = wrap(b, F.regular, 14, INNER - 16);
    s += `<circle cx="${PAD + 3}" cy="${y - 4.5}" r="2.6" fill="${t.accent}"/>`;
    s += paragraph(bl, PAD + 16, y, t, { size: 14, lh: 21 });
    y += bl.length * 21 + 7;
  }
  y += 9;
  s += text('PROJECTS', { x: PAD, y, size: 11, font: F.monoMedium, fill: t.muted, ls: 1.6 });
  const ch = chips(c.projects.map((p) => [p]), PAD, y + 10, INNER, t);
  s += ch.svg;
  const height = y + 10 + ch.height + PAD;
  const tileSvg = `<defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent2}"/></linearGradient></defs>`
    + `<rect x="22" y="22" width="44" height="44" rx="12" fill="url(#tg)"/>`
    + text(c.initials, { x: 44, y: 50, size: 17, font: F.bold, fill: '#ffffff', anchor: 'middle' });
  const right = text(c.dates, { x: CARD_W - PAD, y: 40, size: 12, font: F.mono, fill: t.muted, anchor: 'end' });
  return {
    height,
    render: (h) => svg(CARD_W, h, `${c.role} at ${c.org}, ${c.dates}. ${c.body} ${c.bullets.join('. ')}. Projects: ${c.projects.join(', ')}.`,
      frame(CARD_W, h, t, t.accent) + tileSvg + header(t, c.role, c.org, right) + s),
  };
}

function projectCard(c, t) {
  const lines = wrap(c.body, F.regular, 14.5, INNER);
  const bodyY = 104;
  const chipsY = bodyY + (lines.length - 1) * 22 + 22;
  const ch = chips(c.chips, PAD, chipsY, INNER, t);
  const height = chipsY + ch.height + PAD;
  const hue = t.hues[c.hue];
  const arrow = octo('arrow-up-right', CARD_W - PAD - 18, 24, 18, t.muted);
  return {
    height,
    render: (h) => svg(CARD_W, h, `${c.name}, ${c.kind}. ${c.body}`,
      frame(CARD_W, h, t, hue) + tile(octo(c.icon, 32, 32, 24, hue), hue) + header(t, c.name, c.kind, arrow)
      + paragraph(lines, PAD, bodyY, t) + ch.svg),
  };
}

function listCard(c, t) {
  const hue = t.hues[c.hue];
  let y = 104, last = y, s = '';
  // An item is a line of text, or [title, meta] shown on two lines.
  for (const item of c.lines) {
    const [line, meta] = Array.isArray(item) ? item : [item];
    const ls = wrap(line, F.regular, 14, INNER - 16);
    s += `<circle cx="${PAD + 3}" cy="${y - 4.5}" r="2.6" fill="${hue}"/>`;
    s += paragraph(ls, PAD + 16, y, t, { size: 14, lh: 21 });
    last = y + (ls.length - 1) * 21;
    if (meta) {
      last += 20;
      s += text(meta, { x: PAD + 16, y: last, size: 13, fill: t.muted });
    }
    y = last + 28;
  }
  return {
    height: last + 6 + PAD,
    render: (h) => svg(CARD_W, h, `${c.title}. ${c.lines.map((i) => [].concat(i).join(', ')).join('. ')}.`,
      frame(CARD_W, h, t, hue) + tile(octo(c.icon, 32, 32, 24, hue), hue) + header(t, c.title, c.subtitle) + s),
  };
}

// Renders cards in rows of two, sharing the taller height within a row.
function rows(list, build, t, perRow = 2) {
  for (let i = 0; i < list.length; i += perRow) {
    const row = list.slice(i, i + perRow).map((c) => [c, build(c, t)]);
    const h = Math.ceil(Math.max(...row.map(([, b]) => b.height)));
    for (const [c, b] of row) write(`${c.file}-${t.id}`, b.render(h));
  }
}

// ---------------------------------------------------------------- buttons

function linkedinGlyph(x, y, size, color) {
  const k = size / 24;
  return `<g transform="translate(${x} ${y}) scale(${k})"><rect width="24" height="24" rx="5" fill="${color}"/>`
    + `<rect x="5" y="9.5" width="3" height="9" fill="#fff"/><circle cx="6.5" cy="6.3" r="1.8" fill="#fff"/>`
    + `<path d="M10.6 9.5h2.9v1.3c.5-.9 1.6-1.6 3.1-1.6 2.6 0 3.4 1.6 3.4 4.1v5.2h-3v-4.6c0-1.2-.3-2-1.4-2-1.2 0-1.9.8-1.9 2.1v4.5h-3.1z" fill="#fff"/></g>`;
}

function button(kind, t) {
  const H = 44;
  const label = kind === 'linkedin' ? 'LinkedIn' : 'Email';
  const lw = measure(label, F.medium, 15);
  const W = Math.round(18 + 20 + 10 + lw + 22);
  const glyph = kind === 'linkedin'
    ? linkedinGlyph(18, 12, 20, t.id === 'dark' ? '#3b8ad9' : '#0a66c2')
    : octo('mail', 18, 12, 20, t.accent);
  const body = `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${H / 2}" fill="${t.card}" stroke="${t.cardBorder}"/>`
    + glyph + text(label, { x: 48, y: 27.5, size: 15, font: F.medium, fill: t.text });
  write(`btn-${kind}-${t.id}`, svg(W, H, label, body));
}

// ---------------------------------------------------------------- build

for (const t of Object.values(THEMES)) {
  write(`hero-${t.id}`, hero(t));
  rows(content.stack, stackCard, t);
  rows(content.experience, experienceCard, t);
  rows(content.projects, projectCard, t);
  rows([content.education, content.certificates], listCard, t);
  button('linkedin', t);
  button('email', t);
}
write('hero-mobile', heroMobile());

const files = fs.readdirSync(OUT).filter((f) => f.endsWith('.svg'));
const total = files.reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`${files.length} files, ${(total / 1024).toFixed(0)} KB in ${OUT}`);
