//nbformat cell additions
const nbFormat = require("./nbformat.js");

const fs = require('fs');
var methods = {};
//Tokens


methods.tokenize = function tokenize(Data){

};

methods.parseCodeCell = function parseCodeCell(){

};
methods.parseMarkdownCell = function parseMarkdownCell(){

};

methods.translate = function convert_mark2(){

};

methods.convert = function convert_mark1(file, sep) {
    const global_data = fs.readFileSync(file).toString();
    const fileData = global_data.split('\n');
    var notebook = nbFormat.new_notebook();
    const seperator = sep;
    let comment = false;
    methods.test();
    for (var i = 0; i < fileData.length; i++) {
        var line = fileData[i];
        if (line.startsWith("\"\"\"")) {
            if (line.length === 3) {
                nbFormat.new_markdown_cell(notebook);
            } else {
                nbFormat.new_code_cell(notebook);
                nbFormat.addToCell(notebook, (line.substring(3) + '\n'));
                comment = true;
            }
        }else if (line.startsWith(seperator)){
            nbFormat.new_markdown_cell(notebook);
            nbFormat.addToCell(notebook, ('#' + line.substring(3) + '\n'));
        }else if(line.endsWith("\"\"\"")){
            if(notebook.cells[notebook.cells.length - 1].cell_type === "code"){
                nbFormat.addToCell(notebook, (line + '\n'));
            }else{
                nbFormat.addToCell(notebook, (line.substring(0, line.length - 3) + '\n'))
                comment = false;
            }
        }else{
            if (comment === false && notebook.cells[notebook.cells.length - 1].cell_type !== "code" && !(line.startsWith(seperator) ||line.startsWith("\"\"\""))){
                nbFormat.new_code_cell(notebook);
            }
            nbFormat.addToCell(notebook, (line + '\n'));
        }
    }
    console.log(notebook);
    return JSON.stringify(notebook);
};

methods.writeToFile = function writeToFile(file,notebook){
    var outputFileName = file.substring(0,file.length - 3) + ".ipynb";
    var stream = fs.createWriteStream(outputFileName);
    stream.once('open', function () {
        stream.write(notebook.toString());
        console.log(notebook.toString());
        stream.end();
    });
};

module.exports = methods;