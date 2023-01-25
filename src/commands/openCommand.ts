import { COMMAND_OPEN } from '../consts';
import { CommandParams } from '../models/commandParams';
import { WebViewCommand } from './abstractWebViewCommand';

export class OpenCommand extends WebViewCommand {
  constructor(params: CommandParams) {
    super(params);
    this.title = 'Open';
    this.command = COMMAND_OPEN;
    this.snippet = params.snippet;
    this.arguments = [params.snippet];
  }
}
