import Piece from "./piece.js";
import Position from "./position.js";

export default class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = this.createEmptyBoard();
    }

    createEmptyBoard() {
        // NHƯ 1 VÒNG LẶP, TẠO RA MẢNG HÀNG RỒI TẠO TIẾP CỘT CHO HÀNG ĐÓ
        // CHO TỚI KHI NÀO ĐỦ GIÁ TRỊ HÀNG THÌ DỪNG
        return Array.from(
            // TẠO 1 MẢNG GIÁ TRỊ TRỐNG DỰA VÀO GIÁ TRỊ ROWS
            {length: this.rows},
            // ĐI TỪNG HÀNG LẤP ĐẦY GIÁ TRỊ TRỐNG TRÊN BẰNG 1 MẢNG GIÁ TRỊ COLS
            () => Array(this.cols).fill(null)
        )
    }

    fillBoard(piecePool) {
        let indexPool = 0;
        for (let i = 1; i < this.rows - 1; i++) {
            for (let j = 1; j < this.cols - 1; j++) {
                const currentId = piecePool[indexPool];
                this.addPiece(new Piece(currentId, i, j));
                indexPool++;
            }
        }
    }

    getMatrix() {
        return this.matrix;
    }

    addPiece(piece) {
        const row = piece.getX();
        const col = piece.getY();

        // KIỂM TRA XEM CÓ NẰM TRONG MATRIX GAME
        if (!this.isInside(row, col)) {
            return false;
        }

        // KIỂM TRA VỊ TRÍ XEM CÓ TRỐNG KHÔNG
        if (this.matrix[row][col] !== null) {
            return false;
        }

        this.matrix[row][col] = piece;

        return true;
    }

    getPiece(row, col) {
        if (!this.isInside(row, col)) {
            return null;
        }

        return this.matrix[row][col]
    }

    removePiece(piece) {
        if (piece === null) {
            return;
        }
        this.getMatrix()[piece.getX()][piece.getY()] = null;
    }

    isCellEmpty(row, col) {
        return this.getPiece(row, col) === null;
    }

    isInside(row, col) {
        return (row >= 0 && row < this.rows && col >= 0 && col < this.cols);
    }

    printMatrix() {
        console.log("CHẠY THUẬT TOÁN IN");

        const displayMatrix = this.matrix.map(row =>
            row.map(cell => {
                if (cell === null) return null;

                return cell.getId();
            })
        );

        console.table(displayMatrix);
    }

    isClearPath(position1, position2) {
        let pr1 = position1.getX();
        let pc1 = position1.getY();

        let pr2 = position2.getX();
        let pc2 = position2.getY();

        if (pr1 === pr2) {
            const startCol = Math.min(pc1, pc2);
            const endCol = Math.max(pc1, pc2);
            for (let c = startCol + 1; c < endCol; c++) {
                if (!this.isCellEmpty(pr1, c)) {
                    return false;
                }
            }
            return true;
        }

        if (pc1 === pc2) {
            const startRow = Math.min(pr1, pr2);
            const endRow = Math.max(pr1, pr2);
            for (let r = startRow + 1; r < endRow; r++) {
                if (!this.isCellEmpty(r, pc1)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    canConnect(piece1, piece2) {
        console.log('CHỌN LOẠI KẾT NỐI');
        if (this.canConnectStraight(piece1, piece2) || this.canConnectOneCorner(piece1, piece2)) {
            this.removePiece(piece1);
            this.removePiece(piece2)
            return true;
        }
        return false;
    }

    canConnectStraight(piece1, piece2) {
        if (piece1.getId() !== piece2.getId()) {
            return false;
        }
        console.log('CHỌN KẾT NỐI THẲNG');

        if (this.isClearPath(piece1.getPosition(), piece2.getPosition())) {
            console.log('XONG KẾT NỐI THẲNG');
            return true;
        }

        console.log("SAI KẾT NỐI THẲNG");
        return false;
    }

    canConnectOneCorner(piece1, piece2) {
        if (piece1.getId() !== piece2.getId()) {
            return null;
        }

        console.log('CHỌN KẾT NỐI 1 GÓC');

        let pr1 = piece1.getX();
        let pc1 = piece1.getY();

        let pr2 = piece2.getX();
        let pc2 = piece2.getY();

        const positionCornerOne = new Position(pr1, pc2);
        const positionCornerTwo = new Position(pr2, pc1);

        if (
            this.isCellEmpty(pr1, pc2) &&
            this.isClearPath(piece1.getPosition(), positionCornerOne) &&
            this.isClearPath(piece2.getPosition(), positionCornerOne)
        ) {
            console.log('XONG KẾT NỐI 1 GÓC');
            return positionCornerOne;
        }

        if (
            this.isCellEmpty(pr2, pc1) &&
            this.isClearPath(piece1.getPosition(), positionCornerTwo) &&
            this.isClearPath(piece2.getPosition(), positionCornerTwo)
        ) {
            console.log('XONG KẾT NỐI 1 GÓC');
            return positionCornerTwo;
        }

        console.log('SAI KẾT NỐI 1 GÓC');
        return null;
    }
}