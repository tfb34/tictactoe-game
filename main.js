setTimeout(function(){
    renderBoard();
}, 200);

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

// create players
let player1 = Player("Player 1", "X");
let player2 = Player("Player 2", "O");
//when a player clicks on a cell what happens?
// 	check if space is valid. if not, nothing happens. 
// if valid, update array&board, check for win, next player's turn
function renderBoard(){
	for(let i = 0;i<9;i++){
		document.getElementById("cell"+i).addEventListener("click", playerMove);//don't forget to change this function
	}
}


function test(){
	console.log("worked");
	console.log("!"+this.id[4]+"!");
}

// here is where we make sense of who is playing
function playerMove(){
	let i = this.id[4];
	//check if space is occupued
	let currPlayer;
	if(gameController._currPlayer == 1){
		currPlayer = player1;
	}else{
		currPlayer = player2;
	}

	if(Gameboard.cells[i].length > 0){
		console.log("cell is taken.Try again.");
	}else{//player can move to selected cell
		console.log("valid");
		currPlayer.move(i);
		//display on board
		let p = document.createElement("p");
		p.innerHTML = currPlayer.token;
		document.getElementById("cell"+i).append(p);
		//update array
		Gameboard.cells[i] = currPlayer.token;//maybe not neccessary unless playing with AI
		Gameboard.emptyCells--;

		//check for win
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
		}

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




