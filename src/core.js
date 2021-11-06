// First of all, wait to the document is ready
$(document).ready(function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");
    var x = 10;
    var speed = 150;
    // Init the Engine
    engine = new Engine(canvas[0]);
    engine.OnCreate = function() {
        sprite = new Sprite(32, 32);
        sprite.loadImage('assets/ship.png');
        gameObject = new GameObject(sprite, new Position(10, 50));
        gameObject.moveCondition = function(x, y) {
            if (x >= engine.screenSize().width) {
                gameObject.velocity.X = -150;
            } else if (x <= 0) {
                gameObject.velocity.X = 150;
            }

            console.log(x);
            console.log(gameObject.velocity.X);
        };
        engine.registerGameObject(gameObject);
    };
    engine.OnUpdate = function(elapsedTime) {
        gameObject.move();
    };
    engine.start();
});