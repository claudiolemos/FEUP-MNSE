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
    textFont('Helvetica');
}

function updateVisual(video) {
    if (!person) return;
    // Get selected color
    colour = getColor(video);
    // Draw a bounding box on the person
    drawPersonBB(video);
    // Draw the spectrum color canvas
    drawSpectrumCanvas(video);
    // Enhance selected color
    drawSelectedColor(video);
}

function drawPersonBB(video) {
    // Get video dimensions
    const { width, height } = video
    // Get person position
    const {x, y, w, h} = person
    // Get colour name
    const colorName = ntc.name(rgbToHex(colour))[1];
    // Define rect dimensions
    const rectCornerX = x * width;
    const rectCornerY = y * height;
    const rectWidth = w * width;
    const rectHeight = h * height;
    // Draw bounding box
    noStroke();
    fill(colour);
    textSize(20);
    textAlign(LEFT);
    text(`${colour.toString()}`, rectCornerX, rectCornerY - 10);
    noFill();
    strokeWeight(4);
    stroke(colour);
    rect(rectCornerX, rectCornerY, rectWidth, rectHeight);
    fill(colour);
    strokeWeight(2);
    stroke(0,0,0);
    textSize(40);
    textAlign(CENTER, CENTER);
    text(colorName, rectCornerX + rectWidth / 2, rectCornerY + rectHeight / 2);
}

/**
 * Draws the color spectrum
 */
function drawSpectrumCanvas(video) {
    // Get spectrum canvas dimensions
    const { width, height } = spectrumCanvas
    spectrumCanvas.strokeWeight(2);
    for (x = 0; x <= width; x++) {
        spectrumCanvas.stroke(x, width, video.height);
        spectrumCanvas.line(x, 0, x, height);
        x++;
    }
    image(spectrumCanvas, 0, video.height - 40);
}

function drawSelectedColor() {
    const { width, height } = spectrumCanvas;
    colour.setAlpha(200);
    spectrumCanvas.clear();
    spectrumCanvas.fill(colour);
    spectrumCanvas.rect(0, 0, width, height - 40);
    image(spectrumCanvas, 0, 0);
}

// Adicionar em texto qual é a cor e remover 'person'

/**
 * Returns the correspondent color of the spectrum
 * @param width The screen width dimension
 * @param x The position on the screen
 * @returns Color in RGB color space
 */
function getColor(video) {
    const { width, height } = video
    const { x, w } = person
    const rectCornerX = x * width;
    const rectWidth = w * width;
    const rectCenterX = rectCornerX + rectWidth / 2; 
    return spectrumCanvas.color(rectCornerX, width, height);
}

function rgbToHex(colour) {
    const components = colour.levels.slice(0,-1);
    if (components.length < 3) return;
    const r = components[0], g = components[1], b = components[2];
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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
        if (isLoading) {
            setLoading(false);
        }
    }
    detectPerson();
}