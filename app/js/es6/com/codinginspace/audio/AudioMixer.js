'use strict';

import AudioChannel from './AudioChannel';

/**
 * @author Kenneth van der Werf
 * @class AudioMixer
 * @version 0.1
 * @description Module for bundling channels and adding a crossfader
 * @dependencies AudioChannel
 */
export default class AudioMixer {
  constructor(numChannels = 2) {
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.objAudioContext = new AudioContext();
    this.arrChannels = [];

    this.createAudioChannels(numChannels);
  }
  getAudioChannelById(numId) {
    return this.arrChannels[numId];
  }
  createAudioChannels(numChannels) {
    for (var i = 0; i < numChannels; i++) {
      this.createAudioChannel();
    }
  }
  createAudioChannel() {
    this.arrChannels.push(new AudioChannel(this.objAudioContext));
  }
}
