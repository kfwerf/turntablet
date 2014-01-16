// Generated by CoffeeScript 1.6.3
define(["require", "jquery", "radio"], function(require, $, radio) {
  var TurntableView;
  return TurntableView = (function() {
    function TurntableView(_controllerTurntable) {
      var _eventPrefix;
      this._controllerTurntable = _controllerTurntable;
      _eventPrefix = this._controllerTurntable._eventPrefix;
      this.elTurntable = $(this._controllerTurntable._turntableClass);
      this.elRpmButtons = this.elTurntable.find("[data-rpm='33'], [data-rpm='45']");
      this.elRpm33 = this.elTurntable.find("[data-rpm='33']");
      this.elRpm45 = this.elTurntable.find("[data-rpm='45']");
      this.elPitchHandle = this.elTurntable.find("[data-pitch]");
      this.elPowerButton = this.elTurntable.find("[data-power]");
      this.elStartStop = this.elTurntable.find("[data-startstop]");
      this.elPlatter = this.elTurntable.find("[data-spinning]");
      this.elPowerButton.on("click", function(e) {
        var boolPowered;
        boolPowered = $(this).attr("data-power") === "true" ? false : true;
        return radio("" + _eventPrefix + ".POWER_CHANGE").broadcast(boolPowered);
      });
      this.elStartStop.on("click", function(e) {
        var boolStarted;
        boolStarted = $(this).attr("data-startstop") === "true" ? false : true;
        return radio("" + _eventPrefix + ".START_CHANGE").broadcast(boolStarted);
      });
      this.elPitchHandle.on("click", function(e) {
        var numPitchRange;
        numPitchRange = ($(this).val() / 100) * $(this).attr("data-pitchrange");
        return radio("" + _eventPrefix + ".PITCH_CHANGE").broadcast(numPitchRange);
      });
    }

    TurntableView.prototype.setPower = function(boolPowered) {
      if (this.elPowerButton.attr("data-power") !== boolPowered) {
        return this.elPowerButton.attr("data-power", boolPowered);
      }
    };

    TurntableView.prototype.setStart = function(boolStarted) {
      if (this.elStartStop.attr("data-startstop") !== boolStarted) {
        return this.elStartStop.attr("data-startstop", boolStarted);
      }
    };

    TurntableView.prototype.setPitch = function(numPitch) {
      var numReversePitchRange;
      console.log(this.elPitchHandle.attr("data-pitch"), numPitch);
      if (this.elPitchHandle.attr("data-pitch") !== numPitch) {
        this.elPitchHandle.attr("data-pitch", numPitch);
        return numReversePitchRange = (numPitch / this.elPitchHandle.attr("data-pitchrange")) * 100;
      }
    };

    TurntableView.prototype.setSpeed = function(numSpeed) {
      var strAnimationCss;
      strAnimationCss = "-webkit-animation: rotating " + numSpeed + "ms linear infinite;-moz-animation: rotating " + numSpeed + "ms linear infinite;-ms-animation: rotating " + numSpeed + "ms linear infinite;-webkit-animation: rotating " + numSpeed + "ms linear infinite;-moz-animation: rotating " + numSpeed + "ms linear infinite;-o-animation: rotating " + numSpeed + "ms linear infinite;animation: rotating " + numSpeed + "ms linear infinite;";
      this.elPlatter.attr("data-spinning", true);
      this.elPlatter.attr("data-rpm", numSpeed);
      return this.elPlatter.attr("style", strAnimationCss);
    };

    return TurntableView;

  })();
});