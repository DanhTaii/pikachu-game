import Position from "./position.js";
import {BOARD_COLS, BOARD_ROWS} from "../utils/constants.js";

export default class PathFinder {
    constructor(board) {
        this.board = board;
    }

    isStillHaveConnection() {
        let groups = {}

        // NHÓM CÁC PIECE CÓ CÙNG ID LẠI THÀNH 1 MẢNG
        for (let i = 0; i < this.board.rows; i++) {
            for (let j = 0; j < this.board.cols; j++) {
                let piece = this.board.getPiece(i, j);
                //NẾU PIECE KHÁC NULL
                if (piece !== null) {
                    let id = piece.getId();
                    // NẾU CHƯA CÓ MẢNG CHO ID HIỆN TỊA
                    if (!groups[id]) {
                        // TẠO MẢNG MỚI
                        groups[id] = [];
                    }
                    // THÊM NÓ VÀO MẢNG VỊ TRÍ ID
                    groups[id].push(piece);
                }
            }
        }

        for (let index in groups) {
            let pieceList = groups[index];
            for (let i = 0; i < pieceList.length - 1; i++) {
                for (let j = i + 1; j < pieceList.length; j++) {
                    let piece1 = pieceList[i];
                    let piece2 = pieceList[j];

                    if (
                        this.canConnectStraight(piece1, piece2) === true ||
                        this.canConnectOneCorner(piece1, piece2) !== null ||
                        this.canConnectTwoCorner(piece1, piece2) !== null
                    ) {
                        return {
                            pieceOne: piece1,
                            pieceTwo: piece2
                        }
                    }

                }
            }
        }

        return null;
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
                if (!this.board.isCellEmpty(pr1, c)) {
                    return false;
                }
            }
            return true;
        }

        if (pc1 === pc2) {
            const startRow = Math.min(pr1, pr2);
            const endRow = Math.max(pr1, pr2);
            for (let r = startRow + 1; r < endRow; r++) {
                if (!this.board.isCellEmpty(r, pc1)) {
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
            this.board.isCellEmpty(positionCorner.getX(), positionCorner.getY()) &&
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
                if (this.board.isCellEmpty(i, pc1) && this.board.isCellEmpty(i, pc2)) {
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
                if (this.board.isCellEmpty(pr1, j) && this.board.isCellEmpty(pr2, j)) {
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