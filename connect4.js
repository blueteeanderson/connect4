/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
const playAgain = document.querySelector("button");
playAgain.addEventListener("click", function (e) {
  playAgain.classList.toggle("hide");
  const htmlBoard = document.querySelector("#board");
  htmlBoard.innerHTML = "";
  board = [];
  currPlayer = 1;
  makeBoard();
  makeHtmlBoard();
});
let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  //create initial array
  //create sub arrays with map to avoid references
  board = Array(HEIGHT)
    .fill(null)
    .map(() => Array(WIDTH).fill(null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");
  //make the row for the squares that get clicked
  const top = document.createElement("tr");
  //set its id
  top.setAttribute("id", "column-top");
  //add a click event to the row
  top.addEventListener("click", handleClick);

  //add as many cells as width variable
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    //id = the number of the column
    headCell.setAttribute("id", x);
    //add to dom
    top.append(headCell);
  }
  htmlBoard.append(top);

  //add a row for until we reach height
  for (let y = 0; y < HEIGHT; y++) {
    //create a table row element
    const row = document.createElement("tr");
    //make a table cell until we reach width
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`); //equates to place in board matrix
      row.append(cell); //add to row
    }
    htmlBoard.append(row); //add to table
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    console.log(board[y][x]);
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const divPiece = document.createElement("div");
  divPiece.classList.add("piece", `p${currPlayer}`);
  const openSquare = document.getElementById(`${y}-${x}`);
  openSquare.append(divPiece);
}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message
  alert(msg);
  playAgain.classList.toggle("hide");
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // add line to update in-memory board
  board[y][x] = currPlayer;
  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  //check if all cells in board are filled; if so call, call endGame
  if (board.every((ind) => ind.every((val) => val !== null))) {
    return endGame(`Tie Game!`);
  }

  // switch players
  //switch currPlayer 1 <-> 2
  currPlayer = currPlayer == 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (var y = 0; y < HEIGHT; y++) {
    //loop vertically
    for (var x = 0; x < WIDTH; x++) {
      //loop horizontally
      var horiz = [
        //create horizontal array of pieces and empty
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      var vert = [
        //create vertical array of pieces and empty
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      var diagDR = [
        //create diagnoal left to right array of pieces and empty
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      var diagDL = [
        //create diagnoal right to left array of pieces and empty
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      //if _win function true for any direction
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
