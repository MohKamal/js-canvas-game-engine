class GameObject {
    constructor(sprite, position) {
        this.sprite = sprite;
        this.position = position;
        this.velocity = new Position(0, 0);
        this.name = "Game Object";
        this.showIt = true;
        this.isStatic = false;
    }

    /**
     * Make this static
     */
    staticObject() {
        this.isStatic = true;
    }

    /**
     * Make this object movable
     */
    notStaticObject() {
        this.isStatic = false;
    }

    /**
     * Show this object, by default
     */
    show() {
        this.showIt = true;
    }

    /**
     * Hide this object
     */
    hide() {
        this.showIt = false;
    }

    /**
     * Check if this object is in collision with another game Object
     * @param {GameObject} other 
     * @returns bool
     */
    collisionWith(other) {
        if (this.position.X < other.position.X + other.sprite.width &&
            this.position.X + this.sprite.width > other.position.X &&
            this.position.Y < other.position.Y + other.sprite.height &&
            this.sprite.height + this.position.Y > other.sprite.height) {
            return true;
        }
        return false;
    }

    /**
     * This function to check for some user rules, like falling gravity
     * @param {double} x 
     * @param {double} y 
     * @returns bool
     */
    moveCondition(x, y) { return false; }

    /**
     * Using the object velocity, this will change the position
     * Also, it gonna verify the Moving Condition Function
     */
    move() {
        let newPositionX = this.position.X + this.velocity.X;
        let newPositionY = this.position.Y + this.velocity.Y;

        // Check if there is condition
        this.moveCondition(newPositionX, newPositionY);

        newPositionX = this.position.X + this.velocity.X;
        newPositionY = this.position.Y + this.velocity.Y;

        this.position = new Position(newPositionX, newPositionY);
    }
}