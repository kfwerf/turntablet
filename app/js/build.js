(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

var _AudioChannel = require('./com/codinginspace/audio/AudioChannel');

var AudioChannel = _interopRequire(_AudioChannel);

var AudioContext = window.AudioContext || window.webkitAudioContext;
var objCurrentContext = new AudioContext();

var objAudioChannel = new AudioChannel(objCurrentContext, {
  audioFile: 'http://localhost/turntablet/app/audio/demo.mp3',
  channelId: 0
});

window.objAudioChannel = objAudioChannel;

},{"./com/codinginspace/audio/AudioChannel":2}],2:[function(require,module,exports){
'use strict';

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Loader = require('../utils/Loader');

var Loader = _interopRequire(_Loader);

var _AudioFilters = require('./AudioFilters');

var AudioFilters = _interopRequire(_AudioFilters);

/**
 * @author Kenneth van der Werf
 * @class AudioChannel
 * @version 0.1
 * @description Module for creating a audio channel with effects
 * @dependencies Loader and AudioFilter
 */

var AudioChannel = (function () {
  function AudioChannel(objAudioContext) {
    var objAudioInformation = arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, AudioChannel);

    this.objAudioContext = objAudioContext;
    this.objAudioInformation = objAudioInformation;
    if (objAudioInformation) {
      this.loadAudioChannel(objAudioInformation);
    }
  }

  _createClass(AudioChannel, [{
    key: 'loadAudioChannel',
    value: function loadAudioChannel() {
      var _this = this;

      var objAudioInformation = arguments[0] === undefined ? this.objAudioInformation : arguments[0];

      this.objAudioInformation = objAudioInformation;
      /**
       * Download array buffer from file
       * Convert to audio buffer for audio context usage
       * Attach as buffer to new buffer source
       * Attach audio filters API
       */
      console.log('AudioChannel', 'Loading file ' + this.objAudioInformation.audioFile);
      new Loader(this.objAudioInformation.audioFile).then(function (arrBuffer) {
        _this.objAudioContext.decodeAudioData(arrBuffer, function (arrAudioBuffer) {
          _this.arrAudioBuffer = arrAudioBuffer;
          _this.objAudioSource = _this.objAudioContext.createBufferSource();
          _this.objAudioSource.buffer = _this.arrAudioBuffer;
          _this.objAudioFilters = new AudioFilters(_this.objAudioContext, _this.objAudioSource);
          _this.objAudioFilters.doCoupling();
          console.log('AudioChannel', 'File loaded and coupled. Audio channel is ready for usage.');
        });
      });
    }
  }, {
    key: 'setFilterValue',
    value: function setFilterValue(strFilterType, numFilterValue) {
      if (this.objAudioFilters) {
        var objFilter = this.objAudioFilters.getFilter(strFilterType);
        if (objFilter) {
          objFilter.setValue(numFilterValue);
          return objFilter;
        }
      }
    }
  }]);

  return AudioChannel;
})();

module.exports = AudioChannel;
;

},{"../utils/Loader":5,"./AudioFilters":4}],3:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * @author Kenneth van der Werf
 * @class AudioFilter
 * @version 0.1
 * @description Module for setting up an individual audio filter
 */

var AudioFilter = (function () {
  function AudioFilter(objAudioContext) {
    var strType = arguments[1] === undefined ? 'volume' : arguments[1];
    var numAmount = arguments[2] === undefined ? 0 : arguments[2];

    _classCallCheck(this, AudioFilter);

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

  _createClass(AudioFilter, [{
    key: 'setValue',
    value: function setValue() {
      var numAmount = arguments[0] === undefined ? 0 : arguments[0];

      this.numAmount = numAmount;
      if (this.strType === 'volume') {
        this.objAudio.gain.volume = numAmount;
      } else {
        this.objAudio.gain.value = numAmount;
      }
    }
  }, {
    key: 'getCore',
    value: function getCore() {
      return this.objAudio;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.objAudio.gainvalue;
    }
  }]);

  return AudioFilter;
})();

module.exports = AudioFilter;

},{}],4:[function(require,module,exports){
'use strict';

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _AudioFilter = require('./AudioFilter');

var AudioFilter = _interopRequire(_AudioFilter);

/**
 * @author Kenneth van der Werf
 * @class AudioFilters
 * @version 0.1
 * @description Module for handling multiple audio filters and coupling them
 * @dependencies AudioFilter
 */

var AudioFilters = (function () {
  function AudioFilters(objAudioContext, objAudioSource) {
    _classCallCheck(this, AudioFilters);

    this.objAudioContext = objAudioContext;
    this.objAudioSource = objAudioSource;
    this.objFilters = {
      volume: new AudioFilter(this.objAudioContext, 'volume', 1),
      gain: new AudioFilter(this.objAudioContext, 'gain', 1),
      low: new AudioFilter(this.objAudioContext, 'low', 0),
      mid: new AudioFilter(this.objAudioContext, 'mid', 0),
      high: new AudioFilter(this.objAudioContext, 'high', 0)
    };
    this.arrCouplingOrder = ['volume', 'gain', 'low', 'mid', 'high'];
  }

  _createClass(AudioFilters, [{
    key: 'doCoupling',
    value: function doCoupling() {
      var _this = this;

      var objPreviousFilter = this.objAudioSource,
          objCurrentFilter = this.getFilter(this.arrCouplingOrder[0]).getCore();
      this.arrCouplingOrder.forEach(function (strCurrentFilterType, numIndex) {
        var strPreviousFilterType = _this.arrCouplingOrder[numIndex - 1] || 'audiosource';
        if (strPreviousFilterType !== 'audiosource') {
          objCurrentFilter = _this.getFilter(strCurrentFilterType).getCore();
          objPreviousFilter = _this.getFilter(strPreviousFilterType).getCore();
        }
        console.log('AudioFilters', 'Coupling filter ' + strPreviousFilterType + ' with ' + strCurrentFilterType);
        objPreviousFilter.connect(objCurrentFilter);
      });
      objCurrentFilter.connect(this.objAudioContext.destination);
    }
  }, {
    key: 'getFilter',
    value: function getFilter() {
      var strFilterType = arguments[0] === undefined ? 'volume' : arguments[0];

      return this.objFilters[strFilterType] || {
        getValue: function getValue() {
          console.warn('AudioFilters', 'Could not get a value for ' + strFilterType);
          return 0;
        },
        setValue: function setValue(numValue) {
          console.warn('AudioFilters', 'Could not set ' + numValue + ' for ' + strFilterType);
        }
      };
    }
  }]);

  return AudioFilters;
})();

module.exports = AudioFilters;
;

},{"./AudioFilter":3}],5:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

/**
 * @author Kenneth van der Werf
 * @class Loader
 * @version 0.1
 * @description Module for loading XHR requests with promise structure
 */

var Loader = function Loader(strFile) {
  var strResponseType = arguments[1] === undefined ? 'arraybuffer' : arguments[1];
  var strSendType = arguments[2] === undefined ? 'GET' : arguments[2];

  _classCallCheck(this, Loader);

  return new Promise(function (resolve, reject) {
    var objLoader = new XMLHttpRequest();
    objLoader.open(strSendType, strFile, true);
    objLoader.responseType = strResponseType;
    objLoader.onload = function () {
      if (objLoader.response) {
        resolve(objLoader.response);
      } else {
        reject();
      }
    };
    objLoader.onerror = function () {
      reject();
    };
    objLoader.send();
  });
};

module.exports = Loader;
;

},{}]},{},[1])


//# sourceMappingURL=build.js.map