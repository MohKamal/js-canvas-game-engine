class LightTile {
    constructor(position, lightSpot = null, lightLevel = 0) {
        this.position = new Position(position.X, position.Y);
        this.lightSpot = lightSpot;
        this.lightLevel = lightLevel;
    }
}