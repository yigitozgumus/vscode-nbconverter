#!/usr/local/bin/python3
import argparse
import nbformat

class PytoNb:
    def __init__(self,input_file,output_notebook,divider):
        self.inputFile = input_file
        self.outputFile = output_notebook
        self.div = divider
        self.main()

    def get_notebook(self,inputFile):
        self.data = ""
        with open(inputFile) as f:
            self.data = f.read()
        self.script = self.data.split("\n") 

    def convert(self):
        self.notebook = nbformat.v4.new_notebook()
        seperator = self.div if self.div else "\"\"\""
        comment = False
        notebook_iter = iter(self.script)
        while True:
            try:
                line = next(notebook_iter)
                
                if(line.startswith("\"\"\"")):
                    if(len(line) == 3):
                        self.notebook.cells.append(nbformat.v4.new_markdown_cell())
                    else:
                        self.notebook.cells.append(nbformat.v4.new_markdown_cell(source=(line[3:] + "\n")))
                        comment = True
                elif(line.startswith(seperator)):
                    self.notebook.cells.append(nbformat.v4.new_markdown_cell(source=("# " + line[3:])))
                
                elif(line.endswith("\"\"\"")):
                    if(self.notebook.cells[-1]["cell_type"] == "code"):
                        self.notebook.cells[-1]['source'] += (line + '\n')
                    else:
                        self.notebook.cells[-1]['source'] += (line[:-3] + '\n')
                        comment = False
                else:
                    if(comment == False and self.notebook.cells[-1]["cell_type"] != "code" and not line.startswith(("\"\"\"",seperator))):
                        self.notebook.cells.append(nbformat.v4.new_code_cell())
                    self.notebook.cells[-1]['source'] += (line + '\n')
            except StopIteration:
                break
       
        self.output()
    
    def output(self):
        self.notebook['metadata']["kernel_info"] = {"name" : "Python 3"}
        self.notebook['metadata']["language_info"] = {"name" : "Python"}
        nbformat.write(self.notebook,self.outputFile)

    def main(self):
        self.get_notebook(self.inputFile)
        self.convert()
    
if __name__ == "__main__":
    import argparse
    class CLI(object):
        def parse_options(self):
            parser = argparse.ArgumentParser()
            parser.add_argument("-i",help="input script file")
            parser.add_argument("-o",help="Output notebook file name")
            parser.add_argument("-c",help="How to divide cells")
            args = parser.parse_args()
            self.input = args.i
            self.test = args.o
            self.output = args.o if self.test else args.i[:-2] + "ipynb"
            self.div = args.c if args.c else ""
        def run(self):
            self.parse_options()
            PytoNb(self.input,self.output,self.div)
    CLI().run()