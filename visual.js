let yolo;
let person;
let spectrumCanvas;
let colour;

function setupVisual(video) {
    const { width, height } = video
    spectrumCanvas = createGraphics(width, height);
    spectrumCanvas.colorMode(HSB, width);
    colorMode(HSB, width);
    textFont('Helvetica');
}

function updateVisual(video, pose) {
	//blendMode(BLEND);
	imageMode(CORNER);
    if (!pose) return;
	image(video, 0,0);
    person = pose;
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
    const hexColor = rgbToHex(colour);
    const colorName = ntc.name(hexColor)[1];
    fill(colour);
    strokeWeight(2);
    stroke(0,0,0);
    textSize(40);
    textAlign(CENTER, CENTER);
    text(colorName, width / 2, height / 2);
    fill(colour);
    textSize(20);
    strokeWeight(2);
    stroke(0,0,0);
    text(hexColor, width / 2, height / 2 + 30);
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
    spectrumCanvas.noStroke();
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
    const { width, height } = video;
    const x = person.nose.x;
    return spectrumCanvas.color(x, width, height);
}

function rgbToHex(colour) {
    const components = colour.levels.slice(0,-1);
    if (components.length < 3) return;
    const r = components[0], g = components[1], b = components[2];
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}