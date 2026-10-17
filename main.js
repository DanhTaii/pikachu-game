const BOARD_ROWS = 11;
const BOARD_COLS = 18;
const POKEMON_TYPES = 36;
const POKEMON_PER_TYPE = 4;
const CELL_WIDTH = 44;
const CELL_HEIGHT = 55;

const boardElement = document.getElementById("board");
const board = createEmptyBoard(BOARD_ROWS, BOARD_COLS);
let firstSelected = null;
let currentLevel = 2;
// let currentTotalPokemon = 0;

// CASC BIẾN XỬ LÝ THỜI GIAN
const TIME_PLAY = 500;
let remainingTime = 0;
let timeInterval = null;

initGame();

// ===================================================================
// CÁC HÀM KHỞI TẠO BÀN CỜ
// ===================================================================
function createEmptyBoard(rows, cols) {
    return Array.from(
        {length: rows},
        () => Array(cols).fill(null));
}

function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function shuffleRemaining() {
    let index = 0;
    // DANH SÁCH CÁC ID CỦA PIECE HIỆN CÒN TRÊN BÀN CỜ
    let currentPieceIds = [];
    // DANH SCASH CÁC VỊ TRÍ CỦA LẦN LƯỢT PIECE Ở MẢNG TRÊN CỦA BÀN CỜ
    let currentPiecePositions = [];

    // DUYỆT QUA BÀN CỜ
    for (let i = 0; i < BOARD_ROWS; i++) {
        for (let j = 0; j < BOARD_COLS; j++) {
            // LẤY RA VỊ TRÍ HIỆN TẠI
            let currentPieceId = board[i][j];

            // NẾU NÓ KAHSC NULL THÌ
            if (currentPieceId !== null && currentPieceId !== -1) {
                // THÊM ID CỦA NÓ VÀO MẢNG currentPieceIds
                currentPieceIds[index] = currentPieceId;
                // THÊM VỊ TRÍ CỦA NÓ VÀO currentPiecePositions
                currentPiecePositions[index] = {
                    x: i,
                    y: j
                }
                index++;
            }
        }
    }

    // LẤY MẢNG CÁC ID RA, DÙNG SHUFFLE BAN ĐẦU ĐỂ ĐẢO VỊ TRÍ CÁC ID
    let shuffleIds = shuffle(currentPieceIds)

    // DUYỆT VÒNG LẶP ĐỂ THÊM LẠI VÀO VỊ TRÍ TRÊN MA TRẬN
    for (let i = 0; i < currentPiecePositions.length; i++) {
        // LẤY VỊ TRÍ TẠI I CỦA POSITION
        let position = currentPiecePositions[i];
        // LẤY ID MỚI TỪ MẢNG ĐÃ ĐƯỢC SHUFFLE
        // THÊM NÓ VÀO MA TRẬN
        board[position.x][position.y] = shuffleIds[i]
    }

    // ensurePlayableMove();

    // TẢI LẠI GIAO DIỆN VỚI MA TRẬN MỚI
    renderBoard()
}

function fillBoard() {
    const pokemonPool = [];

    for (let id = 0; id < POKEMON_TYPES; id++) {
        for (let count = 0; count < POKEMON_PER_TYPE; count++) {
            pokemonPool.push(id);
        }
    }

    const newPokemonPool = shuffle(pokemonPool);

    let index = 0;
    for (let row = 1; row < BOARD_ROWS - 1; row++) {
        for (let col = 1; col < BOARD_COLS - 1; col++) {
            board[row][col] = newPokemonPool[index++];
        }
    }
}

