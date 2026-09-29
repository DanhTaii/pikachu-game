import Piece from "./piece.js";

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
        const {row, col} = piece.getPosition();

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

    isEmpty(row, col) {
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
}