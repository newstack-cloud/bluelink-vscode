# Bluelink for VS Code

Official VS Code extension for [Bluelink](https://bluelink.dev) - an Infrastructure as Code framework.

## Features

- **Syntax highlighting** for Blueprint files (`.blueprint.yaml`, `.blueprint.yml`, `.blueprint.json`, `.blueprint.jsonc`)
- **Language Server integration** for diagnostics, completions, and more
- **IntelliSense** support within Blueprint strings

## Installation

### From VS Code Marketplace

Search for "Bluelink" in the VS Code Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).

### From VSIX

1. Download the `.vsix` file from the [releases page](https://github.com/newstack-cloud/bluelink-vscode/releases)
2. Run `code --install-extension bluelink-x.x.x.vsix`

## Requirements

- VS Code 1.90.0 or higher
- Blueprint Language Server (`blueprint-language-server` or `blueprint-ls`) installed and available in your PATH

## Extension Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `bluelink.languageServer.path` | Path to the Blueprint language server binary. Leave empty to use PATH. | `""` |
| `bluelink.languageServer.trace` | Traces communication between VS Code and the language server. Options: `off`, `messages`, `verbose` | `"off"` |
| `bluelink.languageServer.maxProblems` | Maximum number of problems reported by the server. | `100` |

## Commands

| Command | Description |
|---------|-------------|
| `Bluelink: Restart Language Server` | Restart the Blueprint language server |

## Supported File Types

| Extension | Language ID |
|-----------|-------------|
| `.blueprint.yaml`, `.blueprint.yml` | `blueprint` |
| `.blueprint.json` | `blueprint-json` |
| `.blueprint.jsonc`, `.blueprint.hujson` | `blueprint-jsonc` |

## Development

### Prerequisites

- Node.js 18+
- Yarn

### Setup

```bash
# Install dependencies
yarn install

# Compile the extension
yarn compile
```

### Running

1. Open this folder in VS Code
2. Press `F5` to open a new VS Code window with the extension loaded
3. Open a Blueprint file to test the extension

### Scripts

| Script | Description |
|--------|-------------|
| `yarn compile` | Compile the extension |
| `yarn watch` | Watch for changes and recompile |
| `yarn package` | Package the extension for production |
| `yarn lint` | Run ESLint |
| `yarn test` | Run tests |

## License

This project is licensed under the [Apache License 2.0](LICENSE).
