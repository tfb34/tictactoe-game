/*
setTimeout(function(){
	renderBoard();
}, 200);
**/

let singlePlayer = false;
let player1;
let player2;
//define gameBoard module
var Gameboard = (function(){
	//cells = [[1,2,3],[4,5,6],[7,8,9]];
	emptyCells= 9;
	cells = ["","","","","","","","",""];
	return{
		cells,
		emptyCells
	}
})();


const Player = (name,token) =>{
	this.moves = ["","","","","","","","",""];
	this.turns = 0;

	move = function(pos){
		this.moves[pos] = true;
		this.turns+=1;
	};

	return{
		name,
		token,
		moves,
		turns,
		move
	}
};


var gameController = (function(){
	//check for a win
	function check4Win(player){
		console.log(player.name);
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
				document.getElementById("cell"+indices[0]).style.background= "pink";
				document.getElementById("cell"+indices[1]).style.background= "pink";
				document.getElementById("cell"+indices[2]).style.background= "pink";
				return true;
			}
			return false;
		}
	};
	// no winner, all spaces occupied
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

	return{
		_currPlayer : 1, //null
		nextPlayer,
		check4Win,
		tie
	}
})();

//display the board
function renderBoard(){
	console.log("hello");
	document.getElementById("board").style.visibility = "visible";
	displayCurrentPlayer();
	//document.getElementById("startMenu").style.display = "none";
	for(let i = 0;i<9;i++){
		document.getElementById("cell"+i).addEventListener("click", playerMove);//don't forget to change this function
	}
}

function displayCurrentPlayer(){
	if(gameController._currPlayer == 1){
		document.getElementById("displayWinner").innerHTML = player1.name +"( "+player1.token+" )";
	}else{
		document.getElementById("displayWinner").innerHTML = player2.name+"( "+player2.token+" )";
	}
}
//check if single play. this must have been clicked by player.
function playerMove(){
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

	}

}

function result(currPlayer){
	if(gameController.check4Win(currPlayer)){
			console.log("You won!");
			document.getElementById('displayWinner').innerHTML = currPlayer.name+" Wins! ";
			createReplayOption();
			disablePlayerMoves();
		}else if(gameController.tie()){
			console.log("Tie");
			document.getElementById('displayWinner').innerHTML = "It's a tie! ";
			createReplayOption();
		}else{
			gameController.nextPlayer();
			displayCurrentPlayer();
		}
}

function createReplayOption(){
	let span=document.createElement('span');
	span.innerHTML = "replay &#xf01e;";
	span.className="fa";
	span.setAttribute("onclick", "replay()");

	document.getElementById('displayWinner').append(span);
}

function replay(){
	window.location.reload(true);
}

function disablePlayerMoves(){
	for(let i = 0;i<9;i++){
		document.getElementById("cell"+i).removeEventListener("click", playerMove);//don't forget to change this function
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
		player2 = Player("Cosmo", "O");
		//return or go somehwere else
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

