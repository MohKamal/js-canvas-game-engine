// First of all, wait to the document is ready
$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");
    // Init the Engine
    engine = new Engine(canvas[0]);
    engine.jumpEngineIntro = true;
    engine.OnCreate = function() {
        var scene = new SampleScene(engine);
        engine.registerScene(scene);
    };

    engine.start();
});

class SampleScene extends Scene {

    constructor(engine) {
        super('SampleScene', engine);
    }
    firstLayer = new Layer("layer_1");
    buy_sprite = new Sprite(200, 50, "sprites/buy_off.png");
    end_sprite = new Sprite(200, 50, "sprites/end_turn_off.png");
    buy = new Element(this.buy_sprite, new Position(200, 200));
    end = new Element(this.end_sprite, new Position(200, 215));

    OnCreate() {
        this.layers[0].layer.registerElement(this.buy);
        this.firstLayer.registerElement(this.end);

        this.registerLayer(this.firstLayer);
        this.buy.hide();
        this.end.show();
        return true;
    }

    OnUpdate(elapsedTime) {
        if (this.engine.mouseOnTopOf(this.end)) {
            this.end_sprite.loadImage("sprites/end_turn_on.png");
            // this.buy_sprite.loadImage("sprites/buy_off.png");
            if (this.engine.mouseClicked(MouseButton.LEFT)) {
                // this.end_sprite.loadImage("sprites/end_turn_off.png");
                // this.buy_sprite.loadImage("sprites/buy_on.png");
                this.buy.show();
            }
        } else {
            this.buy_sprite.loadImage("sprites/end_turn_off.png");
        }
        return true;
    }
}