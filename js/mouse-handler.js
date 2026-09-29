import Piece from "./piece.js";

export default class MouseHandler {
    constructor(board, soundHandler) {
        this.board = board;
        this.soundHandler = soundHandler;

        this.firstSelectedPiece = null;
        this.firstPieceId = null;
        this.firstPieceRow = null;
        this.firstPieceCol = null;

        this.init();
    }

    init() {
        $('#pokemonBoard').on('click', '.pokemon-piece', (event) => {
            const currentPiece = $(event.currentTarget);
            const currentPieceId = currentPiece.data('id');
            const currentPieceRow = currentPiece.data('row');
            const currentPieceCol = currentPiece.data('col');

            if (this.firstSelectedPiece === null) {
                this.soundHandler.playSelect();

                this.firstSelectedPiece = currentPiece;
                this.firstPieceId = currentPieceId;
                this.firstPieceRow = currentPieceRow;
                this.firstPieceCol = currentPieceCol;

                currentPiece.addClass('selected');
            } else {
                const p1 = new Piece(this.firstPieceId, this.firstPieceRow, this.firstPieceCol);
                const p2 = new Piece(currentPieceId, currentPieceRow, currentPieceCol);

                if (this.board.canConnectStraight(p1, p2)) {
                    this.soundHandler.playMatch();

                    this.firstSelectedPiece.css('visibility', 'hidden');
                    currentPiece.css('visibility', 'hidden');

                    this.resetFirestPieceSelection();
                } else {
                    this.soundHandler.playError();
                    this.firstSelectedPiece.removeClass('selected');

                    this.firstSelectedPiece = currentPiece;

                    this.firstPieceId = currentPieceId;
                    this.firstPieceRow = currentPieceRow;
                    this.firstPieceCol = currentPieceCol;

                    this.firstSelectedPiece.addClass('selected');
                }
            }

        });
    }

    resetFirestPieceSelection() {
        this.firstSelectedPiece = null;
        this.firstPieceId = null;
        this.firstPieceRow = null;
        this.firstPieceCol = null;
    }

}