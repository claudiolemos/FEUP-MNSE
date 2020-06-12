let bodypix;  
let segmentation; 
let width = 640;
let height = 480;

const options = {
    architecture: 'MobileNetV1',
    outputStride: 32,
    inputResolution: { width: 640, height: 480 },
    multiplier: 0.5,
    outputStride: 32, // 8, 16, or 32, default is 16
    segmentationThreshold: 0.3, // 0 - 1, defaults to 0.5 
}

let img;
function preload() {
  img = loadImage('./Images/vapor.jpg');
}

function setupSegmentation(video) {
    bodypix = ml5.bodyPix(video, options, modelReady)
	
}
function modelReady() {
    console.log('ready!')
    bodypix.segment(gotResults, options)
}
function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result);
    segmentation = result;
    //background(0);
    background(img);
    image(segmentation.backgroundMask, 0, 0, width, height)
    bodypix.segment(gotResults, options)
}
