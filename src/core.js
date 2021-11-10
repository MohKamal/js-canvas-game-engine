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
        sprite = new SpriteSheet('moving', 125, 125, 5, 0, 15, 'assets/spritesheet_numbered.png');
        gameObject = new GameObject(sprite, new Position(150, 150));
        animation = new Animation();
        animation.registerAnimation(sprite);
        gameObject.registerAnimation(animation);
        gameObject.setAnimation('moving');
        engine.registerGameObject(gameObject);
        camera = new FixedCamera(engine.screenSize().width, engine.screenSize().height, 500, 500);
        engine.setCamera(camera);
        movingAnimation = new GeometricAnimation('test', gameObject);
        movingAnimation.startFrom(null);
        animate = false;
    };
    engine.OnUpdate = function(elapsedTime) {
        if (engine.keyClicked(Keys.ArrowRight)) {
            x += 200 * elapsedTime;
        }

        if (engine.keyClicked(Keys.ArrowLeft)) {
            x -= 200 * elapsedTime;
        }

        if (engine.keyClicked(Keys.Enter)) {
            animate = true;
        }

        if (engine.keyClicked(Keys.Space)) {
            animate = false;
        }

        if (animate) {
            movingAnimation.animate(elapsedTime);
        }

        if (engine.mouseClicked(MouseButton.LEFT)) {
            movingAnimation.to(engine.mousePosition(), 300);
        }
        if (engine.mouseClicked(MouseButton.RIGHT)) {
            movingAnimation.endAt(engine.mousePosition(), 300);
        }

        movingAnimation.drawPoints(engine.drawer);
        engine.drawer.text(`Object(${gameObject.position.X},${gameObject.position.Y})`, new Position(10, 20));
        if (movingAnimation.currentPoint)
            engine.drawer.text(`Point(${movingAnimation.currentPoint.position.X},${movingAnimation.currentPoint.position.Y})`, new Position(10, 50));
    };
    engine.start();
});