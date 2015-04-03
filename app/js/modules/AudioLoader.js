// Generated by CoffeeScript 1.7.1
(function() {
  define([], function() {

    /**
    	 * XHR 2 wrapper for arraybuffer audio files. Easily makes two callback functions, success and failure
     */
    var AudioLoader;
    return AudioLoader = (function() {
      function AudioLoader(strAudioFile, audioContext) {
        this.strAudioFile = strAudioFile;
        this.audioContext = audioContext;
        if (!(this.strAudioFile && this.audioContext)) {
          return false;
        }
        this._audioXhr = new XMLHttpRequest();
        this._audioXhr.open("GET", this.strAudioFile, true);
        this._audioXhr.responseType = "arraybuffer";
        this._audioXhr.onload = (function(_this) {
          return function() {
            return _this.audioContext.decodeAudioData(_this._audioXhr.response, _this._setAudioNodeBuffer.bind(_this), _this._failure.bind(_this));
          };
        })(this);
        this._audioXhr.send();
      }

      AudioLoader.prototype._setAudioNodeBuffer = function(arrAudioBuffer) {
        this.arrAudioBuffer = arrAudioBuffer;
        if (typeof this.fnSuccess === 'function') {
          return this.fnSuccess.call(this, arrAudioBuffer, this.audioContext);
        }
      };

      AudioLoader.prototype._failure = function(strError) {
        if (typeof this.fnFailure === 'function') {
          return this.fnFailure.call(this, strError, this.audioContext);
        }
      };


      /**
      		 * The success callback, when the audio loads in with success
      		 * @param  {Function} @fnSuccess
       */

      AudioLoader.prototype.success = function(fnSuccess) {
        this.fnSuccess = fnSuccess;
      };


      /**
      		 * The failure callback, when the audio loads in with failure
      		 * @param  {Function} @fnFailure
       */

      AudioLoader.prototype.failure = function(fnFailure) {
        this.fnFailure = fnFailure;
      };

      return AudioLoader;

    })();
  });

}).call(this);
