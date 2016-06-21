'use strict';

import Loader from '../utils/Loader';
import AudioFilters from './AudioFilters';

/**
 * @author Kenneth van der Werf
 * @class AudioChannel
 * @version 0.1
 * @description Module for creating a audio channel with effects
 * @dependencies Loader and AudioFilter
 */
export default class AudioChannel {
  constructor(objAudioContext, objAudioInformation = false) {
    this.objAudioContext = objAudioContext;
    this.objAudioInformation = objAudioInformation;
    this.objAudioFilters = new AudioFilters(this.objAudioContext);
    this.boolLoading = false;
    this.numStartPoint = 0;
    this.numPitch = 0;
    if (objAudioInformation) {
      this.loadAudioChannel(objAudioInformation);
    }
  }
  loadAudioChannelFromXhr(objAudioInformation = this.objAudioInformation) {
    this.objAudioInformation = objAudioInformation;
    this.boolLoading = true;
    /**
     * Download array buffer from file
     * Convert to audio buffer for audio context usage
     */
    console.log('com.codinginspace.audio.AudioChannel', `Loading XHR ${this.objAudioInformation.audioFile}`);
    new Loader(this.objAudioInformation.audioFile)
      .then((arrBuffer) => {
        this.objAudioContext
          .decodeAudioData(arrBuffer, (arrAudioBuffer) => {
            this.boolLoading = false;
            this.arrAudioBuffer = arrAudioBuffer;
            this.initAudioSource();
          });
      });
  }
  loadAudioChannelFromFile(objAudioInformation = this.objAudioInformation) {
    this.objAudioInformation = objAudioInformation;
    this.boolLoading = true;
    /**
     * Use reader to create array buffer
     * Should be loaded via File API e.g input[type="file"]
     * Process file into reader for array buffer result
     */
    console.log('com.codinginspace.audio.AudioChannel', `Loading File ${this.objAudioInformation.audioFile.name}`);
    let reader = new FileReader();
    console.log(this.objAudioInformation);
    reader.readAsArrayBuffer(this.objAudioInformation.audioFile);
    reader.onload = function() {
      this.objAudioContext
        .decodeAudioData(reader.result, (arrAudioBuffer) => {
          this.boolLoading = false;
          this.arrAudioBuffer = arrAudioBuffer;
          this.initAudioSource();
        });
    }.bind(this);
  }
  initAudioSource() {
    /**
     * NOTE AudioSources can only be used once
     * To reuse after a stop we have to re-init the audioSource
     */
    this.objAudioSource = this.objAudioContext.createBufferSource();
    this.objAudioSource.buffer = this.arrAudioBuffer;
    this.objAudioFilters.objAudioSource = this.objAudioSource;
    this.objAudioFilters.doCoupling();
    console.log('com.codinginspace.audio.AudioChannel', 'File loaded and coupled. Audio channel is ready for usage.');
  }
  setFilterValueByType(strType, numValue) {
    this.objAudioFilters.setFilterValueByType(strType, numValue);
  }
  getFilterValueByType(strType) {
    return this.objAudioFilters.getFilterValueByType(strType);
  }
  get isPlaying () {
    return this.boolPlaying;
  }
  get volumeValue () {
    return this.getFilterValueByType('volume');
  }
  set volumeValue (numValue) {
    this.setFilterValueByType('volume', numValue);
  }
  get gainValue () {
    return this.getFilterValueByType('gain');
  }
  set gainValue (numValue) {
    this.setFilterValueByType('gain', numValue);
  }
  get lowValue () {
    return this.getFilterValueByType('low');
  }
  set lowValue (numValue) {
    this.setFilterValueByType('low', numValue);
  }
  get midValue () {
    return this.getFilterValueByType('mid');
  }
  set midValue (numValue) {
    this.setFilterValueByType('mid', numValue);
  }
  get highValue () {
    return this.getFilterValueByType('high');
  }
  set highValue (numValue) {
    this.setFilterValueByType('high', numValue);
  }
  set pitchValue (numValue) {
    this.numPitch = (100 + Number(numValue)) / 100;
    if (this.objAudioSource) {
      this.objAudioSource.playbackRate.value = this.numPitch;
    }
  }
  get pitchValue () {
    return this.numPitch;
  }
  playChannel (numStartPoint = this.numStartPoint) {
    if (this.objAudioSource) {
      if (this.boolPlaying) {
        this.stopChannel();
        return false; // If playing we toggle, cue we play when pressed
      }
      if (this.numPitch) {
        this.pitchValue = this.numPitch;
      }
      this.objAudioSource.start(0, numStartPoint);
      this.boolPlaying = true;
      console.log('com.codinginspace.audio.AudioChannel', 'Playing audio');
    } else {
      console.info('No audio source available for playback');
    }
  }
  cueChannel() {
    this.arrCuePoints = this.arrCuePoints || [];
    this.arrCuePoint.push(this.objAudioSource.context.currentTime);
  }
  pauseChannel() {
    this.numStartPoint = this.objAudioSource.context.currentTime;
    this.stopChannel();
    console.log('com.codinginspace.audio.AudioChannel', 'Pausing audio');
  }
  stopChannel () {
    if (this.objAudioSource) {
      this.objAudioSource.stop();
      this.initAudioSource();
      this.boolPlaying = false;
      console.log('com.codinginspace.audio.AudioChannel', 'Stopping audio');
    }
  }
};
