# js-canvas-game-engine
A Simple Canvas game engine with native Javascript, doing it the old fashion, education purposes only.

# Concept
This engine run a timer to drawer on canvas with javascript. With a Detla time, so it work on every CPU with same speed, but lower/Higher FPS.

# Let's Start
To use this project, first download this project.
After that, create a javascript file, call it what every you want, and added in the html file.

```js
// First of all, wait to the document is ready
$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");
    // Init the Engine
    engine = new Engine(canvas[0]);
});
```

Impliment the OnCreate and OnUpdate functions.

```js
// First of all, wait to the document is ready
$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");

    // Init the Engine
    engine = new Engine(canvas[0]);
    engine.OnCreate = function() {
       return true;
    };
    engine.OnUpdate = function(elapsedTime) {
        return true;
    };
});
```

To run the game, on the load event of the window, execute the start function.

```js
// First of all, wait to the document is ready
$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");

    // Init the Engine
    engine = new Engine(canvas[0]);
    engine.OnCreate = function() {
       return true;
    };
    engine.OnUpdate = function(elapsedTime) {
        return true;
    };
    engine.start();
});
```

# Documentation

## Engine Class

The Engine class has the main function to override, OnCreate and OnUpdate.

### OnCreate

This function run once when game start, mainly it used to initilize game objects, or set defaut variables values...etc.

```js
    engine.OnCreate = function() {
        // Player Positino
        PLAYER_SPAWN_X = (engine.screenSize().width / 2) - 65;
        PLAYER_SPAWN_Y = engine.screenSize().height - 75;
        // Create the runner
        player = new GameObject(new Sprite(65, 70), new Position(PLAYER_SPAWN_X, PLAYER_SPAWN_Y));
        // Create the running sprtieSheet
        spriteSheet = new SpriteSheet('running', 65, 70, 10, 0, 11, 'assets/sprites/man_running.png');
        // Create the animation for the runner and include the spritesheet
        playerAnimations = new Animation();
        playerAnimations.registerAnimation(spriteSheet);
        player.registerAnimation(playerAnimations);
        // set the current animation to running, because the name of the spriteSheet is running
        player.setAnimation('running');

        // Create the background as simple sprite only
        background = new Sprite(engine.screenSize().width, engine.screenSize().height - 150);
        background.loadImage('./assets/sprites/background.jpg');

        // Create a camera
        camera = new FixedCamera(engine.screenSize().width, engine.screenSize().height, engine.screenSize().width, engine.screenSize().height);

        engine.registerGameObject(player);
    };
```

### OnUpdate

This function run's every frame, this is where the logic of the game is implemented, like calcule, drawing, mouse and keyboard detection.

```js
    // From runner demo
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
```

### Others

#### RegisterGameObject

This function is used to add you game objects to the engine, so they will be drawed automatically wihtout you calling the Drawer Class.

```js
    engine.OnCreate = function() {
        // Create the runner
        player = new GameObject(new Sprite(65, 70), new Position(100, 100));
        engine.registerGameObject(player);
    };
```

#### ScreenSize

This function return the canvas Size where the game is drawed.

```js
    if (buildings1.position.X >= engine.screenSize().width - 10)
        buildings1.position.X = -500;
```

#### MousePosition

This function return the Mouse position relative to the canvas.

```js
player.position = engine.mousePosition();
```

#### MouseOnTopOf

This function return if the mouse cursor is on top of a gameobject

```js
if(engine.mouseOnTopOf(box))
    box.setAnimation("boxOn");
else
    box.setAnimation("boxOff");
```

#### MouseClicked

This function return a bool value, when a mouse button is clicked.

```js
    if (engine.mouseClicked(MouseKeys.LEFT))
        engine.drawer.tex("Mouse left button clicked", new Position(100, 100), 10, "Arial");
```

#### KeyClicked

This function return a bool value if a specific key is clicked

```js
    if (engine.keyClicked(Keys.Enter))
        return false;
```

#### GoToScene

This function will help switch from scene to another, like from the menu to credit, or menu to game level

```js
    creditScene = new CreditScene(engine);
    engine.registerScene(finalscene);

    menuScene = new MenuScene(engine);
    engine.registerScene(menuScene);
    //Launch the menu scene
    engine.goToScene(menuScene);
```

### Public Properties

FPS properties are public, you can display them where every you want. By default the FPS is not calculed. To display the FPS by default, set the DispalyFPS property to true and the CalculeFPS to true.
Also you can get the FPS propety as Integer.

```js
    engine.displayFPS = true; 
    engine.calculeFPS = true; 
```

## Drawer

This class used to draw everything to the canvas, like sprites, pictures, text...

### Clear

