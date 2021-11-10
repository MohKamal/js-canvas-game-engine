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
    sprite(sprite, position, camera = null) {
        if (sprite === null || sprite === undefined) {
            console.error('No valid sprite Sheet was found to be drawed');
            return false;
        }

        if (sprite.image === null || sprite.image === undefined) {
            console.error('No valid sprite Sheet image was found to be drawed');
            return false;
        }

        if (camera !== null) {
            camera.updateMaxPosition();
            if (position.X >= camera.position.X && (position.X + sprite.width) <= camera.maxPosition.X && position.Y >= camera.position.Y && position.Y <= camera.maxPosition.Y) {
                if (camera.addOffset) {
                    this.ctx.drawImage(sprite.image, position.X + camera.offset.X, position.Y + camera.offset.Y);
                    return true;
                }
            }
        }
        this.ctx.drawImage(sprite.image, 0, 0, sprite.image.width, sprite.image.height, position.X, position.Y, sprite.width, sprite.height);
        return true;
    }

    /**
     * Draw a text to the canvas
     * @param {string} text 
     * @param {Position} position 
     */
    text(text, position, fontSize = 14, font = 'serif', camera = null) {
        this.ctx.font = `${fontSize}px ${font}`;
        if (camera !== null) {
            camera.updateMaxPosition();
            let size = this.ctx.measureText(text);
            if ((position.X >= camera.position.X && (position.X + (size.width / 2)) < camera.maxPosition.X) && (position.Y - fontSize >= camera.position.Y && position.Y < camera.maxPosition.Y)) {
                if (camera.addOffset) {
                    this.ctx.fillText(text, position.X + camera.offset.X, position.Y + camera.offset.Y);
                    return true;
                }
            }
        }
        this.ctx.fillText(text, position.X, position.Y);
        return true;
    }

    /**
     * Draw SpriteSheet animation
     * @param {SpriteSheet} sprite 
     * @param {Position} position 
     * @returns bool
     */
    spriteSheet(sprite, position, camera = null) {
        if (sprite === null || sprite === undefined) {
            console.error('No valid sprite Sheet was found to be drawed');
            return false;
        }

        if (sprite.image === null || sprite.image === undefined) {
            console.error('No valid sprite Sheet image was found to be drawed');
            return false;
        }
        sprite.update();
        if (camera !== null) {
            camera.updateMaxPosition();
            if (position.X >= camera.position.X && (position.X + sprite.width) <= camera.maxPosition.X && position.Y >= camera.position.Y && position.Y <= camera.maxPosition.Y) {
                if (camera.addOffset) {
                    this.ctx.drawImage(sprite.image, sprite.frame().X, sprite.frame().Y, sprite.width, sprite.height, position.X + camera.offset.X, position.Y + camera.offset.Y, sprite.width, sprite.height);
                    return true;
                }
            }
        }
        this.ctx.drawImage(sprite.image, sprite.frame().X, sprite.frame().Y, sprite.width, sprite.height, position.X, position.Y, sprite.width, sprite.height);
        return true;
    }

    /**
     * Draw Game object sprite, or SpriteSheet
     * @param {GameObject} gameObject 
     * @returns bool
     */
    gameObject(gameObject, camera = null) {
        if (gameObject === null || gameObject === undefined) {
            console.error('No gameObject found to be drawed');
            return false;
        }
        if (!gameObject.hasSimpleSprite) {
            this.spriteSheet(gameObject.sprite, gameObject.position, camera);
            return true;
        }
        this.sprite(gameObject.sprite, gameObject.position, camera);
        return true;
    }

    /**
     * Display camera Range as Rectangle
     * @param {Camera} camera 
     * @returns {boolean}
     */
    camera(camera) {
        if (camera === null || camera === undefined) {
            console.error('No camera found to be drawed');
            return false;
        }

        this.ctx.beginPath();
        this.ctx.rect(camera.position.X, camera.position.Y, camera.cameraSize.width, camera.cameraSize.height);
        this.ctx.lineWidth = "6";
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();
        return true;
    }

    /**
     * Draw a line between two points
     * @param {Point} point1 
     * @param {Point} point2 
     * @param {Int} lineWidth 
     * @param {string} color 
     */
    line(point1, point2, lineWidth = 5, color = 'red', camera = null) {
        // set line stroke and line width
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        if (camera !== null) {
            camera.updateMaxPosition();
            if (point1.X >= camera.position.X && point1.Y <= camera.position.Y && point2.X <= camera.maxPosition.X && point2.Y <= camera.maxPosition.Y) {
                if (camera.addOffset) {
                    // draw a red line
                    this.ctx.beginPath();
                    this.ctx.moveTo(point1.X + camera.offset.X, point1.Y + camera.offset.Y);
                    this.ctx.lineTo(point2.X + camera.offset.X, point2.Y + camera.offset.Y);
                    this.ctx.stroke();
                    return true;
                }
            }
        }
        // draw a red line
        this.ctx.beginPath();
        this.ctx.moveTo(point1.X, point1.Y);
        this.ctx.lineTo(point2.X, point2.Y);
        this.ctx.stroke();
        return true;
    }

    /**
     * Draw a rectangle
     * @param {Position} position 
     * @param {Size} size 
     * @param {boolean} filled 
     * @param {Int} lineWidth 
     * @param {String} color 
     * @param {Camera} camera 
     */
    rectangle(position, size, filled = true, lineWidth = 5, color = 'red', camera = null) {
        // set line stroke and line width
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        if (camera !== null) {
            camera.updateMaxPosition();
            if (position.X >= camera.position.X && position.Y <= camera.position.Y && position.X <= camera.maxPosition.X && position.Y <= camera.maxPosition.Y) {
                if (camera.addOffset) {
                    if (filled) {
                        this.ctx.fillRect(position.X + camera.offset.X, position.Y + camera.offset.Y, size.width, size.height);
                        return true;
                    }
                    this.ctx.strokeRect(position.X + camera.offset.X, position.Y + camera.offset.Y, size.width, size.height);
                    return true;
                }

            }
        }

        if (filled) {
            this.ctx.fillRect(position.X, position.Y, size.width, size.height);
            return true;
        }

        this.ctx.strokeRect(position.X, position.Y, size.width, size.height);
        return true;
    }

    /**
     * Draw an arc or a circle
     * @param {Position} position 
     * @param {Int} reduis 
     * @param {Float} startAngele 
     * @param {Float} endAngle 
     * @param {boolean} filled 
     * @param {Int} lineWidth 
     * @param {String} color 
     * @param {Camera} camera 
     * @returns {boolean}
     */
    circle(position, reduis, startAngele = 0, endAngle = -1, filled = true, lineWidth = 5, color = 'red', camera = null) {
        // set line stroke and line width
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        if (endAngle === -1) {
            endAngle = 2 * Math.PI;
        }
        if (camera !== null) {
            camera.updateMaxPosition();
            if (position.X >= camera.position.X && position.Y <= camera.position.Y && position.X <= camera.maxPosition.X && position.Y <= camera.maxPosition.Y) {
                if (camera.addOffset) {
                    if (filled) {
                        this.ctx.beginPath();
                        this.ctx.arc(position.X + camera.offset.X, position.Y + camera.offset.Y, reduis, startAngele, endAngle);
                        this.ctx.fill();
                        return true;
                    }

                    this.ctx.beginPath();
                    this.ctx.arc(position.X + camera.offset.X, position.Y + camera.offset.Y, reduis, startAngele, endAngle);
                    this.ctx.stroke();
                    return true;
                }
            }
        }

        if (filled) {
            this.ctx.beginPath();
            this.ctx.arc(position.X, position.Y, reduis, startAngele, endAngle);
            this.ctx.fill();
            return true;
        }

        this.ctx.beginPath();
        this.ctx.arc(position.X, position.Y, reduis, startAngele, endAngle);
        this.ctx.stroke();
        return true;
    }
}