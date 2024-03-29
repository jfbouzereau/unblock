const RESET = "\x1b[0m";
const GREEN = "\x1b[42m";

var nrow;
var ncol;
var exitside;
var exitrow;
var exitcol;

var grid;
var visited = {};
var game = [];		// current sequence of moves
var sol = null;		// solution (shortest game so far)

var pieces;
var savedpieces;

var timestart;

if(typeof(require)=="function") {
	var fs = require("fs");
	load_game(fs.readFileSync(process.argv[2]));
} else 
{
	onmessage = function(event) {
		load_game(event.data);
	}
}


// *********************************************************************

async function run() {

	for(var f of rungen())
		await run();

}

function *rungen() {

	if(sol)
		if(game.length>sol.length)
			return;

	// if config already encountered
	var config = grid.join(",");
	if(visited[config] && visited[config] <= game.length) return 
		
	visited[config] = game.length;

	// look for a piece to move

	for(var pid=0;pid<pieces.length;pid++) {

		var piece = pieces[pid];
		if(piece.fix) continue;
	
		var row = piece.row;
		var col = piece.col;

		if(piece.dir=="h") {
			if((col+piece.len<=5)&&(grid[row][col+piece.len]<0)) {
				// move piece to the right
				game.push(pid+"r");
				grid[row][col] = -1;
				grid[row][col+piece.len] = pid;
				piece.col++;
				if(pid==0)
					win();
				yield 0;

				// cancel move
				game.pop();
				grid[row][col+piece.len] = -1;
				grid[row][col] = pid;
				piece.col--;
			}

			if((col>0)&&(grid[row][col-1]<0)) {
				// move piece left
				game.push(pid+"l");
				grid[row][col+piece.len-1] = -1;
				grid[row][col-1] = pid;	
				piece.col--;
				if(pid==0)
					win();
				yield 0;

				// cancel move
				game.pop();
				grid[row][col-1] = -1;
				grid[row][col+piece.len-1] = pid;
				piece.col++;
			}

		}
		else if(pieces[pid].dir=="v") {

			if((row+piece.len<=5)&&(grid[row+piece.len][col]<0)) {
				// move piece to the bottom
				game.push(pid+"b");
				grid[row][col] = -1;
				grid[row+piece.len][col] = pid;
				piece.row++;
				if(pid==0)
					win();
				yield 0;

				// cancel move
				game.pop();
				grid[row+piece.len][col] = -1;
				grid[row][col] = pid;
				piece.row--;
			}

			if((row>0)&&(grid[row-1][col]<0)) {
				// move piece to the top		
				game.push(pid+"t");
				grid[row+piece.len-1][col] = -1;
				grid[row-1][col] = pid;		
				piece.row--;
				if(pid==0)
					win();
				yield 0;

				// cancel move
				game.pop();
				grid[row+piece.len-1][col] = pid;
				grid[row-1][col] = -1;
				piece.row++;
			}
		}
	}

}

// *********************************************************************

function win() {

	var ok = (pieces[0].row==exitrow) && (pieces[0].col==exitcol);	
	if(!ok) return;

	if(!sol)
		sol = game.slice();
	else if(game.length<sol.length)
		sol = game.slice();
}

// *********************************************************************

async function load_game(content) {

	var t = JSON.parse(content);

	if(!("nrow" in t)) abort("Number of rows not specified");
	if(!("ncol" in t)) abort("Number of columns not specified");
	if(!("exit" in t)) abort("Exit side not specified");
	if(!t.pieces) abort("Pieces not specified");	

	nrow = t.nrow;
	ncol = t.ncol;
	exitside = t.exit;
	pieces = t.pieces;

	set_grid();

	savedpieces = pieces.slice();		// save for replay

	post({log:"RUNNING"});

	timestart = new Date().getTime();

	await run();

	var timeend = new Date().getTime();
	
	var seconds = ((timeend-timestart)/1000)|0;

	post({log:"SOLVED IN "+seconds+" SECONDS"});

	if(!post({solution:sol}))
		play();
}

// *********************************************************************

function set_grid() {

	grid = [];

	for(var row=0;row<nrow;row++) {
		grid[row] = [];
		for(var col=0;col<ncol;col++) 
			grid[row][col] = -1;
	}

	for(var k=0;k<pieces.length;k++) {
		var p = pieces[k];

		if(!("dir" in p)) abort("Direction of piece "+k+" not specified");
		if(!("len" in p)) abort("Length of piece "+k+" not specified");
		if(!("row" in p)) abort("Row of piece "+k+" not specified");
		if(!("col" in p)) abort("Column of piece "+k+" not specified");
	
		var row = p.row;
		var col = p.col;

		for(var i=0;i<p.len;i++) {
			grid[row][col] = k
			row += (p.dir=="h") ? 0:1;
			col += (p.dir=="v") ? 0:1;
		}
	}	

	switch(exitside) {
		case "l":
			exitrow = pieces[0].row;
			exitcol = 0;
			break;

		case "r":
			exitrow = pieces[0].row;
			exitcol = nrow-pieces[0].len;
			break;

		case "t":
			exitrow = 0;
			exitcol = pieces[0].col;
			break;

		case "b":
			exitrow = nrow-pieces[0].len;
			exitcol = pieces[0].col;
			break;		

		default:
			abort("Exit side invalid");
			break;
	}

}

// *********************************************************************

function dump_grid(pid) {
	for(var i=0;i<nrow;i++) {
		var s = "";	
		for(var j=0;j<ncol;j++)
			s += f(grid[i][j]);
		console.log(s);
	}
	console.log("-------------------------");

	function f(x) {
		if(x==-1)
			return "  .";

		var r = ""+x;
		while(r.length<2) r = " "+r;
	
		return (pid==x) ? " "+GREEN+r+RESET : " "+r;	
	}
}

// *********************************************************************

function play() {

const DIRS = {l:"left",r:"right",t:"top",b:"bottom"};

if(!sol) return;

var kmove = 0;

pieces = savedpieces;

set_grid();		// reset grid from beginning

dump_grid(-1);

for(var i=0;i<sol.length;i++) {	
	var pid = parseInt(sol[i]);
	var dir = sol[i][sol[i].length-1];

	if(sol[i]!=sol[i+1]) {
		kmove++;
		console.log(kmove+" : piece "+pid+" to "+DIRS[dir]);
	}

	var len = pieces[pid].len;
	var row = pieces[pid].row;
	var col = pieces[pid].col;

	switch(dir) {
		case "r":
			pieces[pid].col++;
			grid[row][col] = -1;
			grid[row][col+len] = pid;
			break;

		case "l":
			pieces[pid].col--;
			grid[row][col-1] = pid;
			grid[row][col+len-1] = -1;
			break;

		case "t":
			pieces[pid].row--;
			grid[row-1][col] = pid;
			grid[row+len-1][col] = -1;
			break;

		case "b":
			pieces[pid].row++;
			grid[row][col] = -1;
			grid[row+len][col] = pid;
			break;
	}	
	
	if(sol[i]!=sol[i+1])	
		dump_grid(pid);		
}


}

// *********************************************************************

function abort(msg) {

	if(!post({error:msg})) {
		console.log(msg);
		process.exit(1); 
	}
}

// *********************************************************************

function post(msg) {

	if(typeof(postMessage)=="function") {
		postMessage(msg);
		return true;
	}
	else {
		if(msg.log)
			console.log(msg.log);
		return false;
	}
}

// *********************************************************************

