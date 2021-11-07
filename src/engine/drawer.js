class Drawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx = canvas.getContext("2d");
    }

    /**
     * Clear the canvas and fill it with a color
     * @param {string} color 
     */
    clearWithColor(color) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw an image from Image object
     * @param {Image} image 
     * @param {double} sx Source Position X
     * @param {double} sy Source Position Y
     * @param {double} sw Source Width
     * @param {double} sh Source Height
     * @param {double} dx Distination Position X
     * @param {double} dy Distination Position Y
     * @param {double} dw Distination Width
     * @param {double} dh Distination Height
     */
    image(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        var ctxTemp = this.ctx;
        image.onload = function() {
            ctxTemp.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        };
    }

    /**
     * Draw a sprite in position
     * @param {Sprite} sprite 
     * @param {Position} position 
     * @returns bool
     */
    sprite(sprite, position) {
        if (sprite === null || sprite === undefined) {
            console.error('No valid sprite Sheet was found to be drawed');
            return false;
        }

        if (sprite.image === null || sprite.image === undefined) {
            console.error('No valid sprite Sheet image was found to be drawed');
            return false;
        }
        this.ctx.drawImage(sprite.image, position.X, position.Y);
        return true;
    }

    /**
     * Draw a text to the canvas
     * @param {string} text 
     * @param {Position} position 
     */
    text(text, position, font = '14px serif') {
        this.ctx.font = font;
        this.ctx.fillText(text, position.X, position.Y);
    }

    /**
     * Draw SpriteSheet animation
     * @param {SpriteSheet} sprite 
     * @param {Position} position 
     * @returns bool
     */
    spriteSheet(sprite, position) {
        if (sprite === null || sprite === undefined) {
            console.error('No valid sprite Sheet was found to be drawed');
            return false;
        }

        if (sprite.image === null || sprite.image === undefined) {
            console.error('No valid sprite Sheet image was found to be drawed');
            return false;
        }
        sprite.update();
        this.ctx.drawImage(sprite.image, sprite.frame().X, sprite.frame().Y, sprite.width, sprite.height, position.X, position.Y, sprite.width, sprite.height);
        return true;
    }

    /**
     * Draw Game object sprite, or SpriteSheet
     * @param {GameObject} gameObject 
     * @returns bool
     */
    gameObject(gameObject) {
        if (gameObject === null || gameObject === undefined) {
            console.error('No gameObject found to be drawed');
            return false;
        }
        if (!gameObject.hasSimpleSprite) {
            this.spriteSheet(gameObject.sprite, gameObject.position);
            return true;
        }
        this.sprite(gameObject.sprite, gameObject.position);
        return true;
    }
}