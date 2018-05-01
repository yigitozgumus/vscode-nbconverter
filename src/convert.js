//nbformat cell additions
const nbFormat = require("./nbformat.js");

const fs = require('fs');
var methods = {};
//Tokens
const CODE1 = 'CODE1'; // code line
const MARK1 = 'MARK1'; // markdown line 
const MARK2 = 'MARK2'; // markdown block
const COMM1 = 'COMM1'; // comment line around code`
const COMM2 = 'COMM2'; // multiline comment
const SEP1 = 'SEP1'; // Empty seperator
const SEP2 = 'SEP2'; // Filled Seperator


//Methods
methods.preprocess = function preprocess(inputFile){
    const global_data = fs.readFileSync(inputFile).toString();
    const fileData = global_data.split('\n');
    return fileData;
};

methods.tokenize = function tokenize(Data,seperator){
    var tokenizedLines = [];
   
    var commentMarkCheck = false;
    var markdownCell = false;
    for(var index = 0;index < Data.length;index++){
        var line = Data[index];
        var addFlag = true;
        
        let elem = {"token": "", "data": ""};
        if(line.startsWith(seperator)){
            if(line.length === seperator.length){
                elem.token = SEP1; // create a new code cell
            }else{
                elem.token = SEP2; // create a oneliner markdown cell for seperation and create a code cell
            }
            elem.data = (line + '\n');
            if (commentMarkCheck) {
                commentMarkCheck = false;
            }
        }
        else if(line.startsWith("#") && !commentMarkCheck){ // could be comment or markdown line
            elem.token = COMM1; // mark it as comment, we will check it
            elem.data = (line + '\n');
        }else if(line.length === 0){ // if it is an empty line dismiss it
           // addFlag = false;
        }else if(line.startsWith("\"\"\"")){ // either multiline comment or markdown structure beginning
            if(markdownCell){
                elem.token = MARK2;
            }else{
            elem.token = COMM2; // mark it as multiline comment start
            }
            elem.data = (line + '\n');
            if(commentMarkCheck){ // if it was checked make it false
                commentMarkCheck = false;
            }else{
            commentMarkCheck = true;
            }
        }else if(commentMarkCheck){ // previous case check
            if (line.startsWith("#")){
                tokenizedLines[tokenizedLines.length - 1].token = MARK2;
                //tokenizedLines[tokenizedLines.length - 1].data += '\n';
                elem.token = MARK2;
                commentMarkCheck = false;
                markdownCell = true;
            }else{
                elem.token = COMM2;
            }
            elem.data = (line + '\n');   
        }else if(markdownCell){
            elem.token = MARK2;
            if(line.startsWith("|") && line.endsWith("|")){
                elem.data = (line + '\n');
            }else{
            elem.data = (line + '\n\n');
            }
        }else{
            markdownCell = false;
            elem.token = CODE1;
            elem.data = (line + '\n');
        }
        if(addFlag){
        tokenizedLines.push(elem);
        }
    }
   // console.log(tokenizedLines);
    return tokenizedLines ;
};

methods.parseCodeCell = function parseCodeCell(notebook,token){
    var cell_type = nbFormat.getCellType(notebook) ;
    if(cell_type === 'code'){
        nbFormat.addToCell(notebook,token.data);
    }else{
        nbFormat.new_code_cell(notebook);
        nbFormat.addToCell(notebook,token.data);
    }
};
methods.parseMarkdownCell = function parseMarkdownCell(notebook,token){
    var cell_type = nbFormat.getCellType(notebook);
    if(token.data !== "\"\"\"\n"){
        if (cell_type === 'markdown') {
            nbFormat.addToCell(notebook, token.data);
        } else {
            nbFormat.new_markdown_cell(notebook);
            nbFormat.addToCell(notebook, token.data);
        }
    }
   
};
methods.parseCommentCell = function parseCommentCell(notebook,token){
    var cell_type = nbFormat.getCellType(notebook);
    if(cell_type === 'code'){
        nbFormat.addToCell(notebook,token.data);
    }else{
        nbFormat.new_code_cell(notebook);
        nbFormat.addToCell(notebook,token.data);
    }
};
methods.parseSeperator = function parseSeperator(notebook,token){
    var cell_type = nbFormat.getCellType(notebook);
    if(cell_type === 'code' && token.token === 'SEP2'){
        nbFormat.new_markdown_cell(notebook);
        nbFormat.addToCell(notebook,'#' + token.data.substring(3));
        nbFormat.new_code_cell(notebook);
    }else if(token.token === 'SEP1'){
        nbFormat.new_code_cell(notebook);
    } else {
        nbFormat.addToCell(notebook, '#' + token.data.substring(3));
        nbFormat.new_code_cell(notebook);
    }
};

methods.translate = function convert_mark2(file,seperator){
    var fileData = methods.preprocess(file);
    var tokens = methods.tokenize(fileData,seperator); 
    var noteb = nbFormat.new_notebook();  
    nbFormat.new_markdown_cell(noteb);
    //console.log(noteb);
    for (var index = 0;index < tokens.length ; index++){
        if(tokens[index].token.startsWith("CODE")){
            methods.parseCodeCell(noteb,tokens[index]);
        } else if (tokens[index].token.startsWith("COMM")) {
            methods.parseCommentCell(noteb, tokens[index]);
        } else if (tokens[index].token.startsWith("MARK")) {
            methods.parseMarkdownCell(noteb, tokens[index]);
        }else if(tokens[index].token.startsWith("SEP")){
           // console.log("hehe");
            methods.parseSeperator(noteb,tokens[index]);
        }
    }
    //console.log(noteb);
   // console.log("test");
    return JSON.stringify(noteb);
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
    //console.log(notebook);
    return JSON.stringify(notebook);
};

methods.writeToFile = function writeToFile(file,notebook){
    // var stream = fs.createWriteStream(file);
    // stream.once('open', function () {
    //     stream.write(notebook.toString());
    //     console.log(notebook.toString());
    //     stream.end();
    // });
    fs.writeFile(file, notebook.toString(), function (err) {
        if (err) {
            return console.log('there is an error');
        }});
        console.log("new method works.");

};

module.exports = methods;