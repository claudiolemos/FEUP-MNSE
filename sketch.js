let video;
let poseNet;
let pose;
let loadingAnimation;
let isLoading = true;

/**
 * Initial setup of the p5js playground
 * 
 * - create a 1000x1000 canvas
 * - get video feed from camera
 * - setup sound, visual and segmentation modules 
 * - loads poseNet model
 */
function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640,480);
  video.hide();

  // Loading animation
  loadingAnimation = select('.bubbles-wrapper');

  // setupSound();
  setupVisual(video);
  // setupSegmentation();

  //poseNet = ml5.poseNet(video, {outputStride:8, quantBytes:4}, modelLoaded);
  //poseNet.on('pose', gotPoses);
}

/**
 * Gets called every x milliseconds
 * 
 * - draws the video feed on canvas
 * - updates sound, visual and segmentation modules
 * - red circle on the nose of the first detected body
 */
function draw() {
  //drawVideo(video);
  image(video, 0, 0);
  if (!isLoading) {
    // Draw video
    // Update modules
    // updateSound(pose, video);
    updateVisual(video);
    // updateSegmentation();
  }
}

function setLoading(loading) {
  isLoading = loading;
  if (!loading) {
    loadingAnimation.addClass('display-none');
  }
}

/**
 * Draws the video to fit the full window
 * 
 * @param {*} video 
 */
function drawVideo(video){
  if(video.width*(windowWidth/video.width) >= windowWidth && video.height*(windowWidth/video.width) >= windowHeight){ // LANDSCAPE
    image(video, (windowWidth-video.width*(windowWidth/video.width))/2, (windowHeight-video.height*(windowWidth/video.width))/2, video.width*(windowWidth/video.width), video.height*(windowWidth/video.width));
    // return windowWidth/video.width;
  }
  else{ // PORTRAIT
    image(video, (windowWidth-video.width*(windowHeight/video.height))/2, (windowHeight-video.height*(windowHeight/video.height))/2, video.width*(windowHeight/video.height), video.height*(windowHeight/video.height));
    // return windowHeight/video.height;
  }
}

/**
 *  
 * 
 * @param {Array} poses detected bodies by the poseNet library 
 */
function gotPoses(poses){
  if(poses)
    pose = poses[0].pose;
}

/**
 * 
 */
function modelLoaded(){
}