#D3 Parallel coordinates

##What is it
Parallel coordinates graph made with d3. As it is, you can generate random datas, or play with the number of lines represented.
Of course you can provide you own data input, the random is only useful to preview !

##What data input
Any kind of dataset can work as long as it is structured this way :
```
  [ { a : value on the a axis,
      b : value on the b axis,
      c : value on the c axis,
      ...
      },
    { a : value on the a axis,
      b : value on the b axis,
      c : value on the c axis,
      ...
      },
  ...]
```
With the same keys for each datum. 
Key names 'a','b','c'... can be replaced by any name.

##How does it work
For each key, a scale is needed. createScale returns the scale for a given key. It's used to create the corresponding axis, and calculate the position of the point of one line on that axis.

To create the lines, I used the d3 line generator, which needs to have an input structured this way :
```
[{x: x coordinate of the first point of the line, 
y:y coordinate of the first point of the line},
{x: x coordinate of the 2nd point of the line,
y:y coordinate of the 2nd point of the line}, ...]
```
That's why the dataset is reshaped and pre-calculate the points position with reShapeData.



