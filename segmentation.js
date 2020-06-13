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

function setupSegmentation(video) {
	setLoading(true);

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
	if (hasOutputImg) {
		image(resultImg, 0, 0, width, height + 100);
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

function soundModelReady() {
	console.log("Sound classifier model loaded!");
	detectSound();
}

function detectSound() {
	if (isLoading) {
		soundClassifier.classify(processSound);
	}
}

function processSound(error, result) {
	const allowed = ['left', 'right'];
	if (error) {
	  console.log(error);
	  return;
	}
	// Print the command
	if (!result.length || isLoading) return;
	const cmd = result[0].label;
	if (allowed.includes(cmd)) {
		console.log(cmd);
		updateImageIndex(cmd);
		styleFrame();
	}
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
	modelNets[imageIndex].transfer(gotResult);
}

function gotResult(err, res) {
	if (err) {
		console.log(err);
		return;
	}
	resultImg.attribute('src', res.src);
	hasOutputImg = true;
	// Comment this line to disable real-time styling
	modelNets[imageIndex].transfer(gotResult);
}
