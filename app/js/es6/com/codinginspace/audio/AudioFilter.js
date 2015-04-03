'use strict';

/**
 * @author Kenneth van der Werf
 * @class AudioFilter
 * @version 0.1
 * @description Module for setting up an individual audio filter
 */
export default class AudioFilter {
  constructor(objAudioContext, strType = 'volume', numAmount = 0) {
    this.objAudioContext = objAudioContext;
    this.strType = strType;
    this.numAmount = numAmount;

    switch (strType) {
    case 'volume':
      this.objAudio = this.objAudioContext.createGain();
      this.objAudio.gain.volume = this.numAmount;
      break;
    case 'gain':
      this.objAudio = this.objAudioContext.createGain();
      this.objAudio.gain.value = this.numAmount;
      break;
    case 'low':
      this.objAudio = this.objAudioContext.createBiquadFilter();
      this.objAudio.type = 'lowshelf';
      this.objAudio.frequency.value = 500;
      this.objAudio.gain.value = this.numAmount;
      break;
    case 'mid':
      this.objAudio = this.objAudioContext.createBiquadFilter();
      this.objAudio.type = 'peaking';
      this.objAudio.frequency.value = 750;
      this.objAudio.gain.value = this.numAmount;
      break;
    case 'high':
      this.objAudio = this.objAudioContext.createBiquadFilter();
      this.objAudio.type = 'highshelf';
      this.objAudio.frequency.value = 1000;
      this.objAudio.gain.value = this.numAmount;
      break;
    }
  }
  setValue(numAmount = 0) {
    this.numAmount = numAmount;
    if (this.strType === 'volume') {
      this.objAudio.gain.volume = numAmount;
    } else {
      this.objAudio.gain.value = numAmount;
    }
  }
  getCore() {
    return this.objAudio;
  }
  getValue() {
    return this.objAudio.gainvalue;
  }
}
