'use strict';

import AudioMixer from './com/codinginspace/audio/AudioMixer';

let AudioContext = window.AudioContext || window.webkitAudioContext;
let objCurrentContext = new AudioContext();

let objAudioMixer = new AudioMixer();

let audioChannel = document.querySelector('.audiochannel');
let numChannel = 0;

let objAudioChannel = {
  audioChannel: audioChannel,
  turntablePlatter: audioChannel.querySelector('turntable-platter'),
  songLabel: audioChannel.querySelector('.song'),
  playButton: audioChannel.querySelector('.play-button'),
  cueButton: audioChannel.querySelector('.cue-button'),
  pitchSlider: audioChannel.querySelector('slider-input[name="pitch"]'),
  lowSlider: audioChannel.querySelector('slider-input[name="low"]'),
  midSlider: audioChannel.querySelector('slider-input[name="mid"]'),
  highSlider: audioChannel.querySelector('slider-input[name="high"]'),
  gainSlider: audioChannel.querySelector('slider-input[name="gain"]'),
  volumeSlider: audioChannel.querySelector('slider-input[name="volume"]')
};

let onClick = function() {
  objAudioMixer
    .getAudioChannelById(numChannel)
    .playChannel();
};

objAudioChannel.playButton.addEventListener('click', onClick);
