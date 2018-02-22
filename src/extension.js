
const vscode = require('vscode');
var PythonShell = require('python-shell');
var configuration = vscode.workspace.getConfiguration("nbConverter")
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
        
        let seperator = configuration.seperator.default;
        console.log(configuration.seperator.default);
        var options = {
            mode: 'text',
            scriptPath: __dirname,
            args: ['-i', pathName, '-c', seperator]
        };
        processFile(pathName);
        PythonShell.run('./../pytonb.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        });     
        
        // Display a message box to the user
        vscode.window.showInformationMessage('File converted to Jupyter Notebook');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function processFile(inputFile) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', function (line) {
        console.log(line);
    });

    rl.on('close', function (line) {
        console.log(line);
        console.log('done reading file.');
    });
}
exports.processFile = processFile;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;