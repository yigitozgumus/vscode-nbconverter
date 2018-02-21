
const vscode = require('vscode');
var PythonShell = require('python-shell');

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
        let pathName = editor.document.fileName;
        let index = pathName.lastIndexOf('/');
        let directory = pathName.substring(0, index + 1)
        let filename = pathName.substring(index + 1);
        var options = {
            mode: 'text',
            scriptPath: __dirname,
            args: ['-i', pathName, '-c', '#%%']
        };
        PythonShell.run('pytonb.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        });     
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