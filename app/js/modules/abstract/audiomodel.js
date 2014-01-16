// Generated by CoffeeScript 1.6.3
define(["jquery", "radio"], function($, radio) {
  var AudioModel;
  return AudioModel = (function() {
    function AudioModel() {
      var _audioContext;
      _audioContext = window.AudioContext || window.webkitAudioContext;
      this._audioCore = new _audioContext();
      this._audioBuffer = null;
      this._boolLoaded = false;
      this.numPitch = 0;
      this.numSpeed = 0;
      this.boolPowered = false;
      this.boolStarted = false;
      this.boolPaused = false;
      this.numLowCut = 0;
      this.numMidCut = 0;
      this.numHighCut = 0;
    }

    AudioModel.prototype.init = function() {
      this._audioFile = "audio/song2.mp3";
      this._audioSrc = this._audioCore.createBufferSource();
      this._audioLowFilter = this._audioCore.createBiquadFilter();
      this._audioMidFilter = this._audioCore.createBiquadFilter();
      this._audioHighFilter = this._audioCore.createBiquadFilter();
      this._audioVolume = this._audioCore.createGainNode();
      radio("" + this._eventPrefix + ".AUDIO_REQUEST").subscribe([this._onAudioRequest, this]);
      radio("" + this._eventPrefix + ".AUDIO_UPDATED").subscribe([this._onAudioUpdated, this]);
      radio("" + this._eventPrefix + ".AUDIO_LOADED").subscribe([this._onAudioLoaded, this]);
      return this.setAudio(this._audioFile);
    };

    AudioModel.prototype._onAudioRequest = function(strAudio) {
      var $this, onComplete, onError;
      $this = this;
      this._audioXhr = new XMLHttpRequest();
      this._audioXhr.open("GET", strAudio, true);
      this._audioXhr.responseType = "arraybuffer";
      onComplete = function(audioBuffer) {
        $this._audioBuffer = audioBuffer;
        $this._setAudioNodeBuffer();
        $this._isLoaded = true;
        return radio("" + $this._eventPrefix + ".AUDIO_LOADED").broadcast();
      };
      onError = function(strError) {
        return console.log("Error processing file: , " + $this._audioFile + ",  -> cause: " + strError);
      };
      this._audioXhr.onload = function() {
        return $this._audioCore.decodeAudioData($this._audioXhr.response, onComplete, onError);
      };
      return this._audioXhr.send();
    };

    AudioModel.prototype._onAudioLoaded = function() {
      if (this.boolStarted) {
        this.playAudio();
      }
      return true;
    };

    AudioModel.prototype._setAudioNodeBuffer = function() {
      if (this._audioCore && this._audioBuffer) {
        this._audioSrc = this._audioCore.createBufferSource();
        this._audioSrc.buffer = this._audioBuffer;
        this._audioVolume = this._audioCore.createGain();
        this._audioLowFilter = this._audioCore.createBiquadFilter();
        this._audioLowFilter.type = 'lowshelf';
        this._audioLowFilter.frequency.value = 500;
        this._audioLowFilter.gain.value = this.numLowCut;
        this._audioMidFilter = this._audioCore.createBiquadFilter();
        this._audioMidFilter.type = 'peaking';
        this._audioMidFilter.frequency.value = 750;
        this._audioMidFilter.gain.value = this.numMidCut;
        this._audioHighFilter = this._audioCore.createBiquadFilter();
        this._audioHighFilter.type = 'highshelf';
        this._audioHighFilter.frequency.value = 1000;
        this._audioHighFilter.gain.value = this.numHighCut;
        console.log(this._audioMidFilter);
        this._audioSrc.connect(this._audioVolume);
        this._audioVolume.connect(this._audioLowFilter);
        this._audioLowFilter.connect(this._audioMidFilter);
        this._audioMidFilter.connect(this._audioHighFilter);
        this._audioHighFilter.connect(this.voiceCancellation.audioProcessor);
        return this.voiceCancellation.audioProcessor.connect(this._audioCore.destination);
      }
    };

    AudioModel.prototype.setAudio = function(strAudio) {
      this._audioFile = strAudio;
      this._isLoaded = false;
      radio("" + this._eventPrefix + ".AUDIO_REQUEST").broadcast(strAudio);
      return true;
    };

    AudioModel.prototype.getAudio = function() {
      return this._audioSrc;
    };

    AudioModel.prototype.getAudioStatus = function() {
      if (this.getAudio().buffer) {
        return true;
      } else {
        return false;
      }
    };

    AudioModel.prototype.playAudio = function(numPlayhead) {
      return this._audioSrc.start(numPlayhead);
    };

    AudioModel.prototype.stopAudio = function(numPlayhead) {
      this._audioSrc.stop(numPlayhead);
      return this._setAudioNodeBuffer();
    };

    AudioModel.prototype.setAudioPitch = function(numPitch) {
      this._audioSrc.playbackRate.value = (100 + Number(numPitch)) / 100;
      return console.log(this._audioSrc.playbackRate.value);
    };

    AudioModel.prototype.setAudioFilter = function() {};

    AudioModel.prototype.setPower = function(boolPowered) {
      if (this.boolPowered !== boolPowered) {
        this.boolPowered = boolPowered;
        this.setSpeed();
        if (!this.boolPowered) {
          this.setStart(false);
        }
        return radio("" + this._eventPrefix + ".POWER_CHANGE").broadcast(boolPowered);
      }
    };

    AudioModel.prototype.getPower = function() {
      return this.boolPowered;
    };

    AudioModel.prototype.setStart = function(boolStarted) {
      boolStarted = boolStarted && !this.boolPowered ? false : boolStarted;
      if (this.boolStarted !== boolStarted) {
        this.boolStarted = boolStarted;
        if (this.boolStarted) {
          this.playAudio();
        } else {
          this.stopAudio();
        }
        return radio("" + this._eventPrefix + ".START_CHANGE").broadcast(boolStarted);
      }
    };

    AudioModel.prototype.getStart = function() {
      return this.boolStarted;
    };

    AudioModel.prototype.setPitch = function(numPitch) {
      if (this.numPitch !== numPitch) {
        this.numPitch = numPitch;
        if (this.numPitch) {
          this.setAudioPitch(this.numPitch);
        }
        this.setSpeed();
        return radio("" + this._eventPrefix + ".PITCH_CHANGE").broadcast(numPitch);
      }
    };

    AudioModel.prototype.getPitch = function() {
      return this.numPitch;
    };

    AudioModel.prototype.setSpeed = function() {
      this.numSpeed = this.boolPowered ? ((Number(this.numRpm) / 60) / 100) * (100 + Number(this.numPitch)) * 1000 : void 0;
      return radio("" + this._eventPrefix + ".SPEED_CHANGE").broadcast(this.numSpeed);
    };

    AudioModel.prototype.setLowCut = function(numLowCut) {
      this.numLowCut = numLowCut;
      return this._audioLowFilter.gain.value = this.numLowCut;
    };

    AudioModel.prototype.setMidCut = function(numMidCut) {
      this.numMidCut = numMidCut;
      return this._audioMidFilter.gain.value = this.numMidCut;
    };

    AudioModel.prototype.setHighCut = function(numHighCut) {
      this.numHighCut = numHighCut;
      return this._audioMidFilter.gain.value = this.numHighCut;
    };

    return AudioModel;

  })();
});
