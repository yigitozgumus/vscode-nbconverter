# NbConverter

This extension will convert any python file made on the spyder to a ready to work notebook file

## Quick Start

* Install the extension
* You are ready to use it

## Example Usage

The extension is written to conveniently convert your sectioned python file to jupyter notebook 
You can either use """ to describe a markdown cell like shown below, or use the seperator to divide the cells.
There is two possible way to use seperator. If it is used with descriptive line, it will create a markdown cell 
and add this line as a header. If it is used alone it will divide the code block between two code cells.

Below you can see an example python code and its converted Jupter notebook counterpart.

```python

#%% This is a test
"""
This will be another comment line 
for the testing of the different sections
"""
import numpy as np
a = np.array([[1,1]])
# one line comment test
print(a.shape)
print(a)
""" this is a test
comment for the multi
line command block"""
#%% This is the second cell
b = 6
#%%
# seperators without lines divide the code between cells. Code cell by default
import matplotlib.pyplot all_plt
x = np.array([1,2,3,4,5])
y = np.array([4,5,6,7,8])
#%%
plt(x,y)
plt.show()
# One line comment
print (a + b)
"""
## This will be the markdown page 
**This will be rendered as bold text**
_This will be rendered as italic_
|cell type|progress|
|-----|-----|
|code| done|
|markdown| done|
"""

```

![](https://i.imgur.com/F5EvWV7.jpg)


## Next Tasks

* [x] Making the converter robust
* [x] More comprehensive conversion logic
* [ ] Being able to convert py files that is converted from ipynb notebooks
