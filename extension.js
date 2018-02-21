
const vscode = require('vscode');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "NbConverter" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.convertToNotebook', function () {
        // The code you place here will be executed every time your command is executed
        let editor = vscode.window.activeTextEditor;
        let filename = editor.document.fileName;
        let index = filename.lastIndexOf('/');
        let directory = filename.substring(0,index+1)
        console.log(directory)
        
        // Display a message box to the user
        vscode.window.showInformationMessage('File converted to Jupyter Notebook');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;