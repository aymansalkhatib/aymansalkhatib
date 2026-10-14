// Refreshes the cards in assets/live. The trophies and stats are drawn here from
// public GitHub data; the streak card comes from its public service. Anything
// that fails keeps its previous version, so the README never shows a broken image.
//
//   GITHUB_TOKEN=<token> node scripts/update-cards.mjs

import fs from 'node:fs/promises';

const USER = 'aymansalkhatib';
const OUT = new URL('../assets/live/', import.meta.url);
const TOKEN = process.env.GITHUB_TOKEN;

// Colours follow GitHub's own light and dark themes. Cards are 420px wide, so two fill the README.
const W = 420;
const THEMES = {
  light: {
    bg: 'ffffff', border: 'd0d7de', title: '1f2328', text: '59636e', accent: '0969da',
    ranks: { S: 'bf8700', A: '8250df', B: '0969da', C: '6e7781' },
  },
  dark: {
    bg: '0d1117', border: '30363d', title: 'e6edf3', text: '9198a1', accent: '4493f8',
    ranks: { S: 'e3b341', A: 'a371f7', B: '4493f8', C: '8b949e' },
  },
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif";
const fmt = (n) => n.toLocaleString('en-US');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function svg(width, height, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="${FONT}" role="img" aria-label="${esc(title)}">`
    + `<title>${esc(title)}</title>${body}</svg>\n`;
}

// Octicons (16px and 24px), MIT licensed, https://primer.style/octicons
const ICONS = {
  star: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z',
  commit: 'M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z',
  pr: 'M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z',
  repo: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z',
  cup: 'M5.09 10.121A5.251 5.251 0 0 1 1 5V3.75C1 2.784 1.784 2 2.75 2h2.364c.236-.586.81-1 1.48-1h10.812c.67 0 1.244.414 1.48 1h2.489c.966 0 1.75.784 1.75 1.75V5a5.252 5.252 0 0 1-4.219 5.149 7.01 7.01 0 0 1-4.644 5.478l.231 3.003a.5.5 0 0 0 .034.031c.079.065.303.203.836.282.838.124 1.637.57 1.637 1.557v.75a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75v-.75c0-.987.799-1.433 1.637-1.557.533-.079.757-.217.836-.282a.5.5 0 0 0 .034-.031l.231-3.003A7.012 7.012 0 0 1 5.09 10.12ZM5 3.5H2.75a.25.25 0 0 0-.25.25V5A3.752 3.752 0 0 0 5.159 8.581 6.957 6.957 0 0 1 5 7.25ZM19 7.25c0 .44-.04.871-.118 1.29A3.75 3.75 0 0 0 21.5 5V3.75a.25.25 0 0 0-.25-.25H19Zm-1.5 0V2.75a.25.25 0 0 0-.25-.25H6.75a.25.25 0 0 0-.25.25v4.5a5.5 5.5 0 1 0 11 0Zm-8.1 11.94-.021.004c-.413.061-.53.208-.535.239L8.84 19.5h6.32l-.004-.067c-.005-.031-.122-.178-.535-.239l-.021-.004a2.016 2.016 0 0 1-1.648-1.825L12.725 16a6.97 6.97 0 0 1-1.45 0l-.227 1.365a2.016 2.016 0 0 1-1.648 1.825Z',
};

// ---------------------------------------------------------------- GitHub data

// Public numbers only, so every card agrees. In Actions the token only reaches
// this repository; locally, run without a token.
async function github(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': USER };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${path}: HTTP ${res.status}`);
  return res.json();
}

async function profileNumbers() {
  const user = await github(`/users/${USER}`);
  const repos = (await github(`/users/${USER}/repos?type=owner&per_page=100`)).filter((r) => !r.fork);
  const search = async (q, kind) => (await github(`/search/${kind}?q=${encodeURIComponent(q)}&per_page=1`)).total_count;
  return {
    commits: await search(`author:${USER}`, 'commits'),
    stars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    prs: await search(`author:${USER} type:pr`, 'issues'),
    issues: await search(`author:${USER} type:issue`, 'issues'),
    repos: repos.length,
    followers: user.followers,
    years: Math.floor((Date.now() - Date.parse(user.created_at)) / (365.25 * 24 * 3600 * 1000)),
  };
}

