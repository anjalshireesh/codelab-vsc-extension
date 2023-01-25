import * as vscode from 'vscode';
import { REGEXP_COMMANDS } from '../consts';
import { CommandSubType } from '../enums/commandSubType';
import { CommandType } from '../enums/commandType';
import { CommandParams } from '../models/commandParams';

export class Helper {
  static processMatches(regex: string | RegExp, text: string, operation: (matches: RegExpExecArray) => void) {
    const regExp = new RegExp(regex);
    let matches;
    while ((matches = regExp.exec(text)) && matches?.length) {
      operation(matches);
    }
  }

  static processCommandMatches(text: string, operation: (params: CommandParams) => void) {
    this.processMatches(REGEXP_COMMANDS, text, (matches) => {
      if (matches.groups) {
        const start = matches.groups['start'] || '';
        const end = matches.groups['end'] || '';
        const snippet = matches.groups['snippet'] || '';
        const commandTypeString = matches.groups['commandType'] || '';
        const commandSubTypeString = matches.groups['commandSubType'] || '';
        const terminalNumber = matches.groups['terminalNumber'] || '';
        if (!snippet || !commandTypeString) {
          return;
        }

        const commandType = (commandTypeString.toUpperCase() as CommandType) || CommandType.None;
        const commandSubType = (commandSubTypeString.toUpperCase() as CommandSubType) || CommandSubType.None;
        const isIndexed = !!terminalNumber;
        const index = isIndexed ? this.getIndexFromTerminalNumber(terminalNumber) : -1;

        const params = new CommandParams(start, end, commandType, commandSubType, snippet, isIndexed, index, matches.index, matches[0]);

        operation(params);
      }
    });
  }

  static isMarkdownFile(document: vscode.TextDocument) {
    return document.languageId === 'markdown';
  }

  private static getIndexFromTerminalNumber(terminalNumber: string | null): number {
    const numberParsed = terminalNumber ? parseInt(terminalNumber) : 0;

    return Math.max(numberParsed - 1, 0);
  }
}
