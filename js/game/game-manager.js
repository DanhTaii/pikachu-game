import Board from "../models/board.js";
import {BOARD_COLS, BOARD_ROWS, PIECE_SIZE, POKEMON_TYPES} from "../utils/constants.js";
import SoundHandler from "../audio/sound-handler.js";
import MouseHandler from "../input/mouse-handler.js";
import Piece from "../models/piece.js";
import {LEVEL_CONFIGS} from "../utils/level-config.js";
import GameView from "../view/game-view.js";

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
        this.mouseHandler = null;
        this.gameView = new GameView();

        this.currentLevelIndex = 0;
        this.remainingTime = 0;
        this.totalTime = 0;
        this.timerInterval = 0;
        this.currentScore = 0;
        this.highestScore = parseInt(localStorage.getItem('pikachu-highest-score')) || 0;
    }

    init(matrix) {
        this.loadLevel(matrix, 0);
        // $('#highest-score-value').text(this.highestScore);
        this.gameView.handleUpdateText('highest-score-value', this.highestScore);
        this.gameView.renderListLevel(this.currentLevelIndex);
    }

    loadLevel(matrix, levelIndex) {
        this.gameView.clearBoardUI();

        if (matrix !== null) {
            // this.board = new Board(BOARD_ROWS, BOARD_COLS);
            // this.mouseHandler = new MouseHandler(this.board, this.soundHandler);

            this.spawnTestMap(matrix)
            this.gameView.renderBoard(this.board)
        } else {
            // console.log('LEVEL INDEX TRONG loadLevel: ', levelIndex);
            this.currentLevelIndex = levelIndex;
            let levelConfig = LEVEL_CONFIGS[this.currentLevelIndex];
            // console.log(levelConfig);
            // console.log(this.currentLevelIndex);
            if (this.currentLevelIndex === 0) {
                this.updateCurrentScore(0);
                this.highestScore = 0;
                localStorage.setItem("pikachu-highest-score", this.highestScore);
            }
            this.totalTime = levelConfig.time;
            this.startTimer(levelConfig.time);

            this.board = new Board(levelConfig.rows, levelConfig.cols);
            // KIỂM TRA XEM NẾU NÓ NULL THÌ MỚI TẠO MỚI,
            // CÒN KHÔNG THÌ CHỈ ĐỔI BOARD DO ĐỀU CÓ CÙNG 1 CƠ CHẾ BẤM CHUỘT
            if (this.mouseHandler === null) {
                this.mouseHandler = new MouseHandler(this.board, this.soundHandler);
            } else {
                this.mouseHandler.setBoard(this.board)
            }
            this.gameView.handleUpdateText('current-level__value', this.currentLevelIndex + 1)
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

    shuffleRemaining() {
        let index = 0;
        // DANH SÁCH CÁC ID CỦA PIECE HIỆN CÒN TRÊN BÀN CỜ
        let currentPieceIds = [];
        // DANH SCASH CÁC VỊ TRÍ CỦA LẦN LƯỢT PIECE Ở MẢNG TRÊN CỦA BÀN CỜ
        let currentPiecePositions = [];

        // DUYỆT QUA BÀN CỜ
        for (let i = 0; i < this.board.rows; i++) {
            for (let j = 0; j < this.board.cols; j++) {
                // LẤY RA VỊ TRÍ HIỆN TẠI
                let currentPiece = this.board.getPiece(i, j);

                // NẾU NÓ KAHSC NULL THÌ
                if (currentPiece !== null) {
                    // THÊM ID CỦA NÓ VÀO MẢNG currentPieceIds
                    currentPieceIds[index] = currentPiece.getId();

                    // THÊM VỊ TRÍ CỦA NÓ VÀO currentPiecePositions
                    currentPiecePositions[index] = {
                        x: currentPiece.getX(),
                        y: currentPiece.getY()
                    }
                    index++;
                }
            }
        }

        // LẤY MẢNG CÁC ID RA, DÙNG SHUFFLE BAN ĐẦU ĐỂ ĐẢO VỊ TRÍ CÁC ID
        let shuffleIds = this.shuffle(currentPieceIds)

        // DUYỆT VÒNG LẶP ĐỂ THÊM LẠI VÀO VỊ TRÍ TRÊN MA TRẬN
        for (let i = 0; i < currentPiecePositions.length; i++) {
            // LẤY VỊ TRÍ TẠI I CỦA POSITION
            let position = currentPiecePositions[i];
            // LẤY ID MỚI TỪ MẢNG ĐÃ ĐƯỢC SHUFFLE
            let id = shuffleIds[i];
            // THÊM NÓ VÀO MA TRẬN
            this.board.getMatrix()[position.x][position.y] = new Piece(id, position.x, position.y)
        }

        // XÓA ĐI BẢNG HIỆN TẠI
        this.gameView.clearBoardUI();
        // TẢI LẠI GIAO DIỆN VỚI MA TRẬN MỚI
        this.gameView.renderBoard(this.board);
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
        // console.log(pokemonPool)
        this.board.fillBoard(pokemonPool);
        this.gameView.renderBoard(this.board);
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

    onMatchSuccess() {
        this.currentScore += 10;
        this.updateCurrentScore(this.currentScore);
        if (this.board.isBoardEmpty()) {
            let string = ''
            this.currentLevelIndex++;
            // console.log(this.currentLevelIndex)
            // TÌM ĐẾN BẢNG CHƯA CÁC DIV PIECE
            this.gameView.clearBoardUI();
            if (this.currentLevelIndex < LEVEL_CONFIGS.length) {
                string = 'CHUSC MỪNG ! BẠN ĐÃ VƯỢT MÀN !'
            } else {
                string = 'TUYEEJT VỜI ! BẠN ĐÃ PHÁ ĐẢO GAME !'
                this.currentLevelIndex = 0;
            }

            this.gameView.showMessage(string);
            this.loadLevel(null, this.currentLevelIndex)
            return;
        } else {
            if (this.mouseHandler.pathFinder.isStillHaveConnection() === null) {
                this.shuffleRemaining();
            }
        }
    }

    updateCurrentScore(score) {
        if (score > this.highestScore) {
            this.currentScore = score;
            this.highestScore = score;
            localStorage.setItem("pikachu-highest-score", this.highestScore);
            // XỬ LÝ CẬP NHẬT ĐỂM TRÊN GIAO DIỆN
            this.gameView.handleUpdateText('highest-score', this.currentScore);
            this.gameView.handleUpdateText('current-score', this.currentScore);
            // console.log(this.currentScore);
        } else {
            this.currentScore = score;
            this.gameView.handleUpdateText('current-score', this.currentScore);
        }
    }

    // ================ PHẦN XỬ LÝ THỜI GIAN ================
    formatTime(seconds) {
        let m = Math.floor(seconds / 60);
        let s = seconds % 60;

        return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s} `;
    }

    startTimer(seconds) {
        // HỦY BỘ ĐẾM THỜI GIAN
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // GÁN SỐ THỜI GIAN, VÀ TRUYỀN DỮ LIỆU LÊN UI
        this.remainingTime = seconds;
        let textTime = this.formatTime(seconds);
        this.gameView.updateTimer(this.remainingTime, this.totalTime, textTime);
        // $('.game-timer__text-value').text(this.formatTime(seconds));

        // BỘ ĐẾM THỜI GIAN BẮT ĐẦU CHẠY
        this.timerInterval = setInterval(() => {
            // TRWF THỜI GIAN VÀ CẬP NHẬT LẠI THỜI GIAN TEXT
            this.remainingTime--;
            let textTime = this.formatTime(this.remainingTime);
            this.gameView.updateTimer(this.remainingTime, this.totalTime, textTime);

            // NẾU HEEST THOWIF GIAN THÌ RESET LẠI
            if (this.remainingTime <= 0) {
                clearInterval(this.timerInterval);
                this.board = null;
                setTimeout(() => {
                    alert("HẾT GIỜ! BẠN ĐÃ THUA CUỘC!");
                    this.loadLevel(null, 0)
                }, 300);
            }
        }, 1000)
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    pauseTimer() {
        // BỘ ĐẾM KHNG CHẠY VÀ THỜI GIAN VẪN CÒN
        if (!this.timerInterval && this.remainingTime > 0) {
            this.startTimer(this.remainingTime);
        } else {
            this.stopTimer();
        }
    }
}