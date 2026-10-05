import Position from "../models/position.js";

// ***CHÚ Ý: CÁC ĐIỂM TỌA ĐỘ X, Y TRONG NÀY LÀ TRÊN GIAO DIỆN, KHÔNG PHẢI CỦA THẰNG POSITION
export default class PathDrawer {
    constructor(gameView) {
        this.gameView = gameView;
    }

    calculateCenterPiece(piece) {
        // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA BOARD
        const boardRect = this.gameView.getBoardUIContainer()[0].getBoundingClientRect();
        // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA DIV 1
        const rect = piece[0].getBoundingClientRect();

        // TÍNH TÂM X CỦA PIECE (Ô)
        const x = Math.round(rect.left + rect.width / 2 - boardRect.left);
        // TÍNH TÂM Y CỦA PIECE (Ô)
        const y = Math.round(rect.top + rect.height / 2 - boardRect.top);

        return {
            x: x,
            y: y
        }
    }

    drawStraightConnection(piece1, piece2) {
        // console.log('TÍNH TOÁN TÂM CÁC Ô TRÊN GIAO DIỆN')
        const centerPiece1 = this.calculateCenterPiece(piece1);
        const centerPiece2 = this.calculateCenterPiece(piece2);

        // console.log('VẼ ĐƯỜNG THẲNG')
        this.gameView.drawLine(centerPiece1.x, centerPiece1.y, centerPiece2.x, centerPiece2.y);

    }

    drawOneCornerConnection(piece1, piece2, cornerPosition) {
        const divCorner = this.gameView.getPieceElement(
            cornerPosition.getX(), cornerPosition.getY()
        );
        this.drawStraightConnection(piece1, divCorner);
        this.drawStraightConnection(divCorner, piece2);
    }

    drawTwoCornerConnection(piece1, piece2, cornerPositionOne, cornerPositionTwo) {
        const divCornerOne = this.gameView.getPieceElement(
            cornerPositionOne.getX(), cornerPositionOne.getY()
        );

        const divCornerTwo = this.gameView.getPieceElement(
            cornerPositionTwo.getX(), cornerPositionTwo.getY()
        );

        this.drawStraightConnection(piece1, divCornerOne);
        this.drawStraightConnection(divCornerOne, divCornerTwo);
        this.drawStraightConnection(divCornerTwo, piece2);
    }

}

