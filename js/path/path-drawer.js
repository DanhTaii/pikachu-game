import Position from "../models/position.js";

// ***CHÚ Ý: CÁC ĐIỂM TỌA ĐỘ X, Y TRONG NÀY LÀ TRÊN GIAO DIỆN, KHÔNG PHẢI CỦA THẰNG POSITION
export default class PathDrawer {
    constructor() {
        this.board = $('#pokemon-board');
    }

    calculateCenterPiece(piece) {
        // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA BOARD
        const boardRect = this.board[0].getBoundingClientRect();
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

    drawLine(x1, y1, x2, y2) {
        const line = $('<div class="connection-line"></div>');

        if (x1 === x2) {
            // VẼ ĐƯỜNG THẲNG DỌC
            // console.log('VẼ ĐƯỜNG THẲNG NGANG');
            line.css({
                // ĐIỂM X BẮT ĐẦU TỪ X1 HOẶC X2 ĐỀU ĐƯỢC DO NÓ ĐÃ CHUNG 1 CỘT
                left: x1,
                // ĐIỂM Y BẮT ĐẦU SẼ LÀ NHỎ NHẤT CỦA Y1, Y2
                top: Math.min(y1, y2),
                // ĐỘ DÀY SẼ LÀ 3
                width: 3,
                // CHIỀU CAO CỦA LINE SẼ LÀ KHOẢNG CÁCH GIỮA Y1 VÀ Y2
                height: Math.abs(y2 - y1)
            });
        } else if (y1 === y2) {
            // VẼ ĐƯỜNG THẲNG NGANG
            // console.log('VẼ ĐƯỜNG THẲNG DỌC');
            line.css({
                // ĐIỂM X BẮT ĐẦU SẼ LÀ TỪ VỊ TRÍ TÂM NHỎ NHẤT VÀ TỪ PHẢI VẼ TỪ TRÁI SANG PHẢI
                left: Math.min(x1, x2),
                // ĐIỂM Y BẮT ĐẦU SẼ LÀ TỪ Y1 (HOẶC Y2)
                top: y1,
                // ĐỘ DÀI SẼ LÀ KHOẢNG CÁCH GIỮA X1 VÀ X2
                width: Math.abs(x2 - x1),
                // CHIỀU CAO CỦA ĐƯỜNG
                height: 3
            });
        }


        // THÊM LINE VÀO LAYER
        $('#connection-layer').append(line);

        // TÍNH THỜI GIAN LINE BỊ XÓA
        setTimeout(() => {
            line.remove();
        }, 100)
    }

    drawStraightConnection(piece1, piece2) {
        // console.log('TÍNH TOÁN TÂM CÁC Ô TRÊN GIAO DIỆN')
        const centerPiece1 = this.calculateCenterPiece(piece1);
        const centerPiece2 = this.calculateCenterPiece(piece2);

        // console.log('VẼ ĐƯỜNG THẲNG')
        this.drawLine(centerPiece1.x, centerPiece1.y, centerPiece2.x, centerPiece2.y);

    }

    getPositionCornerElement(row, col) {
        return $(`#pokemon-board .pokemon-piece[data-row="${row}"][data-col="${col}"]`);
    }

    drawOneCornerConnection(piece1, piece2, cornerPosition) {
        const divCorner = this.getPositionCornerElement(
            cornerPosition.getX(), cornerPosition.getY()
        );
        this.drawStraightConnection(piece1, divCorner);
        this.drawStraightConnection(divCorner, piece2);
    }

    drawTwoCornerConnection(piece1, piece2, cornerPositionOne, cornerPositionTwo) {
        const divCornerOne = this.getPositionCornerElement(
            cornerPositionOne.getX(), cornerPositionOne.getY()
        );

        const divCornerTwo = this.getPositionCornerElement(
            cornerPositionTwo.getX(), cornerPositionTwo.getY()
        );

        this.drawStraightConnection(piece1, divCornerOne);
        this.drawStraightConnection(divCornerOne, divCornerTwo);
        this.drawStraightConnection(divCornerTwo, piece2);
    }

}

