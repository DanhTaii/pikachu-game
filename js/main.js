const pokemonType = 36;

function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }

    return array;
}

function spawnPokemon() {
    const board = $('#pokemonBoard')

    let pokemonPool = [];

    for (let i = 0; i < pokemonType; i++) {
        // THÊM 2 CẶP VAO
        pokemonPool.push(i);
        pokemonPool.push(i);
        pokemonPool.push(i);
        pokemonPool.push(i);
    }

    shuffle(pokemonPool);

    pokemonPool.forEach(function (pokemonId, index) {
        // TẠO RA THẺ DIV
        const piece = $('<div>');

        // THÊM CLASS CSS CỦA POKEMON PIECE VÀO
        piece.addClass('pokemon-piece');

        // THÊM INLINE CSS VÀO POKEMON PIECE
        piece.css(
            'background-position',
            `-${pokemonId * 40}px 0`
        )

        // NÊẾU NHƯ NÓ LÀ HÀNG MỚI THÌ THÊM THẺ DIV HÀNG MỚI
        if (index % 16 === 0) {
            const row = $('<div>');
            row.addClass('row-list-pieces col-auto g-0')
            board.append(row);
        }

        // KIẾM THẺ DIV HÀNG CUỐI CÙNG
        const row = board.children().last();

        // THÊM PIECE VÀO DIV ROW
        row.append(piece);
    })

    console.log("Số Pokémon:", pokemonPool.length);

}

$(document).ready(function () {
    spawnPokemon();
});
