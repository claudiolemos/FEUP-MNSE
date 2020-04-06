let video;
let poseNet;
let pose;

/**
 * 
 */
function setup() {
  createCanvas(500, 500);
  frameRate(30);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

/**
 * 
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
 * @param {*} poses 
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
