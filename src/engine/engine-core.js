var files = [{
        name: "RGB script",
        path: "util/rgb.js"
    },
    {
        name: "Buttons definition",
        path: "util/buttons.js"
    },
    {
        name: "Point script",
        path: "util/point.js"
    },
    {
        name: "Position script",
        path: "util/position.js"
    },
    {
        name: "Size script",
        path: "util/size.js"
    },
    {
        name: "GameObject script",
        path: "objects/gameObject.js"
    },
    {
        name: "Particle script",
        path: "particles/particle.js"
    },
    {
        name: "Fire script",
        path: "particles/fire.js"
    },
    {
        name: "Lighting script",
        path: "lights/lighting.js"
    },
    {
        name: "Light Spot script",
        path: "lights/lightSpot.js"
    },
    {
        name: "Light Tile script",
        path: "lights/lightTile.js"
    },
    {
        name: "Camera script",
        path: "objects/camera.js"
    },
    {
        name: "FixedCamera script",
        path: "cameras/fixedCamera.js"
    },
    {
        name: "WorldCamera script",
        path: "cameras/worldCamera.js"
    },
    {
        name: "Drawer script",
        path: "buffer/drawer.js"
    },
    {
        name: "Sprite script",
        path: "buffer/sprite.js"
    },
    {
        name: "SpriteSheet script",
        path: "buffer/spriteSheet.js"
    },
    {
        name: "Sound script",
        path: "audio/sound.js"
    },
    {
        name: "Animation script",
        path: "animations/animation.js"
    },
    {
        name: "GeometricAnimation script",
        path: "animations/geometricAnimation.js"
    },
    {
        name: "Layer script",
        path: "engine-parts/layer.js"
    },
    {
        name: "Scene script",
        path: "engine-parts/scene.js"
    },
    {
        name: "IntroScene script",
        path: "scenes/introScene.js"
    },
    {
        name: "Engine Core script",
        path: "engine-parts/engine.js"
    }
]

var currentFolders = location.href.split("/");
var path = "";
var startWriting = false;
for (var i = 0; i < currentFolders.length - 1; i++) {
    if (startWriting) {
        path += "../";
    }

    if (currentFolders[i] == "src") {
        startWriting = true;
    }
}
path += "engine/";

files.forEach((file) => {
    const script = document.createElement('script');
    script.setAttribute(
        'src',
        path + file.path,
    );

    script.setAttribute('async', '');

    script.onload = function handleScriptLoaded() {
        console.log(`script ${file.name} has loaded`);
    };

    script.onerror = function handleScriptError() {
        console.log(`error loading script ${file.name}`);
    };

    document.head.appendChild(script);
});