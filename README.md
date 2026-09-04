<div align="center">
  <img src="media/SlatisNyx_Repo.png" alt="Slatis Nyx" width="210" /><br/>
  <h3>Six dark variants, three of them built for colour vision deficiency</h3>
  <p>Mantained by <a href="https://github.com/utreras">@utreras</a></p>
  <p>
    <a href="https://marketplace.visualstudio.com/items?itemName=utreras.slatis-nyx"><img src="https://img.shields.io/badge/marketplace-Slatis%20Nyx-4589FF?style=flat&logo=visualstudiocode&logoColor=white" alt="VS Code Marketplace"/></a>&nbsp;
    <a href="https://open-vsx.org/extension/utreras/slatis-nyx"><img src="https://img.shields.io/badge/open%20vsx-Slatis%20Nyx-4589FF?style=flat&logo=eclipseide&logoColor=white" alt="Open VSX"/></a>&nbsp;
    <img src="https://img.shields.io/badge/VS%20Code-%5E1.70-4589FF?style=flat" alt="VS Code ^1.70"/>&nbsp;
    <img src="https://img.shields.io/badge/variants-6-64748B?style=flat" alt="6 variants"/>&nbsp;
    <img src="https://img.shields.io/badge/colour%20keys-469-64748B?style=flat" alt="469 colour keys"/>&nbsp;
    <img src="https://img.shields.io/badge/a11y-colourblind%20safe-22C55E?style=flat" alt="colourblind safe"/>&nbsp;
    <img src="https://img.shields.io/badge/license-MIT-22C55E?style=flat" alt="MIT"/>
  </p>
</div>

---

> A gift from Slatis engineers to other engineers who work while everyone sleeps.
>
> Nyx was the goddess of night, and in every telling, night is not the absence
> of something. It is its own thing, first-born, with its own weather. The room
> gets quiet, the meetings stop, and what is left is you and the problem(s).

## Why?

Around 1 in 12 men & 1 in 200 women have some form of colour vision deficiency, and syntax
highlighting asks them to pull meaning out of hue for eight hours a day. Most
themes hand them two roles painted the same colour and ship it.

Slatis Nyx generates six variants from one source palette. Three target a
specific deficiency, one drops colour out of the interface completely, and the
build refuses to finish when two syntax roles could read as the same colour.

## Features

- Functions render purple `#c9a3f0`, so the
  interface accent and the code never share a hue.
- **Borders:** Two bands with one rule: `#2c2e2d` for
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

Syntax highlighting asks them to pull meaning out of hue for eight
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

### Every palette was measured

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

Search `Slatis Nyx` in the Extensions view and install it. Then press
`Cmd+K Cmd+T` (`Ctrl+K Ctrl+T` on Windows and Linux) and pick a variant.

From a terminal:

```bash
code --install-extension utreras.slatis-nyx       # Visual Studio Code
cursor --install-extension utreras.slatis-nyx     # Cursor
windsurf --install-extension utreras.slatis-nyx   # Windsurf
codium --install-extension utreras.slatis-nyx     # VSCodium
```

Published to both registries, so every VS Code-compatible editor can reach it:

| Editor | Pulls from |
|---|---|
| Visual Studio Code | [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=utreras.slatis-nyx) |
| Cursor | [Open VSX](https://open-vsx.org/extension/utreras/slatis-nyx) |
| Windsurf | [Open VSX](https://open-vsx.org/extension/utreras/slatis-nyx) |
| VSCodium, Gitpod, code-server, Eclipse Theia | [Open VSX](https://open-vsx.org/extension/utreras/slatis-nyx) |

Editors that ship their own registry mirror Open VSX, so one publish there
covers all of them. Grabbing the `.vsix` from either page and running
**Extensions: Install from VSIX** works everywhere as a fallback.


## License

MIT

---

<div align="center">
  <p>Built by the engineers at <a href="https://www.slatis.com">Slatis</a>, for the ones still typing at 3am.<br/>
  <a href="https://www.slatis.com">www.slatis.com</a></p>
</div>
