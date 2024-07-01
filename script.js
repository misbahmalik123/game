const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameBoard = Array(9).fill(null);

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

function handleClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (gameBoard[index] !== null || currentPlayer !== 'X') {
        return;
    }

    cell.textContent = currentPlayer;
    gameBoard[index] = currentPlayer;

    if (checkWin()) {
        alert(`${currentPlayer} wins!`);
        resetGame();
    } else if (gameBoard.every(cell => cell !== null)) {
        alert('It\'s a draw!');
        resetGame();
    } else {
        currentPlayer = 'O';
        aiMove();
    }
}

function checkWin() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function resetGame() {
    gameBoard.fill(null);
    cells.forEach(cell => (cell.textContent = ''));
    currentPlayer = 'X';
}

function aiMove() {
    const bestMove = getBestMove(gameBoard);
    gameBoard[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    if (checkWin()) {
        alert(`O wins!`);
        resetGame();
    } else if (gameBoard.every(cell => cell !== null)) {
        alert('It\'s a draw!');
        resetGame();
    } else {
        currentPlayer = 'X';
    }
}

function getBestMove(board) {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner(board, 'O')) {
        return 10;
    } else if (checkWinner(board, 'X')) {
        return -10;
    } else if (board.every(cell => cell !== null)) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board, player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] === player && board[a] === board[b] && board[a] === board[c];
    });
}
