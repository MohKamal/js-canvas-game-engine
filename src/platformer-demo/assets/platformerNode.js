class PlatformerNode extends GameObject {

    constructor(sprite, position) {
        super(sprite, position);
        this.isOnGround = false;
        this.maxPosition = new Position(0, 0);
    }

    setVelocityX(vx) {
        this.velocity = new Point(vx, this.velocity.Y);
    }

    setVelocityY(vy) {
        this.velocity = new Point(this.velocity.X, vy);
    }

    getXCells(resolution, epsilon) {
        cells = [];
        let start = Math.floor((this.position.X + epsilon) / resolution);
        let end = Math.floor((this.position.X + this.sprite.width - epsilon) / resolution);
        cells.push(start);
        cells.push(end);
        return cells;
    }

    getYCells(resolution, epsilon) {
        cells = [];
        let start = Math.floor((this.position.Y + epsilon) / resolution);
        let end = Math.floor((this.position.Y + this.sprite.height - epsilon) / resolution);
        cells.push(start);
        cells.push(end);
        return cells;
    }

    getCellBottom(resolution, epsilon, y) {
        return Math.floor((y + this.sprite.height - epsilon) / resolution);
    }

    getCellTop(resolution, epsilon, y) {
        return Math.floor((y + epsilon) / resolution);
    }

    getCellRight(resolution, epsilon, x) {
        return Math.floor((x + this.sprite.width - epsilon) / resolution);
    }

    getCellLeft(resolution, epsilon, x) {
        return Math.floor((x + epsilon) / resolution);
    }

    colideCellButtom(resolution, epsilon, y) {
        this.isOnGround = true;
        this.velocity = new Point(this.velocity.X, 0);
        this.position = new Position(this.position.X, this.getCellBottom(resolution, epsilon, y) * resolution - this.sprite.height);
    }

    colideCellTop(resolution, epsilon, y) {
        this.isOnGround = true;
        this.velocity = new Point(this.velocity.X, 0);
        this.position = new Position(this.position.X, this.getCellTop(resolution, epsilon, y) * resolution);
    }

    colideCellRight(resolution, epsilon, x) {
        this.isOnGround = true;
        this.velocity = new Point(0, this.velocity.Y);
        this.position = new Position(this.getCellRight(resolution, epsilon, x) * resolution - this.sprite.width, this.position.Y);
    }

    colideCellLeft(resolution, epsilon, x) {
        this.isOnGround = true;
        this.velocity = new Point(0, this.velocity.Y);
        this.position = new Position(this.getCellRight(resolution, epsilon, x) * resolution, this.position.Y);
    }

    limitXSpeed(elapsedTime, epsilon) {
        if (this.velocity.X * elapsedTime < -this.sprite.width + epsilon)
            this.velocity = new Point((-this.sprite.width + epsilon) / elapsedTime, this.velocity.Y);


        if (this.velocity.X * elapsedTime > this.sprite.width - epsilon)
            this.velocity = new Point((this.sprite.width - epsilon) / elapsedTime, this.velocity.Y);
    }

    limitYSpeed(elapsedTime, epsilon) {
        if (this.velocity.Y * elapsedTime < -this.sprite.height + epsilon)
            this.velocity = new Point(this.velocity.X, (-this.sprite.height + epsilon) / elapsedTime);


        if (this.velocity.Y * elapsedTime > this.sprite.height - epsilon)
            this.velocity = new Point((this.velocity.X, this.sprite.height - epsilon) / elapsedTime);
    }

}