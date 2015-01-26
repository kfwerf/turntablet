// Generated by CoffeeScript 1.7.1
(function() {
  var config;

  config = {
    baseUrl: 'js'
  };

  require.config(config);

  requirejs(['modules/AudioMixer', 'modules/AbstractCircleTouch'], function(AudioMixer, AbstractCircleTouch) {
    window.mixer = new AudioMixer();
    window.mixer.setAudioChannel('audio/demo.mp3', 'one');
    window.mixer.setAudioChannel('audio/demo.mp3', 'two');
    return window.touch = new AbstractCircleTouch();
  });

}).call(this);
