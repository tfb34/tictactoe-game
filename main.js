
let singlePlayer = false;
let player1;
let player2;
let gameLevel = "expert";
//Machine will always be player2. you can change token or currPlayer later... maybe

//define gameBoard module
var Gameboard = (function(){
	//cells = [[1,2,3],[4,5,6],[7,8,9]];
	emptyCells= 9;
	cells = ["","","","","","","","",""];

	function clean(){
		this.cells = ["","","","","","","","",""];
		this.emptyCells = 9;
		for(let i=0;i<9;i++){
			document.getElementById("cell"+i).innerHTML="";
			document.getElementById("cell"+i).className="";
		}
	};
	return{
		cells,
		emptyCells,
		clean
	}
})();


const Player = (name,token) =>{
	this.moves = ["","","","","","","","",""];
	this.turns = 0;

	move = function(pos){
		this.moves[pos] = true;
		this.turns+=1;
	};

	startOver = function(){
		this.moves = ["","","","","","","","",""];
		this.turns = 0;
	};

	return{
		name,
		token,
		moves,
		turns,
		move,
		startOver
	}
};

// module
var gameController = (function(){

 /* multiplayer functions */

	function check4Win(player){
		//time to check for win or tie
		if(player.turns>2){
			console.log("checking for win");
			//time to check for win or tie
			//let bool;
			let indices;
			if(player.moves[0] && player.moves[1] && player.moves[2]){
				//bool = true;
				indices = [0,1,2];
			}else if(player.moves[3] && player.moves[4] && player.moves[5]){
				//bool = true;
				indices = [3,4,5];
			}else if(player.moves[6] && player.moves[7] && player.moves[8]){
				//bool = true;
				indices = [6,7,8];
			}else if(player.moves[0] && player.moves[3] && player.moves[6]){
				//bool = true;
				indices = [0,3,6];
			}else if(player.moves[1] && player.moves[4] && player.moves[7]){
				//bool = true;
				indices = [1,4,7];
			}else if(player.moves[2] && player.moves[5] && player.moves[8]){
				//bool = true;
				indices = [2,5,8];
			}else if(player.moves[0] && player.moves[4] && player.moves[8]){
				//bool = true;
				indices = [0,4,8];
			}else if(player.moves[6] && player.moves[4] && player.moves[2]){
				//bool = true;
				indices = [6,4,2];
			}

			if(indices){
				//classList not supported by IE
				document.getElementById("cell"+indices[0]).className ="winColor";
				//document.getElementById("cell"+indices[0]).style.background= "pink";
				document.getElementById("cell"+indices[1]).className ="winColor";
				document.getElementById("cell"+indices[2]).className ="winColor";
				return true;
			}
			return false;
		}
	};

	function tie(){
		console.log("   checking for tie")
		if(Gameboard.emptyCells == 0){
			return true;
		}
		return false;
	};

	function nextPlayer(){
		if(this._currPlayer == 1){
			this._currPlayer = 2;
		}else{
			this._currPlayer = 1;
		}
	};

 /* single player functions*/

	function draw(){
		for(let i = 0; i<9;i++){
			if(Gameboard.cells[i] == ""){
				return false;
			}
		}
		return true;
	}

	function win(token){
		let board = Gameboard.cells;
		//horizontal win
		for(let i = 0; i<9; i+=3){
			if(board[i]==token && board[i] == board[i+1] && board[i+1] == board[i+2]){
				return true;
			}
		}
		//vertical win
		for(let i=0;i<3;i++){
			if(board[i]==token && board[i] == board[i+3] && board[i+3] == board[i+6]){
				return true;
			}
		}
		//diagonal win
		if(board[0]==token && board[0]==board[4] && board[4]==board[8]){
			return true;
		}
		if(board[2]==token && board[2]==board[4] && board[4]==board[6]){
			return true;
		}
		return false;
	};

	return{
		_currPlayer : 1, //null
		nextPlayer,
		check4Win,
		tie,
		win,
		draw
	}
})();


