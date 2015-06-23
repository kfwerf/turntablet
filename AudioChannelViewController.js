/**
 * @author Kenneth van der Werf
 * @class AudioChannelViewController
 * @version 0.1
 * @description Bridge between turntable GUI and web audio mixer
 * @dependencies AudioMixerViewController, AudioMixer
 */
export default class AudioChannelViewController {
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
  get objAudioChannelModel() {
    return this.objAudioMixerModel
      .getAudioChannelById(this.numChannel);
  }
  doGuiElementBinding(strClass) {
    let audioChannel = document.querySelector(strClass);
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
  doGuiEventUnbinding() {
    this.objGui.playButton
      .removeEventListener('click', this.doPlay);
  }
  doGuiEventBinding() {
    let doBasicValueCoupling = (strWatchGui, strBindValue) => {
      let objWatch = this.objGui[strWatchGui];
      Object.observe(objWatch, () => {
        let numValue = objWatch.value;
        this.objAudioChannelModel[strBindValue] = numValue;
      });
    };
    this.doGuiEventUnbinding();
    // Couples file selection with core for loading via observing
    Object.observe(this.objGui.songLabel, () => {
      let objFile = this.objGui.songLabel.file;
      if (objFile.name) {
        this.doLoadAudioFromFile({
          audioFile: objFile
        });
      }
    });

    doBasicValueCoupling('volumeSlider', 'volumeValue');
    doBasicValueCoupling('lowSlider', 'lowValue');
    doBasicValueCoupling('midSlider', 'midValue');
    doBasicValueCoupling('highSlider', 'highValue');
    doBasicValueCoupling('pitchSlider', 'pitchValue');

    this.objGui.playButton
      .addEventListener('click', this.doPlay.bind(this));
  }
  doLoadAudioFromFile(objFile) {
    this.objAudioChannelModel.loadAudioChannelFromFile(objFile);
  }
  doPlay() {
    this.objAudioChannelModel.playChannel();
  }
}
