let carrier;
let modulator;
let analyzer;

let carrierBaseFreq = 500; // the carrier frequency pre-modulation

let modMaxFreq = 200;
let modMinFreq = 0;
let modMaxDepth = 500;
let modMinDepth = 0;

let carrierFreq;
let modulationAmp;
let modulationFreq;

function setupSound() {
  carrier = new p5.Oscillator('sine');
  carrier.amp(0); // set amplitude
  carrier.freq(carrierBaseFreq); // set frequency
  carrier.start(); // start oscillating

  modulator = new p5.Oscillator('sawtooth'); // 'sine', 'square' or 'triangle'
  modulator.start();
  
  modulator.disconnect(); // add the modulator's output to modulate the carrier's frequency
  carrier.freq(modulator);

  analyzer = new p5.FFT(); // create an FFT to analyze the audio
  carrier.amp(0.0, 1.0);
}

function updateSound(pose, video) {
  if(pose){
  carrier.amp(1.0, 0.01);

    carrierFreq = map(pose.leftWrist.y, 0, video.height, modMinFreq, modMaxFreq);
    modulationAmp = map(pose.rightWrist.y, 0, video.height, modMinDepth, modMaxDepth);
    modulationFreq = map(pose.nose.x, 0, video.width, 100, 2500);
  
    carrier.freq(carrierFreq);
    modulator.freq(modulationFreq);
    modulator.amp(modulationAmp);

    waveform = analyzer.waveform(); // analyze the waveform

    // draw the shape of the waveform
    noFill();
    stroke(255);
    strokeWeight(5);
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i], -1, 1, -height / 7, height / 7);
      vertex(x, y + height / 2);
    }
    endShape();

    // adds text with waveform info
    strokeWeight(1);
    fill(50);
    textSize(15);
    noStroke();
    text('mod frequency: ' + parseInt(modulationFreq) + ' Hz' + '\n'
       + 'mod amplitude: ' + parseInt(modulationAmp) + '\n'
       + 'carrier frequency: ' + parseInt(carrierFreq) + ' Hz', 20, 20);
  }
}

function audioOn(){
  carrier.amp(1.0, 0.01);
}

function audioOff(){
  carrier.amp(0.0, 1.0);
}