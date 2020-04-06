let video;
let poseNet;
let pose;

/**
 * Initial setup of the p5js playground
 * 
 * - create a 1000x1000 canvas
 * - get video feed from camera
 * - loads poseNet model
 */
function setup() {
  createCanvas(1000, 1000);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

/**
 * Draws to the canvas every x milliseconds
 * 
 * - video feed
 * - red circle on the nose of the first detected body
 */
function draw() {
  image(video, 0, 0);

  if(pose){
    fill(255,0,0);
    noStroke();
    ellipse(pose.nose.x, pose.nose.y, 64);
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
