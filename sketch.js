let video;
let poseNet;
let pose;

/**
 * Initial setup of the p5js playground
 * 
 * - create a 1000x1000 canvas
 * - get video feed from camera
 * - setup sound, visual and segmentation modules 
 * - loads poseNet model
 */
function setup() {
  createCanvas(1000, 1000);

  video = createCapture(VIDEO);
  video.hide();

  // setupSound();
  // setupVisual();
  // setupSegmentation();

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

/**
 * Gets called every x milliseconds
 * 
 * - draws the video feed on canvas
 * - updates sound, visual and segmentation modules
 * - red circle on the nose of the first detected body
 */
function draw() {
  image(video, 0, 0);

  // updateSound();
  // updateVisual();
  // updateSegmentation();

  if(pose){
    beginShape();
    fill(255,0,0);
    noStroke();
    ellipse(pose.nose.x, pose.nose.y, 64);
    endShape();
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
