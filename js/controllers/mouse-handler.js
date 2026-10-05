export default class MouseHandler {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.init();
    }

    init() {
        $('#pokemon-board').on('click', '.pokemon-piece', (event) => {
            const currentPieceUI = $(event.currentTarget);
            this.gameManager.handlePieceSelection(currentPieceUI.data('row'), currentPieceUI.data('col'))
        })

        $('.level-list').on('click', '.level-list__item', (event) => {
            const newLevelItem = $(event.currentTarget);
            const levelIndex = newLevelItem.data('level');
            this.gameManager.handleLevelSwap(levelIndex, newLevelItem);
        })

        $('.shuffle-btn').on('click', (event) => {
            this.gameManager.shuffleRemaining();
        })

        $('.suggest-btn').on('click', () => {
            this.gameManager.handleHintButton();
        })

        const pauseButton = $('.pause-btn');
        pauseButton.on('click', () => {
            this.gameManager.handlePauseButton(pauseButton)
        })

    }
}