import { COMMAND_EXECUTE } from '../consts';
import { CommandParams } from '../models/commandParams';
import { WebViewCommand } from './abstractWebViewCommand';

export class ExecuteIndexedCommand extends WebViewCommand {
  constructor(params: CommandParams) {
    super(params);
    const terminalNumber = params.terminalIndex + 1;
    this.title = `Execute in T${terminalNumber}`;
    this.command = COMMAND_EXECUTE;
    this.snippet = params.snippet;
    this.tooltip = `Executes code snippet in terminal ${terminalNumber}`;
    this.arguments = [params.terminalIndex, params.snippet];
  }
}
