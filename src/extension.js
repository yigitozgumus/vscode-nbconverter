
const vscode = require('vscode');
//var PythonShell = require('python-shell');
var configuration = vscode.workspace.getConfiguration("nbConverter");

const converter = require('./convert.js');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

async function writeToFile(notebook,directory,pathName,selection){
    if(selection === 'No'){
        var alternative = await vscode.window.showInputBox(); 
        if(alternative === ""){
            vscode.window.showErrorMessage("File name must not be empty");
            
        }else{
        converter.writeToFile(directory + alternative + '.ipynb',notebook);
        vscode.window.showInformationMessage('File converted to Jupyter Notebook'); 
        }
    }else if(selection === 'Yes'){
        converter.writeToFile(pathName.substring(0,pathName.length - 2) + 'ipynb', notebook);
        vscode.window.showInformationMessage('File converted to Jupyter Notebook'); 
    }
}
exports.writeToFile = writeToFile;
function activate(context) {

    
    console.log('Congratulations, your extension "NbConverter" is now active!');

    let disposable = vscode.commands.registerCommand('extension.convertToNotebook', function () {

        // The code you place here will be executed every time your command is executed
        let editor = vscode.window.activeTextEditor;
        let pathName = editor.document.fileName;
        let fileName = pathName.substring(pathName.lastIndexOf("/")+1);
        //console.log("filename:" + fileName);
        let directory = pathName.substring(0, pathName.lastIndexOf("/")+1);
        //console.log("Directory:" + directory)
        //console.log(fileName.substring(fileName.length - 2) !== "py");
        if(fileName.substring(fileName.length - 2) !== "py"){
            vscode.window.showErrorMessage("File type is not Python.");
        }else{
            let seperator = configuration.seperator.default;
            let fileSaveDialog = configuration.openFileSaveDialog;
            var notebook = converter.translate(pathName, seperator);
            //TODO
           // if(!fileSaveDialog){
                 vscode.window.showInformationMessage("Do you want to save it with the default file name", ...["Yes", "No"]).then(selection => {
                    writeToFile(notebook, directory, pathName, selection);
                });
           // }
            // else{
            //    vscode.window.showSaveDialog({
            //         defaultUri: vscode.Uri.file(pathName.substring(0, pathName.length - 2) + 'ipynb')
            //     });
            // }
            
            
        }

    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;