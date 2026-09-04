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
