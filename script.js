const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winnerMessage = document.getElementById('winner-message');
const playAgainButton = document.getElementById('play-again');
let isXTurn = true;
let isGameOver = false;

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

function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      cells[a].classList.contains('x') &&
      cells[b].classList.contains('x') &&
      cells[c].classList.contains('x')
    ) {
      return 'X';
    } else if (
      cells[a].classList.contains('o') &&
      cells[b].classList.contains('o') &&
      cells[c].classList.contains('o')
    ) {
      return 'O';
    }
  }
  if ([...cells].every(cell => cell.classList.contains('x') || cell.classList.contains('o'))) {
    return 'Tie';
  }
  return null;
}

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    if (!isXTurn || isGameOver || cell.classList.contains('x') || cell.classList.contains('o')) {
      return;
    }
    cell.classList.add('x');
    cell.textContent = 'X';
    isXTurn = false;
    const winner = checkWinner();
    if (winner) {
      if (winner === 'Tie') {
        winnerMessage.textContent = 'It\'s a Tie!';
      } else {
        winnerMessage.textContent = `${winner} wins!`;
      }
      isGameOver = true;
    } else {
      makeComputerMove();
    }
  });
});

function makeComputerMove() {
  const bestMove = getBestMove();
  cells[bestMove].classList.add('o');
  cells[bestMove].textContent = 'O';
  isXTurn = true;
  const winner = checkWinner();
  if (winner) {
    if (winner === 'Tie') {
      winnerMessage.textContent = 'It\'s a Tie!';
    } else {
      winnerMessage.textContent = `${winner} wins!`;
    }
    isGameOver = true;
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].classList.contains('x') && !cells[i].classList.contains('o')) {
      cells[i].classList.add('o');
      const score = minimax(cells, 0, false);
      cells[i].classList.remove('o');
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

const scores = {
  X: -10,
  O: 10,
  Tie: 0
};

function minimax(boardState, depth, isMaximizing) {
  const winner = checkWinner();
  if (winner !== null) {
    return scores[winner];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (!boardState[i].classList.contains('x') && !boardState[i].classList.contains('o')) {
        boardState[i].classList.add('o');
        const score = minimax(boardState, depth + 1, false);
        boardState[i].classList.remove('o');
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (!boardState[i].classList.contains('x') && !boardState[i].classList.contains('o')) {
        boardState[i].classList.add('x');
        const score = minimax(boardState, depth + 1, true);
        boardState[i].classList.remove('x');
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

playAgainButton.addEventListener('click', () => {
  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
    cell.textContent = '';
  });
  winnerMessage.textContent = '';
  isXTurn = true;
  isGameOver = false;
});
