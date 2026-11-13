// a place to store the game board
const gameBoard = (function(){
    const board = ["","","","","","","","",""]

    function getCell(index){
        return board[index];
    }

    function setCell(index, marker){
        board[index] = marker;
    }

    // for debugging 
    function displayBoard(){
        console.log(board);
    }

    function resetBoard(){
        for (let i = 0; i < board.length; i++){
            setCell(i, "");
        }
    }

    return { displayBoard, getCell, setCell, resetBoard }
})();

// factory for making players
function createPlayer(name, marker, color){
    return { name: name, marker: marker, color: color, score: 0};
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
    }

    function checkWin(){
        const winConditions = [
            [0, 1, 2],
            [3, 4 ,5], 
            [6, 7, 8], 
            [0, 3, 6],
            [1, 4, 7], 
            [2, 5, 8],
            [0, 4, 8], 
            [2, 4, 6]
        ];
        for (const [a, b, c] of winConditions){
            // checks for wins by seeing if all cells are the same and if one of the cells isn't empty
            if (gameBoard.getCell(a) !== "" && gameBoard.getCell(a) === gameBoard.getCell(b) && gameBoard.getCell(a) === gameBoard.getCell(c)){
                gameBoard.resetBoard();
                return true ;
            }
        }
        return false; 
    }

    return { getCurrentPlayer, switchTurn, checkWin };
})();

// handles frontend logic
const displayController = (function(){
    const resetBtn = document.getElementById("reset");
    resetBtn.addEventListener("click", () => {
        intro();
        resetBoard();
    })

    function render(){
        const domArray = new Array(9);
        for (let i = 0; i < 9; i++){
            const tileDom = document.createElement("div");
            tileDom.classList.add("active-tile");
            tileDom.id = `tile${i}`;
            domArray[i] = tileDom; 
            tileDom.addEventListener("mouseenter", enterEffect);
            tileDom.addEventListener("mouseleave", leaveEffect);
            tileDom.addEventListener("click", () => {
                gameBoard.displayBoard();
                const player = game.getCurrentPlayer(); 
                gameBoard.setCell(i, player.marker);
                tileDom.textContent = player.marker;
                tileDom.classList.add(player.color);
                game.switchTurn();
                gameBoard.displayBoard();
                game.checkWin();
                tileDom.removeEventListener("mouseenter", enterEffect); 
                tileDom.removeEventListener("mouseleave", leaveEffect);
            }, { once:true });
            container.append(tileDom);
        }
        return domArray;
    };

    // allows users to input their names
    function intro(){
        const dialog = document.getElementById("intro");
        const form = document.getElementById("form");
        const player1_name = document.getElementById("player1-label");
        const player2_name = document.getElementById("player2-label");
        dialog.showModal();
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            player1_name.textContent = formData.get("player1_name");
            player2_name.textContent = formData.get("player2_name");
            dialog.close();
            render();
        });
    };

    function enterEffect(tile){
        const player = game.getCurrentPlayer(); 
        event.currentTarget.classList.add(player.color, "active-tile2");
        event.currentTarget.textContent = player.marker;
    }

    function leaveEffect(tile){
        event.currentTarget.textContent = "";
        event.currentTarget.classList.remove("active-tile2");
    }

    intro();
})();