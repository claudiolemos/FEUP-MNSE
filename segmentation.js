let imagesWidth;
let imageIndex = 0;
let soundClassifier;
let soundCmd;
let resultImg;
let hasOutputImg = false;

const soundOptions = { probabilityThreshold: 0.4 };

let modelNets = [];
let isModelLoaded = [];
const modelNames = [
	'la_muse',
	'rain_princess', 
	'udnie', 
	'wreck', 
	'scream', 
	'wave', 
	'mathura', 
	'fuchun', 
	'zhangdaqian'
];
let modelImages = [];

function setupSegmentation(video) {
	const { width } = video;

	setLoading(true);

	// Load images
	modelImages = modelNames.map(model => loadImage(`images/${model}.jpg`));
	imagesWidth = width / 9;
 
	// Voice command classifier
	soundClassifier = ml5.soundClassifier(
		'SpeechCommands18w', 
		soundOptions, 
		soundModelReady
	);

	// Load model nets
	modelNets = modelNames.map(model =>
		ml5.styleTransfer(
			`./models/${model}/`,
			video,
			() => styleModelLoaded(model)
		)
	);

	// Create result image
	resultImg = createImg('');
	resultImg.hide();
}

function modelsLoaded() {
	return isModelLoaded.length === modelNames.length;
}

function updateSegmentation(video) {
	const { width, height } = video;
	// Verify if loading is complete
	if (modelsLoaded()) {
		// Init first frame
		if (isLoading) {
			styleFrame();
		}
		setLoading(false);
	}
	// Draw video / result image
	imageMode(CORNER);
	if (hasOutputImg) {
		image(resultImg, 0, 0, width, height + 100);
		drawImagesCanvas();
	} else {
		drawLoadingScreen(video);
	}
}

function drawLoadingScreen(video) {
	const { width, height } = video;
	image(video, 0, 0, width, height);
	fill(255,255,255);
	stroke(0,0,0);
	textSize(20);
	textAlign(CENTER, CENTER);
	text("Loading models...", width / 2, height / 2 + 100);
}

function drawImagesCanvas() {
	var c = color(0,0,0);
	for (i = 0; i < modelImages.length; i++) {
		const imgX = i * imagesWidth;
		const imgY = height - imagesWidth;
		if (i === imageIndex) {
			c.setAlpha(0);
		} else {
			c.setAlpha(126);
		}
		// Draw image
		image(modelImages[i], imgX, imgY, imagesWidth, imagesWidth);
		// Draw bounding image border
		fill(c);
		strokeWeight(2);
		stroke(0);
		rect(imgX, imgY, imagesWidth, imagesWidth);
	}
}

function soundModelReady() {
	console.log("Sound classifier model loaded!");
	detectSound();
}

function detectSound() {
	soundClassifier.classify(processSound);
}

function processSound(error, result) {
	if (error) {
	  console.log(error);
	  return;
	}
	// Get best confidence voice command
	const allowed = result.filter(r => r.label === 'left' || r.label === 'right');
	const bestConfidence = Math.max(...allowed.map(p => p.confidence));
	const bestParam = allowed.filter(p => p.confidence === bestConfidence)[0];
	if (bestParam.confidence < 0.1) return;
	const cmd = bestParam.label;
	// Print the command
	if (!result.length) return;
	updateImageIndex(cmd);
	styleFrame();
}

function styleModelLoaded(model) {
	console.log(`Style model ${model} loaded!`);
	isModelLoaded.push(true);
}

function updateImageIndex(cmd) {
	if (cmd === 'right') {
		imageIndex++;
	} else if (cmd === 'left') {
		imageIndex--;
	}
	if (imageIndex >= modelNames.length) {
		imageIndex = modelNames.length - 1;
	} else if (imageIndex < 0) {
		imageIndex = 0;
	}
}

function styleFrame() {
	try {
		modelNets[imageIndex].transfer(gotResult);
	} catch(error) {
		console.log(error);
	}
}

function gotResult(err, res) {
	if (err) {
		console.log(err);
		return;
	}
	resultImg.attribute('src', res.src);
	hasOutputImg = true;
}
