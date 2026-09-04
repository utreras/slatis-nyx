# Contributing

## Build

`themes/slatis-nyx-color-theme.json` is the only file edited by hand. The other
five variants are generated:

```bash
npm run build
```

`scripts/build-variant.js` derives Dimmed and the three accessibility variants
through hex substitution maps, and Mono by snapping chroma onto a grey ramp by
luminance. Three checks run before anything is written:

- no source-palette colour survives in a derived variant
- Mono chrome holds nothing chromatic outside terminal, symbol icons and the 41
  risk-signal keys
- no two of the ten syntax roles in an accessibility variant could read as the
  same colour

Any of the three fails the build.

## Adding a colour

Add it to the source theme. If it belongs to a variant's substitution map, add
the mapping in the same commit. The leak check will tell you when you forgot.

## Publish

```bash
npx @vscode/vsce package
npx @vscode/vsce publish          # Visual Studio Marketplace
npx ovsx publish *.vsix -p $OVSX_TOKEN   # Open VSX
```

`package.json` changes need `CachedProfilesData/<profile>/extensions.user.cache`
deleted before VS Code will notice them locally. Theme colour edits only need a
window reload.

## Release

Tagging is the whole release process:

```bash
npm version patch      # or minor / major
git push --follow-tags
```

`.github/workflows/publish.yml` rebuilds the derived variants, fails when they
differ from what is committed, packages, and publishes to both registries.

Two repository secrets are required:

| Secret | Where it comes from |
|---|---|
| `VSCE_PAT` | Azure DevOps personal access token, scope **Marketplace: Manage** |
| `OVSX_PAT` | open-vsx.org profile → Access Tokens |

The Open VSX namespace has to exist before the first publish:

```bash
npx ovsx create-namespace utreras -p $OVSX_PAT
```
