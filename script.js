// a place to store the game board
const gameBoard = (function(){
    const board = ["", "", "", "", "", "", "", "", ""];

    function getCell(index){
        return board[index];
    }

    function setCell(index, marker){
        board[index] = marker;
    }

    function displayBoard(){
        const gameBoard = document.getElementById("container");

    }

    function createCell(){
        document.createElement("div");
        document.classList.add("tile");
    }
})();

// factory for making players
function createPlayer(name, marker){
    return { name: name, marker: marker };
}

const game = (function(){
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");
    let currentPlayer = player1;

    // function that keeps track of player turn and changes it
    function switchTurn(){
        if (currentPlayer === player1){
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    }

    // function that places a mark for a player
    function placeMark(index){
        gameBoard.setCell(index, currentPlayer.marker);
        return true;
    }

    function playRound(index){
        if (!placeMark(index)){
            return;
        }

        gameBoard.printBoard();
        switchTurn();
    }

    gameBoard.printBoard();

    return { playRound };
})();
