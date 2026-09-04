// Derives the Vivid variant from the Classic theme. Chrome is shared verbatim;
// only the syntax layer is remapped, since GitHub Dark Classic and GitHub Dark
// differ by a pure 1:1 hex substitution on the Primer scale.
const fs = require("node:fs");
const path = require("node:path");

const CLASSIC_TO_MODERN = {
  "#6a737d": "#8b949e", // comment      gray[3]
  "#f97583": "#ff7b72", // keyword      red[3]
  "#79b8ff": "#79c0ff", // constant     blue[2]
  "#b392f0": "#d2a8ff", // entity       purple[2]
  "#85e89d": "#7ee787", // tag          green[1]
  "#9ecbff": "#a5d6ff", // string       blue[1]
  "#dbedff": "#cae8ff", // regexp       blue[0]
  "#ffab70": "#ffa657", // variable     orange[2]
  "#e1e4e8": "#e6edf3", // fg.default
  "#fdaeb7": "#ffa198", // invalid      red[2]
  "#86181d": "#67060c", // diff deleted bg
  "#144620": "#033a16", // diff added bg
  "#c24e00": "#5a1e02", // diff changed bg
  "#2f363d": "#161b22", // diff ignored fg
  "#1158c7": "#1f6feb", // ref badge      blue[5]
  "#6e40c9": "#8957e5", // remote badge   purple[5]
  "#9b4215": "#bd561d", // base ref       orange[5]
};

const remap = (v) =>
  typeof v === "string" ? CLASSIC_TO_MODERN[v.toLowerCase()] ?? v
  : Array.isArray(v) ? v.map(remap)
  : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, remap(x)]))
  : v;

const themes = path.join(__dirname, "..", "themes");
const src = fs.readFileSync(path.join(themes, "slatis-nyx-color-theme.json"), "utf8");
const base = JSON.parse(src.replace(/^\s*\/\/.*$/gm, ""));

const out = {
  ...base,
  name: "Slatis Nyx Vivid",
  colors: {
    ...base.colors,
    "editor.foreground": "#e6edf3",
    // The graph borrows the syntax palette, so it has to follow the variant too.
    ...Object.fromEntries(
      Object.entries(base.colors)
        .filter(([k]) => k.startsWith("scmGraph."))
        .map(([k, v]) => [k, remap(v)])
    ),
  },
  semanticTokenColors: remap(base.semanticTokenColors),
  tokenColors: remap(base.tokenColors),
};

const dest = path.join(themes, "slatis-nyx-vivid-color-theme.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
console.log("wrote", path.relative(process.cwd(), dest), "-", Object.keys(out.colors).length, "colors");

// One runnable check: every classic syntax hex must be gone from the variant.
const body = JSON.stringify({ s: out.semanticTokenColors, t: out.tokenColors });
const leaked = Object.keys(CLASSIC_TO_MODERN).filter((h) => body.toLowerCase().includes(h));
if (leaked.length) throw new Error("unmapped classic colours leaked into variant: " + leaked.join(", "));
console.log("check ok - no classic hexes left in the variant syntax layer");
