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
        return this.position.getX();
    }

    getY() {
        return this.position.getY();
    }

    setX(x) {
        this.position.setX(x);
    }

    setY(y) {
        this.position.getY(y);
    }


}