// ---------------------------------------------------------------- trophies

const LETTERS = ['C', 'B', 'A', 'AA', 'AAA', 'S', 'SS', 'SSS'];
const TROPHIES = [
  { title: 'Commits', key: 'commits', unit: 'commits', levels: [1, 10, 100, 200, 500, 1000, 2000, 4000] },
  { title: 'Stars', key: 'stars', unit: 'stars', levels: [1, 10, 30, 50, 100, 200, 700, 2000] },
  { title: 'Pull requests', key: 'prs', unit: 'pull requests', levels: [1, 10, 20, 50, 100, 200, 500, 1000] },
  { title: 'Repositories', key: 'repos', unit: 'public repos', levels: [1, 10, 20, 30, 35, 40, 45, 50] },
  { title: 'Followers', key: 'followers', unit: 'followers', levels: [1, 10, 20, 50, 100, 200, 400, 1000] },
  { title: 'Experience', key: 'years', unit: 'years on GitHub', levels: [0, 1, 2, 3, 5, 7, 10, 15] },
];

function trophy(def, value, t, x, w) {
  let level = -1;
  def.levels.forEach((min, i) => { if (value >= min) level = i; });
  const letter = level >= 0 ? LETTERS[level] : '-';
  const color = `#${t.ranks[letter[0]] ?? t.ranks.C}`;
  const next = def.levels[level + 1];
  const progress = level < 0 ? 0 : next === undefined ? 1 : (value - def.levels[level]) / (next - def.levels[level]);
  const c = w / 2, bar = w - 30;
  return `<g transform="translate(${x} 0)">`
    + `<rect x="0.5" y="0.5" width="${w - 1}" height="119" rx="6" fill="#${t.bg}" stroke="#${t.border}"/>`
    + `<text x="${c}" y="21" text-anchor="middle" font-size="12" font-weight="600" fill="#${t.title}">${def.title}</text>`
    + `<path transform="translate(${c - 19} 30) scale(1.6)" d="${ICONS.cup}" fill="${color}"/>`
    + `<text x="${c}" y="86" text-anchor="middle" font-size="15" font-weight="700" fill="${color}">${letter}</text>`
    + `<text x="${c}" y="102" text-anchor="middle" font-size="10.5" fill="#${t.text}">${fmt(value)} ${def.unit}</text>`
    + `<rect x="15" y="108" width="${bar}" height="3" rx="1.5" fill="#${t.border}"/>`
    + `<rect x="15" y="108" width="${(bar * Math.min(1, Math.max(0, progress))).toFixed(1)}" height="3" rx="1.5" fill="${color}"/>`
    + '</g>';
}

function trophyRow(defs, numbers, t) {
  const gap = 9, w = (W - gap * (defs.length - 1)) / defs.length;
  const body = defs.map((d, i) => trophy(d, numbers[d.key], t, i * (w + gap), w)).join('');
  return svg(W, 120, defs.map((d) => `${d.title}: ${fmt(numbers[d.key])}`).join(', '), body);
}

// ---------------------------------------------------------------- stats

