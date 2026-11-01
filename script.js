// a place to store the game board
const gameBoard = (function(){
    const board = ["", "", "", "", "", "", "", "", ""];

    function getCell(index){
        return board[index];
    }

    function setCell(index, marker){
        board[index] = marker;
    }

    function printBoard(){
        let text = "";
        for (let i = 0; i < 9; i++){
            if (board[i] === ""){
                text += "   ";
            } else {
                text += " " + board[i] + " ";
            }

            if (i === 2 || i === 5){
                text += "\n---+---+---\n";
            } else if (i !== 8){
                text += "|";
            }
        }
        console.log(text);
    }

    return { getCell, setCell, printBoard };
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
