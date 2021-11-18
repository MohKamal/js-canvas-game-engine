class MenuScene extends Scene {

    constructor(engine) {
        super('MenuScene', engine);
        this.counter = 0;
        this.spritePlay = new Sprite(200, 50);
        this.spritePlay.loadImage('./../assets/sprites/buttons/play_off.png');
        this.music = new Sound('./assets/audio/main_menu.mp3', 50, true);
    }

    OnCreate() {
        this.music.play();
    }

    OnUpdate(elapsedTime) {
        this.engine.drawer.sprite(this.spritePlay, new Position((this.engine.screenSize().width / 2) - 100, 300));
        console.log(this.music.audioObject.src);
        this.counter += elapsedTime;
        if (this.engine.mouseOnTopOfPosition(new Position((this.engine.screenSize().width / 2) - 100, 300), new Size(200, 50))) {
            this.spritePlay.loadImage('./assets/sprites/buttons/play_on.png');
            if (this.engine.mouseClicked(MouseButton.LEFT)) {
                if (this.counter >= 1) {
                    this.counter = 0;
                    this.ended();
                    let gameScene = new GameScene(this.engine);
                    this.engine.goToScene(gameScene);
                }
            }
        } else {
            this.spritePlay.loadImage('./assets/sprites/buttons/play_off.png');
        }
    }

    OnDestroy() {
        this.music.stop();
    }
}