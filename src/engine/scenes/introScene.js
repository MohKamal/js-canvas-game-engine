class IntroScene extends Scene {

    constructor(engine) {
        super('IntroScene', engine);
        this.timer = 0;
        this.fadeOut = 1;
        this.startPosition = new Position((this.engine.screenSize().width / 2) - 300, (this.engine.screenSize().height / 2) - 50);
        this.fire = new Fire(this.engine, new Position(this.startPosition.X + 160, this.startPosition.Y - 28), 2, 7);
    }


    OnCreate() {
        return true;
    }

    OnUpdate(elapsedTime) {
        this.engine.drawer.clearWithColor("#262626");
        this.fire.draw(elapsedTime);
        this.fire.generate();

        this.engine.drawer.rectangle(this.startPosition, new Size(5, 100), true, 1, 'white', this.fadeOut);
        this.engine.drawer.rectangle(new Position(this.startPosition.X, this.startPosition.Y + 96), new Size(100, 5), true, 1, 'white', this.fadeOut);
        this.engine.drawer.text("x",
            new Position(this.startPosition.X, this.startPosition.Y - 5), 14, 'Times New Roman Italic', 'normal', 'red', this.fadeOut);
        this.engine.drawer.text("y",
            new Position(this.startPosition.X + 105, this.startPosition.Y + 100), 14, 'Times New Roman Italic', 'normal', 'green', this.fadeOut);

        this.engine.drawer.text("JCGG",
            new Position(this.startPosition.X + 120, this.startPosition.Y + 100), 180, 'Times New Roman Italic', 'normal', 'white');
        this.engine.drawer.text("Js Canvas Game Engine",
            new Position(this.startPosition.X + 150, this.startPosition.Y + 125), 14, 'Times New Roman Italic', 'normal', 'white');
        this.engine.drawer.text("by MOURCHID Mohamed Kamal | https://github.com/MohKamal/js-canvas-game-engine",
            new Position(this.startPosition.X + 50, this.engine.screenSize().height - 50), 14, 'Times New Roman Italic', 'normal', 'white');

        if (this.timer >= 4) {
            this.ended();
        } else {
            this.timer += 1 * elapsedTime;
        }
        this.fadeOut = ((0.35 * this.timer) - 1) * -1;
    }
}