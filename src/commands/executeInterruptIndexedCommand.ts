import { COMMAND_EXECUTE_INTERRUPT } from '../consts';
import { CommandParams } from '../models/commandParams';
import { WebViewCommand } from './abstractWebViewCommand';

export class ExecuteInterruptIndexedCommand extends WebViewCommand {
  constructor(params: CommandParams) {
    super(params);
    const terminalNumber = params.terminalIndex + 1;
    this.title = `Execute interrupt in T${terminalNumber}`;
    this.command = COMMAND_EXECUTE_INTERRUPT;
    this.snippet = params.snippet;
    this.tooltip = `Interrupts terminal ${terminalNumber} and executes code snippet`;
    this.arguments = [params.terminalIndex, params.snippet];
  }
}