function renderBoard() {
    for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS; col++) {
            const pokemonId = board[row][col];
            const cell = boardElement.rows[row].cells[col];

            // PHẢI RESET LẠI VỀ MÀU MẶC ĐỊNH NẾU KHÔNG THÌ SẼ LÀ MÀU ĐEN
            cell.style.backgroundColor = "transparent";

            if (pokemonId === null) {
                cell.style.backgroundImage = "none";
                cell.style.border = "none";
            } else if (pokemonId === -1) {
                // console.log(pokemonId)
                cell.style.backgroundColor = "black";
                cell.style.backgroundImage = "none";
            } else {
                // Nếu có Pokemon thì mới in hình
                cell.style.backgroundImage = "url('pieces-sprite.png')";
                cell.style.backgroundRepeat = "no-repeat";
                cell.style.backgroundSize = `${POKEMON_TYPES * CELL_WIDTH}px ${CELL_HEIGHT}px`;
                cell.style.backgroundPosition = `-${pokemonId * CELL_WIDTH}px 0`;
                cell.style.border = "2px solid black";
            }
        }
    }
    // console.log("LEVEL: " + currentLevel)
}

function initGame() {
    // TẠO CÁC HÀNG CỘT TRONG TABLE ĐỂ XỬ LÝ GIAO DIỆN
    for (let row = 0; row < BOARD_ROWS; row++) {
        const rowElement = document.createElement("tr");

        for (let col = 0; col < BOARD_COLS; col++) {
            const cell = document.createElement("td");
            cell.id = `cell-${row}-${col}`;
            cell.classList.add("cell");
            // THÊM XỬ LÝ VÔ Ô LÚC THÊM LUÔN
            cell.addEventListener("click", () => handleCellClick(row, col));
            rowElement.appendChild(cell);
        }

        boardElement.appendChild(rowElement);
    }

    currentLevel = 1;
    fillBoard();
    // ensurePlayableMove();
    renderBoard();

    startTime();
}

function resetGame() {
    // currentTotalPokemon = 0;
    if (stoneTimer !== null) {
        // XÓA BỎ THỜI GIAN ĐANG CHJAY NGẦM
        // KHÔNG THỂ LÀM BẰNG NULL DO CHỈ ĐANG XÓA BIẾN ĐƯỢC GÁN
        // CHỨ KHÔNG LOẠI BỎ HẲN CÁI ĐANG CHẠY NGẦM
        clearTimeout(stoneTimer)
        // CHO NÓ RỖNG
        stoneTimer = null;
    }
    // CHO THNAHF MẢNG RỖNG PHÒNG TRƯỜNG HỢP CHUYỂN LEVEL MÀ VẪN ĐANG CHẠY LEVLE 3
    hiddenPieces = []

    // XÓA ĐI MA TRẬN CŨ
    for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS; col++) {
            board[row][col] = null;
        }
    }

    // XÓA ĐI firstSelected hiện đang chọn
    if (firstSelected) {
        const firstPieceElement = boardElement.rows[firstSelected.row].cells[firstSelected.col];
        firstPieceElement.classList.remove("active");
        firstSelected = null;
    }

    fillBoard();
    ensurePlayableMove();
    renderBoard();

    if (currentLevel === 3) {
        spawnObstacle(1800, 20)
    }
    startTime()
}

// ===================================================================
// XỬ LÝ THỜI GIAN
// ===================================================================
function startTime() {
    // NẾU NHƯ ĐANG CÓ INTERVAL CHẠY THÌ PHẢI XÓA NSO ĐI
    if (timeInterval !== null) {
        clearInterval(timeInterval);
        timeInterval = null;
    }
    // RESET LẠI THỜI GIAN CÒN LẠI ĐỂ ĐẾM
    remainingTime = TIME_PLAY;
    updateTimerProgress()

    timeInterval = setInterval(() => {
        remainingTime--;
        updateTimerProgress();


    }, 1000);

}

function updateTimerProgress() {
    let timerProgress = document.getElementById('current-time');
    if (timerProgress === null) {
        return;
    }

    timerProgress.style.width = `${remainingTime / TIME_PLAY * 100}%`
}

