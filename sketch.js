var States = {
  SPLASHSCREEN: 1,
  HOMESCREEN: 2,
  SOUND: 3,
  VISUAL: 4,
  ARTSTYLE: 5,
  SOUNDINSTRUCTION: 6,
  VISUALINSTRUCTION: 7,
  ARTSTYLEINSTRUCTION: 8
};

let video;
let poseNet;
let pose;
let loadingAnimation;
let isLoading = true;
let timer = 5
let images = [];
let currentState = States.SPLASHSCREEN;
let oldPose = 0;
let poseCounter = 0;
let isDrawingExitBar = false;

function setup() {  
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640,480);
  video.hide();

  loadImages();
  loadingAnimation = select('.bubbles-wrapper'); // load animation

  poseNet = ml5.poseNet(video, {
    architecture: 'MobileNetV1',
    outputStride: 16,
    quantBytes: 2,
    multiplier: 0.5,
  }, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function draw() {
  blendMode(BLEND);
  colorMode(RGB);
  imageMode(CENTER);

  switch(currentState) {
    case States.SPLASHSCREEN:
      if (frameCount % 30 == 0 && timer > 0) timer --;
      if (timer == 0) {timer = 5; currentState = States.HOMESCREEN}
      drawSplashScreen();
      break;
    case States.HOMESCREEN:
      drawHomeScreen();
      checkPosition();
      if(isDrawingExitBar) drawExitBar();
      break;
    case States.SOUND:
      image(video, width/2, height/2);
      updateSound(video, pose);
      checkPosition();
      if(isDrawingExitBar) drawExitBar();
      break;
    case States.VISUAL:
      updateVisual(video, pose);
      checkPosition();
      if(isDrawingExitBar) drawExitBar();
      break;
    case States.ARTSTYLE:
      updateArtStyle(video);
      checkPosition();
      if(isDrawingExitBar) drawExitBar();
      break;
    case States.SOUNDINSTRUCTION:
      if (frameCount % 30 == 0 && timer > 0) timer --;
      if (timer == 0) {
        timer = 5; 
        currentState = States.SOUND;
        setupSound();
        audioOn();
      }
      drawSoundInstruction();
      break;
    case States.VISUALINSTRUCTION:
      if (frameCount % 30 == 0 && timer > 0) timer --;
      if (timer == 0) {
        timer = 5; 
        currentState = States.VISUAL
        setupVisual(video);
      }
      drawVisualInstruction();
      break;
    case States.ARTSTYLEINSTRUCTION:
      if (frameCount % 30 == 0 && timer > 0) timer --;
      if (timer == 0) {
        timer = 5; 
        currentState = States.ARTSTYLE;
        setupArtStyle(video);
      }
      drawArtStyleInstruction();
      break;
    default:
      break;
  }
}

function checkPosition(){
  if(pose){
    if(oldPose == 0)
      oldPose = pose.nose.x
    else if(abs(oldPose - pose.nose.x) <= 10){ // pixel threshold
      poseCounter++;
      isDrawingExitBar = false;
    }
    else{
      poseCounter = 0;
      isDrawingExitBar = false;
    }

    oldPose = pose.nose.x;

    if(poseCounter > 60*2) isDrawingExitBar = true; // 2 seconds static starts countdown

    if(poseCounter == 60*4 && currentState == States.HOMESCREEN) { // 5 seconds static
      let choice = oldPose/width;
      if(choice <= 1/3) currentState = States.VISUALINSTRUCTION;
      else if(choice <= 2/3) currentState = States.SOUNDINSTRUCTION;
      else currentState = States.ARTSTYLEINSTRUCTION;
      poseCounter = 0;
      isDrawingExitBar = false;
    }

    if(poseCounter == 60*10 && (currentState == States.VISUAL || currentState == States.SOUND || currentState == States.ARTSTYLE)){
      if(currentState == States.SOUND) audioOff();
      currentState = States.HOMESCREEN;
      poseCounter = 0;
      isDrawingExitBar = false;
    }
  }
}

function drawExitBar(){
  noStroke();
  fill(255);
  if(currentState == States.HOMESCREEN)
    square(width*0.025, height*0.95, (width*0.95)*((poseCounter-(60*2))/(60*2)), height*0.015);
  else
    square(width*0.025, height*0.95, (width*0.95)*(1-((poseCounter-(60*2))/(60*8))), height*0.015);

}

function drawSplashScreen(){
  background(0);
  image(images.humansynth, width/2, height/2, images.humansynth.width*0.5, images.humansynth.height*0.5);
  image(images.slogan, width/2, height/2+height*0.1, images.slogan.width*0.5, images.slogan.height*0.5);
  image(images.credits, width/2, height/2+height*0.4, images.credits.width*0.5, images.credits.height*0.5);
}

function drawHomeScreen() {
  image(video, width/2, height/2);
  transparentLayer();
  blendMode(ADD);
  image(images.humansynth, width/2, height/2-height*0.3, images.humansynth.width*0.5, images.humansynth.height*0.5);
  image(images.visual_logo, width/6, height/2+height*0.1, images.visual_logo.width*0.45, images.visual_logo.height*0.45);
  image(images.visual_typo, width/6, height/2+height*0.35, images.visual_typo.width*0.4, images.visual_typo.height*0.4);
  image(images.sound_logo, 3*width/6, height/2+height*0.1, images.sound_logo.width*0.45, images.sound_logo.height*0.45);
  image(images.sound_typo, 3*width/6, height/2+height*0.35, images.sound_typo.width*0.4, images.sound_typo.height*0.4);
  image(images.artstyle_logo, 5*width/6, height/2+height*0.1, images.artstyle_logo.width*0.45, images.artstyle_logo.height*0.45);
  image(images.artstyle_typo, 5*width/6, height/2+height*0.35, images.artstyle_typo.width*0.4, images.artstyle_typo.height*0.4);
  blendMode(BLEND);
}

function drawSoundInstruction(){
  background(0);
  image(video, width/2, height/2);
  transparentLayer();
  blendMode(ADD);
  image(images.humansynth, width/2, height/2-height*0.45, images.humansynth.width*0.1, images.humansynth.height*0.1);
  image(images.sound_logo, width/2, height/2, images.sound_logo.width*0.65, images.sound_logo.height*0.65);
  image(images.sound_instructions, width/2, height/2+height*0.35, images.sound_instructions.width*0.5, images.sound_instructions.height*0.5);
  blendMode(BLEND);
}

function drawVisualInstruction() {
  background(0);
  image(video, width/2, height/2);
  transparentLayer();
  blendMode(ADD);
  image(images.humansynth, width/2, height/2-height*0.45, images.humansynth.width*0.1, images.humansynth.height*0.1);
  image(images.visual_logo, width/2, height/2, images.visual_logo.width*0.65, images.visual_logo.height*0.65);
  image(images.visual_instructions, width/2, height/2+height*0.35, images.visual_instructions.width*0.5, images.visual_instructions.height*0.5);
  blendMode(BLEND);
}

function drawArtStyleInstruction(){
  background(0);
  image(video, width/2, height/2);
  transparentLayer();
  blendMode(ADD);
  image(images.humansynth, width/2, height/2-height*0.45, images.humansynth.width*0.1, images.humansynth.height*0.1);
  image(images.artstyle_logo, width/2, height/2, images.artstyle_logo.width*0.65, images.artstyle_logo.height*0.65);
  image(images.artstyle_instructions, width/2, height/2+height*0.35, images.artstyle_instructions.width*0.5, images.artstyle_instructions.height*0.5);
  blendMode(BLEND);
}

function loadImages(){
  images.credits = loadImage('visuals/credits.jpg');
  images.humansynth = loadImage('visuals/humansynth.jpg');
  images.artstyle_instructions = loadImage('visuals/artstyle_instructions.jpg');
  images.artstyle_logo = loadImage('visuals/artstyle_logo.jpg');
  images.artstyle_typo = loadImage('visuals/artstyle_typo.jpg');
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
  if (loading) {
    loadingAnimation.removeClass('display-none');
  } else {
    loadingAnimation.addClass('display-none');
  }
}

function gotPoses(poses){
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log('PoseNet model loaded!');
}

function transparentLayer() {
  fill('rgba(0,0,0,0.5)');
  rect(0,0,width,height);
  noFill();
}