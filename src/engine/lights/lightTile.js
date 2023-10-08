class LightTile {
    constructor(position, lightSpot = null, lightLevel = 0, reflexion = false) {
        this.position = new Position(position.X, position.Y);
        this.reflexion = reflexion;
        this.lightSpot = lightSpot;
        this.lightLevel = lightLevel;
    }
}