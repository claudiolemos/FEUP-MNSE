// Options for the SpeechCommands18w model, the default probabilityThreshold is 0

const options = { probabilityThreshold: 0.7 };
const classifier = ml5.soundClassifier('SpeechCommands18w', options, modelReady);


pictures = ['a','b','c','d','e','f']
i = 0;
function modelReady() {
  // classify sound
  classifier.classify(gotResult);
}

// Create a new Style Transfer Instance
const style = ml5.styleTransfer('./models/udnie',video, modelLoaded);

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}

function stylePicture() {
	style.transfer(function(error, result) {
		if (error) {
			console.log(error);
			return;
		  }
	console.log(result);
	});
}

function gotResult(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  // log the result
  console.log(result[0].label);
  changePicture(result[0].label);
}

function changePicture(label) {
	stylePicture() /*
	switch(label) {
		case "go":
			stylePicture()
			break;
		case "left":
			if(i > 0)
				i--;
			console.log(pictures[i]);
			break;
		case "right":
			if(i < 5)
				i++;
			console.log(pictures[i]);
			break;
	}*/
}
function setupSegmentation() {
}

function updateSegmentation() {
}