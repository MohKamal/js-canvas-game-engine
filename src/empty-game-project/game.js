// First of all, wait to the document is ready
$(window).on("load", function() {
    // Get the canas Element
    var canvas = $("#canvas");
    var ctx = canvas[0].getContext("2d");

    // Init the Engine
    engine = new Engine(canvas[0]);
    engine.OnCreate = function() {
        sample = new SampleScene(this);
        engine.registerScene(sample);
    };
    engine.start();
});