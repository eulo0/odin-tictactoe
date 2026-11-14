// a place to store the game board
const gameBoard = (function(){
    const board = ["","","","","","","","",""];

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
            if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]){
                resetBoard();
                return true ;
            }
        }
        return false; 
    }

    function isFull(){
        for (const tile of board){
            if (tile === ""){
                return false; 
            }
        }
        return true
    }

    return { displayBoard, setCell, resetBoard, checkWin, isFull }
})();

// factory for making players
function createPlayer(name, marker, color){
    return { name: name, marker: marker, color: color, score: 0};
}

const game = (function(){
    const player1 = createPlayer("Player 1", "X", "player1-color");
    const player2 = createPlayer("Player 2", "O", "player2-color");
    let ties = 0;
    let currentPlayer = player1;

    function getPlayer1Score(){
        return player1.score;
    }

    function getPlayer2Score(){
        return player2.score;
    }

    function getCurrentPlayer(){
        return currentPlayer; 
    }

    function getCurrentColor(){
        return currentPlayer.color;
    }

    function getCurrentMarker(){
        return currentPlayer.marker;
    }

    function getOtherColor(){
        if (currentPlayer === player1){
            return player2.color;
        }
        else{
            return player1.color;
        }
    }

    function getTies(){
        return ties;
    }

    function incrementCurrentScore(){
        currentPlayer.score += 1;
    }

    function incrementTies(){
        ties += 1;
    }

    function resetScores(){
        player1.score = 0;
        player2.score = 0; 
        ties = 0;
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

    function restartTurn(){
        currentPlayer = player1;
    }

    return { getPlayer1Score, getPlayer2Score, getCurrentColor, getOtherColor, getTies, getCurrentMarker, 
             incrementCurrentScore, incrementTies, switchTurn, resetScores, restartTurn};
})();

// handles frontend logic
const displayController = (function(){
    const container = document.getElementById("container");
    const nextBtn = document.getElementById("next-round");
    const resetBtn = document.getElementById("reset");
    resetBtn.addEventListener("click", () => {
        clearTiles();
        intro();
        gameBoard.resetBoard();
    })
    nextBtn.addEventListener("click", () => {
        clearTiles();
        gameBoard.resetBoard();
        render();
    });

    function render(){
        nextBtn.style.visibility = "hidden";
        for (let i = 0; i < 9; i++){
            const tileDom = document.createElement("div");
            tileDom.classList.add("inactive-tile");
            tileDom.dataset.id = i;
            tileDom.addEventListener("mouseenter", enterEffect);
            tileDom.addEventListener("mouseleave", leaveEffect);
            tileDom.addEventListener("click", renderTiles, { once:true });
            container.append(tileDom);
        }
    };

    function clearTiles(){
        container.textContent = "";
    }

    // allows users to input their names
    function intro(){
        nextBtn.style.visibility = "hidden";
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

    // 
    function roundOver(){
        nextBtn.style.visibility = "visible";
        setScore();
        for (const tile of container.children){
            tile.removeEventListener("mouseenter", enterEffect); 
            tile.removeEventListener("mouseleave", leaveEffect);
            tile.removeEventListener("click", renderTiles);
        }
    }

    function setScore(){
        const player1ScoreLabel =  document.getElementById("player1-score");
        const player2ScoreLabel = document.getElementById("player2-score");
        const ties = document.getElementById("ties");
        player1ScoreLabel.textContent = game.getPlayer1Score();
        player2ScoreLabel.textContent = game.getPlayer2Score();
        ties.textContent = game.getTies();
    }

    function enterEffect(tile){
        const playerColor = game.getCurrentColor();
        const playerMarker = game.getCurrentMarker();
        event.currentTarget.classList.add(playerColor, "active-tile");
        event.currentTarget.textContent = playerMarker;
    }

    function leaveEffect(tile){
        const playerColor = game.getCurrentColor();
        event.currentTarget.textContent = "";
        event.currentTarget.classList.remove("active-tile");
        event.currentTarget.classList.remove(playerColor);
    }

    function renderTiles(tile){
        const playerColor = game.getCurrentColor();
        const otherColor = game.getOtherColor();
        const playerMarker = game.getCurrentMarker();
        gameBoard.setCell(Number(tile.currentTarget.dataset.id), playerMarker);
        tile.currentTarget.textContent = playerMarker;
        tile.currentTarget.classList.remove(otherColor);
        tile.currentTarget.classList.add(playerColor);
        game.switchTurn();
        gameBoard.displayBoard();
        if (gameBoard.checkWin()){
            game.switchTurn(); // to ensure that the winning player gets the point
            game.incrementCurrentScore();
            roundOver();
        }
        // logic whenever there is a tie
        else if (gameBoard.isFull()){
            game.restartTurn();
            game.incrementTies();
            roundOver();
        }
        tile.currentTarget.removeEventListener("mouseenter", enterEffect); 
        tile.currentTarget.removeEventListener("mouseleave", leaveEffect);
        tile.currentTarget.classList.remove("active-tile");
    }
    intro();

})();