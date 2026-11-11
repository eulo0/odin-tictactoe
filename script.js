// a place to store the game board
const gameBoard = (function(){
    const board = ["","","","","","","","",""]

    function getCell(index){
        return board[index];
    }

    function setCell(index, marker){
        board[index] = marker;
    }

    function displayBoard(){
        console.log(board);
    }

    return { displayBoard, setCell }
})();

// factory for making players
function createPlayer(name, marker, color){
    return { name: name, marker: marker, color: color };
}

const game = (function(){
    const player1 = createPlayer("Player 1", "X", "player1-color");
    const player2 = createPlayer("Player 2", "O", "player2-color");
    let currentPlayer = player1;

    function getCurrentPlayer(){
        return currentPlayer; 
    }

    // function that keeps track of player turn and changes it
    function switchTurn(){
        if (currentPlayer === player1){
            currentPlayer = player2;
        } 
        else {
            currentPlayer = player1;
        }
        console.log(currentPlayer.name);
    }

    function playRound(index){
        if (!placeMark(index)){
            return;
        }
        switchTurn();
    }
    return { getCurrentPlayer, playRound, switchTurn };
})();

// handles frontend logic
const displayController = (function(){
    const tiles = (function(){
        const domArray = new Array(9);
        for (let i = 0; i < 9; i++){
            const tileDom = document.createElement("div");
            tileDom.classList.add("active-tile");
            tileDom.id = `tile${i}`;
            domArray[i] = tileDom; 
            tileDom.addEventListener("click", () => {
                const player = game.getCurrentPlayer(); 
                gameBoard.setCell(i, player.marker);
                tileDom.textContent = player.marker;
                tileDom.classList.add(player.color);
                game.switchTurn();
                gameBoard.printBoard();
            }, { once:true });
        }
        return domArray;
    })();

    // appends the dom elements to the container 
    (function render(){
        const container = document.getElementById("container");
        for (tile of tiles){
            container.append(tile);
        }
    })();

})();