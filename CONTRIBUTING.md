# Contributing to Bluelink for VS Code

## Prerequisites

- Node.js 22+
- Yarn
- VS Code

## Setup

```bash
# Install dependencies
yarn install

# Compile the extension
yarn compile
```

## Running

1. Open this folder in VS Code
2. Press `F5` to open a new VS Code window with the extension loaded
3. Open a Blueprint file to test the extension

## Scripts

| Script | Description |
|--------|-------------|
| `yarn compile` | Type check, lint, and compile the extension |
| `yarn watch` | Watch for changes and recompile |
| `yarn package` | Production build (type check + lint + minified bundle) |
| `yarn lint` | Run ESLint |
| `yarn check-types` | Run TypeScript type checking only |
| `yarn test` | Run tests |

## Project Structure

```
src/
  extension.ts              # Extension entry point
  features/
    languageServer/
      client.ts             # Language Server Protocol client
      commands.ts           # Command handlers
      index.ts              # Feature module export
  services/
    config.ts               # Configuration service
    logger.ts               # Logging service
  types/
    index.ts                # TypeScript interfaces
syntaxes/                   # TextMate grammar definitions
resources/icons/            # Extension icons
```

## Release Process

This project uses [release-please](https://github.com/googleapis/release-please) to automate releases. Use [conventional commits](https://www.conventionalcommits.org/) when committing changes:

- `feat: ...` — new feature (bumps minor/patch version)
- `fix: ...` — bug fix (bumps patch version)
- `chore: ...` — maintenance (no version bump)
- `feat!: ...` or `BREAKING CHANGE:` — breaking change (bumps minor version while pre-1.0)

When conventional commits are merged to `main`, release-please automatically creates a Release PR that bumps the version and updates the changelog. Merging the Release PR triggers publishing to the VS Code Marketplace.
