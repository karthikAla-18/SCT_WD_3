const board = document.getElementById("board");
const statusDiv = document.getElementById("status");
const floatingMessage = document.getElementById("floatingMessage");
const startPage = document.getElementById("startPage");
const gamePage = document.getElementById("gamePage");
const modeSelect = document.getElementById("mode");

let cells = [];
let currentPlayer = "X";
let gameActive = false;
let singlePlayer = true;
let waitingForEnter = false;

function showGame() {
  startPage.classList.remove("active");
  gamePage.classList.add("active");
}
modeSelect.addEventListener("change", () => {
  singlePlayer = modeSelect.value === "computer";
});

function startGame() {
  resetGame();
  gameActive = true;
  statusDiv.textContent = "Player X's turn";
}
function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
    cells.push("");
  }
}
function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index] !== "") return;
  makeMove(index, currentPlayer);
  if (gameActive && singlePlayer && currentPlayer === "O") {
    setTimeout(computerMove, 300);
  }
}
function makeMove(index, player) {
  if (cells[index] !== "") return;
  cells[index] = player;
  const cell = board.children[index];
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());

  if (checkWinner()) {
    statusDiv.textContent = \`🎉 Player \${player} wins!\`;
    showFloatingMessage(\`🎉 Player \${player} Wins! 🎉\nPress ENTER to restart\`);
    fireworkBurst();
    gameActive = false;
    waitingForEnter = true;
  } else if (!cells.includes("")) {
    statusDiv.textContent = "🤝 It's a draw!";
    showFloatingMessage("🤝 It's a Draw!\nPress ENTER to restart");
    gameActive = false;
    waitingForEnter = true;
  } else {
    currentPlayer = player === "X" ? "O" : "X";
    statusDiv.textContent = \`Player \${currentPlayer}'s turn\`;
  }
}
function computerMove() {
  const emptyIndexes = cells.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  makeMove(randomIndex, "O");
}
function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a,b,c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c]);
}
function resetGame() {
  currentPlayer = "X";
  gameActive = false;
  statusDiv.textContent = "Click \"Start Game\" to begin";
  createBoard();
  hideFloatingMessage();
  waitingForEnter = false;
}
function showFloatingMessage(message) {
  floatingMessage.style.display = "block";
  floatingMessage.innerText = message;
}
function hideFloatingMessage() {
  floatingMessage.style.display = "none";
}
function fireworkBurst() {
  for (let i = 0; i < 15; i++) {
    const fw = document.createElement("div");
    fw.className = "firework";
    fw.style.left = Math.random() * window.innerWidth + "px";
    fw.style.top = Math.random() * window.innerHeight + "px";
    fw.style.background = \`hsl(\${Math.random()*360}, 100%, 50%)\`;
    document.body.appendChild(fw);
    setTimeout(() => fw.remove(), 1000);
  }
}
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && waitingForEnter) startGame();
});
createBoard();