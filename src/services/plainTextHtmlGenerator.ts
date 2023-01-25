import * as vscode from 'vscode';
import { FOLDER_MEDIA } from '../consts';
import { Helper } from './helper';
import { IHtmlGenerator } from '../interfaces/htmlGenerator';
import { CommandFactory } from './commandFactory';

export class PlainTextHtmlGenerator implements IHtmlGenerator {
  private _commandFactory = new CommandFactory();

  generateHtml(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, document: vscode.TextDocument): Promise<string> {
    const nonce = this.getNonce();
    const documentText = document.getText();
    let htmlText = documentText;
    Helper.processCommandMatches(documentText, (params) => {
      const command = this._commandFactory.createCommmand(params);
      const buttonHtml = command.generateHtml();
      htmlText = htmlText.replace(params.firstMatch, buttonHtml);
    });
    htmlText = htmlText.replace(new RegExp(/(\r\n|\n)/, 'g'), '<br>');

    const resetCss = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'reset.css'));
    const vscodeCss = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'vscode.css'));
    const stylesCss = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'styles.css'));
    const script = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'script.js'));

    return Promise.resolve(`<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${panel.webview.cspSource}; img-src ${panel.webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${resetCss}" rel="stylesheet">
        <link href="${vscodeCss}" rel="stylesheet">
        <link href="${stylesCss}" rel="stylesheet">
				<title>CodeLab</title>
			</head>
			<body>
        <p>${htmlText}</p>
        <script nonce="${nonce}" src="${script}"></script>
			</body>
			</html>`);
  }

  getLocalResourceRoots(): vscode.Uri[] {
    return [];
  }

  private getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
