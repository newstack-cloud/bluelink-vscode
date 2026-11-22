# Bluelink for VS Code

The VS Code extension for Bluelink blueprints: TextMate grammars for the YAML, JSON, JSONC and
`blueprintlang` forms, and a client for the Blueprint language server (`tools/blueprint-ls` in
bluelink). It's published to the VS Code Marketplace and Open VSX. Its `blueprintlang` grammar
is copied into bluelink-docs, celerity-docs and bluelink-registry's app.

## Workspace

This repo is one of NewStack's. NewStack's maintainers develop it alongside the others in a
shared workspace, using the NewStack Claude Code plugin for how work is planned, reviewed,
committed and coordinated across repos. The plugin isn't public, and nothing here depends on it:
this file and the repo's own docs cover what a contribution needs.

## Layout

| Path | Holds |
|---|---|
| `src/extension.ts`, `src/types/` | Activation, and the `Feature` interface features register through |
| `src/features/languageServer/` | The language client, its commands, restart on settings changes |
| `src/services/` | Settings and logging |
| `syntaxes/` | TextMate grammars; `injection.json` injects the substitution grammar `blueprintsub` into the YAML, JSON and JSONC grammars, while `blueprintlang` has its own interpolation and reference rules, so a substitution syntax change needs both |
| `language-configuration*.json` | Brackets, comments, indentation and auto-closing per language (JSON and JSONC share one file) |
| `package.json` `contributes` | Languages, grammars, commands and the `bluelink.*` settings |

## Checks

Commands are in [CONTRIBUTING.md](CONTRIBUTING.md).

- **Tools:** Node 22 or 24 (CI runs both), Yarn 1 (`yarn.lock` v1), VS Code to try it.
- **Checks:** `yarn package` runs what CI checks: `check-types`, `lint` (ESLint on `src`) and
  the production build. `yarn compile` does the same with a development build.
- **Tests:** there are none. `yarn test` builds (`pretest`) and then runs `vscode-test`, which
  has no config to run; don't treat it as a check.
- **Packaging:** CI runs `npx @vscode/vsce package --no-dependencies --yarn`, which runs
  `yarn package` again through `vscode:prepublish` and fails on manifest problems, such as an
  `@types/vscode` range in `package.json` above `engines.vscode`. It checks the declared range,
  not the version `yarn.lock` resolves (newer than 1.90), so neither it nor `check-types`
  catches use of an API VS Code 1.90 lacks.
- **Gates:** no git hooks and no commitlint. CI (`ci.yml`) runs the checks and packaging on
  pull requests and pushes to `main`.

## Running locally

Run `yarn install`, open the repo in VS Code and press F5: it runs the `watch` task and opens an
Extension Development Host with the extension loaded.

- The extension starts `blueprint-language-server`, then `blueprint-ls`, from `PATH` (the first
  found wins), or `bluelink.languageServer.path`.
- With `bluelink.plugins.enabled` (the default), the server launches the plugin binaries under
  `bluelink.plugins.pluginPath`, or `BLUELINK_DEPLOY_ENGINE_PLUGIN_PATH` from VS Code's own
  environment when that's empty; with neither, no plugins load. Plugin logs default to
  `$HOME/.bluelink/engine/plugins/logs`.
- Changing any `bluelink.*` setting restarts the server and its plugins.

## Compatibility

- **Settings:** the `bluelink.*` settings are what users have configured. Additive only; a
  rename needs a fallback for the old name. The server reads them only from the
  `initializationOptions` that `client.ts` builds (`plugins`, `diagnostics`, `blueprints`): a
  new setting needs a field there and in blueprint-ls's `pluginhost.InitializationOptions`.
  blueprint-ls ignores fields it doesn't know and keeps its default for missing ones, so new
  options are safe with older servers. `bluelink.languageServer.trace` and `maxProblems` are
  contributed but not used.
- **Language server:** the extension starts whatever server users have installed, so it must
  work with released language servers.
- **Grammars:** blueprint syntax changes in bluelink's `libs/blueprint` need the grammars here
  updated, then this repo's `blueprintlang.tmLanguage.json` copied by hand to bluelink-docs and
  celerity-docs (`grammars/`) and bluelink-registry (`applications/registry-app/src/grammars/`).
- **Persisted state:** none.

## Conventions

- Commits: conventional commits, for release-please (`CONTRIBUTING.md`). Pre-1.0 with
  `bump-patch-for-minor-pre-major`, so a `feat` bumps the patch version and a breaking change
  the minor.
- Releases: merging the release-please pull request tags the release, attaches the VSIX and
  publishes to the Marketplace, and to Open VSX when the `OVSX_PAT` secret is set. Don't edit
  `CHANGELOG.md`, the version in `package.json` or `.release-please-manifest.json` by hand.

## Safety

- Don't publish (`vsce publish`, `ovsx publish`), create tags or releases, or merge release
  pull requests.
- When running the extension, set `bluelink.plugins.pluginPath` to a scratch directory or
  `bluelink.plugins.enabled` to false, unless asked: an empty path falls back to
  `BLUELINK_DEPLOY_ENGINE_PLUGIN_PATH`, which may name a running engine's plugins, and extra
  plugin processes write to the engine's log directory and confuse checks for whether the
  engine is running.

## Known mistakes

<!-- One line per mistake an agent has made here, phrased as the rule that prevents it. -->
