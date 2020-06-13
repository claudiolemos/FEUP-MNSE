let video;
let poseNet;
let pose;
let loadingAnimation;
let isLoading = false;
let timer = 5
let images = [];

var States = {
  SPLASHSCREEN: 1,
  HOMESCREEN: 2,
  SOUND: 3,
  VISUAL: 4,
  SEGMENTATION: 5,
  SOUNDINSTRUCTION: 6,
  VISUAINSTRUCTIONL: 7,
  SEGMENTATIONINSTRUCTION: 8
};

let currentState = States.SEGMENTATION;

function setup() {
  createCanvas(1280, 960);
  loadImages();

  video = createCapture(VIDEO);
  video.size(640,480);
  video.hide();

  // Loading animation
  loadingAnimation = select('.bubbles-wrapper');

  // setupSound();
  //setupVisual(video);
  setupSegmentation(video);

  /*poseNet = ml5.poseNet(video, {
    architecture: 'MobileNetV1',
    outputStride: 16,
    quantBytes: 2,
    multiplier: 0.5,
  }, modelLoaded);
  poseNet.on('pose', gotPoses);*/
}

function draw() {
	/*
  switch(currentState) {
    case States.SPLASHSCREEN:
      if (frameCount % 60 == 0 && timer > 0) timer --;
      if (timer == 0) {timer = 5; currentState = States.HOMESCREEN}
      drawSplashScreen();
      break;
    case States.HOMESCREEN:
      image(video, 0, 0);
      break;
    case States.SOUND:
      
      break;
    case States.VISUAL:
      
      break;
    case States.SEGMENTATION:
      
      break;
    case States.SOUNDINSTRUCTION:
      
      break;
    case States.VISUALINSTRUCTION:
      
      break;
    case States.SEGMENTATIONINSTRUCTION:
      
      break;
    default:
      // code block
  }
*/

  //drawVideo(video);
  image(video, 0, 0);
  if (!isLoading) {
	  // Draw video
    // Update modules
    //updateSound(pose, video);
    //updateVisual(video);
    updateSegmentation();
  }
}

function drawSplashScreen(){
  image(images.humansynth, 0, 0);
}

function loadImages(){
  images.credits = loadImage('visuals/credits.jpg');
  images.humansynth = loadImage('visuals/humansynth.jpg');
  images.segmentation_instructions = loadImage('visuals/segmentation_instructions.jpg');
  images.segmentation_logo = loadImage('visuals/segmentation_logo.jpg');
  images.segmentation_typo = loadImage('visuals/segmentation_typo.jpg');
  images.slogan = loadImage('visuals/slogan.jpg');
  images.sound_instructions = loadImage('visuals/sound_instructions.jpg');
  images.sound_logo = loadImage('visuals/sound_logo.jpg');
  images.sound_typo = loadImage('visuals/sound_typo.jpg');
  images.visual_instructions = loadImage('visuals/visual_instructions.jpg');
  images.visual_logo = loadImage('visuals/visual_logo.jpg');
  images.visual_typo = loadImage('visuals/visual_typo.jpg');
}

function setLoading(loading) {
  isLoading = loading;
  if (!loading) {
    loadingAnimation.addClass('display-none');
  }
}

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

function gotPoses(poses){
  if(poses)
    pose = poses[0].pose;
}

function modelLoaded(){
}