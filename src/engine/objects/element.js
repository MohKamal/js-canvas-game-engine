/**
 * When you wanna add sprite or spritesheet to a layer, to be drawned by layer order and
 * automaticaly, you need to add it to an element and add it to the layer
 */
class Element {
    constructor(sprite, position, opacity = 1) {
        this.id = "element_" + Math.random().toString(16).slice(2);
        this.sprite = sprite;
        this.position = position;
        this.opacity = opacity;
        this.showIt = true;
    }

    hide() {
        this.showIt = false;
    }

    show() {
        this.showIt = true;
    }
}