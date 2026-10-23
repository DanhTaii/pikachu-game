const BOARD_ROWS = 11;
const BOARD_COLS = 18;
const POKEMON_TYPES = 36;
const POKEMON_PER_TYPE = 4;
const CELL_WIDTH = 44;
const CELL_HEIGHT = 55;

const boardElement = document.getElementById("board");
const board = createEmptyBoard(BOARD_ROWS, BOARD_COLS);
let firstSelected = null;
let currentLevel = 1;
let currentTotalPokemon = 0;
let levelMechanicTimeOut = null;

// CASC BIẾN XỬ LÝ THỜI GIAN
const TIME_PLAY = 400;
let remainingTime = 0;
let timeInterval = null;

let hiddenPieces = []
let stoneTimer = null;
let isFlipHorizontal = false;
let isFlipPieceOver = false;
let currentTargetType = null;

let totalHint = 5;

const levelRule = [
    "Giống luật chung",

    "Mỗi lần nối thành công 2 pokemon bàn cờ sẽ bị hút xuống dưới",

    "Vật cản sẽ xuất hiện ngẫu nhiên liên tục trên bàn cờ và bạn không thể ăn xuyên vật cản hay phá vật cản",

    "Mỗi lần nối thành công 2 pokemon bàn cờ sẽ bị lật từ trái sang phải, " +
    "lần nối thành công tiếp theo sẽ lật sang từ trên xuống và quay lại lần lật đầu tiên rồi cứ thế tiếp tục",

    "Khi trên bàn cờ chỉ còn 1 nửa quân , tức là chỉ còn 72 quân cờ. Bàn cờ sẽ che mờ đi 1 nửa của 72 quân hiện tại. " +
    "Người chơi có thể di chuyển chuột đến 1 quân đó để xem rõ đó là quân gì",

    "Người chơi phải nối 2 pokemon theo dạng chỉ định của hệ thống. Gồm có 3 loại đó là: 0 góc, 1 góc, 2 góc",

    "Mỗi lần nối thành công 2 quân thì bàn cờ sẽ di chuyển theo quy tắc. Hàng chẵn thì từng quân sẽ dịch chuyển từ trái sang phải 1 ô. " +
    "Hàng lẻ thì sẽ dịch chuyển từ phải qua trái 1 ô",

    "Trên bàn cờ sẽ có các quân bị đóng băng, nhiệm vụ của bạn là phá những quân bị đóng băng đó bằng cách nối thành công những quân kế bên để phá chúng." +
    "Thì lúc nay bạn có thể nối nó như bình thường."
]

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
        // DÙNG DESTRUCTING MÀ THẦY DẠY
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
            if (currentPieceId !== null && currentPieceId !== -1 && !isFrozenPiece(i, j)) {
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

    ensurePlayableMove();
    // TẢI LẠI GIAO DIỆN VỚI MA TRẬN MỚI
    renderBoard()
}

function ensurePlayableMove() {
    //KIỂM TRA LẦN ĐẦU NẾU NHƯ ĐÃ CÓ NƯỚC ĐI HỢP LÝ
    if (isStillHaveConnection()) {
        return;
    }

    let availablePieces = [];
    for (let i = 1; i <= BOARD_ROWS - 2; i++) {
        for (let j = 1; j <= BOARD_COLS - 2; j++) {
            if (board[i][j] !== null && board[i][j] !== -1 && !isFrozenPiece(i, j)) {
                availablePieces.push({row: i, col: j, id: board[i][j]});
            }
        }
    }

    for (let i = 0; i < availablePieces.length; i++) {
        // LẤY RA PIECE ĐẦU TIÊN
        let firstPiece = availablePieces[i];
        // LẤY RA PIECE THỨ HAI CÓ CÙNG ID
        // NHƯNG PHẢI ĐẢM BẢO PIECE THỨ 2 NÀY KHÔNG PHẢI PIECE 1
        let secondPiece = availablePieces.find(
            p => p.id === firstPiece.id &&
                (p.row !== firstPiece.row || p.col !== firstPiece.col)
        );

        // xử lý nếu như chỉ còn 1 quân lẻ trên bàn cờ (CHẲNG LẼ VẬY THẬT ?)
        if (!secondPiece) {
            continue;
        }

        let isSwapped = false;
        for (let j = 0; j < availablePieces.length; j++) {
            let target = availablePieces[j];
            if (target.row === firstPiece.row && target.col === firstPiece.col) continue;
            if (target.row === secondPiece.row && target.col === secondPiece.col) continue;

            // NẾU NHƯ TỪ FIRST PIECE ĐẾN TARGET PIECE CÓ ĐƯỜNG ĐI
            if (checkConnection(firstPiece.row, firstPiece.col, target.row, target.col)) {
                let temp = target;
                board[target.row][target.col] = secondPiece.id;
                board[secondPiece.row][secondPiece.col] = temp.id;
                isSwapped = true;
                break;
            }
        }
        // NẾU ĐÃ TRÁO RỒI THÌ DỪNG
        if (isSwapped) {
            return;
        }
    }
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
            currentTotalPokemon++
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
                cell.style.border = "2px solid transparent";
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
}

