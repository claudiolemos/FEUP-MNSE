let bodypix;  let segmentation; let img;
let vid;
let width = 320;
let height = 240;

const options = {
    "outputStride": 8, // 8, 16, or 32, default is 16
    "segmentationThreshold": 0.3, // 0 - 1, defaults to 0.5 
	"width" : 320,
	"height" : 240
	
}
function setupSegmentation() {
    createCanvas(320, 240);

    // load up your video
    vid = createCapture(VIDEO);
    vid.size(width, height);
    // video.hide(); // Hide the video element, and just show the canvas

    bodypix = ml5.bodyPix(vid,	{
	  architecture: 'MobileNetV1',
	  outputStride: 16,
	  inputResolution: { width: 640, height: 480 },
	  multiplier: 0.75,
	  width : 320,
	  height : 240
	}, modelReady)
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

    background(0);
    image(vid, 0, 0, width, height)
    image(segmentation.maskBackground, 0, 0, width, height)

    bodypix.segment(gotResults, options)

}
