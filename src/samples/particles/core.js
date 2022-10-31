// First of all, wait to the document is ready
$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");
    // Init the Engine
    engine = new Engine(canvas[0]);
    engine.jumpEngineIntro = false;
    engine.OnCreate = function() {
        var scene = new SampleScene(engine);
        engine.registerScene(scene);
    };

    engine.start();
});

class SampleScene extends Scene {

    constructor(engine) {
        super('SampleScene', engine);
        this.delay = 0;
        this.fire = new Fire(this.engine, new Position(300, 300), 2, 7);
    }

    OnCreate() {
        this.fire.generate();
        return true;
    }

    OnUpdate(elapsedTime) {
        this.fire.draw(elapsedTime);
        this.fire.startPosition = this.engine.mousePosition();
        this.fire.generate();

        if (this.engine.mouseClicked(MouseButton.LEFT)) {
            this.fire.startPosition = this.engine.mousePosition();
            this.fire.generate();
        }
    }

    getRandomArbitrary(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}