function initGame() {
    totalHint = 5;
    document.getElementById("current-total-hint").textContent = `( ${totalHint} )`;
    // hintButton.style.backgroundColor = 'darkblue';

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

    for (let level = 0; level < levelRule.length; level++) {
        const ulLevel = document.getElementById("list-level");
        const liLevel = document.createElement("li");
        const btnLevel = document.createElement("button");
        btnLevel.classList.add("level-button");
        btnLevel.setAttribute("data-level", `${level + 1}`);
        btnLevel.textContent = `LEVEL ${level + 1}`
        liLevel.append(btnLevel);
        ulLevel.appendChild(liLevel);
    }

    currentLevel = 1;
    updateButtonLevelUI(currentLevel)
    fillBoard();
    ensurePlayableMove();
    renderBoard();

    startTime();
}

function resetGame() {
    totalHint = 5;
    document.getElementById("current-total-hint").textContent = `( ${totalHint} )`;
    hintButton.style.backgroundColor = 'darkblue';
    hintButton.disabled = false;

    currentTotalPokemon = 0;
    isFlipPieceOver = false;
    ruleElement.style.display = 'none'
    if (levelMechanicTimeOut !== null) {
        clearTimeout(levelMechanicTimeOut);
        levelMechanicTimeOut = null;
    }
    boardElement.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("active", "hidden", "frozen");
    });
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
    if (currentLevel === 3) {
        spawnObstacle(5000, 15)
    }
    if (currentLevel === 6) {
        assignNewTarget();
    }
    if (currentLevel === 8) {
        frozePiece();
    }
    ensurePlayableMove();
    updateButtonLevelUI(currentLevel)
    renderBoard();

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

        if (remainingTime === 0 && currentTotalPokemon > 0) {
            alert("BẠN ĐÃ THUA CUỘC !");
            resetGame();
            return;
        }

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

    // LẤY RA Ô TD TRÊN TABLE CỦA CURRENT PIECE
    const currentPieceElement = boardElement.rows[row].cells[col];

    if (currentPieceId == null || currentPieceId === -1 || isFrozenPiece(row, col)) {
        return;
    }

    // LEVEL 5: chỉ hiện thẻ vừa bấm.
    if (currentLevel === 5 && isFlipPieceOver) {
        currentPieceElement.classList.remove("hidden");
    }

    // NẾU NHƯ CHƯA CHỌN PIECE NÀO THÌ GÁN CHO FIRST PIECE
    if (!firstSelected) {
        selectPiece(row, col, currentPieceId)
        return;
    }

    // LẤY RA Ô TD TRÊN TABLE CỦA FIRST PIECE
    const firstPieceElement = boardElement.rows[firstSelected.row].cells[firstSelected.col];

    if (currentPieceId === firstSelected.id) {
        let path = checkConnection(row, col, firstSelected.row, firstSelected.col);
        if (path === null) {
            replaceSelection(row, col, currentPieceId, false);
            return;
        }

        if (currentLevel === 6) {
            if (currentTargetType !== path.type) {
                replaceSelection(row, col, currentPieceId, false);
                return;
            }
        }

        drawPath(row, col, firstSelected.row, firstSelected.col, path);

        if (currentLevel === 8) {
            meltingIce(firstSelected.row, firstSelected.col, row, col);
        }
        removePieceSelection(firstPieceElement, currentPieceElement, firstSelected.row, firstSelected.col, row, col);

        if (currentTotalPokemon === 0) {
            if (currentLevel === levelRule.length) {
                alert("CHÚC MỪNG BẠN ĐÃ PHÁ ĐẢO GAME");
                currentLevel = 1;
            } else {
                alert("CHÚC MỪNG BẠN ĐÃ VƯỢT ẢI !!");
                currentLevel++;
            }

            resetGame();
            return;
        }

        // DESTRUCTING ASSIGNMENT
        let [r1, c1, r2, c2] = [row, col, firstSelected.row, firstSelected.col];

        firstSelected = null;

        // PHẢI THỰC HIỆN GÁN BIẾN LẦN LƯỢT
        // DO setTimeout sẽ đợi cho hàm chạy hết sau 200ms nó mới chạy
        // => lúc đó đã biến mất thằng firstSelected
        levelMechanicTimeOut = setTimeout(() => {
            if (currentLevel === 6) {
                if (isStillHaveConnection() === null) {
                    shuffleRemaining();
                }
                applyLevelMechanic(r1, c1, r2, c2); // gán mục tiêu sau khi xáo
            } else {
                applyLevelMechanic(r1, c1, r2, c2);
                if (isStillHaveConnection() === null) {
                    shuffleRemaining();
                }
            }
        }, 200);

    } else {
        replaceSelection(row, col, currentPieceId, true);
    }

}

