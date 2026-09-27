const soundSelect = new Audio('../assets/sounds/select.mp3');
const soundMatch = new Audio('../assets/sounds/match.mp3');
const soundError = new Audio('../assets/sounds/wrong.mp3');

let firstSelectedPiece = null;
let firstPieceId = null;

$('#pokemonBoard').on('click', '.pokemon-piece', function () {
    const currentPiece = $(this);
    const currentPieceId = currentPiece.data('pokemon-id');

    if (firstSelectedPiece === null) {
        soundSelect.currentTime = 0;
        soundSelect.play();

        firstSelectedPiece = currentPiece;
        firstPieceId = firstSelectedPiece.data('pokemon-id');
        currentPiece.addClass('selected');
    } else {
        if (firstPieceId === currentPieceId) {
            soundMatch.currentTime = 0;
            soundMatch.play();

            firstSelectedPiece.css('visibility', 'hidden');
            currentPiece.css('visibility', 'hidden');
            firstSelectedPiece = null
            firstPieceId = null
        } else {
            soundError.currentTime = 0;
            soundError.play();

            firstSelectedPiece.removeClass('selected');

            firstSelectedPiece = currentPiece;
            firstPieceId = firstSelectedPiece.data('pokemon-id');
            firstSelectedPiece.addClass('selected')
        }
    }

});