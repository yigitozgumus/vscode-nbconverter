# NbConverter

This extension will convert any python file made on the spyder to a ready to work notebook file

## Quick Start

* Install the extension
* Make sure to install nbformat to the python environment you are using

```bash
pip install nbformat 
conda install nbformat
```

* You are ready to use it

## Example Usage

The extension is written to conveniently convert your sectioned python file to jupyter notebook 
For now the section seperator is one that is used in Spyder but customization will be added.

Below you can see an example python code and its converted Jupter notebook counterpart.

```python

#%% This is a test
import numpy as np
a = np.array([[1,1]])
print(a.shape)
print(a)
""" this is a test
comment for the multi
line command block"""
#%% This is the second cell
b = 6
print (a + b)

```

![](https://i.imgur.com/cYOjNEm.jpg)

## Next Tasks

* Making the converter robust
* Being able to convert py files that is converted from ipynb notebooks
* More comprehensive conversion logic