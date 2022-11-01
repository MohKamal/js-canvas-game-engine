class LightSpot {
    constructor(position, color = new RGB(255, 255, 255), distance = 3, tension = 20) {
        this.position = new Position(position.X, position.Y);
        this.color = color;
        this.distance = distance;
        this.tension = tension * 0.01;
    }
}