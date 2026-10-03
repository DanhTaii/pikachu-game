import Board from "../models/board.js";
import {BOARD_COLS, BOARD_ROWS, PIECE_SIZE, POKEMON_TYPES} from "../utils/constants.js";
import SoundHandler from "../audio/sound-handler.js";
import MouseHandler from "../input/mouse-handler.js";
import Piece from "../models/piece.js";
import {LEVEL_CONFIGS} from "../utils/level-config.js";

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
        this.soundHandler = new SoundHandler();
        this.currentLevelIndex = 0;
    }

    loadLevel(matrix, levelIndex) {
        const board = $('#pokemon-board');
        board.find('.pokemon-piece').remove();
        this.renderListLevel();

        if (matrix !== null) {
            this.board = new Board(BOARD_ROWS, BOARD_COLS);
            this.mouseHandler = new MouseHandler(this.board, this.soundHandler);

            this.spawnTestMap(matrix)
            this.renderBoard()
        } else {
            // console.log('LEVEL INDEX TRONG loadLevel: ', levelIndex);
            this.currentLevelIndex = levelIndex;
            let levelConfig = LEVEL_CONFIGS[this.currentLevelIndex];
            // console.log(levelConfig);
            // console.log(this.currentLevelIndex);

            this.board = new Board(levelConfig.rows, levelConfig.cols);
            this.mouseHandler = new MouseHandler(this.board, this.soundHandler);
            $('.current-level__value').text(this.currentLevelIndex + 1);
            this.spawnPokemon(levelConfig.types);
        }

    }

    shuffle(array) {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }

        return array;
    }

    spawnPokemon(types) {
        if (types === -1) {
            types = POKEMON_TYPES;
        }
        let pokemonPool = [];

        for (let i = 0; i < types; i++) {
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

    renderListLevel() {
        const container = $('.level-list');
        container.find('.level-list__item').remove();

        let listLevelConfig = LEVEL_CONFIGS.length;

        for (let i = 0; i < listLevelConfig; i++) {
            const item = $('<li>');
            item.addClass('level-list__item'); // Bạn quên add class này cho thẻ li
            item.attr('data-level', i + 1);

            const button = $('<button>');
            button.addClass('game-btn');
            if (i === this.currentLevelIndex) {
                button.addClass('active');
            }

            button.append($('<i class="fa-solid fa-circle-play"></i>'));
            button.append($(`<span class="fw-bold text-light">Màn ${i + 1}</span>`))

            item.append(button)
            container.append(item)
        }
    }

    onMatchSuccess() {
        if (this.board.isBoardEmpty()) {
            let string = ''
            this.currentLevelIndex++;
            // console.log(this.currentLevelIndex)
            // TÌM ĐẾN BẢNG CHƯA CÁC DIV PIECE
            const board = $('#pokemon-board');
            // KIẾM VÀ XÓA CÁC DIV CÓ CLASS LÀ pokemon-piece,
            // DO CÒN THẺ DIV CONNECTION-LAYER
            board.find('.pokemon-piece').remove();
            if (this.currentLevelIndex < LEVEL_CONFIGS.length) {
                string = 'CHUSC MỪNG ! BẠN ĐÃ VƯỢT MÀN !'
            } else {
                string = 'TUYEEJT VỜI ! BẠN ĐÃ PHÁ ĐẢO GAME !'
                this.currentLevelIndex = 0;
            }

            setTimeout(() => {
                alert(string)
            }, 200)
            this.loadLevel(null, this.currentLevelIndex)
            return;
        }
    }
}