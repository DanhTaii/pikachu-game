import GameManager from "./controllers/game-manager.js";

// const TEST_MATRIX = [
//     [null, null, null, null, null, null,    3, null],
//     [null,    0,    0, null, null, null, null, null],
//     [null, null, null, null,    1, null,    3, null],
//     [   6,    2,    6, null,    2, null, null, null],
//     [null, null, null,    2,    1, null, null, null],
//     [null,    3, null,    4,    2, null,    5, null],
//     [null,    4, null,    3, null, null,    5, null],
//     [null, null, null, null, null, null, null, null]
// ];

const TEST_MATRIX = [
    [null, null, null, null, null, null, null, null],
    [null,    35,    2,    3,    4,    5,    6, null],
    [null,    7,    8,    9,   10,   11,   12, null],
    [null,   13,   14,   15,   16,   17,   18, null],
    [null,   19,   20,   21,   22,   23,   24, null],
    [null,   25,   26,   27,   28,   29,   30, null],
    [null,   31,   32,   33,   34,   1,    1, null],
    [null, null, null, null, null, null, null, null]
];

$(document).ready(function () {
    const game = GameManager.getInstance();

    // controllers.loadLevel(TEST_MATRIX);
    // controllers.loadLevel(null, 0);
    game.init(null);
    // controllers.init(TEST_MATRIX);
});