# Bluelink for VS Code

Official VS Code extension for [Bluelink](https://bluelink.dev) — an Infrastructure as Code framework.

## Features

- **Syntax highlighting** for Blueprint files (`.blueprint.yaml`, `.blueprint.yml`, `.blueprint.json`, `.blueprint.jsonc`, `.blueprint.hujson`, `.bp`, `.blueprint`)
- **Language Server integration** for diagnostics, completions, and more
- **IntelliSense** support within Blueprint substitution strings (`${...}`)
- **Plugin-aware LSP features** — completions, hover and diagnostics for resource types provided by provider and transformer plugins
- **Transformer-aware validation** — transformer plugins can be run during validation so editor diagnostics match those reported on the command line
- **Deploy configuration watching** — the language server is notified when deploy configuration changes, and open blueprints are revalidated

## Installation

### From VS Code Marketplace

Search for "Bluelink" in the VS Code Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).

### From VSIX

1. Download the `.vsix` file from the [releases page](https://github.com/newstack-cloud/bluelink-vscode/releases)
2. Run `code --install-extension bluelink-x.x.x.vsix`

## Requirements

- VS Code 1.90.0 or higher
- Blueprint Language Server (`blueprint-language-server` or `blueprint-ls`) installed and available in your PATH

## Supported File Types

| Extension | Language ID |
|-----------|-------------|
| `.blueprint.yaml`, `.blueprint.yml` | `blueprint` |
| `.blueprint.json` | `blueprint-json` |
| `.blueprint.jsonc`, `.blueprint.hujson` | `blueprint-jsonc` |
| `.blueprint`, `.bp` | `blueprintlang` |

## Extension Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `bluelink.languageServer.path` | Path to the Blueprint language server binary. Leave empty to use PATH. | `""` |
| `bluelink.languageServer.trace` | Traces communication between VS Code and the language server. Options: `off`, `messages`, `verbose` | `"off"` |
| `bluelink.languageServer.maxProblems` | Maximum number of problems reported by the server. | `100` |
| `bluelink.plugins.enabled` | Enable loading of provider and transformer plugins for rich LSP features. | `true` |
| `bluelink.plugins.pluginPath` | Path to plugin directories (colon-separated on Unix, semicolon on Windows). Falls back to `BLUELINK_DEPLOY_ENGINE_PLUGIN_PATH`. | `""` |
| `bluelink.plugins.logFileRootDir` | Directory for plugin log files. Falls back to `BLUELINK_DEPLOY_ENGINE_PLUGIN_LOG_FILE_ROOT_DIR`, then `$HOME/.bluelink/engine/plugins/logs`. | `""` |
| `bluelink.diagnostics.showAnyTypeWarnings` | Show warnings when substitutions resolve to the "any" type. | `true` |
| `bluelink.blueprints.transformSpec` | Run transformer plugins during blueprint validation, so editor diagnostics match those reported on the command line. Transformers only run for blueprints with a deploy configuration. | `true` |
| `bluelink.blueprints.deployConfigFile` | Path to the deploy configuration file to use for every blueprint, e.g. a per-environment `bluelink.deploy.dev.jsonc`. Relative paths are resolved against each project directory, searching upwards from the blueprint. Leave empty to use the conventional file names. | `""` |
| `bluelink.blueprints.deployConfigFileNames` | File names to search for when locating deploy configuration, in order of preference. Ignored when `bluelink.blueprints.deployConfigFile` is set. Leave empty to use the conventions. | `[]` |
| `bluelink.blueprints.validateAfterTransform` | Validate resources against the transformed blueprint shape. No effect unless `bluelink.blueprints.transformSpec` is also enabled. | `false` |

The language server is restarted automatically when any `bluelink.*` setting changes.

### Deploy configuration discovery

When `bluelink.blueprints.deployConfigFile` and `bluelink.blueprints.deployConfigFileNames` are both left empty, deploy configuration is located by searching upwards from each blueprint for these names, in order:

1. `bluelink.deploy.jsonc`
2. `bluelink.deploy.json`
3. `app.deploy.jsonc` (Celerity)
4. `app.deploy.json` (Celerity)
5. `.celerity/deploy-config.json` (Celerity)

Whichever names are in effect are watched for changes, so edits to deploy configuration revalidate open blueprints.

## Commands

| Command | Description |
|---------|-------------|
| `Bluelink: Restart Language Server` | Restart the Blueprint language server |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
