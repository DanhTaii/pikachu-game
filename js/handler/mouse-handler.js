import Piece from "../models/piece.js";
import PathDrawer from "../path/path-drawer.js";

export default class MouseHandler {
    constructor(board, soundHandler) {
        this.board = board;
        this.soundHandler = soundHandler;
        this.pathDrawer = new PathDrawer();

        this.firstSelectedPieceUI = null;
        this.firstSelectedPieceMatrix = null;

        this.init();
    }

    init() {
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

                currentPieceUI.addClass('selected');
                // SAU KHI ĐÃ CHỌN 1
            } else {
                // VỊ TRÍ MA TRẬN CỦA PIECE
                const piece1 = this.firstSelectedPieceMatrix;
                const piece2 = currentPieceMatrix;
                let positionCornerOne = null;
                let positionCornerTwo = null;

                // XỬ LÝ KẾT NỐI THẲNG
                if (this.board.canConnectStraight(piece1, piece2)) {
                    this.pathDrawer.drawStraightConnection(this.firstSelectedPieceUI, currentPieceUI);
                    this.handleMatch(piece1, piece2, this.firstSelectedPieceUI, currentPieceUI);
                    // XỬ LÝ KÊẾT NỐI 1 GÓC
                } else if ((positionCornerOne = this.board.canConnectOneCorner(piece1, piece2)) !== null) {
                    // console.log(positionCornerOne)
                    this.pathDrawer.drawOneCornerConnection(
                        this.firstSelectedPieceUI, currentPieceUI, positionCornerOne
                    );
                    this.handleMatch(piece1, piece2, this.firstSelectedPieceUI, currentPieceUI);
                    // XỬ LÝ CHỌN SAI
                } else {
                    this.handleError(piece1, piece2, this.firstSelectedPieceUI, currentPieceUI)
                }
            }

        });
    }

    resetFirestPieceSelection() {
        this.firstSelectedPieceUI = null;
        this.firstSelectedPieceMatrix = null;
    }

    handleMatch(pieceMatrix1, pieceMatrix2, pieceUI1, pieceUI2) {
        this.soundHandler.playMatch();
        pieceUI1.css('visibility', 'hidden');
        pieceUI2.css('visibility', 'hidden');
        this.resetFirestPieceSelection();
        this.board.removePiece(pieceMatrix1);
        this.board.removePiece(pieceMatrix2)
    }

    handleError(pieceMatrix1, pieceMatrix2, pieceUI1, pieceUI2) {
        this.soundHandler.playError();
        pieceUI1.removeClass('selected');
        pieceUI2.addClass('selected');

        this.firstSelectedPieceUI = pieceUI2;
        this.firstSelectedPieceMatrix = pieceMatrix2;
    }

}