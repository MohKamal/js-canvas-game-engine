class GameScene extends Scene {

    constructor(engine) {
        super('GameScene', engine);
        this.map = new Map(new Size(10, 10), engine);
    }

    OnCreate() {
        this.map.OnCreate();
    }

    OnUpdate(elapsedTime) {
        this.map.OnUpdate(elapsedTime);
    }
}