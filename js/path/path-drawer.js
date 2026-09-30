export default class PathDrawer {

    drawHorizontalLine(piece1, piece2) {

        const board = $('#pokemon-board');

        // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA DIV 1
        const rect1 = piece1[0].getBoundingClientRect();
        // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA DIV 2
        const rect2 = piece2[0].getBoundingClientRect();
        // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA BOARD
        const boardRect = board[0].getBoundingClientRect();

        // TÍNH TÂM X1 CỦA PIECE
        const x1 = rect1.left + rect1.width / 2 - boardRect.left;
        // TÍNH TÂM Y1 CỦA PIECE
        const y1 = rect1.top + rect1.height / 2 - boardRect.top;
        // TÍNH TÂM X2 CỦA PIECE
        const x2 = rect2.left + rect2.width / 2 - boardRect.left;

        const line = $('<div class="connection-line"></div>');

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

        // THÊM LINE VÀO LAYER
        $('#connection-layer').append(line);

        // TÍNH THỜI GIAN LINE BỊ XÓA
        setTimeout(() => {
            line.remove();
        }, 100)

    }

    drawVerticalLine(piece1, piece2) {

        const board = $('#pokemon-board');

        // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA DIV 1
        const rect1 = piece1[0].getBoundingClientRect();
        // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA DIV 2
        const rect2 = piece2[0].getBoundingClientRect();
        // LẤY VỊ TRÍ (TOP, LEFT) VÀ KÍCH THƯỚC (WIDTH, HEIGHT) HIỆN TẠI CỦA BOARD
        const boardRect = board[0].getBoundingClientRect();

        // ============== TÍNH TOÁN TÂM QUÂN CỜ THỨ NHẤT ==================
        // TÍNH TÂM X1 CỦA PIECE
        const x1 = rect1.left + rect1.width / 2 - boardRect.left;
        // TÍNH TÂM Y1 CỦA PIECE
        const y1 = rect1.top + rect1.height / 2 - boardRect.top;
        // TÍNH TÂM Y2 CỦA PIECE
        const y2 = rect2.top + rect2.height / 2 - boardRect.top;

        const line = $('<div class="connection-line"></div>');

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

        $('#connection-layer').append(line);

        // TÍNH THỜI GIAN LINE BỊ XÓA
        setTimeout(() => {
            line.remove();
        }, 100)

    }

}