// ===================================================================
// XỬ LÝ CLICK CHUỘT
// ===================================================================
function handleCellClick(row, col) {
    const currentPieceId = board[row][col];

    if (currentPieceId == null || currentPieceId === -1) {
        return;
    }

    // LẤY RA Ô TD TRÊN TABLE CỦA CURRENT PIECE
    const currentPieceElement = boardElement.rows[row].cells[col];

    // NẾU NHƯ CHƯA CHỌN PIECE NÀO THÌ GÁN CHO FIRST PIECE
    if (!firstSelected) {
        firstSelected = {row: row, col: col, id: currentPieceId};
        currentPieceElement.classList.add("active");
        return;
    }

    // LẤY RA Ô TD TRÊN TABLE CỦA FIRST PIECE
    const firstPieceElement = boardElement.rows[firstSelected.row].cells[firstSelected.col];

    if (currentPieceId === firstSelected.id) {
        let path = checkConnection(row, col, firstSelected.row, firstSelected.col);

        if (path !== null) {
            drawPath(row, col, firstSelected.row, firstSelected.col, path);
            // XÓA TRÊN MẢNG HIỆN TẠI
            board[firstSelected.row][firstSelected.col] = null;
            board[row][col] = null;

            // XÓA TRÊN UI
            firstPieceElement.style.backgroundImage = "none";
            currentPieceElement.style.backgroundImage = "none";
            firstPieceElement.style.border = "none"
            currentPieceElement.style.border = "none"

            firstPieceElement.classList.remove("active");
            currentPieceElement.classList.remove("active");

            // DESTRUCTING ASSIGNMENT
            let [r1, c1, r2, c2] = [row, col, firstSelected.row, firstSelected.col];

            firstSelected = null;

            // PHẢI THỰC HIỆN GÁN BIẾN LẦN LƯỢT
            // DO setTimeout sẽ đợi cho hàm chạy hết sau 200ms nó mới chạy
            // => lúc đó đã biến mất thằng firstSelected
            setTimeout(() => {
                applyLevelMechanic(r1, c1, r2, c2);
                if (isStillHaveConnection() === null) {
                    shuffleRemaining();
                }
            }, 200);

        } else {
            // TRƯỜNG HỢP KHÁC NHAU THÌ ĐỔI SANG Ô MỚI CLICK
            firstPieceElement.classList.remove("active");
            firstSelected = {row, col, id: currentPieceId};
            currentPieceElement.classList.add("active");
        }
    } else {
        // TRƯỜNG HỢP KHÁC NHAU THÌ ĐỔI SANG Ô MỚI CLICK
        firstPieceElement.classList.remove("active");
        firstSelected = {row, col, id: currentPieceId};
        currentPieceElement.classList.add("active");
    }

}

// ===================================================================
// CÁC HÀM TÌM KIẾM ĐƯỜNG ĐI
// ===================================================================
function isCellEmpty(r, c) {
    return board[r][c] === null;
}

function canConnectStraight(r1, c1, r2, c2) {
    if (r1 === r2) {
        const minCol = Math.min(c1, c2);
        const maxCol = Math.max(c1, c2);
        for (let c = minCol + 1; c < maxCol; c++) {
            if (!isCellEmpty(r1, c)) return false;
        }
        return true;
    }
    if (c1 === c2) {
        const minRow = Math.min(r1, r2);
        const maxRow = Math.max(r1, r2);
        for (let r = minRow + 1; r < maxRow; r++) {
            if (!isCellEmpty(r, c1)) return false;
        }
        return true;
    }
    return false;
}

function canConnectOneCorner(r1, c1, r2, c2) {
    // Góc 1: cùng hàng r1, cùng cột c2
    if (isCellEmpty(r1, c2) && canConnectStraight(r1, c1, r1, c2) && canConnectStraight(r2, c2, r1, c2)) {
        return {r: r1, c: c2}; // Trả về tọa độ góc
    }
    // Góc 2: cùng hàng r2, cùng cột c1
    if (isCellEmpty(r2, c1) && canConnectStraight(r1, c1, r2, c1) && canConnectStraight(r2, c2, r2, c1)) {
        return {r: r2, c: c1};
    }
    return null;
}

