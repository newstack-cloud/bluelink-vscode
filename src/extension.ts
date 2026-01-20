import * as vscode from 'vscode';
import type { Feature, FeatureContext } from './types';
import { ConfigService } from './services/config';
import { Logger } from './services/logger';

// Import features
import { languageServerFeature } from './features/languageServer';

// Register all features here
const features: Feature[] = [
  languageServerFeature,
  // Add future features here
];

let outputChannel: vscode.OutputChannel;
let logger: Logger;

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  outputChannel = vscode.window.createOutputChannel('Bluelink');
  logger = new Logger(outputChannel);
  const config = new ConfigService();

  logger.info('Activating Bluelink extension...');

  const featureContext: FeatureContext = {
    extensionContext: context,
    outputChannel,
    config,
    logger,
  };

  // Activate all features
  for (const feature of features) {
    try {
      const disposables = await feature.activate(featureContext);
      disposables.forEach((d) => context.subscriptions.push(d));
    } catch (error) {
      logger.error(`Failed to activate feature: ${error}`);
    }
  }

  logger.info('Bluelink extension activated');
}

export async function deactivate(): Promise<void> {
  logger?.info('Deactivating Bluelink extension...');

  // Deactivate all features in reverse order
  for (const feature of [...features].reverse()) {
    try {
      await feature.deactivate?.();
    } catch (error) {
      logger?.error(`Failed to deactivate feature: ${error}`);
    }
  }

  logger?.info('Bluelink extension deactivated');
}
