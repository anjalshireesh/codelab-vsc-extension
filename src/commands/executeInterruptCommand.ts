import { CommandParams } from '../models/commandParams';
import { ExecuteInterruptIndexedCommand } from './executeInterruptIndexedCommand';

export class ExecuteInterruptCommand extends ExecuteInterruptIndexedCommand {
  constructor(params: CommandParams) {
    params.terminalIndex = -1;
    super(params);
    this.title = 'Execute interrupt';
    this.tooltip = 'Interrupts first terminal and executes code snippet';
  }
}
