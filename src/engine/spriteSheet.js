class SpriteSheet extends Sprite {
    constructor(name, width, height, frameSpeed, startFrame, endFrame, imagePath) {
        super(width, height);
        this.name = name;
        this.counter = 0;
        this.currentFrame = 0;
        this.frameSpeed = frameSpeed;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.loadImage(imagePath);
        this.animationSequence = [];
        // create the sequence of frame numbers for the animation
        for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++) {
            this.animationSequence.push(frameNumber);
        }
        // Calcule how many frame there is per row
        this.framesPerRow = parseInt(Math.floor(parseFloat((this.image.width / width))));
    }

    /**
     * Update frame index to the next frame
     */
    update() {
        let animCount = this.animationSequence.length;
        if (animCount == 0) animCount = 1;
        if (this.counter == (this.frameSpeed - 1)) this.currentFrame = (this.currentFrame + 1) % animCount;

        // Update the counter
        this.counter = (this.counter + 1) % this.frameSpeed;
    }

    /**
     * Get Current Frame
     * @returns Point
     */
    frame() {
        // get the row and col of the frame
        let row = parseInt(Math.floor(parseFloat(this.animationSequence[this.currentFrame] / this.framesPerRow)));
        let col = parseInt(Math.floor(parseFloat(this.animationSequence[this.currentFrame] % this.framesPerRow)));
        return new Point(parseInt(col * this.width), parseInt(row * this.height));
    }
}