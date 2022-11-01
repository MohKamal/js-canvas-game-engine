class SampleScene extends Scene {

    constructor(engine) {
        super('sampleScene', engine);
        this.light = new Lighting(this.engine, 10, 10, 50);
    }

    OnCreate() {
        this.light.addLightSpot(new LightSpot(new Position(15, 15), new RGB(255, 255, 255), 1, 80), false);
        this.light.addLightSpot(new LightSpot(new Position(20, 20), new RGB(255, 255, 255), 1, 20), false);
        this.light.addLightSpot(new LightSpot(new Position(25, 20), new RGB(255, 255, 255), 1, 20), false);
        this.light.addLightSpot(new LightSpot(new Position(30, 20), new RGB(255, 255, 255), 1, 20), false);
        return true;
    }

    OnUpdate(elapsedTime) {
        this.engine.drawer.clearWithColor('skyblue');
        this.engine.drawer.rectangle(new Position(100, 100), new Size(300, 300), true, 1, 'green');
        if (this.engine.mouseClicked(MouseButton.LEFT)) {
            this.light.addLightSpot(new LightSpot(this.engine.mousePosition(), new RGB(255, 255, 255), 2));
        }
        this.light.draw();
    }
}