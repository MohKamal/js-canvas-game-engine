// First of all, wait to the document is ready
$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");
    var x = 500;
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
        camera = new FixedCamera(engine.screenSize().width, engine.screenSize().height, 500, 500);
        engine.setCamera(camera);
    };
    engine.OnUpdate = function(elapsedTime) {
        // engine.drawer.gameObject(gameObject);
        gameObject.position = new Position(x, 500);
        engine.drawer.camera(camera);
        engine.drawer.text(`${x};150`, new Position(10, 150), 16, 'arial', camera);
        engine.drawer.text(`${camera.maxPosition.X}:${camera.maxPosition.Y}\n${camera.position.X}:${camera.position.Y}`, new Position(1, 20), 12, 'arial');
        engine.drawer.text('100;30', new Position(100, 100), 48, 'arial', camera);
        engine.drawer.text('100;500', new Position(100, 500), 48, 'arial', camera);
        // x += speed * elapsedTime;

        if (engine.keyClicked(Keys.ArrowRight)) {
            x += 200 * elapsedTime;
        }

        if (engine.keyClicked(Keys.ArrowLeft)) {
            x -= 200 * elapsedTime;
        }
    };
    engine.start();
});