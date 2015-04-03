'use strict';

import AudioChannel from './com/codinginspace/audio/AudioChannel';

let AudioContext = window.AudioContext || window.webkitAudioContext;
let objCurrentContext = new AudioContext();

let objAudioChannel = new AudioChannel(objCurrentContext, {
  audioFile: 'http://localhost/turntablet/app/audio/demo.mp3',
  channelId: 0
});

window.objAudioChannel = objAudioChannel;
