// Ports every variant to Zed. Zed's theme contract is unrelated to VS Code's:
// 142 style keys, 46 syntax node names borrowed from tree-sitter, and colours
// always carrying an explicit alpha byte. Roles are read back out of each VS
// Code variant so the accessibility palettes port themselves.
const fs = require("node:fs");
const path = require("node:path");

const themes = path.join(__dirname, "..", "themes");
const outDir = path.join(__dirname, "..", "zed");

const VARIANTS = [
  ["Slatis Nyx", "slatis-nyx"],
  ["Slatis Nyx Dimmed", "slatis-nyx-dimmed"],
  ["Slatis Nyx Mono", "slatis-nyx-mono"],
  ["Slatis Nyx Deuteranopia", "slatis-nyx-deuteranopia"],
  ["Slatis Nyx Tritanopia", "slatis-nyx-tritanopia"],
  ["Slatis Nyx High Contrast", "slatis-nyx-high-contrast"],
];

const read = (f) => JSON.parse(fs.readFileSync(path.join(themes, f), "utf8").replace(/^\s*\/\/.*$/gm, ""));
// Zed always wants eight digits. A VS Code value may carry alpha already.
const c = (hex) => (hex.length === 9 ? hex : hex.slice(0, 7) + "ff").toLowerCase();
const alpha = (hex, aa) => hex.slice(0, 7).toLowerCase() + aa;

function roles(t) {
  const sem = t.semanticTokenColors;
  const scope = (name) => {
    for (const r of t.tokenColors) {
      const s = Array.isArray(r.scope) ? r.scope : [r.scope];
      if (s.includes(name)) return r.settings.foreground;
    }
    return null;
  };
  return {
    base: t.colors["editor.foreground"],
    comment: sem.comment.foreground,
    keyword: sem.keyword,
    constant: sem.type,
    fn: sem.function,
    string: sem.string,
    tag: scope("entity.name.tag"),
    attr: scope("entity.other.attribute-name"),
    regexp: sem.regexp,
    punctuation: scope("punctuation"),
  };
}

