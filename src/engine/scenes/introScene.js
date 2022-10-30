class IntroScene extends Scene {

    constructor(engine) {
        super('IntroScene', engine);
    }
    timer = 0;
    fadeOut = 1;
    OnCreate() {
        return true;
    }

    OnUpdate(elapsedTime) {
        this.engine.drawer.text("Js Canvas Game Engine (JCGG)\n\n\n\n\n\n",
            new Position((this.engine.screenSize().width / 2) - 500, this.engine.screenSize().height / 2), 72, 'Arial', 'normal', 'blue', this.fadeOut);
        this.engine.drawer.text("By MOURCHID Mohamed Kamal",
            new Position((this.engine.screenSize().width / 2) - 500, this.engine.screenSize().height / 2 + 100), 48, 'Arial', 'normal', 'blue', this.fadeOut);
        if (this.timer >= 2) {
            this.ended();
        } else {
            this.timer += 1 * elapsedTime;
        }
        this.fadeOut = ((0.5 * this.timer) - 1) * -1;
    }
}