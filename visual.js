let yolo;
let person;

function setupVisual(video) {
    // Create a YOLO method
    yolo = ml5.YOLO(video, { 
        filterBoxesThreshold: 0.01, 
        IOUThreshold: 0.4, 
        classProbThreshold: 0.4 
    }, modelLoaded);
}

function updateVisual(video) {
    if (!person) return; 
    // Get video dimensions
    const { width, height } = video
    // Get person position
    const {x, y, w, h, label, confidence} = person
    // Draw a bounding box on the person
    noStroke();
    fill(0, 255, 0);
    text(label, x * width, y * height - 5);
    noFill();
    strokeWeight(4);
    stroke(0, 255, 0);
    rect(x * width, y * height, w * width, h * height);
}

function modelLoaded() {
    console.log("Model Loaded!");
    detectPerson();
}

function detectPerson() {
    yolo.detect(handleDetection);
}

function handleDetection(err, results) {
    if (err) {
        console.log(err);
        return;
    }
    // Save person position
    const obj = results[0];
    if (obj && obj.label === 'person') {
        person = obj;
        console.log(person);
    }
    detectPerson();
}

/**
 * Returns the correspondent color of the spectrum
 * @param width The screen width dimension
 * @param x The position on the screen
 * @returns Color in RGB color space
 */
function getColor(width, x) {
    colorMode(HSB, width);
    strokeWeight(2);

}