(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Initializer boilerplate

var _AudioMixerViewController = require('./AudioMixerViewController');

var _AudioMixerViewController2 = _interopRequireDefault(_AudioMixerViewController);

var objAudioMixerViewController = new _AudioMixerViewController2['default']();

},{"./AudioMixerViewController":3}],2:[function(require,module,exports){
/**
 * @author Kenneth van der Werf
 * @class AudioChannelViewController
 * @version 0.1
 * @description Bridge between turntable GUI and web audio mixer
 * @dependencies AudioMixerViewController, AudioMixer
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AudioChannelViewController = (function () {
  /**
   * @param {Object} objAudioMixerModel Audio mixer that connects to web audio
   * @param {Object} objAudioContext Audio context instantiated for web audio
   * @param {Number} numChannel The channel number that we use for the model
   * @param {String} strClass The CSS class that refers to the parent element
   */

  function AudioChannelViewController(objAudioMixerModel, objAudioContext, numChannel, strClass) {
    _classCallCheck(this, AudioChannelViewController);

    this.objAudioMixerModel = objAudioMixerModel;
    this.objAudioContext = objAudioContext;
    this.numChannel = numChannel;

    this.doGuiElementBinding(strClass);
    this.doGuiEventBinding();
  }

  _createClass(AudioChannelViewController, [{
    key: 'objAudioChannelModel',
    get: function () {
      return this.objAudioMixerModel.getAudioChannelById(this.numChannel);
    }
  }, {
    key: 'doGuiElementBinding',
    value: function doGuiElementBinding(strClass) {
      var audioChannel = document.querySelector(strClass);
      this.objGui = {
        audioChannel: audioChannel,
        turntablePlatter: audioChannel.querySelector('turntable-platter'),
        songLabel: audioChannel.querySelector('audio-input[type="song"]'),
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
      var _this = this;

      var doBasicValueCoupling = function doBasicValueCoupling(strWatchGui, strBindValue) {
        var objWatch = _this.objGui[strWatchGui];
        Object.observe(objWatch, function () {
          var numValue = objWatch.value;
          _this.objAudioChannelModel[strBindValue] = numValue;
        });
      };
      this.doGuiEventUnbinding();
      // Couples file selection with core for loading via observing
      Object.observe(this.objGui.songLabel, function () {
        var objFile = _this.objGui.songLabel.file;
        if (objFile.name) {
          _this.doLoadAudioFromFile({
            audioFile: objFile
          });
        }
      });

      doBasicValueCoupling('volumeSlider', 'volumeValue');
      doBasicValueCoupling('lowSlider', 'lowValue');
      doBasicValueCoupling('midSlider', 'midValue');
      doBasicValueCoupling('highSlider', 'highValue');
      doBasicValueCoupling('pitchSlider', 'pitchValue');

      this.objGui.playButton.addEventListener('mousedown', this.doPlay.bind(this));
      this.objGui.playButton.addEventListener('mousedown', this.onPlayState.bind(this));
      this.objGui.playButton.addEventListener('mouseup', this.onPlayState.bind(this));

      this.objGui.cueButton.addEventListener('mousedown', this.doCue.bind(this));
      this.objGui.cueButton.addEventListener('mouseup', this.doCue.bind(this));
      this.objGui.cueButton.addEventListener('mousedown', this.onCueState.bind(this));
      this.objGui.cueButton.addEventListener('mouseup', this.onCueState.bind(this));
    }
  }, {
    key: 'doLoadAudioFromFile',
    value: function doLoadAudioFromFile(objFile) {
      this.objAudioChannelModel.loadAudioChannelFromFile(objFile);
    }
  }, {
    key: 'onCueState',
    value: function onCueState() {
      if (this.objAudioChannelModel.isPlaying) {
        this.objGui.cueButton.classList.add('active');
      } else {
        this.objGui.cueButton.classList.remove('active');
      }
    }
  }, {
    key: 'onPlayState',
    value: function onPlayState() {
      if (this.objAudioChannelModel.isPlaying) {
        this.objGui.playButton.classList.add('active');
      } else {
        this.objGui.playButton.classList.remove('active');
      }
    }
  }, {
    key: 'doCue',
    value: function doCue() {
      if (this.objAudioChannelModel.isPlaying) {
        this.objAudioChannelModel.playChannel();
      } else {
        this.objAudioChannelModel.stopChannel();
      }
    }
  }, {
    key: 'doPlay',
    value: function doPlay() {
      this.objAudioChannelModel.playChannel();
    }
  }]);

  return AudioChannelViewController;
})();

exports['default'] = AudioChannelViewController;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _AudioChannelViewController = require('./AudioChannelViewController');

var _AudioChannelViewController2 = _interopRequireDefault(_AudioChannelViewController);

var _comCodinginspaceAudioAudioMixer = require('./com/codinginspace/audio/AudioMixer');

var _comCodinginspaceAudioAudioMixer2 = _interopRequireDefault(_comCodinginspaceAudioAudioMixer);

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

    var channelOne = new _AudioChannelViewController2['default'](this.objAudioMixerModel, this.objAudioContext, 0, '.audiochannel');
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

exports['default'] = AudioMixerViewController;
module.exports = exports['default'];

},{"./AudioChannelViewController":2,"./com/codinginspace/audio/AudioMixer":7}],4:[function(require,module,exports){
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
    key: 'loadAudioChannelFromXhr',
    value: function loadAudioChannelFromXhr() {
      var _this = this;

      var objAudioInformation = arguments[0] === undefined ? this.objAudioInformation : arguments[0];

      this.objAudioInformation = objAudioInformation;
      this.boolLoading = true;
      /**
       * Download array buffer from file
       * Convert to audio buffer for audio context usage
       */
      console.log('com.codinginspace.audio.AudioChannel', 'Loading XHR ' + this.objAudioInformation.audioFile);
      new _utilsLoader2['default'](this.objAudioInformation.audioFile).then(function (arrBuffer) {
        _this.objAudioContext.decodeAudioData(arrBuffer, function (arrAudioBuffer) {
          _this.boolLoading = false;
          _this.arrAudioBuffer = arrAudioBuffer;
          _this.initAudioSource();
        });
      });
    }
  }, {
    key: 'loadAudioChannelFromFile',
    value: function loadAudioChannelFromFile() {
      var objAudioInformation = arguments[0] === undefined ? this.objAudioInformation : arguments[0];

      this.objAudioInformation = objAudioInformation;
      this.boolLoading = true;
      /**
       * Use reader to create array buffer
       * Should be loaded via File API e.g input[type="file"]
       * Process file into reader for array buffer result
       */
      console.log('com.codinginspace.audio.AudioChannel', 'Loading File ' + this.objAudioInformation.audioFile.name);
      var reader = new FileReader();
      reader.readAsArrayBuffer(this.objAudioInformation.audioFile);
      reader.onload = (function () {
        var _this2 = this;

        this.objAudioContext.decodeAudioData(reader.result, function (arrAudioBuffer) {
          _this2.boolLoading = false;
          _this2.arrAudioBuffer = arrAudioBuffer;
          _this2.initAudioSource();
        });
      }).bind(this);
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
    key: 'isPlaying',
    get: function () {
      return this.boolPlaying;
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
      console.log('com.codinginspace.audio.AudioChannel', 'Pausing audio');
    }
  }, {
    key: 'stopChannel',
    value: function stopChannel() {
      if (this.objAudioSource) {
        this.objAudioSource.stop();
        this.initAudioSource();
        this.boolPlaying = false;
        console.log('com.codinginspace.audio.AudioChannel', 'Stopping audio');
      }
    }
  }]);

  return AudioChannel;
})();

exports['default'] = AudioChannel;
;
module.exports = exports['default'];

},{"../utils/Loader":8,"./AudioFilters":6}],5:[function(require,module,exports){
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

      var strKey = 'value';
      this.objAudio.gain[strKey] = numAmount;
      console.log('com.codinginspace.audio.AudioFilter', 'Setting value of ' + this.strType + ' to ' + numAmount);
    },
    get: function () {
      var strKey = 'value';
      return this.objAudio.gain[strKey];
    }
  }]);

  return AudioFilter;
})();

exports['default'] = AudioFilter;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
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

},{"./AudioFilter":5}],7:[function(require,module,exports){
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

},{"./AudioChannel":4}],8:[function(require,module,exports){
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