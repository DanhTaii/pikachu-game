import BaseLevel from "./base-level.js";
import {BOARD_ROWS} from "../../utils/constants.js";
import Piece from "../piece.js";

export class GravityLevel extends BaseLevel {
    // HANDLE
    onMatchPiece(board, piece1, piece2) {
        // console.log("CHỌN GRAVITY LEVEL MATCH PIECE");

        let currentPieces = [piece1, piece2];
        board.removePiece(piece1);
        board.removePiece(piece2);

        // console.log("MA TRẬN TRUOWSC KHI ĐỔI VỊ TRÍ");
        // board.printMatrix();
        // DUYỆT QUA TỪNG PIECE
        for (let piece of currentPieces) {
            let col = piece.getY();
            // DUYỆT TỪ DÒNG DƯỚI CUOOIS LÊN
            for (let row = BOARD_ROWS - 2; row >= 1; row--) {
                // NẾU NHƯ Ô CỦA PIECE HIỆN TẠI VỚI DÒNG HIỆN TẠI TRỐNG
                if (board.isCellEmpty(row, col)) {
                    for (let rowAbove = row - 1; rowAbove >= 1; rowAbove--) {
                        let pieceAbove = board.getPiece(rowAbove, col);
                        if (pieceAbove !== null) {
                            pieceAbove.setX(row);
                            pieceAbove.setY(col);
                            board.getMatrix()[row][col] = pieceAbove;
                            board.getMatrix()[rowAbove][col] = null;
                            break
                        }
                    }
                }
            }
        }
        // console.log("MA TRẬN SAU KHI ĐỔI VỊ TRÍ");
        // board.printMatrix();
    }

}