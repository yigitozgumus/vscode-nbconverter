
const vscode = require('vscode');
//var PythonShell = require('python-shell');
var configuration = vscode.workspace.getConfiguration("nbConverter")
const converter = require('./convert.js');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    
    console.log('Congratulations, your extension "NbConverter" is now active!');

    let disposable = vscode.commands.registerCommand('extension.convertToNotebook', function () {

        // The code you place here will be executed every time your command is executed
        let editor = vscode.window.activeTextEditor;
        let pathName = editor.document.fileName;
        let index = pathName.lastIndexOf('/');
        let seperator = configuration.seperator.default;
       // var notebook = converter.convert(pathName,seperator);
        var notebook = converter.translate(pathName, seperator);
        converter.writeToFile(pathName,notebook);
          
        
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