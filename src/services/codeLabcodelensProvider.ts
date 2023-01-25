import * as vscode from 'vscode';
import { CommandFactory } from './commandFactory';
import { Helper } from './helper';
import { REGEXP_COMMANDS } from '../consts';
import { CodeLabConfig } from '../models/config';

export class CodeLabCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  private _commandFactory = new CommandFactory();

  onDidChangeCodeLenses?: vscode.Event<void> | undefined = this._onDidChangeCodeLenses.event;

  provideCodeLenses(document: vscode.TextDocument, _: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
    if (!CodeLabConfig.getCurrentConfig().activateCodeLense) {
      return [];
    }

    const text = document.getText();
    const codeLenses: vscode.CodeLens[] = [];
    Helper.processCommandMatches(text, (params) => {
      const command = this._commandFactory.createCommmand(params);
      const position = document.positionAt(params.matchPosition);
      const range = document.getWordRangeAtPosition(position, new RegExp(REGEXP_COMMANDS));
      if (range) {
        codeLenses.push(new vscode.CodeLens(range, command));
      }
    });

    return codeLenses;
  }
}
