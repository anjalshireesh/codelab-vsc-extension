import { CommandSubType } from '../enums/commandSubType';
import { CommandType } from '../enums/commandType';

export class CommandParams {
  start: string;
  end: string;
  commandType: CommandType;
  commandSubType: CommandSubType;
  snippet: string;
  isIndexed: boolean;
  terminalIndex: number;
  matchPosition: number;
  firstMatch: string;

  constructor(
    start: string,
    end: string,
    commandType: CommandType,
    commandSubType: CommandSubType,
    snippet: string,
    isIndexed: boolean,
    terminalIndex: number,
    matchPosition: number,
    firstMatch: string
  ) {
    this.start = start;
    this.end = end;
    this.commandType = commandType;
    this.commandSubType = commandSubType;
    this.snippet = snippet;
    this.isIndexed = isIndexed;
    this.terminalIndex = terminalIndex;
    this.matchPosition = matchPosition;
    this.firstMatch = firstMatch;
  }
}
