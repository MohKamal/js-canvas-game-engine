class Scene {
    constructor(name, engine) {
        this.name = name;
        this.isEnded = false;
        this.isCreated = false;
        this.engine = engine;
        this.layers = [];
        this.registerLayer(new Layer('ground'));
    }

    /**
     * Add Layer to the layers
     * @param {Layer} layer 
     * @returns 
     */
    registerLayer(layer) {
        if (layer === null || layer === undefined) {
            console.error('No valid layer was found to be register to the scene ' + this.name);
            return false;
        }

        layer.z_order = this.layers.length;
        this.layers.push({ zOrder: layer.z_order, layer: layer });
        return true;
    }

    /**
     * Remove a layer
     * @param {Layer} layer 
     * @returns 
     */
    removeLayer(layer) {
        if (layer === null || layer === undefined) {
            console.error('No valid layer was found to be removed from the scene ' + this.name);
            return false;
        }
        // Remove the filter
        this.layers = this.layers.filter(function(_layer) {
            return _layer.layer.name !== layer.name;
        });
        // set the zOrder of the other layers
        for (var i = 0; this.layers.length; i++) {
            this.layers[i].zOrder = i;
            this.layers[i].layer.z_order = i;
        };
        return true;
    }

    /**
     * Set the scene to created
     */
    created() { this.isCreated = true; }

    /**
     * End scene and run the OnDestroy
     */
    ended() {
        this.OnDestroy();
        this.isEnded = true;
    }

    /**
     * OnCreate function run's Once
     * @returns {boolean}
     */
    OnCreate() { return true; }

    /**
     * Run every second
     * @param {float} elapsedTime 
     * @returns {boolean}
     */
    OnUpdate(elapsedTime) { return true; }

    /**
     * Run's once after the end of the scene
     * @returns {boolean}
     */
    OnDestroy() { return true; }
}