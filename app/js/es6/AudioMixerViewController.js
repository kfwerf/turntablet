import AudioChannelViewController from './AudioChannelViewController';
import AudioMixerModel from './com/codinginspace/audio/AudioMixer';

/**
 * @author Kenneth van der Werf
 * @class AudioMixerViewController
 * @version 0.1
 * @description Bridge between model and user interface
 * @dependencies AudioMixer
 */
export default class AudioMixerViewController {
  constructor() {
    this.objAudioMixerModel = new AudioMixerModel();
    this.objAudioContext = new this.audioContext();

    let channelOne = new AudioChannelViewController(this.objAudioMixerModel,
                                                    this.objAudioContext,
                                                    0,
                                                    '.audiochannel');
    window.channel = channelOne;
  }
  get audioContext() {
    return window.AudioContext || window.webkitAudioContext;
  }
}
