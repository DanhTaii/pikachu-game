import {PIECE_SIZE} from "../utils/constants.js";

export default class GameView {
    constructor(numberOfLevel) {
        this.numberOfLevel = numberOfLevel;
        this.boardContainer = $('#pokemon-board');
        this.connectionLayer = $('#connection-layer');
    }

    renderBoard(board) {
        board.getMatrix().forEach((row, rowIndex) => {
                // TẠO THẺ DIV ROW
                const rowDiv = $('<div>');
                rowDiv.addClass('row-list-pieces col-auto g-0');
                // THÊM VÀO TABLE CỦA DIV
                this.boardContainer.append(rowDiv);

                // DUYỆT CÁC PHẦN TỬ TRONG ROW CỦA MAT TRẬN
                row.forEach((piece, colIndex) => {
                        // TẠO RA THẺ DIV CHO MỖI Ô (Dù có Pokemon hay không)
                        const pieceDiv = $('<div>');

                        // THÊM CLASS CSS CỦA POKEMON PIECE VÀO
                        pieceDiv.addClass('pokemon-piece');
                        pieceDiv.attr('data-row', rowIndex);
                        pieceDiv.attr('data-col', colIndex);


                        if (piece === null) {
                            pieceDiv.css('visibility', 'hidden');
                            rowDiv.append(pieceDiv);
                            return;
                        }

                        // KHAI BÁO GIÁ TRỊ CỦA QUÂN
                        const currentPieceId = piece.getId();
                        // const currentPieceRow = piece.getX();
                        // const currentPieceCol = piece.getY();

                        // THÊM INLINE CSS VÀO POKEMON PIECE
                        pieceDiv.css(
                            'background-position',
                            `-${currentPieceId * PIECE_SIZE}px 0`
                        )

                        // THÊM THUỘC TÍNH CỦA PIECE VÀO THẺ DIV
                        pieceDiv.attr('data-id', currentPieceId);
                        // pieceDiv.attr('data-row', currentPieceRow);
                        // pieceDiv.attr('data-col', currentPieceCol);

                        // THÊM PIECE VÀO DIV ROW
                        rowDiv.append(pieceDiv);
                    }
                )
            }
        );
    }

    getBoardUIContainer() {
        return this.boardContainer;
    }

    clearBoardUI() {
        this.boardContainer.find('.row-list-pieces').remove();
    }

    renderListLevel(currentLevelIndex) {
        const container = $('.level-list');
        container.find('.level-list__item').remove();

        let listLevelConfig = this.numberOfLevel;

        for (let i = 0; i < listLevelConfig; i++) {
            const item = $('<li>');
            item.addClass('level-list__item'); // Bạn quên add class này cho thẻ li
            item.attr('data-level', i + 1);

            const button = $('<button>');
            button.addClass('game-btn');
            if (i === currentLevelIndex) {
                button.addClass('active');
            }

            button.append($('<i class="fa-solid fa-circle-play"></i>'));
            button.append($(`<span class="fw-bold text-light">Màn ${i + 1}</span>`))

            item.append(button)
            container.append(item)
        }
    }

    drawLine(x1, y1, x2, y2) {
        const line = $('<div class="connection-line"></div>');

        if (x1 === x2) {
            // VẼ ĐƯỜNG THẲNG DỌC
            // console.log('VẼ ĐƯỜNG THẲNG NGANG');
            line.css({
                // ĐIỂM X BẮT ĐẦU TỪ X1 HOẶC X2 ĐỀU ĐƯỢC DO NÓ ĐÃ CHUNG 1 CỘT
                left: x1,
                // ĐIỂM Y BẮT ĐẦU SẼ LÀ NHỎ NHẤT CỦA Y1, Y2
                top: Math.min(y1, y2),
                // ĐỘ DÀY SẼ LÀ 3
                width: 3,
                // CHIỀU CAO CỦA LINE SẼ LÀ KHOẢNG CÁCH GIỮA Y1 VÀ Y2
                height: Math.abs(y2 - y1)
            });
        } else if (y1 === y2) {
            // VẼ ĐƯỜNG THẲNG NGANG
            // console.log('VẼ ĐƯỜNG THẲNG DỌC');
            line.css({
                // ĐIỂM X BẮT ĐẦU SẼ LÀ TỪ VỊ TRÍ TÂM NHỎ NHẤT VÀ TỪ PHẢI VẼ TỪ TRÁI SANG PHẢI
                left: Math.min(x1, x2),
                // ĐIỂM Y BẮT ĐẦU SẼ LÀ TỪ Y1 (HOẶC Y2)
                top: y1,
                // ĐỘ DÀI SẼ LÀ KHOẢNG CÁCH GIỮA X1 VÀ X2
                width: Math.abs(x2 - x1),
                // CHIỀU CAO CỦA ĐƯỜNG
                height: 3
            });
        }


        // THÊM LINE VÀO LAYER
        this.connectionLayer.append(line);

        // TÍNH THỜI GIAN LINE BỊ XÓA
        setTimeout(() => {
            line.remove();
        }, 100)
    }

    showMessage(message) {
        setTimeout(() => {
            alert(message)
        }, 200)
    }

    handleErrorUI(pieceUI1, pieceUI2) {
        pieceUI1.removeClass('selected');
        pieceUI2.addClass('selected');
    }

    handlePauseButtonUI(pauseButton) {
        let icon = pauseButton.find('i');
        if (icon.hasClass('fa-circle-pause')) {
            icon.removeClass('fa-circle-pause').addClass('fa-circle-play');
        } else {
            icon.removeClass('fa-circle-play').addClass('fa-circle-pause');
        }
    }

    handleLevelSwapUI(newLevelItem) {
        $('.level-list button').removeClass('active');
        newLevelItem.find('button').addClass('active');
    }

    handlePieceSelectionUI(currentPieceUI) {
        currentPieceUI.addClass('selected');
    }

    hidePieces(pieceUI1, pieceUI2) {
        pieceUI1.css('visibility', 'hidden').removeClass('selected');
        pieceUI2.css('visibility', 'hidden').removeClass('selected');
    }

    getPieceElement(row, col) {
        // return $(`#pokemon-board .pokemon-piece[data-row="${row}"][data-col="${col}"]`);
        return this.boardContainer.find(`.pokemon-piece[data-row="${row}"][data-col="${col}"]`);
    }

    getLevelButton(levelNumber) {
        return $('.level-list').find(`[data-level="${levelNumber}"]`);
    }

    highlightHint(row1, col1, row2, col2) {
        let divPieceOne = this.getPieceElement(row1, col1)
        let divPieceTwo = this.getPieceElement(row2, col2)

        divPieceOne.addClass('highlight');
        divPieceTwo.addClass('highlight');

        setTimeout(() => {
            divPieceOne.removeClass('highlight');
            divPieceTwo.removeClass('highlight');
        }, 600)
    }

    handleUpdateText(idElement, text) {
        $(`#${idElement}`).text(text);
    }

    updateTimer(remainingTime, totalTime, timeText) {
        $('.game-timer__text-value').text(timeText);
        let percent = (remainingTime / totalTime) * 100;
        $('#time-progress-bar').css('width', `${percent}%`);
    }

}