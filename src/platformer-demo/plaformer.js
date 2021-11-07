$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");

    engine = new Engine(canvas[0]);

    engine.OnCreate = function() {
        grid = new PlatformerGrid(100, 25);
        showGrid = true;
        createWithMouse = true;
        PLAYER_SPAWN_X = 10;
        PLAYER_SPAWN_Y = 10;
        PLAYER_JUMP_SPEED = -100;
        PLAYER_WALK_SPEED = 80;
        character = new PlatformCharacter(new Sprite(grid.resolution, grid.resolution), new Position(PLAYER_SPAWN_X, PLAYER_SPAWN_Y));
        grid.addNode(character);
        camera = new WorldCamera(engine.screenSize().width, engine.screenSize().height, grid.width * grid.resolution, grid.height * grid.resolution);
    };

    engine.OnUpdate = function(elapsedTime) {
        camera.setPositionTo(character);

        for (var i = 0; i < grid.nodes.lenght; i++) {
            let node = grid.nodes[i];
            if (node.velocity.X != 0)
                node.limitXSpeed(elapsedTime, grid.eplison);

            let vx = node.velocity.X * elapsedTime;
            node.maxPosition = new Position(node.position.X, node.position.Y);
            node.position = new Position(node.position.X + vx, node.position.Y);

            if (node.velocity.X > 0) {
                if (node.getCellRight(grid.resolution, grid.eplison, node.position.X) != node.getCellRight(grid.resolution, grid.eplison, node.maxPosition.X)) {
                    cells = node.getYCells(grid.resolution, grid.eplison);
                    for (var y = cells[0]; y <= cells[1]; y++) {
                        if (grid.getWall(node.getCellRight(grid.resolution, grid.eplison, node.position.X), (y / grid.resolution)) ||
                            (y != cells[0] && grid.getCeiling((node.getCellRight(grid.resolution, grid.epsilon, node.position.X), (y / grid.resolution))))) {
                            node.collideCellRight(grid.resolution, grid.eplison, node.position.X);
                            break;
                        }
                    }
                } else {

                }
            }
        }
    };
});