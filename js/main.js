import Board from "./models/board.js";
import {BOARD_COLS, BOARD_ROWS, PIECE_SIZE, POKEMON_TYPES} from "./utils/constants.js";
import SoundHandler from "./handler/sound-handler.js";
import MouseHandler from "./handler/mouse-handler.js";

let gameBoard = new Board(BOARD_ROWS, BOARD_COLS);

let soundManager = new SoundHandler();

let mouseHandler = new MouseHandler(
    gameBoard,
    soundManager
);

function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }

    return array;
}

function spawnPokemon() {
    let pokemonPool = [];

    for (let i = 0; i < POKEMON_TYPES; i++) {
        // THÊM 2 CẶP VAO
        pokemonPool.push(i, i, i, i);
    }
    shuffle(pokemonPool);
    gameBoard.fillBoard(pokemonPool);
    renderBoard();
    gameBoard.printMatrix();
}

function renderBoard() {
    const board = $('#pokemon-board');

    gameBoard.getMatrix().forEach(
        function (row, rowIndex) {
            // TẠO THẺ DIV ROW
            const rowDiv = $('<div>');
            rowDiv.addClass('row-list-pieces col-auto g-0');
            // THÊM VÀO TABLE CỦA DIV
            board.append(rowDiv);

            // DUYỆT CÁC PHẦN TỬ TRONG ROW CỦA MAT TRẬN
            row.forEach(
                function (piece, colIndex) {
                    // NẾU QUÂN CÓ THÌ BỎ QUA
                    if (piece === null) {
                        return;
                    }

                    // KHAI BÁO GIÁ TRỊ CỦA QUÂN
                    const currentPieceId = piece.getId();
                    const currentPieceRow = piece.getX();
                    const currentPieceCol = piece.getY();

                    // TẠO RA THẺ DIV
                    const pieceDiv = $('<div>');

                    // THÊM CLASS CSS CỦA POKEMON PIECE VÀO
                    pieceDiv.addClass('pokemon-piece');

                    // THÊM INLINE CSS VÀO POKEMON PIECE
                    pieceDiv.css(
                        'background-position',
                        `-${currentPieceId * PIECE_SIZE}px 0`
                    )

                    // THÊM THUỘC TÍNH CỦA PIECE VÀO THẺ DIV
                    pieceDiv.attr('data-id', currentPieceId);
                    pieceDiv.attr('data-row', currentPieceRow);
                    pieceDiv.attr('data-col', currentPieceCol);

                    // THÊM PIECE VÀO DIV ROW
                    rowDiv.append(pieceDiv);
                }
            )
        })
}

$(document).ready(function () {
    spawnPokemon();
});
