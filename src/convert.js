//nbformat cell additions
const nbFormat = require("./nbformat.js");

const fs = require('fs');
var methods = {};
//Tokens
var CODE1 = 'CODE1'; // code line
var MARK1 = 'MARK1'; // markdown line 
var MARK2 = 'MARK2'; // markdown block
var COMM1 = 'COMM1'; // comment line around code
var COMM2 = 'COMM2'; // multiline comment
var SEP1 = 'SEP1'; // Empty seperator
var SEP2 = 'SEP2'; // Filled Seperator


//Methods
methods.preprocess = function preprocess(inputFile){
    const global_data = fs.readFileSync(inputFile).toString();
    const fileData = global_data.split('\n');
    return fileData;
};

methods.tokenize = function tokenize(Data,seperator){
    var tokenizedLines = [];
    let addFlag = true;
    let commentMarkCheck = false;
    let markdownCell = false;
    for(var index = 0;index < Data.length;index++){
        let line = Data[index];
        let elem = {"token": "", "data": ""};
        if(line.startsWith(seperator)){
            if(line.length === seperator.length){
                elem.token = SEP1;
            }else{
                elem.token = SEP2;
            }
            elem.data = (line + '\n');
            if (commentMarkCheck) {
                commentMarkCheck = false;
            }
        }
        else if(line.startsWith("#")){
            elem.token = COMM1;
            elem.data = (line + '\n');
        }else if(line.length === 0){
            addFlag = false;
        }else if(line.startsWith("\"\"\"")){
            elem.token = COMM2;
            elem.data = (line + '\n');
            if(commentMarkCheck){
                commentMarkCheck = false;
            }else{
            commentMarkCheck = true;
            }
        }else if(commentMarkCheck){
            if (line.startsWith("#")){
                tokenizedLines[tokenizedLines.length - 1].token = MARK2;
                elem.token = MARK2;
                commentMarkCheck = false;
                markdownCell = true;
            }else{
                elem.token = COMM2;
            }
            elem.data = (line + '\n');   
        }else if(markdownCell){
            elem.token = MARK2;
            elem.data = (line + '\n');
        }else{
            elem.token = CODE1;
            elem.data = (line + '\n');
        }
        if(addFlag){
        tokenizedLines.push(elem);
        }
    }
    console.log(tokenizedLines);
    return tokenizedLines ;
};

methods.parseCodeCell = function parseCodeCell(){

};
methods.parseMarkdownCell = function parseMarkdownCell(){

};

methods.translate = function convert_mark2(){

};

methods.convert = function convert_mark1(file, sep) {
    
    var fileData = methods.preprocess(file);
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