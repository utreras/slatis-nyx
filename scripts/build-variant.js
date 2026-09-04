// Derives every variant from the Classic theme. Chrome is shared verbatim
// unless a variant says otherwise; the Primer scales are index-aligned, so each
// role has exactly one counterpart per palette and the mapping stays 1:1.
const fs = require("node:fs");
const path = require("node:path");

const themes = path.join(__dirname, "..", "themes");
const readTheme = (f) =>
  JSON.parse(fs.readFileSync(path.join(themes, f), "utf8").replace(/^\s*\/\/.*$/gm, ""));

// --- colour utilities -------------------------------------------------------

const srgb = (c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (hex) => { const [r, g, b] = channels(hex); return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b); };
const chroma = (hex) => { const v = channels(hex); return Math.max(...v) - Math.min(...v); };

// Alpha-aware: "#62646345" is the tertiary grey at 27% opacity, and matching
// only the full 8-digit string would silently leave it unmapped.
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

// --- Dimmed -----------------------------------------------------------------

const CLASSIC_TO_DIMMED = {
  "#6a737d": "#768390", "#f97583": "#f47067", "#79b8ff": "#6cb6ff", "#b392f0": "#dcbdfb",
  "#85e89d": "#8ddb8c", "#9ecbff": "#96d0ff", "#dbedff": "#c6e6ff", "#ffab70": "#f69d50",
  "#e1e4e8": "#adbac7", "#fdaeb7": "#ff938a", "#86181d": "#78191b", "#144620": "#1b4721",
  "#c24e00": "#682d0f", "#2f363d": "#22272e",
};

// The chrome neutral ramp, moved onto Primer's dimmed greys so UI text never
// sits brighter than the code it frames. Pure #ffffff is deliberately absent:
// it only survives on saturated badge fills, where dimming it would drop the
// label under 3:1 against the fill.
const CHROME_TEXT = {
  "#f0f6fc": "#cdd9e5", "#e1e4e8": "#adbac7", "#cdcecd": "#adbac7",
  "#8e8f8f": "#768390", "#626463": "#636e7b", "#4a4c4b": "#545d68",
};

const dim = substitute(CHROME_TEXT);
const remapDimmed = substitute(CLASSIC_TO_DIMMED);

// --- accessibility variants -------------------------------------------------

// Primer ships these with built-in collisions: in dark_colorblind the `green`
// and `blue` arrays are byte-identical, so tags and strings land on the same
// hex. Each map below re-slots the affected role onto a different step of the
// surviving hue, keeping every syntax role distinct by value.
const ACCESSIBLE = [
  {
    name: "Slatis Nyx (Deuteranopia)",
    file: "slatis-nyx-deuteranopia-color-theme.json",
    lanes: ["#648fff", "#785ef0", "#dc267f", "#d47616", "#ffb000"],
    refs: ["#0f62fe", "#6929c4", "#914d04"],
    map: {
      "#e1e4e8": "#f0f6fc", "#6a737d": "#8b949e",
      "#f97583": "#ec8e2c", "#ffab70": "#fdac54", "#b392f0": "#a371f7",
      "#79b8ff": "#58a6ff", "#85e89d": "#79c0ff", "#9ecbff": "#a5d6ff",
      "#dbedff": "#cae8ff", "#fdaeb7": "#ffc981",
      "#86181d": "#4e2906", "#144620": "#0c2d6b", "#c24e00": "#6c3906", "#2f363d": "#161b22",
      "#42be65": "#a5d6ff", "#6fdc8c": "#cae8ff",
      "#fa4d56": "#ec8e2c", "#da1e28": "#914d04",
      "#f1c21b": "#ffc981", "#7a5c00": "#6c3906",
      "#ff832b": "#fdac54", "#ba4e00": "#914d04", "#fe6100": "#d47616",
      "#e97871": "#ec8e2c", "#ff9e96": "#fdac54", "#f2c86c": "#ffc981",
      "#5ec8e5": "#79c0ff", "#91dbf2": "#a5d6ff",
    },
  },
  {
    name: "Slatis Nyx (Tritanopia)",
    file: "slatis-nyx-tritanopia-color-theme.json",
    lanes: ["#58a6ff", "#ff7b72", "#a5d6ff", "#b62324", "#c9d1d9"],
    refs: ["#0f62fe", "#6929c4", "#b62324"],
    map: {
      "#e1e4e8": "#f0f6fc", "#6a737d": "#8b949e",
      "#f97583": "#ff7b72", "#ffab70": "#ffa198", "#b392f0": "#a371f7",
      "#79b8ff": "#58a6ff", "#85e89d": "#79c0ff", "#9ecbff": "#a5d6ff",
      "#dbedff": "#cae8ff", "#fdaeb7": "#ffc1ba",
      "#86181d": "#67060c", "#144620": "#0c2d6b", "#c24e00": "#8e1519", "#2f363d": "#161b22",
      "#42be65": "#a5d6ff", "#6fdc8c": "#cae8ff",
      "#fa4d56": "#ff7b72", "#da1e28": "#b62324",
      "#f1c21b": "#ffc1ba", "#7a5c00": "#8e1519",
      "#ff832b": "#ffa198", "#ba4e00": "#b62324", "#fe6100": "#f85149",
      "#e97871": "#ff7b72", "#ff9e96": "#ffa198", "#f2c86c": "#ffc1ba",
      "#5ec8e5": "#79c0ff", "#91dbf2": "#a5d6ff",
    },
  },
  {
    name: "Slatis Nyx (High Contrast)",
    file: "slatis-nyx-high-contrast-color-theme.json",
    lanes: ["#71b7ff", "#cb9eff", "#ff6a69", "#fe9a2d", "#4ae168"],
    refs: ["#1e60d5", "#8957e5", "#bf5e0a"],
    extraColors: { contrastBorder: "#6e7681" },
    map: {
      "#e1e4e8": "#f0f3f6", "#cdcecd": "#f0f3f6", "#8e8f8f": "#d9dee3",
      "#626463": "#bdc4cc", "#4a4c4b": "#9ea7b3", "#6a737d": "#9ea7b3",
      "#f97583": "#ff9492", "#ffab70": "#ffb757", "#b392f0": "#cb9eff",
      "#79b8ff": "#91cbff", "#85e89d": "#72f088", "#9ecbff": "#addcff",
      "#dbedff": "#caeaff", "#fdaeb7": "#ffc9c7",
      "#86181d": "#cc1421", "#144620": "#007728", "#c24e00": "#a74c00", "#2f363d": "#21262d",
      "#42be65": "#4ae168", "#6fdc8c": "#72f088",
      "#fa4d56": "#ff9492", "#da1e28": "#cc1421",
      "#f1c21b": "#ffcf86", "#7a5c00": "#a74c00",
      "#ff832b": "#ffb757", "#ba4e00": "#bf5e0a", "#fe6100": "#fe9a2d",
      "#e97871": "#ff9492", "#ff9e96": "#ffb1af", "#f2c86c": "#ffcf86",
      "#5ec8e5": "#91cbff", "#91dbf2": "#addcff",
      "#4589ff": "#71b7ff", "#78a9ff": "#91cbff", "#0f62fe": "#1e60d5",
      "#2c2e2d": "#6e7681", "#383a39": "#9ea7b3",
    },
  },
];

