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
        engine.registerGameObject(gameObject);
        camera = new WorldCamera(500, 500, 200, 200);
    };
    engine.OnUpdate = function(elapsedTime) {
        // engine.drawer.gameObject(gameObject);
        engine.drawer.camera(camera);
        camera.location = engine.mousePosition();
        gameObject.position = engine.mousePosition();
        engine.drawer.text(`${x};150`, new Position(x, 150), '16px arial', camera);
        engine.drawer.text(`${camera.maxPosition.X}:${camera.maxPosition.Y}`, engine.mousePosition(), '48px arial', camera);
        engine.drawer.text('Text on bottom', new Position(10, 500), '48px arial', camera);
        engine.drawer.text('Text on bottom', new Position(10, 500), '48px arial', camera);
        x += speed * elapsedTime;
    };
    engine.start();
});