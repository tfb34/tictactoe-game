

//define gameBoard module
var Gameboard = (function(){
	//cells = [[1,2,3],[4,5,6],[7,8,9]];
	cells = ["","","","","","","","",""];
	return{
		cells
	}
})();


const Player = (name,token) =>{
	return{
		name,
		token
	}
};


//display the board

//when a player clicks on a cell what happens?
// 	check if space is valid. if not, nothing happens. 
// if valid, update array&board, check for win, next player's turn
function renderBoard(pos,token){
	for(let i = 0;i<9;i++){
		document.getElementById("cell"+i).addEventListener("click", function(){test(i)});
	}

}


function test(i){
	console.log("cell"+i+" clicked");
}