This function clean the picturebox with a color of you choice.
```C#
engine.drawer.clear();
```

### Sprite

This function draw sprite object.

```js
    sprite(sprite, position, camera = null)
```

### SpriteSheet

This function draw spritesheet object.

```js
    spriteSheet(sprite, position, camera = null)
```

### GameObject

This function draw gameobjects.

```js
    gameObject(gameObject, camera = null) 
```

### Line

This function allow you to draw a line between two points.

```js
    line(point1, point2, lineWidth = 5, color = 'red', camera = null)
```

## Camera

This function allows to create games with world bigger then the canvas Size.
For now, there are two Camera to use:
- FixedCamera : this only take a size smaller or equal to the picturebox size, so the game will stay only in the screen, but only the objects in the camera range with be displayed.

```js
//Example
let camera = new FixedCamera(200, 200, grid.Width * grid.resolution, grid.height * grid.resolution);
```
- WorldCamera : This camera take the size of the canvas and you can move the world around, or follow a player around the game world.

```js
//Example
let camera = new WorldCamera(engine.screenSizeh().width, engine.screenSizeh().height, grid.Width * grid.resolution, grid.height * grid.resolution);
```

You can create you own camera by inheriting the Camera Class.

```js
    class CustomCamera extends Camera
    {
        constructor(screenWidth, screenHeight, levelWidth, levelHeight, speed = 10) {
            super(screenWidth, screenHeight, levelWidth, levelHeight, speed);
        }

        /**
         * Set the position to a gameObject
         * @param {GameObject} gameObject 
         */
        setPositionTo(gameObject) {
            this.location = gameObject.position;
            this.getOffset()
        }

        /**
         * Get the camera offset to set the world movements
         * @returns {Point}
         */
        getOffset() {
            this.offset = new Point((this.cameraSize.width / 2) - this.location.X, (this.cameraSize.height / 2) - this.location.Y);
            this.checkOffset();
            return this.offset;
        }

        /**
         * Compard the camera location to the level size, so the camera stay's inside the level
         */
        checkOffset() {
            if (this.location.X < 0) this.location = new Point(0, this.location.Y);
            if (this.location.Y < 0) this.location = new Point(this.location.X, 0);
            if (this.location.X > this.layoutSize.width - this.cameraSize.width) this.location = new Point(this.layoutSize.width - this.cameraSize.width, this.location.Y);
            if (this.location.Y > this.layoutSize.height - this.cameraSize.height) this.location = new Point(location.X, this.layoutSize.height - this.cameraSize.height);
        }
    }
```

### Functions to override

You can override some functions to your needs in your Custom Camera.

- SetPositionTo : By default, this function used to follow an object in the game
- getOffset : By default, the offset that can be added to the world to move around, but if you create a new camera, you have to override this function.
- UpdateMaxPosition : By default, this function get the right bottom point of the camera.

## Sprites

You can use this object to draw images to screen. Aslo, GameObject use sprites for it graphic parte, means that you need a sprite to create GameObject.
Sprite have only Size and picture file.

```js
   engine.OnCreate = function() {
        // Create the background as simple sprite only
        background = new Sprite(engine.screenSize().width, engine.screenSize().height - 150);
        background.loadImage('./assets/sprites/background.jpg');
   };
```

## SpriteSheet

This object is used to draw objects with animation. SpriteSheet is a collection of Sprites arranged in a grid. The Sprites are then compiled into an Animation Clip that will play each Sprite in order to create the animation, much like a flipbook.

```js
    engine.OnCreate = function() {
        // Create the running sprtieSheet
        spriteSheet = new SpriteSheet('running', 65, 70, 10, 0, 11, 'assets/sprites/man_running.png');
    };
```

## GameObject

The difference between Sprite and GameObject is the position, by default GameObeject are objects that will be moving or have any animation.
To make them simple, you can define a GameObject and registred to the Engine, so it will be drawed by default, without you set that manually.

```js
    engine.OnCreate = function() {
        // Player Positino
        PLAYER_SPAWN_X = (engine.screenSize().width / 2) - 65;
        PLAYER_SPAWN_Y = engine.screenSize().height - 75;
        // Create the runner
        player = new GameObject(new Sprite(65, 70), new Position(PLAYER_SPAWN_X, PLAYER_SPAWN_Y));
        engine.registerGameObject(player);
    };
```

### Hide & Show

To Hide a registred Gameobject, you can use the Hide and Show functions

```C#
    playeer.hide();
```

### Collisions

#### Simple collision

To check if an object is colliding with another, you can use the function CollisionWith.

```js

    let player = new GameObject(playerSprite, new Position(10, 120));
    let ball = new GameObject(BallSprite, new Position(50, 120));
    if(player.collisionWith(ball)){
        //Do something
    }

```

