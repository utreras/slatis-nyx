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
