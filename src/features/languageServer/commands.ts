import * as vscode from 'vscode';
import { BlueprintLanguageClient } from './client';
import { Logger } from '../../services/logger';

export function registerCommands(
  client: BlueprintLanguageClient,
  logger: Logger
): vscode.Disposable[] {
  const restartCommand = vscode.commands.registerCommand(
    'bluelink.languageServer.restart',
    async () => {
      logger.info('Restart language server command invoked');
      try {
        await client.restart();
        vscode.window.showInformationMessage('Bluelink language server restarted');
      } catch (error) {
        const message = `Failed to restart language server: ${error}`;
        logger.error(message);
        vscode.window.showErrorMessage(message);
      }
    }
  );

  return [restartCommand];
}
