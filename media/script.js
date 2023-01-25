(function () {
  const vscode = acquireVsCodeApi();

  const commandButtons = document.getElementsByClassName('command-btn');
  for (let i = 0; i < commandButtons.length; i++) {
    const btn = commandButtons[i];
    btn.addEventListener('click', () => {
      vscode.postMessage({
        command: btn.dataset.command,
        args: btn.dataset.args
      });
    });
  }
}());