export default class BaseLevel {
    constructor(levelNumber, timeLimit, types, rows, cols) {
        this._levelNumber = levelNumber;
        this._timeLimit = timeLimit;
        this._types = types;
        this._rows = rows;
        this._cols = cols;
    }

    get levelNumber() {
        return this._levelNumber;
    }

    set levelNumber(value) {
        this._levelNumber = value;
    }

    get timeLimit() {
        return this._timeLimit;
    }

    set timeLimit(value) {
        this._timeLimit = value;
    }

    get types() {
        return this._types;
    }

    set types(value) {
        this._types = value;
    }

    get rows() {
        return this._rows;
    }

    set rows(value) {
        this._rows = value;
    }

    get cols() {
        return this._cols;
    }

    set cols(value) {
        this._cols = value;
    }

    spawnBoard(board) {

    }

    onMatchPiece(board, piece1, piece2) {

    }


}