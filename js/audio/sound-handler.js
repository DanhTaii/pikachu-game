export default class SoundHandler {
    constructor() {
        this.select = new Audio('../assets/sounds/select.mp3');
        this.match = new Audio('../assets/sounds/match.mp3');
        this.error = new Audio('../assets/sounds/wrong.mp3');
    }

    playSelect() {
        this.select.currentTime = 0;
        this.select.play();
    }

    playMatch() {
        this.match.currentTime = 0;
        this.match.play();
    }

    playError() {
        this.error.currentTime = 0;
        this.error.play();
    }
}