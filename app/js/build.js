(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _comCodinginspaceAudioAudioMixer = require('./com/codinginspace/audio/AudioMixer');

var _comCodinginspaceAudioAudioMixer2 = _interopRequireDefault(_comCodinginspaceAudioAudioMixer);

/**
 * @author Kenneth van der Werf
 * @class AudioMixerViewChannel
 * @version 0.1
 * @description Bridge between turntable GUI and web audio mixer
 * @dependencies AudioMixerViewController, AudioMixer
 */

var AudioMixerViewChannel = (function () {
  /**
   * @param {Object} objAudioMixerModel Audio mixer that connects to web audio
   * @param {Object} objAudioContext Audio context instantiated for web audio
   * @param {Number} numChannel The channel number that we use for the model
   * @param {String} strClass The CSS class that refers to the parent element
   */

  function AudioMixerViewChannel(objAudioMixerModel, objAudioContext, numChannel, strClass) {
    _classCallCheck(this, AudioMixerViewChannel);

    this.objAudioMixerModel = objAudioMixerModel;
    this.objAudioContext = objAudioContext;
    this.numChannel = numChannel;

    this.doGuiElementBinding(strClass);
    this.doGuiEventBinding();
  }

  _createClass(AudioMixerViewChannel, [{
    key: 'doGuiElementBinding',
    value: function doGuiElementBinding(strClass) {
      var audioChannel = document.querySelector(strClass);
      this.objGui = {
        audioChannel: audioChannel,
        turntablePlatter: audioChannel.querySelector('turntable-platter'),
        songLabel: audioChannel.querySelector('.song'),
        playButton: audioChannel.querySelector('.play-button'),
        cueButton: audioChannel.querySelector('.cue-button'),
        pitchSlider: audioChannel.querySelector('slider-input[name="pitch"]'),
        lowSlider: audioChannel.querySelector('slider-input[name="low"]'),
        midSlider: audioChannel.querySelector('slider-input[name="mid"]'),
        highSlider: audioChannel.querySelector('slider-input[name="high"]'),
        gainSlider: audioChannel.querySelector('slider-input[name="gain"]'),
        volumeSlider: audioChannel.querySelector('slider-input[name="volume"]')
      };
    }
  }, {
    key: 'doGuiEventUnbinding',
    value: function doGuiEventUnbinding() {
      this.objGui.playButton.removeEventListener('click', this.doPlay);
    }
  }, {
    key: 'doGuiEventBinding',
    value: function doGuiEventBinding() {
      this.doGuiEventUnbinding();
      this.objGui.playButton.addEventListener('click', this.doPlay.bind(this));
    }
  }, {
    key: 'doPlay',
    value: function doPlay() {
      this.objAudioMixerModel.getAudioChannelById(this.numChannel).playChannel();
    }
  }]);

  return AudioMixerViewChannel;
})();

/**
 * @author Kenneth van der Werf
 * @class AudioMixerViewController
 * @version 0.1
 * @description Bridge between model and user interface
 * @dependencies AudioMixer
 */

var AudioMixerViewController = (function () {
  function AudioMixerViewController() {
    _classCallCheck(this, AudioMixerViewController);

    this.objAudioMixerModel = new _comCodinginspaceAudioAudioMixer2['default']();
    this.objAudioContext = new this.audioContext();

    var channelOne = new AudioMixerViewChannel(this.objAudioMixerModel, this.objAudioContext, 0, '.audiochannel');
    window.channel = channelOne;
  }

  _createClass(AudioMixerViewController, [{
    key: 'audioContext',
    get: function () {
      return window.AudioContext || window.webkitAudioContext;
    }
  }]);

  return AudioMixerViewController;
})();

var objAudioMixerViewController = new AudioMixerViewController();

},{"./com/codinginspace/audio/AudioMixer":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsLoader = require('../utils/Loader');

var _utilsLoader2 = _interopRequireDefault(_utilsLoader);

var _AudioFilters = require('./AudioFilters');

var _AudioFilters2 = _interopRequireDefault(_AudioFilters);

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
    this.objAudioFilters = new _AudioFilters2['default'](this.objAudioContext);
    this.boolLoading = false;
    this.numStartPoint = 0;
    this.numPitch = 0;
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
      this.boolLoading = true;
      /**
       * Download array buffer from file
       * Convert to audio buffer for audio context usage
       */
      console.log('com.codinginspace.audio.AudioChannel', 'Loading file ' + this.objAudioInformation.audioFile);
      new _utilsLoader2['default'](this.objAudioInformation.audioFile).then(function (arrBuffer) {
        _this.objAudioContext.decodeAudioData(arrBuffer, function (arrAudioBuffer) {
          _this.boolLoading = false;
          _this.arrAudioBuffer = arrAudioBuffer;
          _this.initAudioSource();
        });
      });
    }
  }, {
    key: 'initAudioSource',
    value: function initAudioSource() {
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
  }, {
    key: 'setFilterValueByType',
    value: function setFilterValueByType(strType, numValue) {
      this.objAudioFilters.setFilterValueByType(strType, numValue);
    }
  }, {
    key: 'getFilterValueByType',
    value: function getFilterValueByType(strType) {
      return this.objAudioFilters.getFilterValueByType(strType);
    }
  }, {
    key: 'volumeValue',
    get: function () {
      return this.getFilterValueByType('volume');
    },
    set: function (numValue) {
      this.setFilterValueByType('volume', numValue);
    }
  }, {
    key: 'gainValue',
    get: function () {
      return this.getFilterValueByType('gain');
    },
    set: function (numValue) {
      this.setFilterValueByType('gain', numValue);
    }
  }, {
    key: 'lowValue',
    get: function () {
      return this.getFilterValueByType('low');
    },
    set: function (numValue) {
      this.setFilterValueByType('low', numValue);
    }
  }, {
    key: 'midValue',
    get: function () {
      return this.getFilterValueByType('mid');
    },
    set: function (numValue) {
      this.setFilterValueByType('mid', numValue);
    }
  }, {
    key: 'highValue',
    get: function () {
      return this.getFilterValueByType('high');
    },
    set: function (numValue) {
      this.setFilterValueByType('high', numValue);
    }
  }, {
    key: 'pitchValue',
    set: function (numValue) {
      this.numPitch = (100 + Number(numValue)) / 100;
      if (this.objAudioSource) {
        this.objAudioSource.playbackRate.value = this.numPitch;
      }
    },
    get: function () {
      return this.numPitch;
    }
  }, {
    key: 'playChannel',
    value: function playChannel() {
      var numStartPoint = arguments[0] === undefined ? this.numStartPoint : arguments[0];

      if (this.objAudioSource) {
        if (this.boolPlaying) {
          this.stopChannel();
        }
        if (this.numPitch) {
          this.pitchValue = numPitch;
        }
        this.objAudioSource.start(0, numStartPoint);
        this.boolPlaying = true;
      } else {
        console.info('No audio source available for playback');
      }
    }
  }, {
    key: 'cueChannel',
    value: function cueChannel() {
      this.arrCuePoints = this.arrCuePoints || [];
      this.arrCuePoint.push(this.objAudioSource.context.currentTime);
    }
  }, {
    key: 'pauseChannel',
    value: function pauseChannel() {
      this.numStartPoint = this.objAudioSource.context.currentTime;
      this.stopChannel();
    }
  }, {
    key: 'stopChannel',
    value: function stopChannel() {
      if (this.objAudioSource) {
        this.objAudioSource.stop();
        this.initAudioSource();
        this.boolPlaying = false;
      }
    }
  }]);

  return AudioChannel;
})();