function style(t) {
  const k = t.colors;
  const r = roles(t);
  const accent = k["editorCursor.foreground"];
  const lanes = [1, 2, 3, 4, 5].map((i) => k[`scmGraph.foreground${i}`]);
  const hl = (color, extra = {}) => ({ color: c(color), font_style: null, font_weight: null, ...extra });

  return {
    "background.appearance": "opaque",
    accents: lanes.map(c),

    background: c(k["sideBar.background"]),
    "surface.background": c(k["sideBar.background"]),
    "elevated_surface.background": c(k["editorWidget.background"]),
    "panel.background": c(k["panel.background"]),
    "status_bar.background": c(k["statusBar.background"]),
    "title_bar.background": c(k["titleBar.activeBackground"]),
    "title_bar.inactive_background": c(k["titleBar.inactiveBackground"]),
    "toolbar.background": c(k["editor.background"]),
    "tab_bar.background": c(k["editorGroupHeader.tabsBackground"]),
    "tab.active_background": c(k["tab.activeBackground"]),
    "tab.inactive_background": c(k["tab.inactiveBackground"]),
    "drop_target.background": alpha(accent, "20"),

    border: c(k["sideBar.border"]),
    "border.variant": c(k["editorIndentGuide.background1"]),
    "border.focused": c(accent),
    "border.selected": c(accent),
    "border.disabled": c(k["editorIndentGuide.background1"]),
    "border.transparent": "#00000000",
    "pane.focused_border": c(accent),
    "pane_group.border": c(k["sideBar.border"]),
    "panel.focused_border": c(accent),
    "panel.indent_guide": c(k["editorIndentGuide.background1"]),
    "panel.indent_guide_active": c(accent),
    "panel.indent_guide_hover": c(accent),

    text: c(k["foreground"]),
    "text.muted": c(k["sideBar.foreground"]),
    "text.placeholder": c(k["input.placeholderForeground"]),
    "text.disabled": c(k["disabledForeground"]),
    "text.accent": c(k["textLink.foreground"]),
    "link_text.hover": c(k["textLink.activeForeground"]),

    icon: c(k["icon.foreground"]),
    "icon.muted": c(k["descriptionForeground"]),
    "icon.disabled": c(k["statusBar.foreground"]),
    "icon.placeholder": c(k["descriptionForeground"]),
    "icon.accent": c(accent),

    "element.background": c(k["editorWidget.background"]),
    "element.hover": alpha(accent, "18"),
    "element.active": alpha(accent, "30"),
    "element.selected": alpha(accent, "30"),
    "element.disabled": c(k["button.secondaryBackground"]),
    "ghost_element.background": "#00000000",
    "ghost_element.hover": alpha(accent, "18"),
    "ghost_element.active": alpha(accent, "30"),
    "ghost_element.selected": alpha(accent, "30"),
    "ghost_element.disabled": "#00000000",

    "editor.background": c(k["editor.background"]),
    "editor.gutter.background": c(k["editor.background"]),
    "editor.foreground": c(r.base),
    "editor.subheader.background": c(k["editorWidget.background"]),
    "editor.active_line.background": alpha("#ffffff", "0a"),
    "editor.highlighted_line.background": alpha(accent, "25"),
    "editor.line_number": c(k["editorLineNumber.foreground"]),
    "editor.active_line_number": c(k["editorLineNumber.activeForeground"]),
    "editor.invisible": c(k["editorWhitespace.foreground"]),
    "editor.wrap_guide": c(k["editorIndentGuide.background1"]),
    "editor.active_wrap_guide": c(k["editorIndentGuide.activeBackground1"]),
    "editor.indent_guide": c(k["editorIndentGuide.background1"]),
    "editor.indent_guide_active": c(k["editorIndentGuide.activeBackground1"]),
    "editor.document_highlight.read_background": alpha(accent, "20"),
    "editor.document_highlight.write_background": alpha(accent, "30"),
    "editor.document_highlight.bracket_background": alpha(accent, "40"),
    "search.match_background": alpha(accent, "40"),

    "scrollbar.thumb.background": alpha("#ffffff", "15"),
    "scrollbar.thumb.hover_background": alpha("#ffffff", "25"),
    "scrollbar.thumb.border": "#00000000",
    "scrollbar.track.background": "#00000000",
    "scrollbar.track.border": "#00000000",

    ...Object.fromEntries(Object.entries({
      created: k["gitDecoration.addedResourceForeground"],
      modified: k["gitDecoration.modifiedResourceForeground"],
      deleted: k["gitDecoration.deletedResourceForeground"],
      renamed: k["gitDecoration.renamedResourceForeground"],
      conflict: k["gitDecoration.conflictingResourceForeground"],
      ignored: k["gitDecoration.ignoredResourceForeground"],
      hidden: k["descriptionForeground"],
      error: k["editorError.foreground"],
      warning: k["editorWarning.foreground"],
      info: k["editorInfo.foreground"],
      success: k["gitDecoration.addedResourceForeground"],
      hint: k["editorInlayHint.foreground"],
      predictive: k["editorGhostText.foreground"],
      unreachable: k["disabledForeground"],
    }).flatMap(([name, hex]) => [
      [name, c(hex)],
      [`${name}.background`, alpha(hex, "1a")],
      [`${name}.border`, alpha(hex, "66")],
    ])),

    "terminal.background": c(k["terminal.background"]),
    "terminal.foreground": c(k["terminal.foreground"]),
    "terminal.bright_foreground": c(k["terminal.ansiBrightWhite"]),
    "terminal.dim_foreground": c(k["terminal.ansiWhite"]),
    "terminal.ansi.background": c(k["terminal.background"]),
    ...Object.fromEntries(
      ["Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White"].flatMap((n) => {
        const low = n.toLowerCase();
        return [
          [`terminal.ansi.${low}`, c(k[`terminal.ansi${n}`])],
          [`terminal.ansi.bright_${low}`, c(k[`terminal.ansiBright${n}`])],
          [`terminal.ansi.dim_${low}`, alpha(k[`terminal.ansi${n}`], "cc")],
        ];
      })
    ),

    players: [accent, ...lanes, k["textLink.foreground"], k["editorCursor.foreground"]]
      .slice(0, 8)
      .map((hex) => ({ cursor: c(hex), background: c(hex), selection: alpha(hex, "3d") })),

    syntax: {
      attribute: hl(r.attr),
      boolean: hl(r.constant),
      comment: hl(r.comment, { font_style: "italic" }),
      "comment.doc": hl(r.comment, { font_style: "italic" }),
      constant: hl(r.constant),
      constructor: hl(r.fn),
      embedded: hl(r.base),
      emphasis: hl(r.base, { font_style: "italic" }),
      "emphasis.strong": hl(r.base, { font_weight: 700 }),
      enum: hl(r.constant),
      function: hl(r.fn),
      hint: hl(k["editorInlayHint.foreground"]),
      keyword: hl(r.keyword),
      label: hl(r.attr),
      link_text: hl(r.constant, { font_style: "italic" }),
      link_uri: hl(r.string),
      namespace: hl(r.constant),
      number: hl(r.constant),
      operator: hl(r.keyword),
      predictive: hl(k["editorGhostText.foreground"]),
      preproc: hl(r.keyword),
      primary: hl(r.base),
      property: hl(r.base),
      punctuation: hl(r.punctuation),
      "punctuation.bracket": hl(r.punctuation),
      "punctuation.delimiter": hl(r.punctuation),
      "punctuation.list_marker": hl(r.attr),
      "punctuation.markup": hl(r.punctuation),
      "punctuation.special": hl(r.keyword),
      selector: hl(r.tag),
      "selector.pseudo": hl(r.fn),
      string: hl(r.string),
      "string.escape": hl(r.tag),
      "string.regex": hl(r.regexp),
      "string.special": hl(r.regexp),
      "string.special.symbol": hl(r.regexp),
      tag: hl(r.tag),
      "text.literal": hl(r.string),
      title: hl(r.constant, { font_weight: 700 }),
      type: hl(r.constant),
      variable: hl(r.base),
      "variable.parameter": hl(r.base),
      "variable.special": hl(r.constant),
      variant: hl(r.constant),
      "diff.plus": hl(k["gitDecoration.addedResourceForeground"]),
      "diff.minus": hl(k["gitDecoration.deletedResourceForeground"]),
    },
  };
}

