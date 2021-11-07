class PlatformerGrid {

    constructor(width, height, resolution = 16, gravity = 100, friciton = 10) {
        this.width = width;
        this.height = height;
        this.resolution = resolution;
        this.gravity = gravity;
        this.friciton = friciton;
        this.epsilon = 0.0000001;
        this.cells = [];
        this.nodes = [];
        for (var i = 0; i < width * height; i++)
            this.cells.push(new PlatformerGridCell());

        for (var x = 0; x < width; x++)
            this.setCelling(x, height - 1, true);
    }

    /**
     * Make a cell celling
     * @param {float} x 
     * @param {float} y 
     * @param {boolean} celling 
     */
    setCelling(x, y, celling) {
        if (this.validateCoordinates(x, y))
            this.getCell(x, y).celling = celling;
    }

    /**
     * Validate an x & y positions
     * @param {float} x 
     * @param {float} y 
     * @returns {boolean}
     */
    validateCoordinates(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return false;
        return true;
    }

    /**
     * Get cell by positiion x & y
     * @param {float} x 
     * @param {float} y 
     * @returns {PlatformerGridCell}
     */
    getCell(x, y) {
        return this.cells[x + y * this.width];
    }

    /**
     * Check if the current cell is a wall
     * @param {float} x 
     * @param {float} y 
     * @returns {boolean} 
     */
    getWall(x, y) {
        if (!this.validateCoordinates(x, y))
            return false;

        return this.getCell(x, y).wall;
    }

    /**
     * Make the cell a wall
     * @param {float} x 
     * @param {float} y 
     * @param {boolean} wall 
     */
    setWall(x, y, wall) {
        if (this.validateCoordinates(x, y))
            this.getCell(x, y).wall = wall;
    }

    /**
     * Check if the current cell is celling
     * @param {float} x 
     * @param {float} y 
     * @returns {boolean}
     */
    getCelling(x, y) {
        if (!this.validateCoordinates(x, y))
            return false;
        return this.getCell(x, y).celling;
    }

    /**
     * A node to the grid
     * @param {PlatformerNode} node 
     * @returns {boolean}
     */
    addNode(node) {
        if (node === null || node === undefined) {
            console.error('No valid node was found to be added to the grid');
            return false;
        }

        this.nodes.push(node);
        return true;
    }

    /**
     * Remove a node to the grid
     * @param {PlatformerNode} node 
     * @returns {boolean}
     */
    removeNode(node) {
        if (node === null || node === undefined) {
            console.error('No valid node was found to be added to the grid');
            return false;
        }

        this.nodes = this.nodes.filter(_node => {
            return _node !== node;
        });
        return true;
    }

}