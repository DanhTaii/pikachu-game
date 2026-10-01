import Position from "./position.js";

export default class Piece {
    constructor(id, row, col) {
        this.id = id;
        this.row = row;
        this.col = col;
        this.position = new Position(row, col);
    }

    getId() {
        return this.id;
    }

    getPosition() {
        return this.position;
    }

    getX() {
        return this.row;
    }

    getY() {
        return this.col;
    }


}