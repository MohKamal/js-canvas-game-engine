class Sprite {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.image = new Image();
    }

    /**
     * Load sprite image from a path
     * @param {string} path 
     * @returns 
     */
    loadImage(path) {
        if (path === null || path === undefined) {
            console.error('No path was defined for the sprite');
            return false;
        }

        this.image.src = path;
        return true;
    }
}