$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");

    engine = new Engine(canvas[0]);

    engine.OnCreate = function() {
        // Player Positino
        PLAYER_SPAWN_X = (engine.screenSize().width / 2) - 65;
        PLAYER_SPAWN_Y = engine.screenSize().height - 75;
        // Create the runner
        player = new GameObject(new Sprite(65, 70), new Position(PLAYER_SPAWN_X, PLAYER_SPAWN_Y));
        // Create the running sprtieSheet
        spriteSheet = new SpriteSheet('running', 65, 70, 10, 0, 11, '../../assets/sprites/man_running.png');
        // Create the animation for the runner and include the spritesheet
        playerAnimations = new Animation();
        playerAnimations.registerAnimation(spriteSheet);
        player.registerAnimation(playerAnimations);
        // set the current animation to running, because the name of the spriteSheet is running
        player.setAnimation('running');

        // Create the background as simple sprite only
        background = new Sprite(engine.screenSize().width, engine.screenSize().height - 150);
        background.loadImage('../../assets/sprites/background.jpg');

        // Create the building as Gameobject so they can move using the default functions
        buildingSprite = new Sprite(500, 250);
        buildingSprite.loadImage('../../assets/sprites/buildings.png');
        buildings = new GameObject(buildingSprite, new Position(-500, 480));
        buildings0 = new GameObject(buildingSprite, new Position(0, 480));
        buildings1 = new GameObject(buildingSprite, new Position(500, 480));
        buildings2 = new GameObject(buildingSprite, new Position(1000, 480));
        buildings3 = new GameObject(buildingSprite, new Position(1500, 480));

        // Set the velocity to 100 in X
        buildings.velocity = new Point(100, 0);
        buildings0.velocity = new Point(100, 0);
        buildings1.velocity = new Point(100, 0);
        buildings2.velocity = new Point(100, 0);
        buildings3.velocity = new Point(100, 0);

        // Check if the building are out of the camera from the right, to put the them at the left, simple loop
        buildings.moveCondition = function(x, y, elapsedTime) {
            if (buildings.position.X >= camera.maxPosition.X - 10)
                buildings.position.X = -500;
        };

        buildings0.moveCondition = function(x, y, elapsedTime) {
            if (buildings0.position.X >= camera.maxPosition.X - 10)
                buildings0.position.X = -500;
        };

        buildings1.moveCondition = function(x, y, elapsedTime) {
            if (buildings1.position.X >= camera.maxPosition.X - 10)
                buildings1.position.X = -500;
        };

        buildings2.moveCondition = function(x, y, elapsedTime) {
            if (buildings2.position.X >= camera.maxPosition.X - 10)
                buildings2.position.X = -500;
        };

        buildings3.moveCondition = function(x, y, elapsedTime) {
            if (buildings3.position.X >= camera.maxPosition.X - 10)
                buildings3.position.X = -500;
        };

        // Ground as GameObject for order drawing
        groundSprite = new Sprite(engine.screenSize().width, 300);
        groundSprite.loadImage('../../assets/sprites/ground.png');
        ground = new GameObject(groundSprite, new Position(0, engine.screenSize().height - 180));

        // Create a camera
        camera = new FixedCamera(engine.screenSize().width, engine.screenSize().height, engine.screenSize().width, engine.screenSize().height);
        // add objects to the engine to auto drawing
        engine.registerGameObject(ground);
        engine.registerGameObject(buildings);
        engine.registerGameObject(buildings0);
        engine.registerGameObject(buildings1);
        engine.registerGameObject(buildings2);
        engine.registerGameObject(buildings3);
        engine.registerGameObject(player);
    };

    engine.OnUpdate = function(elapsedTime) {
        // Draw the background sprite
        engine.drawer.sprite(background, new Position(0, 0));
        // run the move function for the building
        buildings.move(elapsedTime);
        buildings0.move(elapsedTime);
        buildings1.move(elapsedTime);
        buildings2.move(elapsedTime);
        buildings3.move(elapsedTime);
    };

    engine.start();
});