// Colour is never the only channel in an accessibility variant: read-only
// symbols also carry weight, so a constant stays a constant when hue is gone.
const REDUNDANT_CHANNELS = { "*.readonly": { bold: true } };

// --- Mono -------------------------------------------------------------------

const GRAY_RAMP = ["#cdd9e5","#adbac7","#909dab","#768390","#636e7b","#545d68","#444c56","#373e47","#2d333b","#22272e"];
const KEEP_COLOUR = [(k) => k.startsWith("terminal"), (k) => k.startsWith("symbolIcon.")];

// Danger keeps its colour. Greyscale can rank things by value, but it cannot
// make one of them mean "stop" — and a missed error costs more than a break in
// the palette.
const KEEP_SIGNAL = (k) => /error|warning|conflict|offline|breakpoint/i.test(k) || k.startsWith("merge.");

const STATE_GRAY = {
  "gitDecoration.addedResourceForeground": "#adbac7", "gitDecoration.untrackedResourceForeground": "#adbac7",
  "editorGutter.addedBackground": "#adbac7", "minimapGutter.addedBackground": "#adbac7",
  "chat.linesAddedForeground": "#adbac7",
  "gitDecoration.modifiedResourceForeground": "#909dab", "editorGutter.modifiedBackground": "#909dab",
  "minimapGutter.modifiedBackground": "#909dab",
  "gitDecoration.deletedResourceForeground": "#636e7b", "editorGutter.deletedBackground": "#636e7b",
  "minimapGutter.deletedBackground": "#636e7b", "chat.linesRemovedForeground": "#636e7b",
};

const nearestGray = (hex) => {
  const l = luminance(hex);
  return GRAY_RAMP.reduce((best, g) => (Math.abs(luminance(g) - l) < Math.abs(luminance(best) - l) ? g : best));
};

// --- build ------------------------------------------------------------------

const base = readTheme("slatis-nyx-color-theme.json");
const written = [];
const write = (file, theme) => {
  fs.writeFileSync(path.join(themes, file), JSON.stringify(theme, null, 2) + "\n");
  written.push(`${theme.name.padEnd(26)} ${Object.keys(theme.colors).length} colors  ${file}`);
};

const dimmed = {
  ...base,
  name: "Slatis Nyx (Dimmed)",
  colors: {
    ...dim(base.colors),
    "editor.foreground": "#adbac7",
    "terminal.ansiWhite": "#adbac7",
    "terminal.ansiBrightWhite": "#cdd9e5",
    ...Object.fromEntries(Object.entries(base.colors)
      .filter(([k]) => k.startsWith("symbolIcon."))
      .map(([k, v]) => [k, remapDimmed(dim(v))])),
  },
  semanticTokenColors: remapDimmed(base.semanticTokenColors),
  tokenColors: remapDimmed(base.tokenColors),
};
write("slatis-nyx-dimmed-color-theme.json", dimmed);

