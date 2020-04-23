let carrier;
let modulator;
let analyzer;

let carrierBaseFreq = 220; // the carrier frequency pre-modulation

let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 150;
let modMinDepth = -150;

function setupSound(canvas) {
  carrier = new p5.Oscillator('sine');
  carrier.amp(0); // set amplitude
  carrier.freq(carrierBaseFreq); // set frequency
  carrier.start(); // start oscillating

  modulator = new p5.Oscillator('sine'); // 'square' or 'triangle'
  modulator.start();

  modulator.disconnect(); // add the modulator's output to modulate the carrier's frequency
  carrier.freq(modulator);

  analyzer = new p5.FFT(); // create an FFT to analyze the audio

  carrier.amp(1.0, 0.01); // toggle audio on
}

function updateSound() {
  let modFreq = map(mouseY, height, 0, modMinFreq, modMaxFreq);
  modulator.freq(modFreq);

  // change the amplitude of the modulator
  // negative amp reverses the sawtooth waveform, and sounds percussive
  let modDepth = map(mouseX, 0, width, modMinDepth, modMaxDepth);
  modulator.amp(modDepth);

  waveform = analyzer.waveform(); // analyze the waveform

  // draw the shape of the waveform
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
  strokeWeight(1);
  text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
  text('Modulator Amplitude (Modulation Depth): ' + modDepth.toFixed(3), 20, 40);
  text('Carrier Frequency (pre-modulation): ' + carrierBaseFreq + ' Hz', width / 2, 20);
}