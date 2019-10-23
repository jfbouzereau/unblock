# UNBLOCK

This node program solves `unblock me` types of puzzle :

![screenshot](601.png) ![screenshot](1f.png)

It does not try to optimize the search, and use brute force
algorithm with backtracking.

## PREPARATION

The game must be prepared in a json file. Example `601.json` :
```
{
	"nrow":6,
	"ncol":6,
	"exitrow":2,
	"exitcol":4,	
	"pieces":[
		{"dir":"h","len":2,"row":2,"col":0},
		{"dir":"h","len":2,"row":0,"col":0},	
		{"dir":"v","len":2,"row":0,"col":3},
		{"dir":"h","len":2,"row":0,"col":4},
		{"dir":"h","len":3,"row":1,"col":0},
		{"dir":"v","len":3,"row":1,"col":5},
		{"dir":"v","len":2,"row":3,"col":0},
		{"dir":"h","len":2,"row":3,"col":1},
		{"dir":"h","len":2,"row":3,"col":3},
		{"dir":"v","len":2,"row":4,"col":2},
		{"dir":"h","len":3,"row":4,"col":3},		
		{"dir":"h","len":2,"row":5,"col":0}
	]
}
```

* `nrow` is the number of rows of the field

* `ncol` is the number of colums of the field

* `exitrow` is the row the target must reach

* `exitcol` is the column the target must reach

* `pieces` is the array of pieces

	The first piece MUST BE the target (usually the red piece)

	`dir` specify if the piece is horizontal (h) or vertical (v)
  
	`row` and `col` specify the left-most or top-most position of the piece
	
	`fix` is set to true if the piece cannot move

## EXECUTION

Run
```
node unblock.js 601.json
```

If everything is OK, the solution is displayed one step after each other.
Example :

