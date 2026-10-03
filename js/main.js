import Board from "./models/board.js";
import {BOARD_COLS, BOARD_ROWS, PIECE_SIZE, POKEMON_TYPES} from "./utils/constants.js";
import SoundHandler from "./audio/sound-handler.js";
import MouseHandler from "./input/mouse-handler.js";
import Piece from "./models/piece.js";

import GameManager from "./game/game-manager.js";

const TEST_MATRIX = [
    [null, null, null, null, null, null,    3, null],
    [null,    0,    0, null, null, null, null, null],
    [null, null, null, null,    1, null,    3, null],
    [   6,    2,    6, null,    2, null, null, null],
    [null, null, null,    2,    1, null, null, null],
    [null,    3, null,    4,    2, null,    5, null],
    [null,    4, null,    3, null, null,    5, null],
    [null, null, null, null, null, null, null, null]
];


$(document).ready(function () {
    const game = GameManager.getInstance();

    game.init(TEST_MATRIX);
    // game.init(null);
});