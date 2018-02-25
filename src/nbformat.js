
var methods = {};
methods.new_notebook =  function Notebook(kernel_name,language,version){
    language = language || 'Python';
    version = version || '1.0.0.';
    kernel_name = kernel_name || "Untitled";
    this.metadata = {};
    this.metadata.kernel_info = {};
    this.metadata.kernel_info.name = kernel_name;
    this.metadata.language_info = {};
    this.metadata.language_info.name = language;
    this.metadata.language_info.version = version;
    this.nbformat = 4;
    this.nbformat_minor = 0;
    this.cells = [];
};

methods.new_code_cell =  function codeCell(notebook){
    let cell_type = "code";
    this.cell_type = cell_type;
    this.metadata = {};
    this.source = "";
    notebook.cells.append(this);

};

methods.new_markdown_cell = function markdownCell(notebook){
    let cell_type = "markdown";
    this.cell_type = cell_type;
    this.metadata = {};
    this.source = "";
    notebook.cells.append(this);
};
exports.data = methods;