```
  1  1  .  2  3  3
  4  4  4  2  .  5
  0  0  .  .  .  5
  6  7  7  8  8  5
  6  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
1 : piece 0 to right
  1  1  .  2  3  3
  4  4  4  2  .  5
  .  0  0  .  .  5
  6  7  7  8  8  5
  6  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
2 : piece 2 to bottom
  1  1  .  .  3  3
  4  4  4  2  .  5
  .  0  0  2  .  5
  6  7  7  8  8  5
  6  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
3 : piece 3 to left
  1  1  .  3  3  .
  4  4  4  2  .  5
  .  0  0  2  .  5
  6  7  7  8  8  5
  6  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
4 : piece 5 to top
  1  1  .  3  3  5
  4  4  4  2  .  5
  .  0  0  2  .  5
  6  7  7  8  8  .
  6  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
5 : piece 6 to top
  1  1  .  3  3  5
  4  4  4  2  .  5
  6  0  0  2  .  5
  6  7  7  8  8  .
  .  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
6 : piece 8 to right
  1  1  .  3  3  5
  4  4  4  2  .  5
  6  0  0  2  .  5
  6  7  7  .  8  8
  .  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
7 : piece 2 to bottom
  1  1  .  3  3  5
  4  4  4  .  .  5
  6  0  0  2  .  5
  6  7  7  2  8  8
  .  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
8 : piece 4 to right
  1  1  .  3  3  5
  .  4  4  4  .  5
  6  0  0  2  .  5
  6  7  7  2  8  8
  .  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
9 : piece 6 to top
  1  1  .  3  3  5
  6  4  4  4  .  5
  6  0  0  2  .  5
  .  7  7  2  8  8
  .  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
10 : piece 7 to left
  1  1  .  3  3  5
  6  4  4  4  .  5
  6  0  0  2  .  5
  7  7  .  2  8  8
  .  .  9 10 10 10
 11 11  9  .  .  .
-------------------------
11 : piece 9 to top
  1  1  .  3  3  5
  6  4  4  4  .  5
  6  0  0  2  .  5
  7  7  9  2  8  8
  .  .  9 10 10 10
 11 11  .  .  .  .
-------------------------
12 : piece 11 to right
  1  1  .  3  3  5
  6  4  4  4  .  5
  6  0  0  2  .  5
  7  7  9  2  8  8
  .  .  9 10 10 10
  .  .  . 11 11  .
-------------------------
13 : piece 9 to bottom
  1  1  .  3  3  5
  6  4  4  4  .  5
  6  0  0  2  .  5
  7  7  .  2  8  8
  .  .  9 10 10 10
  .  .  9 11 11  .
-------------------------
14 : piece 7 to right
  1  1  .  3  3  5
  6  4  4  4  .  5
  6  0  0  2  .  5
  .  7  7  2  8  8
  .  .  9 10 10 10
  .  .  9 11 11  .
-------------------------
15 : piece 6 to bottom
  1  1  .  3  3  5
  .  4  4  4  .  5
  6  0  0  2  .  5
  6  7  7  2  8  8
  .  .  9 10 10 10
  .  .  9 11 11  .
-------------------------
16 : piece 4 to left
  1  1  .  3  3  5
  4  4  4  .  .  5
  6  0  0  2  .  5
  6  7  7  2  8  8
  .  .  9 10 10 10
  .  .  9 11 11  .
-------------------------
17 : piece 2 to top
  1  1  .  3  3  5
  4  4  4  2  .  5
  6  0  0  2  .  5
  6  7  7  .  8  8
  .  .  9 10 10 10
  .  .  9 11 11  .
-------------------------
18 : piece 6 to bottom
  1  1  .  3  3  5
  4  4  4  2  .  5
  .  0  0  2  .  5
  .  7  7  .  8  8
  6  .  9 10 10 10
  6  .  9 11 11  .
-------------------------
19 : piece 7 to left
  1  1  .  3  3  5
  4  4  4  2  .  5
  .  0  0  2  .  5
  7  7  .  .  8  8
  6  .  9 10 10 10
  6  .  9 11 11  .
-------------------------
20 : piece 8 to left
  1  1  .  3  3  5
  4  4  4  2  .  5
  .  0  0  2  .  5
  7  7  .  8  8  .
  6  .  9 10 10 10
  6  .  9 11 11  .
-------------------------
21 : piece 5 to bottom
  1  1  .  3  3  .
  4  4  4  2  .  5
  .  0  0  2  .  5
  7  7  .  8  8  5
  6  .  9 10 10 10
  6  .  9 11 11  .
-------------------------
22 : piece 3 to right
  1  1  .  .  3  3
  4  4  4  2  .  5
  .  0  0  2  .  5
  7  7  .  8  8  5
  6  .  9 10 10 10
  6  .  9 11 11  .
-------------------------
23 : piece 2 to top
  1  1  .  2  3  3
  4  4  4  2  .  5
  .  0  0  .  .  5
  7  7  .  8  8  5
  6  .  9 10 10 10
  6  .  9 11 11  .
-------------------------
24 : piece 0 to right
  1  1  .  2  3  3
  4  4  4  2  .  5
  .  .  .  0  0  5
  7  7  .  8  8  5
  6  .  9 10 10 10
  6  .  9 11 11  .
-------------------------
25 : piece 9 to top
  1  1  .  2  3  3
  4  4  4  2  .  5
  .  .  9  0  0  5
  7  7  9  8  8  5
  6  .  . 10 10 10
  6  .  . 11 11  .
-------------------------
26 : piece 10 to left
  1  1  .  2  3  3
  4  4  4  2  .  5
  .  .  9  0  0  5
  7  7  9  8  8  5
  6  . 10 10 10  .
  6  .  . 11 11  .
-------------------------
27 : piece 5 to bottom
  1  1  .  2  3  3
  4  4  4  2  .  .
  .  .  9  0  0  .
  7  7  9  8  8  5
  6  . 10 10 10  5
  6  .  . 11 11  5
-------------------------
28 : piece 0 to right
  1  1  .  2  3  3
  4  4  4  2  .  .
  .  .  9  .  0  0
  7  7  9  8  8  5
  6  . 10 10 10  5
  6  .  . 11 11  5
-------------------------
```
