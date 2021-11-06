// First of all, wait to the document is ready
$(document).ready(function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");
    var x = 10;
    var speed = 5;
    // Init the Engine
    engine = new Engine(canvas[0]);
    engine.displayFPS = true;
    engine.calculeFPS = true;
    sprite = new Sprite(920, 266);
    sprite.loadImage('assets/ship.png');

    engine.OnUpdate = function(elapsedTime) {
        engine.drawer.sprite(sprite, new Position(10, 10));
        engine.drawer.text(engine.frameTimer, new Position(x, 50), '48px arial');
        x += speed * elapsedTime;
    };
    engine.start();
});