function selectPiece(row, col, pieceId) {
    firstSelected = {row, col, id: pieceId};
    boardElement.rows[row].cells[col].classList.add("active");
}

function replaceSelection(row, col, pieceId, hidePrevious) {
    const previousElement = boardElement.rows[firstSelected.row].cells[firstSelected.col];

    if (hidePrevious && currentLevel === 5 && isFlipPieceOver) {
        previousElement.classList.add("hidden");
    }

    previousElement.classList.remove("active");
    selectPiece(row, col, pieceId);
}

function removePieceSelection(firstPieceElement, currentPieceElement, firstRow, firstCol, secondRow, secondCol) {
    // XÓA TRÊN MẢNG HIỆN TẠI
    board[firstRow][firstCol] = null;
    board[secondRow][secondCol] = null;

    currentTotalPokemon -= 2;

    // XÓA TRÊN UI
    firstPieceElement.style.backgroundImage = "none";
    currentPieceElement.style.backgroundImage = "none";
    firstPieceElement.style.border = "none"
    currentPieceElement.style.border = "none"

    firstPieceElement.classList.remove("active");
    currentPieceElement.classList.remove("active");
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

function findGroupPokemon() {
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
    return groups
}

function isStillHaveConnection() {
    let groups = findGroupPokemon();

    for (let index in groups) {
        // DANH SÁCH CÁC PIECE DỰA TRÊN INDEX
        let pieceList = groups[index];
        for (let i = 0; i < pieceList.length - 1; i++) {
            // VỊ TRÍ ĐẦU TRONG INDEX HIỆN TẠI
            let piece1 = pieceList[i];
            // KIỂM TRA XEM CÓ BỊ ĐÓNG BĂNG KHÔNG
            if (isFrozenPiece(piece1.row, piece1.col)) continue;

            for (let j = i + 1; j < pieceList.length; j++) {
                // VỊ TRÍ THỨ 2 TRONG INDEX HIỆN TẠI SAU VỊ TRÍ ĐẦU
                let piece2 = pieceList[j];
                // KIỂM TRA XEM CÓ BỊ ĐÓNG BĂNG KHÔNG
                if (isFrozenPiece(piece2.row, piece2.col)) continue;

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
    // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA DIV 1
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
    line.style.backgroundColor = "var(--color-yellow, #F8C505)";
    line.style.pointerEvents = "none";
    line.style.zIndex = "9999";

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
    const centerPiece1 = calculateCenterPiece(r1, c1);
    const centerPiece2 = calculateCenterPiece(r2, c2);

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
    totalHint--;
    if (totalHint >= 0) {
        highlightHint(pieceOne.row, pieceOne.col, pieceTwo.row, pieceTwo.col);
        document.getElementById("current-total-hint").textContent = `( ${totalHint} )`;
        if (totalHint === 0) {
            hintButton.disabled = true;
            hintButton.style.backgroundColor = 'gray';
        }
    }
})

function highlightHint(row1, col1, row2, col2) {
    let divPieceOne = boardElement.rows[row1].cells[col1]
    let divPieceTwo = boardElement.rows[row2].cells[col2]

    divPieceOne.classList.add('highlight');
    divPieceTwo.classList.add('highlight');

    setTimeout(() => {
        divPieceOne.classList.remove('highlight');
        divPieceTwo.classList.remove('highlight');
    }, 800)
}

// ===================================================================
// CÁC HÀM XWR LÝ LOGIC LEVEL
// ===================================================================
const levelButtons = document.querySelectorAll('#list-level button.level-button');
levelButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        let currentLevelButton = e.currentTarget
        currentLevel = parseInt(currentLevelButton.getAttribute('data-level'))
        resetGame();
    })
})

