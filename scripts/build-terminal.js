// Exports the 16 ANSI colours of every variant to the terminal emulators that
// consume them. The palette is already tuned in the themes, so these files are
// a projection rather than a second source of truth.
const fs = require("node:fs");
const path = require("node:path");

const themes = path.join(__dirname, "..", "themes");
const outRoot = path.join(__dirname, "..", "terminal");

const VARIANTS = [
  ["Slatis Nyx", "slatis-nyx"],
  ["Slatis Nyx Dimmed", "slatis-nyx-dimmed"],
  ["Slatis Nyx Mono", "slatis-nyx-mono"],
  ["Slatis Nyx Deuteranopia", "slatis-nyx-deuteranopia"],
  ["Slatis Nyx Tritanopia", "slatis-nyx-tritanopia"],
  ["Slatis Nyx High Contrast", "slatis-nyx-high-contrast"],
];

const ANSI = ["Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White"];
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const bare = (hex) => hex.slice(0, 7);

function palette(file) {
  const c = JSON.parse(fs.readFileSync(path.join(themes, file), "utf8").replace(/^\s*\/\/.*$/gm, "")).colors;
  return {
    background: bare(c["terminal.background"]),
    foreground: bare(c["terminal.foreground"]),
    cursor: bare(c["terminalCursor.foreground"]),
    selection: bare(c["terminal.selectionBackground"]),
    normal: ANSI.map((n) => bare(c[`terminal.ansi${n}`])),
    bright: ANSI.map((n) => bare(c[`terminal.ansiBright${n}`])),
  };
}

const iterm = (name, p) => {
  const comp = (hex) => {
    const [r, g, b] = rgb(hex).map((v) => (v / 255).toFixed(9));
    return `\t<dict>\n\t\t<key>Alpha Component</key>\n\t\t<real>1</real>\n\t\t<key>Blue Component</key>\n\t\t<real>${b}</real>\n\t\t<key>Color Space</key>\n\t\t<string>sRGB</string>\n\t\t<key>Green Component</key>\n\t\t<real>${g}</real>\n\t\t<key>Red Component</key>\n\t\t<real>${r}</real>\n\t</dict>`;
  };
  const entries = [...p.normal, ...p.bright].map((hex, i) => `\t<key>Ansi ${i} Color</key>\n${comp(hex)}`);
  entries.push(`\t<key>Background Color</key>\n${comp(p.background)}`);
  entries.push(`\t<key>Foreground Color</key>\n${comp(p.foreground)}`);
  entries.push(`\t<key>Bold Color</key>\n${comp(p.bright[7])}`);
  entries.push(`\t<key>Cursor Color</key>\n${comp(p.cursor)}`);
  entries.push(`\t<key>Cursor Text Color</key>\n${comp(p.background)}`);
  entries.push(`\t<key>Selection Color</key>\n${comp(p.selection)}`);
  entries.push(`\t<key>Selected Text Color</key>\n${comp(p.foreground)}`);
  entries.push(`\t<key>Link Color</key>\n${comp(p.bright[4])}`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n${entries.join("\n")}\n</dict>\n</plist>\n`;
};

const alacritty = (name, p) => `# ${name}
[colors.primary]
background = "${p.background}"
foreground = "${p.foreground}"

[colors.cursor]
cursor = "${p.cursor}"
text = "${p.background}"

[colors.selection]
background = "${p.selection}"
text = "${p.foreground}"

[colors.normal]
${ANSI.map((n, i) => `${n.toLowerCase()} = "${p.normal[i]}"`).join("\n")}

[colors.bright]
${ANSI.map((n, i) => `${n.toLowerCase()} = "${p.bright[i]}"`).join("\n")}
`;

const kitty = (name, p) => `# ${name}
background ${p.background}
foreground ${p.foreground}
cursor ${p.cursor}
cursor_text_color ${p.background}
selection_background ${p.selection}
selection_foreground ${p.foreground}
url_color ${p.bright[4]}

${[...p.normal, ...p.bright].map((hex, i) => `color${i} ${hex}`).join("\n")}
`;

const ghostty = (name, p) => `# ${name}
${[...p.normal, ...p.bright].map((hex, i) => `palette = ${i}=${hex}`).join("\n")}
background = ${p.background.slice(1)}
foreground = ${p.foreground.slice(1)}
cursor-color = ${p.cursor.slice(1)}
selection-background = ${p.selection.slice(1)}
selection-foreground = ${p.foreground.slice(1)}
`;

const warp = (name, p) => `accent: "${p.cursor}"
background: "${p.background}"
foreground: "${p.foreground}"
details: "darker"
terminal_colors:
  normal:
${ANSI.map((n, i) => `    ${n.toLowerCase()}: "${p.normal[i]}"`).join("\n")}
  bright:
${ANSI.map((n, i) => `    ${n.toLowerCase()}: "${p.bright[i]}"`).join("\n")}
`;

const windowsTerminal = (name, p) => JSON.stringify({
  name,
  background: p.background, foreground: p.foreground,
  cursorColor: p.cursor, selectionBackground: p.selection,
  ...Object.fromEntries(ANSI.map((n, i) => [n.toLowerCase(), p.normal[i]])),
  ...Object.fromEntries(ANSI.map((n, i) => [`bright${n}`, p.bright[i]])),
}, null, 2) + "\n";

const WRITERS = [
  ["itermcolors", iterm], ["toml", alacritty], ["conf", kitty],
  ["ghostty", ghostty], ["yaml", warp], ["json", windowsTerminal],
];

fs.rmSync(outRoot, { recursive: true, force: true });
let count = 0;
for (const [name, slug] of VARIANTS) {
  const p = palette(`${slug}-color-theme.json`);
  for (const [ext, render] of WRITERS) {
    const dir = path.join(outRoot, ext === "ghostty" ? "ghostty" : ext);
    fs.mkdirSync(dir, { recursive: true });
    const file = ext === "ghostty" ? slug : `${slug}.${ext}`;
    fs.writeFileSync(path.join(dir, file), render(name, p));
    count++;
  }
  console.log(`  ${name.padEnd(26)} bg ${p.background}  fg ${p.foreground}  green ${p.normal[2]}  red ${p.normal[1]}`);
}
console.log(`\nwrote ${count} files across ${WRITERS.length} emulators`);
