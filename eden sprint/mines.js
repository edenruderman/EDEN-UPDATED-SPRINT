"use strict";
var gBoard;
var gLevel;
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
var gLives;
const MINE = "💣";
const FLAG = "🇯🇵";
var gCount;
function init(SIZE = 4, MINES = 2) {
  gLevel = { SIZE: SIZE, MINES: MINES };
  gCount = 0;
  document.querySelector(".modal").classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
  gLives = 3;
  getLife();
  gGame.isOn = false;
  gBoard = createMat(SIZE);
  console.log(gBoard);
  printMat(gBoard, ".table");
}

function implementMines() {
  setRandomMines(2);
  setMinesNegsCount();
}

function createMat(SIZE) {
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}

function setMinesNegsCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard.isMine) continue;
      var minesCount = findMinesNegs(gBoard, i, j);
      if (!minesCount) minesCount = 0;
      gBoard[i][j].minesAroundCount = minesCount;
    }
  }
  return gBoard;
}

function findMinesNegs(board, cellI, cellJ) {
  var count = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j > board[i].length - 1) continue;
      if (board[i][j].isMine) count++;
    }
  }
  return count;
}
function cellClicked(elCell, i, j) {
  var currCell = gBoard[i][j];
  if (!gGame.isOn) {
    gGame.isOn = true;
    implementMines();
    return;
  }

  if (currCell.isMine) {
    gLives--;
    document.querySelector(
      ".lives h1"
    ).innerHTML = `LIVES LEFT:${gLives} ❤️‍🩹`;
    console.log(gLives);
    checkDefeat();
  }

  if (currCell.minesAroundCount && !currCell.isMine) {
    currCell.isShown = true;
    elCell.innerHTML = currCell.minesAroundCount;
  }
  if (!currCell.minesAroundCount && !currCell.isMine) elCell.innerHTML = 0;
}
function setRandomMines(MINES) {
  for (var i = 0; i < MINES; i++) {
    setRandomMine(gBoard);
  }
}

function setRandomMine(board) {
  var randNum =
    board[getRandomInt(0, board.length - 1)][getRandomInt(0, board.length - 1)];
  randNum.isMine = true;
  randNum.innerText = MINE;
}

function getLife() {
  var lives = document.querySelector(".lives h1");
  lives.innerHTML = `LIVES LEFT:${gLives} ❤️‍🔥`;
}

function checkDefeat() {
  if (!gLives) gameOver();
}
function gameOver(msg) {
  var smile = document.querySelector(" .smile");
  smile.innerHTML = "🤯";
  gGame.isOn = false;
  document.querySelector(".modal").classList.remove("hidden");
  document.querySelector(".overlay").classList.remove("hidden");
}
function checkVictory() {
  if (gCount === gLevel.MINES) gameOver();
}

function cellRightClicked(elCell, i, j) {
  gBoard[i][j].isMarked = true;
  console.log(gBoard[i][j]);
  elCell.innerHTML = FLAG;
  if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
    gCount++;
    checkVictory();
  }
}

window.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);
