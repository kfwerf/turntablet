'use strict';

import AudioFilter from './AudioFilter';

/**
 * @author Kenneth van der Werf
 * @class AudioFilters
 * @version 0.1
 * @description Module for handling multiple audio filters and coupling them
 * @dependencies AudioFilter
 */
export default class AudioFilters {
  constructor(objAudioContext, objAudioSource = false) {
    this.objAudioContext = objAudioContext;
    this.objAudioSource = objAudioSource;
    // TODO Might want to remove this later, serves no purpose now
    this.objFilterValues = {
      volume: 1,
      gain: 1,
      low: 0,
      mid: 0,
      high: 0
    };
    this.objFilters = {
      volume: new AudioFilter(this.objAudioContext, 'volume', this.objFilterValues.volume),
      gain: new AudioFilter(this.objAudioContext, 'gain', this.objFilterValues.gain),
      low: new AudioFilter(this.objAudioContext, 'low', this.objFilterValues.low),
      mid: new AudioFilter(this.objAudioContext, 'mid', this.objFilterValues.mid),
      high: new AudioFilter(this.objAudioContext, 'high', this.objFilterValues.high)
    };
    this.arrCouplingOrder = [
      'volume',
      'gain',
      'low',
      'mid',
      'high'
    ];
  }
  getFilterByType (strType) {
    return this.objFilters[strType];
  }
  getFilterObjectbyType (strType) {
    return this.getFilterByType(strType).filterObject;
  }
  setFilterValueByType (strType, numValue) {
    this.getFilterByType(strType).filterValue = numValue;
  }
  getFilterValueByType (strType, numValue) {
    return this.getFilterByType(strType).filterValue;
  }
  doCoupling () {
    if (!this.objAudioSource) {
      throw Error('com.codinginspace.audio.AudioFilters', 'Audio Source is missing, cannot couple without a source.');
    }
    var objPreviousFilter = this.objAudioSource,
      objCurrentFilter = this.getFilterObjectbyType(this.arrCouplingOrder[0]);
    this.arrCouplingOrder.forEach( (strCurrentFilterType, numIndex) => {
      let strPreviousFilterType = this.arrCouplingOrder[numIndex - 1] || 'audiosource';
      if (strPreviousFilterType !== 'audiosource') {
        objCurrentFilter = this.getFilterObjectbyType(strCurrentFilterType);
        objPreviousFilter = this.getFilterObjectbyType(strPreviousFilterType);
      }
      console.log('com.codinginspace.audio.AudioFilters', `Coupling filter ${strPreviousFilterType} with ${strCurrentFilterType}`);
      objPreviousFilter.connect(objCurrentFilter);
    });
    objCurrentFilter.connect(this.objAudioContext.destination);
  }
};
