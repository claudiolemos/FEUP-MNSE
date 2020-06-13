let imageIndex = 0;
let soundClassifier;
let soundCmd;
let resultImg;

const soundOptions = { probabilityThreshold: 0.4 };

let modelNets = [];
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

function updateSegmentation() {
	image(resultImg, 640, 0, 640, 480);
}

function soundModelReady() {
	console.log("Sound classifier model loaded!");
	detectSound();
}

function detectSound() {
	soundClassifier.classify(processSound);
}

function processSound(error, result) {
	const allowed = ['left', 'right'];
	if (error) {
	  console.log(error);
	  return;
	}
	// Print the command
	if (!result.length) return;
	const cmd = result[0].label; 
	if (allowed.includes(cmd)) {
		console.log(cmd)
		updateImageIndex(cmd);
		styleFrame();
	}
}

function styleModelLoaded(model) {
	console.log(`Style model ${model} loaded!`);
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
	console.log('Style Transfer model Loaded!');
	modelNets[imageIndex].transfer(gotResult);
}

function gotResult(err, res) {
	if (err) {
		console.log(err);
		return;
	}
	resultImg.attribute('src', res.src);
	//modelNets[imageIndex].transfer(gotResult);
}
