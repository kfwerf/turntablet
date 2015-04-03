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
    if (objAudioInformation) {
      this.loadAudioChannel(objAudioInformation);
    }
  }
  loadAudioChannel(objAudioInformation = this.objAudioInformation) {
    this.objAudioInformation = objAudioInformation;
    /**
     * Download array buffer from file
     * Convert to audio buffer for audio context usage
     * Attach as buffer to new buffer source
     * Attach audio filters API
     */
    console.log('AudioChannel', `Loading file ${this.objAudioInformation.audioFile}`);
    new Loader(this.objAudioInformation.audioFile)
      .then((arrBuffer) => {
        this.objAudioContext
          .decodeAudioData(arrBuffer, (arrAudioBuffer) => {
            this.arrAudioBuffer = arrAudioBuffer;
            this.objAudioSource = this.objAudioContext.createBufferSource();
            this.objAudioSource.buffer = this.arrAudioBuffer;
            this.objAudioFilters = new AudioFilters(
              this.objAudioContext, this.objAudioSource
            );
            this.objAudioFilters.doCoupling();
            console.log('AudioChannel', 'File loaded and coupled. Audio channel is ready for usage.');
          });
      });
  }
  setFilterValue(strFilterType, numFilterValue) {
    if (this.objAudioFilters) {
      let objFilter = this.objAudioFilters.getFilter(strFilterType)
      if (objFilter) {
        objFilter.setValue(numFilterValue);
        return objFilter;
      }
    }
  }
};
