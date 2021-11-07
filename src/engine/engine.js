class Engine {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.drawer = new Drawer(canvas);
        this.displayFPS = true;
        this.calculeFPS = true;
        this.engineActive = false;
        this.timerElement = null;
        this.endTime = new Date();
        this.startTime = new Date();
        this.elapsedTime = 0;
        this.frameTimer = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.currentScene = null;
        this.gameObjects = [];
        this.scenes = [];
        this.currentCamera = null;
        // Track mouse position event
        this.mousePoint = new Point(0, 0);
        this.mouseButton = [];
        this.mouseClicking = false;
        this.keys = [];
        this.isKeyClicked = false;
        this.canvas.addEventListener('mousemove', function(e) {
            return this.mousePoint = new Point(e.pageX, e.pageY);
        }.bind(this));

        this.canvas.addEventListener('mousedown', function(e) {
            if ('which' in e) {
                if (!this.mouseButton.includes(e.which)) this.mouseButton.push(e.which);
            } else {
                if (!this.mouseButton.includes(e.button)) this.mouseButton.push(e.button);
            }
            this.mouseClicking = true;
        }.bind(this));

        this.canvas.addEventListener('mouseup', function(e) {
            if ('which' in e) {
                if (this.mouseButton.includes(e.which)) {
                    this.mouseButton = this.removeItemAll(this.mouseButton, e.which);
                }
            } else {
                if (this.mouseButton.includes(e.button)) {
                    this.mouseButton = this.removeItemAll(this.mouseButton, e.button);
                }
            }
            this.mouseClicking = false;
        }.bind(this));

        window.addEventListener('keydown', function(e) {
            if (!this.keys.includes(e.code)) this.keys.push(e.code);
            this.isKeyClicked = true;
        }.bind(this), false);

        window.addEventListener('keyup', function(e) {
            if (this.keys.includes(e.code)) {
                this.keys = this.removeItemAll(this.keys, e.code);
            }
            this.isKeyClicked = false;
        }.bind(this), false);
    }

    /**
     * Remove all int from an array
     * @param {Array} arr 
     * @param {Int} value 
     * @returns {Array}
     */
    removeItemAll(arr, value) {
        var i = 0;
        while (i < arr.length) {
            if (arr[i] === value) {
                arr.splice(i, 1);
            } else {
                ++i;
            }
        }
        return arr;
    }

    /**
     * Get true/false if a mouse button is clicked
     * @param {MouseButton} button 
     * @returns {boolean}
     */
    mouseClicked(button) {
        return this.mouseButton.includes(button);
    }

    /**
     * Get true/false if a key is clicked
     * @param {KeyButton} key 
     * @returns {boolean}
     */
    keyClicked(key) {
        return this.keys.includes(key);
    }

    /**
     * Those functions will be overrided by the user
     * OnCreate is fired on time at first to setup the game
     */
    OnCreate() {
        return true;
    }

    /**
     * Those functions will be overrided by the user
     * OnUpdate is executed each time
     * @param {double} elapsedTime 
     * @returns 
     */
    OnUpdate(elapsedTime) {
        return true;
    }

    /**
     * Get the canvas size
     * @returns Size
     */
    screenSize() {
        return new Size(window.innerWidth, window.innerHeight);
    }

    /**
     * Register new gameobject to the engine to be draw by default
     * @param {*} gameObject 
     * @returns bool
     */
    registerGameObject(gameObject) {
        if (gameObject === null || gameObject === undefined) {
            console.error('No game object was defined');
            return false;
        }

        this.gameObjects.push(gameObject);
        return true;
    }

    /**
     * Get current mouse point on the canvas
     * @returns {Point}
     */
    mousePosition() {
        return this.mousePoint;
    }

    /**
     * Start the engine timer
     * @returns bool
     */
    start() {
        if (this.drawer.ctx === null || this.drawer.ctx === undefined) {
            console.error('No canvas was found!');
            return false;
        }
        return this.startEngine();
    }

    /**
     * Stop's the engine timer
     * @returns bool
     */
    stop() {
        return this.stopEngine();
    }

    /**
     * Execute the OnCreate user function and start the timer
     * @returns bool
     */
    startEngine() {
        this.engineActive = this.OnCreate();
        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].sprite.image = this.preloadImage(this.gameObjects[i].sprite.image.src);
        }
        this.timerElement = setInterval(this.timerElapsed.bind(this), 1);
        return this.engineActive;
    }

    /**
     * Execute the OnDestory user function and stop's the engine timer
     * @returns bool
     */
    stopEngine() {
        if (this.timerElement === null || this.timerElement === undefined) {
            console.error('There is a problem in the engine, the engine can\'t stop.')
            return false;
        }
        clearInterval(this.timerElement);
        return true;
    }

    /**
     * Force image to preload
     * @param {string} url 
     * @returns {Image}
     */
    preloadImage(url) {
        const img = new Image();
        img.src = url;
        return img
    }

    /**
     * Register Scene to the engine
     * @param {Scene} scene 
     * @returns 
     */
    registerScene(scene) {
        if (scene === null || scene === undefined) {
            console.error('No valid scene was found to be registred to the engine');
            return false;
        }

        this.scenes.push(scene);
        return true;
    }

    /**
     * Set the current scene to be displayed
     * @param {Scene} scene 
     * @returns {boolean}
     */
    goToScene(scene) {
        if (scene !== null || scene !== undefined) {
            if (this.currentScene !== null) {
                this.currentScene.ended();
            }
            this.currentScene = scene;
            return true;
        }

        return false;
    }

    /**
     * Set the current scene by default
     * @returns {boolean}
     */
    executeScenes() {
        if (this.currentScene === null) {
            if (this.scenes.length > 0) {
                for (var i = 0; i < this.scenes.length; i++) {
                    if (!this.scenes[i].isEnded) {
                        this.currentScene = this.scenes[i];
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Check if the mouse is on top of an object
     * @param {GameObject} gameObject 
     */
    mouseOnTopOf(gameObject) {
        if (gameObject === null || gameObject === undefined)
            return false;

        return (this.mousePosition().X < gameObject.position.X + gameObject.sprite.Width &&
            this.mousePosition().X + 1 > gameObject.position.X &&
            this.mousePosition().Y < gameObject.position.Y + gameObject.sprite.Height &&
            this.mousePosition().Y + 1 > gameObject.position.Y);
    }

    /**
     * Compare to layer object by zorder
     * @param {object} a 
     * @param {object} b 
     * @returns {int}
     */
    compareLayers(a, b) {
        if (a.zOrder < b.zOrder) {
            return -1;
        }
        if (a.zOrder > b.zOrder) {
            return 1;
        }
        return 0;
    }

    /**
     * Set a camera to the full engine
     * @param {Camera} camera 
     * @returns 
     */
    setCamera(camera) {
        if (camera === null || camera === undefined) {
            console.error('No valid camera was found to be add to the engine');
            return false;
        }

        this.currentCamera = camera;
        return true;
    }

    /**
     * Timer callback function, where the magic is running
     */
    timerElapsed() {
        this.drawer.clear();
        // Calcule the delta time
        this.endTime = new Date();
        this.elapsedTime = Math.abs(this.endTime - this.startTime) / 1000;
        this.startTime = this.endTime;
        // Run the user logic everytime
        this.engineActive = this.OnUpdate(this.elapsedTime);

        for (let i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].showIt)
                this.drawer.gameObject(this.gameObjects[i], this.currentCamera);
        }

        this.executeScenes();
        if (this.currentScene !== null) {
            if (!this.currentScene.isCreated) {
                this.currentScene.OnCreate();
                this.currentScene.created();
            }

            // execute the scene logic
            this.currentScene.OnUpdate(this.elapsedTime);
            this.currentScene.layers.sort(this.compare);
            for (var i = 0; i < this.currentScene.layers.length; i++) {
                for (let j = 0; j < this.currentScene.layers[i].layer.gameObjects.length; j++) {
                    if (this.currentScene.layers[i].layer.gameObjects[j].showIt)
                        this.drawer.gameObject(this.currentScene.layers[i].layer.gameObjects[j], this.currentCamera);
                }
            }
        }
        // Display FPS
        if (this.calculeFPS) {
            this.frameTimer = this.elapsedTime;
            this.frameCount += 1;
            if (this.frameTimer >= 1) {
                this.frameTimer -= 1;
                this.fps = this.frameCount;
                this.frameCount = 0;
                if (this.displayFPS) {
                    console.info(`FPS: ${this.fps}`);
                }
            }
        }

    }
}