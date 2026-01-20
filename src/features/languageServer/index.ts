import * as vscode from 'vscode';
import type { Feature, FeatureContext } from '../../types';
import { BlueprintLanguageClient } from './client';
import { registerCommands } from './commands';

let client: BlueprintLanguageClient | null = null;

export const languageServerFeature: Feature = {
  async activate(context: FeatureContext): Promise<vscode.Disposable[]> {
    const { config, logger, outputChannel } = context;

    logger.info('Activating language server feature...');

    // Create and start the language client
    client = new BlueprintLanguageClient(config, logger, outputChannel);
    await client.start();

    // Register commands
    const commandDisposables = registerCommands(client, logger);

    // Listen for configuration changes
    const configChangeDisposable = config.onDidChange(async () => {
      logger.info('Configuration changed, restarting language server...');
      await client?.restart();
    });

    logger.info('Language server feature activated');

    return [
      ...commandDisposables,
      configChangeDisposable,
      new vscode.Disposable(() => {
        client?.stop();
      }),
    ];
  },

  async deactivate(): Promise<void> {
    if (client) {
      await client.stop();
      client = null;
    }
  },
};
