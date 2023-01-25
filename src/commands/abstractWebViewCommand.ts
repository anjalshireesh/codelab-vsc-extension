import * as vscode from 'vscode';
import { CommandParams } from '../models/commandParams';

export abstract class WebViewCommand implements vscode.Command {
  title: string;
  command: string;
  snippet: string;
  start: string;
  end: string;
  tooltip?: string | undefined;
  arguments?: any[] | undefined;

  constructor(params: CommandParams) {
    this.title = '';
    this.command = '';
    this.snippet = '';
    this.start = params.start;
    this.end = params.end;
  }

  generateHtml(): string {
    const stringified = JSON.stringify(this.arguments || '');
    const encoded = encodeURI(stringified);

    return `${this.start}${this.snippet}${this.end}<button class="command-btn" data-command="${this.command}" data-args="${encoded}" title="${
      this.tooltip || ''
    }">${this.title}</button>`;
  }
}
