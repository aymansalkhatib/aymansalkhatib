// Builds the two images in the profile README, the opening line and the
// signature, each in a light and a dark variant. Text is converted to vector
// outlines, so it renders the same on every device.
//
//   npm ci
//   npm run build            # writes ../assets/*.svg

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, process.argv[2] ?? '../assets');
fs.mkdirSync(OUT, { recursive: true });

// Each line is a list of [text, emphasis] runs. Emphasis is set in italic and the accent colour.
const HOOK = [
  [['I build the part of software', false]],
  [['nobody sees,', true], [' so the part', false]],
  [['everyone sees', true], [' just works.', false]],
];
const SIGNATURE = 'Ayman Al-Khatib';

const THEMES = {
  light: { ink: '#1f2328', accent: '#9a6700' },
  dark: { ink: '#e6edf3', accent: '#e3b341' },
};

const font = (file, key) => Object.assign(opentype.loadSync(path.join(here, 'fonts', file)), { key });
const SERIF = font('InstrumentSerif-Regular.ttf', 'r');
const ITALIC = font('InstrumentSerif-Italic.ttf', 'i');
const SCRIPT = font('Allura-Regular.ttf', 's');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (lines) => lines.map((runs) => runs.map(([t]) => t).join('')).join(' ');

function svg(w, h, title, body, { defs = '', style = '' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">`
    + `<title>${esc(title)}</title>`
    + (defs ? `<defs>${defs}</defs>` : '')
    + (style ? `<style>${style}</style>` : '')
    + body + '</svg>\n';
}

function write(name, data) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), data);
}

// Glyph outlines are defined once per file, in font units, and placed with <use>.
function textRun(str, f, size, x, y, fill, glyphs) {
  const kerning = f.position.getKerningTables(f.position.getDefaultScriptName());
  const list = f.stringToGlyphs(str);
  let pen = 0, uses = '';
  list.forEach((g, i) => {
    if (g.index === 0) throw new Error(`Missing glyph in "${str}"`);
    if (g.path.commands.length) {
      const id = `${f.key}${g.index}`;
      if (!glyphs.has(id)) glyphs.set(id, g.getPath(0, 0, f.unitsPerEm).toPathData(0));
      uses += `<use href="#${id}"${pen ? ` x="${Math.round(pen)}"` : ''}/>`;
    }
    pen += g.advanceWidth;
    if (i < list.length - 1) pen += f.position.getKerningValue(kerning, g.index, list[i + 1].index);
  });
  const k = size / f.unitsPerEm;
  return { svg: `<g transform="translate(${+x.toFixed(1)} ${+y.toFixed(1)}) scale(${+k.toFixed(5)})" fill="${fill}">${uses}</g>`, width: pen * k };
}

// The opening line, set large in Instrument Serif, with a short rule drawn under it.
function hook(t) {
  const W = 1000, SIZE = 78, LEAD = 84;
  const glyphs = new Map();
  let body = '', y = SIZE * 0.92;
  for (const runs of HOOK) {
    let x = 2;
    for (const [str, em] of runs) {
      const run = textRun(str, em ? ITALIC : SERIF, SIZE, x, y, em ? t.accent : t.ink, glyphs);
      body += run.svg;
      x += run.width;
    }
    y += LEAD;
  }
  const ruleY = +(y - LEAD + SIZE * 0.55).toFixed(1);
  body += `<path class="rule" d="M4 ${ruleY}H88" stroke="${t.accent}" stroke-width="3" stroke-linecap="round" pathLength="1"/>`;
  const defs = [...glyphs].map(([id, d]) => `<path id="${id}" d="${d}"/>`).join('');
  const style = '.rule{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.1s .3s cubic-bezier(.4,0,.2,1) forwards}'
    + '@keyframes draw{to{stroke-dashoffset:0}}'
    + '@media (prefers-reduced-motion:reduce){.rule{animation:none;stroke-dashoffset:0}}';
  return svg(W, Math.ceil(ruleY + 12), plain(HOOK), body, { defs, style });
}

// The name in a script face. Each letter is traced, then filled, from left to right.
function signature(t) {
  const SIZE = 64, PAD = 6;
  const bb = SCRIPT.getPath(SIGNATURE, 0, 0, SIZE).getBoundingBox();
  const ox = PAD - bb.x1, oy = PAD - bb.y1;
  const W = Math.ceil(bb.x2 - bb.x1 + PAD * 2), H = Math.ceil(bb.y2 - bb.y1 + PAD * 2);
  const k = SIZE / SCRIPT.unitsPerEm;
  const kerning = SCRIPT.position.getKerningTables(SCRIPT.position.getDefaultScriptName());
  const list = SCRIPT.stringToGlyphs(SIGNATURE);
  let pen = 0, body = '', n = 0;
  list.forEach((g, i) => {
    if (g.path.commands.length) {
      const d = g.getPath(ox + pen * k, oy, SIZE).toPathData(1);
      body += `<path d="${d}" pathLength="1" style="animation-delay:${(n++ * 0.08).toFixed(2)}s"/>`;
    }
    pen += g.advanceWidth;
    if (i < list.length - 1) pen += SCRIPT.position.getKerningValue(kerning, g.index, list[i + 1].index);
  });
  const style = `path{fill:${t.ink};fill-opacity:0;stroke:${t.ink};stroke-width:.7;stroke-dasharray:1;stroke-dashoffset:1;animation:write 1.4s ease-out forwards}`
    + '@keyframes write{65%{stroke-dashoffset:0;fill-opacity:0}100%{stroke-dashoffset:0;fill-opacity:1}}'
    + '@media (prefers-reduced-motion:reduce){path{animation:none;stroke-dashoffset:0;fill-opacity:1}}';
  return svg(W, H, SIGNATURE, body, { style });
}

for (const [id, t] of Object.entries(THEMES)) {
  write(`hook-${id}`, hook(t));
  write(`signature-${id}`, signature(t));
}
console.log(`wrote ${Object.keys(THEMES).length * 2} files to ${OUT}`);
