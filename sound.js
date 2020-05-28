let carrier;
let modulator;
let analyzer;

let carrierBaseFreq = 220; // the carrier frequency pre-modulation

let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 150;
let modMinDepth = -150;

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
  carrier.amp(1.0, 0.01); // toggle audio on
}

function updateSound(pose, video) {
  if(pose){
    carrierFreq = map(pose.leftWrist.y, 0, video.height, modMinFreq, modMaxFreq);
    modulationAmp = map(pose.rightWrist.y, 0, video.height, modMinDepth, modMaxDepth);
    modulationFreq = map(pose.nose.x, 0, video.width, 220, 12000);
  }

  carrier.freq(carrierFreq);
  modulator.freq(modulationFreq);
  modulator.amp(modulationAmp);

  waveform = analyzer.waveform(); // analyze the waveform

  // draw the shape of the waveform
  noFill();
  stroke(255);
  strokeWeight(10);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, -height / 2, height / 2);
    vertex(x, y + height / 2);
  }
  endShape();

  // adds text with waveform info
  if(pose){
    strokeWeight(1);
    text('Modulator Frequency: ' + modulationFreq.toFixed(3) + ' Hz', 20, 20);
    text('Modulator Amplitude (Modulation Depth): ' + modulationAmp.toFixed(3), 20, 40);
    text('Carrier Frequency (pre-modulation): ' + carrierFreq + ' Hz', width / 2, 20);
  }
}