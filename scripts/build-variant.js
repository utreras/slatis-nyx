// Derives the Dimmed variant from the Classic theme. Chrome is shared verbatim;
// only the syntax layer is remapped, since the Primer scales are
// index-aligned: every Classic role has one Dimmed counterpart at the same step.
const fs = require("node:fs");
const path = require("node:path");

const CLASSIC_TO_DIMMED = {
  "#6a737d": "#768390", // comment        gray[3]
  "#f97583": "#f47067", // keyword        red[3]
  "#79b8ff": "#6cb6ff", // constant       blue[2]
  "#b392f0": "#dcbdfb", // entity         purple[2]
  "#85e89d": "#8ddb8c", // tag            green[1]
  "#9ecbff": "#96d0ff", // string         blue[1]
  "#dbedff": "#c6e6ff", // regexp         blue[0]
  "#ffab70": "#f69d50", // variable       orange[2]
  "#e1e4e8": "#adbac7", // fg.default
  "#fdaeb7": "#ff938a", // invalid        red[2]
  "#86181d": "#78191b", // diff deleted bg   red[8]
  "#144620": "#1b4721", // diff added bg     green[8]
  "#c24e00": "#682d0f", // diff changed bg   orange[8]
  "#2f363d": "#22272e", // diff ignored fg   gray[9]
};


// The chrome neutral ramp, moved onto Primer's dimmed grays so UI text never
// sits brighter than the code it frames. Pure #ffffff is deliberately absent:
// it only survives on saturated badge fills, where dimming it would drop the
// label under 3:1 against the fill.
const CHROME_TEXT = {
  "#f0f6fc": "#cdd9e5", // strong     gray[0]
  "#e1e4e8": "#adbac7", // base text  gray[1]
  "#cdcecd": "#adbac7", // primary    gray[1]
  "#8e8f8f": "#768390", // secondary  gray[3]
  "#626463": "#636e7b", // tertiary   gray[4]
  "#4a4c4b": "#545d68", // muted      gray[5]
};

