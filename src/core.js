// First of all, wait to the document is ready
$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");
    var x = 10;
    var speed = 150;

    // Init the Engine
    engine = new Engine(canvas[0]);
    engine.OnCreate = function() {
        sprite = new SpriteSheet('moving', 125, 125, 15, 0, 15, 'assets/spritesheet_numbered.png');
        gameObject = new GameObject(sprite, new Position(150, 150));
        animation = new Animation();
        animation.registerAnimation(sprite);
        gameObject.registerAnimation(animation);
        gameObject.setAnimation('moving');
        scene = new Scene('menu', engine);
        scene.layers[0].layer.registerGameObject(gameObject);
        engine.registerScene(scene);
    };
    engine.OnUpdate = function(elapsedTime) {
        // engine.drawer.gameObject(gameObject);
        engine.drawer.text('Mouse with mouse', new Position(x, 150), '16px arial');
        x += speed * elapsedTime;
    };
    engine.start();
});