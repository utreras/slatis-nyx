# Slatis Nyx for Zed

All six variants, generated from the VS Code themes by `npm run build:zed`.
Zed's contract is unrelated to VS Code's: 142 style keys, 46 syntax node names
borrowed from tree-sitter, and colours that always carry an alpha byte.

## Install locally

Command palette → **zed: install dev extension** → pick this `zed/` folder.
Then **theme selector** → any `Slatis Nyx` variant.

## What carries over

The accessibility variants port themselves. Roles are read back out of each VS
Code theme rather than hardcoded, so Deuteranopia keeps green resolving to blue
and red to amber in Zed's syntax tree, its terminal, and its `diff.plus` /
`diff.minus` gutter.

The two schemas disagree in places, and where they do the Zed side wins:

| VS Code | Zed |
|---|---|
| `entity.name.tag` | `tag` and `selector` |
| `constant.numeric`, `constant.language`, `support.type` | one `constant` family plus `number`, `boolean`, `type`, `enum`, `variant` |
| semantic `variable.readonly` | no modifier layer, so read-only symbols lose the bold channel |
| 469 keys of workbench chrome | 142 style keys, no per-widget control |

## Publish

Zed's registry takes a pull request against
[`zed-industries/extensions`](https://github.com/zed-industries/extensions)
adding this repository as a submodule with `path = "zed"`.
