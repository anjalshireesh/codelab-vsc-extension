import * as vscode from 'vscode';
import { COMMAND_COPY_CLIPBOARD, COMMAND_EXECUTE, COMMAND_EXECUTE_INTERRUPT, COMMAND_OPEN, COMMAND_PREVIEW } from './consts';
import { InfoMessage } from './enums/infoMessages';
import { CodeLabCodeLensProvider } from './services/codeLabcodelensProvider';
import { ErrorMessage } from './enums/errorMessages';
import path = require('path');
import { OpenRelativeConfig } from './enums/openRelativeConfig';
import { CodeLabConfig } from './models/config';
import { CodeLabWebViewPanel } from './services/codeLabWebViewPanel';
import { Helper } from './services/helper';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { CodeLabEditorProvider } from './codeLabEditor';

const changeTextSubject = new Subject<vscode.TextDocumentChangeEvent>();
const subscription = new Subscription();
let config: CodeLabConfig;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      {
        scheme: 'file',
        language: 'markdown'
      },
      new CodeLabCodeLensProvider()
    )
  );
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((_) => (config = CodeLabConfig.getCurrentConfig())));
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => changeTextSubject.next(event)));
  context.subscriptions.push(vscode.commands.registerCommand(COMMAND_COPY_CLIPBOARD, onCopy));
  context.subscriptions.push(vscode.commands.registerCommand(COMMAND_EXECUTE, onExecute));
  context.subscriptions.push(vscode.commands.registerCommand(COMMAND_EXECUTE_INTERRUPT, onExecuteInterrupt));
  context.subscriptions.push(vscode.commands.registerCommand(COMMAND_OPEN, onOpen));
  context.subscriptions.push(vscode.commands.registerCommand(COMMAND_PREVIEW, (_) => onPreview(context)));

  subscription.add(changeTextSubject.pipe(debounceTime(300)).subscribe((event) => onDidChangeTextDocument(event, context)));

  CodeLabEditorProvider.register(context);

  config = CodeLabConfig.getCurrentConfig();
}

async function onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent, context: vscode.ExtensionContext): Promise<void> {
  if (
    !CodeLabWebViewPanel.currentPanel ||
    !Helper.isMarkdownFile(event.document) ||
    CodeLabWebViewPanel.currentPanel.sourceDocument?.uri !== event.document.uri
  ) {
    return;
  }

  await CodeLabWebViewPanel.recreate(context);
}

function onCopy(snippet: string): void {
  // Source: https://stackoverflow.com/questions/44175461/get-selected-text-into-a-variable-vscode#
  const editor = vscode.window.activeTextEditor;
  const selection = editor?.selection;
  const text = editor?.document.getText(selection) || '';

  const textToCopy = snippet ?? text;

  vscode.env.clipboard.writeText(textToCopy).then(
    () => vscode.window.showInformationMessage(InfoMessage.CopyToClipboard),
    (err) => vscode.window.showErrorMessage(err.message)
  );
}

function onExecute(index: number, snippet: string): void {
  if (!vscode.window.terminals.length) {
    vscode.window.createTerminal();
  }

  let terminal: vscode.Terminal | undefined;
  if (index < 0) {
    terminal = vscode.window.activeTerminal || vscode.window.terminals[0];
  } else {
    const realIndex = Math.min(index, vscode.window.terminals.length - 1);
    terminal = vscode.window.terminals[realIndex];
  }

  terminal?.show();
  terminal?.sendText(snippet);
}

function onExecuteInterrupt(index: number, snippet: string): void {
  if (vscode.window.terminals.length <= index) {
    vscode.window.showErrorMessage(ErrorMessage.TerminalToInterruptNotExist);
  }

  const terminal = index >= 0 ? vscode.window.terminals[index] : vscode.window.activeTerminal || vscode.window.terminals[0];
  terminal.show();
  terminal.sendText('\u0003');
  setTimeout(() => terminal.sendText(snippet), config.interruptDelay);
}

async function onOpen(filePath: string): Promise<void> {
  try {
    if (path.isAbsolute(filePath)) {
      await openDocument(filePath);
    } else {
      switch (config.openRelativeConfig) {
        case OpenRelativeConfig.File:
          const fsPath = vscode.window.activeTextEditor?.document.uri.fsPath || CodeLabWebViewPanel.currentPanel?.sourceDocument?.uri.fsPath;
          if (fsPath) {
            await openDocument(path.join(path.dirname(fsPath), filePath));
          }
          break;
        case OpenRelativeConfig.Workspace:
          const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0];
          if (workspaceFolder) {
            await openDocument(path.join(workspaceFolder.uri.fsPath, filePath));
          }
          break;
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message?.includes('non-exist')) {
      vscode.window.showErrorMessage(ErrorMessage.FileNotExist);
    } else {
      vscode.window.showErrorMessage(ErrorMessage.OpenDocumentFailure);
    }
  }
}

async function openDocument(filePath: string) {
  const uri = vscode.Uri.file(filePath);
  const doc = await vscode.workspace.openTextDocument(uri);
  vscode.window.showTextDocument(doc, vscode.ViewColumn.One);
}

async function onPreview(context: vscode.ExtensionContext): Promise<void> {
  await CodeLabWebViewPanel.create(context, false);
}

export function deactivate() {
  subscription.unsubscribe();
}
