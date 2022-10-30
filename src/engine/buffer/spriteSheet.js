class SpriteSheet extends Sprite {

    constructor(name, width, height, frameSpeed, startFrame, endFrame, imagePath, once = false, callback = null, once_max_frame = -1) {
        super(width, height, imagePath);
        this.name = name;
        this.dWidth = width;
        this.counter = 0;
        this.currentFrame = 0;
        this.once_max_frame = once_max_frame;
        this.once = once;
        this.frameSpeed = frameSpeed;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.loadImage(imagePath);
        this.animationSequence = [];
        this.callback = callback;
        // create the sequence of frame numbers for the animation
        for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++) {
            this.animationSequence.push(frameNumber);
        }
        // Calcule how many frame there is per row
        this.framesPerRow = parseInt(Math.floor(parseFloat((this.image.width / width))));
        this.countPlaying = 0;
    }

    /**
     * Update frame index to the next frame
     */
    update() {
        if (this.once && this.once_max_frame > 0 && this.countPlaying > this.once_max_frame) {
            this.currentFrame = this.framesPerRow - 1;
        }

        if (this.once && this.currentFrame == this.framesPerRow - 1) {
            if (this.callback)
                this.callback();

            return this.endFrame;
        }
        this.countPlaying++;
        let animCount = this.animationSequence.length;
        if (animCount == 0) animCount = 1;
        if (this.counter == (this.frameSpeed - 1)) this.currentFrame = parseInt((this.currentFrame + 1) % animCount);

        // Update the counter
        this.counter = parseInt((this.counter + 1) % this.frameSpeed);

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

    /**
     * Function to call back when the engine is loading all images
     */
    callbackWhenLoading() {
        this.framesPerRow = parseInt(Math.floor(parseFloat((this.image.width / this.dWidth).toString())).toString());
    }
}