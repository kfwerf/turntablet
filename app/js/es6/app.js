'use strict';

import AudioMixerModel from './com/codinginspace/audio/AudioMixer';

/**
 * @author Kenneth van der Werf
 * @class AudioMixerViewChannel
 * @version 0.1
 * @description Bridge between turntable GUI and web audio mixer
 * @dependencies AudioMixerViewController, AudioMixer
 */
class AudioMixerViewChannel {
  /**
   * @param {Object} objAudioMixerModel Audio mixer that connects to web audio
   * @param {Object} objAudioContext Audio context instantiated for web audio
   * @param {Number} numChannel The channel number that we use for the model
   * @param {String} strClass The CSS class that refers to the parent element
   */
  constructor(objAudioMixerModel, objAudioContext, numChannel, strClass) {
    this.objAudioMixerModel = objAudioMixerModel;
    this.objAudioContext = objAudioContext;
    this.numChannel = numChannel;

    this.doGuiElementBinding(strClass);
    this.doGuiEventBinding();
  }
  doGuiElementBinding(strClass) {
    let audioChannel = document.querySelector(strClass);
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
  doGuiEventUnbinding() {
    this.objGui.playButton
      .removeEventListener('click', this.doPlay);
  }
  doGuiEventBinding() {
    this.doGuiEventUnbinding();
    this.objGui.playButton
      .addEventListener('click', this.doPlay.bind(this));
  }
  doPlay() {
    this.objAudioMixerModel
      .getAudioChannelById(this.numChannel)
      .playChannel();
  }
}

/**
 * @author Kenneth van der Werf
 * @class AudioMixerViewController
 * @version 0.1
 * @description Bridge between model and user interface
 * @dependencies AudioMixer
 */
class AudioMixerViewController {
  constructor() {
    this.objAudioMixerModel = new AudioMixerModel();
    this.objAudioContext = new this.audioContext();

    let channelOne = new AudioMixerViewChannel(this.objAudioMixerModel,
                                              this.objAudioContext,
                                              0,
                                              '.audiochannel');
    window.channel = channelOne;
  }
  get audioContext() {
    return window.AudioContext || window.webkitAudioContext;
  }
}

let objAudioMixerViewController = new AudioMixerViewController();
