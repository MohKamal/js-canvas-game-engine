class Sprite {

    constructor(width, height, path = null) {
        this.width = width;
        this.height = height;
        this.spritePath = path;
        this.image = new Image();
        this.imageLoaded = false;
        Engine.spritesToLoad.push(this);
    }

    /**
     * Load sprite image from a path
     * @param {string} path 
     * @returns 
     */
    loadImage(path = null) {
        if (path !== null && path !== undefined) {
            this.spritePath = path;
        }

        if (this.spritePath === null || this.spritePath === undefined) {
            console.error('No path was defined for the sprite');
            return false;
        }

        this.image.src = path;
        Engine.spritesToLoad.push(this);
        return true;
    }

    /**
     * Function to call back when the engine is loading all images
     */
    callbackWhenLoading() {

    }
}