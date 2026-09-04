# Slatis Nyx

> A gift from Slatis to the engineers who work while the world sleeps.
>
> Nyx was the goddess of night, and in every telling, night is not the absence
> of something. It is its own thing, first-born, with its own weather. The room
> gets quiet, the meetings stop, and what is left is you and the problem(s).

Blacked-out dark theme for Visual Studio Code / Cursor / Windsurf (now Devin)

Six variants, 469 colour keys each. Half of them exist for developers whose eyes
resolve colour differently.

## Features

- **Blue stays out of the syntax.** Functions render purple `#c9a3f0`, so the
  interface accent and the code never share a hue. Chrome recedes, code carries.
- **Borders you can actually see.** Two bands with one rule: `#2c2e2d` for
  surfaces that sit inside the layout, `#383a39` for surfaces that float over
  content.
- **Semantic highlighting, on.** 39 rules keyed off the language server, so
  `readonly` locals, `defaultLibrary` symbols and declarations each read
  differently from a plain identifier.
- **Punctuation recedes** to `#8e8f8f` and lets keywords own the accent.
- **Every surface is covered.** Terminal ANSI, diff, merge, git decorations,
  bracket pairs, inlay hints, sticky scroll, the command centre, the source
  control graph, symbol icons, and the chat view.

## Variants

| Theme | Use it when |
|---|---|
| Slatis Nyx | The default. Full colour, GitHub Dark Classic syntax. |
| Slatis Nyx (Dimmed) | Long sessions. Saturation and brightness drop together, so the whole surface sits about five contrast points lower. |
| Slatis Nyx (Mono) | Greyscale interface. Colour survives in syntax, terminal, and 41 risk signals. |
| Slatis Nyx (Deuteranopia) | Red-green colour vision deficiency, covering deuteranopia and protanopia. |
| Slatis Nyx (Tritanopia) | Blue-yellow colour vision deficiency. |
| Slatis Nyx (High Contrast) | Low vision. Ships as `uiTheme: hc-black`. |

## Built for colour vision deficiency

Around 1 in 12 men and 1 in 200 women have some form of colour vision
deficiency. Syntax highlighting asks them to pull meaning out of hue for eight
hours a day, and most themes hand them two roles painted the same colour.

Three variants target a specific deficiency, and a fourth removes the question
entirely.

| Variant | Covers | What moves |
|---|---|---|
| Deuteranopia | deuteranopia, protanopia | Green becomes blue and red becomes amber. The red-green axis turns into amber-blue. |
| Tritanopia | tritanopia | Green becomes blue and orange becomes red. The axis turns into red-blue. |
| Mono | achromatopsia, and any deficiency at once | The interface goes greyscale. Syntax, terminal and 41 risk-signal keys keep their colour. |
| High Contrast | low vision | Every hue brightens, borders move up a band, and VS Code draws its own contrast borders on every widget. |

Deuteranopia and Tritanopia keep the interface exactly as the default theme
paints it. What moves is the syntax palette, the git and diff signals, the 16
terminal ANSI colours and the source control graph lanes, which is everywhere
colour carries meaning rather than identity.

### Every palette is measured before it ships

Every variant is generated from one source theme by `scripts/build-variant.js`,
and the build refuses to finish when two of the ten syntax roles could read as
the same colour.

A pair passes when at least one of three channels carries the difference:

- a luminance gap of 0.03
- a hue gap of 70 degrees
- one of them sitting near neutral, where chroma does the work

Hue remapping on its own leaves pairs that match in both hue and value.
Measuring all 45 pairs in each variant surfaced `entity` and `tag` sitting
0.001 apart in luminance and 61 degrees apart in hue, which lands as a single
colour for a deuteranope. The palettes moved until the check passed.

### Upstream collisions, repaired

These variants build on the palettes in `@primer/primitives`. In
`dark_colorblind` the `green` and `blue` scales are byte-identical, and in
`dark_tritanopia` so are `orange` and `red`. A direct port drops
`entity.name.tag` and `string` on the same hex. Each variant re-slots the
affected role onto a different step of the surviving hue.

### Colour works alongside other channels

Read-only symbols render bold in every accessibility variant, so a constant
stays identifiable with hue stripped out completely. Deprecated symbols are
struck through in all six.

Mono takes the idea furthest. The git gutter separates added, modified and
deleted by lightness, and 41 keys covering errors, warnings, merge conflicts,
offline state and breakpoints hold their colour, so a failure still announces
itself in a greyscale interface.

### What a theme cannot reach

These live in settings, beyond the reach of any colour file:

```jsonc
{
  // Force a minimum contrast ratio in the terminal, overriding program colours
  "terminal.integrated.minimumContrastRatio": 4.5,

  // Heavier glyphs help low vision more than brighter ones
  "editor.fontWeight": "500",
  "workbench.fontAliasing": "antialiased",

  // A wider, steady caret is easier to track
  "editor.cursorWidth": 3,
  "editor.cursorBlinking": "solid",

  // Audio cues that run independently of anything visual
  "accessibility.signals.lineHasError": { "sound": "on" },
  "accessibility.signals.lineHasWarning": { "sound": "on" },

  // Structure that survives without colour
  "editor.guides.bracketPairs": "active",
  "editor.renderWhitespace": "boundary"
}
```

## Colour contract

| Role | Hex | On `#0b0b0b` |
|---|---|---|
| Accent (UI) | `#4589ff` | 5.9:1 |
| Link / bright | `#78a9ff` | 8.4:1 |
| Fill only | `#0f62fe` | 3.9:1 |
| Error / badge | `#fa4d56` | |
| Added / success | `#42be65` | |
| Warning | `#f1c21b` | |

Badges split by intent. Counters that report a change, like git and extensions,
come through `activityBarBadge` in blue. Anything asking for attention comes
through `activityErrorBadge` in red or `activityWarningBadge` in yellow.

The command centre, sticky scroll and the active activity-bar item use alpha
compositing, so layers read as stacked glass. Alpha composites against the
workbench surface underneath. VS Code has no window-level transparency, so the
desktop stays hidden.

## Install

Reload the window and pick a variant from the theme picker.

## Build

The five derived variants come out of the source theme:

```
npm run build
```

Edit `themes/slatis-nyx-color-theme.json`, run the build, and the other five
follow. The script checks for leaked colours, greyscale purity in Mono, and
role separability in the accessibility variants before it writes anything.

## Publish

```
npx @vscode/vsce package
npx @vscode/vsce publish
```