function canConnectTwoCorner(r1, c1, r2, c2) {
    // console.log(positionCornerOne);
    // console.log(positionCornerTwo);
    // console.log('ĐI VÔ ĐIỀU KIỆN');

    // CHẠY TỪNG ROW ĐỂ KIỂM TRA ĐƯỜNG NỐI
    for (let i = 0; i < BOARD_ROWS; i++) {
        // console.log('KIỂM TRA NGANG TỪ TRÊN XUỐNG');
        // ROW ĐÓ PHẢI KHÁC GIAS TRỊ CỦA 2 PIECE
        if (i !== r1 && i !== r2) {
            // NẾU VỊ TRÍ DÒNG CỦA 2 PIECE ĐÓ CÓ TRỐNG
            if (isCellEmpty(i, c1) && isCellEmpty(i, c2)) {
                if (canConnectStraight(r1, c1, i, c1) &&
                    canConnectStraight(i, c1, i, c2) &&
                    canConnectStraight(i, c2, r2, c2)) {
                    return {
                        corner1: {r: i, c: c1},
                        corner2: {r: i, c: c2}
                    };
                }
            }
        }
    }

    // console.log(positionCornerOne);
    // console.log(positionCornerTwo);
    // CHẠY TỪNG CỘT ĐỂ KIỂM TRA ĐƯỜNG NỐI
    for (let j = 0; j < BOARD_COLS; j++) {
        // console.log('KIỂM TRA DỌC TỪ TRÁI QUA PHẢI');
        if (j !== c1 && j !== c2) {
            // NẾU ô ĐÓ TRỐNG THÌ
            if (isCellEmpty(r1, j) && isCellEmpty(r2, j)) {
                if (canConnectStraight(r1, c1, r1, j) &&
                    canConnectStraight(r1, j, r2, j) &&
                    canConnectStraight(r2, j, r2, c2)) {
                    return {
                        corner1: {r: r1, c: j},
                        corner2: {r: r2, c: j}
                    };
                }
            }
        }
    }
    return null;
}

