import Board from "../models/board.js";
import {BOARD_COLS, BOARD_ROWS, PIECE_SIZE, POKEMON_TYPES} from "../utils/constants.js";
import SoundHandler from "../audio/sound-handler.js";
import MouseHandler from "../input/mouse-handler.js";
import Piece from "../models/piece.js";

export default class GameManager {
    static instance = null;

    static getInstance() {
        if (GameManager.instance === null) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    constructor() {
        if (GameManager.instance) {
            return;
        }
        this.gameState = 'INIT';
        this.board = new Board(BOARD_ROWS, BOARD_COLS);
        this.soundHandler = new SoundHandler();
        this.mouseHandler = new MouseHandler(this.board, this.soundHandler);
    }

    init(matrix) {
        if (matrix !== null) {
            this.spawnTestMap(matrix)
            this.renderBoard()
        } else {
            this.spawnPokemon();
        }
    }

    shuffle(array) {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }

        return array;
    }

    spawnPokemon() {
        let pokemonPool = [];

        for (let i = 0; i < POKEMON_TYPES; i++) {
            // THÊM 2 CẶP VAO
            pokemonPool.push(i, i, i, i);
        }
        this.shuffle(pokemonPool);
        this.board.fillBoard(pokemonPool);
        this.renderBoard();
    }

    spawnTestMap(matrix) {
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                const pieceId = matrix[row][col];
                if (pieceId !== null) {
                    // Tạo Piece và thêm vào Board
                    let piece = new Piece(pieceId, row, col);
                    this.board.addPiece(piece);
                }
            }
        }
    }

    renderBoard() {
        const board = $('#pokemon-board');

        this.board.getMatrix().forEach(
            function (row, rowIndex) {
                // TẠO THẺ DIV ROW
                const rowDiv = $('<div>');
                rowDiv.addClass('row-list-pieces col-auto g-0');
                // THÊM VÀO TABLE CỦA DIV
                board.append(rowDiv);

                // DUYỆT CÁC PHẦN TỬ TRONG ROW CỦA MAT TRẬN
                row.forEach(
                    function (piece, colIndex) {
                        // TẠO RA THẺ DIV CHO MỖI Ô (Dù có Pokemon hay không)
                        const pieceDiv = $('<div>');

                        // THÊM CLASS CSS CỦA POKEMON PIECE VÀO
                        pieceDiv.addClass('pokemon-piece');
                        pieceDiv.attr('data-row', rowIndex);
                        pieceDiv.attr('data-col', colIndex);


                        if (piece === null) {
                            pieceDiv.css('visibility', 'hidden');
                            rowDiv.append(pieceDiv);
                            return;
                        }

                        // KHAI BÁO GIÁ TRỊ CỦA QUÂN
                        const currentPieceId = piece.getId();
                        // const currentPieceRow = piece.getX();
                        // const currentPieceCol = piece.getY();

                        // THÊM INLINE CSS VÀO POKEMON PIECE
                        pieceDiv.css(
                            'background-position',
                            `-${currentPieceId * PIECE_SIZE}px 0`
                        )

                        // THÊM THUỘC TÍNH CỦA PIECE VÀO THẺ DIV
                        pieceDiv.attr('data-id', currentPieceId);
                        // pieceDiv.attr('data-row', currentPieceRow);
                        // pieceDiv.attr('data-col', currentPieceCol);

                        // THÊM PIECE VÀO DIV ROW
                        rowDiv.append(pieceDiv);
                    }
                )
            }
        );
    }

    onMatchSuccess() {
        if (this.board.isBoardEmpty()) {
            setTimeout(() => {
                alert("CHÚC MỪNG ! BẠN ĐÃ VƯỢT MÀN !")
            }, 200)
            return;
        }
    }
}