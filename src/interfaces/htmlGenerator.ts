import * as vscode from 'vscode';

export interface IHtmlGenerator {
  generateHtml(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, document: vscode.TextDocument): Promise<string>;
  getLocalResourceRoots(): vscode.Uri[];
}
