import * as vscode from 'vscode';
import * as mume from '@shd101wyy/mume';
import { FOLDER_MEDIA } from '../consts';
import { Helper } from './helper';
import { IHtmlGenerator } from '../interfaces/htmlGenerator';
import { CommandFactory } from './commandFactory';
import { useExternalAddFileProtocolFunction } from '@shd101wyy/mume/out/src/utility';
import { MarkdownEngineRenderOption } from '@shd101wyy/mume/out/src/markdown-engine';

export class MarkdownHtmlGenerator implements IHtmlGenerator {
  private _commandFactory = new CommandFactory();

  async generateHtml(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, document: vscode.TextDocument): Promise<string> {
    const engine = await this.createMumeEngine(document.uri);
    const nonce = this.getNonce();
    const documentText = document.getText();
    let htmlText = documentText;
    Helper.processCommandMatches(documentText, (params) => {
      const command = this._commandFactory.createCommmand(params);
      const buttonHtml = command.generateHtml();
      htmlText = htmlText.replace(params.firstMatch, buttonHtml);
    });
    const renderOptions: MarkdownEngineRenderOption = {
      useRelativeFilePath: false,
      isForPreview: false,
      hideFrontMatter: false,
      vscodePreviewPanel: panel
    };
    htmlText = (await engine.parseMD(htmlText, renderOptions)).html;

    const resetCss = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'reset.css'));
    const vscodeCss = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'vscode.css'));
    const stylesCss = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'styles.css'));
    const markdownCss = engine.generateStylesForPreview(false, undefined, panel);
    const script = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, FOLDER_MEDIA, 'script.js'));

    const html = `<!DOCTYPE html>
			<html>
			<head>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta id="mume-data" data-config="{&quot;usePandocParser&quot;:false,&quot;breakOnSingleNewLine&quot;:true,&quot;enableTypographer&quot;:false,&quot;enableWikiLinkSyntax&quot;:true,&quot;enableLinkify&quot;:true,&quot;enableEmojiSyntax&quot;:true,&quot;enableExtendedTableSyntax&quot;:false,&quot;enableCriticMarkupSyntax&quot;:false,&quot;useGitHubStylePipedLink&quot;:true,&quot;wikiLinkFileExtension&quot;:&quot;.md&quot;,&quot;protocolsWhiteList&quot;:&quot;http:&#x2F;&#x2F;, https:&#x2F;&#x2F;, atom:&#x2F;&#x2F;, file:&#x2F;&#x2F;, mailto:, tel:&quot;,&quot;mathRenderingOption&quot;:&quot;KaTeX&quot;,&quot;mathInlineDelimiters&quot;:[[&quot;$&quot;,&quot;$&quot;],[&quot;&#x5C;&#x5C;(&quot;,&quot;&#x5C;&#x5C;)&quot;]],&quot;mathBlockDelimiters&quot;:[[&quot;$$&quot;,&quot;$$&quot;],[&quot;&#x5C;&#x5C;[&quot;,&quot;&#x5C;&#x5C;]&quot;]],&quot;mathRenderingOnlineService&quot;:&quot;https:&#x2F;&#x2F;latex.codecogs.com&#x2F;gif.latex&quot;,&quot;codeBlockTheme&quot;:&quot;auto.css&quot;,&quot;previewTheme&quot;:&quot;github-light.css&quot;,&quot;revealjsTheme&quot;:&quot;white.css&quot;,&quot;mermaidTheme&quot;:&quot;default&quot;,&quot;frontMatterRenderingOption&quot;:&quot;none&quot;,&quot;imageFolderPath&quot;:&quot;&#x2F;assets&quot;,&quot;printBackground&quot;:false,&quot;chromePath&quot;:&quot;&quot;,&quot;imageMagickPath&quot;:&quot;&quot;,&quot;pandocPath&quot;:&quot;pandoc&quot;,&quot;pandocMarkdownFlavor&quot;:&quot;markdown-raw_tex+tex_math_single_backslash&quot;,&quot;pandocArguments&quot;:[],&quot;latexEngine&quot;:&quot;pdflatex&quot;,&quot;enableScriptExecution&quot;:false,&quot;enableHTML5Embed&quot;:false,&quot;HTML5EmbedUseImageSyntax&quot;:true,&quot;HTML5EmbedUseLinkSyntax&quot;:false,&quot;HTML5EmbedIsAllowedHttp&quot;:false,&quot;HTML5EmbedAudioAttributes&quot;:&quot;controls preload=&#x5C;&quot;metadata&#x5C;&quot;&quot;,&quot;HTML5EmbedVideoAttributes&quot;:&quot;controls preload=&#x5C;&quot;metadata&#x5C;&quot;&quot;,&quot;puppeteerWaitForTimeout&quot;:0,&quot;usePuppeteerCore&quot;:true,&quot;puppeteerArgs&quot;:[],&quot;plantumlServer&quot;:&quot;&quot;,&quot;vscode_mpe_version&quot;:&quot;0.5.22&quot;}" data-time="1627119819184">
        <link href="${resetCss}" rel="stylesheet">
        <link href="${vscodeCss}" rel="stylesheet">
        <link href="${stylesCss}" rel="stylesheet">
        ${markdownCss}
				<title>CodeLab</title>
			</head>
			<body class="preview-container">
      <div class="mume markdown-preview" for="preview" style="zoom: 1;">
      <p>${htmlText}</p>
      </div>
      </body>
        <script nonce="${nonce}" src="${script}"></script>
			</html>`;

    return Promise.resolve(html);
  }

  getLocalResourceRoots(): vscode.Uri[] {
    return [vscode.Uri.file(mume.utility.extensionDirectoryPath), vscode.Uri.file(mume.getExtensionConfigPath())];
  }

  private async createMumeEngine(sourceUri: vscode.Uri): Promise<mume.MarkdownEngine> {
    await mume.init();
    useExternalAddFileProtocolFunction((filePath: string, panel: vscode.WebviewPanel) => {
      if (panel) {
        return panel.webview.asWebviewUri(vscode.Uri.file(filePath)).toString(true).replace(/%3F/gi, '?').replace(/%23/g, '#');
      } else {
        if (!filePath.startsWith('file://')) {
          filePath = 'file:///' + filePath;
        }

        filePath = filePath.replace(/^file\:\/+/, 'file:///');

        return filePath;
      }
    });

    const config: mume.MarkdownEngineConfig = {
      plantumlServer: ''
    };

    return new mume.MarkdownEngine({
      filePath: sourceUri.fsPath,
      projectDirectoryPath: vscode.workspace.getWorkspaceFolder(sourceUri)?.uri.fsPath || '',
      config
    });
  }

  private getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
