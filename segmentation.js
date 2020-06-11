let bodypix;


//import * as bodyPix from '@tensorflow-models/body-pix'; 
/*
function setup() {

    bodypix = ml5.bodyPix(video, modelReady);
}
*/

function setupSegmentation(video) {
	bodypix = ml5.bodyPix(modelReady);
}


function updateSegmentation() {
	modelReady();
}

function modelReady() {
  // segment the image given
  bodypix.segment(video, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  // log the result
  console.log(result.backgroundMask);
}


/*
async function updateSegmentation() {
	const net = ml5.bodyPix.load();

	function modelReady() {
	  // segment the image given
	  bodypix.segment(video, gotResults);
	}

	const imageElement = document.getElementById('image');

	// arguments for estimating person segmentation.
	const outputStride = 16;
	const segmentationThreshold = 0.5;

	const personSegmentation = net.estimatePersonSegmentation(imageElement, outputStride, segmentationThreshold);

	const segmentation = net.estimatePersonSegmentation(imageElement);

	const maskBackground = true;
	// Convert the personSegmentation into a mask to darken the background.
	const backgroundDarkeningMask = ml5.bodyPix.toMaskImageData(personSegmentation, maskBackground);const canvas = document.getElementById('canvas');

	const opacity = 0.7;
	// draw the mask onto the image on a canvas.  With opacity set to 0.7 this will darken the background.
	bodyPix.drawMask(
		canvas, imageElement, backgroundDarkeningMask, opacity);
}
*/
