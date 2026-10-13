const BOARD_ROWS = 11;
const BOARD_COLS = 18;
const POKEMON_TYPES = 36;
const POKEMON_PER_TYPE = 4;
const CELL_WIDTH = 42;
const CELL_HEIGHT = 52;

const boardElement = document.getElementById("board");
const board = createEmptyBoard(BOARD_ROWS, BOARD_COLS);

initGame();
fillBoard();
renderBoard();

function createEmptyBoard(rows, cols) {
    return Array.from({length: rows}, () => Array(cols).fill(null));
}

function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function fillBoard() {
    const pokemonPool = [];

    for (let id = 0; id < POKEMON_TYPES; id++) {
        for (let count = 0; count < POKEMON_PER_TYPE; count++) {
            pokemonPool.push(id);
        }
    }

    shuffle(pokemonPool);

    let index = 0;
    for (let row = 1; row < BOARD_ROWS - 1; row++) {
        for (let col = 1; col < BOARD_COLS - 1; col++) {
            board[row][col] = pokemonPool[index++];
        }
    }
}

function initGame() {
    for (let row = 0; row < BOARD_ROWS; row++) {
        const rowElement = document.createElement("tr");

        for (let col = 0; col < BOARD_COLS; col++) {
            const cell = document.createElement("td");
            cell.id = `cell-${row}-${col}`;
            cell.classList.add("cell");
            rowElement.appendChild(cell);
        }

        boardElement.appendChild(rowElement);
    }
}

function renderBoard() {
    for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS; col++) {
            const pokemonId = board[row][col];
            const cell = boardElement.rows[row].cells[col];

            if (pokemonId === null) continue;

            cell.style.backgroundImage = "url('assets/img/pieces-sprite.png')";
            cell.style.backgroundRepeat = "no-repeat";
            // Tính lại Background Size: Chiều dài dải ảnh = 36 loại * 42px, Chiều cao = 52px
            cell.style.backgroundSize = `${POKEMON_TYPES * CELL_WIDTH}px ${CELL_HEIGHT}px`;
            // Dịch chuyển ảnh theo chiều ngang một khoảng tương ứng với Chiều rộng (42px)
            cell.style.backgroundPosition = `-${pokemonId * CELL_WIDTH}px 0`;
        }
    }
}