## Animation

Animation is a collection of SpriteSheets saved with a name. This will help you run different animations according to one or more conditions.

```js
    //Character frames
    let Stand;
    let RunLeft;
    let RunRight;
    let JumpLeft;
    let JumpRight;


    engine.OnCreate = function() {
        //Init the character animations and frames
        Stand = new SpriteSheet("stand", 32, 32, 1, 5, 5, Test.Properties.Resources.charachter);
        RunLeft = new SpriteSheet("run_left", 32, 32, 15, 6, 9, Test.Properties.Resources.charachter);
        RunRight = new SpriteSheet("run_right", 32, 32, 15, 0, 3, Test.Properties.Resources.charachter);
        JumpLeft = new SpriteSheet("jump_left", 32, 32, 5, 10, 10, Test.Properties.Resources.charachter);
        JumpRight = new SpriteSheet("jump_right", 32, 32, 5, 4, 4, Test.Properties.Resources.charachter);
        //Set the spawn position to 200
        PLAYER_SPAWN_Y = 600;
        //Create character and set the animation
        character = new GameObject(Stand, new Position(100, 100));
        character.animations.registerAnimation(Stand);
        character.animations.registerAnimation(RunLeft);
        character.animations.registerAnimation(RunRight);
        character.animations.registerAnimation(JumpLeft);
        character.animations.registerAnimation(JumpRight);
        //Add character to the platform
        engine.registerGameObject(character);
        //Default animation
        character.SetAnimation("stand");
    }

    engine.OnUpdate = function(elapsedTime) {
        if (!character.onGround)
        {
            if (character.velocity.X < 0)
                character.setAnimation("jump_left");
            else
                character.setAnimation("jump_right");
        }
        else
        {
            if (character.velocity.X < 0)
                character.setAnimation("run_left");
            else if(character.velocity.X > 0)
                character.setAnimation("run_right");
            else
                character.setAnimation("stand");
        }

        return true;
    }
```

## Scene

A scene it's like a smaller engine peace, it has the two important functions like the engine, OnCreate and OnUpdate.
You put your logic there and the engine will execute scene by scene, when the previous is done.
You can use the scene to create a Menu scene, a game scene and credit scene, and put condition to end a scene and the engine will switch to the next one.

By default, there is a default scene in an empty engine instance, use it to create your objects, so you can use the layers.

To create a scene, you create a class and inherit from Scene class, and override the OnCreate and OnUpdate function.

```js
class MenuScene extends Scene
{
    constructor(engine) {
        super('MenuScene', engine);
    }

    /**
     * OnCreate function run's Once
     * @returns {boolean}
     */
    OnCreate() { return true; }

    /**
     * Run every second
     * @param {float} elapsedTime 
     * @returns {boolean}
     */
    OnUpdate(elapsedTime) { return true; }

    /**
     * Run's once after the end of the scene
     * @returns {boolean}
     */
    OnDestroy() { return true; }
}
```

To end the scene, call the Ended function in your OnUpdate function (mainly).

```js
class MenuScene extends Scene
{
    constructor(engine) {
        super('MenuScene', engine);
    }

    public override bool OnCreate()
    {
        return base.OnCreate();
    }

    public override bool OnUpdate(double ElapsedTime)
    {

    }

        /**
     * OnCreate function run's Once
     * @returns {boolean}
     */
    OnCreate() { return true; }

    /**
     * Run every second
     * @param {float} elapsedTime 
     * @returns {boolean}
     */
    OnUpdate(elapsedTime) { 
        engine.drawer.String("This is a menu", new Position(100, 100));
        engine.drawer.String("Clique Space to go out of menu",  new Position(100, 100));

        if (engine.KeyClicked(Keys.Space))
        {
            this.ended();
        }
        return true;
    }

    /**
     * Run's once after the end of the scene
     * @returns {boolean}
     */
    OnDestroy() { return true; }
}
```

## Layer

To get sprite with z-order, you can use layer, by default there is a layer with z-order equal to 0.
The layer has two public properties, z-order and Name.

### RegisterGameObject

This function is used to add you game objects to the layer, so they will be drawed automatically wihtout you calling the Drawer Class.

```js
    //From pingpong project
    OnCreate() {
        playerSprite = new Sprite(30, 100);
        playerSprite.LoadFromFile('bar.png');
        player = new GameObject(playerSprite, new Position(10, 120));
        //Add layer
        layer = new Layer("top");
        //Add object to the layer
        layer.registerGameObject(player);
        this.scenes[0].registerLayer(layer);
        return true;
    }
```

# More

For now, there are one demo, runnig man, this engine is for education purposes only.