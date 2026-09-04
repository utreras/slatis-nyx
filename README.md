# Slatis Nyx

> A gift from Slatis to the engineers who work while the world sleeps.
>
> Nyx was the goddess of night — and in every telling, night is not the absence
> of something. It is its own thing, first-born, with its own weather. The room
> gets quiet, the meetings stop, and what is left is you and the problem.
>
> This theme is for those hours. Darkness you choose, not darkness you endure.

Blacked-out dark theme for VS Code, descended from Black Material.

## What changed vs. the parent theme

- **The Slatis blue is the UI accent.** `#4589ff` drives cursor, focus, active
  tab, progress and selection. The deeper `#0f62fe` is used only as a fill behind
  white text — at 3.9:1 on `#0b0b0b` it fails AA as text or as a hairline.
- **Blue is banned from syntax.** Functions moved to purple `#c9a3f0`, the way
  GitHub Dark resolves the same collision. Chrome and content never share a hue.
- **Borders are visible.** `#151616` (≈1.05:1 on black) was replaced by
  `#2c2e2d` subtle / `#383a39` strong.
- **Semantic highlighting is on.** 39 semantic token rules keyed off the language
  server, so `readonly` locals, `defaultLibrary` symbols and declarations are
  distinguishable. The parent theme was TextMate-only.
- **Punctuation demoted** from cyan to neutral `#8e8f8f`; keywords now own cyan.
- **Terminal, diff, merge, git, brackets and inlay hints** are all themed. None
  of them were.

## Colour contract

| Role | Hex | On `#0b0b0b` |
|---|---|---|
| Accent (UI) | `#4589ff` | 5.9:1 |
| Link / bright | `#78a9ff` | 8.4:1 |
| Fill only | `#0f62fe` | 3.9:1 |
| Error / badge | `#fa4d56` | |
| Added / success | `#42be65` | |
| Warning | `#f1c21b` | |

Badges are split by meaning: counters that just tell you something changed
(git, extensions) are blue via `activityBarBadge`; things that want your
attention are red via `activityErrorBadge` and yellow via `activityWarningBadge`.

The command centre, sticky scroll and the active activity-bar item use alpha
compositing rather than opaque fills, so layers read as stacked glass. VS Code
has no window-level transparency — alpha composites against the workbench
surface underneath, never against the desktop.

## Install (local dev)

The folder already sits in `~/.vscode/extensions/`. Reload the window and pick
**Slatis Nyx** from the theme picker.

## Publish

```
npx @vscode/vsce package
npx @vscode/vsce publish
```

## Accessibility

Six variants. The three below are derived from the same Classic source through
`scripts/build-variant.js`, using the palettes published in `@primer/primitives`.

| Variant | For | What moves |
|---|---|---|
| Deuteranopia | red-green deficiency (deuteranopia, protanopia) | green becomes blue, red becomes amber. The red/green axis becomes amber/blue. |
| Tritanopia | blue-yellow deficiency | green becomes blue, orange becomes red. The axis becomes red/blue. |
| High Contrast | low vision | every hue brightened, borders raised, and `uiTheme: hc-black` so VS Code draws its own contrast borders on every widget. |
| Mono | any colour vision deficiency, including achromatopsia | greyscale chrome; colour survives only in syntax, terminal, and 41 risk-signal keys. |

### Two things these do that the upstream palettes do not

**Role collisions are fixed.** In `dark_colorblind` the `green` and `blue`
scales are byte-identical, and in `dark_tritanopia` so are `orange` and `red`.
A literal port puts `entity.name.tag` and `string` on the same hex. Each variant
re-slots the affected role onto a different step of the surviving hue.

**Separation is enforced, not assumed.** The build fails if any two of the ten
syntax roles are indistinguishable. Two roles pass if *any* of three channels
carries the difference: a luminance gap of 0.03, a hue gap of 70 degrees, or one
of them being near-neutral. Remapping hue alone — which is all the upstream
palettes do — leaves pairs that match in both hue and value.

**Colour is not the only channel.** Read-only symbols are bold in every
accessibility variant, so a constant stays identifiable with hue removed
entirely. Deprecated symbols are struck through in all six.

### What a theme cannot fix

These are settings, not colours. A theme has no access to them:

```jsonc
{
  // Force a minimum contrast ratio in the terminal, overriding program colours
  "terminal.integrated.minimumContrastRatio": 4.5,

  // Heavier glyphs help far more than brighter ones for low vision
  "editor.fontWeight": "500",
  "workbench.fontAliasing": "antialiased",

  // A wider caret is easier to track
  "editor.cursorWidth": 3,
  "editor.cursorBlinking": "solid",

  // Audio and announcement cues, independent of any visual signal
  "accessibility.signals.lineHasError": { "sound": "on" },
  "accessibility.signals.lineHasWarning": { "sound": "on" },

  // Structure without relying on colour
  "editor.guides.bracketPairs": "active",
  "editor.renderWhitespace": "boundary"
}
```
