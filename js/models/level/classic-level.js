import BaseLevel from "./base-level.js";

export class ClassicLevel extends BaseLevel{

    onMatchPiece(board, piece1, piece2) {
        // console.log("CHỌN CLASSIC LEVEL MATCH PIECE");
        board.removePiece(piece1);
        board.removePiece(piece2);
    }
}