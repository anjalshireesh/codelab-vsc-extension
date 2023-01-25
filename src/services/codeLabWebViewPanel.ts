import * as vscode from 'vscode';
import { FOLDER_MEDIA, TITLE_WEBVIEWPANEL, VIEWTYPE_MARKDOWN_PREVIEW } from '../consts';
import { IHtmlGenerator } from '../interfaces/htmlGenerator';
import { MarkdownHtmlGenerator } from './markdownHtmlGenerator';

export class CodeLabWebViewPanel {
  private _htmlGenerator: IHtmlGenerator = new MarkdownHtmlGenerator();
  private _panel: vscode.WebviewPanel | undefined;

  sourceDocument: vscode.TextDocument | undefined;

  static currentPanel: CodeLabWebViewPanel | undefined;

  static async create(context: vscode.ExtensionContext, preserveFocus: boolean): Promise<void> {
    let document;
    if (!(document = vscode.window.activeTextEditor?.document)) {
      return;
    }

    if (CodeLabWebViewPanel.currentPanel) {
      CodeLabWebViewPanel.currentPanel.dispose();
    }

    const codeLabPanel = new CodeLabWebViewPanel();
    await codeLabPanel.createWebViewPanel(context, document, preserveFocus);
    CodeLabWebViewPanel.currentPanel = codeLabPanel;
  }

  static async recreate(context: vscode.ExtensionContext): Promise<void> {
    this.currentPanel?.dispose();
    await this.create(context, true);
  }

  private async createWebViewPanel(context: vscode.ExtensionContext, document: vscode.TextDocument, preserveFocus: boolean): Promise<vscode.WebviewPanel> {
    const panel = vscode.window.createWebviewPanel(
      VIEWTYPE_MARKDOWN_PREVIEW,
      TITLE_WEBVIEWPANEL,
      { viewColumn: vscode.ViewColumn.Two, preserveFocus },
      this.getViewOptions(context, document.uri)
    );
    this.configurePanel(context, panel);
    panel.webview.html = await this._htmlGenerator.generateHtml(context, panel, document);
    this._panel = panel;
    this.sourceDocument = document;

    return panel;
  }

  private getViewOptions(context: vscode.ExtensionContext, sourceUri: vscode.Uri): vscode.WebviewOptions {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(sourceUri)?.uri;
    const resourceRoots = [
      vscode.Uri.file(context.extensionPath),
      vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA),
      ...this._htmlGenerator.getLocalResourceRoots()
    ];
    if (workspaceFolder) {
      resourceRoots.push(workspaceFolder);
    }

    return {
      enableScripts: true,
      localResourceRoots: resourceRoots
    };
  }

  dispose(): void {
    this._panel?.dispose();
    CodeLabWebViewPanel.currentPanel = undefined;
  }

  private configurePanel(context: vscode.ExtensionContext, panel: vscode.WebviewPanel): void {
    panel.iconPath = vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'preview.svg');
    panel.webview.onDidReceiveMessage((message) => this.handleMessage(message), null, context.subscriptions);
    panel.onDidDispose(() => (CodeLabWebViewPanel.currentPanel = undefined));
  }

  private handleMessage(message: any) {
    if (!message.command || !message.args) {
      return;
    }

    const decoded = decodeURI(message.args);
    const parsed = decoded ? JSON.parse(decoded) : '';
    vscode.commands.executeCommand(message.command, ...parsed);
  }
}
