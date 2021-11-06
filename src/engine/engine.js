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
        this.gameImages = [];
        this.gameSprites = [];
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

    addImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (image === null || image === undefined) {
            console.error('No correct Image was defined');
            return false;
        }
        this.gameImages.push(image);
    }

    addSprite(path, size) {
        if (path === null || path === undefined) {
            console.error('No correct Image was defined');
            return false;
        }
        sprite = new Sprite(size.width, size.height);
        sprite.loadImage(path);
        this.gameImages.push(image);
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