exports['default'] = AudioChannel;
;
module.exports = exports['default'];

},{"../utils/Loader":6,"./AudioFilters":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

    switch (strType) {
      case 'volume':
        this.objAudio = this.objAudioContext.createGain();
        this.objAudio.gain.volume = numAmount;
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

  _createClass(AudioFilter, [{
    key: 'filterType',
    get: function () {
      return this.strType;
    }
  }, {
    key: 'filterObject',
    get: function () {
      return this.objAudio;
    }
  }, {
    key: 'filterValue',
    set: function () {
      var numAmount = arguments[0] === undefined ? 0 : arguments[0];

      var strKey = this.strType === 'volume' ? 'volume' : 'value';
      this.objAudio.gain[strKey] = numAmount;
    },
    get: function () {
      var strKey = this.strType === 'volume' ? 'volume' : 'value';
      return this.objAudio.gain[strKey];
    }
  }]);

  return AudioFilter;
})();

exports['default'] = AudioFilter;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _AudioFilter = require('./AudioFilter');

var _AudioFilter2 = _interopRequireDefault(_AudioFilter);

/**
 * @author Kenneth van der Werf
 * @class AudioFilters
 * @version 0.1
 * @description Module for handling multiple audio filters and coupling them
 * @dependencies AudioFilter
 */

