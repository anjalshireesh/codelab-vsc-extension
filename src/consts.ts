export const COMMAND_COPY_CLIPBOARD = 'codelab.copyToClipboard';
export const COMMAND_EXECUTE = 'codelab.execute';
export const COMMAND_EXECUTE_INTERRUPT = 'codelab.executeInterrupt';
export const COMMAND_OPEN = 'codelab.open';
export const COMMAND_PREVIEW = 'codelab.preview';

export const CONFIG_SECTION = 'codelab';
export const CONFIG_OPEN_RELATIVE = 'openRelative';
export const CONFIG_ACTIVATE_CODELENSE = 'activateCodeLense';
export const CONFIG_INTERRUPT_DELAY = 'interruptDelay';

export const VIEWTYPE_MARKDOWN_PREVIEW = 'markdownPreview';

export const FOLDER_MEDIA = 'media';

export const TITLE_WEBVIEWPANEL = 'CodeLab - Panel';

export const MESSAGE_EXECUTE = 'command.execute';

export const REGEXP_COMMANDS =
  /(?<start>'|"|´|`)(?<snippet>.+?)(?<end>'|"|´|`)\s*{{\s*(?<commandType>copy|execute|open)\s*(?<commandSubType>interrupt)?\s*((?:'|"|´|`)t(?<terminalNumber>\d+)(?:'|"|´|`))?\s*}}/gi;
