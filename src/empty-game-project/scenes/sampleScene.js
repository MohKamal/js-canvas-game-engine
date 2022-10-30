class SampleScene extends Scene {

    constructor(engine) {
        super('sampleScene', engine);
    }
    timer = 0;
    fadeOut = 1;

    OnUpdate(elapsedTime) {
        this.engine.drawer.text("Hello World!",
            new Position((this.engine.screenSize().width / 2) - 400, this.engine.screenSize().height / 2), 32, 'Arial', 'normal', 'blue', this.fadeOut);

        if (this.timer >= 2) {
            this.timer = 0;
            this.fadeOut = 1;
        } else {
            this.timer += 1 * elapsedTime;
        }
        this.fadeOut = ((0.5 * this.timer) - 1) * -1;
    }
}