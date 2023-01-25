import * as vscode from 'vscode';
import { CONFIG_ACTIVATE_CODELENSE, CONFIG_INTERRUPT_DELAY, CONFIG_OPEN_RELATIVE, CONFIG_SECTION } from '../consts';
import { OpenRelativeConfig } from '../enums/openRelativeConfig';

export class CodeLabConfig {
  static getCurrentConfig(): CodeLabConfig {
    return new CodeLabConfig();
  }

  readonly activateCodeLense: boolean;
  readonly openRelativeConfig: OpenRelativeConfig;
  readonly interruptDelay: number;

  constructor() {
    const config = vscode.workspace.getConfiguration(CONFIG_SECTION);

    this.openRelativeConfig = config.get<OpenRelativeConfig>(CONFIG_OPEN_RELATIVE) || OpenRelativeConfig.File;
    this.activateCodeLense = !!config.get<boolean>(CONFIG_ACTIVATE_CODELENSE);
    this.interruptDelay = config.get<number>(CONFIG_INTERRUPT_DELAY) || 200;
  }
}
