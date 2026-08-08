import * as vscode from 'vscode';
import which from 'which';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from 'vscode-languageclient/node';
import { ConfigService } from '../../services/config';
import { Logger } from '../../services/logger';

const LANGUAGE_SERVER_BINARIES = ['blueprint-language-server', 'blueprint-ls'];

// Deploy configuration file names the server searches for by default: the
// conventional Bluelink file, then Celerity's authoring file and the file
// Celerity generates from it.
const DEFAULT_DEPLOY_CONFIG_PATHS = [
  'bluelink.deploy.jsonc',
  'bluelink.deploy.json',
  'app.deploy.jsonc',
  'app.deploy.json',
  '.celerity/deploy-config.json',
];

/**
 * Builds the watch patterns for deploy configuration.
 *
 * A change to deploy configuration can alter diagnostics for every open
 * blueprint, so the server is notified and revalidates. The patterns follow
 * whatever the server will actually search for, so a project using its own
 * names or a per-environment file is watched too.
 */
function deployConfigGlobs(config: ConfigService): string[] {
  const configured = [
    ...config.blueprintsDeployConfigFileNames,
    config.blueprintsDeployConfigFile,
  ].filter((path) => path.length > 0);

  const paths = configured.length > 0 ? configured : DEFAULT_DEPLOY_CONFIG_PATHS;

  return paths.map((path) =>
    // An absolute path is watched as given; a relative one may sit at any level,
    // matching the server's upward search.
    path.startsWith('/') ? path : `**/${path}`
  );
}

/**
 * Resolves the language server binary path.
 * Priority:
 * 1. User-configured path (bluelink.languageServer.path)
 * 2. System PATH (blueprint-language-server or blueprint-ls)
 */
async function resolveLanguageServerPath(
  config: ConfigService,
  logger: Logger
): Promise<string | null> {
  // Check user-configured path first
  const configuredPath = config.languageServerPath;
  if (configuredPath) {
    logger.info(`Using configured language server path: ${configuredPath}`);
    return configuredPath;
  }

  // Try to find in PATH
  for (const binary of LANGUAGE_SERVER_BINARIES) {
    try {
      const resolvedPath = await which(binary);
      logger.info(`Found language server in PATH: ${resolvedPath}`);
      return resolvedPath;
    } catch {
      // Binary not found, try next
    }
  }

  return null;
}

export class BlueprintLanguageClient {
  private client: LanguageClient | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger,
    private readonly outputChannel: vscode.OutputChannel
  ) {}

  async start(): Promise<void> {
    const serverPath = await resolveLanguageServerPath(this.config, this.logger);

    if (!serverPath) {
      const message = `Blueprint language server not found. Please install it or set 'bluelink.languageServer.path' in settings. Looked for: ${LANGUAGE_SERVER_BINARIES.join(', ')}`;
      this.logger.error(message);
      vscode.window.showErrorMessage(message);
      return;
    }

    const serverOptions: ServerOptions = {
      command: serverPath,
    };

    const clientOptions: LanguageClientOptions = {
      documentSelector: [
        { scheme: 'file', language: 'blueprint' },
        { scheme: 'file', language: 'blueprint-jsonc' },
        { scheme: 'file', language: 'blueprint-json' },
        { scheme: 'file', language: 'blueprintlang' },
      ],
      diagnosticCollectionName: 'bluelink',
      outputChannel: this.outputChannel,
      initializationOptions: {
        plugins: {
          enabled: this.config.pluginsEnabled,
          pluginPath: this.config.pluginsPath || undefined,
          logFileRootDir: this.config.pluginsLogFileRootDir || undefined,
        },
        diagnostics: {
          showAnyTypeWarnings: this.config.showAnyTypeWarnings,
        },
        blueprints: {
          transformSpec: this.config.blueprintsTransformSpec,
          validateAfterTransform: this.config.blueprintsValidateAfterTransform,
          deployConfigFile: this.config.blueprintsDeployConfigFile || undefined,
          deployConfigFileNames:
            this.config.blueprintsDeployConfigFileNames.length > 0
              ? this.config.blueprintsDeployConfigFileNames
              : undefined,
        },
      },
      // Deploy configuration selects the deploy target transformer plugins
      // emit for, so the server needs to know when it changes. Watching it
      // here keeps the server free of any workspace layout assumptions.
      synchronize: {
        fileEvents: deployConfigGlobs(this.config).map((glob) =>
          vscode.workspace.createFileSystemWatcher(glob)
        ),
      },
    };

    this.client = new LanguageClient(
      'bluelink',
      'Bluelink Language Server',
      serverOptions,
      clientOptions
    );

    this.logger.info('Starting language client...');
    await this.client.start();
    this.logger.info('Language client started');
  }

  async stop(): Promise<void> {
    if (this.client) {
      this.logger.info('Stopping language client...');
      await this.client.stop();
      this.client = null;
      this.logger.info('Language client stopped');
    }
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }

  isRunning(): boolean {
    return this.client !== null && this.client.isRunning();
  }
}
