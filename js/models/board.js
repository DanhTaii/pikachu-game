import Piece from "./piece.js";
import Position from "./position.js";
import {BOARD_COLS, BOARD_ROWS} from "../utils/constants.js";

export default class Board {
    constructor(rows, cols, pathFinder) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = this.createEmptyBoard();
        this.remainingPiece = 0;
    }

    setRowAndCol(rows, cols) {
        this.rows = rows;
        this.cols = cols;
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

    fillBoard(piecePool, positions) {
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

    // printMatrix() {
    //     // console.log("CHẠY THUẬT TOÁN IN");
    //
    //     const displayMatrix = this.matrix.map(row =>
    //         row.map(cell => {
    //             if (cell === null) return null;
    //
    //             return cell.getId();
    //         })
    //     );
    //
    //     console.table(displayMatrix);
    // }
}