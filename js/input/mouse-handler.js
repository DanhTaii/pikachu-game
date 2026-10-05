import Piece from "../models/piece.js";
import PathDrawer from "../path/path-drawer.js";
import GameManager from "../game/game-manager.js";
import PathFinder from "../models/path-finder.js";
import GameView from "../view/game-view.js";

export default class MouseHandler {
    constructor(board, soundHandler) {
        this.board = board;
        this.soundHandler = soundHandler;
        this.gameView = new GameView();
        this.pathFinder = new PathFinder(this.board);
        this.pathDrawer = new PathDrawer(this.gameView);

        this.firstSelectedPieceUI = null;
        this.firstSelectedPieceMatrix = null;

        this.init();
    }

    init() {
        this.handlePieceSelection();
        this.handleLevelSwap();
        this.handleShuffleButton();
        this.handleHintButton();
        this.handlePauseButton();
    }

    setBoard(board) {
        this.board = board;
        this.pathFinder = new PathFinder(this.board);
    }

    resetFirestPieceSelection() {
        this.firstSelectedPieceUI = null;
        this.firstSelectedPieceMatrix = null;
    }

    handlePieceSelection() {
        $('#pokemon-board').on('click', '.pokemon-piece', (event) => {
            const currentPieceUI = $(event.currentTarget);
            const currentPieceMatrix = new Piece(
                currentPieceUI.data('id'), currentPieceUI.data('row'), currentPieceUI.data('col')
            );

            // XỬ LÝ KHI CHƯA CHỌN
            if (this.firstSelectedPieceUI === null) {
                this.soundHandler.playSelect();

                this.firstSelectedPieceUI = currentPieceUI;
                this.firstSelectedPieceMatrix = new Piece(
                    currentPieceMatrix.getId(), currentPieceMatrix.getX(), currentPieceMatrix.getY()
                );

                this.gameView.handlePieceSelectionUI(currentPieceUI);
                // SAU KHI ĐÃ CHỌN 1
            } else {
                // VỊ TRÍ MA TRẬN CỦA PIECE
                const piece1 = this.firstSelectedPieceMatrix;
                const piece2 = currentPieceMatrix;
                let positionCornerOne = null;
                let positionCornerTwo = null;

                let corners = {positionCornerOne, positionCornerTwo};

                // XỬ LÝ KẾT NỐI THẲNG
                if (this.pathFinder.canConnectStraight(piece1, piece2)) {
                    this.pathDrawer.drawStraightConnection(this.firstSelectedPieceUI, currentPieceUI);
                    this.handleMatch(piece1, piece2, this.firstSelectedPieceUI, currentPieceUI);
                    // XỬ LÝ KÊẾT NỐI 1 GÓC
                } else if ((corners.positionCornerOne = this.pathFinder.canConnectOneCorner(piece1, piece2)) !== null) {
                    // console.log(positionCornerOne)
                    this.pathDrawer.drawOneCornerConnection(
                        this.firstSelectedPieceUI, currentPieceUI, corners.positionCornerOne
                    );
                    this.handleMatch(piece1, piece2, this.firstSelectedPieceUI, currentPieceUI);
                    // XỬ LÝ CHỌN SAI
                } else if ((corners = this.pathFinder.canConnectTwoCorner(piece1, piece2)) !== null) {
                    // console.log('BẮT ĐẦU VẼ 2 GÓC')
                    // console.log(corners.positionCornerOne);
                    // console.log(corners.positionCornerTwo);
                    this.pathDrawer.drawTwoCornerConnection(
                        this.firstSelectedPieceUI, currentPieceUI, corners.positionCornerOne, corners.positionCornerTwo
                    );
                    this.handleMatch(piece1, piece2, this.firstSelectedPieceUI, currentPieceUI);
                } else {
                    this.handleError(piece1, piece2, this.firstSelectedPieceUI, currentPieceUI)
                }
            }

        });
    }

    handleMatch(pieceMatrix1, pieceMatrix2, pieceUI1, pieceUI2) {
        this.soundHandler.playMatch();
        // pieceUI1.css('visibility', 'hidden');
        // pieceUI2.css('visibility', 'hidden');
        this.gameView.hidePieces(pieceUI1, pieceUI2);

        this.resetFirestPieceSelection();
        this.board.removePiece(pieceMatrix1);
        this.board.removePiece(pieceMatrix2);
        // console.log(this.board.remainingPiece);
        GameManager.getInstance().onMatchSuccess();
    }

    handleError(pieceMatrix1, pieceMatrix2, pieceUI1, pieceUI2) {
        this.soundHandler.playError();
        this.gameView.handleErrorUI(pieceUI1, pieceUI2);
        this.firstSelectedPieceUI = pieceUI2;
        this.firstSelectedPieceMatrix = pieceMatrix2;
    }

    handleLevelSwap() {
        const list = $('.level-list');
        list.on('click', '.level-list__item', (event) => {
            const newLevelItem = $(event.currentTarget);
            const levelIndex = newLevelItem.data('level');
            // console.log(newLevelItem);
            // console.log("LEVEL INDEX TRONG handleLevelSwap: ", levelIndex);
            this.gameView.handleLevelSwapUI(newLevelItem);
            GameManager.getInstance().loadLevel(null, levelIndex - 1);
        })
    }

    handleShuffleButton() {
        $('.shuffle-btn').on('click', (event) => {
            GameManager.getInstance().shuffleRemaining();
        })
    }

    handleHintButton() {
        $('.suggest-btn').on('click', () => {

            const result = this.pathFinder.isStillHaveConnection();
            // console.log(result);
            if (result === null) {
                return;
            }
            const {pieceOne, pieceTwo} = result;
            this.gameView.highlightHint(pieceOne.getX(), pieceOne.getY(), pieceTwo.getX(), pieceTwo.getY());
            // console.log(result);

        })
    }

    handlePauseButton() {
        const pauseButton = $('.pause-btn');
        pauseButton.on('click', () => {
            GameManager.getInstance().pauseTimer();
            this.gameView.handlePauseButtonUI(pauseButton);
        })
    }

}