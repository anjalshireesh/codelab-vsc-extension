import { WebViewCommand } from '../commands/abstractWebViewCommand';
import { CopyCommand } from '../commands/copyCommand';
import { ExecuteCommand } from '../commands/executeCommand';
import { ExecuteIndexedCommand } from '../commands/executeIndexedCommand';
import { ExecuteInterruptCommand } from '../commands/executeInterruptCommand';
import { ExecuteInterruptIndexedCommand } from '../commands/executeInterruptIndexedCommand';
import { NoOpCommand } from '../commands/noOpCommand';
import { OpenCommand } from '../commands/openCommand';
import { CommandSubType } from '../enums/commandSubType';
import { CommandType } from '../enums/commandType';
import { CommandParams } from '../models/commandParams';

export class CommandFactory {
  createCommmand(params: CommandParams): WebViewCommand {
    switch (params.commandType) {
      case CommandType.Copy:
        return new CopyCommand(params);
      case CommandType.Open:
        return new OpenCommand(params);
      case CommandType.Execute:
        switch (params.commandSubType) {
          case CommandSubType.None:
            return params.isIndexed ? new ExecuteIndexedCommand(params) : new ExecuteCommand(params);
          case CommandSubType.Interrupt:
            return params.isIndexed ? new ExecuteInterruptIndexedCommand(params) : new ExecuteInterruptCommand(params);
        }
    }

    return new NoOpCommand(params);
  }
}
