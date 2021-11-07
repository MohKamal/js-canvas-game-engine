class WorldCamera extends Camera {
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