function updateButtonLevelUI(dataLevel) {
    document.querySelectorAll('#list-level button.level-button').forEach(button => {
        button.classList.remove('active')
    })
    let currentLevelButton = document.querySelector(`#list-level button.level-button[data-level="${dataLevel}"]`);
    if (currentLevelButton) {
        currentLevelButton.classList.add('active');
    }

    let currentLevelRule = levelRule[dataLevel - 1];
    let currentLevelRuleUI = document.getElementById('level-rule__content')
    if (currentLevelRuleUI) {
        currentLevelRuleUI.innerText = currentLevelRule;
    }
}

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
        case 4:
            flipBoardHorizontal();
            break;
        case 5:
            flipPieceOver();
            break;
        case 6:
            assignNewTarget();
            break;
        case 7:
            applyConveyorBelt();
            break;
        case 8:
            break;
        default:
            renderBoard();
    }
}

// ==========================================
// LEVEL 2: TRỌNG LỰC
// ==========================================
function applyGravity(r1, c1, r2, c2) {
    let currentPieces = [{x: r1, y: c1}, {x: r2, y: c2}];
    board[r1][c1] = null;
    board[r2][c2] = null;

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
    renderBoard()
}

// ==========================================
// LEVEL 3: VẬT CẢN DI CHUYỂN
// ==========================================
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
            // if (board[i][j] !== null) {
            availablePieces.push({r: i, c: j, id: board[i][j]})
            // }
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

    renderBoard()

    stoneTimer = setTimeout(() => {
        spawnObstacle(time, numberOfStones)
    }, time);

}

// ==========================================
// LEVEL 4: BÀN CỜ BỊ LẬT
// ==========================================
function flipBoardHorizontal() {
    if (!isFlipHorizontal) {
        // CHẠY HẾT CÁC ROWS DO HIỆN TẠI LÀ LẬT NGANG
        for (let i = 1; i < BOARD_ROWS; i++) {
            // CHIR CHJAY 1 NỬA CỘT
            for (let j = 1; j <= Math.floor((BOARD_COLS - 2) / 2); j++) {
                // LẤY VỊ TRÍ CỘT ĐỐI DIỆN VỚI CỘT HIỆN TẠI
                let oppositeCol = BOARD_COLS - 1 - j;

                // TẠO BIẾN TẠM CHO VỊ TRÍ HIỆN TẠI
                let temp = board[i][j];
                // GÁN VỊ TRÍ HIỆN TẠI THÀNH VỊ TRÍ ĐỐI DIỆN NGANG
                board[i][j] = board[i][oppositeCol];
                // LẤY VỊ TRÍ ĐỐI DIỆN NGANG GÁN THÀNH BIẾN TẠM Ở TRÊN
                board[i][oppositeCol] = temp;
            }
        }
    } else {
        for (let i = 1; i <= Math.floor((BOARD_ROWS - 2) / 2); i++) {
            for (let j = 1; j < BOARD_COLS; j++) {
                let oppositeRow = BOARD_ROWS - 1 - i;

                let temp = board[i][j];
                board[i][j] = board[oppositeRow][j];
                board[oppositeRow][j] = temp;
            }
        }
    }

    isFlipHorizontal = !isFlipHorizontal;
    renderBoard();
}