// Substitution walks any value shape and is alpha-aware: "#62646345" is the
// tertiary grey at 27% opacity, and matching only the full 8-digit string would
// silently leave it undimmed.
const substitute = (map) => {
  const walk = (v) => {
    if (typeof v === "string") {
      const m = /^(#[0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/.exec(v);
      if (!m) return v;
      const hit = map[m[1].toLowerCase()];
      return hit ? hit + (m[2] ?? "") : v;
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk;
};

const dim = substitute(CHROME_TEXT);
const remap = substitute(CLASSIC_TO_DIMMED);

const themes = path.join(__dirname, "..", "themes");
const src = fs.readFileSync(path.join(themes, "slatis-nyx-color-theme.json"), "utf8");
const base = JSON.parse(src.replace(/^\s*\/\/.*$/gm, ""));

const out = {
  ...base,
  name: "Slatis Nyx Dimmed",
  colors: {
    ...dim(base.colors),
    "editor.foreground": "#adbac7",
    "terminal.ansiWhite": "#adbac7",
    "terminal.ansiBrightWhite": "#cdd9e5",
    // Symbol icons mirror the syntax roles, so they follow the variant.
    ...Object.fromEntries(
      Object.entries(base.colors)
        .filter(([k]) => k.startsWith("symbolIcon."))
        .map(([k, v]) => [k, remap(dim(v))])
    ),
  },
  semanticTokenColors: remap(base.semanticTokenColors),
  tokenColors: remap(base.tokenColors),
};

const dest = path.join(themes, "slatis-nyx-dimmed-color-theme.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
console.log("wrote", path.relative(process.cwd(), dest), "-", Object.keys(out.colors).length, "colors");

// One runnable check: every classic syntax hex must be gone from the variant.
const syntax = JSON.stringify({ s: out.semanticTokenColors, t: out.tokenColors }).toLowerCase();
const chrome = JSON.stringify(out.colors).toLowerCase();
const leaked = [
  ...Object.keys(CLASSIC_TO_DIMMED).filter((h) => syntax.includes(h)),
  ...Object.keys(CHROME_TEXT).filter((h) => chrome.includes(h)),
];
if (leaked.length) throw new Error("undimmed colours leaked into the variant: " + leaked.join(", "));
console.log("check ok - no classic syntax or chrome hexes left in the variant");

// ---------------------------------------------------------------------------
// Mono: derived from Dimmed. Chroma is stripped from the chrome and kept only
// where colour carries meaning the shape cannot — syntax and terminal output.
// ---------------------------------------------------------------------------

// Primer's dimmed grey ramp. Snapping to ten fixed steps rather than emitting a
// free-form grey keeps the variant on the same ladder as the rest of the theme.
const GRAY_RAMP = ["#cdd9e5","#adbac7","#909dab","#768390","#636e7b","#545d68","#444c56","#373e47","#2d333b","#22272e"];

const KEEP_COLOUR = [(k) => k.startsWith("terminal"), (k) => k.startsWith("symbolIcon.")];

// State signals collapse onto the same grey when matched by luminance alone
// (#4589ff modified and #fa4d56 deleted differ by 0.001), so they are placed by
// hand. In greyscale the only axis left is value: brighter means louder.
const STATE_GRAY = {
  "editorError.foreground": "#cdd9e5",
  "problemsErrorIcon.foreground": "#cdd9e5",
  "errorForeground": "#cdd9e5",
  "list.errorForeground": "#cdd9e5",
  "notificationsErrorIcon.foreground": "#cdd9e5",
  "editorWarning.foreground": "#adbac7",
  "problemsWarningIcon.foreground": "#adbac7",
  "list.warningForeground": "#adbac7",
  "notificationsWarningIcon.foreground": "#adbac7",
  "gitDecoration.addedResourceForeground": "#adbac7",
  "gitDecoration.untrackedResourceForeground": "#adbac7",
  "editorGutter.addedBackground": "#adbac7",
  "minimapGutter.addedBackground": "#adbac7",
  "gitDecoration.modifiedResourceForeground": "#909dab",
  "editorGutter.modifiedBackground": "#909dab",
  "minimapGutter.modifiedBackground": "#909dab",
  "gitDecoration.deletedResourceForeground": "#636e7b",
  "editorGutter.deletedBackground": "#636e7b",
  "minimapGutter.deletedBackground": "#636e7b",
  "gitDecoration.conflictingResourceForeground": "#768390",
};

const srgb = (c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
};
const chroma = (hex) => {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return Math.max(...v) - Math.min(...v);
};
const nearestGray = (hex) => {
  const l = luminance(hex);
  return GRAY_RAMP.reduce((best, g) => (Math.abs(luminance(g) - l) < Math.abs(luminance(best) - l) ? g : best));
};

function toMono(dimmed) {
  const colors = {};
  for (const [k, v] of Object.entries(dimmed.colors)) {
    if (KEEP_COLOUR.some((f) => f(k))) { colors[k] = v; continue; }
    if (STATE_GRAY[k]) { colors[k] = STATE_GRAY[k] + (/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})$/.exec(v)?.[1] ?? ""); continue; }
    const m = /^(#[0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/.exec(v);
    // A near-neutral value is already on the greyscale ladder; leave it exactly
    // as the Dimmed variant set it so the surfaces stay identical.
    if (!m || chroma(m[1]) < 12) { colors[k] = v; continue; }
    colors[k] = nearestGray(m[1].toLowerCase()) + (m[2] ?? "");
  }
  return { ...dimmed, name: "Slatis Nyx Mono", colors };
}

const mono = toMono(out);
const monoDest = path.join(themes, "slatis-nyx-mono-color-theme.json");
fs.writeFileSync(monoDest, JSON.stringify(mono, null, 2) + "\n");
console.log("wrote", path.relative(process.cwd(), monoDest), "-", Object.keys(mono.colors).length, "colors");

// Check: outside the kept prefixes every value must be near-neutral or a member
// of the ramp. The ramp itself is blue-tinted by design (#adbac7 carries 26 of
// chroma), so a plain chroma threshold would flag the greys we just applied.
const onRamp = new Set(GRAY_RAMP);
const stray = Object.entries(mono.colors).filter(([k, v]) => {
  if (KEEP_COLOUR.some((f) => f(k))) return false;
  const m = /^(#[0-9a-fA-F]{6})/.exec(v);
  if (!m) return false;
  const base = m[1].toLowerCase();
  return !onRamp.has(base) && chroma(base) >= 12;
});
if (stray.length) throw new Error("chroma left in mono chrome: " + stray.slice(0, 5).map(([k, v]) => k + "=" + v).join(", "));
console.log("check ok - mono chrome is greyscale, syntax and terminal keep their colour");
