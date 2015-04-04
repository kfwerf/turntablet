'use strict';

import AudioMixer from './com/codinginspace/audio/AudioMixer';

let AudioContext = window.AudioContext || window.webkitAudioContext;
let objCurrentContext = new AudioContext();

let objAudioMixer = new AudioMixer();

objAudioMixer.getAudioChannelById(0).loadAudioChannel({
  audioFile: 'audio/demo.mp3'
});

window.objAudioMixer = objAudioMixer;