function evaluateScore(){

	let score = 0;// no winner

	if(gameController.win("O")){
		score = -10;// minimizer wins
	}else if(gameController.win("X")){
		score = 10;// maximizer wins
	}
	return score;
}

//display the board
function renderBoard(){
	document.getElementById("board").style.visibility = "visible";
	displayCurrentPlayer();
	enablePlayerMoves();
}

function displayCurrentPlayer(){
	if(gameController._currPlayer == 1){
		document.getElementById("displayWinner").innerHTML = player1.name +"( "+player1.token+" )";
	}else{
		document.getElementById("displayWinner").innerHTML = player2.name+"( "+player2.token+" )";
	}
}
//will utilize GameBoard.
function getValidCells(){
	let arr = [];
	for(let c = 0;c<9;c++){
		if(!Gameboard.cells[c]){
			arr.push(c);
		}
	}
	return arr;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function AIMove(){
	let pos;
	//game level
	if(gameLevel == "novice"){
		pos = findNoviceMove();
	}else if(gameLevel == "expert"){
		pos = findBestMove();// by default, AI plays second
	}

	player2.move(pos);

	//display move
	let p = document.createElement("p");
	p.innerHTML = player2.token;
	document.getElementById("cell"+pos).append(p);

	//update gameboard
	Gameboard.cells[pos] = player2.token;
	Gameboard.emptyCells--;

	//check for win
	result(player2);
	
}


//SOOOOO when AI is called. first disable all listening events on cell
//after AI goes enable them;

function minimax(depth, maximizingPlayer){

	let score = evaluateScore();

	// no more moves can be played, return score

	if(score == 10){ // maximizer's win
		return score-depth;
	}
	if(score == -10){// minimizer's win
		return score+depth;
	}
	if(getValidCells().length == 0){ // tie
		return 0;
	}

	if(maximizingPlayer){
		let validCells = getValidCells();
		let value = null;
		let bestValue = -1000;// arbitrary small #
		for(let i=0;i<validCells.length;i++){
			// make move
			Gameboard.cells[validCells[i]] = player1.token;
			// obtain score of such move
			value = minimax(depth+1, false);
			// update bestValue
			if(value> bestValue){
				bestValue = value;
			}
			// undo move
			Gameboard.cells[validCells[i]] = "";
		}
		return bestValue;
	}else{
		let validCells = getValidCells();
		let value = null;
		let bestValue = 1000;// arbitrary large #
		for(let i=0;i<validCells.length;i++){
			//make move
			Gameboard.cells[validCells[i]] = player2.token;
			//minimax
			value = minimax(depth+1,true);
			if(value < bestValue){
				bestValue = value;
			}
			// undo move
			Gameboard.cells[validCells[i]] = "";
		}
		return bestValue;
	}
}

/* If AI goes first then maximizingPlayer=true
	Else it goes second; maximizingPlayer= false
*/
function findBestMove(){

	let validCells = getValidCells();
	let bestMove = null;
	let bestValue = 1000;
	let value =null;
	for(let i = 0;i<validCells.length;i++){

		//make the move
		Gameboard.cells[validCells[i]] = player2.token; 
		value = minimax(1, true);// true because your move depends on the best score of maximizer.

		/*below you are minimizing or finding the smallest score from maximizer;
		works only if AI is playing defensive/minimizer*/
		if(value < bestValue){
			bestMove = validCells[i];
			bestValue = value;
		}
		//undo the move
		Gameboard.cells[validCells[i]] = "";
	}
	return bestMove;
}

//game level: beginner
function findNoviceMove(){
	let validCells = getValidCells();
	let i = getRandomInt(0,validCells.length-1);
	return validCells[i];
}

function playerMove(){
	console.log("player1 has moved")
	let i = this.id[4];
	//check if space is occupued
	let currPlayer;

	if(gameController._currPlayer == 1){
		currPlayer = player1;
	}else{
		currPlayer = player2;
	}
// check if selected cell is valid
	if(!(Gameboard.cells[i].length > 0)){
		currPlayer.move(i);
		//display on board
		let p = document.createElement("p");
		p.innerHTML = currPlayer.token;
		document.getElementById("cell"+i).append(p);
		//update array
		Gameboard.cells[i] = currPlayer.token;//maybe not neccessary unless playing with AI
		Gameboard.emptyCells--;

		//check for win
		result(currPlayer);
		if(!endGame){
			if(singlePlayer){
				//take away player1 ability to click
				disablePlayerMoves();
				console.log("should have disablePlayerMoves");
				console.log("AI is thinking...");
				setTimeout(function(){AIMove();}, 3000);
			}
		}
	}

}

let endGame=false;

function result(currPlayer){
	if(gameController.check4Win(currPlayer)){
			document.getElementById('displayWinner').innerHTML = currPlayer.name+" Wins! ";
			createReplayOption();
			createStartMenuOption();
			disablePlayerMoves();
			endGame = true;
	}else if(gameController.tie()){
			document.getElementById('displayWinner').innerHTML = "It's a draw! ";
			createReplayOption();
			createStartMenuOption();
			endGame = true;
	}else{
		gameController.nextPlayer();
		displayCurrentPlayer();
		enablePlayerMoves();
	}
}

function createReplayOption(){

	let span=document.createElement('span');
	span.innerHTML = "replay &#xf01e;    ";
	span.className="fa";
	span.setAttribute("onclick", "replay()");

	let br = document.createElement('br');
	document.getElementById('displayWinner').append(br);
	document.getElementById('displayWinner').append(span);
}

function createStartMenuOption(){
	let span = document.createElement('span');
	span.innerHTML = "Start Menu";
	span.className="startMenu";
	span.setAttribute("onclick", "startMenu()");

	document.getElementById('displayWinner').append(span);
}
// if single game
function replay(){
	//clean players, and main board
	Gameboard.clean();
	player1.startOver();
	player2.startOver();
	gameController._currPlayer = 1;
	endGame=false;
	renderBoard();
}

function startMenu(){
	window.location.reload(true);
}

function disablePlayerMoves(){
	for(let i = 0;i<9;i++){
		document.getElementById("cell"+i).removeEventListener("click", playerMove);//don't forget to change this function
	}
}

function enablePlayerMoves(){
	for(let i = 0;i<9;i++){
		document.getElementById("cell"+i).addEventListener("click", playerMove);//don't forget to change this function
	}
}

function figureItOut(x){
	document.getElementById('startMenu').style.visibility = "hidden";

	let submit = document.createElement('input');
	submit.type="button";
	submit.value = "Submit"
	submit.setAttribute("onclick","createPlayers()");
	if(x == 'singlePlayer'){
		document.getElementById('playerForm').append(submit);
		document.getElementById('playerForm').style.visibility = "visible";
	}else{
		//create object for player. then append both player and submit

		document.getElementById('playerForm').append("Player 2's name: ");

		let b = document.createElement("br");

		let p2 = document.createElement('input');
		p2.type="text";
		p2.name = "player2Name";


		document.getElementById('playerForm').append(b,p2,submit);
		document.getElementById('playerForm').style.visibility = "visible";
	}
}


function createPlayers(){
	let inputs = document.querySelectorAll("input");
	console.log(inputs[0].value);
	if(inputs[0].value){
		player1 = Player(inputs[0].value, "X");
	}else{
		player1 = Player("Player 1", "X");
	}

	if(inputs[1].value == 'Submit'){
		singlePlayer = true;
		player2 = Player("Roy", "O");
	}else{
		if(inputs[1].value){
			player2 = Player(inputs[1].value, "O");
		}else{
			player2 = Player("Player 2", "O");
		}
	}
	
	document.getElementById('playerForm').style.display = 'none';
	renderBoard();

}

