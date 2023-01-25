import { CommandParams } from '../models/commandParams';
import { ExecuteIndexedCommand } from './executeIndexedCommand';

export class ExecuteCommand extends ExecuteIndexedCommand {
  constructor(params: CommandParams) {
    params.terminalIndex = -1;
    super(params);
    this.title = 'Execute';
    this.tooltip = 'Executes code snippet in first terminal';
  }
}