var AudioFilters = (function () {
  function AudioFilters(objAudioContext) {
    var objAudioSource = arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, AudioFilters);

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
      volume: new _AudioFilter2['default'](this.objAudioContext, 'volume', this.objFilterValues.volume),
      gain: new _AudioFilter2['default'](this.objAudioContext, 'gain', this.objFilterValues.gain),
      low: new _AudioFilter2['default'](this.objAudioContext, 'low', this.objFilterValues.low),
      mid: new _AudioFilter2['default'](this.objAudioContext, 'mid', this.objFilterValues.mid),
      high: new _AudioFilter2['default'](this.objAudioContext, 'high', this.objFilterValues.high)
    };
    this.arrCouplingOrder = ['volume', 'gain', 'low', 'mid', 'high'];
  }

  _createClass(AudioFilters, [{
    key: 'getFilterByType',
    value: function getFilterByType(strType) {
      return this.objFilters[strType];
    }
  }, {
    key: 'getFilterObjectbyType',
    value: function getFilterObjectbyType(strType) {
      return this.getFilterByType(strType).filterObject;
    }
  }, {
    key: 'setFilterValueByType',
    value: function setFilterValueByType(strType, numValue) {
      this.getFilterByType(strType).filterValue = numValue;
    }
  }, {
    key: 'getFilterValueByType',
    value: function getFilterValueByType(strType, numValue) {
      return this.getFilterByType(strType).filterValue;
    }
  }, {
    key: 'doCoupling',
    value: function doCoupling() {
      var _this = this;

      if (!this.objAudioSource) {
        throw Error('com.codinginspace.audio.AudioFilters', 'Audio Source is missing, cannot couple without a source.');
      }
      var objPreviousFilter = this.objAudioSource,
          objCurrentFilter = this.getFilterObjectbyType(this.arrCouplingOrder[0]);
      this.arrCouplingOrder.forEach(function (strCurrentFilterType, numIndex) {
        var strPreviousFilterType = _this.arrCouplingOrder[numIndex - 1] || 'audiosource';
        if (strPreviousFilterType !== 'audiosource') {
          objCurrentFilter = _this.getFilterObjectbyType(strCurrentFilterType);
          objPreviousFilter = _this.getFilterObjectbyType(strPreviousFilterType);
        }
        console.log('com.codinginspace.audio.AudioFilters', 'Coupling filter ' + strPreviousFilterType + ' with ' + strCurrentFilterType);
        objPreviousFilter.connect(objCurrentFilter);
      });
      objCurrentFilter.connect(this.objAudioContext.destination);
    }
  }]);

  return AudioFilters;
})();

exports['default'] = AudioFilters;
;
module.exports = exports['default'];

},{"./AudioFilter":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _AudioChannel = require('./AudioChannel');

var _AudioChannel2 = _interopRequireDefault(_AudioChannel);

/**
 * @author Kenneth van der Werf
 * @class AudioMixer
 * @version 0.1
 * @description Module for bundling channels and adding a crossfader
 * @dependencies AudioChannel
 */

var AudioMixer = (function () {
  function AudioMixer() {
    var numChannels = arguments[0] === undefined ? 2 : arguments[0];

    _classCallCheck(this, AudioMixer);

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.objAudioContext = new AudioContext();
    this.arrChannels = [];

    this.createAudioChannels(numChannels);
  }

  _createClass(AudioMixer, [{
    key: 'getAudioChannelById',
    value: function getAudioChannelById(numId) {
      return this.arrChannels[numId];
    }
  }, {
    key: 'createAudioChannels',
    value: function createAudioChannels(numChannels) {
      for (var i = 0; i < numChannels; i++) {
        this.createAudioChannel();
      }
    }
  }, {
    key: 'createAudioChannel',
    value: function createAudioChannel() {
      this.arrChannels.push(new _AudioChannel2['default'](this.objAudioContext));
    }
  }]);

  return AudioMixer;
})();

exports['default'] = AudioMixer;
module.exports = exports['default'];

},{"./AudioChannel":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

exports['default'] = Loader;
;
module.exports = exports['default'];

},{}]},{},[1])


//# sourceMappingURL=build.js.map