function isStillHaveConnection() {
    let groups = {}

    // NHÓM CÁC PIECE CÓ CÙNG ID LẠI THÀNH 1 MẢNG
    for (let i = 0; i < BOARD_ROWS; i++) {
        for (let j = 0; j < BOARD_COLS; j++) {
            let pieceId = board[i][j];
            //NẾU PIECE KHÁC NULL
            if (pieceId !== null && pieceId !== -1) {
                // NẾU CHƯA CÓ MẢNG CHO ID HIỆN TỊA
                if (!groups[pieceId]) {
                    // TẠO MẢNG MỚI
                    groups[pieceId] = [];
                }
                // THÊM NÓ VÀO MẢNG VỊ TRÍ ID
                groups[pieceId].push({row: i, col: j, id: pieceId});
            }
        }
    }

    for (let index in groups) {
        // DANH SÁCH CÁC PIECE DỰA TRÊN INDEX
        let pieceList = groups[index];
        for (let i = 0; i < pieceList.length - 1; i++) {
            for (let j = i + 1; j < pieceList.length; j++) {
                // VỊ TRÍ ĐẦU TRONG INDEX HIỆN TẠI
                let piece1 = pieceList[i];
                // VỊ TRÍ THỨ 2 TRONG INDEX HIỆN TẠI SAU VỊ TRÍ ĐẦU
                let piece2 = pieceList[j];

                if (
                    canConnectStraight(piece1.row, piece1.col, piece2.row, piece2.col) === true ||
                    canConnectOneCorner(piece1.row, piece1.col, piece2.row, piece2.col) !== null ||
                    canConnectTwoCorner(piece1.row, piece1.col, piece2.row, piece2.col) !== null
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

function checkConnection(r1, c1, r2, c2) {
    // Nếu khác ID thì loại
    if (board[r1][c1] !== board[r2][c2]) {
        return null;
    }

    if (canConnectStraight(r1, c1, r2, c2)) {
        return {type: 'straight'};
    }

    let corner1 = canConnectOneCorner(r1, c1, r2, c2);
    if (corner1) {
        return {type: 'one_corner', corner: corner1};
    }

    let corners2 = canConnectTwoCorner(r1, c1, r2, c2);
    if (corners2) {
        return {type: 'two_corner', corners: corners2};
    }

    return null;
}

// ===================================================================
// CÁC HÀM VẼ ĐƯỜNG NỐI
// ===================================================================
function calculateCenterPiece(r, c) {
    // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA BOARD
    // const boardRect = boardElement.getBoundingClientRect();
    // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA DIV 1
    // console.log(c);
    const cell = boardElement.rows[r].cells[c];
    const rect = cell.getBoundingClientRect();

    // TÍNH TÂM X CỦA PIECE (Ô)
    const x = Math.round(rect.left + window.scrollX + (rect.width / 2));
    // TÍNH TÂM Y CỦA PIECE (Ô)
    const y = Math.round(rect.top + window.scrollY + (rect.height / 2));

    return {
        x: x,
        y: y
    }
}

function drawLine(x1, y1, x2, y2) {
    const line = document.createElement("div");

    // Đặt style cơ bản cho đường chớp
    line.style.position = "absolute";
    line.style.backgroundColor = "var(--color-yellow, #F8C505)"; // Dùng màu vàng của bạn
    line.style.pointerEvents = "none"; // Không cản trở click
    line.style.zIndex = "9999"; // Hiển thị trên cùng

    if (x1 === x2) {
        // VẼ ĐƯỜNG THẲNG DỌC
        line.style.left = `${x1 - 1}px`;
        line.style.top = `${Math.min(y1, y2)}px`;
        line.style.width = "3px";
        line.style.height = `${Math.abs(y2 - y1)}px`;
    } else if (y1 === y2) {
        // VẼ ĐƯỜNG THẲNG NGANG
        line.style.left = `${Math.min(x1, x2)}px`;
        line.style.top = `${y1 - 1}px`;
        line.style.width = `${Math.abs(x2 - x1)}px`;
        line.style.height = "3px";
    }

    // Gắn trực tiếp thẻ div vào body
    document.body.appendChild(line);

    // Xóa đường nối sau 300ms
    setTimeout(() => {
        line.remove();
    }, 100);
}

function drawStraightConnection(r1, c1, r2, c2) {
    // console.log('TÍNH TOÁN TÂM CÁC Ô TRÊN GIAO DIỆN')
    const centerPiece1 = calculateCenterPiece(r1, c1);
    const centerPiece2 = calculateCenterPiece(r2, c2);

    // console.log('VẼ ĐƯỜNG THẲNG')
    drawLine(centerPiece1.x, centerPiece1.y, centerPiece2.x, centerPiece2.y);

}

function drawOneCornerConnection(r1, c1, r2, c2, corner) {
    drawStraightConnection(r1, c1, corner.r, corner.c);
    drawStraightConnection(corner.r, corner.c, r2, c2);
}

function drawTwoCornerConnection(r1, c1, r2, c2, corner1, corner2) {
    drawStraightConnection(r1, c1, corner1.r, corner1.c);
    drawStraightConnection(corner1.r, corner1.c, corner2.r, corner2.c);
    drawStraightConnection(corner2.r, corner2.c, r2, c2);
}

function drawPath(r1, c1, r2, c2, pathResult) {
    if (pathResult.type === 'straight') {
        drawStraightConnection(r1, c1, r2, c2);
    } else if (pathResult.type === 'one_corner') {
        drawOneCornerConnection(r1, c1, r2, c2, pathResult.corner);
    } else if (pathResult.type === 'two_corner') {
        drawTwoCornerConnection(r1, c1, r2, c2, pathResult.corners.corner1, pathResult.corners.corner2);
    }
}

// ===================================================================
// XỬ LÝ NÚT GỢI Ý
// ===================================================================
const hintButton = document.getElementById("hint-button");
hintButton.addEventListener('click', (e) => {
    const result = isStillHaveConnection();
    if (!result) return;
    const {pieceOne, pieceTwo} = result;
    highlightHint(pieceOne.row, pieceOne.col, pieceTwo.row, pieceTwo.col);
})

function highlightHint(row1, col1, row2, col2) {
    let divPieceOne = boardElement.rows[row1].cells[col1]
    let divPieceTwo = boardElement.rows[row2].cells[col2]

    divPieceOne.classList.add('highlight');
    divPieceTwo.classList.add('highlight');

    setTimeout(() => {
        divPieceOne.classList.remove('highlight');
        divPieceTwo.classList.remove('highlight');
    }, 600)
}

// ===================================================================
// CÁC HÀM XWR LÝ LOGIC LEVEL
// ===================================================================
const levelButtons = document.querySelectorAll('#list-level button.level-button');
levelButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        let currentLevelButton = e.currentTarget
        currentLevel = parseInt(currentLevelButton.getAttribute('data-level'))
        levelButtons.forEach(btn => btn.classList.remove('active'));
        currentLevelButton.classList.add('active');
        resetGame();
    })
})

// ÁP DỤNG LEVEL KHI THỰC THI CELL-CLICK
function applyLevelMechanic(r1, c1, r2, c2) {
    switch (currentLevel) {
        case 1:
            renderBoard();
            break;
        case 2:
            applyGravity(r1, c1, r2, c2);
            break;
        case 3:
            renderBoard();
            break;
        default:
            renderBoard();
    }
}

// ==========================================
// LEVEL 2: TRỌNG LỰC
// ==========================================
function applyGravity(r1, c1, r2, c2) {
    // console.log("CHỌN GRAVITY LEVEL MATCH PIECE");

    let currentPieces = [{x: r1, y: c1}, {x: r2, y: c2}];
    board[r1][c1] = null;
    board[r2][c2] = null;

    // console.log("MA TRẬN TRUOWSC KHI ĐỔI VỊ TRÍ");
    // board.printMatrix();
    // DUYỆT QUA TỪNG PIECE
    for (let piece of currentPieces) {
        let col = piece.y;
        // DUYỆT TỪ DÒNG DƯỚI CUOOIS LÊN
        for (let row = BOARD_ROWS - 2; row >= 1; row--) {
            // NẾU NHƯ Ô CỦA PIECE HIỆN TẠI VỚI DÒNG HIỆN TẠI TRỐNG
            if (isCellEmpty(row, col)) {
                for (let rowAbove = row - 1; rowAbove >= 1; rowAbove--) {
                    let pieceAbove = board[rowAbove][col];

                    if (pieceAbove !== null) {
                        board[row][col] = pieceAbove;
                        board[rowAbove][col] = null;
                        break
                    }
                }
            }
        }
    }
    // console.log("MA TRẬN SAU KHI ĐỔI VỊ TRÍ");
    // board.printMatrix();
    renderBoard()
}

let hiddenPieces = []
let stoneTimer = null;

function spawnObstacle(time, numberOfStones) {
    // TRẢ LẠI CÁC PIECE ĐÃ BỊ VAAJT CẢN ĐÈ LÊN
    if (hiddenPieces.length > 0) {
        for (let piece of hiddenPieces) {
            if (board[piece.r][piece.c] === -1) {
                board[piece.r][piece.c] = piece.id;
            }
        }
    }
    hiddenPieces = [];

    // LAASY RA CÁC PIECE HIỆN ĐANG CÓ TRÊN BÀN CỜ
    let availablePieces = [];
    for (let i = 0; i < BOARD_ROWS; i++) {
        for (let j = 0; j < BOARD_COLS; j++) {
            if (board[i][j] !== null) {
                availablePieces.push({r: i, c: j, id: board[i][j]})
            }
        }
    }

    let numberSpawnStones = Math.min(numberOfStones, availablePieces.length);

    for (let i = 0; i < numberSpawnStones; i++) {
        // TẠO RA VỊ TRÍ NGẪU NHIÊN
        let index = Math.floor(Math.random() * availablePieces.length);

        let hiddenPiece = availablePieces.splice(index, 1)[0];

        board[hiddenPiece.r][hiddenPiece.c] = -1;
        hiddenPieces.push(hiddenPiece)
    }

    // ensurePlayableMove();
    renderBoard()

    stoneTimer = setTimeout(() => {
        spawnObstacle(time, numberOfStones)
    }, time);

}