// Same scoring as github-readme-stats (MIT): a weighted mix of commits, pull
// requests, issues, stars and followers, mapped to a percentile and a letter.
function rankOf(n) {
  const exponential = (x) => 1 - 2 ** -x;
  const logNormal = (x) => x / (1 + x);
  const score = (2 * exponential(n.commits / 1000) + 3 * exponential(n.prs / 50) + exponential(n.issues / 25)
    + 4 * logNormal(n.stars / 50) + logNormal(n.followers / 10)) / 12;
  const percentile = (1 - score) * 100;
  const LEVELS = ['S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
  const limits = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  return { level: LEVELS[limits.findIndex((l) => percentile <= l)], percentile };
}

// Laid out like the github-readme-stats card, at the size of the streak card next to it.
function statsCard(n, t) {
  const H = 195;
  const rows = [
    ['star', 'Total stars earned', n.stars],
    ['commit', 'Total commits', n.commits],
    ['pr', 'Total pull requests', n.prs],
    ['repo', 'Public repositories', n.repos],
  ];
  const { level, percentile } = rankOf(n);
  const r = 40, circumference = 2 * Math.PI * r;
  const arc = (circumference * (100 - percentile) / 100).toFixed(1);
  let body = `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="6" fill="#${t.bg}" stroke="#${t.border}"/>`
    + `<text x="25" y="40" font-size="17" font-weight="600" fill="#${t.title}">Ayman Al-Khatib's GitHub Stats</text>`;
  rows.forEach(([icon, label, value], i) => {
    const y = 82 + i * 28;
    body += `<path transform="translate(25 ${y - 13})" d="${ICONS[icon]}" fill="#${t.accent}"/>`
      + `<text x="50" y="${y}" font-size="14" fill="#${t.text}">${label}:</text>`
      + `<text x="222" y="${y}" font-size="14" font-weight="700" fill="#${t.title}">${fmt(value)}</text>`;
  });
  body += `<g transform="translate(${W - 80} 118)">`
    + `<circle r="${r}" fill="none" stroke="#${t.border}" stroke-width="6"/>`
    + `<circle r="${r}" fill="none" stroke="#${t.accent}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${arc} ${circumference.toFixed(1)}" transform="rotate(-90)"/>`
    + `<text y="9" text-anchor="middle" font-size="26" font-weight="700" fill="#${t.title}">${level}</text></g>`;
  return svg(W, H, `GitHub stats: ${rows.map(([, l, v]) => `${l} ${fmt(v)}`).join(', ')}. Rank ${level}.`, body);
}

// ---------------------------------------------------------------- streak card

const query = (params) => new URLSearchParams(params).toString();
const streakUrl = (t) => `https://streak-stats.demolab.com/?${query({
  user: USER, card_width: String(W), border_radius: '6', background: t.bg, border: t.border, stroke: t.border,
  ring: t.accent, fire: t.accent, currStreakNum: t.title, sideNums: t.title, currStreakLabel: t.accent,
  sideLabels: t.text, dates: t.text,
})}`;

// Visible text of an error card, checked after removing styles and tags.
const ERROR_TEXT = /something went wrong|maximum retries|rate limit|could not be found|not found|too many requests|error/i;

async function download(url, file) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      const body = await res.text();
      const visible = body.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
      if (res.ok && body.includes('<svg') && !ERROR_TEXT.test(visible)) {
        await fs.writeFile(new URL(file, OUT), body);
        return true;
      }
      console.warn(`${file}: attempt ${attempt} got HTTP ${res.status}`);
    } catch (err) {
      console.warn(`${file}: attempt ${attempt} failed: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 3000 * attempt));
  }
  console.warn(`${file}: keeping the previous version`);
  return false;
}

// ---------------------------------------------------------------- run

await fs.mkdir(OUT, { recursive: true });
let failures = 0;

async function attempt(label, fn) {
  try {
    await fn();
  } catch (err) {
    failures++;
    console.warn(`${label}: ${err.message}; keeping the previous version`);
  }
}

await attempt('stats and trophies', async () => {
  const numbers = await profileNumbers();
  console.log('numbers', numbers);
  for (const [id, t] of Object.entries(THEMES)) {
    await fs.writeFile(new URL(`stats-${id}.svg`, OUT), statsCard(numbers, t));
    await fs.writeFile(new URL(`trophies-1-${id}.svg`, OUT), trophyRow(TROPHIES.slice(0, 3), numbers, t));
    await fs.writeFile(new URL(`trophies-2-${id}.svg`, OUT), trophyRow(TROPHIES.slice(3), numbers, t));
  }
});

for (const [id, t] of Object.entries(THEMES)) {
  if (!(await download(streakUrl(t), `streak-${id}.svg`))) failures++;
}
console.log(failures ? `done; ${failures} item(s) kept from the previous run` : 'all cards updated');
