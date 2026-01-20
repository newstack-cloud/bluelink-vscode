import * as vscode from 'vscode';
import { ConfigService } from '../services/config';
import { Logger } from '../services/logger';

/**
 * Context provided to each feature module during activation.
 */
export interface FeatureContext {
  /** The extension context from VSCode */
  extensionContext: vscode.ExtensionContext;
  /** Output channel for logging */
  outputChannel: vscode.OutputChannel;
  /** Configuration service for reading settings */
  config: ConfigService;
  /** Logger instance */
  logger: Logger;
}

/**
 * Interface that each feature module must implement.
 */
export interface Feature {
  /** Activate the feature and return disposables to be cleaned up */
  activate(context: FeatureContext): Promise<vscode.Disposable[]> | vscode.Disposable[];
  /** Optional deactivation hook for cleanup */
  deactivate?(): Promise<void> | void;
}
