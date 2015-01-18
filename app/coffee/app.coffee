
config = 
	baseUrl: 'js'

require.config config

requirejs [ 'modules/AudioMixer' ], ( AudioMixer ) ->
	window.mixer = new AudioMixer()
	window.mixer.setAudioChannel 'audio/demo.mp3', 'one'
	window.mixer.setAudioChannel 'audio/demo.mp3', 'two'