// ==========================================
// LEVEL 5: LẬT ÚP
// ==========================================
function flipPieceOver() {
    if (currentTotalPokemon === (144 / 2) && !isFlipPieceOver) {

        // TẠO RA 1 ĐỐI TƯỢNG CHỨA CÁC MẢNG
        let groupPokemon = findGroupPokemon();

        for (let index in groupPokemon) {
            let currentListIds = groupPokemon[index];
            let halfCurrentListIds = currentListIds.splice(0, currentListIds.length / 2)

            halfCurrentListIds.forEach(currentPieceId => {
                boardElement.rows[currentPieceId.row].cells[currentPieceId.col].classList.add("hidden");
            });
        }
        isFlipPieceOver = true;
    }
}

// ==========================================
// LEVEL 6: TÌM CẶP THEO DẠNG ĐƯỜNG CHỈ ĐỊNH
// ==========================================
let ruleElement = document.getElementById("level-rule__target");

function assignNewTarget() {
    let findCouple = isStillHaveConnection();
    if (!findCouple) {
        return;
    }
    let pieceOne = findCouple.pieceOne;
    let pieceTwo = findCouple.pieceTwo;

    let typeConnection = checkConnection(pieceOne.row, pieceOne.col, pieceTwo.row, pieceTwo.col).type;
    ruleElement.style.display = 'block';
    ruleElement.innerHTML = `Mục tiêu là tìm 1 cặp: <div id="target-type"></div>`;
    ruleElement.style.color = 'red';
    let targetType = document.getElementById('target-type');

    if (typeConnection === "straight") {
        targetType.innerText = 'NỐI THẲNG (0 GÓC)';
        currentTargetType = typeConnection;
    } else if (typeConnection === "one_corner") {
        targetType.innerText = 'NỐI MỘT GÓC';
        currentTargetType = typeConnection;
    } else {
        targetType.innerText = 'NỐI HAI GÓC';
        currentTargetType = typeConnection;
    }

    targetType.style.fontWeight = '700';
    targetType.style.textDecoration = 'underline';
    targetType.style.color = 'red';
}

// ==========================================
// LEVEL 7: BĂNG CHUYỀN
// ==========================================
function applyConveyorBelt() {
    for (let row = 1; row <= BOARD_ROWS - 2; row++) {
        // NẾU LÀ HÀNG CHẴN THIF DỊCH SANG PHẢI
        if ((row % 2) === 0) {
            // LƯU LẠI PHẦN THỬ CUỐI CỦA HÀNG
            let lastCell = board[row][BOARD_COLS - 2];

            for (let col = BOARD_COLS - 2; col >= 1; col--) {
                board[row][col] = board[row][col - 1];
            }

            // Đưa phần tử cuối cùng lên đầu
            board[row][1] = lastCell
        } else {
            // NẾU LÀ HÀNG LẺ THÌ DỊCH SANG TRÁI
            // LƯU LẠI PHẦN TỬ ĐẦU TIÊN
            let firstCell = board[row][1];

            // Chạy từ trái sang phải
            for (let col = 1; col <= BOARD_COLS - 2; col++) {
                board[row][col] = board[row][col + 1];
            }

            // Đưa phần tử đầu tiên ra sau cùng
            board[row][BOARD_COLS - 2] = firstCell;
        }
    }
    renderBoard();
}

// ==========================================
// LEVEL 8: ĐÓNG BĂNG
// ==========================================
function frozePiece() {
    // TẠO RA 1 ĐỐI TƯỢNG CHỨA CÁC MẢNG
    let groupPokemon = findGroupPokemon();

    for (let index in groupPokemon) {
        let currentListIds = groupPokemon[index];
        let halfCurrentListIds = currentListIds.splice(0, currentListIds.length / 2)

        halfCurrentListIds.forEach(currentPieceId => {
            boardElement.rows[currentPieceId.row].cells[currentPieceId.col].classList.add("frozen");
        });
    }
}

function isFrozenPiece(row, col) {
    return boardElement.rows[row].cells[col].classList.contains("frozen");
}

function meltingIce(r1, c1, r2, c2) {
    let direction = [[0, 1], [0, -1], [1, 0], [-1, 0]]

    for (let currentPiece of [{row: r1, col: c1}, {row: r2, col: c2}]) {
        for (let dir of direction) {
            let nextRow = dir[0] + currentPiece.row;
            let nextCol = dir[1] + currentPiece.col;

            let nextPieceElement = boardElement.rows[nextRow].cells[nextCol];
            if (nextPieceElement.classList.contains("frozen")) {
                nextPieceElement.classList.remove("frozen");
            }
        }
    }
}