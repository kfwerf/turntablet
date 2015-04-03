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
  constructor(objAudioContext, objAudioSource) {
    this.objAudioContext = objAudioContext;
    this.objAudioSource = objAudioSource;
    this.objFilters = {
      volume: new AudioFilter(this.objAudioContext, 'volume', 1),
      gain: new AudioFilter(this.objAudioContext, 'gain', 1),
      low: new AudioFilter(this.objAudioContext, 'low', 0),
      mid: new AudioFilter(this.objAudioContext, 'mid', 0),
      high: new AudioFilter(this.objAudioContext, 'high', 0)
    };
    this.arrCouplingOrder = [
      'volume',
      'gain',
      'low',
      'mid',
      'high'
    ];
  }
  doCoupling() {
    var objPreviousFilter = this.objAudioSource,
      objCurrentFilter = this.getFilter(this.arrCouplingOrder[0]).getCore();
    this.arrCouplingOrder.forEach( (strCurrentFilterType, numIndex) => {
      let strPreviousFilterType = this.arrCouplingOrder[numIndex - 1] || 'audiosource';
      if (strPreviousFilterType !== 'audiosource') {
        objCurrentFilter = this.getFilter(strCurrentFilterType).getCore();
        objPreviousFilter = this.getFilter(strPreviousFilterType).getCore();
      }
      console.log('AudioFilters', `Coupling filter ${strPreviousFilterType} with ${strCurrentFilterType}`);
      objPreviousFilter.connect(objCurrentFilter);
    });
    objCurrentFilter.connect(this.objAudioContext.destination);
  }
  getFilter(strFilterType = 'volume') {
    return this.objFilters[strFilterType] || {
      getValue: function  () {
        console.warn('AudioFilters', `Could not get a value for ${strFilterType}`);
        return 0;
      },
      setValue: function (numValue) {
        console.warn('AudioFilters', `Could not set ${numValue} for ${strFilterType}`);
      }
    };
  }
};