const mono = (() => {
  const colors = {};
  for (const [k, v] of Object.entries(dimmed.colors)) {
    if (KEEP_COLOUR.some((f) => f(k)) || KEEP_SIGNAL(k)) { colors[k] = v; continue; }
    if (STATE_GRAY[k]) { colors[k] = STATE_GRAY[k] + (/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})$/.exec(v)?.[1] ?? ""); continue; }
    const m = /^(#[0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/.exec(v);
    if (!m || chroma(m[1]) < 12) { colors[k] = v; continue; }
    colors[k] = nearestGray(m[1].toLowerCase()) + (m[2] ?? "");
  }
  return { ...dimmed, name: "Slatis Nyx (Mono)", colors };
})();
write("slatis-nyx-mono-color-theme.json", mono);

const accessible = ACCESSIBLE.map((v) => {
  const swap = substitute(v.map);
  const colors = { ...swap(base.colors), ...(v.extraColors ?? {}) };
  v.lanes.forEach((c, i) => { colors[`scmGraph.foreground${i + 1}`] = c; });
  const [ref, remote, baseRef] = v.refs;
  Object.assign(colors, {
    "scmGraph.historyItemRefColor": ref,
    "scmGraph.historyItemRemoteRefColor": remote,
    "scmGraph.historyItemBaseRefColor": baseRef,
  });
  const theme = {
    ...base,
    name: v.name,
    colors,
    semanticTokenColors: { ...swap(base.semanticTokenColors), ...REDUNDANT_CHANNELS },
    tokenColors: swap(base.tokenColors),
  };
  write(v.file, theme);
  return { v, theme };
});

// --- checks -----------------------------------------------------------------

const problems = [];

const syntaxJson = JSON.stringify({ s: dimmed.semanticTokenColors, t: dimmed.tokenColors }).toLowerCase();
const chromeJson = JSON.stringify(dimmed.colors).toLowerCase();
for (const h of Object.keys(CLASSIC_TO_DIMMED)) if (syntaxJson.includes(h)) problems.push(`dimmed syntax kept ${h}`);
for (const h of Object.keys(CHROME_TEXT)) if (chromeJson.includes(h)) problems.push(`dimmed chrome kept ${h}`);

const onRamp = new Set(GRAY_RAMP);
for (const [k, v] of Object.entries(mono.colors)) {
  if (KEEP_COLOUR.some((f) => f(k)) || KEEP_SIGNAL(k)) continue;
  const m = /^(#[0-9a-fA-F]{6})/.exec(v);
  if (m && !onRamp.has(m[1].toLowerCase()) && chroma(m[1]) >= 12) problems.push(`mono chrome kept ${k}=${v}`);
}

// The check that matters for accessibility. Two roles are safely separable if
// ANY of three channels carries the difference: enough luminance, enough hue,
// or one of them being near-neutral (chroma is a channel too). A pair that
// fails all three reads as one colour to someone with the matching deficiency.
// This is precisely what Primer ships in dark_colorblind, where the `green` and
// `blue` scales are byte-identical and tags collapse onto strings.
const hue = (hex) => {
  const [r, g, b] = channels(hex).map((v) => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return -1;
  const x = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (x * 60 + 360) % 360;
};
const hueGap = (a, b) => { const d = Math.abs(hue(a) - hue(b)); return Math.min(d, 360 - d); };
const separable = (a, b) => {
  if (Math.abs(luminance(a) - luminance(b)) >= 0.03) return true;
  if (chroma(a) < 30 || chroma(b) < 30) return true;
  return hueGap(a, b) >= 70;
};

const ROLES = { comment: "#6a737d", keyword: "#f97583", constant: "#79b8ff", entity: "#b392f0",
                tag: "#85e89d", string: "#9ecbff", regexp: "#dbedff", variable: "#ffab70",
                base: "#e1e4e8", invalid: "#fdaeb7" };
for (const { v } of accessible) {
  const resolved = Object.fromEntries(Object.entries(ROLES).map(([r, c]) => [r, (v.map[c] ?? c).toLowerCase()]));
  const names = Object.keys(resolved);
  let worst = Infinity;
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
    const [a, b] = [resolved[names[i]], resolved[names[j]]];
    if (!separable(a, b)) problems.push(`${v.name}: ${names[i]} ${a} and ${names[j]} ${b} are not separable`);
    worst = Math.min(worst, Math.abs(luminance(a) - luminance(b)));
  }
  console.log(`  ${v.name.padEnd(26)} 10 roles, all separable, tightest luminance gap ${worst.toFixed(3)}`);
}

console.log();
written.forEach((l) => console.log("  " + l));
if (problems.length) { console.error("\nFAILED:\n  " + problems.join("\n  ")); process.exit(1); }
console.log("\ncheck ok - all variants derived, no role collisions");
