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

  onDidChange(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(CONFIG_SECTION)) {
        callback();
      }
    });
  }
}