fs.mkdirSync(path.join(outDir, "themes"), { recursive: true });
const family = {
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name: "Slatis Nyx",
  author: "Slatis",
  themes: VARIANTS.map(([name, slug]) => ({
    name,
    appearance: "dark",
    style: style(read(`${slug}-color-theme.json`)),
  })),
};
fs.writeFileSync(path.join(outDir, "themes", "slatis-nyx.json"), JSON.stringify(family, null, 2) + "\n");

fs.writeFileSync(path.join(outDir, "extension.toml"), `id = "slatis-nyx"
name = "Slatis Nyx"
description = "Six blacked-out dark variants, three of them built for colour vision deficiency."
version = "0.1.0"
schema_version = 1
authors = ["Ignacio Utreras <pabloutrerasurrutia@gmail.com>"]
repository = "https://github.com/utreras/slatis-nyx"
`);

const first = family.themes[0].style;
console.log(`wrote zed/themes/slatis-nyx.json — ${family.themes.length} themes, ${Object.keys(first).length - 2} style keys, ${Object.keys(first.syntax).length} syntax nodes`);

// Every value the schema types as a colour must be a full eight-digit hex.
const bad = [];
for (const t of family.themes) {
  for (const [k, v] of Object.entries(t.style)) {
    if (typeof v === "string" && !/^#[0-9a-f]{8}$/.test(v) && k !== "background.appearance") bad.push(`${t.name}.${k}=${v}`);
  }
  for (const [k, v] of Object.entries(t.style.syntax)) if (!/^#[0-9a-f]{8}$/.test(v.color)) bad.push(`${t.name}.syntax.${k}=${v.color}`);
}
if (bad.length) throw new Error("malformed colours: " + bad.slice(0, 5).join(", "));
console.log("check ok - every colour is eight-digit hex");
