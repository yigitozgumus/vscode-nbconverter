
var methods = {};
methods.new_notebook =  function Notebook(kernel_name,language,version){
    language = language || 'Python';
    version = version || '1.0.0.';
    kernel_name = kernel_name || "Untitled";
    var notebook = {};
    notebook.metadata = {};
    notebook.metadata.kernel_info = {};
    notebook.metadata.kernel_info.name = kernel_name;
    notebook.metadata.language_info = {};
    notebook.metadata.language_info.name = language;
    notebook.metadata.language_info.version = version;
    notebook.nbformat = 4;
    notebook.nbformat_minor = 0;
    notebook.cells = [];
    return notebook;
};

methods.new_code_cell =  function codeCell(notebook){
    let cell_type = "code";
    var cell = {};
    cell.cell_type = cell_type;
    cell.metadata = {};
    cell.source = "";
    notebook.cells.push(cell);

};

methods.new_markdown_cell = function markdownCell(notebook){
    let cell_type = "markdown";
    var cell ={};
    cell.cell_type = cell_type;
    cell.metadata = {};
    cell.source = "";
    notebook.cells.push(cell);
};

methods.addToCell =function addToCell(notebook,content){
    notebook.cells[notebook.cells.length-1].source += content ;
}
methods.getCellType = function getCellType(notebook){
    let cell_num = notebook.cells.length ;
    return notebook.cells[notebook.cells.length - 1].cell_type;   
};
module.exports = methods;

