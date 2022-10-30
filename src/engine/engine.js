class Engine {
    static spritesToLoad = [];
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.drawer = new Drawer(canvas);
        this.displayFPS = false;
        this.calculeFPS = false;
        this.engineActive = false;
        this.timerElement = null;
        this.endTime = new Date();
        this.startTime = new Date();
        this.elapsedTime = 0;
        this.frameTimer = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.currentScene = null;
        this.scenes = [];
        // Track mouse position event
        this.mousePoint = new Point(0, 0);
        this.mouseButton = [];
        this.mouseClicking = false;
        this.keys = [];
        this.isKeyClicked = false;
        this.clickDelay = true;
        this.clickDelayCounter = 0.1;
        this.initImageLoading = false;
        this.initImageIsLoading = false;
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

        // add intro scene
        this.addIntroScene();
    }

    /**
     * Create intro scene for the engine
     */
    addIntroScene() {
        this.registerScene(new IntroScene(this));
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
        if (this.clickDelay) {
            if (this.clickDelayCounter <= 0) {
                this.clickDelayCounter = 0.1;
                return this.mouseButton.includes(button);
            } else {
                this.clickDelayCounter -= this.elapsedTime;
                return false;
            }
        }
        return this.mouseButton.includes(button);
    }

    /**
     * Get true/false if a key is clicked
     * @param {KeyButton} key 
     * @returns {boolean}
     */
    keyClicked(key) {
        if (this.clickDelay) {
            if (this.clickDelayCounter <= 0) {
                this.clickDelayCounter = 0.1;
                return this.keys.includes(key);
            } else {
                this.clickDelayCounter -= this.elapsedTime;
                return false;
            }
        }
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
     * Go to the next scene
     */
    nextScene() {
        if (this.currentScene !== null) {
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

        return (this.mousePosition().X < gameObject.position.X + gameObject.sprite.width &&
            this.mousePosition().X + 1 > gameObject.position.X &&
            this.mousePosition().Y < gameObject.position.Y + gameObject.sprite.height &&
            this.mousePosition().Y + 1 > gameObject.position.Y);
    }

    /**
     * Check if the mouse is on top of square
     * @param {GameObject} gameObject 
     */
    mouseOnTopOfPosition(position, size) {
        if (position === null || position === undefined || size === null || size === undefined)
            return false;

        return (this.mousePosition().X < position.X + size.width &&
            this.mousePosition().X + 1 > position.X &&
            this.mousePosition().Y < position.Y + size.height &&
            this.mousePosition().Y + 1 > position.Y);
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
     * Timer callback function, where the magic is running
     */
    timerElapsed() {
        this.drawer.clear();
        if (this.currentScene !== null && this.currentScene.isCreated == true && !this.initImageLoading) {
            if (!this.initImageIsLoading) {
                this.initImageIsLoading = true;
                this.startLoadingAllImages(() => { console.info('all sprites loaded') });
            }
            this.drawer.text("Loading...", { X: 100, Y: 100 }, 48, 'Arial', '', 'black');
            return;
        }
        // Calcule the delta time
        this.endTime = new Date();
        this.elapsedTime = Math.abs(this.endTime - this.startTime) / 1000;
        this.startTime = this.endTime;
        // Run the user logic everytime
        // this.engineActive = this.OnUpdate(this.elapsedTime);

        this.executeScenes();
        if (this.currentScene !== null) {
            if (!this.currentScene.isCreated) {
                this.currentScene.OnCreate();
                this.currentScene.created();
                for (var i = 0; i < this.currentScene.gameObjects.length; i++) {
                    this.currentScene.gameObjects[i].sprite.image = this.preloadImage(this.currentScene.gameObjects[i].sprite.image.src);
                }
                this.initImageLoading = false;
                this.initImageIsLoading = false;
            }

            // execute the scene logic
            this.currentScene.OnUpdate(this.elapsedTime);
            for (let i = 0; i < this.currentScene.gameObjects.length; i++) {
                if (this.currentScene.gameObjects[i].showIt)
                    this.drawer.gameObject(this.currentScene.gameObjects[i], 1, this.currentScene.currentCamera);
            }
            this.currentScene.layers.sort(this.compareLayers);
            for (var i = 0; i < this.currentScene.layers.length; i++) {
                for (let j = 0; j < this.currentScene.layers[i].layer.gameObjects.length; j++) {
                    if (this.currentScene.layers[i].layer.gameObjects[j].showIt)
                        this.drawer.gameObject(this.currentScene.layers[i].layer.gameObjects[j], 1, this.currentScene.currentCamera);
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

    /**
     * Load all images from sprites in the engine
     * @param {function} callback 
     */
    startLoadingAllImages(callback) {
        let imagesOK = 0;
        if (Engine.spritesToLoad.length <= 0) {
            this.initImageLoading = true;
            callback();
        }
        // iterate through the imageURLs array and create new images for each
        for (var i = 0; i < Engine.spritesToLoad.length; i++) {
            // create a new image an push it into the imgs[] array
            let sprite = Engine.spritesToLoad[i];
            if (sprite.spritePath == null) {
                imagesOK++;
                continue;
            }
            var img = new Image();
            // Important! By pushing (saving) this img into imgs[],
            //     we make sure the img variable is free to
            //     take on the next value in the loop.
            sprite.image = img;
            // when this image loads, call this img.onload
            img.onload = function() {
                // this img loaded, increment the image counter
                imagesOK++;
                sprite.imageLoaded = true;
                sprite.callbackWhenLoading();
                // if we've loaded all images, call the callback
                if (imagesOK >= Engine.spritesToLoad.length) {
                    this.initImageLoading = true;
                    callback();
                }
            }.bind(this);
            // notify if there's an error
            img.onerror = function(e) { console.error("image load failed: " + sprite.spritePath); }.bind(this);
            // set img properties
            img.src = sprite.spritePath;
        }
    }
}