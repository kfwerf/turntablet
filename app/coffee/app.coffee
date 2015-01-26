
config = 
	baseUrl: 'js'

require.config config

requirejs [ 
	'modules/AudioMixer'
	'modules/AbstractCircleTouch' # Not so abstract for now
], ( AudioMixer, AbstractCircleTouch ) ->
	window.mixer = new AudioMixer()
	window.mixer.setAudioChannel 'audio/demo.mp3', 'one'
	window.mixer.setAudioChannel 'audio/demo.mp3', 'two'

	window.touch = new AbstractCircleTouch()
	