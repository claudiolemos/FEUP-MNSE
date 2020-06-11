let yolo;
let person;
let spectrumCanvas;
let colour;

function setupVisual(video) {
    const { width, height } = video
    // Create a YOLO method
    yolo = ml5.YOLO(video, { 
        filterBoxesThreshold: 0.01, 
        IOUThreshold: 0.4, 
        classProbThreshold: 0.4 
    }, modelLoaded);
    // Setup extra canvas for the spectrum
    spectrumCanvas = createGraphics(width, height);
    spectrumCanvas.colorMode(HSB, width);
    colorMode(HSB, width);
}

function updateVisual(video) {
    if (!person) return;
    // Get selected color
    colour = getColor(video, person.x);
    // Draw a bounding box on the person
    drawPersonBB(video);
    // Draw the spectrum color canvas
    //drawSpectrumCanvas(video);
    // Enhance selected color
    drawSelectedColor(video);
}

function drawPersonBB(video) {
    // Get video dimensions
    const { width, height } = video
    // Get person position
    const {x, y, w, h, label, confidence} = person
    // Draw bounding box
    noStroke();
    fill(colour);
    text(label, x * width, y * height - 5);
    noFill();
    strokeWeight(4);
    stroke(colour);
    rect(x * width, y * height, w * width, h * height);
}

/**
 * Draws the color spectrum
 */
function drawSpectrumCanvas(video) {
    // Get spectrum canvas dimensions
    const { width, height } = spectrumCanvas
    spectrumCanvas.colorMode(HSB, width);
    spectrumCanvas.strokeWeight(2);
    for (x = 0; x <= width; x++) {
        spectrumCanvas.stroke(x, width, video.height);
        spectrumCanvas.line(x, 0, x, height);
        x++;
    }
    image(spectrumCanvas, 0, video.height - height);
}

function drawSelectedColor(video) {
    const { width, height } = spectrumCanvas;
    colour.setAlpha(200);
    spectrumCanvas.clear();
    spectrumCanvas.fill(colour);
    spectrumCanvas.rect(0, 0, width, height);
    image(spectrumCanvas, 0, 0);
}

// Adicionar em texto qual é a cor e remover 'person'

/**
 * Returns the correspondent color of the spectrum
 * @param width The screen width dimension
 * @param x The position on the screen
 * @returns Color in RGB color space
 */
function getColor(video, personX) {
    const { width, height } = video
    return spectrumCanvas.color(personX * width, width, height);
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