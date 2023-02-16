import * as vscode from 'vscode';
import { FOLDER_MEDIA } from './consts';
import { IHtmlGenerator } from './interfaces/htmlGenerator';
import { MarkdownHtmlGenerator } from './services/markdownHtmlGenerator';

export class CodeLabEditorProvider implements vscode.CustomTextEditorProvider {
	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	private _htmlGenerator: IHtmlGenerator = new MarkdownHtmlGenerator();
	private static readonly viewType = 'codelab.editor';

	/**
	 * Called when our custom editor is opened.
	 * 
	 * 
	 */
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		};
    		
		this.configurePanel(this.context, webviewPanel);
    		webviewPanel.webview.html = await this._htmlGenerator.generateHtml(this.context, webviewPanel, document);

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'update',
				text: document.getText(),
			});
		}

		// Hook up event handlers so that we can synchronize the webview with the text document.
		//
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		// 
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		updateWebview();
	}

	private configurePanel(context: vscode.ExtensionContext, panel: vscode.WebviewPanel): void {
	panel.iconPath = vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'preview.svg');
	panel.webview.onDidReceiveMessage((message) => this.handleMessage(message), null, context.subscriptions);
	}

	private handleMessage(message: any) {
		if (!message.command || !message.args) {
		return;
		}

		const decoded = decodeURI(message.args);
		const parsed = decoded ? JSON.parse(decoded) : '';
		vscode.commands.executeCommand(message.command, ...parsed);
	}

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new CodeLabEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(CodeLabEditorProvider.viewType, provider);
		return providerRegistration;
	}
}