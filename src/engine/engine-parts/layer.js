class Layer {

    constructor(name) {
        this.name = name;
        this.gameObjects = [];
        this.z_order = 0;
    }

    /**
     * Register GameObject to the layer
     * @param {GameObject} gameObject 
     * @returns {boolean}
     */
    registerGameObject(gameObject) {
        if (gameObject === null || gameObject === undefined) {
            console.error('No valid GameObject found to be added to the layer ' + this.name);
            return false;
        }

        this.gameObjects.push(gameObject);
        return true;
    }
}