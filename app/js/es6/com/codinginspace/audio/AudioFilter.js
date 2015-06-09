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

    switch (strType) {
    case 'volume':
      this.objAudio = this.objAudioContext.createGain();
      this.objAudio.gain.value = numAmount;
      break;
    case 'gain':
      this.objAudio = this.objAudioContext.createGain();
      this.objAudio.gain.value = numAmount;
      break;
    case 'low':
      this.objAudio = this.objAudioContext.createBiquadFilter();
      this.objAudio.type = 'lowshelf';
      this.objAudio.frequency.value = 500;
      this.objAudio.gain.value = numAmount;
      break;
    case 'mid':
      this.objAudio = this.objAudioContext.createBiquadFilter();
      this.objAudio.type = 'peaking';
      this.objAudio.frequency.value = 750;
      this.objAudio.gain.value = numAmount;
      break;
    case 'high':
      this.objAudio = this.objAudioContext.createBiquadFilter();
      this.objAudio.type = 'highshelf';
      this.objAudio.frequency.value = 1000;
      this.objAudio.gain.value = numAmount;
      break;
    }

  }
  get filterType() {
    return this.strType;
  }
  get filterObject() {
    return this.objAudio;
  }
  set filterValue(numAmount = 0) {
    let strKey = 'value';
    this.objAudio.gain[strKey] = numAmount;
  }
  get filterValue() {
    let strKey = 'value';
    return this.objAudio.gain[strKey];
  }
}
