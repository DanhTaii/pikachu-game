export default  class Piece {
    constructor(id, row, col) {
        this.id = id;
        this.row = row;
        this.col = col;
    }

    getId() {
        return this.id;
    }

    getPosition() {
        return {
            row: this.row,
            col: this.col
        };
    }

}