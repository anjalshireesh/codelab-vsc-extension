import { COMMAND_COPY_CLIPBOARD } from '../consts';
import { CommandParams } from '../models/commandParams';
import { WebViewCommand } from './abstractWebViewCommand';

export class CopyCommand extends WebViewCommand {
  constructor(params: CommandParams) {
    super(params);
    this.title = 'Copy';
    this.command = COMMAND_COPY_CLIPBOARD;
    this.snippet = params.snippet;
    this.tooltip = 'Copies code snippet to clipboard';
    this.arguments = [params.snippet];
  }
}
