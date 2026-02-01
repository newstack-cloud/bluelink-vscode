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
