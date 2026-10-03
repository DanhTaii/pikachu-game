import Piece from "./piece.js";
import Position from "./position.js";
import {BOARD_COLS, BOARD_ROWS} from "../utils/constants.js";

export default class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = this.createEmptyBoard();
        this.remainingPiece = 0;
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
        this.remainingPiece++;

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
        this.remainingPiece--;
        this.getMatrix()[piece.getX()][piece.getY()] = null;
    }

    isBoardEmpty() {
        return this.remainingPiece === 0;
    }

    isCellEmpty(row, col) {
        return this.getPiece(row, col) === null;
    }

    isInside(row, col) {
        return (row >= 0 && row < this.rows && col >= 0 && col < this.cols);
    }

    printMatrix() {
        // console.log("CHẠY THUẬT TOÁN IN");

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

    canConnectStraight(piece1, piece2) {
        if (piece1.getId() !== piece2.getId()) {
            return false;
        }
        // console.log('CHỌN KẾT NỐI THẲNG');

        if (this.isClearPath(piece1.getPosition(), piece2.getPosition())) {
            // console.log('XONG KẾT NỐI THẲNG');
            return true;
        }

        // console.log("SAI KẾT NỐI THẲNG");
        return false;
    }

    canCreateCorner(position1, position2, positionCorner) {
        if (
            this.isCellEmpty(positionCorner.getX(), positionCorner.getY()) &&
            this.isClearPath(position1, positionCorner) &&
            this.isClearPath(position2, positionCorner)
        ) {
            // console.log('XONG KẾT NỐI 1 GÓC');
            return positionCorner;
        }
        return null;
    }

    canConnectOneCorner(piece1, piece2) {
        if (piece1.getId() !== piece2.getId()) {
            return null;
        }

        // console.log('CHỌN KẾT NỐI 1 GÓC');

        let pr1 = piece1.getX();
        let pc1 = piece1.getY();

        let pr2 = piece2.getX();
        let pc2 = piece2.getY();

        const positionCornerOne = new Position(pr1, pc2);
        const positionCornerTwo = new Position(pr2, pc1);

        const result1 = this.canCreateCorner(piece1.getPosition(), piece2.getPosition(), positionCornerOne);
        const result2 = this.canCreateCorner(piece1.getPosition(), piece2.getPosition(), positionCornerTwo);

        if (result1 !== null) {
            return result1;
        } else if (result2 !== null) {
            return result2;
        } else {
            // console.log('SAI KẾT NỐI 1 GÓC');
            return null;
        }
    }

    canCreateTwoCorner(position1, position2, corner1, corner2) {
        if (
            this.isClearPath(position1, corner1) &&
            this.isClearPath(corner1, corner2) &&
            this.isClearPath(corner2, position2)
        ) {
            return {
                positionCornerOne: corner1,
                positionCornerTwo: corner2
            }
        }
        return null;
    }

    canConnectTwoCorner(piece1, piece2) {
        if (piece1.getId() !== piece2.getId()) {
            return null;
        }

        // console.log('CHỌN KẾT NỐI 2 GÓC');

        let pr1 = piece1.getX();
        let pc1 = piece1.getY();

        let pr2 = piece2.getX();
        let pc2 = piece2.getY();

        let position1 = piece1.getPosition();
        let position2 = piece2.getPosition();

        let positionCornerOne = null;
        let positionCornerTwo = null;
        let result = null;

        // console.log(positionCornerOne);
        // console.log(positionCornerTwo);
        // console.log('ĐI VÔ ĐIỀU KIỆN');

        // CHẠY TỪNG ROW ĐỂ KIỂM TRA ĐƯỜNG NỐI
        for (let i = 0; i < BOARD_ROWS; i++) {
            // console.log('KIỂM TRA NGANG TỪ TRÊN XUỐNG');
            // ROW ĐÓ PHẢI KHÁC GIAS TRỊ CỦA 2 PIECE
            if (i !== pr1 && i !== pr2) {
                // NẾU VỊ TRÍ DÒNG CỦA 2 PIECE ĐÓ CÓ TRỐNG
                if (this.isCellEmpty(i, pc1) && this.isCellEmpty(i, pc2)) {
                    positionCornerOne = new Position(i, pc1);
                    positionCornerTwo = new Position(i, pc2);
                    result = this.canCreateTwoCorner(position1, position2, positionCornerOne, positionCornerTwo);
                    if (result !== null) {
                        return result;
                    }
                }
            }
        }

        // console.log(positionCornerOne);
        // console.log(positionCornerTwo);
        // CHẠY TỪNG CỘT ĐỂ KIỂM TRA ĐƯỜNG NỐI
        for (let j = 0; j < BOARD_COLS; j++) {
            // console.log('KIỂM TRA DỌC TỪ TRÁI QUA PHẢI');
            if (j !== pc1 && j !== pc2) {
                // NẾU ô ĐÓ TRỐNG THÌ
                if (this.isCellEmpty(pr1, j) && this.isCellEmpty(pr2, j)) {
                    positionCornerOne = new Position(pr1, j);
                    positionCornerTwo = new Position(pr2, j);

                    result = this.canCreateTwoCorner(position1, position2, positionCornerOne, positionCornerTwo);
                    if (result !== null) {
                        return result;
                    }
                }
            }
        }

        return null;
    }
}