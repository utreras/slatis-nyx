// Derives the Dimmed variant from the Classic theme. Chrome is shared verbatim;
// only the syntax and graph layers are remapped, since the Primer scales are
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
  "#1158c7": "#316dca", // ref badge         blue[5]
  "#6e40c9": "#8256d0", // remote badge      purple[5]
  "#9b4215": "#ae5622", // base ref          orange[5]
};


// The chrome neutral ramp, moved onto Primer's dimmed grays so UI text never
// sits brighter than the code it frames. Pure #ffffff is deliberately absent:
// it only survives on saturated badge fills, where dimming it would drop the
// label under 3:1 against the fill.
const CHROME_TEXT = {
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
    // The graph borrows the syntax palette, so it has to follow the variant too.
    ...Object.fromEntries(
      Object.entries(base.colors)
        .filter(([k]) => k.startsWith("scmGraph."))
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
