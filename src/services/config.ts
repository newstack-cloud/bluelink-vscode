import * as vscode from 'vscode';

const CONFIG_SECTION = 'bluelink';

export class ConfigService {
  private get config(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(CONFIG_SECTION);
  }

  get languageServerPath(): string {
    return this.config.get<string>('languageServer.path', '');
  }

  get languageServerTrace(): 'off' | 'messages' | 'verbose' {
    return this.config.get<'off' | 'messages' | 'verbose'>('languageServer.trace', 'off');
  }

  get maxProblems(): number {
    return this.config.get<number>('languageServer.maxProblems', 100);
  }

  get pluginsEnabled(): boolean {
    return this.config.get<boolean>('plugins.enabled', false);
  }

  get pluginsPath(): string {
    return this.config.get<string>('plugins.pluginPath', '');
  }

  get pluginsLogFileRootDir(): string {
    return this.config.get<string>('plugins.logFileRootDir', '');
  }

  get showAnyTypeWarnings(): boolean {
    return this.config.get<boolean>('diagnostics.showAnyTypeWarnings', true);
  }

  get blueprintsTransformSpec(): boolean {
    return this.config.get<boolean>('blueprints.transformSpec', true);
  }

  get blueprintsValidateAfterTransform(): boolean {
    return this.config.get<boolean>('blueprints.validateAfterTransform', false);
  }

  get blueprintsDeployConfigFile(): string {
    return this.config.get<string>('blueprints.deployConfigFile', '');
  }

  get blueprintsDeployConfigFileNames(): string[] {
    return this.config.get<string[]>('blueprints.deployConfigFileNames', []);
  }

  onDidChange(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(CONFIG_SECTION)) {
        callback();
      }
    });
  }
}
